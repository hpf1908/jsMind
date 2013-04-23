/**
 * shape 
 */
define(function(require, exports, module) {

    var Stage    = require('js/jsMind/stage');
    var MindNode = require('js/jsMind/core/MindNode');
    var $        = require('jQuery');
    var JSON     = require('JSON');

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

            // var testFunc = this['test root childs'];
            // var testFunc = this['test has with childs'];
            var testFunc = this['test has edit'];
            // var testFunc = this['test export json'];
            // var testFunc = this['test import from json'];
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
                elem   : '#stage',
                enableEdit  : false
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
             
            for (var i = 0; i < 5; i++) {
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
        },
        'test has edit' : function() {
            var stage = new Stage({
                elem   : '#stage',
                enableEdit  : true
            });

            autoResize(stage);
        },
        'test export json' : function() {
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

            console.log(map.exportToJson());
        },
        'test import from json' : function() {
            var jsonStr = '[{"id":"uuid_13663012609831","title":"empty","direction":-1,"parent":null,"isRootChild":false},{"id":"uuid_13663012609932","title":"测试节点","direction":0,"parent":"uuid_13663012609831","isRootChild":true},{"id":"uuid_13663012609963","title":"测试节点","direction":0,"parent":"uuid_13663012609831","isRootChild":true},{"id":"uuid_13663012609984","title":"测试节点","direction":0,"parent":"uuid_13663012609831","isRootChild":true},{"id":"uuid_13663012610005","title":"right0","direction":1,"parent":"uuid_13663012609831","isRootChild":true},{"id":"uuid_13663012610026","title":"right1","direction":1,"parent":"uuid_13663012609831","isRootChild":true},{"id":"uuid_13663012610037","title":"right2","direction":1,"parent":"uuid_13663012609831","isRootChild":true},{"id":"uuid_13663012610058","title":"right3","direction":1,"parent":"uuid_13663012609831","isRootChild":true},{"id":"uuid_13663012610079","title":"right4","direction":1,"parent":"uuid_13663012609831","isRootChild":true}]';
            
            var stage = new Stage({
                elem   : '#stage'
            });

            stage.getMap().importFromJson(jsonStr);
        }
    }
});