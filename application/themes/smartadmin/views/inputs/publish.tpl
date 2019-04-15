<section class="{if isset($col)}{$col}{/if}">
    <label class="toggle w80">
        <i data-swchon-text="'.lang("Publish").'" data-swchoff-text="'.lang("Unpublish").'"></i>
        <input '._stringify_attributes($inputAttributes).'>
        '.$input.lang($inputAttributes['placeholder']).'</label>
    <input type="hidden" name="{$name}" value="{$value}" />
</section>