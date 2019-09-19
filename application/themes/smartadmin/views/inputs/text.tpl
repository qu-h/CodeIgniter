
{assign var="class_input" value="" }
{if isset($col)}
    {$class_input=$class_input|cat:$col}
{/if}

{if isset($show_label)}
    {$class_input=$class_input|cat:" row"}
{/if}

{if isset($label_title)}
    <div class="form-group has-success {if $class_input|count_characters > 0 }{$class_input|trim}{/if}" >
        <label class="col-gl-2 col-md-3 col-sm-4 control-label">{$label_title}</label>
        <div class="col-md-9 col-sm-8">
            <label class="input">
                {if isset($icon)}
                    <icon class="icon-prepend {$icon}" ></icon>
                {/if}
                <input {_stringify_attributes($attr)}>

            </label>
            {if isset($note) }
                <span class="help-block">{$note}</span>
            {/if}

        </div>
    </div>
{else}
    <section {if $class_input|count_characters > 0 }class="{$class_input|trim}"{/if} >
        <label class="input">
            {if isset($icon)}
                <icon class="icon-prepend {$icon}" ></icon>
            {/if}
            <input {_stringify_attributes($attr)}>

        </label>
        {if isset($note) }
            <div class="note note-success">{$note}</div>
        {/if}
    </section>
{/if}