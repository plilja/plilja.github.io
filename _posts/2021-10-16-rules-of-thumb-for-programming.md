---
layout: post
title: Rules of Thumb for Programming
tags: [ramble, principles]
---

The idea of having a set of rules one can follow to write
good code is appealing. I don't think one can follow such
rules strictly, you will be forced to violate them
quite often. I have already [touched upon this
on this site](https://plilja.se/breaking-principles/). In this
post, I will list some rules that I have found in my career.

## Write your code as compact as possible without making it cryptic

Generally, I think that the less code you write the better the solution. 
Shorter code is generally easier to understand and there are fewer
lines of code where you might introduce a bug. I'm not saying you
should write cryptic code for the sake of it being short. I am however
saying that maybe you shouldn't extract a piece of code to a separate
class if it makes the code longer.

## Command-query separation

I have written about this one [before](https://plilja.se/command-query-separation/) because I believe it to be one of the best programming principles.

In short, write your functions so that they either return a value and
have no side effects or return void and have side effects.

Your value returning functions will have names such as 'get', 'is', 'find'
'create'. And your side effect functions will have names such as 'save',
'execute' or 'process'.

## Care about the namespace of classes and packages in your project

To understand a project I generally look at the package structure and
the key classes. I think that generally programmers tend to spend too much
time focusing on the details of certain pieces of code (for example streams vs
for-loops or if-statements vs switch-cases). Conversely, I think programmers
don't spend enough time thinking about the overall structure of their programs.
I think the package structure should be flat and easy to understand. The namespace
of classes should be as small as possible and the best names should be
reserved for the key concepts of your domain.

## Think about the person reading and the person integrating with your code

When you write a class or a function you want to think about the person
that is going to code review it. Try to make it easy to understand for that
person. You also want to think about the person that is going to use your
piece of code from some other code. It should be easy to understand how
to use your code, and conversely, it should be hard to use it in the wrong
way.

## While writing your code, test how it behaves if you introduce bugs in it

As a programmer, you are in a unique position to test your code versus a
tester. You can temporarily put in some code that makes your code throw
errors to see how it behaves if an error occurs. For your unit tests, you
can introduce a bug to see that they catch it. Make sure that you take
advantage of this position and your code will generally have fewer bugs in
it.

## If you can write generic code with little extra cost, prefer it over specialized code

The [YAGNI rule](https://en.wikipedia.org/wiki/You_aren%27t_gonna_need_it) states
that you shouldn't introduce functionality that you think you might need later.
Instead, you should introduce it when you *actually* need it. I think
this is a good rule.

However, when you can write a solution to a problem that
also solves a broader problem with the same complexity as just solving your
specific problem. Then I think you should generally opt for the more generic
solution. The reason for this is that if the solutions are equally hard to
implement, then probably the specifics of the problem you are currently
facing are just making the solution harder to understand. Generic solutions
can actually be simpler than the the specific solution.

## Avoid long lines, long names, and long parameter lists

These three tend to be hard to follow at times. But generally, I try my best
to fight these three. 

Long lines tend to pack lots of information into one line. I think it's easier
to understand multiple short lines than one long line.

Long names indicate that you haven't found a good abstraction or that
you are exposing too much about the internals of what you are naming. For
the reader of the code, they tend to be tiring.

Long parameter lists are the hardest to avoid. For the reader of the code,
it tends to be hard to know what each parameter means, at least if the language
you are using doesn't allow passing named parameters. For the person using
your code, it's usually annoying having to fill the parameter list.

## Offensive programming

Related to [Offensive programming](https://en.wikipedia.org/wiki/Offensive_programming) is its neighbor [defensive programming](https://en.wikipedia.org/wiki/Defensive_programming) which
states that you should be paranoid about function inputs and try to recover
from an unforeseen state. I think the defensive approach is good to have
when dealing with user input. However in the internals of my programs, I prefer
the opposite approach, assume that every input to your function is good. Also,
assume that any output returned from a function you call is also good. This
of course implies that you only return good output from the functions that
you write yourself. Only add defensive measurements (such as null-checks) after
proven that they are needed.

By following this I believe that you achieve a few benefits:

* You get rid of a lot of error checking code (null checks is a typical one)
* The reader of your code will clearly see which exceptional cases can actually arise (which variables can actually be null?)
* As a side effect you will follow the [Fail fast](https://en.wikipedia.org/wiki/Fail-fast) principle which will mean that stack traces will point to the root of your problem and not 2 or 3 places later

## Have a code standard

It will be boring to set up a code standard. But for a project that has more
than one contributor, there is no point in arguing about whether a variable
should be final or not. Or whether methods returning a boolean should be named
'get' or 'is'. Just decide on a standard and stick to it.
