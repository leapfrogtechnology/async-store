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
$ curl 'http://localhost:3000?a=20&b=30' && curl 'http://localhost:3000?a=10&b=50' && curl 'http://localhost:3000?a=50&b=100'
```
**Output**
```
[ DEBUG ] [ 006a0e32 ] Received a: 20
[ DEBUG ] [ 006a0e32 ] Received b: 30
[ INFO ] [ 006a0e32 ] Simulating Delay
[ DEBUG ] [ 006a0e32 ] Calculated sum: 50
[ DEBUG ] [ 0ffd1142 ] Received a: 10
[ DEBUG ] [ 0ffd1142 ] Received b: 50
[ INFO ] [ 0ffd1142 ] Simulating Delay
[ DEBUG ] [ 0ffd1142 ] Calculated sum: 60
[ DEBUG ] [ 2fa186b9 ] Received a: 50
[ DEBUG ] [ 2fa186b9 ] Received b: 100
[ INFO ] [ 2fa186b9 ] Simulating Delay
[ DEBUG ] [ 2fa186b9 ] Calculated sum: 150
[ INFO ] [ 006a0e32 ] Delay end.
[ INFO ] [ 0ffd1142 ] Delay end.
[ INFO ] [ 2fa186b9 ] Delay end.

```
