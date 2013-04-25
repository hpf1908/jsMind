/**
 * TreeNode 
 */
define(function(require, exports, module) {

    var Class    = require('Class');
    var $        = require('jQuery');
    var Events   = require('Events');
    var Util     = require('../helper/util');
    var Queue    = require('Queue');
    var Template = require('../helper/template');
    var Const    = require('./const');
    var Config   = require('./config');

    var DirectionEnum = Const.DirectionEnum;

    var MindNode = Class.create({
        initialize: function(parent , viewObject) {

            this.childs = [];

            this.viewObject = Util.extend({
                title : 'empty',
                isFake : false,
                fakeElem : null,
                autoOpen : true
            }, viewObject);

            this.id = Util.uuid();
            this.parent = parent;
            this.leftSibling = null;
            this.rightSibling = null;
            this.isOpened = false;
            this.direction = DirectionEnum.none;

            if(parent) {
                this.floor = parent.floor + 1;
                parent.addChild(this);
            } else {
                this.floor = 1;
            }

            //创建ui
            if(!this.viewObject.isFake) {
                this._createUi();
                this.show();
            } else {
                this.elem = $(this.viewObject.fakeElem);
                this.childsElem = this.elem;
                this.openElm = this.elem;
            }

            this.setTitle(this.viewObject.title);
        },
        _createUi : function() {

            var html = Template.parse(this._template(), {
                title : this.viewObject.title
            });

            this.elem = $(html);
            this.labelElem = this.elem.find('.tk_label');
            this.childsElem = this.elem.find('.tk_children');
            this.posElem = this.elem.find('.tk_open_container');
            this.openElm = this.posElem.find('.tk_open');
            this._bindToElem();
            this.elem.attr('id',this.id);
        },
        _bindToElem : function() {
            this.elem.data('mindNode',this);
        },
        _template : function() {

            return ['<div class="tk_container j_container">',
                        '<div class="tk_open_container j_editPlace">',
                            '<div class="tk_label" style="cursor: default;">',
                                '<span class="rhandle">&nbsp;</span>',
                                '<div class="tk_title"><%=title%></div>',
                            '</div>',
                            '<img class="tk_open j_open" style="visibility:hidden;" draggable="false">',
                        '</div>',
                        '<div class="tk_children" style="visibility:hidden;"></div>',
                    '</div>'].join('');
        },
        setTitle : function(title) {
            this.title = title;
            title = title.length > 0 ? title : 'S';  //用于占位
            this.labelElem.find('.tk_title').text(title);
        },
        getTitle : function() {
            return this.title || '';
        },
        setRootVisibleNode : function() {
            this.labelElem.addClass('root_child');
        },
        setNormalVisibleNode : function() {
            this.labelElem.addClass('node');
        },
        show : function() {
            this.elem.show();
        },
        hide : function() {
            this.elem.hide();
        },
        getElement : function() {
            return this.elem;
        },
        offset : function() {
            return this.posElem.offset();
        },
        anchorPos : function(relativeOffset) {

            if(this.isFake()) {
                return { x : 0 , y: 0 }
            } else {
                var offset = this.offset();
                var size = this.size();

                if(this.direction == DirectionEnum.right) {
                    return {
                        x : offset.left - relativeOffset.left,
                        y : offset.top + size.height - relativeOffset.top
                    }
                } else {
                    return {
                        x : offset.left + size.width - relativeOffset.left,
                        y : offset.top + size.height - relativeOffset.top
                    }
                }
            }
        },
        /**
         * 连接点的位置
         */
        connectPos : function(relativeOffset) {
            
            if(this.isFake()) {
                return { x : 0 , y: 0 }
            } else {

                if(this.isOpened) {
                    var width = this.openElm.width();
                    var height = this.openElm.height();
                    var offset = this.openElm.offset();

                    return {
                        x : offset.left + width / 2.0 - relativeOffset.left,
                        y : offset.top  + height / 2.0 - relativeOffset.top
                    }
                } else {

                    var offset = this.offset();
                    var size = this.size();

                    if(this.direction == DirectionEnum.left) {
                        return {
                            x : offset.left - relativeOffset.left,
                            y : offset.top + size.height - relativeOffset.top
                        }
                    } else {
                        return {
                            x : offset.left + size.width - relativeOffset.left,
                            y : offset.top + size.height - relativeOffset.top
                        }
                    }
                }
            }
        },
        size : function() {
            return {
                width  : this.posElem.width(),
                height : this.posElem.height()
            }
        },
        isFake : function() {
            return this.viewObject.isFake;
        },
        addTo : function(parent) {
            parent.addChild(this);
        },
        addChild : function(node , parentElem) {

            if(this.childs.length > 0 ) {
                var lastNode = this.childs[this.childs.length - 1];
                lastNode.rightSibling = node;
                node.leftSibling = lastNode;
                node.floor = this.floor + 1;
            }
            
            this.childs.push(node);
            //设置parent
            node.parent = this;

            //判断是否自动展开子节点
            if(this.viewObject.autoOpen) {
                this.openChilds();
            }
            //重新绑定子节点，因为remove以后jQuery会将data数据清除
            node._bindToElem();

            //触发回调事件
            this.trigger('appendChild', this, node , parentElem);

            return true;
        },
        openChilds : function() {
            if(this.childs.length > 0) {
                this.isOpened = true;
                this.openElm.attr('src',Config.node.closeImgSrc);
                this.openElm.css('visibility','');
                this.childsElem.css('visibility','');
                this.trigger('openChilds', this);
            } else {
                this.isOpened = false;
                this.openElm.css('visibility','hidden');
                this.childsElem.css('visibility','hidden');
            }
        },
        closeChilds : function() {

            if(this.childs.length > 0) {
                this.isOpened = false;
                this.openElm.attr('src',Config.node.openImgSrc);
                this.openElm.css('visibility','');
                this.childsElem.css('visibility','hidden');
                this.trigger('closeChilds', this);
            } else {
                this.isOpened = false;
                this.openElm.css('visibility','hidden');
                this.childsElem.css('visibility','hidden');
            }
        },
        toggleChilds : function() {
            if(this.isOpened) {
                this.closeChilds();
            } else {
                this.openChilds();
            }
        },
        removeChild : function(child){
            for (var i = this.childs.length - 1; i >= 0; i--) {
                if(this.childs[i] === child) {
                    this.removeChildAt(i);
                }
            };
        },
        remove : function(){
            if(this.parent) {
                return this.parent.removeChild(this);
            } else {
                return null;
            }
        },
        removeChildAt : function(index) {
            if(this.childs[index]) {
                if(index > 0 && index < this.childs.length - 1) {
                    var leftNode = this.childs[index - 1];
                    var rightNode = this.childs[index + 1];
                    leftNode.rightSibling = rightNode;
                    rightNode.leftSibling = leftNode;
                } else if(index == 0) {
                    var rightNode = this.childs[index + 1];
                    if(rightNode) {
                        rightNode.leftSibling = null;
                    }
                } else if(index == this.childs.length - 1) {
                    var leftNode = this.childs[index - 1];
                    if(leftNode) {
                        leftNode.rightSibling = null;
                    }
                }

                var node = this.childs.splice(index , 1)[0];
                node.leftSibling = null;
                node.rightSibling = null;
                node.parent = null;
                //回调
                this.trigger('removeChild', this, node);
                return node;
            } else {
                return null;
            }
        },
        getChilds : function(){
            return this.childs;
        },
        isFirstChild : function(parent){
            parent = parent ? parent : this.parent;
            if(!parent) {
                return false;
            }

            if(parent.childs && parent.childs.length > 0) {
                return this == parent.getFirstChild();
            } else {
                return false;
            }
        },
        getChildAt : function(i) {
            return this.childs[i];
        },
        getFirstChild : function(){
            return this.getChildAt(0);
        },
        getLastChild : function(){
            return this.getChildAt(this.childs.length - 1);
        },
        getFloor : function(){
            if(!this.parent) {
                return 1;
            } else {
                return this.parent.getFloor() + 1;
            }
        },
        getDepth : function(){
            var degree = 0;

            this.breadthFirstSearch(function(node){
                if(node.floor > degree) {
                    degree = node.floor;
                }
            });

            return degree;
        },
        breadthFirstSearch : function(shouldStop , callback){
            var queue = new Queue();
            queue.enQueue(this);

            if(arguments.length == 1) {
                callback = shouldStop;
                shouldStop = function() {
                    return false;
                }
            }

            while(!queue.empty()) {
                var node = queue.deQueue();
                callback && callback(node);

                if(!shouldStop(node)) {
                    for(var i = 0; i < node.childs.length; i++) {
                        queue.enQueue(node.childs[i]);
                    }
                }
         
            }
        },
        deepthFirstSearchItem : function(node , callback){
            callback && callback(node);

            if(node.childs && node.childs.length > 0) {
                for(var i = 0; i < node.childs.length; i++) {
                    this.deepthFirstSearchItem(node.childs[i] , callback);
                }
            }
        },
        deepthFirstSearch : function(callback){
            this.deepthFirstSearchItem(this , callback);
        },
        select : function() {
            this._isSelected = true;
            this.labelElem.addClass('selected').addClass('current');
        },
        deselect : function() {
            this._isSelected = false;
            this.labelElem.removeClass('selected').removeClass('current');
        },
        toggleSelect : function() {
            if(this._isSelected) {
                this.deselect();
            } else {
                this.select();
            }
        },
        enterEdit : function() {
            var self = this;
            this._isEdit = true;
            this.labelElem.addClass('edit');
        },
        leaveEdit : function(value) {
            this._isEdit = false;
            this.labelElem.removeClass('edit');
            var srcValue = this.getTitle();
            this.setTitle($.trim(value));
            this.trigger('leaveEdit');
        },
        getEditPlaceElm : function() {
            return this.elem.find('.j_editPlace');
        }
    });

    //混入原型对象
    Events.mixTo(MindNode);

    return MindNode;
});