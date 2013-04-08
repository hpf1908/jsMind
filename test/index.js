/**
 * shape 
 */
define(function(require, exports, module) {

    var Stage = require('js/jsMind/stage');
    var MindNode = require('js/jsMind/core/MindNode');

    return {
        init : function() {

            var testFunc = this['test add'];

            testFunc();
        },
        'test add' : function() {

             var stage = new Stage({
                width  : 300,
                height : 300,
                elem   : '#stage'
              });

             var map = stage.getMap();

             for (var i = 0; i < 3; i++) {
                 var node = new MindNode(null , {
                    title : 'left' + i,
                    isRootChild : true
                 });

                 map.addToLeftTree(node);

                 var child = new MindNode(null , {
                    title : 'child' + i,
                    isRootChild : false
                 });

                 node.addChild(child);

                 var child = new MindNode(null , {
                    title : 'child' + i,
                    isRootChild : false
                 });

                 node.addChild(child);
             }
             
            for (var i = 0; i < 3; i++) {
                 var node = new MindNode(null , {
                    title : 'right' + i,
                    isRootChild : true
                 });

                 map.addToRightTree(node);

                 // console.log('right');
                 // console.log(node.getPos());
            }
        }
    }
});