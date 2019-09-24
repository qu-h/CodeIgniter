
{if isset($label_title)}
    <div class="form-group has-success">
        <label class="col-md-3 control-label">{$label_title}</label>
        <div class="col-md-9">
            <label class="toggle input-public">
                <input type="checkbox" data-name={$name}  value="{if isset($value)}{$value}{/if}"  placeholder="{if isset($placeholder)}{$placeholder}{/if}" {if isset($checked)}checked="checked"{/if} />
                <i data-swchon-text="{lang txt="Yes"}" data-swchoff-text="{lang txt="No"}" class="f-left"></i>
            </label>
            <span class="help-block">Something may have gone wrong</span>
        </div>
    </div>
{else}
    <section class="{if isset($col)}{$col}{/if}">
        <label class="toggle input-public">
            <span class="label-input">{$label}</span>
            <input type="checkbox" data-name={$name}  value="{if isset($value)}{$value}{/if}"  placeholder="{if isset($placeholder)}{$placeholder}{/if}" {if isset($checked)}checked="checked"{/if} />
            <i data-swchon-text="{lang txt="Publish"}" data-swchoff-text="{lang txt="Unpublish"}"></i>
        </label>
    </section>
{/if}
<input type="hidden" name={$name}  value="{if isset($value)}{$value}{/if}"  />
