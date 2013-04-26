/**
 * Navigate 
 */
define(function(require, exports, module) {

    var Class     = require('Class');
    var Const     = require('./const');
    var Util      = require('../helper/util');

    var DirectionEnum = Const.DirectionEnum;

    var Navigate  = Class.create({
        initialize: function(options) {

            this.opts = Util.extend({
                mindRoot : null
            },options);

            this.mindRoot = this.opts.mindRoot;
        },
        left : function(selectedNode) {

            var node = undefined;

            if(selectedNode) {
                if(selectedNode.isRoot) {
                    var firstLeftChild = this.mindRoot.getFirstLeftChild();
                    node = firstLeftChild;
                } else {
                    var mindNode = selectedNode;
                    if(mindNode.direction != DirectionEnum.right) {
                        if(mindNode.getChilds().length > 0) {
                            node = mindNode.getFirstChild();
                        }
                    } else {
                        node = mindNode.parent;
                    } 
                }
            }

            return node;
        },
        right : function(selectedNode) {

            var node = undefined;

            if(selectedNode) {
                if(selectedNode.isRoot) {
                    var firstRightChild = this.mindRoot.getFirstRightChild();
                    node = firstRightChild;
                } else {
                    var mindNode = selectedNode;
                    if(mindNode.direction == DirectionEnum.right) {
                        if(mindNode.getChilds().length > 0) {
                            node = mindNode.getFirstChild();
                        }
                    } else {
                        node = mindNode.parent;
                    }    
                }
            }

            return node;
        },
        up : function(selectedNode) {

            var node = undefined;

            if(selectedNode) {
                if(!selectedNode.isRoot) {
                    var mindNode = selectedNode;
                    if(mindNode.parent == this.mindRoot) {
                        var leftSibling = this.mindRoot.getRootLeftSibling(mindNode);
                        if(leftSibling) {
                            node = leftSibling;
                        }
                    } else {
                        if(mindNode.leftSibling) {
                            node = mindNode.leftSibling;
                        }
                    }
                }
            }

            return node;

        },
        down : function(selectedNode) {

            var node = undefined;

            if(selectedNode) {
                if(!selectedNode.isRoot) {
                    var mindNode = selectedNode;
                    if(mindNode.parent == this.mindRoot) {
                        var rightSibling = this.mindRoot.getRootRightSibling(mindNode);
                        if(rightSibling) {
                            node = rightSibling;
                        }
                    } else {
                        if(mindNode.rightSibling) {
                            node = mindNode.rightSibling;
                        }
                    }
                }
            }

            return node;
        }
    });

    return Navigate;
});