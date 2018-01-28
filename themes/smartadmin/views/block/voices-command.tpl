<div id="speech-btn" class="btn-header transparent pull-right hidden-sm hidden-xs">
    <div>
        <a href="javascript:void(0)" title="Voice Command" data-action="voiceCommand"><i class="fa fa-microphone"></i></a>
        <div class="popover bottom"><div class="arrow"></div>
            <div class="popover-content">
                <h4 class="vc-title">Voice command activated <br><small>Please speak clearly into the mic</small></h4>
                <h4 class="vc-title-error text-center">
                    <i class="fa fa-microphone-slash"></i> Voice command failed
                    <br><small class="txt-color-red">Must <strong>"Allow"</strong> Microphone</small>
                    <br><small class="txt-color-red">Must have <strong>Internet Connection</strong></small>
                </h4>
                <a href="javascript:void(0);" class="btn btn-success" onclick="commands.help()">See Commands</a>
                <a href="javascript:void(0);" class="btn bg-color-purple txt-color-white" onclick="$('#speech-btn .popover').fadeOut(50);">Close Popup</a>
            </div>
        </div>
    </div>
</div>