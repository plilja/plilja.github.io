---
layout: post
title: Monitoring slow calls
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

<script src="https://gist.github.com/plilja/2e616d9f909bd30269693c542be83dd4.js"></script>

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
