<style type="text/css">
    /* Apply these styles only when #preview-pane has
     been placed within the Jcrop widget */


    /* The Javascript code will set the aspect ratio of the crop
     area based on the size of the thumbnail preview,
     specified here */


    .optdual {
        position: relative;
    }
    .optdual .offset {
        position: absolute;
        left: 18em;
    }
    .optlist label {
        width: 16em;
        display: block;
    }
    #dl_links {
        margin-top: .5em;
    }

</style>
<section id="widget-grid" class="">

    <!-- row -->
    <div class="row">

        <!-- NEW WIDGET START -->
        <article class="col-xs-12 col-sm-12 col-md-12 col-lg-12">

            <div class="alert alert-danger hidden-lg hidden-md hidden-sm">
                <b>Please note:</b>
                This plugin is non-responsive
            </div>

            <!-- Widget ID (each widget will need unique ID)-->

            <div class="jarviswidget jarviswidget-sortable"
                 id="wid-id-0"
                 data-widget-togglebutton="false"
                 data-widget-editbutton="false"
                 data-widget-fullscreenbutton="false"
                 data-widget-colorbutton="false"
                 data-widget-deletebutton="false" role="widget" style=""
            >

                <header role="heading">
                    <span class="widget-icon"> <i class="fa fa-file-image-o txt-color-darken"></i> </span>
                    <h2 class="hidden-xs hidden-sm">jcrop </h2>
                </header>
                <div role="content">
                    <!-- widget edit box -->

                    <div class="widget-body">
                       <div class="row">
                            <div class="col-md-8">
                                <img src="{$img}" id="img-crop" alt="[Jcrop Example]" class="{*img-responsive*}" />
                            </div>
                            <div class=" col-md-4" >
                                <div id="preview-jcrop" class="img-thumbnail">
                                    <div class="preview-container ">
                                        <img src="{$img}" class="jcrop-preview " id="target-3a" alt="Preview" />
                                    </div>
                                </div>
                                <form class="form-horizontal" style="margin-top: 15px;">
                                    <fieldset>
                                        {form_group name='x1' col=8}
                                        {form_group name='y1' col=8}
                                        {form_group name='x2' col=8}
                                        {form_group name='y2' col=8}
                                        {form_group name='w' col=8}
                                        {form_group name='h' col=8}
                                    </fieldset>
                                </form>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </article>
    </div>
</section>

<script src="{theme_url}js/plugin/jcrop/jquery.Jcrop.min.js"></script>
<script src="{theme_url}js/plugin/jcrop/jquery.color.min.js"></script>

<script type="text/javascript">
    $(document).ready(function() {
        styling_handler();
    });

    var styling_handler = function () {
        var jcrop_api, bounds, boundx, boundy;
        $preview = $('#preview-pane'),
            $pcnt = $('#preview-jcrop .preview-container'),
            $pimg = $('#preview-jcrop .preview-container img'),
            xsize = $pcnt.width(),
            ysize = $pcnt.height();
        $pcnt.css({
            height:$pcnt.width(),
            overflow: 'hidden'
        });

        function showPreview(coords)
        {

            if (parseInt(coords.w) > 0) {
                if( typeof boundx ==='undefined' || typeof boundy ==='undefined' ){
                    // Use the API to get the real image size
                    bounds = api.getBounds();
                    boundx = bounds[0];
                    boundy = bounds[1];
                }
                var rx = $pcnt.width() / coords.w;
                var ry = $pcnt.height() / coords.h;
                var imgStyle = {
                    width : Math.round(rx * boundx) + 'px',
                    height : Math.round(ry * boundy) + 'px',
                    marginLeft : '-' + Math.round(rx * coords.x) + 'px',
                    marginTop : '-' + Math.round(ry * coords.y) + 'px'
                };
                console.log("test",
                        {
                            'ysize':$pcnt.height(),
                            'xsize':$pcnt.width(),
                            'coords':coords,
                            '$pcnt':$pcnt,
                            'bounds':bounds
                        });
                console.log("imgStyle",imgStyle);
                $pimg.css(imgStyle);
            }
        }

        function showCoords(c) {
            $('input[name=x1]').val(c.x);
            $('input[name=y1]').val(c.y);
            $('input[name=x2]').val(c.x2);
            $('input[name=y2]').val(c.y2);
            $('input[name=w]').val(c.w);
            $('input[name=h]').val(c.h);
        };

        var api;

        $('#img-crop').Jcrop({
            // start off with jcrop-light class
            //bgOpacity : 0.5,
            //bgColor : 'white',
            addClass : 'jcrop-light',
            bgColor : $.Jcrop.defaults.bgColor,
            bgOpacity : $.Jcrop.defaults.bgOpacity,
            minSize : [80, 80],
            allowSelect: false,
            //maxSize : [350, 350],
            onChange: function (c) {
                showPreview(c);
                showCoords(c);
            },
            onSelect: function (c) {
                showPreview(c);
                showCoords(c);
            },
            aspectRatio: 1
        }, function() {
            api = this;
            api.setSelect([0, 0, 350,350]);
            api.setOptions({
                bgFade : true
            });
            api.ui.selection.addClass('jcrop-selection');

            var bounds = this.getBounds();
            boundx = bounds[0];
            boundy = bounds[1];
            // Store the API in the jcrop_api variable
            jcrop_api = this;

            // Move the preview into the jcrop container for css positioning
            $preview.appendTo(jcrop_api.ui.holder);
        });
    };
</script>