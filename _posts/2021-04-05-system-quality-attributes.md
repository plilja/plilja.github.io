---
layout: post
title: System quality attributes
tags: [architecture]
---

I'm reading the book "Designing Data-Intensive Applications" 
by Martin Kleppmann.  I found the list of attributes that 
describes the quality of a system quite good. So I thought
I would replicate it here.

== Reliability ==

Tolerating hardware and software faults. Dealing with human errors.

Does the system perform what the user expects? Does the system
prevent unauthorized use.

== Scalability ==

Can the system cope with increased load?

What's the latency? What's the throughput?

== Maintainability ==

Subdivided into:

Operability, simplicity, and evolvability.

