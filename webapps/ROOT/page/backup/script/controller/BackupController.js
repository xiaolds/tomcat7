// Ext.Loader.setConfig({enabled: true});
Ext.define('websure.backup.controller.BackupController', {
	extend : 'Ext.app.Controller',
	alias : "widget.BackupController",
	views : ['BackupConfig', 'BackupView', 'DeviceBackup', 'ForeWarningView','DoubleComputerConfig','CreateGroup',
				'MonitorConfig','ExtraDeviceMode','DeviceDesConfig','AttachedTask','EditWarningConfig',
				'CreateNewDevice','CreateOperationLog','GroupNameUpdate','DbBackupConfig','ShowRunLog','ReadLog',
				'ClusterView','ClusterBasicConfig','CreateClusterShareHard','ClusterBackupConfig','InstallBackupClient'],
	models : ['DiskInfoModel', 'DualComputerModel', 'SelectSharedDiskModel','shareDiskModel','StrategyInfoModel',
				'DeviceLogModel','SysLogConfigModel','ProcessWarningConfigModel','ServerWarningConfigModel',
				'SetupWarningConfigModel','NewStorageConfigModel','ImitateModel','AlarmHistoryModel',
				'BackupTaskInfoModel','StorageConfigDBModel','BackupDBLogModel','ShowRunLogModel',
				'ClusterDeviceModel','ClusterShareDiskModel','ClusterAllDeviceHardDiskModel',
				'ClusterDiskInfoModel','ClusterStorageConfigModel','ClusterViewDeviceModel',
				'ClusterStrategyInfoModel','ClusterDeviceLogModel','ClientInfoModel'],
	stores : ['GlobalTreeStore','DiskInfoStore', 'CpuUseStore', 'MemoryUseStore','NetworkUseStore', 
				'StorageUseStore', 'DualComputerStore','SelectSharedDiskStore','shareDiskStore',
				'StrategyInfoStore','DeviceLogStore','CreateGroupTreeStore','CreateGroupDeviceShowStore',
				'SysLogConfigStore','ProcessWarningConfigStore','ServerWarningConfigStore',
				'SetupWarningConfigStore','NewStorageConfigStore','ImitateStore','AlarmHistoryStore',
				'BackupTaskInfoStore','NetNameStore','DiskNameStore','WarningServerTypeStore','StorageConfigDBStore',
				'BackupDBLogStore','ShowRunLogStore','ClusterDeviceStore','ClusterShareDiskStore',
				'ClusterAllDeviceHardDiskStore','ClusterDeviceDiskTreeStore','ClusterShareDiskTreeStore',
				'ClusterStorageConfigStore','ClusterStorageConfigStore','ClusterViewDeviceStore',
				'ClusterStrategyInfoStore','ClusterDeviceLogStore'],
	init : function() {
		this.control({
					'DeviceBackup button[id=backupconfig]' : {
						click : this.backupconfigshow
						// 当页面进行渲染的时候就会触发该应用程序的backupconfigshow方法。
					},
					//预警配置
					'DeviceBackup button[id=warningconfig]' : {
						click : this.warningconfigshow
					},
					//数据库定时备份配置
					'DeviceBackup button[id=backup_db_config]' : {
						click : this.backupdbconfigshow
					},
					'ForeWarningView button[id=warnConfig]' : {
						click : this.warnConfig
					},
					// 配置双机
					'DoubleComputerConfig button[id=configDoubleDevice]' : {
						click : this.configDoubleDevice
					},
					//预警配置 - 保存
					'monitorConfigWindow button[id=minitorSaveButton]':{
						click: this.minitorSaveButton
					},//预警配置-模拟监控增加
					'imitateGrid actioncolumn':{
						itemclick: this.actionBtnEvent
					},//预警配置-模拟监控增加
					'addMonitorConfigWindow button[id=addSaveButtonScript]' : {
						click : this.addSaveButtonScript
					},//预警配置-模拟监控-模拟测试
					'addMonitorConfigWindow button[id=testImitateButton]' : {
						click : this.testImitateButton
					},//预警配置-模拟监控-模拟测试修改
					'editWarningConfig button[id=testEditImitateButton]' : {
						click : this.testEditImitateButton
					},//预警配置-模拟监控修改
					'editWarningConfig button[id=editSaveButtonScript]' : {
						click : this.editSaveButtonScript
					},
					'showRunLog':{
					      itemcontextmenu : this.runLogOpera
					}
					
				});
	},
	backupconfigshow : function() {
		var parId = Ext.getCmp('DeviceBackup').deId;
		var parMac = Ext.getCmp('DeviceBackup').deMac;
		var parUUid = Ext.getCmp('DeviceBackup').deuuid;
		var parIp = Ext.getCmp('DeviceBackup').deIp;
		var param = {
    		parId : parId,
    		parUUid : parUUid,
    		parMac: parMac,
    		parIp:parIp
    	};
		var name = Ext.getCmp("backupconfig").getText();
		var type = Ext.getCmp("backupconfig").type;
		
		if("1"== type){
			//获取diskClone状态
          Ext.Ajax.request({
					url : '/backup/tobackupAction!getDiskCloneState.action',
					params : {
						deviceId : parId
					},
					success : function(response, options) {
						var obj=Ext.decode(response.responseText);
						if(4 == obj.msg){//reset
							Ext.MessageBox.alert(local.window.tip, '');
							return;
						}else if(2 == deviceStatus){
							Ext.MessageBox.alert(local.window.tip, local.backup.resetTip);
							return;
						}else{
							//将diskClone状态置为4，当配置完成后再将状态为置为2（暂停）
							Ext.create('websure.backup.view.BackupConfig',param).show();
						}
					},
					failure : function() {
						//Ext.MessageBox.alert(local.window.tip, local.backup.getDiskCloneFailureContact);
						Ext.websure.MsgError("WF-30001", local.backup.getDiskCloneFailureContact);
					}
				});
		}/*else if("3" == type){
			Ext.MessageBox.alert(local.window.tip, local.backup.creatDBBackupTask);
		}else if("4" == type){
			Ext.MessageBox.alert(local.window.tip,local.backup.creatDBCopyTask);
		}*/
	},
	//预警配置
	warningconfigshow : function(){
		var parId = Ext.getCmp('DeviceBackup').deId;
		var parMac = Ext.getCmp('DeviceBackup').deMac;
		var parUUid = Ext.getCmp('DeviceBackup').deuuid;
		var parIp = Ext.getCmp('DeviceBackup').deIp;
		var parStatus = Ext.getCmp('DeviceBackup').deStatus;
		var licenseWarningSystem = Ext.getCmp('DeviceBackup').licenseWarningSystem;
		var licenseWarningDB = Ext.getCmp('DeviceBackup').licenseWarningDB;
		var licenseWarningUrl = Ext.getCmp('DeviceBackup').licenseWarningUrl;
		var licenseWarningScript = Ext.getCmp('DeviceBackup').licenseWarningScript;
		var param = {
    		parId : parId,
    		parUUid : parUUid,
    		parMac: parMac,
    		parStatus : parStatus,
    		parIp:parIp,
    		licenseWarningSystem:licenseWarningSystem,
    		licenseWarningDB:licenseWarningDB,
    		licenseWarningUrl:licenseWarningUrl,
    		licenseWarningScript:licenseWarningScript
    	};
		var wtype = Ext.getCmp("warningconfig").type;
		if("2" == wtype){
			Ext.create('websure.backup.view.MonitorConfig',param).show();
			
			//判断性能监控是否授权，0：未授权，1：已授权
			if(licenseWarningSystem == 0){
				Ext.getCmp("minitorSaveButton").setDisabled(true);
			}else{
				Ext.getCmp("minitorSaveButton").setDisabled(false);
			}
		}
	},
	//数据库定时备份配置
	backupdbconfigshow : function(){
		var parId = Ext.getCmp('DeviceBackup').deId;
		var parMac = Ext.getCmp('DeviceBackup').deMac;
		var parUUid = Ext.getCmp('DeviceBackup').deuuid;
		var parIp = Ext.getCmp('DeviceBackup').deIp;
		var parStatus = Ext.getCmp('DeviceBackup').deStatus;
		var param = {
    		parId : parId,
    		parUUid : parUUid,
    		parMac: parMac,
    		parStatus : parStatus,
    		parIp:parIp,
    		operaType:1
    	};
		var wtype = Ext.getCmp("backup_db_config").type;
		if("3" == wtype){
			Ext.create('websure.backup.view.DbBackupConfig',param).show();
		}
	},
	warnConfig : function() {
		//alert("aa")
	},
	configDoubleDevice : function() {

		// 查询两台设备的系统是否一致
		var targetDeviceId = Ext.getCmp("selectDeviceId").getValue();// 目标设备
		var sourceDeviceId = Ext.getCmp("currentDeviceId").getValue();// 源设备
		var targetSys;
		var sourceSys;

		Ext.Ajax.request({
					url : '/backup/todeviceAction!checkClientSysByTwoDevice.action',
					params : {
						tarDeviceId : targetDeviceId,
						souDeviceId : sourceDeviceId
					},
					success : function(response, options) {
						var obj = Ext.decode(response.responseText);
						if (obj.success) {
							var tree = Ext.getCmp('selectSharedDiskList');
							var checkedNodes = tree.getChecked();// tree必须事先创建好.
								//判断选中的是否为根节点
							if(checkedNodes.length == 1 && "root" == checkedNodes[0].data.id){
								Ext.MessageBox.alert(local.window.tip, local.backup.chooseSharePart,
									function() {
									});
									return
							}
							var partitionList = [];
							var volumeList = [];
							var hardDiskLength = [];
							if(checkedNodes.length>0){
								for (var i = 0; i < checkedNodes.length; i++) {

									var hardName = checkedNodes[i].data.hardName;
									console.log(checkedNodes[i].data);
									if ("" != hardName && null != hardName) {
										hardDiskLength.push(hardName);
									}
									if(null != checkedNodes[i].data.partitionId && "" != checkedNodes[i].data.partitionId){
//										partitionList.push(checkedNodes[i].data.partitionId)
										//LVM卷和普通卷的区分
										Ext.Array.each(checkedNodes[i].data, function(item){
								        	if(1 == item.hardType){//普通
								        		partitionList.push(item.partitionId);
								        	}else if(2 == item.hardType){//LVM
								        		volumeList.push(item.partitionId);
								        	}
										});
										
									}
								}
								
								if (hardDiskLength.length > 1) {
								Ext.MessageBox.alert(local.window.tip, local.backup.chooseAgainSharePart);
								return;
							}
								
								Ext.Ajax.request({
									url : '/backup/todeviceAction!checkPartitionByTwoDevice.action',
									params : {
										partitionCheckItems : partitionList,
										volumeCheckItems : volumeList,
										tarDeviceId : targetDeviceId,
										souDeviceId : sourceDeviceId
									},
									success : function(response, options) {
										var obj=Ext.decode(response.responseText);
										console.log(obj);
										var code = obj.msgCode;
										var content = obj.msgContent;
										if(MSG_NORMAL==code){
											Ext.websure.MsgTip.msg(local.window.tip, content, true);
											Ext.getCmp('DoubleComputerConfig').close();  
											Ext.getCmp("grobleTreePanel").getStore().reload();
										}else{
											Ext.websure.MsgError(code, content);
										}
										/*var obj=Ext.decode(response.responseText);
														if("1"==obj.msg){
															Ext.MessageBox.alert(local.window.tip, '双机设置成功!',function(){
																Ext.getCmp('DoubleComputerConfig').close();  
																var tree = Ext.getCmp("grobleTreePanel").getStore().reload();
															});
														}else{
															Ext.MessageBox.alert(local.window.tip, obj.msg,function(){
															});
															return;
														}*/
									}
									
								});
							
							}else{
								Ext.MessageBox.alert(local.window.tip, local.backup.chooseSharePart);
									return;
							}
							
						} else {
							Ext.MessageBox.alert(local.window.tip, local.backup.chooseMatchDoublePcTip);
							return
						}
					},
					failure : function() {
						//Ext.MessageBox.alert(local.window.tip, local.backup.sysMatchFailure);
						Ext.websure.MsgError("WF-30002",local.backup.sysMatchFailure);
					}
				});

	},
	minitorSaveButton : function(column, grid, rowIndex, colIndex, node, e, record, rowEl) {
		//硬件信息 值
		var cupMultislider = document.getElementById("cupMultislider").value;
		var memMultislider = document.getElementById("memMultislider").value;
		var netMultislider = document.getElementById("netMultislider").value;
		var diskMultislider = document.getElementById("diskMultislider").value;
		//持续时间值
		var contIntervalSlider = document.getElementById("contIntervalSlider").value;
		//持续时间单位,默认分钟
		var contIntervalSliderUnit = 3;
		//检测频率
		var intervalSlider = document.getElementById("intervalSlider").value;
		var intervalSliderUnit = 3;
		if(intervalSlider > 59 && intervalSlider <= 75){    //小时
			intervalSlider = intervalSlider-59;
			intervalSlider = Math.ceil(intervalSlider/2);
			intervalSliderUnit = 2;    //小时
		}
		
		//设置保存，遮罩层
		var load_mask_config = new Ext.LoadMask(Ext.getCmp("MonitorConfigWindow"), {
			msg : local.backup.configSavingMsg,
			removeMask : true    //完成后移除
		});
		load_mask_config.show();    //显示
		
		Ext.Ajax.request({
			url : '/backup/tomonitorAction!saveWarningConfig.action',
			params: {
				cupMultislider : cupMultislider,
				memMultislider : memMultislider,
				netMultislider : netMultislider,
				diskMultislider : diskMultislider,
				"warningConfigInfo.configRunTimeInterval" : intervalSlider,
				"warningConfigInfo.configRunTimeIntervalUnit" : intervalSliderUnit,
				"warningConfigInfo.configContRunTimeInterval" : contIntervalSlider,
				"warningConfigInfo.configContRunTimeIntervalUnit" : contIntervalSliderUnit,
				deviceId : warnDeviceId,
				deviceMac : warnDeviceMac,
				configModelId : minitorCurrentPanel
		    },
			success : function(response, options) {
				load_mask_config.hide();    //隐藏
				var obj = Ext.decode(response.responseText);
	    		
		    	//提示框 延时加载
		    	var d = new Ext.util.DelayedTask(function(){  
		    		showResultDialog(obj.msgCode, obj.msgContent);
		    	});  
		    	d.delay(800); 
		    	
		    	var  foreWarningTab = Ext.getCmp("2");
	    		foreWarningTab.removeAll(); 
	    		foreWarningTab.add({
	    			xtype : 'foreWarningPanelView'
	    		});
	    		foreWarningTab.doLayout();
				
		    	Ext.getCmp('MonitorConfigWindow').destroy();
			},
			failure : function() {
				load_marsk_config.hide();    //隐藏
//				Ext.MessageBox.alert(local.window.tip,local.backup.saveFailureContactAdmin);
				Ext.websure.MsgError("WF-30033",local.backup.saveFailureContactAdmin);
				
				Ext.getCmp('MonitorConfigWindow').destroy();
			}
		});
		
	},
	actionBtnEvent : function(column, grid, rowIndex, colIndex, node, e, record, rowEl) {
		//id
		var scriptWarningId = record.data.scriptWarningId;
		if(node.action == 'edit'){
			////服务类型 1.URL 2.数据库 3.脚本
			var serverType = record.data.scriptWarningServerType;
			//数据库 1.My Sql 2.Oracle 3.Sql Server
			var scriptDBType = record.data.scriptWarninDB;
			//预警级别 , 1.正常 2.故障 3.警告
			var scriptLevel = record.data.scriptWarningLevel;
			//返回值
			var returnValue = record.data.scriptWarningReturnValue;
			var arry = new Array();   
			
			var edit = Ext.create('websure.backup.view.EditWarningConfig').show();
			var serverTypePanel = Ext.getCmp("serverTypePanel");
			var levelWarning = Ext.getCmp("editLevelWarningConfigPanelId");
			serverTypePanel.removeAll();
			levelWarning.removeAll();
			//服务类型 1.URL 2.数据库 3.脚本
			if(serverType == 1){
				serverTypePanel.add({
					xtype : 'editHttpWarningConfigPanel'
				});
				levelWarning.add({
					xtype : 'editHttpLevelWarningConfigPanel'
				});
				if(scriptLevel == 1){
					Ext.getCmp("editSuccessReturn").show();
					Ext.getCmp("editFailedReturn").hide();
					Ext.getCmp("editSuccessDBReturn").hide();
					Ext.getCmp("editFailedDBReturn").hide();
				}else{
					Ext.getCmp("editSuccessReturn").hide();
					Ext.getCmp("editFailedReturn").show();
					Ext.getCmp("editSuccessDBReturn").hide();
					Ext.getCmp("editFailedDBReturn").hide();
				}
			}else if(serverType == 2){
				serverTypePanel.add({
					xtype : 'editDBWarningConfigPanel'
				});
				levelWarning.add({
					xtype : 'editDBLevelWarningConfigPanel'
				});
				if(scriptLevel == 1){
					Ext.getCmp("editSuccessReturn").hide();
					Ext.getCmp("editFailedReturn").hide();
					Ext.getCmp("editSuccessDBReturn").show();
					Ext.getCmp("editFailedDBReturn").hide();
				}else{
					Ext.getCmp("editSuccessReturn").hide();
					Ext.getCmp("editFailedReturn").hide();
					Ext.getCmp("editSuccessDBReturn").hide();
					Ext.getCmp("editFailedDBReturn").show();
				}
			}else{
				serverTypePanel.add({
					xtype : 'editScriptWarningConfigPanel'
				});
				levelWarning.add({
					xtype : 'editScriptLevelWarningConfigPanel'
				});
				Ext.getCmp("editSuccessReturn").hide();
				Ext.getCmp("editFailedReturn").hide();
				Ext.getCmp("editSuccessDBReturn").hide();
				Ext.getCmp("editFailedDBReturn").hide();
			}
			//数据库 1.My Sql 2.Oracle
			var dbTypePanel = Ext.getCmp("editScriptWarningDBPanel");
			if(typeof(dbTypePanel) != "undefined"){
				dbTypePanel.removeAll();
				if(scriptDBType == 1){
					dbTypePanel.add({
						xtype : 'editScriptMysqlDBPanel'
					});
				}else{
					dbTypePanel.add({
						xtype : 'editScriptOracleDBPanel'
					});
				}
			}
			var oldWarningName = Ext.getCmp("oldScriptWarningName");
			oldWarningName.setValue(record.data.scriptWarningName);
			var rec = grid.getStore().getAt(rowIndex);
			if (rec) {
				edit.down('form').loadRecord(rec);
				var intervalValue = record.data.configRunTimeInterval;
				var intervalUnitValue = record.data.configRunTimeIntervalUnit;
				var editScriptInterSlider = document.getElementById("editScriptInterSlider");
				if(intervalUnitValue == 2){    //小时
					intervalValue = (intervalValue*2-2) + 60;
				}
				editScriptInterSlider.value = intervalValue;
	    		getIntervalSliderSliderValue(editScriptInterSlider);
	    		
	    		//预警设置值（不包含自定义脚本）
	    		if(serverType != 3){
	    			if(returnValue != '' && returnValue != null){
	    				arry = returnValue.split("@");
	    				for(var i = 0; i < arry.length; i++){
	    					if(arry[i] == 303){
	    						Ext.getCmp("other").setValue(true);
	    						break;
	    					}else{
	    						Ext.getCmp(arry[i]).setValue(true);
	    					}
	    				}
	    			}
	    		}
			}
		}
		if(node.action == 'delete'){
			Ext.MessageBox.confirm(local.window.tip,local.window.deleteConfirm,function(btn){
				if(btn == 'yes'){
					Ext.Ajax.request({
						method : 'post',
						url : '/backup/tomonitorAction!deleteServerWarningConfig.action',
						params : {
							scriptWarningId : scriptWarningId,
							deviceId : warnDeviceId
						},
						success : function(response, options) {
							var obj = Ext.decode(response.responseText);
							
							showResultDialog(obj.msgCode, obj.msgContent);
							Ext.getCmp('imitateGrid').getStore().load({
								params : {
									deviceId : warnDeviceId
								}
							});  
						},
						failure : function(response, options) {
							/*Ext.MessageBox.alert(local.window.tip, local.deleteFailure,function(){
								Ext.getCmp('imitateGrid').getStore().load({
									params : {
					    				deviceId : warnDeviceId
					    			}
								});
							});*/
							Ext.websure.MsgError("WF-30003", local.deleteFailure,function(){
								Ext.getCmp('imitateGrid').getStore().load({
									params : {
					    				deviceId : warnDeviceId
					    			}
								});
							});
						}
					});
				}
			});
		}
	},
	addSaveButtonScript : function(){
		if(validateValue()){    //文本框验证
			var returnValue = false;
			var serverType = Ext.getCmp("scriptWarningServerType").getValue();
			if(serverType != 3){//自定义脚本，不需要判断换行路径
				var returnValue = getScriptWarningReturnValue("successReturn","failedReturn","successDBReturn","failedDBReturn");    //返回值
			}else {
				returnValue = Ext.getCmp("scriptWarningReturnValue").getValue();
			}
			
			if(returnValue){
			
				var configRunTimeIntervalUnit = 3;
				var scriptInterSlider = document.getElementById("scriptInterSlider").value;
				if(scriptInterSlider > 59 && scriptInterSlider <= 75){    //小时
					scriptInterSlider = scriptInterSlider-59;
					scriptInterSlider = Math.ceil(scriptInterSlider/2);
					configRunTimeIntervalUnit = 2;    //小时
				}
				
				Ext.getCmp('addMonitorPanel').getForm().submit({
					url : '/backup/tomonitorAction!addServerWarningConfig.action',
					params: {
						deviceId : warnDeviceId,
						deviceMac : warnDeviceMac,
						'warningConfigInfo.configModelId' : 2,
						'warningConfigInfo.configRunTimeInterval':scriptInterSlider,
						'warningConfigInfo.configRunTimeIntervalUnit': configRunTimeIntervalUnit,
						returnValue : returnValue
				    },
				    success : function(form, action) {
				    	var obj = action.result;
				    	showResultDialog(obj.msgCode, obj.msgContent);
				    	if(typeof(Ext.getCmp("imitateGrid")) != 'undefined'){
				    		Ext.getCmp("imitateGrid").store.reload({
				    			params : {
				    				deviceId : warnDeviceId,
				    				"warningConfigInfo.configModelId" : 2
				    			}
				    		});
				    	}
						
						Ext.getCmp('addMonitorConfigWindow').destroy();
						
					},
					failure : function() {
						//Ext.MessageBox.alert(local.window.tip,local.backup.saveFailureContactAdmin);
						Ext.websure.MsgError("WF-30004",local.backup.saveFailureContactAdmin);
						Ext.getCmp('addMonitorConfigWindow').destroy();
					}
				});
			}
		}
	},
	// HTTP业务监控保存按钮
	editSaveButtonScript : function(){
		if(validateValue()){    //文本框验证
			var returnValue = false;
			var serverType = Ext.getCmp("scriptWarningServerType").getValue();
			if(serverType != 3){//自定义脚本，不需要判断换行路径
				var returnValue = getScriptWarningReturnValue("editSuccessReturn","editFailedReturn","editSuccessDBReturn","editFailedDBReturn");    //返回值
			}else {
				returnValue = Ext.getCmp("scriptWarningReturnValue").getValue();
			}
			if(returnValue){
				
				var configRunTimeIntervalUnit = 3;
				var editScriptInterSlider = document.getElementById("editScriptInterSlider").value;
				if(editScriptInterSlider > 59 && editScriptInterSlider <= 67){    //小时
					editScriptInterSlider = editScriptInterSlider-59;
					editScriptInterSlider = Math.ceil(editScriptInterSlider/2);
					configRunTimeIntervalUnit = 2;    //小时
				}
				var oldWarningName = Ext.getCmp('oldScriptWarningName').value;
				Ext.getCmp('editMonitorPanel').getForm().submit({
					url : '/backup/tomonitorAction!updateServerWarningConfig.action',
					params: {
						"warningConfigInfo.configRunTimeInterval":editScriptInterSlider,
						"warningConfigInfo.configRunTimeIntervalUnit": configRunTimeIntervalUnit,
	    				oldWarningName : oldWarningName,
	    				returnValue : returnValue
				    },
					success : function(form, action) {
				    	var obj = action.result;
	
				    	showResultDialog(obj.msgCode, obj.msgContent);
				    	if(typeof(Ext.getCmp("imitateGrid")) != 'undefined'){
				    		Ext.getCmp("imitateGrid").store.reload({
				    			params : {
				    				deviceId : warnDeviceId,
				    				"warningConfigInfo.configModelId" : 2
				    			}
				    		});
				    	}
						
						Ext.getCmp('editMonitorConfigWindow').destroy();
						
					},
					failure : function() {
//						Ext.MessageBox.alert(local.window.tip,local.backup.saveFailureContactAdmin);
						Ext.websure.MsgError("WF-30005",local.backup.saveFailureContactAdmin);
						Ext.getCmp('editMonitorConfigWindow').destroy();
					}
				});
			}
		}
	},
	testImitateButton : function(){
		var serverType = Ext.getCmp("scriptWarningServerType").getValue();
		
		//授权
		if(serverType == 3 && licenseWarningScript == 0){    //自定义授权
			Ext.MessageBox.alert(local.window.tip,local.log.authTips);
			return false;
		}else if(serverType == 2 && licenseWarningDB == 0){    //数据库授权
			Ext.MessageBox.alert(local.window.tip,local.log.authTips);
			return false;
		}else if(serverType == 1 && licenseWarningUrl == 0){    //url授权
			Ext.MessageBox.alert(local.window.tip,local.log.authTips);
			return false;
		}
		
		if(warnDeviceStatus == 2){    //判断设备是否在线 1：在线2：不在线 3：异常
			Ext.MessageBox.alert(local.window.tip,local.backup.deviceOfflineCannotMockTest);
			return false;
		}
		if(validateValue()){    //文本框验证
			var returnValue = false;
			if(serverType != 3){//自定义脚本，不需要判断换行路径
				var returnValue = getScriptWarningReturnValue("successReturn","failedReturn","successDBReturn","failedDBReturn");    //返回值
			}else {
				returnValue = Ext.getCmp("scriptWarningReturnValue").getValue();
				
			}
			
			if(returnValue){
				
				Ext.getCmp('addMonitorPanel').getForm().submit({
					url : '/backup/tomonitorAction!findValidationWarningConfig.action',
					timeout: 100000, 
					waitMsg : local.backup.waitMsg,
					params: {
						deviceId : warnDeviceId,
						deviceMac : warnDeviceMac,
						oldWarningName : "",
						returnValue : returnValue
				    },
					success : function(form, action) {
						var obj = action.result;
						showResultDialog(obj.msgCode, obj.msgContent);
						if(obj.msgCode == MSG_NORMAL){//30000
							Ext.getCmp("addSaveButtonScript").setDisabled(false);
							Ext.getCmp("testImitateButton").setDisabled(true);
						}else{
							Ext.getCmp("addSaveButtonScript").setDisabled(true);
							Ext.getCmp("testImitateButton").setDisabled(false);
						}
					},
					failure : function() {
						Ext.MessageBox.alert(local.window.tip,local.backup.deviceOfflineCannotMockTestFailure);
						Ext.getCmp('addMonitorConfigWindow').destroy();
					}
				});
			}
		}
	},
	testEditImitateButton : function(){
		if(warnDeviceStatus == 2){    //判断设备是否在线 1：在线2：不在线 3：异常
			Ext.MessageBox.alert(local.window.tip,local.backup.deviceOfflineCannotMockTest);
			return false;
		}
		
		if(validateValue()){    //文本框验证
			var returnValue = false;
			var serverType = Ext.getCmp("scriptWarningServerType").getValue();
			if(serverType != 3){//自定义脚本，不需要判断换行路径
				returnValue = getScriptWarningReturnValue("editSuccessReturn","editFailedReturn","editSuccessDBReturn","editFailedDBReturn");    //返回值
			}else {
				returnValue = Ext.getCmp("scriptWarningReturnValue").getValue();
			}
			
			if(returnValue){
				
				var warnDeviceId = Ext.getCmp('deviceId').value;
				var oldWarningName = Ext.getCmp('oldScriptWarningName').value;
				Ext.getCmp('editMonitorPanel').getForm().submit({
					url : '/backup/tomonitorAction!findValidationWarningConfig.action',
					params: {
						deviceId : warnDeviceId,
						deviceMac : warnDeviceMac,
						oldWarningName : oldWarningName,
						returnValue : returnValue
				    },
				    timeout : 100000, //超时时间设置，单位毫秒
				    waitMsg :local.backup.waitMsg,
					success : function(form, action) {
						var obj = action.result;
						
						showResultDialog(obj.msgCode, obj.msgContent);
						if(obj.msgCode == MSG_NORMAL){//30000
							Ext.getCmp("editSaveButtonScript").setDisabled(false);
							Ext.getCmp("testEditImitateButton").setDisabled(true);
						}else{
							Ext.getCmp("editSaveButtonScript").setDisabled(true);
							Ext.getCmp("testEditImitateButton").setDisabled(false);
						}
					},
					failure : function() {
						Ext.MessageBox.alert(local.window.tip,local.backup.deviceOfflineCannotMockTestFailure);
						Ext.getCmp("EditWarningConfig").destroy();
					}
				});
			}
		}
	},
	runLogOpera: function runLogOpera(self, record, item, index, e){
		var isDsf = record.data.leaf;    //是否为日志文件
		var dsf = record.data;    //磁盘文件信息记录
		//选择日志文件
		if(isDsf){
	        //--begin--定义右键菜单
	        var cfgMenu = Ext.create('Ext.menu.Menu',{
	        	            minWidth : 100,
	                        items:[{//--begin--定义下载设置菜单
	                                text : local.backup.downFile,
	//                                itemId : '',  
	                                icon : "/images/recovery/mount/guazai.png",
	                                iconCls : 'iconWidth',  
	                                listeners : {
	                                	click : {
	                                	   fn : function(){
	                                	   	var logPath = dsf.logpath;
	                                	    var logName = dsf.logNameSuffix;
	                                	   		window.location.href='/backup/tobackupdbAction!downLogFile.action?filepath='+logPath+"&logName="+logName;
	                                       	  
	                                	   }
	                                	}
	                                }
	                                //--end--定义下载设置菜单
	                            },{
	                                //--begin--定义查看菜单
	                            	text :local.backup.readLog,
	//                                itemId : '', 
	                                icon : "/images/config/menu_delete.png",
	                                iconCls : 'iconWidth',
	                                listeners : {
	                                    click : {
	                                       fn:function(){
	                                       	var logPath = dsf.logpath;
	                                       var param = {
									    		filePath : logPath
									    	};
	                                       	  Ext.create('websure.backup.view.ReadLog',param).show();
	                                       }
	                                    }
	                            }
	                                //--end--定义查看菜单
	                            }]
	        });
	        e.preventDefault();    // 阻止浏览器默认右键菜单
	        cfgMenu.showAt(e.getXY());
	        //根据用户权限赋予用户操作权限
	//        POWER_OP.filterEnableMenuOfExtjs(cfgMenu,CURRENT_USER.getRecoveryPower());
	        //--end--定义右键菜单
		}else{
			e.preventDefault();    // 阻止浏览器默认右键菜单
		}
	}
	
});

/**
 * 检测 模拟监控中的条数，如果为0，保存按钮无法点按
 */
function chkMockMonitorList(){
	// 检测 模拟监控中的条数，如果为0，保存按钮无法点按
	var grid = Ext.getCmp("imitateGrid");
	if(typeof grid === "undefined") {
		return ;
	}
	var dataCount = Ext.getCmp("imitateGrid").getStore().getTotalCount();	// TODO 返回的值不对
//	var dataCount = Ext.getCmp("imitateGrid").getStore().getCount();	// TODO 返回的值不对
	console.debug("dataCount", dataCount);
	if (0 == dataCount) {
		// 置灰保存按钮
		Ext.getCmp("minitorSaveButton").setDisabled(true);
	} else {
		// 置亮保存按钮
		Ext.getCmp("minitorSaveButton").setDisabled(false);
	}
}

