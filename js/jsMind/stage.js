/**
 * stage 
 */
define(function(require, exports, module) {

    var Class    = require('Class');
    var $        = require('jQuery');
    var Raphael  = require('Raphael');
    var Util     = require('./helper/util');
    var Template = require('./helper/template');
    var Log      = require('./helper/log');
    var Path     = require('./core/path');
    var Map      = require('./core/map');
    var Events   = require('Events');
    var Layout    = require('./core/layout');

    var Stage = Class.create({
        initialize: function(options) {

            this.opts = Util.extend({
                clazz       : 'default',  //classic,default
                elem        : null,
                width       : $(window).width(),
                height      : $(window).height(),
                canvasWidth : 10000,
                canvasHeight: 6000,
                enableDrag  : true,
                enableEdit  : false,
                layout      : new Layout()
            },options);

            this.elem = $(this.opts.elem);

            if(this.elem.get(0)) {
                this._prepareStage();
                this._prepareTreeMap();
            } else {
                Log.error('not exist element');
            }

            this.scrollToCenter();
            this._bindEvents();
        },
        _prepareStage : function() {

            var canvas = $('<div class="canvas"></div>');

            canvas.addClass(this.opts.clazz);

            this.elem.width(this.opts.width)
                   .height(this.opts.height)
                   .addClass('jsmind-Stage')
                   .append(canvas);

            canvas.width(this.opts.canvasWidth).height(this.opts.canvasHeight);

            this.canvas = canvas;

            var paperElm = $('<div class="paper"></div>');

            this.paperElm = paperElm;
            canvas.append(paperElm);
            this.rPaper = Raphael(paperElm.get(0) , this.opts.canvasWidth, this.opts.canvasHeight);

            var mapElm = $('<div class="map"></div>');
            canvas.append(mapElm);
            this.mapElm = mapElm;
        },
        _prepareTreeMap : function() {

            this.map = new Map({
                container : this.mapElm,
                rPaper: this.rPaper,
                enableEdit  : this.opts.enableEdit,
                layout : this.opts.layout
            });

            this.map.on('doRepaint' , this._didMapRepaint, this);

        },
        _bindEvents : function() {

            var self = this;

            this.elem.bind('mousemove',function(e) {
                self._moveDrag(e);
            }).bind('mousedown' , function(e){

                if(e.which == 1 && self.opts.enableDrag) {
                    self._startDrag(e);
                }

            }).bind('mouseup',function(e){
                self._endDrag();
            }).bind('mouseleave',function(e){
                self._endDrag();
            });
        },
        _startDrag : function(e) {
            this._onDrag = true; 
            this._lastPos = {
                x : e.clientX,
                y : e.clientY
            }
        },
        _moveDrag : function(e){

            if(this._onDrag) {
                var distanceX = e.clientX - this._lastPos.x;
                var distanceY = e.clientY - this._lastPos.y;
                var top  = this.elem.scrollTop();
                var left = this.elem.scrollLeft(); 

                this.elem.scrollTop(top - distanceY).scrollLeft(left - distanceX);
                this._lastPos = {
                    x : e.clientX,
                    y : e.clientY
                }
            }
        },
        _endDrag : function() {
            this._onDrag = false;
        },
        _didMapRepaint : function() {
            //在底层重绘后执行相关操作
        },
        /**
         * 设置map为中央
         */
        scrollToCenter : function() {

            var canvasWidth  = this.opts.canvasWidth;
            var canvasHeight = this.opts.canvasHeight;

            var stageWidth  = this.opts.width;
            var stageHeight = this.opts.height;

            var posX = (canvasWidth - stageWidth) / 2.0;
            var posY = (canvasHeight - stageHeight) / 2.0;

            this.elem.scrollTop(posY).scrollLeft(posX);
        },
        getMap : function() {
            return this.map;
        },
        setSize : function(width , height) {
            this.elem.width(width).height(height);
            this.opts.width = width;
            this.opts.height = height;
            this.scrollToCenter();
            this.map.needRepaint();
        },
        /**
         * ie9以下使用font-size百分比实现
         */
        scale : function(scale , time) {

            time = time ? time : 500;

            this.elem.css({
                'transition' : time + 'ms',
                '-webkit-transition': time + 'ms',
                '-webkit-transform': 'scale('+ scale +  ')',
                '-ms-transform': 'scale('+ scale +  ')',
                '-moz-transform': 'scale('+ scale +  ')',
                '-ms-transform-x': '50%',
                '-ms-transform-y': '50%',
                '-webkit-transform-origin': '50% 50%',
                '-moz-transform-origin': '50% 50%',
                '-o-transform-origin': '50% 50%'
            });
        }
    });

    //混入原型对象
    Events.mixTo(Map);

    return Stage;
});