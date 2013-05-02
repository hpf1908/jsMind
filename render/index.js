/**
 * shape 
 */
define(function(require, exports, module) {

    var Stage       = require('js/jsMind/stage');
    var MindNode    = require('js/jsMind/core/mindNode');
    var TreeLayout  = require('js/jsMind/core/treeLayout');
    var $           = require('jQuery');
    var JSON        = require('JSON');
    var JsonStr     = require('./temp');

    var addChildsToNode = function(node , childsNum) {

        for (var i = 0; i < childsNum; i++) {
             var child = new MindNode(null , {
                title : '测试节点'
             });
             node.addChild(child);
        }
        return node;
    }

    var autoResize = function(stage) {
        $(window).bind('resize' , function() {
            var width = $(window).width();
            var height = $(window).height();
            stage.setSize( width , height );
        });
    }


    return {
        init : function() {

            var stage = new Stage({
                elem   : '#stage'
            });

            stage.getMap().importFromJson(JsonStr);    

            window.mindMap = stage.getMap();
        }  
    }
});