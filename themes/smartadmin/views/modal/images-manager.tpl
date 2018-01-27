<!-- Modal -->
<div id="images-manager" class="modal fade" role="dialog" img-path="{if isset($img_path)}{$img_path}{/if}" >
    <div class="modal-dialog modal-lg">

        <!-- Modal content-->
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal">&times;</button>
                <h4 class="modal-title">Modal Header</h4>
            </div>
            <div class="modal-body row">

            </div>
            <div class="modal-footer smart-form footer">
                <input type="file" name="imgthumbUpload" accept="image/*" class="hidden">
                <button type="button" class="btn btn-default upload" >{lang txt='Upload File'}</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
            </div>
        </div>

    </div>
</div>