var xj = {};
xj.DatePicker = function( config ){
  var doc = document,
		column = 7, // 日期组件列数
		dom = {}, //存放事件操作使用的dom元素
		now = new Date(), // 取得当前时间
		cacheTime = {  //存放选定的时间
			year : now.getFullYear(),
			mon : now.getMonth(),
			date : now.getDate(),
			day : now.getDay()
		}, 
		minYear = config.minYear ? config.minYear : 0,
		maxYear = config.maxYear ? config.maxYear : 0,
		startYear = minYear ? minyear : 1980,
		endYear = maxYear ? maxYear : startYear + 50,
		monTxt = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],

		calender = doc.createElement('div'),
		head = doc.createElement('div'),
		body = doc.createElement('div'),
		prev = doc.createElement('a'),
		next = doc.createElement('a'),
		select = doc.createElement('div'),
		year = doc.createElement('div'),
		mon = doc.createElement('div');

		calender.id = 'calender';
		year.className = 'year';
		mon.className = 'mon';
		prev.className = 'prevBtn';
		prev.appendChild( doc.createTextNode('«') );
		next.className = 'nextBtn';
		next.appendChild( doc.createTextNode('»') )
		head.className = 'dateHead';
		select.className = 'select';
		body.className = 'dateTable';

		head.appendChild(prev);
		head.appendChild(select);
		head.appendChild(next);
		select.appendChild(year);
		select.appendChild(mon);
		calender.appendChild(head);
		calender.appendChild(body);

		dom.calender = calender;
		dom.prev = prev;
		dom.next = next;
		dom.yearSelect = year;
		dom.monSelect = mon;
		dom.body = body;
		dom.select = select;

		if(doc.getElementById('calender')){
			doc.getElementById('calender').style.display = 'block';
		}

	var _hasClass = function(ele, cls){
		var className = ele.className;
		if( className.indexOf(cls) > -1 ){
			return true;
		} else {
			return false;
		}
	},

	_monOption = function(){
		var temp = [], 
			obj = {};
		for( var i = 0; i <12; i++ ){
			obj = {};
			obj.txt = monTxt[i];
			obj.value = i;
			temp.push(obj);
		}
		return temp;
	}(),

	_yearOption = function(){
		var temp = [], obj = {}
		do{
			obj = {};
			obj.txt = startYear+'年';
			obj.value = startYear;
			temp.push(obj);
			startYear++;
		} while ( startYear < endYear );
		return temp;
	}(),

	_createList = function( ele, optionList, name){
		var ul = doc.createElement('ul'), li, selected;
		if( name == 'year'){
			selected = cacheTime.year;
			ul.className = 'op-list year-list none';
			dom.yearList = ul;
		} else {
			selected = cacheTime.mon;
			ul.className = 'op-list mon-list none';
			dom.monList = ul;
		}
		for( var i = 0, len = optionList.length; i < len; i++){
			li = doc.createElement('li');
			li.setAttribute('data-option', JSON.stringify(optionList[i]));
			li.appendChild( doc.createTextNode(optionList[i].txt) );
			if( selected == i ){
				li.className = 'list-now';
			}
			ul.appendChild(li);
		}
		ele.appendChild(ul);
		return ul;
	},

	_creatSelect = function( ele, name){
		var span = doc.createElement('span'),
			a = doc.createElement('a'),
			div = doc.createElement('div');
		div.appendChild(span);
		div.appendChild(a);
		if( name == 'year'){
			a.id = 'option-year-btn';
			div.className = 'op-container op-year';
			div.appendChild( _createList(ele, _yearOption, 'year') );
			span.appendChild( doc.createTextNode(cacheTime.year+'年') );
			span.setAttribute('data-value', cacheTime.year);
		} else {
			a.id = 'option-mon-btn';
			div.className = 'op-container op-mon';
			div.appendChild( _createList(ele, _monOption, 'mon'));
			span.appendChild( doc.createTextNode( monTxt[cacheTime.mon] ) );
			span.setAttribute('data-value', cacheTime.mon);
		}
		ele.appendChild(div);
		return span;
	},

	_month =  function( year ){
		if( year%4 === 0 && year%100 !== 0 || year%400 === 0 ){
			return [31,29,31,30,31,30,31,31,30,31,30,31];
		} else {
			return [31,28,31,30,31,30,31,31,30,31,30,31];
		}
	}(cacheTime.year),
	
	// 取得 当前 年月的第一天和最后一天星期几
	_getDay = function(year, mon){
		var date_first = new Date(year, mon, 1);
		var date_last = new Date(year, mon, _month[mon]);
		return {
			first : date_first.getDay(),
			last : date_last.getDay()
		}
	},
	
	// 求得 表格中td的总数
	_getRow = function(year, mon){
		var day = _getDay(year, mon);
		return Math.ceil(((day.first - 1) + _month[mon] + (7-day.last))/7);
	},
	
	_createThead = function(){
		var days = ['一','二','三','四','五','六','日'];
		var td = null, doc = document, tr = doc.createElement('tr'), thead = doc.createElement('thead');
		for( var i = 0; i < column; i++){
			td = doc.createElement('td');
			td.appendChild( doc.createTextNode(days[i]) );
			tr.appendChild(td);
		}
		thead.appendChild(tr);
		return thead;
	},
	
	_createTbody = function(year, mon){
		var td = null, tr = null, doc = document, tbody = doc.createElement('tbody');
		var day = _getDay(year, mon);
		var rows = _getRow(year, mon);
		var loop_first = day.first == 0 ? 0 : day.first-1;
		var loop_last = day.last == 7 ? 0 : 7-day.last;
		var tr = doc.createElement('tr');
		
		// 产生第一行
		var temp = 0;
		var temp_first = loop_first;
		while(loop_first){
			td = doc.createElement('td');
			td.appendChild( doc.createTextNode(_month[(mon-1)<0? 11 : mon-1]-loop_first+1) );
			tr.appendChild(td);
			loop_first--;
			temp++;
		}
		for( var i = 1; i <= 7-temp_first; i++){
			td = doc.createElement('td');
			td.appendChild( doc.createTextNode(i) );
			tr.appendChild(td);
		}
		tbody.appendChild(tr);
		// 产生中间部分
		for(var r = 1; r < rows-1; r++ ){
			tr = doc.createElement('tr');
			for( var j = 0; j < 7; j++ ){
				td = doc.createElement('td');
				td.appendChild( doc.createTextNode(i++) );
				tr.appendChild(td);
			}
			tbody.appendChild(tr);
		}
		// 产生最后一行
		tr = doc.createElement('tr');
		for( var j = 0; j < day.last; j++){
			td = doc.createElement('td');
			td.appendChild( doc.createTextNode(i++) );
			tr.appendChild(td);
		}
		temp = 1;
		while(loop_last){
			td = doc.createElement('td');
			td.appendChild( doc.createTextNode(temp) );
			tr.appendChild(td);
			loop_last--;
			temp++;
		}
		tbody.appendChild(tr);
		return tbody;
	},
	
	initTable = function(year, mon){
		var doc = document,
			table = doc.createElement('table');
		table.appendChild( _createThead() );
		table.appendChild( _createTbody(year,mon) );
		body.innerHTML = '';
		body.appendChild(table);
		if( !doc.getElementById('calender') ){
			doc.body.appendChild(calender);
		}
	};

	dom.yearText = _creatSelect(year, 'year');
	dom.monText = _creatSelect(mon, 'mon');

	initTable(cacheTime.year, cacheTime.mon);

	var Handlers = {
		prev : function(e){
			e = util.getEvent(e);
			var target = util.getTarget(e),
				val = parseInt( dom.yearText.getAttribute('data-value') );
			cacheTime.year = val - 1;
			dom.yearText.innerHTML = cacheTime.year + '年';
			dom.yearText.setAttribute('data-value', cacheTime.year);
			initTable(cacheTime.year, cacheTime.mon);
		},
		next : function(e){
			e = util.getEvent(e);
			var target = util.getTarget(e),
				val = parseInt( dom.yearText.getAttribute('data-value') );
			cacheTime.year = val + 1;
			dom.yearText.innerHTML = cacheTime.year + '年';
			dom.yearText.setAttribute('data-value', cacheTime.year);
			initTable(cacheTime.year, cacheTime.mon);
		},
		select : function(e){
			e = util.getEvent(e);
			var target = util.getTarget(e),
				nodeName = target.nodeName.toLowerCase();
			if( nodeName ==='a' ) {
				target.nextSibling.style.display = 'block';
			} else if ( nodeName === 'span' ) {
				target.nextSibling.nextSibling.style.display = 'block';
			} else if ( nodeName === 'div' ) {
				target.children[2].style.display = 'block';
			} else if( nodeName === 'li' ){
				var className = target.parentNode.className,
					option = JSON.parse( target.getAttribute('data-option') );
				if( className.indexOf('year') > -1 ){
					dom.yearText.innerHTML = option.txt;
					dom.yearText.setAttribute('data-value', option.value);
					cacheTime.year = option.value;
				} else if( className.indexOf('mon') > -1 ){
					dom.monText.innerHTML = option.txt;
					dom.monText.setAttribute('data-value', option.value);
					cacheTime.mon = option.value;
				}
				target.parentNode.style.display = 'none';
				initTable(cacheTime.year, cacheTime.mon);
			}
		},
		body : function(e){
			e = util.getEvent(e);
			var target = util.getTarget(e),
				nodeName = target.nodeName.toLowerCase();
			if( nodeName === 'td' ){
				cacheTime.date = target.innerHTML;
				cacheTime.day = '';
				$(config.dateId).val(cacheTime.year+'-'+(cacheTime.mon+1)+'-'+cacheTime.date);
				dom.calender.style.display = 'none';
			}
		}
	}
	for( var key in Handlers ){
		util.on(dom[key],'click', Handlers[key]);
	}
	var setPostion = function(){
		var offset = $(config.dateId).offset();
		var height = $(config.dateId).outerHeight();
		dom.calender.style.left = offset.left+'px';
		dom.calender.style.top = offset.top + height +'px';
	}
	setPostion();
};
$('#datePicker').click(function(){
	xj.DatePicker({
		dateId : '#datePicker'
	});
});
