if (window.HTMLCollection && !HTMLCollection.prototype.forEach) HTMLCollection.prototype.forEach = Array.prototype.forEach;
(function() {
  'use strict';
  
  var Glider = window.Glider = (function() {

      var instanceUid = 0;
      
      function Glider(element, settings) {

          var _ = this;

          _.ele = element
          _.dots = [];
          // ease-in out expo
          _.easing = function(x, t, b, c, d){
            if (t==0) return b;
            if (t==d) return b+c;
            if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
            return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
          };

          _.opt = _.extend({
              prevArrow: true,
              nextArrow: true,
              dots: true,
              slidesToShow: 1
          }, settings);

          _.origOpt =  _.opt;
          _.activeSlide = 0;
          _.instanceUid = instanceUid++;

          _.init();


      }

      return Glider;

  }());

  Glider.prototype.init = function() {

      var _ = this;

      _.track = _.ele.children[0];
      _.slides = _.track.children;

      _.slides.forEach(function(_){
        _.classList.add('glider-slide');
      });

      _.containerWidth = _.ele.offsetWidth;
      _.containerHeight = 0;

      var width = 0, height = 0;

      _.itemWidth = Math.floor(_.containerWidth / _.opt.slidesToShow);
    console.log(_.itemWidth)
      _.slides.forEach(function(__){
          __.style.height = 'auto';
          __.style.width = _.itemWidth + 'px';
          width += _.itemWidth;
          height = Math.max(__.offsetHeight, height);
      });
      if (_.opt.equalHeight){
        _.slides.forEach(function(_){
            _.style.height = height + 'px';
        });
      }

      _.track.style.width = width + 'px';
      _.trackWidth = width;

      _.bindArrows();
      _.showArrows();
      _.buildDots();
      _.ele.addEventListener('scroll', Glider.prototype.showArrows.bind(_))
  };

  Glider.prototype.buildDots = function(){
    var _ = this

    var fragment = document.createDocumentFragment(),
      ul = document.createElement('ul');
    ul.className = 'glider-dots';
    _.slides.forEach(function(ele, i){
      var li = document.createElement('li');
      li.setAttribute('data-index', i);
      li.className = i ? '' : 'glider-active';
      ul.appendChild(li);
      _.dots.push(li);
    });
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
        arrow.addEventListener('click', Glider.prototype.scrollItem.bind(_, direction))
      }
    });
  }

  Glider.prototype.showArrows = function(){
    var _ = this
    _.prevArrow.classList.toggle('glider-hide', _.ele.scrollLeft <= 0)
    _.nextArrow.classList.toggle('glider-hide', _.ele.scrollLeft + _.ele.offsetWidth >=  _.trackWidth)
    if (_.ele.offsetWidth >= _.trackWidth){
      [ _.prevArrow, _.nextArrow ].forEach(function(ele){
        ele.classList.add('glider-hide');
      });
    }
    
    _.activeSlide = Math.floor(_.ele.scrollLeft / _.itemWidth);
    _.dots.forEach(function(dot,index){
      dot.classList.toggle('glider-active', _.activeSlide === index)
    })
  }

  Glider.prototype.scrollItem = function(direction, e){

    if(e)   e.preventDefault();

    var _ = this

    var num = 1, scrollLeft = _.ele.scrollLeft;

    if (_.ele.scrollLeft >= _.itemWidth)    num = Math.ceil(scrollLeft / _.itemWidth);
    if (_.ele.scrollLeft === _.itemWidth * num) num++;
    scrollLeft = _.itemWidth * num;
    console.log(direction)
    if (direction === 'prev')    scrollLeft -= (_.itemWidth * 2);

    _.scrollTo(250, scrollLeft)
    _.showArrows();
    return false;
  }

  Glider.prototype.getSettingsBreakpoint = function(){
      var _ = this, resp = _.opt.responsive;
      if (resp){
        resp.forEach(function(v){
          if (window.innerWidth > v.breakpoint){
            return _.extend(_.opt, v);
          }
        })
      }
      return _.opt;
  }

  Glider.prototype.scrollTo = function(scrollDuration, scrollTarget) {
    var _ = this
    var start = new Date().getTime(), animate = function(){
      var now = (new Date().getTime() - start);
      _.ele.scrollLeft = (_.ele.scrollLeft + (scrollTarget - _.ele.scrollLeft) * _.easing(0, now, 0, 1, scrollDuration));
      console.log([now, scrollDuration])
      if(now < scrollDuration){
        window.requestAnimationFrame(animate);
      }
    };
    window.requestAnimationFrame(animate);
  };

  Glider.prototype.extend = function(source, properties) {
      for(var property in properties) {
          if(properties.hasOwnProperty(property)) {
              source[property] = properties[property];
          }
      }
      return source;
  };

}());