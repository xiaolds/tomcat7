/**
 * 控制层功能处理, written by xuyingan
 */

/**
 * 切换菜单
 * @param allPanel
 * @param configMainPanel
 * @param num
 */
function switchMenu(allPanel, configMainPanel, num){
	allPanel.add({
    	xtype:'GlobalMenu',
    	region : 'north',
    	border:false,
    	height:60
    });
	allPanel.add({
		xtype : 'panel',
		region : 'west',
		width : 239,
		height: '100%',
		border:false,
		bodyStyle:'background:#f5f8fa;',
		items : [{xtype : 'configTreePanel'}]											
		});
 	allPanel.add({
 		xtype : 'panel',
		region : 'center',
		border:false,
		style:'border-left:1px solid #d1dade;',
		layout:"fit",
		items : [{xtype : configMainPanel}]										
		});
 	setSelectedMenu();
    allPanel.doLayout();	        
    Ext.getCmp('configTree').getSelectionModel().select(num);  
}


/**
 * 格式化数据容量大小
 */
function formatSize(size) {
	if(size < 1024) {
		return (Math.floor(size) + "byte");
	} else if(size >= 1024 && size < 1024 * 1024) {
		return Math.floor(size / 1024) + "KB";
	} else if(size >= 1024 * 1024 && size < 1024 * 1024 * 1024) {
		return Math.floor(size / (1024 * 1024)) + "MB";
	} else if(size >= 1024 * 1024 * 1024) {
		return Math.floor(size / (1024 * 1024 * 1024)) + "G";
	}
}

/**
 * 获取存储器最新运行状态 及授权状态
 * 1：正常 2：离线或异常
 * 1：未授权 2：已授权
 */
function checkStorageState(){
	
	    var storageConfigTreePanel = Ext.getCmp('storageConfigTreePanel');
        var selected = storageConfigTreePanel.getSelectionModel().selected;//被选中对象
        var count = selected.getCount();
        if(count == 0){
            Ext.Msg.alert(local.window.tip,local.config.storageNode);
            return ;
        }
        var storageNode = selected.get(0);    //获取选中节点
        var storageId = storageNode.data.id;    //存储器ID
        var state = storageNode.data.state;    //存储器运行状态
        
        //检查存储器的授权状态
         var licState = 1;
         Ext.Ajax.request({
            async :  false,
            url : '/recovery/tostorageAction!findStorageLicState.action',
            params : {
                'storage.id' : storageId
            },
            success : function(response, options) {
                var res = JSON.parse(response.responseText);
                licState = res.licState;
            },
            failure : function(resp, opts) {
//                Ext.MessageBox.alert(local.window.tip,local.config.webGetStoFailure );
            	Ext.websure.MsgError("WF-30066",local.config.webGetStoFailure );
            }
        });
        if(licState==1){
               Ext.Msg.alert(local.window.tip, local.config.stoNotAuth);
               return;
         }
         
        //检查最新的存储器状态
        var storageState = 0;
        Ext.Ajax.request({
            async :  false,
            url : '/config/tostorageConfigAction!checkStorageState.action',
            params : {
                'storage.id' : storageId
            },
            success : function(response, options) {
                var res = JSON.parse(response.responseText);
                storageState = res.storageState;
            },
            failure : function(resp, opts) {
//                Ext.MessageBox.alert(local.window.tip,local.config.stateFailure );
            	Ext.websure.MsgError("WF-30067",local.config.stateFailure );
            }
        });
        
         //最新存储器状态页面未同步
        if(storageState!=state){
            storageConfigTreePanel.getStore().load();  
            //更新详细信息面板
            refreshInfoGrid();
        }
        //==1：正常 ==2：离线或异常
        if(storageState!=1){
            Ext.Msg.alert(local.window.tip,local.config.checkingStorage);
            return ;
        }
       
        return storageNode;       
}

/**
 * 获取服务器设置信息
 * @returns
 */
function getSystemServerConfigInfo(){
	var sysConfig = null;	
	Ext.Ajax.request({
		method : 'post',
		async: false,
		url : '/config/toSystemConfigAction!getSystemServerConfigInfo.action',
		success : function(response,options) {
			try {
				var obj = eval("("+response.responseText+")");												
				sysConfig = obj.SystemConfig;				
			} catch (e) {										
				Ext.websure.MsgError("", local.backup.loginAbnormal);
			}
		},
		failure : function(response,options) {
			Ext.websure.MsgError("WF-30068", local.config.getServerInfoErroer);
		}
	});	
	
	/*Ext.Ajax.request({
		method : 'post',
		async: false,
		url : '/config/toLicenseAction!getLocalCustomerInfo.action',
		success : function(response,options) {
			
		},
		failure : function(response,options) {
			
		}
	});	*/
	
	return sysConfig;
}


/**
 * 获取当前账户日志定时邮件计划设置信息
 * @returns
 */
function getCurrentUserReportlogConfigInfo(){
	var reportlog = null;	
	Ext.Ajax.request({
		method : 'post',
		async: false,
		url : '/config/toSystemConfigAction!getReportlogConfigInfo.action',
		success : function(response,options) {
			try {
				var obj = eval("("+response.responseText+")");												
				reportlog = obj.reportlog;	
			} catch (e) {										
				Ext.websure.MsgError("", local.config.msgError);
			}
		},
		failure : function(response,options) {
			Ext.websure.MsgError("WF-30069", local.config.abnormalPlan);
		}
	});	
	return reportlog;
}


/**
 * 渲染设备组、存储节点和计算节点的CheckBox
 * @param machine 设备组、存储节点或者计算节点
 * @param extObj 渲染的组件
 * @param container	存储值	
 * @param symbol 区分标志
 */
function renderCheckboxForMachine(machine, extObj, symbol, isCreate){	
	var boxLabel;
	var id;
	var inputValue;
	var isAdd = isNull(isCreate) ? false : isCreate;
	var isMachineInit = false;	
	for(var i=0; i<machine.length; i++){
		var isDefaultGroup = false;
		if(DEVICE==symbol){
			boxLabel = machine[i].name;
			id = machine[i].name + machine[i].groupId;
			inputValue = machine[i].groupId;			
		}else if(STONODE==symbol){
			boxLabel = (machine[i].name+"_"+machine[i].ipLan);
			id = machine[i].uniqueId;
			inputValue = machine[i].id;
		}else if(CALNODE==symbol){
			boxLabel = (machine[i].nodeName+"_"+machine[i].nodeIpLan);
			id = machine[i].nodeUniqueId;
			inputValue = machine[i].nodeId;
		}						
		var checkbox = Ext.create('Ext.form.Checkbox',{
				boxLabel: boxLabel,
				id: id,
				inputValue: inputValue,
				listeners: {
					change : function(newValue, oldValue, eOpts){
						if(isAdd || isMachineInit){
							var arr = [];
							var checks = extObj.getChecked();							
							/*if (checks.length == 0) {
								extObj.previousSibling().setValue(false);
							} else if (checks.length == machine.length) {
								extObj.previousSibling().setValue(true);
							}*/
							Ext.each(checks,function(item){														 										
								arr.push(item.inputValue);														 																								 												
							});								
							if(DEVICE==symbol){							
								BIND_MACHINE.devicegroup = arr.slice(0);	
							}else if(STONODE==symbol){								
								BIND_MACHINE.stonode = arr.slice(0);														 								
							}else if(CALNODE==symbol){								
								BIND_MACHINE.calnode = arr.slice(0);
							}			
						}												
				}
			}
		}); 	  										 					 
		extObj.items.add(checkbox);
	}
	if(!isAdd){		
		if(DEVICE==symbol){
			for(var m=0;m<BIND_MACHINE.devicegroup.length;m++){				
				var selCheckBox = extObj.query("checkbox[inputValue="+BIND_MACHINE.devicegroup[m]+"]")[0];  		
		    	selCheckBox.setValue(true);
			}			
		}else if(STONODE==symbol){
			for(var m=0;m<BIND_MACHINE.stonode.length;m++){
				var selCheckBox = extObj.query("checkbox[inputValue="+BIND_MACHINE.stonode[m]+"]")[0];  		
		    	selCheckBox.setValue(true);
			}	
		}else if(CALNODE==symbol){
			for(var m=0;m<BIND_MACHINE.calnode.length;m++){
				var selCheckBox = extObj.query("checkbox[inputValue="+BIND_MACHINE.calnode[m]+"]")[0];  		
		    	selCheckBox.setValue(true);
			}	
		}
		isMachineInit = true;
	}
}


/**
 * 渲染设备、存储节点、计算节点和系统权限的CheckBox
 * @param modulepower 模块权限
 * @param checkboxgroup 组件checkboxgroup
 * @param filedset 组件filedset
 * @param power	权限
 * @param symbol 区分标志
 */
function renderCheckboxForModulePower(modulepower, checkboxgroup, fieldset, power, symbol){
	var isInit = false;
	for(var i=0; i<modulepower.length; i++){										 						
		var checkbox = Ext.create('Ext.form.Checkbox',{
				boxLabel : modulepower[i].powerText,
				itemId : modulepower[i].powerKey,
				inputValue : modulepower[i].id,
				listeners : {
					change : function(newValue, oldValue, eOpts){						
						if(isInit){
							var arr = [];	
							var checks = checkboxgroup.getChecked();
							if (checks.length == 0) {
								checkboxgroup.previousSibling().setValue(false);
							} else if (checks.length == modulepower.length) {
								checkboxgroup.previousSibling().setValue(true);
							}
							Ext.each(checks, function(item){														 										
								arr.push(item.inputValue);														 																								 												
							});
							power[symbol] = arr.slice(0);						
						}									 									
					}
				}
		   });  					  										 					 
		   checkboxgroup.items.add(checkbox);
	}																	 										
	for(var m=0; m<power[symbol].length; m++){								            	    		    		
		var selCheckBox = fieldset.query("checkbox[inputValue="+power[symbol][m]+"]")[0];								            	    		    										            	    		    		
    	selCheckBox.setValue(true);
	}	
	isInit = true;
}


/**
 * init the 'change' listener of checkbox
 * @param checkbox
 * @param value
 */
function initCheckboxListenerAsChange(checkbox, value, inputValue, username) {
	 var fieldset = checkbox.up('fieldset');
	 var paramForth = isNull(username) ? true : false;
	 if (value) {		 
		 if (notNull(username) && isManager(username)) {
			 fillAllCheckBox(fieldset);
		 } else {
			 fillAllCheckBox(fieldset, inputValue); 
		 }		
	 } else {
		 clearAllCheckbox(fieldset);
	 }		
}


/**
 * init the 'render' listener of checkbox
 * @param checkbox
 */
function initCheckboxListenerAsRender(checkbox) {
	var group = checkbox.nextSibling();
	 if (group.getChecked().length == group.query('checkbox').length) {
		 checkbox.setValue(true);
	 } 
}


function autofillListenerAsChange(checkbox, value) {
	var checkboxgroup = checkbox.up('fieldset').down('checkboxgroup');
	if (value) {
		fillAllCheckBox(checkboxgroup); 
		disableAllCheckboxs(checkboxgroup);
	} else {
		enableAllCheckboxs(checkboxgroup);
	}
}

function disableAllCheckboxs(ext) {
	var checkboxs = ext.query("checkbox");
	for(var i = 0; i < checkboxs.length; i++){		
		checkboxs[i].disable();
	}
}

function enableAllCheckboxs(ext) {
	var checkboxs = ext.query("checkbox");
	for(var i = 0; i < checkboxs.length; i++){		
		checkboxs[i].enable();
	}
}


/**
 * 填充extjs组件下的checkbox
 * @param ext
 * @param inputValue
 */
function fillAllCheckBox(ext, inputValue){
	var allcheckbox = ext.query("checkbox");
	for(var i=0; i<allcheckbox.length; i++){		
		allcheckbox[i].setValue(true);
	}
	if(notNull(inputValue)){
		var checkbox = ext.query("checkbox[inputValue="+inputValue+"]")[0];
		checkbox.setValue(false);
	}
}


/**
 * 清空extjs组件下的checkbox
 * @param ext
 * @param inputValue
 */
function clearAllCheckbox(ext, inputValue){
	var allcheckbox = ext.query("checkbox");	
	for(var i=0; i<allcheckbox.length; i++){		
		allcheckbox[i].setValue(false);
	}
	if(notNull(inputValue)){
		var checkbox = ext.query("checkbox[inputValue="+inputValue+"]")[0];
		checkbox.setValue(true);
	}
}



/**
 * 重新加载页面上的数据
 * @param panelID 主页面Panel的ID
 */
function reloadPageData(panelID){
	var allPanel = Ext.getCmp('allPanel');     
    allPanel.removeAll();
    if('outputConfigPanel'==panelID){
    	switchMenu(allPanel, panelID, 0);
    }else if('systemConfigPanel'==panelID){
    	switchMenu(allPanel, panelID, 3);
    }	
}


/**
 * 验证密码错误
 * @param form
 */
function validatePasswordError(form){
	var password = form.query("#userPwd")[0].getValue();
	if(password!=form.query("#userConfirmPwd")[0].getValue()){
		Ext.websure.MsgError("", local.config.resumeLoad);			
    	return true;
	}	 				
	if(NORMAL==SYSTEM_CONFIG_INFO.isPwdCheck){
		var pwdMinLen = isNullInt(SYSTEM_CONFIG_INFO.pwdStrength) ? PASSWORD_MIN_LENGTH : SYSTEM_CONFIG_INFO.pwdStrength;
		var pwdLen = password.length;
		if(notInNumRange(pwdLen, pwdMinLen, PASSWORD_MAX_LENGTH)){
			Ext.websure.MsgError("",local.config.passwordLen+local.colon+pwdMinLen+local.MAX+local.colon+PASSWORD_MAX_LENGTH+local.retype);					
	    	return true;
		}
		var pwdType = SYSTEM_CONFIG_INFO.pwdCheckType;
		if(PASSWORD_CHECK_TYPE_OF_LETTERS_AND_NUMBERS==pwdType && notIncludeLettersAndNumbers(password)){
			Ext.websure.MsgError("", local.codeErrorCodeNum+local.retype);				
	    	return true;
		}
	}
	return false;
}


/**
 * 打开账户修改窗口
 * @param record 选中记录
 */
function openAccountModifyWindow(record, powerKey){
	if(isNull(record)){
		var accountListGridPanel = Ext.getCmp('accountListGrid');
		record = accountListGridPanel.getSelectionModel().selected.get(0);
	}
	var account = record.data;
	var accountModifyWin = Ext.create('acesure.config.view.account.AccountModifyWindow').show();
	var form = accountModifyWin.down('form');	
	form.loadRecord(record);
	form.query('#userConfirmPwd')[0].setValue(account.userPwd);
	var role = account.role;
	var roleName = role.roleName;
	form.query('#initRoleId')[0].setValue(role.roleId);
	if(isManager(roleName)){
		form.query('#roleId')[0].setVisible(false);
	}
	form.query('#roleId')[0].setValue(role.roleId);
	/*if (form.query('#tempdevgroup')[0].getValue() || isManager(roleName)) {
		form.query('#autofillDevgroup')[0].setValue(true);		
	}
	if (form.query('#tempstonode')[0].getValue() || isManager(roleName)) {
		form.query('#autofillStonode')[0].setValue(true);
	}
	if (form.query('#tempcalnode')[0].getValue() || isManager(roleName)) {
		form.query('#autofillCalnode')[0].setValue(true);
	}	*/
	//form.doLayout();
}


/**
 * 删除账户
 * @param userID 账户ID
 * @param userName 账户名
 */
function deleteSingleAccount(userID, userName, powerKey){
	Ext.Msg.confirm(local.window.tip,local.config.beEmpty+ '<br>'+local.config.sureDelete+userName+local.config.what,
			function(bt){
		        if('yes'==bt){
		        	Ext.Ajax.request({
		        		method : 'post',
		        		params: {'userid': userID, 'username': userName},
		        		url : '/config/toUserConfigAction!deleteSingleUser.action',
		        		success : function(response,options) {
		        			try {
		        				var obj = eval("("+response.responseText+")");												
		        				showResultDialog(obj.msgCode, obj.msgContent);
		        				Ext.getCmp('accountListGrid').getStore().load();	
		        			} catch (e) {										
		        				Ext.websure.MsgError("",local.config.msgError);
		        			}
		        		},
		        		failure : function(response,options) {
		        			Ext.websure.MsgError("WF-30070", local.config.abnormalAcco);
		        		}
		        	});	
		        }
	        }, this);
}


/**
* 删除角色
* @param roleID 角色ID
* @param roleName 角色名
*/
function deleteSingleRole(roleID, roleName, powerKey){
	Ext.Msg.confirm(local.window.tip, local.config.deleteCharact+roleName+local.config.what,
			function(bt){
		        if('yes'==bt){
		        	Ext.Ajax.request({
		        		method : 'post',
		        		params : { rolename:roleName, roleid:roleID },
		        		async :  false,
		        		url : '/authority/toAuthorityAction!deleteRole.action',
		        		success : function(response,options) {
		        			try {
		        				var obj = eval("("+response.responseText+")");	
		        				showResultDialog(obj.msgCode, obj.msgContent);
		        				Ext.getCmp('roleListGrid').getStore().load();					
		        			} catch (e) {																	
		        				Ext.websure.MsgError("",local.config.msgError);
		        			}
		        		},
		        		failure : function(response,options) {
		        			Ext.websure.MsgError("WF-30071", local.config.roleDelete);
		        		}
		        	});	
		        }
		        
	        }, this);	
}


/**
 * 打开角色修改窗口
 * @param record 选中记录
 */
function openRoleModifyWindow(record, powerKey){
	if(isNull(record)){
		var roleListGridPanel = Ext.getCmp('roleListGrid');
		record = roleListGridPanel.getSelectionModel().selected.get(0);
	}	
	var role = record.data;   	
	var window = Ext.create('acesure.config.view.role.RoleModifyWindow').show();	
	window.down('form').loadRecord(record);
}


/**
 * 打开更新权限窗口
 */
function openGrantPowerWindow(roleID, roleName, powerKey){
	SYSTEM_CONFIG_INFO.ROLE_ID = roleID;
	var window = Ext.create('acesure.config.view.role.RoleAuthWindow').show();
	window.setTitle(local.btn.grant+":"+roleName);	
}


/**
 * 打开系统安全设置窗口
 */
function openEditSafetyConfigWindow(){	
	var safetyConfigWin = Ext.create('acesure.config.view.system.SystemSafetyConfigWindow').show();		
}


/**
 * 打开日志清理设置窗口
 */
function openEditLogConfigWindow(){	
	var logConfigWin = Ext.create('acesure.config.view.system.SystemLogConfigWindow').show();		
}


/**
 * 打开导入数据库数据文件窗口
 */
function openImportDatabaseFileWindow(){
	var importDbFileWin = Ext.create('acesure.config.view.system.SystemDatabaseImportFileWindow').show();
}


/**
 * 打开导出数据库数据文件窗口
 */
function openExportDatabaseFileWindow(){
	var exportDbFileWin = Ext.create('acesure.config.view.system.SystemDatabaseExportFileWindow').show();
}


/**
 * 打开编辑数据库数据文件自动备份路径窗口
 */
function openEditDatabaseAutoBackupPathWindow(){
	var databaseConfigWin = Ext.create('acesure.config.view.system.SystemDatabaseConfigWindow').show();
}


/**
 * 打开设置短信定时信息通知的Window
 */
function openEditNotifySMSConfigWindow(){
	Ext.Ajax.request({
		method : 'post',
		url : '/config/toSystemConfigAction!checkSMS.action',
		success : function(response, options) {
			try {
				var obj = eval("("+response.responseText+")");
				if (obj.active) {
					if (obj.nophone) {
						Ext.Msg.alert(local.window.tip, local.config.phoneNoNullAndSave);						
					}
					var smsAcWin = Ext.create('acesure.config.view.output.OutputNotifySMSConfigWindow').show();
					smsAcWin.query('#smsConfigPhone')[0].setValue(CURRENT_USER.getUser().userPhone);
				} else {
					Ext.Msg.confirm(local.window.tip, local.config.msgOpenTip,
							function(bt) {
								if ('yes' == bt) {
									var myMask = new Ext.LoadMask(Ext.getBody(), {msg :local.config.msgOpening});											
									myMask.show();
									Ext.Ajax.request({
										method : 'post',
										timeout: 90*1000,
										url : '/config/toSystemConfigAction!startSMS.action',
										success : function(response, options) {
											try {
												var objinner = eval("("+response.responseText+")");
												myMask.hide();
												if (objinner.active) {
													var text = local.config.msgOpenSuccess;													
													if (objinner.nophone) {
														text += local.config.msgOpenSuccessNoPhone;																										
													}
													var smsWindow = Ext.create('acesure.config.view.output.OutputNotifySMSConfigWindow').show();
													smsWindow.query('#smsConfigPhone')[0].setValue(CURRENT_USER.getUser().userPhone);
													Ext.Msg.alert(local.window.tip, text);
												} else {
													Ext.Msg.alert(local.window.tip, local.config.msgOpenFailure);
												}
											} catch (e) {
												myMask.hide();
												Ext.websure.MsgError("", local.backup.loginAbnormal);			
											}
										},
										failure : function(response,options) {
											myMask.hide();
											Ext.websure.MsgError("WF-30072", local.config.msgOpenError);			
										}
									});
								} 
							}, this);
				}					
			} catch (e) {
				Ext.websure.MsgError("", local.backup.loginAbnormal);			
			}
		},
		failure : function(response,options) {
			Ext.websure.MsgError("WF-30073", local.config.msgTestError);			
		}
	});
}


/**
 * 打开设置邮件定时信息通知的Window
 */
function openEditNotifyMailConfigWindow(){
	var notifyMailConfigWin = Ext.create('acesure.config.view.output.OutputNotifyMailConfigWindow').show();
	var store = Ext.create('acesure.config.store.MailConfigStore');
	store.load({
		callback: function (record, options, success){
			notifyMailConfigWin.down('form').getForm().loadRecord(record[0]);
		}
	});				
}


/**
 * 打开设置定时信息通知时间的Window
 * @param notifyModuleID
 * @param notifyModuleName
 */
function openEditNotifyTimeConfigWindow(notifyModuleID, notifyModuleName){
	notifyModuleName = isNull(notifyModuleName) ? local.config.allModule : notifyModuleName;
	var window = Ext.create('acesure.config.view.output.OutputNotifyTimeConfigWindow').show();
	window.query('#notifyModuleID')[0].setValue(notifyModuleID);
	window.query('#notifyModuleName')[0].setValue(notifyModuleName);
	window.setTitle("<span>"+local.config.infoNotifyTimeEdit+"</span>"+"-"+notifyModuleName);
}


/**
 * 修改指定模块定时通知方式
 * @param moduleID
 */
function modifyNotifyTypes(moduleID, moduleName){	
	var notifyTypes = EMPTY;	
	var notifyNews = document.getElementById('notifyNews'+moduleID);
	var notifyMail = document.getElementById('notifyMail'+moduleID);
	var notifyMessage = document.getElementById('notifyMessage'+moduleID);
	notifyTypes = notNull(notifyNews) && notifyNews.checked ? MSG+"," : notifyTypes;
	notifyTypes = notNull(notifyMail) && notifyMail.checked ? notifyTypes+MAIL+"," : notifyTypes;
	notifyTypes = notNull(notifyMessage) && notifyMessage.checked ? notifyTypes+SMS+"," : notifyTypes;
	notifyTypes = isNull(notifyTypes) ? EMPTY : notifyTypes.substring(0, notifyTypes.length-1);
	Ext.Ajax.request({
		method : 'post',
		params : { 			
			notifyTypes: notifyTypes,
			moduleID: moduleID,
			moduleName: moduleName
			},
		url : '/config/toSystemConfigAction!setCurrentUserNotifyTypesConfigInfo.action',
		success : function(response,options) {
			try {
				var obj = eval("("+response.responseText+")");
				var code = obj.msgCode;
				if(MSG_NORMAL!=code){
					Ext.websure.MsgError(code, obj.msgContent);
				}								
			} catch (e) {
				Ext.websure.MsgError("", local.backup.loginAbnormal);			
			}
		},
		failure : function(response,options) {
			Ext.websure.MsgError("WF-30074", local.config.notifyWayError);			
		}
	});	
}


/**
 * 刷新页面服务器设置的数据
 * @param systemconfig
 */
function refreshPageDataForServer(systemconfig){
	if(isNull(systemconfig)){
		systemconfig = getSystemServerConfigInfo();
	}
	var IPInfoDom = document.getElementById("IPServer");
	if(notNull(systemconfig.serverHostIP) || notNull(systemconfig.serverBackupIP)){
		IPInfoDom.innerHTML = "";
		if(notNull(systemconfig.serverHostIP)){
			IPInfoDom.innerHTML = systemconfig.serverHostIP+local.config.mainIP;
		}
		if(notNull(systemconfig.serverBackupIP)){
			IPInfoDom.innerHTML += "&nbsp"+systemconfig.serverBackupIP+local.config.secondIP;
		}
	}		
	setDomInnerHTML("webPort", systemconfig.webPort);			
	setDomInnerHTML("msgPort", systemconfig.msgPort);	
}


/**
 * 刷新页面日志管理的数据
 * @param systemconfig
 */
function refreshPageDataForLogManagement(systemconfig, sendMail){
	if(isNull(systemconfig)){
		systemconfig = getSystemServerConfigInfo();
	}
	setDomInnerHTMLByBinary("logAutoClean", systemconfig.isStartAutoCleanLog, DONE_OPEN, DONE_CLOSE, NOT_CONFIG);
	setDomInnerHTMLByBinary("logSendMailPlan", sendMail, DONE_OPEN, DONE_CLOSE, NOT_CONFIG);	
}


/**
 * 刷新页面系统安全设置的数据
 * @param systemconfig
 */
function refreshPageDataForSystemSafety(systemconfig){
	if(isNull(systemconfig)){
		systemconfig = getSystemServerConfigInfo();
	}
	setDomInnerHTMLByBinary("errorPwdLimit", systemconfig.isStartLoginErroLimit, DONE_OPEN, DONE_CLOSE, NOT_CONFIG);
	setDomInnerHTMLByBinary("loginIPLimit", systemconfig.isStartIpLimit, DONE_OPEN, DONE_CLOSE, NOT_CONFIG);
	setDomInnerHTMLByBinary("outdateCheck", systemconfig.pwdIsExpired, DONE_OPEN, DONE_CLOSE, NOT_CONFIG);
	setDomInnerHTMLByBinary("pwdCheck", systemconfig.isPwdCheck, DONE_OPEN, DONE_CLOSE, NOT_CONFIG);
}


/**
 * refresh the last time of exporting database sqlfile in page 'systemconfig',
 * written by xuyingan
 * 
 * @param systemconfig
 */
function refreshPageDataForDatabaseIO(systemconfig) {
	if(isNull(systemconfig)){
		systemconfig = getSystemServerConfigInfo();
	}
	var exportTime = systemconfig.lastExportTime;
	if (notNull(exportTime)) {
		if (exportTime.indexOf('T') > 0) {
			var times = exportTime.split('T');
			systemconfig.lastExportTime = times[0] + BLANK + times[1];
		}
		document.getElementById("exportDatabaseTime").innerHTML = systemconfig.lastExportTime;
	}
}


/**
 * refresh the path of backuping database sqlfile in page 'systemconfig'
 * automaticly and regularly, written by xuyingan
 * 
 * @param systemconfig
 */
function refreshPageDataForDatabaseBackup(systemconfig) {
	if(isNull(systemconfig)){
		systemconfig = getSystemServerConfigInfo();
	}
	setDomInnerHTMLByBinary("isBackupDB", systemconfig.isBackupDB, DONE_OPEN, DONE_CLOSE, NOT_CONFIG);
	if (notNull(systemconfig.backupDBPath)) {
		document.getElementById("exportDatabasePath").innerHTML = systemconfig.backupDBPath;
	}
}


/**
 * 刷新页面邮件设置的数据
 * @param mailconfig
 */
function refreshPageDataForMailConfig(mailconfig){
	var address = mailconfig.mailAddress;
	setDomInnerHTML("smtpHostConfig", isNull(mailconfig.mailSMTPHost) ? EMPTY : mailconfig.mailSMTPHost);
	setDomInnerHTML("mailAddrConfig", isNull(address) ? EMPTY : mailconfig.mailAddress);
	setDomInnerHTML("mailConfigState", isNull(address) ? NOT_CONFIG : DONE_CONFIG);
}


/**
 * 刷新页面短信设置的数据
 * @param smsconfig
 */
function refreshPageDataForSMSConfig(smsconfig){
	var smsCOM = smsconfig.smsConfigCOM;
	setDomInnerHTML("smsCOMConfig", isNull(smsCOM) ? NOT_CONFIG : smsCOM);
	setDomInnerHTML("smsConfigState", isNull(smsCOM) ? NOT_CONFIG : DONE_CONFIG);
}

/**
 * 刷新存储介质空间报警阈值
 * @param {} systemconfig
 */
function refreshVMSWarnThreshold(systemconfig) {
    if(isNull(systemconfig)){
        systemconfig = getSystemServerConfigInfo();
    }
    
    if(systemconfig.warningStorage==0){
    	setDomInnerHTML("isThreshold", NOT_CONFIG);
    }else{
        setDomInnerHTML("isThreshold", systemconfig.warningStorage+"%");
    }
}

/**
 * config the month of sending mail about log automaticly and regularly, written
 * by xuyingan
 * 
 * @param monthSendMail
 */
function configSendMailMonthOfLog(monthSendMail){
	Ext.Ajax.request({
		method : 'post',
		async : false,
		params : {
			monthSendMail : monthSendMail
		},
		url : '/config/toSystemConfigAction!configAutoSendMailOfLog.action',
		success : function(response, options) {
			try {
				var obj = eval("(" + response.responseText + ")");
				showResultDialog(obj.msgCode, obj.msgContent);
			} catch (e) {
				Ext.websure.MsgError("", local.backup.loginAbnormal);
			}
		},
		failure : function(response, options) {
			Ext.websure.MsgError("WF-30075",local.config.setAbnormalPlan);
		}
	});
}


function showMsg(data){
	var msgCode=data[0].msgCode;
	var msgContent=data[0].msgContent;
	//>30000异常，=30000正常
	if(msgCode>30000){
		Ext.websure.MsgError(msgCode,msgContent);		
	}else{
		Ext.websure.MsgTip.msg(local.window.tip, msgContent, true);
	}
}


/**
 * 
 * validate license-to-reg-pids by contrasting license-done-reg-pids, written by
 * xuyingan
 * 
 * @param readyPids
 *            license-to-reg-pids
 * @param donePids
 *            license-done-reg-pids
 * @returns {Boolean}
 */
function validatePids(readyPids, donePids) {
	if (isNull(readyPids)) {
		Ext.Msg.alert(local.window.tip, local.config.proNumNoNull);
		return false;
	}
	readyPids = readyPids.trim();
	var length = readyPids.length;
	if (isNull(donePids)) {
		if (length == LICENSE_PRODUCT_LENGTH) {
			var readyPidType = readyPids.substr(0, 2);
			if (readyPidType != LICENSE_BASIC_PRODUCT_TAG) {
				Ext.Msg.alert(local.window.tip, local.config.productNumMustBasic);
				return false;
			}
		} else {
			Ext.Msg.alert(local.window.tip, local.config.productNumFormatError);
			return false;
		}
	} else {
		var pidsArray = readyPids.split(LICENSE_PIDS_SPLIT);
		for (var i = 0; i < pidsArray.length; i++) {
			pidsArray[i] = pidsArray[i].trim();
		}		
		for (var i = 0; i < pidsArray.length; i++) {			
			if (notLicenseProduct(pidsArray[i])) {
				Ext.Msg.alert(local.window.tip, local.config.productNumFormatErrorNum1 + (i+1) + local.config.productNumFormatErrorNum2);
				return false;
			}
			if (pidsArray[i].substring(0, 2) == LICENSE_BASIC_PRODUCT_TAG) {
				Ext.Msg.alert(local.window.tip, local.config.basicOnlyOne);
				return false;
			}
		}
		var str = "";
		var duplication = false;
		donePids = donePids.trim();
		var doneArray = donePids.split(LICENSE_PIDS_SPLIT);
		for (var i = 0; i < doneArray.length; i++) {
			doneArray[i] = doneArray[i].trim();
		}	
		for (var i = 0; i < pidsArray.length; i++) {
			var temp = 0;
			for (var j = 0; j < pidsArray.length; j++) {
				if (pidsArray[i] == pidsArray[j]) {
					++temp;
					if (temp >= 2) {
						Ext.Msg.alert(local.window.tip, local.config.productNumNoSame);
						temp = 0;
						return false;
					}
				}
			}
		}		
		for (var i = 0; i < pidsArray.length; i++) {
			pidsArray[i] = pidsArray[i].trim();			
			for (var j = 0; j < doneArray.length; j++) {
				if (pidsArray[i] == doneArray[j]) {					
					str = str + local.config.productNumFormatErrorNum1 + (i+1) +local.config.theProductNum+ pidsArray[i] + ",<br/>";
					duplication = true;
					break;
				}
			}
		}
		if (duplication) {
			str = str.substring(0, str.length-6);
			Ext.Msg.show({
				  title : local.window.tip,
				  msg : local.config.productNumHaveActived+'<br/>' + str,
				  width : 350,
				  buttons : Ext.Msg.OK,
				  icon : Ext.MessageBox.ERROR
				});
			return false;
		}		
	}
	return true;
}

/**
 * 修改介质同步设置
 * @param {} synchId
 *      介质同步设置ID
 */
function modifySynchSet(synchId){
	alert("modify:id:"+synchId)
}
/**
 * 
 * startSyncStorage:启动介质同步
 * @data 2016-11-30
 * @auth WangShaoDong
 */
function startSyncStorage(synchId){
	var myMask = new Ext.LoadMask(Ext.getBody(), {   
		msg : "正在启动介质同步，请稍后..."
	});
	myMask.show();
	Ext.Ajax.request({//目标介质查重
		url : '/config/toSynchStPath!startSynchStorage.action',
		params : {
			"synchStoragePath.id" : synchId
			
		},
		timeout:100000,
		success : function(response, options) {
			myMask.hide();
			var data =JSON.parse(response.responseText);
			var msgCode=data[0].msgCode;
			var msgContent=data[0].msgContent;
			if(MSG_NORMAL==msgCode){
				Ext.websure.MsgTip.msg(local.window.tip, msgContent, true);
				Ext.getCmp("synchStPathInfoGridPanel").getStore().load();
			}else{
				Ext.websure.MsgError(msgCode, msgContent);
			}
		},
		failure : function() {
			myMask.hide();
			Ext.websure.MsgError("WF-30086","启动介质同步异常！");
		}
	});
}
/**
 * 
 * stopSyncStorage:停止介质同步
 * @data 2016-11-30
 * @auth WangShaoDong
 */
function stopSyncStorage(synchId){
	var myMask = new Ext.LoadMask(Ext.getBody(), {   
		msg : "正在停止介质同步，请稍后..."
	});
	myMask.show();
	Ext.Ajax.request({//目标介质查重
		url : '/config/toSynchStPath!stopSynchStorage.action',
		params : {
			"synchStoragePath.id" : synchId
			
		},
		timeout:100000,
		success : function(response, options) {
			myMask.hide();
			var data =JSON.parse(response.responseText);
			var msgCode=data[0].msgCode;
			var msgContent=data[0].msgContent;
			if(MSG_NORMAL==msgCode){
				Ext.websure.MsgTip.msg(local.window.tip, msgContent, true);
				Ext.getCmp("synchStPathInfoGridPanel").getStore().load();
			}else{
				Ext.websure.MsgError(msgCode, msgContent);
			}
		},
		failure : function() {
			myMask.hide();
			Ext.websure.MsgError("WF-30086","停止介质同步异常！");
		}
	});
}
/**
 * 删除介质同步设置
 * @param {} synchId
 *      介质同步设置ID
 */
function delSynchSet(synchId){
	Ext.MessageBox.confirm(local.window.tip,"确定删除同步介质？", function(btn){
		if(btn=='yes'){
			var myMask = new Ext.LoadMask(Ext.getBody(), {   
				msg : "正在删除介质同步，请稍后..."
			});
			myMask.show();
			Ext.Ajax.request({//目标介质查重
				url : '/config/toSynchStPath!deleteSynchStorage.action',
				params : {
					"synchStoragePath.id" : synchId
				},
				timeout:100000,
				success : function(response, options) {
					myMask.hide();
					var data =JSON.parse(response.responseText);
					var msgCode=data[0].msgCode;
					var msgContent=data[0].msgContent;
					console.log(data);
					if(MSG_NORMAL==msgCode){
						Ext.websure.MsgTip.msg(local.window.tip, msgContent, true);
						Ext.getCmp("synchStPathInfoGridPanel").getStore().load();
					}else{
						Ext.websure.MsgError(msgCode, msgContent);
					}
				},
				failure : function() {
					myMask.hide();
					Ext.websure.MsgError("WF-30086","删除介质同步异常！");
				}
			});
		}
	});
	
}

/**
 * check service 'mail' enable or disable, written by xuyingan
 * 
 * @returns {Boolean}
 */
function enableMailService() {
	var active = false;
	Ext.Ajax.request({
		method : 'post',
		async: false,
		url : '/config/toSystemConfigAction!getServerMailConfig.action',
		success : function(response,options) {
			try {
				var obj = eval("("+response.responseText+")");
				if (obj.MailConfig.mailSMTPHost) {
					active = true;
				}
			} catch (e) {
				Ext.websure.MsgError("", local.backup.loginAbnormal);			
			}
		},
		failure : function(response,options) {
			Ext.websure.MsgError("WF-30076", local.config.emailServiceError);			
		}
	});	
	return active;
}

/**
 * check service 'SMS' enable or disable, written by xuyingan
 * 
 * @returns {Boolean}
 */
function enableSMSService() {
	var active = false;
	Ext.Ajax.request({
		method : 'post',
		async: false,
		url : '/config/toSystemConfigAction!checkSMS.action',
		success : function(response,options) {
			try {
				var obj = eval("("+response.responseText+")");
				if (obj.active && !obj.nophone) {
					active = true;
				}
			} catch (e) {
				Ext.websure.MsgError("", local.backup.loginAbnormal);			
			}
		},
		failure : function(response,options) {
			Ext.websure.MsgError("WF-30077", local.config.msgServiceError);			
		}
	});	
	return active;
}

/**
 * 编辑存储介质空间报警阈值
 */
function openEditVmsWarnigThresholdWindow(){
	var databaseConfigWin = Ext.create('acesure.config.view.system.VMSSpaceWarningConfigWindow').show();
}
/**
 * 
 * importOem:导入系统模版
 * @data 2016-12-27
 * @auth WangShaoDong
 */
function importOem(){
	var oem = Ext.create('acesure.config.view.system.SystemImportOem').show();
}

/**
 * 
 * importOem:导入系统模版
 * @data 2016-12-27
 * @auth WangShaoDong
 */
function importOem(){
	var oem = Ext.create('acesure.config.view.system.SystemImportOem').show();
}
/**
 * 
 * exportOem:导出系统模版
 * @data 2016-12-27
 * @auth WangShaoDong
 */
function exportOem(){
	var downOEMFileURL = '/config/toSystemConfigAction!exportOemFile.action';
	parent.location.href = downOEMFileURL;
}


function loadLicenseCustomerInfo(form) {
	var customerStore = Ext.create('Ext.data.Store', {
		fields : [								          
		    { name : 'pids' },
		    { name : 'customerName' },
		    { name : 'contact' },
		    { name : 'phone' },
		    { name : 'addr' },
		    { name : 'email' },
		    { name : 'industry' },
		    { name : 'remark' },
		    { name : 'agentName' },
		    { name : 'agentContactor' },
		    { name : 'agentAddr' },
		    { name : 'donePids' }
		],
		proxy : {
			type : 'ajax',
			url : '/config/toLicenseAction!getRecentCustomerInfo.action',
			reader : {
				type : 'json',
				root : 'customer'
			}
		}
	});
	customerStore.load({
		callback : function(records, options, success) {
			form.loadRecord(records[0]);
		}
	});				
}

/**
 * get the parameters of the current url, written by xuyingan
 * @returns {Object}
 */
function getUrlParameters() { 	
    var url = location.search;    
    var theRequest = new Object();   
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);   
        strs = str.split("&");   
        for(var i = 0; i < strs.length; i++) {         	        	
            theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);   
        }   
    }   
    return theRequest;   
}   

/**
 * format license-base-packet information from head to tail with 'uuid', written by xuyingan
 * 
 * @param head
 * @param tail
 * @param uuid
 * @returns
 */
function formatLicenseBasePacketInfo(head, tail, uuid) {
	return head + LICENSE_DESC_PIDS_SPLIT + tail + LICENSE_DESC_VALUE_SPLIT + uuid;
}


/**
 * show license each module value, written by xuyingan
 * 
 * @param value
 * @param type
 * @returns
 */
function showLicenseEachValue(value, type) {
	if (typeof(value) != 'string') {
		value = value.toString();
	}
	if (0 == type) {
		if (value.indexOf('true') >= 0) {
			return local.open;
		} else {
			return local.close;
		}		
	} else if (1 == type) {
		var lcsValue = value.split(LICENSE_DESC_VALUE_SPLIT)[0];
		if (lcsValue.indexOf('-1') >= 0 ) {
			return local.config.noLimit;
		} else if (value.indexOf(LICENSE_DESC_PIDS_SPLIT) >= 0) {
			var datas = value.split(LICENSE_DESC_PIDS_SPLIT);
			var num = 0;
			var desc = '';
			for (var i = 0; i < datas.length; i++) {
				var dataSet = datas[i].split(LICENSE_DESC_VALUE_SPLIT);
				var dataNum = Number(dataSet[0]);
				var dataUuid = dataSet[1];
				num = num + dataNum;
				if (dataNum > 0 && notNull(dataUuid)) {
					desc += dataUuid + ": " + dataNum + "\n";
				}										
			}
			//desc = desc.substring(0, desc.length-2);
			return '<span title="'+desc+'">' + num + '</span>';									
		} else {
			return value;
		}
	}	
}