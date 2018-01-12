/**
 *
 */

$( document ).ready(function() {
	imgupload.ready();
    formUpdateSubmit();
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
            var formData = new FormData();
            if( $(this).attr("img-path") !== "" ){
                formData.append('folder', $(this).attr("img-path"));
            }
            imgupload.loadImagesForModal(formData,$(this));

            var modal = $(this);
            // modal.find("input[type=file]").change(function(event) {
            //
            // });
            console.log(modal);
            modal.find("input[type=file]").get(0).addEventListener('change', uploadListener, false);

            function uploadListener() {
                var formData = new FormData();
                formData.append('file', $(this)[0].files[0]);
                formData.append('folder', modal.attr("img-path"));
                imgupload.loadImagesForModal(formData,modal);
            }


            //setModalMaxHeight(this);
        });

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

    loadImagesForModal:function (data,modal) {
        var modalBody = modal.find(".modal-body");
        $.ajax({
            url: "/images/manager.json",
            dataType:"JSON", method:"POST",
            processData: false, contentType: false,
            data: data
        }).done(function(images) {
            if( images.length > 0 ){
                modalBody.html("");
                $.each(images,function (index,img) {
                    modalBody.append(imgupload.thumbModal(img.file,img.folder));
                });
                imgupload.modalSelectCallback();
                var inputfiles = modal.find("input[type=file]");
                modal.find("button.upload").unbind('click').bind('click',function () {
                    inputfiles.focus().trigger('click');
                });
            }


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


function formUpdateSubmit() {
    $("form button.save-back").click(function () {
        var form = $(this).parents('form');
        form.find('input[name=back]').val(1);
        form.submit();
    })
}