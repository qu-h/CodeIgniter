{function select_options items=[] selected='' level=1}
    {if is_array($items)}
        {if array_key_exists('label',$items)}
            <option value="{$items['id']}" {if in_array($id,$selected)}selected{/if} class="level-{$level}" >{$items['label']}</option>
            {if array_key_exists('children',$items) }
                {foreach $items['children'] as $id=>$childrent2}
                    {select_options items=$childrent2 selected=$selected level=$level+1}
                {/foreach}
            {/if}
        {else}

            {foreach $items as $index=>$childrent}

                {if isset($childrent.id)}
                    {assign var="id" value=$childrent.id}
                {else}
                    {assign var="id" value=$index}
                {/if}

                {if is_string($childrent)}
                    <option value="{$id}" {if in_array($id,$selected)}selected{/if} >{if is_array($childrent) && array_key_exists('label',$childrent)} {$childrent['label']} {elseif (is_string($childrent))} {$childrent} {/if}</option>
                {elseif is_array($childrent)}
                    {if !array_key_exists('children',$childrent) }
                        {if array_key_exists('label',$childrent)}
                            <option value="{$id}" {if in_array($id,$selected)}selected{/if} class="level-{$level}" >{$childrent['label']}</option>
                        {elseif is_string($id) }
                            <optgroup label="{$id}">
                                {select_options items=$childrent selected=$selected}
                            </optgroup>
                        {else}
                            {select_options items=$childrent selected=$selected}
                        {/if}

                    {elseif array_key_exists('label',$childrent) }
                        <option value="{$id}" {if in_array($id,$selected)}selected{/if} class="level-{$level}" >{$childrent['label']}</option>
                        {foreach $childrent['children'] as $id=>$childrent2}
                            {select_options items=$childrent2 selected=$selected level=$level+1}
                        {/foreach}
                    {/if}
                {/if}
            {/foreach}
        {/if}
    {/if}
{/function}

{assign var="class_input" value="" }
{if isset($col)}
    {$class_input=$class_input|cat:$col}
{/if}

{if isset($show_label)}
    {$class_input=$class_input|cat:" row"}
{/if}

{if isset($show_label)}
    <div class="form-group has-success">
        <label class="col-md-2 control-label">{$show_label}</label>
        <div class="col-md-10">
            <div class="input-group">
                {if isset($icon)}
                    <span class="input-group-addon"><i class="{$icon}"></i></span>
                {/if}
                <select name="{$name}" class="select2 {if isset($class)}{$class}{/if}" {if isset($multiple)}multiple{/if}>
                    {if isset($options) && $options|@count > 0 }
                        {select_options items=$options selected=$value level=1}
                    {/if}
                </select>
            </div>
            <span class="help-block">Something may have gone wrong</span>
        </div>
    </div>
{else}
    <section {if $class_input|count_characters > 0 }class="{$class_input|trim}"{/if}>
        <label class="select">
            {if isset($icon)}
                <icon class="icon-prepend {$icon}" ></icon>
            {/if}
            <select name="{$name}" class="select2 {if isset($class)}{$class}{/if}" {if isset($multiple)}multiple{/if}>
                {if isset($options) && $options|@count > 0 }
                    {select_options items=$options selected=$value level=1}
                {/if}
            </select>

        </label>
        {if isset($note) }
            <div class="note note-success">{$note}</div>
        {/if}
    </section>
{/if}
