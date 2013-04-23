/**
 * path 
 */
define(function(require, exports, module) {

    var Class    = require('Class');
    var Util     = require('../helper/util');
    var Raphael  = require('Raphael'); 

    var Path = Class.create({
        initialize: function(paper , options) {
            this.paper = paper;
            this.opts = Util.extend({
            },options);
            this.paths = [];
        },
        smoothCurveTo : function(from , to) {

            var pathStr = Raphael.format("M{0} {1}Q{2} {3} {4} {5}", from.x, from.y, from.x ,to.y , to.x, to.y);
            var path = this.paper.path(pathStr);

            path.attr({
                'stroke-width' : 2.2,
                'stroke-linecap' : 'round',
                'stroke' : '#969696'
            });
            this.paths.push(path);
        },
        smoothRoundTo : function(from , to) {

            var path1 = Raphael.format("M{0} {1}Q{2} {3} {4} {5}", from.x, from.y, from.x ,to.y , to.x, to.y);
            var path2 = Raphael.format("Q{0} {1} {2} {3}", from.x ,to.y , from.x - 5, from.y);
            var pathStr = path1 + path2;
            
            var path = this.paper.path(pathStr);
            path.attr({
                'stroke-width' : 2.2,
                'stroke-linecap' : 'round',
                'stroke' : '#969696',
                'fill' : '#969696'
            });
            this.paths.push(path);
        },
        lineTo : function(from , to) {
            var pathStr = Raphael.format("M{0} {1}L{2} {3}", from.x, from.y , to.x, to.y);
            this.paths.push(this.paper.path(pathStr));
        },
        clear : function() {
            for (var i = 0 , len = this.paths.length; i < len; i++) {
                var path = this.paths[i];
                path.remove();
            }
            this.paths = [];
        }
    });

    return Path;
});