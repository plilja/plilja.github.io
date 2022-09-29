---
layout: post
title: Programming puzzles
tags: [ramble]
---

I have been doing a fair amount of programming puzzles recently as
I'm switching jobs. Mainly, I have been doing puzzles from 
[leetcode.com](https://leetcode.com).

I've read a lot of criticism on other developer blogs that
puzzles don't really translate to skills needed on the actual job.
To some extent, I agree with this sentiment, but not entirely. In this
post, I will explore what parts of programming puzzles actually
translates to skills needed on a job.

I would say that the most important aspect a puzzle tests for is the
ability to read and understand instructions and correctly implement a solution
that satisfies those instructions. This is obviously a valuable skill
as it translates, quite closely, to picking up a task from a backlog
and implementing it. 

However, a real job task will typically not be a difficult problem algorithmically.
You will rarely need to come up with a highly efficient algorithm in terms
of runtime or space complexity. Instead, other aspects will be important in
production code. Things like readability, error handling, race conditions, 
transactional consistency, extendability, etc. will be more
important to focus on. If your code is inefficient enough, the
solution is usually to minimize network calls or introduce caching.

The algorithmic concept that I would say is by far the most useful
is to know the data structure APIs from the standard library of the
language you are using. And to understand how those data structures work.
This is something that I use almost daily
in my work life. Many algorithms become trivial to implement
if you pick the right data structure, but might be pretty tricky to write
if you pick the wrong data structure.

Here are some examples:
* Need to group objects by some property -> Put it in a map
* Need fast lookup -> Put it in a map
* Need thread safety -> Look for a thread-safe data structure
* Need something to be kept sorted continuously -> Use a sorted collection like a TreeSet
* Need objects to be unique -> Put it in a Set

Some concepts that I can't remember I have ever encountered at work:

* Binary trees 
* Binary search trees (I would use TreeMap or TreeSet if I need properties provided by a tree)
* Linked lists (I pretty much always use ArrayList)
* Graphs (maybe if you work in a social media company)
* DFS/BFS (I have seen some variation of it once or twice, but extremely rare)
* Dynamic programming
* Monotonic stack
* Trie (you can usually use a Set if you need properties similar to a Trie)
* Implementing your own sort algorithm (always use the one from the standard library)
* Binary search (not in code, although conceptually, I might use binary search when debugging a problem)

On top of that, some patterns are common in puzzles, and sometimes even encouraged, that
would be considered bad practice in production code:

* Modifying function input parameters
* Reusing variables to save space
* Short variable names, I find that in puzzles, they might make your algorithm clearer, while the opposite is usually true in production code
* No input validation
* Using arrays (the List/vector APIs are usually nicer to work with)
