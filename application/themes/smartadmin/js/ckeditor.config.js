


let ckEditerConfig = {
    extraPlugins: ['codesnippet','autogrow','sourcedialog'],
    codeSnippet_theme: 'school_book',
    // Simplify the dialog windows.
    //removeDialogTabs : 'image:advanced;link:advanced',
    autoGrow_minHeight : 800,
    autoGrow_bottomSpace : 50,
    autoGrow_onStartup: true,
    removePlugins : 'resize',

    disableAutoInline : true

};

// The toolbar groups arrangement, optimized for two toolbar rows.
ckEditerConfig.toolbarGroups = [
    { name: 'clipboard',   groups: [ 'clipboard', 'undo' ] },
    { name: 'editing',     groups: [ 'find', 'selection', 'spellchecker' ] },
    { name: 'links' },
    { name: 'insert' },
    { name: 'forms' },
    { name: 'tools' },
    { name: 'document',	   groups: [ 'mode', 'document', 'doctools' ] },
    { name: 'others' },
'/',
    { name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
    { name: 'paragraph',   groups: [ 'list', 'indent', 'blocks', 'align', 'bidi' ] },
    { name: 'styles' },
    { name: 'colors' },
//{ name: 'about' }
];


$(document).ready(function() {

    $( '.ict-ckeditor' ).each( function() {
        CKEDITOR.inline( this,ckEditerConfig);
    } );
    console.log('call me',ckEditerConfig);
    // CKEDITOR.editorConfig = function( config ) {
    //     // Define changes to default configuration here.
    //     // For complete reference see:
    //     // http://docs.ckeditor.com/#!/api/CKEDITOR.config
    //
    //     // Remove some buttons provided by the standard plugins, which are
    //     // not needed in the Standard(s) toolbar.
    //     //config.removeButtons = 'Underline,Subscript,Superscript';
    //
    //     // Set the most common block elements.
    //     config.format_tags = 'p;h1;h2;h3;pre';
    // };

});