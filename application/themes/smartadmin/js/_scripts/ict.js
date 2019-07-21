/**
 *
 */
var ict = {
	init:function(){
		this.footerFixed();
		this.summerNote();
		this.crawlerActions();
		this.formOnKeydown();
		// this.inputTags();
	},
	footerFixed:function(){
		var contentArea = jQuery(".smart-form-editor"), footer = jQuery(".smart-form-editor footer");
		if( footer.length > 0 ){
			footer = footer.get(0);
			$(footer).css({'position':'absolute','top':100,'width':'100%'});

			$(window).scroll(function() {
				var footerToTop = $(window).scrollTop() + $(window).height() - footer.offsetHeight - contentArea.offset().top;
				if ( footerToTop > 0  ) {
					$(footer).css('top',footerToTop);
				} else {
					$(footer).css('top',0);
				}
			});
		}
	},
	summerNote:function () {
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
	},
	crawlerActions:function () {
		$('input[type=text][name=source]').on('keydown', function(e) {
			var input = $(this), group = input.parents('.input-crawler');
			if( group.length > 0 ){
				var btnCrawler = group.find('.btn.data-crawler');
				if( btnCrawler.length > 0 ){
					if ($(this).val().length > 0 && e.keyCode === 67 && e.altKey === true) {
						btnCrawler.click();
						e.preventDefault();
					}
				}
			}

		});
	},

	inputTags:function () {
		/**
		 * https://bootstrap-tagsinput.github.io/bootstrap-tagsinput/examples/
		 */
		if ($.fn.tagsinput) {

			var citynames = new Bloodhound({
				datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
				queryTokenizer: Bloodhound.tokenizers.whitespace,
				prefetch: {
					url: '/tag/get-typeahead.json	',
					filter: function(list) {
						return $.map(list, function(cityname) {
							return { name: cityname }; });
					}
				}
			});
			citynames.initialize();

			$('input.tags-input').tagsinput({
				trimValue: true,
				//confirmKeys: [13, 44],
				typeaheadjs: {
					// source: function(query) {
					// 	return $.get($('input').data('url') + '?q='+ query);    //query get data, handling in controller
					// },
					name: 'citynames',
					displayKey: 'name',
					valueKey: 'name',
					source: citynames.ttAdapter()

					// afterSelect: function(val) {
					// 	this.$element.val('');
					// },
					// items: 5,
					// autoSelect: false,
					// freeInput: true,
				}
			});

			$('input.tags-input').on('itemAdded', function(event) {
				$(this).closest("form").submit(function(e){
					e.preventDefault(e);
				});
			});
		}

	},

	formOnKeydown:function () {
		$(document).on('keydown', function(e) {
			if( e.altKey === true ){
				let saveBtn = jQuery("[name=submit][value=save]"),
					submitBtn = jQuery("[name=submit][value=submit]"),
					cancelBtn = jQuery("[name=submit][value=cancel]");
				switch (e.keyCode) {
					case 83: // S
						if(saveBtn.length > 0){
							saveBtn.click();
						}
						break;
					case 90: // Z
						if(cancelBtn.length > 0){
							cancelBtn.click();
						}
						break;
					case 88: // X
						if(submitBtn.length > 0){
							submitBtn.click();
						}
						break;
				}
				console.warn('debug keydown',e.keyCode);
			}

		});
	}
};

$( document ).ready(function() {
	//pasteClipboard();
	ict.init();
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
