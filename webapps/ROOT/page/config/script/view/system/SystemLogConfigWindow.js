Ext.define(		
		'acesure.config.view.system.SystemLogConfigWindow',
		{
			extend : 'Ext.window.Window',
			alias : 'widget.logConfigWin',
			id : 'logConfigWin',
			width : 400,
			title : local.config.logConfig,
			border : false,
			resizable : false,
			buttonAlign : "right",
			modal : true,
			initComponent : function() {
				var me = this;
				Ext.applyIf(me, {					
					items : [ {
						padding : 10,
						border : false,
						items : [
								{
									xtype : 'fieldset',
									id : 'isStartAutoCleanLog',
									checkboxToggle : true,
									title : local.config.startLogClean,
									collapsible : true,
									autoHeight : true,
									labelWidth : 80,
									padding : 10,
									items : [
											{
												border : false,
												layout : 'form',
												labelWidth : 80,
												items : {
													xtype : 'combo',
													fieldLabel : local.log.titleSystemLog,
													id : 'autoCleanSystemLog',
													mode : 'local',
													store : new Ext.data.SimpleStore(
															{
																fields : [ "value", "text" ],
																data : [
																		[ '0', local.config.noClean ],
																		[ '3', local.config.threeMonth ],
																		[ '6', local.config.sixMonth ],
																		[ '12', local.config.oneYear ],
																		[ '18', local.config.oneYearAndOneHalf ],
																		[ '24', local.config.twoYear ] 
																		]
															}),
													valueField : "value",
													displayField : "text",
													value : '12',
													triggerAction : "all",
													editable : false,
													width : 110
												}
											},
											{
												border : false,
												layout : 'form',
												labelWidth : 80,
												items : {
													xtype : 'combo',
													fieldLabel : local.config.logFunction,
													id : 'autoCleanFunctionLog',
													mode : 'local',
													store : new Ext.data.SimpleStore(
																{fields : [ "value", "text" ],
																data : [
																		[ '0', local.config.noClean ],
																		[ '3', local.config.threeMonth ],
																		[ '6', local.config.sixMonth ],
																		[ '12', local.config.oneYear ],
																		[ '18', local.config.oneYearAndOneHalf ],
																		[ '24', local.config.twoYear ] 
																		]
															}),
													valueField : "value",
													displayField : "text",
													value : '12',
													triggerAction : "all",
													editable : false,
													width : 110
												}
											},
											{
												border : false,
												layout : 'form',
												labelWidth : 80,
												items : {
													xtype : 'combo',
													fieldLabel : local.config.logOperate,
													id : 'autoCleanOperationLog',
													mode : 'local',
													store : new Ext.data.SimpleStore(
															{
																fields : [ "value", "text" ],
																data : [
[ '0', local.config.noClean ],
[ '3', local.config.threeMonth ],
[ '6', local.config.sixMonth ],
[ '12', local.config.oneYear ],
[ '18', local.config.oneYearAndOneHalf ],
[ '24', local.config.twoYear ] 
																		]
															}),
													valueField : "value",
													displayField : "text",
													value : '12',
													triggerAction : "all",
													editable : false,
													width : 110
												}
											} ]
								},
								{
									xtype : 'fieldset',
									id : 'isLogSendMail',
									checkboxToggle : true,
									title : local.config.logEmail,
									collapsible : true,
									autoHeight : true,
									labelWidth : 80,
									padding : 10,
									items : [
											{
												border : false,
												layout : 'form',
												labelWidth : 80,
												items : {
													xtype : 'combo',
													fieldLabel : local.config.sendRate,
													id : 'monthSendMail',
													mode : 'local',
													store : new Ext.data.SimpleStore(
															{
																fields : [ "value", "text" ],
																data : [
																		[ '0', local.config.noSend ],
																		[ '3', local.config.threeMonth ],
																		[ '6', local.config.sixMonth ],
																		[ '12', local.config.oneYear ]
																		]
															}),
													valueField : "value",
													displayField : "text",
													value : '0',
													triggerAction : "all",
													editable : false,
													width : 110
												}
											} ]
								},
								{
									xtype : 'fieldset',
									title : local.explain,
									collapsible : false,
									autoHeight : true,
									padding : 10,
									html : local.config.logSetSaveExplain
								} ]
					} ],
					buttons : [
							{
								text : local.btn.save,
								cls:"btn_focus",
								id : 'autoCleanLogConfigSaveBtn'
							},
							{
								text : local.btn.cancle,
								handler : function() {
									this.up('window').close();
								}
							} ]
				});
				me.callParent(arguments);
			}
		});
