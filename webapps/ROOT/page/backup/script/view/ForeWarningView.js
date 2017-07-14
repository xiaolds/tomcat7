var controlValue = null;
var clientState = null;
var backupState = null;

//预警监控控制台
Ext.define("websure.backup.view.ForeWarningPanel", {
	extend : 'Ext.panel.Panel',
	alias : 'widget.ForeWarningPanel',
    width: '100%',
    border:false,
  	layout : {
		type : 'vbox'
	},
	defaults : {
		border : false
	},
	items : [{
		width : '100%',
		height : 42,
		layout : 'hbox',
		border : false,
		id : 'foreWarningConsol',
		cls : 'consol_1',    //未配置
		padding : '7 10 0 20',
		bodyStyle : 'background:none',
		defaults : {
			border : false
		},
		items : [/*{
			width : 90,
			id : 'serverWarningState',
			padding : '2 10 0 0',
			bodyStyle : 'background:none;',
			预警状态
			html : "<div class='font_h4'><font color='#ffffff'>"+local.backup.stateWarning+": </font></div>"
		},*/{
			width : 200,
			id : 'serverOneState',
			padding : '2 10 0 0',
			bodyStyle : 'background:none;',
			/*性能状态*/
			html : "<div class='font_h4'><font color='#ffffff'>"+local.backup.stateProperty+": </font><font color='#ffff00'></font></div>"
		},{
			id : 'serverTweState',
			padding : '2 10 0 0',
			width:200,
			bodyStyle : 'background:none;',
			/*模拟状态*/
			html : "<div class='font_h4'><font color='#ffffff'>"+local.backup.stateMock+": </font><font color='#ffff00'></font></div>"
		}, {
			flex : 1
		}, {
			width : 90,
			xtype : 'button',
			text : local.btn.operate,
			bodyStyle : 'background:#555555;',
			icon : '/images/common/arrow_down.png',
			iconAlign : 'right',
			listeners : {
				'click' : showWarningMenu
			}
		}]
	}, {
		flex : 1,
		layout : 'hbox',
		border:false,
		width : '100%',
		style : 'border:1px solid #e3eaec;border-top:0;',
		items : [{
			id:"warningConsoleIcon",
			width : 200,
			height : '100%',
			border : false,
			cls:"warning_console_1",
			style : 'background:#fafbfc;border-right:1px solid #eef2f4;padding:36px 49px 0 50px',
			bodyStyle : 'background:none',
			html:"<i class='warning_console_icon'></i>"
		},{
			flex:1,
			id : 'foreWarningControllerInfo',
			html : "",
			margin : '56 50 0 30',
			cls:"warning_text",
			border : false
			//cellCls : 'highlight'
		}]
	}],
	listeners : {
    	afterrender : function(){
    		Ext.Ajax.request({
				url : '/backup/tomonitorAction!findHdwWarningConfigFore.action',
				params : {
					deviceId : selectDeviceId
				},
				success : function(response, options) {
					var obj = Ext.decode(response.responseText);
					
					//预警总开关，未配置
					if(obj.warningState == 0 || obj.warningState == 4){
						Ext.getCmp("warningconfig").setDisabled(true);
						
						warningStateNotConfig();
					}else if(obj.warningState == 2){    //停止
						Ext.getCmp("warningconfig").setDisabled(true);
						
						if(obj.clientState == 4 && obj.backupState == 4){    //未配置
							warningStateNotConfig();
						}else{
							warningStateStop(obj);
						}
					}else if(obj.warningState == 1){    //开启
						var flag = JSON.stringify(CURRENT_USER.getBackupPower()).indexOf("backup_device_warningconfig");
						if(flag >0){
							Ext.getCmp("warningconfig").setDisabled(false);
						}
						if(obj.clientState == 4 && obj.backupState == 4){    //未配置
							warningStateNotConfig();
						}else{
							if(obj.clientState == 1){    //性能状态:已启动
								Ext.getCmp("serverOneState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.stateProperty+": </font><font color='#ffff00'>"+local.open+"</font></div>");
								Ext.getCmp("foreWarningControllerInfo").update(local.defaulty+":"+obj.errorCount+local.every+"&nbsp;&nbsp;"+local.warn+": "+obj.warningCount+local.every);
								
								//如果故障和警告个数为0，则控制台为绿色，如果故障和警告个数大于0，则控制台为红色
								if(obj.errorCount > 0 || obj.warningCount > 0){
									if(obj.backupState == 1){//模拟状态:开启
										Ext.getCmp("serverTweState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.stateMock+": </font><font color='#ffff00'>"+local.open+"</font></div>");
									}else if(obj.backupState == 2){//模拟状态:关闭
										Ext.getCmp("serverTweState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.stateMock+": </font><font color='#ffff00'>"+local.btn.stop+"</font></div>");
									}else if(obj.backupState == 4){//模拟状态:未配置
										Ext.getCmp("serverTweState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.stateMock+": </font><font color='#ffff00'>"+local.unconfig+"</font></div>");
									}
									Ext.getCmp("warningConsoleIcon").removeCls("warning_console_1");
									Ext.getCmp("warningConsoleIcon").removeCls("warning_console_2");
									Ext.getCmp("warningConsoleIcon").removeCls("warning_console_4");
									Ext.getCmp("warningConsoleIcon").addCls("warning_console_3");
									//控制台，条状颜色
									Ext.getCmp("foreWarningConsol").removeCls("consol_1");
									Ext.getCmp("foreWarningConsol").addCls("consol_7");
								}else{
									if(obj.backupState == 1){//模拟状态:开启
										Ext.getCmp("serverTweState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.stateMock+": </font><font color='#ffff00'>"+local.open+"</font></div>");
									}else if(obj.backupState == 2){//模拟状态:关闭
										Ext.getCmp("serverTweState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.stateMock+": </font><font color='#ffff00'>"+local.btn.stop+"</font></div>");
									}else if(obj.backupState == 4){//模拟状态:未配置
										Ext.getCmp("serverTweState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.stateMock+": </font><font color='#ffff00'>"+local.unconfig+"</font></div>");
									}
									Ext.getCmp("warningConsoleIcon").removeCls("warning_console_1");
									Ext.getCmp("warningConsoleIcon").removeCls("warning_console_3");
									Ext.getCmp("warningConsoleIcon").removeCls("warning_console_4");
									Ext.getCmp("warningConsoleIcon").addCls("warning_console_2");
									//控制台，条状颜色
									Ext.getCmp("foreWarningConsol").removeCls("consol_1");
									Ext.getCmp("foreWarningConsol").addCls("consol_2");
								}
							}else if(obj.clientState == 2){//模拟状态:停止
								Ext.getCmp("serverOneState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.stateProperty+": </font><font color='#ffff00'>"+local.btn.stop+"</font></div>");
								warningStateStart(obj);
								
							}else if(obj.clientState == 4){//模拟状态:未配置
								Ext.getCmp("serverOneState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.stateProperty+": </font><font color='#ffff00'>"+local.unconfig+"</font></div>");
								warningStateStart(obj);
							}
						}
					}
				}
			});
    	}
	}
});

/*
 * 预警控制台，总开关，未配置
 */
function warningStateNotConfig(){
	Ext.getCmp("serverOneState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.stateProperty+": </font><font color='#ffff00'>"+local.unconfig+"</font></div>");
	Ext.getCmp("serverTweState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.stateMock+": </font><font color='#ffff00'>"+local.unconfig+"</font></div>");
	Ext.getCmp("foreWarningControllerInfo").update(local.unconfig);
	Ext.getCmp("warningConsoleIcon").removeCls("warning_console_2");
	Ext.getCmp("warningConsoleIcon").removeCls("warning_console_3");
	Ext.getCmp("warningConsoleIcon").removeCls("warning_console_4");
	Ext.getCmp("warningConsoleIcon").addCls("warning_console_1");
}
/*
 * 预警控制台，总开关，停止
 */
function warningStateStop(obj){
	
	if(obj.clientState == 4){    //性能监控：未配置
		Ext.getCmp("serverOneState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.stateProperty+": </font><font color='#ffff00'>"+local.unconfig+"</font></div>");
	}else{
		Ext.getCmp("serverOneState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.stateProperty+": </font><font color='#ffff00'>"+local.btn.stop+"</font></div>");
	}
	
	if(obj.backupState == 4){    //模拟状态:未配置
		Ext.getCmp("serverTweState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.stateMock+": </font><font color='#ffff00'>"+local.unconfig+"</font></div>");
	}else{
		Ext.getCmp("serverTweState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.stateMock+": </font><font color='#ffff00'>"+local.btn.stop+"</font></div>");
	}
	
	//如果故障和警告个数为0，则控制台为绿色，如果故障和警告个数大于0，则控制台为红色
	if(obj.errorCount > 0 || obj.warningCount > 0){
		
		Ext.getCmp("foreWarningControllerInfo").update(local.defaulty+":"+obj.errorCount+local.every+"&nbsp;&nbsp;"+local.warn+": "+obj.warningCount+local.every);
		Ext.getCmp("warningConsoleIcon").removeCls("warning_console_1");
		Ext.getCmp("warningConsoleIcon").removeCls("warning_console_2");
		Ext.getCmp("warningConsoleIcon").removeCls("warning_console_4");
		Ext.getCmp("warningConsoleIcon").addCls("warning_console_3");
		//控制台，条状颜色
		Ext.getCmp("foreWarningConsol").removeCls("consol_1");
		Ext.getCmp("foreWarningConsol").addCls("consol_7");
	}else{
		
		Ext.getCmp("foreWarningControllerInfo").update(local.unstart);
		Ext.getCmp("warningConsoleIcon").removeCls("warning_console_1");
		Ext.getCmp("warningConsoleIcon").removeCls("warning_console_2");
		Ext.getCmp("warningConsoleIcon").removeCls("warning_console_3");
		Ext.getCmp("warningConsoleIcon").addCls("warning_console_4");
		//控制台，条状颜色
		Ext.getCmp("foreWarningConsol").removeCls("consol_1");
		Ext.getCmp("foreWarningConsol").addCls("consol_5");
	}
}

/*
 * 预警控制台，总开关，开启
 */
function warningStateStart(obj){
	//如果故障和警告个数为0，则控制台为绿色，如果故障和警告个数大于0，则控制台为红色
	if(obj.errorCount > 0 || obj.warningCount > 0){
		Ext.getCmp("foreWarningControllerInfo").update(local.defaulty+":"+obj.errorCount+local.every+"&nbsp;&nbsp;"+local.warn+": "+obj.warningCount+local.every);
		if(obj.backupState == 1){//模拟状态:开启
			Ext.getCmp("serverTweState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.stateMock+": </font><font color='#ffff00'>"+local.open+"</font></div>");
		}else if(obj.backupState == 2){//模拟状态:关闭
			Ext.getCmp("serverTweState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.stateMock+": </font><font color='#ffff00'>"+local.btn.stop+"</font></div>");
		}else if(obj.backupState == 4){//模拟状态:未配置
			Ext.getCmp("serverTweState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.stateMock+": </font><font color='#ffff00'>"+local.unconfig+"</font></div>");
		}
		Ext.getCmp("warningConsoleIcon").removeCls("warning_console_1");
		Ext.getCmp("warningConsoleIcon").removeCls("warning_console_2");
		Ext.getCmp("warningConsoleIcon").removeCls("warning_console_4");
		Ext.getCmp("warningConsoleIcon").addCls("warning_console_3");
		//控制台，条状颜色
		Ext.getCmp("foreWarningConsol").removeCls("consol_1");
		Ext.getCmp("foreWarningConsol").addCls("consol_7");
	}else{
		if(obj.backupState == 1){//模拟状态:开启
			Ext.getCmp("foreWarningControllerInfo").update(local.defaulty+":"+obj.errorCount+local.every+"&nbsp;&nbsp;"+local.warn+": "+obj.warningCount+local.every);
			Ext.getCmp("serverTweState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.stateMock+": </font><font color='#ffff00'>"+local.open+"</font></div>");
			
			Ext.getCmp("warningConsoleIcon").removeCls("warning_console_1");
			Ext.getCmp("warningConsoleIcon").removeCls("warning_console_3");
			Ext.getCmp("warningConsoleIcon").removeCls("warning_console_4");
			Ext.getCmp("warningConsoleIcon").addCls("warning_console_2");
			//控制台，条状颜色
			Ext.getCmp("foreWarningConsol").removeCls("consol_1");
			Ext.getCmp("foreWarningConsol").addCls("consol_2");
			
		}else{
			Ext.getCmp("foreWarningControllerInfo").update(local.unstart);
			if(obj.backupState == 2){//模拟状态:关闭
				Ext.getCmp("serverTweState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.stateMock+": </font><font color='#ffff00'>"+local.btn.stop+"</font></div>");
			}else if(obj.backupState == 4){//模拟状态:未配置
				Ext.getCmp("serverTweState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.stateMock+": </font><font color='#ffff00'>"+local.unconfig+"</font></div>");
			}
			Ext.getCmp("warningConsoleIcon").removeCls("warning_console_1");
			Ext.getCmp("warningConsoleIcon").removeCls("warning_console_2");
			Ext.getCmp("warningConsoleIcon").removeCls("warning_console_3");
			Ext.getCmp("warningConsoleIcon").addCls("warning_console_4");
			//控制台，条状颜色
			Ext.getCmp("foreWarningConsol").removeCls("consol_1");
			Ext.getCmp("foreWarningConsol").addCls("consol_5");
		}
	}
}

/**
 * 定义操作菜单
 */
Ext.define('websure.backup.view.OperateWarningMenu', {
	extend : 'Ext.menu.Menu',
	id : 'warningMenu',
	style : {
		overflow : 'visible'
	},
	items : [{
		text : local.btn.start,
		id : "startWarningItems",
		itemId : "backup_device_startwarning",
		listeners : {
			click : operateWarningMenu
		}
	},{
		text : local.btn.stop,
		id : "stopWarningItems",
		itemId : "backup_device_stopwarning",
		listeners : {
			click : operateWarningMenu
		}
	},"-",{
		text : local.backup.startProperty,
		id : "startCapabilityItems",
		itemId : "backup_device_startperformmonitor",
		listeners : {
			click : operateWarningMenu
		}
	}, {
		text : local.backup.stopProperty,
		id : "stopCapabilityItems",
		itemId : "backup_device_stopperformmonitor",
		listeners : {
		  click:operateWarningMenu
		}
	},{
		text : local.backup.startMock,
		id : "startImitateItems",
		itemId : "backup_device_startsimulatemonitor",
		listeners : {
			click : operateWarningMenu
		}
	}, {
		text : local.backup.stopMock,
		id : "stopImitateItems",
		itemId : "backup_device_stopsimulatemonitor",
		listeners : {
		  click:operateWarningMenu
		}
	}]
});

var warningMenu = Ext.create("websure.backup.view.OperateWarningMenu");

//显示操作下拉菜单
function showWarningMenu(button, e) {
	if(isClusterDevice){
		Ext.getCmp('startWarningItems').setDisabled(true);
		Ext.getCmp('stopWarningItems').setDisabled(true);
		//模拟监控
		Ext.getCmp('startCapabilityItems').setDisabled(true);
		Ext.getCmp('stopCapabilityItems').setDisabled(true);
		//业务监控
		Ext.getCmp('startImitateItems').setDisabled(true);
		Ext.getCmp('stopImitateItems').setDisabled(true);
		
		POWER_OP.filterEnableMenuOfExtjs(warningMenu,CURRENT_USER.getBackupPower());
		warningMenu.showBy(button);
		return;
	}
	Ext.Ajax.request({
		url : '/backup/tomonitorAction!findWarningConfigBydeviceId.action',
		params : {
			deviceId : selectDeviceId
		},
		success : function(response, options) {
			var obj = Ext.decode(response.responseText);
			if(obj.success == null){
				Ext.getCmp('startWarningItems').setDisabled(false);
				
				Ext.getCmp('stopWarningItems').setDisabled(true);
				Ext.getCmp('startCapabilityItems').setDisabled(true);
				Ext.getCmp('stopCapabilityItems').setDisabled(true);
				Ext.getCmp('startImitateItems').setDisabled(true);
				Ext.getCmp('stopImitateItems').setDisabled(true);
				POWER_OP.filterEnableMenuOfExtjs(warningMenu,CURRENT_USER.getBackupPower());
				warningMenu.showBy(button);
			}else{
				//预警总开关
				if(obj.success.warningState == 4){    //未配置
					Ext.getCmp('startWarningItems').setDisabled(false);
					Ext.getCmp('stopWarningItems').setDisabled(true);
					//模拟监控
					Ext.getCmp('startCapabilityItems').setDisabled(true);
					Ext.getCmp('stopCapabilityItems').setDisabled(true);
					//业务监控
					Ext.getCmp('startImitateItems').setDisabled(true);
					Ext.getCmp('stopImitateItems').setDisabled(true);
				}else if(obj.success.warningState == 1){    //启动
					
					Ext.getCmp('startWarningItems').setDisabled(true);
					Ext.getCmp('stopWarningItems').setDisabled(false);
					
					//模拟监控
					if(obj.success.clientState == 4){    //未配置
						Ext.getCmp('startCapabilityItems').setDisabled(true);
						Ext.getCmp('stopCapabilityItems').setDisabled(true);
					}else if(obj.success.clientState == 1){    //性能监控为启动,则禁止启动按钮
						Ext.getCmp('startCapabilityItems').setDisabled(true);
						Ext.getCmp('stopCapabilityItems').setDisabled(false);
					}else{
						Ext.getCmp("startCapabilityItems").setDisabled(false);
						Ext.getCmp("stopCapabilityItems").setDisabled(true);
					}
					//模拟监控
					if(obj.success.bcakupState == 4){    //未配置
						Ext.getCmp('startImitateItems').setDisabled(true);
						Ext.getCmp('stopImitateItems').setDisabled(true);
					}else if(obj.success.bcakupState == 1){    //模拟监控为启动,则禁止启动按钮
						Ext.getCmp('startImitateItems').setDisabled(true);
						Ext.getCmp('stopImitateItems').setDisabled(false);
					}else{
						Ext.getCmp('startImitateItems').setDisabled(false);
						Ext.getCmp('stopImitateItems').setDisabled(true);
					}
					
				}else if(obj.success.warningState == 2){    //停止
					
					Ext.getCmp('startWarningItems').setDisabled(false);
					Ext.getCmp('stopWarningItems').setDisabled(true);
					//模拟监控
					Ext.getCmp('startCapabilityItems').setDisabled(true);
					Ext.getCmp('stopCapabilityItems').setDisabled(true);
					//业务监控
					Ext.getCmp('startImitateItems').setDisabled(true);
					Ext.getCmp('stopImitateItems').setDisabled(true);
				}
				
				POWER_OP.filterEnableMenuOfExtjs(warningMenu,CURRENT_USER.getBackupPower());
				warningMenu.showBy(button);
			}
		},
		failure : function() {
//			Ext.MessageBox.alert(local.window.tip,local.backup.dataQueryFailue);
			Ext.websure.MsgError("WF-30030",local.backup.dataQueryFailue);
		}
	});

};

//操作下拉菜单 - 启动
function operateWarningMenu(record, item, index){
	var warningState = 0;
	var bcakupState = 0;
	var clientState = 0;
	var ids = record.id;
	var content = "";
	
	if(ids == "startWarningItems"){    //预警总开关开启
		warningState = 1;
		content = local.backup.starting;
	}else if(ids == "stopWarningItems"){    //预警总开关关闭
		warningState = 2;
		content = local.backup.stopping;
	}else if(ids == "startCapabilityItems"){    //性能监控开启
		clientState = 1;
		content = local.backup.startCapabilityItems;
	}else if(ids == "stopCapabilityItems"){    //性能监控关闭
		clientState = 2;
		content = local.backup.stopCapabilityItems;
	}else if(ids == "startImitateItems"){    //业务监控开启
		bcakupState = 1;
		content = local.backup.startImitateItems;
	}else if(ids == "stopImitateItems"){    //业务监控关闭
		bcakupState = 2;
		content = local.backup.stopImitateItems;
	}
	
	var myMask = new Ext.LoadMask(Ext.getBody(), {msg : content + local.backup.msgAfterLoading});
	myMask.show();
	
	Ext.Ajax.request({
		url : '/backup/tomonitorAction!saveWarningConfigBydeviceId.action',
		params : {
			"warningConfig.deviceId" : selectDeviceId,
			"warningConfig.clientState" : clientState,
			"warningConfig.bcakupState" : bcakupState,
			"warningConfig.warningState" : warningState
		},
		timeout:100000,
		success : function(response, options) {
			var obj = Ext.decode(response.responseText);
			
			if(obj.success){
				myMask.hide();
				
				if(warningState == 1){
					Ext.getCmp("warningconfig").setDisabled(false);
					
					if(clientState == 1){    //性能监控
						Ext.getCmp("serverOneState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.stateProperty+": </font><font color='#ffff00'>"+local.open+"</font></div>");
					}else if(clientState == 2){
						Ext.getCmp("serverOneState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.stateProperty+": </font><font color='#ffff00'>"+local.btn.stop+"</font></div>");
					}
					if(bcakupState == 1){    //模拟监控
						Ext.getCmp("serverTweState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.stateMock+": </font><font color='#ffff00'>"+local.open+"</font></div>");
					}else if(bcakupState == 2){
						Ext.getCmp("serverTweState").update("<div class='font_h4'><font color='#ffffff'>"+local.backup.stateMock+": </font><font color='#ffff00'>"+local.btn.stop+"</font></div>");
					}
				}else{
					Ext.getCmp("warningconfig").setDisabled(true);
				}
				
				//提示框 延时加载
		    	var d = new Ext.util.DelayedTask(function(){  
		    		showResultDialog(obj.msgCode, obj.msgContent);
		    	});  
		    	d.delay(800); 
				var  foreWarningTab = Ext.getCmp("2");
				foreWarningTab.removeAll(); 
				foreWarningTab.add({
					xtype : 'foreWarningPanelView'
				});
				foreWarningTab.doLayout();
			}
		},
		failure : function() {
			myMask.hide();
//			Ext.MessageBox.alert(local.window.tip,local.backup.dataQueryFailue);
			Ext.websure.MsgError("WF-30031",local.backup.dataQueryFailue);
		}
	});
	
}

 //报警记录
Ext.define('websure.backup.view.AlarmHistory', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.alarmHistory',
	id : 'alarmHistory',
	width : '100%',
	store : 'AlarmHistoryStore',
	height: "100%",
	overflowY:"auto",
	enableColumnResize:false,
	//style:'border-bottom:1px solid #DBE0E2',
	columns: [ 
	    { header:local.log.gridLevel, width:80,  menuDisabled:true,flex : 1,dataIndex: 'notifyState',
			  renderer:function(v) {
				if(v == 2){
					return "<img src='/images/log/error.gif' align='absmiddle' />&nbsp;"+local.defaulty;
				}else if(v == 3){
					return "<img src='/images/log/warning.gif' align='absmiddle' />&nbsp;"+local.warn;
				}
			}
		},
		{ header: local.log.gridSource, menuDisabled:true,flex : 1, dataIndex: 'source'},
		{ header:local.backup.rate,menuDisabled:true,flex : 1, dataIndex: 'configRunTimeInterval',
			renderer : function(v,m,record,ri,ci) {
				//频率单位
        		var unit = record.get('configRunTimeIntervalUnit');
        		if(unit == 1){
        			return v + " " + local.dayEverytime;
        		}else if(unit == 2){
        			return v + " " + local.hourEverytime;
        		}else if(unit == 3){
        			return v + " " + local.mEverytime;
        		}else {
        			return v + " " + local.sEverytime;
        		}
			}
		},
		{ header : local.backup.runTimeInterval, menuDisabled:true,flex : 1, dataIndex : "continueTime"},
		{ header: local.backup.content,menuDisabled:true, flex : 2, dataIndex: 'content',
			renderer : function(v,m,record,ri,ci) {
				return "<div title='" + v + "'>" + v + "</div>";
			}
		},
		{ header: local.backup.creatTime,menuDisabled:true, tdCls:"font_color_999",flex : 2, dataIndex: 'notifyTime'}
     ],
	 loadMask:{
	  msg:local.loading
	},
	listeners : {
    	afterrender : function(){
    		var alarmHistory = Ext.getCmp('alarmHistory').getStore();
			
    		alarmHistory.load({
    			params : {
    				deviceId : selectDeviceId
				}
    		});
    		
    		//往store附加额外的参数（用于分页条件查询）
    		alarmHistory.on('beforeload', function() {
    			alarmHistory.proxy.extraParams = {
	                deviceId : selectDeviceId
	            };
	        });
    	}
    },
    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: 'AlarmHistoryStore',
        dock: 'bottom',    //分页 位置
        emptyMsg:local.backup.dataEmpty,
        displayInfo: true,
        //displayMsg: '当前显示{0}-{1}条记录 / 共{2}条记录 ',
        displayMsg: local.toolbarDisplayMsg,
        beforePageText: local.toolbarBeforePageText,
        afterPageText:local.toolbarAfterPageText
	}]
}); 

//chart 图表
Ext.define('websure.backup.view.HardwareMonitorChart',{
	extend: 'Ext.panel.Panel',
	width: '100%',
	border: false,
	alias: 'widget.hardwareMonitorChart',
	padding:"10 20 10 20",
	id : 'hardwareMonitorChart',
	listeners:{
    	afterrender:function(){
    		var diskName = "";
    		var netName = "";
			Ext.Ajax.request({
				url : '/backup/tomonitorAction!findHdwWarningConfigChart.action',
				params : {
					deviceId : selectDeviceId
				},
				success : function(response, options) {
					var obj = Ext.decode(response.responseText);
					
					var cupData = [];var diskData = [];var memData = [];var netData = [];
					var cpu = 0;var disk = 0;var mem = 0;var net = 0;
					
					for(var i = 0; i < obj.addup[0].date.length; i++){
						
						if(typeof(obj.addup[0].cpu[i]) != "undefined"){
							cpu = obj.addup[0].cpu[i];
						}
						if(typeof(obj.addup[0].disk[i]) != "undefined"){
							disk = obj.addup[0].disk[i];
						}
						if(typeof(obj.addup[0].mem[i]) != "undefined"){
							mem = obj.addup[0].mem[i];
						}
						if(typeof(obj.addup[0].net[i]) != "undefined"){
							net = obj.addup[0].net[i];
						}
						
						//cup的值
						cupData.push({
							rate:cpu,
							chartDate:obj.addup[0].date[i]
						});
						//disk的值
						diskData.push({
							rate:disk,
							chartDate:obj.addup[0].date[i]
						});
						//mem的值
						memData.push({
							rate: mem,
							chartDate:obj.addup[0].date[i]
						});
						//net的值
						netData.push({
							rate:net,
							chartDate:obj.addup[0].date[i]
						});
						
					}
					getWarningChart(cupData,diskData,memData,netData,diskName,netName);
				}
			});
    	}
	}
});

/**
 * 定义图表主题
 * auth:wangshaodong
 */
var colors=['#00aaaa','#00aaaa','#00aaaa','#00aaaa'];
Ext.define('Ext.chart.theme.charTheme',{
	extend:'Ext.chart.theme.Base',
	constructor:function(config){
		this.callParent([Ext.apply({colors:colors},config)]);
	}
});

/*
 * 获取图表值
 */
function getChartValue(selectDeviceId,diskName,netName){
	Ext.Ajax.request({
		url : '/backup/tomonitorAction!findHdwWarningConfigChart.action',
		params : {
			deviceId : selectDeviceId,
			diskName : diskName,
			netName : netName
		},
		success : function(response, options) {
			var obj = Ext.decode(response.responseText);
			
			var cupData = [];var diskData = [];var memData = [];var netData = [];
			var cpu = 0;var disk = 0;var mem = 0;var net = 0;
			
			for(var i = 0; i < obj.addup[0].date.length; i++){
				
				if(typeof(obj.addup[0].cpu[i]) != "undefined"){
					cpu = obj.addup[0].cpu[i];
				}
				if(typeof(obj.addup[0].disk[i]) != "undefined"){
					disk = obj.addup[0].disk[i];
				}
				if(typeof(obj.addup[0].mem[i]) != "undefined"){
					mem = obj.addup[0].mem[i];
				}
				if(typeof(obj.addup[0].net[i]) != "undefined"){
					net = obj.addup[0].net[i];
				}
				
				//cup的值
				cupData.push({
					rate:cpu,
					chartDate:obj.addup[0].date[i]
				});
				//disk的值
				diskData.push({
					rate:disk,
					chartDate:obj.addup[0].date[i]
				});
				//mem的值
				memData.push({
					rate: mem,
					chartDate:obj.addup[0].date[i]
				});
				//net的值
				netData.push({
					rate:net,
					chartDate:obj.addup[0].date[i]
				});
				
			}
			getWarningChart(cupData,diskData,memData,netData,diskName,netName);
		}
	});
}

//图表显示
function getWarningChart(cupData,diskData,memData,netData,diskName,netName){
	var hardwareMonitorChartId = Ext.getCmp("hardwareMonitorChart");
	hardwareMonitorChartId.removeAll();
	hardwareMonitorChartId.add({
		xtype: 'panel',
		width: '100%',
		//height:'60%',
		border: false,
		//padding:20,
		alias: 'widget.hardwareMonitors',
		layout:'anchor',
		items:[{
			anchor:'100% 7%',
			border:false,
			padding:5,
			html:"<div style='height:24px;display:inline-block;width:50%;padding-right:30px;'>"+local.backup.usageCpu+"(%)</div><div style='display:inline-block;width:50%;height:24px;padding-right:30px;padding-left:30px;'>"+local.backup.usageMemory+"(%)</div>"
		},{
			//cup  begin
			anchor:'50% 40%',
			xtype : 'chart',
			width:'50%',
		    height:140,
			animate: true,
			shadow: false,
		    theme:"charTheme",
			store : new Ext.data.Store({
				fields : ['rate', 'chartDate'],
				data : cupData
			}),
			shadowOffset:'0',
			axes: [{
	           type: 'Numeric',
	           position: 'left',
	           fields: ['rate'],
	           minimum: 0,
	           maximum: 100,
	           title: false,
	           grid: true
			}, {
	    	   type: 'Category',
	           position: 'bottom',
	           fields: ['chartDate'],
	           groupBy: 'hour',
	           dateFormat: 'ga',
	           label:{
	        	   renderer:function(val){
	        		   var dateTime = val.split(':');
	        		   if(dateTime[0]%2 == 0){
	        			   return val;
	        		   }else{
	        			   return "";
	        		   }
	        		   
	        	   }
	           }
			}],
			series: [{
	           type: 'line',
	           theme:'Green',
	           showMarkers:false,    //隐藏点标记
	           xField: 'chartDate',
	           yField: 'rate'
			}]
			//cpu  end
		},{
			//内存  begin
			anchor:'50% 40%',
			xtype : 'chart',
			width:'50%',
		    height:140,
		    theme:"charTheme",
			animate: true,
			shadow: false,
			store : new Ext.data.Store({
				fields : ['rate', 'chartDate'],
				data : memData
			}),
			shadowOffset:'0',
			axes: [{
	           type: 'Numeric',
	           position: 'left',
	           fields: ['rate'],
	           minimum: 0,
	           maximum: 100,
	           title: false,
	           grid: true
			}, {
	    	   type: 'Category',
	           position: 'bottom',
	           fields: ['chartDate'],
	           groupBy: 'hour',
	           dateFormat: 'ga',
	           label:{
	        	   renderer:function(val){
	        		   var dateTime = val.split(':');
	        		   if(dateTime[0]%2 == 0){
	        			   return val;
	        		   }else{
	        			   return "";
	        		   }
	        		   
	        	   }
	           }
			}],
			series: [{
	           type: 'line',
	           theme:'Green',
	           showMarkers:false,    //隐藏点标记
	           xField: 'chartDate',
	           yField: 'rate'
			}]
			//内存  end
		},{
			anchor:'100% 7%',
			border:false,
			padding:5,
			layout:"hbox",
			items:[{
				xtype: 'panel',
				border:false,
				flex:1,
				layout:"hbox",
				padding:"0 10 0 0",
				items:[{
					xtype : 'label',
					flex:1,
					html:"<div style='height:24px;display:inline-block;padding-right:30px;'>"+local.backup.usageWeb+"(%)</div>"
				},{
					xtype : "combobox",
					width : 220,
					//style: "display:inline-block",
					store : "NetNameStore",
					displayField : "netName",
					valueField : "type",
					triggerAction: 'all', //很重要,触发器被点击时执行的操作
					queryMode : "local",
					emptyText : local.backup.dataEmpty,
					forceSelection : true,
					typeAhead : true,
					listeners : {
						afterrender:function(combo){
							this.store.load({ 
								params : {
									deviceId : selectDeviceId
								},
								callback:function(records, options, success){
									if(typeof(netName) != "undefined" && netName != ""){
										combo.setValue(netName);
									}else{
										if(typeof(records[0]) != "undefined"){
											var firstValue = records[0].data.netName;
											combo.setValue(firstValue);    // 默认选中 
										}
									}
	    	    			   }
							});
						},
						select:function(value,record){
							netName = value.value;
							//获得图表数据
							getChartValue(selectDeviceId,diskName,netName);
						}
					}
				}]
			},{
				xtype: 'panel',
				border:false,
				flex:1,
				layout:"hbox",
				padding:"0 10 0 32",
				items:[{
					xtype : 'label',
					flex:1,
					html:"<div style='display:inline-block;height:24px;'>"+local.backup.usageDisk+"(%)</div>"
				},{
					xtype : "combobox",
					width : 220,
					//style: "display:inline-block",
					store : "DiskNameStore",
					displayField : "diskName",
					valueField : "type",
					triggerAction: 'all', //很重要,触发器被点击时执行的操作
					queryMode : "local",
					emptyText : local.backup.dataEmpty,
					forceSelection : true,
					typeAhead : true,
					listeners : {
						afterrender:function(combo){
							this.store.load({ 
								params : {
									deviceId : selectDeviceId
								},
								callback:function(records, options, success){
									//设置默认值
									if(typeof(diskName) != "undefined" && diskName != ""){
										combo.setValue(diskName);
									}else{
										if(typeof(records[0]) != "undefined"){
											var firstValue = records[0].data.diskName;
											combo.setValue(firstValue);    // 默认选中 
										}
									}
	    	    			   }
							});
						},
						select:function(value,record){
							diskName = value.value;
							//获得图表数据
							getChartValue(selectDeviceId,diskName,netName);
						}
					}
				}]
			}]
		},{
			//网络 begin
			anchor:'50% 40%',
			xtype : 'chart',
			width:'50%',
		    height:140,
			animate: true,
			shadow: false,
		    theme:"charTheme",
			store : new Ext.data.Store({
				fields : ['rate', 'chartDate'],
				data : netData
			}),
			shadowOffset:'0',
			axes: [{
	           type: 'Numeric',
	           position: 'left',
	           fields: ['rate'],
	           minimum: 0,
	           maximum: 100,
	           title: false,
	           grid: true
			}, {
	    	   type: 'Category',
	           position: 'bottom',
	           fields: ['chartDate'],
	           groupBy: 'hour',
	           dateFormat: 'ga',
	           label:{
	        	   renderer:function(val){
	        		   //判断时间，间隔显示
	        		   var dateTime = val.split(':');
	        		   if(dateTime[0]%2 == 0){
	        			   return val;
	        		   }else{
	        			   return "";
	        		   }
	        		   
	        	   }
	           }
			}],
			series: [{
	           type: 'line',
	           theme:'Green',
	           showMarkers:false,    //隐藏点标记
	           xField: 'chartDate',
	           yField: 'rate'
			}]
			//网络 end
		},{
			//存储  begin
			anchor:'50% 40%',
			xtype : 'chart',
			width:'50%',
		    height:140,
			animate: true,
			shadow: false,
		    theme:"charTheme",
			store : new Ext.data.Store({
				fields : ['rate', 'chartDate'],
				data : diskData
			}),
			shadowOffset:'0',
			axes: [{
	           type: 'Numeric',
	           position: 'left',
	           fields: ['rate'],
	           minimum: 0,
	           maximum: 100,
	           title: false,
	           grid: true
			}, {
	    	   type: 'Category',
	           position: 'bottom',
	           fields: ['chartDate'],
	           groupBy: 'hour',
	           dateFormat: 'ga',
	           label:{
	        	   renderer:function(val){
	        		   //判断时间，间隔显示
	        		   var dateTime = val.split(':');
	        		   if(dateTime[0]%2 == 0){
	        			   return val;
	        		   }else{
	        			   return "";
	        		   }
	        		   
	        	   }
	           }
			}],
			series: [{
	           type: 'line',
	           theme:'Green',
	           showMarkers:false,    //隐藏点标记
	           xField: 'chartDate',
	           yField: 'rate'
			}]
			//存储   end
		}]
	});    //add end	
	hardwareMonitorChartId.doLayout();
	
}

//模拟监控
Ext.define("websure.backup.view.ServiceMonitor",{
	extend : "Ext.Panel",
	alias :  "widget.serviceMonitor",
	layout:"vbox",
	height:"100%",
	items : [{
		xtype: "serviceMonitorGrid",
		flex:1
	},{
    	 xtype:"panel",
    	 height:48,
    	 width:"100%",
    	 border:false,
    	 style:"border-top:1px solid #eee;background:#fafabfc",
    	 layout:"hbox",
    	 items:[{
    		 flex:1,
    		 border:false
    		 },{
	     		xtype : 'button',
	     		height:30,
	     		margin:"9 8 0 0",
	     		id: "monitorId",
	     		style:"background:#fff",
	     		itemId: "backup_device_warningconfig",
	    		text : local.backup.editWarningConfig,
	    		listeners : {
	    			'click' : function(){
	    				//授权内容
	    				var licenseWarningSystem = Ext.getCmp('DeviceBackup').licenseWarningSystem;
	    				var licenseWarningDB = Ext.getCmp('DeviceBackup').licenseWarningDB;
	    				var licenseWarningUrl = Ext.getCmp('DeviceBackup').licenseWarningUrl;
	    				var licenseWarningScript = Ext.getCmp('DeviceBackup').licenseWarningScript;
	    				
	    				var param = {
	                		parId : selectDeviceId,
	                		parMac : selectDeviceMac,
	                		licenseWarningSystem:licenseWarningSystem,
	                		licenseWarningDB:licenseWarningDB,
	                		licenseWarningUrl:licenseWarningUrl,
	                		licenseWarningScript:licenseWarningScript
	                	};
	    				Ext.create('websure.backup.view.MonitorConfig',param).show();
	    				
	    				minitorCurrentPanel = 2;
	    				//默认打开业务监控tab
	    				Ext.getCmp("monitorConfigTabpanel").setActiveTab(1);;
	    				
	    			}
	    		}
    		}]
     }]
});

Ext.define("websure.backup.view.ServiceMonitorGrid",{
		extend : 'Ext.grid.GridPanel',
		alias : 'widget.serviceMonitorGrid',
		id : 'serviceMonitor',
		border: false,
		store : 'ServerWarningConfigStore',
	    overflow:"auto",
	    enableColumnResize:false,    //禁用表格中列的大小调节功能
        width : '100%',
        columns: [{    //列模式
			header : "id",
			dataIndex : "scriptWarningId",
			hideable: false,    //隐藏列会显示在GridPanel中
			hidden : true
		},{
			header : local.backup.warningName,
			dataIndex : "scriptWarningName",
			width : "24%"
		},{
			header : local.backup.warningClass,
			dataIndex : "scriptWarningLevel",
			width : "24%",
			renderer: function(v){
				if(v == 1){
					return local.normal;
				}else if(v == 2){
					return local.defaulty;
				}else{
					return local.warn;
				}
			}
		},{
			header : local.backup.warningType,
			width : "18%",
			dataIndex : "scriptWarningServerType",
			renderer : function(v) {
				if (v == 1) {
					return "URL";
				} else if (v == 2){
					return local.backup.database;
				}else if (v == 3){
					return local.backup.script;
				}
			}
		},/*{
			header : local.backup.rate,                
			width : "18%",                
			dataIndex : "configRunTimeInterval",
			renderer : function(v,m,record,ri,ci) {
        		//频率单位
        		var unit = record.get('configRunTimeIntervalUnit');
        		if(unit == 1){
        			return v+local.dayEverytime;
        		}else if(unit == 2){
        			return v+local.hourEverytime;
        		}else if(unit == 3){
        			return v+local.mEverytime;
        		}else {
        			return v+local.sEverytime;
        		}
        		
			}
		},*/{
			header : local.backup.returnValue,                
			width : "18%",                
			dataIndex : "scriptWarningReturnValue",
			renderer : function(v,m,record,ri,ci) {
				return "<div title='"+v+"'>"+v+"</div>";
			}
		},{
			header : local.backup.alermTime,                
			width : "18%",                
			dataIndex : "notifyTime"
		},{
			 dataIndex: 'notifyList', hideable: false, hidden: true 
		},{
			dataIndex: 'scriptWarningUrl', hideable: false, hidden: true 
		}],
		plugins: [{
	        ptype: 'rowexpander',
	        rowBodyTpl : new Ext.XTemplate(
	        	'{scriptValue}<p style="color:#999;">'+local.backup.alermRecord+':{notifyTable:this.notifyTableValue}</p>',
	        {
	        	notifyTableValue : function(v) {
	            	if(v == ""){
	            		v = local.backup.dataEmpty;
	            	}
	            	return v;
	            }
	        })
	    }],
	    animCollapse: false,
        forceFit:true,    //自动填满表格
		listeners : {
			afterrender : function(){
				Ext.getCmp("serviceMonitor").store.load({
					params : {
						deviceId : selectDeviceId
					}
				});
			}
	}
});

// 定义预警监控tab页
Ext.define('websure.backup.view.ForeWarningtabPanel', {
		extend : 'Ext.tab.Panel',
		alias : 'widget.foreWarningtabPanel',
		id : 'foreWarningtabPanel',
		plain : true,
		enableTabScroll : true,
		bodyStyle : 'background:#fff;border-color:#e3eaec',
		resizeTabs : true,
		cls : 'tab_s tab_1',
		activeTab : 0,
		width : '100%',
		margin : '10 0 0 0',
		items : [{
				title : local.backup.propertyMonitor,
				itemId :'1',
				xtype : "hardwareMonitorChart"
			}, {
				title : local.backup.mockMonitor,
				itemId :'2',
				xtype : "serviceMonitor",
				border:false
			},{
				title: local.backup.alermLog,
				itemId:"3",
				xtype:"alarmHistory"
			}],
		listeners : {
			'tabchange' : function(tabPanel, newCard, oldCard) {
				var itemi = tabPanel.activeTab.itemId;
				if (2 == itemi) {
					Ext.getCmp("serviceMonitor").store.load({
						params : {
							deviceId : selectDeviceId,
							deviceMac: selectDeviceMac
						}
					});
				}
			},
			render:function(v, eOpts){
				POWER_OP.filterEnableWidgetsOfExtjs(v, CURRENT_USER.getBackupPower());
			}
		}
	});

/*
 * 预警内容
 */
Ext.define('websure.backup.view.ForeWarningPanelView', {
	extend : 'Ext.panel.Panel',
	border : false,
	alias : 'widget.foreWarningPanelView',
	id : 'foreWarningPanelView',
	style : 'background:#fff;',
	bodyPadding:20,
	overflowY:'auto',
	layout : 'vbox',
	items : [{
		xtype : 'label',
		id : 'labelForeWarning',
		html : "<font class='font_t'>"+local.backup.warnTitle+"</font>",
		width : '90%'
	}, {
		xtype : 'ForeWarningPanel',
		height : 220,
		margin : '10 0 20 0'
	}, {
		xtype : 'label',
		id : 'ForeWarninglabel',
		html : "<font class='font_t'>"+local.backup.warnTitleMonitor+"</font>",
		width : '100%'
	}, {
		xtype : 'foreWarningtabPanel',
		height : 430
	}]
});

// 预警tab页
Ext.define('websure.backup.view.ForeWarningView', {
	extend : 'Ext.panel.Panel',
	border : false,
	alias : 'widget.ForeWarningTab',
	id : '2',
	layout:"fit",
	items : [{
		xtype : 'foreWarningPanelView'
	}]
});

//预警tab页,未授权时使用
Ext.define('websure.backup.view.LicenseForeWarningView', {
	extend : 'Ext.panel.Panel',
	border : false,
	alias : 'widget.licenseForeWarningView',
	id : "licenseForeWarningViewId",
	cls:"log_text_wrap",
	overflowY:"auto",
	html:""
});