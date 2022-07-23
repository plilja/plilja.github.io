---
layout: post
title: System Quality Attributes
tags: [architecture, books]
---

I'm reading the book "Designing Data-Intensive Applications" 
by Martin Kleppmann.  I found the list of attributes that
describes the quality of a system quite good. So I thought
I would replicate it here.

## Reliability

Tolerating hardware and software faults. Dealing with human errors.

Does the system perform what the user expects? Does the system
prevent unauthorized use.

## Scalability

Can the system cope with increased load?

What's the latency? What's the throughput?

## Maintainability

Maintainability is further subdivided into:

Operability, simplicity, and evolvability.

## Comments

I think that in the software development community too much
time is spent focusing on scalability. Most systems
will never be successful enough where this even factors in.

This is probably because for some of the most
revered companies in Tech, this is a huge focus area.

Conversely, I think too little time is spent focusing
on maintainability. Maintenance is after all where we
will spend most of our time working.
