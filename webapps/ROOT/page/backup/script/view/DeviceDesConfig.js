
 Ext.define("websure.backup.view.DeviceDesForm",{
 	  extend:'Ext.form.FormPanel',
 	  alias : 'widget.DeviceDesForm',
 	  border: false,
	  labelWidth: 60,
	  margin:10,
	  labelAlign: "right",
	  items: [{
            xtype: "textfield",
            fieldLabel: local.config.describe,
            id: "des",
            labelSepartor: "：",
            labelWidth: 40,
            maxLength:20,
            msgTarget:'side',
            width: 250
        }
	  ]
 });



/*
 * 修改设备描述窗口
 */
Ext.define("websure.backup.view.DeviceDesConfig", {
	extend : 'Ext.window.Window',
	title : local.deviceDescribe, 		//标题
	draggable : false, 
	height : 150, 
	width : 300, 
	alias : 'widget.DeviceDesConfig',
	id : 'DeviceDesConfig',
	layout : "fit", 		//窗口布局类型
	modal : true,		 //是否模态窗口，默认为false
	resizable : false,
	constructor : function(config) {
		var me = this;
		me.items = [{
			xtype : 'DeviceDesForm',
			listeners:{
				"afterrender":function(){
					Ext.getCmp("des").setValue(config.deviceDes);
				}
			}
		}, 
		me.buttons = [{
            text: local.btn.modify,
			handler : function() {
				var desValue = Ext.getCmp("des").getValue();
				
				if(__isTCZF_DES(desValue)){
					Ext.MessageBox.alert(local.window.tip,local.backup.deviceDesConfigWinFailureTexWrong);
					return;
				}
				if(!__isLengthMore(desValue)){
					Ext.MessageBox.alert(local.window.tip,local.backup.deviceDesTooLong);
                    return;
                }
				Ext.Ajax.request({
					url : '/backup/todeviceAction!updateDeviceDesById.action',
					params : {
						desValue : desValue,
						deviceId : config.deviceId
					},
					success : function(response, options) {
						var obj = Ext.decode(response.responseText);
						console.log(obj);
						var code = obj.msgCode;
						var content = obj.msgContent;
						if(MSG_NORMAL==code){
							Ext.websure.MsgTip.msg(local.window.tip, content, true);
							Ext.getCmp("DeviceDesConfig").destroy();
							Ext.getCmp('grobleTreePanel').getStore().reload();
						}else{
							Ext.websure.MsgError(code, content);
						}
					},
					failure : function() {
//						Ext.MessageBox.alert(local.window.tip,local.backup.deviceDesConfigWinFailure);
						Ext.websure.MsgError("WF-30029",local.backup.deviceDesConfigWinFailure);
					}
				});
			}
        },{
            text: local.btn.cancle,
			handler : function() {
				Ext.getCmp("DeviceDesConfig").destroy();
			}
        }] ];

		me.callParent(arguments);
	}
});

/**
 * 判断特殊字符
 * @param {} s
 * @return {}
 */
function __isTCZF_DES(s) {
	var re =/[`~!@#$%^&*_+<>{}\/'[\]][]/im;
	return re.test(s);
}
/**
 * 判断字符长度 n
 */
function __isLengthMore(s) {
    var re =/^.{3,20}$/;
    return re.test(s);
}