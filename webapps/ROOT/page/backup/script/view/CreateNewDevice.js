extraDeviceId = null;
extraDeviceType = null;
licenseNum = null;
operaType=0;//0-新增  1-更新

var states = Ext.create('Ext.data.Store', {
    fields: ['abbr', 'name'],
    data : [
//        {"id":0, "name":"Window"},
        {"id":1, "name":"Linux"},
        {"id":2, "name":"Unix"}
    ]
});

Ext.define("websure.backup.view.ClientType",{
	 	extend:'Ext.form.ComboBox',
	 	alias : 'widget.ClientType',
	 	id:'clientType',
	 	name : "device.clientSystype",
        fieldLabel : local.sysType,  
        emptyText:local.backup.chooseSys,
        editable:false,
        labelWidth: 120,
        store: states,
	    queryMode: 'local',
	   	displayField:'name',    
        valueField :'id',    
        typeAhead:false 
    });  

Ext.define("websure.backup.view.CreateNewDeviceForm",{
			 	  extend:'Ext.form.FormPanel',
			 	  alias : 'widget.CreateNewDeviceForm',
			 	  id:'createNewDeviceForm',
			 	  border: false,
				  margin:'10 10 20 10',
				  layout:"vbox",
				  defaults:{	width:"100%",labelAlign: "left",labelWidth:120},
				  items: [{
				  	xtype:'ClientType'
				  	},{
		            xtype: "textfield",
		            fieldLabel: local.pcName,
		            emptyText:local.backup.extraDeviceName,
		            id: "externalDeviceName",
		            name:'device.computerName',
		            //labelSepartor: "：",
		            labelWidth: 120
		        },{
		            xtype: "textfield",
		            fieldLabel: local.pcID,
		            hidden:true,
		            id: "externalDeviceId",
		            name:'device.deviceId',
		            //labelSepartor: "：",
		            value:"",
		            labelWidth: 120
		        },{
		            xtype: "textfield",
		            fieldLabel: local.IP,
		            emptyText:local.backup.inIP,
		            id: "externalDeviceIp",
		            name:'device.ip',
		            //labelSepartor: "：",
		            afterSubTpl :"<font color='red'>*"+local.backup.saveNoModify+"</font>",
		            labelWidth: 120
		        },{
		            xtype: "textfield",
		            fieldLabel: local.config.describe,
		            id: "externalDeviceDes",
		            name:'device.description',
		            //labelSepartor: "：",
		            labelWidth: 120
		        },{
				  	xtype:"panel",
				  	margin:"10 0 0 0",
				  	height:30,
				  	border:false,
				  	id:"licenseNum",
				  	html:""
				  },{
				  	xtype:"label",
				  	//height:36,
				  	text:local.backup.winAttachedTaskChoose
				  },{
			          xtype: 'checkboxgroup',
			          margin:"10 0 0 0",
			          id:"taskType",
			          columns : 2,
			          items:[
			          	 /*{boxLabel:'磁盘备份',name:'rb', inputValue: '1',checked:true,disabled:true},    
			             {boxLabel:'预警',name:'rb', inputValue: '2',checked:true,disabled:true },*/
			             {boxLabel:local.backup.tabTitleDB,id:'taskType3',name:'rb', inputValue: '3' }/*,    
			             {boxLabel:local.backup.gridDateCopy,id:'taskType4',name:'rb', inputValue: '4' }*/
			           ]    
			        }
				  ]
			 });

/*
 * 修改设备描述窗口
 */
Ext.define("websure.backup.view.CreateNewDevice", {
	extend : 'Ext.window.Window',
	title : local.backup.winAddExtraDevice, 		//标题
	draggable : true, 
	//height : 380, 
	width : 450, 
	border:false,
	alias : 'widget.CreateNewDevice',
	id : 'createNewDevice',
	layout : "fit", 		//窗口布局类型
	modal : true,		 //是否模态窗口，默认为false
	resizable : false,
	constructor : function(config) {
		//填充外部设备Id
		extraDeviceId = config.deviceId;
		extraDeviceType = config.type;
		operaType = config.operaType;
		var me = this;
		me.items = [{
			xtype : 'CreateNewDeviceForm',
			listeners:{
				"afterrender":function(){
					
				}
			}
		}, 
		me.buttons = [{
            text: local.btn.save,
            cls:"btn_focus",
			handler : function() {
				//获取
			 		var xqCheck = Ext.getCmp('taskType').items;
                    var tm = [];
                    var cou=0;
                    Ext.Array.each(xqCheck.items, function(item){
                         if(item.checked){
                         		cou++;
                             tm.push(item.inputValue);
                         }
                     });
                     
                     //操作系统
                     var clientSys = Ext.getCmp('clientType').getValue();
                     if(null == clientSys){
                     	Ext.MessageBox.alert(local.window.tip,local.backup.chooseDevSys);
						return;
                     }
                     
                     //获取设备名称
					var deviceName = Ext.getCmp('externalDeviceName').getValue();
					
					if(deviceName.trim()==''){
					    Ext.MessageBox.alert(local.window.tip,local.backup.extraDeviceName);
						return;
					}
					
					if(__isTCZF_DES(deviceName)){
						Ext.MessageBox.alert(local.window.tip,local.backup.deviceNameNoSpecialLetter);
						return;
					}
					
					//获取设备IP
					var externalDeviceIp = Ext.getCmp('externalDeviceIp').getValue();
					
					if(externalDeviceIp =='') {
						Ext.MessageBox.alert(local.window.tip,local.backup.inDeviceIP);
						return false;
					}else if(!isIP(externalDeviceIp)){
						Ext.MessageBox.alert(local.window.tip,local.backup.inDeviceIPFormat);
						return false;
					}else{
						//判断ip是否存在
						if(0 == operaType){//add
							Ext.Ajax.request({
								url : '/backup/todeviceAction!checkDeviceIp.action',
								params : {
									deviceIp : externalDeviceIp
								},
								success : function(response, options) {
									var obj = Ext.decode(response.responseText);
									if (!obj.info) {
										Ext.MessageBox.alert(local.window.tip,local.backup.IPExited, function() {
												Ext.getCmp("externalDeviceIp").focus();
										});
										return;
									}else{
									//获取设备描述
										var externalDeviceDesc = Ext.getCmp('externalDeviceDes').getValue();
										if(externalDeviceDesc!='' && __isTCZF_DES(externalDeviceDesc)){
											Ext.MessageBox.alert(local.window.tip,local.backup.deviceNameNoSpecialLetter);
											return;
										}
										
										if(tm.length<=0){
											Ext.MessageBox.alert(local.window.tip,local.backup.winAttachedTaskChoose);
											return;
										}
										
										if(0 == operaType){//新增
											//判断数据库授权点数是否超过限制
											if(-1 != licenseNum){
												if(licenseNum == 0){
													Ext.MessageBox.alert(local.window.tip,local.backup.DBBackupNoAuthPleBug);
													return;
												}
											}
										}
										Ext.getCmp('createNewDeviceForm').getForm().submit({
												url : '/backup/todeviceAction!saveExtraDeviceInfo.action',
												params: {
											    	taskMode:tm
											    },
												success : function(form, action) {
													var obj = action.result; //吧字符串变为json格式
													var code = obj.msgCode;
													var content = obj.msgContent;
													if(MSG_NORMAL==code){
														Ext.websure.MsgTip.msg(local.window.tip, content, true);
														Ext.getCmp("createNewDevice").destroy();
														if(null != Ext.getCmp("createGroup")){
															Ext.getCmp("createGroup").destroy();
														}
														Ext.getCmp("grobleTreePanel").getStore().load();
													}else{
														Ext.websure.MsgError(code, content);
													}
													
												},
												failure : function() {
													Ext.websure.MsgError("WF-30014",local.backup.addExtraDeviceFailure);
													Ext.getCmp("createNewDevice").destroy();
												}
											});
										}
									}
								});
						}else{//update
							//获取设备描述
							var externalDeviceDesc = Ext.getCmp('externalDeviceDes').getValue();
							if(externalDeviceDesc!='' && __isTCZF_DES(externalDeviceDesc)){
								Ext.MessageBox.alert(local.window.tip,local.backup.deviceNameNoSpecialLetter);
								return;
							}
							
							if(tm.length<=0){
								Ext.MessageBox.alert(local.window.tip,local.backup.winAttachedTaskChoose);
								return;
							}
							Ext.getCmp('createNewDeviceForm').getForm().submit({
									url : '/backup/todeviceAction!saveExtraDeviceInfo.action',
									params: {
								    	taskMode:tm
								    },
									success : function(form, action) {
										var obj = action.result; //吧字符串变为json格式
										var code = obj.msgCode;
										var content = obj.msgContent;
										if(MSG_NORMAL==code){
											Ext.websure.MsgTip.msg(local.window.tip, content, true);
											Ext.getCmp("createNewDevice").destroy();
											if(null != Ext.getCmp("createGroup")){
												Ext.getCmp("createGroup").destroy();
											}
											Ext.getCmp("grobleTreePanel").getStore().load();
										}else{
											Ext.websure.MsgError(code, content);
										}
										
									},
									failure : function() {
										Ext.websure.MsgError("WF-30014",local.backup.addExtraDeviceFailure);
										Ext.getCmp("createNewDevice").destroy();
									}
								});
						}
					}
				}
        },{
            text: local.btn.cancle,
			handler : function() {
				Ext.getCmp("createNewDevice").destroy();
			}
        }] ];

		me.callParent(arguments);
	},
	listeners : {
		'afterrender' : function() {
				if(null != extraDeviceId ){
					Ext.getCmp("externalDeviceId").setValue(extraDeviceId);
					
					//获取备份模块的授权点数
					Ext.Ajax.request({
						url : '/backup/tobackupdbAction!getLicenseNumForDB.action',
						success : function(response, options) {
							var obj = Ext.decode(response.responseText);
							
							if(null != obj.info){
								var result = "";
								licenseNum = obj.info;
								if(-1 == obj.info){
									result =local.backup.unlimit;
								}else{
									result = obj.info+local.backup.title2;
								}
								Ext.get("licenseNum").update("<font color='red'>"+local.backup.DBBackupResultAuthNum+result+"</font>");
							}
						},
						failure : function() {
							Ext.websure.MsgError("WF-30015",local.backup.getDBBackupResultAuthNumFailure);
							Ext.getCmp("createGroup").destroy();
						}
					});
					
					//填充数据
					Ext.Ajax.request({
						url : '/backup/todeviceAction!getextraDeviceInfo.action',
						params : {
							deviceId : extraDeviceId
						},
						success : function(response, options) {
							var obj = Ext.decode(response.responseText);
							
							if(null != obj.info){
								Ext.getCmp("externalDeviceName").setValue(obj.info.computerName);
								Ext.getCmp("externalDeviceIp").setValue(obj.info.ip);
								Ext.getCmp("externalDeviceIp").setDisabled(true);
								Ext.getCmp("externalDeviceDes").setValue(obj.info.description);
								var deviceMode = obj.info.deviceMode;
								
								var s = deviceMode.split("");
								if(s.length>0){
									for(var i=0;i<s.length;i++){
										if(3 == s[i]){
											Ext.getCmp("taskType3").setValue(true);
											Ext.getCmp("taskType3").setDisabled(true);
										}else if(4 == s[i]){
											Ext.getCmp("taskType4").setValue(true);
										}
									}
								}
								//系统类型
								var a = obj.info.clientSystype;
								Ext.getCmp("clientType").setValue(a);
							}
						},
						failure : function() {
//							Ext.MessageBox.alert(local.window.tip,local.backup.addExtraDeviceMatchFailure);
							Ext.websure.MsgError("WF-30015",local.backup.addExtraDeviceMatchFailure);
						}
					});
				}
		}
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

function isIP(ip)  
{  
    var reSpaceCheck = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/;  
    if (reSpaceCheck.test(ip))  
    {  
        ip.match(reSpaceCheck);  
        if (RegExp.$1<=255&&RegExp.$1>=0  
          &&RegExp.$2<=255&&RegExp.$2>=0  
          &&RegExp.$3<=255&&RegExp.$3>=0  
          &&RegExp.$4<=255&&RegExp.$4>=0)  
        {  
            return true;   
        }else  
        {  
            return false;  
        }  
    }else  
    {  
        return false;  
    }  
} 
