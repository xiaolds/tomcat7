/**
 * 
 * initializeEmergencyPanel:虚拟机管理页面，虚拟机一览，计算节点一览，日志信息
 * @data 2016-9-28
 * @auth WangShaoDong
 */
function  initializeEmergencyPanel(){
	var emergencyStore=Ext.create("acesure.emergency.store.EmergencyInitializeStore");
	
	emergencyStore.load({
		callback: function(){
			//虚拟机一览，虚拟机管理
			var virtualCount=emergencyStore.getCount();
			var tabPanelVir = Ext.getCmp("tabPanel");
			var tabs = [];
			tabs.push({
				title: local.emergency.VM,
				listeners: {afterrender: dynamicAddFirstVirPanel},
				tabTip:local.emergency.VM,
				layout:"fit",
				id:"virtualFirstId"
			});

			//计算节点一览
			for (var i = 1; i <=virtualCount; i++) {
				var record=emergencyStore.getAt(i-1);
				var id=record.data["nodeId"];
				var title=record.data["nodeName"];
				var state = record.data["nodeState"];    //节点状态 1.在线 2.离线 3.异常
				var authorized=record.data["authorized"];//1:已经授权，2:未授权
				var iconCls = "";
				if(authorized==2){
					iconCls="unauthorized";
				}else{
					if(state==1){
						iconCls = "onLine_cal";    //在线
					}else{
						iconCls = "offLine_cal";    //离线或异常
					}
				}

				tabs.push({
					title: title,
					iconCls : iconCls,
					calNode:record.data,
					overflowY:"auto",
					authorized:authorized,
					listeners: {activate: showComputeNodesManagerPanel},//激活当前tab动态获取信息，未激活时只绑定了计算节点Id
					tabTip: title,
					id:id//绑定了计算节点Id
				});
			}
			tabPanelVir.add(tabs);
			Ext.getCmp("tabPanel").setActiveTab(0);
		}
	});
}

/**
 * 
 * showComputeNodesManagerPanel:激活选中的计算节点，显示当前计算节点详细信息
 * @data 2016-9-28
 * @auth WangShaoDong
 */
function showComputeNodesManagerPanel(me,eOpts){
	
	//隐藏工具栏刷新按钮（刷新虚拟机列表），
	var refreshPanel=Ext.getCmp("computeNodeRefreshId");
	refreshPanel.hide();
	
	//授权 1:已经授权，2:未授权
	var authorized=me.authorized;

   	var myMask = new Ext.LoadMask(Ext.getBody(), {msg:local.emergency.loadingCalnode});	
  	myMask.show();
  	
  	//删除面板内容
  	me.removeAll();
  	
  	var calNodeView = Ext.getCmp('calNodeView');
  	if(calNodeView){
  		calNodeView.destroy();
  	}
  	
  	var calNodeOffLine = Ext.getCmp('calNodeOffLine');
  	if(calNodeOffLine){
  		calNodeOffLine.destroy();
  	}
  	
	if(authorized==2){
	    //未授权页面，重用节点不在线页面
        me.add({
            xtype:"calNodeOffLine",
            html:"<span class='offlineClsText'>"+local.calNodeNoAuth+"</span>"
        });
	}else{
		//节点状态在线
	    if(me.calNode.nodeState==1){
	        me.add({
	            xtype:"calNodeView",
	            calNode: me.calNode
	        });
	    }else{
	    //节点状态不在线或异常
	        me.add({
	            xtype:"calNodeOffLine",
	            html:"<span class='offlineClsText'>"+local.emergency.computeOnline+"</span>"
	        });
	    }
	}
  	myMask.hide();
  };
  
  /**
   * 加载虚拟机信息，增加，修改，删除网络虚拟机网络信息后，刷新虚拟机网络面板
   * @param vmId
   */
 function loadVmConfigInfo(vmId){
	 
	 var vmManager=getVmManagerByVmId(vmId);
	 if(null==vmManager){
		 Ext.getCmp("virtualSouthPanelId").remove(0);
		 return false;
	 }
	 var hardWareHTML=emergencyMapDate.hardWarePanelHtml(vmManager);
	 Ext.query("span#span_hardWarePanel")[0].innerHTML=hardWareHTML;
	 if(vmManager.vmState ==1){
		 $('.bot_list a').removeAttr('onclick').addClass("btn_a_disabled");//去掉a标签中的onclick事件
	 }
	 POWER_OP.filterEnableDomsInHtmlOfExtjs(Ext.getCmp('virHardDiskPanelId'),CURRENT_USER.getEmergencyPower());
 }
/**
 * 
 * loadVmConfigNetInfo:加载虚拟机网络信息
 * @data 2016-9-28
 * @auth WangShaoDong
 */
 function loadVmConfigNetInfo(vmId){
		//虚拟机不存在
		if(0==vmId){
			return;
		};
		//获取当前虚拟机网络信息
		var vmManagerNic=getVmManagerNicByVmId(vmId);
		//组合HTML格式字符串
		var netWorkHTML=emergencyMapDate.netWorkPanelHtml(vmManagerNic,vmId);
		Ext.query("span#span_netWorkPanel")[0].innerHTML=netWorkHTML;
		//权限处理
		POWER_OP.filterEnableDomsInHtmlOfExtjs(Ext.getCmp('virNetWorkPanelId'),CURRENT_USER.getEmergencyPower());
 }
  
/**
 * 
 * showVirHardWareInfo:加载虚拟机基础设置信息
 * @data 2016-9-28
 * @auth WangShaoDong
 */
function showVirHardWareInfo(e,  opts){
	
	var virtualTabPanel=Ext.getCmp("virtualTabPanel");
	var vmId=virtualTabPanel.virtualIndex;
	if(0==vmId) return;
	var vmManager=getVmManagerByVmId(vmId);
	var hardWareHTML=emergencyMapDate.hardWarePanelHtml(vmManager);
	Ext.query("span#span_hardWarePanel")[0].innerHTML=hardWareHTML;
	 if(vmManager.vmState ==1){
		 $('.bot_list a').removeAttr('onclick').addClass("btn_a_disabled");//去掉a标签中的onclick事件
	 }
	POWER_OP.filterEnableDomsInHtmlOfExtjs(Ext.getCmp('virHardDiskPanelId'),CURRENT_USER.getEmergencyPower());
}

/**
 * 
 * showVirNetWorkInfo:初始化虚拟机网络信息显示当前虚拟机网络
 * @data 2016-9-28
 * @auth WangShaoDong
 */
function showVirNetWorkInfo(e,  opts){
	var virtualTabPanel=Ext.getCmp("virtualTabPanel");
	var vmId=virtualTabPanel.virtualIndex;
	var virType=virtualTabPanel.virType;
	var nodeId=virtualTabPanel.computeNodeId;
	var virState=virtualTabPanel.virState;
	if(0==vmId) return;
	var vmManagerNic=getVmManagerNicByVmId(vmId);
	var netWorkHTML=emergencyMapDate.netWorkPanelHtml(vmManagerNic,vmId,virType,nodeId,virState);
	Ext.query("span#span_netWorkPanel")[0].innerHTML=netWorkHTML;
	if(virState ==1&&virType==1){
		 $('.removeOnClickEvent').removeAttr('onclick').addClass("btn_a_disabled");//去掉a标签中的onclick事件
	}
	POWER_OP.filterEnableDomsInHtmlOfExtjs(Ext.getCmp('virNetWorkPanelId'),CURRENT_USER.getEmergencyPower());
}





/**
 * 
 * showVirDetailInfo:虚拟机存储信息
 * @data 2016-9-28
 * @auth WangShaoDong
 */
function showVirDetailInfo(e,  opts){
	
	var virtualTabPanel=Ext.getCmp("virtualTabPanel");
	var vmId=virtualTabPanel.virtualIndex;
	var virState=virtualTabPanel.virState;
	if(0==vmId) return;
	var vmImgs=getVirImgStatusByVmId(vmId);
	
	var virtualMesHtml=emergencyMapDate.virtualMesPanelHtml(vmImgs,vmId,virState);
	Ext.query("span#span_virtualMesPanel")[0].innerHTML=virtualMesHtml;
	if(virState ==1){
		 $('.removeOnClickEvent').removeAttr('onclick').addClass("btn_a_disabled");//去掉a标签中的onclick事件
	}
	POWER_OP.filterEnableDomsInHtmlOfExtjs(Ext.getCmp('virVirtualMesPanelId'),CURRENT_USER.getEmergencyPower());
}

/**
 * 修改虚拟机类型视图
 * @param vmId
 * @param vmType
 */
function uptateVmTypeView(vmId,vmType){
	var vmTypeWindow=Ext.create("acesure.emergency.view.updateVmTypeWindow",{vmId:vmId,vmType:vmType});
	vmTypeWindow.show();
}
/**
 * 修改虚拟机CPU视图
 * @param vmId
 * @param nodeId
 * @param cpukernel
 */
function  uptateVmCpuView(vmId,cpukernel,computeNoteId){
	var vmCpuWindow=Ext.create("acesure.emergency.view.updateVmCPUWindow",{vmId:vmId,cpukernel:cpukernel,computeNoteId:computeNoteId});
	vmCpuWindow.show();
	Ext.getCmp("vm_cpu_id").getStore().load();
}

/**
 * 修改虚拟机内存视图
 */
function uptateVmMemoryView(vmId,freeMemory){
	var vmMemoryWindow=Ext.create("acesure.emergency.view.updateVmMemoryWindow",{vmId:vmId,freeMemory:freeMemory});
	vmMemoryWindow.show();
}

/**
 * 修改虚拟机网卡驱动视图
 */
function uptateVmNicView(vmId,nicDriverType){
	var vmNicWindow=Ext.create("acesure.emergency.view.updateVmNicWindow",{vmId:vmId,nicDriverType:nicDriverType});
	vmNicWindow.show();
}

/**
 * 修改虚拟机硬盘的类型视图
 */
function uptateVmHardDiskTypeView(vmId,hardDiskType){
	var vmHardDiskTypeWindow=Ext.create("acesure.emergency.view.updateVmHardDiskTypeWindow",{vmId:vmId,hardDiskType:hardDiskType});
	vmHardDiskTypeWindow.show();
}

/**
 * 修改虚拟机显卡的类型视图
 */
function uptateVmGraphicsView(vmId,vmDisplayType){
	var vmGraphicsWindow=Ext.create("acesure.emergency.view.updateVmGraphicsWindow",{vmId:vmId,vmDisplayType:vmDisplayType});
	vmGraphicsWindow.show();
}
/**
 * 修改虚拟机网桥设置视图 
 */
function updateVmNicConfigView(vmId,vmNicId,vmNicIndex,vmNodeNicId,vmDeviceNicName,virState){
	if(virState==1){
		Ext.MessageBox.alert(local.window.tip,local.emergency.VmOnlineCannotEditNT);
		return false;
	}
	var nic={
				vmId: vmId,
				nodeId:emergencyMapDate.VM_MANAGER_INFO.nodeId,
				vmNicId:vmNicId ,
				vmNicIndex:vmNicIndex ,
				vmNodeNicId: vmNodeNicId,
				vmDeviceNicName:vmDeviceNicName
	            };
	var vmVmNicConfigWindow=Ext.create("acesure.emergency.view.updateVmNicConfigWindow",{nic:nic});
	vmVmNicConfigWindow.show();
}

/**
 * 删除虚拟机网桥设置视图 
 */
function deleteVmNicConfigView(vmId,vmNicId,vmNicIndex,netCount,virState){
	if(virState==1){
		Ext.MessageBox.alert(local.window.tip,local.emergency.VmOnlineCannotDeleteNT);
		return false;
	}
	if(netCount<=1){
		Ext.MessageBox.alert(local.window.tip,local.emergency.VmOnlyNTCannotDelete);
		return false;
	}
	var nic={
			vmId: vmId,
			vmNicId:vmNicId,
			vmNicIndex:vmNicIndex 
            };
	Ext.MessageBox.confirm(local.window.tip,
			local.emergency.VmNTDeleteConfirm1+vmNicIndex+local.emergency.VmNTDeleteConfirm2,
			                              function(btn){
		                                     if(btn=='yes'){
		                                      delVirtualMachNicInfo(nic);
		                                     }
	                                      });
	
}
/**
 * 
 * addVmNicConfigView:新增虚拟机网卡
 * @data 2016-7-14
 * @auth WangShaoDong
 */
function addVmNicConfigView(vmId,virState){	
	if(virState==1){
		Ext.MessageBox.alert(local.window.tip,local.emergency.VmOnlineAddNTFailure);
		return false;
	}
	var netWorkSelectWin=Ext.getCmp("NetWorkSelectWinId");
	var configMountWin=Ext.create("acesure.emergency.view.NetWorkSelectWin",{vmId:vmId});
	if(null!=netWorkSelectWin){
		
		netWorkSelectWin.destroy();
		configMountWin.show();
	}else{
		configMountWin.show();
	}
}

/*************** 数据加载处理 *******************/
//根据虚拟机ID查询虚拟机信息
function getVmManagerByVmId(vmId){
	var vmManager=null;
	
	Ext.Ajax.request({
		method : 'post',
		url : emergencyMapDate.EmergencyMapURL('tovmManager','findVmManagerView'),
		params : {
			'vmManager.id' : vmId
		},
		async:false,
		timeout: 10000,//10秒
		success : function(response, options) {
			var obj=Ext.decode(response.responseText);
			vmManager=obj.detail;
		},
		failure : function() {
//			Ext.MessageBox.alert(local.window.tip,local.emergency.getVmErrorTip);
			Ext.websure.MsgError("WF-30090",local.emergency.getVmErrorTip);
		}
	});
	return vmManager;
}

/**
 * 获得开启的虚拟机个数
 * @returns {Array}
 */
function getVmManagerOnline(me){	
	
	Ext.Ajax.request({
		method : 'post',
		url : emergencyMapDate.EmergencyMapURL('tovmManager','findVmManagerOnline'),
		async:true,
		timeout: 10000,//10秒
		success : function(response, options) {
			var obj=Ext.decode(response.responseText);
			me.update("<font class='font_h3'>"+local.emergency.title+"</font><br>"+local.emergency.vmRun1+obj.detail+local.emergency.virtual)	;
		},
		failure : function() {
			me.update("<font class='font_h3'>"+local.emergency.title+"</font><br>"+local.emergency.virtualZero)	;
		}
	});
	
}


/**
 * 获得计算节点上开启的虚拟机列表
 * @param cptNodeId
 * @returns {Array}
 */
function getVmManagerRunByCptNodeId(cptNodeId){
	var vmManager=[];
	if(0 ==cptNodeId ){
		Ext.MessageBox.alert(local.window.tip,local.emergency.getVmErrorTip);
		return ;
	}
	
	Ext.Ajax.request({
		method : 'post',
		url : emergencyMapDate.EmergencyMapURL('tovmManager','findVmRunByNodeIdView'),
		params : {
			'vmManager.computeNoteId' : cptNodeId
		},
		async:false,
		timeout: 10000,//10秒
		success : function(response, options) {
			var obj=Ext.decode(response.responseText);
			if(obj.success){
				vmManager=obj.detail;
			}else{
				Ext.MessageBox.alert(local.window.tip,local.emergency.getVmErrorTip);
			}
		},
		failure : function() {
//			Ext.MessageBox.alert(local.window.tip,local.emergency.getVmErrorTip);
			Ext.websure.MsgError("WF-30091",local.emergency.getVmErrorTip);
		}
	});
	return vmManager;
}

/**
 * 根据虚拟机ID查询虚拟机网卡信息
 * @param vmId
 * @returns
 */
function getVmManagerNicByVmId(vmId){
	var vmManagerNic=null;
	if(0 ==vmId ){
		Ext.MessageBox.alert(local.window.tip,local.emergency.getVmNTErrorTip);
		return ;
	}
	
	Ext.Ajax.request({
		method : 'post',
		url : emergencyMapDate.EmergencyMapURL('tovmManagerNic','findVmNicView'),
		params : {
			'vmManagerNic.vmId' : vmId
		},
		async:false,
		timeout: 10000,//10秒
		success : function(response, options) {
			var obj=Ext.decode(response.responseText);
			if(obj.success){
				vmManagerNic=obj.detail;
			}else{
				Ext.MessageBox.alert(local.window.tip,local.emergency.getVmNTErrorTip);
			}
		},
		failure : function() {
//			Ext.MessageBox.alert(local.window.tip,local.emergency.getVmNTErrorTip);
			Ext.websure.MsgError("WF-30092",local.emergency.getVmNTErrorTip);
		}
	});
	return vmManagerNic;
}

function getComputeNodeCapaAuthCpu(nodeId){
    
    var maxCpu=null;
    
    Ext.Ajax.request({
        method : 'post',
        url : emergencyMapDate.EmergencyMapURL('tocomputeNodes','findComputeNodeCapa'),
        params : {
            'computeNode.nodeId' : nodeId
        },
        async:false, 
        timeout: 5000,//5秒
        success : function(response, options) {
            var obj=Ext.decode(response.responseText);
            if(obj.success){
                maxCpu=obj.maxCpu;
            }else{
                maxCpu=1;
            }
        },
        failure : function() {
            maxCpu=1;
        }
    });
    
    return maxCpu; 
}

/**
 * 根据计算节点ID查询虚拟机网卡信息
 * @param nodeId
 * @returns
 */
function getComputeNodesNicByNodeId(nodeId){
	var computeNodesNic=null;
	if(0 ==nodeId ){
		Ext.MessageBox.alert(local.window.tip,local.emergency.getCalnodeNTErrorTip);
		return ;
	}
	
	Ext.Ajax.request({
		method : 'post',
		url : emergencyMapDate.EmergencyMapURL('tocomputeNodesNic','findNodesNicView'),
		params : {
			'computeNodesNic.computeId' : nodeId
		},
		async:false,
		timeout: 10000,//10秒
		success : function(response, options) {
			var obj=Ext.decode(response.responseText);
			if(obj.success){
				computeNodesNic=obj.detail;
			}else{
				Ext.MessageBox.alert(local.window.tip,local.emergency.getCalnodeNTErrorTip);
			}
		},
		failure : function() {
//			Ext.MessageBox.alert(local.window.tip,local.emergency.getCalnodeNTErrorTip);
			Ext.websure.MsgError("WF-30093",local.emergency.getCalnodeNTErrorTip);
		}
	});
	return computeNodesNic;
}

/**
 * 根据设备ID查询设备网卡信息
 * @param deviceId
 * @param computeNoteId
 */
function getNetWorkByDeviceId(deviceId,computeNoteId) {
	
	Ext.Ajax.request({
		url : emergencyMapDate.EmergencyMapURL('tovmManager','getDeviceNetWork'),
		params:{
			'deviceId':deviceId
		},
		timeout: 10000,
		success: function(response, options) {
			var netWorkInfos=Ext.decode(response.responseText);
			var bridgeConfigPanel=Ext.getCmp("updateVmTypeWindow").getComponent("bridge_config");
			
			for(var i=0; i<netWorkInfos.length; i++){
				var netWorkInfo=netWorkInfos[i];
				
				var networkConfig=Ext.create("acesure.emergency.view.NetworkConfig");
				var labelPanel=networkConfig.query("label")[0];
				var comboboxPanel=networkConfig.query("combobox")[0];
				
				var id=netWorkInfo.id;
				var name=netWorkInfo.name;
				var ip=netWorkInfo.ip;
				var index=netWorkInfo.index;
				var updateStr=local.emergency.card+index+'&nbsp;&nbsp;&nbsp;['+name+'('+ip+')]';
				labelPanel.update(updateStr);
				comboboxPanel.getStore().load({params:{nodeId:computeNoteId}});
				bridgeConfigPanel.add(networkConfig);
			}
		},
		failure: function(resp,opts) {
//			Ext.MessageBox.alert(local.window.tip,local.emergency.getDevNTErrorTip);
			Ext.websure.MsgError("WF-30094",local.emergency.getDevNTErrorTip);
		}
	});
}


/**
 * 根据虚拟机ID查询虚拟机磁盘状态
 * @param vmId
 * @returns
 */
function getVirImgStatusByVmId(vmId){
	var vmImgs=null;
	if(0 ==vmId ){
		Ext.MessageBox.alert(local.window.tip,local.emergency.getVmDiskErrorTip);
		return ;
	}
	
	Ext.Ajax.request({
		method : 'post',
		url : emergencyMapDate.EmergencyMapURL('tovmManager','findVirImgStatusView'),
		params : {
			'vmManager.id' : vmId
		},
		async:false,
		timeout: 10000,//10秒
		success : function(response, options) {
			var obj=Ext.decode(response.responseText);
			if(obj.success){
				vmImgs=obj.detail;
			}else{
				Ext.MessageBox.alert(local.window.tip,local.emergency.getVmDiskErrorTip);
			}
		},
		failure : function() {
//			Ext.MessageBox.alert(local.window.tip,local.emergency.getVmDiskErrorTip);
			Ext.websure.MsgError("WF-30095",local.emergency.getVmDiskErrorTip);
		}
	});
	return vmImgs;
}

/**
 * 根据计算节点ID查询虚拟机网卡桥接信息
 * @param me
 */
function getVmNetTopologyByNodeId(me){
	//当前计算节点对象信息
	var calNode=me.up("calNodeView").calNode;
	
	Ext.Ajax.request({
		method : 'post',
		url : emergencyMapDate.EmergencyMapURL('tovmManager','findVmNetTopologyView'),
		params : {
			'vmManager.computeNoteId' :calNode.nodeId
		},
		async:true,
		timeout: 10000,//10秒
		success : function(response, options) {
			var obj=Ext.decode(response.responseText);
			if(obj.success){
				
				var netJson=obj.detail;
				var links=netJson.link;
				NET_TOPOLOGY_LINKS=links;
				//更新计算节点资源，网络信息
				me.body.update(calNodeRunLoadHtml(netJson,calNode.nodeId));
				newEmergencyWidth(me,links);
			}else{
				Ext.MessageBox.alert(local.window.tip,local.emergency.getCalnodeNTErrorTip);
			}
		},
		failure : function() {
//			Ext.MessageBox.alert(local.window.tip,local.emergency.getCalnodeNTErrorTip);
			Ext.websure.MsgError("WF-30096",local.emergency.getCalnodeNTErrorTip);
		}
	});
}

/*************** 网络数据加载处理 *******************/

/**
 * 根据ID获得计算节点的性能视图
 * @param uuid
 * @param capaView
 */
function getComputeNodeCapaView(nodeId,capaView){
	
	var capaInfo=local.emergency.getComCap;

	Ext.Ajax.request({
		method : 'post',
		url : emergencyMapDate.EmergencyMapURL('tocomputeNodes','findComputeNodeCapa'),
		params : {
			'computeNode.nodeId' : nodeId
		},
		async:true, //异步
		timeout: 10000,//10秒
		success : function(response, options) {
			var obj=Ext.decode(response.responseText);
			if(obj.success){
				var me=obj.detail;
				capaInfo="<div class='cal_top_info'><i class='vm_icon vm_icon_cpu'></i>"+"CPU：{0} "+local.core+"&nbsp;&nbsp;<i class='vm_icon vm_icon_mem'></i>"+local.memory+"：{1}</div>";
				capaInfo=Ext.String.format(capaInfo,me.logicCpukernel, converToIntegerGB(me.totalMemory));
				capaView.body.update(capaInfo); //更新到最新获取的数据
				
				emergencyMapDate.COMPUTENODECAPAINFO=me; //设置为全局变量
			}else{
				capaView.body.update(capaInfo); //更新到最新获取的数据
			}
		},
		failure : function() {
			capaView.body.update(capaInfo); //更新到最新获取的数据
		}
	});
}

/**
 * 根据ID获得计算节点的性能信息
 * @param uuid
 */
function getComputeNodeCapaInfo(nodeId){
	
	var capaInfo=null;
	
	Ext.Ajax.request({
		method : 'post',
		url : emergencyMapDate.EmergencyMapURL('tocomputeNodes','findComputeNodeCapa'),
		params : {
			'computeNode.nodeId' : nodeId
		},
		async:false, 
		timeout: 5000,//5秒
		success : function(response, options) {
			var obj=Ext.decode(response.responseText);
			if(obj.success){
				capaInfo=obj.detail;
			}else{
				capaInfo={cpukernel:1, totalMemory:1024};
			}
		},
		failure : function() {
			capaInfo={cpukernel:1, totalMemory:1024};
		}
	});
	
	return capaInfo; 
}

/***********************虚拟机管理******************************/

/**
 * 启动虚拟机
 */
function startVirtualMachineByVmId(vmId,virtualNodeGrid,fastEmergency) {
	
	 var computeNodeState = getComputeNodeState(vmId);    //节点状态 1.在线 2.离线 3.异常
	 if(computeNodeState ==1 ){
	 	
        	var myMask = new Ext.LoadMask(Ext.getBody(), {msg:local.emergency.VmStartingLoading, removeMask: true }); 
        	myMask.show();
        	 
        	Ext.Ajax.request({
        		method : 'post',
        		url : emergencyMapDate.EmergencyMapURL('tovmManager','startVirtualMachine'),
        		params : {
        			'vmManager.id' : vmId
        		},
        		//async:false,
        		timeout: 40000,//10秒
        		success : function(response, options) {
        			var obj=Ext.decode(response.responseText).detail[0];
        			myMask.hide();
        			var remark=obj.remark;//1：启动成功，且系统是redHat4
        			
        			if(obj.msgCode==30000){
        				if(remark==1){
        					Ext.websure.MsgTipIcon.msg(local.window.tip, local.emergency.redHat4Tip,'1',true,3000);
        				}else{
        					Ext.websure.MsgTip.msg(local.window.tip, obj.msgContent,true);
        				}
        				if(!fastEmergency){
        					startAndStopLaterShowVirDetailMes(vmId,virtualNodeGrid);
        				}else{
        					Ext.getCmp("virtualNodeGridPanelId").getStore().load();
        				}
        				//每次页面刷新更新运行虚拟机个数
        				showVmOnLineMsg();
        				
        			}else{
        				Ext.websure.MsgError(obj.msgCode , obj.msgContent);
        			}
        		},
        		failure : function() {
        			myMask.hide();
        //			Ext.MessageBox.alert(local.window.tip,local.emergency.VmStartingContactServerError);
        			Ext.websure.MsgError("WF-30097",local.emergency.VmStartingContactServerError);
        		}
        	});
	 }else{
	 	Ext.websure.MsgError("无","启动虚拟机失败,原因：虚拟机所在的计算节点异常或者离线!");
	 }
}

/**
 * 停止虚拟机
 */
function stopVirtualMachineByVmId(vmId,virtualNodeGrid,vmName) {
	
	var computeNodeState = getComputeNodeState(vmId);    //节点状态 1.在线 2.离线 3.异常
	if(computeNodeState ==1 ){
		
        	var myMask = new Ext.LoadMask(Ext.getBody(), {msg: local.emergency.VmStoppingLoading, removeMask: true }); 
        	myMask.show();
        	
        	Ext.Ajax.request({
        		method : 'post',
        		url : emergencyMapDate.EmergencyMapURL('tovmManager','stopVirtualMachine'),
        		params : {
        			'vmManager.id' : vmId
        		},
        		//async:false,
        		timeout: 30000,//10秒
        		success : function(response, options) {
        			var obj=Ext.decode(response.responseText).detail[0];
        			myMask.hide();
        			if(obj.msgCode==30000){
        				Ext.websure.MsgTip.msg(local.window.tip, obj.msgContent,true);
        				//if(calOrVir==1){
        					startAndStopLaterShowVirDetailMes(vmId,virtualNodeGrid);
        				/*}else{
        					virtualNodeGrid.getStore().load({params:{'vmManager.computeNoteId':nodeId}});
        				}*/
        				
        				//每次页面刷新更新运行虚拟机个数
        				showVmOnLineMsg();
        				
        				//关闭打开的VNC页面
        				var closeWin=window.open('',vmName);
        				if(closeWin){
        					closeWin.close();
        				}
        			}else{
        				Ext.websure.MsgError(obj.msgCode , obj.msgContent);
        			}
        		},
        		failure : function() {
        			myMask.hide();
        //			Ext.MessageBox.alert(local.window.tip,local.emergency.VmStoppingContactServerError);
        			Ext.websure.MsgError("WF-30098",local.emergency.VmStoppingContactServerError);
        		}
        	});
	}else{
		Ext.websure.MsgError("无","停止虚拟机失败,原因：虚拟机所在的计算节点异常或者离线!");
	}
}

/**
 * 删除虚拟机
 */
function deleteVirtualMachineByVmId(vmId,virtualNodeGrid) {
	
	var computeNodeState = getComputeNodeState(vmId);    //节点状态 1.在线 2.离线 3.异常
    if(computeNodeState ==1 ){
    	
        	var myMask = new Ext.LoadMask(Ext.getBody(), {msg: local.emergency.VmDeleteLoading, removeMask: true }); 
        	myMask.show();
        	
        	Ext.Ajax.request({
        		method : 'post',
        		url : emergencyMapDate.EmergencyMapURL('tovmManager','delVirtualMachine'),
        		params : {
        			'vmManager.id' : vmId
        		},
        		//async:false,
        		timeout: 40000,//10秒
        		success : function(response, options) {
        			var obj=Ext.decode(response.responseText).detail[0];
        			myMask.hide();
        			if(obj.msgCode==30000){
        				Ext.websure.MsgTip.msg(local.window.tip, obj.msgContent,true);
        				//if(calOrVir==1){
        					virtualNodeGrid.getStore().load();
        				/*}else{
        					virtualNodeGrid.getStore().load({params:{'vmManager.computeNoteId':nodeId}});
        				}*/
        				
        				//每次页面刷新更新运行虚拟机个数
        				showVmOnLineMsg();
        				//清空下方虚拟机详细信息
        				refreshVmInfoOnDeleteVmRecord();
        			}else{
        				Ext.websure.MsgError(obj.msgCode , obj.msgContent);
        			}
        		},
        		failure : function() {
        			myMask.hide();
        //			Ext.MessageBox.alert(local.window.tip,local.emergency.VmDeleteContactServerError);
        			Ext.websure.MsgError("WF-30099",local.emergency.VmDeleteContactServerError);
        		}
        	});
    }else{
    	Ext.websure.MsgError("无","删除虚拟机失败,原因：虚拟机所在的计算节点异常或者离线!");
    }
}

/**
 * 修改硬件的基本类型虚拟机
 * 1.虚拟机类型 2.内存 3.CPU 4.网卡类型 5.网卡硬件类型 6.硬盘的类型 7.显卡的类型
 */
function updateVirtualMachineBasisType(actionType,vmId,param) {
	
	var myMask = new Ext.LoadMask(Ext.getBody(), {msg: local.emergency.VmSettingLoading, removeMask: true }); 
	 myMask.show();
	 
	 
	Ext.Ajax.request({
		method : 'post',
		url : emergencyMapDate.EmergencyMapURL('tovmManager','updateVirtualMachineBasisType'),
		params : {
			'vmManager.id' : vmId,
			'actionParam' : param,
			'actionType' : actionType
		},
		//async:false,
		timeout: 40000,//10秒
		success : function(response, options) {
			var obj=Ext.decode(response.responseText).detail[0];
			myMask.hide();
			if(obj.msgCode==30000){
				Ext.websure.MsgTip.msg(local.window.tip, obj.msgContent,true);
				loadVmConfigInfo(vmId);
				
				//刷新列表 解决修改完虚拟机设置后VM_MANAGER_INFO为修改前的内容
				var virtualNodeGridPanel=Ext.getCmp("virtualNodeGridPanelId");
				virtualNodeGridPanel.getStore().load({callback:function(records, operation, success){
					var record=null;
					for(i=0;i<records.length;i++){
						tRecord=records[i];
						if(vmId==tRecord.get("id")){
							emergencyMapDate.VM_MANAGER_INFO=tRecord.data;
							record=tRecord;
						}
					};
  				  if(record){
  					virtualNodeGridPanel.getSelectionModel().setLastFocused(record);
				  }
				}
				}); 
				
				//虚拟机类型修改后判断
				if(actionType==1&&param==1){
					Ext.MessageBox.confirm(local.window.tip,local.emergency.VmChangeSetNet, function(btn){
						if(btn=='yes'){
							Ext.getCmp("virtualTabPanel").setActiveTab(1);
						}
					});
				}
				
			}else{
				Ext.websure.MsgError(obj.msgCode , obj.msgContent);
			}
		},
		failure : function() {
			myMask.hide();
//			Ext.MessageBox.alert(local.window.tip,local.emergency.VmSettingContactServerError);
			Ext.websure.MsgError("WF-30100",local.emergency.VmSettingContactServerError);
		}
	});
}

/**
 *修改虚拟机网桥信息
 * @param nic
 * @param vmNodeNicId
 */
function updateVirtualMachNicInfo(nic,vmNodeNicId) {
	if(null ==nic){
		Ext.MessageBox.alert(local.window.tip,local.emergency.VmIDCannotGet);
		return ;
	}
	
	var myMask = new Ext.LoadMask(Ext.getBody(), {msg: local.emergency.VmNBLoading, removeMask: true }); 
	 myMask.show();
	
	Ext.Ajax.request({
		method : 'post',
		url : emergencyMapDate.EmergencyMapURL('tovmManager','updateVirtualMachNicInfo'),
		params : {
			'vmManager.id' : nic.vmId,
			'vmManagerNic.vmNicId':nic.vmNicId,
			'vmManagerNic.computeNicId':vmNodeNicId
		},
		//async:false,
		timeout: 10000,//10秒
		success : function(response, options) {
			var obj=Ext.decode(response.responseText).detail[0];
			myMask.hide();
			if(obj.msgCode==30000){
				Ext.websure.MsgTip.msg(local.window.tip, obj.msgContent,true);
				loadVmConfigNetInfo(nic.vmId);
			}else{
				Ext.websure.MsgError(obj.msgCode , obj.msgContent);
			}
		},
		failure : function() {
			myMask.hide();
//			Ext.MessageBox.alert(local.window.tip,local.emergency.VmSettingContactServerError);
			Ext.websure.MsgError("WF-30101",local.emergency.VmSettingContactServerError);
		}
	});
}

/**
 *删除虚拟机网桥信息
 * @param nic
 * @param vmNodeNicId
 */
function delVirtualMachNicInfo(nic) {
	if(null ==nic){
		Ext.MessageBox.alert(local.window.tip,local.emergency.VmIDCannotGet);
		return false;
	}
	var myMask = new Ext.LoadMask(Ext.getBody(), {msg: local.emergency.VmNBLoading, removeMask: true }); 
	 myMask.show();
	
	Ext.Ajax.request({
		method : 'post',
		url : emergencyMapDate.EmergencyMapURL('tovmManager','deleteVirtualMachNicInfo'),
		params : {
			'vmManager.id' : nic.vmId,
			'vmManagerNic.vmNicId':nic.vmNicId
		},
		timeout: 10000,//10秒
		success : function(response, options) {
			var obj=Ext.decode(response.responseText).detail[0];
			myMask.hide();
			if(obj.msgCode==30000){
				Ext.websure.MsgTip.msg(local.window.tip, obj.msgContent,true);
				loadVmConfigNetInfo(nic.vmId);
			}else{
				Ext.websure.MsgError(obj.msgCode , obj.msgContent);
			}
			//showVirNetWorkInfo();
		},
		failure : function() {
			myMask.hide();
//			Ext.MessageBox.alert(local.window.tip,local.emergency.VmSettingContactServerError);
			Ext.websure.MsgError("WF-30102",local.emergency.VmSettingContactServerError);
		}
	});
}

function createVmManager(deviceId,emergencyType,SNAPSETID,clusterVmFlag){
	var title=local.emergency.VmCreatingLoading;
	if(emergencyType==5){
		title=local.emergency.emergencyConfigingLoading;
	}
	
	var myMask = new Ext.LoadMask(Ext.getCmp("addVirtualMachWindow"), {msg:title, removeMask: true }); 
	
	//虚拟磁盘Id按1,2,3格式组成字符串
	var vmimgId=null;
	//虚拟机名称
	var virName=null;
	//虚拟机类型
	var virtype=emergencyType;
	if(emergencyType!=5){//应急或则演练
		
		var virNamePanel=Ext.getCmp("vmName");
		//虚拟机名称
		virName=virNamePanel.getValue();
		var alphanum = /^[a-zA-Z0-9_]+$/;
		if (!alphanum.test(virName)) {
			Ext.MessageBox.alert(local.window.tip,local.config.dataIsValidText);
			return false;
		}
		
		if(virName.length>30){
			Ext.MessageBox.alert(local.window.tip,local.emergency.hostNameThanLength);
			return false;
		}else if(virName.length==0){
			Ext.MessageBox.alert(local.window.tip,local.emergency.hostNameNoNull);
			return false;
		}
		
		//获取硬盘Id
		var hardDiskAndVmdk=Ext.getCmp("hardDiskAndVmdkId").items;
		if(hardDiskAndVmdk.length==0){
			Ext.MessageBox.alert(local.window.tip,local.emergency.noSetDiskInfo);
			return false;
		}else{
			var vmimgIdArray=new Array();
			var count=0;
			for(i=0;i<hardDiskAndVmdk.length;i++){

				if(!hardDiskAndVmdk.get(i).checked){//只获取选中的硬盘信息
					continue;
				}else{
					var harddiskId=hardDiskAndVmdk.get(i).inputValue.split('-')[0];
					var vmimgIdTemp=hardDiskAndVmdk.get(i).inputValue.split('-')[1];
					
					//去除重复磁盘Id
					var flag=false;
					for(j=0;j<vmimgIdArray.length;j++){
						var subVmimg=vmimgIdTemp-vmimgIdArray[j];
						if(subVmimg==0){
							flag=true;
						}
					}
					if(!flag){
						vmimgIdArray[count]=vmimgIdTemp;
						++count;
					}
			   }
			};
			
			vmimgId=vmimgIdArray.toString();
		}
		
	}
	
	var sourceId=deviceId;
	//计算节点Id
	var calculateNodeId=Ext.getCmp("computeNoteId").getValue();
	if(null==calculateNodeId){
		Ext.MessageBox.alert(local.window.tip,local.emergency.noSetCalnode);
		return false;
	}
	
	//虚拟机系统类型
	var virSysType=Ext.getCmp("systemTypeId").getValue();
	//虚拟机核数
	var virCpu=Ext.getCmp("valueCpuKernel").getValue();
	if(virCpu<=0){
		Ext.MessageBox.alert(local.window.tip,local.emergency.noSetCPU);
		return false;
	};
	
	//虚拟机内存
	var virMem=Ext.getCmp("memorySizeId").getValue();
	if(virMem<=0){
		Ext.MessageBox.alert(local.window.tip,local.emergency.noSetMem);
		return false;
	};
	var netWork=null;
	if(virtype==1||virtype == 2){
		netWork=Ext.getCmp("netWordConfigId").items;
	}
	
	var netWorkId=null;
	var calculateId=null;
	//接管模式和演练模式网卡区分处理
	if(virtype){//接管
		netWork=Ext.getCmp("netWordConfigId").items;
		
		var netWorkIdArray=new Array();
		var calculateArray=new Array();
		var index=0;
		//if(netWork.length!=0){
			for(j=0;j<netWork.length;j++){
				var checked=netWork.get(j).items.get(0).getChecked();
				if(checked.length==0){
					continue;
				}else{
					netWorkIdArray[index]=netWork.get(j).items.get(0).netWorkId;
					calculateArray[index]=netWork.get(j).items.get(1).value == null ? 0 : netWork.get(j).items.get(1).value;
					if(calculateArray[index]<=0&&(virtype == 1||virtype == 5)){
						Ext.MessageBox.alert(local.window.tip,local.emergency.setVmBNT);
						return false;
					}
					index++;
				}
			}
			if(netWorkIdArray.length<=0){
				Ext.MessageBox.alert(local.window.tip,local.emergency.setVmNT);
				return false;
			}
			if(calculateArray.length<=0&&(virtype == 1||virtype == 5)){
				Ext.MessageBox.alert(local.window.tip,local.emergency.setVmBNT);
				return false;
			};
			netWorkId=netWorkIdArray.toString();
			calculateId=calculateArray.toString();
			/*var checked=netWork.get(0).items.get(0).getChecked();
			//保存本机网卡Id，多个以","分割
			netWorkId=netWork.get(0).items.get(0).netWorkId;
			//保存计算主机网卡Id，多个以","分割
			calculateId=netWork.get(0).items.get(1).value;
			if(null==calculateId){
				Ext.MessageBox.alert(local.window.tip,"计算节点网卡信息未设置");
				return false;
			}
			for(i=1;i<netWork.length;i++){
				var netWorkIdTemp=netWork.get(i).items.get(0).netWorkId;
				netWorkId=netWorkId+","+netWorkIdTemp;
				var calculateIdTemp=netWork.get(i).items.get(1).value;
				calculateId=calculateId+","+calculateIdTemp;
				if(calculateIdTemp==null||calculateIdTemp==""){
					Ext.MessageBox.alert(local.window.tip,"计算节点网卡信息未设置");
					return false;
				}
			}*/
		/*}else{
			Ext.MessageBox.alert(local.window.tip,"请设置虚拟机网卡信息");
			return false;
		}*/
	}
	//演练模式下可以添加子网
	var vmSubNetName = "";  //虚拟子网名称
	if(virtype == 2){
		//虚拟子网信息,若集群演练机开启虚拟子网，则发送相关子网信息
		var vmSubNet = Ext.getCmp('vmSubNet');
		
		var vmSubNetSwitch = vmSubNet.query('checkbox')[0].getValue();
		if(vmSubNetSwitch){
			vmSubNetName = vmSubNet.query('combobox')[0].getRawValue();
			//vmSubNetName = vmSubNet.query('combobox')[0].getValue()
			if(vmSubNetName.length == 0){
				Ext.MessageBox.alert(local.window.tip,"请选择虚拟子网!");
				return false;
			}
			
		}
	}
	
	//小颗粒
	var dataPointValue=""; //默认为空
	var particleSwitchCmp = Ext.getCmp("particleSwitch");  //是否存在小颗粒组件
	if(particleSwitchCmp){
		var particleSwitch = particleSwitchCmp.getValue();  //是否开启小颗粒功能
		if(particleSwitch){
            var dataPoint=Ext.getCmp("dataPointSliderId");
            dataPointValue=dataPoint.dataPointValue;
        }
	}
	
	myMask.show();
	Ext.Ajax.request({
		url:'/emergency/tovmManager!createVmManagerInfo.action',
		timeout: 40000,
		params:{
			"vmManagerModel.vmimgId":vmimgId,
			"vmManager.deviceId":sourceId,
			"vmManager.computeNoteId":calculateNodeId,
			"vmManager.vmName":virName,
			"vmManager.vmType":virtype,
			"vmManager.vmSystemType":virSysType,
			"vmManager.vmMemory":virMem,
			"vmManager.vmCpuKernel":virCpu,
			"vmManager.vmDataTimePoint":dataPointValue,
			"vmManager.vmSubNetName":vmSubNetName,  //虚拟子网名称
			"vmManagerModel.netWorkId":netWorkId,
			"vmManagerModel.calculateId":calculateId/*,
			"vmManagerModel.grainModifyTime":grainModifyTime*/
		}, 
		success: function(resp,opts) {
			myMask.hide();
			var obj=JSON.parse(resp.responseText).detail;
			if(obj.msgCode==30000){
				Ext.websure.MsgTip.msg(local.window.tip, obj.msgContent,true);
				Ext.getCmp('addVirtualMachWindow').close();
			}else{
				Ext.websure.MsgError(obj.msgCode , obj.msgContent);
			}
			
			//创建应急和预设置区分
			if(virtype!=5){
				if(clusterVmFlag == 1){
					expandClusterCurrentDataCollection(SNAPSETID.split('-')[0]);
				}else{
					expandCurrentDataCollection(SNAPSETID.split('-')[0]);
				}
			}else{
				//虚拟机模板预设置
			}
		},    
		failure: function(resp,opts) {
			myMask.hide();
			if(virtype!=5){
//				Ext.MessageBox.alert(local.window.tip,local.emergency.setVmAdminError);
				Ext.websure.MsgError("WF-30103",local.emergency.setVmAdminError);
			}else{
//				Ext.MessageBox.alert(local.window.tip,local.emergency.setVmQuikeError);
				Ext.websure.MsgError("WF-30104",local.emergency.setVmQuikeError);
			}
		}
	});
}
/**
 * 
 * addVirManRemoteHardDiskInfo:增加虚拟磁盘
 * @data 2016-9-28
 * @auth WangShaoDong
 */
function addVirManagerHardDiskInfo(vmimgId){
	
	var myMask = new Ext.LoadMask(Ext.getBody(), {msg: local.emergency.addRemoteVmDiskLoading, removeMask: true }); 
	 myMask.show();
	
	var virtualTabPanel=Ext.getCmp("virtualTabPanel");
	var virId=virtualTabPanel.virtualIndex;
	Ext.Ajax.request({
		url:'/emergency/tovmManager!addVirManHardDiskInfo.action',
		timeout: 100000,
		params:{
			"vmManagerModel.vmimgId":vmimgId,
			"vmManagerModel.virId":virId,
			"vmManagerModel.hardDiskType":2//远程存储
		}, 
		success: function(resp,opts) {
			myMask.hide();
			var obj=Ext.decode(resp.responseText).detail;
			myMask.hide();
			if(obj.msgCode==30000){
				Ext.websure.MsgTip.msg(local.window.tip, obj.msgContent,true);
				//Ext.getCmp('remoteHardDiskWinId').close();
				showVirDetailInfo();
			}else{
				Ext.websure.MsgError(obj.msgCode , obj.msgContent);
				/*Ext.MessageBox.alert(local.window.infoNum+"："+obj.msgCode , obj.msgContent);*/
			}
			
		},    
		failure: function(resp,opts) {
			myMask.hide();
//			Ext.MessageBox.alert(local.window.tip,local.emergency.modifyVmStorageError);
			Ext.websure.MsgError("WF-30105",local.emergency.modifyVmStorageError);
		}
	});
}
/*function addVirManLocalHardDiskInfo(vmimgId){
	
	var myMask = new Ext.LoadMask(Ext.getBody(), {msg: '正在增加虚拟磁盘,请稍后...', removeMask: true }); 
	 myMask.show();
	
	var virtualTabPanel=Ext.getCmp("virtualTabPanel");
	var virId=virtualTabPanel.virtualIndex;
	Ext.Ajax.request({
		url:'/emergency/tovmManager!addVirManHardDiskInfo.action',
		timeout: 100000,
		params:{
			"vmManagerModel.vmimgId":vmimgId,
			"vmManagerModel.virId":virId,
			"vmManagerModel.hardDiskType":1//本地存储
		}, 
		success: function(resp,opts) {
			myMask.hide();
			var vmResponse=JSON.parse(resp.responseText);
			showMsg(vmResponse);
			Ext.getCmp('remoteHardDiskWinId').close();

		},    
		failure: function(resp,opts) {
			myMask.hide();
			Ext.MessageBox.alert(local.window.tip,"修改虚拟机存储异常");
		}
	});
}*/
/**
 * 
 * deleteHardDiskRecord:用户确认是否删除虚拟机磁盘
 * @data 2016-9-12
 * @auth WangShaoDong
 */
function deleteHardDiskRecord(data,vmId,virState){
	if(virState==1){
		Ext.MessageBox.alert(local.window.tip,local.emergency.VmOnlineDiskCannotDelete);
		return false;
	}
	Ext.MessageBox.confirm(local.window.tip,
			local.emergency.deleteDiskConfirm,
			function(btn){
		if(btn=='yes'){
			doDeleteHardDiskRecord(data,vmId);
		}
	});
}
/**
 * 
 * doDeleteHardDiskRecord:处理虚拟机删除硬盘
 * @data 2016-9-12
 * @auth WangShaoDong
 */
function doDeleteHardDiskRecord(data,vmId){
	
	var myMask = new Ext.LoadMask(Ext.getBody(), {msg:local.emergency.deleteVmDiskLoading, removeMask: true }); 
	 myMask.show();
	
	var vmimgId=data;
	Ext.Ajax.request({
		url:'/emergency/tovmManager!deleteHardDiskRecord.action',
		timeout: 40000,
		params:{
			"vmManagerModel.vmimgId":vmimgId,
			"vmManagerModel.virId":vmId
		}, 
		success: function(resp,opts) {
			myMask.hide();
			var vmRes=JSON.parse(resp.responseText);
			var msgCode=vmRes.msgCode;
			var msgContent=vmRes.msgContent;
			if(msgCode>30000){
				Ext.websure.MsgError(msgCode,msgContent);
			}else{
				Ext.websure.MsgTip.msg(local.window.tip, msgContent,true);
			}
			showVirDetailInfo();

		},    
		failure: function(resp,opts) {
			myMask.hide();
//			Ext.MessageBox.alert(local.window.tip,local.emergency.deleteVmStorageError);
			Ext.websure.MsgError("WF-30106",local.emergency.deleteVmStorageError);
		}
	});
}
/**
 * 激活计算节点运行状态图,并加载信息
 * @param {} self
 * @param {} chartType  监控类型
 */
function activeChart(self,chartType){
	
	//清空时间范围
	var countToolBar = Ext.getCmp('countToolBar');
	var timeZoneCombo = countToolBar.query('combobox')[0];
	var timeZone = timeZoneCombo.clearValue();
	
	calMonitorType = chartType;
	var chartPanel = self;
	//网络使用率
	if(chartType==NET_MONITOR){
		showNetRateChart(chartPanel);
	}else{
		chartPanel.removeAll();
		//内存 + CPU使用率
        chartPanel.add({
           xtype:'emergencyTakeOverChart'
        });
        chartPanel.doLayout();
        //加载计算节点运行状态数据
        loadCalRunData(AN_HOUR);    //默认加载最近1小时监控数据
        
	}
}

/**
 * 根据时间段获取运行状态
 * tiemArea：监控时间范围[1,'1小时'],[6,'最近6小时'],[12,'最近12小时']
 * chartType：监控类型 
 */
function loadCalRunData(timeArea){
	
	//获取当前激活的计算节点
    var tabPanel = Ext.getCmp('tabPanel');
    var activeTab = tabPanel.getActiveTab();
    
    //加载网卡运行数据
    if(calMonitorType==NET_MONITOR){
    	var netChart = activeTab.query('chart[itemId=netChart]')[0];
    	
        Ext.Ajax.request({
            url : '/emergency/tocomputeNodes!showComputeNetRunState',
            params : {
                'computeNode.nodeId' : activeTab.id,    //当前选中计算节点ID
                'timeArea' : timeArea    //监控时间段
            },
            success : function(response, options) {
                var obj = Ext.decode(response.responseText);
                var netData = obj.data;
                netChart.store.loadData(netData);
                //更新监控时间段标题
                var countToolBar = Ext.getCmp('countToolBar');
                var timeAreaLabel = countToolBar.query("[itemId='timeZone']")[0];  
                showMonitorLabel(netData,timeAreaLabel,NET_MONITOR);
            }
        });   
    	
    }
    //加载CPU 和 内存运行数据
    else{
    	var emergencyTakeOverChart = activeTab.query('emergencyTakeOverChart')[0];
        emergencyTakeOverChart.store.load({
            params:{
                'computeNode.nodeId':activeTab.id,    //当前计算节点id
                'chartType' : calMonitorType,    //监控类型
                'timeArea' : timeArea    //监控时间段
            },
            //当store 加载完毕
            callback: function(records,opt,success){
                //更新监控时间段标题
                var countToolBar = Ext.getCmp('countToolBar');
                var timeAreaLabel = countToolBar.query("[itemId='timeZone']")[0];
                showMonitorLabel(records,timeAreaLabel);
            }
        });
    }
}

/**
 * 展示多网卡使用率
 */
function showNetRateChart(chartPanel){
	
	var tabPanel = Ext.getCmp('tabPanel');
    var activeTab = tabPanel.getActiveTab();
    Ext.Ajax.request({
        url : '/emergency/tocomputeNodes!showComputeNetRunState',
        params : {
            'computeNode.nodeId' : activeTab.id,    //当前选中计算节点ID
            'timeArea' : AN_HOUR    //默认获取最近1小时监控信息
        },
        success : function(response, options) {
            var obj = Ext.decode(response.responseText);
            createNetChart(chartPanel,obj);
            var netData = obj.data;
            //更新监控时间段标题
            var countToolBar = Ext.getCmp('countToolBar');
            var timeAreaLabel = countToolBar.query("[itemId='timeZone']")[0];  
            showMonitorLabel(netData,timeAreaLabel,NET_MONITOR);  
        }
    });    
	
}
/**
 * 动态创建多网卡运行状态折线图
 * @param {} chartPanel
 * @param {} d
 */
function createNetChart(chartPanel,d) {
    var fields = (d.fields.join(',') + ',chartDate'+ ',showDate').split(',');    //动态生成fields，添加固定字段chartDate及showDate。
    Ext.define('DynamicMulLineChart', {
        extend: 'Ext.data.Model',
        fields: fields
    });
    var store = Ext.create('Ext.data.Store', {
        model: 'DynamicMulLineChart',
        data: d.data
    });
    var series = [];    //动态创建series设置数组
    var colors = ['#01BF9D','#5BABE6','#B887CD','#F3C500','#FB9524','#7E8C8D','#55C738'];    //动态定义每条线的颜色
    for (var i = 0, j = d.fields.length; i < j; i++)  
        (function (i) {    //需要做闭包，tips要获取对应的项目数据
            series[i] = {
                type: 'line',
                axis: 'left',
                gutter: 80,
                showMarkers:false,    //隐藏点标记
                theme:'Green',
                xField: 'chartDate',
                yField: d.fields[i], //
                style:{'stroke-width':1,fill:colors[i],stroke:colors[i]},
                marketConfig:{radius:5},
                tips: {
                    trackMouse: true,
                    width: 175,
                    height: 45,
                    style:'text-align:center;',
                    renderer: function (storeItem, item) {
                    	//var netCard = Object.keys(storeItem.data)[0];
                    	var netCard = getObjectKeys(storeItem.data)[0];
                    	var dateStr = storeItem.get('chartDate');    //2016-2-27 09:59:00
                        var useRate = storeItem.get(d.fields[i]);    //使用比率
                        this.setTitle(dateStr+'<br/>'+netCard+local.emergency.useRate+useRate+' %');
                    }
                }
            };
         })(i);
        
  
    var netChart = Ext.create('Ext.chart.Chart', {
    	           itemId : 'netChart',
                   store : store,
                    //动画
                   animate: true,
                   //阴影
                   shadow: false,
                   theme:"charTheme",
                   axes: [{
                       type: 'Numeric',
                       position: 'left',
                       fields: d.fields,
                       title: false,
                       minimum : 0,    //最小值
                       maximum : 100,    //最大值
                       grid: true,
                       label:{
                           renderer:function(val){
                                if(val%20==0){
                                    return val;
                                }else{
                                    return '';
                                }
                           }
                       }
                   }, {
                       type:'Category',
                       position: 'bottom',
                       fields: ['showDate'],    // X 轴展示Date
                       title: false,
                       grid:false,
                       dashSize: 1,    //控制刻度的长度
                       label:{
                           renderer:function(val){
                           	    return val;
                           }
                       }
                   }], 
                   legend:{
                        position: 'right'
                   },
                   series:series
    });
    chartPanel.removeAll();
    chartPanel.add(netChart);
    chartPanel.doLayout();
}

/**
 * 获取js对象的自定义属性
 * 用于替换 Object.keys(); IE8 不支持.keys() 方法
 * @param {} object
 */
function getObjectKeys(object){

	var props = [];    //定义数组存放object属性

	for(var p in object){
		if(object.hasOwnProperty(p)){
			props.push(p);
		}
	}

	return props;
}
/**
 * 
 * startAndStopLaterShowVirDetailMes:启动停止虚拟机后保留着当前记录
 * @data 2016-9-28
 * @auth WangShaoDong
 */
function startAndStopLaterShowVirDetailMes(virId,virtualNodeGrid){
	var record;
	virtualNodeGrid.getStore().load({callback:function(records, operation, success){
		tRecord=null;
		for(i=0;i<records.length;i++){
			if(virId==records[i].get("id")){
				tRecord=records[i];
			}
		};
		if(tRecord){
			record=tRecord;
			virtualNodeGrid.getSelectionModel().select(tRecord);
		};
		showVirtualSouthPanel(record);
	}
	});
}
/**
 * 
 * stepIntoSnapShotDetailByDeviceId:单击源设备IP跳转到原设备对应的快照页面
 * @data 2016-8-6
 * @auth WangShaoDong
 */
function stepIntoSnapShotDetailByDeviceId(deviceId){
	var contentPanel = Ext.getCmp('contentPanel');
	var grobleTreePanel=contentPanel.previousSibling("grobleTreePanel");
	var treeNodes=grobleTreePanel.getStore().getRootNode();
	var childnodes = treeNodes.childNodes;
	for(i=0;i<childnodes.length;i++){
		var groupNodes=childnodes[i].childNodes;
		for(j=0;j<groupNodes.length;j++){
			var deviceNodes=groupNodes[j];
			var treeDeviceId=deviceNodes.raw.deviceId;
			if(deviceId==treeDeviceId){
				grobleTreePanel.getSelectionModel().select(deviceNodes); 
				var licenseEmergency=deviceNodes.raw.licenseEmergency;
				var contentPanel = Ext.getCmp('contentPanel');
				contentPanel.removeAll();
				var takeOver = Ext.create("acesure.emergency.view.TakeOver",{
					clusterIdentity : deviceNodes.raw.clusterIdentity,
					deviceId : deviceNodes.raw.deviceId,
					deviceName : deviceNodes.raw.pageText,
					deviceIp : deviceNodes.raw.ip,
					uuid : deviceNodes.raw.uuid,
					sysInfo : deviceNodes.raw.sysInfo,
					version : deviceNodes.raw.version,
					type : deviceNodes.raw.type,
					ip:deviceNodes.raw.ip,
					authorizeEmergency:licenseEmergency,
		    	    deviceType:deviceNodes.raw.deviceType,
		    	    deviceState:deviceNodes.raw.status
				});
				contentPanel.add( takeOver );
				contentPanel.doLayout();
			}
		}
	}
}
/**
 * 
 * stepEmergencyList:单击应急图标跳转虚拟机管理页面
 * @data 2016-9-28
 * @auth WangShaoDong
 */
function stepEmergencyList(data){
	//关闭弹窗
	var clusterVmimgUseInfo = Ext.getCmp('clusterVmimgUseInfo');
	if(clusterVmimgUseInfo){
                 clusterVmimgUseInfo.destroy();
    }
	
	SERVERANME=data;
	var contentPanel = Ext.getCmp('contentPanel');
	contentPanel.removeAll();
	contentPanel.add({
		xtype : 'emergency',
		itemId : 'emergencyPanel'
	});
}
/**
 *showEditVirtualNicWin:修改虚拟子网 
 *@data 2017-5-13
 *@auth Nico
 **/
function showEditVirtualNicWin(virNetId){
	
	Ext.Ajax.request({
                url:'/emergency/tocomputeNodesNic!findComputeNodesVirtualNetByNicId',
                params:{
                    "computeVirtualNicId":virNetId
                },
                success: function(resp,opts) {
                	var virNetObj = Ext.decode(resp.responseText).virtualNic;
                	
                	var editVirtualNetWin = Ext.create("acesure.emergency.view.addVmNicWindow");
                    //Button
                    var addVirBtn = editVirtualNetWin.query("button[itemId='addVirNicBtn']")[0];
                    var editVirBtn = editVirtualNetWin.query("button[itemId='editVirNicBtn']")[0];
                    
                    //textField
                    var computeVirtualNicId = editVirtualNetWin.query("textfield[itemId='computeVirtualNicId']")[0];
                    var computeId = editVirtualNetWin.query("textfield[itemId='computeId']")[0];
                    var computeVirtualNicName = editVirtualNetWin.query("textfield[itemId='computeVirtualNicName']")[0];
                    var computeVirtualNicGateWay = editVirtualNetWin.query("textfield[itemId='computeVirtualNicGateWay']")[0];
                    
                    //update value
                    editVirtualNetWin.setTitle("编辑虚拟子网");
                    addVirBtn.hide();
                    editVirBtn.show();
                    editVirtualNetWin.show();
                    
                    //insert value
                    computeVirtualNicId.setValue(virNetObj.computeVirtualNicId);
                    computeId.setValue(virNetObj.computeId);
                    computeVirtualNicName.setValue(virNetObj.computeVirtualNicName);
                    computeVirtualNicGateWay.setValue(virNetObj.computeVirtualNicGateWay);                    
                	
                },
                failure: function(resp,opts) {
                    Ext.websure.MsgError("WF-30107",'获取虚拟子网信息出现异常!');
                }
            });
    
}

/**
 * 编辑虚拟子网
 */
function editVirtualNic(){
	
	if (!Ext.getCmp('virtualNicForm').getForm().isValid()) {
        return;
    }
	
	//验证虚拟子网名称及网关是否重复
    var addVmNicWindow = Ext.getCmp('addVmNicWindow');
    var virNetId = addVmNicWindow.query("textfield[itemId='computeVirtualNicId']")[0].getValue();
    var virNetName = addVmNicWindow.query("textfield[itemId='computeVirtualNicName']")[0].getValue();
    var virNetGateWay = addVmNicWindow.query("textfield[itemId='computeVirtualNicGateWay']")[0].getValue();
    
    Ext.Ajax.request({
        url:'/emergency/tocomputeNodesNic!checkVirNetNameOrGateWay.action',
        params:{
        	'virNetId':virNetId,
            'virNetName':virNetName,
            'gateWay':virNetGateWay
        },
        success: function(resp,opts) {
            var resObj=JSON.parse(resp.responseText);
            var msgCode = resObj.msgCode;
            var msgContent = resObj.msgContent;
            if(msgCode>30000){
                Ext.websure.MsgError(msgCode,msgContent);
            }else{
                var myMask = new Ext.LoadMask('addVmNicWindow', {
                    msg : '正在修改虚拟子网,请稍等...'
                });
                myMask.show();
                Ext.getCmp('virtualNicForm').getForm().submit({
                                method : 'post',
                                type : 'submit',
                                url : '/emergency/tocomputeNodesNic!updateComputeVirtualNic',
                                success : function(form, action) {
                                    myMask.hide();
                                    Ext.getCmp("addVmNicWindow").close();
                                    //刷新网络面板
                                    refreshComputeNetPage();
                                },
                                failure : function(form, action) {
                                    myMask.hide();
                                    Ext.getCmp("addVmNicWindow").close();
                                    Ext.websure.MsgError('WF-30068',local.config.webError);
                                }
                            });
                
            }
        },
        failure: function(resp,opts) {
            Ext.websure.MsgError("WF-30107",'验证虚拟子网信息时发生异常!');
        }
    });
}

/**
 *deleteVmNic:删除虚拟子网 
 *@data 2017-5-13
 *@auth Nico
 **/
function deleteVmNic(virNetId){
    Ext.MessageBox.confirm("提示","确认删除此虚拟子网？",function(btn){
        if(btn == 'yes'){
        	var myMask = new Ext.LoadMask(Ext.getBody(), {
                msg : '正在删除虚拟子网,请稍等...'
            });
            myMask.show();
        	Ext.Ajax.request({
                url:'/emergency/tocomputeNodesNic!delComputeVirtualNic',
                params:{
                    "computeVirtualNicId":virNetId
                },
                success: function(resp,opts) {
                    myMask.hide();
                    var resObj=JSON.parse(resp.responseText);
                    var msgCode = resObj.msgCode;
                    var msgContent = resObj.msgContent;
                    if(msgCode>30000){
                       Ext.websure.MsgError(msgCode,msgContent);
                    }else{
                        refreshComputeNetPage();
                    }
                    
                },
                failure: function(resp,opts) {
                    myMask.hide();
                    Ext.websure.MsgError("WF-30107",'删除虚拟子网出现异常!');
                }
            });
        }
    })
}

/**
 *showAddVirtualNicWin:弹出新增虚拟子网 
 *@data 2017-5-13
 *@auth Nico
 **/
function showAddVirtualNicWin(){
    var addVmNicWin = Ext.create("acesure.emergency.view.addVmNicWindow");
    addVmNicWin.show();
    
	var computeNodeId = Ext.getCmp('tabPanel').getActiveTab().id;  //当前选中计算节点
	
	addVmNicWin.query("textfield[itemId='computeId']")[0].setValue(computeNodeId);
}

/**
 * 增加虚拟子网
 */
function addVirtualNic(){
	
	if (!Ext.getCmp('virtualNicForm').getForm().isValid()) {
        return;
    }
                
    //验证虚拟子网名称及网关是否重复
    var addVmNicWindow = Ext.getCmp('addVmNicWindow');
    var virNetName = addVmNicWindow.query("textfield[itemId='computeVirtualNicName']")[0].getValue();
    var virNetGateWay = addVmNicWindow.query("textfield[itemId='computeVirtualNicGateWay']")[0].getValue();
    
    Ext.Ajax.request({
        url:'/emergency/tocomputeNodesNic!checkVirNetNameOrGateWay.action',
        params:{
        	'virNetName':virNetName,
        	'gateWay':virNetGateWay
        },
        success: function(resp,opts) {
            var resObj=JSON.parse(resp.responseText);
            var msgCode = resObj.msgCode;
            var msgContent = resObj.msgContent;
            if(msgCode>30000){
                Ext.websure.MsgError(msgCode,msgContent);
            }else{
        	    var myMask = new Ext.LoadMask('addVmNicWindow', {
                    msg : '正在添加虚拟子网,请稍等...'
                });
                myMask.show();
                Ext.getCmp('virtualNicForm').getForm().submit({
                                method : 'post',
                                type : 'submit',
                                url : '/emergency/tocomputeNodesNic!addComputeVirtualNic',
                                success : function(form, action) {
                                    myMask.hide();
                                    
                                    var resObj=action.result;
                                    var msgCode = resObj.msgCode;
                                    var msgContent = resObj.msgContent;
                                    if(msgCode>30000){
                                       Ext.websure.MsgError(msgCode,msgContent);
                                    }else{
                                       Ext.getCmp("addVmNicWindow").close();
                                       //刷新网络面板
                                       refreshComputeNetPage();
                                    }
                                    
                                },
                                failure : function(form, action) {
                                    myMask.hide();
                                    Ext.getCmp("addVmNicWindow").close();
                                    Ext.websure.MsgError('WF-30068',local.config.webError);
                                }
                            });
            	
            }
        },
        failure: function(resp,opts) {
            Ext.websure.MsgError("WF-30107",'验证虚拟子网信息时发生异常!');
        }
    });
	
}

/**
 * 刷新计算节点网络展示面板
 */
function refreshComputeNetPage(){
	var me = Ext.ComponentQuery.query("calNodeRunPanel")[0];
	getVmNetTopologyByNodeId(me);
}

Ext.define("acesure.emergency.view.addVmNicWindow", {
    extend : 'Ext.window.Window',
    title:'增加虚拟子网',
    width: 350,
    id:'addVmNicWindow',
    layout: "form",
    bodyPadding:20,
    modal: true, 
    border:false,
    resizable: false,
    buttons : [{
        text : '保存',
        itemId:'addVirNicBtn',
        cls:"btn_focus",
        handler : function() {
        	addVirtualNic();
        }
    },{
        text : '修改',
        itemId:'editVirNicBtn',
        hidden : true,
        cls:"btn_focus",
        handler : function() {
            editVirtualNic();
        }
    },{
        text : local.btn.cancle,
        handler : function() {
            Ext.getCmp('addVmNicWindow').close();
        }
    }],
    items:[{
            id:'virtualNicForm',
            xtype:'form',
            border:false,
            width:'100%',
            items:[{
                xtype: 'textfield',
                hidden:true,
                itemId:'computeVirtualNicId',
                name:'computeNodesVirtualNic.computeVirtualNicId'
              },{
            	xtype: 'textfield',
            	hidden:true,
            	itemId:'computeId',
            	name:'computeNodesVirtualNic.computeId'
              },{
                   xtype: 'textfield',
                   fieldLabel:'虚拟子网名称',
                   itemId:'computeVirtualNicName',
                   name:'computeNodesVirtualNic.computeVirtualNicName',
                   width: 300,
                   labelWidth:100,
                   msgTarget:'side',
                   allowBlank:false
               },{
                   xtype: 'textfield',
                   fieldLabel:'虚拟子网网关',
                   itemId:'computeVirtualNicGateWay',
                   name:'computeNodesVirtualNic.computeVirtualNicGateWay',
                   width: 300,
                   labelWidth:100,
                   allowBlank:false,
                   msgTarget:'side',
                   vtype:'IPAddress'
              }
            ]
          }]
    });
//自定义Vtype:'IPAddress'
Ext.apply(Ext.form.field.VTypes, {
    IPAddress:  function(v) {
        return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(v);
    },
    IPAddressText: '请输入正确的IP地址',
    IPAddressMask: /[\d\.]/i
});
/**
 * 
 * stepIntoCompute:虚拟机管理页面，单击计算节点名称跳转到对应计算节点详细信息
 * @data 2016-9-28
 * @auth WangShaoDong
 */
function stepIntoCompute(data){
	tabPanel = Ext.getCmp('tabPanel');
	for(i=0;i<tabPanel.items.items.length;i++){
		var childPanel=tabPanel.items.items[i];
		if(data==childPanel.title){
			tabPanel.setActiveTab(i);
		}
	}
}
/**
 * 
 * deviceFastEmergency:设备树右键快速接管
 * @data 2016-9-28
 * @auth WangShaoDong
 */
function deviceFastEmergency(data){
	var deviceId=data;
	var myMask = new Ext.LoadMask(Ext.getBody(), {msg: local.emergency.takeoveringLoading, removeMask: true });
	Ext.MessageBox.confirm(local.window.tip,
			local.emergency.determineOver,
			function(btn){
		if(btn=='yes'){
			myMask.show();
			Ext.Ajax.request({
				url:'/emergency/tovmManager!fastStartVirtualMach.action',
				params:{
					"vmManagerModel.deviceId":deviceId,
					"vmManagerModel.type":3,
					"vmManagerModel.snapSetId":""
				},
				timeout: 40000, 
				success: function(resp,opts) {
					myMask.hide();
					var vmResponse=JSON.parse(resp.responseText);
					var msgCode=vmResponse[0].msgCode;
					var msgContent=vmResponse[0].msgContent;
					var serverName=vmResponse[0].remark0;
					var serverId=vmResponse[0].remark1;
					if(msgCode>30000){
						Ext.websure.MsgError(msgCode,msgContent);
					}else{
						Ext.MessageBox.confirm(local.window.tip,
								local.emergency.VmCreatSuccessIsStartVm,
								function(btn){
							if(btn=='yes'){
								stepEmergencyList(serverName);
								startVirtualMachineByVmId(serverId,"","fast");
							}
						}
						);
					}
				},
				failure: function(resp,opts) {
					myMask.hide();
//					Ext.MessageBox.alert(local.window.tip,local.emergency.quickTakeOverError);
					Ext.websure.MsgError("WF-30107",local.emergency.quickTakeOverError);
				}
			});
		}
	});
}
/**
 * 
 * setEmergencyDevice:设置当前设备为应急主机
 * @data 2016-10-27
 * @auth WangShaoDong
 */
function setEmergencyDevice(data,data2,data3,data4){//data1:设备Id，data2:设置权限来源，1：来源与设备设置，2：来源于快照设置
	var deviceId=data;
	var type=data2;
	var virType=data3;
	var snapSetId=data4;
	var authorizeEmergencyWin=Ext.create("acesure.emergency.view.authorizeEmergencyWindow",{
		deviceId:deviceId,
		type:type,
		virType:virType,
		snapSetId:snapSetId
	});
	authorizeEmergencyWin.show();
}


/**
 * 
 * getVmModelInfoForUpdate:虚拟机模板更新操作获取源模板信息
 * @data 2016-9-7
 * @auth WangShaoDong
 */
function getVmModelInfoForUpdate(data1,data2){
	var deviceId=data1;
	var type=data2;
	Ext.Ajax.request({
		url:'/emergency/tovmManager!getVmManagerModelForUpdate.action',
		params:{
			"vmManagerModel.deviceId":deviceId
		},
		timeout: 40000, 
		success: function(resp,opts) {
			var vmResponse=JSON.parse(resp.responseText);
			//if(null!=vmResponse){
			createFastEmergencyModel(deviceId,type,vmResponse);
			//}
		}
	});
}
/**
 * 
 * createFastEmergencyModel:创建虚拟机模板
 * @data 2016-9-7
 * @auth WangShaoDong
 */
function createFastEmergencyModel(deviceId,type,modelInfo){
	var configMountWin=Ext.create("acesure.emergency.view.AddVirtualMachWindow",{
		deviceIdWin:deviceId,
		typeWin:type,
		emergencyType:5,//共用创建虚拟机接口，设置字段5标识创建虚拟机模板
		modelInfo:modelInfo
	});
	configMountWin.show();
}
/**
 * 
 * refreshVmInfoOnDeleteVmRecord:虚拟机记录删除成功后，更新下面虚拟机信息
 * @data 2016-10-19
 * @auth WangShaoDong
 */
function refreshVmInfoOnDeleteVmRecord(){
	var virtualSouthPanel=Ext.getCmp("virtualSouthPanelId");
	var length= virtualSouthPanel.items.length;
	//如果当前显示的是虚拟机信息和日志信息，则删除当前面板增加日志面板
	if(length==2){
		virtualSouthPanel.remove(0);
		Ext.getCmp("virtual_log_id").getComponent("emergencyLogItemId").store.load();
	}
}
/**
 * 
 * configNewVmMachine:创建虚拟机
 * @data 2016-10-27
 * @auth WangShaoDong
 */
function configNewVmMachine(data1,data2,data3,deviceAuthority){//data1:snapsetId,data2:type,(data3,deviceId)
	var snapSetId=data1;
	var virType=data2;//1:接管，2：演练，3：集群接管，4：集群演练
	//集群虚拟机配置
	if(virType == 3 || virType == 4){
		var clusterdeviceId = null;
		if(data3){
			clusterdeviceId = data3;
		}else{
			clusterdeviceId = 0;
		}
		 Ext.Ajax.request({
			   url:'/backup/todeviceAction!getClusterDeviceInfoByMaterDiskClone.action',
			   params:{"diskCloneId":snapSetId.split("-")[0],
				   			"setId":snapSetId.split("-")[1],
				   			"deviceId":clusterdeviceId}, 
			   success: function(resp,opts) {
				   var returnJson= JSON.parse(resp.responseText).info;
				   if(returnJson.diskCloneId == null){
					   Ext.Msg.alert(local.window.tip,returnJson);
					   return;
				   }
				   var configMountWin=Ext.create("acesure.emergency.view.AddVirtualMachWindow",{
						ddIds : returnJson.diskCloneId,//diskcloneid 集群设备 对应masterdiskclone 的 diskclone
						deviceIdWin : returnJson.deviceId,//设备id
						typeWin :"",//系统类型
						snapSetIdWin : returnJson.diskCloneId + '-' + snapSetId.split("-")[1],//diskcloneid_setid_?
						emergencyType : virType,
						licenseEmergency : returnJson.licenseEmergency
					});
					configMountWin.show();
			   },
			   failure: function(resp,opts) {
			   }
		   });
		return;
	}
	
	//普通机器虚拟机配置
	Ext.Ajax.request({
		url:'/recovery/mountAction!hasOs.action',
		params:{setId:snapSetId},
		timeout: 100000, 
		success: function(resp,opts) {
			if(null!=resp.responseText){
				var returnJson=resp.responseText;
				var hasSys=returnJson.split('-')[0];
				var emergencyOrNo=returnJson.split('-')[1];
				var mountOrNo=returnJson.split('-')[2];
				if(emergencyOrNo>0){
					Ext.MessageBox.alert(local.window.tip,local.recovery.emeryConfiged);
					return false;
				}
				if(mountOrNo>0){
					Ext.MessageBox.alert(local.window.tip,local.recovery.mountConfiged);
					return false;
				}

				if(hasSys==0){
					Ext.MessageBox.alert(local.window.tip,local.emergency.systemDisk);
				}else{
					var configMountWin=Ext.create("acesure.emergency.view.AddVirtualMachWindow",{
						ddIds:ddId,
						deviceAuthority:deviceAuthority,
						deviceIdWin:DEVICEID,
						typeWin:type,
						snapSetIdWin:snapSetId,
						emergencyType:virType
					});
					configMountWin.show();
				}

			}
		},
		failure: function(resp,opts) {
//			Ext.MessageBox.alert(local.window.tip,"应急设置异常，请查看相应日志信息！");
			Ext.websure.MsgError("WF-30108",local.emergency.emErrorPlViewLog);
		}
	});
}
/**
 * 
 * fastConfigNewVmMachine:快速创建虚拟机
 * @data 2016-10-27
 * @auth WangShaoDong
 */
function fastConfigNewVmMachine(data1,data2,data3){
	var deviceId=data1;
	var virType=data2;
	var snapSetId=data3;
	var msg=local.emergency.determineOver;
	if(virType==2){
		msg=local.emergency.startRehearsal;
	}
	Ext.MessageBox.confirm(local.window.tip,
			msg,
			function(btn){
		if(btn=='yes'){
			var myMask = new Ext.LoadMask(Ext.getBody(), {msg: local.emergency.takeoveringLoading, removeMask: true }); 
			myMask.show();
			//如果已经被应急则不能设置应急信息
			Ext.Ajax.request({
				url:'/emergency/tovmManager!fastStartVirtualMach.action',
				params:{
					"vmManagerModel.deviceId":deviceId,
					"vmManagerModel.type":virType,
					"vmManagerModel.snapSetId":snapSetId
				},
				timeout: 100000, 
				success: function(resp,opts) {
					myMask.hide();
					var vmResponse=JSON.parse(resp.responseText);
					var msgCode=vmResponse[0].msgCode;
					var msgContent=vmResponse[0].msgContent;
					var serverName=vmResponse[0].remark0;
					var serverId=vmResponse[0].remark1;
					if(msgCode>30000){
						Ext.websure.MsgError(msgCode,msgContent);
					}else{
						Ext.MessageBox.confirm(local.window.tip,
								local.emergency.VmCreatSuccessIsStartVm,
								function(btn){
							if(btn=='yes'){
								stepEmergencyList(serverName);
								startVirtualMachineByVmId(serverId,"","fast");
							}
						}
						);
					}
					expandCurrentDataCollection(snapSetId.split('-')[0]);
				},
				failure: function(resp,opts) {
					myMask.hide();
					Ext.websure.MsgError("WF-30109",local.emergency.quickEmErrorPlViewLog);
				}
			});
		}
	});
}

/**
 * 
 * configAutoTakeOver:设置自动接管
 * @data 2016-10-28
 * @auth WangShaoDong
 */
function configAutoTakeOver(data1){
	var deviceInfo=data1;
	//先判断是否设置了虚拟机模板
	Ext.Ajax.request({
		url:'/emergency/tovmManager!checkVmModelAndAutoEmCfg.action',
		params:{
			"vmManagerModel.deviceId":deviceInfo.deviceId
		},
		timeout: 100000, 
		success: function(resp,opts) {
			var vmResponse=JSON.parse(resp.responseText);
			var vmModel=vmResponse.vmModel;
			var setInfo=vmResponse.autoConfig;
			if(!vmModel){
				Ext.MessageBox.confirm(local.window.tip,
						local.emergency.currentDeviceUnconfigVirImConfig,
						function(btn){
					if(btn=='yes'){
						createFastEmergencyModel(deviceInfo.deviceId,deviceInfo.type);//设备ID，系统类型
					};
				});
			}else{
				var configTakeOverWin=Ext.create("acesure.emergency.view.configAutoTakeoverWindow",{
					deviceInfo:deviceInfo,
					setInfo:setInfo
				});
				configTakeOverWin.show();
			}
		},
		failure: function(resp,opts) {
			Ext.MessageBox.alert(local.window.tip,local.emergency.emErrorPlViewLog);
		}
	});
}
	
/**
 * 
 * addVmManagerSetInfo:增加设备自动接管权限
 * @data 2016-11-1
 * @auth WangShaoDong
 */
function addVmManagerSetInfo(data1,data2,data3){
	var deviceId=data1;
	var checked=data2;
	var netInterruptMin=data3;
	Ext.Ajax.request({
		url:'/emergency/tovmManager!addVmManagerSetInfo.action',
		params:{
			"vmManagerSet.deviceId":deviceId,
			"vmManagerSet.state":checked,
			"vmManagerSet.netInterruptMin":netInterruptMin
			},
		timeout: 100000, 
		success: function(resp,opts) {
			var vmResponse=JSON.parse(resp.responseText);
			showMsg(vmResponse);
			Ext.getCmp("configAutoTakeoverWindow").close();
		},
		failure: function(resp,opts) {
			Ext.MessageBox.alert(local.window.tip,local.emergency.AutoTakeOverSetError);
		}
	});
}
/**
 * 
 * addDeviceEmergencyLicense:增加设备应急权限
 * @data 2016-11-1
 * @auth WangShaoDong
 */
function addDeviceEmergencyLicense(data1,data2,data3){
	var deviceId=data1;
	var takeover=data2;
	var emulation=data3;
	Ext.Ajax.request({
		url:'/emergency/tovmManager!addDeviceEmergencyLicense.action',
		params:{
			"deviceId":deviceId,
			"takeover":takeover,
			"emulation":emulation
		},
		timeout: 100000, 
		success: function(resp,opts) {
			var vmResponse=JSON.parse(resp.responseText);
			//刷新左侧树
			Ext.getCmp('grobleTreePanel').getStore().reload();
			return vmResponse;
		},
		failure: function(resp,opts) {
			Ext.MessageBox.alert(local.window.tip,local.emergency.deviceConfigVirError);
		}
	});
}
/**
 * 
 * showEmergencyLicenseSize:显示设备应急权限信息
 * @data 2016-11-1
 * @auth WangShaoDong
 */
function showEmergencyLicenseSize(v){
	Ext.Ajax.request({
		url:'/emergency/tovmManager!showEmergencyLicenseSize.action',
		timeout: 100000,
		async:false,
		success: function(resp,opts) {
			var licenseInfo=JSON.parse(resp.responseText);
			if(licenseInfo){
				if(licenseInfo.allTakeOver==-1||licenseInfo.allEmulation==-1){
					var htmlStr=local.emergency.deviceAuthNum;
					v.update(htmlStr);
				}else{
					var htmlStr=local.emergency.remainAuthNum1+licenseInfo.remainTakeOver+local.emergency.remainAuthNum2+licenseInfo.remainEmulation;
					v.update(htmlStr);
				}
				/*var allTakeOver;
				var allEmulation;
				var remainTakeOver;
				var remainEmulation;
				if(licenseInfo.allTakeOver==-1){
					allTakeOver="无限制";
					remainTakeOver="无限制";
				}else{
					allTakeOver=licenseInfo.allTakeOver+"个";
					remainTakeOver=licenseInfo.remainTakeOver+"个";
				}
				if(licenseInfo.allEmulation){
					allEmulation="无限制";
					remainEmulation="无限制";
				}else{
					allEmulation=licenseInfo.allEmulation+"个";
					remainEmulation=licenseInfo.remainEmulation+"个";
				}
				var htmlStr="总授权设备信息：接管"+allTakeOver+"，演练"+
				allEmulation+"</br>余授权设备信息：接管"+remainTakeOver+"，演练"+remainEmulation;
				v.update(htmlStr);*/
			}
		},
		failure: function(resp,opts) {
			Ext.MessageBox.alert(local.window.tip,local.emergency.deviceConfigVirError);
		}
	});
}
/**
 * 
 * updateLicenseEmergency:授权演练为接管授权，授权升级确认
 * @data 2016-11-8
 * @auth WangShaoDong
 */
function updateLicenseEmergency(deviceId){
	Ext.MessageBox.confirm(local.window.tip,
			local.emergency.confirmUpdateLicenseEmergency,
			                              function(btn){
		                                     if(btn=='yes'){
		                                    	 doUpdateLicenseEmergency(deviceId);
		                                     }
	                                      });
}
/**
 * 
 * doUpdateLicenseEmergency:授权演练为接管授权，授权升级
 * @data 2016-11-8
 * @auth WangShaoDong
 */
function doUpdateLicenseEmergency(deviceId){
	Ext.Ajax.request({
		url:'/emergency/tovmManager!addDeviceEmergencyLicense.action',
		params:{
			"deviceId":deviceId,
			"takeover":1,
			"emulation":0
		},
		timeout: 100000, 
		success: function(resp,opts) {
			var vmResponse=JSON.parse(resp.responseText);
			
			var msgCode=vmResponse[0].msgCode;
			var msgContent=vmResponse[0].msgContent;
			if(msgCode>30000){
				Ext.websure.MsgError(msgCode,msgContent);
			}else{
				Ext.websure.MsgTip.msg(local.window.tip, msgContent,true);
				AYTHORIZEEMERGENCY=1;
				Ext.getCmp('grobleTreePanel').getStore().reload();
			}
		},
		failure: function(resp,opts) {
			Ext.MessageBox.alert(local.window.tip,local.emergency.deviceAuthVirError);
		}
	});
}

// 弹出新增附件 type 1:add 2:update
function showAddVmAttachment(id, information, type){
	
	var virtualTabPanel=Ext.getCmp("virtualTabPanel");
	var vmId=virtualTabPanel.virtualIndex;
	
	
	var attachment = {
		'id':id,
		'information':information,
		'vmManagerID':vmId
	}
	
	console.debug("attachment", attachment);
	var attwindow=Ext.create("acesure.emergency.view.updateVmAttachmentWindow", {
		attachment:attachment,
		createType:type
	});
	attwindow.show();
}

//新增附件
function addVmAttachment(id, information, usbType){
	
	var virtualTabPanel=Ext.getCmp("virtualTabPanel");
	var vmId=virtualTabPanel.virtualIndex;

	
	if(0==vmId) return;
	//获取数据
	Ext.Ajax.request({
		method : 'post',
		url : "/emergency/tovmManager!addVirtualMachAttachment.action",
		params : {
			
			'vmManager.id' : vmId,
			'vmAttachment.id' : id,
			'vmAttachment.vmManagerID' : vmId,
			'vmAttachment.information' : information,
			'vmAttachment.generation':usbType
			
		},
		async:true,
		timeout: 10000,//10秒
		success : function(response, options) {
			//加载页面html
			var result = JSON.parse(response.responseText);
			if(!result.result){
				Ext.websure.MsgError("消息码", result.msg);
				return;
			}
			Ext.websure.MsgTip.msg('成功', result.msg, true);
			showVirAttachment();
		},
		failure : function() {
			Ext.websure.MsgError("ERROR","添加失败");
		}
	});
}
//修改附件
function updateVmAttachment(oldAttachment, attachment, usbType){
	
	var virtualTabPanel=Ext.getCmp("virtualTabPanel");
	var vmId=virtualTabPanel.virtualIndex;
	
	if(0==vmId) return;
	
	var params = {
			'vmManager.id' : vmId,
			'vmAttachment.id' : attachment.id,
			'vmAttachment.information' : attachment.information,
			'vmAttachment.generation' : usbType,
			'oldAttachment.information' : oldAttachment.information,
			'oldAttachment.id' : oldAttachment.id
	}
	
//	console.debug("params", params);
	
	//获取数据
	Ext.Ajax.request({
		method : 'post',
		url : "/emergency/tovmManager!updateVirtualMachAttachment.action",
		params : params,
		async:true,
		timeout: 10000,//10秒
		success : function(response, options) {
			var result = JSON.parse(response.responseText);
			if(!result.result){
				Ext.websure.MsgError("消息码", result.msg);
				return;
			}
			Ext.websure.MsgTip.msg('成功', result.msg, true);
			showVirAttachment();
		},
		failure : function() {
			Ext.websure.MsgError("ERROR","修改USB设备失败");
		}
	});
}
//删除附件
function deleteVmAttachment(content,vmId,attachmentId){
	Ext.MessageBox.confirm(
			local.window.tip,
			"是否删除该附件？",
          function(btn){
             if(btn=='yes'){
            	 del();
             }
          }
	);
	
	function del(){
		
		var virtualTabPanel=Ext.getCmp("virtualTabPanel");
		var vmId=virtualTabPanel.virtualIndex;
		var vmAttachmentId = content.id;
		
		if(0==vmId) return;
		//获取数据
		Ext.Ajax.request({
			method : 'post',
			url : "/emergency/tovmManager!delVirtualMachAttachment.action",
			params : {
				'vmManager.id' : vmId,
				'vmAttachment.id' : vmAttachmentId
			},
			async:true,
			timeout: 10000,//10秒
			success : function(response, options) {
				//加载页面html
				var result = JSON.parse(response.responseText);
				if(!result.result){
					Ext.websure.MsgError("消息码", result.msg);
					return;
				}
				Ext.websure.MsgTip.msg('成功', result.msg,true);
				showVirAttachment();
			},
			failure : function() {
				Ext.websure.MsgError("ERROR","删除附件失败");
			}
		});
	}
	
}

/**
 * 
 * showVirAttachment:显示当前虚拟机附件
 */
function showVirAttachment(e,  opts){
	var virtualTabPanel=Ext.getCmp("virtualTabPanel");
	var vmId=virtualTabPanel.virtualIndex;
	var virType=virtualTabPanel.virType;
	var nodeId=virtualTabPanel.computeNodeId;
	var virState=virtualTabPanel.virState;
	if(0==vmId) return;
	//获取数据
	Ext.Ajax.request({
		method : 'post',
		url : "/emergency/tovmManager!getAttachmentListByVmManagerID.action",
		params : {
			'vmManager.id' : vmId
		},
		async:true,
		timeout: 10000,//10秒
		success : function(response, options) {
			var result = JSON.parse(response.responseText);
			console.debug(result);
			if(!result.result){
				Ext.websure.MsgError("ERROR", result.msg);
				return;
			}
			
			var attlist = result.content;
			var attachmentHTML=emergencyMapDate.attachmentPanelHTML(attlist,vmId);
			Ext.query("span#span_attachmentPanel")[0].innerHTML=attachmentHTML;
		},
		failure : function() {
			Ext.websure.MsgError("提示","获取附件列表失败");
		}
	});
}
/**
 *重新计算应急图标的宽度，重新连线 newEmergencyWidth
 **/
function newEmergencyWidth(me,links){
        var thisTabId =me.id;  //获得当前面板的ID
        var thisTab=$("#"+thisTabId);
    	var tab=thisTab.find(".line_wrap");
	    var ulWidth=tab.find(".propery ul").width();
	    var server=tab.find(".propery .server");
	    var serverWidth=90*server.length;
	    server.removeClass("server_small");
	    server.width(90);
	    var newServerW=(ulWidth-150)/server.length;
	    //重新计算图标宽度，大于90px则为90,
	    if(newServerW>90){
	        server.width(90);
	    }else{
	        server.width(newServerW);
	    }
	    
	    if(newServerW<70){
	        server.addClass("server_small");
	    }
	    var newWidth=$("li.server").width();
	    tab.find(".server_cluster").each(function(){
	        var n=$(this).children("a.server").length;
	        $(this).width("auto");
	        $(this).children(".title").width(n*newWidth);
	    });
	    //网卡的自适应宽度
	    var nic=tab.find(".web ul li");
	    if(ulWidth/nic.length<92){
	        nic.addClass("nic_small");
	    }else{
	        nic.removeClass("nic_small");
	    }
	    if(null==links) return;
	    tab.find("#line_div").empty();
	    for(var i=0;i< links.length; i++){
	        var link=links[i];
	        var vm=link.vmLineKey;
	        var nic=link.nicLineKey;
	        var start = tab.find(".propery ul .server[key="+vm+"]").eq(0);   //需要连线的线条
	        var end =  tab.find(".web li[key="+nic+"]").eq(0);
	        if(0 == start.length&& 0 == end.length) return; //异步数据异常问题
	        bridgeContact(start,end);
	    } 
}    
/*
 * 桥接点连线的函数
 */
function bridgeContact(start,end){
        var color="#34cd00";
        var cls=end[0].className;
        //判断是否是集群标签，集群高度和普通高度不一样，所以position.top位置也有23px的差别
        var tag=start[0].tagName;
        if(tag=="A"){
            var start_top = start.position().top +54+17;
        }
        else{
            var start_top = start.position().top +54+40;
        }
        var end_top = end.position().top+8;
        var lineDiv=start.parents(".line_wrap").find("#line_div");
        var start_left = start.position().left + start.width()/2;
        var end_left = end.position().left + end.width()/2+13;
        var width =(end_left - start_left) /2;
        var height = (end_top - start_top) /2+1;
        if(cls.indexOf("web_vm")!=-1){
            color="#666";
            height=(end_top - start_top-10) /2;
        }
        var m= end.index()*4;
        var left = start_left;
        var top = start_top;
        if(start_left<end_left){
                height=height-m;
                var div =' <div class=line_div" style="width:'
                        +width+'px;height:'+height+
                        'px;position:absolute;visibility:visible;left:'
                        +left+'px;top:'
                        +top+'px;border-left:3px solid '+color+';border-bottom:3px solid '+color+';"></div>';
                lineDiv.append(div);
        
                var left = start_left + width;
                var top = start_top + height;
                height=height+2*m;
                var div =' <div class="line_div" style="width:'
                        +width+'px;height:'+height+
                        'px;position:absolute;visibility:visible;left:'
                        +left+'px;top:'
                        +top+'px;border-right:3px solid '+color+';border-top:3px solid '+color+';"></div>';
                lineDiv.append(div);
    }else{
            var width =(start_left - end_left) /2;
            var left=start_left-width;
            height=height-m;
            var div =' <div class=line_div" style="width:'
                    +width+'px;height:'+height+
                    'px;position:absolute;visibility:visible;left:'
                    +left+'px;top:'
                    +top+'px;border-right:3px solid '+color+';border-bottom:3px solid '+color+';"></div>';
            lineDiv.append(div);

            var left = end_left;
            var top = start_top + height;
            height=height+2*m;
            var div =' <div class="line_div" style="width:'
                    +width+'px;height:'+height+
                    'px;position:absolute;visibility:visible;left:'
                    +left+'px;top:'
                    +top+'px;border-left:3px solid '+color+';border-top:3px solid '+color+';"></div>';
            lineDiv.append(div);
        }
   }