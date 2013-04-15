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

    var Stage = Class.create({
        initialize: function(options) {

            this.opts = Util.extend({
                class       : 'classic',  //classic,default
                elem        : null,
                width       : $(window).width() - 30,
                height      : $(window).height() -30,
                canvasWidth : 10000,
                canvasHeight: 6000
            },options);

            this.elem = $(this.opts.elem);

            if(this.elem.get(0)) {
                this._prepareStage();
                this._prepareTreeMap();
            } else {
                Log.error('not exist element');
            }

            this.scrollToCenter();
        },
        _prepareStage : function() {

            var canvas = $('<div class="canvas"></div>');

            canvas.addClass(this.opts.class);

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
                rPaper: this.rPaper
            });

            this.map.on('doRepaint' , this._didMapRepaint, this);

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
        }
    });

    //混入原型对象
    Events.mixTo(Map);

    return Stage;
});