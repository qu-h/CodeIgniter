{notification}

{if !isset($formTitle)}
    {if isset($fields.id.value) && $fields.id.value > 0}
        {assign var='formTitle' value = lang("Edit") }
    {else}
        {assign var='formTitle' value = lang("Add new") }
    {/if}
{/if}
<section id="widget-grid" class="">
    <div class="row">
        <article class="col-sm-12 col-md-12 col-lg-12">
            <div class="jarviswidget" id="wid-id-0" data-widget-colorbutton="false" data-widget-editbutton="false" data-widget-custombutton="false">
                {if isset($fields.id.value) && $fields.id.value > 0}
                    <header>
                        <span class="widget-icon"><i class="fa fa-edit"></i></span>
                        <h2>{$formTitle} : <i>{$module_name}</i></h2>
                    </header>
                {else}
                    <header>
                        <span class="widget-icon"><i class="fa fa-edit"></i></span>
                        <h2>{$formTitle}</h2>
                    </header>
                {/if}

                <div>
                    <div class="jarviswidget-editbox"></div>
                    <div class="widget-body {*no-padding*}">
                        {if isset($fields) && $fields|@count > 0}
                            <form action="" method="post" class="smart-form" enctype="multipart/form-data" >
                                {assign var='FieldCustomize' value = array()}
                                <fieldset style="padding-top: 0;">
                                    {foreach $fields AS $name=>$field }
                                        {if !$name|in_array:$FieldCustomize}
                                            {inputs name=$name}
                                        {/if}
                                    {/foreach}
                                </fieldset>
                                <footer class="smart-form" >

                                    <button class="btn btn-primary" type="submit" name="submit">
                                        <i class="fa fa-save"></i>
                                        Submit
                                    </button>
                                    <button class="btn btn-default" type="submit" name="cancel">
                                        Cancel
                                    </button>
                                </footer>
                            </form>
                        {/if}
                    </div>
                </div>
            </div>
        </article>
    </div>
</section>