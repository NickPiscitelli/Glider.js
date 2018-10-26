(function() {
  'use strict';
  
  var Glider = window.Glider = (function() {

    function Glider(element, settings) {

        var _ = this;

        _.ele = element

        // expose glider object to its DOM element
        _.ele._glider = _

        _.default = {
            slidesToScroll: 1,
            slidesToShow: 1,
            duration: .5,
            easing: function(x, t, b, c, d){
              // ease-in out expo
              if (!t) return b;
              if (t==d) return b+c;
              if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
              return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
            },
        };

        _.opt = Object.assign({}, _.default, settings);

        _.arrows = {};
        // preserve original options to
        // extend breakpoint settings
        _._opt =  _.opt;
        
        _.page = _.slide = 0;
        _.breakpoint;

        _.track = document.createElement('div');
        _.track.className = 'glider-track';
        _.ele.appendChild(_.track)
        while (_.ele.children.length !== 1){
          _.track.appendChild(_.ele.children[0])
        }
        
        _.init();
        
        _.ele.addEventListener('scroll', _.updateControls.bind(_))
        window.addEventListener('resize', _.init.bind(_, true));
    }

    return Glider;

  }());

  Glider.prototype.init = function(refresh) {

    var _ = this;

    _.slides = _.track.children;

    [].forEach.call(_.slides, function(_){
      _.classList.add('glider-slide');
    });

    _.containerWidth = _.ele.offsetWidth;
    _.containerHeight = 0;

    var width = 0, height = 0;

    var currentBreakpoint = _.breakpoint;
    
    _.settingsBreakpoint();

    _.itemWidth = _.containerWidth / _.opt.slidesToShow;

    [].forEach.call(_.slides, function(__){
        __.style.height = 'auto';
        __.style.width = _.itemWidth + 'px';
        width += _.itemWidth;
        height = Math.max(__.offsetHeight, height);
    });

    if (_.opt.equalHeight){
      [].forEach.call(_.slides, function(_){
          _.style.height = height + 'px';
      });
    }

    _.track.style.width = width + 'px';
    _.trackWidth = width;

    if (!_.breakpoint || _.breakpoint !== currentBreakpoint){
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

    _.dots.innerHTML = '';
    _.dots.className = 'glider-dots';

    for (var i = 0; i < Math.ceil(_.slides.length / _.opt.slidesToShow); ++i){
      var li = document.createElement(_.dots.nodeName === 'UL' ? 'li' : 'span');
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
        else _.ele.parentNode.insertBefore(arrow, _.ele.nextSibling);
        arrow.addEventListener('click', _.scrollItem.bind(_, direction))
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
      slide.classList.toggle('active', _.slide === index)
      var
        start = _.ele.scrollLeft,
        end = _.ele.scrollLeft + _.containerWidth,
        itemStart = _.itemWidth * index,
        itemEnd = itemStart + _.itemWidth;

      if (itemStart >= start && itemEnd <= end){
        if (!slide.classList.contains('visible')){
          _.event('slide-visible', {
            slide: index
          })
          slide.classList.add('visible')
        }
      } else {
        if (slide.classList.contains('visible')){
          _.event('slide-hidden', {
            slide: index
          })
          slide.classList.remove('visible')
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

    if (dot === true) {
      slide = slide * _.containerWidth
    } else {
      if (typeof slide === 'string') {
        var isPrev = slide === 'prev';
        slide  = (_.page * _.opt.slidesToShow);
          
        if (isPrev) slide -= _.opt.slidesToShow;
        else  slide += _.opt.slidesToShow;

        slide = Math.max(Math.min(slide, _.slides.length), 0)
        slide = _.itemWidth * slide
      }
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
      [].forEach.call(resp,function(v){
        if (window.innerWidth > v.breakpoint){
          _.breakpoint = v.breakpoint;
          _.opt = Object.assign({}, _._opt, v.settings);
        }
      })
    }
    return;
  }

  Glider.prototype.scrollTo = function(scrollTarget, scrollDuration, callback) {
    var
      _ = this,
      start = new Date().getTime(),
      animate = function(){
        var now = (new Date().getTime() - start);
        _.ele.scrollLeft = (_.ele.scrollLeft + (scrollTarget - _.ele.scrollLeft) * _.opt.easing(0, now, 0, 1, scrollDuration));
        if(now < scrollDuration){
          window.requestAnimationFrame(animate);
        } else {
          callback && callback.call(_)
        }
      };

    window.requestAnimationFrame(animate);
  }

  Glider.prototype.removeItem = function(index){
    var _ = this
    if (_.slides.length){
      _.remove(_.slides[index]);
      _.breakpoint = 0;
      _.init(true);
      _.event('remove')
    }
  }

  Glider.prototype.addItem = function(ele){
    var _ = this

    _.track.appendChild(ele);
    _.breakpoint = undefined;
    _.init(true);
    _.event('add')
  }

  Glider.prototype.refresh = function(){
    this.init(true)
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