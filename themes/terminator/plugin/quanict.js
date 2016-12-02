(function($){
     $.fn.extend({
          center: function () {
              return this.each(function() {
            	  $(this).css({
            	        'position': 'fixed',
            	        'left': '50%',
            	        'top': '50%'
            	    });
            	  $(this).css({
            	        'margin-left': -$(this).width() / 2 + 'px',
            	        'margin-top': -$(this).height() / 2 + 'px'
            	    });
                    return $(this);
               });
          }
     });
})(jQuery);

$.fn.maxZIndex = function(opt) {
    var def = { inc: 10, group: "*" };
    $.extend(def, opt);    
    var zmax = 0;
    $(def.group).each(function() {
        var cur = parseInt($(this).css('z-index'));
        zmax = cur > zmax ? cur : zmax;
    });
   // alert(zmax);
    if (!this.jquery)
        return zmax;

    return this.each(function() {
        zmax += def.inc;
       // alert(zmax);
        $(this).css("z-index", zmax);
    });
}

$(function(){
	$('form.default[method=post]').submit(function(e) {
		$(this).after('<div class="ui-widget-overlay"><div class="ui-widget-content-loading" >đang gửi dữ liệu ...</div></div>');
		$('.ui-widget-content-loading').center();
		$(".ui-widget-overlay").maxZIndex({ inc: 1 });
		$(".ui-widget-content-loading").maxZIndex({ inc: 2 });
		//return false;
	});
});