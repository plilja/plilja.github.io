---
layout: post
title: Decision Making
tags: [productivity]
---

Making decisions can be hard. Especially making hard
decisions with large consequences. That's the reason
why company leaders have such high salaries.

But the fact of the matter is that we make decisions all
day long. Even if we're not upper management. In this
post, I thought I'd contemplate a little about which
decisions to focus on the most.

The company structure for a typical Tech company might
look something like this.

{% include tech-org-chart.svg %}

If I were to rank the types of decisions made in a Tech company 
from most import to least important it would look something like
this:

* Company goals
* Budget
* Road map
* Forming a company culture
* Tech stack
* High-level architecture
* Tooling choices
* Hiring
* Code standard
* Changes to core libraries
* Choosing/adding dependencies
* Database design
* Time prioritization
* Package structure
* Class names
* Function names
* Function implementation
* Test implementation

For example: making a poor decision while "choosing your tech stack"
will have larger negative consequences than making a poor decision while
"implementing a function". 

This list roughly maps to the organization chart presented above. 
The decisions made in the top of the list is made by executives, while
the decisions made by developers is at the bottom of the list.

In my experience, people tend to spend too much time arguing about
decisions made towards the end of this list. While at the same time never
questioning decisions made higher up in the list.

A typical example in development practice might be a long-winded
discussing during code review about whether to use Optional or
null in some part of the code. At the same time a large and
complicated pull request can get approved without a single
code review comment.

I'm not the only person to make this observation. In fact, this was
famously coined by Parkinson as the "Law of triviality". He phrased
it as "The time spent on any item of the agenda will be in inverse
proportion to the sum of money involved".

I'm not saying you should ignore the implementation details and just
accept any crappy code. I'm just saying that you should choose your
battles because your time and effort is limited. 
