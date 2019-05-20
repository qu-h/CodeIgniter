<section class="{if isset($col)}{$col}{/if}">
    <label class="toggle w80" style="min-height: 25px;">
        <i data-swchon-text="{lang txt="Publish"}" data-swchoff-text="{lang txt="Unpublish"}"></i>

        <input type="checkbox" name={$name}  value={if isset($value)}{$value}{else}''{/if}  placeholder={if isset($placeholder)}{$placeholder}{else}''{/if} {if isset($checked)}checked{/if} />
        <?=lang($inputAttributes['placeholder']?>
    </label>
    <input type="hidden" name="{$name}" value="{$value}" />
</section>