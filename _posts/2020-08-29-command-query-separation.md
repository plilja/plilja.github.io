---
layout: post
title: Command Query Separation
tags: [architecture, funcprog]
---

The command-query separation (CQS) principle states that 
every function should either be a command that performs an
action or a query that returns a value. But never both at the same
time.

I.e. your functions should either have no side effects (be referentially
transparent) and return a value. Or they should have side effects,
but then their return type should be void.

Your command functions are allowed to call your query functions,
but your query functions are not allowed to call your command functions.

This is one of my favorite programming principles. If you apply
it, your functions will make more sense. 

When you follow this principle, you will also find that your
code becomes easier to read and debug. While looking for a
bug regarding a computational error, you will probably look at
your query functions and can ignore your command functions. While
looking for a bug regarding side effects (persistence for example),
you will look at your command functions. 
