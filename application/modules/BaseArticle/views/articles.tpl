<section id="widget-grid" >
	<div class="row">

		<!-- NEW WIDGET START -->
		<article class="col-xs-12 col-sm-12 col-md-12 col-lg-12">

			<!-- Widget ID (each widget will need unique ID)-->
			<div class="jarviswidget jarviswidget-color-darken" data-widget-editbutton="false" data-widget-colorbutton="false" data-widget-deletebutton="false"
			>
				<header>
					{if isset($PageTitle)}
					<span class="widget-icon"> <i class="fa fa-table"></i></span>
					<h2>{$PageTitle}</h2>
					{/if}
				</header>
				<div>
					<div class="jarviswidget-editbox"></div>
					<div class="smart-form">
						<div class="row">
							<div class="col-md-12 padding-10">
								<section>
								{input_tags name="filter[tags]" value=$filter.tags class="data-table-filter" multiple=true}
								</section>
							</div>
						</div>
					</div>

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
									{ "targets": 1, "render": function ( data, type, row, meta ) {
											if( row.title !== null ){
												return "<a href=\"article/edit/%s\">%s</a>".format(row.id,row.title);
											}
											return null;
									}},
                                    { "targets": 2, "render": function ( data, type, row, meta ) {
											if( row.category_names !== null ){
												let categories = '',names = row.category_names.split(','), ids = row.category_ids.split(',');
												if( names.length > 0 ){
													names.map( function(name,i) {
														categories += ' <a href="?category-id='+ids[i]+'" class="tb-categories" >'+name+'</a>';
													})
												}
												return categories;
											}
										return null;
									}},
                                    { "targets": 3, "render": function ( data, type, row, meta ) {
                                    	var btn = '';
										if( row.source !== null ){
											btn += '<a href="'+row.source+'" target="_blank" class="btn btn-xs btn-default" ><i class="fa fa-globe"></i></a>';
										}
										{if 'MARKDOWN_URL'|env|count_characters > 0}
										if( typeof row.markdown !== 'undefined' && row.markdown.length > 0 ){
											btn += '<a href="{'MARKDOWN_URL'|env}'+row.markdown+'" target="_blank" class="btn btn-xs btn-default" ><i class="fa fa-book"></i></a>';
										}
										{/if}
										return btn;
									}},
                                    { "targets": 4, "render": function ( data, type, row, meta ) {
										if( row.tag_names !== null ){
                                            let tags = '',tag_names = row.tag_names.split(','), tag_ids = row.tag_ids.split(',');
											if( tag_names.length > 0 ){
                                                tag_names.map( function(tag,i) {
                                                    tags += '<a href="?keyword='+tag_ids[i]+'" class="tb-tags" >'+tag+'</a>';
                                                })
											}
											return tags;
										}
										return null;
									}},
                                    { "targets": 5, "render": function ( data, type, row, meta ) {
										let control = '';
										control += '<button class="btn btn-xs btn-default" data-action="edit"><i class="fa fa-pencil"></i></button>';
										control += '<button class="btn btn-xs btn-default" data-action="delete"><i class="fa fa-times text-danger"></i></button>';
										//control += '<a class="btn btn-xs btn-default" href="'+site_news+'/'+row.alias+'" target="_blank" ><i class="fa fa-globe text-primary"></i></a>';
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