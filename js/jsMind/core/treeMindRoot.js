/**
 * TreeMindRoot 
 */
define(function(require, exports, module) {

    var Class     = require('Class');
    var MindRoot  = require('./mindRoot');
    var MindNode  = require('./mindNode');
    var Const    = require('./const');

    var DirectionEnum = Const.DirectionEnum;

    var TreeMindRoot = Class.create(MindRoot , {
        initialize: function() {
            MindRoot.superclass.initialize.apply(this, arguments);
            this.isRoot = true;
        },
        _createUi : function() {
            MindRoot.superclass._createUi.apply(this, arguments);
            this.rootElem = this.elem;
            this.rootElem.find('.tk_label').addClass('root');
        },
        addToLeft : function(mindNode) {
            mindNode.direction = DirectionEnum.left;
            this.addChild(mindNode);
        },
        addToRight : function(mindNode) {
            mindNode.direction = DirectionEnum.right;
            this.addChild(mindNode);
        },
        _template : function() {

            return MindRoot.superclass._template.apply(this, arguments);
        },
        _bindToElem : function() {
            this.elem.data('mindNode',this);
        },
        /**
         * 连接点的位置
         */
        connectPos : function(relativeOffset) {

            return MindRoot.superclass.connectPos.apply(this, arguments);
        }
    });

    return TreeMindRoot;
});