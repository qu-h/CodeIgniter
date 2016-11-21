vmap.kml = null;
var playback = {
	way:null, timerHandle:null, marker:null, nodes:[],
	poly2:null, lastNode : 1,step:500,/*0.2 metres */tick:1000, /*milliseconds for met*/
	buttonPlay:null, movingStatus:0,
	detailMarker:null, polylineOpacity:0.6,
	setNull:function(){
		if(playback.way != null){
			if( playback.way.getMap() ){
	       		playback.way.setMap(null);
	       	}
	       	delete playback.way;
	       	playback.way = null;
	       	vmap.removeMaker();
	   }
		if(playback.info){
    		playback.info.setMap(null);
    		delete playback.info;
        	playback.info = null;
    	}
	},
	date_begin:'',date_end:'',
	create:function(){
		if( $('input[name=gps-date]')){
			$begin = $('input[name=gps-date]');
			playback.dayAct();
		} else if ($( "input[name=gps-time-begin]" ) && $( "input[name=gps-time-end]" )){
			$begin = $('input[name=gps-time-begin]');
			playback.daysAct()
		}
		if($begin.attr('min') && $begin.attr('min')!='' ){
			//alert('set min for date');
			$begin.datetimepicker("option","minDate", vmap.date( $begin.attr('min')*1000 ) );
		}
		playback.buttonPlay = $('button[name=gps-history-play]');
		playback.buttonPlay.button({ disabled: true });
		$( "div[name=playback-speed]" ).slider({value:10,range: "min",max: 100,min:0.5});
		
		$('button[name=gps-history-submit]').click(function(e){
			e.preventDefault();
			if(!$('#gps-vehicles').val()){
				alert(i18n.motor_not_empty);
				$('#gps-vehicles').focus();
				return false;
			} else if (!playback.date_begin){
				alert(i18n.date_not_empty);
				$begin.datepicker("show"); 
				return false;
			} else {
				playback.int();
				
			}
		});
		$('#gps-vehicles').change(function(){playback.int();});
		playback.int();
	},
	dayAct:function(){
		$day = $( "input[name=gps-date]" );
		$timeBegin = $( "input[name=gps-time-begin]" );
		$timeEnd = $( "input[name=gps-time-end]" );
		if( $day.val() == '' ){
			//alert('set date');
			$day.val(vmap.date(null,'d-m-Y'));
		}
		
		$timeBegin.val('00:00');
		$timeEnd.val('23:59');
		
		
		playback.date_begin = vmap.strtotime( ($( "input[name=gps-date]" ).val()) +' '+($timeBegin.val()) );
		playback.date_end = vmap.strtotime( ($( "input[name=gps-date]" ).val()) +' '+($timeEnd.val()) );
		
		$timeBegin.change(function(){
			//alert($day.val());
			playback.setTimeQue( $( "input[name=gps-date]" ).val()+' '+$timeBegin.val(),$( "input[name=gps-date]" ).val()+' '+$timeEnd.val());
		});
		
		$timeEnd.change(function(){
			playback.setTimeQue( $( "input[name=gps-date]" ).val()+' '+$timeBegin.val(),$( "input[name=gps-date]" ).val()+' '+$timeEnd.val());
		});
		$( "input[name=gps-date]" ).change(function(){
			playback.setTimeQue( $(this).val()+' '+$timeBegin.val(),$(this).val()+' '+$timeEnd.val());
		});
	},
	daysAct:function(){
		$begin = $( "input[name=gps-date-begin]" );
		$end = $( "input[name=gps-date-end]" );
		//$begin.datepicker("option","maxDate", vmap.date( vmap.timestamp ) );
		$begin.datetimepicker("option","maxDate", vmap.date( vmap.timestamp ) );
		
		$end.datetimepicker("option","minDate", vmap.date( vmap.timestamp,'d-m-Y H:i' ) );
		$end.datetimepicker("option","maxDate", vmap.date( vmap.timestamp,'d-m-Y H:i' ) );
		$end.val($begin.val());
		
		
		//if(!$begin.val()){
		$begin.val(vmap.date(null,'d-m-Y 00:00'));
		$end.val(vmap.date(null,'d-m-Y 23:59'));
		//}
		$begin.change(function(){
			
			var d = new Date( vmap.strtotime($begin.val())*1000 );
			alert( vmap.date(Date.parse(d),'d-m-Y 23:59') ); return false;
		    $end.datepicker("option","minDate",vmap.date(Date.parse(d),'d-m-Y 23:59'));
			d.setMonth(d.getMonth() + 1);
			if( ( Date.parse(d)/1000 - vmap.strtotime($end.val()) ) <= 0  ){
				//alert(' hrere');
				$end.val( vmap.date(Date.parse(d),'d-m-Y')+' 23:59' );
		    	$end.datetimepicker("option","maxDate", vmap.date(Date.parse(d),'d-m-Y')+' 23:59' );
		    	
			} else if ( vmap.strtotime($begin.val()) - vmap.strtotime($end.val()) > 0 ){
				//alert(vmap.date($begin.val()*1000,'d-m-Y'));
				$end.val( vmap.date($begin.val()*1000,'d-m-Y')+' 23:59' );
				$end.datetimepicker("option","maxDate",vmap.date($begin.val()*1000,'d-m-Y 23:59'));
			}
			
		});
	},
	setTimeQue:function(begin,end){
		playback.date_begin = vmap.strtotime( begin );
		playback.date_end = vmap.strtotime( end );
	},
	int:function(){
		if( (playback.date_begin && isNaN(playback.date_begin)) || (playback.date_end && isNaN(playback.date_end)) ) {
			alert('nothing to do');
			return false;
		}
		ob = {
			name : $('#gps-vehicles option:selected').text(),
			start: playback.date_begin,
			end:   playback.date_end,
			//vid:   $('#gps-vehicles').val()
		};
		if(  $("gps-date") ){
			ob.start = vmap.strtotime( $( "input[name=gps-date]" ).val() +' '+$( "input[name=gps-time-begin]" ).val() );
			ob.end = vmap.strtotime( $( "input[name=gps-date]" ).val() +' '+$( "input[name=gps-time-end]" ).val() );
		}
		
		
		playback.movingStatus = 0;
		//vmap.bounds = new google.maps.LatLngBounds();
		playback.setNull();
		playback.way = new google.maps.Polyline({ 
			strokeColor: '#0000FF' , strokeOpacity: playback.polylineOpacity, strokeWeight: 5
			//geodesic: true, clickable: true
		});
		$query = '';
		if(ob.start){
			$query += 'time='+ob.start;
		}
		if(ob.end && ob.start != ob.end ){
			$query += '&end='+ob.end;
		}
		//alert(ob.start); 'vehicle='+ob.vid
		if( $('#gps-vehicles').val() ){
			$.ajax({ url: site_url+'lich-su/'+$('#gps-vehicles').val()+'.json',dataType:'JSON', data :$query,
				beforeSend: function(){ 
					$('.ajax-modal').show(); 
				},
				success:function(data){
					if(data.nodes && data.nodes !='' ){
						if(playback.nodes){
							delete playback.nodes;
						}
						playback.nodes = [];
						if(data.nodes.length <=0){
							alert('Không có dữ liệu');
						} else {
							$.each(data.nodes, function(i, no) {
								$newPoint = vmap.LatLng(no.la,no.lo);
								playback.way.getPath().push($newPoint);
								playback.nodes.push({name:ob.name,t:no.t , speed:no.speed,moved:no.moved, gsm:no.gsm, gps: no.gps});
								vmap.bounds.extend($newPoint);
							});
							playback.way.setMap(vmap.map);
							playback.infoStr = playback.infoHtml({name:data.name,t:data.nodes[0].t, speed:data.nodes[0].speed});
							if(playback.buttonPlay){
								playback.buttonPlay.button({ disabled: false , label: "Bắt Đầu" });
							}
						}
					}
				},
				
				complete :function(){
					if(playback.way && playback.way.getPath().getLength() > 0){
						vmap.map.fitBounds(vmap.bounds);
						vmap.map.setCenter( vmap.bounds.getCenter() );
						vmap.map.setZoom( Math.min(15, vmap.map.getZoom()) );
						playback.startAnimation();
					}
					$('.ajax-modal').hide();
					
					vmap.polylineOver(playback.way , playback.nodes, {name:$("#gps-vehicles option:selected").text(),vid:$("#gps-vehicles").val()});
				}
			});
		};
	},
	
	startAnimation: function () {
        if (playback.marker != null) {
        	if( playback.marker.getMap() ){
        		playback.marker.setMap(null);
        	}
        	
           delete playback.marker;
           playback.marker = null;
        }
        if(playback.poly2){
        	if( playback.poly2.getMap() ){
        		playback.poly2.setMap(null);
        	}
        	//playback.poly2.setMap(null);
        	delete playback.poly2;
        	playback.poly2 = null;
        }
        if(playback.way && playback.way.getPath().getLength() > 0){
        	// add start-end marker
        	//playback.nodes
        	$eof = playback.way.getPath().getLength()-1;
        	vmap.addMarker(playback.way.getPath().getAt(0),'Bat Dau',vmap.icon.begin,playback.nodes[0],false,false);
        	vmap.addMarker(playback.way.getPath().getAt($eof),'Ket Thuc',vmap.icon.end,playback.nodes[$eof],false,false);
        	if (!playback.marker){
            	playback.marker = new google.maps.Marker({location:playback.way.getPath().getAt(0), map:vmap.map} /* ,{icon:car} */);
            	
            	playback.info = new InfoBubble({
                    map: vmap.map,
                    content: (playback.infoStr)?playback.infoStr:playback.infoHtml({speed:12,moved:1234,time:"333333"}),
                    position: playback.way.getPath().getAt(0),
                    top:33,
                    maxHeight:100,
                    disableAutoPan: true,
                    //zIndex: 999
                    //hideCloseButton: true,
                });
                playback.info.open();
            }
            	
            playback.poly2 = new google.maps.Polyline({
            	path: [playback.way.getPath().getAt(0)],
        		strokeColor: '#FF0000' ,
        		strokeWeight:5,
        		strokeOpacity: 0.8,
        		
    		});
            vmap.polylineOver(playback.poly2 , playback.nodes, {name:$("#gps-vehicles option:selected").text(),vid:$("#gps-vehicles").val()});
            playback.poly2.setMap(vmap.map);
            playback.lastNode = 0;
            if(playback.buttonPlay){
            	playback.buttonPlay.unbind('click');
                playback.buttonPlay.click(function(e){
                	//alert('play click');
                	if(playback.movingStatus == 0 || playback.movingStatus == 2){
                		$(this).button({ label: i18n.stop });
                    	if(playback.movingStatus == 2){
                    		
							//alert('back');
							vmap.removeMaker();
							vmap.addMarker(playback.way.getPath().getAt(0),'Bat Dau',vmap.icon.begin,playback.nodes[0],false,false);
							vmap.addMarker(playback.way.getPath().getAt($eof),'Ket Thuc',vmap.icon.end,playback.nodes[$eof],false,false);
							playback.poly2.setPath([playback.way.getPath().getAt(0)]);
							
							playback.lastNode = 0;
							playback.movingStatus = 1;
                			playback.animate();
                			return;
                			// playback.poly2.setMap(null);
                		}
						playback.movingStatus = 1;
                    	playback.animate();
                	} else {
                		$(this).button({ label: i18n.start });
                		playback.movingStatus = 0;
                	}
                	e.preventDefault();
                });
            }
            
        }
	},
	animate:function () {
		if (playback.lastNode >=  playback.way.getPath().getLength()-1 ) {
			var endlocation = playback.way.getPath().getAt(playback.way.getPath().getLength()-1);
			vmap.map.panTo(endlocation);
			playback.marker.setPosition(endlocation);
			playback.movingStatus = 2;
			playback.buttonPlay.button({ label: i18n.replay });
			//playback.buttonPlay.button({ disabled: true });
			return;
        } else if( playback.movingStatus == 1 ) {
        	//alert($( "div[name=playback-speed]" ).slider( "value" ));
        	playback.lastNode++;
        	index = playback.lastNode;
            var p = playback.way.getPath().getAt(index);
            playback.marker.setPosition(p);
            if(playback.nodes[index]){
            	if (!playback.info.isOpen()) {
            		playback.info.open();
            	}
            	$('#moving-info span[name=speed]').html(playback.nodes[index].speed);
            	$moved = parseFloat($('#moving-info span[name=moved]').html());
            	playback.nodes[index].moved = (playback.nodes[index].moved)?playback.nodes[index].moved:0;
            	$moved = parseFloat(playback.nodes[index].moved) + $moved;
            	$('#moving-info span[name=moved]').html( $moved.toFixed(2));
            	$('#moving-info span[name=time]').html(vmap.date( playback.nodes[index].t*1000, 'd/m/Y H:i:s'));
            	if(playback.nodes[index].speed == 0 ){
            		$stopNode = playback.nodes[index];
            		$stopNode.name = i18n.node_stop;
            		$stopNode.tStop = $stopNode.t;
            		//alert(vmap.icon.lost);
            		vmap.addMarker(playback.way.getPath().getAt(index),'Stop',vmap.icon.lost, playback.nodes[index],false,false);
					//playback.movingStatus = 0;
//					alert('bug index='+index+'time stop ='+playback.nodes[index].t+' output ='+vmap.dateParse2String( playback.nodes[index].t, 'd/m/Y H:i:s'));
            	}
            }
            
            playback.info.setPosition(p);
            playback.poly2.getPath().push(p);
            amimateSpeed = playback.tick / $( "div[name=playback-speed]" ).slider( "value" );
            //alert(Math.round(amimateSpeed));
            timerHandle = setTimeout("playback.animate()", Math.round(amimateSpeed));
        }
		
	},
	infoHtml:function(ob){
		ob.moved = (ob.moved)?ob.moved:0;
		ob.name = (ob.name)?ob.name:'Device Name';
		var html = '<div id="moving-info" class="obi obi-w" >'+
        //'<h3 id="firstHeading" class="firstHeading">'+ob.name+'</h3>'+
        '<div id="bodyContent">'+
	         '<div class="obi-l" ><label>Vận Tốc</label><span class="value" name="speed">'+ob.speed+'</span><span class="unit" >Km/h</span></div>'+
	         '<div class="obi-l" ><label>Đã Đi</label><span class="value" name="moved">'+ob.moved+'</span><span class="unit" >Km</span></div>'+
	         '<div class="obi-l" ><label>Thời Gian</label><span class="value" name="time">'+vmap.date( ob.t * 1000, 'd/m/Y H:i:s')+'</span></div>'+
        '</div>'+
        '</div>';
		return html;
	}
};
