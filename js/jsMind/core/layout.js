/**
 * Map 
 */
define(function(require, exports, module) {

    var Class     = require('Class');
    var Util      = require('../helper/util');
    var MindRoot  = require('./mindRoot');
    var Path      = require('./path');

    var Layout = Class.create({
        initialize : function(map) {

            this.map = map;
            this.paths = [];
            this.posCache = {};
            this.root = this.getRoot();
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
                parentElem.append(appendNode.elem);
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
        }
    });

    return Layout;
});