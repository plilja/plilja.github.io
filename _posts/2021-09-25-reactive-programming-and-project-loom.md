---
layout: post
title: Reactive Programming and Project Loom
tags: [java, spring]
---

Reactive Programming has been a trend in the Java space
in the last few years. It promises more efficient utilization
of the CPU. It does this by not running blocking (typically slow)
operations in a CPU thread. To do this, you have to write
your code in a certain way, typically with continuations instead
of a classic imperative style. See for example
[Spring Reactive](https://spring.io/reactive).

To make things confusing in the frontend space "Reactive Programming"
means decoupling your state from updating your UI. I.e leaving it
up to some framework to update your UI whenever the state changes
(see [Wikipedia on Reactive Programming](https://en.wikipedia.org/wiki/Reactive_programming). This is however not what this post is about.

Reactive Programming in the way it is typically defined in the
Java space I would say is harder to implement than the more common
imperative style. Imperative Programming has a bad reputation, but
despite not being trendy, I think it's the most natural
programming style. Imperative Programming is also the easiest to debug.

Reactive Programming as it is done in Spring will infect all of your
code base. Instead of your classes returning `SomeType` or `List<SomeType>`
they will return `Mono<SomeType>` or `Flux<SomeType>`. This is my biggest
argument against Spring Reactive. 

I think that Reactive Programming is a trend that will go away. Most
programs will not need the extra efficiency. I think [Project Loom](https://openjdk.java.net/projects/loom/) will remove any need for it, since it should
essentially provide all of the benefits but none of the drawbacks.
I think that it's also worth considering if the added complexity of
using a reactive paradigm is really worth it. Does your application really need
the extra efficiency?

