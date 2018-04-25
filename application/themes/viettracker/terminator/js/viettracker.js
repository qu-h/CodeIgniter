var img = {
	finder:{
		lang : 'en',
		width : 840,
		destroyOnClose : true,
		url : vt.assets+'/elfinder-2.0/php/connector.php',
		commandsOptions : {getfile : { oncomplete : 'close',folders : false}}
	},
	input:'',
	inputHTML: function(en){
		return '<input type="text" name="'+en+'" value="" class="field-image text" readonly  />';
	},
	gets:function(button){
		$finder = this.finder;
		$finder.getFileCallback = function(files, fm) {
			button.prev().val( files.replace(vt.resource+'/', '') );
			button.before('<button class="removeinput button grey">remove</button>');
			button.before(img.inputHTML(img.input));
			$('.ui-widget-overlay').remove();
			img.removeItem();
		};
		button.click(function(e){
			e.preventDefault();
			var fm = $('<div/>').dialogelfinder($finder).dialogelfinder('instance');
		});
		img.removeItem();
		return false;
	},
	removeItem:function(){
		jQuery('.removeinput').click(function(e){
			e.preventDefault();
			$(this).prev('input[name=\''+img.input+'\']').remove();
			$(this).remove();
			return false;
		});
	},
}