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
[ DEBUG ] [ 445ef6fb ] Received a: 20
[ DEBUG ] [ 445ef6fb ] Received b: 30
[ INFO ] [ 445ef6fb ] Simulating Delay
[ DEBUG ] [ 445ef6fb ] Calculated sum: 50
[ DEBUG ] [ b4c27a00 ] Received a: 10
[ DEBUG ] [ b4c27a00 ] Received b: 50
[ INFO ] [ b4c27a00 ] Simulating Delay
[ DEBUG ] [ b4c27a00 ] Calculated sum: 60
[ DEBUG ] [ a24d4281 ] Received a: 50
[ DEBUG ] [ a24d4281 ] Received b: 100
[ INFO ] [ a24d4281 ] Simulating Delay
[ DEBUG ] [ a24d4281 ] Calculated sum: 150

```
