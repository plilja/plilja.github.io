---
layout: post
title: JUnit 5 non-static Parameterized Method
tags: [java ]
---

JUnit 5 provides a significant upgrade over JUnit 4 in terms
of running parameterized tests. In JUnit 5, you
had to pass the parameters to your constructor, making it unnatural
to mix parameterized and non-parameterized tests in the same test
class. In JUnit 4, the parameterization functionality attaches
to a singular test method. Usually, `@ValueSource` or `@CsvSource`
gives you all the flexibility that you need. When you need slightly 
more complex parameters, you can use `@MethodSource`. 

If you follow most online guides on `@MethodSource` you would
believe that you need the method to be `static`. This is however
not true. If you annotate your test class with 
`@TestInstance(TestInstance.Lifecycle.PER_CLASS)`, then your method
source can be non-static, provided it resides in the same class as
your test (i.e. not in an external class).

Having your test method non-static might seem like an insignificant 
change. But it does allow you to create significantly more complex
parameter methods. For example, if you are using `@SpringBootTest`, then
you have access to any beans that you might inject into the fields
of your test. The `Lifecycle.PER_CLASS` annotation does however mean
that your test class is being reused in between test methods, meaning
that you might get side effects from one class leaking into 
another test.

You might say that having complex parameters methods is an anti-pattern
and indeed, I would agree with you on most occasions. I don't recommend
having a complex setup in the parameters method. But it's a useful tool
that I sometimes have found myself needing.

Here is an example that showcases the functionality:

```java
@SpringBootTest
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class NonStaticParametersTest {
    @Autowired
    private MyService myService;

    private int counter = 0;

    @BeforeAll
    static void beforeAll() {
        System.out.println("Before all");
    }

    @BeforeEach
    void beforeEach() {
        counter++;
        System.out.printf("Before each (counter=%d)%n", counter);
    }

    @MethodSource("parameters")
    @ParameterizedTest
    void test(int a, int b, int expectedResult) {
        System.out.printf("%d+%d=%d%n", a, b, expectedResult);
        assertEquals(expectedResult, a + b);
    }

    private List<Arguments> parameters() {
        System.out.printf("parameters (myService=%s)%n", myService);
        return List.of(
                Arguments.of(1, 2, 3),
                Arguments.of(2, 2, 4)
        );
    }

    @Test
    void anotherTestMethod() {
        System.out.println("anotherTestMethod");
    }
}
```

The output of running this test is the following:

```
 .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/

... rest of Spring output omitted for brevity

Before all
Before each (counter=1)
anotherTestMethod
parameters (myService=se.plilja.junit_playground.MyService@747f6c5a)
Before each (counter=2)
1+2=3
Before each (counter=3)
2+2=4
```

As you can see from the output, you have access to the bean `MyService` from the
parameters method. Also worth noting is that the counter variable isn't reset
between tests as you would normally expect in a JUnit test.
