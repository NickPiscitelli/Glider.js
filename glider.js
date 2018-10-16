(function() {
  'use strict';
  
  var Glider = window.Glider = (function() {

      var instanceUid = 0;
      
      function Glider(element, settings) {

          var _ = this;

          _.ele = element

          _.opt = _.extend({
              slidesToShow: 1,
              duration: 125,
              easing: function(x, t, b, c, d){
                // ease-in out expo
                if (!t) return b;
                if (t==d) return b+c;
                if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
                return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
              },
          }, settings);

          _.originalOptions =  _.opt;
          _.activeSlide = 1;
          _.instanceUid = instanceUid++;

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
      _.opt = _.getSettingsBreakpoint();
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

      _.bindArrows();
      _.buildDots();
      _.updateControls();
      _.ele.addEventListener('scroll', _.updateControls.bind(_))

      _.ele.dispatchEvent(new Event('glider-'+(refresh ? 'refresh' : 'loaded', {bubbles: !!_.opt.propagateEvents}));
  };

  Glider.prototype.buildDots = function(){
    var _ = this

    var fragment = document.createDocumentFragment(),
       ul = document.createElement('ul');
    ul.className = 'glider-dots';
    [].forEach.call(_.slides, function(ele, i){
      var li = document.createElement('li');
      li.setAttribute('data-index', i + 1);
      li.className = i ? '' : 'glider-active';
      li.addEventListener('click',_.scrollItem.bind(_, i))
      ul.appendChild(li);
    });
    _.dots = ul;
    fragment.appendChild(ul);
    _.ele.parentNode.insertBefore(fragment, _.ele.nextSibling);

  }
 
  Glider.prototype.bindArrows = function(){
    var _ = this;
    ['prev','next'].forEach(function(direction){
      var arrow = _.opt[direction+'Arrow'];
      if (arrow){
        if (typeof arrow === 'string')  arrow = document.querySelector(arrow);
        _[direction+'Arrow'] = arrow;
        arrow.addEventListener('click', _.scrollItem.bind(_, direction))
      }
    });
  }

  Glider.prototype.updateControls = function(){
    var _ = this
    _.prevArrow.classList.toggle('glider-hide', _.ele.scrollLeft <= 0)
    _.nextArrow.classList.toggle('glider-hide', _.ele.scrollLeft + _.ele.offsetWidth >=  _.trackWidth)
    if (_.ele.offsetWidth >= _.trackWidth){
      [ _.prevArrow, _.nextArrow ].forEach(function(ele){
        ele.classList.add('glider-hide');
      });
    }
    
    _.activeSlide = Math.floor(_.ele.scrollLeft / _.itemWidth) + 1;

    if (_.dots) [].forEach.call(_.dots.children,function(dot,index){
      dot.classList.toggle('glider-active', _.activeSlide === index + 1)
    })
  }


  Glider.prototype.scrollItem = function(slide, e){
    if(e)   e.preventDefault();

    var _ = this

    if (typeof slide === 'string')  slide = slide === 'prev' ? (_.activeSlide - 2) : (_.activeSlide);
    slide = Math.max(Math.min(slide, _.slides.length), 0)

    _.scrollTo(_.itemWidth * slide, _.opt.duration * Math.abs(_.activeSlide - slide + 1));
    _.updateControls();
    return false;
  }

  Glider.prototype.getSettingsBreakpoint = function(){
      var _ = this, resp = _.opt.responsive;
      if (resp){
        [].forEach.call(resp,function(v){
          if (window.innerWidth > v.breakpoint){
            return _.extend(_.originalOptions, v);
          }
        })
      }
      return _.opt;
  }

  Glider.prototype.scrollTo = function(scrollTarget, scrollDuration) {
    var
      _ = this,
      start = new Date().getTime(),
      animate = function(){
        var now = (new Date().getTime() - start);
        _.ele.scrollLeft = (_.ele.scrollLeft + (scrollTarget - _.ele.scrollLeft) * _.opt.easing(0, now, 0, 1, scrollDuration));
        if(now < scrollDuration){
          window.requestAnimationFrame(animate);
        }
      };

    window.requestAnimationFrame(animate);
  }

  Glider.prototype.extend = function(source, properties) {
      for(var property in properties) {
          if(properties.hasOwnProperty(property)) {
              source[property] = properties[property];
          }
      }
      return source;
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
    _.remove(_.prevArrow)
    _.remove(_.nextArrow)
    _.remove(_.dots)
  }

}());