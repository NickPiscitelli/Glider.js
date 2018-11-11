/*
    _____ __ _     __                _
   / ___// /(_)___/ /___  ____      (_)___
  / (_ // // // _  // -_)/ __/_    / /(_-<
  \___//_//_/ \_,_/ \__//_/  (_)__/ //___/
                              |___/

  Version: 1.5
  Author: Nick Piscitelli (pickykneee)
  Website: https://nickpiscitelli.com
  Documentation: http://nickpiscitelli.github.io/Glider.js
  License: MIT License
  Release Date: October 25th, 2018
  Last Update: November 10th, 2018
*/

(function() {
  'use strict';

  var Glider = window.Glider = (function() {

    function Glider(element, settings) {

        var _ = this;

        if (element._glider)  return element._glider;

        _.ele = element
        _.ele.classList.add('glider');

        // expose glider object to its DOM element
        _.ele._glider = _

        // merge user setting with defaults
        _.opt = Object.assign({}, {
          slidesToScroll: 1,
          slidesToShow: 1,
          duration: .5,
          // easeInQuad
          easing: function (x, t, b, c, d) {
            return c*(t/=d)*t + b;
          }
      }, settings);

        // set defaults
        _.aIndex = _.page = _.slide = 0;
        _.arrows = {};

        // preserve original options to
        // extend breakpoint settings
        _._opt =  _.opt;

        // create track and wrap slides
        _.track = document.createElement('div');
        _.track.className = 'glider-track';
        _.ele.appendChild(_.track)
        while (_.ele.children.length !== 1){
          _.track.appendChild(_.ele.children[0])
        }

        // calculate list dimensions
        _.init();

        // set events
        _.ele.classList.toggle('draggable', _.opt.draggable === true)
        if (_.opt.draggable){
          _.mouseup = function(){
            _.mouseDown = undefined;
            _.ele.classList.remove('drag');
          }
          _.ele.addEventListener('mouseup', _.mouseup);
          _.ele.addEventListener('mouseleave', _.mouseup);
          _.ele.addEventListener('mousedown',function(e){
            _.mouseDown = e.clientX;
            _.ele.classList.add('drag');
          });
          _.ele.addEventListener('mousemove', _.handleMouse.bind(_));
        }
        _.resize = _.init.bind(_, true);
        _.ele.addEventListener('scroll', _.updateControls.bind(_))
        window.addEventListener('resize', _.resize);
    }

    return Glider;

  }());

  var gliderPrototype = Glider.prototype;
  gliderPrototype.init = function(refresh, paging) {

    var _ = this,
      width = 0, height = 0;

    _.slides = _.track.children;

    [].forEach.call(_.slides, function(_){
      _.classList.add('glider-slide');
    });

    _.containerWidth = _.ele.clientWidth;

    var breakpointChanged = _.settingsBreakpoint();
    if (!paging) paging = breakpointChanged;

    if (_.opt.slidesToShow === 'auto'){
      _.opt.slidesToShow = Math.floor(_.containerWidth / _.opt.itemWidth);
    }
    if (_.opt.slidesToScroll === 'auto'){
      _.opt.slidesToScroll = _.opt.slidesToShow;
    }

    _.itemWidth = _.containerWidth / _.opt.slidesToShow;

    // set slide dimensions
    [].forEach.call(_.slides, function(__){
        __.style.height = 'auto';
        __.style.width = _.itemWidth + 'px';
        width += _.itemWidth;
        height = Math.max(__.offsetHeight, height);
    });

    _.track.style.width = width + 'px';
    _.trackWidth = width;

    // rebuild paging controls when settings changed
    if (!refresh || paging){
      _.bindArrows();
      _.buildDots();
      _.updateControls();
    }

    _.event(refresh ? 'refresh ' : 'loaded')
  };

  gliderPrototype.buildDots = function(){
    var _ = this;

    if (!_.opt.dots){
      if (_.dots) _.dots.innerHTML = '';
      return;
    }

    if (typeof _.opt.dots === 'string') _.dots = document.querySelector(_.opt.dots)
    else  _.dots = _.opt.dots
    if (!_.dots)  return;

    _.dots.innerHTML = '';
    _.dots.className = 'glider-dots';

    for (var i = 0; i < Math.ceil(_.slides.length / _.opt.slidesToShow); ++i){
      var li = document.createElement(_.opt.dotTag || 'i');
      li.setAttribute('data-index', i);
      li.className = 'glider-dot '+(i ? '' : 'active');
      li.addEventListener('click',_.scrollItem.bind(_, i, true))
      _.dots.appendChild(li);
    }
  }

  gliderPrototype.bindArrows = function(){
    var _ = this;
    if (!_.opt.arrows)  return
    ['prev','next'].forEach(function(direction){
      var arrow = _.opt.arrows[direction]
      if (arrow){
        if (typeof arrow === 'string')  arrow = document.querySelector(arrow);
        arrow._func = arrow._func || _.scrollItem.bind(_, direction)
        arrow.removeEventListener('click', arrow._func)
        arrow.addEventListener('click', arrow._func)
        _.arrows[direction] = arrow;
      }
    });
  }

  gliderPrototype.updateControls = function(event){
    var _ = this

    if (event && !_.opt.scrollPropagate){
      event.stopPropagation();
    }

    var disableArrows = _.containerWidth >= _.trackWidth;

    if (_.arrows.prev) _.arrows.prev.classList.toggle('disabled', _.ele.scrollLeft <= 0 || disableArrows)
    if (_.arrows.next) _.arrows.next.classList.toggle('disabled', _.ele.scrollLeft + _.containerWidth >=  Math.floor(_.trackWidth) || disableArrows)

    _.slide = Math.round(_.ele.scrollLeft / _.itemWidth);
    _.page = Math.round(_.ele.scrollLeft / _.containerWidth);

    var middle =  _.slide + Math.floor(Math.floor(_.opt.slidesToShow) / 2),
      extraMiddle = Math.floor(_.opt.slidesToShow) % 2 ? 0 : middle + 1;
    if ( Math.floor(_.opt.slidesToShow) == 1){
      extraMiddle = 0;
    }

    if (_.ele.scrollLeft + _.containerWidth >= Math.floor(_.trackWidth)){
      _.page = _.dots ? _.dots.children.length - 1 : 0;
      _.slide = _.slides.length - _.opt.slidesToShow;
    }

    [].forEach.call(_.slides,function(slide,index){
      var
        slideClasses = slide.classList,
        wasVisible = slideClasses.contains('visible'),
        start = _.ele.scrollLeft,
        end = _.ele.scrollLeft + _.containerWidth,
        itemStart = _.itemWidth * index,
        itemEnd = itemStart + _.itemWidth;

      slideClasses.forEach(function(className){
        /^left|right/.test(className) && slideClasses.remove(className)
      });
      slideClasses.toggle('active', _.slide === index)
      if (middle == index || (extraMiddle && (extraMiddle == index))){
        slideClasses.add('center');
      } else {
        slideClasses.remove('center');
        slideClasses.add([
          index < middle ? 'left' : 'right',
          Math.abs(index - (index < middle ? middle : (extraMiddle || middle)))
        ].join('-'))
      }

      var isVisible = itemStart >= start && itemEnd <= end;
      slideClasses.toggle('visible', isVisible);
      if (isVisible != wasVisible){
        _.event('slide-' +(isVisible ? 'visible' : 'hidden'), {
          slide: index
        })
      }
    })
    if (_.dots) [].forEach.call(_.dots.children,function(dot,index){
      dot.classList.toggle('active', _.page === index)
    })

    if (event && _.opt.scrollLock){
      clearTimeout(_.scrollLock);
      _.scrollLock = setTimeout(function(){
        clearTimeout(_.scrollLock);
        if ((_.ele.scrollLeft / _.itemWidth) % 1){
          _.scrollItem(_.round(_.ele.scrollLeft / _.itemWidth))
        }
      }, _.opt.scrollLockDelay || 250)
    }
  }

  gliderPrototype.scrollItem = function(slide, dot, e){
    if(e)   e.preventDefault();

    var _ = this, originalSlide = slide;
    _.aIndex++;

    if (dot === true) {
      slide = slide * _.containerWidth
    } else {
      if (typeof slide === 'string') {
        var backwards = slide === 'prev';

        // use precise location if fractional slides are on
        if (_.opt.slidesToScroll % 1 || _.opt.slidesToShow % 1){
          slide = _.round(_.ele.scrollLeft / _.itemWidth)
        } else {
          slide = _.slide;
        }

        if (backwards) slide -= _.opt.slidesToScroll;
        else  slide += _.opt.slidesToScroll;

      }
      slide = Math.max(Math.min(slide, _.slides.length), 0)
      _.slide = slide;
      slide = _.itemWidth * slide
    }

    _.scrollTo(
      slide,
      _.opt.duration * (Math.abs(_.ele.scrollLeft - slide)),
      function() {
        _.updateControls();
        _.event('animated',{
          value: originalSlide,
          type: typeof originalSlide === 'string' ? 'arrow' :
            dot ? 'dot' : 'slide'
        })
      });

    return false;
  }

  gliderPrototype.settingsBreakpoint = function(){
    var _ = this, resp = _._opt.responsive;
    if (resp){
      for (var i = 0; i < resp.length;++i){
        var size = resp[i];
        if (window.innerWidth > size.breakpoint){
          _.opt = Object.assign({}, _._opt, size.settings);
          return true;
        }
      }
    }
    return false;
  }

  gliderPrototype.scrollTo = function(scrollTarget, scrollDuration, callback) {
    var
      _ = this,
      start = new Date().getTime(),
      animateIndex = _.aIndex,
      animate = function(){
        var now = (new Date().getTime() - start);
        _.ele.scrollLeft = _.ele.scrollLeft + (scrollTarget - _.ele.scrollLeft) * _.opt.easing(0, now, 0, 1, scrollDuration);
        if(now < scrollDuration && animateIndex == _.aIndex){
          window.requestAnimationFrame(animate);
        } else {
          _.ele.scrollLeft = scrollTarget
          callback && callback.call(_)
        }
      };

    window.requestAnimationFrame(animate);
  }

  gliderPrototype.removeItem = function(index){
    var _ = this

    if (_.slides.length){
      _.track.removeChild(_.slides[index]);
      _.init(true, true);
      _.event('remove')
    }
  }

  gliderPrototype.addItem = function(ele){
    var _ = this

    _.track.appendChild(ele);
    _.init(true, true);
    _.event('add')
  }

  gliderPrototype.handleMouse = function(e){
    var _ = this
    if (_.mouseDown){
      _.ele.scrollLeft += (_.mouseDown -  e.clientX) * (_.opt.dragVelocity || 3.3);
      _.mouseDown = e.clientX
    }
  }

  // used to round to the nearest 0.XX fraction
  gliderPrototype.round = function(double){
    var step = (this.opt.slidesToScroll % 1) || 1;
    var inv = 1.0 / step;
    return Math.round(double * inv) / inv;
  }

  gliderPrototype.refresh = function(paging){
    this.init(true, paging)
  }

  gliderPrototype.setOption = function(opt){
    this.opt = Object.assign({}, this.opt, opt)
  }

  gliderPrototype.destroy = function(){
    var _ = this, replace = _.ele.cloneNode(true), clear = function(ele){
      ele.removeAttribute('style');
      ele.classList.forEach(function(className){
        /^glider/.test(className) && ele.classList.remove(className)
      });
    }
    // remove track
    replace.children[0].outerHTML = replace.children[0].innerHTML
    clear(replace);
    [].forEach.call(replace.getElementsByTagName('*'),clear);
    _.ele.parentNode.replaceChild(replace, _.ele);
    window.removeEventListener('resize', _.resize);
    _.event('destroy')
  }

  gliderPrototype.event = function(name, arg){
    var _ = this, e = new CustomEvent('glider-'+name, {
      bubbles: !_.opt.eventPropagate,
      detail: arg
    });
    _.ele.dispatchEvent(e);
  }
}());