{notification}

<section id="widget-grid" class="">
    <div class="row">
        <article class="col-sm-12 col-md-12 col-lg-12">
            <div class="jarviswidget" id="wid-id-0" data-widget-colorbutton="false" data-widget-editbutton="false" data-widget-custombutton="false">
                {if isset($fields.id.value) && $fields.id.value > 0}
                    <header>
                        <span class="widget-icon"><i class="fa fa-edit"></i></span>
                        <h2>{$formTitle} : <i>{$fields.name.value}</i></h2>
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
                                {assign var='FieldCustomize' value = array('name',"image","position","linkedin","facebook","twitter","youtube")}
                                <fieldset>
                                    <div class="row">
                                        <div class="col-md-3">
                                            <div class="br-dashed br-grey" >
                                                {if $fields.image.value|count_characters > 0 }
                                                    {img file=$fields.image.value class="img-responsive upload-imgthumb center-block" dir="images/"|cat:$img_path}
                                                {else}
                                                    {img file="images/svg/400x400.svg" class="img-responsive upload-imgthumb center-block"}
                                                {/if}

                                                <input type="file" name="imageUpload" accept="image/*" class="hidden">
                                                {input_hidden name="image" value=$fields.image.value  }
                                            </div>
                                        </div>
                                        <div class="col-md-9">
                                            {foreach $fields AS $name=>$field }
                                                {if $name|in_array:$FieldCustomize && $name != 'image'}
                                                    {inputs name=$name}
                                                {/if}
                                            {/foreach}
                                        </div>
                                    </div>
                                </fieldset>
                                <fieldset style="padding-top: 0;">

                                    {foreach $fields AS $name=>$field }
                                        {if !$name|in_array:$FieldCustomize}
                                            {inputs name=$name field=$field}
                                        {/if}
                                    {/foreach}

                                </fieldset>
                                <footer class="smart-form" >
                                    <button class="btn btn-primary" type="submit"> Submit Form </button>
                                </footer>
                            </form>
                        {/if}
                    </div>
                </div>
            </div>
        </article>
    </div>
</section>