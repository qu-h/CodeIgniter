<section>

    <div class="input-group input-crawler">
        <label class="input clearfix">
            {if isset($icon)}
                <i class="icon-prepend {$icon}"></i>
            {/if}
            <input class="form-control" type="text"  name="{$name}" value="{$value}" placeholder="{$placeholder}" >
        </label>
        <div class="input-group-btn">
            <a class="btn btn-default data-crawler" href="javascript:void(0)">Crawler</a>
            <button class="btn btn-default data-paste" type="button">
                Paste
            </button>
        </div>
    </div>
</section>