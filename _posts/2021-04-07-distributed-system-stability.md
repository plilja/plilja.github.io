---
layout: post
title: Distributed system stability
tags: [architecture]
---

One of the selling points of a microservice architecture
is often that it will be more stable. If one microservice
encounters a failure it does not bring down your
entire system. At least that is what advocates say.

In my experience, this has rarely been the case though.
I believe that you will largely need to have fallback
logic for that promise to hold. For example:
if the service holding customer information is down,
then we need a fallback solution in all the services
that use customer information.

Maybe it's because I've mainly worked on financial systems.
But those fallback solutions are not that easy to find
in practice. You either want your operation to succeed or fail,
not "half succeed".

Indeed, a memory bug in a new microservices can't
cause your most crucial service to fail with OutOfMemoryError.
Only the new microservice will fail in that case. However,
in practice, it's usually the other way round. Failures are
coming from the most crucial services. They are usually the
oldest and they have the most traffic. Sadly enough older doesn't
always equate to battle-hardened and stable.

Another interesting aspect is the number of moving parts.
In a microservice architecture, there will be more systems
in total involved as compared to a monolithic architecture.
That is including all systems, for example, hardware and
operating systems. This means that you will undoubtedly see
more frequent failures in the case of a microservice architecture. 
Simply because the more things that can fail means that a
failure will be more likely. The question is if those failures
can be contained so that they have less impact than what
they would in the case of the monolith.
