{function name="menu_anchor" showspan=true showURL=true }
    {if isset($menu)}
        {if isset($showURL) && $showURL==false}
            <a href="{site_url}">
        {else}
            <a href="{site_url uri=$menu->uri isNull=true }">
        {/if}

            {if $menu->icon|count_characters > 0}
                <i class="fa fa-lg fa-fw {$menu->icon}">
                    {if isset($menu->notify)}
                        <em class="bg-color-pink flash animated">{$menu->notify->total}</em>
                    {/if}
                </i>
            {/if}
            <span class="menu-item-parent">{$menu->name}</span>
        </a>
    {/if}
{/function}

{function name=is_active uri=""}
    {assign var=uriLenght value=$uri|count_characters}
    {if $uriLenght > 0 && $uri_string|truncate:$uriLenght:false == $uri }active {/if}
{/function}
{if isset($items) && $items|count > 0 }
    {strip}
    <ul>
        {foreach $items AS $k=>$m1}
            <li class="{is_active uri=$m1->uri }"  >
                {if isset($m1->childrens) && $m1->childrens|count > 0}
                    {if ($m1->hidden == 1 && $m1->uri|uri_begin_with_uri_first) || $m1->hidden == 0}
                        {menu_anchor menu=$m1 showURL=false}
                        <ul>
                        {foreach $m1->childrens AS $m2}
                            <li class="{is_active uri=$m2->uri }" >
                                {menu_anchor menu=$m2}
                            </li>
                        {/foreach}
                        </ul>
                    {/if}
                {else}
                    {menu_anchor menu=$m1 }
                {/if}
            </li>
        {/foreach}
    </ul>
    {/strip}
{/if}