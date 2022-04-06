# Glider.js

A fast, light-weight, dependency free, responsive, accessible, extendable, native scrolling list with paging controls, methods and events. (< 2.8kb gzipped!)

Demos and full documentation available on Github Pages: https://nickpiscitelli.github.io/Glider.js/

##### Quick Start

Include glider.min.css:

```html
<link rel="stylesheet" href="glider.min.css">
or
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/glider-js@1/glider.min.css">
```

Include Glider.js:

```html
<script src="glider.min.js"></script>
or
<script src="https://cdn.jsdelivr.net/npm/glider-js@1/glider.min.js"></script>
```

Example HTML:

```html
<div class="glider">
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

  // `auto` allows automatic responsive
  // width calculations
  slidesToShow: 'auto',
  slidesToScroll: 'auto',

  // should have been named `itemMinWidth`
  // slides grow to fit the container viewport
  // ignored unless `slidesToShow` is set to `auto`
  itemWidth: undefined,

  // if true, slides wont be resized to fit viewport
  // requires `itemWidth` to be set
  // * this may cause fractional slides
  exactWidth: false,

  // speed aggravator - higher is slower
  duration: .5,

  // dot container element or selector
  dots: 'CSS Selector',

  // arrow container elements or selector
  arrows: {
    prev: 'CSS Selector',
    // may also pass element directly
    next: document.querySelector('CSS Selector')
  },

  // allow mouse dragging
  draggable: false,
  // how much to scroll with each mouse delta
  dragVelocity: 3.3,

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
  // how long to wait after scroll event before locking
  // if too low, it might interrupt normal scrolling
  scrollLockDelay: 150,

  // Force centering slide after resize event
  resizeLock: true,

  // Glider.js breakpoints are mobile-first
  responsive: [
    {
      breakpoint: 900,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2
      }
    },
    {
      breakpoint: 575,
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
Glider(document.querySelector(element_path)).setOption({
  name: value,
  ...
});

// optionally call refresh
Glider(document.querySelector(element_path)).refresh();
```

Bind event:

```javascript
document.querySelector(element_path).addEventListener('glider-slide-visible', function(event){
  // `this` is bound to the glider element
  // custom data located at `event.detail`
  // access to Glider object via `Glider(this)`
  ...
});
```

Destroy with:

```javascript
Glider(document.querySelector(element_path)).destroy();
```

#### Install using package managers NPM / YARN

```
$ npm install glider-js
```

```
$ yarn add glider-js
```

#### Browser support

Glider.js should run on all modern browsers. Support for older browser can be achieved by polyfilling `document.classList`, `window.requestAnimationFrame`, `Object.assign` and `CustomEvent`

Include `glider-compat.min.js` to load the aforementioned polyfills

#### Native Scrollbars

Most browsers now support the `scrollbar-width` property allowing us to avoid the messy hack below.

**NOTE:** This feature is marked as experimental and may not work in all browsers.

```
.glider-track {
  scrollbar-width: none;
}
```


Since Glider.js uses native scrolling, the browser wants to apply the standard scrollbar to the glider. In most cases, this is fine since the scrollbar can be hidden with CSS and Glider.js does so when appropriate. In browsers such as Firefox though, the scrollbars cannot be hidden with CSS and require additional markup to hide.

To hide the scrollbars in Firefox, you'll want to wrap your glider with `<div class="glider-wrap">` and apply the following CSS/JS:

```css
@-moz-document url-prefix() {
  .glider-track {
    margin-bottom: 17px;
  }
  .glider-wrap {
    overflow: hidden;
  }
}
```

```javascript
document.addEventListener('glider-loaded', hideFFScrollBars);
document.addEventListener('glider-refresh', hideFFScrollBars);
function hideFFScrollBars(e){
  var scrollbarHeight = 17; // Currently 17, may change with updates
  if(/firefox/i.test(navigator.userAgent)){
    // We only need to appy to desktop. Firefox for mobile uses
    // a different rendering engine (WebKit)
    if (window.innerWidth > 575){
      e.target.parentNode.style.height = (e.target.offsetHeight - scrollbarHeight) + 'px'
    }
  }
}
```

#### Packages using Glider.js :rocket:

- [react-glider](https://www.npmjs.com/package/react-glider) - A react wrapper for Glider.js written in typescript. 

#### Dependencies

None :)

#### License

Copyright (c) 2018 Nick Piscitelli

Licensed under the MIT license.

It's all yours.
