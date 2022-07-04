---
layout: post
title: Audit trail
tags: [architecture]
---

Depending on what type of system you are working on,
being able to trace back the history of changes might
be necessary. In a financial system, it might not only 
be helpful, but also a requirement to be compliant. 

I have encountered a few approaches to this problem during
my years of work. 

## Log out the change and let your log system be the audit log

This solution is probably the simplest. It doesn't impact
your application logic more than a few extra log statements.
However, logs are usually noisy, and many companies will not be
able to retain the logs forever. So if you need to keep the audit trail
"forever", this solution might not be good enough.

One solution I've seen to improve this solution is to use a marker
to indicate that some log statements are more important and should
be retained for longer.

```
// In Java using SLF4J this might look like this
log.info(Marker.AUDIT, "Something important happened");
```

## Externalize significant changes to an audit log service

Imagine that you have a service that can store blobs of data per identifier
and timestamp. The data blob might be JSON or XML, or similar. Later, when
you need to query the audit log, you plug in the identifier and get back a list
of state changes made on different timestamps.

This service could be a separate micro-service or a regular Java class, depending
on what architecture you are implementing.

## Introduce history tables for your significant objects

Keep a copy of any table for which you want to track changes. The copied table
has the same set of columns (and a timestamp column) and some kind of prefix or suffix to indicate
that it's a history table. Whenever an update (or delete) happens, copy the changed row
to the history table and mark it with a timestamp.

Copying can be performed with a trigger or, if you prefer, from your
application code.

Maintaining the same constraints as on the original table will probably be difficult. 
Especially foreign keys might be tricky since you can keep references in the history table
to rows that have been deleted. Easiest is probably to remove all constraints
on the history table. You aren't supposed to use it from your application logic anyway,
so its consistency is not critical.

## Introduce some version marker for your significant objects

Instead of doing an update, you can insert a new row, and then whenever
you need to query the table, you always take the latest row. So for a person-table,
your key might be SSN and version instead of just SSN.

When you need to perform a delete in this solution, you would instead
of actually deleting the row, toggle a flag that says that the row is deleted.

This solution might seem elegant at first glance. But it does make your 
application code trickier to write. Especially foreign keys are hard to get right.
If you have incoming foreign keys, you must rewrite them to point to the new row
whenever updating a version. And if those reference rows are versioned in the same
way, then they will also be a new insert instead of an update. A cascading delete will,
instead of using the cascade functionality from the DB provider, have to be written in application
code to toggle the deleted flag on any referenced tables.

Also, you might not be able to trust the locking mechanism that your DB vendor provides. 
Since that normally happens on a table row and you modify a row by doing an insert.

## Event sourcing

[Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html) has been fashionable for a few years. 
The basic idea is that instead of storing the current state in your DB, you instead store your state changes as
events. To get back to the current state, you just replay all the events. This essentially gives you a perfect
audit log. You can recreate any past historic state. 

To support queries, you can still store the current state of your model in the DB.
This is usually called a "projection". Using "projections", you can query your current
state with SQL (or similar) like you are used to. It's just that the source of truth is the events.

This is an entirely different way of writing your application that will significantly impact your code. 
Although I haven't got much experience with it, I would guess that it's more complex over
just storing the current state.

It's not uncommon to see partial event sourced applications. The transaction history on your bank
might be the most famous example. 
