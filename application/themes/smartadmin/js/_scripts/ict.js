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
	pasteClipboard();
	footerFixed();
});

function pasteClipboard() {

	let readBtn = document.querySelector('#paste-clipboard');
	if( readBtn != null ){
		readBtn.addEventListener('click', () => {
			navigator.clipboard.readText()
				.then(text => {
					console.log(text);
				})
				.catch(err => {
					console.log('Something went wrong', err);
				})
		});
	}
}

function footerFixed() {
	var contentArea = jQuery(".smart-form-editor"), footer = jQuery(".smart-form-editor footer").get(0);
	$(footer).css({'position':'absolute','top':0,'width':'100%'});

	$(window).scroll(function() {
		var footerToTop = $(window).scrollTop() + $(window).height() - footer.offsetHeight - contentArea.offset().top;
		if ( footerToTop > 0  ) {
			$(footer).css('top',footerToTop);
		} else {
			$(footer).css('top',0);
		}
	});

}

