define(["modules/ui/module","bootstrap-progressbar"],function(a){"use strict";return a.registerDirective("smartProgressbar",function(){return{restrict:"A",compile:function(a){a.removeAttr("smart-progressbar data-smart-progressbar"),a.progressbar({display_text:"fill"})}}})});