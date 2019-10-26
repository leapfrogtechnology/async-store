# Koa Example (JavaScript)

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
2019-10-26T08:42:23.335Z [ INFO ] HTTP server listening on port 3000!

2019-10-26T08:42:31.037Z [ DEBUG ] f45b64f0 - Persisted a: 20
2019-10-26T08:42:31.037Z [ DEBUG ] f45b64f0 - Persisted b: 30
2019-10-26T08:42:31.038Z [ DEBUG ] f45b64f0 - Simulating delayed access
2019-10-26T08:42:31.039Z [ DEBUG ] f45b64f0 - Calculated sum: 50
2019-10-26T08:42:31.039Z [ DEBUG ] f45b64f0 - Persisted sum: 50
2019-10-26T08:42:31.042Z [ INFO ] f45b64f0 - Response sent
2019-10-26T08:42:31.078Z [ DEBUG ] f5d8bbdb - Persisted a: 10
2019-10-26T08:42:31.079Z [ DEBUG ] f5d8bbdb - Persisted b: 50
2019-10-26T08:42:31.079Z [ DEBUG ] f5d8bbdb - Simulating delayed access
2019-10-26T08:42:31.079Z [ DEBUG ] f5d8bbdb - Calculated sum: 60
2019-10-26T08:42:31.079Z [ DEBUG ] f5d8bbdb - Persisted sum: 60
2019-10-26T08:42:31.079Z [ INFO ] f5d8bbdb - Response sent
2019-10-26T08:42:31.100Z [ DEBUG ] 9f06d9ba - Persisted a: 50
2019-10-26T08:42:31.100Z [ DEBUG ] 9f06d9ba - Persisted b: 100
2019-10-26T08:42:31.100Z [ DEBUG ] 9f06d9ba - Simulating delayed access
2019-10-26T08:42:31.100Z [ DEBUG ] 9f06d9ba - Calculated sum: 150
2019-10-26T08:42:31.100Z [ DEBUG ] 9f06d9ba - Persisted sum: 150
2019-10-26T08:42:31.101Z [ INFO ] 9f06d9ba - Response sent
2019-10-26T08:42:33.039Z [ INFO ] f45b64f0 - Store contents: {"a":"20","b":"30","sum":50}
2019-10-26T08:42:33.080Z [ INFO ] f5d8bbdb - Store contents: {"a":"10","b":"50","sum":60}
2019-10-26T08:42:33.106Z [ INFO ] 9f06d9ba - Store contents: {"a":"50","b":"100","sum":150}

```