---
layout: post
title: Remote Debugging
tags: [java, tools]
---

Remote debugging is one feature I didn't realize I needed
until I worked in a team where I was integrating towards
a third party that was calling my code. 

If the project you are working on is "independent" from third
parties it's usually easy to test and debug locally to
reproduce any issues. The same would be true if you call the third
party but they never call you. Then remote debugging is
probably of little value to you.

{% include third-party.svg %}

If calls are coming from a third party this might not be
as easy. You can't just ask your third party to redirect
their calls to your local machine.

To be able to do remote debugging you need to add some
command line parameters. Typically you only want these in
your test environment.

```
-Xdebug -Xrunjdwp:transport=dt_socket,address=8081,server=y,suspend=y
```

After that, you can connect with IntelliJ using a remote debug
"Run profile" with settings similar to the following. 

![Run profile](/images/remote-debug-idea.jpg "Idea run profile")

When you start that run profile you can debug similar to what you
could locally. Some features like reassigning variables and hot-swapping
won't be available though.
