<section>
    <label class="input">
        {if isset($icon)}
            <i class="icon-prepend {$icon}"></i>
        {/if}

        <input type="text" name="{$name}" value="{$value}" placeholder="{$placeholder}">

        <i class="icon-append fa fa-globe submit"></i>
    </label>
</section>