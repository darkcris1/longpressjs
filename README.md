# Lonpress JS

## Installation

```bash
 npm i longpressjs
```

## Usage

```javascript

import "longpressjs";

const h1 = document.querySelector("h1");
h1.addEventListener("longpress", function (e) {
  console.log(e);
});
```

### If you dont pass a delay the default is 500ms

```javascript
const h1 = document.querySelector("h1");
h1.addEventListener("longpress-1000", function (e) {
  console.log(e);
});
```

### This code is 1000ms delay
