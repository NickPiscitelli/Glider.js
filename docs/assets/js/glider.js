/*
    _____ __ _     __                _    
   / ___// /(_)___/ /___  ____      (_)___
  / (_ // // // _  // -_)/ __/_    / /(_-<
  \___//_//_/ \_,_/ \__//_/  (_)__/ //___/
                              |___/      
                              
  Version: 1.1
  Author: Nick Piscitelli (pickykneee)
  Website: https://nickpiscitelli.com
  Documentation: http://nickpiscitelli.github.io/Glider.js
  License: MIT License
  Release Date: October 25th, 2018

*/

(function() {
  'use strict';
  
  var Glider = window.Glider = (function() {

    function Glider(element, settings) {

        var _ = this;

        _.ele = element

        // expose glider object to its DOM element
        _.ele._glider = _

        // set required defaults
        _.default = {
            slidesToScroll: 1,
            slidesToShow: 1,
            duration: .5,
            // easeInQuad
            easing: function (x, t, b, c, d) {
              return c*(t/=d)*t + b;
            }
        };

        // merge user setting
        _.opt = Object.assign({}, _.default, settings);

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
        _.ele.addEventListener('scroll', _.updateControls.bind(_))
        window.addEventListener('resize', _.init.bind(_, true));
    }

    return Glider;

  }());

  Glider.prototype.init = function(refresh, paging) {

    var _ = this,
      width = 0, height = 0;

    _.slides = _.track.children;

    [].forEach.call(_.slides, function(_){
      _.classList.add('glider-slide');
    });

    _.containerWidth = _.ele.offsetWidth;
    _.opt = _._opt;

    var breakpointChanged = _.settingsBreakpoint();
    if (!paging) paging = breakpointChanged;

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

  Glider.prototype.buildDots = function(){
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
 
  Glider.prototype.bindArrows = function(){
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

  Glider.prototype.updateControls = function(event){
    var _ = this

    if (event && !_.opt.scrollPropagate){
      event.stopPropagation();
    }

    var disableArrows = _.ele.offsetWidth >= _.trackWidth;

    if (_.arrows.prev) _.arrows.prev.classList.toggle('disabled', _.ele.scrollLeft <= 0 || disableArrows)
    if (_.arrows.next) _.arrows.next.classList.toggle('disabled', _.ele.scrollLeft + _.ele.offsetWidth >=  _.trackWidth || disableArrows)

    _.slide = Math.round(_.ele.scrollLeft / _.itemWidth);
    _.page = Math.round(_.ele.scrollLeft / _.containerWidth);

    if (_.ele.scrollLeft + _.containerWidth >= _.trackWidth){
      _.page = _.dots ? _.dots.children.length - 1 : 0;
      _.slide = _.slides.length - 1;
    }

    [].forEach.call(_.slides,function(slide,index){
      var
        slideClasses = slide.classList,
        isVisible = slideClasses.contains('visible'),
        start = _.ele.scrollLeft,
        end = _.ele.scrollLeft + _.containerWidth,
        itemStart = _.itemWidth * index,
        itemEnd = itemStart + _.itemWidth;

      slideClasses.toggle('active', _.slide === index)
      if (itemStart >= start && itemEnd <= end){
        if (!isVisible){
          _.event('slide-visible', {
            slide: index
          })
          slideClasses.add('visible')
        }
      } else {
        if (isVisible){
          _.event('slide-visible', {
            slide: index
          })
          slideClasses.remove('visible')
        }
      }
    })
    if (_.dots) [].forEach.call(_.dots.children,function(dot,index){
      dot.classList.toggle('active', _.page === index)
    })
  }


  Glider.prototype.scrollItem = function(slide, dot, e){
    if(e)   e.preventDefault();

    var _ = this, originalSlide = slide;
    _.aIndex++;

    if (dot === true) {
      slide = slide * _.containerWidth
    } else {
      if (typeof slide === 'string') {
        var backwards = slide === 'prev';

        // dont use _.slide since its rounded
        slide  = _.ele.scrollLeft / _.itemWidth

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

  Glider.prototype.settingsBreakpoint = function(){
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

  Glider.prototype.scrollTo = function(scrollTarget, scrollDuration, callback) {
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

  Glider.prototype.removeItem = function(index){
    var _ = this

    if (_.slides.length){
      _.track.removeChild(_.slides[index]);
      _.init(true, true);
      _.event('remove')
    }
  }

  Glider.prototype.addItem = function(ele){
    var _ = this

    _.track.appendChild(ele);
    _.init(true, true);
    _.event('add')
  }

  Glider.prototype.refresh = function(paging){
    this.init(true, paging)
  }

  Glider.prototype.setOption = function(opt){
    this.opt = Object.assign({}, _.opt, opt)
  }

  Glider.prototype.remove = function(ele){
    ele && ele.parentElement.removeChild(ele)
  }

  Glider.prototype.destroy = function(){
    var _ = this;
    [].forEach.call([_.track, _.ele, _.slide ],function(ele){
      if(ele) {
        ele.style.width = 'auto';
        ele.style.height = 'auto';
      }
    });
    _.remove(_.arrows.prev)
    _.remove(_.arrows.next)
    _.remove(_.dots)
    _.event('destroy')
  }

  Glider.prototype.event = function(name, arg){
    var _ = this, e = new CustomEvent('glider-'+name, {
      bubbles: !_.opt.eventPropagate,
      detail: arg
    });
    _.ele.dispatchEvent(e);
  }
}());
