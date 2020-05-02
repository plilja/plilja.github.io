---
layout: post
title: Pitfalls of the common pool
tags: [java]
---

Writing parallel Java code has certainly become
easier with the newer Java versions. 

A trap that's easy to run into is over usage of
the "common pool".

The common pool defines a set of threads meant to be
reused across tasks. For a lot of APIs, it will
be the default executor used if a specific one
is not specified.

Notable examples of when the common pool is used 
is Stream#parallelStream and CompletableFuture#runAsync.

The size of the common pool will be set to the
number of cores minus one. This will be a good choice
when you're writing applications that are mostly
limited by the CPU.

Most enterprise applications however, will be limited
by waiting for remote calls to a database or a remote service.
These tasks aren't CPU bounded and you will probably
want a higher degree of parallelism than the number
of cores.

If your application relies on parallel execution to 
reach a good enough performance, it might be a good
idea to define dedicated Executors where applicable.

Here's an example to illustrate the problems.

```java
@RequestMapping
@RestController
class TaskController {
    /**
     * Starts a heavy task running in the background. Will block
     * the common thread pool for 60 seconds.
     * <p>
     * In a real example, this might have been a @Scheduled method.
     */
    @PostMapping("/heavyAsyncWork")
    void heavyAsyncWork() {
        CompletableFuture.runAsync(() -> {
            var work = range(0, 60 * (ForkJoinPool.commonPool().getParallelism() - 1));
            work.parallelStream()
                    .forEach(i -> {
                        try {
                            Thread.sleep(1000);
                        } catch (InterruptedException e) {
                            // ignore
                        }
                    });

        });
    }

    /**
     * Starts a minor async task using CompletableFuture. Would normally
     * be run in the background. But to make it easy to try
     * out, it returns a value computed async.
     */
    @PostMapping("/minorAsyncWork")
    String minorAsyncWork() throws Exception {
        Future<String> future = CompletableFuture.supplyAsync(() -> {
            return "work done";
        });
        return future.get();
    }

    /**
     * Calculates the primes less than 1000. Also returns the threads
     * that was used in the calculation. Uses a parallelStream to do
     * the calculation.
     */
    @GetMapping("/parallelStreamWork")
    List<Object> parallelStreamWork() {
        var calculatingThreads = new ConcurrentHashMap<String, Boolean>();
        var primes = range(2, 1000).parallelStream()
                .filter(n -> {
                    calculatingThreads.put(Thread.currentThread().getName(), true);
                    return isPrime(n);
                })
                .collect((toList()));
        var result = new ArrayList<Object>();
        result.addAll(calculatingThreads.keySet());
        result.addAll(primes);
        return result;
    }

    private List<Integer> range(int start, int end) {
        List<Integer> maybePrime = new ArrayList<>();
        for (int i = start; i < end; i++) {
            maybePrime.add(i);
        }
        return maybePrime;
    }

    private boolean isPrime(int n) {
        int lim = (int) Math.sqrt(n);
        for (int i = 2; i <= lim; i++) {
            if (n % i == 0) {
                return false;
            }
        }
        return true;
    }
}
```

Making some calls, you will see something like this.
```bash
> curl http://localhost:8080/parallelStreamWork
["ForkJoinPool.commonPool-worker-9","ForkJoinPool.commonPool-worker-15","ForkJoinPool.commonPool-worker-7","ForkJoinPool.commonPool-worker-1","ForkJoinPool.commonPool-worker-5","http-nio-8080-exec-5","ForkJoinPool.commonPool-worker-11",2,3,5,7,11,13,17...
0.00s user 0.01s system 73% cpu 0.014 total
> curl -X POST http://localhost:8080/minorAsyncWork
work done
0.00s user 0.01s system 78% cpu 0.014 total
```

However, if you call the endpoint that starts a heavy task
in the common pool the responses change.

```bash
> time curl -X POST http://localhost:8080/heavyAsyncWork
0.00s user 0.01s system 6% cpu 0.154 total
> time curl http://localhost:8080/parallelStreamWork
["http-nio-8080-exec-2",2,3,5,7,11,13,17...
0.00s user 0.01s system 26% cpu 0.039 total
work done
0.00s user 0.01s system 0% cpu 26.659 total
```

This time we can see that the work done using a parallelStream
was only executed in one thread, the calling thread. 

We can also see that the minorAsyncTask that was started as
a CompletableFuture was stuck for 26 seconds.

This illustrates that you can see severe performance degradation
in one part of the application caused by someone from a completely 
different part of the application blocking the common pool.
