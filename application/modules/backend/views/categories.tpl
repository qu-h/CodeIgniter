
<section class="">
    <div class="row">
        <article class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
            <div class="jarviswidget jarviswidget-color-darken" id="wid-id-0" data-widget-editbutton="false">
                <header>
                    {if isset($PageTitle)}
                        <span class="widget-icon"> <i class="fa fa-table"></i></span>
                        <h2>{$PageTitle}</h2>
                    {/if}
                </header>
                <div>
                    <div class="jarviswidget-editbox"></div>

                    <div class="widget-body no-padding">

                        <table id="dt_basic" class="table table-striped table-bordered table-hover" width="100%">
                            <thead>
                            <tr>
                                <th data-hide="phone" >
                                    <i class="fa fa-fw fa-key text-muted hidden-sm hidden-xs"></i>
                                    ID
                                </th>
                                <th>
                                    <i class="fa fa-fw fa-user text-muted hidden-sm hidden-xs"></i>
                                    {lang text='name'}
                                </th>
                                <th>
                                    <i class="fa fa-fw fa-calendar txt-color-blue hidden-sm hidden-xs"></i>
                                    Edit
                                </th>
                            </tr>
                            </thead>
                            <tbody>
                            {if isset($categories)}
                                {foreach $categories AS $cate}
                                    <tr>
                                        <td>{$cate.id}</td>
                                        <td>{$cate.name}</td>
                                        <td>
                                            <a href="javascript:void(0);" class="btn btn-info btn-xs">
                                                <i class="fa fa-pencil"></i>
                                            </a>
                                            <a href="javascript:void(0);" class="btn btn-info btn-xs">
                                                <i class="fa fa-gear fa-lg"></i>
                                            </a>
                                        </td>
                                    </tr>
                                {/foreach}
                            {/if}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </article>
    </div>
</section>

<script type="text/javascript">

    // DO NOT REMOVE : GLOBAL FUNCTIONS!

    $(document).ready(function () {

        //pageSetUp();

        /* // DOM Position key index //

        l - Length changing (dropdown)
        f - Filtering input (search)
        t - The Table! (datatable)
        i - Information (records)
        p - Pagination (paging)
        r - pRocessing
        < and > - div elements
        <"#id" and > - div with an id
        <"class" and > - div with a class
        <"#id.class" and > - div with an id and class

        Also see: http://legacy.datatables.net/usage/features
        */

        /* BASIC ;*/
        var responsiveHelper_dt_basic = undefined;

        var breakpointDefinition = {
            tablet: 1024,
            phone: 480
        };


        tables.columns = [{$columns_fields}];
        $(document).ready(function() {
            pageSetUp();
            tables.load('table#dt_basic');
        });



        /* END BASIC */


    })

</script>