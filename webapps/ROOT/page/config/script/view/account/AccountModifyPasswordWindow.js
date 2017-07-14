Ext.define('acesure.config.view.account.AccountModifyPasswordWindow', {
	extend : 'Ext.window.Window',
	alias : 'widget.accountModifyPwdWin',
	id : 'accountModifyPwdWin',
	width:400,
	bodyStyle:"background-color:#FFFFFF",
	title:local.config.systemSafety,
	closable: false,
	border:false,
	bodyBorder:false,
	resizable:false,
	buttonAlign:"right",
	modal:true,
	
	initComponent : function(){
		var me = this;
						
		Ext.applyIf(me, {
			items : [{
					border:false,
					layout:"form",
					padding:10,
					items:[{
							xtype:'fieldset',
							title: local.regularUpdateCode,
							collapsible: false,
							autoHeight:true,
							defaults:{							
								layout: 'form',
								xtype:'textfield',
								border:false,
								labelWidth:80,
								padding:"0 5px 0 5px"
									},
							items:[
								{
									id:'userCurPwd',
									name:'userCurPwd',
									maxLength :50,
									fieldLabel:local.newCode,
									inputType:'password',				        					        	
									blankText:local.codeNoNull,
									msgTarget:"under",
									allowBlank: false,
									listeners:{
										change: function(field, newVal, oldVal){
											var lastPwd = me.query("#LastPwd")[0].getValue();
											if(lastPwd==newVal){											
												Ext.Msg.show({ 
													title:local.window.tip, 
													msg:local.codeNewOldSameTip, 
													width:300, 													
													closable:true, 
													modal:true, 
													icon:Ext.Msg.INFO 
													}); 
											}
										}
									}
								},{
									id:'userConfirmCurPwd',
									maxLength :50,
									fieldLabel:local.codeConfirm,
									inputType:'password',
									blankText:local.codeConfirmNoNull,
									msgTarget:"under",
									allowBlank: false	          
								}
							]
						},{
							xtype:'fieldset',
							title: local.explain,
							collapsible: false,
							autoHeight:true,
							html:local.codeModifyTip
						},{
							xtype:'form',
							id:'pwdCheckForm',
							hidden:true,
							defaults:{xtype:'textfield'},
							items:[{id:'IsPwdCheck'},{id:'PwdType'},{id:'PwdLength'},{id:'LastPwd'}]
						}
					]  
			}			    
		    ],			              
			buttons : [{
			            text:local.btn.save,
			            handler : function() {
			            	
			            	//基本密码校验
							var passwordExt = me.query("#userCurPwd")[0];
							var confirmPwdExt = me.query("#userConfirmCurPwd")[0];
							var password = passwordExt.getValue();
							var confirmPwd = confirmPwdExt.getValue();
							if(isNull(password) && isNull(confirmPwd)){
								Ext.websure.MsgError("", local.codeInput);
								return ;
							}
							if(password!=confirmPwd){
								Ext.websure.MsgError("", local.codeNoEqual);
								return ;
							}
							
							//系统配置的密码校验
							var isPwdCheck = me.query("#IsPwdCheck")[0].getValue();
							var pwdType = me.query("#PwdType")[0].getValue();;
							var pwdLen = me.query("#PwdLength")[0].getValue();						
							if(1==isPwdCheck){
								var length = password.length;
								if(0==length){
									Ext.websure.MsgError("", local.codeLengthMin+PASSWORD_MIN_LENGTH+local.codeLengthUnit);
									return ;
								}else if(length>PASSWORD_MAX_LENGTH){
									Ext.websure.MsgError("", codeLengthMax+PASSWORD_MAX_LENGTH+local.codeLengthUnit);
									return ;
								}else if(length<pwdLen && length>0){
									Ext.websure.MsgError("", local.codeLengthMin+pwdLen+local.codeLengthUnit);
									return ;
								}else if(PASSWORD_CHECK_TYPE_OF_LETTERS_AND_NUMBERS==pwdType && notIncludeLettersAndNumbers(password)){												
									Ext.websure.MsgError("", local.codeErrorCodeNum);
									return ;
								}			
							}	
							//更新当前账户密码
							updatePassword(me, password);
						}
	    			}
	    			]
		}
	)
		me.callParent(arguments);	
	}
})	


/**
 * 更新账户密码
 * @param window
 * @param password
 */
function updatePassword(window, password){
	Ext.Ajax.request({
		method : 'post',
		async :  false,
		params: { Password: password },	
		url : '/config/toUserConfigAction!updateCurrentUserPassword.action',
		success : function(response,options) {
			try {
				var obj = eval("("+response.responseText+")");
				code = obj.msgCode;
				if(MSG_NORMAL==code){
					window.close();	
				}
				showResultDialog(code, obj.msgContent);				
			} catch (e) {										
				Ext.websure.MsgError("", local.backup.loginAbnormal);
			}
		},
		failure : function(response,options) {
			Ext.websure.MsgError("WF-30078", local.codeUpdateError);
		}
	});
}