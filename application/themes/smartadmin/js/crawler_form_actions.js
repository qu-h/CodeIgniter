
$( document ).ready(function() {
	jQuery(".input-crawler .submit").click(function(){
		var input = $(this).closest(".input-crawler").find('input');
		console.log('bug',{input});
		if(input && input[0].tagName === "INPUT"){
            var form = jQuery(this).parents("form");
			var value = input.val();
			if( input[0].name ==='source' ){
                var regexp = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
                if( regexp.test(value) ){
                    form.append('<input type="hidden" name="crawler_source" value="'+value+'"/>');
                    form.submit();
                    return;
                }
			} else if (value.length > 0){
                form.append('<input type="hidden" name="crawler_'+input[0].name+'" value="'+value+'"/>');
                form.submit();
                return;
			}
        }
	});
});
