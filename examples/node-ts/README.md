# Basic HTTP Server (TypeScript)

Sample http server in node and typescript using async-store.

## Running

Install dependencies.

```bash
$ yarn
```

Run the http app server.

```bash
$ yarn start
```

Now you can test it through `curl`.

```bash
$ curl 'http://localhost:8000?a=20&b=30' && curl 'http://localhost:8000?a=10&b=50' && curl 'http://localhost:8000?a=50&b=100'
```

**Output**

```plain
[ DEBUG ] [ acd04c5b ] Received a: 20
[ DEBUG ] [ acd04c5b ] Received b: 30
[ INFO  ] [ acd04c5b ] Simulating delay
[ DEBUG ] [ acd04c5b ] Calculated sum: 50
[ DEBUG ] [ ece2ec66 ] Received a: 10
[ DEBUG ] [ ece2ec66 ] Received b: 50
[ INFO  ] [ ece2ec66 ] Simulating delay
[ DEBUG ] [ ece2ec66 ] Calculated sum: 60
[ DEBUG ] [ 0964953f ] Received a: 50
[ DEBUG ] [ 0964953f ] Received b: 100
[ INFO  ] [ 0964953f ] Simulating delay
[ DEBUG ] [ 0964953f ] Calculated sum: 150
[ INFO  ] [ acd04c5b ] Delay end
[ INFO  ] [ ece2ec66 ] Delay end
[ INFO  ] [ 0964953f ] Delay end
```
