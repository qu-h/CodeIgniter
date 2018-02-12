{function name="checkbox" }
    <div class="pull-right">
        <div class="checkbox no-margin">
            <label>
                <input type="checkbox" class="checkbox style-0" checked="checked">
                <span class="font-xs">Checkbox 1</span>
            </label>
        </div>
    </div>
{/function}

{function name="status" value=0 id="" }
<span class="pull-right">
    <span class="onoffswitch">
        <input id="st{$id}" name="status_{$id}" type="checkbox" class="onoffswitch-checkbox status-switch" {if $value ==1}checked{/if}>
        <label class="onoffswitch-label" for="st{$id}">
            <span class="onoffswitch-inner" data-swchon-text="{lang txt="visitable"}" data-swchoff-text="{lang txt="invisible"}"></span>
            <span class="onoffswitch-switch"></span>
        </label>
    </span>
</span>
{/function}


{function name="showTree" categories=[] }
    {assign var=no value=0}
    <ol class="dd-list">
        {foreach $categories AS $cate}
            {$no = $no + 1}
            <li class="dd-item dd3-item" data-id="{$cate.id}">
                <div class="dd-handle dd3-handle">{$no}</div>
                <div class="dd-content">
                    {$cate.name}
                    {*checkbox*}
                    {*status value = $cate.status id=$cate.id*}
                    <span class="pull-right">

                        <span class="btn btn-default btn-xs disabled {if $cate.status==1}txt-color-red{/if} ">
                            <i class="fa {if $cate.status==0}fa-eye-slash{else}fa-eye{/if}"></i>
                        </span>
                        <a class="btn btn-primary btn-xs" href="{site_url id=$cate.id change="edit" }">
                            <i class="fa fa-pencil"></i>
                        </a>

                    </span>
                </div>
                {if isset($cate.children) && $cate.children|count > 0}
                    {showTree categories=$cate.children}
                {/if}
            </li>
        {/foreach}
    </ol>
{/function}

<div class="widget-body">
    <div class="dd" id="nestable3">
        {if $categories|count > 0}
            {showTree categories=$categories}
        {/if}

    </div>
</div>
{*
<div class="row">
    <div class="col-sm-12">
        <div class="well well-sm well-light">
            <p class="alert alert-info">
                Preview of the lists update DB input.
            </p>
            <textarea id="nestable-output" rows="3" class="form-control font-md"></textarea>
        </div>
    </div>
</div>
*}
<script type="text/javascript">
    var updateOutput = function(e) {
        var list = e.length ? e : $(e.target), output = list.data('output');
        if (window.JSON) {
            output.val(window.JSON.stringify(list.nestable('serialize')));
            //, null, 2));
        } else {
            output.val('JSON browser support required for this demo.');
        }

    };

    $(document).ready(function() {
        $('#nestable3').nestable().on('change', function (e) {
            var list = e.length ? e : $(e.target)
            $.ajax({
                method: "POST",
                url: window.location.href.replace(".html",'.json'),
                data : {
                    'update-order':true, 'data':list.nestable("serialize")
                }
            });
        });
        //updateOutput($('#nestable3').data('output', $('#nestable-output')));
    });
</script>


