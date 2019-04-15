<section class="{if isset($col)}{$col}{/if}">
    <a href="{$value}" target="_blank"
       data-type="text"
       data-pk="1"
       data-original-title="Enter username"
       class="editable editable-click {if isset($required) && $required==true}editable-empty{/if}"
       {if isset($required) && $required==true}data-placement="right" data-placeholder="Required" {/if}

    >
        {if isset($icon)}
            <i class="{$icon}"></i>&nbsp;&nbsp;
        {/if}
        {$value}
    </a>
    <input type="hidden" name="{$name}" value="{$value}" />
</section>