jQuery(document).ready(function() {
	var Body = $('body');
	$('.switch').click(function(){
		var checkbox = $(this).find('input[type=checkbox]');
		newValue = ( checkbox.prop('checked') ==true ) ? false : true;
		checkbox.prop('checked',newValue);
	});

	form.numberSpinner();
	form.datatable($('table.tableajax'));
	form.date();

	$('button.cancel').click(function(){
		 window.history.back(-1);
	});

	$('a.sendmail, button.sendmail').click(function(){
		name = $(this).attr('uname');
		uid = $(this).attr('uid');

		form.mailform(name,uid);
		return false;
	});



	$("#toggle_sidemenu_l").click(function(){
		if (Body.hasClass('sb-l-c') ) {
            Body.removeClass('sb-l-c');
         }

         // Toggle sidebar state(open/close)
         Body.toggleClass('sb-l-m').removeClass('sb-r-o').addClass('sb-r-c');

	});

	$('#mailbox tbody tr').click(function(){
		self.location = $('#mailbox').attr('siteurl') + 'message/' + $(this).attr('mid');
	});

	charts.init();
	FormElements.init();

	jQuery('#sidebar_left').height( jQuery(document).height() - 100 );

	$('.summernote').summernote({
		  height: 450,   //set editable area's height
		  codemirror: { // codemirror options

		  }
	});

//	$('div.imgs_add').bind('click',form.upload_img() );
	jQuery('div.imgs_add').unbind('click').click(function(event ){
		event.preventDefault();
		form.upload_img( $(this).attr('uri'),$(this).attr('inname'),$(this).attr('dir'));

	});

//	jQuery('div.imgs_add').trigger("click");


});


var form = {

	numberSpinner : function(){
		var area = $('.number');
		$("input[type=text]",area).spinner({
			min: 0,
            //max: 2500,
            step: 1,
            //start: 1000,
        });
	},
	datatable: function(table){

		table.dataTable({
//            "aoColumnDefs": [{
//                'bSortable': false,
//                'aTargets': [-1]
//            }],
//            "oLanguage": {
//                "oPaginate": {
//                    "sPrevious": "",
//                    "sNext": ""
//                }
//            },
            "iDisplayLength": 10,
//            "aLengthMenu": [
//                [5, 10, 25, 50, -1],
//                [5, 10, 25, 50, "All"]
//            ],
            //"sDom": 'T<"dt-panelmenu clearfix"lfr>t<"dt-panelfooter clearfix"ip>',
//            "oTableTools": {
//                "sSwfPath": "vendor/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf"
//            },

            "processing": true,
            "serverSide": true,
            //"pageLength": 30,

            "bFilter": false, "bLengthChange": false,

            "order": [[1, "desc"]],
            "ajax": {
                "url": table.attr('json'), //"dataType": "jsonp",
                "data": function(data) {
                    if (data) {
                        jQuery.each(data, function(i, item) {
                            data[i] = item;
                        });
                    }
                   // d.myKey = "myValue";
                }
            },
            "fnDrawCallback": function() {
            	$('.switch').click(function(){
            		var checkbox = $(this).find('input[type=checkbox]');
            		newValue = ( checkbox.prop('checked') ==true ) ? false : true;
            		var data = {};
            		data[checkbox.attr('name')] = newValue;

            		$.ajax( {type: "POST", url: table.attr('json'), data : data, dataType:'json'} ).done(function(data) {
            			if( data.action && data.action==true ){
            				checkbox.prop('checked',data.val);
            			}
        			});

            	});

            	$('a.sendmail').click(function(){
            		name = $(this).attr('uname');
            		uid = $(this).attr('uid');

            		form.mailform(name,uid);
            		return false;
            	});
            }
        });
	},

	date : function (){
		$('.inputdate').datetimepicker( {format: "DD/MM/YYYY",pickTime: false,});

		$(".inputdate > input[type=text]").on("focus", function() {

		    return $('.inputdate').datetimepicker("showWidget");
		  });
	},

	mailform:function(name,id){

            $('#animation-switcher').find('button').removeClass('active-animation');
            $(this).addClass('active-animation item-checked');
            var sendMailForm = $('#modal-form form');
            sendMailForm.find('input[name=toid]').val(id);
            sendMailForm.find('div.toname').html(name);
            sendMailForm.find('input[name=toname]').val(name);
            $('input[name=title],textarea',sendMailForm).val('');
            // Inline Admin-Form example
            $.magnificPopup.open({
                removalDelay: 500, //delay removal by X to allow out-animation,
                items: {
                    src: '#modal-form'
                },
                // overflowY: 'hidden', //
                callbacks: {
                    beforeOpen: function(e) {
                        var Animation = $("#animation-switcher").find('.active-animation').attr('data-effect');
                        this.st.mainClass = Animation;


                    }


                },
                midClick: true // allow opening popup on middle mouse click. Always set it to true if you don't provide alternative source.
            });


            $('button[type=submit]',sendMailForm).unbind('click').click(function(){
            	if(  $('input[name=title]',sendMailForm).val() =='' ||  $('textarea',sendMailForm).val()=='' ){

            	} else {
            		$.ajax({
                        type: "POST",dataType:'JSON',
                        url: sendMailForm.attr('action'),
                        data: sendMailForm.serialize(), // serializes the form's elements.
                        beforeSend: function() {
                        	$.magnificPopup.close();
                        }
                      });
            	}


            	return false;
            });

	},

	ajaxing : false,
	upload_img: function(uri,name,dir){
		var file_input = jQuery('#add_file_ajax input[type=file]');
		if( file_input.length <= 0 ){
			var formupload = '<form id="add_file_ajax" action="" method="post" enctype="multipart/form-data" style="display: none;" ><input type="file" name="fileajax"><input type="hidden" name="dir" value="'+dir+'" /></form>';
			jQuery('body').append(formupload);
			file_input = jQuery('#add_file_ajax input[type=file]');
		}

		file_input.trigger('click').on("change", function(e){
			e.preventDefault();
			if( form.ajaxing == false ){
				form.ajaxing=true;
				$.ajax({
		              url: uri, type: "POST",cache: true,
		              data: new FormData( $('#add_file_ajax')[0] ),
		              enctype: 'multipart/form-data',
		              processData: false,  // tell jQuery not to process the data
		              contentType: false
		            }).done(function( data ) {
		            	data = jQuery.parseJSON(data);
		            	if( data.f ) {
		            		$('<div class="fileupload-preview thumbnail col-sm-6" ><img src="'+data.f+'" ><input type="hidden" name="'+name+'[]" value="'+data.f+'" ></div>').insertBefore('div.imgs_add');

		            	}
		            }).complete(function(){form.ajaxing=false;});

			}

		});

	},
};

var charts = function () {
//	var highColors = [bgWarning, bgPrimary, bgInfo, bgAlert,bgDanger, bgSuccess, bgSystem, bgDark];
	var highColors = [bgSuccess, '#f0f0f0', bgWarning, bgDanger, bgAlert,  bgSystem, bgDark];
	var company = function(){
		graph = $('#company-graph');

		graph.highcharts({
	        credits: false,
	        colors: highColors,
	        chart: {
	            backgroundColor: 'transparent',
	            type: 'column',
	            padding: 0,
	            margin: 0,
	            marginTop: 10
	        },
	        legend: { enabled: false },
	        title: { text: null },
	        xAxis: {
	            lineWidth: 0,
	            tickLength: 0,
	            minorTickLength: 0,
	            title: { text: null },
	            labels: { enabled: false }
	        },
	        yAxis: {
	            gridLineWidth: 0,
	            title: { text: null },
	            labels: { enabled: false }
	        },
	        tooltip: {
	            headerFormat: '<table>',
	            pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td><td style="padding:0"><b>{point.y}</b></td></tr>',
	            footerFormat: '</table>',
	            shared: true,
	            useHTML: true
	        },
	        plotOptions: {
	            column: {
	                groupPadding: 0.05,
	                pointPadding: 0.25,
	                borderWidth: 0
	            }
	        },
	        series: [
                 { name: 'Actived', data: [ parseInt(graph.attr('actived')) ]},
                 {name: 'un-Public',data: [ parseInt(graph.attr('unpublic')) ]},
                 {name: 'Expiring',data: [ parseInt(graph.attr('expiring')) ]},
                 {name: 'Expired',data: [ parseInt(graph.attr('expired')) ]},
             ]
	    });
	 };

 var company_pie = function(){
	 var graph = $('#company-pie');
     if (graph.length) {
    	 graph.highcharts({
             credits: false,
             chart: {
                 plotBackgroundColor: null,
                 plotBorderWidth: null,
                 plotShadow: false
             },
             title: {
                 text: null
             },
             tooltip: {
                 pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
             },
             plotOptions: {
                 pie: {
                     center: ['30%', '50%'],
                     allowPointSelect: true,
                     cursor: 'pointer',
                     dataLabels: {
                         enabled: false
                     },
                     showInLegend: true
                 }
             },
             colors: highColors,
             legend: {
                 x: 90,
                 floating: true,
                 verticalAlign: "middle",
                 layout: "vertical",
                 itemMarginTop: 10
             },
             series: [{
                 type: 'pie',
                 name: 'Company Total',
                 data: [
                     ['Actived', parseInt(graph.attr('actived')) ],
                     ['un-Public', parseInt(graph.attr('unpublic')) ], {
                         name: 'Expiring',
                         y: parseInt(graph.attr('expiring')),
                         sliced: true,
                         selected: true
                     },
                     ['Expired', parseInt(graph.attr('expired'))],
                 ]
             }]
         });
     }
 }; // End High Pie Charts Demo

return {
	init: function () {
    	company();
    	company_pie();
    }
};
}();


var FormElements = function (){
	var runFormElements = function() {
		var panelScroller = $('.panel-scroller');
		if (panelScroller.length) {
			panelScroller.each(function(i, e) {
	          var This = $(e);
	          var Delay = This.data('scroller-delay');
	          var Margin = 5;

	          // Check if scroller bar margin is required
	          if (This.hasClass('scroller-thick')) { Margin = 0; }

	          // Check if scroller bar is in a dropdown, if so
	          // we initilize scroller after dropdown is visible
	          var DropMenuParent = This.parents('.dropdown-menu');
	          if (DropMenuParent.length) {
	              DropMenuParent.prev('.dropdown-toggle').on('click', function() {
	                 setTimeout(function() {
	                    This.scroller();
	                    $('.navbar').scrollLock('on', 'div');
	                 },50);
	              });
	              return;
	          }

	          if (Delay) {
	            var Timer = setTimeout(function() {
	               This.scroller({ trackMargin: Margin, });
	              $('#content').scrollLock('on', 'div');
	            }, Delay);
	          }
	          else {
	            This.scroller({ trackMargin: Margin, });
	            $('#content').scrollLock('on', 'div');
	          }

	        });
	     }

	     // Init smoothscroll on elements with set data attr
	     // data value determines smoothscroll offset
	     var SmoothScroll = $('[data-smoothscroll]');
	     if (SmoothScroll.length) {
	       SmoothScroll.each(function(i,e) {
	         var This = $(e);
	         var Offset = This.data('smoothscroll');
	         var Links = This.find('a');

	         // Init Smoothscroll with data stored offset
	         Links.smoothScroll({
	           offset: Offset
	         });

	       });
	     }
	};

return {
	init: function () {
		runFormElements();
    }
};
}();