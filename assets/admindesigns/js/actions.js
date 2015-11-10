jQuery(document).ready(function() {

            "use strict";

            // Init Theme Core    
            Core.init();

            // Init Demo JS   
            Demo.init();

            // Init Highlight.js Plugin
            $('pre code').each(function(i, block) {
                hljs.highlightBlock(block);
            });

            // Select all text in CSS Generate Modal
            $('#modal-close').click(function(e) {
                e.preventDefault();
                $('.datatables-demo-modal').modal('toggle');
            });

            $('.datatables-demo-code').on('click', function() {
                var modalContent = $(this).prev();
                var modalContainer = $('.datatables-demo-modal').find('.modal-body')

                // Empty Modal of Existing Content
                modalContainer.empty();

                // Clone Content and Place in Modal
                modalContent.clone(modalContent).appendTo(modalContainer);

                // Toggle Modal
                $('.datatables-demo-modal').modal({
                    backdrop: 'static'
                })
            });

            // Init Datatables with Tabletools Addon    
            $('#datatable').dataTable();
            /*
            $('#datatable2').dataTable({
                "aoColumnDefs": [{
                    'bSortable': false,
                    'aTargets': [-1]
                }],
                "oLanguage": {
                    "oPaginate": {
                        "sPrevious": "",
                        "sNext": ""
                    }
                },
                "iDisplayLength": 5,
                "aLengthMenu": [
                    [5, 10, 25, 50, -1],
                    [5, 10, 25, 50, "All"]
                ],
                "sDom": '<"dt-panelmenu clearfix"lfr>t<"dt-panelfooter clearfix"ip>',
//                "oTableTools": {
//                    "sSwfPath": "vendor/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf"
//                }
            });

            $('#datatable3').dataTable({
                "aoColumnDefs": [{
                    'bSortable': false,
                    'aTargets': [-1]
                }],
                "oLanguage": {
                    "oPaginate": {
                        "sPrevious": "",
                        "sNext": ""
                    }
                },
                "iDisplayLength": 5,
                "aLengthMenu": [
                    [5, 10, 25, 50, -1],
                    [5, 10, 25, 50, "All"]
                ],
                "sDom": 'T<"dt-panelmenu clearfix"lfr>t<"dt-panelfooter clearfix"ip>',
                "oTableTools": {
                    "sSwfPath": "vendor/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf"
                }
            });

            $('#datatable4').dataTable({
                "aoColumnDefs": [{
                    'bSortable': false,
                    'aTargets': [-1]
                }],
                "oLanguage": {
                    "oPaginate": {
                        "sPrevious": "",
                        "sNext": ""
                    }
                },
                "iDisplayLength": 5,
                "aLengthMenu": [
                    [5, 10, 25, 50, -1],
                    [5, 10, 25, 50, "All"]
                ],
                "sDom": 'T<"panel-menu dt-panelmenu"lfr><"clearfix">tip',

                "oTableTools": {
                    "sSwfPath": "vendor/plugins/datatables/extensions/TableTools/swf/copy_csv_xls_pdf.swf"
                }
            });

            // Multi-Column Filtering
            $('#datatable5 thead th').each(function() {
                var title = $('#datatable5 tfoot th').eq($(this).index()).text();
                $(this).html('<input type="text" class="form-control" placeholder="Search ' + title + '" />');
            });

            // DataTable
            var table5 = $('#datatable5').DataTable({
                "sDom": 't<"dt-panelfooter clearfix"ip>',
                "ordering": false
            });

            // Apply the search
            table5.columns().eq(0).each(function(colIdx) {
                $('input', table5.column(colIdx).header()).on('keyup change', function() {
                    table5
                        .column(colIdx)
                        .search(this.value)
                        .draw();
                });
            });


            // ABC FILTERING
            var table6 = $('#datatable6').DataTable({
                "sDom": 't<"dt-panelfooter clearfix"ip>',
                "ordering": false
            });

            var alphabet = $('<div class="dt-abc-filter"/>').append('<span class="abc-label">Search: </span> ');
            var columnData = table6.column(0).data();
            var bins = bin(columnData);

            $('<span class="clear active"/>')
                .data('letter', '')
                .data('match-count', columnData.length)
                .html('None')
                .appendTo(alphabet);

            for (var i = 0; i < 26; i++) {
                var letter = String.fromCharCode(65 + i);

                $('<span/>')
                    .data('letter', letter)
                    .data('match-count', bins[letter] || 0)
                    .addClass(!bins[letter] ? 'empty' : '')
                    .html(letter)
                    .appendTo(alphabet);
            }

            $('#datatable6').parents('.panel').find('.panel-menu').html(alphabet);

            alphabet.on('click', 'span', function() {
                alphabet.find('.active').removeClass('active');
                $(this).addClass('active');

                _alphabetSearch = $(this).data('letter');
                table6.draw();
            });

            var info = $('<div class="alphabetInfo"></div>')
                .appendTo(alphabet);

            var _alphabetSearch = '';

            $.fn.dataTable.ext.search.push(function(settings, searchData) {
                if (!_alphabetSearch) {
                    return true;
                }
                if (searchData[0].charAt(0) === _alphabetSearch) {
                    return true;
                }
                return false;
            });

*/
            function bin(data) {
            	if( data == undefined ) return;
                var letter, bins = {};
                for (var i = 0, ien = data.length; i < ien; i++) {
                    letter = data[i].charAt(0).toUpperCase();

                    if (bins[letter]) {
                        bins[letter] ++;
                    } else {
                        bins[letter] = 1;
                    }
                }
                return bins;
            }

            // ROW GROUPING
            var table7 = $('#datatable7').DataTable({
                "columnDefs": [{
                    "visible": false,
                    "targets": 2
                }],
                "order": [
                    [2, 'asc']
                ],
                "sDom": 't<"dt-panelfooter clearfix"ip>',
                "displayLength": 25,
                "drawCallback": function(settings) {
                    var api = this.api();
                    var rows = api.rows({
                        page: 'current'
                    }).nodes();
                    var last = null;

                    api.column(2, {
                        page: 'current'
                    }).data().each(function(group, i) {
                        if (last !== group) {
                            $(rows).eq(i).before(
                                '<tr class="row-label ' + group.replace(/ /g, '').toLowerCase() + '"><td colspan="5">' + group + '</td></tr>'
                            );
                            last = group;
                        }
                    });
                }
            });

            // Order by the grouping
            $('#datatable7 tbody').on('click', 'tr.row-label', function() {
                var currentOrder = table7.order()[0];
                if (currentOrder[0] === 2 && currentOrder[1] === 'asc') {
                    table7.order([2, 'desc']).draw();
                } else {
                    table7.order([2, 'asc']).draw();
                }
            });

            // MISC DATATABLE HELPER FUNCTIONS

            // Add Placeholder text to datatables filter bar
            $('.dataTables_filter input').attr("placeholder", "Enter Filter Terms Here....");

            // Manually Init Chosen on Datatables Filters
            // $("select[name='datatable2_length']").chosen();
            // $("select[name='datatable3_length']").chosen();
            // $("select[name='datatable4_length']").chosen();

            // Init Xeditable Plugin
            $.fn.editable.defaults.mode = 'popup';
            $('.xedit').editable();

        });
