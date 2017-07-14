/**
 * 报表日志全局图
 */
Ext.define("acesure.view.report.LogView",{
	extend:"Ext.Panel",
	width:"100%",
	alias:"widget.logView",
	id : 'logViewId',
	border:false,
	layout:"vbox",
	items:[{
		xtype:"viewLogHeadToolbar"
	},{
		flex:1,
		overflowY:"auto",
		xtype:"logViewPanel"
	}],
	listeners:{
		render:function(v, eOpts){
			//延迟加载
			delay(0, function(){
				var power = CURRENT_USER.getReportlogPower();
				
				//判断是否有权限
				if(power == null || power == '' || !existView(power)){
					$('#log_div').show();
				}else{
					POWER_OP.filterEnableWidgetsOfExtjs(v, power, "panel");					
					var funcLogNodes = Ext.getCmp('logTreeId').getStore().getNodeById('functionLogId');					
					if (notNull(funcLogNodes) && funcLogNodes.childNodes.length > 0) {
						POWER_OP.filterEnableDomsInHtmlOfExtjs(v, power);	
					} else {
						Ext.getCmp("functionLogId").hide();
					}				
				}
			});
		}
	}
});

/**
 * check report-log exist view-power or not
 * @param array
 * @returns {Boolean}
 */
function existView(array) {
	for (var i in array) {
		if (array[i].indexOf('view') >= 0) {
			return true;
		}
	}
	return false;
}


//判断一个值是否在数组中
function in_array(search,array){
    for(var i in array){
    	if(array[i] == search){
    		return true;
    	}
    	/*if(array[i].indexOf(search) >= 0){
    		return true;
    	}*/
    }
    return false;
}

/**
 * 头部
 */
Ext.define("acesure.view.report.log.ViewLogHeadToolbar", {
	extend : 'Ext.Toolbar',
	alias : 'widget.viewLogHeadToolbar',
	id : 'viewLogHeadToolbarId',
	padding:'0 25 0 25',
	width:"100%",
	height:108,
	style:'border:0;border-bottom:1px solid #d1dade;background:#fafbfc;',
	defaults:{bodyStyle:'background:#fafbfc'},
	items : [{
		xtype : "panel",
		border : false,
		width:48,
		height:42,
		html : '<img src="/images/log/report_system_title.png"/>'
	}, {
		xtype : "panel",
		border : false,
		html : "<font class='font_h3'>"+local.log.title+"</font><br>"
	},"->",{
		xtype : "button",
		text : local.btn.refresh,
		style:'padding-left:26px',
		icon : '/images/common/refresh.png',
		handler : function() {
			var reportLogPanel = Ext.getCmp('reportLogPanel');
	 		reportLogPanel.removeAll();
  			reportLogPanel.add({
  				xtype : 'logView'
  			});
		}
	}]
});

/**
*主页
*/
Ext.define("acesure.view.log.report.LogViewPanel",{
	extend:"Ext.Panel",
	width : '100%',
	alias:"widget.logViewPanel",
	border:false,
	layout:"vbox",
	items:[{
		xtype : 'label',
		height:55,
		width:"100%",
		padding:"20 20 10 20",
		html : "<font class='font_t'>"+local.log.aStatReports+"</font>"
	},{
		xtype: 'reportList',
		height:160,
		width:"100%",
		margin:"0 20 0 20"
	},{
		xtype : 'label',
		height:55,
		width : '100%',
		padding:"20 20 10 20",
		html : "<font class='font_t'>"+local.log.blogInfo+"</font>"
		
	},{
		xtype:"logList",
		height:160,
		width:"100%",
		margin:"0 20 20 20"
	}]
});

/**
*统计报表展示面板
*/
Ext.define("acesure.view.log.report.ReportList",{
	extend: 'Ext.Panel',
	alias: 'widget.reportList',
	id : 'reportListId',
	border:false,
	layout:"hbox",
	items:[{
		xtype:"panel",
		flex:1,
		height:160,
		cls:"logView_list",
		border:false,
		id : "reportLogView",
		bodyStyle:"background:none;",
		itemId : "reportlog_report_viewperform",
		html:"<i class='icon_logView icon_logView1'></i>" +
				"<div><h2>"+local.log.rerReport+"</h2></div>",
		listeners : {
			click: {
	            element: 'el', 
	            fn: function(){
	            	diskCloneLog(1);
	            }
	        }
		}
	},{
		xtype:"panel",
		flex:1,
		height:160,
		cls:"logView_list",
		border:false,
		id : "entireLogView",
		style:"margin:0 10px;",
		bodyStyle:"background:none",
		itemId : "reportlog_report_viewfault",
		html:"<i class='icon_logView icon_logView2'></i>" +
				"<div><h2>"+local.log.defaultReport+"</h2></div>",
		listeners : {
			click: {
	            element: 'el', 
	            fn: function(){
	            	diskCloneLog(2);
	            }
	        }
		}
	},{
		xtype:"panel",
		flex:1,
		height:160,
		cls:"logView_list",
		border:false,
		id : "backupLogView",
		bodyStyle:"background:none",
		itemId : "reportlog_report_viewbackup",
		html:"<i class='icon_logView icon_logView3'></i>" +
				"<div><h2>"+local.log.backupReport+"</h2></div>",
		listeners : {
			click: {
	            element: 'el', 
	            fn: function(){
	            	diskCloneLog(3);
	            }
	        }
		}
	}],
	listeners:{
		afterrender:function(){
			Ext.Ajax.request({
				url: '/syslog/toSystemEntire!findSystemReportLogCount.action',
				success: function (response) {
					var obj = Ext.decode(response.responseText);
					Ext.getCmp('reportLogView').update("<i class='icon_logView icon_logView1'></i>" +
								"<div><h2>"+local.log.rerReport+"</h2><span style='color:#666'>"+obj.beginDate+local.log.to+obj.endDate+"</span><br>" +
								"<span>"+local.warn+"</span>&nbsp;<span class='color_yellow'>"+obj.warningCount+"</span>&nbsp;" +
								"<span>"+local.defaulty+"</span>&nbsp;<span class='color_red'>"+obj.reportCountE+"</span></div>");
					Ext.getCmp('entireLogView').update("<i class='icon_logView icon_logView2'></i>" +
							"<div><h2>"+local.log.defaultReport+"</h2><span style='color:#666'>"+obj.beginDate+local.log.to+obj.endDate+"</span><br>" +
							"<span>"+local.warn+"</span>&nbsp;<span class='color_yellow'>"+obj.warningCount+"</span>&nbsp;" +
							"<span>"+local.defaulty+"</span>&nbsp;<span class='color_red'>"+obj.entireCountE+"</span></div>");
					Ext.getCmp('backupLogView').update("<i class='icon_logView icon_logView3'></i>" +
								"<div><h2>"+local.log.backupReport+"</h2><span>"+local.abnormal+"</span>&nbsp;" +
								"<span class='color_yellow'>"+obj.abnormity+"</span><br>" +
								"<span>"+local.unconfig+"</span>&nbsp;<span class='color_red'>"+obj.notconfig+"</span></div>");
				}
			});	
		}
	}
	
});

Ext.define("acesure.view.log.report.LogList",{
	extend:"Ext.Panel",
	alias:"widget.logList",
	border:false,
	layout:"hbox",
	items:[{
		xtype:"panel",
		flex:1,
		height:160,
		cls:"logView_list",
		border:false,
		id : "functionLogId",
		bodyStyle:"background:none;",
		html:'<i class="icon_logView icon_logView4"></i>'+
			'<div class="log_h2_wrap"><h2>'+local.log.funLog+'</h2>'+
			'<a name="reportlog_log_viewbackup" class="a_text" href="#" onclick="diskCloneLog(4)">'+local.backup.backupLog+'</a>&nbsp;&nbsp;&nbsp;'+
			'<a name="reportlog_log_viewwarning" class="a_text"  href="#" onclick="diskCloneLog(5)">'+local.log.titleWarnLog+'<br></a>'+
			'<a name="reportlog_log_viewbackupdb" class="a_text"  href="#" onclick="diskCloneLog(10)">'+local.log.backupDBLog+'<br></a>'+
			'<a name="reportlog_log_viewemergency" class="a_text" href="#" onclick="diskCloneLog(6)">'+local.log.titleEmergencyLog+'</a>&nbsp;&nbsp;&nbsp;'+
			'<a name="reportlog_log_viewrecovery" class="a_text"  href="#" onclick="diskCloneLog(7)">'+local.log.resLog+'</a></div>'
	},{
		xtype:"panel",
		flex:1,
		height:160,
		cls:"logView_list",
		border:false,
		id : "systemLogView",
		style:"margin:0 10px;",
		bodyStyle:"background:none",
		itemId: "reportlog_log_viewsystem",
		html:"<i class='icon_logView icon_logView5'></i>" +
				"<div><h2>"+local.log.titleSystemLog+"</h2><span>"+local.log.numberLog+"</span>&nbsp;<span class='font_color_999'>0</span></div>",
		listeners : {
			click: {
	            element: 'el', 
	            fn: function(){
	            	diskCloneLog(8);
	            }
	        }
		}
	},{
		xtype:"panel",
		flex:1,
		height:160,
		cls:"logView_list",
		border:false,
		id : "manamgeLogView",
		bodyStyle:"background:none",
		itemId: "reportlog_log_viewoperation",
		html:"<i class='icon_logView icon_logView6'></i>"+
		"<div><h2>"+local.backup.operateLog+"</h2><span>"+local.log.numberLog+"</span>&nbsp;<span class='font_color_999'>0</span></div>",
		listeners : {
			click: {
	            element: 'el', 
	            fn: function(){
	            	diskCloneLog(9);
	            }
	        }
		}
	}],
	listeners:{
		afterrender:function(){
			Ext.Ajax.request({
				url: '/syslog/toSystemLog!findSystemLogCount.action',
				success: function (response) {
					var obj = Ext.decode(response.responseText);
					var systemLogView = Ext.getCmp('systemLogView');
					var manamgeLogView = Ext.getCmp('manamgeLogView');
					systemLogView.update("<i class='icon_logView icon_logView5'></i>" +
							"<div><h2>"+local.log.titleSystemLog+"</h2><span>"+local.log.numberLog+"</span>&nbsp;" +
							"<span class='font_color_999'>"+obj.systemCount+"</span></div>");
					manamgeLogView.update("<i class='icon_logView icon_logView6'></i>" +
							"<div><h2>"+local.backup.operateLog+"</h2><span>"+local.log.numberLog+"</span>&nbsp;" +
							"<span class='font_color_999'>"+obj.manageCount+"</span></div>");
				}
			})	
		}
	}
	
})

//主页，点击事件
function diskCloneLog(ids){
	//授权信息
	Ext.Ajax.request({
		url: '/syslog/toSystemLog!findSystemLogAuth.action',
		success: function (response) {
			var logAuth = JSON.parse(response.responseText);
			
			var logTree = Ext.getCmp('logTreeId');    //treeId
			var reportLogPanel = Ext.getCmp('reportLogPanel');
			reportLogPanel.removeAll();
			
			switch(ids){
				case 1:    //性能报表
					//预警授权
					if(logAuth.logAuth.wEnableMonitor == 0){
						reportLogPanel.add({
							xtype :'licenseLogList'
						});
						Ext.getCmp("licenseLogHtmlId").update(local.log.authTips);
						Ext.getCmp("licenseLogTitlePngId").update("<img src='/images/log/report_system_title.png'/>");
						Ext.getCmp("licenseLogTitleId").update("<font class='font_h3'>"+local.log.rerReport+"</font>");
					}else{
						reportLogPanel.add({
							xtype : 'systemReportList'
						});
					}
					var record = logTree.getStore().getNodeById('reportlog_report_viewperform');
				    break;
				case 2:    //故障报表
					//预警授权
					if(logAuth.logAuth.wEnableMonitor == 0){
						reportLogPanel.add({
							xtype :'licenseLogList'
						});
						Ext.getCmp("licenseLogHtmlId").update(local.log.authTips);
						Ext.getCmp("licenseLogTitlePngId").update("<img src='/images/log/report_system_title.png'/>");
						Ext.getCmp("licenseLogTitleId").update("<font class='font_h3'>"+local.log.defaultReport+"</font>");
					}else{
						reportLogPanel.add({
							xtype : 'entireReportList'
						});
					}
					var record = logTree.getStore().getNodeById('reportlog_report_viewfault');
				    break;
				case 3:    //备份报表
					reportLogPanel.add({
						xtype : 'backupReportList'
					});
					var record = logTree.getStore().getNodeById('reportlog_report_viewbackup');
				    break;
				case 4:    //备份日志
					reportLogPanel.add({
						xtype :'diskCloneLogList'
					});
					var record = logTree.getStore().getNodeById('reportlog_log_viewbackup');
					break;
				case 5:    //预警日志
					//预警授权
					if(logAuth.logAuth.wEnableMonitor == 0){
						reportLogPanel.add({
							xtype :'licenseLogList'
						});
						Ext.getCmp("licenseLogHtmlId").update(local.log.authTips);
						Ext.getCmp("licenseLogTitlePngId").update("<img src='/images/log/log_system_title.png'/>");
						Ext.getCmp("licenseLogTitleId").update("<font class='font_h3'>"+local.log.titleWarnLog+"</font>");
					}else{
						reportLogPanel.add({
							xtype :'warningLogList'
						});
					}
					var record = logTree.getStore().getNodeById('reportlog_log_viewwarning');
					break;
				case 6:    //应急日志
					reportLogPanel.add({
						xtype :'emergencyLogList'
					});
					var record = logTree.getStore().getNodeById('reportlog_log_viewemergency');
					break;
				case 7:    //存储恢复日志
					reportLogPanel.add({
						xtype :'recoveryLogList'
					});
					var record = logTree.getStore().getNodeById('reportlog_log_viewrecovery');
					break;
				case 8:    //系统日志
					reportLogPanel.add({
						xtype : 'systemLogList'
					});
					var record = logTree.getStore().getNodeById('reportlog_log_viewsystem');
					break;
				case 9:    //运维日志
					reportLogPanel.add({
						xtype :'manageLogList'
					});
					var record = logTree.getStore().getNodeById('reportlog_log_viewoperation');
					break;
				case 10:    //数据库备份日志
					//数据库备份授权，为0表示未授权
					if(logAuth.logAuth.wDBClientNum == 0){
						reportLogPanel.add({
							xtype :'licenseLogList'
						});
						Ext.getCmp("licenseLogHtmlId").update(local.log.authTips);
						Ext.getCmp("licenseLogTitlePngId").update("<img src='/images/log/log_system_title.png'/>");
						Ext.getCmp("licenseLogTitleId").update("<font class='font_h3'>"+local.log.backupDBLog+"</font>");
					}else{
						reportLogPanel.add({
							xtype :'backupDBLogList'
						});
					}
					var record = logTree.getStore().getNodeById('reportlog_log_viewbackupdb');
					break;
			}
			
			reportLogPanel.doLayout();
			logTree.getSelectionModel().select(record);    //tree 选中
		}
	});
}