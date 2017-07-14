/**
 * The common tools and functions, written by xuyingan
 */

// init object native prototype chain method, for instance, object.trim()-this
// method not work in browser at low version, just like ie8
var initObject = (function(){	
	String.prototype.trim = function(){		
	     return this.replace(/(^\s*)|(\s*$)/g, '');
	}
}());



//屏蔽浏览器右键菜单
function clickIE4(){
        if (event.button==2){
                return false;
        }
}
 
function clickNS4(e){
        if (document.layers||document.getElementById&&!document.all){
                if (e.which==2||e.which==3){
                        return false;
                }
        }
}
 
function OnDeny(){
        if(event.ctrlKey || event.keyCode==78 && event.ctrlKey || event.altKey || event.altKey && event.keyCode==115){
                return false;
        }
}
 
if (document.layers){
        document.captureEvents(Event.MOUSEDOWN);
        document.onmousedown=clickNS4;
        document.onkeydown=OnDeny();
}else if (document.all&&!document.getElementById){
        document.onmousedown=clickIE4;
        document.onkeydown=OnDeny();
}
 
document.oncontextmenu=new Function("return false");

/**
 * 对象判空
 * 
 * @param obj
 * @returns {Boolean}
 */
function isNull(obj){
	var retBool = (null==obj || ""===obj) ? true : false;
	return retBool;
}

/**
 * 对象判非空
 * 
 * @param obj
 * @returns {Boolean}
 */
function notNull(obj){	
	return !isNull(obj);
}


/**
 * 值判空
 * 
 * @param value
 * @returns {Boolean}
 */
function isNullInt(value){
	var retBool = (null==value || ""==value) ? true : false;
	return retBool;
}

/**
 * 值判非空
 * 
 * @param value
 * @returns {Boolean}
 */
function notNullInt(value){
	return !isNullInt();
}


/**
 * 自定义分隔符获取数组
 * 
 * @param text
 * @param symbol
 * @returns {Array}
 */
function getArrayBySymbol(text, symbol){
	text = text.replace(/\s/g, "");
	var textArray = new Array();
	textArray = text.split(symbol);
	return textArray;
}

/**
 * 设置Dom的HTML内容
 * 
 * @param domID
 * @param innerHTML
 */
function setDomInnerHTML(domID, innerHTML){
	var dom = document.getElementById(domID);
	dom.innerHTML = innerHTML;
}

/**
 * 
 * @param domID
 * @param binary
 *            0(false) or 1(true)
 * @param trueHTML
 * @param falseHTML
 * @param defaultHTML
 */
function setDomInnerHTMLByBinary(domID, binary, trueHTML, falseHTML, defaultHTML){
	var dom = document.getElementById(domID);
	if(1==binary || binary){
		dom.innerHTML = trueHTML;
	}else if(0==binary || binary){
		dom.innerHTML = falseHTML;
	}else{
		dom.innerHTML = defaultHTML;
	}
}


/**
 * 回溯EXTJS组件的整型值,如果新值是非整型值则回溯到之前的值
 * 
 * @param fieldExt
 * @param newValue
 * @param oldValue
 */
function setIntFieldExt(fieldExt, newValue, oldValue){
	if("-"!=newValue){
		if(notInt(newValue) && notNull(newValue)){																																																						
			fieldExt.setValue(oldValue);
		}
	}
}

/**
 * 在数字区域的范围内
 * 
 * @param value
 * @param minVal
 * @param maxVal
 * @returns
 */
function isInNumRange(value, minVal, maxVal){
	var retBool = (isNull(value) || (value>=minVal && value<=maxVal)) ? true : false;
	return retBool;
}

/**
 * 在数字区域的范围外
 * 
 * @param value
 * @param minVal
 * @param maxVal
 * @returns
 */
function notInNumRange(value, minVal, maxVal){
	return !isInNumRange(value, minVal, maxVal);
}


/**
 * 显示后台访问结果
 * 
 * @param code
 *            消息码
 * @param content
 *            消息内容
 * @param callback
 *            失败消息的回调函数
 */
function showResultDialog(code, content, callback){	
	if(MSG_NORMAL==code){
		Ext.websure.MsgTip.msg(local.window.tip, content, true);
		return true;
	}else{
		Ext.websure.MsgError(code, content, callback);
		return false;
	}
}

/**
 * 链接到登陆页面
 */
function gotoLoginPage(){
	gotoSpecifiedPage(GOTO_LOGIN_LINK_HREF);	
}

/**
 * 链接到指定页面
 */
function gotoSpecifiedPage(pagePath){
	window.location.href = pagePath;
}

/**
 * 延迟执行
 * 
 * @param time
 *            单位ms
 * @param callback
 *            回调函数
 */
function delay(time, callback){	
	setTimeout(callback, time);         
}

/**
 * 三元管理员
 * 
 * @param name
 * @returns
 */
function isManager(name){
	if(isNull(name)){
		return false;
	}
	name = name.trim();
	var isUserManager = (ADMIN==name || SECURITY==name || AUDITOR==name);
	var isRoleManager = (ADMIN_CN==name || SECURITY_CN==name || AUDITOR_CN==name);
	return (isUserManager || isRoleManager);
}

/**
 * 非三元管理员
 * 
 * @param name
 * @returns
 */
function notManager(name){
	return !isManager(name);
}


/**
 * 存储容量转换
 * 
 * @param size
 * @returns {String}
 */
function converSize(size) {
	var floor = Math.floor;
	if(size >=0 && size < 1024) {
		return size + "byte";
	} else if(size >= 1024 && size < (1024 * 1024)) {
		return floor(size / 1024) + "KB";
	} else if(size >= (1024 * 1024) && size < (1024 * 1024 * 1024)) {
		return floor(size / (1024 * 1024)) + "MB";
	} else if(size >= (1024 * 1024 * 1024)) {
		return floor(size / (1024 * 1024 * 1024)) + "GB";
	}
}

/**
 * MB转GB函数
 * 
 * @param size
 * @returns {String}
 */
function converToGB(size){
	var floor = Math.floor;
	if(size >=0 && size < 1024) {
		return size + "MB";
	} else if(size >= 1024 && size < (1024 * 1024)) {
		return floor(size / 1024) + "GB";
	}
}

/**
 * MB转GB整取函数
 * 
 * @param size
 * @returns {String}
 */
function converToIntegerGB(size){
	var floor = Math.floor;
	if(size >=0 && size < 1024) {
		return size*1024/1000 + "MB";
	} else if(size >= 1024 && size < (1024 * 1024)) {
		return floor(size/1024*1024/1000) + "GB";
	}
}

/**
 * 当前登录账户名
 * 
 * @returns
 */
function getCurrentLoginUserName(){
	return CURRENT_USER.getUserName();
}

/**
 * 当前登录账户的角色名
 * 
 * @returns
 */
function getCurrentLoginRoleName(){
	return CURRENT_USER.getRoleName();
}

/**
 * 当前登录账户具备修改权限
 * 
 * @param userName
 * @returns {Boolean}
 */
function isCurrentUserCanModify(userName){
	var bothManager = isManager(userName) && isManager(getCurrentLoginUserName());
	var selfNotManager =  notManager(userName) && userName==getCurrentLoginUserName();	
	return bothManager || selfNotManager;
}

/**
 * 当前登录账户具备修改和删除权限
 * 
 * @param userName
 * @returns {Boolean}
 */
function isCurrentUserCanModifyAndDelete(userName){
	var notSelfAndManager = notManager(userName) && userName!=getCurrentLoginUserName();
	return notSelfAndManager;
}

/**
 * 当前登录账户不具备修改和删除权限
 * 
 * @param userName
 * @returns
 */
function notCurrentUserCanModifyAndDelete(userName){	
	return !isCurrentUserCanModifyAndDelete(userName);
}

/**
 * 当前登录账户所属角色具备修改权限
 * 
 * @param roleName
 * @returns {Boolean}
 */
function isCurrentRoleCanModify(roleName){
	var bothManager = isManager(roleName) && isManager(getCurrentLoginRoleName());
	var selfNotManager =  notManager(roleName) && roleName==getCurrentLoginRoleName();	
	return bothManager || selfNotManager;
}

/**
 * 当前登录账户所属角色具备修改和删除权限
 * 
 * @param roleName
 * @returns {Boolean}
 */
function isCurrentRoleCanModifyAndDelete(roleName){
	var notSelfAndManager = notManager(roleName) && roleName!=getCurrentLoginRoleName();
	return notSelfAndManager;
}

/**
 * 当前登录账户所属角色不具备修改和删除权限
 * 
 * @param roleName
 * @returns
 */
function notCurrentRoleCanModifyAndDelete(roleName){	
	return !isCurrentUserCanModifyAndDelete(roleName);
}

/**
 * insert the embed label of USB-Key
 */
function insertEmbedOfUSBKey(){
	var embed = document.createElement("EMBED");
	embed.setAttribute("id", "ViKeyInterface");
	embed.setAttribute("type", "application/npViKeyInterface-plugin");
	embed.setAttribute("hidden", "true");
	document.body.appendChild(embed);
}


/**
 * delete the embed label of USB-Key
 */
function deleteEmbedOfUSBKey(){
	var embed = document.getElementById("ViKeyInterface");
	if(embed){
		document.body.removeChild(embed);
	}		
}


/**
 * get the current date, format as 'yyyy-MM-dd HH:MM:SS'
 * 
 * @returns {String}
 */
function getNowFormatDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    if (1 <= month && month <= 9) {
        month = TIME_PLACEHOLDER_ZERO + month;
    }
    if (0 <= strDate && strDate <= 9) {
        strDate = TIME_PLACEHOLDER_ZERO + strDate;
    }
    if (0 <= hours && hours <=9) {
    	hours = TIME_PLACEHOLDER_ZERO + hours;
    }
    if (0 <= minutes && minutes <=9) {
    	minutes = TIME_PLACEHOLDER_ZERO + minutes;
    }
    if (0 <= seconds && seconds <=9) {
    	seconds = TIME_PLACEHOLDER_ZERO + seconds;
    }   
    var currentdate = year + BAR + month + BAR + strDate + BLANK + hours 
                      + COLON + minutes + COLON + seconds;
    return currentdate;
}

/**
 * js 时间格式化 format(result, 'yyyy-MM-dd HH:mm:ss');
 * @param {} time
 * @param {} format
 * @return {}
 */
function format(time, format) {
    var t = new Date(time);
    var tf = function(i) {
        return (i < 10 ? '0' : '') + i
    };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
                switch (a) {
                    case 'yyyy' :
                        return tf(t.getFullYear());
                        break;
                    case 'MM' :
                        return tf(t.getMonth() + 1);
                        break;
                    case 'mm' :
                        return tf(t.getMinutes());
                        break;
                    case 'dd' :
                        return tf(t.getDate());
                        break;
                    case 'HH' :
                        return tf(t.getHours());
                        break;
                    case 'ss' :
                        return tf(t.getSeconds());
                        break;
                }
            });
}

/**
 * js 时间格式化 format(result, 'yyyy-MM-dd HH:mm:ss');
 * @param {} time
 * @param {} format
 * @return {}
 */
function format(time, format) {
    var t = new Date(time);
    var tf = function(i) {
        return (i < 10 ? '0' : '') + i
    };
    return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
                switch (a) {
                    case 'yyyy' :
                        return tf(t.getFullYear());
                        break;
                    case 'MM' :
                        return tf(t.getMonth() + 1);
                        break;
                    case 'mm' :
                        return tf(t.getMinutes());
                        break;
                    case 'dd' :
                        return tf(t.getDate());
                        break;
                    case 'HH' :
                        return tf(t.getHours());
                        break;
                    case 'ss' :
                        return tf(t.getSeconds());
                        break;
                }
            });
}

/**
 * show the node Monitor chart label
 * @param {} datas
 *           the monitor data records
 * @param {} label
 *           the label show monitor timeArea
 * @param {} monitorType
 *           the monitor type
 */
function showMonitorLabel(datas,label,monitorType){
	
	 //计算节点网络监控
	 if(monitorType==NET_MONITOR && datas[0].chartDate){
            var beginTime = datas[0].chartDate;
            var endTime = datas[datas.length-1].chartDate;
            label.update(beginTime+'&nbsp;-&nbsp;'+endTime+'</br>'+local.emergency.nodeRunState);  //节点运行状态监控（单位：%）
	 }else if(datas && datas[0]){
            var beginTime = datas[0].get('chartDate');
            var endTime = datas[datas.length-1].get('chartDate');
            //更新监控时间段标题
            label.update(beginTime+'&nbsp;-&nbsp;'+endTime+'</br>'+local.emergency.nodeRunState);
     }
     
}

/**
 * show the tip about node monitor
 * @param {} tip
 *           the monitor chart tip
 * @param {} storeItem
 *           the monitor chart storeItem
 */
function showMonitorTip(tip,storeItem){
	var dateStr = storeItem.get('chartDate')    //2016-2-27 09:59:00
    var strs= dateStr.split(" "); 
    var date = strs[0];    //2016-2-27
    var time = strs[2];    //09:59:00
    
    var useRate = storeItem.get('rate');    //使用比率
    tip.setTitle(local.emergency.useRate+useRate+'% <br/>'+date+'<br/>'+time);    //使用率：
}

/**
 * 判断特殊字符
 * @param {} s
 * @return {}
 */
function __isTCZF(s) {
	var re =/[`~!@#$%^&*_+<>{}\/'[\]]/im;
	return re.test(s);
}

function __isTSZF(s) {
	var re =/[`~=!@#$%^&*+<>{}\'"“‘[\]]/im;
	return re.test(s);
}

/**
 * 判断特殊字符
 * @param {} s --> 去掉/
 * @return {}
 */
function __isTSZF(s) {
	var re =/[`~=!@#$%^&*+<>{}\'"“‘[\]]/im;
	return re.test(s);
}

/**
 * insert tip into tail of text widget, eg: 'textfield', with custom color,
 * default as 'red', written by xuyingan
 * 
 * @param textWidget
 * @param tip
 * @param color
 */
function tailTextWidgetTip(textWidget, tip, color) {
	var font = document.createElement("font");
	if (color == null) {
		color = "red";
	}
    font.setAttribute("color", color);
    var tips = document.createTextNode(tip);
    font.appendChild(tips);
    textWidget.el.dom.getElementsByTagName('tr')[0].appendChild(font);
}

/**
 * 针对IE浏览器不支持元素的remove()方法, written by xuyingan
 * @param _element
 */
function removeElement(_element) {
    var _parentElement = _element.parentNode;
    if (_parentElement) {    	   	
        _parentElement.removeChild(_element);
    }
}

/**
 * 检测客户端版本更新
 */
function checkClientUpgrade(){
	//克隆备份客户端    1:上报物理机 2：上报虚拟机 3:手动创建设备
    if(deviceType == 1 || deviceType == 2){
        //检测客户端版本更新
        Ext.Ajax.request({
                url : '/backup/todeviceAction!checkClientUpgrade.action',
                params : {
                    deviceId : selectDeviceId
                },
                success : function(response, options) {
                    var clientUpgradeInfo = Ext.decode(response.responseText);
                    var needUpgrade = clientUpgradeInfo.needUpgrade;  //标志客户端版本是否需更新
                    var upgradeState = clientUpgradeInfo.upgradeState;  //客户端升级状态
                    var upgradeTip = clientUpgradeInfo.upgradeTip;  //更新提示
                    var newVersion = clientUpgradeInfo.newVersion;  //最新版本
                    if(needUpgrade){
                    	
                        //客户端升级中
                        if(upgradeState == 1){
                        	Ext.getCmp("newVersion").update("可升级版本："+newVersion);
                            Ext.getCmp("upgradeBtn").setText('升级中');    
                            //轮询刷新客户端的升级状态
                            refreshUpgradeState(selectDeviceId);
                        }else{
                        	Ext.getCmp("upgradeBtn").setDisabled(false);
                        	Ext.getCmp("newVersion").update("可升级版本："+newVersion+upgradeTip);
                        }
                        
                    }else{
                        Ext.getCmp("newVersion").update(""); //客户端无需升级,隐藏信息
                        Ext.getCmp('upgradeBtn').hide();
                    }
                },
                failure : function() {
                    Ext.websure.MsgError("提示","检查客户端版本更新时失败");
                }
        });
    }
    //数据库备份客户端(不提供客户端升级)
    else{
        Ext.getCmp('newVersion').hide();  
        Ext.getCmp('upgradeBtn').hide();
    }
}

/**
 * 客户端版本升级
 * @param {} me
 * @param {} e
 * @param {} opt
 */
function upgradeClient(me,e,opt){
	
	//客户端版本升级的限制条件
	//1.1 正常在线状态设备  设备状态:1：在线2：不在线 3：异常
	if(deviceStatus!=1){
		Ext.MessageBox.alert(local.window.tip, "离线或异常的设备不能升级客户端");
		return;
	}
	
	Ext.MessageBox.confirm(local.window.tip,"确定升级客户端?",function(btn){
                if(btn == 'yes'){
                    me.setDisabled(true);  //升级按钮不可用
                    //检测客户端是否可在线升级
                    Ext.Ajax.request({
                            url : '/backup/todeviceAction!onLineUpgradeCheck.action',
                            params : {
                                deviceId : selectDeviceId
                            },
                            success : function(response, options) {
                                var result=Ext.decode(response.responseText);  //发送命令消息反馈
                                var msgCode = result.msgCode;
                                var msgContent = result.msgContent;
                                
                                //客户端不能在线升级
                                if(MSG_NORMAL!=msgCode){
                                    Ext.websure.MsgError(msgCode,msgContent);
                                }else{
                                    onlineUpgradeClient(me,selectDeviceId);
                                }
                                
                            },
                            failure : function() {
                                Ext.websure.MsgError("提示","检测客户端版本驱动是否更新失败");
                                me.setDisabled(false);
                            }
                    });
                }else{
                	return;
                }
	});
	
	
	
}

/**
 *  客户端在线升级 
 */
function onlineUpgradeClient(me,deviceId){
	    //升级指定设备的客户端
    Ext.Ajax.request({
            url : '/backup/todeviceAction!upgradeClient.action',
            params : {
                deviceId : deviceId
            },
            success : function(response, options) {
                var result=Ext.decode(response.responseText);  //发送命令消息反馈
                var msgCode = result.msgCode;
                var msgContent = result.msgContent;
                
                if(MSG_NORMAL==msgCode){
                    me.setText('升级中');
                    Ext.websure.MsgTip.msg(local.window.tip, msgContent, true);
                    //轮询刷新客户端的升级状态
                    refreshUpgradeState(selectDeviceId);
                }else{
                    Ext.websure.MsgError(msgCode, msgContent);
                    me.setDisabled(false);
                }
                
            },
            failure : function() {
                Ext.websure.MsgError("提示","发送客户端版本升级命令失败");
                me.setDisabled(false);
            }
    });
}

/**
 * 轮询刷新客户端的升级状态
 */
function refreshUpgradeState(deviceID){
	
	var refreshTask = {
    	   run: function(){
            	   	Ext.Ajax.request({
                        url : '/backup/todeviceAction!getClientUpgradeState.action',
                        params : {
                            deviceId : deviceID
                        },
                        success : function(response, options) {
                            var result=Ext.decode(response.responseText);  //发送命令消息反馈
                            var upgradeState = result.upgradeState;  // 客户端升级状态 ==1 升级中 ==0 未升级
                            //客户端升级完成
                            if(upgradeState==0){
                                //更新客户端升级相关的状态
                            	checkClientUpgrade();
                                //停止定时器
                            	Ext.TaskManager.stop(refreshTask);
                            }
                        }
                     });
           },
           interval: 5000 //5 second
		
	}
	Ext.TaskManager.start(refreshTask);
}

/**
 * 关闭集群下虚拟机或挂载展示面板
 */
function closeClusterWin(e){
	//ViewPort 点击事件
    var eve = e || window.event; //获取事件对象
    
    //鼠标点击坐标
    var x = eve.clientX;  
    var y = eve.clientY;
    
    //获取挂载或虚拟机面板的位置
    var clusterVmimgUseInfo = Ext.getCmp('clusterVmimgUseInfo');
    if(clusterVmimgUseInfo){
        var win_x = clusterVmimgUseInfo.x;
        var win_y = clusterVmimgUseInfo.y;
        
        var winWidth = clusterVmimgUseInfo.getWidth();
        var winHeight = clusterVmimgUseInfo.getHeight();
        
        if(x<win_x || x>(win_x+winWidth) || y<win_y || y>(win_y+winHeight)){
            clusterVmimgUseInfo.destroy();
        }
    
   }
}

/**
 * 获取设备的系统类型.
 * 注意：RHEL4 设备也属于Linux设备. <br>
 * @param typeNum 系统号码
 * @returns {Number} 系统类型  Windows:1 Linux:2 不支持的设备:-1
 */
function getDeviceOsType(typeNum) {
	
	var osType = -1;	// 不受支持的设备
	
	for(var i = 0; i < WINDOWS_DEVICES.length; i++) {
		var type = WINDOWS_DEVICES[i][0];
		if(type == typeNum) {
			osType = 1;	// Windows 设备
			break;
		}
	}
	
	for(var i = 0; i < LINUX_DEVICES.length; i++) {
		var type = LINUX_DEVICES[i][0];
		if(type == typeNum) {
			osType = 2;	// Windows 设备
			break;
		}
	}
	
	return osType;	// 不受支持的设备
	
}

/**
 * 
 * getDeviceOsName:(返回系统名称). <br/>
 *
 * @author LiDongSheng
 * @param typeNum：系统号码
 * @return 系统名称，比如：Windows Server 2008 R2 x86 <br>
 * 		null:不支持的设备
 */
function getDeviceOsName(typeNum) {
	
	var osName = null;	// 不受支持的设备
	
	for(var i = 0; i < WINDOWS_DEVICES.length; i++) {
		var type = WINDOWS_DEVICES[i][0];
		var name = WINDOWS_DEVICES[i][1];
		if(type == typeNum) {
			osName = name;	// Windows 设备
			break;
		}
	}
	
	for(var i = 0; i < LINUX_DEVICES.length; i++) {
		var type = LINUX_DEVICES[i][0];
		var name = LINUX_DEVICES[i][1];
		if(type == typeNum) {
			osName = name;	// Linux 设备
			break;
		}
	}
	
	return osName;	// 不受支持的设备
}

/**
 * 
 * isRedHat4:(是否是RHEL4设备). <br/>
 * 注意：RHEL4 设备也属于Linux设备. <br>
 * @author LiDongSheng
 * @param typeNum: 系统编号
 * @return true:是 
 */
function isRedHat4(typeNum) {
	
	var isReadhat4 = false;
	
	for(var i = 0; i < RHEL4_DEVICES.length; i++) {
		var type = RHEL4_DEVICES[i][0];
		if(type == typeNum) {
			isReadhat4 = true;	// Windows 设备
			break;
		}
	}
	
	return isReadhat4;
}

/**
 * Windows 设备
 */
var WINDOWS_DEVICES = [
					 ['0','Windows x86'],
					 ['1','Windows x64'],
					 ['2','Windows NT 4'],
					 ['3','Windows 2000 x86'],
					 ['4','Windows 2000 IA64'],
					 ['5','Windows XP x86'],
					 ['6','Windows XP x64'],
					 ['7','Windows Server 2003 x86'],
					 ['8','Windows Server 2003 x64'],
					 ['9','Windows Vista x86'],
					 ['10','Windows Vista x64'],
					 ['11','Windows Server 2008 x86'],
					 ['12','Windows Server 2008 x64'],
					 ['13','Windows 7 x86'],
					 ['14','Windows 7 x64'],
					 ['15','Windows Server 2008 R2 x86'],
					 ['16','Windows Server 2008 R2 x64'],
					 ['17','Windows 8 x86'],
					 ['18','Windows 8 x64'],
					 ['19','Windows Server 2012 x86'],
					 ['20','Windows Server 2012 x64'],
					 ['21','Windows 8.1 x86'],
					 ['22','Windows 8.1 x64'],
					 ['23','Windows Server 2012 R2 x86'],
					 ['24','Windows Server 2012 R2 x64'],
					 ['25','Windows 10 x86'],
					 ['26','Windows 10 x64'],
					 ['27','Windows Server 2016 x86'],
					 ['28','Windows Server 2016 x64']
];

/**
 * Linux 设备
 */
var LINUX_DEVICES = [
                     ['32','Linux'],
                     ['33','Linux x64'],
                     ['34','Redhat Linux 4'],
                     ['35','Redhat Linux 4 x64'],
                     ['36','Redhat Linux 5'],
                     ['37','Redhat Linux 5 x64'],
                     ['38','Redhat Linux 6'],
                     ['39','Redhat Linux 6 x64'],
                     ['40','CentOS Linux'],
                     ['41','CentOS Linux x64'],
                     ['42','Debian Linux 4'],
                     ['43','Debian Linux 4 x64'],
                     ['44','Debian Linux 5'],
                     ['45','Debian Linux 5 x64'],
                     ['46','Debian Linux 6'],
                     ['47','Debian Linux 6 x64'],
                     ['48','Debian Linux 7 x64'],
                     ['49','Debian Linux 7 x64'],
                     ['50','FreeBSD Linux'],
                     ['51','FreeBSD Linux x64'],
                     ['52','Oracle Linux'],
                     ['53','Oracle Linux x64'],
                     ['54','Suse Linux'],
                     ['55','Suse Linux x64'],
                     ['56','Suse Linux 10'],
                     ['57','Suse Linux 10 x64'],
                     ['58','Suse Linux 11'],
                     ['59','Suse Linux 11 x64'],
                     ['60','Suse Linux 12'],
                     ['61','Suse Linux 12 x64'],
                     ['62','Ubuntu Linux'],
                     ['63','Ubuntu Linux x64'],
                     ['64','Asianux Linux 2'],
                     ['65','Asianux Linux 2 x64'],
                     ['66','Asianux Linux 3'],
                     ['67','Asianux Linux 3 x64'],
                     ['68','Asianux Linux 4 '],
                     ['69','Asianux Linux 4 x64'],
                     ['70','Redflag Linux 4'],
                     ['71','Redflag Linux 4 x64'],
                     ['72','Redflag Linux 5'],
                     ['73','Redflag Linux 5 x64'],
                     ['74','Redflag Linux 6'],
                     ['75','Redflag Linux 6 x64'],
                     ['76','Redflag Linux 6 x64'],
                     ['77','Kylin Linux x64'],
                     ['78','Fedora Linux'],
                     ['79','Fedora Linux x64'],
                     ['80','Other 2.4x kernel Linux'],
                     ['81','Other 2.4x kernel Linux x64'],
                     ['82','Other 2.6x kernel Linux'],
                     ['83','Other 2.6x kernel Linux x64'],
                     ['84','Other 3.x kernel Linux'],
                     ['85','Other 3.x kernel Linux x64'],
                     ['86','Redhat Linux 7 x64'],
                     ['87','CentOS Linux 4 x64'],
                     ['88','CentOS Linux 5'],
                     ['89','CentOS Linux 5 x64'],
                     ['90','CentOS Linux 6'],
                     ['91','CentOS Linux 6 x64'],
                     ['92','CentOS Linux 7 x64']
                     ];
/**
 * readhat4 设备
 */
var RHEL4_DEVICES = [
					["34","Redhat Linux 4"],
					["35","Redhat Linux 4 x64"]
                     ];