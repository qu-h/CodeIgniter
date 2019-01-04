<section id="widget-grid" class="">
    <div class="row">

        <article class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div class="jarviswidget jarviswidget-color-darken" data-widget-editbutton="false" data-widget-colorbutton="false" data-widget-deletebutton="false" >
                <header>
                    {if isset($PageTitle)}
                        <span class="widget-icon"> <i class="fa fa-table"></i></span>
                        <h2>{$PageTitle}</h2>
                    {/if}
                </header>
                <div>
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
                            <script type="text/javascript">
                                $(document).ready(function() {
                                    tables.url = '{$data_json_url}';
                                    tables.columns = [{$columns_fields}];

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