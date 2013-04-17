/**
 * editTextarea 
 */
define(function(require, exports, module) {

    var Class    = require('Class');
    var Util     = require('../helper/util');
    var Const    = require('./const');
    var Events   = require('Events');
    var $        = require('jQuery');

    var EditTextArea = Class.create({

        initialize: function(options) {

            this.opts = Util.extend({
                elem       : '',
                isRootNode : false,
                mindNode   : null    //绑定的mindNode，注意循环引用
            }, options);

            this.elem = $(this.opts.elem);
            this._bindEvents();
        },
        _bindEvents : function() {

            this.elem.bind('focus' , function(){
                return false;
            });
        },
        focus : function() {
            this.elem.focus();
        },
        val : function(text){
            if(text) {
                this.elem.val(text);
            } else {
                return this.elem.val();
            }
        },
        clear : function() {
            this.elem.val('');
        }
    });

    Events.mixTo(EditTextArea);

    return EditTextArea;
});