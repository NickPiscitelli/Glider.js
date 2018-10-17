(function() {
  'use strict';
  
  var Glider = window.Glider = (function() {

    function Glider(element, settings) {

        var _ = this;

        _.ele = element
        _.default = {
            slidesToShow: 1,
            duration: 125,
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
        _.originalOptions =  _.opt;
        _.activeSlide = 1;

        _.init();
        
        window.addEventListener('resize', _.init.bind(_, true));
    }

    return Glider;

  }());

  Glider.prototype.init = function(refresh) {

    var _ = this;

    _.track = _.ele.children[0];
    _.slides = _.track.children;

    [].forEach.call(_.slides, function(_){
      _.classList.add('glider-slide');
    });

    _.containerWidth = _.ele.offsetWidth;
    _.containerHeight = 0;

    var width = 0, height = 0;
    var resp =  _.getSettingsBreakpoint();
    var newBreakpoint = JSON.stringify(resp) === JSON.stringify(_.opt);
    if (newBreakpoint){
      console.log(resp)
    }
    _.opt = resp;

    _.itemWidth = Math.floor(_.containerWidth / _.opt.slidesToShow);

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

    if (newBreakpoint){
      _.bindArrows();
      _.buildDots();
      _.updateControls();
    }
    
    if (!refresh) _.ele.addEventListener('scroll', _.updateControls.bind(_))


    _.event(refresh ? 'refresh' : 'loaded')
  };

  Glider.prototype.buildDots = function(){
    var _ = this;

    if (!_.opt.dots) return _.remove(_.dots)

    if (typeof _.opt.dots === 'string') _.dots = document.querySelector(_.opt.dots)
    else  _.dots = _.opt.dots

    _.dots.className = 'glider-dots';
    _.dots.innerHTML = '';
    [].forEach.call(_.slides, function(ele, i){
      var li = document.createElement(_.dots.nodeName === 'UL' ? 'li' : 'span');
      li.setAttribute('data-index', i + 1);
      li.className = 'glider-dot '+(i ? '' : 'active');
      li.addEventListener('click',_.scrollItem.bind(_, i))
      _.dots.appendChild(li);
    });

    if (!document.body.contains(_.dots)) _.ele.parentNode.insertBefore(_.dots, _.ele.nextSibling);

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

  Glider.prototype.updateControls = function(){
    var _ = this

    var disableArrows = _.ele.offsetWidth >= _.trackWidth;
    if (_.arrows.prev) _.arrows.prev.classList.toggle('disabled', _.ele.scrollLeft <= 0 || disableArrows)
    if (_.arrows.next) _.arrows.next.classList.toggle('disabled', _.ele.scrollLeft + _.ele.offsetWidth >=  _.trackWidth || disableArrows)

    if (_.dots) [].forEach.call(_.dots.children,function(dot,index){
      dot.classList.toggle('active', _.activeSlide === index + 1)
    })
  }


  Glider.prototype.scrollItem = function(slide, e){
    if(e)   e.preventDefault();

    var _ = this

    if (typeof slide === 'string')  slide = slide === 'prev' ? (_.activeSlide - 2) : (_.activeSlide);
    slide = Math.max(Math.min(slide, _.slides.length), 0)

    _.scrollTo(
      _.itemWidth * slide,
      _.opt.duration * Math.abs(_.activeSlide - slide + 1),
      function() {
        _.activeSlide = Math.floor(_.ele.scrollLeft / _.itemWidth) + 1;
        _.updateControls();
        _.event('animate', { glider: _ })
      });
    
    return false;
  }

  Glider.prototype.getSettingsBreakpoint = function(){
    var _ = this, resp = _.originalOptions.responsive;
    if (resp){
      [].forEach.call(resp,function(v){
        
        if (window.innerWidth > v.breakpoint){
          console.log([v])
          return Object.assign({}, _.originalOptions, v);
        }
      })
    }
    return _.opt;
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

  Glider.prototype.remove = function(ele){
    ele.parentElement.removeChild(ele)
  }

  Glider.prototype.destroy = function(){
    var _ = this
    [_.ele,_.track,_.slides].forEach(function(_){
      _.style.width = 'auto';
      _.style.height = 'auto';
    });
    _.remove(_.arrows.prev)
    _.remove(_.arrows.next)
    _.remove(_.dots)
  }

  Glider.prototype.event = function(name, arg){
    var _ = this, e = new CustomEvent('glider-'+name, {
      bubbles: !!_.opt.propagateEvents,
      detail: arg
    });
    _.ele.dispatchEvent(e);
  }
}());