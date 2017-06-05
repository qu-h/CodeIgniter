
$( document ).ready(function() {
	jQuery('input[name=source]').next(".submit").click(function(){
		var s = jQuery('input[name=source]').val();
		var regexp = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
		if( regexp.test(s) ){
			var form = jQuery(this).parents("form");
			form.append('<input type="hidden" name="crawler_source" value="'+s+'"/>');
			form.submit();
		}
	});
});
