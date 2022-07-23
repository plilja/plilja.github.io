---
layout: post
title: API Versioning
tags: [java, spring]
---

One big disadvantage of exposing anything as an API is that
it tends to be difficult to change once others have started
using it. Generally, anything related to programming that is hard
to change is going to become a problem.

In this post when I say API, I mean REST API. Although the
problems largely overlap if it's a library API or some other
kind of API.

The most common approach I've seen to versioning REST API's
is to:

1. Introduce some kind of "version" parameter (can be a header, URL parameter, or query parameter)
2. In controller based on the "version" parameter resolve different response

Using a URL parameter usually has the added benefit of allowing
to define completely separate controller methods with different
input parameters and return types. Although the REST purist will say
that a version parameter does not belong in the URL. Despite
the REST purist, this tends to be my favored solution.

I.e. it could look something like this. 

```
@RequestMapping("/v2/persons")
@RestController
class PersonControllerV2 {
    private final PersonService personService;

    PersonController(PersonService personService) {
        this.personService = personService;
    }

    @GetMapping("/{ssn}")
    Person getCart(@PathVariable("ssn") String ssn) {
        return personService.getPerson(ssn);
    }
}
```

```
/**
 * Old version of PersonController
 */
@RequestMapping("/v1/persons")
@RestController
class PersonControllerV1 {
    private final PersonService personService;

    PersonControllerV1(PersonService personService) {
        this.personService = personService;
    }

    @GetMapping("/{ssn}")
    PersonV1 getCart(@PathVariable("ssn") String ssn) {
        Person person = personService.getPerson(ssn);
        PersonV1 personV1 = ... // convert person to V1 format
        return personV1;
    }
}
```

This approach has the benefit of providing type safety
for the parameters. It does however mean that each breaking
change to the contract is rather costly. It requires a new version
of the Person class and a new Controller. 

The most beautiful solution to this problem that I've seen
was to introduce transformations for each breaking change. For example, 
a renamed field would require two transformations:

* An "incoming transformation" for request parameters that translated the old attribute name to the new attribute name
* An "outgoing transformation" for return types that translated the new attribute name to the old attribute name

I implemented a library that allows for this type of versioning in Spring.

* [https://github.com/plilja/jackson-versioning](https://github.com/plilja/jackson-versioning)

Using this library the above example could instead become something like:

```
@RequestMapping("/persons")
@RestController
class PersonController {
    private final PersonService personService;

    PersonController(PersonService personService) {
        this.personService = personService;
    }

    @GetMapping("/{ssn}")
    Person getCart(@PathVariable("ssn") String ssn) {
        return personService.getPerson(ssn);
    }
}

@JsonVersioned(converterClass = PersonConverter.class)
class Person {
    private String firstName;
    // getters and setters left out for brewity
}

@Component
class PersonConverter extends AbstractVersionConverter<ApiVersion> {
    public PersonConverter() {
        super(Person.class);
        attributeRenamed(ApiVersion.V2, "name", "firstName"); // In V2 the "name" attribute was renamed to "firstName"
    }
}
```

In my opinion, this solution has some attractive properties.
It makes versioning a cross-cutting concern and pulls your
versioning logic out to the 'Converter'-class. You don't have
to pollute your class namespace with old versioned classes. 

Also, it automatically works if you have linked classes (for example,
say that you had a Family class that contains a List<Person>-field). 
Then that Family class would also be automatically backward compatible
with the renamed field.
