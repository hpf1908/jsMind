/**
 * shape 
 */
define(function(require, exports, module) {

    var Stage    = require('js/jsMind/stage');
    var MindNode = require('js/jsMind/core/MindNode');
    var $        = require('jQuery');

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
            var width = $(window).width() - 30;
            var height = $(window).height() - 30;
            stage.setSize( width , height );
        });
    }


    return {
        init : function() {

            // var testFunc = this['test root childs'];
            var testFunc = this['test has with childs'];

            testFunc();
        },
        'test root childs' : function() {

            var stage = new Stage({
                elem   : '#stage'
            });

            var map = stage.getMap();
            var leftNum = 3;
            var rightNum = 5;

            autoResize(stage);

            for (var i = 0; i < leftNum; i++) {
                 var node = new MindNode(null , {
                    title : '测试节点'
                 });
                 map.addToLeftTree(node);
             }
             
            for (var i = 0; i < rightNum; i++) {
                 var node = new MindNode(null , {
                    title : 'right' + i
                 });

                 map.addToRightTree(node);
            }
        },
        'test has with childs' : function() {

            var stage = new Stage({
                elem   : '#stage'
              });

            var map = stage.getMap();

            autoResize(stage);

            for (var i = 0; i < 2; i++) {
                var node = new MindNode(null , {
                    title : 'left' + i
                });

                map.addToLeftTree(node);
                addChildsToNode(node , 3);
            }
             
            for (var i = 0; i < 3; i++) {
                var node = new MindNode(null , {
                    title : 'right' + i
                 });

                addChildsToNode(node , Math.floor(Math.random() * 10));

                var parent = new MindNode(null , {
                    title : 'test' + i
                });

                node.addTo(parent);

                var newNode = new MindNode(null , {
                    title : 'right' + i
                });
                
                parent.addTo(newNode);

                map.addToRightTree(newNode);
            }
        }
    }
});