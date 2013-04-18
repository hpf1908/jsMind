/**
 * 记录用户的操作
 */
define(function(require, exports, module) {

    var Class    = require('Class');
    var Util     = require('../helper/util');

    var Actions = Class.create({
        initialize : function() {
            this.current = 0;
            this.actions = [];
        },
        undo : function() {

        },
        redo : function() {

        },
        doNext : function() {

        }   
    });

    return Actions;
});