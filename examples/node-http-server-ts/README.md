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

```
$ curl 'http://localhost:3000?a=20&b=30' && curl 'http://localhost:3000?a=10&b=50' && curl 'http://localhost:3000?a=50&b=100'
```

**Output**

```plain
2019-09-28T11:06:55.803Z [ INFO ] HTTP server listening on port 3000!

2019-09-28T11:06:58.172Z [ DEBUG ] 24751fd0 - Persisted a: 20
2019-09-28T11:06:58.172Z [ DEBUG ] 24751fd0 - Persisted b: 30
2019-09-28T11:06:58.172Z [ DEBUG ] 24751fd0 - Simulating delayed access
2019-09-28T11:06:58.172Z [ DEBUG ] 24751fd0 - Calculated sum: 50
2019-09-28T11:06:58.172Z [ DEBUG ] 24751fd0 - Persisted sum: 50
2019-09-28T11:06:58.174Z [ INFO ] 24751fd0 - Response sent
2019-09-28T11:06:58.186Z [ DEBUG ] 8c52e047 - Persisted a: 10
2019-09-28T11:06:58.186Z [ DEBUG ] 8c52e047 - Persisted b: 50
2019-09-28T11:06:58.186Z [ DEBUG ] 8c52e047 - Simulating delayed access
2019-09-28T11:06:58.186Z [ DEBUG ] 8c52e047 - Calculated sum: 60
2019-09-28T11:06:58.186Z [ DEBUG ] 8c52e047 - Persisted sum: 60
2019-09-28T11:06:58.186Z [ INFO ] 8c52e047 - Response sent
2019-09-28T11:06:58.198Z [ DEBUG ] f184da79 - Persisted a: 50
2019-09-28T11:06:58.198Z [ DEBUG ] f184da79 - Persisted b: 100
2019-09-28T11:06:58.198Z [ DEBUG ] f184da79 - Simulating delayed access
2019-09-28T11:06:58.198Z [ DEBUG ] f184da79 - Calculated sum: 150
2019-09-28T11:06:58.198Z [ DEBUG ] f184da79 - Persisted sum: 150
2019-09-28T11:06:58.198Z [ INFO ] f184da79 - Response sent
2019-09-28T11:07:00.175Z [ INFO ] 24751fd0 - Store contents: {"a":"20","b":"30","sum":50}
2019-09-28T11:07:00.187Z [ INFO ] 8c52e047 - Store contents: {"a":"10","b":"50","sum":60}
2019-09-28T11:07:00.198Z [ INFO ] f184da79 - Store contents: {"a":"50","b":"100","sum":150}
```
