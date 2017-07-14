/**
 * author:yangbobin date:2015-10-28 description: 恢复存储业务控制器
 */

Ext.define('acesure.recovery.controller.RecoveryController', {
	extend : 'Ext.app.Controller',
	alias : "widget.recoveryController",
	views : [ 'MountList', 'RecoveryList', 'StorageNode','Recovery','MountWinShow','Mount','FileView','ClusterVmimgView','ClusterMountConfigWin'],
	models : [ 'StorageModel','MountModel' ,'DiskInfoModel','acesure.recovery.model.RemoteMountTargetMacModel','GlobalTreeModel','VmingInfoModel','NewStorageConfigModel','StorageRunStateModel','DeviceAndVmimgModel'],
	stores : [ 'GlobalTreeStore', 'MountListStore', 'StorageListStore','DiskInfoStore' ,'RemoteMountTargetMac','SnapShotStore','DeviceAndVmimgStore','VmingInfoStore','NewStorageConfigStore','RecVmingInfoStore','ConfigTargetDevice','StorageRunStateStore','NewMountStore','ConnectionMountStore','RecoveryLogStore'],
	init : function() {
		this.control({
			'recoveryList mountList' : {
				itemclick : this.showMountInfo
			},
			'fileView deviceList' : {
				itemclick : this.showDeviceInfo
			},
			'grobleTreePanel':{
				itemclick:this.getTreeNodeInfo
			},
			//修改存储节点标题
			'storageNodeToolbar panel[itemId=storageNodeName]':{
				afterrender : this.showStorageNodeName
			},
			//修改存储节点底部节点名称
			'storageInfoToolbar panel[itemId=storageNodeName]':{
				afterrender : this.showStorageNodeName
			}
		});
	},
	getTreeNodeInfo:function(record, item, index, e, eOpts){
		 var ids = item.data.id ;
//		 var moundData = record.data;
  		if("createGroup" == ids){
//  			alert("createGroup");
  		}else if(null == item.data.children){
  			var licenseFlag_ = item.raw.licenseFlag;
  			if(2 == licenseFlag_){
				Ext.MessageBox.alert(local.window.tip, local.unauthDevNoOperate);
				return;
			};
  			var contentPanel = Ext.getCmp('recoveryContentPanel');
  			contentPanel.removeAll();
  			ISCLUSTERMOUNT = 2; //标记为普通设备挂载
  			var mount=Ext.create("acesure.recovery.view.Mount",{
  				    clusterIdentity:item.raw.clusterIdentity,
  					deviceId:item.raw.deviceId,
					deviceName:item.raw.pageText,
					uuid:item.raw.uuid,
					sysInfo:item.raw.sysInfo,
					version:item.raw.version,
					type:item.raw.clientSystype,
					ip:item.raw.ip,
					deviceState:item.raw.status,
					deviceType:item.raw.deviceType
  				});
  			contentPanel.add(
  					mount
  			);
  			contentPanel.doLayout();
  		}else if(null != item.data.children && 0 != item.raw.groupType){
  			// 集群恢复存储展示页面
  			var contentPanel = Ext.getCmp('recoveryContentPanel');
            contentPanel.removeAll();
  			ISCLUSTERMOUNT = 1; //标记为集群挂载
  			var clusterId = item.raw.id.split('-')[0]; //组id 如 3-g
            var clusterVmimgView = Ext.create("acesure.recovery.view.ClusterVmimgView",{
                                        deviceCount : item.raw.deviceCount,
                                        clusterName : item.raw.pageText,
                                        clusterId : clusterId,
                                        groupType : item.raw.groupType
                                    });
            contentPanel.add(clusterVmimgView);
            contentPanel.doLayout();
        }
	},
	// 展示挂载点信息
	showMountInfo : function(me, record, item, index, e, eOpts) {
		// 获取恢复存储主tab框架
		var storageTabPanel = Ext.getCmp('storageTabPanel');
		// 获取全部存储节点面板,动态修改恢复存储页面底部
		var recoveryList = storageTabPanel.getComponent('recoveryList');
		var logInfoTabPanel=Ext.getCmp("bottomId");
		var length=logInfoTabPanel.items.length;
		
		if(logInfoTabPanel.activeTab.id=='recoveryLogGridId'&&length < 2){
			logInfoTabPanel.insert(0,{
				width : '100%',
				height:300,
				border:false,
				layout:'hbox',
				title:local.recovery.mountInformation,
				items:[
				       {xtype:"mountInfo",flex:1}
				       ]
			});
		}
		logInfoTabPanel.setActiveTab(0);
		
	/*	if(typeof(recoveryList.getComponent('storageInfoTabPanel')) == "undefined"){
			Ext.getCmp("bottomId").destroy();
			//recoveryList.remove("bottomId");
			recoveryList.add({xtype:"storageInfoTabPanel",itemId:"storageInfoTabPanel"});
			//recoveryList.doLayout();
		}
			*/
		/*var storageInfoTabPanel=recoveryList.getComponent('storageInfoTabPanel');
		var bottomInfo=null;
		bottomInfo=storageInfoTabPanel.getComponent('bottomInfoItemId');*/
		// 修改propertyGrid 挂载点信息
		var mountInfo = Ext.getCmp('mountInfo');
		
		var moundData = record.data;// 挂载信息记录
		
		var nameAndDevice = mountInfo.getComponent('nameAndDevice');
		var label;
		var sysType=moundData.sysType;
		if(moundData.mountType==1){
			if(sysType<=32){//Windows磁盘加上":"
				lable='/' + moundData.mountLetter+":";
			}else{
				lable='/' + moundData.mountLetter;
			}
		}else{
			lable=moundData.mountLetter;
		}
		nameAndDevice.setSource({
			'mountName' : moundData.mountName,// 模拟挂载名称
			'mountDevice' : moundData.mountDestDeviceName,// 模拟挂载设备
			'mountDeviceIP':moundData.mountDestDeviceIp,
			'mountCreateTime':moundData.mountCreateTime,
			'mountPower':moundData.mountPower,
			'partLabel' : lable,// 模拟挂载盘符
			'state' : moundData.mountState
			
		});
		var labelAndState = mountInfo.getComponent('labelAndState');
		labelAndState.setSource({
			'vmimgPath':moundData.vmimgName,
			'sourceDeviceName':moundData.sourceDeviceName,
			'sourceDeviceIp':moundData.sourceDeviceIp,
			'harddiskName':moundData.harddiskName,
			'sourceLabel':moundData.mountLabel,
			'storage':moundData.storageName,
			'storageName':moundData.storageSymbol+":"+moundData.storagePath
			
			
		});
		
		
	},
	
	/**
	 * 展示挂载设备信息
	 */
	showDeviceInfo : function(me, record, item, index, e, eOpts) {
		var device = record.data;    //获取选中设备记录
		//更新设备标签名称
		var deviceLabelbar = Ext.getCmp('deviceLabelbar');    //获取设备名称标签bar
		var deviceLabel = deviceLabelbar.getComponent('deviceLabel');    //获取设备名称
		deviceLabel.update(device.computerName);    //修改设备名称
		//更新设备详细信息
		var deviceInfo = Ext.getCmp('deviceInfo');
		var nameAndDevice = deviceInfo.getComponent('nameAndDevice');
		nameAndDevice.setSource({
			'mountName' : device.computerName,    //挂载名称
			'mountDevice' : device.ip    //挂载设备
		});
		var labelAndState = deviceInfo.getComponent('labelAndState');
		labelAndState.setSource({
			'partLabel' : '/mount1',    // 模拟挂载盘符
			'state' : '1'    //模拟挂载状态
		});
		deviceLabelbar.show();
		deviceInfo.show();
		
	},
	showStorageNodeName : function(me,opts){
		var tab = Ext.getCmp('storageTabPanel');
		var storaegNodeView = tab.getActiveTab();
		var storageName = storaegNodeView.title;
		me.update('<span>'+local.recovery.nodeSave+local.colon+storageName+'</span>');
	}
});

//删除挂载点
function delMountNode (data,type){
	var myMask=null;
	var title=null;
	if(type==1){
		myMask = new Ext.LoadMask(Ext.getBody(), {   
			msg : local.recovery.uninstallMountLoading  
		});
		title=local.recovery.uninstallMountConfirm;
	}else if(type==2){
		myMask = new Ext.LoadMask(Ext.getBody(), {   
			msg : local.recovery.deleteMountLoading 
		});
		title=local.recovery.deleteMountConfirm;
	}else{
		myMask = new Ext.LoadMask(Ext.getBody(), {   
			msg : local.recovery.initMsg  
		});
		title=local.recovery.initDiskSet;
	}
	Ext.MessageBox.confirm(local.window.tip,title, function(btn){
		if(btn=='yes'){
			myMask.show();
			Ext.Ajax.request({
				url:'/recovery/recoveryAction!deleteMountRecord.action',
				timeout: 40000,
				params:{
					mountId:data
					}, 
				 success: function(resp,opts) {
					 myMask.hide();
					 var mountRes=JSON.parse(resp.responseText);
					 var mountList=Ext.getCmp("mountListId");
					 var mountListStore=mountList.getStore();
					 //操作返回后弹出框
					 showMsg(mountRes);
					 //更新挂载记录，和挂载列表标题
					 mountListStore.load({
						 callback:function(records, operation, success){
							 var record = null;
							 for(i=0;i<records.length;i++){
								 tRecord=records[i];
								 if(data==tRecord.get("mountId")){
									 record=tRecord;
								 }
							 };
							 if(record){
								 mountList.getSelectionModel().select(record);
							 }
							 findMountCount();
		  					POWER_OP.filterEnableDomsInGridpanelColumnOfExtjs(mountList,CURRENT_USER.getRecoveryPower());
		  				  }
		  			  });
					 //更新标题
					 //Ext.getCmp("allMountInfoid").doLayout();
					// findMountCount();
					 //移除选中的节点下部面板显示信息
					// 获取恢复存储主tab框架
						/*var storageInfoTabPanel = Ext.getCmp('storageInfoTabPanelId');
						// 获取全部存储节点面板,动态修改恢复存储页面底部
						storageInfoTabPanel.removeAll();
						storageInfoTabPanel.add({title:"日志信息",xtype:"recoveryLogGrid"});*/
					 var storageTabPanel = Ext.getCmp('storageTabPanel');
					 var recoveryList = storageTabPanel.getComponent('recoveryList');
					 var msgCode=mountRes[0].msgCode;
					 if(type==2&&msgCode==30000){//删除一条挂载记录，清除当前显示挂载信息
						 recoveryList.remove(3);
						 recoveryList.add({xtype:"logInfoTabPanel",height:340,id:"bottomId"});
					 }else{
						 Ext.getCmp("recoveryLogGridId").store.load();
					 }
					 
					// if(!(typeof(recoveryList.getComponent('storageInfoTabPanel')) == "undefined")){
						 //recoveryList.remove("storageInfoTabPanel");
						 //recoveryList.add({xtype:"logInfoTabPanel",height:340,id:"bottomId"});
						// recoveryList.doLayout();
					// }else{
						 //Ext.getCmp("recoveryLogGridId").store.load();
					// }
		         },    
		        failure: function(resp,opts) {
		        	myMask.hide();
//		       		Ext.MessageBox.alert(local.window.tip,local.recovery.delMountError);
		        	Ext.websure.MsgError("WF-30111",local.recovery.delMountError);
		        }
				});	
		}else{
			return false;
		}
	});
}



//设置挂载点
//diskId,type,vmId,parId,deviceId,mountTypeWin,mountIdWin,mountState
//function cfgMountNode(diskId,type,vmId,parId,deviceId,mountTypeWin,mountIdWin,mountState,mountNameWin){
function cfgMountNode(diskId,type,vmId,parId,deviceId,mountTypeWin,mountIdWin,mountState,mountNameWin,mountLetter){
	if(mountState=="7"){
		Ext.MessageBox.alert(local.window.tip,local.recovery.mountSetCanotModify);
		return false;
	};
	if(mountState=="0"||mountState=="5"){
		Ext.MessageBox.alert(local.window.tip,local.recovery.mountErrorSetCanotModify);
		return false;
	}
	var recConfigMountWin=Ext.create("acesure.recovery.view.RecMountWinShow",{
		diskID:diskId,
		typeWin:type,
		vmID:vmId,
		partID:parId,
		deviceID:deviceId,
		mountType:mountTypeWin,
		mountId:mountIdWin,
		mountName:mountNameWin,
		mountLetter:mountLetter
	});
	recConfigMountWin.show();
}
//激活挂载点
function actMountNode(data,data2){
	
	var myMask = new Ext.LoadMask(Ext.getBody(), {   
		msg : local.recovery.mountActiveLoading
	});
	myMask.show();
	
	var mountID=data;
	var deviceIds=data2;
	Ext.Ajax.request({
		url:'/recovery/recoveryAction!mountActive.action',
		timeout: 40000,
		params:{
			mountId:mountID,
			deviceId:deviceIds
			}, 
		 success: function(resp,opts) { 
			myMask.hide();
			var mountRes=JSON.parse(resp.responseText);
			var mountList=Ext.getCmp("mountListId");
			var mountListStore=mountList.getStore();
			showMsg(mountRes);
			mountListStore.load({
				callback:function(records, operation, success){
					  var record = null;
	  				  for(i=0;i<records.length;i++){
	  					  tRecord=records[i];
	  					  if(mountID==tRecord.get("mountId")){
	  						  record=tRecord;
	  					  }
	  				  };
	  				  if(record){
	  					mountList.getSelectionModel().select(record);
	  				  }
					POWER_OP.filterEnableDomsInGridpanelColumnOfExtjs(mountList,CURRENT_USER.getRecoveryPower());
				}
			});
			//更新日志信息
			Ext.getCmp("recoveryLogGridId").getStore().load();
         },    
        failure: function(resp,opts) {
        	myMask.hide();
//       		Ext.MessageBox.alert(local.window.tip,local.recovery.mountActiveError);
        	Ext.websure.MsgError("WF-30112",local.recovery.mountActiveError);
        }
		});
}

//空磁盘，创建虚拟磁盘，设置挂载
function newMountConfig(mountID,vmId){
	var newMountWin=Ext.create("acesure.recovery.view.NewMountWinShow",{
		mountId:mountID,
		vmdkId:vmId
	});
	newMountWin.show();
}
function deleteMountConfig(data){
	//alert(data);
}
function showMsg(data){
	var msgCode=data[0].msgCode;
	var msgContent=data[0].msgContent;
	//>30000异常，=30000正常
	if(msgCode>30000){
		Ext.websure.MsgError(msgCode,msgContent);
		//Ext.MessageBox.alert(local.window.tip,msgCode+":"+msgContent);
	}else{
		Ext.websure.MsgTip.msg(local.window.tip, msgContent,true);
		//Ext.MessageBox.alert(local.window.tip,msgCode+":"+msgContent);
	}
}
function findMountCount(){
	var me=Ext.getCmp("allMountInfoid");
	var mountList=Ext.getCmp("mountListId");
	var record_Length=mountList.getStore().data.length;
	me.update("<font class='font_h3'>"+local.recovery.title+"</font><br>"+record_Length+local.recovery.title2);
	/*Ext.Ajax.request({
		   url:'/recovery/mountAction!findMountCount.action',
		   success: function(resp,opts) {
			   var count=JSON.parse(resp.responseText);
			   me.update("<font class='font_h3'>"+local.recovery.title+"</font><br>"+count+local.recovery.title2);
		   },    
		   failure: function(resp,opts) {
			   Ext.MessageBox.alert(local.window.tip,"获取挂载信息异常");
		   }
	});*/
}
function stepIntoStorage(data){
	tabPanel = Ext.getCmp('storageTabPanel');
	for(i=0;i<tabPanel.items.items.length;i++){
		var childPanel=tabPanel.items.items[i];
		if(data==childPanel.title){
			tabPanel.setActiveTab(i);
		}
	}
}

//js日期格式化
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "H+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};