/**
 * 系统设置主界面 --徐英安
 */
Ext.define(
			'acesure.config.view.system.SystemConfigPanel',
			{
				extend : 'Ext.panel.Panel',
				alias : 'widget.systemConfigPanel',
				id : 'systemConfigPanel',
				border : false,
				layout:"vbox",
				items : [
						{
							xtype : 'toolbar',
							id : 'sysToolBar',
							width:"100%",
							height : 108,
							padding : '0 25 0 25',
							style : 'background:#fafbfc;border:0;border-bottom:1px solid #e3eaec',
							defaults : {
								bodyStyle : 'background:#fafbfc'
							},
							items : [
									{
										xtype : "panel",
										border : false,
										html : '<img src="/images/config/config.png" style="width:48px;height:42px"/>'
									},
									{
										xtype : "panel",
										border : false,
										html : '<font class="font_h3">'
												+local.config.adminSys
												+ '</font>'
									} ]
						},
						{
							xtype : 'panel',
							id : 'sysMainPanel',
							border : false,
							width:"100%",
							flex:1,
							overflowY:"auto",
							html : "<div class='sys_wrap'><div class='config_div'><div class='config_t'>"
									+ local.config.serverConfig
									+ "</div><div style='padding-left:13px'>"
									+ local.config.serverName
									+ "&nbsp;:&nbsp;"
									+ "<span id='IPServer'>"+local.unconfig+"</span>"
									+ "<br>"
									+ local.config.webPort
									+ "&nbsp;:&nbsp;<span id='webPort'>"+local.unconfig+"</span><br>"
									+ local.config.infoPort
									+ "&nbsp;:&nbsp;<span id='msgPort'>"+local.unconfig+"</span><br><span style='color:#999'>"
									+ local.config.serverConfigExplain
									+ "</span></div></div><br>"
									+ "<div class='config_div'><div class='config_t'>"
									+ local.config.systemSafety
									+ "<button name='systemconfig_system_configsafety' style='cursor:pointer' onclick = 'openEditSafetyConfigWindow()'>"
									+ local.btn.config
									+ "</button></div><div style='padding-left:13px'>"
									+ local.config.loginTimeLimit
									+ "&nbsp;:&nbsp;<span id='errorPwdLimit'>"+local.unconfig+"</span><br>"
									+ local.config.loginIPLimit
									+ "&nbsp;:&nbsp;<span id='loginIPLimit'></span><br>"
									+ local.config.codeOutCheck
									+ "&nbsp;:&nbsp;<span id='outdateCheck'>"+local.unconfig+"</span><br>"
									+ local.config.codeCheck
									+ "&nbsp;:&nbsp;<span id='pwdCheck'>"+local.unconfig+"</span><br>"
									+ "<span style='color:#999'>"
									+ local.config.serverSavetyMsg
									+ "</span></div></div><br>"
									+ "<div class='config_div'><div class='config_t'>"
									+ local.config.log
									+ "<button name='systemconfig_system_configlog' style='cursor:pointer' onclick = 'openEditLogConfigWindow()'>"
									+ local.btn.config
									+ "</button></div><div style='padding-left:13px'>"
									+ local.config.logClear
									+ "&nbsp;:&nbsp;<span id='logAutoClean'>"+local.unconfig+"</span><br>" 
									+ local.config.logEmail
									+ "&nbsp;:&nbsp;<span id='logSendMailPlan'>"+local.unconfig+"</span>"
									+ "<br><span style='color:#999'>"+local.config.logEmailMsg+"</span></div></div><br>"
									+"<div class='config_t'>"+local.config.DB+"</div>"
									+ "<div class='config_div'><div class='config_t config_t1'>"
									+ local.config.backup
									+ "<button name='systemconfig_system_importdb' style='cursor:pointer' onclick = 'openImportDatabaseFileWindow()'>"
									+ local.btn.import0
									+ "</button>"
									+ "<button name='systemconfig_system_exportdb' style='cursor:pointer' onclick = 'openExportDatabaseFileWindow()'>"
									+ local.btn.export0
									+ "</button></div><div style='padding-left:13px'>"
									+ local.config.backupTime
									+ "&nbsp;:&nbsp;<span id='exportDatabaseTime'>"+local.unexport+"</span><br>" 
									+ "<span style='color:#999'>"+local.config.exportMsg+"</span></div></div>"
									+ "<div class='config_div'><div class='config_t config_t1'>"
									+ local.config.backupAuto
									+ "<button name='systemconfig_system_configdbbackup' style='cursor:pointer' onclick = 'openEditDatabaseAutoBackupPathWindow()'>"
									+ local.btn.config
									+ "</button></div><div style='padding-left:13px'>"
									+ local.config.databaseBackupAuto
									+ "&nbsp;:&nbsp;<span id='isBackupDB'>"+local.unconfig+"</span><br>"
									+ local.config.DBSrc
									+ "&nbsp;:&nbsp;<span id='exportDatabasePath'>"+local.unconfig+"</span><br>"									
									+ "<span style='color:#999'> "
									+ local.config.DBExplain
									+ "</span></div></div><br>"
									+ "<div class='config_div'><div class='config_t'>"
                                    + local.config.vmsSWarning
                                    + "<button name='systemconfig_system_editvmswarning' style='cursor:pointer' onclick = 'openEditVmsWarnigThresholdWindow()'>"
                                    + local.btn.config
                                    + "</button></div><div style='padding-left:13px'>"
                                    + local.config.vmsSWarningMax
                                    + "&nbsp;:&nbsp;<span id='isThreshold'>"+local.unconfig+"</span><br>"                                   
                                    + "<span style='color:#999'> "
                                    + local.config.vmsSWarningMaxMsg
                                    + "</span></div></div><br>"
                                    + "<div class='config_div'><div class='config_t'>"
                                    + "系统模版导入"
                                    + "<button  style='cursor:pointer' onclick = 'importOem()'>"
                                    + local.btn.config
                                    + "</button>"
                                    + "<button  style='cursor:pointer' onclick = 'exportOem()'>"
                                    + local.btn.export0
                                    + "</button>"
                                    + "</div><div style='padding-left:13px'>"
                                    + "<span style='color:#999'> "
                                    + "系统平台样式导入"
                                    + "</span></div></div>"                                    
                      
                                    +"</div>"
                                    
						}]
			});
