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

    var MindNode = Class.create({
        initialize: function(parent , viewObject) {

            this.childs = [];

            this.viewObject = Util.extend({
                title : 'empty',
                isRootChild : false,
                isFake : false,
                fakeElem : null
            }, viewObject);

            this.id = Util.uuid();
            this.parent = parent;
            this.leftSibling = null;
            this.rightSibling = null;

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
            }
        },
        _createUi : function() {

            var html = Template.parse(this._template(), this.viewObject);

            this.elem = $(html);
            this.labelElem = this.elem.find('.tk_label');
            this.childsElem = this.elem.find('.tk_children');
            this.posElem = this.elem.find('.tk_open_container');
            this._bindToElem();
            this.elem.attr('id',this.id);
        },
        _bindToElem : function() {
            this.elem.data('mindNode',this);
        },
        _template : function() {

            return ['<div class="tk_container">',
                        '<div class="tk_open_container">',
                            '<div class="tk_label <% if(isRootChild) { %>root_child<%}%>" style="cursor: default;">',
                                '<div class="tk_title"><%=title%></div>',
                            '</div>',
                            '<img class="tk_open" style="display:none;" draggable="false">',
                        '</div>',
                        '<div class="tk_children"></div>',
                    '</div>'].join('');
        },
        setTitle : function(title) {
            this.labelElem.find('.tk_title').html(title);
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
        size : function() {
            return {
                width  : this.posElem.width(),
                height : this.posElem.height()
            }
        },
        addChild : function(node) {

            if(this.childs.length > 0 ) {
                var lastNode = this.childs[this.childs.length - 1];
                lastNode.rightSibling = node;
                node.leftSibling = lastNode;
                node.floor = this.floor + 1;
            }
            
            this.childs.push(node);
            //添加ui节点
            this.childsElem.append(node.elem);
            //设置parent
            node.parent = this;
            this.trigger('appendChild', this, node);
            return true;
        },
        removeChild : function(child){
            for (var i = this.childs.length - 1; i >= 0; i--) {
                if(this.childs[i] === child) {
                    this.removeChildAt(i);
                }
            };
        },
        remove : function(){
            if(this.parent != nil) {
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
                    rightNode.leftSibling = null;
                } else if(index == this.childs.length - 1) {
                    var leftNode = this.childs[index - 1];
                    leftNode.rightSibling = null;
                }

                var node = this.childs.splice(index , 1)[0];
                node.leftSibling = null;
                node.rightSibling = null;
                node.parent = null;
                //删除掉ui节点
                node.elem.remove();
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
        breadthFirstSearch : function(callback){
            var queue = new Queue();
            queue.enQueue(this);

            while(!queue.empty()) {
                var node = queue.deQueue();
                callback && callback(node);
                for(var i = 0; i < node.childs.length; i++) {
                    queue.enQueue(node.childs[i]);
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
        }
    });

    //混入原型对象
    Events.mixTo(MindNode);

    return MindNode;
});