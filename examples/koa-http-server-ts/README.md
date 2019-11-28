# Koa Example (TypeScript)

Sample project for with [koa](https://koajs.com//).

## Running

Install dependencies.

```bash
$ yarn
```

Run the koa app server.

```
$ yarn start
```

Now you can test it through `curl`.

```
$ curl 'http://localhost:3000?a=20&b=30' && curl 'http://localhost:3000?a=10&b=50' && curl 'http://localhost:3000?a=50&b=100'
```

**Output**

```
2019-11-28T06:50:55.665Z [ INFO ] HTTP server listening on port 3000!

2019-11-28T06:53:31.500Z [ DEBUG ] 36d05498 - Persisted a: 20
2019-11-28T06:53:31.500Z [ DEBUG ] 36d05498 - Persisted b: 30
2019-11-28T06:53:31.500Z [ DEBUG ] 36d05498 - Simulating delayed access
2019-11-28T06:53:31.501Z [ DEBUG ] 36d05498 - Calculated sum: 50
2019-11-28T06:53:31.501Z [ DEBUG ] 36d05498 - Persisted sum: 50
2019-11-28T06:53:31.503Z [ INFO ] 36d05498 - Response sent
2019-11-28T06:53:31.525Z [ DEBUG ] e65f3631 - Persisted a: 10
2019-11-28T06:53:31.525Z [ DEBUG ] e65f3631 - Persisted b: 50
2019-11-28T06:53:31.525Z [ DEBUG ] e65f3631 - Simulating delayed access
2019-11-28T06:53:31.525Z [ DEBUG ] e65f3631 - Calculated sum: 60
2019-11-28T06:53:31.525Z [ DEBUG ] e65f3631 - Persisted sum: 60
2019-11-28T06:53:31.525Z [ INFO ] e65f3631 - Response sent
2019-11-28T06:53:31.541Z [ DEBUG ] 4b0a6a00 - Persisted a: 50
2019-11-28T06:53:31.541Z [ DEBUG ] 4b0a6a00 - Persisted b: 100
2019-11-28T06:53:31.541Z [ DEBUG ] 4b0a6a00 - Simulating delayed access
2019-11-28T06:53:31.541Z [ DEBUG ] 4b0a6a00 - Calculated sum: 150
2019-11-28T06:53:31.541Z [ DEBUG ] 4b0a6a00 - Persisted sum: 150
2019-11-28T06:53:31.542Z [ INFO ] 4b0a6a00 - Response sent
2019-11-28T06:53:33.502Z [ INFO ] 36d05498 - Store contents: {"a":"20","b":"30","sum":50}
2019-11-28T06:53:33.525Z [ INFO ] e65f3631 - Store contents: {"a":"10","b":"50","sum":60}
2019-11-28T06:53:33.542Z [ INFO ] 4b0a6a00 - Store contents: {"a":"50","b":"100","sum":150}

```
