/**
 * chat.js
 * @zzy
 * @date    2015-03-31 14:19:15
 * @version 1.000
 */
var chatUserlist = {
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
				url: me.getUrl + "/mo/all",
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
		$("#chatUserlist").html("");
		for (var i = 0; i < data.length; i++) {
			var htmlstr = '<li role="presentation" data-rid="' + data[i].rid + '"  data-uid="' + data[i].uid + '"><a href="javascript:void(0);">' + data[i].uid + '</a></li>';
			$("#chatUserlist").append(htmlstr);
		}
	},
	//绑定事件
	_bendEvent: function() {
		var list = this;
		$(".chat-user-list li").unbind('click').bind("click", function() {
			var me = $(this),
				uid = me.data('uid'),
				rid = me.data('rid');
			$(".chat-user-list li").removeClass("active");
			me.addClass("active");
			chatDOM.updateDom(uid, rid, true);
		});
		$('a[data-label="Pre"]').unbind('click').bind('click', function() {
			list.prevPage();
		});
		$('a[data-label="Next"]').unbind('click').bind('click', function() {
			list.nextPage();
		});
	}
};
var chatDOM = {
	getUrl: g_host + "/ba/1/ck/x/7u/1n/a/2i/sy/st/m",
	uid: "", //用户ID
	rid: "", //机器人ID
	//更新整个dom
	updateDom: function(uid, rid, needRefresh) {
		var me = this;
		me.uid = uid || me.uid;
		me.rid = rid || me.rid;
		$.ajax({
				url: me.getUrl + "/mo/single",
				type: 'GET',
				dataType: 'jsonp',
				data: {
					"uid": me.uid,
					"rid": me.rid
				},
				jsonp: "callbackparam", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
				jsonpCallback: "callback" //自定义的jsonp回调函数名称，默认为jQuery自动生成的随机函数名
			})
			.done(function(data) {
				if (needRefresh === true) {
					me.renderUserinfo(data.robot, data.user);
					me.renderChatcontent(data.chats, data.robot, data.user);
				} else {
					me.renderChatcontent(data.chats, data.robot, data.user);
				}
			});
	},
	//渲染用户信息
	renderUserinfo: function(rData, uData) {
		//机器人信息
		$("#robotFace").attr('src', rData.face);
		$("#robotName").text(rData.nick ? rData.nick : "未知");
		var rAge = rData.birth ? parseInt((new Date() - new Date(rData.birth)) / (365 * 24 * 60 * 60 * 1000)) : "未知",
			rHeight = rData.height ? rData.height + "cm" : "未知",
			rEdu = rData.edu ? rData.edu : "未知",
			rJob = rData.job ? rData.job : "未知",
			rMarry = rData.marry ? rData.marry : "未知",
			rCity = rData.city ? rData.city : "未知";
		var robotInfo = "年龄：" + rAge + " 身高：" + rHeight + " 教育程度：" + rEdu + " 职业：" + rJob + " 婚姻状况：" + rMarry;
		$("#robotInfo").text(robotInfo);
		$("#robotCity").text("所在城市：" + rCity);
		//用户信息
		$("#userFace").attr('src', uData.face);
		$("#userName").text(uData.nick ? uData.nick : "未知");
		var uAge = uData.birth ? parseInt((new Date() - new Date(uData.birth)) / (365 * 24 * 60 * 60 * 1000)) : "未知",
			uHeight = uData.height ? uData.height + "cm" : "未知",
			uEdu = uData.edu ? uData.edu : "未知",
			uJob = uData.job ? uData.job : "未知",
			uMarry = uData.marry ? uData.marry : "未知",
			uCity = uData.city ? uData.city : "未知";
		var userInfo = "年龄：" + uAge + " 身高：" + uHeight + " 教育程度：" + uEdu + " 职业：" + uJob + " 婚姻状况：" + uMarry;
		$("#userInfo").text(userInfo);
		$("#userCity").text("所在城市：" + uCity);
	},
	//渲染聊天内容
	renderChatcontent: function(chatContent, rData, uData) {
		var me = this,
			renderChat = function(cData, rData, uData) {
				var dom = $(document.createElement("div")),
					name = "",
					face = "";
				dom.addClass('direct-chat-msg');
				//判断是否是机器人所发消息
				if (cData.fuid == me.rid) {
					dom.addClass('right');
					nick = rData.nick;
					face = rData.face;
				} else {
					nick = uData.nick;
					face = uData.face;
				}
				var chatText = '<div class="direct-chat-info clearfix">' +
					'<span class="direct-chat-name">' + nick +
					'</span><span class="direct-chat-timestamp">' + new Date(cData.ctime).format("yyyy-MM-dd hh:mm:ss") +
					'</span></div>' +
					'<img class="direct-chat-img" src="' + face + '" alt="message user image" />' +
					'<div class="direct-chat-text">' + cData.content + '</div>';
				dom.html(chatText);
				$("#chat-list").append(dom);
			};
		$("#chat-list").html("");
		for (var i = 0; i < chatContent.length; i++) {
			renderChat(chatContent[i], rData, uData);
		}
	},
	//发送消息
	sendMsg: function() {

	},
	//忽略用户
	ignoreUser: function() {

	}
};
$(function() {
	$("#chatUserlist").height($(".top-box").height() - $(".bottom-box").height() - 65);
	chatUserlist.init();
});