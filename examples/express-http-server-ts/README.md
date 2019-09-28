# Express Example (TypeScript)

Sample project for with [express](https://expressjs.com/).

## Running

Install dependencies.

```bash
$ yarn
```

Run the express app server.

```
$ yarn start
```

Now you can test it through `curl`.

```
$ curl 'http://localhost:3000?a=20&b=30' && curl 'http://localhost:3000?a=10&b=50' && curl 'http://localhost:3000?a=50&b=100'
```

**Output**

```
[ DEBUG ] [ 4d5fc07c ] Received a: 20
[ DEBUG ] [ 4d5fc07c ] Received b: 30
[ INFO  ] [ 4d5fc07c ] Simulating delay
[ DEBUG ] [ 4d5fc07c ] Calculated sum: 2030
[ DEBUG ] [ b3862126 ] Received a: 10
[ DEBUG ] [ b3862126 ] Received b: 50
[ INFO  ] [ b3862126 ] Simulating delay
[ DEBUG ] [ b3862126 ] Calculated sum: 1050
[ DEBUG ] [ 40f72e60 ] Received a: 50
[ DEBUG ] [ 40f72e60 ] Received b: 100
[ INFO  ] [ 40f72e60 ] Simulating delay
[ DEBUG ] [ 40f72e60 ] Calculated sum: 50100
[ INFO  ] [ 4d5fc07c ] Delay end
[ INFO  ] [ b3862126 ] Delay end
[ INFO  ] [ 40f72e60 ] Delay end

```
