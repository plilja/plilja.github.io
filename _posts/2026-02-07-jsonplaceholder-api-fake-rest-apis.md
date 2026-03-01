---
layout: post
title: JSONPlaceholder API, Fake REST APIs
tags: [tools]
keywords: [jsonplaceholder, jsonplaceholder-api, api, rest-api, api-mocking, json-server, frontend-development, mock-server]
---

[_JSONPlaceholder API_](https://jsonplaceholder.typicode.com), also known as JSON Placeholder, 
is a tool for rapidly creating fake REST APIs. To be precise,
it's a public hosting of the tool [_json-server_](https://github.com/typicode/json-server).

You might have encountered a scenario where your frontend and your backend are
developed by different people. Typically, this will happen if you are not working 
in a cross-functional team.

A common approach, if you have this problem, is to agree on an API design beforehand. 
Then, in an ideal world, the frontend team and the backend team can build their respective
code independent of each other. 

The backend team can start before the frontend team. However, the risk is that once
the frontend team starts, they discover issues with the API design that wasn't predicted
upfront.

The frontend team might struggle to start without the backend work, as no API is available to call yet.
This is where a tool like JSONPlaceholder or _json-server_ comes in.
You use it to fake an API that is not yet implemented. 

JSON Placeholder API is very easy to set up. It doesn't require any registration
or configuration. You can use either the online version if you are ok with exposing
your API structure on GitHub. Or you can use `json-server` to host it locally.

## JSONPlaceholder API - Example

For example, let's say that we are building an API for an e-commerce site.

If you create a JSON file like the following.

{% highlight json %} 
{
  "products": [
    {
      "id": "1",
      "title": "Wireless Headphones",
      "price": 89.99,
      "tags": [
        "audio",
        "bluetooth",
        "tech"
      ]
    },
    {
      "id": "2",
      "title": "Leather Journal",
      "price": 24.50,
      "tags": [
        "office",
        "paper"
      ]
    }
  ],
  "reviews": [
    {
      "id": 1,
      "productId": "1",
      "user": "Alice",
      "rating": 5,
      "comment": "Amazing sound quality!"
    }
  ]
}
{% endhighlight %}

Then you can access a fake API that exposes this JSON file as a REST API in two ways.

## Hosting your fake REST API using public JSONPlaceholder API server

Upload your JSON database to a public GitHub repository, name it `db.json`, and put it in the
root of the repository.

For example, I have uploaded the file from above here:

[https://github.com/plilja/jsonplaceholder-api-example](https://github.com/plilja/jsonplaceholder-api-example)

You can access the fake API using the public JSON Placeholder API server:

[https://my-json-server.typicode.com/plilja/jsonplaceholder-example](https://my-json-server.typicode.com/plilja/jsonplaceholder-example)

For example, the following URLs should work:

* `GET /products`
* `GET /products/1`
* `GET /reviews`
* `GET /reviews/1`
* `GET /reviews?productId=1`
* `GET /products/1/reviews`
* `GET /products?category=books`
* `POST /products`
* `PUT /products`
* `DELETE /products`
* `POST /reviews`
* `PUT /reviews`
* `DELETE /reviews`

Please note that if you use public hosting, the `POST`, `PUT`, and `DELETE`
endpoints will not persist the data. It might seem like that makes them pointless,
but it does make it possible for a frontend developer to implement
the submission functionality of a form.

## Hosting your fake REST API using a private server

If you want to keep your data private, you can also run it locally using json-server and node.
Running locally also gives you the added benefit of the `POST`, `PUT`, and `DELETE`
methods actually persisting data.

Assuming you have the `db.json` file on your file system. Issue the following 
command to start the server on port 3000:

{% highlight bash %} 
npx json-server --watch db.json --port 3000 
{% endhighlight %}

Now, if you issue this command:

{% highlight bash %} 
curl -X POST http://localhost:3000/reviews \
     -H "Content-Type: application/json" \
     -d '{
          "productId": "1", 
          "user": "Niklas",
          "rating": 2,
          "comment": "Poor connectivity!"             
         }'
{% endhighlight %}

You should be able to see the new review on the `GET /reviews` endpoint.

## Testing error scenarios

There are several tricks you can use to test error scenarios. The most flexible
is to write a small wrapper around json-server where you can inject errors.

If you place the following in a file named `server.js`. 

{% highlight javascript %}

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);

let enqueueError = false;

server.post('/enqueue-error', (req, res) => {
  enqueueError = true;
  res.json({ status: 'Next request will return 500' });
});

server.use((req, res, next) => {
  if (Math.random() < 0.1) {
    console.log("Option 1, use randomness, 1/10 requests will give 500 response");
    res.status(500).json({ error: 'Random failure' });
    return;
  }
  if (req.query.forceError) {
    console.log("Option 2, use query parameter, /products?forceError=500 would give a 500 response");
    res.status(parseInt(req.query.forceError)).json({ error: `Forced error ${req.query.forceError}` });
    return;
  }
  if (Math.random() < 0.2) {
    console.log("Option 3, random slowness, 1/5 requests will take 5 seconds");
    setTimeout(() => {
      next();
    }, 5000);
    return;
  }
  if (enqueueError) {
    enqueueError = false;
    console.log("Option 4, error is enqueued");
    res.status(500).json({ error: "Error was enqueued" });
    return;
  }
  next();
});

server.use(router);

server.listen(3000, () => {
  console.log('JSON Server running on port 3000');
});

{% endhighlight %}

Then you can start it like:

{% highlight bash %}
> npm init -y
> npm install json-server@0.17.4
> node server.js
{% endhighlight %}

Then you will have a server running on http://localhost:3000 that sometimes returns errors.
There are of course, more creative ways to inject errors than the ones I listed above.

## What About CORS?

Browsers block requests to unknown domains unless those servers explicitly
allow them. Otherwise, one could steal information from your session if you could
inject some malicious JavaScript onto a page. 

For a test server, you don't want this block. However, json-server and JSONPlaceholder API are setup
to allow cross-site from wildcard origins.

