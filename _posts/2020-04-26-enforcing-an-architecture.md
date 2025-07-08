---
layout: post
title: Enforcing an Architecture
tags: [architecture, java, testing]
---

One problem with architectures and code styles is that
they don't have a strict definition. Instead, they typically
exist as a drawing or on a company wiki. Or even worse,
in the collective mind of the company's senior employees.

In this post, I'm going to explore some options for enforcing
an architecture in a Java project.

Any kind of enforcement will have to be made
by a computer. This will be a fine line between
adding value and simply being annoying.

For code style and inspections, I find the most useful,
and least annoying solution is to ensure every team
member has the same IntelliJ settings. 

Instead, I propose focusing on stuff where violations
would be expensive. I would say that
controlling dependencies is important. Especially since
as soon as you import a third-party library (like Spring),
you get a lot of transitive dependencies, that you might
not want but cannot escape.

Doing some investigation, I found [ArchUnit](https://www.archunit.org) to
look quite promising. You can use it to write unit test that verifies
parts of your architecture.  

This is an example of how to specify that your code
may only use a subset of the packages available in Spring framework,
as well as the Java standard API and Sl4fj.
```java

@AnalyzeClasses(packages = "com.your.org", importOptions = ImportOption.DoNotIncludeTests.class)
public class DependencyCheck {

    @ArchTest
    static ArchRule controlDependencies = classes()
            .that().resideInAPackage("com.your.org..")
            .should().onlyAccessClassesThat().resideInAnyPackage(
                    "com.your.org..",
                    "org.springframework.web.bind.annotation",
                    "org.springframework.data.annotation",
                    "org.springframework.http",
                    "org.springframework.stereotype",
                    "org.springframework.web.server",
                    "org.springframework.boot",
                    "java..",
                    "org.slf4j.."
            );
}
```

Here are a few examples of what you can do with ArchUnit:
* Enforce that no package cycles are present
* Enforce that in a layered architecture, dependencies flow one way (GUI -> Logic -> Persistence, for example)
* Enforce that an API-package does not access an impl-package
* Enforce that an impl-package A does not access impl-package B (only API-package B)
* Enforcing naming conventions (for example, all classes annotated with @RestController should be named ...Controller)

Here is a link to the [documentation](https://www.archunit.org/userguide/html/000_Index.html) for ArchUnit.

Links to other useful tools for enforcing an Architecture:
* [Spoon](http://spoon.gforge.inria.fr)
* [CheckStyle](https://checkstyle.sourceforge.io)
* [Maven PMD plugin](http://maven.apache.org/plugins/maven-pmd-plugin)
* [Sonar](https://www.sonarqube.org)
* [Reflections library](https://github.com/ronmamo/reflections)
* [Macker Maven plugin](https://github.com/andrena/macker-maven-plugin)
* [Restrict Maven plugin](https://github.com/yamanyar/restrict-maven-plugin)
