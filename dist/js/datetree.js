/**
 * dateTree.js
 * @zzy
 * @date    2015-03-28 16:14:29
 * @version $Id$
 */
$(function() {
	dateTree.init();
	dateTree._bendEvent();
});

var dateTree = {
	getUrl: g_host + "/ba/1/ck/x/7u/1n/a/2i/sy/st/m",
	utime: {
		"-1": "9223372036854775807",
		"0": "9223372036854775807",
		"1": "9223372036854775807"
	},
	size: 5,
	state: 0,
	sex: 1, //1：男 2：女
	load: '',
	init: function() {
		var me = this;
		me.getList(me.state);
	},
	//获取当前页列表
	getList: function(state, utime, sex) {
		var me = this;
		if (me.load === "") {
			me.load = g_loadMode.init($("#adminContent"));
		} else {
			me.load.show();
		}
		$.ajax({
			url: me.getUrl + "/lt/list",
			type: 'GET',
			dataType: 'jsonp',
			data: {
				"state": state || me.state,
				"utime": utime || me.utime[me.state],
				"sex": sex || me.sex,
				"size": me.size,
				"userid": parseInt(g_loginuser.xunai_uid)
			},
			jsonp: "callbackparam",
			jsonpCallback: "callback"
		}).done(function(data) {
			switch (state) {
				case 0:
					me._renderNocheck(data);
					me._rebendEvent();
					me.load.fadeOut();
					break;
				case 1:
					me._renderChecked(data);
					me.load.fadeOut();
					break;
				case -1:
					me._renderRefusecheck(data);
					me._rebendEvent();
					me.load.fadeOut();
					break;
			}
		});
	},
	//加载更多
	loadMore: function() {
		var me = this;
		me.getList(me.state, me.page[me.state] + 1);
	},
	//通过审核
	passCheck: function(id, dom) {
		var me = this;
		$.ajax({
			url: me.getUrl + "/lt/up",
			type: 'GET',
			dataType: 'jsonp',
			data: {
				"state": 2,
				"id": id,
				"userid": parseInt(g_loginuser.xunai_uid)
			},
			jsonp: "callbackparam",
			jsonpCallback: "callback"
		}).done(function(data) {
			dom.fadeOut(function() {
				var dom = $(this);
				dom.remove();
			});
		});
	},
	//审核拒绝
	refuseCheck: function(id, type, dom) {
		var me = this,
			reasonText = {
				1: "图片审核不通过",
				2: "帖子内容不适合"
			};
		$.ajax({
			url: me.getUrl + "/lt/up",
			type: 'GET',
			dataType: 'jsonp',
			data: {
				"state": -1,
				"id": id,
				"reason": encodeURI(reasonText[type]),
				"userid": parseInt(g_loginuser.xunai_uid)
			},
			jsonp: "callbackparam",
			jsonpCallback: "callback"
		}).done(function(data) {
			$(".head-check-item[data-checkid=" + id + "]").fadeOut(function() {
				var dom = $(this);
				dom.remove();
			});
		});
	},
	//删除审核
	deleteCheck: function() {

	},
	//渲染未审核
	_renderNocheck: function(data) {
		var me = this,
			newTime = 0;
		// $("#noCheckList").html("");
		for (var i = 0; i < data.length; i++) {
			var htmlstr = '<tr><td><img src="' + data[i].photo + '" class="img-head" alt="User Image" /></td>' +
				'<td>' + data[i].content + '</td><td><button type="button" class="btn btn-info btn-block">通过</button>' +
				'<button type="button" data-rtype="1" data-checkid="' + data[i].id + '" class="btn btn-info btn-block btn-refuse">图片审核不通过</button>' +
				'<button type="button" data-rtype="2" data-checkid="' + data[i].id + '" class="btn btn-info btn-block btn-refuse">帖子内容不适合</button></td></tr>';
			$("#noCheckList").append(htmlstr);
			newTime = data[i].utime;
		}
		me.utime[me.state] = newTime;
	},
	//渲染已审核
	_renderChecked: function(data) {
		var me = this,
			newTime = 0;
		// $("#checkedList").html("");
		for (var i = 0; i < data.length; i++) {
			var htmlstr = '<tr><td><img src="' + data[i].photo + '" class="img-head" alt="User Image" /></td>' +
				'<td>' + data[i].content + '</td></tr>';
			$("#checkedList").append(htmlstr);
			newTime = data[i].utime;
		}
		me.utime[me.state] = newTime;
	},
	//渲染不通过审核
	_renderRefusecheck: function(data) {
		var me = this,
			newTime = 0;
		// $("#refuseList").html("");
		for (var i = 0; i < data.length; i++) {
			var htmlstr = '<tr><td><img src="' + data[i].photo + '" class="img-head" alt="User Image" /></td>' +
				'<td>' + data[i].content + '</td><td>' +
				'<button type="button" class="btn btn-info btn-block btn-pass">通过</button></td></tr>';
			$("#refuseList").append(htmlstr);
			newTime = data[i].utime;
		}
		me.utime[me.state] = newTime;
	},
	//绑定固定事件
	_bendEvent: function() {
		var list = this;
		$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
			list.state = parseInt($(e.target).data('state'));
			list.init();
		});
	},
	//重新绑定事件
	_rebendEvent: function() {
		var list = this;
		$(".btn-pass").unbind('click').bind("click", function() {
			var me = $(this),
				listDom = me.parents("tr"),
				id = me.data("checkid");
			list.passCheck(id, listDom);
		});
		$(".btn-refuse").unbind('click').bind("click", function() {
			var me = $(this),
				listDom = me.parents("tr"),
				id = me.data("checkid"),
				type = me.data("rtype");
			list.refuseCheck(id, type, listDom);
		});
	}
};