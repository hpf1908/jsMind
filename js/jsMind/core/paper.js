/**
 * shape 
 */
define(function(require, exports, module) {

    var Class    = require('Class');
    var Util     = require('../helper/util');

    var Paper = Class.create({
        initialize: function(rootNode, options) {

            this.opts = Util.extend({
                rPaper : null
            });
        },
        refresh : function() {
            
        }
    });

    return Paper;
});