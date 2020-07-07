---
layout: post
title: Loading caches in Spring
tags: [spring, java, caching]
---

Loading caches was coined by [Guava](https://github.com/google/guava). They are also
implemented in the popular caching library, [Caffeine](https://github.com/ben-manes/caffeine). 

The difference between a regular cache and a loading
cache is that a loading cache has a cache loader
function attached to it which knows how to load values.
After that, you can query the cache just like if it
was a regular function and not care about if the
value is present in the cache or not.

A loading cache can also refresh cache entries in
a background thread without impacting the performance
of the caller. This is an attractive feature.

If you've used the caching functionality of Spring you've
probably used the @Cacheable annotation. Unfortunately,
the cacheable annotation doesn't play nicely with loading caches.
Loading caches (in Caffeine at least) require a loading function
to be provided when the cache is instantiated. In Spring
that will usually by in a @Configuration-class. Whereas the
loading function is defined by the @Cacheable annotation.

I've written [a small library](https://github.com/plilja/spring-loading-caffeine) to bridge this gap.
It works by using [AOP](https://en.wikipedia.org/wiki/Aspect-oriented_programming) to intercept calls to @Cacheable-methods
and create the loading cache with its loading function as
a reflection handle to the intercepted call.

The core of the library works like this (simplified):

```java
@Order(Ordered.HIGHEST_PRECEDENCE)
@Aspect
class LoadingCacheableAspect {
    /**
      * Loading cache manager builds caches lazily and connects them
      * loading functions.
      */
    private final LoadingCacheManager loadingCacheManager;
    private final Map<Method, Boolean> handledCaches = new ConcurrentHashMap<>();

    LoadingCacheableAspect(LoadingCacheManager loadingCacheManager) {
        this.loadingCacheManager = loadingCacheManager;
    }

    @Around("@annotation(org.springframework.cache.annotation.Cacheable)")
    public Object loadedCached(ProceedingJoinPoint joinPoint) throws Throwable {
        MethodSignature methodSignature = (MethodSignature) joinPoint.getSignature();
        Method method = methodSignature.getMethod();
        handledCaches.computeIfAbsent(method, (_ignored) -> {
            // Register the loading function if it's not already been done
            loadingCacheManager.registerLoadingFunction(method, key -> {
                try {
                    CacheKey cacheKey = (CacheKey) key; // Need to have a specific cache key type
                    return method.invoke(cacheKey.getTarget(), cacheKey.getArgs());
                } catch (Throwable throwable) {
                    throw new RuntimeException("Caught exception while calling method", throwable);
                }
            });
            return true;
        });
        return joinPoint.proceed();
    }
}
```

To use the library you need to import its configuration (LoadingCacheConfiguration)
and at each place you use the cache, you must also specify a key generator. 

```java
@SpringBootApplication
@Import(LoadingCacheConfiguration.class)
public class LoadingCacheApplication {

	public static void main(String[] args) {
		SpringApplication.run(LoadingCacheApplication.class, args);
	}

    @Cacheable(value = "hello", keyGenerator = "loadingCacheKeyGenerator")
    public String hello(String name) {
        // here would be some expensive computation that would explain the need for caching
        return String.format("Hello %s", name);
    }

    @CacheEvict(value = "hello", keyGenerator = "loadingCacheKeyGenerator")
    public void evict(String name) {
    }
}
```
You must also specify in your configuration that you want a loading cache. Otherwise
you will get the default Caffeine cache which isn't a loading one.
```
# application.properties
caffeine.caches.hello=maximumSize=1000,refreshAfterWrite=5m,expireAfterWrite=60m,recordStats
```

See [this project](https://github.com/plilja/spring-loading-caffeine-example) for an example project.
