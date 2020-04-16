---
layout: post
title: What makes a team productive?
---

My interests mostly lie in the technical
side of software development. But after almost a decade
working professionally, I have learned that the softer
values matter. I tend not to dwell on them that much though. 
As a problem solver, I simply don't find them that
interesting to think about. 

However, in this post, I'm going to try and summarize some
thoughts on how to keep your developers productive.

I've found it not uncommon that a simple bugfix that takes
15-30 minutes to code, can take days before being fully
completed. If this is the case in your organization, 
then you probably have some things that can be optimized.

## Iteration speed

If you have ever developed code in a REPL, you have first-hand
experience that iteration speed matters. In a REPL,
you get instant feedback on your code. This means that you
can work out a solution to a simple problem really fast.

For a larger project where the REPL is not suitable. Things 
to consider when optimizing for iteration speed are:

* How fast will you know that your solution doesn't break things? 
** Good automated tests, that run quickly will help you
** If manual testing is required you want it done as close after commit as possible
* How long will it take after commit, until the task is completely done?
** Things like complex release processes, manual testing, documentation will work against you here
* Do you need to talk to someone else to fix something?
** The slower that person is to respond the longer the task will take. Typically people close to you will be quicker to respond, because they know you and their agenda aligns with yours. Therefore you want to minimize dependencies on personnel outside the team. Third-party dependencies are going to be the worst.

## Having fun

This is one thing that I tend to think gets overlooked. Personally
I have experienced that I feel a lot more productive when
I feel motivated. 

Some things to consider:

* Minimize the amount of "friction"
** Example of friction:
*** Having to talk with a third-party vendor
*** Arguing about nitpicks in code review
*** A flaky integration test
*** Unstable test environment
*** Windows update
* Working on a good solution feels a lot better than working on a bad one
* Feeling appreciated
** Who wants to work on something if no one cares about it?
* I like mentally challenging tasks, and I imagine a lot of other developers do the same

## Complexity

Complex code is a big productivity killer. You'll spend time
trying to figure out why stuff was done the way they were. Quite
often, you need deep domain knowledge to refactor complex code into simpler
coder I don't think that you can completely eradicate complex code,
some things are just complex. But a lot of the time it can be simpler.

Some things to think about:

* Adding technologies, third-party dependencies, tooling and so on can also add to your complexity
* Refactoring into smaller classes and methods can make each individual class and method easier to understand, but at the same time it can make the relationships between them harder to understand
* Microservices will usually be more complex than monoliths (microservices have some other qualities that may make them preferable). More and smaller microservices will probably mean that the system as a whole will be more complex.

## Safety net

I touched on this one in the previous sections. If you
don't feel safe doing changes, then you will start programming
defensively. You will choose to add an extra if-statement over
refactoring to a simpler solution. You won't have fun doing it,
which will probably mean that you will be slow doing it. And you
will add complexity to the code which will just make it worse the
next time.

