---
layout: post
title: Domain-Driven Design
tags: [architecture]
keywords: [architecture]
---

I recently finished the classic book Domain-Driven Design by Eric Evans.
I will summarize the contents of the book in this post.

## Example 

As an example, we will use an e-commerce website for selling books online.
The project for the website consists of the following modules:

* _Customers_
* _Orders_
* _Books_
* _Payments_
* _Shipping_

## Ubiquitous Language

A key principle of domain-driven design is to build your application
using a shared terminology together with your domain experts. 
You must work with your domain expert to agree on this terminology. 
If you are successful, it will be easier for you and your 
domain experts to understand each other.

This principle is primarily about boosting collaboration 
with domain experts, rather than a technical principle. It makes 
sense to apply this principle to all projects, not only the ones 
that are using domain-driven design. 

## Bounded Contexts

A bounded context is a grouping of your domain in which your 
ubiquitous language remains valid and consistent. In a microservice 
architecture, this might correspond to one microservice; in a modular 
monolith, it might mean a module or a group of modules.

From our e-commerce website example, the listed modules are 
already split into appropriate bounded contexts. Since every 
bounded context has its own ubiquitous language, you can mean slightly 
or even completely different things when referring to an object. For example, 
in the books module, a book might have properties like _genre_, _author_,
and _average rating_. These properties are probably not relevant 
to other modules. Other modules, such as the _shipping_ module,
are interested in different properties of books, such as _dimensions_ 
and _weight_. Since they have their own ubiquitous language, they
are free to reuse the keyword _book_, or they can choose to use 
a more generic word, such as _article_, to represent a book.

## Aggregate Roots, Value Objects, and Aggregates

Within a bounded context, partition your objects between 
**aggregate roots**, **entities** and **value objects**. Together, 
aggregate roots, entities and value objects make up an **aggregate**. 
Aggregate roots and entities are objects that have a meaningful identity and
have life-cycles. In contrast, value objects are objects that do
not have a meaningful identity. Value objects are also typically immutable.

The aggregate roots can be referenced from other aggregates and
sometimes from other bounded contexts. Entities and value objects, on the other
hand, should only be accessed through the aggregate root.

From our e-commerce example, a _customer_ is an **aggregate root**.
A customer has a meaningful identity. It could either be a generated
identity, such as a UUID, or it could be an email address or a username.
It makes sense that other aggregates can reference a customer.

A customer might have related objects such as loyalty program membership
and address. The loyalty program membership has a meaningful identity to
the business, in this case it's the combination of `custumerId` and `loyaltyProgramId`.

An address on the other hand doesn't have a meaningful identity. If a customer
changes their address the old address is not updated, instead
a new address is created and linked to the customer. Address is a value
object. If the business decides that we need to track the history
of customer's addresses, then we might make the connection between
a customer and an address an entity.

## Core Domain

Domain-driven design places the model at the center. It is the 
most important part of your application. For larger projects,
the model might become too large to keep in one's head. Therefore,
partitioning your model into several modules is necessary. One 
part of the model should be identified as the **core domain**. 
The core domain makes up the most important part of your 
business. 

The core domain will be heavily used by supporting modules.
However, the core domain should not use your supporting modules.
Therefore, the quality of your core domain can impact the quality
of your supporting domains.

You should spend extra time distilling this core model.
The team responsible for the core domain should be staffed
with some of the best engineers at your company.

For our example application, the core model would probably be 
the _books_, _customers_, and _orders_ modules. The other modules 
provide supporting functionality.

## Subdomains

In contrast to the core domain, a subdomain provides supporting
functionality for the business. A poorly designed core domain 
can corrupt your subdomains. However, a poorly designed subdomain
should have a limited impact across your application.

A subdomain can be a good candidate for contract work
or outsourcing to a third-party.

You might be asking what the difference between a domain, either
core or subdomain, and a bounded context is. A domain is something
that is a key component of your business. A bounded context
is a way to model a boundary in the software. Often, domains
and bounded contexts might be interchangeable.

From our example application, these are the _payments_ and 
_shipping_ modules. These are also very good candidates
for using third-party solutions.

## Anti-Corruption Layer

Since every bounded context has its own ubiquitous language,
translation between languages needs to happen when one bounded
context communicates with another bounded context.

We don't want the model of one bounded context to corrupt
another bounded context. Ideally, you should be able to understand
one bounded context in isolation. 

The pattern anti-corruption layer solves this by isolating
all the translation to other bounded contexts into one place.


