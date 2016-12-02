$(document).ready(function () {
	InitNotifications ();
	InitMenuEffects ();
});
/* *********************************************************************
 * Notifications
 * *********************************************************************/
function InitNotifications () {
	$('.notification .close').click(function () {
		$(this).parent().fadeOut(1000, function() {
			$(this).find('p').fixClearType ();
		});		
		return false;
	});
}

function InitMenuEffects () {
    $('.menu li').hover(function () {
        			$(this).find('ul:first').css({'visibility': 'visible', 'display': 'none'}).slideDown();
    }, function () {
        $(this).find('ul:first').css({visibility: "hidden"});

    });
    
    // Look for active element
    indexStart = 1;
    
    $('#iconbar li').each( function(index) { 
            if ($(this).hasClass('active')) 
                indexStart = index;
    });
    
    // Initialize carousel plugin
    $('#iconbar').jcarousel({
        start:          indexStart,
        scroll:         7,
        buttonPrevHTML: '<span>&lt;</span>',
        buttonNextHTML: '<span>&gt;</span>',
        initCallback:   function (instance, state) {}
    });    
    instance = $('#iconbar').data('jcarousel')
    // Roll on active element
    if (indexStart >= 7) {
        if (!$.browser.webkit) {
            list = $('#iconbar .jcarousel-list');  
            number = list.css('left');
            list.css({'left': 0});
            list.delay(500).animate({left: '+=' + number}, 750, function () {});
        }
    }

}