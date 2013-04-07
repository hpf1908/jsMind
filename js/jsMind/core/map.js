/**
 * shape 
 */
define(function(require, exports, module) {

    var Class    = require('Class');
    var Util     = require('../helper/util');
    var MindNode = require('./mindNode');

    var Map = Class.create({
        initialize: function(options) {

            this.opts = Util.extend({
                container : null
            },options);

            var str =  ['<div id="tk_rootchildren_left" class="tk_children"></div>',
                        '<div id="tk_rootcontainer">',
                            '<div class="tk_label root">',
                                '<div class="tk_title">jsMind</div>',
                            '</div>',
                        '</div>',
                        '<div id="tk_rootchildren_right" class="tk_children"></div>'].join('');

            this.elem = $(this.opts.container);
            $(str).appendTo(this.elem);

            this.rootElem = $('#tk_rootcontainer');
            this.leftChildRootElm = $('#tk_rootchildren_left');
            this.rightChildRootElm = $('#tk_rootchildren_right');

            //创建ui
            this._createUi();
        },
        _createUi : function() {

            var leftRoot = new MindNode(null , {
                title : 'empty',
                isRootChild : false,
                isFake : true,
                fakeElem : this.leftChildRootElm
            });

            this.leftRootNode = leftRoot;

            var rightRoot = new MindNode(null , {
                title : 'empty',
                isRootChild : false,
                isFake : true,
                fakeElem : this.rightChildRootElm
            });

            this.rightRootNode = rightRoot;
        },
        setTitle : function(title) {
            this.rootElem.find('.tk_title').html(title);
        },
        getLeftTreeRoot : function() {
            return this.leftRootNode;
        },
        getRightTreeRoot : function() {
            return this.rightRootNode;
        },
        addToLeftTree : function(node) {
            var root = this.getLeftTreeRoot();
            root.addChild(node);
        },
        addToRightTree : function(node) {
            var root = this.getRightTreeRoot();
            root.addChild(node);
        },
        add : function(node) {
            this.addToLeftTree(node);
        }
    });

    return Map;
});