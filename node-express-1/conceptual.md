### Conceptual Exercise

Answer the following questions below:

- What are some ways of managing asynchronous code in JavaScript?
  
callbacks, Promises like .then/.catch, async/await, Promise.all/any/allSettled, event emitters/streams


- What is a Promise?

A placeholder for a value that will be available later, with states pending to fulfilled / rejected, and a .then/.catch API to compose async flows.

- What are the differences between an async function and a regular function?

async functions always return a Promise; you can await inside them to pause until a Promise settles. Regular functions return immediate values and cannot await.

- What is the difference between Node.js and Express.js?

Node is the JS runtime + stdlib for server-side code. Express is a web framework on top of Node for routing, middleware, and HTTP utilities.

- What is the error-first callback pattern?

Node style callbacks like (err, data) => { ... } where err is non-null on failure; used to propagate errors via callbacks.

- What is middleware?

software that acts as a bridge between an operating system or database and applications, especially on a network.

- What does the `next` function do?

In Express, next(err) hands control to the next middleware; passing an err triggers the error-handling middleware.

- What are some issues with the following code? (consider all aspects: performance, structure, naming, etc)


```js
async function getUsers() {
  const elie = await $.getJSON('https://api.github.com/users/elie');
  const joel = await $.getJSON('https://api.github.com/users/joelburton');
  const matt = await $.getJSON('https://api.github.com/users/mmmaaatttttt');

  return [elie, matt, joel];
}
```
Requests run sequentially which is slower than necessary. Use Promise.all([...]) for concurrency

Has no Error Handling, a bad or rejected fetch will throw and be unhandled

Order in return array is odd vs declaration (maintain consistent order)

Uses jQuery in Node-ish example

Possible GitHub rate limits / missing 404 handling.