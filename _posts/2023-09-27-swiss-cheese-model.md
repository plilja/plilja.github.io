---
layout: post
title: Swiss Cheese model
tags: [ramble]
---

The Swiss Cheese model metaphorizes the defense against some risk with layers of cheese. Each layer of cheese has holes in it. The more layers you stack on top of each other the less likely it is that the holes will align.

In the IT industry, this model is commonly applied in the context of security. While I'm not a security expert and won't delve deeply into this aspect, I find the model applicable for devising a low-risk approach to implementing changes in production.

That change might be a feature rollout, a support action, or something similar. Here are some layers you can apply can consider applying. Please note that depending on the nature of your change not all layers might be applicable.

* Unit testing
* Integration tests
* Code review
* Manual testing
* Dual approval (one person acts, another person checks)
* Gradual rollout (for example: first 1 customer, then 10, then 100, then 10 percent)

The usual mistake companies make is that they make all the layers mandatory. As they encounter production incidents they continue to add layers to prevent similar incidents from occurring in the future. This will make most rollouts more cumbersome than they need to be. After all, most changes in production should be small and safe. If you need all those steps for all your changes, then you have a bigger problem.

A better approach is to leave all the layers optional and consider them to be tools that you can apply to be confident when making changes in production. The riskier you feel that a change is the more layers you can apply.

I regularly see developers skip the steps that are more manual and rush to production. If you are dealing with a feature where an error is not costly that approach is usually fine. If an error would be costly however, usually performing the extra manual layers is worth the extra effort.
