
$( document ).ready(function() {
    var crawlerGet = function(input){
        console.log(' call crawler get',input);
        if(input && input[0].tagName === "INPUT"){
            let form = input.parents("form"), value = input.val();
            if( input[0].name ==='source' ){
                var regexp = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
                if( regexp.test(value) ){
                    form.append('<input type="hidden" name="crawler_source" value="'+value+'"/>');
                    form.submit();
                    return false;
                }
            } else if (value.length > 0){
                form.append('<input type="hidden" name="crawler_'+input[0].name+'" value="'+value+'"/>');
                form.submit();
                return false;
            }
        }
    };

    $('.input-crawler input[type=text]').on("paste", function(event) {
        // e.preventDefault();
        let clipboarddata = null;

        if (event.clipboardData != null/false/undefined) { //ignore the incorrectness of the truncation
            clipboarddata = event.clipboardData;
        } else if (window.clipboardData != null/false/undefined) {
            clipboarddata = window.clipboardData;
        } else { //default to the last option even if it is null/false/undefined
            clipboarddata = event.originalEvent.clipboardData;
        }

        console.log('event on paste',clipboarddata);
        // $.each(e.originalEvent.clipboardData.items, function() {
        //     var dataa = e.clipboardData.getData("text/plain");
        //     alert(dataa);
        // });
    });



	jQuery(".input-crawler .data-crawler").click(function(e){
        let input = $(this).closest(".input-crawler").find('input[type=text]');
        crawlerGet(input);
        e.preventDefault();
	});

    jQuery(".input-crawler .data-paste").click(function(e){

        let input = $(this).closest(".input-crawler").find('input[type=text]');
        input.focus();
        document.execCommand('paste');
        // var event = $.Event('paste');
        // input.triggerHandler(event);

        //console.log("send paste",input,event);
        //return false;
    });
});
