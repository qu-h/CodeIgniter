//Sliding Effect Control
//Showing Date
//head.js("assets/js/clock/date.js");

$( document ).ready(function() {
  //NEWS STICKER
    var nt_title = $('#nt-title').newsTicker({
        row_height: 18,
        max_rows: 1,
        duration: 5000,
        pauseOnHover: 0
    });

	////Right Sliding menu
	$(document).ready(function() {
        var mySlidebars = new $.slidebars();

        $('.toggle-left').on('click', function() {
            mySlidebars.toggle('right');
        });
    });

	////Acordion and Sliding menu
    $(".topnav").accordionze({
        accordionze: true,
        speed: 500,
        closedSign: '<img src="assets/img/plus.png">',
        openedSign: '<img src="assets/img/minus.png">'
    });

	//SEARCH MENU
    $('input.id_search').quicksearch('#menu-showhide li, .menu-left-nest li');

	//EASY PIE CHART
    $(function() {


        $('.chart').easyPieChart({
            easing: 'easeOutBounce',
            trackColor: '#ffffff',
            scaleColor: '#ffffff',
            barColor: '#FF0064',
            onStep: function(from, to, percent) {
                $(this.el).find('.percent').text(Math.round(percent));
            }
        });
        var chart = window.chart = $('.chart').data('easyPieChart');
        $('.js_update').on('click', function() {
            chart.update(Math.random() * 100);
        });

        $('.speed-car').easyPieChart({
            easing: 'easeOutBounce',
            trackColor: 'rgba(0,0,0,0.3)',
            scaleColor: 'transparent',
            barColor: '#0085DF',

            lineWidth: 8,
            onStep: function(from, to, percent) {
                $(this.el).find('.percent2').text(Math.round(percent));
            }
        });
        var chart = window.chart = $('.chart2').data('easyPieChart');
        $('.js_update').on('click', function() {
            chart.update(Math.random() * 100);
        });
        $('.overall').easyPieChart({
            easing: 'easeOutBounce',
            trackColor: 'rgba(0,0,0,0.3)',
            scaleColor: '#323A45',
            lineWidth: 35,
            lineCap: 'butt',
            barColor: '#FFB900',
            onStep: function(from, to, percent) {
                $(this.el).find('.percent3').text(Math.round(percent));
            }
        });
    });


	//TOOL TIP
    $('.tooltip-tip-x').tooltipster({
        position: 'right'

    });

    $('.tooltip-tip').tooltipster({
        position: 'right',
        animation: 'slide',
        theme: '.tooltipster-shadow',
        delay: 1,
        offsetX: '-12px',
        onlyOne: true

    });
    $('.tooltip-tip2').tooltipster({
        position: 'right',
        animation: 'slide',
        offsetX: '-12px',
        theme: '.tooltipster-shadow',
        onlyOne: true

    });
    $('.tooltip-top').tooltipster({
        position: 'top'
    });
    $('.tooltip-right').tooltipster({
        position: 'right'
    });
    $('.tooltip-left').tooltipster({
        position: 'left'
    });
    $('.tooltip-bottom').tooltipster({
        position: 'bottom'
    });
    $('.tooltip-reload').tooltipster({
        position: 'right',
        theme: '.tooltipster-white',
        animation: 'fade'
    });
    $('.tooltip-fullscreen').tooltipster({
        position: 'left',
        theme: '.tooltipster-white',
        animation: 'fade'
    });
    //For icon tooltip


	//NICE SCROLL
    $(".nano").nanoScroller({
        //stop: true
        scroll: 'top',
        scrollTop: 0,
        sliderMinHeight: 40,
        preventPageScrolling: true
        //alwaysVisible: false

    });
	//PAGE LOADER
    paceOptions = {
        ajax: false, // disabled
        document: false, // disabled
        eventLag: false, // disabled
        elements: {
            selectors: ['.my-page']
        }
    };
	//SPARKLINE CHART
    $(function() {
        $('.inlinebar').sparkline('html', {
            type: 'bar',
            barWidth: '8px',
            height: '30px',
            barSpacing: '2px',
            barColor: '#A8BDCF'
        });
        $('.linebar').sparkline('html', {
            type: 'bar',
            barWidth: '5px',
            height: '30px',
            barSpacing: '2px',
            barColor: '#44BBC1'
        });
        $('.linebar2').sparkline('html', {
            type: 'bar',
            barWidth: '5px',
            height: '30px',
            barSpacing: '2px',
            barColor: '#AB6DB0'
        });
        $('.linebar3').sparkline('html', {
            type: 'bar',
            barWidth: '5px',
            height: '30px',
            barSpacing: '2px',
            barColor: '#19A1F9'
        });
    });

    $(function() {
        var sparklineLogin = function() {
            $('#sparkline').sparkline(
                [5, 6, 7, 9, 9, 5, 3, 2, 2, 4, 6, 7], {
                    type: 'line',
                    width: '100%',
                    height: '25',
                    lineColor: '#ffffff',
                    fillColor: '#0DB8DF',
                    lineWidth: 1,
                    spotColor: '#ffffff',
                    minSpotColor: '#ffffff',
                    maxSpotColor: '#ffffff',
                    highlightSpotColor: '#ffffff',
                    highlightLineColor: '#ffffff'
                }
            );
        }
        var sparkResize;
        $(window).resize(function(e) {
            clearTimeout(sparkResize);
            sparkResize = setTimeout(sparklineLogin, 500);
        });
        sparklineLogin();
    });
//DIGITAL CLOCK
    //clock
    $('#digital-clock').clock({
        offset: '+5',
        type: 'digital'
    });





	$('#skin-select').animate({ left:0 }, 100);
	$('.wrap-fluid').css({"width":"auto","margin-left":"250px"});
	$('.navbar').css({"margin-left":"240px"});

	$('#skin-select li').css({"text-align":"left"});
	$('#skin-select li span, ul.topnav h4, .side-dash, .noft-blue, .noft-purple-number, .noft-blue-number, .title-menu-left').css({"display":"inline-block", "float":"none"});
	//$('body').css({"padding-left":"250px"});


	$('.ul.topnav li a:hover').css({" background-color":"green!important"});

	$('.ul.topnav h4').css({"display":"none"});

	$('.tooltip-tip2').addClass('tooltipster-disable');
	$('.tooltip-tip').addClass('tooltipster-disable');


	$('.datepicker-wrap').css({"position":"absolute", "right":"300px"});
	$('.skin-part').css({"visibility":"visible"});
	$('#menu-showhide, .menu-left-nest').css({"margin":"10px"});
	$('.dark').css({"visibility":"visible"});

	$('.search-hover').css({"display":"none"});
	$('.dropdown-wrap').css({"position":"absolute", "left":"0px", "top":"53px"});

});
