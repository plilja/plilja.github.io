---
layout: post
title: Spring Aspects Ordering
tags: [spring, java]
---

A lot of features of Spring framework rely on aspects to add solutions to cross-cutting
concerns. These aspects are usually enabled through annotations. This gives a nice
declarative way of handling cross-cutting concerns without impacting your actual code.

A problem with this, however, arises when you need multiple aspects on the same method,
since annotations don't have any order. Consider this example below. We only want
the `Timed` annotation to apply when we get a cache miss. 

```java
@Service
public class SomeRemoteClient {
    @Cacheable("nameOfCache")
    @Timed("timers")
    public String remoteCall() {
        // do some expensive work ...
        return "Hello World!";
    }
}
```

As per [the documentation](https://docs.spring.io/spring-framework/docs/3.2.x/spring-framework-reference/html/aop.html#aop-ataspectj-advice-ordering),
the only way to control the invocation order of the aspects is to either have the annotation implement `Ordered` or the aspect implement `Ordered`.
However, since both the `Timed` and `Cacheable` annotations and their corresponding aspects are coming from libraries, you cannot have them implement `Ordered`.

There are a few solutions to this, unfortunately all of them are quite "hacky".

## Solution 1 - Split your classes

Split your method call into separate classes and let the call chain define
the order. It needs to be different classes as Spring will only proxy calls in between
bean methods, but not method calls within the same bean.

This has the drawback of being verbose, and it gives you very convoluted class
names. If you need more aspects than two, it becomes even more annoying. I believe
this is the least hacky solution. It is however the most verbose one.

```java
@Service
public class SomeRemoteClient {
    private final TimedRemoteClient timedRemoteClient;

    public SomeRemoteClient(TimedRemoteClient timedRemoteClient) {
        this.timedRemoteClient = timedRemoteClient;
    }

    @Cacheable("nameOfCache")
    public String remoteCall() {
        return timedRemoteClient.remoteCall();
    }
}

@Service
class TimedRemoteClient {
    @Timed("timers")
    String remoteCall() {
        // do some expensive work ...
        return "Hello World!";
    }
}
```

## Solution 2 - Autowire a "self-reference" and split your method

This solution is a "hack" solution to make "solution 1" work with method
calls within the same class. By autowireing a "self reference" you can perform
bean method calls within the same class and Spring will correctly proxy those
calls. 

It is slightly less verbose than "solution 1" but instead slightly more "hacky".

```java
@Service
public class RemoteClient {
    @Lazy
    @Autowired
    private RemoteClient selfReference;

    @Cacheable("nameOfCache")
    public long remoteCall() {
        return selfReference.timedRemoteCall();
    }

    // Note that this method cannot be private as the
    // Timed aspect doesn't pick up private methods
    @Timed("timers")
    long timedRemoteCall() {
        // do some expensive work ...
        return "Hello World!";
    }
}
```

## Solution 3 - Write code instead of using annotations

Some of the solutions to cross-cutting concerns are supposed to be
triggered from annotations. Others also have a way of triggering 
from regular code. For example, `@Transactional` has `TransactionTemplate`
and `@Retryable` has `RetryTemplate`.

For the ones that don't have ready-made code solutions, you can write your
own little adapter to trigger them from code. For example, `@Timed` doesn't
have a corresponding code solution that does the same thing. But it's pretty
easy to write one yourself.

```java
@Service
public class TimerTemplate {
    private final MeterRegistry meterRegistry;

    public TimerTemplate(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
    }

    public <T> T withTimer(String className, 
                           String methodName, 
                           Supplier<T> operation) {
        Tags  tags = Tags.of("class", className, "method", methodName);
        Timer timer = meterRegistry.timer("timers", tags);
        return timer.record(operation);
    }
}

@Service
public class RemoteClient {
    private final TimerTemplate timerTemplate;

    public RemoteClient(TimerTemplate timerTemplate) {
        this.timerTemplate = timerTemplate;
    }

    // Please note you can still have one aspect triggered
    // by annotation, this will be the outermost aspect
    @Cacheable("nameOfCache") 
    public long remoteCall() {
        return timerTemplate.withTimer(getClass().getName(), "remoteCall", () -> {
            // do some expensive work ...
            return "Hello World!";
        });
    }
}
```
