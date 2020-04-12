---
layout: post
title: Stateful classes in Spring
---

I have been working with Spring at work for a couple of years now. 
One thing that has struck me regarding Spring is that it discourages
from having business logic on stateful classes. 

This is because any business logic will probably reside on a Spring bean, 
and Spring beans are most often Singletons. 

Instead, you typically end up putting your logic in some kind of 
Service-class that acts upon the data coming as a method parameter.
I.e. you will end up with imperative code. 

Personally I kind of like imperative programming so I'm not saying this
is necessarily bad. But it does puzzle me a bit, Spring is a very 
popular Java framework and Java is a language that strongly 
encourages object-oriented programming.

Therefore I'm going to try writing some stateful Spring classes containing
business logic. I'm going to use a shopping cart for an online store
as an example. Of course, this example is going to be simple enough
that the right solution would be to put everything in the
controller. But let's imagine that the logic was a bit more convoluted,
as it probably would have been in a real case.

##### Spring style solution

Writing this in classic Spring fashion might look something like this.

###### Controller
```java
@RequiredArgsConstructor
@RequestMapping("/carts")
@RestController
class CartControllerV1 {
    private final CartService cartService;

    @GetMapping("/{cartId}")
    CartEntity getCart(@PathVariable("cartId") String cartId) {
        return cartService.getCart(cartId);
    }

    @PostMapping
    CartEntity createCart() {
        return cartService.createCart();
    }

    @PostMapping("/{cartId}/add")
    void addItemToCart(@PathVariable("cartId") String cartId, @RequestParam("productId") String productId) {
        cartService.addItemToCart(cartId, productId);
    }

    @DeleteMapping("/{cartId}/remove")
    void removeItemFromCart(@PathVariable("cartId") String cartId, @RequestParam("productId") String productId) {
        cartService.removeItemFromCart(cartId, productId);
    }
}
``` 

###### Service
```java
@RequiredArgsConstructor
@Service
class CartService {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    CartEntity getCart(String cartId) {
        return cartRepository.findById(cartId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Cart with id %s not found", cartId)));
    }

    CartEntity createCart() {
        var newCart = new CartEntity();
        return cartRepository.save(newCart);
    }

    void addItemToCart(String cartId, String productId) {
        var cart = getCart(cartId);
        cart.getContents().stream()
                .filter(content -> content.getProductEntity().getProductId().equalsIgnoreCase(productId))
                .findFirst()
                .ifPresentOrElse(
                        existing -> existing.setQuantity(existing.getQuantity() + 1),
                        () -> {
                            var product = productRepository.findById(productId)
                                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Product with id %s not found", productId)));
                            var cartContent = CartContent.builder()
                                    .productEntity(product)
                                    .quantity(1)
                                    .build();
                            cart.getContents().add(cartContent);
                        }
                );
        cartRepository.save(cart);
    }

    void removeItemFromCart(String cartId, String productId) {
        var cart = getCart(cartId);
        var cartContents = cart.getContents().stream()
                .filter(content -> content.getProductEntity().getProductId().equalsIgnoreCase(productId))
                .findFirst()
                .orElseThrow(() -> {
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Product with id %s not present in cart with id %s", productId, cartId));
                });
        cartContents.setQuantity(cartContents.getQuantity() - 1);
        if (cartContents.getQuantity() == 0) {
            cart.getContents().remove(cartContents);
        }
        cartRepository.save(cart);
    }
}
``` 

#### Object-oriented solution (more object-oriented atleast) 

My thoughts on how to write this in a more object-oriented way would be something like the code snippets 
below. By annotating the Cart class as @Scope("provided"), Spring will create a new instance for
it whenever requested. The method annotated with @Lookup will be used to create that instance. 
It does feels a little scary having state on classes managed by Spring. 

In this simple example the previous solution is probably preferable. In fact we could have skipped the
service and put everything in the controller. 

For a larger project, I can see the winnings  with the object oriented approach being larger. 
You typically wouldn't want to pass around "cartId"'s everywhere. You don't want to pass 
around CartEntities either. But in a large project for a shopping site, the cart object 
is probably going to be a central concept.

##### Controller
```java
@RequiredArgsConstructor
@RequestMapping("/v2/carts")
@RestController
class CartControllerV2 {
    private final CartFactory cartFactory;

    @GetMapping("/{cartId}")
    Cart getCart(@PathVariable("cartId") String cartId) {
        return cartFactory.getCart(cartId);
    }

    @PostMapping
    Cart createCart() {
        var cart = cartFactory.newCart();
        cart.save();
        return cart;
    }

    @PostMapping("/{cartId}/add")
    void addItemToCart(@PathVariable("cartId") String cartId, @RequestParam("productId") String productId) {
        var cart = cartFactory.getCart(cartId);
        cart.addItemToCart(productId);
    }

    @DeleteMapping("/{cartId}/remove")
    void removeItemFromCart(@PathVariable("cartId") String cartId, @RequestParam("productId") String productId) {
        var cart = cartFactory.getCart(cartId);
        cart.removeItemFromCart(productId);
    }
}
``` 

###### Factory (we need to help Spring with instantiating Carts)
```java
@Component
public abstract class CartFactory {
    @Lookup
    abstract Cart getCart(String cartId);

    Cart newCart() {
        return getCart(null);
    }
}
``` 

###### Logic class
```java
@Component
@Scope("prototype")
public class Cart {
    private String cartId;
    private final MemoizedSupplier<CartEntity> cartEntity = new MemoizedSupplier<>(this::getCartEntity);
    @Autowired
    private CartRepository cartRepository;
    @Autowired
    private ProductRepository productRepository;

    public Cart(String cartId) {
        this.cartId = cartId;
    }

    void save() {
        var saved = cartRepository.save(cartEntity.get());
        if (cartId == null) {
            cartId = saved.getCartId();
            cartEntity.get().setCartId(saved.getCartId());
        }
    }

    private CartEntity getCartEntity() {
        if (cartId != null) {
            return cartRepository.findById(cartId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        } else {
            return new CartEntity();
        }
    }

    void addItemToCart(String productId) {
        cartEntity.get().getContents().stream()
                .filter(content -> content.getProductEntity().getProductId().equalsIgnoreCase(productId))
                .findFirst()
                .ifPresentOrElse(
                        existing -> existing.setQuantity(existing.getQuantity() + 1),
                        () -> {
                            var product = productRepository.findById(productId)
                                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Product with id %s not found", productId)));
                            var cartContent = CartContent.builder()
                                    .productEntity(product)
                                    .quantity(1)
                                    .build();
                            cartEntity.get().getContents().add(cartContent);
                        }
                );
        save();
    }

    void removeItemFromCart(String productId) {
        var cartContents = cartEntity.get().getContents().stream()
                .filter(content -> content.getProductEntity().getProductId().equalsIgnoreCase(productId))
                .findFirst()
                .orElseThrow(() -> {
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Product with id %s not present in cart with id %s", productId, cartId));
                });
        cartContents.setQuantity(cartContents.getQuantity() - 1);
        if (cartContents.getQuantity() == 0) {
            cartEntity.get().getContents().remove(cartContents);
        }
        save();
    }

    /**
     * Use the entity when serializing to JSON.
     */
    @JsonValue
    CartEntity jsonValue() {
        return cartEntity.get();
    }
}
``` 

Full source code can be found [here](https://github.com/plilja/stateful-spring).
