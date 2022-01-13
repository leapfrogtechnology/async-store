# Fastify Example (TypeScript)

Sample project for with [Fastify](https://www.fastify.io/).

## Running

Install dependencies.

```bash
$ yarn
```

Run the fastify server.

```
$ yarn start
```

Now you can test it through `curl`.

```
$ curl 'http://localhost:3000?a=20&b=30' && curl 'http://localhost:3000?a=10&b=50' && curl 'http://localhost:3000?a=50&b=100'
```

**Output**

```JSON
{"level":30,"time":1642077995342,"pid":652861,"hostname":"pop-os","msg":"Server is listening at 3000"}
{"level":30,"time":1642078016167,"pid":652861,"hostname":"pop-os","reqId":"req-1","req":{"method":"GET","url":"/?a=20&b=30","hostname":"localhost:3000","remoteAddress":"127.0.0.1","remotePort":54584},"msg":"incoming request"}
{"level":30,"time":1642078016168,"pid":652861,"hostname":"pop-os","msg":"Persisted a: 20"}
{"level":30,"time":1642078016169,"pid":652861,"hostname":"pop-os","msg":"Persisted b: 30"}
{"level":30,"time":1642078018172,"pid":652861,"hostname":"pop-os","msg":"Store contents: {\"a\":\"20\",\"b\":\"30\"}"}
{"level":30,"time":1642078018173,"pid":652861,"hostname":"pop-os","msg":"Persisted sum: 50"}
{"level":30,"time":1642078018190,"pid":652861,"hostname":"pop-os","reqId":"req-1","msg":"Response Sent"}
{"level":30,"time":1642078018193,"pid":652861,"hostname":"pop-os","reqId":"req-1","res":{"statusCode":200},"responseTime":2025.341871023178,"msg":"request completed"}
{"level":30,"time":1642078031470,"pid":652861,"hostname":"pop-os","reqId":"req-2","req":{"method":"GET","url":"/?a=10&b=50","hostname":"localhost:3000","remoteAddress":"127.0.0.1","remotePort":54586},"msg":"incoming request"}
{"level":30,"time":1642078031470,"pid":652861,"hostname":"pop-os","msg":"Persisted a: 10"}
{"level":30,"time":1642078031470,"pid":652861,"hostname":"pop-os","msg":"Persisted b: 50"}
{"level":30,"time":1642078033471,"pid":652861,"hostname":"pop-os","msg":"Store contents: {\"a\":\"10\",\"b\":\"50\"}"}
{"level":30,"time":1642078033471,"pid":652861,"hostname":"pop-os","msg":"Persisted sum: 60"}
{"level":30,"time":1642078033472,"pid":652861,"hostname":"pop-os","reqId":"req-2","msg":"Response Sent"}
{"level":30,"time":1642078033472,"pid":652861,"hostname":"pop-os","reqId":"req-2","res":{"statusCode":200},"responseTime":2002.4138559997082,"msg":"request completed"}
{"level":30,"time":1642078041935,"pid":652861,"hostname":"pop-os","reqId":"req-3","req":{"method":"GET","url":"/?a=50&b=100","hostname":"localhost:3000","remoteAddress":"127.0.0.1","remotePort":54588},"msg":"incoming request"}
{"level":30,"time":1642078041936,"pid":652861,"hostname":"pop-os","msg":"Persisted a: 50"}
{"level":30,"time":1642078041936,"pid":652861,"hostname":"pop-os","msg":"Persisted b: 100"}
{"level":30,"time":1642078043937,"pid":652861,"hostname":"pop-os","msg":"Store contents: {\"a\":\"50\",\"b\":\"100\"}"}
{"level":30,"time":1642078043937,"pid":652861,"hostname":"pop-os","msg":"Persisted sum: 150"}
{"level":30,"time":1642078043938,"pid":652861,"hostname":"pop-os","reqId":"req-3","msg":"Response Sent"}
{"level":30,"time":1642078043939,"pid":652861,"hostname":"pop-os","reqId":"req-3","res":{"statusCode":200},"responseTime":2003.156497001648,"msg":"request completed"}
```
