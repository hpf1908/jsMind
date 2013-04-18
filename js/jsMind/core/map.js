/**
 * shape 
 */
define(function(require, exports, module) {

    var Class    = require('Class');
    var Util     = require('../helper/util');
    var MindNode = require('./mindNode');
    var MindRoot = require('./mindRoot');
    var Path     = require('./path');
    var Const    = require('./const');
    var Events   = require('Events');
    var $        = require('jquery.shortcuts');
    var EditPanel = require('./editPanel');

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
                canvasHeight: 6000,
                enableEdit : false
            },options);

            this.mindRoot = new MindRoot(null ,{
                title : 'empty'
            });

            this.elem = $(this.opts.container);
            // console.log()
            this.mindRoot.elem.appendTo(this.elem);

            //当前选中的节点
            this.currentSelected = null;
            //记录当前的raphael对象
            this.rPaper = this.opts.rPaper;
            //更新连接线的timer
            this._repaintTimer = null;
            //初始化连线
            this.paths = [];
            //绑定事件
            this._bindEvents();
            //初始化键盘事件
            this._initialKeyboard();
            //初始化当前选中节点
            this._doSelect(this.mindRoot);
            //将map居中
            this.alignCenter();
            //聚焦
            Util.focusDocument();
            //初始化编辑
            this._initialEditPanel();
        },
        _bindEvents : function() {

            var self = this;

            this.mindRoot.on('appendChild' , this._nodeAppend, this);
            this.mindRoot.on('all',this._nodeEventsHandler,this);

            this.elem.delegate('.j_open' , 'click' , function() {
                var node = self._getNodeByChildElm(this);
                if(node) {
                    node.toggleChilds();
                }
            });

            this.elem.delegate('.tk_label','click',function(){
                var node = self._getNodeByChildElm(this);
                if(node) {
                    self._doSelect(node);
                }
            });

            if(this.opts.enableEdit) {
                this.elem.delegate('.tk_label','dblclick',function(){
                    var node = self._getNodeByChildElm(this);
                    self.currentSelected = null;
                    self._doSelect(node);
                    self.enterEdit(node);
                });
            }
        },
        _initialKeyboard : function() {

            var self = this;

            $.Shortcuts.add({
                type: 'down',
                mask: 'Enter',
                handler: function() {
                    self._didClickEnter();
                }
            });

            $.Shortcuts.add({
                type: 'down',
                mask: 'Left',
                handler: function() {
                    self._didClickLeft();
                }
            });

            $.Shortcuts.add({
                type: 'down',
                mask: 'Right',
                handler: function() {
                    self._didClickRight();
                }
            });

            $.Shortcuts.add({
                type: 'down',
                mask: 'Up',
                handler: function() {
                    self._didClickUp();
                }
            });

            $.Shortcuts.add({
                type: 'down',
                mask: 'Down',
                handler: function() {
                    self._didClickDown();
                }
            });

            $.Shortcuts.add({
                type: 'down',
                mask: 'backspace',
                handler: function() {
                    self._didClickDelete();
                }
            });

            $.Shortcuts.add({
                type: 'down',
                mask: 'Ctrl+Enter',
                handler: function() {
                    if(self.currentSelected) {
                        self.enterEdit(self.currentSelected);
                    }
                } 
            });

            $.Shortcuts.add({
                type: 'down',
                mask: 'Space',
                handler: function() {
                    self._didClickSpace();
                } 
            });

            $.Shortcuts.start();
        },
        _initialEditPanel : function() {

            var self = this;

            this.editPanel = new EditPanel({
                elem       : this.elem
            });

            this.editPanel.on('leaveEdit' , function(node){
                if(node.getTitle().length == 0) {
                   if(this.currentSelected == node && node.parent) {
                     this._doSelect(node.parent);
                   }
                   node.remove();
                } else {
                   this._doSelect(node , true);
                }
            },this);
        },
        _doSelect : function(mindNode , invalidate) {

            if(this.currentSelected && !invalidate) {
                if(this.currentSelected != mindNode) {
                    this.currentSelected.deselect();
                } else {
                    this.currentSelected.toggleSelect();
                    return;
                }
            }

            if(mindNode) {
                mindNode.select();
            }

            this.currentSelected = mindNode;
        },
        _getNodeByChildElm : function(elm) {
            var nodeElem = $(elm).parents('.j_container');
            var node = nodeElem.data('mindNode');
            return node;
        },
        _nodeAppend : function(parentNode , appendNode) {

            var self = this;

            //遍历节点，依次添加事件
            appendNode.breadthFirstSearch(function(node) {
                if(!node.parent.isRoot) {
                    node.direction = node.parent.direction;
                }

                if(node.parent.isRoot) {
                    node.setRootVisibleNode();
                } else {
                    node.setNormalVisibleNode();
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
            } else {
                this.needRepaint();
            }
        },
        setTitle : function(title) {
            this.rootElem.find('.tk_title').html(title);
        },
        addToLeftTree : function(node) {
            this.mindRoot.addToLeft(node);
        },
        addToRightTree : function(node) {
           this.mindRoot.addToRight(node);
        },
        add : function(node) {

            var index = Math.floor(Math.random() * 2);
            if(index == 0) {
                this.addToLeftTree(node);
            } else {
                this.addToRightTree(node);
            }
        },
        needRepaint : function() {

            this.alignCenter();

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

            this.updatePaths();

            this.trigger('doRepaint');
        },
        updatePaths : function() {

            var self = this;

            //更新之前先清除之前的
            this.clearPaths();
            //更新路径
            this._addPaths();
        },
        _addPaths : function() {
            var self = this;
            this.mindRoot.breadthFirstSearch(function(node) {
                return !node.isOpened;
            }, function(node){
                if(!node.isRoot)  {
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
        },
        /**
         * 相对于map的中心位置
         */
        centerPosInMap : function() {

            var mapOffset = this.elem.offset();
            var rootOffset = this.mindRoot.rootElem.offset();

            return {
                x : rootOffset.left - mapOffset.left,
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
        },
        _isCurrentSelectedIsRoot : function() {
            return this.currentSelected && this.currentSelected.isRoot;
        },
        _getCurrentSelectedNode : function() {
            return this.currentSelected;
        },
        _didClickEnter : function() {
            if(this.currentSelected) {
                var node = new MindNode(null , {
                    title : ' '
                });

                if(this._isCurrentSelectedIsRoot()) {
                    this.mindRoot.addToRight(node);
                    this.enterEdit(node);
                } else {
                    var mindNode = this._getCurrentSelectedNode();
                    mindNode.addChild(node);
                    this.enterEdit(node);
                }
            }
        },
        _didClickSpace : function(){
            if(this.currentSelected) {
                var node = new MindNode(null , {
                    title : ' '
                });

                if(this._isCurrentSelectedIsRoot()) {
                    this.mindRoot.addToLeft(node);
                    this.enterEdit(node);
                } else {
                    var mindNode = this._getCurrentSelectedNode();
                    mindNode.addChild(node);
                    this.enterEdit(node);
                }
            }
        },
        _didClickRight : function() {

            if(this.currentSelected) {
                if(this._isCurrentSelectedIsRoot()) {
                    var firstRightChild = this.mindRoot.getFirstRightChild();
                    firstRightChild && this._doSelect(firstRightChild);
                } else {
                    var mindNode = this._getCurrentSelectedNode();
                    if(mindNode.direction == DirectionEnum.right) {
                        if(mindNode.getChilds().length > 0) {
                            this._doSelect(mindNode.getFirstChild());
                        }
                    } else {
                        this._doSelect(mindNode.parent);
                    }    
                }
            }
        },
        _didClickLeft : function() {
            if(this.currentSelected) {
                if(this._isCurrentSelectedIsRoot()) {
                    var firstLeftChild = this.mindRoot.getFirstLeftChild();
                    firstLeftChild && this._doSelect(firstLeftChild);
                } else {
                    var mindNode = this._getCurrentSelectedNode();
                    if(mindNode.direction != DirectionEnum.right) {
                        if(mindNode.getChilds().length > 0) {
                            this._doSelect(mindNode.getFirstChild());
                        }
                    } else {
                        this._doSelect(mindNode.parent);
                    } 
                }
            }
        },
        _didClickUp : function() {
            if(this.currentSelected) {
                if(!this._isCurrentSelectedIsRoot()) {
                    var mindNode = this._getCurrentSelectedNode();
                    if(mindNode.parent == this.mindRoot) {
                        var leftSibling = this.mindRoot.getRootLeftSibling(mindNode);
                        if(leftSibling) {
                            this._doSelect(leftSibling);
                        }
                    } else {
                        if(mindNode.leftSibling) {
                            this._doSelect(mindNode.leftSibling);
                        }
                    }
                }
            }
        },
        _didClickDown : function() {
            if(this.currentSelected) {
                if(!this._isCurrentSelectedIsRoot()) {
                    var mindNode = this._getCurrentSelectedNode();
                    if(mindNode.parent == this.mindRoot) {
                        var rightSibling = this.mindRoot.getRootRightSibling(mindNode);
                        if(rightSibling) {
                            this._doSelect(rightSibling);
                        }
                    } else {
                        if(mindNode.rightSibling) {
                            this._doSelect(mindNode.rightSibling);
                        }
                    }
                }
            }
        },
        _didClickDelete : function() {

            if(this.currentSelected) {
                if(!this._isCurrentSelectedIsRoot()) {
                    var mindNode = this._getCurrentSelectedNode();
                    this._doSelect(mindNode.parent);
                    mindNode.remove();
                }
            } 
        },
        enterEdit : function(node) {
            this._doSelect(node);
            this.editPanel.enterEdit(node);
        },
        leaveEdit : function(node) {
            this.editPanel.leaveEdit(node);
        }

    });

    //混入原型对象
    Events.mixTo(Map);

    return Map;
});