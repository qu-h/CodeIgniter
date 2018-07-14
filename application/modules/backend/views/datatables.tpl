
{*
<div class="row">
	<div class="col-xs-12 col-sm-7 col-md-7 col-lg-4">
		<h1 class="page-title txt-color-blueDark">
			<i class="fa fa-table fa-fw "></i> Table <span>> Data Tables </span>
		</h1>
	</div>

	<div class="col-xs-12 col-sm-5 col-md-5 col-lg-8">
		<ul id="sparks" class="">
			<li class="sparks-info">
				<h5>
					My Income <span class="txt-color-blue">$47,171</span>
				</h5>
				<div
					class="sparkline txt-color-blue hidden-mobile hidden-md hidden-sm">
					1300, 1877, 2500, 2577, 2000, 2100, 3000, 2700, 3631, 2471, 2700,
					3631, 2471</div>
			</li>
			<li class="sparks-info">
				<h5>
					Site Traffic <span class="txt-color-purple"><i
						class="fa fa-arrow-circle-up" data-rel="bootstrap-tooltip"
						title="Increased"></i>&nbsp;45%</span>
				</h5>
				<div
					class="sparkline txt-color-purple hidden-mobile hidden-md hidden-sm">
					110,150,300,130,400,240,220,310,220,300, 270, 210</div>
			</li>
			<li class="sparks-info">
				<h5>
					Site Orders <span class="txt-color-greenDark"><i
						class="fa fa-shopping-cart"></i>&nbsp;2447</span>
				</h5>
				<div
					class="sparkline txt-color-greenDark hidden-mobile hidden-md hidden-sm">
					110,150,300,130,400,240,220,310,220,300, 270, 210</div>
			</li>
		</ul>
	</div>
</div>
*}
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

					<!-- widget edit box -->
					<div class="jarviswidget-editbox">
						<!-- This area used as dropdown edit box -->

					</div>

					<div class="widget-body no-padding">
						{if isset($fields)}
						<table
								id="data_ajax"
								class="table table-striped table-bordered table-hover"
								data-order='[[ 1, "desc" ]]'
								width="100%"
								{if isset($dataLength)} data-page-length='{$dataLength}' {/if}
								{if isset($dataStart)} data-page-start='{$dataStart}' {/if}
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