/**
 * 账户登录 by xuyingan
 */

/**
 * 登陆页初始化
 */
window.onload = function(e) {	
	// init focus
	var LM = window.document.loginForm;
	var userName = LM.userName;
	userName.focus();
	//bind event as 'Enter' of keyboard
	bindEnterEvent();
	
	// 自动生成年份
	var thisYearId = document.getElementById("thisYear"), thisYear = (new Date()).getFullYear();
	thisYearId.innerHTML = thisYear;

	// 提示开启大写锁定
	var inputPWD = document.getElementById('userPwd');
	inputPWD.onkeypress = detectCapsLock;

	function  detectCapsLock(event){
	    var e = event||window.event;
	    var o = e.target||e.srcElement;
	    var oTip = '<div id="capsLockTip" >'+local.backup.capsLockOpen+'</div>';
	    var keyCode  =  e.keyCode||e.which; // 按键的keyCode 
	    var isShift  =  e.shiftKey ||(keyCode  ==   16 ) || false ; // shift键是否按住
	     if (((keyCode >=   65   &&  keyCode  <=   90 )  &&   !isShift) // Caps Lock 打开，且没有按住shift键 
	        || ((keyCode >=   97   &&  keyCode  <=   122 )  &&  isShift)// Caps Lock 打开，且按住shift键
	       ){
	    	 document.getElementById('capsLockTipWrap').innerHTML=oTip;
	    }
	     else{
	    	 document.getElementById('capsLockTipWrap').innerHTML="";
	    } 
	}
	
	// switch mode tab of the login type
	var loginTab = document.getElementById("loginTab");
	var formWrap = document.getElementById("formWrap");
	var submit = LM.submit;
	var userLoginType = LM.userLoginType;	
	var ukText = document.getElementById("ukText");
	var ukWrap = document.getElementById("ukWrap");	
	var usbkeyLoginBtn = document.getElementById("loginBtn");
	var tab = loginTab.getElementsByTagName("a");
	var form = formWrap.getElementsByTagName("form");
	var loginInfo = document.getElementById("loginInfo");
	var loginResult = document.getElementById("loginResult");
	var checkTimeID;	
	for ( var i = 0; i < tab.length; i++) {
		tab[i].index = i;
		tab[i].onclick = function() {									
			for ( var j = 0; j < tab.length; j++) {
				tab[j].className = "";
			}
			this.className = "active";			
			ukText.style.display="none";
			ukWrap.style.display="none";
			// The USB-Key mode
			if (this.index == "1") {
				var embed = document.createElement("EMBED");
				embed.setAttribute("id", "ViKeyInterface");
				embed.setAttribute("type", "application/npViKeyInterface-plugin");
				embed.setAttribute("hidden", "true");
				document.body.appendChild(embed);					
				userLoginType.value = 1;
				ukText.style.display="block";
				ukWrap.style.display="block";
				usbkeyLoginBtn.className = "ipt submit_wrap submit_wrap_disable";
				loginInfo.style.display = "none";
				userName.disabled = true;
				submit.disabled = true;
				if (!checkTimeID) {					
					USB_KEY.create();
					var hasUSBKey;
					if (USB_KEY.hasUSBKey() == NO_USBKEY_CONTROLS) {
						return ;
					}
					checkTimeID = setInterval(
							function() {
								hasUSBKey = USB_KEY.checkHasUSBKey();
								if (hasUSBKey==1) {
									usbkeyLoginBtn.className = "ipt submit_wrap";
									submit.disabled = false;
									USB_KEY.grantUserLogin();
									userName.value = USB_KEY.getUserName();
									bindEnterEvent();
								} else {
									usbkeyLoginBtn.className = "ipt submit_wrap submit_wrap_disable";
									submit.disabled = true;
									document.onkeyup = null;
								}
							}, USBKEY_CHECK_INTERVAL);
				}
			// The normal mode
			} else {
				var embed = document.getElementById("ViKeyInterface");
				if(embed){
					document.body.removeChild(embed);
				}				
				userName.disabled = false;
				userName.value = null;
				usbkeyLoginBtn.className = "ipt submit_wrap";
				submit.disabled = false;
				userLoginType.value = 0;
				bindEnterEvent();
				if (checkTimeID) {
					clearInterval(checkTimeID);
					checkTimeID = null;
				}
			}						
		}
	}
};

/**
 * 绑定键盘Enter事件登录
 */

function bindEnterEvent(){
	document.onkeyup = function(event) {
		var e = event || window.event;
		var keyCode = e.keyCode || e.which;
		switch (keyCode) {
			case 13:
				login();
				break;
			default:
				break;
			}
	};
}



/**
 * 账户登录
 */
function login() {
	// 初始化
	var userName = document.getElementById("userName").value;
	var userPwd = document.getElementById("userPwd").value;
	var userLoginType = document.getElementById("userLoginType").value;
	var loginInfo = document.getElementById("loginInfo");
	var loginResult = document.getElementById("loginResult");
	var loginImg = document.getElementById("loginImg");

	loginInfo.style.display = "block";
	loginImg.style.visibility = "hidden";
	loginResult.innerHTML = "<span class='color_green'>" + local.backup.logining + "</span>";

	Ext.Ajax.request({
		method : 'post',
		async : false,
		params : {
			userName : userName,
			userPwd : userPwd,
			userLoginType : userLoginType
		},
		url : '/admin/toUserAction!login.action',
		success : function(response, options) {
			try {
				var obj = eval("(" + response.responseText + ")");
				if (MSG_NORMAL == obj.msgCode) {
					document.getElementById("submit").onclick = null;
					document.onkeyup = null;
					window.location.href = GOTO_HOME_LINK_HREF;
				} else {
					loginImg.style.visibility = "hidden";
					loginResult.innerHTML = "";
					//loginResult.innerHTML = obj.msgContent;
					setTimeout(function(){loginImg.style.visibility = "visible";loginResult.innerHTML =obj.msgContent;;},100);
				}
			} catch (e) {
				loginImg.style.visibility = "hidden";
				loginResult.innerHTML = "";
				//loginResult.innerHTML = local.backup.loginAbnormal;
				setTimeout(function(){loginImg.style.visibility = "visible";loginResult.innerHTML = local.backup.loginAbnormal;},100);
			}
		},
		failure : function(response, options) {
			loginImg.style.visibility = "hidden";
			loginResult.innerHTML = "";
			setTimeout(function(){loginImg.style.visibility = "visible";loginResult.innerHTML = local.backup.loginFailure;},100);
			
		}
	});
}

/**
 * download USB-Key control
 */
function downloadUSBKeyControl() {
	parent.location.href = URL_OF_DOWNLOAD_USBKEY_CONTROL;
}

/**
 * constant variables
 */
var GOTO_HOME_LINK_HREF = "/page/backup/index.jsp";
var URL_OF_DOWNLOAD_USBKEY_CONTROL = "/admin/toUserAction!downloadUSBKeyControl.action";
var MSG_NORMAL = 30000;
var NO_USBKEY_CONTROLS = -1;
var USBKEY_CHECK_INTERVAL = 1 * 1000;