# Glider.js
-------

A fast, light-weight, responsive free-flowing list with paging controls.

Demos and full documentation available on Github Pages: https://nickpiscitelli.github.io/Glider.js/

##### Quick Start

Include glider.min.css:

```html
<link rel="stylesheet" type="text/css" href="glider.min.css"/>
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
  slidesToShow: 6,
  slidesToScroll: 6,
  duration: .75,
  equalHeight: true,
  scrollPropagate: false,
  eventPropagate: true,
  easing: function (x, t, b, c, d) {
    return c*(t/=d)*t + b;
  },
  dots: '#dots-content',
  arrows: {
    prev: '#glider-prev-content',
    next: '#glider-next-content'
  },
  
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

Glider.js should run on all modern browsers. Support for older browser can be achieved by polyfilling `document.classList`, `window.requestAnimationFrame` and `CustomEvent`

#### Dependencies

None :)

#### License

Copyright (c) 2018 Nick Piscitelli

Licensed under the MIT license.

It's all yours.
