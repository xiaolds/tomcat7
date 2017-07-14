extraDeviceId = null;

var states = Ext.create('Ext.data.Store', {
    fields: ['id', 'name'],
    data : [
        {"id":1, "name":local.normal},
        {"id":2, "name":local.defaulty},
        {"id":3, "name":local.warn}
    ]
});

var logType = Ext.create('Ext.data.Store', {
    fields: ['id', 'name'],
    data : [
        {"id":1, "name":local.backup.operateLog}
    ]
});

Ext.define("websure.backup.view.ManageLogLevel",{
	 	extend:'Ext.form.ComboBox',
	 	alias : 'widget.manageLogLevel',
	 	id:'manageLogLevel',
	 	name : "manageLog.manageLogLevel",
        fieldLabel : local.backup.operateLogLevel,  
        emptyText:local.backup.operateLogLevelChoose,
        editable:false,
        labelWidth: 80,
        store: states,
	    queryMode: 'local',
	   	displayField:'name',    
        valueField :'id',    
        typeAhead:false 
    }); 
    
Ext.define("websure.backup.view.ManageLogType",{
	 	extend:'Ext.form.ComboBox',
	 	alias : 'widget.manageLogType',
	 	id:'manageLogType',
	 	name : "manageLog.manageLogType",
        fieldLabel : local.backup.operateLogType,  
        emptyText:local.backup.operateLogTypeChoose,
        editable:false,
        labelWidth: 80,
        store: logType,
	    queryMode: 'local',
	   	displayField:'name',    
        valueField :'id',   
        value : 1,
        typeAhead:false 
    }); 

Ext.define("websure.backup.view.CreateManageLogForm",{
			 	  extend:'Ext.form.FormPanel',
			 	  alias : 'widget.createManageLogForm',
			 	  id:'createManageLogForm',
			 	  border: false,
				  margin:'10 10 20 10',
				  labelAlign: "right",
				  items: [{
				  	xtype:'manageLogLevel'
				  	},{
				  	xtype:'manageLogType'
				  	},{
		            xtype: "textfield",
		            fieldLabel: local.pcID,
		            hidden:true,
		            id: "manageDeviceId",
		            name:'manageLog.manageDeviceId',
		            labelSepartor: "：",
		            value:"",
		            labelWidth: 80
		        },{
		            xtype: "textarea",
		            fieldLabel: local.backup.operateLogContent,
		            height: 100,
		            width: 300,
		            id: "manageLogContent",
		            name:'manageLog.manageLogContent',
		            labelSepartor: "：",
		            labelWidth: 80
		        }]
			 });

/*
 * 修改设备描述窗口
 */
Ext.define("websure.backup.view.CreateOperationLog", {
	extend : 'Ext.window.Window',
	title : local.backup.operateLogAdd,
	draggable : true, 
	//height : 380, 
	width : 360, 
	border:false,
	alias : 'widget.createOperationLog',
	id : 'createOperationLog',
	layout : "fit", 		//窗口布局类型
	modal : true,		 //是否模态窗口，默认为false
	resizable : false,
	constructor : function(config) {
		//填充外部设备Id
		extraDeviceId = config.deviceId;
		var me = this;
		me.items = [{
			xtype : 'createManageLogForm',
			listeners:{
				"afterrender":function(){
					
				}
			}
		}, 
		me.buttons = [{
            text: local.btn.save,
			handler : function() {
				//获取
                     //日志等级
                     var clientSys = Ext.getCmp('manageLogLevel').getValue();
                     if(null == clientSys){
                     	Ext.MessageBox.alert(local.window.tip,local.backup.operateLogLevelChoose+"!");
						return;
                     }
                     
                     //日志类型
                     var clientSys = Ext.getCmp('manageLogType').getValue();
                     if(null == clientSys){
                     	Ext.MessageBox.alert(local.window.tip,local.backup.operateLogTypeChoose+"!");
						return;
                     }
                     
                     //获取描述
					var deviceName = Ext.getCmp('manageLogContent').getValue();
					
					if(deviceName==''){
					    Ext.MessageBox.alert(local.window.tip,local.backup.operateLogContentInput+"!");
						return;
					}
					Ext.getCmp('createManageLogForm').getForm().submit({
										url : '/backup/todeviceAction!saveManagerLog.action',
										success : function(form, action) {
											var obj = action.result; //吧字符串变为json格式
											var code = obj.msgCode;
											var content = obj.msgContent;
											if(MSG_NORMAL==code){
												Ext.websure.MsgTip.msg(local.window.tip, content, true);
												Ext.getCmp("createOperationLog").destroy();
											}else{
												Ext.websure.MsgError(code, content);
											}
											/*Ext.MessageBox.alert(local.window.tip,'应急运维日志添加成功！',function(){
												Ext.getCmp("createOperationLog").destroy();
											});*/
											
										},
										failure : function() {
//											Ext.MessageBox.alert(local.window.tip,local.backup.operateLogAddFailure);
											Ext.websure.MsgError("WF-30016",local.backup.operateLogAddFailure);
											Ext.getCmp("createOperationLog").destroy();
										}
									});
				}
        },{
            text: local.btn.cancle,
			handler : function() {
				Ext.getCmp("createOperationLog").destroy();
			}
        }] ];

		me.callParent(arguments);
	},
	listeners : {
		'afterrender' : function() {
			Ext.getCmp("manageDeviceId").setValue(extraDeviceId);
		}
	}
});
