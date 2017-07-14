/**
 * The top menu for all pages, written by xuyingan
 */
Ext.define('websure.backup.view.GlobalMenu', {
	        id : 'globalTopMenu',
			extend : 'Ext.panel.Panel',
			alias : 'widget.GlobalMenu',
			border : true,
			width:"100%",
			layout:"fit",
			listeners: {
				render: function(){
					initWebGlobalMenu();															
				}
			}
		});



/**
 * check the duplication of single-login, written by xuyingan
 */
function loginDuplicated(){
	Ext.Ajax.request({
		method : 'get',		    
		url : '/admin/toUserAction!isLoginDuplicated.action',
		success : function(response,options) {
			try {
				var obj = eval("("+response.responseText+")");
				if (typeof(CURRENT_USER.getUserID()) == 'undefined') {
					Ext.websure.MsgError("", local.loadErrorPleaseReLogin);
					delay(LOGOUT_DELAY_SECOND, gotoLoginPage);	
					return ;
				}
				if (notNull(obj.curUserID) && obj.curUserID != CURRENT_USER.getUserID()) {
					gotoLoginPage();
					return ;
				}				
				if (obj.emptyLogin) {
					gotoLoginPage();
					return ;
				}				
				if(obj.IsNullSession){					
					Ext.MessageBox.alert(local.window.tip, local.sessionExpired, function(){
						if (typeof(WINDOW_VNC) != "undefined" && WINDOW_VNC) {
        					WINDOW_VNC.close();
        					WINDOW_VNC = null;
        				}		
						gotoLoginPage();
					});
					return ;
				}
				if(obj.donedel){
					Ext.MessageBox.alert(local.window.tip,local.accountIsDelele, function(){
						if (typeof(WINDOW_VNC) != "undefined" && WINDOW_VNC ) {
        					WINDOW_VNC.close();
        					WINDOW_VNC = null;
        				}		
						gotoLoginPage();
					});	
					return ;
				}
				if(obj.alterpower){
					Ext.MessageBox.alert(local.window.tip,local.authUpdateLogin, function(){
						if (typeof(WINDOW_VNC) != "undefined" && WINDOW_VNC ) {
        					WINDOW_VNC.close();
        					WINDOW_VNC = null;
        				}		
						gotoLoginPage();
					});	
					return ;
				}
				if(obj.iplimit){
					Ext.MessageBox.alert(local.window.tip, local.IPIsLimitLogin, function(){
						if (typeof(WINDOW_VNC) != "undefined" && WINDOW_VNC ) {
        					WINDOW_VNC.close();
        					WINDOW_VNC = null;
        				}
						gotoLoginPage();
					});	
					return ;
				}						
				if(obj.IsLoginDup){
					Ext.MessageBox.alert(local.window.tip, local.accountUsed, function(){
						if (typeof(WINDOW_VNC) != "undefined" && WINDOW_VNC ) {
        					WINDOW_VNC.close();
        					WINDOW_VNC = null;
        				}		
						gotoLoginPage();
					});	
					return ;
				}
									
			} catch (e) {
				Ext.websure.MsgError("", local.backup.loginAbnormal);
				if (typeof(WINDOW_VNC) != "undefined" && WINDOW_VNC) {
					WINDOW_VNC.close();
					WINDOW_VNC = null;
				}		
				delay(LOGOUT_DELAY_SECOND, gotoLoginPage);
				return ;
			}
		}
	});
}


/**
 * login single, written by xuyingan
 * 修改为在 getUserInfo接口准确返回后再开始轮询 --> modify by lids
 */
/*var timerID = (function(){	
	//document.onreadystatechange = init;
	return setInterval("loginDuplicated()", SINGLE_LOGIN_TIMER_CHECK_SECOND);	
}());*/
var timerID = null;
var setLoginDupTime = function(){	
	//document.onreadystatechange = init;
	return setInterval("loginDuplicated()", SINGLE_LOGIN_TIMER_CHECK_SECOND);	
};


/**
 * init page menu, written by xuyingan
 */
function init(){
	var explorer = window.navigator.userAgent;
	delay(MENU_SELECT_DELAY_SECOND, setSelectedMenu);	
	/*if (!!window.ActiveXObject || "ActiveXObject" in window){		
		delay(MENU_SELECT_DELAY_SECOND, setSelectedMenu);		
	}else{		  
		setSelectedMenu();		
	}	*/
}


/**
 * no operation and do nothing to exit web, especially dispose of the vnc
 * window, written by xuyingan
 */
var timeID;
if (typeof(WINDOW_VNC) == "undefined" || !WINDOW_VNC || WINDOW_VNC.closed) {	
	timeID = setInterval("gotoLoginPage()", NO_OPERATION_TO_EXIT_SECOND);
}
document.onmousedown = function() {
	if (notNull(timeID)) {
		clearInterval(timeID);
		timeID = null;
	}  
	if (typeof(WINDOW_VNC) == "undefined" || !WINDOW_VNC || WINDOW_VNC.closed) {		
		timeID = setInterval("gotoLoginPage()", NO_OPERATION_TO_EXIT_SECOND);
	}
};  
function checkVNCState() {
	if (typeof(WINDOW_VNC) != "undefined" && WINDOW_VNC && !WINDOW_VNC.closed) {
		if (notNull(timeID)) {
			clearInterval(timeID);
			timeID = null;
		}		
	} else if (isNull(timeID)) {
		timeID = setInterval("gotoLoginPage()", NO_OPERATION_TO_EXIT_SECOND);
	}
}
var vncTimer = setInterval("checkVNCState()", VNC_STATE_CHECK_TIMER_SECOND);


/**
 * the deprecated method to resolve the solution of free operation, including
 * the special disposal of the vnc window, written by xuyingan
 */
/*var timeID;
window.onblur = function() {
	if (typeof(WINDOW_VNC) == "undefined" || !WINDOW_VNC || WINDOW_VNC.closed) {
		timeID = setInterval("gotoLoginPage()", NO_OPERATION_TO_EXIT_SECOND);
	}	
};
window.onfocus = function() {
	if (notNull(timeID)) {
		clearInterval(timeID);
	}
};*/

/**
 * init the basic infomation of the current user, including the validation of
 * safety, written by xuyingan
 * 
 * @returns
 */
function initCurrentUserInfoAndCheckSafety() {
	
	Ext.Ajax.request({
		method : 'get',
		async : false,
		url : '/admin/toMenuAction!showTopGlobalMenu.action',
		success : function(response, options) {
			try {
				var obj = eval("(" + response.responseText + ")");
				Ext.getCmp('globalTopMenu').body.update(obj.html);
				//Ext.getCmp('globalTopMenu').doLayout();
			} catch (e) {
				Ext.websure.MsgError("", local.backup.loginAbnormal);
			}
		},
		failure : function(response, options) {
			Ext.websure.MsgError("", local.backup.menuError);
		}
	});
		
	loadCurrentUserInfo();
}

/**
 * load the information of current user 
 */
function loadCurrentUserInfo() {
	var isLcsOverdue = false;
	Ext.Ajax.request({
		method : 'get',
		async : false,
		url : '/admin/toUserAction!getCurrentUserInfo.action',
		success : function(response, options) {
			try {
				var obj = eval("(" + response.responseText + ")");
				CURRENT_USER.create(obj.CurrentUser, obj.currentUserPower, obj.isThreeMode);
				init();
				var isPwdOutDate = obj.PasswordOutDate;
				isLcsOverdue = obj.isLcsOverdue;
				if (isPwdOutDate) {
					openModifyPsdWin();
				}
				
			} catch (e) {
				Ext.websure.MsgError("", local.backup.loginAbnormal);
			}
			// 成功后开始检查用户是否离线	added by lids --> 20170515
			timerID = setLoginDupTime();
		},
		failure : function(response, options) {
			Ext.websure.MsgError("", local.accountInfoGetFailure);
			// 成功后开始检查用户是否离线	added by lids --> 20170515
			timerID = setLoginDupTime();
		}
	});
	
	// The tip of license-overdue 
	if (isLcsOverdue) {		
		var lcsTip = Ext.getCmp('lcsTip');
		if (!lcsTip) {
			lcsTip = Ext.create('Ext.window.Window', {			
				id: 'lcsTip',
				title: local.window.lcsTipTitle,
				x: document.body.clientWidth-400,
				y: document.body.clientHeight-220,
				width: 370,
				html: "<div class='win_auth_wrap'>"+local.window.lcsTipCont+"</div>" +
				 	  "<div class='win_auth_btn'><a href='/page/config/index.jsp?lcs=selected'>"+local.window.lcsTipBtnView+"</a></div>",
				modal: false,
				closable: true,
				resizable: false
			});	
			lcsTip.show();
		}
		window.onresize=function(){
            if(Ext.getCmp("lcsTip")){
                var w=document.body.clientWidth;
                var h=document.body.clientHeight;
                lcsTip.setXY([w-400,h-220]);
            }
		}
	}
			
}


/**
 * init the current username in page and check user safety regularly, written by
 * xuyingan
 */
function initWebGlobalMenu(){
	initCurrentUserInfoAndCheckSafety();
	setDomInnerHTML("currentUserName", CURRENT_USER.getUserName());
	setDomInnerHTML("currentRoleName", CURRENT_USER.getRoleName());	
}


/**
 * set the power of viewing the menu, but not avaliable method currently,
 * written by xuyingan
 */
function setMenuVisableByAuthority(){
	var anMenu = document.getElementById("an_menu");
	var anLi = document.getElementsByTagName("li");						
	// 'backup-warning' page retains ingnoring power
	for(var i=1;i<anLi.length;i++){
		var li = anLi[i];							
		var isViewDomA = autoFilterEnableByAceSurePowerKey(li.id, 3);
		if(isViewDomA){								
			li.style.display = "none";														
		}						
	}					
}


/**
 * set selected menu manually
 */
function setSelectedMenu() {
    	var pathName = window.location.pathname;
    	var module = pathName.slice(6,-10);	
    	var menuSel;
        if(module=='backup'){
        	menuSel = document.getElementById("sel_bac");
        }else if(module=='emergency'){
        	menuSel = document.getElementById("sel_mon");
        }else if(module=='recovery'){
        	menuSel = document.getElementById("sel_sto");
        }else if(module=='log'){
        	menuSel = document.getElementById("sel_log");
        }else if(module=='config'){    	
        	menuSel = document.getElementById("sel_sys");        	
        }else{
        	menuSel = document.getElementById("sel_bac");    	
        }
        menuSel.className = MENU_SELECT_CLASSNAME;
}

/**
 * logout and clear all the related infomation of the current user, written by
 * xuyingan
 */
function logOut(){
	Ext.Msg.confirm(local.window.tip,local.loginOutTip,
			function(bt){
		        if('yes'==bt){
		        	clearInterval(timerID);
		        	Ext.Ajax.request({
		        		method : 'get',		    
		        		url : '/admin/toUserAction!logOut.action',
		        		success : function(response,options) {
		        			try{
		        				var obj = eval("("+response.responseText+")");
		        				showResultDialog(obj.msgCode, obj.msgContent);
		        				clearInterval(timerID);
		        				if (typeof(WINDOW_VNC) != "undefined" && WINDOW_VNC) {
		        					WINDOW_VNC.close();
		        					WINDOW_VNC = null;
		        				}		       				
		        				delay(LOGOUT_DELAY_SECOND, gotoLoginPage);	
		        			}catch(e){
		        				Ext.websure.MsgError("", local.backup.loginAbnormal);
		        				if (typeof(WINDOW_VNC) != "undefined" && WINDOW_VNC) {
		        					WINDOW_VNC.close();
		        					WINDOW_VNC = null;
		        				}	
		        				delay(LOGOUT_DELAY_SECOND, gotoLoginPage);
		        			}
		        		},
		        		failure : function(response,options) {			
		        			Ext.websure.MsgError("", local.loginOutTipError);
		        			if (typeof(WINDOW_VNC) != "undefined" && WINDOW_VNC) {
	        					WINDOW_VNC.close();
	        					WINDOW_VNC = null;
	        				}	
		        			delay(LOGOUT_DELAY_SECOND, gotoLoginPage);
		        		}
		        	});			        	
		        }
	        }, this);		
}


/**
 * 展示消息通知
 */
function showInfo(){
	var message = document.getElementById('message');
	var pageX = message.getBoundingClientRect().left-800;
	var pageY = message.getBoundingClientRect().top+40;
	var msgInfoWin = Ext.getCmp('msgInfoWin');
	
	if(msgInfoWin){
		msgInfoWin.destroy();
	}else{
		 msgInfoWin = Ext.create('Ext.window.Window', {
                     id:'msgInfoWin',
                     header:false,
                     resizable:false,
                     border:false,
                     style:"border:none",
                     frame:false,
                     closable:false,
                     layout: 'fit',
                     plain:false,
                     items: {  
                         xtype: 'msgMainPanel',
                         width:'100%'
                     }
                 });
        msgInfoWin.showAt(pageX,pageY);
	}	
}





/**
 *点击非消息窗口，关闭消息通知窗口
 */
document.onclick = function (e) {
	var eve = e || window.event; //获取事件对象
	
	//var objEle = eve.target || eve.srcElement; //获取document 对象的引用
	
    //鼠标点击坐标
    var x = eve.clientX;  
    var y = eve.clientY;
    //消息框展示左上角坐标
    var message = document.getElementById('message');
    var pageX = message.getBoundingClientRect().left-800;
    var pageY = message.getBoundingClientRect().top+40;
    
    //鼠标点击区域不在面板范围
    if( x<pageX || x>(pageX+850) ||y>(pageY+340) ){  
        var msgInfoWin = Ext.getCmp('msgInfoWin');
        if(msgInfoWin){
            msgInfoWin.destroy();
        }
    }   
}