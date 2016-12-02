jQuery(function() {
	
	function editFormActions(){
		var form = $('form#editNode');
		if( $("input[name=auto]",form).is(':checked')){
			jQuery.ajax( { "dataType": 'json',"type": "POST", "url": site_url+'draw/update.json',
				data: form.serialize(),
				success: function(data) {
					note_data_return(data);
				}
			});
		}
	}
	

	function note_data_return(data){
		if( ictmap.markers.length > 0 ) $.each(ictmap.markers,function(id,marker){
			if( jQuery.type( marker )=='object' ){
				marker.setMap(null);
			}
		});

		if( jQuery.type( ictmap.node_tracking ) != 'undefined' ){
			ictmap.node_tracking.remove();
		}
		
		
		if( data.node_pre.length > 0 ) $.each(data.node_pre,function(i,node){
			gmap3.then(function (map) {
				ictmap.markers[node.id] = new google.maps.Marker({
					position: ictmap.LatLng(node.latitude, node.longitude),
					icon: 'http://labs.google.com/ridefinder/images/mm_20_green.png',
					map: map
				});
			});
		});
			
		if( data.node_next.length > 0 ) $.each(data.node_next,function(i,node){
			/*https://sites.google.com/site/gmapicons/home*/
			iconChar = ['A','B','C','D','E'];
			maker_icon = 'http://www.google.com/mapfiles/marker'+iconChar[i]+'.png'
			gmap3.then(function (map) {
				ictmap.markers[node.id] = new google.maps.Marker({ position: ictmap.LatLng(node.latitude, node.longitude), icon: maker_icon,map: map});
			});
		});
			
		if( data.node ){
			var nodePosition = ictmap.LatLng(data.node.latitude, data.node.longitude);
			
			$('input[name=latitude]').val(data.node.latitude);
			$('input[name=longitude]').val(data.node.longitude);
			$('input[name=h]').val(data.node.h);
			$('input[name=i]').val(data.node.i);
			$('input[name=s]').val(data.node.s);
			$('input[name=date]').val(data.node.date);
			$('input[name=id]').val(data.node.id);
			
			$('input[name=vstr]').val(data.vstr);
			
			
			gmap3.then(function (map) {
				node = data.node;
				map.setZoom(22);
				map.panTo(nodePosition);
				ictmap.markers[node.id] = new google.maps.Marker({
					position: nodePosition, 
					draggable: true, 
					icon: 'http://www.google.com/mapfiles/marker.png',
					map: map
				});
				ictmap.node_tracking = new Label({
					map: map,
					position: nodePosition ,
					rotate: node.angle,
					title:'checking point'
				});
				
				google.maps.event.addListener(ictmap.markers[node.id], 'dragend', function(){
					jQuery('input[name=latitude]').val(ictmap.markers[node.id].getPosition().lat());
					jQuery('input[name=longitude]').val(ictmap.markers[node.id].getPosition().lng());
					editFormActions();
				});
			});
		}
	}
	
	jQuery.ajax( {
		"dataType": 'json',"type": "GET",
		"url": site_url+'draw/node/'+$('input[name=vstr]').val()+'/'+$('input[name=id]').val()+'.json',
		success: function(data) {
			note_data_return(data);
		}
	});
});
