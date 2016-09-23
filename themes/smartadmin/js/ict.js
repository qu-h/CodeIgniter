/**
 *
 */

$( document ).ready(function() {
    $('.summernote').each(function () {
	var target = $(this);
	if( target.is('textarea') ){
	    target.summernote({
		onKeyup: function (e) {
		    target.val($(this).code());
		    target.change(); //To update any action binded on the control
		}
	    });
	}

    });

});