/**
 * NodeManager 
 */
define(function(require, exports, module) {

    var Class    = require('Class');
    var Util     = require('../helper/util');

    var NodeManager = Class.create({
        initialize: function() {
            this.incrementNum = 0;
            this.randomStr = new Date().getTime();
            this.nodesMap = {};
        },
        uuid : function() {
            return this.randomStr + this.incrementNum++ ;
        }
        setNode : function(uuid , node) {

        },
        getNode : function() {
            return this.nodesMap[uuid];
        }
    }

    return NodeManager;
});