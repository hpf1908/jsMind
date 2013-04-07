/**
* @fileOverview
* @author hpf1908
* @version
* @requires jQuery
* @update
*/
define(function(require, exports, module){

	var  Log = require('./log');
	/**
	 * 公用模板函数
	 * @class PY.Template
	 * @static
	 */
	var MOD = {
		/**
		 * 基于simpleTemplate的公用模板函数
		 * @method parse
		 * @param {string} 模板对应的script的id或者模板字符串
		 * @param {object} 模板数据对象
		 * @return {string} 返回模板生成后的片段
		 */
		parse:(function () {
			var cache = {};
			return function(str, data){

				if(typeof str === 'function'){
					return  data ? str(data) : str;
				}

				var fn = !/\W/.test(str) ? cache[str] = cache[str] ||
				arguments.callee.call(this,document.getElementById(str).innerHTML) : new Function("obj", "var p=[],print=function(){p.push.apply(p,arguments);};" +
				"with(obj){p.push('" +
				str.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") +
				"');}return p.join('');");

				/*
				 * 做一个try catch，便于捕获异常
				 * by flyhuang
				 */
				if(data) {
					try {
						return fn(data);
					} catch (e) {
						Log.info('begin： simpleTemplate 渲染出错：' + e.message);
						Log.info(str);
						Log.info(data);
						Log.info('end： simpleTemplate 渲染出错');
						return '模板渲染出错了，查看控制台详细错误信息';
					}
				} else {
					return fn;
				}
			};
		})()
	};

	return MOD;
});