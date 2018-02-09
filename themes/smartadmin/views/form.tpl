<section id="widget-grid" class="">
    <div class="row">
        <article class="col-sm-12 col-md-12 col-lg-12">
            <div class="jarviswidget" id="wid-id-0"
                 data-widget-colorbutton="false"
                 data-widget-editbutton="false"
                 data-widget-custombutton="false"
                 data-widget-deletebutton="false"
                 data-widget-togglebutton="false"
            >
                {*
                 widget options:
                usage: <!-- <div class="jarviswidget" id="wid-id-0" data-widget-editbutton="false"> -->

                data-widget-colorbutton="false"
                data-widget-editbutton="false"


                data-widget-fullscreenbutton="false"
                data-widget-custombutton="false"
                data-widget-collapsed="true"
                data-widget-sortable="false"
                *}
                <header>
                    {if isset($formTitle)}
                        <span class="widget-icon"> <i class="fa fa-edit"></i></span>
                        <h2>{$formTitle}</h2>
                    {/if}
                </header>
                <div>
                    <div class="jarviswidget-editbox"></div>
                    <div class="widget-body {*no-padding*}">
                        <form action="" method="post" class="smart-form" >
                            <fieldset>
                                {if isset($fields) && $fields|@count > 0}
                                    {foreach $fields AS $name=>$field }
                                        {inputs name=$name}
                                    {/foreach}
                                {/if}
                            </fieldset>
                            <footer class="smart-form" >
                                <button class="btn btn-primary" type="submit">{lang txt="Submit Form"}</button>
                            </footer>
                        </form>
                    </div>
                </div>
            </div>
        </article>
    </div>
</section>