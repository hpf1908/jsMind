/**
 * shape 
 */
define(function(require, exports, module) {

    var Class    = require('Class');
    var Util     = require('../helper/util');
    var MindNode = require('./mindNode');
    var Path     = require('./path');
    var Const    = require('./const');
    var Events   = require('Events');

    var DirectionEnum = Const.DirectionEnum;

    var CaculateDistance = function(from , to) {
        return Math.sqrt(Math.pow(to.x - from.x,2) +  Math.pow(to.y - from.y,2));
    }

    var Map = Class.create({
        initialize: function(options) {

            this.opts = Util.extend({
                container : null,
                rPaper : null,
                canvasWidth : 10000,
                canvasHeight: 6000
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
            //更新连接线的timer
            this._repaintTimer = null;
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
            this.needRepaint();
        },
        _nodeEventsHandler : function(event) {
            if(event == 'openChilds') {
                this.needRepaint();
            } else if(event == 'closeChilds') {
                this.needRepaint();
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
        needRepaint : function() {

            if(!this._repaintTimer) {
                var self = this;
                this._repaintTimer = setTimeout(function() {
                    //更新列表
                    self.doRepaint();
                    self._repaintTimer = null;
                },0);
            }
        },
        _parentOffset : function() {
            return this.elem.parent().offset();
        },
        getRootPos : function() {
            var rootWidth  = this.rootElem.width();
            var rootHeight = this.rootElem.height();
            var rootOffset = this.rootElem.offset();
            var parentOffset = this._parentOffset();
            return {
                x : rootOffset.left + rootWidth / 2.0 - parentOffset.left,
                y : rootOffset.top  + rootHeight / 2.0 - parentOffset.top
            }
        },
        doRepaint : function() {

            this.alignCenter();

            this.updatePaths();

            this.trigger('doRepaint');
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

            var parentOffset = this._parentOffset();

            for (var i = 0 , len = targets.length; i < len; i++) {
                var node = targets[i];
                var toPos   = node.connectPos(parentOffset);
                var middle = node.anchorPos(parentOffset);
                this.addPath(fromPos , middle , toPos);
            }
        },
        /**
         * 更新两侧的子树的连接
         */
        _addBranchPaths : function(rootNode) {

            var self = this;
            rootNode.breadthFirstSearch(function(node) {
                return !node.isOpened;
            }, function(node){
                if(node != rootNode && node.parent != rootNode)  {
                    self.addPathWithNode(node.parent, node);
                }
            });
        },
        addPathWithNode : function(fromNode, toNode) {
            var parentOffset = this._parentOffset();
            var from = fromNode.connectPos(parentOffset);
            var to   = toNode.connectPos(parentOffset);
            var middle = toNode.anchorPos(parentOffset);
            this.addPath(from , middle, to);
        },
        addPath : function(from , middle , to) {

            if(arguments.length == 3) {
                var path = new Path(this.rPaper);

                // console.log(CaculateDistance(from , middle));
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
        },
        width : function() {
            return this.elem.width();
        },
        height : function() {
            return this.elem.height();
        },
        setPos : function(pos) {

            this.elem.css('left',pos.x + 'px').css('top', pos.y + 'px');
            this.needRepaint();
        },
        /**
         * 相对于map的中心位置
         */
        centerPosInMap : function() {

            var mapOffset = this.elem.offset();
            var rootOffset = this.rootElem.offset();

            return {
                x : rootOffset.left - mapOffset.left ,
                y : rootOffset.top - mapOffset.top
            }
        },
        /**
         * 设置map为中央
         */
        alignCenter : function() {

            var canvasWidth  = this.opts.canvasWidth;
            var canvasHeight = this.opts.canvasHeight;

            var posX = canvasWidth / 2.0;
            var posY = canvasHeight / 2.0;

            var centerPosInMap = this.centerPosInMap();

            posX = posX - centerPosInMap.x;
            posY = posY - centerPosInMap.y;

            this.setPos({
                x : posX,
                y : posY
            });
        }
    });

    //混入原型对象
    Events.mixTo(Map);

    return Map;
});