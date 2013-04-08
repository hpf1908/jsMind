/**
 * shape 
 */
define(function(require, exports, module) {

    var Class    = require('Class');
    var Util     = require('../helper/util');
    var MindNode = require('./mindNode');
    var Path     = require('./path');

    var Map = Class.create({
        initialize: function(options) {

            this.opts = Util.extend({
                container : null,
                rPaper : null
            },options);

            var str =  ['<div id="tk_rootchildren_left" class="tk_children"></div>',
                        '<div id="tk_rootcontainer">',
                            '<div class="tk_label root">',
                                '<div class="tk_title">jsMind</div>',
                            '</div>',
                        '</div>',
                        '<div id="tk_rootchildren_right" class="tk_children"></div>'].join('');

            this.elem = $(this.opts.container);
            $(str).appendTo(this.elem);

            this.rootElem = $('#tk_rootcontainer');
            this.leftChildRootElm = $('#tk_rootchildren_left');
            this.rightChildRootElm = $('#tk_rootchildren_right');

            //记录当前的raphael对象
            this.rPaper = this.opts.rPaper;
            //记录当前父节点的offset
            this._parentOffset = this.elem.parent().offset();
            //更新连接线的timer
            this._pathUpdateTimer = null;
            //初始化连线
            this.paths = [];
            //创建ui
            this._createUi();
            //绑定事件
            this._bindEvents();
        },
        _createUi : function() {

            var leftRoot = new MindNode(null , {
                title : 'empty',
                isRootChild : false,
                isFake : true,
                fakeElem : this.leftChildRootElm
            });

            this.leftRootNode = leftRoot;

            var rightRoot = new MindNode(null , {
                title : 'empty',
                isRootChild : false,
                isFake : true,
                fakeElem : this.rightChildRootElm
            });

            this.rightRootNode = rightRoot;
        },
        _bindEvents : function() {
            this.leftRootNode.on('appendChild' , this._nodeAppend, this);
            this.rightRootNode.on('appendChild', this._nodeAppend, this);
        },
        _nodeAppend : function(parentNode , appendNode) {

            var self = this;

            //需要更新连接线
            this.needUpdatePaths();

            //遍历节点，依次添加事件
            appendNode.breadthFirstSearch(function(node) {
                node.on('appendChild' , self._nodeAppend, self);
            });
        },
        setTitle : function(title) {
            this.rootElem.find('.tk_title').html(title);
        },
        getLeftTreeRoot : function() {
            return this.leftRootNode;
        },
        getRightTreeRoot : function() {
            return this.rightRootNode;
        },
        addToLeftTree : function(node) {
            var root = this.getLeftTreeRoot();
            root.addChild(node);
        },
        addToRightTree : function(node) {
            var root = this.getRightTreeRoot();
            root.addChild(node);
        },
        add : function(node) {
            this.addToLeftTree(node);
        },
        needUpdatePaths : function() {

            if(!this._pathUpdateTimer) {
                var self = this;
                this._pathUpdateTimer = setTimeout(function() {
                    //更新列表
                    self.updatePaths();
                    self._pathUpdateTimer = null;
                },0);
            }
        },
        getNodePos : function(node) {
            var nodeOffset = node.offset();
            var size = node.size();
            return {
                x : nodeOffset.left + size.width / 2.0 - this._parentOffset.left,
                y : nodeOffset.top  + size.height / 2.0 - this._parentOffset.top
            }
        },
        getRootPos : function() {
            var rootWidth  = this.rootElem.width();
            var rootHeight = this.rootElem.height();
            var rootOffset = this.rootElem.offset();
            return {
                x : rootOffset.left + rootWidth / 2.0 - this._parentOffset.left,
                y : rootOffset.top  + rootHeight / 2.0 - this._parentOffset.top
            }
        },
        updatePaths : function() {

            var self = this;

            //更新之前先清除之前的
            this.clearPaths();
            //更新第一层的节点
            this._addRootPaths();
            //更新左右两侧子树
            this._addBranchPaths(this.leftRootNode);
            this._addBranchPaths(this.rightRootNode);
        },
        _addRootPaths : function() {

            var nodes = this.leftRootNode.getChilds().concat(this.rightRootNode.getChilds());
            var from = this.getRootPos();

            for (var i = 0 , len = nodes.length; i < len; i++) {
                var node = nodes[i];
                var to   = this.getNodePos(node);
                this.addPath(from , to);
            };
        },
        /**
         * 更新两侧的子树的连接
         */
        _addBranchPaths : function(rootNode) {

            var self = this;
            rootNode.breadthFirstSearch(function(node){
                if(node != rootNode && node.parent != rootNode) {
                    self.addPathWithNode(node.parent, node);
                }
            });
        },
        addPathWithNode : function(fromNode, toNode) {
            var from = this.getNodePos(fromNode);
            var to   = this.getNodePos(toNode);
            this.addPath(from , to);
        },
        addPath : function(from , to) {
            var path = new Path(this.rPaper);
            path.set(from , to);
            this.paths.push(path);
        },
        clearPaths : function() {

            for (var i = 0 , len = this.paths.length; i < len; i++) {
                var path = this.paths[i];
                path.clear();
            };

            this.paths = [];
        }
    });

    return Map;
});