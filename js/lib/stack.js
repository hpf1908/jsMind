/**
 * stack 
 */
define(function(require, exports, module) {

   var Stack = function(){
        this.top = -1;
        this.stack = [];
    }

    Stack.prototype.push = function(item){
        if(this.top >= -1) {
            this.stack[++this.top] = item;
            return true;
        } else {
            return false;
        }
    }

    Stack.prototype.pop = function(){
        if(this.top >= 0) {
            return this.stack[this.top--];
        } else {
            return null;
        }
    }

    Stack.prototype.empty = function(){
        return this.top <= -1;
    }

    return Stack;
});