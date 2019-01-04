<!DOCTYPE html>
<html lang="en-us">
<head>
    {include file=$tplPath|cat:"common/head.tpl"}
</head>
<body>
<header id="header">
    <div id="logo-group">
        <!-- PLACE YOUR LOGO HERE -->
        <span id="logo"> {theme_img file="logo.png" alt="" return='url'}</span>
        <!-- END LOGO PLACEHOLDER -->

        {*
        Note: The activity badge color changes when clicked and resets the number to 0
        Suggestion: You may want to set a flag when this happens to tick off all checked messages / notifications
        *}
        {if isset($header.activities)}
            {include file="block/activity-dropdown.tpl"}
        {/if}
        <!-- END AJAX-DROPDOWN -->
    </div>

    {if isset($header.project)}
        {include file="block/project-dropdown.tpl"}
    {/if}

    <!-- pulled right: nav area -->
    <div class="pull-right">

        <!-- collapse menu button -->
        <div id="hide-menu" class="btn-header pull-right">
            <span>
                <a href="javascript:void(0);" data-action="toggleMenu" title="Collapse Menu">
                    <i class="fa fa-reorder"></i>
                </a>
            </span>
        </div>
        <!-- end collapse menu -->

        <!-- #MOBILE -->
        <!-- Top menu profile link : this shows only when top menu is active -->
        {if isset($user)}
        <ul id="mobile-profile-img" class="header-dropdown-list hidden-xs padding-5">
            <li class="">
                <a href="#" class="dropdown-toggle no-margin userdropdown" data-toggle="dropdown">
                    {img src=$user.avatar alt="{$user.fullname}" class="online"}
                </a>
                <ul class="dropdown-menu pull-right">
                    <li>
                        <a href="javascript:void(0);" class="padding-10 padding-top-0 padding-bottom-0"><i class="fa fa-cog"></i> Setting</a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="profile.html" class="padding-10 padding-top-0 padding-bottom-0"> <i class="fa fa-user"></i> <u>P</u>rofile</a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="javascript:void(0);" class="padding-10 padding-top-0 padding-bottom-0" data-action="toggleShortcut"><i class="fa fa-arrow-down"></i> <u>S</u>hortcut</a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="javascript:void(0);" class="padding-10 padding-top-0 padding-bottom-0" data-action="launchFullscreen"><i class="fa fa-arrows-alt"></i> Full <u>S</u>creen</a>
                    </li>
                    <li class="divider"></li>
                    <li>
                        <a href="login.html" class="padding-10 padding-top-5 padding-bottom-5" data-action="userLogout"><i class="fa fa-sign-out fa-lg"></i> <strong><u>L</u>ogout</strong></a>
                    </li>
                </ul>
            </li>
        </ul>
        {/if}
        <!-- logout button -->
        <div id="logout" class="btn-header transparent pull-right">
            <span>
                <a href="{if isset($SignOutLink)}{$SignOutLink}{else}/logout{/if}" title="{lang txt="Sign Out"}" data-action="userLogout" data-logout-msg="{lang txt="You can improve your security further after logging out by closing this opened browser"}">
                    <i class="fa fa-sign-out"></i>
                </a>
            </span>
        </div>
        <!-- end logout button -->

        <!-- search mobile button (this is hidden till mobile view port) -->
        <div id="search-mobile" class="btn-header transparent pull-right">
            <span><a href="javascript:void(0)" title="Search"><i class="fa fa-search"></i></a></span>
        </div>
        <!-- end search mobile button -->

        <!-- input: search field -->
        <form action="" class="header-search pull-right">
            <input id="search-fld"  type="text" name="param" placeholder="{lang txt="Find reports and more"}" data-autocomplete='[]'>
            <button type="submit">
                <i class="fa fa-search"></i>
            </button>
            <a href="javascript:void(0);" id="cancel-search-js" title="Cancel Search"><i class="fa fa-times"></i></a>
        </form>
        <!-- end input: search field -->

        <!-- fullscreen button -->
        <div id="fullscreen" class="btn-header transparent pull-right">
            <span> <a href="javascript:void(0);" data-action="launchFullscreen" title="Full Screen"><i class="fa fa-arrows-alt"></i></a> </span>
        </div>
        <!-- end fullscreen button -->


        {*
        #Voice Command: Start Speech
        include file="block/voices-command.tpl"
        *}

    </div>
    <!-- end pulled right: nav area -->

</header>

<aside id="left-panel">

    <!-- User info -->
    {if isset($user)}
    <div class="login-info">
        <span>
            <!-- User image size is adjusted inside CSS, it should stay as it -->
            <a href="javascript:void(0);" id="show-shortcut" data-action="toggleShortcut">
               {img file=$user.avatar alt="{$user.fullname}" class="online"}
                <span>{$user.username}</span>
                <i class="fa fa-angle-down"></i>
            </a>

        </span>
    </div>
    {/if}
    <!-- end user info -->

    <!-- NAVIGATION : This navigation is also responsive-->
    <nav>
        {*menu_navigation*}
        {moduleRun m="SystemMenu/navigation"}
    </nav>
    <span class="minifyme" data-action="minifyMenu">
        <i class="fa fa-arrow-circle-left hit"></i>
    </span>

</aside>

<div id="main" role="main">
    <!-- RIBBON -->
    <div id="ribbon">
        <span class="ribbon-button-alignment">
            <span id="refresh" class="btn btn-ribbon" data-action="resetWidgets" data-title="refresh"  rel="tooltip" data-placement="bottom" data-original-title="<i class='text-warning fa fa-warning'></i> {lang txt="Warning! This will reset all your widget settings."}" data-html="true">
                <i class="fa fa-refresh"></i>
            </span>
        </span>

        <!-- breadcrumb -->

        {if isset($site_structure)}
            <ol class="breadcrumb">
                {foreach $site_structure AS $bc}
                    <li>
                        {button_anchor txt=$bc.title uri=$bc.uri}
                    </li>
                {/foreach}

                {if isset($uri_add)}
                    <li>
                        {button_anchor icon=plus txt="Add New" uri=$uri_add is_btn=true }
                    </li>
                {/if}

                {if isset($breadcrumbButtons)} {foreach $breadcrumbButtons AS $btn}
                    <li>
                        {button_anchor btn-template=$btn }
                    </li>
                {/foreach} {/if}
            </ol>
        {/if}
        <!-- end breadcrumb -->

        <!-- You can also add more buttons to the
        ribbon for further usability

        Example below:

        <span class="ribbon-button-alignment pull-right">
        <span id="search" class="btn btn-ribbon hidden-xs" data-title="search"><i class="fa-grid"></i> Change Grid</span>
        <span id="add" class="btn btn-ribbon hidden-xs" data-title="add"><i class="fa-plus"></i> Add</span>
        <span id="search" class="btn btn-ribbon" data-title="search"><i class="fa-search"></i> <span class="hidden-mobile">Search</span></span>
        </span>
-->
    </div>
    <!-- END RIBBON -->
    {*include file="../scripts.tpl"*}
    {assets type='js'}
    <!-- MAIN CONTENT -->
    <div id="content">
        {if isset($page_header)}
            {$page_header}
        {/if}

        {notification}
        {$_body}
    </div>
</div>
{include file="../modal/images-manager.tpl"}
<script type="text/javascript">

    // DO NOT REMOVE : GLOBAL FUNCTIONS!

    $(document).ready(function() {
        pageSetUp();
    });
</script>

    </body>
</html>