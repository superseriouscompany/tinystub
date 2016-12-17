# tinystub

A tiny stub server inspired by the functionality of <a href="https://httpbin.org">httpbin.org</a> for use in black box testing of JSON APIs.

## Usage:

```js
const stub       = require('tinystub');
const stubHandle = stub(3001); // specify port on localhost
```

```bash
#returns 200 with empty body
$ curl http://localhost:3001

# returns 200 with body of {"cool": "nice"}
$ curl -H "Content-Type: application/json" -XPOST http://localhost:3001/somepath -d '{"cool": "nice"}'

# returns 403 with body of {"error": "permission denied"}
$ curl -H "Content-Type: application/json" -XPOST http://localhost:3001/some/nested/path?status=403 -d '{"error": "permission denied"}'
```

```js
console.log(stubHandle.calls.length);  // 3
console.log(stubHandle.calls[0].url);  // http://localhost:3001
console.log(stubHandle.calls[0].body); // null
console.log(stubHandle.calls[1].url);  // http://localhost:3001/somepath
console.log(stubHandle.calls[1].body); // {"cool": "nice"}
console.log(stubHandle.calls[2].url);  // http://localhost:3001/some/nested/path
console.log(stubHandle.calls[2].body); // {"error": "permission denied"}

stubHandle(); // shuts down server
```

Run with `DEBUG=tinystub` to see all requests.
