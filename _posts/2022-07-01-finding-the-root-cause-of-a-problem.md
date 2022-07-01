---
layout: post
title: Finding the root cause of a problem
tags: [ramble]
---

Finding the root cause of a problem is a valuable
skill. If you continuously hunt down the root cause of your production
issues and address them. Then gradually, your system will
become more stable as time passes.

Sometimes finding the root cause is easy. If you have a stack trace
then there is a decent chance that you have enough information
already to know what the root cause is. That is why you want
to ensure that your logging and monitoring solutions are top
notch. 

What do you do when the root cause isn't easy to spot? This
is when you go hunting for clues in an attempt to reduce
the search space.

Questions or actions that you might perform:

* When did the problem appear for the first time?
* What happened just before the problem first appeared?
  * A typical scenario is to find a code change deployed just before the problem started
* See if you can reproduce the problem locally or in your test environment
* Find the smallest common denominator. Maybe it's happening for customers of type A but not type B or C
* If your program is stuck, and the solution is to restart it. Make sure you grab a thread dump first so that you can examine where it was stuck afterward.
* Try deploying an older version of your code to see if the problem goes away

If you are a Java developer, or any other language running
on the JVM, it's worth mentioning that the JVM can sometimes
hide the stack trace for exceptions in the `java.lang` package.
This is an optimization feature of the JVM. If your error is missing a stack trace,
you can search for the first few times when the error happened, 
and you can usually find the stack trace there. 
