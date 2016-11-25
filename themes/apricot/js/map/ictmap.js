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
