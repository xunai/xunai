/**
 * login.js
 * @zzy
 * @date    2015-03-28 13:39:00
 * @version $Id$
 */
//用户配置
var g_usermap = {
	"1000": {
		nick: "肚兜科技",
		passWord: "dudou233",
		role: "11111",
		uid: 1000
	},
	"1001": {
		nick: "总审核1",
		passWord: "147147",
		role: "11100",
		uid: 1001
	},
	"2000": {
		nick: "聊天1",
		passWord: "147147",
		role: "00010",
		uid: 2000
	},
	"2001": {
		nick: "聊天2",
		passWord: "147147",
		role: "00010",
		uid: 2001
	},
	"2002": {
		nick: "聊天3",
		passWord: "147147",
		role: "00010",
		uid: 2002
	},
	"2003": {
		nick: "聊天4",
		passWord: "147147",
		role: "00010",
		uid: 2003
	},
	"3000": {
		nick: "人脸1",
		passWord: "147147",
		role: "10000",
		uid: 3000
	},
	"3001": {
		nick: "人脸2",
		passWord: "147147",
		role: "10000",
		uid: 3001
	},
	"4000": {
		nick: "身份1",
		passWord: "147147",
		role: "01000",
		uid: 4000
	},
	"4001": {
		nick: "身份2",
		passWord: "147147",
		role: "01000",
		uid: 4001
	}
};
var g_hrefmap = ["checkhead.html", "checkrole.html", "datetree.html", "chat.html", "index.html"];
//登录
$(function() {
	//监听回车键
	$("input").keydown(function(event) {
		if (event.which == '13') {
			InputVal();
			return false;
		}
	});
	$("#loginBtn").click(function() {
		InputVal();
	});
});

function InputVal() {
	var username = $("#username"),
		password = $("#password"),
		ErrElment = $("#alert"),
		ErrText = $("#alert-text");
	if (username.val() == "") {
		ErrText.text("账号不能为空！");
		ErrElment.addClass('in');
		username.focus();
		return;
	}
	if (password.val() == "") {
		ErrText.text("密码不能为空！");
		ErrElment.addClass('in');
		password.focus();
		return;
	}
	if (g_usermap.hasOwnProperty(username.val())) {
		g_usermap[username.val()].passWord.toString() == password.val().toString() ?
			login(g_usermap[username.val()], username.val()) :
			ErrText.text("密码错误！");
		ErrElment.addClass('in');
	} else {
		ErrText.text("账号不存在！");
		ErrElment.addClass('in');
	}
}

function login(role, rolename) {
	if (window.localStorage) {
		var storage = window.localStorage;
		if (!storage.getItem("xunai_username")) {
			storage.setItem("xunai_nick", role.nick);
			storage.setItem("xunai_username", rolename);
			storage.setItem("xunai_role", role.role);
			storage.setItem("xunai_uid", role.uid);
			storage.setItem("xunai_lasttime", new Date().getTime());
		} else {
			storage.xunai_nick = role.nick;
			storage.xunai_username = rolename;
			storage.xunai_role = role.role;
			storage.xunai_uid = role.uid;
			storage.xunai_lasttime = new Date().getTime();
		}
	}
	var roleinf = storage.xunai_role.indexOf("1");
	window.location.href = g_hrefmap[roleinf];

}