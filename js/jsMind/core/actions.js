/**
 * 记录用户的操作
 */
define(function(require, exports, module) {

    var Class    = require('Class');
    var Const    = require('./const');
    var Util     = require('../helper/util');

    var DirectionEnum = Const.DirectionEnum;

    var Actions = Class.create({
        initialize : function(map) {
            this.map = map;
            this.current = -1;
            this.actions = [];
        },
        undo : function() {

            if(this.current >=0 && this.actions.length > 0){
                var action = this.actions[this.current--];
                this._undo(action);
            }
        },
        redo : function() {
            if(this.current < this.actions.length - 1) {
                var action = this.actions[++this.current];
                this._redo(action);
            }
        },
        ondo : function(name , oper) {

            if(this.current != this.actions.length - 1) {
                this.actions = this.actions.slice(0 , this.current + 1);
            }

            this.actions.push({
                name      : name,
                operation : oper
            });
            this.current = this.actions.length - 1;
        },
        _undo : function(action) {
            var operation = action.operation;

            if(action.name == 'add') {
                this._doRemove(operation);
            } else if(action.name == 'edit') {          
                var target = operation.target;
                this._doEdit(target, operation.name, operation.srcValue);
            } else if(action.name == 'remove') {
                this._doAdd(operation);
            }
        },
        _redo : function(action) {

            var operation = action.operation;

            if(action.name == 'add') {
                this._doAdd(operation);
            } else if(action.name == 'edit') {          
                var target = operation.target;
                this._doEdit(target, operation.name, operation.destValue);
            } else if(action.name == 'remove') {
                this._doRemove(operation);
            }
        },
        _doEdit : function(node , name , value) {

            if(name == 'title') {
                node.setTitle(value);
            }
        },
        _doAdd : function(operation) {
            var parent = operation.parent;
            var child  = operation.child;

            if(parent.isRoot) {
                if(child.direction == DirectionEnum.left) {
                    parent.addToLeft(child);
                } else {
                    parent.addToRight(child);
                }
            } else {
                parent.addChild(child);
            }
        },
        _doRemove: function(operation) {
            var child = operation.child;
            if(this.map.currentSelected == child) {
                this.map._doSelect(child.parent);
            }
            child.remove();
        },
        onAdd : function(parent , child) {

            this.ondo('add' , {
                parent  : parent,
                child   : child
            });
        },
        onRemove : function(parent , child) {

            this.ondo('remove',{
                parent  : parent,
                child   : child
            });
        },
        onEdit : function(name , target, srcValue , destValue) {

            this.ondo('edit',{
                name      : name,
                target    : target,
                srcValue  : srcValue,
                destValue : destValue
            });
        }
    });

    return Actions;
});