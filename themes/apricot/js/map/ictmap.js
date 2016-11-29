var ictmap = {
	markers :[],
    map : '',
    zoom : 19,
    lastNode : [ 105.852400, 21.029552 ],
    icon : {
		begin : assets_url + '/images/marker_greenA.png',
		end : assets_url + '/images/marker_greenB.png',
		// stop : assets_url+'/images/stoping.png',
		lost : assets_url + '/images/dung.png',
		over : assets_url + '/images/quatodo.png',
		run : assets_url + '/images/chay.png',
		transparent : assets_url + '/images/transparent.png',
		history : assets_url + '/images/viewchay.png',
		via : assets_url + '/images/dd-via.png',
    },
    icon_option_small_red : {
	icon : new google.maps.MarkerImage(
		'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_red.png'),
	shadow : new google.maps.MarkerImage(
		'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_shadow.png')
    },
    icon_option_small_green : {
	icon : new google.maps.MarkerImage(
		'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_green.png'),
	shadow : new google.maps.MarkerImage(
		'http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_shadow.png')
    },
    options : {
		zoom : this.zoom,
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		center : this.lastNode,
		scaleControl : true,
		scrollwheel : true,
		streetViewControl : false,

		overviewMapControl : true,
		overviewMapControlOptions : {
			opened : false
		}
    },
    LatLng : function($la, $lon) {
		if (!$la || $la > 180)
			$la = '21.029552';
		if (!$lon || $lon > 180)
			$lon = '105.852400';
		return new google.maps.LatLng($la, $lon);
		;
    },

   
};


var gmap3 = null;
jQuery(function() {
    ictmap.lastNode = ictmap.LatLng(21.029552, 105.852400);
    if ($("#gmap").length) {

	gmap3 = $('#gmap').gmap3({
	    center : ictmap.lastNode,
	    zoom : 15,
	    mapTypeId : google.maps.MapTypeId.ROADMAP,
	    mapTypeControl : false,
	    mapTypeControlOptions : {
		style : google.maps.MapTypeControlStyle.ROADMAP
	    },
	    navigationControl : false,
	    scrollwheel : true,
	    streetViewControl : false
	});

    }
});


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
