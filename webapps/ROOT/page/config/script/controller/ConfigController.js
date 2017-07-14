/**
 * 设置界面的控制器,包括存储节点、计算节点、系统、输出、账户、角色、许可证授权 --徐英安
 */
var SYSTEM_CONFIG_INFO = {};
var BIND_MACHINE = {};
var POWER = [];

Ext.define(				
		'acesure.config.controller.ConfigController',
		{			
			extend : 'Ext.app.Controller',
			alias : "widget.configController",
			views : [ 'account.AccountConfigPanel',
			          'account.AccountGridPanel', 
			          'role.RoleGridPanel',
			          'role.RoleConfigPanel', 
			          'output.OutputConfigPanel',
			          'output.OutputModuleGridPanel',
			          //'license.LicenseGridPanel',			          
			          'license.LicenseTreePanel',			          
			          'license.LicenseConfigPanel',
			          'system.SystemConfigPanel',
			          'common.ConfigTreePanel', 
			          'StorageConfig',
			          "CalNodeConfig",
			          'SynchStoragePath',
                	  'IpAddressCmp',
                	  'client.ProductAboutPanel'],
			models : [ 'AccountGridModel',
			           'AccountLoginTypeModel',
			           'AccountRoleModel', 
			           'RoleGridModel',
			           'UserNotifyModuleModel',
			           /*'COMModel',*/
			           //'LicenseProductModel',			           
			           'LicenseTreeModel',			           
			           'StoragesModel',
			           'StorageAndPathTreeModel',
			           'SynchStoragePathModel',
			           'StoragePathTreeModel',
			           'acesure.config.model.CalNodeModel' ],
			stores : [ 'ConfigTreeStore', 
			           'AccountLoginTypeStore',
			           'AccountGridStore',
			           'AccountRoleStore',
			           'AccountAllRoleStore', 
			           'RoleGridStore',
			           'UserNotifyModuleGridStore',
			           /*'COMStore',*/
			           //'LicenseProductStore',			           
			           'LicenseTreeStore',			           
			           'StoragesStore',
			           'StorageAndPathTreeStore',			           
			           'CalNodeStore',			           
			           'StorageIPListStore',
			           'SynchStoragePathStore',
			           'SourceStoragePathTreeStore',
			           'TargetStoragePathTreeStore'],
			refs : [ {
				ref : 'outputList',
				selector : 'outputModuleGridPanel'
			}, {
				ref : 'roleList',
				selector : 'roleGridPanel'
			}, {
				ref : 'licenseList',
				selector : 'licenseTreePanel'
			}, {
				ref : 'accountList',
				selector : 'accountGridPanel'
			} ],
			init : function() {
				this.control({					
					'configTreePanel' : {
						load : this.initConfigTreePanel,
						itemclick : this.loadConfigPanel
					},
					/*'accountCreateWin' : {
						render : this.getAllMachineList
					},*/
					'accountCreateWin button[id=accountCreateSave]' : {
						click : this.saveAccountAndBindMachine
					},
					/*'accountModifyWin' : {
						render : this.getBindMachineList
					},*/
					'accountBindMachineWin' : {
						render : this.getOwnBindMachineList
					},
					'accountBindMachineWin button[id=accountBindMachineSave]' : {
						click : this.saveAccountBindMachine
					},
					'accountGridPanel' : {
						itemcontextmenu : this.accountRightMenu,
						select : this.accountSelectRow
					},
					'accountModifyWin button[id=accountModifySave]' : {
						click : this.saveAccountModifyInfo
					},
					'outputConfigPanel' : {
						render : this.initOutputConfigPage
					},
					'systemConfigPanel' : {
						render : this.initSystemServerConfigPage
					},
					'licenseConfigPanel' : {
						render : this.initLicenseConfigPage
					},
					'licenseConfigPanel button[id=productActiveOnBtn]' : {
						click : this.openActiveOnlineWindow
					},
					'licenseConfigPanel button[id=productActiveOffBtn]' : {
						click : this.openActiveOfflineWindow
					},
					/*'licenseConfigPanel button[id=productRegBtn]' : {
						click : this.openRegisterProductWindow
					},
					'licenseConfigPanel button[id=productActiveBtn]' : {
						click : this.openActiveProductWindow
					},*/
					/*'licenseGridPanel' : {
						itemclick : this.showLicenseDetailedInfo
					},*/
					
					'licenseTreePanel' : {
						itemclick : this.showLicenseDetailedInfo
					},
					
					'licenseActiveOnWin button[id=activeOnBtn]' : {
						click : this.activeProductOnline
					},
					'licenseActiveOffWin button[id=downloadBtn]' : {
						click : this.downloadProduct
					},
					'licenseActiveOffWin button[id=activeOffBtn]' : {
						click : this.activeProductOffline
					},
					/*'licenseRegWin button[id=activeBtn]' : {
						click : this.activeProduct
					},
					'licenseRegWin button[id=downloadBtn]' : {
						click : this.downloadProduct
					},
					'licenseActiveWin button[id=uploadActiveBtn]' : {
						click : this.uploadActiveProduct
					},	*/
					'roleConfigPanel button[id=sysconfig_role_add]' : {
						click : this.loadRoleCreateRoleWindow
					},
					'roleGridPanel' : {
						itemcontextmenu : this.roleRightMenu
					},
					'roleCreateRoleWin button[id=roleCreateRoleSave]' : {
						click : this.saveRoleCreateRole
					},
					'roleAuthWin' : {
						render : this.initRolePowerWindow
					},
					'roleAuthWin button[id=roleSaveAuthWin]' : {
						click : this.saveRoleAuthority
					},
					'roleModifyWin button[id=roleModifySave]' : {
						click : this.saveRoleModifyInfo
					},
					'accountConfigPanel button[id=systemconfig_account_add]' : {
						click : this.loadAccountCreateWindow
					},
					'accountConfigPanel button[id=systemconfig_account_bindmachine]' : {
						click : this.loadAccountBindMachineWindow
					},			
					'accountConfigPanel button[id=systemconfig_account_search]' : {
						click : this.loadAccountSearchWindow
					},				
					'accountSearchWin button[id=accountSearchBtn]' : {
						click : this.searchAccountInfo
					},
					'notifyTimeConfigWin button[id=notifyTimeConfigSaveBtn]' : {
						click : this.saveOutputNotifyTimeConfigInfo
					},
					'notifyMailConfigWin button[id=notifyMailConfigTestBtn]' : {
						click : this.testOutputNotifyMailConfigInfo
					},
					'notifyMailConfigWin button[id=notifyMailConfigSaveBtn]' : {
						click : this.saveOutputNotifyMailConfigInfo
					},					
					'notifySMSConfigWin button[id=notifySMSConfigTestBtn]' : {
						click : this.testOutputNotifySMSConfigInfo
					},
					/*'notifySMSConfigWin button[id=notifySMSConfigSaveBtn]' : {
						click : this.saveOutputNotifySMSConfigInfo
					},*/
					'logConfigWin' : {
						afterrender : this.initLogConfigWindow
					},
					'logConfigWin button[id=autoCleanLogConfigSaveBtn]' : {
						click : this.saveAutoCleanLogConfigInfo
					},
					'safetyConfigWin' : {
						afterrender : this.initSystemSafetyConfigWindow
					},
					'safetyConfigWin button[id=serverSafetyConfigSaveBtn]' : {
						click : this.saveSystemSafetyConfigInfo
					},
					'dbExportFileWin' : {
						afterrender : this.backupSystemMysqlFile
					},
					'dbExportFileWin button[id=dbExportFileBtn]' : {
						click : this.downloadSystemMysqlFile
					},
					'dbImportFileWin button[id=dbImportFileBtn]' : {
						click : this.uploadSystemMysqlFile
					},
					'databaseConfigWin' : {
						afterrender : this.initDatabaseBackupWindow
					},		
					'databaseConfigWin button[id=dbAutoBackupBtn]' : {
						click : this.configDBAutoExport
					},	
					'vmsSpaceThreshold button[id=thresholdSaveBtn]' : {
                        click : this.saveVmsWarnThreshold
                    },
                    'vmsSpaceThreshold' : {
                        afterrender : this.initVmsWarnThreshold
                    },
					'storageConfigBar button[id=systemconfig_stonode_config]' : {
						click : this.configStorage
					},
					'storageConfigBar button[id=systemconfig_stonode_add]' : {
						click : this.addStoragePath
					},
					'storagePathAddWin' : {
						afterrender : this.initStoragePath
					},
					'storagePathAddWin button[id=addStoragePathBtn]' : {
						click : this.saveStoragePath
					},
					'storageCfgWin button[id=saveStorageCfg]' : {
						click : this.saveStorageCfg
					},
					'synchStPathInfoBar button[id=addSynchStPath]' : {
                        click : this.addSynchStPath
                    }
				});
			},
			initConfigTreePanel : function(node, callback, scope) {
				var lcsParam = getUrlParameters().lcs;
				if (typeof(lcsParam) != 'undefined' && lcsParam == 'selected') {
					var allPanel = Ext.getCmp('allPanel');
					delay(0, function(){
						allPanel.removeAll();
						switchMenu(allPanel, 'licenseConfigPanel', 6);	
					});					
				} else {
					var tree = Ext.getCmp('configTree');
					var record = tree.getStore().getNodeById('tree_savenode');
					tree.getSelectionModel().select(record);
				}					
				SYSTEM_CONFIG_INFO = getSystemServerConfigInfo();							
			},
			// 为设置页面左侧树添加点击事件 TODO
			loadConfigPanel : function(view, record, item, index, e, obj) {
				var allPanel = Ext.getCmp('allPanel');
				allPanel.removeAll();
				if (record.data.id == 'tree_output') {
					switchMenu(allPanel, 'outputConfigPanel', index);
					this.getOutputList().getStore().load();
				} else if (record.data.id == 'tree_systerm') {
					switchMenu(allPanel, 'systemConfigPanel', index);
				} else if (record.data.id == 'tree_calnode') {
					switchMenu(allPanel, 'CalNodeConfig', index);
				} else if (record.data.id == 'tree_savenode') {
					switchMenu(allPanel, 'storageConfig', index);
				} else if (record.data.id == 'tree_license') {
					switchMenu(allPanel, 'licenseConfigPanel', index);	
					//this.getLicenseList().getStore().load();	
				} else if (record.data.id == 'tree_role') {
					switchMenu(allPanel, 'roleConfigPanel', index);
					this.getRoleList().getStore().load();
				} else if (record.data.id == 'tree_account') {
					switchMenu(allPanel, 'accountConfigPanel', index);
					this.getAccountList().getStore().load();
				} else if (record.data.id == 'tree_synch') {
					var licenseFlg=record.raw.syncLicense;
					if(licenseFlg==0){
						var syncStoragePathNoPower=Ext.create("acesure.config.view.SyncStoragePathNoPower");
						switchMenu(allPanel, syncStoragePathNoPower, index);
					}else{
						switchMenu(allPanel, 'synchStoragePath', index);
					}
				} else if (record.data.id == 'tree_about') {
						switchMenu(allPanel, 'productAboutPanel', index);
				} else {
					Ext.websure.MsgError("", local.config.msgError);
					location.reload();
				}
				SYSTEM_CONFIG_INFO = getSystemServerConfigInfo();
			},
			getAllMachineList : function(me) {
				BIND_MACHINE = {
					devicegroup : [],
					stonode : [],
					calnode : []
				};
				var task = new Ext.LoadMask(Ext.getBody(), {msg : local.config.devInfoReadingMsg});
				task.show();
				Ext.Ajax.request({
					method : 'post',
					url : '/config/toUserConfigAction!getAllMachineList.action',
					success : function(response, options) {
						try {
							var obj = eval("("+ response.responseText + ")");						
							// 设备组
							var deviceGroupAll = obj.devicegroupall;
							var devicegroup = me.query("#deviceGroup")[0];
							renderCheckboxForMachine(deviceGroupAll, devicegroup, DEVICE, true);
							//devicegroup.query("checkbox[inputValue=" + NORMAL + "]")[0].disable();
							// 存储节点
							var stonodeAll = obj.stonodeall;
							renderCheckboxForMachine(stonodeAll, me.query("#stonodeGroup")[0], STONODE, true);
							// 计算节点
							var calnodeAll = obj.calnodeall;
							renderCheckboxForMachine(calnodeAll, me.query("#calnodeGroup")[0], CALNODE, true);
							task.hide();
							me.doLayout();
						} catch (e) {
							me.close();
							task.hide();
							Ext.websure.MsgError("", local.config.msgError);
						}
					},
					failure : function(response, options) {
						me.close();
						task.hide();
						Ext.websure.MsgError("WF-30040",local.config.msgErrorNode );
					}
				});
			},
			saveAccountAndBindMachine : function(btn, e, eOpts) {
				btn.disable();
				var window = btn.up('window');
				var form = window.down("form");
				if (!window) {
					btn.enable();
					return ;
				}
				if (!form.getForm().isValid()) {
					btn.enable();
					return ;
				}				
				if (validatePasswordError(form)) {
					btn.enable();
					return ;
				}					
				if (form.query('#userLoginType')[0].getValue() != 0) {
					btn.enable();
					insertEmbedOfUSBKey();
					USB_KEY.create();
					if(!USB_KEY.hasUSBKey()){
						Ext.Msg.alert(local.window.tip, local.config.msgErrorUK);
						return ;
					}
					USB_KEY.grantUserLogin();
					var isWriten = USB_KEY.setUserName(form.query('#userName')[0].getValue().trim());
					if (!isWriten) {
						Ext.Msg.alert(local.window.tip, local.config.msgErrorUKFailure);
					}
					deleteEmbedOfUSBKey();
				}								
				var self = this;
				form.getForm().submit(
					{	
						method : 'post',
						type : 'submit',
						url : '/config/toUserConfigAction!addSingleUser.action',
						success : function(_form, action) {
							try {
								var user = action.result;
								//var code = user.msgCode;
								//var content = user.msgContent;								
								if (showResultDialog(user.msgCode, user.msgContent)) {
									window.close();
									self.getAccountList().getStore().load();									
								} else {
									btn.enable();
								}

								
								/*if (MSG_NORMAL == code) {									
									var autofill = EMPTY;
									if (form.query('#autofillCalnode')[0].getValue()) {
										autofill += BOOLEAN_TRUE_BINARY;
									} else {
										autofill += BOOLEAN_FALSE_BINARY;
									}
									if (form.query('#autofillStonode')[0].getValue()) {
										autofill += BOOLEAN_TRUE_BINARY;
									} else {
										autofill += BOOLEAN_FALSE_BINARY;
									}
									if (form.query('#autofillDevgroup')[0].getValue()) {
										autofill += BOOLEAN_TRUE_BINARY;
									} else {
										autofill += BOOLEAN_FALSE_BINARY;
									}		
									Ext.Ajax.request({													
										method : 'post',
										jsonData : Ext.encode(BIND_MACHINE),
										params : {
											userid : user.userid,
											username : form.query('#userName')[0].getValue(),
											autofill : autofill,
											op : 'insert'
										},
										url : '/config/toUserConfigAction!bindUserMachine.action',
										success : function(response, options) {
											try {
												var machine = eval("(" + response.responseText + ")");
												window.close();
												if (notNull(machine)) {
													showResultDialog(machine.msgCode, content + machine.msgContent);
												}
											} catch (e) {
												window.close();
												Ext.websure.MsgError("",local.config.msgError);
											}
										},
										failure : function(response, options) {
											window.close();
											Ext.websure.MsgError("", local.config.msgErrorFailureBindPc);
										}
									});
								} else {
									btn.enable();
									showResultDialog(code, content);
								}*/
							} catch (e) {
								window.close();
								Ext.websure.MsgError("",local.config.msgError );
							}
						},
						failure : function(form, action) {
							window.close();
							Ext.websure.MsgError("WF-30041", local.config.msgErrorNewPage);
						}
					});
			},
			getBindMachineList : function(me) {
				BIND_MACHINE = {
					devicegroup : [],
					stonode : [],
					calnode : []
				};
				var account = this.getAccountList().getSelectionModel().selected.get(0).data;
				var task = new Ext.LoadMask(Ext.getBody(), {msg : local.config.accountInfoReadingMsg});
				task.show();
				Ext.Ajax.request({						
					method : 'post',
					params : {
						userid : account.userId
					},
					//async : false,
					url : '/config/toUserConfigAction!getUserBindMachine.action',
					success : function(response, options) {
						try {
							var obj = eval("(" + response.responseText + ")");							
							BIND_MACHINE = obj.bindmachine;
							// 设备组
							var deviceGroupAll = obj.devicegroupall;
							var devicegroup = me.query("#deviceGroup")[0];
							renderCheckboxForMachine(deviceGroupAll, devicegroup, DEVICE);
							/*if (deviceGroupAll.length == devicegroup.getChecked().length) {
								devicegroup.previousSibling().setValue(true);
							} */
							// 存储节点
							var stonodeAll = obj.stonodeall;
							var stonodes =  me.query("#stonodeGroup")[0];
							renderCheckboxForMachine(stonodeAll, stonodes, STONODE);
							/*if (stonodeAll.length == stonodes.getChecked().length) {
								stonodes.previousSibling().setValue(true);
							} */
							// 计算节点
							var calnodeAll = obj.calnodeall;
							var calnodes = me.query("#calnodeGroup")[0];
							renderCheckboxForMachine(calnodeAll, calnodes, CALNODE);
							/*if (calnodeAll.length == calnodes.getChecked().length) {
								calnodes.previousSibling().setValue(true);
							} */
							// 管理员与非管理员的显示
							if (isManager(account.userName)) {
								var machineDomain = me.query('checkboxgroup');
								for ( var m in machineDomain) {
									var machine = machineDomain[m].up('fieldset');
									fillAllCheckBox(machineDomain[m]);
									machine.disable();
								}		
							}else {
								var autofill = obj.autofill;
								if (autofill[2]) {
									fillAllCheckBox(devicegroup.up('fieldset'));
									//me.query('#tempdevgroup')[0].setValue(true);
									me.query('#autofillDevgroup')[0].setValue(true);
									disableAllCheckboxs(devicegroup);
								}
								if (autofill[1]) {
									fillAllCheckBox(stonodes.up('fieldset'));
									me.query('#autofillStonode')[0].setValue(true);
									//me.query('#tempstonode')[0].setValue(true);
									disableAllCheckboxs(stonodes);
								}
								if (autofill[0]) {
									fillAllCheckBox(calnodes.up('fieldset'));
									//me.query('#tempcalnode')[0].setValue(true);
									me.query('#autofillCalnode')[0].setValue(true);
									disableAllCheckboxs(calnodes);
								}
								// devicegroup.query("checkbox[inputValue=" + NORMAL + "]")[0].disable();
							}
							task.hide();
							me.doLayout();							
						} catch (e) {
							me.close();
							task.hide();
							Ext.websure.MsgError("", local.config.msgError);
						}
					},
					failure : function(response, options) {
						me.close();
						task.hide();
						Ext.websure.MsgError("WF-30042", local.config.msgErrorFailureGetPc);
					}
				});
			},
			getOwnBindMachineList : function(me) {
				BIND_MACHINE = {
					devicegroup : [],
					stonode : [],
					calnode : []
				};
				var account = this.getAccountList().getSelectionModel().selected.get(0).data;								
				var task = new Ext.LoadMask(Ext.getBody(), {msg : local.config.readDevTip});
				task.show();
				Ext.Ajax.request({						
					method : 'post',
					params : {
						userid : account.userId
					},
					//async : false,
					url : '/config/toUserConfigAction!individualMachine.action',
					success : function(response, options) {
						try {
							var obj = eval("(" + response.responseText + ")");							
							BIND_MACHINE = obj.bindmachine;	
							var cur = obj.curusermachine;
							// 设备组
							var deviceGroupAll = obj.devicegroupall;						
							var devicegroup = me.query("#deviceGroup")[0];
							renderCheckboxForMachine(deviceGroupAll, devicegroup, DEVICE);
							
							/*if (deviceGroupAll.length == devicegroup.getChecked().length) {
								devicegroup.previousSibling().setValue(true);
							} */
							// 存储节点
							var stonodeAll = obj.stonodeall;							
							var stonodes =  me.query("#stonodeGroup")[0];
							renderCheckboxForMachine(stonodeAll, stonodes, STONODE);	
							
							/*if (stonodeAll.length == stonodes.getChecked().length) {
								stonodes.previousSibling().setValue(true);
							} */
							// 计算节点
							var calnodeAll = obj.calnodeall;							
							var calnodes = me.query("#calnodeGroup")[0];
							renderCheckboxForMachine(calnodeAll, calnodes, CALNODE);
							
							/*if (calnodeAll.length == calnodes.getChecked().length) {
								calnodes.previousSibling().setValue(true);
							} */
																								
							
							// 管理员与非管理员的显示
							if (isManager(account.userName)) {
								var machineDomain = me.query('checkboxgroup');
								for (var m in machineDomain) {
									var machine = machineDomain[m].up('fieldset');
									fillAllCheckBox(machine);
									machine.disable();
								}
								var buttons = me.query('button');
								for (var b in buttons) {
									buttons[b].hide();
								}								
							} else {
								var autofill = obj.autofill;
								
								if (notManager(CURRENT_USER.getUserName())) {
									disableAllCheckboxs(devicegroup);
									disableAllCheckboxs(stonodes);
									disableAllCheckboxs(calnodes);
								}
								
								if (autofill[2]) {
									fillAllCheckBox(devicegroup.up('fieldset'));
									//me.query('#tempdevgroup')[0].setValue(true);
									me.query('#autofillDevgroup')[0].setValue(true);
								} 
								
								if (autofill[1]) {
									fillAllCheckBox(stonodes.up('fieldset'));
									me.query('#autofillStonode')[0].setValue(true);
									//me.query('#tempstonode')[0].setValue(true);								
								}
								
								if (autofill[0]) {
									fillAllCheckBox(calnodes.up('fieldset'));
									//me.query('#tempcalnode')[0].setValue(true);
									me.query('#autofillCalnode')[0].setValue(true);									
								}
								// devicegroup.query("checkbox[inputValue=" + NORMAL + "]")[0].disable();
								
								if (notManager(CURRENT_USER.getUserName())) {
									var curAutofill = cur.curautofill;
									
									if (!curAutofill[2]) {
										me.query('#autofillDevgroup')[0].disable();
										var curgroup = cur.devicegroupall;	
										for (var i = 0; i < deviceGroupAll.length; i++) {
											for (var j = 0; j < curgroup.length; j++) {
												var groupId = curgroup[j].groupId;
												if (groupId == deviceGroupAll[i].groupId) {
													devicegroup.query("checkbox[inputValue=" + groupId + "]")[0].enable();
												}									
											}
										}
									} 
									
									if (!curAutofill[1]) {
										me.query('#autofillStonode')[0].disable();
										var curstonode = cur.stonodeall;							
										for (var i = 0; i < stonodeAll.length; i++) {
											for (var j = 0; j < curstonode.length; j++) {
												var stonodeId = curstonode[j].id;
												if (stonodeId == stonodeAll[i].id) {
													stonodes.query("checkbox[inputValue=" + stonodeId + "]")[0].enable();
												}									
											}
										}
									} 
									
									if (!curAutofill[0]) {
										me.query('#autofillCalnode')[0].disable();
										var curcalnode = cur.calnodeall;							
										for (var i = 0; i < calnodeAll.length; i++) {
											for (var j = 0; j < curcalnode.length; j++) {
												var calnodeId = curcalnode[j].nodeId;
												if (calnodeId == calnodeAll[i].nodeId) {
													calnodes.query("checkbox[inputValue=" + calnodeId + "]")[0].enable();
												}									
											}
										}
									}
								}							 																									
							} 																		
							task.hide();
							me.doLayout();							
						} catch (e) {
							me.close();
							task.hide();
							Ext.websure.MsgError("", local.config.msgError);
						}
					},
					failure : function(response, options) {
						me.close();
						task.hide();
						Ext.websure.MsgError("WF-30043", local.config.msgErrorFailureGetPc);
					}
				});
			},
			saveAccountBindMachine : function(btn, e, eOpts) {
				btn.disable();
				var window = btn.up('window');
				if (isNull(window)) {
					btn.enable();
					return ;
				}
				var account = this.getAccountList().getSelectionModel().selected.get(0).data;
				var autofill = EMPTY;	
				if (window.query('#autofillCalnode')[0].getValue()) {
					autofill += BOOLEAN_TRUE_BINARY;
				} else {
					autofill += BOOLEAN_FALSE_BINARY;
				}	
				if (window.query('#autofillStonode')[0].getValue()) {
					autofill += BOOLEAN_TRUE_BINARY;
				} else {
					autofill += BOOLEAN_FALSE_BINARY;
				}
				if (window.query('#autofillDevgroup')[0].getValue()) {
					autofill += BOOLEAN_TRUE_BINARY;
				} else {
					autofill += BOOLEAN_FALSE_BINARY;
				}
				var self = this;
				Ext.Ajax.request({																			
					method : 'post',
					jsonData : Ext.encode(BIND_MACHINE),
					params : {
						userid : account.userId,
						username : account.userName,
						autofill : autofill,
						op : 'update'
					},
					url : '/config/toUserConfigAction!bindUserMachine.action',
					success : function(response, options) {
						try {
							var machine = eval("(" + response.responseText + ")");
							window.close();
							if (notNull(machine)) {
								showResultDialog(machine.msgCode, machine.msgContent);
							}											
						} catch (e) {
							window.close();
							Ext.websure.MsgError("", local.config.msgError);
						}
					},
					failure : function(response, options) {
						window.close();
						Ext.websure.MsgError("WF-30044", local.config.msgErrorEditAccSuccFailureBindPc);
					}
				});			
			},
			saveAccountModifyInfo : function(btn, e, eOpts) {
				btn.disable();
				var window = btn.up('window');
				if (isNull(window)) {
					btn.enable();
					return ;
				}
				var form = window.down('form');
				if (!form.getForm().isValid()) {
					btn.enable();
					return ;
				}
				if (validatePasswordError(form)) {
					btn.enable();
					return ;
				}
				if (form.query('#userLoginType')[0].getValue() != 0 && form.query('#loginTypeChange')[0].getValue() == 1) {
					insertEmbedOfUSBKey();
					USB_KEY.create();
					if(!USB_KEY.hasUSBKey()){
						Ext.Msg.alert(local.window.tip,local.config.msgErrorUK);
						btn.enable();
						return ;
					}
					USB_KEY.grantUserLogin();
					var isWriten = USB_KEY.setUserName(form.query('#userName')[0].getValue().trim());
					if (!isWriten) {
						Ext.Msg.alert(local.window.tip, local.config.msgErrorUKFailure);
					}
					deleteEmbedOfUSBKey();
				}	
				var self = this;
				form.getForm().submit({				
					method : 'post',
					type : 'submit',
					params : {
						alterpower : (form.query('#roleId')[0].getValue() == form.query('#initRoleId')[0].getValue()) ? 0 : 1
					},
					url : '/config/toUserConfigAction!modifySingleUser.action',
					success : function(_form, action) {
						try {
							var user = action.result;
							window.close();
							showResultDialog(user.msgCode, user.msgContent);
							self.getAccountList().getStore().load();														
						} catch (e) {
							window.close();
							Ext.websure.MsgError("", local.config.msgError);
						}
					},
					failure : function(form, action) {
						window.close();
						Ext.websure.MsgError("WF-30045", local.config.msgErrorEditAcc);
					}
				});
			},
			initOutputConfigPage : function(me) {
				POWER_OP.filterEnableDomsInHtmlOfExtjs(me, CURRENT_USER.getSystemPower(), TAG_BUTTON);
				setDomInnerHTML('phoneNumber', CURRENT_USER.getUser().userPhone);
				var store = Ext.create('acesure.config.store.MailConfigStore');
				store.load({
					callback : function(record, options, success) {
						var mailConfig = record[0].data;						
						refreshPageDataForMailConfig(mailConfig);
					}
				});
			},
			initSystemServerConfigPage : function(me) {
				POWER_OP.filterEnableDomsInHtmlOfExtjs(me, CURRENT_USER.getSystemPower(), TAG_BUTTON);
				// server config, eg: ip, port and so on
				refreshPageDataForServer(SYSTEM_CONFIG_INFO);
				// system safety, eg: password limit, ip limit and so on
				refreshPageDataForSystemSafety(SYSTEM_CONFIG_INFO);
				// reportlog config include cleaning log and send mail of log regularly and automaticly
				var reportlogConfig = getCurrentUserReportlogConfigInfo();
				refreshPageDataForLogManagement(SYSTEM_CONFIG_INFO, reportlogConfig.isSendMail);
				// the last time of exporting database sqlfile				
				refreshPageDataForDatabaseIO(SYSTEM_CONFIG_INFO);
				// the path and switch of backuping database sqlfile				
				refreshPageDataForDatabaseBackup(SYSTEM_CONFIG_INFO);	
				//刷新存储介质报警阈值
                refreshVMSWarnThreshold(SYSTEM_CONFIG_INFO);
			},
			loadAccountCreateWindow : function(btn, e, eOpts) {
				Ext.create('acesure.config.view.account.AccountCreateWindow').show();				
			},
			loadAccountBindMachineWindow : function(btn, e, eOpts) {
				var selected = this.getAccountList().getSelectionModel().selected.get(0);
			    if (!selected) {
			    	Ext.Msg.alert(local.window.tip, "请选择账户!");
			    	return ;
				}
				Ext.create('acesure.config.view.account.AccountBindMachineWindow').show();				
			},
			loadAccountSearchWindow : function(btn, e, eOpts) {
				Ext.create('acesure.config.view.account.AccountSearchWindow').show();
			},
			accountSelectRow : function(v, record, index, eOpts) {
				var bindMachine = Ext.getCmp('systemconfig_account_bindmachine');
				if (isManager(record.data.userName) && CURRENT_USER.isThreeMode()) {
					bindMachine.disable();
				} else {
					bindMachine.enable();
				}
			},		
			loadRoleCreateRoleWindow : function(btn, e, eOpts) {
				Ext.create('acesure.config.view.role.RoleCreateRoleWindow').show();
			},
			saveRoleCreateRole : function(btn, e, eOpts) {
				btn.disable();
				var window = btn.up('window');
				var form = window.down('form');
				if (!window) {
					btn.enable();
					return ;
				}
				if (!form.getForm().isValid()) {
					btn.enable();
					return ;
				}
				var roleName = window.query('#roleName')[0].getValue();
				if (isManager(roleName)) {
					Ext.Msg.alert(local.window.tip, local.config.adminNameNoUse);
					btn.enable();
					return ;
					
				}
				var powerBindType = window.query('#powerBindType')[0].getValue();								
				var self = this;
				form.getForm().submit(						
						{
							method : 'post',
							type : 'submit',
							params : { type : powerBindType },
							url : '/authority/toAuthorityAction!addRole.action',
							success : function(form, action) {
								try {
									var detail = action.result;
									var role = detail.roleinfo;																																			
									if (showResultDialog(detail.msgCode, detail.msgContent)) {
										window.close();	
										self.getRoleList().getStore().load();
										if (NORMAL != powerBindType) {
											openGrantPowerWindow(role.roleId, role.roleName);
										}
									} else {
										btn.enable();
									}																	
								} catch (e) {
									window.close();
									Ext.websure.MsgError("", local.config.msgError);
								}
							},
							failure : function(form, action) {
								window.close();
								Ext.websure.MsgError("WF-30046", local.config.msgErrorNewRole);
							}
						});
			},
			initRolePowerWindow : function(me) {
				var task = new Ext.LoadMask(Ext.getBody(), {msg : local.config.authInfoReadingMsg});
				task.show();
				Ext.Ajax.request({
					method : 'post',
					params : {
						roleid : SYSTEM_CONFIG_INFO.ROLE_ID
					},
					// async : false,
					url : '/authority/toAuthorityAction!getRolePower.action',
					success : function(response, options) {
						try {
							var obj = eval("(" + response.responseText + ")");
							POWER = obj.power;
							allpower = obj.allpower;
							// 设备权限
							var devicePowers = allpower.devicePowers;
							var devicePower = me.query("#devicePower")[0];							
							renderCheckboxForModulePower(
									allpower.devicePowers,
									devicePower,
									me.query("#deviceDomain")[0],
									POWER, DEVICE);	
							if (devicePowers.length == devicePower.getChecked().length) {
								devicePower.previousSibling().setValue(true);
							} 
							// 存储节点权限
							var stonodePowers = allpower.stonodePowers;	
							var stonodePower = me.query("#stonodePower")[0];							
							renderCheckboxForModulePower(
									stonodePowers,
									stonodePower,
									me.query("#stonodeDomain")[0],
									POWER, STONODE);
							if (stonodePowers.length == stonodePower.getChecked().length) {
								stonodePower.previousSibling().setValue(true);
							} 
							// 计算节点权限
							var calnodePowers = allpower.calnodePowers;
							var calnodePower = me.query("#calnodePower")[0];							
							renderCheckboxForModulePower(
									calnodePowers,
									calnodePower,
									me.query("#calnodeDomain")[0],
									POWER, CALNODE);
							if (calnodePowers.length == calnodePower.getChecked().length) {
								calnodePower.previousSibling().setValue(true);
							} 
							// 报表日志权限
							var reportlogPowers = allpower.reportlogPowers;
							var reportlogPower = me.query("#reportLogPower")[0];							
							renderCheckboxForModulePower(
									reportlogPowers,
									reportlogPower,
									me.query("#reportLogDomain")[0],
									POWER, REPORTLOG);
							if (reportlogPowers.length == reportlogPower.getChecked().length) {
								reportlogPower.previousSibling().setValue(true);
							} 
							// 系统权限
							var systemPowers = allpower.sysconfigPowers;
							var systemPower = me.query("#sysPower")[0];						
							renderCheckboxForModulePower(
									systemPowers,
									systemPower,
									me.query("#sysConfigDomain")[0],
									POWER, SYSTEMCONFIG);
							if (systemPowers.length == systemPower.getChecked().length) {
								systemPower.previousSibling().setValue(true);
							} 						
							task.hide();
							me.doLayout();
						} catch (e) {
							me.close();
							task.hide();
							Ext.websure.MsgError("", local.config.msgError);
						}
					},
					failure : function(response, options) {
						me.close();
						task.hide();
						Ext.websure.MsgError("WF-30047", local.config.msgErrorReadAuth);
					}
				});
			},
			saveRoleModifyInfo : function(btn, e, eOpts) {
				btn.disable();
				var window = btn.up('window');
				var form = window.down('form');
				if (!window) {
					btn.enable();
					return;
				}
				if (!form.getForm().isValid()) {
					btn.enable();
					return;
				}
				var notChange = (form.query('#oldRoleName')[0].getValue() == form.query('#roleName')[0].getValue()) ? NORMAL : NOT_NORMAL;
				var self = this;
				form.getForm().submit({
					method : 'post',
					type : 'submit',
					params : {
						notChange : notChange
					},
					url : '/authority/toAuthorityAction!modifyRole.action',
					success : function(form, action) {
						try {
							var detail = action.result;							
							if (showResultDialog(detail.msgCode, detail.msgContent)) {
								window.close();
								self.getRoleList().getStore().load();
							} else {
								btn.enable();
							}									
						} catch (e) {
							window.close();
							Ext.websure.MsgError("", local.config.msgError);
						}
					},
					failure : function(form, action) {
						window.close();
						Ext.websure.MsgError("WF-30048", local.config.modifyException);
					}
				});
			},
			saveRoleAuthority : function(btn, e, eOpts) {
				btn.disable();
				var window = btn.up('window');
				if (!window) {
					btn.enable();
					return ;
				}
				Ext.Ajax.request({
						method : 'post',
						jsonData : Ext.encode(POWER),
						params : {
							roleid : SYSTEM_CONFIG_INFO.ROLE_ID,
							rolename : encodeURI(window.title.split(':')[1].trim())
						},
						url : '/authority/toAuthorityAction!savePowerInfo.action',
						success : function(response, options) {
							try {
								var obj = eval("(" + response.responseText + ")");
								window.close();
								showResultDialog(obj.msgCode, obj.msgContent);
							} catch (e) {
								window.close();
								Ext.websure.MsgError("", local.config.msgError);
							}
						},
						failure : function(response, options) {
							window.close();
							Ext.websure.MsgError("WF-30049", local.config.updatePerException);
						}
					});
			},
			searchAccountInfo : function(btn, e, eOpts) {
				var window = btn.up('window');
				var form = window.down("form");
				if (!window) {
					return ;
				}
				if (!form.getForm().isValid()) {
					return ;
				}
				this.getAccountList().getStore().load({					
					params : {
						userName : form.query("#userNameSearch")[0].getValue(),
						userState : form.query("#userStateSearch")[0].getValue(),
						roleId : form.query("#roleIdSearch")[0].getValue()
					},
					callback : function(records, options, success) {
						if (isNull(records[0])) {
							Ext.websure.MsgError("",local.config.noRecords);
						} else {
							window.close();
						}
					}
				});
			},
			saveOutputNotifyTimeConfigInfo : function(btn, e, eOpts) {
				btn.disable();
				var window = btn.up('window');
				if (!window) {
					btn.enable();
					return ;
				}
				var weekdayCheck = window.query("#notifyTimeField")[0].query("checkbox[checked=true]");				
				var notifyTime = "";
				var beginTime = window.query("#notifyBeginTime")[0].getValue();
				var endTime = window.query("#notifyEndTime")[0].getValue();
				if (weekdayCheck.length > 0  && isNull(beginTime)) {
					Ext.Msg.alert(local.window.tip, local.config.startTimeWriteTip);
					btn.enable();
					return ;
				}
				if (weekdayCheck.length > 0 && isNull(endTime)) {
					Ext.Msg.alert(local.window.tip, local.config.endTimeWriteTip);
					btn.enable();
					return ;
				}				
				if (weekdayCheck.length == 0 && (notNull(beginTime) || notNull(endTime))) {
					Ext.Msg.alert(local.window.tip, local.config.weekWriteTip);
					btn.enable();
					return ;
				}				
				if (notNull(beginTime) && notNull(endTime)) {
					for ( var i in weekdayCheck) {
						notifyTime += weekdayCheck[i].id + ",";
					}
					notifyTime = notifyTime.substring(0, notifyTime.length - 1) + ";";			
					notifyTime += Ext.Date.format(beginTime, 'H:i') + "-" + Ext.Date.format(endTime,'H:i');	
				}										
				var nfyModuleID = window.query('#notifyModuleID')[0].getValue();
				var self = this;
				Ext.Ajax.request({
					method : 'post',
					params : {
						notifyTime : notifyTime,
						notifyModuleName : window.query('#notifyModuleName')[0].getValue(),
						moduleID : isNull(nfyModuleID) ? 0 : nfyModuleID
					},
					url : '/config/toSystemConfigAction!setCurrentUserModuleNotifyTimeConfigInfo.action',
					success : function(response, options) {
						try {
							var obj = eval("("+ response.responseText + ")");
							window.close();
							self.getOutputList().getStore().load();
							showResultDialog(obj.msgCode, obj.msgContent);
						} catch (e) {
							window.close();
							this.getOutputList().getStore().load();
							Ext.websure.MsgError("", local.config.msgError);
						}
					},
					failure : function(response, options) {
						window.close();
						Ext.websure.MsgError("WF-30050", local.config.notifyTiming);
					}
				});
			},
			testOutputNotifyMailConfigInfo : function(btn, e, eOpts) {
				var window = btn.up('window');
				if (!window) {
					return;
				}
				var form = window.down('form');
				if (!form.getForm().isValid()) {
					return;
				}
				var myMask = new Ext.LoadMask(window, {
					msg :local.config.testingEmail
				});
				myMask.show();
				form.getForm().submit(						
						{
							method : 'post',
							type : 'submit',
							url : '/config/toSystemConfigAction!testNormalServerMail.action',
							success : function(form, action) {
								try {
									var detail = action.result;
									myMask.hide();
									if (showResultDialog(detail.msgCode, detail.msgContent)) {
										btn.nextSibling().show();
									}									
								} catch (e) {
									window.close();
									Ext.websure.MsgError("", local.config.msgError);
								}
							},
							failure : function(form, action) {
								window.close();
								Ext.websure.MsgError("WF-30051", local.config.abnormalTestEmail);
							}
						});
			},
			saveOutputNotifyMailConfigInfo : function(btn, e, eOpts) {
				var window = btn.up('window');
				if (!window) {
					return;
				}
				var form = window.down('form');
				if (!form.getForm().isValid()) {
					return;
				}
				form.getForm().submit(
						{
							method : 'post',
							type : 'submit',
							url : '/config/toSystemConfigAction!saveServerMailConfig.action',
							success : function(form, action) {
								try {
									var detail = action.result;
									window.close();
									if (showResultDialog(detail.msgCode, detail.msgContent)) {
										refreshPageDataForMailConfig(detail.mailconfig);
									}
								} catch (e) {
									window.close();
									Ext.websure.MsgError("", local.config.msgError);
								}
							},
							failure : function(form, action) {
								window.close();
								Ext.websure.MsgError("WF-30052", local.config.modifyService);
							}
						});
			},
			testOutputNotifySMSConfigInfo : function(btn, e, eOpts) {
				var window = btn.up('window');
				if (!window) {
					return;
				}
				var form = window.down('form');
				if (!form.getForm().isValid()) {
					return;
				}
				var phone = form.query('#smsConfigPhone')[0].getValue();
				var myMask = new Ext.LoadMask(window, {
					msg :local.config.testingMessages
				});				
				myMask.show();
				Ext.Ajax.request({
					method : 'post',
					params : { phone: phone },
					url : '/config/toSystemConfigAction!testNormalServerSMS.action',
					success : function(response,options) {
						try {
							var obj = eval("("+response.responseText+")");
							myMask.hide();
							if (showResultDialog(obj.msgCode, obj.msgContent)) {
								Ext.Msg.confirm(local.window.tip, local.config.sureTosave,
										function(bt) {
											if ('yes' == bt) {
												Ext.Ajax.request({
													method : 'post',
													params : { phone: phone },
													url : '/config/toSystemConfigAction!updateSMSPhone.action',
													success : function(response,options) {
														try {
															var objinner = eval("("+response.responseText+")");
															if (objinner.success) {
																Ext.Msg.alert(local.window.tip, local.config.sucss);
																loadCurrentUserInfo();
																setDomInnerHTML('phoneNumber', CURRENT_USER.getUser().userPhone);
															} else {
																Ext.Msg.alert(local.window.tip, local.config.saveFailure);
															}
														} catch (e) {
															Ext.websure.MsgError("",local.config.msgError);			
														}
													},
													failure : function(response,options) {
														Ext.websure.MsgError("WF-30053", local.config.savaAbnormal);			
													}
												});					
											} 
										}, this);
							}												
						} catch (e) {
							myMask.hide();
							Ext.websure.MsgError("", local.config.msgError);			
						}
					},
					failure : function(response,options) {
						myMask.hide();
						Ext.websure.MsgError("WF-30054", local.config.abnormalMessage);			
					}
				});					
			},
		/*	saveOutputNotifySMSConfigInfo : function(btn, e, eOpts) {
				var window = btn.up('window');
				if (!window) {
					return;
				}
				var form = window.down('form');
				if (!form.getForm().isValid()) {
					return;
				}
				form.getForm().submit(
						{
							method : 'post',
							type : 'submit',
							url : '/config/toSystemConfigAction!saveServerSMSConfig.action',
							success : function(form, action) {
								try {
									var detail = action.result;
									window.close();
									if (showResultDialog(detail.msgCode, detail.msgContent)) {
										refreshPageDataForSMSConfig(detail.smsconfig);
									}
								} catch (e) {
									window.close();
									Ext.websure.MsgError("", local.config.msgError);
								}
							},
							failure : function(form, action) {
								window.close();
								Ext.websure.MsgError("", "修改短信服务设置异常!");
							}
						});
			},*/
			initLogConfigWindow : function(me) {
				SYSTEM_CONFIG_INFO = getSystemServerConfigInfo();
				var reportlogConfig = getCurrentUserReportlogConfigInfo();
				var isLogSendMail = me.query('#isLogSendMail')[0];
				if (0 == reportlogConfig.isSendMail) {
					isLogSendMail.collapse();
				} else {
					isLogSendMail.expand();
					me.query("#monthSendMail")[0].setValue(reportlogConfig.mailSendMonth + EMPTY);
				}				
				var isStartCleanLog = me.query("#isStartAutoCleanLog")[0];
				if (0 == SYSTEM_CONFIG_INFO.isStartAutoCleanLog) {
					isStartCleanLog.collapse();
					return;
				}
				isStartCleanLog.expand();
				me.query("#autoCleanSystemLog")[0].setValue(SYSTEM_CONFIG_INFO.autoCleanSystemLog + EMPTY);
				me.query("#autoCleanFunctionLog")[0].setValue(SYSTEM_CONFIG_INFO.autoCleanFunctionLog + EMPTY);
				me.query("#autoCleanOperationLog")[0].setValue(SYSTEM_CONFIG_INFO.autoCleanOperationLog + EMPTY);
			},
			saveAutoCleanLogConfigInfo : function(btn, e, eOpts) {
				btn.disable();
				var window = btn.up('window');
				if (!window) {
					btn.enable();
					return ;
				}
				// config the month of sending mail about log automaticly and regularly
				var monthSendMail = window.query('#monthSendMail')[0].getValue();
				monthSendMail = isNull(monthSendMail) ? 0 : parseInt(monthSendMail);
				var sendMail = false;
				if (monthSendMail>0) {
					sendMail = true;
				}
				configSendMailMonthOfLog(monthSendMail);			
				// auto clean log regularly
				var isAutoCleanLog = window.query('#isStartAutoCleanLog')[0].collapsed ? 0 : 1;
				var isAutoClean = notNull(isAutoCleanLog) && isAutoCleanLog;
				var monthCleanSystemLog = isAutoClean ? window.query('#autoCleanSystemLog')[0].getValue() : 0;
				var monthCleanFunctionLog = isAutoClean ? window.query('#autoCleanFunctionLog')[0].getValue() : 0;
				var monthCleanOperationLog = isAutoClean ? window.query('#autoCleanOperationLog')[0].getValue() : 0;
				Ext.Ajax.request({
					method : 'post',
					async : false,
					params : {
						isAutoCleanLog : isAutoCleanLog,
						monthCleanSystemLog : monthCleanSystemLog,
						monthCleanFunctionLog : monthCleanFunctionLog,
						monthCleanOperationLog : monthCleanOperationLog
					},
					url : '/config/toSystemConfigAction!configAutoCleanLog.action',
					success : function(response, options) {
						try {
							var obj = eval("(" + response.responseText + ")");							
							if (showResultDialog(obj.msgCode, obj.msgContent)) {
								// maintain the global variable 'SYSTEM_CONFIG_INFO' in the page of 'config' 
								SYSTEM_CONFIG_INFO.isStartAutoCleanLog = isAutoCleanLog;
								SYSTEM_CONFIG_INFO.autoCleanSystemLog = monthCleanSystemLog;
								SYSTEM_CONFIG_INFO.autoCleanFunctionLog = monthCleanFunctionLog;
								SYSTEM_CONFIG_INFO.autoCleanOperationLog = monthCleanOperationLog;
								refreshPageDataForLogManagement(SYSTEM_CONFIG_INFO, sendMail);
							}
							window.close();
						} catch (e) {
							window.close();
							Ext.websure.MsgError("", local.config.msgError);
						}
					},
					failure : function(response, options) {
						window.close();
						Ext.websure.MsgError("WF-30055", local.config.regularlyCleaned);

					}
				});				
			},
			initSystemSafetyConfigWindow : function(me) {
				if (!me) {
					return;
				}
				if (isNull(SYSTEM_CONFIG_INFO)) {
					SYSTEM_CONFIG_INFO = getSystemServerConfigInfo();
				}
				// 错误登陆限制
				var errorCount = SYSTEM_CONFIG_INFO.interroLoginCount;
				var lockMinute = SYSTEM_CONFIG_INFO.erroDateTime;
				var isLoginLimitExt = me.query("#isStartLoginErrorLimit")[0];
				if (0 == SYSTEM_CONFIG_INFO.isStartLoginErroLimit) {
					isLoginLimitExt.collapse();
				} else {
					isLoginLimitExt.expand();
					if (isInNumRange(errorCount, ERROR_LOGIN_MIN_COUNT, ERROR_LOGIN_MAX_COUNT)) {
						me.query("#loginErrorCount")[0].setValue(errorCount);
					}
					if (isInNumRange(lockMinute, LOCK_LOGIN_MIN_MINUTE, LOCK_LOGIN_MAX_MINUTE)) {
						me.query("#loginErrorMinute")[0].setValue(lockMinute);
					}
				}
				// IP登陆限制
				var isIPLimitExt = me.query("#isStartLimitIp")[0];
				if (0 == SYSTEM_CONFIG_INFO.isStartIpLimit) {
					isIPLimitExt.collapse();
				} else {
					isIPLimitExt.expand();
					me.query("#limitIp")[0].setValue(SYSTEM_CONFIG_INFO.limitIp);
				}
				// 密码定时更新
				var pwdOutDay = SYSTEM_CONFIG_INFO.pwdIsExpiredDateTime;
				var isPwdOutExt = me.query("#pwdIsExpired")[0];
				if (0 == SYSTEM_CONFIG_INFO.pwdIsExpired) {
					isPwdOutExt.collapse();
				} else {
					isPwdOutExt.expand();
					if (isInNumRange(pwdOutDay, PASSWORD_OUTDATE_MIN_DAY, PASSWORD_OUTDATE_MAX_DAY)) {
						me.query("#pwdExpiredDay")[0].setValue(pwdOutDay);
					}
				}
				// 密码校验
				var pwdLen = SYSTEM_CONFIG_INFO.pwdStrength;
				var isPwdCheckExt = me.query("#isPwdCheck")[0];
				if (0 == SYSTEM_CONFIG_INFO.isPwdCheck) {
					isPwdCheckExt.collapse();
				} else {
					isPwdCheckExt.expand();
					if (isInNumRange(pwdLen, PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH)) {
						me.query("#pwdLength")[0].setValue(pwdLen);
					}
					me.query("#pwdCheckType")[0] .setValue(SYSTEM_CONFIG_INFO.pwdCheckType + EMPTY);
				}
			},
			saveSystemSafetyConfigInfo : function(btn, e, eOpts) {
				btn.disable();
				var window = btn.up('window');
				if (!window) {
					btn.enable();
					return ;
				}
				// 登陆限制IP
				var isLimitIP = window.query("#isStartLimitIp")[0].collapsed ? 0 : 1;
				var limitIP = window.query("#limitIp")[0].getValue();
				if (1 == isLimitIP) {
					if (isNull(limitIP)) {
						Ext.Msg.alert(local.window.tip, local.config.IPNoNull);
						btn.enable();
						return ;
					} else {
						var limitIPArr = getArrayBySymbol(limitIP, SEMICOLON);
						for ( var i = 0; i < limitIPArr.length; i++) {
							if (notIP(limitIPArr[i])) {
								Ext.websure.MsgError("", local.config.IPwrong);
								btn.enable();
								return;
							}
						}
					}					
				} else {
					limitIP = null;
				}
			
				// 错误登陆限制次数和时间
				var isLoginErrorLimit = window.query("#isStartLoginErrorLimit")[0].collapsed ? 0 : 1;
				var loginErrorCount = window.query("#loginErrorCount")[0].getValue();
				if (1 == isLoginErrorLimit && isNull(loginErrorCount)) {
					Ext.Msg.alert(local.window.tip, local.config.loginErrorLimitTimeNoNull);
					btn.enable();
					return ;
				}
				var loginErrorMinute = window.query("#loginErrorMinute")[0].getValue();
				if (1 == isLoginErrorLimit && isNull(loginErrorMinute)) {
					Ext.Msg.alert(local.window.tip, local.config.loginErrorLimitLockTimeNoNull);
					btn.enable();
					return ;
				}
				
				
				
				// 账户密码过期设置
				var isPwdExpired = window.query("#pwdIsExpired")[0].collapsed ? 0 : 1;
				var pwdExpiredDay = window.query("#pwdExpiredDay")[0].getValue();
				if (1 == isPwdExpired && isNull(pwdExpiredDay)) {
					Ext.Msg.alert(local.window.tip, local.config.codePastTimeNoNull);
					btn.enable();
					return ;
				}
				// 密码校验设置
				var isPwdCheck = window.query("#isPwdCheck")[0].collapsed ? 0 : 1;
				var pwdLen = window.query("#pwdLength")[0].getValue();
				if (1 == isPwdCheck && isNull(pwdLen)) {
					Ext.Msg.alert(local.window.tip, local.config.codeLenghtNoNull);
					btn.enable();
					return ;
				}
				var pwdType = window.query("#pwdCheckType")[0].getValue();
				// 数据校验
				if (notInNumRange(loginErrorCount, ERROR_LOGIN_MIN_COUNT, ERROR_LOGIN_MAX_COUNT)
					|| notInNumRange(loginErrorMinute, LOCK_LOGIN_MIN_MINUTE, LOCK_LOGIN_MAX_MINUTE)
					|| notInNumRange(pwdExpiredDay, PASSWORD_OUTDATE_MIN_DAY, PASSWORD_OUTDATE_MAX_DAY)
					|| notInNumRange(pwdLen, PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH)) {
					return ;
				}			
				// 设置系统变量
				SYSTEM_CONFIG_INFO.isStartLoginErroLimit = isNull(isLoginErrorLimit) ? 0 : isLoginErrorLimit;
				SYSTEM_CONFIG_INFO.interroLoginCount = isNull(loginErrorCount) ? 0 : loginErrorCount;
				SYSTEM_CONFIG_INFO.erroDateTime = isNull(loginErrorMinute) ? 0 : loginErrorMinute;
				SYSTEM_CONFIG_INFO.isStartIpLimit = isNull(isLimitIP) ? 0 : isLimitIP;
				SYSTEM_CONFIG_INFO.limitIp = isNull(limitIP) ? EMPTY : limitIP;
				SYSTEM_CONFIG_INFO.pwdIsExpired = isNull(isPwdExpired) ? 0 : isPwdExpired;
				SYSTEM_CONFIG_INFO.pwdIsExpiredDateTime = isNull(pwdExpiredDay) ? 0 : pwdExpiredDay;
				SYSTEM_CONFIG_INFO.isPwdCheck = isNull(isPwdCheck) ? 0 : isPwdCheck;
				SYSTEM_CONFIG_INFO.pwdStrength = isNull(pwdLen) ? 0 : pwdLen;
				SYSTEM_CONFIG_INFO.pwdCheckType = isNull(pwdType) ? 0 : pwdType;
				// 系统安全设置请求
				Ext.Ajax.request({
					method : 'post',
					async : false,
					jsonData : Ext.encode(SYSTEM_CONFIG_INFO),
					url : '/config/toSystemConfigAction!configSystemSafety.action',
					success : function(response, options) {
						try {
							var obj = eval("("+ response.responseText+ ")");
							window.close();
							if (showResultDialog(obj.msgCode, obj.msgContent)) {
								refreshPageDataForSystemSafety(SYSTEM_CONFIG_INFO);
							} else {
								SYSTEM_CONFIG_INFO = null;
							}
						} catch (e) {
							SYSTEM_CONFIG_INFO = null;
							window.close();
							Ext.websure.MsgError("", local.config.msgError);
						}
					},
					failure : function(response, options) {
						SYSTEM_CONFIG_INFO = null;
						window.close();
						Ext.websure.MsgError("WF-30056", local.config.systemSecurCon);
					}
				});
			},
			backupSystemMysqlFile : function(me) {
				var panel = me.query("#sysDbExportPanel")[0];
				Ext.Ajax.request({
					method : 'get',
					url : '/config/toSystemConfigAction!backupMysqlFile.action',
					success : function(response, options) {
						try {
							var obj = eval("(" + response.responseText + ")");
							var result = obj.Result;
							var content = "<span style='color:red'>Mysql"+local.config.backupFailed+"</span>";
							if (notNull(result) && result) {
								me.query("#dbExportFileBtn")[0].show();
								content = "<span style='color:green'>Mysql"+local.config.dataComplete+"</span>";
								SYSTEM_CONFIG_INFO.lastExportTime = getNowFormatDate();
								refreshPageDataForDatabaseIO(SYSTEM_CONFIG_INFO);
							}
							panel.body.update(content);
						} catch (e) {
							panel.body.update("<span style='color:green'>Mysql"+local.config.abnormalPage+"</span>");
						}
					},
					failure : function(response, options) {
						panel.body.update("<span style='color:green'>Mysql"+local.config.abnormalBackup+"</span>");
					}
				});
			},
			downloadSystemMysqlFile : function(btn, e, eOpts) {
				btn.disable();
				var window = btn.up('window');
				panel = window.query('#sysDbExportPanel')[0];
				var content = panel.body.dom.innerHTML;
				if (content.indexOf(local.config.finished) > -1) {
					Ext.Msg.confirm(local.config.prompt, local.config.sureContinue,
							function(bt) {
								if ('yes' == bt) {
									panel.body.update(local.config.beingDownloaded);
									parent.location.href = "/config/toSystemConfigAction!downloadMysqlRar.action";
									panel.body.update("<span style='color:green'>"+local.config.Browser+"</span>");
									Ext.websure.MsgTip.msg(local.window.tip, local.config.downloadAgain, true);
								} else {
									window.close();
								}
							}, this);
				} else {
					panel.body.update(local.config.beingDownloaded);
					parent.location.href = "/config/toSystemConfigAction!downloadMysqlRar.action";
					panel.body.update("<span style='color:green'>"+local.config.Browser+"</span>");
					Ext.websure.MsgTip.msg(local.window.tip, local.config.downloadsucc, true);
				}
			},
			accountRightMenu : function(view, record, item, rowIndex, e) {
				var doneMenu = Ext.getCmp('accountCfgRightMenu');
				if (doneMenu) {
					doneMenu.destroy();
				}
				var account = record.data;
				var userName = account.userName;
				var accountRightMenu = Ext.create(						
						'Ext.menu.Menu',
						{
							id : 'accountCfgRightMenu',
							items : [
									{
										itemId : 'systemconfig_account_del',
										icon : "/images/config/icon_accountDel.png",
										text : local.config.deleteAccount,
										listeners : {
											'click' : function() {
												deleteSingleAccount(account.userId, userName);
											}
										}
									},
									{
										itemId : 'systemconfig_account_update',
										icon : "/images/config/icon_accountEdit.png",
										text : local.config.winModifyAccount,
										listeners : {
											'click' : function() {
												openAccountModifyWindow(record);
											}
										}
									} ]
						});
				// 阻止浏览器默认右键菜单
				e.preventDefault();				
				if (isCurrentUserCanModify(userName)) {
					accountRightMenu.remove(accountRightMenu.query('#systemconfig_account_del')[0]);
				} else if (notCurrentUserCanModifyAndDelete(userName)) {
					return;
				}
				accountRightMenu.showAt(e.getXY());				
				POWER_OP.filterEnableMenuOfExtjs(accountRightMenu, CURRENT_USER.getSystemPower());
			},
			roleRightMenu : function(view, record, item, rowIndex, e) {
				var doneMenu = Ext.getCmp('roleCfgRightMenu');
				if (doneMenu) {
					doneMenu.destroy();
				}
				var role = record.data;
				var roleID = role.roleId;
				var roleName = role.roleName;
				var roleRightMenu = Ext.create('Ext.menu.Menu', {
					id : 'roleCfgRightMenu',
					items : [ {
						itemId : 'systemconfig_role_modify',
						icon : "/images/config/icon_roleEdit.png",
						action : 'power',
						text : local.config.roleModify,
						listeners : {
							'click' : function() {
								openRoleModifyWindow(record);
							}
						}
					}, {
						itemId : 'systemconfig_role_grantpower',
						icon : "/images/config/icon_roleAuth.png",
						action : 'power',
						text : local.btn.grant,
						listeners : {
							'click' : function() {
								openGrantPowerWindow(roleID, roleName);
							}
						}
					}, {
						itemId : 'systemconfig_role_delete',
						icon : "/images/config/icon_roleDel.png",
						action : 'power',
						text : local.config.destroyCharacter,
						listeners : {
							'click' : function() {
								deleteSingleRole(roleID, roleName);
							}
						}
					} ]
				});
				// 阻止浏览器默认右键菜单
				e.preventDefault();
				if (isCurrentRoleCanModify(roleName)) {
					roleRightMenu.remove(roleRightMenu.query('#systemconfig_role_delete')[0]);
				} else if (notCurrentRoleCanModifyAndDelete(roleName)) {
					return;
				}
				roleRightMenu.showAt(e.getXY());
				POWER_OP.filterEnableMenuOfExtjs(roleRightMenu, CURRENT_USER.getSystemPower());
			},
			uploadSystemMysqlFile : function(btn, e, eOpts) {
				btn.disable();
				var window = btn.up("window");
				if (isNull(window)) {
					btn.enable();
					return ;
				}
				// 检测导入文件格式
				var filePath = window.query("fileuploadfield")[0].getValue();
				suffix = filePath.substring(filePath.lastIndexOf(".") + 1);
				if ("sql" != suffix) {
					Ext.Msg.alert(local.window.tip, local.config.dataFiles);
					btn.enable();
					return ;
				}
				// 导入数据库数据文件
				Ext.Msg.confirm(local.config.prompt, local.config.dataFiles,
						function(bt) {
							if ('yes' == bt) {
								window.down("form").getForm().submit(										
										{
											waitMsg : local.config.importFiles,
											method : 'post',
											type : 'submit',
											url : '/config/toSystemConfigAction!uploadMysqlFile.action',
											success : function(form, action) {
												var result = action.result.sqlresult;
												window.close();
												if (isNull(result)) {
													Ext.MessageBox.alert(local.window.tip, local.config.connectionFailed);
												} else if (result.indexOf('true') == 0) {
													Ext.MessageBox.alert(local.window.tip, local.config.successfully);
												} else {													
									Ext.MessageBox.alert(local.window.tip, local.config.restoreFailure+"<br>"+local.config.failureInfor+local.colon+"<br>"+result);
												}												
											},
											failure : function(response, options) {												
//												Ext.MessageBox.alert(local.window.tip, local.config.databaseFailure);
												Ext.websure.MsgError("WF-30057", local.config.databaseFailure);
											}
										});
							} else {
								window.close();
							}
						}, this);
			},
			initDatabaseBackupWindow : function(me, eOpts) {
				if (!me) {
					return;
				}
				if (isNull(SYSTEM_CONFIG_INFO)) {
					SYSTEM_CONFIG_INFO = getSystemServerConfigInfo();
				}
				var switchon = SYSTEM_CONFIG_INFO.isBackupDB;
				me.query('#backuppath')[0].setValue(SYSTEM_CONFIG_INFO.backupDBPath);
				if (isNull(switchon) || switchon == 0) {
					me.query('#databaseConfigSet')[0].collapse();
				} else {
					me.query('#databaseConfigSet')[0].expand();
					
				}
			},
			configDBAutoExport : function(btn, e, eOpts) {
				btn.disable();
				var window = btn.up('window');
				var path = window.query('#backuppath')[0].getValue();
				var switchon = window.query('#databaseConfigSet')[0].collapsed ? 0 : 1;
				if (1 == switchon) {
					if (isNull(path)) {
						Ext.Msg.alert(local.window.tip, local.config.pathIsNoNull);
						btn.enable();
						return false;
					} 
					if (notLinuxPath(path)) {
						Ext.Msg.alert(local.window.tip, local.config.pathIsNoLegal);
						btn.enable();
						return false;
					}
				}
				/*if (switchon == 1) {
					Ext.Msg.alert(local.window.tip, '请选择或填写自定义路径!');
					btn.enable();
					return ;
				}
				var path = EMPTY;
				if (checks.length > 0) {
					path = checks[0].get('path');
				}				*/
				Ext.Ajax.request({
					method : 'post',
					url : '/config/toSystemConfigAction!updateDatabaseBackupPath.action',
					params : {
						switchon : switchon,
						path : path
					},
					success : function(response, options) {
						try {
							var obj = eval("(" + response.responseText + ")");
							window.close();
							showResultDialog(obj.msgCode, obj.msgContent);
							SYSTEM_CONFIG_INFO.backupDBPath = path;
							SYSTEM_CONFIG_INFO.isBackupDB = switchon;
							refreshPageDataForDatabaseBackup(SYSTEM_CONFIG_INFO);
						} catch (e) {
							window.close();
							Ext.websure.MsgError("", local.config.msgError);
						}
					},
					failure : function(response, options) {
						window.close();
						Ext.websure.MsgError("WF-30058",local.config.backupPath);
					}
				});
			},	
			initVmsWarnThreshold : function(me,opt){
                //存储介质报警阈值回显
                if(SYSTEM_CONFIG_INFO.warningStorage!=0){
                    me.query('numberfield')[0].setValue(SYSTEM_CONFIG_INFO.warningStorage);
                }
            },
            saveVmsWarnThreshold : function(btn,e,opts){
                var window = btn.up('window');
                var warningStorage = window.query('numberfield')[0].getValue();
                //把全角数字转换为半角
            	var str=warningStorage+"";
                var result="";  
                for (var i = 0; i < str.length; i++){  
                    if (str.charCodeAt(i)==12288){  
                        result+= String.fromCharCode(str.charCodeAt(i)-12256);  
                        continue;  
                    }  
                    if (str.charCodeAt(i)>65280 && str.charCodeAt(i)<65375){  
                        result+= String.fromCharCode(str.charCodeAt(i)-65248);  
                    }else{  
                        result+= String.fromCharCode(str.charCodeAt(i));  
                    }  
                } 
                warningStorage=result;
                 //对阈值大小进行验证
                if(warningStorage>99 || warningStorage<50){
                    return;
                };
                Ext.Ajax.request({
                    method : 'post',
                    url : '/config/toSystemConfigAction!updateVMSThreshold.action',
                    params : {
                        vmsThreshold : warningStorage
                    },
                    success : function(response, options){
                        window.close();
                        showResultDialog(30000,local.config.updateVMSWarningVSuccess);
                        SYSTEM_CONFIG_INFO.warningStorage = warningStorage;
                        refreshVMSWarnThreshold(SYSTEM_CONFIG_INFO);
                    },
                    failure : function(response, options){
                        window.close();
                        Ext.websure.MsgError("WF-30059", local.config.updateVMSWarningVError);
                    }
                });
            },
			initLicenseConfigPage : function(me) {
				// init
			},
			openActiveOnlineWindow : function(btn, e, eOpts) {
				var window = Ext.create('acesure.config.view.license.LicenseActiveOnlineWindow').show();
				loadLicenseCustomerInfo(window.down('form'));
			},
			openActiveOfflineWindow : function(btn, e, eOpts) {
				var window = Ext.create('acesure.config.view.license.LicenseActiveOfflineWindow').show();
				loadLicenseCustomerInfo(window.down('form'));
			},
			/*openRegisterProductWindow : function(btn, e, eOpts) {
				var window = Ext.create('acesure.config.view.license.LicenseRegisterWindow').show();
				loadLicenseCustomerInfo(window.down('form'));
			},
			openActiveProductWindow : function(btn, e, eOpts) {
				Ext.create('acesure.config.view.license.LicenseActiveWindow').show();
			},*/
			activeProduct : function(btn, e, eOpts) {
				btn.disable();
				var window = btn.up('window');
				if (!window) {
					btn.enable();
					return ;
				}
				var form = window.down('form');
				if (!form.getForm().isValid()) {
					btn.enable();
					return ;
				}
				var readyPids = window.query('#readyPids')[0].getValue();
				var donePids = window.query('#donePids')[0].getValue();
				var regular = validatePids(readyPids, donePids);
				if (!regular) {
					btn.enable();
					return ;
				}
				var task = new Ext.LoadMask(Ext.getBody(), {msg : local.config.activated});
				task.show();
				var self = this;
				form.getForm().submit({					
					method : 'post',
					type : 'submit',
					params : {
						pids : readyPids
					},
					url : '/config/toLicenseAction!onlineActive.action',
					success : function(form, action) {
						try {
							// according to the variable 'ret' to determine result
							var detail = action.result;
							var ret = detail.retVal;							
							if (0 == ret) {
								showResultDialog(detail.msgCode, detail.msgContent);
								self.getLicenseList().getStore().load();
							} else if (1 == ret) {
								Ext.websure.MsgTip.msg(local.window.tip, local.config.postSuccessGetEmail, true);
							} else {
								Ext.websure.MsgError("", local.config.registerFailure);
							}
							window.close();														
							task.hide();
						} catch (e) {
							window.close();
							task.hide();
							Ext.websure.MsgError("", local.config.msgError);
						}
					},
					failure : function(form, action) {
						window.close();
						task.hide();
						Ext.websure.MsgError("WF-30060", local.config.abnormal);
						
						//Ext.websure.MsgError("", "激活异常!");

					}
				});
			},
			downloadProduct : function(btn, e, eOpts) {
				btn.disable();
				var window = btn.up('window');
				if (!window) {
					btn.enable();
					return ;
				}
				var form = window.down('form');
				if (!form.getForm().isValid()) {
					btn.enable();
					return;
				}
				var readyPids = window.query('#readyPids')[0].getValue();
				var donePids = window.query('#donePids')[0].getValue();
				var regular = validatePids(readyPids, donePids);
				if (!regular) {
					btn.enable();
					return false;
				}
				var task = new Ext.LoadMask(Ext.getBody(), {msg : local.config.beingDownloaded});
				task.show();
				
				form.getForm().submit({					
					method : 'post',
					type : 'submit',
					params : {
						pids : readyPids
					},
					url : '/config/toLicenseAction!offlineDownloadLcs.action',
					success : function(form, action) {
						try {
							parent.location.href = "/config/toLicenseAction!offlineDownload.action?readyPids=" + readyPids;
							window.close();
							Ext.Msg.alert(local.window.tip,local.config.lcsSendEmail);
							task.hide();
						} catch (e) {
							window.close();
							task.hide();
							Ext.websure.MsgError("", local.config.msgError);
						}
					},
					failure : function(form, action) {
						window.close();
						task.hide();
						Ext.websure.MsgError("WF-30061", local.config.downloadAbnormal);
						
						//Ext.websure.MsgError("", "下载异常!");
					}
				});
			},
			uploadActiveProduct : function(btn, e, eOpts) {
				btn.disable();
				var window = btn.up('window');
				if (!window) {
					btn.enable();
					return ;
				}
				var form = window.down('form');
				if (!form.getForm().isValid()) {
					btn.enable();
					return ;
				}
				// check file-format of the upload file by suffix
				var filePath = window.query("fileuploadfield")[0].getValue();
				//console.info(getPath(window.query("fileuploadfield")[0]));
				suffix = filePath.substring(filePath.lastIndexOf(".") + 1);
				if ("dat" != suffix) {
					Ext.Msg.alert(local.window.tip,local.config.datFile);
					btn.enable();
					return ;
				}
				var task = new Ext.LoadMask(Ext.getBody(), {msg : local.config.activated});
				task.show();
				var self = this;
				form.getForm().submit({					
					method : 'post',
					type : 'submit',					
					url : '/config/toLicenseAction!uploadLicenseFile.action',
					success : function(form, action) {
						try {
							var detail = action.result;	
							window.close();
							showResultDialog(detail.msgCode, detail.msgContent);
							self.getLicenseList().getStore().load();
							task.hide();
						} catch (e) {
							window.close();
							task.hide();
							Ext.websure.MsgError("", local.config.msgError);
						}
					},
					failure : function(form, action) {
						window.close();
						task.hide();
						Ext.websure.MsgError("WF-30062",local.config.abnormal);

						//Ext.websure.MsgError("", "激活异常!");
					}
				});
			},
			activeProductOnline : function(btn, e, eOpts) {
				btn.disable();
				var window = btn.up('window');
				if (!window) {
					btn.enable();
					return ;
				}
				var form = window.down('form');
				if (!form.getForm().isValid()) {
					btn.enable();
					return ;
				}
				var readyPids = window.query('#readyPids')[0].getValue();
				var donePids = window.query('#donePids')[0].getValue();
				var regular = validatePids(readyPids, donePids);
				if (!regular) {
					btn.enable();
					return ;
				}
				var task = new Ext.LoadMask(Ext.getBody(), {msg : local.config.activated});
				task.show();
				var self = this;
				form.getForm().submit({					
					method : 'post',
					type : 'submit',
					params : {
						pids : readyPids
					},
					url : '/config/toLicenseAction!onlineActive.action',
					success : function(form, action) {
						try {
							// according to the variable 'ret' to determine result
							var detail = action.result;
							var ret = detail.retVal;							
							if (0 == ret) {
								showResultDialog(detail.msgCode, detail.msgContent);
								self.getLicenseList().getStore().load();
							} else if (1 == ret) {
								Ext.websure.MsgTip.msg(local.window.tip, local.config.postSuccessGetEmail, true);
							} else {
								Ext.websure.MsgError("", local.config.registerFailure);
							}
							window.close();														
							task.hide();
						} catch (e) {
							window.close();
							task.hide();
							Ext.websure.MsgError("", local.config.msgError);
						}
					},
					failure : function(form, action) {
						window.close();
						task.hide();
						Ext.websure.MsgError("WF-30063", local.config.abnormal);
					}
				});
			},
			activeProductOffline : function(btn, e, eOpts) {
				//btn.disable();
				var window = btn.up('window');
				if (!window) {
					btn.enable();
					return ;
				}
				//var form = window.down('form');
				var form = window.query('#activeForm')[0];
				if (!form.getForm().isValid()) {
					btn.enable();
					return ;
				}
				// check file-format of the upload file by suffix
				var filePath = window.query("fileuploadfield")[0].getValue();
				if (isNull(filePath)) {
					Ext.Msg.alert(local.window.tip, local.config.fileNoNull);
					btn.enable();
					return ;
				}
				//console.info(getPath(window.query("fileuploadfield")[0]));
				suffix = filePath.substring(filePath.lastIndexOf(".") + 1);
				if ("dat" != suffix) {
					Ext.Msg.alert(local.window.tip, local.config.datFile);
					btn.enable();
					return ;
				}
				var task = new Ext.LoadMask(Ext.getBody(), {msg : local.config.activated});
				task.show();
				var self = this;
				form.getForm().submit({					
					method : 'post',
					type : 'submit',					
					url : '/config/toLicenseAction!uploadLicenseFile.action',
					success : function(form, action) {
						try {
							var detail = action.result;	
							window.close();
							showResultDialog(detail.msgCode, detail.msgContent);
							self.getLicenseList().getStore().load();
							task.hide();
						} catch (e) {
							window.close();
							task.hide();
							Ext.websure.MsgError("", local.config.msgError);
						}
					},
					failure : function(form, action) {
						window.close();
						task.hide();
						Ext.websure.MsgError("WF-30064", local.config.abnormal);
					}
				});
			},
			showLicenseDetailedInfo : function(view, record, item, index, e, obj) {
				
				// 打开切换按钮
				var switchButton = Ext.getCmp("switchViewBtnId");
				switchButton && switchButton.show();
				
				var reg = record.data;
				var day = reg.remainday;	
				
				var lcsData = {						
						compute_node_num : reg.compute_node_num,
						run_vm_total : reg.run_vm_total,
						emergency_run_vm_num : reg.emergency_run_vm_num,
						emulation_run_vm_num : reg.emulation_run_vm_num,
						emergency_cpu_num : reg.emergency_cpu_num,
						emergency_memory_size : reg.emergency_memory_size,
						enable_auto_emergency_function : reg.enable_auto_emergency_function,
						storage_node_num : reg.storage_node_num,
						enable_create_empty_disk : reg.enable_create_empty_disk,
						total_backup_capicity : reg.total_backup_capicity,
						emergency_client_num : reg.emergency_client_num,
						emulation_client_num : reg.emulation_client_num,
						enable_fc_mount : reg.enable_fc_mount,
						enable_lan_free_backup : reg.enable_lan_free_backup,
						lcs_day_num : reg.lcs_day_num,						
						enable_disaster_toletance : reg.enable_disaster_toletance,
						physical_num : reg.physical_num,
						virtual_num : reg.virtual_num,
						max_snap_num : reg.max_snap_num,
						max_snap_data_set_num : reg.max_snap_data_set_num,
						backup_db_client_num : reg.backup_db_client_num,
						master_slave_model : reg.master_slave_model,
						double_master_model : reg.double_master_model,
						multi_master_mode : reg.multi_master_mode,
						enable_monitor : reg.enable_monitor,
						enable_monitor_system : reg.enable_monitor_system,
						enable_monitor_web : reg.enable_monitor_web,
						enable_monitor_db : reg.enable_monitor_db,
						enable_monitor_user_defined_script : reg.enable_monitor_user_defined_script,
						enable_little_backup : reg.enable_little_backup,  //小颗粒备份开关
						physical_left_num : reg.physical_left_num,  //物理机剩余授权个数
						virtual_left_num : reg.virtual_left_num,  //虚拟机剩余授权个数
						client_changed_number : reg.client_changed_number,  //客户端授权变更次数
						client_change_left_num : reg.client_change_left_num,  //客户端授权变更剩余次数
						enable_cluster_backup : reg.enable_cluster_backup,  //集群备份开关
						totalNum : reg.totalNum,	// 客户端所有点数
						totalLeftNum : reg.totalLeftNum,	// 客户端多有剩余点数
						usedPhysicalNum : reg.usedPhysicalNum,	// 已使用的物理点数量
						usedVirtualNum : reg.usedVirtualNum,	// 已使用的虚拟点数量
						emergency_client_used_num : reg.emergency_client_used_num,	// 已使用的应急数量
						emulation_client_used_num : reg.emulation_client_used_num,	// 已使用的演练数量
						// added by lids on 2017年6月7日10:45:18
						computeNodeAuthedNum : reg.computeNodeAuthedNum,
						storageNodeAuthedNum : reg.storageNodeAuthedNum,
						dbBackupAuthedNum : reg.dbBackupAuthedNum
				};

//				console.debug("lcsData", lcsData);
				
				if (0 == reg.type) {
					var rootNode = this.getLicenseList().getRootNode().childNodes[0];
					var childNodes = rootNode.childNodes;	
					for (var i = 0; i < childNodes.length; i++) {
						var nodeData = childNodes[i].data;
						for (var p in lcsData) {
							lcsData[p] = formatLicenseBasePacketInfo(lcsData[p], nodeData[p], nodeData['uuid']);
						}						
					}
				}
				
				var basicPanel = Ext.getCmp("licenseBasicPackageId");
				var advanvedPanel = Ext.getCmp("licenseAdvancePackageId");
				
				
				basicPanel.lcsData = lcsData;
				advanvedPanel.lcsData = lcsData;
				
				basicPanel.fireEvent("afterrender", {'lcsData':lcsData});
				advanvedPanel.fireEvent("afterrender", {'lcsData':lcsData});
				
				var propGridLeft = Ext.getCmp('licensePropertyGridLeft');
				propGridLeft.setSource({
					'uuid' : reg.uuid,
					'compute_node_num' : lcsData.compute_node_num,					
					'run_vm_total' : lcsData.run_vm_total,
					'emergency_run_vm_num' : lcsData.emergency_run_vm_num,
					'emulation_run_vm_num' : lcsData.emulation_run_vm_num,
					'emergency_cpu_num' : lcsData.emergency_cpu_num,
					'emergency_memory_size' : lcsData.emergency_memory_size,
					'enable_auto_emergency_function' : lcsData.enable_auto_emergency_function,
					'storage_node_num' : lcsData.storage_node_num,
					'enable_create_empty_disk' : lcsData.enable_create_empty_disk,
					//'enable_advantage_moving' : reg.enable_advantage_moving,
					'total_backup_capicity' : lcsData.total_backup_capicity,
					'emergency_client_num' : lcsData.emergency_client_num,
					'emulation_client_num' : lcsData.emulation_client_num,
					'enable_fc_mount' : lcsData.enable_fc_mount,
					'enable_lan_free_backup' : lcsData.enable_lan_free_backup,					
					'enable_little_backup' : lcsData.enable_little_backup,
					'enable_cluster_backup' : lcsData.enable_cluster_backup
				});
				propGridLeft.doLayout();
				
				var propGridRight = Ext.getCmp('licensePropertyGridRight');
				propGridRight.setSource({
					'lcs_day_num' : lcsData.lcs_day_num,										
					//'enable_advantage_emergency' : reg.enable_advantage_emergency,
					//'physical_num' : lcsData.physical_num,	
					//'physical_left_num'	: lcsData.physical_left_num,
					//'virtual_num' : lcsData.virtual_num,
					//'virtual_left_num' : lcsData.virtual_left_num,
					'totalNum' : lcsData.totalNum,	// 客户端所有点数
					'usedPhysicalNum' : lcsData.usedPhysicalNum,	// 已使用的物理点数量
					'usedVirtualNum' : lcsData.usedVirtualNum,	// 已使用的虚拟点数量
					'totalLeftNum' : lcsData.totalLeftNum,	// 客户端多有剩余点数
					'backup_db_client_num' : lcsData.backup_db_client_num,
					'max_snap_num' : lcsData.max_snap_num,
					'max_snap_data_set_num' : lcsData.max_snap_data_set_num,	
					//'master_slave_model' : lcsData.master_slave_model,
					//'double_master_model' : lcsData.double_master_model,
					//'multi_master_mode' : lcsData.multi_master_mode,
					'enable_disaster_toletance' : lcsData.enable_disaster_toletance,
					'enable_monitor' : lcsData.enable_monitor,
					'enable_monitor_system' : lcsData.enable_monitor_system,
					'enable_monitor_web' : lcsData.enable_monitor_web,
					'enable_monitor_db' : lcsData.enable_monitor_db,
					'enable_monitor_user_defined_script' : lcsData.enable_monitor_user_defined_script,
                    'client_changed_number' : lcsData.client_changed_number,
                    'client_change_left_num' : lcsData.client_change_left_num,
				});
				propGridRight.doLayout();
				
				Ext.getCmp("licensePreviewPanelId").show();
                Ext.getCmp("licensePreviewDefaultPanelId").hide();
			},
			/**
			 * author:yangbobin desc: 存储设置节点设置按钮点击事件 date:2015-11-20
			 */
			configStorage : function(view) {
				var storageNode = checkStorageState();
				if (!storageNode)
					return;

				var storageCfgWin = Ext.create('acesure.config.view.StorageCfgWin').show();

				var isExistPath = storageNode.data.isExistPath;
				if (isExistPath != 1 && isExistPath != 2) {
					storageNode.set('isExistPath', 1);
				}
				storageCfgWin.down('form').loadRecord(storageNode);
			},
			/**
			 * author:yangbobin desc: 添加存储介质事件 date:2015-12-1
			 */
			addStoragePath : function(view) {
				var storageNode = checkStorageState();
				if (!storageNode)
					return;

				var storagePathAddWin = Ext.create(
						'acesure.config.view.StoragePathAddWin').show();
			},
			/**
			 * 初始化存储介质基本信息
			 */
			initStoragePath : function(self) {

				var id = self.query("hidden[id=id]")[0];
				id.setValue(node.id);

				var name = self.query("textfield[id=name]")[0];
				name.setValue(node.name);

				var symbol = self.query("textfield[id=symbol]")[0];
				// 生成存储别名
				Ext.Ajax.request({
							url : '/config/tostorageConfigAction!genNewSymbol.action',
							timeout : 10000, // 设置10秒超时
							success : function(response, options) {
								var res = JSON.parse(response.responseText);
								var newSymbol = res.newSymbol;
								symbol.setValue(newSymbol);
							},
							failure : function(resp, opts) {
								Ext.websure.MsgError("WF-30065",local.config.webCreate);
							}
						});

				// 加载IP列表
				var ipLanCombo = self.query("combo[id=ipLan]")[0];
				ipLanCombo.store.load({
					params : {
						'storage.id' : node.id
					},
					callback : function(records, operation, success) {
						ipLanCombo.setValue(records[0].data.ipValue);
					}
				});

				// 存储路径选择列表
				var storagePathCombo = self.query("combo[id=storagePath]")[0];
				var myMask = new Ext.LoadMask(storagePathCombo, {
					msg : local.config.storagePath
				});
				myMask.show();
				Ext.Ajax.request({
							url : '/recovery/tostorageAction!getPartitionSizeInfo.action', // 查找存储器路径列表
							timeout : 10000, // 设置10秒超时
							params : {
								'storage.id' : node.id
							},
							success : function(response, options) {
								myMask.hide();
								var res = JSON.parse(response.responseText);
								var parInfo = res.partitionList; // 分区列表
								var msgCode = res.msgCode; // 消息码
								var msgContent = res.msgContent; // 消息内容
								var datas = [];
								if (msgCode != 30000) {
									// 错误反馈提示
									showResultDialog(msgCode,msgContent);
									storagePathCombo.setReadOnly(true); // 防止点击下拉框选择上一次的可用列表
									return;
								}
								var j = 0;
								var len = parInfo.length; // 分区个数
								for (i = 0; i < len; i++) {
									var partition = parInfo[i];
									datas.push([
													j++, // valfield
													partition.diskName
															+ "/StoreBackup", // diskName
													partition.diskName
															+ "/StoreBackup"
															+ "/ ["+local.config.layout+local.colon
															+ partition.diskFormatType
															+ local.config.dimensions+local.colon
															+ formatSize(partition.diskTotalSize)
															+ local.config.haveSize+local.colon
															+ formatSize(partition.diskUsedSize)
															+ "]",// disfield
													partition.diskTotalSize, // size
													partition.diskUsedSize // usedSize
											]);
								}
								if (datas != "") {
									storagePathCombo.store.loadData(datas);
									storagePathCombo.setValue(0); // 默认选择
								} else {
									storagePathCombo.setValue(local.config.allocatedComplete);
									storagePathCombo.setReadOnly(true);
								}

							},
							failure : function(resp, opts) {
								myMask.hide();
								Ext.websure.MsgError("WF-30066",local.config.webabNormal);
								storagePathCombo.setReadOnly(true);
							}
						});
			},
			/**
			 * author:yangbobin desc: 添加存储介质 date:2015-12-16
			 */
			saveStoragePath : function() {
				// 存在非法字符
				if (!Ext.getCmp('storagePathAddForm').getForm().isValid()) {
					return;
				}
				// 路径分配完毕
				if (Ext.getCmp('storagePath').getValue() == local.config.allocatedComplete) {
					Ext.websure.MsgError(local.null0, local.config.cannotEmpty);
					return;
				}

				var myMask = new Ext.LoadMask('storagePathAddWin', {
					msg : local.config.addVMSing
				});
				myMask.show();

				var index = Ext.getCmp('storagePath').getValue();
				var record = Ext.getCmp('storagePath').getStore()
						.getAt(index);// 获取磁盘分区
				var storageId = Ext.getCmp('id').getValue();
				var symbol = Ext.getCmp('symbol').getValue();
				var ipLan = Ext.getCmp('ipLan').getValue();

				// 添加存储路径
					Ext.Ajax.request({
							url : '/config/tostorageConfigAction!addStoragePath.action',
							timeout : 10000, // 设置10秒超时
							params : {
								'storagePath.storageId' : storageId,
								'storagePath.size' : record.get('size'),
								'storagePath.usedSize' : record.get('usedSize'),
								'storagePath.symbol' : symbol,
								'storagePath.path' : record.get('diskName'),
								'storagePath.ipLan' : ipLan
							},
							success : function(response, opts) {
								
                                    var addVMSTask = new Ext.util.DelayedTask(function(){
                                                        myMask.hide();
                                                        var res = JSON.parse(response.responseText);
                                                        var msgCode = res.msgCode;
                                                        var msgContent = res.msgContent;
                                                        // 关闭添加窗口,更新面板信息
                                                        Ext.getCmp('storagePathAddWin').close();
                                                        Ext.getCmp('storageConfigTreePanel').getStore().load();
                                                        // 更新详细信息面板
                                                        refreshInfoGrid();
                                                        // 操作反馈
                                                        showResultDialog(msgCode, msgContent);
                                               });  
                                    addVMSTask.delay(5000); //延迟5秒钟 								
							},
							failure : function(resp, opts) {
								myMask.hide();
								// 关闭添加窗口,更新面板信息
								Ext.getCmp("storagePathAddWin").close();
								Ext.getCmp('storageConfigTreePanel').getStore().load();
								Ext.websure.MsgError("WF-30067",local.config.webabNormal);
							}
						});
			},
			/**
			 * author:yangbobin desc: 保存存储器修改 date:2015-12-16
			 */
			saveStorageCfg : function() {
				if (!Ext.getCmp('storageCfgForm').getForm().isValid()) {
					return;
				}
				var myMask = new Ext.LoadMask('storageCfgWin', {
					msg : local.config.enjoyDay
				});
				myMask.show();
				Ext.getCmp('storageCfgForm').getForm().submit({
                                method : 'post',
                                type : 'submit',
                                url : '/config/tostorageConfigAction!updateStorage.action',
                                success : function(form, action) {
                                
                                    var modStoTask = new Ext.util.DelayedTask(function(){
                                                                myMask.hide();
                                                                var msgCode = action.result.msgCode;
                                                                var msgContent = action.result.msgContent;
                                                                // 关闭设置窗口
                                                                Ext.getCmp("storageCfgWin").close();
                                                                Ext.getCmp('storageConfigTreePanel').getStore().load();
                                                                // 更新详细信息面板
                                                                refreshInfoGrid();
                                                                showResultDialog(msgCode,msgContent);
                                               });  
                                    modStoTask.delay(5000); //延迟5秒钟 
                                },
                                failure : function(form, action) {
                                    myMask.hide();
                                    Ext.getCmp("storageCfgWin").close();
                                    Ext.getCmp('storageConfigTreePanel').getStore().load();

                                    Ext.websure.MsgError('WF-30068',local.config.webError);
                                }
                            }); 
			},
			/**
             * 新增介质同步
             */
            addSynchStPath : function(){
                var synchStPathAddWin = Ext.create('acesure.config.view.SynchStPathAddWin');
                synchStPathAddWin.show();
            }

		});		