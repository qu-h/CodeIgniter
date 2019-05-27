<section class="{if isset($col)}{$col}{/if}">
    <label class="toggle input-public">
        <span class="label-input">{$label}</span>
        <input type="checkbox" name={$name}  value={if isset($value)}{$value}{else}''{/if}  placeholder={if isset($placeholder)}{$placeholder}{else}''{/if} {if isset($checked)}checked="checked"{/if} />
        <i data-swchon-text="{lang txt="Publish"}" data-swchoff-text="{lang txt="Unpublish"}"></i>
    </label>
    <input type="hidden" name="{$name}" value="{$value}" />
</section>