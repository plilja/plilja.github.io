---
layout: post
title: Package Structure
tags: [java, architecture]
---

I think that many Java programmers don't spend enough time thinking about 
their package structure. I also think that most Java programmers get their 
package structure wrong by instinct. They tend the follow a "package by layer" 
principle, I.e they bundle classes together based on some common technical 
principle. Maybe all the `Repository` classes go in one package and all the 
`Controller` classes go in another package. 

Personally, I strongly prefer a "package by feature" approach. This means 
that instead, you try to package classes together based on which feature 
they belong to. So a `Controller` and a `Repository` would go into the same 
package if they both belong to the same feature, say maybe the 
"deposit feature" for example.

Programmers who prefer to package "by layer" should believe that layer, 
or technical concept, is a stronger grouping key than business features. 
An alternative explanation might be that the "package by layer" is chosen 
because at the start of a project when the skeleton structure is created, 
there aren't usually many features available. 

As for the argument why to choose "package by feature" there are a few 
key arguments for me. The strongest is probably that it's more common 
to want to see all classes involved in a particular feature rather than, 
for example, all `Controller` classes. Another argument would be that if 
a class grows too large when doing "package by layer" then you have 
to break it out into a separate package. In the "package by feature" 
approach you can just break it down to sibling classes residing in the 
same package.

When doing "package by feature" you will inevitably end up with classes 
that are shared between features but aren't specific to any business 
feature. These classes will typically end up in packages with names 
such as "errorhandling", "persistence", "common", "util". In my experience, 
the packages with very generic names like common or util tend to get bloated 
over time.

Here are some rules to try and follow. As usual, when it comes to 
rules in programming I believe they shouldn't be followed rigorously:

* Avoid package cycles.
* Avoid overly generic package names like util or common (although 
typically you might need one if you can't find a better name).
* Your specific packages should have dependencies on your common packages. Not the other way around. 
* If one class is only used from one other package. Consider moving it to that package.
* It's ok to depend on packages higher up in the same package tree but not lower down. 
I.e a class in `com.foo.bar` can depend on a class in `com.foo` but a class in `com.foo` should not depend on a class in `com.foo.bar`.

Avoiding introducing package cycles can be hard in practice. You can use IntelliJ to find
them using the "Analyze Cyclic Dependencies" feature. The following image shows
that feature being used on the project [Spring Cloud Sleuth](https://spring.io/projects/spring-cloud-sleuth). There is a cyclic dependency
between the packages `org...instrument.reactor` and 
`org...instrument.web`.

![Cyclic dependencies](/images/idea-cyclic-dependencies.jpg "Idea Analyze Cyclic Dependencies")
