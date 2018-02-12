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
                    {include file="category/nestable.tpl"}
                    {*include file="category/table.tpl"*}
                </div>
            </div>
        </article>
    </div>
</section>

