# Node http Example (TypeScript)

Sample project for async-store with [node-http](https://nodejs.org/api/http.html). 

## Running
Install dependencies. 
```bash
$ yarn
```
Run the http app server. 
```
$ yarn start
```
Now you can test it through `curl`.
```
$ curl 'http://localhost:8000/home?name=Joe' && curl 'http://localhost:8000/home' && curl 'http://localhost:8000/other'
```
**Output**
```
[ INFO  ] [ ab712588 ] Received a request at url: /home
[ INFO  ] [ ab712588 ] Home controller called.
[ DEBUG ] [ ab712588 ] Hi! Joe
[ INFO  ] [ 44d9fd36 ] Received a request at url: /home
[ INFO  ] [ 44d9fd36 ] Home controller called.
[ DEBUG ] [ 44d9fd36 ] Hi! undefined
[ INFO  ] [ b1b178fe ] Received a request at url: /other
[ INFO  ] [ b1b178fe ] Other controller called.

```
