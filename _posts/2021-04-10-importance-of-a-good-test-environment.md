---
layout: post
title: Importance of a good test environment
tags: [ramble]
---

The importance of having a good test environment is
something that I believe a lot of companies get wrong.
And it's quite easy to understand why. During the startup
phase of a company, this will not be a top priority.
For a startup it might even be fine to test code
in prod.

The problem with this approach is that it might be hard
to retrofit a good test environment. Lets first define
what a good test environment is. A good test environment is:

* Stable
** Preferable as stable as prod
* Wipeable
** If it breaks it can easily be reset
* Cloneable
** Should be easy to spin up another copy, preferable on a local dev machine
* Easily deployable
** Should be easy to test your code before committing to master
* Disconnects costly/unstable prod dependencies
** For example a third party payment provider might be substituted for a mock

I believe a lot of companies get most of these points wrong.
Except for the last point which is pretty much a prerequisite for
even having a test environment.

There are two main culprits that block most of these points.
The first one is the complexity of your tech stack. The more
steps needed to configure all the parts of your tech stack,
the harder it will be to create clones of your application.
This can be solved by either automating the setup of these systems
or more easily by keeping your tech stack dirt simple.

The second culprit is your prod data. Typically you will want to
periodically restore a copy of prod into your test environment.
If you spread your data across several databases, like is often
recommended when doing microservices, then this will be harder
than if you only have one database. Another problem with prod
data is that you might need to shrink your database depending
on the size of prod. You might also need to wash the data
from sensitive information to comply with GDPR.
