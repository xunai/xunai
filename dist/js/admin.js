/**
 * admin.js
 * @zzy
 * @date    2015-03-28 16:14:29
 * @version $Id$
 */
//反馈列表
var feedList = {
	getUrl: g_host + "/ba/1/ck/x/7u/1n/a/2i/sy/st/m",
	page: 0,
	pageSize: 20,
	init: function() {
		var me = this;
		me.getList(me.pageSize, me.page);
		me._bendEvent();
	},
	getList: function(pageSize, pageNum) {
		var me = this;
		$.ajax({
				url: me.getUrl + "/report/list",
				type: 'GET',
				dataType: 'jsonp',
				data: {
					"size": pageSize,
					"page": pageNum
				},
				jsonp: "callbackparam",
				jsonpCallback: "callback"
			})
			.done(function(data) {
				me.page = pageNum;
				me._render(data);
				me._bendEvent();
			});
	},
	//下一页
	nextPage: function() {
		var me = this;
		me.getList(me.pageSize, me.page + 1);
	},
	//前一页
	prevPage: function() {
		var me = this;
		me.getList(me.pageSize, me.page - 1);
	},
	//渲染列表
	_render: function(data) {
		var me = this;
		$("#feedlist").html("");
		for (var i = 0; i < data.length; i++) {
			var htmlstr = '<tr><td>' + new Date(data[i].ctime).format("yyyy-MM-dd hh:mm:ss") + '</td><td>' + data[i].uid + '</td>' +
				'<td>' + data[i].content + '</td></tr>';
			$("#feedlist").append(htmlstr);
		}
	},
	//绑定事件
	_bendEvent: function() {
		var list = this;
		$('a[data-label="Pre"]').unbind('click').bind('click', function() {
			list.prevPage();
		});
		$('a[data-label="Next"]').unbind('click').bind('click', function() {
			list.nextPage();
		});
	}
};
$(function() {
	$('a[data-toggle="tab"]').on('shown.bs.tab', function(e) {
		switch (e.target.id) {
			case "adminlink":
				
				break;
			case "feedlink":
				feedList.init();
				break;
			default:
				break;
		}
	});
});

