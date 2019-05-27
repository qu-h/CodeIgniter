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

            {foreach $items as $id=>$childrent}
                {if is_string($childrent)}
                    <option value="{$id}" {if in_array($id,$selected)}selected{/if} >{if is_array($childrent) && array_key_exists('label',$childrent)} {$childrent['label']} {elseif (is_string($childrent))} {$childrent} {/if}</option>
                {elseif is_array($childrent)}

                    {if !array_key_exists('children',$childrent) }
                        {if is_string($childrent) }
                            <optgroup label="{$id}">
                                {select_options items=$childrent selected=$selected}
                            </optgroup>
                        {elseif array_key_exists('label',$childrent)}
                            <option value="{$id}" {if in_array($id,$selected)}selected{/if} class="level-{$level}" >{$childrent['label']}</option>
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

<section class="{if isset($col)}{$col}{/if}">
    <label class="select">
        {if isset($icon)}
            <i class="icon-prepend {$icon}"></i>
        {/if}
        <select name="{$name}[]" multiple class="select2 select-multi-level">
            {if isset($options) && $options|@count > 0 }
                {select_options items=$options selected=$value level=1}
            {/if}
        </select>

    </label>
</section>