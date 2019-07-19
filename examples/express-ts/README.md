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
Now you can test it through `curl`. Trigger concurrent requests with different ids that are a part of request context.
```
$ curl localhost:3000 -H X-Id:1 && curl localhost:3000 -H X-Id:2 && curl localhost:3000 -H X-Id:3
```
**Output**
```
X-Id received in the middleware: 1
X-Id received in the middleware: 2
X-Id received in the middleware: 3

```
