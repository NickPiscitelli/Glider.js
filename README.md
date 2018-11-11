# Glider.js

A fast, light-weight, dependency free, responsive, native scrolling list with paging controls. (2.1kb gzipped!)

* Please refer to the website for the most up to date documentation for the time being.

Demos and full documentation available on Github Pages: https://nickpiscitelli.github.io/Glider.js/

##### Quick Start

Include glider.min.css:

```html
<link href="glider.min.css" rel="stylesheet" type="text/css">
```

Include Glider.js:

```html
<script src="glider.min.js"></script>
```

Example HTML:

```html
<div>
  <div> 1 </div>
  <div> 2 </div>
  <div> 3 </div>
  <div> 4 </div>
  <div> 5 </div>
  <div> 6 </div>
</div>
```

Glider.js Initialization

```javascript
new Glider(document.querySelector('.glider'));
```

Glider.js Initialization w/ full options:

```javascript
new Glider(document.querySelector('.glider'), {
  slidesToShow: 1,
  slidesToScroll: 1,
  duration: .5,
  dots: '.glider-dots',
  arrows: {
    prev: '.glider-prev',
    next: '.glider-next'
  },

  // use any custom easing function
  // compatible with most easing plugins
  easing: function (x, t, b, c, d) {
    return c*(t/=d)*t + b;
  },

  // event control
  scrollPropagate: false,
  eventPropagate: true,

  // Force centering slide after scroll event
  scrollLock: false,

  // Glider.js breakpoints are mobile-first
  // be conscious of your ordering
  responsive: [
    {
      breakpoint: 575,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3
      }
    }
  ]
});
 ```

Change options:

```javascript
document.querySelector(element_path)._glider.setOption({
  name: value,
  ...
});
```

Bind event:

```javascript
document.querySelector(element_path).addEventListener('glider-slide-visible', function(event){
  // `this` is bound to the glider object
  ...
});
```

Destroy with:

```javascript
document.querySelector(element_path)._glider.destroy();
```

#### Browser support

Glider.js should run on all modern browsers. Support for older browser can be achieved by polyfilling `document.classList`, `window.requestAnimationFrame`, `Object.assign` and `CustomEvent`

#### Dependencies

None :)

#### License

Copyright (c) 2018 Nick Piscitelli

Licensed under the MIT license.

It's all yours.
