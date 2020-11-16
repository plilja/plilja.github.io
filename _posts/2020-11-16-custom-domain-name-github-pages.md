---
layout: post
title: Custom domain name on GitHub pages
tags: [github]
---

A simple and free way to set up a blog is to use
[GitHub pages](https://pages.github.com). In fact, that
is how this web page is created. 

More specifically it is created using
Jekyll Now which is dirt simple to set up. I won't cover
how to set it up in this post, since the documentation
on the [Jekyll Now GitHub page](https://github.com/barryclark/jekyll-now)
is excellent.

One thing that wasn't as trivial to set up, however, was
a custom domain name for your blog. Without it,
the URL for your web page will be 
yourgithubusername.github.io. If you look at
the URL on this page you'll see that it says plilja.se.
Especially difficult to set up was enforcing HTTPS.

To achieve this a few steps are needed. These steps
assume that you have a working GitHub pages site.

* Open the settings to your GitHub pages repository
  and enter the domain that you own in the field "Custom domain".
  In my case, this is "plilja.se"
* At your DNS provider enter a CNAME record pointing to your GitHub pages
  URL. In my case, this is "plilja.github.io".
* Enter four A-records pointing to these GitHub IP:s (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153). Some DNS providers don't allow multiple identical
  A-records, in that case, you can just pick any one of the four.
* Wait 10-20 minutes (it takes a while for the DNS-changes to propagate). You
  can see if your changes have propagated here [DNS-checker](https://dnschecker.org/all-dns-records-of-domain.php).
* Once again open the settings on your GitHub pages repository.
  Hopefully, you should now be able to check the "Enforce HTTPS"-checkbox.
  It might be disabled with a message about certificates being generated. In 
  that case, you just need to wait a little bit longer.

The picture below shows what the settings look like at my DNS-provider. I'm using the Swedish
DNS provider [Loopia](https://loopia.se). The TXT-Google record is for 
verification with "Google Search Console". Google will tell you what to
enter there if you try to access "Google Search Console" for your site.

![My DNS settings](/images/dns-settings.jpg "My DNS settings")

Once done all of these URLs (but with your domain name and GitHub username) 
should all lead to the HTTPS-version of your domain.
* [http://plilja.se](http://plilja.se)
* [http://www.plilja.se](http://www.plilja.se)
* [http://plilja.github.io](http://plilja.github.io)
* [https://plilja.se](https://plilja.se)
* [https://www.plilja.se](https://www.plilja.se)
* [https://plilja.github.io](https://plilja.github.io)

Links
* [Documentation](https://docs.github.com/en/free-pro-team@latest/github/working-with-github-pages/configuring-a-custom-domain-for-your-github-pages-site) from GitHub about this

