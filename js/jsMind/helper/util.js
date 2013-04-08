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
        }
    };
    
});