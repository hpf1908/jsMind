/**
 * TreeLayout 
 */
define(function(require, exports, module) {

    var Class        = require('Class');
    var Util         = require('../helper/util');
    var MindNode     = require('./mindNode');
    var TreeMindRoot = require('./treeMindRoot');
    var Path         = require('./path');
    var Layout       = require('./layout');
    var TreeNavigate = require('./treeNavigate');
    var Const     = require('./const');
    
    var LayoutType = Const.LayoutType;

    var TreeLayout = Class.create(Layout , {
        initialize : function(map) {
            this.isEditAliginCenter = true;
            this.type = LayoutType.tree;
        },
        initialNavigate : function() {

            this.navigate = new TreeNavigate({
                mindRoot : this.map.mindRoot
            });
        },
        getRoot : function() {

            if(this.root) {
                return this.root;
            } else {
                return new TreeMindRoot(null ,{
                    title : 'empty'
                });
            }
        },
        doAdd : function(parentNode , appendNode , parentElem) {
            parentElem = parentElem ? parentElem : parentNode.childsElem;
            if(parentNode.getFirstChild() == appendNode) {
                parentElem.prepend(appendNode.elem);
            } else {
                parentElem.append(appendNode.elem);
            }
        },
        _setClass : function() {
            //添加对应布局的class
            this.map.elem.addClass('tree-layout');
        },
        /**
         * 设置map为中央
         */
        alignCenter : function() {

            var canvasWidth  = this.map.opts.canvasWidth;
            var canvasHeight = this.map.opts.canvasHeight;

            var stageSize = this.map.stageSize();

            var posX = canvasWidth / 2.0;
            var posY = canvasHeight / 2.0;

            var mapWidth = this.map.elem.width();

            posX = posX - mapWidth / 2.0;
            posY = posY - stageSize.height / 2.0;

            this.map.setPos({
                x : posX,
                y : posY
            });
        },
        addPathWithNode : function(fromNode, toNode , parentOffset) {
            var from = this.connectPos(fromNode , parentOffset);
            var to   = this.centerPos(toNode , parentOffset);
            var middle = {
                x : to.x,
                y : from.y
            }
            this.addPath(from , middle, to , fromNode.isRoot);
        },
        addPath : function(from , middle , to , isRoot) {
            
            var path = new Path(this.map.rPaper);

            if(arguments.length == 3) {
                isRoot = to;
                to = middle;
                middle = null;
            }

            if(middle == null) {
                path.lineTo(from, to);
            } else {
                path.lineTo(from , middle);
                path.lineTo(middle, to);
            }      
            
            this.paths.push(path);
        }
    });

    return TreeLayout;
});