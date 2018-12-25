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

