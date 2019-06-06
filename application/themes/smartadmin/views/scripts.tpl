
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
<script src="{theme_url}js/bootstrap/bootstrap.4.3.1.min.js"></script>
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

<!-- Voice command : plugin -->
<script src="{theme_url}js/speech/voicecommand.min.js"></script>

<!-- PAGE RELATED PLUGIN(S) -->
<script src="{theme_url}js/plugin/datatables/jquery.dataTables.min.js"></script>
<script src="{theme_url}js/plugin/datatables/dataTables.colVis.min.js"></script>
<script src="{theme_url}js/plugin/datatables/dataTables.tableTools.min.js"></script>
<script src="{theme_url}js/plugin/datatables/dataTables.bootstrap.4.3.1.min.js"></script>
<script src="{theme_url}js/plugin/datatable-responsive/datatables.responsive.min.js"></script>

<!-- PAGE RELATED PLUGIN(S) -->
<script src="{theme_url}js/plugin/jquery-nestable/jquery.nestable.min.js"></script>

{*
<!-- Demo purpose only -->
<script src="{theme_url}js/demo.min.js"></script>
*}

{*<script src="{theme_url}js/ict.js"></script>*}
{*<script src="{theme_url}js/tables.js"></script>*}

<script type="text/javascript" src="{theme_url}js/scripts.js" >
    // DO NOT REMOVE : GLOBAL FUNCTIONS!
    $(document).ready(function() {
        pageSetUp();
    })
</script>