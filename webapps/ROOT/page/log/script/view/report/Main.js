Ext.Loader.setConfig({
	enabled : true
});

Ext.application({
	name : "acesure",
	appFolder : '/page/log/script',
	layout : "fit",
	controllers : ['report.SystemReportController','report.EntireReportController',
	               'sysLog.SystemLogController'
		],
	// 当前页面加载完成执行的函数
	launch : function() {
		// 页面加载完成之后执行
		Ext.create("acesure.view.report.MainPanel");
	}
});

	
Ext.define('acesure.view.report.MainPanel', {
	extend : 'Ext.container.Viewport',
	layout : 'border',
	border : false,
	minWidth:1250,
	initComponent : function() {
		var me = this;
		me.items = [{
			xtype:'GlobalMenu',
			border:false,
			region:'north',
			height:60
		},{
			xtype : 'panel',
			region : 'west',
			width : 239,
			border:false,
			bodyStyle:'background:#f5f8fa;',
			items : [{
				xtype : 'logTree',
				floating : false,
				listeners : {
				itemclick:function(record, item, index, e, eOpts ){
					var ids = item.data.id ;  
					var auths = item.data.auth;
				 	if(item.data.children == null){
				 		var reportLogPanel = Ext.getCmp('reportLogPanel');
				 		reportLogPanel.removeAll();
					 	
						if(ids == "reportlog_report_viewperform"){    //性能报表
							//预警授权，auths为0，表示未授权
							if(auths == 0){
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
						}else if(ids == "reportlog_report_viewfault"){    //故障报表
							//预警授权，auths为0，表示未授权
							if(auths == 0){
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
						}else if(ids == "reportlog_report_viewbackup"){    //备份报表
							reportLogPanel.add({
								xtype : 'backupReportList'
							});
						}else if(ids == "reportlog_log_viewbackup"){    //备份日志
							reportLogPanel.add({
								xtype :'diskCloneLogList'
							});
						}else if(ids == "reportlog_log_viewwarning"){    //预警日志
							//预警授权，auths为0，表示未授权
							if(auths == 0){
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
						}else if(ids == "reportlog_log_viewbackupdb"){    //数据库备份日志
							//数据库备份授权，auths为0，表示未授权
							if(auths == 0){
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
						} else if (ids == "reportlog_log_viewcluster") {	// 集群日志
							reportLogPanel.add({
								xtype :'clusterLogList'
							});
						}
						
						else if(ids == "reportlog_log_viewemergency"){    //应急日志
							reportLogPanel.add({
								xtype :'emergencyLogList'
							});
						}else if(ids == "reportlog_log_viewrecovery"){    //存储恢复日志
							reportLogPanel.add({
								xtype :'recoveryLogList'
							});
						}else if(ids == "reportlog_log_viewsystem"){    //系统日志
							reportLogPanel.add({
								xtype : 'systemLogList'
							});
						}/*else if(ids == "userLogId"){    //账号操作日志
							reportLogPanel.add({
								xtype :'userLogList'
							});
						}else if(ids == "moduleLogId"){    //模块运行日志
							reportLogPanel.add({
								xtype :'moduleLogList'
							});
						}*/else if(ids == "reportlog_log_viewoperation"){    //运维日志
							reportLogPanel.add({
								xtype :'manageLogList'
							});
						}
					}
				},
				load:function(){
					//POWER_OP.filterEnableTreePanel(this, CURRENT_USER.getReportlogPower());
		            //var record = this.getStore().getNodeById('systemReportId');
		            //this.getSelectionModel().select(record);
		         }
			}
			}]
		}, {
			xtype : 'panel',
			region : 'center',
			layout : 'card',
			id: 'reportLogPanel',
			border:false,
			style:'border-left:1px solid #d1dade;',
			items : [{
				//xtype : 'systemReportList'
				xtype : 'logView'
			}],
			listeners:{
				render:function(v, eOpts){
					delay(0, function(){
						POWER_OP.filterEnableTreePanel("logTreeId", CURRENT_USER.getReportlogPower());
					});
				}
			}
		}];

		me.callParent(arguments);
	}
});