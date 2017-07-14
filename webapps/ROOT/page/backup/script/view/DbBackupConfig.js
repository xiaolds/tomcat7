db_backup_DeviceId = null;
db_backup_DeviceIP = null;
//任务Id
db_task_id = null;

operaType = 1;//1-新增  2-修改

//存储ID
var STORAGEID_Config_DB=null;
//存储介质
var STORAGESYMBOL_Config_DB=null;
//存储路径
var PATH_Config_DB=null;

/**
 * 存储位置的选择
 */
Ext.define('websure.backup.view.StoragePathTreeConfigDB',{
	extend:'Ext.tree.Panel',
	alias:'widget.storagePathTreeConfigDB',
	id:"storagePathTreeConfigDB",
	useArrows:true,
	cls:"icon_radio",
	rootVisible:false,// 不可见根
	border:true,
	frame:false,
	sortable:false,
	onlyLeafCheckable: true,
	checkModel:"double",
	store:"StorageConfigDBStore",
	setRootNode: function() {
        if (this.getStore().autoLoad) {
            this.callParent(arguments);
        }
    },
	loadMask : {
		msg : local.loading
	},
	listeners:{
		afterrender:function(){
			STORAGESYMBOL_Config_DB = null;
			STORAGEID_Config_DB = null;
			PATH_Config_DB = null;
			this.store.load({
				params : {
						taskId : db_task_id
					},
					callback : function(r, option, success) {
						//获取树的选中项
				        for(var i=0;i<r.length;i++){
				        	var storage = r[i].data.children;
				           if(storage.length>0){
				           		for(var k=0;k<storage.length;k++){
						          	if(storage[k].checked){
						          		STORAGESYMBOL_Config_DB=storage[k].symbol;
										STORAGEID_Config_DB=storage[k].storageId;
										PATH_Config_DB=storage[k].path;
						          	}
						        }
				           }
				        }
             		}
				});
		},
		checkchange:function(node, checked,obj){
			var checkedNodes = this.getChecked();
			for(var i=0;i<checkedNodes.length;i++){
				var n = checkedNodes[i];
				if(node.get("id") != n.get("id")){
						n.set("checked" , false);
				}
			}
			if(this.getChecked().length!=0){
				STORAGESYMBOL_Config_DB=node.get("symbol");
				STORAGEID_Config_DB=node.get("storageId");
				PATH_Config_DB=node.get("path");
			}else{
				STORAGESYMBOL_Config_DB=null;
				STORAGEID_Config_DB=null;
				PATH_Config_DB=null;
			}
		}
	}
});

Ext.define("websure.backup.view.DbBackupConfig", {
	extend : 'Ext.window.Window',
	alias : 'widget.DbBackupConfig',
	title : "创建任务",
	draggable : false,
	height : 600,
	width : 500,
	// closable : false,
	id : 'DbBackupConfig',
	layout : "border", // 窗口布局类型
	modal : true, // 是否模态窗口，默认为false
	resizable : false,
	constructor : function(config) {
		db_backup_DeviceIP = config.parIp;
		db_backup_DeviceId = config.parId;
		db_task_id = config.taskId;
		operaType = config.operaType;
		db_task_id = config.taskId;
		var me = this;
		me.items = [{
			xtype : 'panel',
			region : 'center',
			overflowY:"auto",
			border : false,
			items : [{
				xtype : 'form',
				id : 'addDbBackupForm',
				width : '100%',
				height:"100%",
				overflowY:"auto",
				border : false,
				padding : 10,
				defaults : {
					labelAlign:"left",
					labelWidth : 150,
					msgTarget : 'side',
					width : 450
				},
				items : [{
							xtype : 'textfield',
							fieldLabel : "任务名称",
							id : 'taskName',
							name : 'backupdbTask.taskName',
							maxLength : 100,// 最多字符设置
							maxLengthText : local.backup.maxLengthText100,
							regex : /^[\u4e00-\u9fa5\-a-zA-Z0-9]+$/,
							regexText : local.backup.taskNameTip,
							allowBlank : false,
							enableKeyEvents : true,
							listeners : {
				/*
				 * keyup: function(){
				 * Ext.getCmp('fileSharePath').setValue("/usr/cdap/local/"+Ext.getCmp('taskName').getValue()); }
				 */
				}
						}, {
							xtype : "combo",
							fieldLabel : local.backup.deviceSysType,
							id : 'deviceOs',
							name : 'backupdbTask.deviceOs',
							displayField : 'value',
							valueField : 'text',
							editable : false,
							store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [["aix", 1], ["solaris", 2],
												["Redhat/CentOS", 3]]
									}),
							value : 3
						}, {
							xtype : "combo",
							fieldLabel : local.backup.DBType,
							id : 'dbType',
							name : 'backupdbTask.dbType',
							displayField : 'value',
							valueField : 'text',
							editable : false,
							emptyText :local.backup.choose,
							store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [["Oracle", 1], ["Sybase", 2]]
									}),
							listeners : {
								'change' : function(me, newValue, oldValue) {
									if (1 == newValue) {
										// --------------将oracle数据库的值清空---------------------------------
										Ext.getCmp("sybase_home").setValue("");
										Ext.getCmp("sybase_isql").setValue("");
										Ext.getCmp("sybase_server").setValue("");
										Ext.getCmp("sybase_db_name").setValue("");
										Ext.getCmp("sybase_user").setValue("");
										Ext.getCmp("sybase_password").setValue("");
										Ext.getCmp("sybase_day").setValue("");
										// --------------将oracle数据库的值清空---------------------------------
										Ext.getCmp("oracle_panel").show();
										Ext.getCmp("sybase_panel").hide();
									} else if (2 == newValue) {
										// --------------将oracle数据库的值清空---------------------------------
										Ext.getCmp("oracle_home").setValue("");
										Ext.getCmp("oracle_sid").setValue("");
										Ext.getCmp("oracle_user").setValue("");
										Ext.getCmp("oracle_password").setValue("");
										Ext.getCmp("oracle_day").setValue("");
										// --------------将oracle数据库的值清空---------------------------------
										Ext.getCmp("oracle_panel").hide();
										Ext.getCmp("sybase_panel").show();
									}
								}
							}
						}, {
							xtype : 'panel',
							width : '100%',
							border : false,
							bodyBorder : false,
							hidden : true,
							defaults : {
								labelAlign:"left",
								labelWidth : 150,
								msgTarget : 'side',
								width : 450
							},
							id : 'oracle_panel',
							items : [{
										xtype : 'textfield',
										fieldLabel : local.backup.OracleHomeList,
										id : 'oracle_home',
										name : 'backupdbInfo.oracleHome'
									}, {
										xtype : 'textfield',
										fieldLabel : "Oracle SID",
										id : 'oracle_sid',
										name : 'backupdbInfo.oracleSid'
									}, {
										xtype : 'textfield',
										fieldLabel : local.backup.RMANName,
										id : 'oracle_user',
										name : 'backupdbInfo.oracleUser'
									}, {
										xtype : 'textfield',
										fieldLabel : local.backup.RMANCode,
										id : 'oracle_password',
										name : 'backupdbInfo.oraclePassword'
									}, {
										xtype : 'numberfield',
										fieldLabel : local.backup.backupSaveTime,
										id : 'oracle_day',
										allowDecimals : false, // 不允许输入小数
										nanText : local.backup.tipNumM, // 无效数字提示
										// 是否隐藏上下调节按钮
										hideTrigger : true,
										allowNegative : false, // 不允许输入负数 ,
										name : 'backupdbInfo.recoveryWindow'
									}]
						}, {
							xtype : 'panel',
							width : '100%',
							border : false,
							hidden : true,
							bodyBorder : false,
							id : 'sybase_panel',
							defaults : {
								labelAlign:"left",
								labelWidth : 150,
								msgTarget : 'side',
								width : 450
							},
							items : [{
										xtype : 'textfield',
										fieldLabel : local.backup.DBHomeList,
										id : 'sybase_home',
										name : 'backupdbInfo.sybaseHome'
									}, {
										xtype : 'textfield',
										fieldLabel : local.backup.ISQLSrc,
										id : 'sybase_isql',
										name : 'backupdbInfo.sqlPath'
									}, {
										xtype : 'textfield',
										fieldLabel : local.backup.DBServer,
										id : 'sybase_server',
										name : 'backupdbInfo.dbServer'
									}, {
										xtype : 'textfield',
										fieldLabel : local.backup.DBName,
										id : 'sybase_db_name',
										name : 'backupdbInfo.dbName'
									}, {
										xtype : 'textfield',
										fieldLabel : local.backup.DBUserAccount,
										id : 'sybase_user',
										name : 'backupdbInfo.dbUser'
									}, {
										xtype : 'textfield',
										fieldLabel : local.backup.DBUserCode,
										id : 'sybase_password',
										name : 'backupdbInfo.dbPassword'
									}, {
										xtype : 'numberfield',
										fieldLabel : local.backup.backupSaveTime,
										id : 'sybase_day',
										allowDecimals : false, // 不允许输入小数
										nanText : local.backup.tipNumM, // 无效数字提示
										// 是否隐藏上下调节按钮
										hideTrigger : true,
										allowNegative : false, // 不允许输入负数
										name : 'backupdbInfo.backupKeepDay'
									}]
						}, {
							title : local.backup.storagePath,
							xtype : "fieldset",
							defaultType : "textfield",
							height:200,
							style:"padding-right:0",
							overflowY:'auto',
							items : [{
								xtype:'storagePathTreeConfigDB',
								border:false,
								bodyBorder:false,
								width:'100%'
							}]
						}]
			}],
			listeners : {

		}
		}, {
			xtype : 'panel',
			region : 'south',
			width : '100%',
			border : false,
			style : 'background:#fafbfc;border-top:1px solid #d1dade;padding:20px',
			bodyStyle : 'background:#fafbfc',
			defaults : {
				style : 'margin-left:10px'
			},
			alias : 'widget.configbuttonfirst',
			layout : 'hbox',
			items : [{
						flex : 1,
						border : false
					}, {
						xtype : 'button',
						text : local.btn.save,
						cls : "btn_focus",
						id : 'addSaveButtonScript',
						handler : function() {
							var dbType = Ext.getCmp("dbType").getValue();
							var taskName = Ext.getCmp("taskName").getValue();
							var sharPath = PATH_Config_DB;

							if(1 == operaType){
								if ("" == taskName) {
									Ext.MessageBox.alert(local.window.tip,
											local.backup.inTaskName, function() {
												Ext.getCmp("taskName").focus();
											});
									return;
								}
								
								if(__isTCZF(taskName)){
									Ext.MessageBox.alert(local.window.tip,local.backup.taskNameNoSpecialLetter);
									return;
								}
	
								// 检查任务名是否存在
								Ext.Ajax.request({
									url : '/backup/tobackupdbAction!checkTaskName.action',
									params : {
										taskName : taskName
									},
									success : function(response, options) {
										var obj = Ext.decode(response.responseText);
										if (!obj.info) {
											Ext.MessageBox.alert(local.window.tip,local.backup.taskNameExitPleIn, function() {
													Ext.getCmp("taskName").focus();
											});
											return;
										} else {
											if (null == dbType) {
												Ext.MessageBox.alert(local.window.tip,local.backup.DBTypeChoose);
												return;
											}
	
											if (1 == dbType) {
												var oracle_home = Ext.getCmp("oracle_home").getValue();
												var oracle_sid = Ext.getCmp("oracle_sid").getValue();
												var oracle_user = Ext.getCmp("oracle_user").getValue();
												var oracle_password = Ext.getCmp("oracle_password").getValue();
												var oracle_day = Ext.getCmp("oracle_day").getValue();
	
												if ("" == oracle_home) {
													Ext.MessageBox.alert(local.window.tip,local.backup.OracleHomeListIn,function() {
																Ext.getCmp("oracle_home").focus();
															});
													return;
												}
												
												if(__isTSZF(oracle_home)){
													Ext.MessageBox.alert(local.window.tip,"Oracle Home目录不允许输入特殊字符！&nbsp;&nbsp;&nbsp;",function() {
																Ext.getCmp("oracle_home").focus();
															});
													return;
												}
	
												if ("" == oracle_sid) {
													Ext.MessageBox.alert(local.window.tip,local.backup.OracleSIDIn,
															function() {
																Ext.getCmp("oracle_sid").focus();
															});
													return;
												}
												
												if(__isTSZF(oracle_sid)){
													Ext.MessageBox.alert(local.window.tip,"Oracle SID不允许输入特殊字符！",function() {
																Ext.getCmp("oracle_sid").focus();
															});
													return;
												}
	
												if ("" == oracle_user) {
													Ext.MessageBox.alert(local.window.tip,local.backup.RMANIn,
															function() {
																Ext.getCmp("oracle_user").focus();
															});
													return;
												}
												
												if(__isTCZF(oracle_user)){
													Ext.MessageBox.alert(local.window.tip,"RMAN用户名不允许输入特殊字符！",function() {
																Ext.getCmp("oracle_user").focus();
															});
													return;
												}
	
												if ("" == oracle_password) {
													Ext.MessageBox.alert(local.window.tip,local.backup.RMANCodeIn,
															function() {
																Ext.getCmp("oracle_password").focus();
															});
													return;
												}
												
												if(__isTCZF(oracle_password)){
													Ext.MessageBox.alert(local.window.tip,"RMAN密码不允许输入特殊字符！",function() {
																Ext.getCmp("oracle_password").focus();
															});
													return;
												}
	
												if (null == oracle_day) {
													Ext.MessageBox.alert(local.window.tip,local.backup.backupSaveTimeIn,
															function() {
																Ext.getCmp("oracle_day").focus();
															});
													return;
												}
												
												if (1 > oracle_day) {
													Ext.MessageBox.alert(local.window.tip,"备份保留天数至少为1天",
															function() {
																Ext.getCmp("oracle_day").focus();
															});
													return;
												}
	
											} else if (2 == dbType) {
												var sybase_home = Ext.getCmp("sybase_home").getValue();
												var sybase_isql = Ext.getCmp("sybase_isql").getValue();
												var sybase_server = Ext.getCmp("sybase_server").getValue();
												var sybase_db_name = Ext.getCmp("sybase_db_name").getValue();
												var sybase_user = Ext.getCmp("sybase_user").getValue();
												var sybase_password = Ext.getCmp("sybase_password").getValue();
												var sybase_day = Ext.getCmp("sybase_day").getValue();
	
												if ("" == sybase_home) {
													Ext.MessageBox.alert(local.window.tip,local.backup.DBInstallPathIn,function() {
																Ext.getCmp("sybase_home").focus();
															});
													return;
												}
												
												if(__isTSZF(sybase_home)){
													Ext.MessageBox.alert(local.window.tip,"数据库安装目录不允许输入特殊字符！",function() {
																Ext.getCmp("sybase_home").focus();
															});
													return;
												}
	
												if ("" == sybase_isql) {
													Ext.MessageBox.alert(local.window.tip,local.backup.ISQLPathIn,
															function() {
																Ext.getCmp("sybase_isql").focus();
															});
													return;
												}
												
												if(__isTSZF(sybase_isql)){
													Ext.MessageBox.alert(local.window.tip,"ISQL执行程序路径不允许输入特殊字符！",function() {
																Ext.getCmp("sybase_isql").focus();
															});
													return;
												}
	
												if ("" == sybase_server) {
													Ext.MessageBox.alert(local.window.tip,local.backup.DBServerIn, function() {
																Ext.getCmp("sybase_server").focus();
															});
													return;
												}
												
												if(__isTCZF(sybase_server)){
													Ext.MessageBox.alert(local.window.tip,"服务名不允许输入特殊字符！",function() {
																Ext.getCmp("sybase_server").focus();
															});
													return;
												}
	
												if ("" == sybase_db_name) {
													Ext.MessageBox.alert(local.window.tip,local.backup.DBServerIn, function() {
																Ext.getCmp("sybase_db_name").focus();
															});
													return;
												}
												
												if(__isTCZF(sybase_db_name)){
													Ext.MessageBox.alert(local.window.tip,"数据库名不允许输入特殊字符！",function() {
																Ext.getCmp("sybase_db_name").focus();
															});
													return;
												}
	
												if ("" == sybase_user) {
													Ext.MessageBox.alert(local.window.tip,local.backup.DBUserAccountIn, function() {
																Ext.getCmp("sybase_user").focus();
															});
													return;
												}
												
												if(__isTCZF(sybase_user)){
													Ext.MessageBox.alert(local.window.tip,"用户账户不允许输入特殊字符！",function() {
																Ext.getCmp("sybase_user").focus();
															});
													return;
												}
	
												if ("" == sybase_password) {
													Ext.MessageBox.alert(local.window.tip,local.backup.DBUserCodeIn, function() {
																Ext.getCmp("sybase_password").focus();
															});
													return;
												}
												
												if(__isTCZF(sybase_password)){
													Ext.MessageBox.alert(local.window.tip,"用户密码不允许输入特殊字符！",function() {
																Ext.getCmp("sybase_password").focus();
															});
													return;
												}
												
												if (null == sybase_day) {
													Ext.MessageBox.alert(local.window.tip,local.backup.backupSaveTimeIn,
															function() {
																Ext.getCmp("sybase_day").focus();
															});
													return;
												}
												
												if (1 > sybase_day) {
													Ext.MessageBox.alert(local.window.tip,"备份保留天数至少为1天",
															function() {
																Ext.getCmp("sybase_day").focus();
															});
													return;
												}
											}
											
											if(null == sharPath){
												Ext.MessageBox.alert(local.window.tip,local.backup.chooseStorageSrc);
													return;
											}
											var loadMarsk_config = new Ext.LoadMask(Ext.getCmp("DbBackupConfig"), {
															msg : local.backup.configSavingMsg,
															removeMask : true// 完成后移除
															});
											loadMarsk_config.show(); //显示
											var load_config =new Ext.util.DelayedTask(function(){  
											               loadMarsk_config.hide()
											            });  
											//将前台用户输入的信息传到后台
											Ext.getCmp('addDbBackupForm').getForm().submit({
												url : '/backup/tobackupdbAction!saveTaskinfo.action',
												params : {
													deviceIp : db_backup_DeviceIP,
													deviceId : db_backup_DeviceId,
													sharPath:sharPath,
													operaType:operaType//1:新增  2：修改
												},
												success : function(form, action) {
					    							var obj = action.result;
	
													console.log(obj);
													var code = obj.msgCode;
													var content = obj.msgContent;
													if(MSG_NORMAL==code){
														Ext.websure.MsgTip.msg(local.window.tip, content, true);
															Ext.getCmp('DbBackupConfig').destroy();
															Ext.getCmp("taskInfoList").store.reload();
															Ext.getCmp("bacLog").store.reload();
														
													}else{
														Ext.websure.MsgError(code, content);
													}
												},
												failure : function() {
													Ext.websure.MsgError("WF-30017",local.backup.taskCreatFailure);
													  loadMarsk_config.hide()
												}
											});
	
										} 
									},
									failure : function() {
										Ext.websure.MsgError("WF-30018", local.backup.taskNameTestFailure);
										  loadMarsk_config.hide()
									}
								});
							}else{//update
							
								if (null == dbType) {
									Ext.MessageBox.alert(local.window.tip,local.backup.DBTypeChoose);
									return;
								}

								if (1 == dbType) {
									var oracle_home = Ext.getCmp("oracle_home").getValue();
									var oracle_sid = Ext.getCmp("oracle_sid").getValue();
									var oracle_user = Ext.getCmp("oracle_user").getValue();
									var oracle_password = Ext.getCmp("oracle_password").getValue();
									var oracle_day = Ext.getCmp("oracle_day").getValue();

									if ("" == oracle_home) {
										Ext.MessageBox.alert(local.window.tip,local.backup.OracleHomeListIn,function() {
													Ext.getCmp("oracle_home").focus();
												});
										return;
									}

									if ("" == oracle_sid) {
										Ext.MessageBox.alert(local.window.tip,local.backup.OracleSIDIn,
												function() {
													Ext.getCmp("oracle_sid").focus();
												});
										return;
									}

									if ("" == oracle_user) {
										Ext.MessageBox.alert(local.window.tip,local.backup.RMANIn,
												function() {
													Ext.getCmp("oracle_user").focus();
												});
										return;
									}

									if ("" == oracle_password) {
										Ext.MessageBox.alert(local.window.tip,local.backup.RMANCodeIn,
												function() {
													Ext.getCmp("oracle_password").focus();
												});
										return;
									}

									if (null == oracle_day) {
										Ext.MessageBox.alert(local.window.tip,local.backup.backupSaveTimeIn,
												function() {
													Ext.getCmp("oracle_day").focus();
												});
										return;
									}
									if (1 > oracle_day) {
										Ext.MessageBox.alert(local.window.tip,"备份保留天数至少为1天",
												function() {
													Ext.getCmp("oracle_day").focus();
												});
										return;
									}

								} else if (2 == dbType) {
									var sybase_home = Ext.getCmp("sybase_home").getValue();
									var sybase_isql = Ext.getCmp("sybase_isql").getValue();
									var sybase_server = Ext.getCmp("sybase_server").getValue();
									var sybase_db_name = Ext.getCmp("sybase_db_name").getValue();
									var sybase_user = Ext.getCmp("sybase_user").getValue();
									var sybase_password = Ext.getCmp("sybase_password").getValue();
									var sybase_day = Ext.getCmp("sybase_day").getValue();

									if ("" == sybase_home) {
										Ext.MessageBox.alert(local.window.tip,local.backup.DBInstallPathIn,function() {
													Ext.getCmp("sybase_home").focus();
												});
										return;
									}

									if ("" == sybase_isql) {
										Ext.MessageBox.alert(local.window.tip,local.backup.ISQLPathIn,
												function() {
													Ext.getCmp("sybase_isql").focus();
												});
										return;
									}

									if ("" == sybase_server) {
										Ext.MessageBox.alert(local.window.tip,local.backup.DBServerIn, function() {
													Ext.getCmp("sybase_server").focus();
												});
										return;
									}

									if ("" == sybase_db_name) {
										Ext.MessageBox.alert(local.window.tip,local.backup.DBNameIn, function() {
													Ext.getCmp("sybase_db_name").focus();
												});
										return;
									}

									if ("" == sybase_user) {
										Ext.MessageBox.alert(local.window.tip,local.backup.DBUserAccountIn, function() {
													Ext.getCmp("sybase_user").focus();
												});
										return;
									}

									if ("" == sybase_password) {
										Ext.MessageBox.alert(local.window.tip,local.backup.DBUserCodeIn, function() {
													Ext.getCmp("sybase_password").focus();
												});
										return;
									}
									if (null == sybase_day) {
										Ext.MessageBox.alert(local.window.tip,local.backup.backupSaveTimeIn,
												function() {
													Ext.getCmp("sybase_day").focus();
												});
										return;
									}
									if (1 > sybase_day) {
										Ext.MessageBox.alert(local.window.tip,"备份保留天数至少为1天",
												function() {
													Ext.getCmp("sybase_day").focus();
												});
										return;
									}
								}
								
								if(null == sharPath){
									Ext.MessageBox.alert(local.window.tip,local.backup.chooseStorageSrc);
										return;
								}
								var loadMarsk_config = new Ext.LoadMask(Ext.getCmp("DbBackupConfig"), {
												msg : local.backup.configSavingMsg,
												removeMask : true// 完成后移除
												});
								loadMarsk_config.show(); //显示
								var load_config =new Ext.util.DelayedTask(function(){  
								               loadMarsk_config.hide()
								            });  
								//将前台用户输入的信息传到后台
								Ext.getCmp('addDbBackupForm').getForm().submit({
									url : '/backup/tobackupdbAction!saveTaskinfo.action',
									params : {
										deviceIp : db_backup_DeviceIP,
										deviceId : db_backup_DeviceId,
										sharPath:sharPath,
										operaType:operaType,//1:新增  2：修改
										taskId : db_task_id
									},
									success : function(form, action) {
		    							var obj = action.result;

										console.log(obj);
										var code = obj.msgCode;
										var content = obj.msgContent;
										if(MSG_NORMAL==code){
											Ext.websure.MsgTip.msg(local.window.tip, content, true);
												Ext.getCmp('DbBackupConfig').destroy();
												Ext.getCmp("taskInfoList").store.reload();
												Ext.getCmp("bacLog").store.reload();
											
										}else{
											Ext.websure.MsgError(code, content);
										}
									},
									failure : function() {
										Ext.websure.MsgError("WF-30017",local.backup.taskCreatFailure);
										  loadMarsk_config.hide()
									}
								});
							}
						}
					}, {
						xtype : 'button',
						text : local.btn.cancle,
						id : 'addCancelButton',
						handler : function() {
							Ext.getCmp('DbBackupConfig').destroy();
						}
					}]
		}]

		me.callParent(arguments);
	},
	listeners:{
		afterrender : function(){
			//填充数据
			if(2 == operaType){
				//查询任务信息
				//填充数据
				Ext.Ajax.request({
					url : '/backup/tobackupdbAction!getBackupDBTaskInfoById.action',
					params : {
						taskId : db_task_id
					},
					success : function(response, options) {
						var obj = Ext.decode(response.responseText);
						console.log(obj.info);
						if(null != obj.info){
							Ext.getCmp("taskName").setValue(obj.info.taskName);
							Ext.getCmp("taskName").setDisabled(true);
							Ext.getCmp("deviceOs").setValue(obj.info.deviceOs);
							Ext.getCmp("dbType").setValue(obj.info.dbType);
							if(1 == obj.info.dbType){//oracle
								Ext.getCmp("sybase_home").setValue("");
								Ext.getCmp("sybase_isql").setValue("");
								Ext.getCmp("sybase_server").setValue("");
								Ext.getCmp("sybase_db_name").setValue("");
								Ext.getCmp("sybase_user").setValue("");
								Ext.getCmp("sybase_password").setValue("");
								Ext.getCmp("sybase_day").setValue("");
								// --------------将sybase数据库的值清空---------------------------------
								Ext.getCmp("oracle_panel").show();
								Ext.getCmp("sybase_panel").hide();
								
								Ext.getCmp("oracle_home").setValue(obj.info.backupdbInfos[0].oracleHome);
								Ext.getCmp("oracle_sid").setValue(obj.info.backupdbInfos[0].oracleSid);
								Ext.getCmp("oracle_user").setValue(obj.info.backupdbInfos[0].oracleUser);
								Ext.getCmp("oracle_password").setValue(obj.info.backupdbInfos[0].oraclePassword);
								Ext.getCmp("oracle_day").setValue(obj.info.backupdbInfos[0].recoveryWindow);
							}else{//sybase
								
								Ext.getCmp("oracle_home").setValue("");
								Ext.getCmp("oracle_sid").setValue("");
								Ext.getCmp("oracle_user").setValue("");
								Ext.getCmp("oracle_password").setValue("");
								Ext.getCmp("oracle_day").setValue("");
								
								// --------------将oracle数据库的值清空---------------------------------
								Ext.getCmp("oracle_panel").hide();
								Ext.getCmp("sybase_panel").show();
								
								Ext.getCmp("sybase_home").setValue(obj.info.backupdbInfos[0].sybaseHome);
								Ext.getCmp("sybase_isql").setValue(obj.info.backupdbInfos[0].sqlPath);
								Ext.getCmp("sybase_server").setValue(obj.info.backupdbInfos[0].dbServer);
								Ext.getCmp("sybase_db_name").setValue(obj.info.backupdbInfos[0].dbName);
								Ext.getCmp("sybase_user").setValue(obj.info.backupdbInfos[0].dbUser);
								Ext.getCmp("sybase_password").setValue(obj.info.backupdbInfos[0].dbPassword);
								Ext.getCmp("sybase_day").setValue(obj.info.backupdbInfos[0].backupKeepDay);
								
							}
						}
					},
					failure : function() {
//							Ext.MessageBox.alert(local.window.tip,local.backup.addExtraDeviceMatchFailure);
						Ext.websure.MsgError("WF-30015",local.backup.matchTaskInfoFailure);
					}
				});
				
			}
		}
	}
});

function __isTCZF(s) {
	var re =/[`~=!@#$%^&*+<>{}\'"“‘[\]]/im;
	return re.test(s);
}

