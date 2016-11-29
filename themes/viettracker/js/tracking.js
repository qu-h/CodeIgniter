


var tracking = {opacity:1.0,weight:4,trackLink:'',center:false,
	ini:function(){
		$("#gps-vehicles").change(function(){
			vmap.loading = true;
			tracking.center = true;
			if(tracking.ajax){
			    tracking.ajax.abort();
			}
			tracking.refresh = vmap.refresh;
			vmap.statusArea.html(i18n.loading);
			tracking.track();
		});
	},
	icon:function($speed){
		var $icon='';
		if(parseInt($speed) >=50){
			$icon = vmap.icon.over;
		} else if (parseInt($speed) <= 0){
			$icon = vmap.icon.stop;
		} else {
			$icon = vmap.icon.run;
		}
		return $icon;
	},
	rotateLayer:function($rotate){
		$rotate = parseFloat($rotate);
		var $icon = '';
		if($rotate > 0+11.25 && $rotate <=22.5+11.25 ){
			$icon = 'node-22-5';
		} else if ($rotate > 22.5+11.25  && $rotate <=45+11.25 ){
			$icon = 'node-45';
		} else if ($rotate > 45+11.25  && $rotate <=67.5+11.25 ){
			$icon = 'node-67-5';
		} else if ($rotate > 67.5+11.25  && $rotate <=90+11.25 ){
			$icon = 'node-90';
		} else if ($rotate > 90+11.25  && $rotate <=112.5+11.25 ){
			$icon = 'node-112-5';
		} else if ($rotate > 112.5+11.25  && $rotate <=135+11.25 ){
			$icon = 'node-135';
		} else if ($rotate > 135+11.25  && $rotate <=157.5+11.25 ){
			$icon = 'node-157-5';
		} else if ($rotate > 157.5+11.25  && $rotate <=180+11.25 ){
			$icon = 'node-180';
		} else if ($rotate> 180+11.25  && $rotate <=202.5+11.25 ){
			$icon = 'node-202-5';
		} else if ($rotate > 202.5+11.25  && $rotate <=225+11.25 ){
			$icon = 'node-225';
		} else if ($rotate > 225+11.25  && $rotate <= 247.5+11.25 ){
			$icon = 'node-247-5';
		} else if ($rotate > 247.5+11.25  && $rotate <= 270+11.25 ){
			$icon = 'node-270';
		} else if ($rotate > 270+11.25  && $rotate <= 292.5+11.25 ){
			$icon = 'node-292-5';
		} else if ($rotate > 292.5+11.25  && $rotate <= 315+11.25 ){
			$icon = 'node-315';
		} else if ($rotate > 315+11.25  && $rotate <= 337.5+11.25 ){
			$icon = 'node-337-5';
		} else {
			$icon = 'node-0';
		}
		//alert($icon);
		return $icon;

	},
	nodeItem:function($type,$val){
		switch($type){
			case 'vaq':
				$unit = '<span class="unit" >V</span>';break;
			case 'speed':
				$unit = '<span class="unit" >Km/h</span>';break;
			case 'temp':
				$unit = '<span class="unit" >°C</span>';break;

			case 'fuel':
				//$unit = '<span class="unit" >lít</span>';break;
			case 'gsm':
				$val = $val.replace(/%/gi,'');
				$unit = '<span class="unit" >%</span>';break;
			default:
				$unit = '';break;

		}
		return '<div class="item" rel="tooltip" tip="'+i18n[$type+'_lable']+'" ><div class="icon-h16 icon-h16-'+$type+'" ></div><span class="value" name="'+$type+'">'+$val+'</span>'+$unit+'</div>';
	},
	nodeInfo:function($node){
		$html = tracking.nodeItem('speed',$node.speed)
				+tracking.nodeItem('gps',$node.gps)
				+tracking.nodeItem('gsm',$node.gsm)
				+tracking.nodeItem('vaq',$node.vaq);

		if (typeof($node.temp) != "undefined"){
			$html+= tracking.nodeItem('temp',$node.temp);
		}
		if (typeof($node.cooler) != "undefined"){
			$html+= tracking.nodeItem('cooler',($node.cooler=='1')?i18n.on:i18n.off);
		}
		if (typeof($node.fuel) != "undefined"){
			$html+= tracking.nodeItem('fuel',$node.fuel);
		}
		if (typeof($node.door) != "undefined"){
			$html+= tracking.nodeItem('door', ($node.door=='1')?i18n.open:i18n.close );
		}
		$html += tracking.nodeItem('time',i18n.last_update+' '+vmap.date($node.t*1000,'H:i:s (d/m/Y)') )
				;
		$('#vehicle-info').html($html);
		vmap.addressArea.show();
		vmap.bind_geocode($node.la,$node.lo);

		vmap.tooltip();



	},
	nodeTrueInfo:function($node){
		$trueInfoArea = $('.gps-left .obi');
		$('span[name=time]',$trueInfoArea).html(vmap.date($node.t*1000,'H:i:s (d/m/Y)'));
		$('span[name=speed]',$trueInfoArea).html($node.speed);
		$('span[name=gps]',$trueInfoArea).html($node.gps);
		$('span[name=gsm]',$trueInfoArea).html($node.gsm);
		$('span[name=la]',$trueInfoArea).html($node.la);
		$('span[name=lon]',$trueInfoArea).html($node.lo);
		$('span[name=vaq]',$trueInfoArea).html($node.vaq);

		$('span[name=cooler]',$trueInfoArea).html($node.cooler);
		$('span[name=temp]',$trueInfoArea).html($node.temp);
		$('span[name=fuel]',$trueInfoArea).html($node.fuel);
		$('span[name=door]',$trueInfoArea).html( ($node.door=='1')?i18n.open:i18n.close );
	},
	nodes:[],markers:[],polyline:[],rotate:[],maxMarker : 1,name:[],
	addPoint:function($vid,$info,$time , show_title){
		$marker = { position: vmap.LatLng($info.la,$info.lo),
					map: vmap.map,
					icon:tracking.icon($info.speed) ,
					title:$info.name,
					//draggable:false
				};
		$markerStop = false;
		if(!tracking.markers[$vid]){
			tracking.markers[$vid] = [];
		}
		if(!tracking.rotate[$vid]){
			tracking.rotate[$vid] = '';
		}

		if( !tracking.polyline[$vid] ){ // if not create anyone polyline
			tracking.polyline[$vid] =  new google.maps.Polyline({ strokeColor: '#0000FF' , fillColor: '#FF0000', strokeOpacity: tracking.opacity, strokeWeight: tracking.weight});
			tracking.polyline[$vid].setMap(vmap.map);
		}
		if( !tracking.polyline[$vid].getMap() ){
			tracking.polyline[$vid].setOptions({ fillColor: '#FF0000', strokeOpacity: tracking.opacity, strokeWeight: tracking.weight });
			tracking.polyline[$vid].setMap(vmap.map);
		}
		if(!tracking.nodes[$vid]){
			tracking.nodes[$vid] = [];
		}

		$markerPrevious = tracking.markers[$vid][tracking.markers[$vid].length-1];
		if($markerPrevious){ // check Icon marker previoua
			if($markerPrevious.getIcon() == vmap.icon.rotate )
				$markerPrevious.setIcon(vmap.icon.run);
		}
		if(tracking.rotate[$vid] != '') {
			tracking.rotate[$vid].remove();
			tracking.rotate[$vid] = '';
		}


		if ( (vmap.timestamp/1000 -  $time) > 1800 ) {
			$marker.icon = vmap.icon.lost;
		} else if( $time != $info.t || $info.speed == 0){
			tracking.rotate[$vid] = new Label({
				map: vmap.map,
				position: $marker.position ,
				subclass: 'node-stop',
				title:$marker.title
			});
			$markerStop = true;
			$marker.icon = vmap.icon.transparent;
		} else {
			tracking.rotate[$vid] = new Label({
				// map: vmap.map,
				// position: $marker.position ,
				// subclass:tracking.rotateLayer($info.rotate ),
				// title:$marker.title
				map: vmap.map,
				position: $marker.position ,
				rotate: $info.angle,
				title:$marker.title
			});
			$marker.icon = vmap.icon.transparent;
		}

		//if( tracking.markers[$vid].length > 0 && tracking.markers[$vid][tracking.markers[$vid].length-1].getPosition().equals($marker.position) ){
		if( tracking.polyline[$vid].getPath().getLength() > 0 &&  tracking.polyline[$vid].getPath().getAt(tracking.polyline[$vid].getPath().getLength()-1).equals($marker.position) ){
			/*
			 * when new point same last point
			 * only update info for marker
			 */
			lastMarker = tracking.markers[$vid][tracking.markers[$vid].length-1];
			lastMarker.info = $info;
			lastMarker.setIcon($marker.icon);
			if(tracking.polyline[$vid].getPath().length < 1 ) // set polyline for firt time
				tracking.polyline[$vid].getPath().push($marker.position);
		} else {
			/*
			 * add new marker and new point on polyline
			 */


				$addMarker = new google.maps.Marker($marker);
				google.maps.event.addListener($addMarker, 'click', function(innerKey) {
				    vmap.showMarkerInfo(this);
				});
				$addMarker.info = $info;

				tracking.markers[$vid].push($addMarker);


				 if(tracking.markers[$vid].length > tracking.maxMarker){
					tracking.markers[$vid][ 0 ].setMap(null); // remove first when max
					tracking.markers[$vid].splice(0,1);
				}

				tracking.polyline[$vid].getPath().push($marker.position);
				tracking.nodes[$vid].push({t:$info.t});
//				alert('add new marker, name='+$info.name+' vid='+$vid);
			//}


		}
		if(show_title == true){
			if($marker.title.length > 0){
				tracking.createMarkerName($vid,$marker.title,$marker.position,$markerStop);
			}

		}
		//tracking.polyline[$vid].getPath().push($marker.position);
		vmap.polylineOver(tracking.polyline[$vid],tracking.nodes[$vid],{name:$("#gps-vehicles option[value="+$vid+"]").text(),vid:$vid,t:tracking.nodes[$vid].t});
	},
	unsetPoints:function(data){
		 $.each(data, function(index, i) {
			 if( tracking.markers[i] ) {
				 for (ii in tracking.markers[i]) {
					tracking.markers[i][ii].setMap(null);
				 }
				 delete tracking.markers[i];
			 }
			 if(tracking.rotate[i]) {
				tracking.rotate[i].remove();
				delete tracking.rotate[i];

			 }
			 if(tracking.name[i]) {
				tracking.name[i].remove();
				delete tracking.name[i];
			 }
			 if(tracking.nodes[i]){
				tracking.nodes[i] = null;
				delete tracking.nodes[i];
			 }
			 if( tracking.polyline[i] ) {
				tracking.polyline[i].setMap(null);
				tracking.polyline[i].setPath([]);
				delete tracking.polyline[i];
			 }
		 });

	},
	createMarkerName:function($vid,$name,$position,$iconStop){
		if (tracking.name[$vid]){
			tracking.name[$vid].remove();
		}

		tracking.name[$vid] = new Label({
			map: vmap.map,
			position: $position ,
			innerHTML:'<span style="width:'+($name.length*8)+'px; margin-bottom:'+( ($iconStop == true )?-10:30 )+'px" >'+$name+'</span>',
			className:'marker-title'
		});
	},
	track:function(){
		var vehicle = [];
		var uncheck = [];
		$('#gps-vehicles :selected').each(function(i, selected){
		    vehicle.push($(selected).val());
		});
		//if(vehicle.length < 1) return false;

		tracking.ajax = $.ajax({
			  url: site_url+'theo-doi.json',dataType: 'json', data:{vehicle:vehicle},type :'GET',
			  beforeSend:function(){
				  vmap.loading = true;
				  $('#gps-vehicles :not(:selected)').each(function(i, selected){
						uncheck.push($(selected).val());
				  });
				  tracking.unsetPoints(uncheck);

			  },
			  success: function(data){
				  if(data && data != '' && data[0] ) {

					  var $itemSize = 0;
					  var node, point;
					  var movingNode = lastTime =0;

					  vmap.timestamp = data.timestamp;  delete data['timestamp'];
					  if(data[1]){
						  $showTitle = true;
					  } else {
						  $showTitle = false;
						  if(tracking.name){
							  $.each(tracking.name, function(i, item) {
								  if(tracking.name[i]) {
										tracking.name[i].remove();
										delete tracking.name[i];
									}
							  });
						  }

					  }
					  $.each(data, function(i, item) {
						  if(item !=null && item.vid){
							  lastTime = Math.max(lastTime,item.t)
							  if( vmap.LatLngValidation(item.la,item.lo) != true && item.correct ) {
								  point = item.correct;
								  data[0].la = point.la;
								  data[0].lo = point.lo;
							  } else {
								  point = item;
							  }

							  if ( (vmap.timestamp/1000 -  item.t) < 1800 && item.t == point.t && point.speed > 0  ) {
								  movingNode++;
								}


							  tracking.addPoint(item.vid, point, item.t , $showTitle);
							  if(tracking.center==true){
								  if(!vmap.bounds){
									  vmap.bounds = new google.maps.LatLngBounds();
								  }
								  vmap.bounds.extend(vmap.LatLng(point.la,point.lo));
							  }
							  $itemSize++;
						  }

					  });

					if(data && tracking.center==true && vmap.bounds){
						if($itemSize == 1){
							vmap.map.setCenter(vmap.LatLng(point.la,point.lo));
						} else if( tracking.center ==  true) {
							//vmap.map.setCenter(vmap.bounds.getCenter());


							//console.log('fitBounds zoom='+vmap.map.getZoom());
							var zoomSet = google.maps.event.addListener(vmap.map, 'bounds_changed', function() {

								if( this.initialZoom == true ){
									console.log('fitBounds zoom='+vmap.map.getZoom());
									vmap.map.setZoom( Math.min(vmap.zoom,vmap.map.getZoom()));
									this.initialZoom = false;
								}
								console.log('fitBounds zoom='+vmap.map.getZoom());
								google.maps.event.removeListener(zoomSet);

							});
							vmap.map.initialZoom = true;
							vmap.map.fitBounds(vmap.bounds);
							//zoomSet.remove();

							//console.log('current zoom='+vmap.map.getZoom());
							//console.log('current zoom='+vmap.map.getZoom());
							//console.log('set zoom='+vmap.map.getZoom());
						}
						tracking.center = false;
					}
					if($itemSize > 1){
						$('#vehicle-info').html(i18n.moving_device(movingNode, $itemSize, lastTime));
						vmap.addressArea.hide();
					} else {
						tracking.nodeInfo(data[0]);
					}
				  }
			  },
			  complete:function(){
				  vmap.loading = false;

			  }
		});
	},
	trackingOne:function(){
		$.ajax({
			url: vmap.trackingLink,dataType: 'json',
			beforeSend:function(){
			  vmap.loading = true;
		  	},
			success: function(data){
				  if(data){
					  tracking.nodeTrueInfo(data);
					  if( point = (vmap.LatLngValidation(data.la,data.lo) != true &&  data.correct)?point = data.correct:data ){
						  tracking.addPoint(data.vid,point,data.t);
						  tracking.nodeInfo(point);
						  if(tracking.center==true){
							  vmap.map.setCenter(vmap.LatLng(point.la,point.lo));
							  tracking.center = false;
						  }
					  }
				  }
			  },
			  complete:function(){
				  vmap.loading = false;
			  }
		});
	},
	trackingOneIni:function(){
		vmap.autoLoad("tracking.trackingOne");
		$("#gps-vehicles").change(function() {
			 window.location.href = site_url+"theo-doi/"+$(this).val()+'.html';
		});
		$('input[type=text][name=gps-date]').val('');
		$('#obi-calendar').datepicker('option', 'onSelect',function(dateStr){
			$('input[type=text][name=gps-date]').val(dateStr);
			$vid = $('#gps-vehicles option:selected').val();
			vmap.stopAjax = true;
			vmap.statusArea.hide();
			tracking.unsetPoints([]);
			playback.int({
				name : $('#gps-vehicles option:selected').text(),
				start:	dateStr,
				end:	null,
				vid:	$vid
			});
		});
		$('a[name=reset]').click(function(e){
			$('input[type=text][name=gps-date]').val('');
			vmap.stopAjax = false;
			vmap.statusArea.show();
			playback.setNull();
			e.preventDefault();
		});
	}

};


