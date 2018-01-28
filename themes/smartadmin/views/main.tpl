<!DOCTYPE html>
<html lang="en-us">
<head>
    <meta charset="utf-8">
    <title>{config item="site_name" }</title>
    <meta name="description" content="">
    <meta name="author" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

    <link rel="icon" type="image/png" href="">

    {assets type='css'}
    {*assets type='js'*}

    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
</head>
<body>
<header id="header">
    <div id="logo-group">
        <!-- PLACE YOUR LOGO HERE -->
        <span id="logo"> {img file="images/logo.png" alt="" }</span>
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

        <!-- logout button -->
        <div id="logout" class="btn-header transparent pull-right">
            <span>
                <a href="login.html" title="Sign Out" data-action="userLogout" data-logout-msg="You can improve your security further after logging out by closing this opened browser"><i class="fa fa-sign-out"></i></a>
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
        {menu_navigation}
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

    <!-- MAIN CONTENT -->
    <div id="content">
        {if isset($page_header)}
            {$page_header}
        {/if}

        {notification}
        {$_body}
    </div>
</div>
{include file="modal/images-manager.tpl"}


<!-- PACE LOADER - turn this on if you want ajax loading to show (caution: uses lots of memory on iDevices)-->
<script data-pace-options='{ "restartOnRequestAfter": true }' src="{theme_url}js/plugin/pace/pace.min.js"></script>

<!-- Link to Google CDN's jQuery + jQueryUI; fall back to local -->
<script src="http://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<script>
    if (!window.jQuery) {
        document.write('<script src="{theme_url}js/libs/jquery-2.1.1.min.js"><\/script>');
    }
</script>

<script src="http://ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
<script>
    if (!window.jQuery.ui) {
        document.write('<script src="{theme_url}js/libs/jquery-ui-1.10.3.min.js"><\/script>');
    }
</script>
<!-- IMPORTANT: APP CONFIG -->
<script src="{theme_url}js/app.config.js"></script>
<!-- JS TOUCH : include this plugin for mobile drag / drop touch events-->
<script src="{theme_url}js/plugin/jquery-touch/jquery.ui.touch-punch.min.js"></script>
<!-- BOOTSTRAP JS -->
<script src="{theme_url}js/bootstrap/bootstrap.min.js"></script>
<!-- CUSTOM NOTIFICATION -->
<script src="{theme_url}js/notification/SmartNotification.min.js"></script>
<!-- JARVIS WIDGETS -->
<script src="{theme_url}js/smartwidgets/jarvis.widget.min.js"></script>
<!-- EASY PIE CHARTS -->
<script src="{theme_url}js/plugin/easy-pie-chart/jquery.easy-pie-chart.min.js"></script>
<!-- SPARKLINES -->
<script src="{theme_url}js/plugin/sparkline/jquery.sparkline.min.js"></script>
<!-- JQUERY VALIDATE -->
<script src="{theme_url}js/plugin/jquery-validate/jquery.validate.min.js"></script>
<!-- JQUERY MASKED INPUT -->
<script src="{theme_url}js/plugin/masked-input/jquery.maskedinput.min.js"></script>
<!-- JQUERY SELECT2 INPUT -->
<script src="{theme_url}js/plugin/select2/select2.min.js"></script>
<!-- JQUERY UI + Bootstrap Slider -->
<script src="{theme_url}js/plugin/bootstrap-slider/bootstrap-slider.min.js"></script>
<!-- browser msie issue fix -->
<script src="{theme_url}js/plugin/msie-fix/jquery.mb.browser.min.js"></script>
<!-- FastClick: For mobile devices -->
<script src="{theme_url}js/plugin/fastclick/fastclick.min.js"></script>

<!--[if IE 8]>
<h1>Your browser is out of date, please update your browser by going to www.microsoft.com/download</h1>
<![endif]-->

<!-- Demo purpose only -->
<script src="{theme_url}js/demo.min.js"></script>
<!-- MAIN APP JS FILE -->
<script src="{theme_url}js/app.min.js"></script>
<!-- ENHANCEMENT PLUGINS : NOT A REQUIREMENT -->
<!-- Voice command : plugin -->
<script src="{theme_url}js/speech/voicecommand.min.js"></script>
<!-- SmartChat UI : plugin -->
<script src="{theme_url}js/smart-chat-ui/smart.chat.ui.min.js"></script>
<script src="{theme_url}js/smart-chat-ui/smart.chat.manager.min.js"></script>

<!-- PAGE RELATED PLUGIN(S) -->

<!-- Flot Chart Plugin: Flot Engine, Flot Resizer, Flot Tooltip -->
<script src="{theme_url}js/plugin/flot/jquery.flot.cust.min.js"></script>
<script src="{theme_url}js/plugin/flot/jquery.flot.resize.min.js"></script>
<script src="{theme_url}js/plugin/flot/jquery.flot.time.min.js"></script>
<script src="{theme_url}js/plugin/flot/jquery.flot.tooltip.min.js"></script>
<!-- Vector Maps Plugin: Vectormap engine, Vectormap language -->
<script src="{theme_url}js/plugin/vectormap/jquery-jvectormap-1.2.2.min.js"></script>
<script src="{theme_url}js/plugin/vectormap/jquery-jvectormap-world-mill-en.js"></script>
<!-- Full Calendar -->
<script src="{theme_url}js/plugin/moment/moment.min.js"></script>
<script src="{theme_url}js/plugin/fullcalendar/jquery.fullcalendar.min.js"></script>

<script type="text/javascript">
    // DO NOT REMOVE : GLOBAL FUNCTIONS!
    $(document).ready(function() {
        pageSetUp();
    })
</script>

</body>
</html>