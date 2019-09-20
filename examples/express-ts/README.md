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
[ INFO ] [ 4456b3a2-5362-4302-9897-e0be27e6a6c6 ] X-Id received in the middleware: 1
[ INFO ] [ 3da70b7d-d580-46f3-9768-76bdb40fb827 ] X-Id received in the middleware: 2
[ INFO ] [ 480d1b23-fdd4-4d26-92ed-7258d258bf4f ] X-Id received in the middleware: 3
[ INFO ] [ 4456b3a2-5362-4302-9897-e0be27e6a6c6 ] Request context: 1
[ INFO ] [ 3da70b7d-d580-46f3-9768-76bdb40fb827 ] Request context: 2
[ INFO ] [ 480d1b23-fdd4-4d26-92ed-7258d258bf4f ] Request context: 3

```
