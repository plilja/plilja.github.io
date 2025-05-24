---
layout: post
title: Spring Modulith and Breaking Dependency Cycles
tags: [architecture, spring]
---

I attended a workshop on modular monoliths using Spring Modulith, during Spring I/O. 
Some of the information in this post will reflect my notes from the workshop. You can
find a shortened version of the workshop in this talk 
[The Modular Monolith - a Practical Alternative to Microservices](https://www.youtube.com/watch?v=nuHMlA3iLjY).

Spring Modulith is a new library with its first stable release in June 2023. So far 
it gives you very few features that you cannot do yourself:

* It verifies that there are no dependency cycles between modules.
* It lets you specify which dependencies between modules are allowed.
* It gives you an implementation of the outbox pattern (you need a database for this).
* It lets you generate documentation including a graph showing module dependencies.

Verifying cycles and enforcing dependencies can be done using [ArchUnit](/enforcing-an-architecture), which 
is actually what Spring Modulith does. Of course, if your application is already 
modularized into maven modules, then you get cycle and dependency validation for free.

Most projects start off as unorganized monolith (aka *big ball of mud*), and I think 
this is the correct approach. Before you have learned your domain and before 
you even know if your project will be successful, just do the simplest thing. 

If you decide to modularize your monolith, then deciding on what modules your 
domain consists of is key. The next key is deciding on which module should 
be allowed to depend on which module. 

Once you have decided on a module structure the hard part is to transform 
your existing code to confirm with the structure. Moving classes into 
packages that correspond to modules is easy in IntelliJ. But once you 
have moved every class into the module you think fits best, you 
will find that the dependencies between modules are not what you expect. 

Let's say you are maintaining a system that sells books and you have this
problematic cycle.

![Problem dependecy](/images/modularize/problem_dependency.svg "Problem dependency")

Here are six strategies for dealing with this dependency. Which one is correct
will depend on the situation.

![Move to common](/images/modularize/move_to_common.svg "Move to common")

Most often you would move the code from the module that is least central
to your application. Because you want your peripheral modules to depend
on your core modules and not the other way around. In our example, `books`
is more central than `payment` in a bookstore. So we move the code from `payment`
that is used from `books` to `shared`.

![Invert on side of the dependency](/images/modularize/invert_dependency.svg "Invert dependency")

In our example, we would put an interface in the `books` module and have
an implementation of that interface in the `payment` module. Then we would inject
that dependency, usually using a dependency injection framework into `books` at runtime.
Note that `books` still calls `payment`, but it doesn't know that it's calling `payment`.

![Use events](/images/modularize/events.svg "Use events")

We can let an eventbus route events between the two modules, without
the modules knowing who the consumers of those events are. If we put 
the definitions of the events in `books` and `payment` respectively
then we still have the dependency cycle. Therefore, we need to extract
a common module that contains the event definitions. One limitation
of using events is that you cannot get data back from the event processing. 
Publishing an event is a `void` operation.

![Extract API-modules](/images/modularize/api_modules.svg "API modules")

Extract the part of each module that is supposed to be used by other
modules into a separate API module. Note that you should only extract
interfaces, you mustn't extract concrete implementations. 
Otherwise, you will probably end up with cycles between your API module
and the implementation module. You can use dependency injection to get
a concrete implementation of the class from the API module.

![Merge modules](/images/modularize/merge_modules.svg "Merge modules")

This usually wouldn't be your first choice. In cases when there are a lot
of strong dependencies between the two modules, it might indicate that they should
be the same module.

![Extract orchestrator](/images/modularize/extract_orchestrator.svg "Extract orchestrator")

Create a separate module that pulls up the dependencies into a joint
functionality. If you can find a good name for that orchestrator this might make
sense. In our example with `books` and `payment` we might imagine that the dependency 
problem is part of the checkout flow. `checkout` seems like it might be a good module,
whereas `books-payment-orchestrator` from my graph doesn't seem like a good module.

Also, see my previous post about [Modularizing a Java Application](/modularizing-a-java-application).
These concepts are not new, and you do not need a monolith to benefit from them. However, the benefits
grow when the applicaiton is larger.
