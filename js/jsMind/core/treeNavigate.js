/**
 * TreeNavigate 
 */
define(function(require, exports, module) {

    var Class     = require('Class');
    var Const     = require('./const');
    var Navigate  = require('./navigate');
    var Util      = require('../helper/util');

    var DirectionEnum = Const.DirectionEnum;

    var TreeNavigate  = Class.create(Navigate, {
        initialize: function(options) {
            TreeNavigate.superclass.initialize.apply(this, arguments);
            this.isRoot = true;
        },
        left : function(selectedNode) {

            var node = undefined;

            if(selectedNode) {
                node = selectedNode.leftSibling;
            }

            return node;
        },
        right : function(selectedNode) {

            var node = undefined;

            if(selectedNode) {
                node = selectedNode.rightSibling;
            }

            return node;
        },
        up : function(selectedNode) {

            var node = undefined;

            if(selectedNode) {
                node = selectedNode.parent;
            }

            return node;

        },
        down : function(selectedNode) {

            var node = undefined;

            if(selectedNode) {
                node = selectedNode.getFirstChild();
            }

            return node;
        }
    });

    return TreeNavigate;
});