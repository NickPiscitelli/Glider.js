(function() {
  'use strict';
  
  var Glider = window.Glider = (function() {

    function Glider(element, settings) {

        var _ = this;

        _.ele = element
        _.default = {
            slidesToScroll: 1,
            slidesToShow: 1,
            duration: 1,
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
        _.activeSlide = 0;
        _.activeBreakpoint;

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

    var currentBreakpoint = _.activeBreakpoint;
    
    _.checkSettingsBreakpoint();

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

    if (!_.activeBreakpoint || _.activeBreakpoint !== currentBreakpoint){
      console.log('AS: '+_.activeSlide)
      _.scrollTo(_.activeSlide, 0)
      _.bindArrows();
      _.buildDots();
      _.updateControls();
    }
    
    if (!refresh) _.ele.addEventListener('scroll', _.updateControls.bind(_))


    _.event(refresh ? 'refresh' : 'loaded')
  };

  Glider.prototype.buildDots = function(){
    var _ = this;
  
    if (!_.opt.dots) return _.dots.innerHTML = '';

    if (typeof _.opt.dots === 'string') _.dots = document.querySelector(_.opt.dots)
    else  _.dots = _.opt.dots

    _.dots.className = 'glider-dots';
    for (var i = 0; i < Math.ceil(_.slides.length / _.opt.slidesToShow); ++i){
      var li = document.createElement(_.dots.nodeName === 'UL' ? 'li' : 'span');
      li.setAttribute('data-index', i);
      li.className = 'glider-dot '+(i ? '' : 'active');
      li.addEventListener('click',_.scrollItem.bind(_, i, true))
      _.dots.appendChild(li);
    }
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

    _.activeSlide = Math.round(_.ele.scrollLeft / _.itemWidth);
    _.activePage = Math.round(_.ele.scrollLeft / _.containerWidth)
    console.log([_.activeSlide, _.activePage]);
    [].forEach.call(_.slides,function(slide,index){
      slide.classList.toggle('active', _.activeSlide === index)
      var
        start = _.ele.scrollLeft,
        end = _.ele.scrollLeft + _.containerWidth,
        itemStart = _.itemWidth * index,
        itemEnd = itemStart + _.itemWidth;
        console.log([
          start,end,itemStart,itemEnd
        ])
      slide.classList.toggle('visible',
        itemStart >= start && itemEnd <= end
      )
    })
    if (_.dots) [].forEach.call(_.dots.children,function(dot,index){
      dot.classList.toggle('active', _.activePage === index)
    })
  }


  Glider.prototype.scrollItem = function(slide, dot, e){
    if(e)   e.preventDefault();

    var _ = this
console.log(dot)
    if (dot === true) {
      console.log('slide')
      slide = slide * _.containerWidth
    } else {
      if (typeof slide === 'string') {
        slide = slide === 'prev' ? (_.activeSlide - _.opt.slidesToScroll) : (_.activeSlide + _.opt.slidesToScroll);
        slide = Math.max(Math.min(slide, _.slides.length), 0)
        slide = _.itemWidth * slide
      }
    }

    _.scrollTo(
      slide,
      _.opt.duration * (Math.abs(_.ele.scrollLeft - slide)),
      function() {
        _.updateControls();
        _.event('animate', { glider: _ })
      });
    
    return false;
  }

  Glider.prototype.checkSettingsBreakpoint = function(){
    var _ = this, resp = _.originalOptions.responsive;
    if (resp){
      [].forEach.call(resp,function(v){
        if (window.innerWidth > v.breakpoint){
          _.activeBreakpoint = v.breakpoint;
          _.opt = Object.assign({}, _.originalOptions, v);
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
    _.track.removeChild(_.slides[index]);
    _.activeBreakpoint = undefined;
    _.init(true);
  }

  Glider.prototype.addItem = function(ele){
    var _ = this
    _.track.appendChild(ele);
    _.activeBreakpoint = undefined;
    _.init(true);
  }

  Glider.prototype.remove = function(ele){
    ele && ele.parentElement.removeChild(ele)
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