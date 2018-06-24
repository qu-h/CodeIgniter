<section>
    <label class="input input-crawler">
        {if isset($icon)}
            <i class="icon-prepend {$icon}"></i>
        {/if}

        <a class="icon-append fa fa-globe submit" href="javascript:void(0)"></a>
        <input type="text" name="{$name}" value="{$value}" placeholder="{$placeholder}">

    </label>
</section>