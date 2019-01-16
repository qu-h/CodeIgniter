<section id="widget-grid" class="">
	<div class="row">

		<!-- NEW WIDGET START -->
		<article class="col-xs-12 col-sm-12 col-md-12 col-lg-12">

			<!-- Widget ID (each widget will need unique ID)-->
			<div class="jarviswidget jarviswidget-color-darken" data-widget-editbutton="false" data-widget-colorbutton="false" data-widget-deletebutton="false"
			>
				<!-- widget options:
								usage: <div class="jarviswidget" id="wid-id-0" data-widget-editbutton="false">

								data-widget-colorbutton="false"
								data-widget-editbutton="false"
								data-widget-togglebutton="false"
								data-widget-deletebutton="false"

								data-widget-custombutton="false"
								data-widget-collapsed="true"
								data-widget-sortable="false"

								-->
				<header>
					{if isset($PageTitle)}
					<span class="widget-icon"> <i class="fa fa-table"></i></span>
					<h2>{$PageTitle}</h2>
					{/if}
				</header>
				<!-- widget div-->
				<div>
					<div class="jarviswidget-editbox"></div>
					<div class="widget-body no-padding">
						{if isset($fields)}
						<table
								id="data_ajax"
								class="table table-striped table-bordered table-hover"
								width="100%"
								{if isset($dataLength)} data-page-length='{$dataLength}' {/if}
								{if isset($dataStart)} data-page-start='{$dataStart}' {/if}
								{if isset($page_order)} data-order='[{$page_order}]' {/if}
						>
							<thead>
								{if isset($columns_filter) AND $columns_filter }
								<tr>
								{foreach $fields AS $th}
								<th class="hasinput" >
									<input type="text" class="form-control" placeholder="Filter Name" />
								</th>
								{/foreach}
								</tr>
								{/if}
								<tr>
									{foreach $fields AS $th}
									<th>{if isset($th[0])}{lang txt=$th[0]}{/if}</th>
									{/foreach}

								</tr>
							</thead>
							<tbody>

							</tbody>
						</table>
						{*https://datatables.net/examples/ajax/*}
						<script type="text/javascript">
							var site_news  = '{config_item("news-site")}';
                            $(document).ready(function() {
                                tables.url = '{$data_json_url}';
                                tables.columns = [{$columns_fields}];
                                tables.columnDefs = [
                                    { "targets": 2, "render": function ( data, type, row, meta ) {
										if( row.category_name !== null ){
											return '<a href="?category-id='+row.category_id+'">'+row.category_name+'</a>';
										}
										return null;
									}},
                                    { "targets": 3, "render": function ( data, type, row, meta ) {
										if( row.source !== null ){
											return '<a href="'+row.source+'" target="_blank" class="btn btn-xs btn-default" ><i class="fa fa-globe"></i></a>';
										}
										return null;
									}},
                                    { "targets": 4, "render": function ( data, type, row, meta ) {
										if( row.tag_names !== null ){
                                            let tags = '',tag_names = row.tag_names.split(','), tag_ids = row.tag_ids.split(',');
											if( tag_names.length > 0 ){
                                                tag_names.map( function(tag,i) {
                                                    tags += ' <a href="?keyword='+tag_ids[i]+'" >'+tag+'</a>';
                                                })
											}
                                            //console.log('bug',{ row, tag_names,tag_ids },typeof tag_names);
											return tags;
										}
										return null;
									}},
                                    { "targets": 5, "render": function ( data, type, row, meta ) {
										let control = '';
										control += '<button class="btn btn-xs btn-default" data-action="edit"><i class="fa fa-pencil"></i></button>';
										control += '<button class="btn btn-xs btn-default" data-action="delete"><i class="fa fa-times text-danger"></i></button>';
										control += '<a class="btn btn-xs btn-default" href="'+site_news+'/'+row.alias+'" target="_blank" ><i class="fa fa-globe text-primary"></i></a>';
										return control;
									}}
                                ];
                                $(document).ready(function() {
                                    pageSetUp();
                                    tables.load('table#data_ajax');
                                });
							});
						</script>
						{/if}

					</div>

				</div>

			</div>
		</article>
	</div>
</section>