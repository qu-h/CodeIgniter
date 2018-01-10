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


        jQuery(".media-imgthumb").click(function(){
            $('#images-manager')
                .attr('inputname',$(this).next("input[type=hidden]").attr('name'))
                .modal("show");
            return false;
        });


        $('#images-manager').on('show.bs.modal', function() {
            var modal = $(this);
            var modalBody = $(this).find(".modal-body");

            var data = {};
            if( $(this).attr("img-path") != "" ){
                data['folder'] = $(this).attr("img-path");
            }

            $.ajax({
                url: "/images/manager.json",
                dataType:"JSON",
                method:"POST",
                data: data
            }).done(function(images) {
                if( images.length > 0 ){
                    $.each(images,function (index,name) {
                        modalBody.append(imgupload.thumbModal(name,data['folder']));
                    });
                    imgupload.modalSelectCallback();
                }
            });
            //setModalMaxHeight(this);
        });
        //$('#images-manager').modal("show");

		
	},
	
	click:function(){
		jQuery(".upload-imgthumb").click(function(){
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
		      $(".upload-imgthumb").attr("src",reader.result);
		    };
	    	reader.readAsDataURL(event.target.files[0]);
		});
	},

    thumbModal : function(fname,folder){
	    var fileSrc = "/images/thumb/"+folder+"/w400/"+fname;
        return "<a class=\"col-md-4 col-sm-3 col-xs-6 select-img\" href='javascript:void(0);' fname='"+fname+"' folder='"+folder+"' >" +
            "<img src=\""+fileSrc+"\" class=\"img-responsive img-thumbnail center-block\" >" +
            "</a>";
    },
    modalSelectCallback : function () {
        $('a.select-img').click(function () {

            var modal = $(this).parents(".modal");
            var fname = $(this).attr("fname");
            var folder = $(this).attr("folder");
            var input = $("input[name="+modal.attr("inputname")+"]").val(fname);
            input.prev('img').attr('src',"/images/"+folder+"/"+fname);
            modal.modal("hide");

        });
    }
};

function setModalMaxHeight(element) {
    this.$element     = $(element);
    this.$content     = this.$element.find('.modal-content');
    var borderWidth   = this.$content.outerHeight() - this.$content.innerHeight();
    var dialogMargin  = $(window).width() < 768 ? 20 : 60;
    var contentHeight = $(window).height() - (dialogMargin + borderWidth);
    var headerHeight  = this.$element.find('.modal-header').outerHeight() || 0;
    var footerHeight  = this.$element.find('.modal-footer').outerHeight() || 0;
    var maxHeight     = contentHeight - (headerHeight + footerHeight);

    this.$content.css({
        'overflow': 'hidden'
    });

    this.$element
        .find('.modal-body').css({
        'max-height': maxHeight,
        'overflow-y': 'auto'
    });
}

// $('.modal').on('show.bs.modal', function() {
//     $(this).show();
//     setModalMaxHeight(this);
// });

$(window).resize(function() {
    if ($('.modal.in').length != 0) {
        setModalMaxHeight($('.modal.in'));
    }
});