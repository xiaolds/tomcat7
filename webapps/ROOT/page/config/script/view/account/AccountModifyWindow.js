Ext.define(		
		'acesure.config.view.account.AccountModifyWindow',
		{
			extend : 'Ext.window.Window',
			alias : 'widget.accountModifyWin',
			id : 'accountModifyWin',
			width : 600,
			border : false,
			title : local.config.winModifyAccount,
			cls : 'toolbar', // 设置底部toolbar背景颜色和边框
			modal : true,
			resizable : false,
			overflowY : 'auto', // 超出自动垂直滚动
			constrain : true,
			layout : 'vbox',
			initComponent : function() {
				var me = this;
				Ext.applyIf(me, {					
					items : [ {
						xtype : 'form',
						id : 'userModifyForm',
						border : false,
						padding : 10,
						width : "100%",
						defaultType : 'textfield',
						items : [
								{
									xtype : 'fieldset',
									title : local.basicInfo,
									collapsible : false,
									autoHeight : true,
									layout : {
										type : "table",
										columns : 2
									},
									defaults : {
										layout : 'form',
										xtype : 'textfield',
										border : false,
										labelWidth : 80,
										padding : "0 5px 0 5px  "
									},
									items : [
											{
												id : 'userId',
												name : 'user.userId',
												hidden : true
											},
											{
												id : 'userName',
												name : 'user.userName',
												fieldLabel : local.config.userName,
												blankText : local.config.userNameNoNull,
												maxLength : 25,
												vtype : "alphanum",
												vtypeText : local.config.userNameTip,
												msgTarget : "under",
												allowBlank : false,
												readOnly : true
											},
											{
												id : 'loginTypeChange',
												name : 'loginTypeChange',
												hidden : true
											},											
											{
												id : 'initRoleId',
												name : 'initRoleId',
												hidden : true
											},
											{
												xtype : 'combo',
												mode : 'local',
												fieldLabel : local.config.userLoginType,
												id : 'userLoginType',
												name : 'user.userLoginType',
												store : 'AccountLoginTypeStore',
												valueField : "value",
												displayField : "text",
												value : 0,
												editable : false,
												triggerAction : "all",
												listeners : {
													select : function(combo, records, eOpts){
														if (records[0].data.value != 0 ) {
															combo.up('form').query('#loginTypeChange')[0].setValue(NORMAL);
															Ext.Msg.alert(local.window.tip, local.config.userLoginTypeTip);
														}
													}
												}
											},
											{
												id : 'userPwd',
												name : 'user.userPwd',
												maxLength : 25,
												fieldLabel : local.config.userPwd,
												inputType : 'password',
												blankText : local.codeNoNull,
												msgTarget : "under",
												allowBlank : false
											},
											{
												id : 'userConfirmPwd',
												maxLength : 25,
												fieldLabel : local.codeConfirm,
												inputType : 'password',
												blankText : local.codeConfirmNoNull,
												msgTarget : "under",
												allowBlank : false
											},
											{
												xtype : 'combo',
												mode : 'local',
												fieldLabel : local.config.role,
												id : 'roleId',
												name : 'user.role.roleId',
												store : 'AccountRoleStore',
												valueField : "roleId",
												displayField : "roleName",
												editable : false,
												msgTarget : "under",
												allowBlank : false,
												blankText : local.config.roleNoNull,
												triggerAction : "all",
												listeners : {
													select : function(combo, records, eOpts){
														Ext.Msg.alert(local.window.tip, local.config.roleChangeResetInform);
													}
												}
											},
											{
												id : 'userEmail',
												name : 'user.userEmail',
												fieldLabel : local.log.emailAdress,
												maxLength : 25,
												vtype : "email",
												msgTarget : "under",
												vtypeText : local.config.inputRightEmailTip,
												blankText : local.config.emailNoNull,
												allowBlank : false
											},
											{
												id : 'userPhone',
												name : 'user.userPhone',
												fieldLabel : local.config.phone,
												maxLength : 25,
												regex : PHONE_REGEX,
												msgTarget : "under",
												blankText : local.config.phoneNoNull,
												allowBlank : false,
												regexText : local.config.phoneTip
											},
											{
												id : 'userRemark',
												name : 'user.userRemark',
												fieldLabel : local.config.describe,
												maxLength : 25
											}/*,{
												id : 'tempdevgroup',
												hidden : true
											},{
												id : 'tempstonode',
												hidden : true
											},{
												id : 'tempcalnode',
												hidden : true
											}*/]
										},
										{
											xtype : 'fieldset',
											id : 'reguseroptioninfo',
											title : local.explain,
											padding : 10,
											autoHeight : true,
											collapsed : false,
											html : local.config.accountExplain
											}/*,
										{
											xtype : 'fieldset',
											title : local.config.deviceGroup,
											cls:"config_auth_field",
											collapsible : true,											
											items : [{
					                        	 width: 85,
					                             xtype: 'checkbox',
					                             boxLabel: '始终全选',
					    	                     id: 'autofillDevgroup',
					                             cls:"config_ahth_check",
					                             style: 'background:#fff;position: absolute; top:0px; right: 10px;',
					                             listeners: {
					                            	 change : function(v, newVal, oldVal, eOpts) {
					                            		 autofillListenerAsChange(v, newVal);					                            							                            		
					                            		 // initCheckboxListenerAsChange(v, newVal);
					                            		 // initCheckboxListenerAsChange(v, newVal, NORMAL, v.up('form').query('#userName')[0].getValue());	                            		 
					                            	 },
					                            	 render : function(v, eOpts) {					                            		
					                            		 // initCheckboxListenerAsRender(v);
					                            	 }
					                             }
					                         }, {
												xtype : 'checkboxgroup',
												id : 'deviceGroup',
												columns : 2,
												padding : 5
											} ]
										},
										{
											xtype : 'fieldset',
											title : local.emergency.nodeSave,
											cls:"config_auth_field",
											width : '100%',
											collapsible : true,											
											items : [ {
					                        	 width: 85,
					                             xtype: 'checkbox',
					                             boxLabel: '始终全选',
					    	                     id: 'autofillStonode',
					                             cls:"config_ahth_check",
					                             style: 'background:#fff;position: absolute; top:0px; right: 10px;',
					                             listeners: {
					                            	 change : function(v, newVal, oldVal, eOpts) {
					                            		 autofillListenerAsChange(v, newVal);					                            		
					                            		 // initCheckboxListenerAsChange(v, newVal);	                            		 
					                            	 },
					                            	 render : function(v, eOpts) {
					                            		 initCheckboxListenerAsRender(v);
					                            	 }
					                             }
					                         },{
												xtype : 'checkboxgroup',
												id : 'stonodeGroup',
												flex : 1,
												columns : 1,
												padding : 5
											} ]
										},
										{
											xtype : 'fieldset',
											title : local.emergency.nodeCount,
											cls:"config_auth_field",
											width : '100%',											
											collapsible : true,
											items : [ {
					                        	 width: 85,
					                             xtype: 'checkbox',
					                             boxLabel: '始终全选',
					    	                     id: 'autofillCalnode',
					                             cls:"config_ahth_check",
					                             style: 'background:#fff;position: absolute; top:0px; right: 10px;',
					                             listeners: {
					                            	 change : function(v, newVal, oldVal, eOpts) {					                            		
					                            		 autofillListenerAsChange(v, newVal);					                            	
					                            		 // initCheckboxListenerAsChange(v, newVal);	                            		 
					                            	 },
					                            	 render : function(v, eOpts) {
					                            		 initCheckboxListenerAsRender(v);
					                            	 }
					                             }
					                         },{
												xtype : 'checkboxgroup',
												id : 'calnodeGroup',
												flex : 1,
												columns : 1,
												padding : 5
											} ]
										}*/]
									}
									],
									buttons : [ {
										text : local.btn.save,
										cls:"btn_focus",
										id : 'accountModifySave'
									}, {
										text : local.btn.cancle,
										handler : function() {
											this.up('window').close();
										}
									} ]
								});
				me.callParent(arguments);
			}
		});
