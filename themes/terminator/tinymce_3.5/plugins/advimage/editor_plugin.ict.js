(function() {
	tinymce.create('tinymce.plugins.AdvancedImagePlugin', {
		init : function(ed, url) {
			$.getScript(url+"../../../utils/mctabs.js");
			$.getScript(url+"/js/image.js");
			$.getScript(url+'../../../tiny_mce_popup.js');
//			$('head').append( $('<script type="text/javascript" />').attr('scr',url+'../../tiny_mce_popup.js') );
			$('head').append( $('<link rel="stylesheet" type="text/css" />').attr('href',url+'/css/advimage.css') );
			
			// Register commands
			ed.addCommand('mceAdvImage', function() {
				// Internal image object like a flash placeholder
				if (ed.dom.getAttrib(ed.selection.getNode(), 'class', '').indexOf('mceItem') != -1)
					return;
				
//				ed.windowManager.open({
//					file : url + '/image.htm?dir='+tinymce.settings.imageDIR,
//					width : 480 + parseInt(ed.getLang('advimage.delta_width', 0)),
//					height : 385 + parseInt(ed.getLang('advimage.delta_height', 0)),
//					inline : 1
//				}, {
//					plugin_url : url
//				});
				n = ed.selection.getNode();
				alert(n.nodeName);
				jQuery("<div>", {id: "dialog",title: "Thêm Ảnh từ hệ thống",text: ""}).load(url+'/img.html').dialog({
					modal:true, width: 600, height: 400,
					buttons: {
						"insert":{  text: 'Chèn Ảnh', class: 'btn primary',
							click: function(){
								
//					 			tinyMCE.execCommand('mceInsertContent',false,'<br><img alt="test" src="http://betforex.local/administrator/resource/70x70/deal/SON-MOI-EVELINE_20111223142556848.jpg" />');
								ed.focus();
				                ed.selection.setContent('<img alt="test" src="http://betforex.local/administrator/resource/70x70/deal/SON-MOI-EVELINE_20111223142556848.jpg" />');
				                $(this).dialog("close");
								
                        	}
						},
						"cancel":{  text: 'Đóng', class: 'btn primary',
							click: function(){ $(this).dialog("close");}
						}
					}
				});;
			});

			// Register buttons
			ed.addButton('image', {
				title : 'advimage.image_desc',
				cmd : 'mceAdvImage'
			});
		},

		getInfo : function() {
			return {
				longname : 'Advanced image',
				author : 'Moxiecode Systems AB',
				authorurl : 'http://tinymce.moxiecode.com',
				infourl : 'http://wiki.moxiecode.com/index.php/TinyMCE:Plugins/advimage',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		}
	});

	// Register plugin
	tinymce.PluginManager.add('advimage', tinymce.plugins.AdvancedImagePlugin);
})();