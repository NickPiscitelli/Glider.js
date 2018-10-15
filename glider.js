(function($) {
  'use strict';
  var Glider = window.Glider || {};

  if (window.HTMLCollection && !HTMLCollection.prototype.forEach) HTMLCollection.prototype.forEach = Array.prototype.forEach;
    
  Glider = (function() {

      var instanceUid = 0;
      
      function Glider(element, settings) {

          var _ = this;

          _.ele = element

          _.opt = _.extend({
              prevArrow: true,
              nextArrow: true,
              slidesToShow: 1
          }, settings);

          _.origOpt =  _.opt;

          _.instanceUid = instanceUid++;

          _.init();


      }
    
    window.Glider = Glider;
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
        console.log(_.itemWidth)
          height = Math.max(__.offsetHeight, height);
      });
      if (_.opt.equalHeight){
        _.slides.forEach(function(_){
            _.style.height = height + 'px';
        });
      }

      _.track.style.width = width + 'px';
      _.trackWidth = width;
console.log('TW: '+width)
      _.bindArrows();
      _.showArrows();

      _.ele.addEventListener('scroll', Glider.prototype.showArrows.bind(_))
  };

  Glider.prototype.bindArrows = function(){
    var _ = this;
    ['prev','next'].forEach(function(direction){
      var arrow = _.opt[direction+'Arrow'];
      console.log(arrow)
      if (arrow){
        if (typeof arrow === 'string')  arrow = document.querySelector(arrow);
        arrow.addEventListener('click', Glider.prototype.scrollItem.bind(_))
      }
    });
  }

  Glider.prototype.showArrows = function(){
    var _ = this
    _.ele.classList.toggle('show-arrows', _.ele.offsetWidth < _.trackWidth);
    _.ele.classList.toggle('hide-prev', _.ele.scrollLeft <= 0)
    _.ele.classList.toggle(
      'hide-next',
      _.ele.scrollLeft + _.offsetWidth >=  _.trackWidth
    )
  }

  Glider.prototype.scrollItem = function(e){
    if(e)   e.preventDefault();

    var _ = this

    var num = 1, scrollLeft = _.ele.scrollLeft;
    console.log(_.ele)
    console.log(_.ele.scrollLeft)
    if (_.ele.scrollLeft >= _.itemWidth)    num = Math.ceil(scrollLeft / _.itemWidth);
    if (_.ele.scrollLeft === _.itemWidth * num) num++;
    scrollLeft = _.itemWidth * num;

    if (_.ele.classList.contains('prev'))    scrollLeft -= (_.itemWidth * 2);
console.log('scroll top')
    //_.ele.scrollLeft = scrollLeft;
    _.scrollTo(.5, scrollLeft)
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
    var scrollStep = _.ele.scrollLeft / (scrollDuration / 15),
    scrollInterval = setInterval(function(){
        if ( _.ele.scrollLeft !== scrollTarget ) {
            _.ele.scrollLeft = scrollStep;
        }
        else clearInterval(scrollInterval); 
    },15);
  }
  Glider.prototype.extend = function(source, properties) {
      for(var property in properties) {
          if(properties.hasOwnProperty(property)) {
              source[property] = properties[property];
          }
      }
      return source;
  };

}());


window.addEventListener('load',function(){
new Glider(document.getElementById('glider'),{
  slidesToShow: 1,
  prevArrow: '.prev',
  nextArrow: '.next'
})
});
