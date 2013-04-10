/**
 * shape 
 */
define(function(require, exports, module) {

    var Class    = require('Class');
    var Util     = require('../helper/util');
    var MindNode = require('./mindNode');
    var Path     = require('./path');
    var Const    = require('./const');

    var DirectionEnum = Const.DirectionEnum;

    var CaculateDistance = function(from , to) {
        return Math.sqrt(Math.pow(to.x - from.x,2) +  Math.pow(to.y - from.y,2));
    }

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

            leftRoot.direction = DirectionEnum.left;
            this.leftRootNode = leftRoot;

            var rightRoot = new MindNode(null , {
                title : 'empty',
                isRootChild : false,
                isFake : true,
                fakeElem : this.rightChildRootElm
            });

            rightRoot.direction = DirectionEnum.right;
            this.rightRootNode = rightRoot;
        },
        _bindEvents : function() {

            this.leftRootNode.on('appendChild' , this._nodeAppend, this);
            this.rightRootNode.on('appendChild', this._nodeAppend, this);

            this.elem.delegate('.j_open' , 'click' , function() {

                var nodeElem = $(this).parents('.tk_container');
                var node = nodeElem.data('mindNode');
                
                if(node) {
                    node.toggleChilds();
                }
            });
        },
        _nodeAppend : function(parentNode , appendNode) {

            var self = this;

            //遍历节点，依次添加事件
            appendNode.breadthFirstSearch(function(node) {
                if(node.parent) {
                    node.direction = node.parent.direction;
                }

                if(node.parent.isFake()) {
                    node.setRootVisibleNode();
                }
                node.on('appendChild' , self._nodeAppend, self);
                node.on('all' , self._nodeEventsHandler, self);
            });

            //需要更新连接线
            this.needUpdatePaths();
        },
        _nodeEventsHandler : function(event) {
            if(event == 'openChilds') {
                this.needUpdatePaths();
            } else if(event == 'closeChilds') {
                this.needUpdatePaths();
            }
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
            node.direction = DirectionEnum.left;
            root.addChild(node);
        },
        addToRightTree : function(node) {
            var root = this.getRightTreeRoot();
            node.direction = DirectionEnum.right;
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
            var from = this.getRootPos();
            this._addNodesPaths(from , this.leftRootNode.getChilds());
            this._addNodesPaths(from , this.rightRootNode.getChilds());
        },
        _addNodesPaths : function(fromPos , targets) {
             for (var i = 0 , len = targets.length; i < len; i++) {
                var node = targets[i];
                var toPos   = node.connectPos(this._parentOffset);
                this.addPath(fromPos , toPos);
            }
        },
        /**
         * 更新两侧的子树的连接
         */
        _addBranchPaths : function(rootNode) {

            var self = this;
            rootNode.breadthFirstSearch(function(node){
                if(node != rootNode && node.parent != rootNode) {
                    if(node.parent.isOpened) {
                        self.addPathWithNode(node.parent, node);
                    }
                }
            });
        },
        addPathWithNode : function(fromNode, toNode) {
            var from = fromNode.connectPos(this._parentOffset);
            var to   = toNode.connectPos(this._parentOffset);
            var middle = toNode.anchorPos(this._parentOffset);
            this.addPath(from , middle, to);
        },
        addPath : function(from , middle , to) {

            if(arguments.length == 3) {
                var path = new Path(this.rPaper);

                console.log(CaculateDistance(from , middle));
                if(CaculateDistance(from , middle) < 10) {
                    path.smoothCurveTo(from, to);
                } else {
                    path.smoothCurveTo(from , middle);
                    path.smoothCurveTo(middle, to);
                }
                this.paths.push(path);
            } else {
                var path = new Path(this.rPaper);
                to = middle;
                path.smoothCurveTo(from , to);
                this.paths.push(path);
            }
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