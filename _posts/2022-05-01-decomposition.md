---
layout: post
title: Decomposition
tags: [productivity, ramble]
---

Decomposition is the process of breaking down a problem into smaller sub-problems that are easier to reason about.
When composing the solutions to the sub-problems together the bigger problem is solved.

I believe this is a key skill both when programming as well as when planning a sprint or a roadmap.

You want your sub-problems to be clearly scoped and preferably the sub-problem should be natural
pieces of the bigger problem. I often see pull requests created where it is not clear what problem they solve,
or what the scope of the pull request is.

If you can identify sub-problems that are non-overlapping then you can work on them in parallel.
The work that cannot be parallelized might need to be worked on sequentially. Or you might have to agree
on an API beforehand so that parts of your team can start working with a mock towards that API
while other parts of your team implemented it.

When you are working alone on a problem you can work in a less structured way. Instead of decomposing your problem
upfront. You can decompose it as you go along. I.e. you might start coding in some corner of your program and as you
find a piece of the problem that you think makes a good sub-problem then you can stop there. Conversely, you might identify
some piece of the problem that is too hard to solve right now. Then you might put a dummy implementation in place and create
a new ticket to solve that problem later.

I prefer the less structured approach when working on small to medium-sized problems, where I might not
know much about the problem space before I have started working on it. For bigger problems involving multiple
people, I think the upfront approach is preferable.

Why do I believe this is an important topic? Well-defined sub-problems give you a few advantages over just "winging it".

* A task with a clear scope is easier to implement and easier to review and test over one where it's unclear what the scope is
* It will make it easier to parallelize work between multiple team members
* It will save you from the mental stress of having to work on something too big
* When reading the git history a few months later it will be clear what change was made for which purpose
