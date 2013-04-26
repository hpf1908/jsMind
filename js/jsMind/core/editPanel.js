/**
 * editTextarea 
 */
define(function(require, exports, module) {

    var Class    = require('Class');
    var Util     = require('../helper/util');
    var Const    = require('./const');
    var Events   = require('Events');
    var Template = require('../helper/template');
    var $        = require('jQuery');
    var Const    = require('./const');

    var DirectionEnum = Const.DirectionEnum;

    var EditPanel = Class.create({

        initialize: function(options) {

            this.opts = Util.extend({
                elem         : '',
                alignCenter  : false
            }, options);

            this.elem = $(this.opts.elem);
            this._createUi();
            this._bindEvents();
            this.currentNode = null;
        },
        _createUi : function() {

            var resizeHtml = ['<div class="resizer">',
                                '<div class="tk_label" style="cursor: default;">',
                                    '<div class="tk_title"></div>',
                                '</div>',
                              '</div>'].join('');

            this.resizeElm = $(Template.parse(resizeHtml,{}));
            this.resizeLabelElm = this.resizeElm.find('.tk_label');

            var editPanelHtml = ['<div class="editPanel">',
                                    '<div class="tk_label" style="cursor: default;">',
                                        '<textarea wrap="wrap"></textarea>',
                                    '</div>',
                                  '</div>'].join('');

            this.editPanelElm = $(Template.parse(editPanelHtml,{}));
            this.editLabelElm = this.editPanelElm.find('.tk_label');
            this.editPanelElm.hide();
            this.elem.append(this.resizeElm);
            this.elem.append(this.editPanelElm);
        },
        _bindEvents : function() {

            var self = this; 

            this.editAreaElm = this.editPanelElm.find('textarea');

            this.editAreaElm.bind('blur',function(){
                self.leaveEdit();
                self.trigger('blur');
            });

            this.editAreaElm.bind('keydown',function(e){
                if(e.which == 13) {
                    self.editAreaElm.blur();
                    e.preventDefault();
                    return false;
                }
            });

            this.editAreaElm.bind('keyup',function() {
                self._resize(self.val());
            }).bind('change',function(){
                self._resize(self.val());
            });
        },
        blur : function() {
            this.editAreaElm.blur();
        },
        focus : function() {
            this.editAreaElm.focus();
            Util.focusEnd(this.editAreaElm.get(0));
        },
        val : function(text){
            if(text) {
                this.editAreaElm.val(text);
            } else {
                return this.editAreaElm.val();
            }
        },
        clear : function() {
            this.editAreaElm.val('');
        },
        enterEdit : function(mindNode) {

            this.currentNode = mindNode;

            this.resizeLabelElm.add(this.editLabelElm).addClass('selected').addClass('current');

            if(mindNode.isRoot) {
                this._changeToRoot();
            } else if(mindNode.parent.isRoot) {
                this._changeToRootChild();
            } else {
                this._changeToNode();
            }

            mindNode.enterEdit();            
            this._resize(mindNode.getTitle());
            this.focus();
        },
        _resize : function(title) {

            mindNode = this.currentNode;

            var paddingLeft;
            var paddingTop;
            
            if(mindNode.isRoot) {
                paddingLeft = 10;
                paddingTop = 10;
            } else if(mindNode.parent.isRoot) {
                paddingLeft = 3;
                paddingTop = 3;
            } else {
                paddingLeft = 3;
                paddingTop = 3;
            }
            
            var offset = mindNode.getEditPlaceElm().offset();
            var parentOffset = this.editPanelElm.parent().offset();
            this.editAreaElm.val(title);
            title = title.length > 0? title : 'S';
            this.resizeLabelElm.text(title);

            var resizeLabelWidth = this.resizeLabelElm.width();
            var resizeLabelHeight = this.resizeLabelElm.height();
            var resizeWidth = this.resizeElm.width();
            var resizeHeight = this.resizeElm.height();

            this.editAreaElm.width(resizeWidth - paddingLeft * 2)
                            .height(resizeHeight - paddingTop * 2 )
                            .css({
                                'top' : paddingTop + 'px',
                                'left': paddingLeft + 'px'
                            });

            this.editLabelElm.width(resizeLabelWidth).height(resizeLabelHeight);
 
            var top = offset.top - parentOffset.top;
            var left = offset.left - parentOffset.left;

            if(this.opts.alignCenter) {
                var w = mindNode.getEditPlaceElm().width();
                left = left + w/2.0 - this.resizeElm.width() / 2.0;
            } else {
                if(mindNode.direction == DirectionEnum.left) {
                    left = left + mindNode.getEditPlaceElm().width();
                    left -= this.resizeElm.width();  
                } 
            }

            this.editPanelElm.css({
                'top' : top + 'px',
                'left': left + 'px'
            }).show();
            
        },
        leaveEdit : function(mindNode) {

            if(!mindNode) {
                mindNode = this.currentNode;
            }

            if(this.val().length == 0 && mindNode.isRoot) {
                alert('输入不能为空哦');
                return;
            }
            this.resizeLabelElm.add(this.editLabelElm)
                               .removeClass('root')
                               .removeClass('root_child')
                               .removeClass('node');

            var srcValue = mindNode.getTitle();
            mindNode && mindNode.leaveEdit(this.val());
            this.editPanelElm.hide();
            Util.focusDocument();

            this.trigger('leaveEdit',mindNode ,srcValue, this.val());
        },
        _changeToRoot : function() {
            this.resizeLabelElm.add(this.editLabelElm).addClass('root');
        },
        _changeToRootChild : function() {
            this.resizeLabelElm.add(this.editLabelElm).addClass('root_child');
        },
        _changeToNode : function() {
            this.resizeLabelElm.add(this.editLabelElm).addClass('node');
        }
    });

    Events.mixTo(EditPanel);

    return EditPanel;
});