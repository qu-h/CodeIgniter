<section id="widget-grid" class="">
    <div class="row">
        <article class="col-sm-12 col-md-12 col-lg-12">
            <div class="jarviswidget" id="wid-id-0" data-widget-colorbutton="false" data-widget-editbutton="false" data-widget-custombutton="false">
                {if isset($fields.id.value) && $fields.id.value > 0}
                    <header>
                        <span class="widget-icon"><i class="fa fa-edit"></i></span>
                        <h2>{$formTitle}</i></h2>
                    </header>
                {else}
                    <header>
                        <span class="widget-icon"><i class="fa fa-edit"></i></span>
                        <h2>{$formTitle}</h2>
                    </header>
                {/if}

                <div>
                    <div class="jarviswidget-editbox"></div>
                    <div class="widget-body">
                        {if isset($fields) && $fields|@count > 0}
                            <form action="" method="post" class="smart-form" enctype="multipart/form-data" >
                                {assign var='FieldCustomize' value = array("image")}
                                <fieldset>
                                    <div class="row">
                                        <div class="col-md-5">
                                            <div class="br-dashed br-grey" >
                                                {if $fields.image.value|count_characters > 0 }
                                                    {img file=$fields.image.value class="img-responsive media-imgthumb center-block" dir="images/gallery"}
                                                {else}
                                                    {img file="images/svg/500x200.svg" class="img-responsive media-imgthumb center-block"}
                                                {/if}
                                                {input_hidden name="image"}
                                            </div>
                                            <p style="margin-top: 15px;">
                                                <button name="submit" value="crop" class="btn btn-labeled btn-danger" name="submit" value="trash">
                                                    <span class="btn-label"><i class="fa fa-crop"></i></span>
                                                    {lang text="Crop Image"}
                                                </button>
                                            </p>
                                        </div>
                                        <div class="col-md-7">
                                            {foreach $fields AS $name=>$field }
                                                {if !$name|in_array:$FieldCustomize}
                                                    {inputs name=$name field=$field}
                                                {/if}

                                            {/foreach}
                                        </div>
                                    </div>
                                </fieldset>

                                <footer class="smart-form" >
                                    {if isset($fields.id.value) && $fields.id.value > 0}
                                    <button type="submit" class="btn btn-labeled btn-success"  name="submit" value="save">
                                         <span class="btn-label">
                                          <i class="fa fa-save"></i>
                                         </span> {lang txt="Save"}
                                    </button>
                                    {/if}

                                    <button class="btn btn-primary btn-labeled" name="submit" value="submit" >
                                    <span class="btn-label">
                                        <i class="fa fa-retweet"></i>
                                    </span>
                                        {lang txt="Submit Form"}
                                    </button>

                                    <button class="btn btn-labeled btn-danger" name="submit" value="trash">
                                        <span class="btn-label"><i class="glyphicon glyphicon-trash"></i></span>
                                        {lang text="Trash"}
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