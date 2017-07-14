/**
 * Description:强制修改账户密码处理页面
 * 2016-7-7
 */

function openModifyPsdWin(){
      
/**
 * 数据源
 */
var PasswordUpdateStore =  Ext.create('Ext.data.Store', {
                                  fields : [
                                     { name : 'IsPwdCheck' },
                                     { name : 'PwdType' },
                                     { name : 'PwdLength' },
                                     { name : 'LastPwd' }
                                 ],
                                proxy:{
                                    type : 'ajax',
                                    url : '/config/toSystemConfigAction!getSystemServerPasswordCheck.action',
                                    reader : {
                                        type : 'json',
                                        root : 'PwdCheckInfo'
                                    }
                                 }
                            });

/**
 * 密码修改窗口
 */	
var accountModifyPwdWin = Ext.getCmp('accountModifyPwdWin');

if(accountModifyPwdWin){
	accountModifyPwdWin.destroy();
}

accountModifyPwdWin = Ext.create('Ext.window.Window', {                              
                                alias : 'widget.accountModifyPwdWin',
                                id : 'accountModifyPwdWin',
                                width:400,
                                bodyStyle:"background-color:#FFFFFF",
                                title:local.config.systemSafety,    //系统安全
                                closable: false,
                                border:false,
                                bodyBorder:false,
                                resizable:false,
                                buttonAlign:"right",
                                modal:true,
                                items : [{
                                        border:false,
                                        layout:"form",
                                        padding:10,
                                        items:[{
                                                xtype:'fieldset',
                                                title: local.regularUpdateCode,    //定期更新密码
                                                collapsible: false,
                                                autoHeight:true,
                                                defaults:{                          
                                                    layout: 'form',
                                                    xtype:'textfield',
                                                    border:false,
                                                    labelWidth:120,
                                                    padding:"0 5px 0 5px"
                                                        },
                                                items:[
                                                    {
                                                        id:'userCurPwd',
                                                        name:'userCurPwd',
                                                        maxLength :25,
                                                        fieldLabel:local.regularUpdateCode,
                                                        inputType:'password',
                                                        blankText:local.codeNoNull,    //登录密码不能为空
                                                        msgTarget:"under",
                                                        allowBlank: false,
                                                        listeners:{
                                                            change: function(field, newVal, oldVal){
                                                                var lastPwd = this.up('window').query("#LastPwd")[0].getValue();
                                                                if(lastPwd==newVal){
                                                                    Ext.Msg.show({ 
                                                                        title:local.window.tip, 
                                                                        msg:local.codeNewOldSameTip,     //新旧密码不能相同
                                                                        width:300,
                                                                        closable:true, 
                                                                        modal:true, 
                                                                        icon:Ext.Msg.INFO 
                                                                        }); 
                                                                }
                                                                if (isNull(newVal.trim())) {
                                                                	field.setValue(null);
                                                                }
                                                            }
                                                        }
                                                    },{
                                                        id:'userConfirmCurPwd',
                                                        maxLength :25,
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
                                                html:'&nbsp&nbsp&nbsp&nbsp&nbsp'+local.codeModifyTip
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
                                            handler : function(btn, e, eOpts) {                                              
                                                //基本密码校验
                                            	var me = btn.up('window');
                                                var passwordExt = me.query("#userCurPwd")[0];
                                                var confirmPwdExt = me.query("#userConfirmCurPwd")[0];
                                                var password = passwordExt.getValue().trim();
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
                                                        Ext.websure.MsgError("", local.codeLengthMax+PASSWORD_MAX_LENGTH+local.codeLengthUnit);
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
                            });
                            
accountModifyPwdWin.show();
PasswordUpdateStore.load({
                callback: function (records, options, success){
                    accountModifyPwdWin.down('form').getForm().loadRecord(records[0]);
    }
});
      
	
}

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
            Ext.websure.MsgError("WF-30035", local.codeUpdateError);
        }
    });
}