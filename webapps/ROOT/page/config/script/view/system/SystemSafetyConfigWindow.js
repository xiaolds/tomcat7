Ext.define('acesure.config.view.system.SystemSafetyConfigWindow', {
	extend : 'Ext.window.Window',
	alias : 'widget.safetyConfigWin',
	id : 'safetyConfigWin',
	width:500,
	title:local.config.sysSafetyConfig,
	border:false,
	buttonAlign:"right",
	modal:true,
	
	initComponent : function(){
		var me = this;
						
		Ext.applyIf(me, {
			items : [{
				xtype:'tabpanel',
				margin:"10 0 0 0",
				cls:"tab_big",
				plain:true,
				activeTab:0,
				border:false,
				bodyBorder:false,
				items:[
					{	
						title:local.config.loginAccess,
						border:false,
						style:"border-top:1px solid #ccc;",
						items:[{
								style:"margin-top:5px",
								border:false,
								bodyBorder:false,
								padding:10,
								items:[
									{
										xtype:'fieldset',
										checkboxToggle:true,
										title: local.config.errorLoginAccessLimit,
										id:'isStartLoginErrorLimit',
										collapsible: true,
										defaults:{
											width:440,
											labelAlign:"left",
											labelWidth:180
										},
										autoHeight:true,										
										items:[
											{
												xtype:'numberfield',
												id:'loginErrorCount',
												fieldLabel:local.config.errorLoginAccessLimitTime,
												minValue: ERROR_LOGIN_MIN_COUNT, 
												maxValue: ERROR_LOGIN_MAX_COUNT,
												minText: local.config.minText+ERROR_LOGIN_MIN_COUNT,
												maxText: local.config.maxText+ERROR_LOGIN_MAX_COUNT,
												msgTarget: 'under',
												allowBlank : false,
												blankText : local.config.loginErrorLimitTimeNoNull,
												listeners:{
													change: function(field, newValue, oldValue){
														setIntFieldExt(field, newValue, oldValue)
													}
												}
											},{
												xtype:'numberfield',
												id:'loginErrorMinute',
												fieldLabel:local.config.limitErrorLoginTime,
												//labelWidth:180,
												//width:300,
												minValue: LOCK_LOGIN_MIN_MINUTE, 
												maxValue: LOCK_LOGIN_MAX_MINUTE,
												minText: local.config.minText+LOCK_LOGIN_MIN_MINUTE,
												maxText: local.config.maxText+LOCK_LOGIN_MAX_MINUTE,
												msgTarget: 'under',
												allowBlank : false,
												blankText : local.config.loginErrorLimitLockTimeNoNull,
												listeners:{
													change: function(field, newValue, oldValue){
														setIntFieldExt(field, newValue, oldValue);
													}
												}
											
											}
										]
									},{
										xtype:'fieldset',
										checkboxToggle:true,
										title: local.config.IPloginLimit,
										id:'isStartLimitIp',
										collapsible: true,
										autoHeight:true,
										defaults:{
											width:440,
											labelAlign:"left",
											labelWidth:180
										},
										items:[
											{
												xtype:'textareafield',
												id:'limitIp',
												fieldLabel:local.IP,
												msgTarget: 'under',
												emptyText:local.config.noLimit,
												allowBlank : false,
												blankText : local.config.IPNoNull
											}
										]
									},{
										xtype:'fieldset',
										title: local.explain,
										collapsible: false,
										padding:10,
										html:local.config.safetyConfigMsg
									}
								]}
					       	]},
					{
						title:local.config.sysSafetyConfig, 
						border:false,
						style:"border-top:1px solid #ccc;",
						items:[{
							style:"margin-top:5px",
							border:false,
							margin:10,
							items:[
								{
									xtype:'fieldset',
									title: local.config.codeOutTip,
									checkboxToggle:true,
									id: 'pwdIsExpired',
									collapsible: true,
									autoHeight:true,
									labelWidth:120,
									defaults:{
										width:440,
										labelAlign:"left",
										labelWidth:180
									},
									items:[							
										{
											xtype:'numberfield',
											id:'pwdExpiredDay',
											//labelWidth:180,
											fieldLabel:local.config.accountCodePastTime,
											minValue: PASSWORD_OUTDATE_MIN_DAY,
											maxValue: PASSWORD_OUTDATE_MAX_DAY,
											minText: local.config.minText+PASSWORD_OUTDATE_MIN_DAY,
											maxText: local.config.maxText+PASSWORD_OUTDATE_MAX_DAY,
											msgTarget: 'under',
											allowBlank : false,
											blankText : local.config.codePastTimeNoNull,
											listeners:{
												change: function(field, newValue, oldValue){
													setIntFieldExt(field, newValue, oldValue);
												}
											}
										}
									]
								},{
									xtype:'fieldset',
									title: local.config.codeCheck,
									checkboxToggle:true,
									id: 'isPwdCheck',
									collapsible: true,
									autoHeight:true,
									labelWidth:120,
									defaults:{
										width:440,
										labelAlign:"left",
										labelWidth:180
									},
									items:[
										{
											xtype:'combo',
											mode: 'local',
											fieldLabel:local.config.codeCheckType,
											//labelWidth:180,
											id:'pwdCheckType',
											name:'pwdCheckType',
											store:new Ext.data.SimpleStore({
												fields: ["value", "text"],
												data: [['0',local.config.checkNo],['1',local.config.letterNum]] 
											}),
											valueField :"value",
											displayField: "text",
											value:'0',
											editable:false,
											triggerAction:"all"
										},     
										{
											xtype:'numberfield',
											id:'pwdLength',
											//labelWidth:180,
											minValue:PASSWORD_MIN_LENGTH,
											maxValue:PASSWORD_MAX_LENGTH,
											fieldLabel:local.config.codeMinLength,
											minText: local.config.minText+PASSWORD_MIN_LENGTH,
											maxText: local.config.maxText+PASSWORD_MAX_LENGTH,
											msgTarget: 'under',
											allowBlank : false,
											blankText : local.config.codeLenghtNoNull,
											listeners:{
												change: function(field, newValue, oldValue){
													setIntFieldExt(field, newValue, oldValue);
												}
											}
										}
									]
								},{
									xtype:'fieldset',
									title: local.explain,
									collapsible: false,
									autoHeight:true,
									padding:10,
									html:local.config.safetyConfigAccountMsg
								}
							]
						}]}
				]
			}
		    ],
			buttons : [{
			            text:local.btn.save,
			            cls:"btn_focus",
			            id:'serverSafetyConfigSaveBtn'
	    			},{
						text : local.btn.cancle,
						handler : function() {
							this.up('window').close();
						}
	    			}]
		}
	)
		me.callParent(arguments);	
	}
})