var util = {
  getEvent:function(event){ //获得浏览器时事件对象
		return event ? event : window.event;
	},
	getTarget:function(event){ //获取当前操作目标对象
		return event.target || event.srcElement;
	},
	on:function(element,type,handler){  //添加事件,重写事件，减少判断次数
		if(element.addEventListener){
			util.on = function(element,type,handler){element.addEventListener(type,handler,false);}
		}else if(element.attachEvent){
			util.on= function(element,type,handler){element.attachEvent('on' + type, handler);}
		} else{
			util.on= function(element,type,handler){element['on' + type] = handler;}
		}
		util.on(element,type,handler);
	},
	off : function(element,type,handler){  //删除事件,重写事件，减少判断次数
		if(element.removeEventListener){
			util.off= function(element,type,handler){element.removeEventListener(type,handler,false);}
		}else if(element.addEventListener){
			util.off = function(element,type,handler){element.detachEvent('on' + type, handler);}
		} else{
			EventUtil.off= function(element,type,handler){element['on' + type] = null;}
		}
		util.off(element,type,handler);
	},
	preventDefault:function(event){//阻止默认行为
		if(event.preventDefault){
			return event.preventDefault();
		} else {
			return event.returnValue = false;
		}
	},
	stopPropagation:function(event){ //终止冒泡
		if(event.stopPropagation){
			return event.stopPropagation();
		}else{
			return event.cancelBubble = true;
		}
	},
	getCharCode : function(event) { //取得的是keypress时的值。
		if(typeof event.charCode == 'number'){
			return event.charCode;
		} else {
			return event.keyCode;
		}
	},
	getWheelDelta : function(event){
		if(event.wheelDelta){
			return (client.engine.opera && client.engine.opera < 9.5 ? - event.wheelDelta : event.wheelDelta);
		} else {
			return -event.detail * 40;
		}
	}
}




