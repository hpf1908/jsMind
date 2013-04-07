/**
 * queue 
 */
define(function(require, exports, module) {

   var Queue = function(){
        this.queue = [];
    }

    Queue.prototype.enQueue = function(item){
        this.queue.push(item);
    }

    Queue.prototype.deQueue = function(){
        if(this.queue.length > 0) {
            return this.queue.splice(0 , 1)[0];
        } else {
            return null;
        }
    }

    Queue.prototype.empty = function(){
        return this.queue.length <= 0;
    }

    return Queue;
});