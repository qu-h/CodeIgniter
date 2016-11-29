var veh = {
	reportlink:site_url+'thong-ke',
	ini:function(){
		if( $('#vehicles-tables') ){
			this.vehiclesTable($('#vehicles-tables'));
		}
	},
	vehiclesTable:function(tb){
		$.each($('tbody tr',tb),function(i, item){
			 $('td:eq(6)',item).append( veh.mbutton('arrow-r',i18n.view_tracking) );
			 $('td:eq(6)',item).append( veh.mbutton('grid',i18n.view_report,'item-report') );
			 $('td:eq(6)',item).append( veh.mbutton('arrow-r',i18n.view_history) );
		});
		
		$('a.item-tracking').click(function(){
			 alert('edit item');
		 });
		 $('a.item-report').click(function(e){
			 e.preventDefault();
//			 id = $(this).parents('tr').attr('veh');
			// alert(id);
			 window.location.href =  veh.reportlink+'?veh='+$(this).parents('tr').attr('veh'); 
			 return false;
		 });
	},
	mbutton:function(icon,title,cln){
		title = (title)?title:'button title';
		cln = 	(cln)?cln:'actions';
		return $('<a/>',{
			'data-role' : 'button',
			'data-icon':icon,
			'data-iconpos':'notext',
			'data-theme':'c',
			'data-inline':'true',
			'title':title,
			'class':cln
			
		});
	},
};


var manager = {
	tableAction:function(){
		$('.item-edit').click(function(e){
			$form = $('form[name=update-vehicle]');
			$item =  $(this).nextAll('input[type=hidden]');
			if( $('input[name='+$item.attr("name")+']',$form) > 0 ){
				$('input[name='+$item.attr("name")+']',$form).val($item.val());
			} else {
				$form.append( $item.clone() );
			}
			$form.submit();
		});
		$('.item-tracking').click(function(e){
			window.location.href =  site_url+'theo-doi/'+$(this).nextAll('input[type=hidden]').val()+'.html';
		});
		$('.item-report').click(function(e){
			window.location.href =  site_url+'thong-ke/'+$(this).nextAll('input[type=hidden]').val()+'.html';
		});
		$('.item-history').click(function(e){
			window.location.href =  site_url+'lich-su/'+$(this).nextAll('input[type=hidden]').val()+'.html';
		});

		$('.item-shutdown').click(function(e){
			$form = $('form[name=update-vehicle]');
			$item =  $(this).nextAll('input[type=hidden]');
			if( $('input[name='+$item.attr("name")+']',$form) > 0 ){
				$('input[name='+$item.attr("name")+']',$form).val($item.val());
			} else {
				$form.append( $item.clone() );
			}
			$form.attr('action',site_url+'quan-ly/tat-thiet-bi.html').submit();
		});
		
		$('.item-turnon').click(function(e){
			$form = $('form[name=update-vehicle]');
			$item =  $(this).nextAll('input[type=hidden]');
			if( $('input[name='+$item.attr("name")+']',$form) > 0 ){
				$('input[name='+$item.attr("name")+']',$form).val($item.val());
			} else {
				$form.append( $item.clone() );
			}
//			alert('trun on'); return false;
			$form.attr('action',site_url+'quan-ly/mo-thiet-bi.html').submit();
		});
	},
};


$(function() {
	$( "input[type=submit], button.ui-button" ).button()
		.click(function( event ) {
			//event.preventDefault();
	});
	$('.ui-msg').click(function(){
		$(this).remove();
	});
	$( "input.ui-date, div.ui-date" ).datepicker({
		dateFormat: "dd-mm-yy",
		//timeText:'Thời Gian', hourText:'Giờ',minuteText:'Phút',closeText:'Đóng',currentText:'Hiện Tại',
		dayNamesMin: [ "CN", "th2", "th3", "th4", "th5", "th6", "th7" ],
		monthNames:['Tháng Một','Tháng Hai','Tháng Ba','Tháng Tư','Tháng Năm','Tháng Sáu','Tháng Bẩy','Tháng Tám','Tháng Chín','Tháng Mười','Tháng Mười Một','Tháng Mười Hai'],
		changeMonth: true,
		firstDay: 1,
        changeYear: true,
        maxDate: vmap.date( vmap.timestamp )
        //minDate:'-14d'
	});
	$( "input.ui-time" ).timepicker({
		showOn: "button",
		timeText:i18n.Time, hourText:i18n.Hour,minuteText:i18n.Minute,closeText:i18n.Close,currentText:i18n.Current,timeOnlyTitle: 'Nhập Thời Gian',
	    buttonImage: assets_url+"/images/clock.png",
	    buttonImageOnly: true, showOn: "both",
	    timeFormat: "H:m",
	});
	
    
	$( ".ui-slider" ).slider({
		 orientation: "horizontal",
	     range: "min",
	     max: 100
	});
	if (window.PIE) {
        $('.csspie').each(function() {
            $(this).css({'position':'relative'});
            PIE.attach(this);
        });
    }
	
	$(window).resize(function() {
		$map = $('.gps-right');
		$map.parents('.container');
		$map.css('width',$map.parents('.container').width() - $('.gps-left',$map.parents('.container')).width() - 20);
	});
	$('.gps-right').css('width',$('.container').width() - $('.gps-left').width()-30);
});

jQuery.fn.center = function () {
	
	this.css("position","fixed");
	this.css("top", ( $(window).height() - this.height() ) / 2 + "px");
	console.log('window height='+$(window).height());
	this.css("left", ( jQuery(window).width() - this.width() ) / 2+jQuery(window).scrollLeft() + "px");
    return this;
};


function Label(opt) { // Initialization
	this.setValues(opt);
	this.div_ = document.createElement('div');
	if(opt.className){
		this.div_.className = opt.className;
	} else {
		//this.div_.className = "vehicle-node";
		this.div_.className = "vehicleicon";
	}
	
	if(opt.subclass){
		this.div_.className += " "+opt.subclass;
	}
	if(opt.innerHTML ) {
		this.div_.innerHTML  = opt.innerHTML ;
	}
	this.div_.innerHTML = 'abc';
	this.div_.style.cssText = 'position: absolute; display: block; cursor: pointer; ';
	
	if(opt.rotate ) {
		this.div_.style.cssText += '-ms-transform: rotate('+opt.rotate+'deg);'; /* IE 9 */
    	this.div_.style.cssText += '-webkit-transform: rotate('+opt.rotate+'deg);'; /* Safari */
    	this.div_.style.cssText += 'transform: rotate('+opt.rotate+'deg);';
	}

	this.div_.title = opt.title;
	
};

Label.prototype = new google.maps.OverlayView;

Label.prototype.onAdd = function() {
	var pane = this.getPanes().overlayLayer;
	pane.appendChild(this.div_);
	var me = this;
	this.listeners_ = [
       google.maps.event.addListener(this, 'position_changed',function() { me.draw(); }),
       google.maps.event.addListener(this, 'text_changed',function() { me.draw(); }),
       google.maps.event.addListener(this, 'visible_changed', function() { me.draw(); }),
       google.maps.event.addListener(this, 'clickable_changed', function() { me.draw(); }),
       google.maps.event.addListener(this, 'zindex_changed', function() { me.draw(); }),
       google.maps.event.addListener(this.div_, 'click', function() {
    	   if (me.get('clickable')) {
    		   google.maps.event.trigger(me, 'click');
    	   }
       }),
    ];
};
// Implement onRemove
Label.prototype.remove = function() {
	if( this.div_.parentNode ){
		this.div_.parentNode.removeChild(this.div_);
	}
	
	// Label is removed from the map, stop updating its position/text.
	if(this.listeners_){
		for (var i = 0, I = this.listeners_.length; i < I; ++i) {
			google.maps.event.removeListener(this.listeners_[i]);
		}
	}
	
};
// Implement draw
Label.prototype.draw = function() {
	var projection = this.getProjection();
	var position = projection.fromLatLngToDivPixel(this.get('position'));
	this.div_.style.left = (position.x - this.div_.offsetWidth/2) + 'px';
	this.div_.style.top = (position.y - this.div_.offsetHeight/2) + 'px';
};


Number.prototype.formatMoney = function(c, d, t){
	var n = this, 
	    c = isNaN(c = Math.abs(c)) ? 2 : c, 
	    d = d == undefined ? "." : d, 
	    t = t == undefined ? "," : t, 
	    s = n < 0 ? "-" : "", 
	    i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", 
	    j = (j = i.length) > 3 ? j % 3 : 0;
	   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
	 };