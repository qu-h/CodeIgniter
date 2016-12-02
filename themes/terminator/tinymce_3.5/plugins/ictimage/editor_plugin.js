(function() {
	tinymce.PluginManager.requireLangPack('ictimage');
	tinymce.create('tinymce.plugins.ICTImagePlugin', {
		init : function(ed, url) {
			ed.addCommand('mceICTImage', function() {
				// Internal image object like a flash placeholder
				if (ed.dom.getAttrib(ed.selection.getNode(), 'class', '').indexOf('mceItem') != -1)
					return;
				
				jQuery("<div>", {id: "dialog",title: "Thêm Ảnh từ hệ thống",text: ""}).html(img.buildContent(ed)).dialog({
					modal:true,width: 600,resizable: false,height: 'auto',draggable: false, resizable: false,
					create: function(event, ui) {
						img.ini(ed.selection.getNode(),$(this));
						$( "#img_panel",this ).tabs({'selected':0,fxAutoHeight: true,'disabled':[2]});
						img.setStyle($(this));
						img.events($(this));
					},
					buttons: {
						"insert":{  text: 'Chèn Ảnh', class: 'btn primary',
							click: function(){
								
								img.insert(ed,$(this));
//					 			tinyMCE.execCommand('mceInsertContent',false,'<br><img alt="test" src="http://betforex.local/administrator/resource/70x70/deal/SON-MOI-EVELINE_20111223142556848.jpg" />');
//								ed.focus();
//				                ed.selection.setContent('<img alt="test" src="http://betforex.local/administrator/resource/70x70/deal/SON-MOI-EVELINE_20111223142556848.jpg" />');
				                $(this).dialog("close");
								
                        	}
						},
						"cancel":{  text: 'Đóng', class: 'btn primary',
							click: function(){ $(this).dialog("close");}
						}
					}
				});;
			});
			ed.addButton('ictimage', {
				title : 'ictimage.image_desc',
				cmd : 'mceICTImage',
				image : url + '/img/jbimages.gif'
			});
		},

		getInfo : function() {
			return {
				longname : 'Nguyen Hong Quan',
				author : 'QuanNH',
				authorurl : 'http://giaiphapict.net',
				infourl : '',
				version : tinymce.majorVersion + "." + tinymce.minorVersion
			};
		}
	});
	tinymce.PluginManager.add('ictimage', tinymce.plugins.ICTImagePlugin);
})();

var buildContentGeneral ='<div id="general_panel" >'
	+'<table role="presentation" class="properties">'
	+'<tr>'
	+	'<td class="column1"><label id="srclabel" for="src">Image URL</label></td>'
	+	'<td colspan="2"><table role="presentation" border="0" cellspacing="0" cellpadding="0"><tr>' 
	+		'<td><input name="src" type="text" id="src" value="" /></td>'
	+		'<td><button  id="select-image"  value="Select File" >a</button></td>' 
	+		'<td id="srcbrowsercontainer">&nbsp;</td>'
	+	'</tr></table></td>'
	+'</tr>'
//	+'<tr>'
//	+	'<td><label for="src_list">Image List</label></td>'
//	+	'<td><select id="src_list" name="src_list" ><option value=""></option></select></td>'
//	+'</tr>'
	+'<tr>' 
	+	'<td class="column1"><label id="altlabel" for="alt">Image Description</label></td>' 
	+	'<td colspan="2"><input id="alt" name="alt" type="text" value="" /></td>' 
	+'</tr>' 
	+'<tr>' 
	+	'<td class="column1"><label id="titlelabel" for="title">Title</label></td>' 
	+	'<td colspan="2"><input id="title" name="title" type="text" value="" /></td>' 
	+'</tr>'
	+'</table>'
	+'<fieldset><legend>Preview</legend><div id="prev"></div></fieldset>'
	+'</div>';

buildContentAdvanced :'<div id="advanced_panel" >'
	+'</div>';
//	'+ed.getLang('ictimage.')+'
var img = {
	buildContentAppearance:function(ed){
		html ='<div id="appearance_panel" >'
		+'<table role="presentation" border="0" cellpadding="4" cellspacing="0" width="100%">'
		+'<tr>'
		+	'<td class="column1"><label id="alignlabel" for="align">'+ed.getLang('ictimage.align')+'</label></td>'
		+	'<td><select id="align" name="align" >' 
		+		'<option value="">'+ed.getLang('not_set')+'</option>'
		+		'<option value="baseline">'+ed.getLang('ictimage.align_baseline')+'</option>'
		+		'<option value="top">'+ed.getLang('ictimage.align_top')+'</option>'
		+		'<option value="middle">'+ed.getLang('ictimage.align_middle')+'</option>'
		+		'<option value="bottom">'+ed.getLang('ictimage.align_bottom')+'</option>'
		+		'<option value="text-top">'+ed.getLang('ictimage.align_texttop')+'</option>'
		+		'<option value="text-bottom">'+ed.getLang('ictimage.align_textbottom')+'</option>'
		+		'<option value="left">'+ed.getLang('ictimage.align_left')+'</option>'
		+		'<option value="right">'+ed.getLang('ictimage.align_right')+'</option>'
		+	'</select></td>'
		+	'<td rowspan="6" valign="top">'
		+		'<div class="alignPreview"><img id="alignSampleImg" width="45" src="" alt="'+ed.getLang('ictimage.example_img')+'" />Lorem ipsum, Dolor sit amet, consectetuer adipiscing loreum ipsum edipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.Loreum ipsum edipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam	erat volutpat.</div>'
		+	'</td>'
		+'</tr>'
		+'<tr role="group" aria-labelledby="widthlabel">'
		+	'<td class="column1"><label id="widthlabel" for="width">'+ed.getLang('ictimage.dimensions')+'</label></td>'
		+	'<td class="nowrap">'
		+		'<span style="display:none" id="width_voiceLabel">'+ed.getLang('ictimage.width')+'</span>'
		+		'<input name="width" type="text" id="width" value="" size="5" maxlength="5" class="size"  /> x ' 
		+		'<span style="display:none" id="height_voiceLabel">'+ed.getLang('ictimage.height')+'</span>'
		+		'<input name="height" type="text" id="height" value="" size="5" maxlength="5" class="size"  /> px'
		+	'</td>'
		+'</tr>'
		+'<tr>'
		+	'<td>&nbsp;</td>'
		+	'<td><table role="presentation" border="0" cellpadding="0" cellspacing="0">'
		+		'<tr>'
		+			'<td><input id="constrain" type="checkbox" name="constrain" class="checkbox" checked="checked" /></td>'
		+			'<td><label id="constrainlabel" for="constrain">'+ed.getLang('ictimage.constrain_proportions')+'</label></td>'
		+		'</tr>'
		+	'</table></td>'
		+'</tr>'
		+'<tr>'
		+	'<td class="column1"><label id="vspacelabel" for="vspace">'+ed.getLang('ictimage.vspace')+'</label></td>' 
		+	'<td><input name="vspace" type="text" id="vspace" value="" size="3" maxlength="3" class="number"   /></td>'
		+'</tr>'
		+'<tr>' 
		+	'<td class="column1"><label id="hspacelabel" for="hspace">'+ed.getLang('ictimage.hspace')+'</label></td>' 
		+	'<td><input name="hspace" type="text" id="hspace" value="" size="3" maxlength="3" class="number"  /></td>' 
		+'</tr>'
		+'<tr>'
		+	'<td class="column1"><label id="borderlabel" for="border">'+ed.getLang('ictimage.border')+'</label></td>' 
		+	'<td><input id="border" name="border" type="text" value="" size="3" maxlength="3" class="number"  /></td>' 
		+'</tr>'
//		+'<tr>'
//		+	'<td><label for="class_list">'+ed.getLang('class_name')+'</label></td>'
//		+	'<td colspan="2"><select id="class_list" name="class_list" class="mceEditableSelect"><option value=""></option></select></td>'
//		+'</tr>'
		+'<tr>'
		+	'<td class="column1"><label id="stylelabel" for="style">'+ed.getLang('ictimage.style')+'</label></td>' 
		+	'<td colspan="2"><input id="style" name="style" type="text" value=""  /></td>' 
		+'</tr>'
//		+'<tr>'
//		+	'<td class="column1"><label id="classeslabel" for="classes">'+ed.getLang('ictimage.classes')+'</label></td>' 
//		+	'<td colspan="2"><input id="classes" name="classes" type="text" value=""  /></td>' 
//		+'</tr>'
		+'</table>'
		+'</fieldset>'
		+'</div>';
		return html;
	},
	getStyle : function(oElm, strCssRule){
		var strValue = "";
		if(document.defaultView && document.defaultView.getComputedStyle){
			strValue = document.defaultView.getComputedStyle(oElm, "").getPropertyValue(strCssRule);
		}
		else if(oElm.currentStyle){
			strCssRule = strCssRule.replace(/\-(\w)/g, function (strMatch, p1){
				return p1.toUpperCase();
			});
			strValue = oElm.currentStyle[strCssRule];
		}
		return strValue;
	},
	getAttrib : function(e, at) {
		
			switch (at) {
				case 'align':
					if (v = getStyle(e,'float'))
						return v;

					if (v = dom.getStyle(e, 'vertical-align'))
						return v;

					break;

				case 'hspace':
					v = this.getStyle(e, 'margin-left');
					v2 = this.getStyle(e, 'margin-right');
					if (v && v == v2)
						return parseInt(v.replace(/[^0-9]/g, ''));
					break;

				case 'vspace':
					v = this.getStyle(e, 'margin-top');
					v2 = this.getStyle(e, 'margin-bottom');
					if (v && v == v2)
						return parseInt(v.replace(/[^0-9]/g, ''));

					break;

				case 'border':
					v = 0;

					$.each(['top', 'right', 'bottom', 'left'], function(index,sv) {
						alert(sv);
						sv = this.getStyle(e,'border');
						alert(sv);
						// False or not the same as prev
						if (!sv || (sv != v && v !== 0)) {
							v = 0;
							return false;
						}

						if (sv)
							v = sv;
					});

					if (v)
						return parseInt(v.replace(/[^0-9]/g, ''));

					break;
			}
//		}

		if (v = dom.getAttrib(e, at))
			return v;

		return '';
	},
	demo : function(){
		return $('#appearance_panel img#alignSampleImg');
	},
	pre : function(){
		imagePre = document.getElementById('previewImg');
		return document.getElementById('previewImg');
	},
	buildContent : function(ed){
		html = '<div id="img_panel" ><ul><li><a href="#general_panel">Dữ Liệu</a></li><li><a href="#appearance_panel">Cấu Hình Hiển Thị</a></li><li><a href="#tabs-3">Cấu Hình Hành Động</a></li></ul>'
		+buildContentGeneral
		+img.buildContentAppearance(ed)
		+'</div>';
		return html;
	},
	ini: function(node,tagetArea){
		
		if (node.nodeName == 'IMG') {
			tagetArea.find('input#src').val(node.src);
			tagetArea.find('input#alt').val(node.alt);
			tagetArea.find('input#title').val(node.title);
			
			tagetArea.find('input#width').val(node.width);
			tagetArea.find('input#height').val(node.height);
			
			tagetArea.find('input#vspace').val(this.getAttrib(node, 'vspace'));
			tagetArea.find('input#hspace').val(this.getAttrib(node, 'hspace'));
			
//			tagetArea.find('input#border').val(this.getAttrib(node, 'border'));
			
			
			//nl.src.value = dom.getAttrib(n, 'src');
			img.showPreview(tagetArea);
		}
	},
	setStyle: function(tagetArea){
		jQuery(".ui-dialog-titlebar").hide();
		jQuery('.ui-dialog-content').css({'padding':0});
		jQuery('#prev',tagetArea).css({'margin':0,'overflow':'auto','height':150});
		jQuery('input[name=src],input[name=alt],input[name=title]',tagetArea).css({'width':300});
		jQuery('.ui-tabs-panel').css({'background':'#fff'});
		jQuery('fieldset',tagetArea).css({'border':'none','border-radius':0,'box-shadow':'none'});
		jQuery('.alignPreview',tagetArea).css({'width':140,'overflow':'hidden','border':'1px solid #000000','padding':5,'font-size':'70%'});
		
	},
	events :function(dialogTaget){
		dialogTaget.find('button#select-image').click(function(){
//			jQuery("<div>", {id: "dialog-imageResource",title: "",text: ""}).appendTo("body").elfinder({
//				url : site_url+"resource/images_list?dir=article",
//				lang : "vi",viewOnly:true,
//				dialog : { width : 900,height:420, draggable: false, resizable: false, modal : true, title : "Quản Lý Dữ Liệu Ảnh" },
//				closeOnEditorCallback : true,
//				editorCallback :  function(url) { 
//					dialogTaget.find('input#src').val(url);
//					img.showPreview(dialogTaget);
//					$( "#img_panel").tabs({'disabled':[2]});
//					img.appearanceEvents(dialogTaget);
//				}
//		    });
			
			var fm = $('<div/>').dialogelfinder({
				url : site_url+'resource/images_list?dir=article',
				lang : 'en', width : 900,height:420,destroyOnClose : true,
				getFileCallback : function(files, fm) {
					dialogTaget.find('input#src').val(files);
					img.showPreview(dialogTaget);
					$( "#img_panel").tabs({'disabled':[2]});
					img.appearanceEvents(dialogTaget);
				},commandsOptions : {getfile : { oncomplete : 'close',folders : false}}
				}).dialogelfinder('instance');
				
			
		});
		dialogTaget.find('input#src').change(function() {
			//alert('change val='+dialogTaget.find('input#src').val());
			img.showPreview(dialogTaget);
			$( "#img_panel").tabs({'disabled':[2]});
			img.appearanceEvents(dialogTaget);
		});
	},
	appearanceEvents:function(dialogTaget){
		dialogTaget.find('#align').change(function(){
			img.updateStyle('align');
//			img.updateInputStyle('align');
			//changeAppearance()
		});
		dialogTaget.find('input#width').change(function(){img.changeHeight();});
		dialogTaget.find('input#vspace').change(function(){
			img.updateStyle('vspace');
			//changeAppearance()
		});
		dialogTaget.find('input#hspace').change(function(){
			img.updateStyle('hspace');
			//changeAppearance()
		});
		dialogTaget.find('input#border').change(function(){
			img.updateStyle('border');
			//changeAppearance()
		});
		
		
	},
	insert : function(ed,dialogTaget){
		if (dialogTaget.find('input#src').val() === '') {
			alert('insert src='+dialogTaget.find('input#src').val()); return false;
			if (ed.selection.getNode().nodeName == 'IMG') {
				ed.dom.remove(ed.selection.getNode());
				ed.execCommand('mceRepaint');
			}
			return;
		} 
		ed.execCommand('mceInsertContent', false, dialogTaget.find('div#prev').html(), {skip_undo : 1});
		ed.undoManager.add();
	},
	showPreview:function(dialogTaget){
		args = {
				src : dialogTaget.find('input#src').val(),
//				width : nl.width.value,
//				height : nl.height.value,
//				alt : nl.alt.value,
//				title : nl.title.value,
//				'class' : getSelectValue(f, 'class_list'),
//				style : nl.style.value,
				id : 'previewImg',
//				dir : nl.dir.value,
//				lang : nl.lang.value,
//				usemap : nl.usemap.value,
//				longdesc : nl.longdesc.value
			};
		//alert('priview src='+dialogTaget.find('input#src').val()); return false;
		dialogTaget.find('#alignSampleImg').attr({'src':args.src});
		dialogTaget.find('div#prev').html(jQuery("<img>",args));
		
	},
	updateStyle : function(ty) {
//		var dom = tinyMCEPopup.dom, b, bStyle, bColor, v, isIE = tinymce.isIE, f = document.forms[0], img = dom.create('img', {style : dom.get('style').value});
		imgDemo = img.demo(); 
		if (ty == 'align') {
			imgDemo.css({'float':'','vertical-align':''});
			v = $('#align').val();
			if (v) {
				if (v == 'left' || v == 'right') imgDemo.css('float', v);
				else imgDemo.css('vertical-align', v);
			}
		}else if (ty == 'vspace') {
			imgDemo.css({'margin-top':'','margin-bottom':''});
			v = $('input#vspace').val();
			if (v) { imgDemo.css({'margin-top':v+'px','margin-bottom':v+'px'});}
		} else if (ty == 'hspace') {
			imgDemo.css({'margin-left':'','margin-right':''});
			v = $('input#hspace').val();
			if (v) { imgDemo.css({'margin-left':v+'px','margin-right':v+'px'});}
		} else if (ty == 'border') {
//			b = img.style.border ? img.style.border.split(' ') : [];
//			bStyle = dom.getStyle(img, 'border-style');
//			bColor = dom.getStyle(img, 'border-color');

			imgDemo.css({'border':''});
			v = $('input#border').val();
			if (v || v == '0') {
				b = imgDemo.css('border') ? imgDemo.css('border').split(' ') : [];
				bStyle = imgDemo.css('border-style');
				bColor = imgDemo.css('border-color');
				if (v == '0')
					img.style.border = isIE ? imgDemo.css('border',0) : imgDemo.css('border','0 none none');
				else {
					if (b.length == 3 && b[isIE ? 2 : 1])
						bStyle = b[isIE ? 2 : 1];
					else if (!bStyle || bStyle == 'none')
						bStyle = 'solid';
					if (b.length == 3 && b[isIE ? 0 : 2])
						bColor = b[isIE ? 0 : 2];
					else if (!bColor || bColor == 'none')
						bColor = 'black';
					imgDemo.css('border',v + 'px ' + bStyle + ' ' + bColor);
				}
			}
		}
		
		$('input[name=style]').val(imgDemo.attr('style'));
//		
//		if (tinyMCEPopup.editor.settings.inline_styles) {
//			// Merge
//			dom.get('style').value = dom.serializeStyle(dom.parseStyle(img.style.cssText), 'img');
//		}
	},
//	changeAppearance : function() {
//		var ed = tinyMCEPopup.editor, f = document.forms[0], img = document.getElementById('alignSampleImg');
//
//		if (ed.getParam('inline_styles')) {
//			ed.dom.setAttrib(img, 'style', f.style.value);
//		} else {
//			img.align = f.align.value;
//			img.border = f.border.value;
//			img.hspace = f.hspace.value;
//			img.vspace = f.vspace.value;
//		}
//		
//	},
	updateInputStyle:function(ty){
		imgDemo = img.demo(); 
		style = imgDemo.attr('style');
		$('input[name=style]').val(style);
	},
	changeHeight:function(){
		pre = img.pre();
		inputWidth = $('input[name=width]').val();
		inputHeight = $('input[name=height]').val();
		if (!$('#constrain').is(':checked')) return;
		else if (inputWidth == "" || inputHeight == "") return;
		else{
			tp = (parseInt(inputWidth)/parseInt(pre.width)) * pre.height;
			$('input[name=height]').val(tp);
			
		}
	}
	
};