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
                elem       : ''
            }, options);

            this.elem = $(this.opts.elem);
            this._bindEvents();
        },
        _bindEvents : function() {

            var self = this; 

            this.elem.bind('blur',function(){
                self.trigger('blur');
            });

            this.elem.bind('keydown',function(e){
                if(e.which == 13) {
                    self.trigger('enter');
                    e.preventDefault();
                    return false;
                }
            });
        },
        blur : function() {
            this.elem.blur();
        },
        focus : function() {
            this.elem.focus();
            Util.focusEnd(this.elem.get(0));
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