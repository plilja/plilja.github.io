---
layout: post
title: Monitoring Slow Calls
tags: [monitoring, crosscut]
---

It's not uncommon for problems to only happen in production.
Being able to introspect your application can be a key
factor in determining what caused an issue. 

Using Aspect-oriented programming you can create a
filter that monitors all your services with just a few lines
of code.

This example uses Java and Spring. But the principle should
be applicable in any language that has AOP support.

```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
public @interface Monitored {
}
```

```java
@Component
@Aspect
public class MonitorSlowCalls {
    private static final Logger LOG = LoggerFactory.getLogger(MonitorSlowCalls.class);

    private final MeterRegistry meterRegistry;
    private final long slowCallsLogThreshold;

    public MonitorSlowCalls(MeterRegistry meterRegistry, @Value("${slow-calls-log-threshold:500}") int slowCallsLogThreshold) {
        this.meterRegistry = meterRegistry;
        this.slowCallsLogThreshold = slowCallsLogThreshold;
    }

    @Pointcut("within(@se.plilja.Monitored *)")
    public void monitored() {
    }

    @Pointcut("execution(!private * *(..))")
    public void publicProtectedOrPackagePrivate() {
    }

    @Around("publicProtectedOrPackagePrivate() && monitored()")
    public Object monitorSlowCalls(ProceedingJoinPoint pjp) throws Throwable {
        long startTime = System.currentTimeMillis();
        try {
            Timer timer = meterRegistry.timer("method.timer", List.of(Tag.of("method", pjp.getSignature().getName())));
            Object result = timer.recordCallable(() -> proceed(pjp));
            long endTime = System.currentTimeMillis();
            logIfSlow(endTime - startTime, pjp);
            return result;
        } catch (Throwable throwable) {
            long endTime = System.currentTimeMillis();
            logIfSlow(endTime - startTime, pjp);
            throw throwable;
        }
    }

    // Don't want to catch the Throwable which the compiler will force us to to without this annotation
    @SneakyThrows
    private Object proceed(ProceedingJoinPoint pjp) {
        return pjp.proceed();
    }

    private void logIfSlow(long duration, ProceedingJoinPoint pjp) {
        String className = pjp.getTarget().getClass().getSimpleName();
        String methodName = pjp.getSignature().getName();
        if (duration >= slowCallsLogThreshold) {
            LOG.info("Call took [duration={}] [class={}] [method={}]", duration, className, methodName);
        } else {
            LOG.debug("Call took [duration={}] [class={}] [method={}]", duration, className, methodName);
        }
    }
}
```

Any classes annotated as @Monitored will be monitored for slow
calls. You will also get metrics to monitor trends of your 
services.

The usual solution I've seen to monitoring method slowness only
includes the timer part of the above aspect, but not the logging part. 
This is also what you will get if you use the @Timed-annotation in Spring. 
In my experience timer metrics is great for plotting graphs and
investigating trends. But if you are drilling down into
one particular issue, I think that logs are more useful.

For example say that you are investigating why a call took 1s, that normally 
takes 10ms. With the above aspect enabled, you might see something like this
in your logs:

```
2020-09-19 13:45 INFO [traceId=34f73e14f7f5155c] s.p.MonitorSlowCalls : Call took [duration=892] [class=RemoteServiceClient] [method=slowCall]
2020-09-19 13:45 INFO [traceId=34f73e14f7f5155c] s.p.RequestLogFilter : Outgoing Response [status=200] [duration=900]
```

From this log output, it's quite easy to find that the cause for the
request being slow was the call to the method 'slowCall'.

You will probably want to combine this with a solution for distributed
tracing (like Spring Cloud Sleuth for example), more on that in another
post.
