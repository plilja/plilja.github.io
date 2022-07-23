---
layout: post
title: Breaking Principles
tags: [architecture, principles]
---

Whether it comes to low-level design or high-level design, I find
it useful to think about abstractions that make sense. While this might
sound like an obvious statement, there are a couple of principles
that might lead you to create abstractions that don't make sense.

Some examples:
* DRY: while looking to eliminate duplication, it can be tempting to 
  introduce artificial concepts that can be hard to understand.
* TDD/mock-frameworks: Mocking all code collaborators tends to be harder
  for larger code units. This might lead you to break up the code even 
  though a good abstraction hasn't presented itself.
* Single Responsibility Principle: According to this principle, a class
  should only have one reason for change. This naturally leads to small
  classes. Small classes mean that each individual class will be easier,
  to understand. But it also means that your namespace of classes will be more
  cluttered.

It takes some time knowing when to break a principle. When in doubt,
I tend to prioritize readability. If you have trouble coming up
with a name for something, that might indicate that you haven't
found the best way to slice your code.

I also tend to think that it's easy to prioritize low-level readability
over high-level readability. As you break down a class into smaller
units, your packages will become harder to understand. 
