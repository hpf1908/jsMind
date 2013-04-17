/**
 * util 
 */
define(function(require, exports, module) {

    var $  = require('jQuery');

    var increment = 0;

    return {
        extend : $.extend ,
        uuid : function() {
            increment++;
            return 'uuid_' + new Date().getTime() + increment;
        },
        focusDocument : function(){
            $(window).focus();
            $(document).focus();
        },
        focusEnd : function(obj){
            obj.focus();
            var len = obj.value.length;
            if (document.selection) {
                var sel = obj.createTextRange();
                sel.moveStart('character',len);
                sel.collapse();
                sel.select();
            } else if (typeof obj.selectionStart == 'number' && typeof obj.selectionEnd == 'number') {
                obj.selectionStart = obj.selectionEnd = len;
            }
        }
    };
    
});