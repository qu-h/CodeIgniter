


var vmap = {
	map:'',zoom:10,lastNode:'', polyline:[], nodeLine :[],infowindow:[],addMarkerAnimation:true,rotateLable:'',
	bounds : new google.maps.LatLngBounds(),
	icon:{
		begin : assets_url+'/images/marker_greenA.png',
		end : assets_url+'/images/marker_greenB.png',
//		stop : assets_url+'/images/stoping.png',
		lost : assets_url+'/images/dung.png',
		over : assets_url+'/images/quatodo.png',
		run : assets_url+'/images/chay.png',
		transparent : assets_url+'/images/transparent.png',
		history : assets_url+'/images/viewchay.png',
		via: assets_url+'/images/dd-via.png',
	},
	iconIndex:function(i){
		return assets_url+'/images/marker_'+i+'.png';
	},
	mapGuide:'<div class="node-guide wrappage" >'
			+'<span class="node-stop" >Dừng</span>'
			+'<span class="node-running" >Di Chuyển</span>'
			+'<span class="node-exceed" >Vượt Tốc Độ</span>'
			+'</div>',
	ajaxLink : site_url+'map.html',
	addressCache:[],
	dateFormat:'dd-mm-yy',
	dateToString:function(date){
		var d = date.getDate();
		var m = date.getMonth()+1;
		var y = date.getFullYear();
		return '' + (d<=9?'0'+d:d) +'-'+ (m<=9?'0'+m:m) +'-'+ y;
	},
	dateParse2String:function($parse,format){
		var date = new Date($parse*1000);
		var d = date.getDate();
		var m = date.getMonth()+1;
		var y = date.getFullYear();
		dateFormat = '' + (d<=9?'0'+d:d) +'-'+ (m<=9?'0'+m:m) +'-'+ y;
		if(format == 'd/m/Y H:i:s'){
			return dateFormat+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
		} else { //d/m/Y
			return dateFormat;
		}
	},
	strtotime:function($str){ // day-month-year
	//	alert($str);
		
		//strTmp = ($str)?$str:Date.now();
		if(!$str || $str ==''){
			//strTmp = new Date();
			parse = Date.parse(new Date());
		}else {
//			alert($str);
			strTmp = String($str);
//			alert(strTmp);
			strTmp = strTmp.replace(/\s{2,}|^\s|\s$/g, ' '); // unecessary spaces  
			strTmp = strTmp.replace(/[\t\r\n]/g, ''); // unecessary chars  
//			    alert(strTmp);return false;
			timeAr = strTmp.split(' ');
			$dateAr = timeAr[0].split('-');
			//$dateStr = 
			if(timeAr[1]){
				$timeAr = timeAr[1].split(':');
				parse = Date.parse( new Date($dateAr[2],$dateAr[1]-1,$dateAr[0],$timeAr[0],$timeAr[1]) );
//				alert(new Date($dateAr[2],$dateAr[1]-1,$dateAr[0],$timeAr[0],$timeAr[1]));
//				alert(parse)
			} else {
				parse = Date.parse( new Date($dateAr[2],$dateAr[1]-1,$dateAr[0]));
			}
			
			//parse = Date.parse($timeAr[2]+'-'+$timeAr[1]+'-'+$timeAr[0],"yyyy-MM-dd");
			//parse = Date.parse( new Date($dateAr[2],$dateAr[1]-1,$dateAr[0]),$timeAr[0],$timeAr[1] );
			//alert('date string ='+ );
		}
	  
//		alert(parse);
		
		 if (!isNaN( parse ) ) {
			    return parse/1000;
		 } else {
			 //alert('is isNaN year='+$timeAr[2]);
//			 alert(parse);
			 return false;
		 }
		//return $time.getTime();
		
	},
	date:function(strtotime,format ){
		if(strtotime == undefined ){
			strtotime = vmap.timestamp;
		} 
		format = (format == undefined)?'d-m-Y':format;
		//alert(strtotime);
		$date = new Date(strtotime);
		$day = ($date.getDate() >= 10 )?$date.getDate():'0'+$date.getDate();
		$month = ($date.getMonth() > 10)?($date.getMonth()+1) : ('0'+ ($date.getMonth()+1) );
		$hours = ($date.getHours() >= 10 )?$date.getHours():'0'+$date.getHours();
		$minutes = ($date.getMinutes() >= 10 )?$date.getMinutes():'0'+$date.getMinutes();
		$seconds = ($date.getSeconds() >= 10 )?$date.getSeconds():'0'+$date.getSeconds();
		
		$timeStr = format;
		$timeStr = $timeStr.replace("d",$day);
		$timeStr = $timeStr.replace("m",$month);
		$timeStr = $timeStr.replace("Y",$date.getFullYear());
		
		$timeStr = $timeStr.replace("H",$hours);
		$timeStr = $timeStr.replace("i",$minutes);
		$timeStr = $timeStr.replace("s",$seconds);
		return $timeStr;
	},
	
	daysFromNow:function($str,$add){
		$now = new Date();
		//$taget = vmap.strtotime($str);
		//$diff = $taget - Date.parse($now)/1000 ;
		$diff = vmap.strtotime($str) - Date.parse(new Date())/1000;
//		alert(Date.parse($str));/1000
		$days = Math.round($diff/86400);
		//alert($days);
		if($add){
			$days = $days+parseInt($add);
		}
		return $days;
	},
	removePolyline:function(){
		for (i in vmap.polyline) {
			vmap.polyline[i].setMap(null);
		}
		vmap.polyline = [];
	},
	LatLng:function($la,$lon){
		//if(!$la)
		if(!$la || $la > 180 ) $la = '21.029552';
		if( !$lon || $lon > 180) $lon = '105.852400';
		return new google.maps.LatLng($la,$lon);;
	},
	LatLngValidation:function(la,lon){
		if(la >= 90 || la <=-90) return false;
		else if (lon >= 180 || lon <=-180) return false;
		else return true;
	},
	
	bind_geocode:function(la,lo,e){
		var geocoder =  new google.maps.Geocoder();
		if( !e ){
			e = vmap.addressArea;
		}
		if( la != e.attr('la') ||  lo != e.attr('lo') ){
			geocoder.geocode({'latLng': vmap.LatLng(la,lo)}, function(results, status) {
		        if (status == google.maps.GeocoderStatus.OK) {
		        	if (results[1]) {
						var address = '';
		        		$.each(results[0].address_components, function (i, cop) {
							if ( cop.types.indexOf('street_number') > -1 
									|| cop.types.indexOf('bus_station') > -1 
									|| cop.types.indexOf('transit_station') > -1 
									|| cop.types.indexOf('establishment') > -1  
									|| cop.types.indexOf('neighborhood') > -1){
								address = cop.long_name;
							} else if ( cop.types.indexOf('route') > -1 && cop.long_name ){
								address +=' '+cop.long_name;
							} else if( cop.types.indexOf('sublocality') > -1 && cop.long_name){
								address +=( (address!='')?', ':'' )+cop.long_name;
							} else if( cop.types.indexOf('administrative_area_level_2') > -1 ){
								address +=( (address!='')?', ':'' )+cop.long_name;
							} else if( cop.types.indexOf('administrative_area_level_1') > -1 ){
								address +=', '+cop.long_name;
							}
							
		        		});
		       			e.show();
		       			e.html(address);
		            } else {
		            	e.hide();
		            }
		        } 
	        });
		}
		
	},
	ini : function ($la,$lon,$popup) {
		vmap.statusArea = $('#gmap-status');
		vmap.addressArea = $('#gmap-address'),
		this.lastNode = this.LatLng($la,$lon);
	    var mapOptions = {
	      zoom: vmap.zoom ,
	      mapTypeId: google.maps.MapTypeId.ROADMAP,
	      center: this.lastNode,
	      scaleControl: true,
	      scrollwheel: true, 
	      streetViewControl:false,
	      //mapTypeControl: false,
			//zoomControlOptions: {
			 // style: google.maps.ZoomControlStyle.SMALL,
	  		  //position: google.maps.ControlPosition.LEFT_TOP
			//},
	      //panControl: false,
	      overviewMapControl: true,
	      overviewMapControlOptions: { opened: false }
	    };
	    if( $popup != true ) {
	    	$('#gmap').height( $(window).height() - 175 );
	    	$("body").append(vmap.mapGuide);
	    }
	    
	    vmap.map = new google.maps.Map(document.getElementById('gmap'),mapOptions);
	    
	},
	popup:function(e,info){
		vmap.resetSearchForm();
		$map = $('#gmap');
		var latlngStr = e.attr('latlng').split(',',2);
		//alert(latlngStr[0]);
		if($map.length > 0){
			$('.vmap-popup').show();
		} else {
			$('body').append('<div class="ui-widget-overlay" style="display: none;"></div>');
			$('body').append('<div class="vmap-popup" ><div class="content"><div id="gmap"></div></div><a class="close_x" href="#">close</a></div>');
			
			
			$('.vmap-popup').css({'width':750,'height':400}).center();
			$('#gmap').css({'width':750,'height':400});
			vmap.ini(parseFloat(latlngStr[0]), parseFloat(latlngStr[1]),true);
		}
		
		$('body').css({'overflow-y':'hidden'});
		$('.ui-widget-overlay').show();
		
		if( !info || info == null ){
			info = {'name':i18n.node_stop,'address':e.html()};
		}
		info.la = parseFloat(latlngStr[0]);
		info.lo = parseFloat(latlngStr[1]);
		vmap.addMarker( vmap.LatLng(latlngStr[0], latlngStr[1]) ,info.name,vmap.iconIndex(0),info,null,null,true );
		vmap.map.setCenter(vmap.LatLng(latlngStr[0], latlngStr[1]));
        
		$('.close_x',$('.vmap-popup')).click(function(e){
			e.preventDefault();
			$(this).parents('.vmap-popup').remove();
			$('body').css({'overflow-y':'auto'});
			$('.ui-widget-overlay').remove();
		});
	},
	defaultMaker:function(){
		vmap.removeMaker();
		vmap.removePolyline();
		//this.addMarker();
		//vmap.markers.push( new google.maps.Marker({ position: this.lastNode, map: vmap.map, icon:vmap.iconStop, }) );
		//this.updateNode();
	},
	loading:false, stopAjax : false,
	autoLoad:function($fn){
		vmap.statusArea.html(i18n.loading);
		eval($fn+'()');
		tracking.refresh = vmap.refresh;
		window.setInterval(function() {
			if(!vmap.loading && !vmap.stopAjax ){
				if(tracking.refresh==0){
					tracking.refresh = vmap.refresh;
					vmap.statusArea.html(i18n.loading);
					eval($fn+'()');
				} else {
					vmap.statusArea.html(i18n.refresh_time(tracking.refresh));
					tracking.refresh--;
				}
			}
		},1000);
	},
	markers :[],
	addMarker:function($position,$title,$icon,$info,animation,returnObject,clickShowInfo,callback){
		if(!$icon){
			$icon = vmap.icon.lost;
		}
		$marker = { position: $position, map: vmap.map, icon:$icon, title:$title, draggable:false};
		if(animation==true){
			$marker.animation = google.maps.Animation.DROP;
		}
		//$mapMarker = new google.maps.Marker($marker);
		$addMarker = new google.maps.Marker($marker);
		$addMarker.info = $info;
		if(clickShowInfo){
			vmap.showMarkerInfo($addMarker);
			/*
			google.maps.event.addListener($addMarker, 'click', function(innerKey) {
				if(callback){
					eval(callback);
				} else {
					vmap.showMarkerInfo(this);
				}
				
			});
			*/
		}
		if(returnObject==true){
			return $addMarker;
		} else {
			vmap.markers.push($addMarker);
		}
	},
	
	removeMaker:function(){
		for (i in vmap.markers) {
			vmap.markers[i].setMap(null);
		}
		delete vmap.markers;
		vmap.markers = [];
	},
	showMarkerInfo:function($marker){
		if( typeof($marker.info) == 'undefined' || $marker.info == null || typeof($marker.info.name) == 'undefined' || $marker.info.name == null ){
			return null;
		}
		$marker.info.address = null;
		//console.log( 't='+Object.keys($marker.info).length );
		vmap.markerInfo.setContent('<div id="infowindow-content" class="obi obi-w" style="height:'+((Object.keys($marker.info).length+1)*28)+'px;overflow:hidden;" >'+
		         '<h3 id="firstHeading" class="firstHeading">'+$marker.info.name+'</h3>'+
		         '<div class="bodyContent">'+
		         	 ( ($marker.info.t)?'<div class="obi-l" ><label>'+i18n.time +'</label>'+vmap.date($marker.info.t*1000,'H:i:s (d/m/Y)') +'</div>':'' )+
			         ( ($marker.info.speed)?'<div class="obi-l" ><label>'+i18n.speed+'</label><span class="value" name="speed">'+$marker.info.speed+'</span><span class="unit" >Km/h</span></div>':'' )+
			         ( ($marker.info.gps)?'<div class="obi-l" ><label>'+i18n.gps_lable+'</label>'+$marker.info.gps+'</div>':'' )+
			         ( ($marker.info.tStop)?'<div class="obi-l" ><label>'+i18n.stop_lable+'</label>'+$marker.info.tStop+'</div>':'' )+
			         ( ($marker.info.gsm)?'<div class="obi-l" ><label>'+i18n.gsm_lable+'</label>'+$marker.info.gsm+'</div>':'' )+
			         ( ($marker.info.la)?'<div class="obi-l" ><label>'+i18n.latitude +'</label>'+$marker.info.la+'</div>':'' )+
			         ( ($marker.info.lo)?'<div class="obi-l" ><label>'+i18n.longitude+'</label>'+$marker.info.lo+'</div>':'' )+
			         //( ($marker.info.address)?'<div class="obi-l" >'+$marker.info.address+'</div>':'' )+
			         '<div class="obi-l obi-address" la="" lo="" ></div>'+
		         '</div>'+
	         '</div>'
         );
		vmap.map.setCenter($marker.getPosition());
		//$('#infowindow-content').css({'width':350});
		vmap.markerInfo.open(vmap.map,$marker);
		vmap.bind_geocode($marker.info.la,$marker.info.lo,$('#infowindow-content .obi-address'));
		
	},
	
	removeInfoWindow:function(){
		for (i in vmap.infowindow) {
			vmap.infowindow[i]['info'].close();;
		}
	},

	reset:function(){
		$('input[type=text][name=gps-date]').val('');
		$('span[name=gps-number]').html(1);
		$('span[name=gps-total]').html(1);
		$('input[name=page]').val(1);
		$('a[name=next]').hide();
	},
	makerEvent:function(){
		$( "a[name=reset]" ).button().click(function(e) {
			vmap.reset();
			vmap.defaultMaker();
			e.preventDefault();
		}).children('span').css({'padding':'2px 5px'});
		
		
		$('input[name=page]').val(1);
	    $('a[name=next]').button().click(function(e){
	    	if(parseInt( $('span[name=gps-number]').html() ) < parseInt( $('span[name=gps-total]').html() )) {
	    		vmap.loadMaker($('input[type=text][name=gps-date]'));
	    	}
	    	
	    	e.preventDefault();
		}).children('span').css({'padding':'2px 5px'});
	    google.maps.event.addListener(vmap.map, 'click', function() {
	    	vmap.removeInfoWindow();
	    });
	},
	
	geocoding_search:function(){
		vmap.resetSearchForm();
		$form = $('#gmap-address-search form#search-address');
		$formResult = $('#gmap-address-search .results');
		vmap.statusArea.hide();
		$form.submit(function() {
			$q = $('input[name=address]',$form).val();
			if(!vmap.loading && !vmap.stopAjax ){
				$.ajax({ url: 'http://maps.googleapis.com/maps/api/geocode/json',dataType:'JSON', data :'sensor=false&language=vi&address='+encodeURIComponent($q),
					beforeSend: function(){
						vmap.resetSearchForm();
						vmap.statusArea.show().html(i18n.loading);
						$formResult.html('<div class="control"><a href="#">'+i18n.search_reset+'</a></div>');
					},
					success:function(data){ 
						if( data.status=='OK' ){
							$.each(data.results, function(i, $r) {
								$('div.control',$formResult).before('<div class="result result_'+i+'" >'+$r.formatted_address+'</div>');
								$location = vmap.LatLng($r.geometry.location.lat, $r.geometry.location.lng);
								$info = {'name':i18n.search+' ('+$q+')','address':$r.formatted_address};
								$showInfoWindow = (i==0)?true:false;
								vmap.addMarker( $location,$info.name,vmap.iconIndex(i),$info,null,null,$showInfoWindow );
								
							});
							$('.result',$formResult).each(function(i, $e) {
								$(this).click(function(){
									vmap.showMarkerInfo(vmap.markers[i]);
								});
							});
							$('div.control a',$formResult).click(function(e){
								vmap.resetSearchForm();
								e.preventDefault();
							});
						}
					},
					complete :function(){
						vmap.statusArea.hide();
					}
				});
			}
			return false;
		});
	},
	resetSearchForm:function(){
		$('#gmap-address-search .results').html('');
		vmap.removeMaker();
		vmap.removeInfoWindow();
		$('#gmap-address-search form#search-address input[name=address]').val('');
	},
	distance:function($latLng1,$latLng2){
		//$dlat = ($latLng1.lat()-$latLng2.lat());
		//$dlng = ($latLng1.lng()-$latLng2.lng());
		//return Math.sqrt($dlat * $dlat + $dlng* $dlng ) * 110;
		return (google.maps.geometry.spherical.computeDistanceBetween($latLng1, $latLng2) / 1000).toFixed(2);
	},
	detailMarker:null,
	polylineMarker:function(){
		return new google.maps.MarkerImage(vmap.icon.via
					    ,new google.maps.Size(11, 11)
					    ,new google.maps.Point(0,0)
					    ,new google.maps.Point(5.5,5.5)
				);
	},
	polylineOver:function(line,nodes,motor){
		google.maps.event.addListener(line, 'mousemove', function (event) {
		//google.maps.event.addListener(line, 'mouseover', function (event) {
			var $nearNode = 0;
			var $nearest = 0;
			line.setOptions({'strokeOpacity':1});
			
			$.each(line.getPath(), function(index, value) {
				$distance = parseFloat( vmap.distance(  line.getPath().getAt(index) ,event.latLng) );
				if(index==0){
					$nearest = $distance;
					$nearNode = index;
				}else  if($nearest > $distance ){
					$nearest = $distance;
					$nearNode = index;
				}
			});
			//$nodeIndex = ($nearNode > 0 ) ?($nearNode):0;
			$nodeIndex = $nearNode;
			//alert($nodeIndex);
			if(vmap.detailMarker == null ){
				
				//alert('new marker');
				//alert( nodes[0].t +' click=' +  nodes[$nearNode].t );
				vmap.detailMarker = vmap.addMarker(line.getPath().getAt($nearNode),' node =' + $nodeIndex,vmap.polylineMarker(),{},false,true,true);
			} else {
				vmap.detailMarker.setVisible(true);
				//alert('update postion');
				vmap.detailMarker.setPosition( line.getPath().getAt($nearNode) );
				vmap.detailMarker.setTitle( ' node =' + $nodeIndex );
				
				//google.maps.event.addListener(vmap.detailMarker, 'click', function(innerKey) {
				//	vmap.getNode( nodes[$nodeIndex].t ,{name:motor.name,vid:motor.vid});
				//});
			}
			vmap.subNodeByTime(vmap.detailMarker,{name:motor.name,vid:motor.vid,t:( parseFloat(nodes[$nodeIndex].t) ),index:$nodeIndex});
		});
		
		google.maps.event.addListener(line, 'mouseout', function (event) {
			line.setOptions({'strokeOpacity':playback.polylineOpacity});
			if(vmap.detailMarker){
				vmap.detailMarker.setVisible(false);
				google.maps.event.addListener(vmap.detailMarker, 'mouseover', function (event) {
					line.setOptions({'strokeOpacity':1});
					vmap.detailMarker.setVisible(true);
					//	return;
				});
				google.maps.event.addListener(vmap.detailMarker, 'mouseout', function (event) {
					if(vmap.detailMarker){
						vmap.detailMarker.setVisible(false);
					}
					line.setOptions({'strokeOpacity':playback.polylineOpacity});
				});
			}
			
			
		});
		
	},
	
	subNodeByTime:function($marker,$ven){
		google.maps.event.clearListeners($marker, 'click');
		google.maps.event.addListener($marker, 'click', function(innerKey) {
			if(vmap.checkMarker){
				vmap.checkMarker.setMap(null);
				delete vmap.checkMarker;
			}
			vmap.checkMarker = vmap.addMarker(vmap.detailMarker.getPosition(),'Stop',vmap.polylineMarker(),{},false,true,false);
			vmap.detailMarker.setMap(null);
			delete vmap.detailMarker;
			vmap.detailMarker = null;
			vmap.markerInfo.close();
			$.ajax({ 
				//url: site_url+'lich-su/toa-do.json',dataType:'JSON', data :'node='+$ven.t+'&vid='+$ven.vid,
				url: site_url+'toa-do/'+$ven.vid+'/'+$ven.t+'.json',dataType:'JSON',
				
				beforeSend: function(){ $('.ajax-modal').show(); },
				success:function(data){ 
					if(data){
						//alert(data.t*1000 );
						vmap.checkMarker.info = data;
						vmap.checkMarker.info.name = $ven.name;
						//vmap.checkMarker.info.t = vmap.date( data.t*1000, 'd/m/Y H:i:s');
						vmap.checkMarker.info.t = data.t;
					}
				},
				complete :function(){
					$('.ajax-modal').hide();
					vmap.showMarkerInfo(vmap.checkMarker);
				}
			});
			return ;
			
		});
	},
	tooltip:function(){
		var tip=null;
		$('.item[rel=tooltip], .item[rel=tooltip] span, .item[rel=tooltip] div ').mouseover(function(e) {
			if( $(this).attr('rel')=='tooltip' ){
				tip = $(this);
			} else {
				tip = $(this).parents('.item[rel=tooltip]');
			}
			//var title = tip.attr('tip');
//			tip.attr('title','');
//			alert(title);
			//Remove the title attribute's to avoid the native tooltip from the browser
			
			
			//Append the tooltip template and its value
			if( $("#tooltip") ){
				$("#tooltip").remove();
			}
			unit = '';
			if( $('span.unit',tip) && $('span.unit',tip)[0] ){
				unit = $('span.unit',tip)[0].outerHTML;
			}

			tip.append('<div id="tooltip">' + tip.attr('tip') + $('span.value',tip)[0].outerHTML + unit+ '</div>');		
			$("body").css("cursor", "help");
			//Show the tooltip with faceIn effect
			$('#tooltip').fadeIn('500');
			$('#tooltip').fadeTo('10',0.9);
			
		}).mousemove(function(e) {
		
			//Keep changing the X and Y axis for the tooltip, thus, the tooltip move along with the mouse
			$('#tooltip').css('top', e.pageY  - 80);
			$('#tooltip').css('left', e.pageX  );
			
		}).mouseout(function() {
			tip.children('div#tooltip').remove();
			$("body").css("cursor", "auto");
			
		});
	},
//	getNode:function(time,motor){
//	//alert(time); return;
//		if(vmap.checkMarker){
//    		vmap.checkMarker.setMap(null);
//    		delete vmap.checkMarker;
//    	}
//		vmap.checkMarker = vmap.addMarker(vmap.detailMarker.getPosition(),'Stop',vmap.polylineMarker(),{},false,true,false);
//		
//		vmap.detailMarker.setMap(null);
//		delete vmap.detailMarker;
//		vmap.detailMarker = null;
//
//		vmap.markerInfo.close();
//		$.ajax({ url: site_url+'toa-do/'+motor.vid+'/'+time+'.json',dataType:'JSON',
//			beforeSend: function(){ $('.ajax-modal').show(); },
//			success:function(data){ 
//				if(data){
//					//alert(data.t);
//					vmap.checkMarker.info = data;
//					vmap.checkMarker.info.name = motor.name;
//					vmap.checkMarker.info.t = data.t;
//				}else {
//					//alert('data is empty');
//				}
//			},
//			complete :function(){
//				$('.ajax-modal').hide();
//				vmap.showMarkerInfo(vmap.checkMarker);
//			}
//		});
//	},
	
	
	
};
