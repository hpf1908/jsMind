/**
 * Layout 
 */
define(function(require, exports, module) {

    var Class     = require('Class');
    var Util      = require('../helper/util');
    var MindRoot  = require('./mindRoot');
    var Path      = require('./path');
    var Navigate  = require('./navigate');
    var Const     = require('./const');
    var LayoutType = Const.LayoutType;

    var Layout = Class.create({
        initialize : function() {
            this.isEditAliginCenter = false;
            this.type = LayoutType.mind;
        },
        initialWithMap : function(map) {
            this.map = map;
            this.paths = [];
            this.posCache = {};
            this.root = this.getRoot();
            this._setClass();
        },
        initialNavigate : function() {

            this.navigate = new Navigate({
                mindRoot : this.map.mindRoot
            });
        },
        _setClass : function() {
            //添加对应布局的class
            this.map.elem.addClass('mind-layout');
        },
        /**
         * 通过layout去控制根节点
         */
        getRoot : function() {

            if(this.root) {
                return this.root;
            } else {
                return new MindRoot(null ,{
                    title : 'empty'
                });
            }
        },
        doAdd : function(parentNode , appendNode , parentElem) {
            //添加ui节点
            if(parentElem || !parentNode.isRoot) {
                parentElem = parentElem ? parentElem : parentNode.childsElem;

                if(parentNode.getFirstChild() == appendNode) {
                    parentElem.prepend(appendNode.elem);
                } else {
                    parentElem.append(appendNode.elem);
                }
            }
        },
        doRemove : function(parentNode , rmNode) {

            if(rmNode) {
                rmNode.elem.remove();
            }
        },
        anchorPos : function(node , parentOffset) {

            var pos = this.posCache['ahcnor_'+node.id];

            if(!pos) {
                pos = node.anchorPos(parentOffset);
            }

            return pos;
        },
        connectPos : function(node , parentOffset) {

            var pos = this.posCache['connect_'+node.id];

            if(!pos) {
                pos = node.connectPos(parentOffset);
            }

            return pos;
        },
        centerPos : function(node , parentOffset) {

            var pos = this.posCache['center_'+node.id];

            if(!pos) {
                pos = node.centerPos(parentOffset);
            }

            return pos;
        },
        updatePaths : function() {

            //更新之前先清除之前的
            this.clearPaths();
            //更新路径
            this._addPaths();
        },
        _addPaths : function() {

            var self = this;
            var parentOffset = this.map._parentOffset();

            //临时缓存位置信息
            this.posCache = {};

            this.root.breadthFirstSearch(function(node) {
                return !node.isOpened;
            }, function(node){
                if(!node.isRoot)  {
                    self.addPathWithNode(node.parent, node , parentOffset);
                }
            }); 

            //用完就丢掉
            this.posCache = {};
        },
        addPathWithNode : function(fromNode, toNode , parentOffset) {
            var from = this.connectPos(fromNode , parentOffset);
            var to   = this.connectPos(toNode , parentOffset);
            var middle = this.anchorPos(toNode , parentOffset);
            this.addPath(from , middle, to , fromNode.isRoot);
        },
        addPath : function(from , middle , to , isRoot) {
            
            var path = new Path(this.map.rPaper);

            if(isRoot) {
                path.smoothRoundTo(from , middle);
                path.smoothRoundTo(middle, to);
            } else {
                path.smoothCurveTo(from , middle);
                path.smoothCurveTo(middle, to);
            }
            
            this.paths.push(path);
        },
        clearPaths : function() {

            for (var i = 0 , len = this.paths.length; i < len; i++) {
                var path = this.paths[i];
                path.clear();
            };

            this.paths = [];
        },
        /**
         * 相对于map的中心位置
         */
        centerPosInMap : function() {

            var mapOffset = this.map.elem.offset();
            var rootOffset = this.root.rootElem.offset();

            return {
                x : rootOffset.left - mapOffset.left,
                y : rootOffset.top - mapOffset.top
            }
        },
        /**
         * 设置map为中央
         */
        alignCenter : function() {

            var canvasWidth  = this.map.opts.canvasWidth;
            var canvasHeight = this.map.opts.canvasHeight;

            var posX = canvasWidth / 2.0;
            var posY = canvasHeight / 2.0;

            var centerPosInMap = this.centerPosInMap();

            posX = posX - centerPosInMap.x;
            posY = posY - centerPosInMap.y;

            this.map.setPos({
                x : posX,
                y : posY
            });
        }
    });

    return Layout;
});