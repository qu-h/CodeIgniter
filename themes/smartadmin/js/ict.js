/**
 *
 */

$( document ).ready(function() {
	imgupload.ready();
});

var imgupload = {
	fileupload : null,
	ready:function(){
		imgupload.fileupload = jQuery("input[type=file]");
		//console.log("check ready upload ",imgupload.fileupload.length);
		if( imgupload.fileupload.length ){
			imgupload.click();
			//imgupload.preview();
		}
		
	},
	
	click:function(){
		$(".upload-imgthumb").click(function(){
			var inputfiles = $(this).parents('div[class^="col-"]').find("input[type=file]");
			console.log("input file",inputfiles);
	    	//imgupload.fileupload.focus().trigger('click');
	    	inputfiles.focus().trigger('click');
	    	return false;
	    });
	},
	preview : function(){
		imgupload.fileupload.change(function(event) {
		  var reader = new FileReader();
		    reader.onload = function(){
		      //var output = document.getElementById('output');
		      //output.src = reader.result;
		      $(".upload-imgthumb").attr("src",reader.result);
		    };
	    	reader.readAsDataURL(event.target.files[0]);
		});
	}
};