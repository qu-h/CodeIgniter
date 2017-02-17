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


var tables = {
	url :null,
	columns :[],
	breakpointDefinition : { tablet : 1024, phone : 480 },
	area:null,table:undefined,helper:undefined,
	load:function(attribute){
	    tables.area = $(attribute);

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
	            	if( typeof $(this).attr('data-action') != undefined ){
	            		if( $(this).attr('data-action')=='edit' ){
	            			url = window.location.href  + '/edit/';

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

