var repo = {
    chart : '',
    ajaxLink : site_url + 'report/item/bieu-do',
    report_data : [],
    day : '',
    month : '',
    year : '',
    chartyAxis : {},
    action : function() {

    },
    ajax : null,
    load : function($time) {

	this.day = $('select[name=rday]');
	this.month = $('input[name=rmonth]');
	this.year = $('input[name=ryear]');

	$("#gps-vehicles").change(
		function() {
		    window.location.href = site_url + 'report/item/'+ $(this).val() + '.html';
		});

	$('.dataTables_wrapper input[type=button]').click(function() {
	    $('h3.table-title').html($(this).val());
	    $('.dataTables_wrapper input[type=button]').show();
	    $(this).hide();
	});

	$('.gps-right input[type=button]').button().click(function() {
	    if (repo.ajax) {
		repo.ajax.abort();
	    }

	    $('.gps-right input[type=button]').button("enable");
	    $(this).button("disable");
	    repo.getData();
	});

	var $timeTaget = new Date();
	if ($time) {
	    $timeTaget = new Date(vmap.strtotime($time) * 1000);

	}
	this.day.val($timeTaget.getDate());
	this.month.val($timeTaget.getMonth() + 1);
	this.year.val($timeTaget.getFullYear());

	$monthCurrent = 0;
	$('input[name=time-next]').click(function(e) {
	    $monthCurrent = parseInt(repo.month.val());
	    if ($monthCurrent < 12)
		repo.month.val($monthCurrent + 1);
	    else {
		repo.month.val(1);
		repo.year.val(parseInt(repo.year.val()) + 1);
	    }
	    repo.day.val(0);
	    e.preventDefault();
	    repo.getData();
	});
	$('input[name=time-pre]').click(function(e) {
	    $monthCurrent = parseInt(repo.month.val());
	    if ($monthCurrent > 1)
		repo.month.val($monthCurrent - 1);
	    else {
		repo.month.val(12);
		repo.year.val(parseInt(repo.year.val()) - 1);
	    }
	    repo.day.val(0);
	    e.preventDefault();
	    repo.getData();
	});
	this.day.change(function(e) {
	    repo.day.val($(this).val());
	    e.preventDefault();
	    repo.getData();
	});

	repo.getData();
    },
    ini : function(Chartcategory, Chartdata, chartTitle, $yAxis) {

	var chart = new Highcharts.Chart({
	    chart : {
		renderTo : 'chart',
		type : 'column'
	    },
	    title : {
		text : 'Thống Kê Đường Đi Theo Thời Gian'
	    },
	    subtitle : {
		text : chartTitle
	    },
	    xAxis : {
		categories : Chartcategory
	    },
	    yAxis : $yAxis,
	    tooltip : {
		formatter : function() {
		    $tip = Math.round(this.y * 100) / 100;
		    if (this.series.name == 'Tiền Nhiên Liệu')
			$tip += ' VNĐ';
		    else if (this.series.name == 'Nhiên Liệu')
			$tip += ' lít';
		    else
			$tip += ' Km';
		    return $tip;
		}
	    },
	    series : Chartdata
	});
    },
    fuelchart : function(Chartdata, chartTitle) {
	var chart = new Highcharts.Chart({
	    chart : {
		renderTo : 'chart',
		type : 'spline'
	    },
	    title : {
		text : 'Biểu Đồ Nhiên Liệu'
	    },
	    subtitle : {
		text : chartTitle
	    },
	    xAxis : {
		type : 'datetime'
	    // ,dateTimeLabelFormats: {
	    // minute: '%H:%M',
	    // hour: '%H:%M',
	    // day: '%e. %b',
	    // month: '%b \'%y',
	    // year: '%b'
	    // }
	    },

	    yAxis : {
		title : {
		    text : 'Lượng nhiên liệu (%)'
		},
		min : 10,
		max : 100
	    },
	    tooltip : {
		formatter : function() {
		    return '<b>Thời Gian: </b> '
			    + Highcharts
				    .dateFormat('%H:%M:%S %e-%B-%Y', this.x)
			    + '<br/>Nhiên liệu trong bình: <b>' + this.y
			    + '</b> %';
		}
	    },
	    plotOptions : {
		spline : {
		    lineWidth : 1,
		    states : {
			hover : {
			    lineWidth : 2
			}
		    },
		    marker : {
			enabled : false
		    },
		    pointInterval : 3600000, // one hour
		// pointStart: Date.UTC(2009, 9, 6, 0, 0, 0)
		}
	    },
	    series : Chartdata
	});
    },

    getData : function() {

	$('#chart').html('');

	if ($('input[type=button][name=fueldata]')
		&& $('input[type=button][name=fueldata]').attr('aria-disabled') == 'true') {

	    repo.ajax = $.ajax({
		url : site_url + 'report/item/' + $('input[name=vid]').val()
			+ '/bieu-do-xang.json',
		dataType : 'json',
		data : {
		    'day' : $('select[name=rday]').val(),
		    'month' : repo.month.val(),
		    'year' : $('input[name=ryear]').val()
		},
		beforeSend : function() {
		    $('.ajax-modal').show();
		},
		success : function(val) {
		    if (val) {
			$utc = vmap.strtotime('01-01-1970');
			var cate = [];
			var dataVal = [];
			var $fuel = [];
			var $money = [];
			$length = 0;
			$.each(val.node, function(i, item) {
			    dataVal.push([ (item.t - $utc) * 1000,
				    parseFloat(item.val) ]);
			    $length++;
			});
			if (val.type == 'year') {
			    title = 'Dữ Liệu Năm '
				    + $('input[name=ryear]').val();
			} else if (val.type == 'month') {
			    title = 'Dữ Liệu Tháng '
				    + $('input[name=rmonth]').val() + '-'
				    + $('input[name=ryear]').val();
			} else if (val.type == 'day') {
			    title = 'Dữ Liệu Ngày '
				    + $('select[name=rday]').val() + '-'
				    + $('input[name=rmonth]').val() + '-'
				    + $('input[name=ryear]').val();
			}
			$charData = [ {
			    name : 'Lượng Nhiên Liệu',
			    data : dataVal,

			} ];

			repo.fuelchart($charData, title);

			// repo.ini(cate,$charData,title,$chartyAxis);
			$('span[name=statistic_title]').html(title);
		    }
		},
		complete : function() {
		    stoptable.fuel();
		    $('.ajax-modal').hide();
		}
	    });
	} else {

	    console.log(site_url + 'report/item/' + $('input[name=vid]').val()
			+ '/bieu-do.json');


	    repo.ajax = $.ajax({
		url : site_url + 'report/item/' + $('input[name=vid]').val()
			+ '/bieu-do.json',
		dataType : 'json',
		data : {
		    'day' : $('select[name=rday]').val(),
		    'month' : repo.month.val(),
		    'year' : $('input[name=ryear]').val()
		},
		beforeSend : function() {
		    $('.ajax-modal').show();
		},
		success : function(val) {
		    if (val) {
			var cate = [];
			var dataVal = [];
			var $fuel = [];
			var $money = [];
			$length = 0;
			$max = 10;
			$.each(val.node, function(i, item) {
			    if (val.type == 'year') {
				cate.push('Tháng ' + i);
			    } else if (val.type == 'month') {
				cate.push((i));
			    } else if (val.type == 'day') {
				cate.push(i + ' Giờ');
			    }
			    dataVal.push(item);
			    $max = (item > $max) ? item : $max;
			    if (val.fuel) {
				$fuel.push(val.fuel[i]);
			    }
			    if (val.money) {
				$money.push(val.money[i]);
			    }
			    $length++;
			});
			if (val.type == 'year') {
			    title = 'Dữ Liệu Năm '
				    + $('input[name=ryear]').val();
			} else if (val.type == 'month') {
			    title = 'Dữ Liệu Tháng '
				    + $('input[name=rmonth]').val() + '-'
				    + $('input[name=ryear]').val();
			} else if (val.type == 'day') {
			    title = 'Dữ Liệu Ngày '
				    + $('select[name=rday]').val() + '-'
				    + $('input[name=rmonth]').val() + '-'
				    + $('input[name=ryear]').val();
			}
			$charData = [ {
			    name : 'Quãng Đường',
			    color : '#4572A7',
			    type : 'column',
			    yAxis : 0,
			    data : dataVal
			} ];
			$chartyAxis = [ {
			    max : $max,
			    title : {
				text : 'Quãng đường đã đi (Km)',
				style : {
				    color : '#4572A7'
				}
			    },
			    labels : {
				formatter : function() {
				    return this.value + 'Km';
				},
				style : {
				    color : '#4572A7'
				}
			    },
			    startOnTick : false,
			    showFirstLabel : false,
			    type : 'linear'

			} ];
			if ($fuel.length > 0) {
			    $charData.push({
				name : 'Nhiên Liệu',
				color : '#AA4643',
				yAxis : 1,
				marker : {
				    enabled : false
				},
				dashStyle : 'shortdot',
				type : 'spline',
				data : $fuel
			    });
			    $chartyAxis.push({
				title : {
				    text : 'Lượng Nhiên Liệu Sử Dụng',
				    style : {
					color : '#AA4643'
				    }
				},
				labels : {
				    formatter : function() {
					return this.value + ' Lit';
				    },
				    style : {
					color : '#AA4643'
				    }
				},
				opposite : true,
				min : 0
			    });
			}
			if ($money.length > 0) {
			    $charData.push({
				name : 'Tiền Nhiên Liệu',
				color : '#89A54E',
				type : 'spline',
				data : $money,
				yAxis : 2
			    });
			    $chartyAxis.push({
				title : {
				    text : 'Chí phí Nhiên Liệu',
				    style : {
					color : '#89A54E'
				    }
				},
				labels : {
				    formatter : function() {
					return this.value + ' VND';
				    },
				    style : {
					color : '#89A54E'
				    }
				},
				opposite : true
			    });
			}
			$('span[name=length_road]').html(val.length_road);

			$('span[name=moving_time]').html(val.moving_time);

			if (val.max_speed.max != '0' && val.max_speed.time) {
			    $('span[name=max_speed]').html(val.max_speed.max);
			    $('span[name=time_max]').html(val.max_speed.time)
				    .parent().show();
			    if ($('.obi-group.speed') && val.max_speed.latlng) {
				$('.obi-group.speed').attr('latlng',
					val.max_speed.latlng);
				$('.obi-group.speed').click(function() {
				    vmap.popup($(this));
				});

			    }
			} else {
			    $('span[name=time_max]').parent().hide();
			}

			if (val.fuel) {
			    $fuelTotal = parseFloat(val.fuel[$length - 1]);
			    $('span[name=fuel]').html(
				    $fuelTotal.formatMoney(2, ',', ' ')
					    + ' Lít');
			    if (val.fuel_price) {
				$('span[name=fuel_price]').html(
					val.fuel_price
						.formatMoney(0, null, ' ')
						+ ' VNĐ')
				if (val.fuel_price_vnd != '') {
				    $('span[name=fuel_price_vnd]').html(
					    val.fuel_price_vnd).show();
				} else {
				    $('span[name=fuel_price_vnd]').hide();
				}

			    } else {
				$('span[name=fuel_price]').html('0 VNĐ');
				$('span[name=fuel_price_vnd]').html('').hide();
			    }
			} else {
			    $('span[name=fuel]').html('0 Lít');
			    $('span[name=fuel_price]').html('0 VNĐ');
			}
			repo.ini(cate, $charData, title, $chartyAxis);
			$('span[name=statistic_title]').html(title);
		    }
		},
		complete : function() {
		    stoptable.load();
		    $('.ajax-modal').hide();
		}
	    });

	}

    },
};

var stoptable = {
    config : {
	"bProcessing" : true,
	"bServerSide" : true,
	"sPaginationType" : "full_numbers",
	"bFilter" : false,
	"sDom" : '<"top"i>rt<"bottom"flp><"clear">',
	"fnServerData" : function(sSource, aoData, fnCallback) {
	    repo.ajax = jQuery.ajax({
		"dataType" : 'json',
		"type" : "GET",
		"url" : site_url + 'report/item/' + $('input[name=vid]').val()
			+ '/diem-dung.json',
		"data" : aoData,
		success : function(data) {
		    fnCallback(data);
		    // vmap.markerInfo.setOptions({maxWidth:400});

		    $('.node_stop').css({
			'cursor' : 'pointer'
		    }).click(
			    function() {
				var info = {
				    'name' : i18n.node_stop
					    + '-'
					    + $('.gps-left .obi-l').eq(1)
						    .text(),
				    'address' : $(this).text(),
				    'tStop' : $(this).parent('td').prev('td')
					    .html(),
				    't' : ($(this).parents('tr').find(
					    'input[name=' + token + 'time]')
					    .val())
				};

				vmap.popup($(this), info);
			    });
		}
	    });
	},
	"oLanguage" : {
	    "sLengthMenu" : "Lựa Chọn Hiển Thị _MENU_ Điểm Dừng Trên Một Trang",
	    "sZeroRecords" : "Không Có Điểm Dừng Nào",
	    "sInfo" : "Hiển Thị _START_ đến _END_ trong tổng số _TOTAL_ Điểm Dừng",
	    "sInfoEmpty" : "Hiển Thị 0 đến 0 của 0 Điểm Dừng",
	    "sInfoFiltered" : "(filtered from _MAX_ total records)"
	},
	"aoColumnDefs" : [ {
	    "aTargets" : [ 0 ],
	    "bSearchable" : false,
	    "sTitle" : "Thời Gian"
	}, {
	    "aTargets" : [ 1 ],
	    "sClass" : "tPlan center",
	    "sTitle" : "Tín Hiệu GPS"
	}, {
	    "aTargets" : [ 2 ],
	    "sClass" : "tName center",
	    "sTitle" : "Tín Hiệu GSM"
	}, {
	    "aTargets" : [ 3 ],
	    "sClass" : "tOwner center",
	    "sTitle" : "Điện Áp Nguồn"
	}, {
	    "aTargets" : [ 4 ],
	    "bUseRendered" : "false",
	    "sClass" : "tDue",
	    "sTitle" : "Thời Gian Dừng",
	    "sType" : "date"
	}, {
	    "aTargets" : [ 5 ],
	    "sClass" : "cT",
	    "sTitle" : "Vị Trí"
	} ],

    },
    load : function() {
	stoptable.config['fnServerParams'] = function(aoData) {
	    aoData.push({
		"name" : vmap.token.name,
		"value" : vmap.token.val
	    });
	    aoData.push({
		"name" : 'year',
		"value" : $('input[name=ryear]').val()
	    });
	    aoData.push({
		"name" : 'month',
		"value" : $('input[name=rmonth]').val()
	    });
	    aoData.push({
		"name" : 'day',
		"value" : $('select[name=rday]').val()
	    });
	    aoData.push({
		"name" : 'vehicle',
		"value" : $('input[name=vid]').val()
	    });
	};
	if (jQuery('#node-data-stop').is(":visible")) {
	    jQuery('#node-data-stop').dataTable().fnDestroy();
	    var oTable = $('#node-data-stop').dataTable(stoptable.config);
	    $('h3.table-title').html('Các Điểm Dừng');
	    /*
	    $(".talbe-view .export")
		    .html(
			    '<a href="'
				    + site_url
				    + 'report/item/'
				    + $('input[name=vid]').val()
				    + '/'
				    + $('select[name=rday]').val()
				    + '-'
				    + $('input[name=rmonth]').val()
				    + '-'
				    + $('input[name=ryear]').val()
				    + '.xls" title="Tải Dữ Liệu Excel" target="_blank" class="gps-button ui-button ui-widget ui-state-default ui-corner-all"  >Tải Dữ Liệu Excel</a>');
		*/		    
	} else {
	    alert('show do xang');
	}
    },

    configfuel : {
	"bProcessing" : true,
	"bServerSide" : true,
	"sPaginationType" : "full_numbers",
	"bFilter" : false,
	"sDom" : '<"top"i>rt<"bottom"flp><"clear">',
	"fnServerData" : function(sSource, aoData, fnCallback) {
	    repo.ajax = jQuery.ajax({
		"dataType" : 'json',
		"type" : "GET",
		"url" : site_url + 'report/item/' + $('input[name=vid]').val()
			+ '/diem-do-xang.json',
		"data" : aoData,
		success : function(data) {
		    fnCallback(data);
		    $('.node_stop').css({
			'cursor' : 'pointer'
		    }).click(function() {
			vmap.popup($(this));
		    });
		}
	    });
	},
	"oLanguage" : {
	    "sLengthMenu" : "Lựa Chọn Hiển Thị _MENU_ Điểm Đổ Nhiên Liệu Trên Một Trang",
	    "sZeroRecords" : "Không Có Điểm Đổ Nhiên Liệu Nào",
	    "sInfo" : "Hiển Thị _START_ đến _END_ trong tổng số _TOTAL_ Điểm Đổ Nhiên Liệu",
	    "sInfoEmpty" : "Hiển Thị 0 đến 0 của 0 Điểm Đổ Nhiên Liệu",
	    "sInfoFiltered" : "(filtered from _MAX_ total records)"
	},
	"aoColumnDefs" : [ {
	    "aTargets" : [ 0 ],
	    "bSearchable" : false,
	    "sTitle" : "Thời Gian"
	}, {
	    "aTargets" : [ 1 ],
	    "sClass" : "tPlan center",
	    "sTitle" : "Tín Hiệu GPS"
	}, {
	    "aTargets" : [ 2 ],
	    "sClass" : "tName center",
	    "sTitle" : "Tín Hiệu GSM"
	}, {
	    "aTargets" : [ 3 ],
	    "sClass" : "tOwner center",
	    "sTitle" : "Điện Áp Nguồn"
	}, {
	    "aTargets" : [ 4 ],
	    "bUseRendered" : "false",
	    "sClass" : "tDue center",
	    "sTitle" : "Lượng Nhiên Liệu",
	    "sType" : "date"
	}, {
	    "aTargets" : [ 5 ],
	    "sClass" : "cT",
	    "sTitle" : "Vị Trí"
	} ],

    },

    fuel : function() {
	stoptable.configfuel['fnServerParams'] = function(aoData) {
	    aoData.push({
		"name" : vmap.token.name,
		"value" : vmap.token.val
	    });
	    aoData.push({
		"name" : 'year',
		"value" : $('input[name=ryear]').val()
	    });
	    aoData.push({
		"name" : 'month',
		"value" : $('input[name=rmonth]').val()
	    });
	    aoData.push({
		"name" : 'day',
		"value" : $('select[name=rday]').val()
	    });
	    aoData.push({
		"name" : 'vehicle',
		"value" : $('input[name=vid]').val()
	    });
	};
	jQuery('#node-data-stop').dataTable().fnDestroy();
	var oTable = $('#node-data-stop').dataTable(stoptable.configfuel);
	$('h3.table-title').html('Các Điểm Đổ Nhiên Liệu');
	$(".talbe-view .export").html('');

    }
};