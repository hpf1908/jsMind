/**
 * mindRoot 
 */
define(function(require, exports, module) {

    var Class    = require('Class');
    var Util     = require('../helper/util');
    var Const    = require('./const');
    var $        = require('jQuery');
    var Const    = require('./const');
    var MindNode = require('./mindNode');

    var DirectionEnum = Const.DirectionEnum;

    var MindRoot = Class.create(MindNode , {
        initialize: function(parent , viewObject) {
            MindRoot.superclass.initialize.apply(this, arguments);
            this.isRoot = true;
        },
        _template : function() {

            return ['<div>',
                        '<div id="tk_rootchildren_left" class="tk_children"></div>',
                        '<div id="tk_rootcontainer" class="j_container j_editPlace">',
                            '<div class="tk_label root">',
                                '<span class="rhandle">&nbsp;</span>',
                                '<div class="tk_title"><%=title%></div>',
                            '</div>',
                        '</div>',
                        '<div id="tk_rootchildren_right" class="tk_children"></div>',
                    '</div>'].join('');
        },
        _createUi : function() {
            MindRoot.superclass._createUi.apply(this, arguments);
            this.rootElem = this.elem.find('.j_container');
            this.leftElm = this.elem.find('#tk_rootchildren_left');
            this.rightElm = this.elem.find('#tk_rootchildren_right');
        },
        _bindToElem : function() {
            this.elem.find('.j_container').data('mindNode',this);
        },
        addToLeft : function(mindNode) {
            mindNode.direction = DirectionEnum.left;
            this.addChild(mindNode , this.leftElm);
        },
        addToRight : function(mindNode) {
            mindNode.direction = DirectionEnum.right;
            this.addChild(mindNode , this.rightElm);
        },
        leftChilds : function() {
            var childs = [];
            for (var i = 0; i < this.childs.length; i++) {
                var child = this.childs[i];
                if(child.direction == DirectionEnum.left) {
                    childs.push(child);
                }
            }
            return childs;
        },
        rightChilds : function() {
            var childs = [];
            for (var i = 0; i < this.childs.length; i++) {
                var child = this.childs[i];
                if(child.direction == DirectionEnum.right) {
                    childs.push(child);
                }
            }
            return childs;
        },
        getFirstLeftChild : function() {
            var childs = this.leftChilds();
            return childs.length > 0 ? childs[0] : null;
        },
        getFirstRightChild : function() {
            var childs = this.rightChilds();
            return childs.length > 0 ? childs[0] : null;
        },
        getRootPos : function(parentOffset) {
            var rootWidth  = this.rootElem.width();
            var rootHeight = this.rootElem.height();
            var rootOffset = this.rootElem.offset();

            return {
                x : rootOffset.left + rootWidth / 2.0 - parentOffset.left,
                y : rootOffset.top  + rootHeight / 2.0 - parentOffset.top
            }
        },
        /**
         * 连接点的位置
         */
        connectPos : function(relativeOffset) {
            return this.getRootPos(relativeOffset);
        },
        getRootLeftSibling : function(node) {

            var found = false;

            for (var i = this.childs.length -1; i >=0; i--) {
                var child = this.childs[i];

                if(found && child.direction == node.direction) {
                    return child;
                }  

                if(child == node) {
                    found = true;
                }
            }
            return null;
        },
        getRootRightSibling : function(node) {
            var found = false;

            for (var i = 0; i < this.childs.length; i++) {
                var child = this.childs[i];

                if(found && child.direction == node.direction) {
                    return child;
                }  

                if(child == node) {
                    found = true;
                }
            }
            return null;
        },
        getEditPlaceElm : function() {
            return this.rootElem;
        }
    });

    return MindRoot;
});