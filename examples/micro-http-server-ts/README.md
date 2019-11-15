# Micro Example (TypeScript)

Sample project for with [micro](https://github.com/zeit/micro).

## Running

Install dependencies.

```bash
$ yarn
```

Run the Micro app server.

```
$ yarn start
```

Now you can test it through `curl`.

```
$ curl 'http://localhost:3000?a=20&b=30' && curl 'http://localhost:3000?a=10&b=50' && curl 'http://localhost:3000?a=50&b=100'
```

**Output**

```
2019-09-28T11:08:35.261Z [ INFO ] HTTP server listening on port 3000!

2019-09-28T11:08:39.987Z [ DEBUG ] f1aa3c12 - Persisted a: 20
2019-09-28T11:08:39.987Z [ DEBUG ] f1aa3c12 - Persisted b: 30
2019-09-28T11:08:39.988Z [ DEBUG ] f1aa3c12 - Simulating delayed access
2019-09-28T11:08:39.988Z [ DEBUG ] f1aa3c12 - Calculated sum: 50
2019-09-28T11:08:39.988Z [ DEBUG ] f1aa3c12 - Persisted sum: 50
2019-09-28T11:08:39.991Z [ INFO ] f1aa3c12 - Response sent
2019-09-28T11:08:40.003Z [ DEBUG ] 81992355 - Persisted a: 10
2019-09-28T11:08:40.003Z [ DEBUG ] 81992355 - Persisted b: 50
2019-09-28T11:08:40.003Z [ DEBUG ] 81992355 - Simulating delayed access
2019-09-28T11:08:40.003Z [ DEBUG ] 81992355 - Calculated sum: 60
2019-09-28T11:08:40.003Z [ DEBUG ] 81992355 - Persisted sum: 60
2019-09-28T11:08:40.003Z [ INFO ] 81992355 - Response sent
2019-09-28T11:08:40.014Z [ DEBUG ] 66fe2219 - Persisted a: 50
2019-09-28T11:08:40.014Z [ DEBUG ] 66fe2219 - Persisted b: 100
2019-09-28T11:08:40.014Z [ DEBUG ] 66fe2219 - Simulating delayed access
2019-09-28T11:08:40.015Z [ DEBUG ] 66fe2219 - Calculated sum: 150
2019-09-28T11:08:40.015Z [ DEBUG ] 66fe2219 - Persisted sum: 150
2019-09-28T11:08:40.015Z [ INFO ] 66fe2219 - Response sent
2019-09-28T11:08:41.988Z [ INFO ] f1aa3c12 - Store contents: {"a":"20","b":"30","sum":50}
2019-09-28T11:08:42.003Z [ INFO ] 81992355 - Store contents: {"a":"10","b":"50","sum":60}
2019-09-28T11:08:42.015Z [ INFO ] 66fe2219 - Store contents: {"a":"50","b":"100","sum":150}
```
