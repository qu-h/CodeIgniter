
jQuery(document).ready(function() {
	$('.package .packtitle, .package .price').click(function(){
		$('.package').removeClass('active');
		$('.packdetail').hide();
		var pack = $(this).parent('.package');
		var colunm = $(this).parents('.col-xs-12');
		var detail = colunm.find('.packdetail');
		var row = colunm.parents('.row');
		
		leftBack = colunm.index()*(pack.width() +24);
		detail.css({'width':row.width(),'top':row.height()+20,'left':-leftBack}).show();
		detail.find('.arrow').css('left',leftBack+pack.width()/2);
		row.css('margin-bottom',detail.height());
		pack.addClass('active');
	})
	
	$('.package, .packdetail').hover(function(){ 
		        mouse_is_inside=true; 
		    }, function(){ 
		        mouse_is_inside=false; 
		    });
	
	$('body').mouseup(function(e){
		if( ! mouse_is_inside ){
			$('.row').css('margin-bottom',0);
			$('.packdetail').hide();
			$('.package').removeClass('active');
		}
	});
	
});
