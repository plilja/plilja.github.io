---
layout: post
title: Stateful classes in Spring
---

I have been working with Spring at work for a couple of years now. 
One thing that has struck me regarding Spring is that it really discourages
from having business logic on stateful classes. 

This is because any business logic will probably reside on a Spring bean, 
and Spring beans are most often Singletons. Even if you do tell Spring to
scope your bean to a request, it will still be difficult to 
have data on it since Spring's DI mechanism doesn't know your data. 

Instead you typically end up putting your logic in some kind of 
Service-class that acts upon the data coming as a method parameter.
I.e. you will end up with imperative code. 

Personally I kind of like imperative programming so I'm not saying this
is necessarily bad. But it does puzzle me a bit, Spring is a really 
popular Java framework and Java is a language that strongly 
encourages object oriented programming.

Therefore I'm going to try writing some stateful Spring classes containing
business logic. I'm going to use a shopping cart for an online store
as an example. Of course this example is going to be simple enough
that the right solution would be to put everything in the
controller. But let's imagine that the logic was a bit more convuluted,
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

#### (more) Object oriented solution

My thoughts on how to write this in a more object oriented way would be something like the code snippets 
below. I'm still not sure how I feel about this. 

I think that for a simple project like this the "Spring way" would definitaly be preferable. I you're doing 
microservices you might never pass the threshold for when this becomes preferable. We need to work against 
the framework a bit:
* We need to manually instantiate Carts, as the list of dependencies grows, I can see this becoming annoying.
* We need to tell Jackson how to serialize the object, if we were to deserialize carts we would need even more work.
* The Swagger API generator can't automatically determine what a Cart should look like.

For a larger project I can see the winnings being larger. You typically wouldn't want to pass
around "cartId"'s everywhere. You don't want to pass around CartEntities either. But in a large 
project for a shopping site, the cart object is probably going to be a central concept.

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

###### Factory (we can no longer let Spring instantiate the class containing the logic)
```java
@RequiredArgsConstructor
@Component
public class CartFactory {
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    Cart getCart(String cartId) {
        var cartEntity = getCartEntity(cartId);
        return new Cart(cartEntity, cartRepository, productRepository);
    }

    Cart newCart() {
        var cartEntity = new CartEntity();
        return new Cart(cartEntity, cartRepository, productRepository);
    }

    private CartEntity getCartEntity(String cartId) {
        return cartRepository.findById(cartId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Cart with id %s not found", cartId)));
    }
}
``` 

###### Logic class
```java
@RequiredArgsConstructor
public class Cart {
    private final CartEntity cartEntity;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    void save() {
        var saved = cartRepository.save(cartEntity);
        if (cartEntity.getCartId() == null) {
            cartEntity.setCartId(saved.getCartId());
        }
    }

    void addItemToCart(String productId) {
        cartEntity.getContents().stream()
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
                            cartEntity.getContents().add(cartContent);
                        }
                );
        save();
    }

    void removeItemFromCart(String productId) {
        var cartContents = cartEntity.getContents().stream()
                .filter(content -> content.getProductEntity().getProductId().equalsIgnoreCase(productId))
                .findFirst()
                .orElseThrow(() -> {
                    return new ResponseStatusException(HttpStatus.NOT_FOUND, String.format("Product with id %s not present in cart with id %s", productId, cartEntity.getCartId()));
                });
        cartContents.setQuantity(cartContents.getQuantity() - 1);
        if (cartContents.getQuantity() == 0) {
            cartEntity.getContents().remove(cartContents);
        }
        save();
    }

    /**
     * Use the entity when serializing to JSON.
     */
    @JsonValue
    CartEntity jsonValue() {
        return cartEntity;
    }
}
``` 

Full source code can be found here:

https://github.com/plilja/stateful-spring
