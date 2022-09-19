---
layout: post
title: Modularizing a Java Application
tags: [architecture, java]
---

Microservice architectures have been in fashion for several years
now in the Java community. There are a few ways to achieve modularization
without incurring the full cost of a microservice architecture. 

The way I see it, the level of modularization goes from least modularized
to most modularized:

1. Monolith - no modularization. A.k.a "big ball of mud"
2. Monolith - modularization by package
3. Monolith - modularization by Maven/Gradle module
4. Microservices - each module has an entirely different VM separated by the network

Typically for early-stage projects, many people will naturally
go for solution 1 or 2 from that list. Those solutions will probably allow them to
move faster initially. Why bother with modularization before
you know if the project will be successful?

As projects mature and companies grow, solution 1 will probably
start becoming painful. Especially if key people, who have been around since the start,
quit the project. Solution 2 requires a lot of discipline 
to work and might also become painful.

A lot has already been said about solution 4, so I will not say
more about it here. Instead, I will focus on solution 3 and provide 
one suggestion on how that can be implemented.

Ideally, we would want the modules to represent business concepts rather
than technical concerns (i.e. payment/customer over database/controllers).
That way, if several teams work on the project, they will not be touching
the same modules.

I suggest an overall architecture as per the following diagram. 

![Modularized Java Project diagram](/images/modular.svg "Modularized Java Project diagram")

For this example, I am using a very simple application for a video store. 
It has three business areas, film, customer, and payment. Please
note that there are no dependency arrows between the modules containing 
business logic. They must go through the API module or publish/listen on the Event Bus to
talk to each other. So the overall diagram would look the same if we had 20 business
modules (although more cluttered).

As for the database, you have a few options. You can use the
same database and schema for all your modules. You can also use the same database
but give each module a separate schema. If you want to prepare for a microservice
deployment, you can of course, also use completely different databases, although I
would probably avoid that.

Extracting a microservice from this monolith should be reasonably straightforward. 
Replace your API classes in the API module with REST clients to your new
microservice. The code from the Common module could be a library dependency in the new
microservice, so a complete rewrite would not be needed. 

It would however, become tricky to extract a microservice if you are using
database transactions that span across multiple modules.

Here is an example project that implements the above suggestion:

* [https://github.com/plilja/modularjava](https://github.com/plilja/modularjava)

Please note that it doesn't contain any actual business logic. The purpose wasn't to implement a video
store but to showcase the project structure. This example uses
Spring framework. If you aren't using a dependency injection framework, you could still
bootstrap the API packages with, for example, a [Service Locator](https://en.wikipedia.org/wiki/Service_locator_pattern).
