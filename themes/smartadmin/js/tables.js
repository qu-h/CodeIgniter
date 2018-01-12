/**
 *
 */
/*
 * // DOM Position key index //
 *
 * l - Length changing (dropdown) f - Filtering input (search) t - The Table!
 * (datatable) i - Information (records) p - Pagination (paging) r - pRocessing <
 * and > - div elements <"#id" and > - div with an id <"class" and > - div with
 * a class <"#id.class" and > - div with an id and class
 *
 * Also see: http://legacy.datatables.net/usage/features
 */



var breakpointDefinition = {
	tablet : 1024,
	phone : 480
};
/* COLUMN FILTER  */

function generate_uri(suburi){
	if( typeof suburi === 'undefined'){
		suburi = 'edit';
	}
	var url = '';
    var href = window.location.href;
    if( href.slice(-5)===".html"){
        url = href.substring(0,href.length - 5) + '/'+suburi+'/';
    }else if( href.slice(-4)===".htm"){
        url = href.substring(0,href.length - 4) + '/'+suburi+'/';
    } else {
        url = href + '/'+suburi+'/';
    }
    return url;
}

var tables = {
	url :null,
	columns :[],
	breakpointDefinition : { tablet : 1024, phone : 480 },
	area:null,table:undefined,helper:undefined,
	load:function(attribute){
	    tables.area = $(attribute);

        jQuery.each(tables.columns,function (index,setting) {

            if( typeof setting.render_img !== 'undefined' ){
                tables.columns[index].render = function (data, type, full, meta) {
                    return '<img src="' + setting.render_img+data + '" />';
                }
            }

        });

	    tables.table  =  $(attribute).DataTable({
		    ajax: { url: tables.url, dataSrc: 'data' },
		    columns: tables.columns,
		    "sDom" : "<'dt-toolbar'<'col-xs-12 col-sm-6'f><'col-sm-6 col-xs-12 hidden-xs'l>r>"
				+ "t"
				+ "<'dt-toolbar-footer'<'col-sm-6 col-xs-12 hidden-xs'i><'col-xs-12 col-sm-6'p>>",
		    "autoWidth" : true,
		    "preDrawCallback" : function() {
			if (!tables.helper) {
			    tables.helper = new ResponsiveDatatablesHelper( tables.area ,tables.breakpointDefinition);
			}
		    },
		    "rowCallback" : function(nRow) {
		    	tables.helper.createExpandIcon(nRow);
		    },
		    "drawCallback" : function(oSettings) {
		    	tables.helper.respond();
		    },
		    "initComplete": function () {
	            var api = this.api();
	            api.$('button').click( function () {
	            	var url = '';
	            	if( typeof $(this).attr('data-action') !== undefined ){
	            		if( $(this).attr('data-action')==='edit' ){
	            			url = generate_uri('edit');

            				row_data = tables.table.row( $(this).parents('tr') ).data();
            				if( typeof(row_data) != undefined && typeof(row_data.id) != undefined ){
            					$(location).attr('href', url+ row_data.id);
            				}
	            		} else if ($(this).attr('data-action')==='delete'){
                            url = generate_uri('delete');
                            row_data = tables.table.row( $(this).parents('tr') ).data();
                            if( typeof(row_data) != undefined && typeof(row_data.id) != undefined ){
                                $(location).attr('href', url+ row_data.id);
                            }
						}
	            	}
	                //api.search( this.innerHTML ).draw();
	            });
	        }
	    });
	    tables.columns_filter();

	},

	columns_filter:function(){
	    $("thead th input[type=text]",tables.area).on( 'keyup change', function () {
		tables.table
	            .column( $(this).parent().index()+':visible' )
	            .search( this.value )
	            .draw();

	    } );

	}
};

