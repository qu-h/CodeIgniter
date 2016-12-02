(function () {
    tinymce.PluginManager.requireLangPack('ictlink');
    tinymce.create('tinymce.plugins.ICTLinkPlugin', {
        init: function (ed, url) {
            ed.addCommand('mceICTLink', function () {
                if (ed.selection.isCollapsed() && !ed.dom.getParent(ed.selection.getNode(), 'A')) return;
                jQuery("<div>", {
                    id: "dialog",
                    title: "Thêm/Xửa Liên Kết"
                }).html(link.buildContent(ed)).dialog({
                	//.css({'position':'absolute'})
                    modal: true,
                    width: 650,
                    height: 'auto', draggable: false, resizable: false,
                    create: function (event, ui) {
                        link.init(ed, $(this));
                        link.setStyle($(this));
                    },
                    buttons: {
                        "insert": {
                            text: 'Thêm Liên Kết',
                            class: 'btn primary',
                            click: function () {
                                if (link.insert(ed, $(this)) != false) $(this).dialog("close");
                            }
                        },
                        "cancel": {
                            text: 'Đóng',
                            class: 'btn primary',
                            click: function () {
                                $(this).dialog("close");
                            }
                        }
                    }
                });
            });
            ed.addButton('ictlink', {
                title: 'Chèn Liên Kết',
                cmd: 'mceICTLink',
                class: 'mce_link'
            });
            ed.addShortcut('ctrl+k', 'Chèn Liên Kết', 'mceICTLink');
            ed.onNodeChange.add(function (ed, cm, n, co) {
                cm.setDisabled('ictlink', co && n.nodeName != 'A');
                cm.setActive('ictlink', n.nodeName == 'A' && !n.name);
            });
        },
        createControl: function (n, cm) {
            return null;
        },
        getInfo: function () {
            return {
                longname: 'Nguyen Hong Quan',
                author: 'QuanNH',
                authorurl: 'http://giaiphapict.net',
                infourl: '',
                version: tinymce.majorVersion + "." + tinymce.minorVersion
            };
        }
    });
    tinymce.PluginManager.add('ictlink', tinymce.plugins.ICTLinkPlugin);
})();
var link = {
    taget: '',
    preInit: function () {
        var url;
        if (url = tinyMCEPopup.getParam("external_link_list_url")) document.write('<script language="javascript" type="text/javascript" src="' + tinyMCEPopup.editor.documentBaseURI.toAbsolute(url) + '"></script>');
    },
    init: function (editor, tagetArea) {
        this.taget = tagetArea;
        if (e = editor.dom.getParent(editor.selection.getNode(), 'A')) {
            tagetArea.find('input#href').val(editor.dom.getAttrib(e, 'href'));
            tagetArea.find('select#target_list').val(editor.dom.getAttrib(e, 'target'));
            tagetArea.find('input#linktitle').val(editor.dom.getAttrib(e, 'title'));
        }
        this.showPreview(); /*		var f = document.forms[0], ed = editor;		// Setup browse button		//document.getElementById('hrefbrowsercontainer').innerHTML = this.getBrowserHTML('hrefbrowser', 'href', 'file', 'theme_advanced_link');		$('#hrefbrowsercontainer',tagetArea).html(this.getBrowserHTML('hrefbrowser', 'href', 'file', 'theme_advanced_link'));		if($('#hrefbrowser',tagetArea).length  > 0)			$('#href',tagetArea).css(width,180);		//if (isVisible('hrefbrowser'))			//document.getElementById('href').style.width = '180px';//		this.fillClassList('class_list');//		this.fillFileList('link_list', 'tinyMCELinkList');		//this.fillTargetList('target_list');		if (e = ed.dom.getParent(ed.selection.getNode(), 'A')) {			f.href.value = ed.dom.getAttrib(e, 'href');			f.linktitle.value = ed.dom.getAttrib(e, 'title');			f.insert.value = ed.getLang('update');			selectByValue(f, 'link_list', f.href.value);			selectByValue(f, 'target_list', ed.dom.getAttrib(e, 'target'));			selectByValue(f, 'class_list', ed.dom.getAttrib(e, 'class'));		}		*/
    },
    showPreview: function () {
        args = {
            href: this.taget.find('input#href').val(),
        };
        this.taget.find('#hrefbrowsercontainer').html(jQuery("<a>", args));
    },
    insert: function (editor, element) {
        if (this.taget.find('input#href').val() === '') {
            alert('Phải nhập vào địa chỉ URL');
            return false;
        } else {
            value = {
                href: this.taget.find('input#href').val(),
                title: this.taget.find('input#linktitle').val(),
                target: this.taget.find('#target_list').val(),
            };
            editor.execCommand('mceInsertLink', false, value);
        }
    },
    update: function () {
        var f = document.forms[0],
            ed = tinyMCEPopup.editor,
            e, b, href = f.href.value.replace(/ /g, '%20');
        tinyMCEPopup.restoreSelection();
        e = ed.dom.getParent(ed.selection.getNode(), 'A');
        if (!f.href.value) {
            if (e) {
                b = ed.selection.getBookmark();
                ed.dom.remove(e, 1);
                ed.selection.moveToBookmark(b);
                tinyMCEPopup.execCommand("mceEndUndoLevel");
                tinyMCEPopup.close();
                return;
            }
        }
        if (e == null) {
            ed.getDoc().execCommand("unlink", false, null);
            tinyMCEPopup.execCommand("mceInsertLink", false, "#mce_temp_url#", {
                skip_undo: 1
            });
            tinymce.each(ed.dom.select("a"), function (n) {
                if (ed.dom.getAttrib(n, 'href') == '#mce_temp_url#') {
                    e = n;
                    ed.dom.setAttribs(e, {
                        href: href,
                        title: f.linktitle.value,
                        target: f.target_list ? getSelectValue(f, "target_list") : null,
                        'class': f.class_list ? getSelectValue(f, "class_list") : null
                    });
                }
            });
        } else {
            ed.dom.setAttribs(e, {
                href: href,
                title: f.linktitle.value,
                target: f.target_list ? getSelectValue(f, "target_list") : null,
                'class': f.class_list ? getSelectValue(f, "class_list") : null
            });
        }
        if (e.childNodes.length != 1 || e.firstChild.nodeName != 'IMG') {
            ed.focus();
            ed.selection.select(e);
            ed.selection.collapse(0);
            tinyMCEPopup.storeSelection();
        }
        tinyMCEPopup.execCommand("mceEndUndoLevel");
        tinyMCEPopup.close();
    },
    checkPrefix: function (n) {
        if (n.value && Validator.isEmail(n) && !/^\s*mailto:/i.test(n.value) && confirm(tinyMCEPopup.getLang('advanced_dlg.link_is_email'))) n.value = 'mailto:' + n.value;
        if (/^\s*www\./i.test(n.value) && confirm(tinyMCEPopup.getLang('advanced_dlg.link_is_external'))) n.value = 'http://' + n.value;
    },
    fillFileList: function (id, l) {
        var dom = tinyMCEPopup.dom,
            lst = dom.get(id),
            v, cl;
        l = window[l];
        if (l && l.length > 0) {
            lst.options[lst.options.length] = new Option('', '');
            tinymce.each(l, function (o) {
                lst.options[lst.options.length] = new Option(o[0], o[1]);
            });
        } else dom.remove(dom.getParent(id, 'tr'));
    },
    fillClassList: function (id) {
        var dom = tinyMCEPopup.dom,
            lst = dom.get(id),
            v, cl;
        if (v = tinyMCEPopup.getParam('theme_advanced_styles')) {
            cl = [];
            tinymce.each(v.split(';'), function (v) {
                var p = v.split('=');
                cl.push({
                    'title': p[0],
                    'class': p[1]
                });
            });
        } else cl = tinyMCEPopup.editor.dom.getClasses();
        if (cl.length > 0) {
            lst.options[lst.options.length] = new Option(tinyMCEPopup.getLang('not_set'), '');
            tinymce.each(cl, function (o) {
                lst.options[lst.options.length] = new Option(o.title || o['class'], o['class']);
            });
        } else dom.remove(dom.getParent(id, 'tr'));
    },
    fillTargetList: function (id) {
        var dom = tinyMCEPopup.dom,
            lst = dom.get(id),
            v;
        lst.options[lst.options.length] = new Option(tinyMCEPopup.getLang('not_set'), '');
        lst.options[lst.options.length] = new Option(tinyMCEPopup.getLang('advanced_dlg.link_target_same'), '_self');
        lst.options[lst.options.length] = new Option(tinyMCEPopup.getLang('advanced_dlg.link_target_blank'), '_blank');
        if (v = tinyMCEPopup.getParam('theme_advanced_link_targets')) {
            tinymce.each(v.split(','), function (v) {
                v = v.split('=');
                lst.options[lst.options.length] = new Option(v[0], v[1]);
            });
        }
    },
    getBrowserHTML: function (id, target_form_element, type, prefix) {
        var option = prefix + "_" + type + "_browser_callback",
            cb, html; /*cb = tinyMCEPopup.getParam(option, tinyMCEPopup.getParam("file_browser_callback"));*/
        cb = false;
        if (!cb) return "";
        html = "";
        html += '<a id="' + id + '_link" href="javascript:openBrowser(\'' + id + '\',\'' + target_form_element + '\', \'' + type + '\',\'' + option + '\');" onmousedown="return false;" class="browse">';
        html += '<span id="' + id + '" title="' + tinyMCEPopup.getLang('browse') + '">&nbsp;</span></a>';
        return html;
    },
    buildContent: function () {
        return '<div class="panel_wrapper">' + '<div id="general_panel" class="panel current">' + '<table border="0" cellpadding="4" cellspacing="0">' + '<tr>' + '<td class="nowrap"><label for="href">Link URL</label></td>' + '<td><table border="0" cellspacing="0" cellpadding="0">' + '<tr>' + '<td><input id="href" name="href" type="text" class="mceFocus" value="" style="width: 550px"  /></td>' + '<td id="hrefbrowsercontainer">&nbsp;</td>' + '</tr>' + '</table></td>' + '</tr>' + '<tr>' + '<td><label id="targetlistlabel" for="targetlist">Target</label></td>' + '<td><select id="target_list" name="target_list">' + '<option value="">-- Not Set --</option>' + '<option value="_self">Open Link in the Same Window</option>' + '<option value="_blank">Open Link in a New Window</option>' + '</select></td>' + '</tr>' + '<tr>' + '<td class="nowrap"><label for="linktitle">Title</label></td>' + '<td><input id="linktitle" name="linktitle" type="text" value="" style="width: 550px" /></td>' + '</tr>' + '</table>' + '</div></div>';
    },
    setStyle: function (tagetArea) {
        tagetArea.css({
            'background-color': '#fff'
        });
        jQuery('.ui-dialog-content').css({
            'padding': 0
        });
    },
};