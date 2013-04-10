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

    var Stage = Class.create({
        initialize: function(options) {

            this.opts = Util.extend({
                elem        : null,
                width       : 10000,
                height      : 6000
            },options);

            this.elem = $(this.opts.elem);

            if(this.elem.get(0)) {
                this._prepareStage();
                this._prepareTreeMap();
            } else {
                Log.error('not exist element');
            }
        },
        _prepareStage : function() {

            var canvas = $('<div class="canvas classic"></div>');

            this.elem.width(this.opts.width)
                     .height(this.opts.height)
                     .addClass('jsmind-Stage')
                     .append(canvas);

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
        },
        getMap : function() {
            return this.map;
        }
    });

    return Stage;

});