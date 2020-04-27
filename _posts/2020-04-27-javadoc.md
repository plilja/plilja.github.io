---
layout: post
title: Documenting code
---

It amazes me how often you see useless code documentation.
By "useless", I mean documentation that doesn't add any information
that isn't already present in the type signatures.

Documentation like the following example is quite common in most
codebases:
```java
/**
 * Gets a person by id
 * @param personId person identifier
 * @return person with given id
 */
Person getPersonById(int personId) {
    ...
}
```
The only thing that is unclear from the type signature,
is what would happen if the person was not found. And in
this case, that is not documented.

Searching IntelliJ Marketplace, I found that there are even
plugins that will generate such Javadoc for you. I think
this bad practice comes from universities. When I went to
university we were told that every method should be documented.

My opinion is that if you feel the need to document your code,
in a strongly typed language, then you should interpret that
as a code smell. Probably you can look for a better method
name or a cleaner abstraction and leave out the documentation.
