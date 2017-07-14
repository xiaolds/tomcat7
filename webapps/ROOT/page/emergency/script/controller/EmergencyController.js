//Ext.Loader.setConfig({enabled: true});
Ext.define('acesure.emergency.controller.EmergencyController', {
	extend : 'Ext.app.Controller',
	alias  : "widget.EmergencyController",
	views  : [
	             'VirtualMachView',
	             'CalNodeView',
	             'Emergency',
	             'TakeOver',
	             'ClusterVmimgView'
	             ],
	models :[
	              'GridModel',
	              'VirtualMachModel',
	              'EmergencyInitializeModel',
	              'CalculateNodesModel',
	              'CalNodeRunStateModel',
	              'ComputeNodesVirtualNicModel'
	              ],
	stores : [
	              'VmCPUStore',
	              'GridStore',
	              'VirtualMachStore',
	              'VirtualMachNodeStore',
	              'GlobalTreeStore',
	              'EmergencyInitializeStore',
	              'SystemTypeStore',
	              'CalculateNodesStore',
	              'ComputeNodesNicStore',
	              'NetWorkListStore',
	              //'HardDiskDeviceTreeStore',
	              'CalculateNetWorkStore',
	              'VirtualLogStore',
	              'CalNodeRunStateStore',
	              'ComputeNodesVirtualNicStore'
	             ],
	init : function() {
		this.control({
			'virtualNodeGridPanel':{
				itemclick:this.showVirtualInfo 
			},
			'calNodeGridPanel':{
				itemclick:this.updateVirStateInfo 
			},
			'virtualNodeGridPanel actioncolumn' : {
	            itemclick : this.virtualNodeColumnEvent
            },
            /*'calNodeGridPanel actioncolumn' : {
	            itemclick : this.calNodeColumnEvent
            },*/
            'virtualTabPanel':{
            	
            },
            /*'virtualSouthToEastPanel button[id=start_virtual_machine]':{
            	click:this.startVirtualMachine
            },
            'virtualSouthToEastPanel button[id=stop_virtual_machine]':{
            	click:this.stopVirtualMachine
            },
            'virtualSouthToEastPanel button[id=delete_virtual_machine]':{
            	click:this.delVirtualMachine
            },*/
			'calNodeRunPanel':{
				afterrender:this.calNodeRun,
				resize:this.calNodeRunReSize
			},
			'computeNodeToolBar':{
				afterrender:this.computeNodeTool
			},
			/*'computeNodeToolBar [action=findRunVmList]':{
				click:this.findRunVmList
			},
			'computeNodeToolBar [action=findVmList]':{
				click:this.findVmList
			},	*/
		    /*'addVirtualMachWindow slider[itemId=cpu_slider]':{
		    	change:this.cpuSlider
		    },*/
		    'calNodeTabPanel':{
		    	afterrender:this.getCalNodeRunState
		    },
		    'countToolBar':{
		    	afterrender:this.countToolBar
		    }
	    });
	},
	/**
	 * 
	 * showVirtualInfo:显示虚拟机一览页面，点击虚拟机显示虚拟机具体信息
	 * @data 2016-8-4
	 * @auth WangShaoDong
	 */
	showVirtualInfo : function(me, record, item, index, e, eOpts) {
   	 //点击启动，删除，停止按钮，不实时获取虚拟机状态，根据消息返回数据来获取虚拟机状态
   	 var colIdx = e.getTarget('.x-grid-cell').cellIndex;
   	 if(colIdx==6||colIdx==4){
   		 return false;
   	 }
   	 
   	 //虚拟机Id
   	 var virId=record.data.id;
   	var grainMergeStatus=record.data.grainMergeStatus;
 	 var myMask =null;
 	 if(grainMergeStatus==1||grainMergeStatus==2){
 		myMask = new Ext.LoadMask(Ext.getBody(), {msg: '正在获取小颗粒合并状态,请稍后...', removeMask: true });
 	 }else{
 		myMask = new Ext.LoadMask(Ext.getBody(), {msg: '正在获取虚拟机状态,请稍后...', removeMask: true });
 	 }
   	 myMask.show();
   	 
   	 //获取虚拟机信息之前,判断虚拟机所在的计算节点是否处于正常状态
     var computeState = getComputeNodeState(virId);  //节点状态 1.在线 2.离线 3.异常
     if(computeState == 1){
     	
       	 var myMask = new Ext.LoadMask(Ext.getBody(), {msg: '正在获取虚拟机状态,请稍后...', removeMask: true }); 
       	 myMask.show();
       	 
       	 //获取虚拟机状态
       	 Ext.Ajax.request({
       		 method : 'post',
       		 url : emergencyMapDate.EmergencyMapURL('tovmManager','getVmStatus'),
       		 params : {
       			 'vmManagerModel.virId' : virId
       		 },
       		 timeout: 10000,//10秒
       		 success : function(response, options) {
       			 var obj=Ext.decode(response.responseText);
       			 if(null!=obj&&obj==1){
       				// var gridPanel=Ext.getCmp("virtualNodeGridPanelId");
       				 
       				 //虚拟机状态发生变化后，更新record数据，底部详细面板获取最新数据
       				me.getStore().load({callback:function(records, operation, success){
       					 tRecord=null;
       					 for(i=0;i<records.length;i++){
       						 if(virId==records[i].get("id")){
       							 tRecord=records[i];
       						 }
       					 };
       					 if(tRecord){
       						 record=tRecord;
       					 }
       				 }
       				 });
       			 }
       			 myMask.hide();
       			 //更新虚拟机详细信息面板
       			 showVirtualSouthPanel(record);
       			 //更新虚拟机头部运行虚拟机个数面板
       			 showVmOnLineMsg();
       		 },
       		 failure : function() {
       			 myMask.hide();
    //   			 Ext.MessageBox.alert(local.window.tip,"获得虚拟机发生异常情况!");
       			Ext.websure.MsgError("WF-30088","获得虚拟机发生异常情况!");
       			 //更新虚拟机详细信息面板
       			 showVirtualSouthPanel(record);
       		 }
       	 });
       	 
     }else{
     	  Ext.websure.MsgError("无","无法获取虚拟机状态,原因：虚拟机所在的计算节点异常或者离线!");
     	  return false;
     }
     
    },
    
    
    /**
     * 
     * updateVirStateInfo:查看所有虚拟机获取虚拟机实际状态
     * @data 2016-8-4
     * @auth WangShaoDong
     */
    updateVirStateInfo : function(me, record, item, index, e, eOpts) {
    	//点击启动，删除，停止按钮，不实时获取虚拟机状态，根据消息返回数据来获取虚拟机状态
      	 var colIdx = e.getTarget('.x-grid-cell').cellIndex;
      	 if(colIdx==6){
      		 return false;
      	 }
      	 //虚拟机Id
      	 var virId=record.data.id;
      	 var nodeId=record.data.nodeId;
      	 var myMask = new Ext.LoadMask(Ext.getBody(), {msg: '正在获取虚拟机状态,请稍后...', removeMask: true }); 
      	 myMask.show();
      	 
      	 //获取虚拟机状态
      	 Ext.Ajax.request({
      		 method : 'post',
      		 url : emergencyMapDate.EmergencyMapURL('tovmManager','getVmStatus'),
      		 params : {
      			 'vmManagerModel.virId' : virId
      		 },
      		 timeout: 10000,//10秒
      		success : function(response, options) {
     			 var obj=Ext.decode(response.responseText);
     			 //状态发生变化，更新一览页面
     			 if(null!=obj&&obj==1){
     				me.getStore().load({params:{'vmManager.computeNoteId':nodeId}});
     			 }
     			myMask.hide();
     			 //更新虚拟机头部运行虚拟机个数面板
     			showVmOnLineMsg();
     		 },
      		 failure : function() {
      			 myMask.hide();
//      			 Ext.MessageBox.alert(local.window.tip,local.emergency.getVmErrorTip);
      			Ext.websure.MsgError("WF-30089",local.emergency.getVmErrorTip);
      		 }
      	 });
       },
    /**
     * 
     * computeNodeTool:计算节点，标题信息
     * @data 2016-10-19
     * @auth WangShaoDong
     */
	computeNodeTool:function(me,eOpts){
		
		var calNode=me.up("calNodeView");
		//设置计算节点视图标题
		var computeNodeName=me.query("#compute_node_name")[0];
		computeNodeName.body.update("<b>"+local.emergency.nodeCount+local.colon+calNode.calNode["nodeName"]+"</b>");
		//设置计算节点性能视图
		var computeNodeCapa=me.query("#compute_node_capa")[0];
		getComputeNodeCapaView(calNode.calNode["nodeId"],computeNodeCapa);
	},
	
	/**
	 * 
	 * calNodeRun:计算节点，资源，网络信息
	 * @data 2016-10-19
	 * @auth WangShaoDong
	 */
	calNodeRun:function(me,eOpts){
		getVmNetTopologyByNodeId(me);
	},
	/**
	 * 
	 * calNodeRunReSize:计算节点，资源，网络连接展示
	 * @data 2016-10-19
	 * @auth WangShaoDong
	 */
	calNodeRunReSize:function(me,eOpts){
	  var links=NET_TOPOLOGY_LINKS;
	  newEmergencyWidth(me,links);
	},
	//wangshaodong 于2016/10/19 ，冗余代码注释
	/*cpuSlider:function(){
		
	},*/
	//wangshaodong 于2016/10/19 ，取消计算节点内部虚拟机操作注释
	/*findRunVmList:function(btn, e, eOpts ){
		var tab = Ext.getCmp("tabPanel");
		var calNodeView=tab.getActiveTab();
		var calNodePanel=calNodeView.query('calNodeView')[0];
		var calNodeGridPanel=calNodePanel.query('calNodeGridPanel')[0];
		calNodePanel.remove(calNodeGridPanel);
		
		var calNodeRunPanel=calNodePanel.query('calNodeRunPanel');
		if(calNodeRunPanel.length >=1){
			calNodePanel.remove(calNodeRunPanel[0]);
		}
		var calNodeRunPanel=Ext.create('acesure.emergency.view.CalNodeRunPanel');
		calNodePanel.add(1,calNodeRunPanel);
		
		var fileViewBut = btn.nextSibling();    //获取文件浏览按钮
		//fileViewBut.removeCls('btn_node_active');
		btn.addCls('btn_node_active');
	},*/
	/*findVmList:function(btn, e, eOpts ){
		showVmList();
		var fileViewBut = btn.previousSibling();    //获取文件浏览按钮
		fileViewBut.removeCls('btn_node_active');
		btn.addCls('btn_node_active');
	},*/
	/**
	 * 
	 * virtualNodeColumnEvent:虚拟机一览页面虚拟机操作，启动，停止，删除。
	 * @data 2016-8-4
	 * @auth WangShaoDong
	 */
	virtualNodeColumnEvent:function(column, grid, rowIndex, colIndex, node, e, record, rowEl){	
		var vmId=record.data.id;
		var vmName=record.data.vmName;
		if(node.action=='start'){//启动虚拟机
			startVirtualMachineByVmId(vmId,grid);
		}else if(node.action=='stop'){//停止虚拟机
			//接管机停止时要给用户一个确认按钮，用户确认后才进行停止操作
			if(record.data.vmType==1){
				Ext.MessageBox.confirm(local.window.tip,
						local.emergency.closeVmConfirm,
						function(btn){
					if(btn=='yes'){
						stopVirtualMachineByVmId(vmId,grid,vmName);
					}
				});
			}else{
				stopVirtualMachineByVmId(vmId,grid,vmName);
			};
		}else if(node.action=='delete'){// 删除虚拟机
			//删除时要给用户一个确认按钮，用户确认后才进行删除操作
			Ext.MessageBox.confirm(local.window.tip,
					local.emergency.deleteVmConfirm1+record.data.vmName+local.emergency.deleteVmConfirm2,
					function(btn){
				if(btn=='yes'){
					deleteVirtualMachineByVmId(vmId,grid,1);
				}
			});
		}				
	},
	/**
	 * 
	 * calNodeColumnEvent:计算节点页面虚拟机操作，wangshaodong 于2016/10/19 ，业务变更注释
	 * @data 2016-8-4
	 * @auth WangShaoDong
	 */
	/*calNodeColumnEvent:function(column, grid, rowIndex, colIndex, node, e, record, rowEl){	
		var vmId=record.data.id;
		var nodeId=record.data.nodeId;
		if(node.action=='start'){
			//启动虚拟机
			startVirtualMachineByVmId(vmId,grid,2,nodeId);
		}else if(node.action=='stop'){
			// 停止虚拟机
			stopVirtualMachineByVmId(vmId,grid,2,nodeId);
		}else if(node.action=='delete'){
			// 删除虚拟机
			Ext.MessageBox.confirm(local.window.tip,
                     "确实删除虚拟机("+record.data.vmName+")吗？",
                     function(btn){
                       if(btn=='yes'){
                    	   deleteVirtualMachineByVmId(vmId,grid,2,nodeId);
                       }
                 });
			
		}				
		
	},*/
	/*startVirtualMachine:function(btn, e, eOpts){
		var vmManager=emergencyMapDate.VM_MANAGER_INFO;
		var virtualNodeGrid=Ext.getCmp("virtualNodeGridPanelId");
		//启动虚拟机
		startVirtualMachineByVmId(vmManager.id,virtualNodeGrid);
	},
	stopVirtualMachine:function(btn, e, eOpts){
		var vmManager=emergencyMapDate.VM_MANAGER_INFO;
		var virtualNodeGrid=Ext.getCmp("virtualNodeGridPanelId");
		//停止虚拟机
		stopVirtualMachineByVmId(vmManager.id,virtualNodeGrid);
	},
	delVirtualMachine:function(btn, e, eOpts){
		var vmManager=emergencyMapDate.VM_MANAGER_INFO;
		var virtualNodeGrid=Ext.getCmp("virtualNodeGridPanelId");
		//删除虚拟机
		deleteVirtualMachineByVmId(vmManager.id,virtualNodeGrid);
	},*/
	/**
	 * 计算节点运行状态展示
	 */
	getCalNodeRunState:function(self){
        var tabPanel = Ext.getCmp('tabPanel');
        var activeTab = tabPanel.getActiveTab();
        Ext.Ajax.request({
            url : '/emergency/tocomputeNodes!showComputeRunState',
            params : {
                'computeNode.nodeId' : activeTab.id    //当前选中计算节点ID
            },
            success : function(response, options) {
                var obj = Ext.decode(response.responseText);
                var stateInfos = obj.calculateRunStateInfo;
                
                var cupData = [];var memoryData = [];var netData = [];
                var cpu = 0;var memory = 0;var net = 0;
                
                for(var i = 0; i < stateInfos.length; i++){
                    
                    if(typeof(stateInfos[i].cpu) != "undefined"){
                        cpu = stateInfos[i].cpu;
                    }
                    if(typeof(stateInfos[i].memory) != "undefined"){
                        memory = stateInfos[i].memory;
                    }
                    if(typeof(stateInfos[i].net) != "undefined"){
                        net = stateInfos[i].net;
                    }
                    
                    //cup的值
                    cupData.push({
                        rate:cpu,
                        chartDate:stateInfos[i].date
                    });
                    //memory的值
                    memoryData.push({
                        rate: memory,
                        chartDate:stateInfos[i].date
                    });
                    //net的值
                    netData.push({
                        rate:net,
                         chartDate:stateInfos[i].date
                    });
                    
                }
                showCalNodeRunChart(self,cupData,memoryData,netData);
            }
        });
	},
	/**
	 * 
	 * countToolBar:节点节点名称
	 * @data 2016-10-19
	 * @auth WangShaoDong
	 */
	countToolBar:function(me,opts){
		var calNode=me.up("calNodeView");
        //设置计算节点视图标题
        var computeNodeName=me.query("[itemId=nodeTitle]")[0];
        computeNodeName.update("<font class=''>"+local.emergency.nodeCount+local.colon+calNode.calNode["nodeName"]+"</font>");
	}
});

/**
 * 
 * AddNetWorkCards:创建虚拟机时增加网卡接口，wangshaodong 2016/10/19 业务变更注释
 * @data 2016-10-19
 * @auth WangShaoDong
 */
/*function AddNetWorkCards(){
	var netWorkSelectWin=Ext.getCmp("NetWorkSelectWinId");
	//已经选中的网卡Id
	var netWordConfigId=Ext.getCmp("netWordConfigId");
	
	var selectNetWorkId="";
	if(netWordConfigId.items.length>0){
		selectNetWorkId=netWordConfigId.items.get(0).items.get(0).netWorkId;
		for(i=1;i<netWordConfigId.items.length;i++){
			var idTemp=netWordConfigId.items.get(i).items.get(0).netWorkId;
			selectNetWorkId=selectNetWorkId+","+idTemp;
		}
	}
	
	var configMountWin=Ext.create("acesure.emergency.view.NetWorkSelectWin",{
		selectNetWorkId:selectNetWorkId
	});
	if(null!=netWorkSelectWin){
		
		netWorkSelectWin.destroy();
		configMountWin.show();
	}else{
		configMountWin.show();
	}
}*/
/**
 * 
 * AddDeviceHardDisks:创建虚拟机增加外部存储窗口
 * @data 2016-10-19
 * @auth WangShaoDong
 */
function AddDeviceHardDisks(){
	HARDDISKINFO=null;
	var configHardDisk=Ext.create("acesure.emergency.view.HardDiskWin",{});
	configHardDisk.show();
}
/**
 * 
 * AddRemoteVirHardDiskInfo:修改虚拟机信息，增加其他机器硬盘信息
 * @data 2016-10-19
 * @auth WangShaoDong
 */
function AddRemoteVirHardDiskInfo(vmId){
	if(emergencyMapDate.VM_MANAGER_INFO.vmState==1){
		Ext.MessageBox.alert(local.window.tip,local.emergency.VmOnlineCannotAddDisk);
		return false;
	}
	var remoteVirHardDiskPanel=Ext.create("acesure.emergency.view.RemoteHardDiskWin",{virId:vmId});
	remoteVirHardDiskPanel.show();
}

/**
 * 修改虚拟机信息，增加本机硬盘信息
 * AddLocalVirHardDiskInfo:
 * @data 2016-10-19
 * @auth WangShaoDong
 */
function AddLocalVirHardDiskInfo(data){
	if(emergencyMapDate.VM_MANAGER_INFO.vmState==1){
		Ext.MessageBox.alert(local.window.tip,local.emergency.VmOnlineCannotAddDisk);
		return false;
	}
	var localVirHardDiskPanel=Ext.create("acesure.emergency.view.LocalHardDiskPanelWin",{
	});
	localVirHardDiskPanel.show();
}
/**
 * 
 * deleteNetRecord:删除网卡数据
 * @data 2016-4-7
 * @auth WangShaoDong
 */
function deleteNetRecord(){
	var net =Ext.getCmp(this);
	//net.remove(data);
}
/**
 * 
 * showMsg:页面操作消息显示
 * @data 2016-6-23
 * @auth WangShaoDong
 */
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
/**
 * description : 展示计算节点CPU/内存/网络运行状态图表
 * @date 2016-05-20 
 * @author YangBobin
 */
function showCalNodeRunChart(self,cupData,memoryData,netData){
    self.removeAll();
    self.add(
        {
        title:local.backup.usageCpu+"(%)",
        border:false,
        bodyBorder:false,
        style:"margin-right:20px",
        layout:"fit",
        columnWidth:.33,
        items:{ xtype:"emergencyTakeOverChart",
                store : new Ext.data.Store({
                    fields : ['rate', 'chartDate'],
                    data : cupData
                }),
                width:300,
                height:150
              }
        },
        {
        title:local.backup.usageMemory+"(%)",
        border:false,
        bodyBorder:false,
        style:"margin-right:20px",
        layout:"fit",
        columnWidth:.33,
        items:{ xtype:"emergencyTakeOverChart",
                store : new Ext.data.Store({
                    fields : ['rate', 'chartDate'],
                    data : memoryData
                }),
                width:300,
                height:150
               }
        },
        {
        title:local.backup.usageWeb+"(%)",
        border:false,
        bodyBorder:false,
        style:"margin-right:20px",
        layout:"fit",
        columnWidth:.33,
        items:{ xtype:"emergencyTakeOverChart",
                store : new Ext.data.Store({
                    fields : ['rate', 'chartDate'],
                    data : netData
                }),
                width:300,
                height:150
               }
        });
    self.doLayout();
}
/**
 * 
 * showVirtualSouthPanel:虚拟机一览页面下部分虚拟机详细信息和日志信息
 * @data 2016-10-19
 * @auth WangShaoDong
 */
function showVirtualSouthPanel(record){
	var virtualSouthPanel=Ext.getCmp("virtualSouthPanelId");
	var length= virtualSouthPanel.items.length;
	if(virtualSouthPanel.activeTab.id=='virtual_log_id'&&length < 2){
		virtualSouthPanel.insert(0,{
			width : '100%',
			height:300,
			border:false,
			layout:'hbox',
			items:[
			       {xtype:"virtualSouthTopPanel",flex:1},
			       {xtype:"virtualSouthToEastPanel",margin:"0 0 0 10",width:450,vmManager:record.data}
			       ]
		});
	}

	virtualSouthPanel.setActiveTab(0);
	virtualSouthPanel.getActiveTab().setTitle(record.data.vmName);

	var vmId=record.data.id;
	emergencyMapDate.VM_MANAGER_INFO=record.data;
	var virtualTabPanel=virtualSouthPanel.query('virtualTabPanel')[0]; 
	virtualTabPanel.virtualIndex=vmId;
	virtualTabPanel.virType=record.data.vmType;
	virtualTabPanel.computeNodeId=record.data.nodeId;
	virtualTabPanel.virState=record.data.vmState;
	virtualTabPanel.setActiveTab(0);
	
	var vmState=record.data.vmState;
	if(vmState==1){
		Ext.getCmp("vncImageId").update('<img id="vncViewId" name="emergency_calnode_visitvm" src="/images/emergency/vm_start.png" width=450 height=300 >');
		Ext.get('vncViewId').on({
			click: function(){
				//console.log(WINDOW_VNC);
				var vmId=record.data.id;
				var name=record.data.vmName;
				var url="/emergency/tovmManager!showVNCInfo.action?vmManager.id="+vmId;
				var vncView="";
				if(Ext.isIE){
					var vncView=window.open(url,"_blank", name, ' top=0,left=0, toolbar=no, menubar=no, scrollbars=no, resizable=yes,location=no, status=no');
				}
				else{
					var vncView=window.open(url, name, ' top=0,left=0, toolbar=no, menubar=no, scrollbars=no, resizable=yes,location=no, status=no');
				}
				//var vncView=window.open(url,"_blank", name, ' top=0,left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no');
				//var vncView=window.open(url,"HideWin", name, ' top=0,left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no');
				WINDOW_VNC = vncView;
				
				if (!vncView) {
					return false;
				} 
			}
		});
	}else{			
		Ext.getCmp("vncImageId").update('<img id="vncViewId" name="emergency_calnode_visitvm" src="/images/emergency/vm_stop.png" width=450 height=300 >'); 
		Ext.get('vncViewId').on({
			click: function(){
				Ext.MessageBox.alert(local.window.tip,local.emergency.VmUnstart);
			}
		});
	};
	POWER_OP.filterEnableDomsInHtmlOfExtjs(Ext.getCmp('vncImageId'),CURRENT_USER.getEmergencyPower(),"img");
	loadVmConfigInfo(vmId);
};
/**
 * 
 * showVmOnLineMsg:动态更新虚拟机一览页面标题信息
 * @data 2016-10-19
 * @auth WangShaoDong
 */
function showVmOnLineMsg(){
	var me= Ext.getCmp("vm_online_id");
	Ext.Ajax.request({
		method : 'post',
		url : emergencyMapDate.EmergencyMapURL('tovmManager','findVmManagerOnline'),
		timeout: 10000,//10秒
		success : function(response, options) {
			var obj=Ext.decode(response.responseText);
			me.update("<font class='font_h3'>"+local.emergency.title+"</font><br>"+local.emergency.vmRun1+obj.detail+local.emergency.virtual)	;
		},
		failure : function() {
			me.update("<font class='font_h3'>"+local.emergency.title+"</font><br>"+local.emergency.virtualZero)	;
		}
	});
};

/**
 * 
 * getComputeNodeState:根据虚拟机ID获取虚拟机所在计算节点的状态
 * @data 2017-4-19
 * @auth YangBobin
 */
function getComputeNodeState(virId){
	var computeState = 1;    //节点状态 1.在线 2.离线 3.异常
	
	Ext.Ajax.request({
        method : 'post',
        url : emergencyMapDate.EmergencyMapURL('tovmManager','getComputeNodeState'),
        async:false,
        params : {
                 'virId' : virId
        },
        timeout: 10000,//10秒
        success : function(response, options) {
            var obj=Ext.decode(response.responseText);
            computeState = obj.computeState;
        }
    });
    
    return computeState;
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
/**
 * 
 * showVmList:wangshaodong 2016/10/19 业务变更注释
 * @data 2016-10-19
 * @auth WangShaoDong
 */
/*function showVmList(SERVERANME){
	var tab = Ext.getCmp("tabPanel");
	var calNodeView=tab.getActiveTab();
	var calNodePanel=calNodeView.query('calNodeView')[0];
	var calNodeRunView=calNodePanel.query('calNodeRunPanel')[0];
	calNodePanel.remove(calNodeRunView);
	
	var calNodeGridPanel=calNodePanel.query('calNodeGridPanel');
	if(calNodeGridPanel.length >= 1){
		calNodePanel.remove(calNodeGridPanel[0]);
	}
	var calNodeGridPanel=Ext.create('acesure.emergency.view.CalNodeGridPanel');
	calNodePanel.add(1,calNodeGridPanel);
	
	var nodeId=calNodeView.calNode.nodeId;
	var calNodeStore=calNodeGridPanel.getStore();
	calNodeStore.removeAll();
	calNodeStore.load({params:{'vmManager.computeNoteId':nodeId} ,
		callback:function(records, operation, success){
			if(records.length>0){
				if(SERVERANME){
					var record = null;
					for(i=0;i<records.length;i++){
						tRecord=records[i];
						if(SERVERANME==tRecord.get("vmName")){
							record=tRecord;
						}
					};
					if(record){
						calNodeGridPanel.getSelectionModel().select(record);
					}
				}
				POWER_OP.filterEnableWidgetsOfExtjs(calNodeGridPanel,CURRENT_USER.getEmergencyPower(),"actioncolumn");
			}
		}
	}
	);
	//计算节点性能显示，计算节点对应虚拟机按钮
	if(SERVERANME){
		calNodeView.query("button")[0].removeCls('btn_node_active');
		calNodeView.query("button")[1].addCls('btn_node_active');
	}
}*/