/**
 * shape 
 */
define(function(require, exports, module) {

    var Class    = require('Class');
    var Util     = require('../helper/util');
    var Raphael  = require('Raphael');

    // Raphael.fn.arrow = function (x1, y1, x2, y2, size) {

    //     var angle = Math.atan2(x1-x2,y2-y1);
    //     angle = (angle / (2 * Math.PI)) * 360;
    //     var arrowPath = this.path('M' + x2 + ' ' + y2 + ' L' + (x2 - size) + ' ' + (y2 - size) + ' L' + (x2 - size) + ' ' + (y2 + size) + ' L' + x2 + ' ' + y2 ).attr('fill','black').rotate((90+angle),x2,y2);
    //     var linePath = this.path('M' + x1 + ' ' + y1 + ' L' + x2 + ' ' + y2);
        
    //     return [linePath,arrowPath];
    // }   

    var Path = Class.create({
        initialize: function(paper , options) {
            
            this.paper = paper;
            this.opts = Util.extend({
            },options);
        },
        setPos : function(from , to) {

            if(this.rPath) {
                this.rPath.remove();
            }

            // var pathStr = Raphael.format("M{0} {1}L{2} {3}", from.x, from.y, to.x, to.y);
            // var pathStr = Raphael.format("M{0} {1}S{2} {3} {4} {5}", from.x, from.y, 80 ,50 , to.x, to.y);
            var pathStr = Raphael.format("M{0} {1}T{2} {3}", from.x, from.y, to.x, to.y);
            this.rPath= this.paper.path(pathStr);
        }
    });

    return Path;
});