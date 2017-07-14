Ext.define('acesure.config.view.client.ClientConfigPanel', {
			extend : 'Ext.panel.Panel',
			alias : 'widget.clientConfigPanel',	
			border:false,
			items: [{                                                                                                                                                                                              
				       xtype: 'toolbar',
				       id:'cliToolBar',
				       height:108,
						padding:'0 25 0 25',
						style:'background:#fafbfc;border:0;border-bottom:1px solid #e3eaec',
						defaults:{bodyStyle:'background:#fafbfc'},
						items : [ {
							xtype : "panel",
							border : false,
							html : '<img src="/images/config/config.png" style="width:48px;height:42px"/>'
						}, {
							xtype : "panel",
							border : false,
							html : '<font class="font_h3">'+local.config.clientConfig+'</font><br>'+local.config.clientConfigInfo
						}]	
			        },
			        {		       		           
				        xtype: 'panel',
				        id:'cliMainPanel',
					/*	height:700,
						width:'100%',*/
						border:false,
						padding:25,
						/*autoScroll:true,*/
						html:"<div class='config_div'><div class='config_t'>"+local.config.terminalRegister+"<button  onclick = 'editClientRegisterConfig()'>"+local.btn.modify+"</button></div><div style='padding-left:13px'>"+local.config.terminalRegisterAuto+"&nbsp;:&nbsp;是<br>限制空间&nbsp;:&nbsp;不限制<br><span style='color:#999'> "+local.config.terminalRegisterExplain+"</span></div></div><br>"+
						     "<div class='config_div'><div class='config_t'>"+local.config.terminalInstall+"<button  onclick = 'editClientInstallConfig()'>"+local.btn.modify+"</button></div><div style='padding-left:13px'>"+local.config.terminalInstallIcon+"&nbsp;:&nbsp;已启用<br>显示悬浮框&nbsp;:&nbsp;未配置<br>禁止删除数据&nbsp;:&nbsp;未配置</div></div><br>"+
						     "<div class='config_div'><div class='config_t'>"+local.config.passwordUninstall+"<button  onclick = 'editClientUninstallConfig()'>"+local.btn.modify+"</button></div><div style='padding-left:13px'>"+local.config.passwordUninstall+"&nbsp;:&nbsp;未设置<br><span style='color:#999'>"+local.config.passwordUninstallExplain+"</span></div></div><br>"
			        }]
				 
});


function editClientRegisterConfig(){	
	var registerConfigWin = Ext.create('acesure.config.view.client.ClientRegisterConfigWindow').show();		
}

function editClientInstallConfig(){	
	var installConfigWin = Ext.create('acesure.config.view.client.ClientInstallConfigWindow').show();		
}

function editClientUninstallConfig(){	
	var uninstallConfigWin = Ext.create('acesure.config.view.client.ClientUninstallConfigWindow').show();		
}




	 	
	