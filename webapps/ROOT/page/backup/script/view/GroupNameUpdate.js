
 Ext.define("websure.backup.view.GroupNameForm",{
 	  extend:'Ext.form.FormPanel',
 	  alias : 'widget.GroupNameForm',
 	  border: false,
	  labelWidth: 60,
	  margin:10,
	  labelAlign: "right",
	  items: [{
            xtype: "textfield",
            fieldLabel:local.backup.groupName,
            id: "groupName",
            labelSepartor: "：",
            labelWidth: 80,
            width: 230
        }
	  ]
 });



/*
 * 修改设备描述窗口
 */
Ext.define("websure.backup.view.GroupNameUpdate", {
	extend : 'Ext.window.Window',
	title : local.backup.modifyGroupName, 		//标题
	draggable : false, 
	height : 150, 
	width : 300, 
	alias : 'widget.GroupNameUpdate',
	id : 'GroupNameUpdate',
	layout : "fit", 		//窗口布局类型
	modal : true,		 //是否模态窗口，默认为false
	resizable : false,
	constructor : function(config) {
		var me = this;
		me.items = [{
			xtype : 'GroupNameForm',
			listeners:{
				"afterrender":function(){
					Ext.getCmp("groupName").setValue(config.groupName);
				}
			}
		}, 
		me.buttons = [{
            text: local.btn.modify,
			handler : function() {
				var groupNameValue = Ext.util.Format.trim(Ext.getCmp("groupName").getValue());
				
				if("" == groupNameValue){
        			Ext.MessageBox.alert(local.window.tip, local.backup.updateGroupNoNull);   //该分组名不能为空
        			return false;
        		}
				
				if(__isTCZF_DES(groupNameValue)){
					Ext.MessageBox.alert(local.window.tip,local.backup.winCreatGroupTipNameSpecial);
					return;
				}
				if(groupNameValue.length > GROUP_CONSTANT.groupNameLenLimit){
					Ext.MessageBox.alert(local.window.tip,local.backup.winCreatGroupTipNameLength);
					return;
				}
				Ext.Ajax.request({
					url : '/backup/todeviceAction!updateGroupNameById.action',
					params : {
						groupValue : groupNameValue,
						groupId : config.groupId
					},
					success : function(response, options) {
						var obj = Ext.decode(response.responseText);
						console.log(obj);
						var code = obj.msgCode;
						var content = obj.msgContent;
						if(MSG_NORMAL==code){
							Ext.websure.MsgTip.msg(local.window.tip, content, true);
							Ext.getCmp("GroupNameUpdate").destroy();
							Ext.getCmp('grobleTreePanel').getStore().reload();
						}else{
							Ext.websure.MsgError(code, content);
							Ext.getCmp("GroupNameUpdate").destroy();
							Ext.getCmp('grobleTreePanel').getStore().reload();
						}
					},
					failure : function() {
//						Ext.MessageBox.alert(local.window.tip, local.backup.updateGroupFailure);
						Ext.websure.MsgError("WF-30032", local.backup.updateGroupFailure);
					}
				});
			}
        },{
            text: local.btn.cancle,
			handler : function() {
				Ext.getCmp("GroupNameUpdate").destroy();
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
	var re =/[`~!@#$%^&*_+<>{}\/'"“‘[\]]/im;
	return re.test(s);
}
