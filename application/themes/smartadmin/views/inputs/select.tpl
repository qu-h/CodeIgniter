<section class="{if isset($col)}{$col}{/if}">
    <label class="select {$state}">
        {if isset($icon)}
            <i class="icon-prepend {$icon}"></i>
        {/if}

        <select name="{$name}" class="valid">
            <option value="0" > -- No Value --</option>
            {if isset($options) && $options|@count > 0 }
                {foreach $options AS $k=>$title}
                    <option value="{$k}">{$title}</option>
                {/foreach}
            {/if}
        </select>
        <i class="icon"></i>
    </label>
</section>