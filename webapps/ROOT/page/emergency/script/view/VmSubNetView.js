Ext.Loader.setConfig({ enabled: true });
Ext.Loader.setPath('Ext.ux', '/page/ux');
Ext.require([
 'Ext.ux.grid.FiltersFeature'//必不可少的

]);

//硬盘对应设备Id
var HARDDISK_DEVICEID=null;
//选中的硬盘信息
var HARDDISKINFO=null;
//虚拟机Id
var VIRID=null;
/**
 * 虚拟机具体内容
 * auth:wangshaodong
 */
Ext.define('acesure.emergency.view.virtualTabPanel', {
	extend : 'Ext.tab.Panel',
	alias : 'widget.virtualTabPanel',
	id:"virtualTabPanel",
	enableTabScroll : true,
	//activeTab : 0,
	border:false,
	cls:'verticaltab',
	virtualIndex:0,  //自定属性 记录显示虚拟机ID
	virType:0,
	computeNodeId:0,
	virState:0,//bug：624 新增，虚拟机状态
	bodyStyle:'border:0;border-left:1px solid #eef2f4;border-right:1px solid #eef2f4;-padding:10px;padding-left:0;',
	defaults:{border:false/*,bodyStyle:'background:#fafbfc'*/},
	tabBar : {
		width : 115,
		minTabWidth : 95,
		maxTabWidth : 95,
		height : 80,
		orientation : 'top'// vertical
	},
	tabPosition : 'left',// 竖形排列
	items : [ {
		title :local.emergency.basicCon,
		width : '100%',
		items: {xtype : "hardWarePanel",width : '100%',id:'virHardDiskPanelId'
		},
		listeners: {activate: showVirHardWareInfo
		}
	}, {
		title : local.webConfig,
		width : '100%',
		items: {xtype : "netWorkPanel", width : '100%',id:'virNetWorkPanelId'},
		listeners: { activate: showVirNetWorkInfo }
	}, {
		title : local.storageConfig,
		items: {xtype : "virtualMesPanel",width : '100%',id:'virVirtualMesPanelId'},
		listeners: { activate: showVirDetailInfo }
	} ]
});


/**
 * 虚拟机硬件信息
 * auth:wangshaodong
 */
Ext.define("acesure.emergency.view.hardWarePanel",{
	extend : 'Ext.Panel',
	alias:"widget.hardWarePanel",
	border:false,
	defaults : {
		border:false
	},
	height:300,
	layout:"vbox",
	items:[
	       {
	    	   width:"100%",
	    	   height:36,
	    	   html:'<div class="bot_list bot_list_title"><span>'+local.recovery.nameHardware+'</span>'+local.btn.detailInfo+'<a>'+local.btn.operate+'</a></div>'
	       },{
	    	   flex:1,
	    	   width:"100%",
	    	   overflowY:"auto",
	    	   html:"<span id='span_hardWarePanel'>"+
	    	   "<div class='bot_list'><span>"+local.emergency.emergencyType+"</span>"+local.recovery.modify+" <a>"+local.btn.modify+"</a></div>"+
	    	   "<div class='bot_list'><span >"+local.emergency.operatingSystem+"</span>Windows 7 x64<a>"+local.btn.modify+"</a></div>" +
	    	   "<div class='bot_list'><span>CPU</span>4"+local.emergency.core+"<a>"+local.btn.modify+"</a></div>" +
	    	   "<div class='bot_list'><span>"+local.memory+"</span>2048MB<a>"+local.btn.modify+"</a></div>"+
	    	   "<div class='bot_list'><span>"+local.CDRom+"</span>CD/DVD(IDE)<a>"+local.btn.modify+"</a></div>"+
	    	   "<div class='bot_list'><span>"+local.USB+"</span>present<a>"+local.btn.modify+"</a></div>"+
	    	   "</span>"
	       }]
});

/**
 * 虚拟机网卡信息
 * auth:wangshaodong
 */
Ext.define("acesure.emergency.view.netWorkPanel",{
	extend:"Ext.Panel",
	alias:"widget.netWorkPanel",
	border:false,
	defaults : {
		border:false
	},
	height:300,
	layout:"vbox",
	items:[
	       /*{
	    	   width:"100%",
	    	   height:37,
	    	   html:'<table class="table1"><tr><th>序号</th><th>原机网卡设备</th><th>计算机节点网卡</th><th>操作</th></tr></table>'
	       },*/{
	    	   flex:1,
	    	   width:"100%",
	    	   overflowY:"auto",
	    	   html:"<span id='span_netWorkPanel'></span>"
	       }]
});

/**
 * 虚拟机详细信息
 * auth:wangshaodong
 */
Ext.define("acesure.emergency.view.virtualMesPanel",{
	extend:"Ext.Panel",
	alias:"widget.virtualMesPanel",
	border:false,
	defaults : {
		border:false
	},
	height:300,
	layout:"vbox",
	items:[
	       /*{
	    	   width:"100%",
	    	   height:37,
	    	   html:'<table class="table1"><tr><th>磁盘名称</th><th>磁盘路径</th><th>操作系统</th><th>操作</th></tr></table>'
	       },*/{
	    	   flex:1,
	    	   width:"100%",
	    	   overflowY:"auto",
	    	   html:"<span id='span_virtualMesPanel'></span>"
	       }]
});

/**
 * 虚拟机信息展示GRID面板
 * auth:wangshaodong
 */

Ext.define("acesure.emergency.view.VirtualNodeGridPanel",{
	extend : 'Ext.grid.Panel',
	alias:"widget.virtualNodeGridPanel",
	id:'virtualNodeGridPanelId',
	store: "VirtualMachStore",
	width:'100%',
	frame:false,
	bodyStyle:'border-color:#d1dade;',
	enableColumnMove:false,
	enableColumnResize:false,
	// 自动刷新状态时不显示小红点
	viewConfig: {
		markDirty: false
	},
	//trackMouseOver:false,
	style:'background:#fafbfc',
	sortableColumns: false, 
	enableColumnHide : false,
	initComponent : function() { 
		var encode = false;
		//var local = true;
		var filters = {
				ftype: 'filters',
				encode: encode, // json encode the filter query
				menuFilterText:local.recovery.calnodeChoose,//'计算节点选择',//local.recovery.calnodeChoose,
				local: true  // defaults to false (remote filtering)
		};
		this.features=filters;
        this.callParent(arguments);
	},
	columns :[
	          {
	        	  header: local.emergency.gridServerName,
	        	  dataIndex: 'vmName',
	        	  flex:1.5,
	        	  menuDisabled:true,
	        	  sortable: true,
	        	  renderer : function(value, cellmeta, record, rowIndex, columnIndex, store) {
	        		  var onLineFlg=record.data["vmState"];
	        		  var isGRIDMache = record.data["grainMergeStatus"]!=0;
	        		  // 先判断是否是小颗粒主机 
	        		  if(isGRIDMache){
	        			  //是小颗粒主机
	        			  if(onLineFlg==1){ //在线
		        			  return "<img src='/images/emergency/server_gran_16on.png' />&nbsp&nbsp<span title="+value.replace(" ","&nbsp;")+" style='font-weight:bold;'>"+value+"</span>";
		        		  }else{  //不在线
		        			  return "<img src='/images/emergency/server_gran_16.png' />&nbsp&nbsp<span title="+value.replace(" ","&nbsp;")+"  style='font-weight:bold;'>"+value+"</span>";
		        		  }
	        		  }
	        		  // 非小颗粒主机
	        		  if(onLineFlg==1){ //在线
	        			  return "<img class='imgPositon' src='/images/emergency/server_16on.png' />&nbsp&nbsp<span title="+value+" style='font-weight:bold;'>"+value+"</span>";
	        		  }else{  //不在线
	        			  return "<img class='imgPositon' src='/images/emergency/server_16.png' />&nbsp&nbsp<span title="+value+"  style='font-weight:bold;'>"+value+"</span>";
	        		  }
	        	  }
	          },
	          {
	        	  header: local.emergency.gridIP,
	        	  dataIndex: 'deviceIp',
	        	  //width:150,
	        	  flex:1,
	        	  menuDisabled:true,
	        	  sortable: true,
	        	  renderer : function(value, cellmeta, record, rowIndex, columnIndex, store) {
	        		  return "<a title='"+local.recovery.information+"' href='javascript:void(0);' style='color:#00aaaa;'onclick='stepIntoSnapShotDetailByDeviceId("+record.data["deviceId"]+")'>"+value+"</a>";
	        	  }
	          },{	
	        	  header: local.emergency.gridName, 
	        	  dataIndex: 'deviceName', 
	        	  flex:1,
	        	  tdCls:"font_color_999",
	        	  menuDisabled:true,
	        	  sortable: true
	          },{
	        	  header:local.emergency.emergencyType,
	        	  dataIndex: 'vmType', 
	        	  tdCls:"font_color_999",
	        	  width:150,
	        	  menuDisabled:true,
	        	  sortable: true,
	        	  renderer : function(value, cellmeta, record, rowIndex, columnIndex, store) {
	        		  return emergencyMapDate.VM_TYPE[value][1];
	        	  }
	          },{
	        	  header: local.emergency.gridNode,
	        	  dataIndex: 'nodeName', 
	        	  width:250,
	        	  tdCls:"font_color_999",
	        	  menuDisabled:true,
	        	  lockable: true,
	        	  sortable: true,
	        	  filter: {
	        		  type: 'list'
	        	  },
	        	  renderer : function(value, cellmeta, record, rowIndex, columnIndex, store) {
	        		  if(record.get("nodeState")==1){
	        			  return "<img class='imgPositon' src='/images/emergency/onLine.png' />&nbsp&nbsp"+
	        			  "<a title='"+local.recovery.clickInformation+"' href='javascript:void(0);' style='color:#00aaaa; width: 100%;'onclick='stepIntoCompute(\""+value+"\")'>"+value+"</a>"; 
	        		  }else{
	        			  return "<img class='imgPositon' src='/images/emergency/offLine.png' />&nbsp&nbsp"+
	        			  "<a title='"+local.recovery.clickInformation+"' href='javascript:void(0);' style='color:#00aaaa; width: 100%;'onclick='stepIntoCompute(\""+value+"\")'>"+value+"</a>";
	        		  }
	        	  }
	          },
	          {
	        	  header: local.emergency.gridState,
	        	  dataIndex: 'vmState', 
	        	  menuDisabled:true,
	        	  width:150,
	        	  renderer : function(v, p, r) {
	        		  var mergeStatus=r.get("grainMergeStatus");
	        		  //不是小颗粒
	        		  if(mergeStatus==0){
	        			  if(v==1){
		        			  return "<img src='/images/common/green.png' /><span style='font-weight:bold;color:#2db200'>"+local.starting+"</span>";
		        		  }else if(v==2){
		        			  return "<img src='/images/common/gray.png' /><span style='font-weight:bold;color:#ccc'>"+local.unstart+"</span>";
		        		  }else{
		        			  return "<img src='/images/common/gray.png' /><span style='font-weight:bold;color:#ccc'>"+local.unconfig+"</span>";
		        		  }
	        		  }else if(mergeStatus==1){//小颗粒合并中
	        			  var mergePercent=r.get("grainMergePercent"); 
	        			  
	        			  return "<img src='/images/common/green.png' /><span style='font-weight:bold;color:#2db200'>创建中:进度"+mergePercent+"%</span>";
	        			  
	        		  }else if(mergeStatus==2){//小颗粒合并失败
	        			  return "<img src='/images/common/gray.png' /><span style='font-weight:bold;color:red'>合并失败</span>";
	        			  
	        		  }else {//小颗粒合并成功，未启动状态显示小颗粒合并完成，启动后变为启动中
	        			  if(v==1){
		        			  return "<img src='/images/common/green.png' /><span style='font-weight:bold;color:#2db200'>"+local.starting+"</span>";
		        		  }else if(v==2){
		        			  
		        			  return "<img src='/images/common/gray.png' /><span style='font-weight:bold;color:#ccc'>合并完成:未启动</span>";
		        		  }else{
		        			  return "<img src='/images/common/gray.png' /><span style='font-weight:bold;color:#ccc'>"+local.unconfig+"</span>";
		        		  }
	        		  }
	        		  
	        	  },
	        	  menuDisabled:true,
	        	  sortable: true
	          } ,   
	          {  
	        	  header: local.emergency.gridHander,  
	        	  xtype : 'actioncolumn',
	        	  menuDisabled:true,
	        	  sortable:false,
	        	  
	        	  width:150,
	        	  align : 'center',
	        	  hideable: false, 
	        	  //id : 'virtualNodeGridAction',
	        	  items: [{
	        		  itemId:'emergency_calnode_statrvm',
	        		  action: 'start', 
	        		  getClass: function(v, metaData, record) {  
	        			  // Or return a class from a function
	        			  var mergeStatus=record.get("grainMergeStatus");
	        			  var mergeState=(mergeStatus==1||mergeStatus==2);
	        			  //合并中或则合并失败，不能启动。
	        			  if(mergeState){
	        				  return 'startNo';
	        			  }else{//小颗粒合并完成或不是小颗粒
	        				  if(record.get("vmState")==2){
		        				  this.items[0].tooltip = local.btn.start;
		        				  return 'startYes';
		        			  }else{
		        				  //this.items[0].tooltip = '';
		        				  return 'startNo';
		        			  }
	        			  }
	        		  },
	        		  handler: function (grid, rowIndex, colIndex, node, e, record, rowEl) { 
	        		  	  var mergeStatus=record.get("grainMergeStatus");
                          var mergeState=(mergeStatus==0||mergeStatus==3);  //未启用小颗粒或小颗粒合并完成
                          if(mergeState){
                          	if(record.get("vmState")==2){
    	        				 this.fireEvent('itemclick', this, grid, rowIndex, colIndex, node, e, record, rowEl); 
                          	}
                          	
                          }
	        		  }  
	        	  },{ icon: '', tooltip: ''},
	        	  {  
	        		  itemId:'emergency_calnode_stopvm',
	        		  action: 'stop', 
	        		  getClass: function(v, metaData, record) {          // Or return a class from a function
	        			  var mergeStatus=record.get("grainMergeStatus");
	        			  var mergeState=(mergeStatus==1||mergeStatus==2);
	        			  //合并中或则合并失败，不能停止。
	        			  if(mergeState){
	        				  return 'stopNo';
	        			  }else{//小颗粒合并完成或不是小颗粒
	        				  if(record.get("vmState")==1){
		        				  this.items[2].tooltip = local.btn.stop;
		        				  return 'stopYes';
		        			  }else{
		        				  return 'stopNo';
		        			  }
	        			  }
	        		  },
	        		  handler: function (grid, rowIndex, colIndex, node, e, record, rowEl) { 
	        			  if(record.get("vmState")==1){
	        				  this.fireEvent('itemclick', this, grid, rowIndex, colIndex, node, e, record, rowEl);  
	        			  }
	        		  }
	        	  },{ icon: '', tooltip: ''},
	        	  {  
	        		  itemId:'emergency_calnode_delvm',
	        		  action: 'delete', 
	        		  getClass: function(v, metaData, record) {          // Or return a class from a function
	        			  var mergeStatus=record.get("grainMergeStatus");
	        			  var mergeState=(mergeStatus==1||mergeStatus==2);
	        			  if(mergeState){
	        				  this.items[4].tooltip =local.btn.delete0;
	        				  return 'deleteYes';
	        			  }else{
	        				  if(record.get("vmState")==2||record.get("vmState")==0||record.get("vmState")==7){
		        				  this.items[4].tooltip =local.btn.delete0;
		        				  return 'deleteYes';
		        			  }else{
		        				  return 'deleteNo';
		        			  }
	        			  }
	        		  },
	        		  handler: function (grid, rowIndex, colIndex, node, e, record, rowEl) {
	        			  if(record.get("vmState")==2||record.get("vmState")==0){
	        				  this.fireEvent('itemclick', this, grid, rowIndex, colIndex, node, e, record, rowEl);  
	        			  }
	        		  }   
	        	  }]
	          } 
	          ],
	          listeners:{
	        	  beforerender:function() {
	        		// 添加定时器，定时刷新
	        		  createTimerForVmStatus(function(){
	        			  getVmStatus();
	        		  }, 3000);
	        	  },
	        	  afterrender:function(v){

	        		  if(SERVERANME){
	        			  me=this;
	        			  var storeList=this.store.load({callback:function(records, operation, success){
	        				  var record = null;
	        				  for(i=0;i<records.length;i++){
	        					  tRecord=records[i];
	        					  if(SERVERANME==tRecord.get("vmName")){
	        						  record=tRecord;
	        					  }
	        				  };
	        				  if(record){
	        					  me.getSelectionModel().select(record);
	        				  }
	        				  POWER_OP.filterEnableWidgetsOfExtjs(v,CURRENT_USER.getEmergencyPower(),"actioncolumn");
	        			  }});
	        		  }else{
	        			  this.store.load({
	        				  callback:function(records, operation, success){
	        					  if(null != records){
	        						  if(records.length>0){
		        						  POWER_OP.filterEnableWidgetsOfExtjs(v,CURRENT_USER.getEmergencyPower(),"actioncolumn");
		        					  }
	        					  }
	        				  	}
	        			  });
	        		  }
	        	  }
	}
});


/**
 * 获取虚拟机状态
 */
function getVmStatus() {
	Ext.Ajax.request({
	    url: emergencyMapDate.EmergencyMapURL('tovmManager','freshVmManagerStatus'),
	    success: function(response){
	        var status = JSON.parse(response.responseText);
	        var recordArray = status.detail;
	        var panel = Ext.getCmp('virtualNodeGridPanelId');
	        if(typeof panel === 'undefined'){
	        	return;
	        }
	        var store = Ext.getCmp('virtualNodeGridPanelId').getStore();
	        // 遍历新的状态数据
	        for(var i = 0; i < recordArray.length; i++) {
	        	var item = recordArray[i];
	        	// 获取Store，插入数据
	        	var record = store.getById(item.id);
	        	record.set('vmState', item.vmState);
	        	record.set('grainMergePercent', item.grainMergePercent);
	        	record.set('grainMergeStatus', item.grainMergeStatus);
	        }
	        
	    }
	});
}

/**
 * 创建定时器
 */
function createTimerForVmStatus(func, interval) {
	return setInterval(function(){
		func();
	}, interval)
}

/**
 * 清除定时器
 */
function clearTimerForVmStatus(tag) {
	clearInterval(tag);
}

/**
 * 虚拟机设置信息
 * auth:wangshaodong
 */
Ext.define("acesure.emergency.view.virtualSouthTopPanel",{
	extend:"Ext.Panel",
	alias:"widget.virtualSouthTopPanel",
	border:false,
	bodyBorder:false,
	items:[
	       /*  {xtype:"virtualToolBar"},*/
	       {height : 300,xtype:"virtualTabPanel"}
	       ]
});


/**
 * 虚拟机控制
 * auth:wangshaodong
 */
Ext.define("acesure.emergency.view.virtualSouthToEastPanel",{
	extend:"Ext.Panel",
	alias:"widget.virtualSouthToEastPanel",
	layout:"column",
	height:"100%",
	border:false,
	style:"border-left:1px solid #d1dade",
	width:'100%',
	items:[
	       /*{
	    	   xtype: 'panel',
	    	   width:'100%',
	    	   height:50,
	    	   border:false,
	    	   layout:'hbox',
	    	   style:'padding-top:10px;margin-left:10px;',
	    	   items:[
	    	          {
	    	        	  xtype : "button",
	    	        	  text : local.btn.start,
	    	        	  id:'start_virtual_machine',
	    	        	  style:'margin-left:20px;padding-left:26px;',
	    	        	  icon : '/images/emergency/start.png'	    	        		
							}, {
								xtype : "button",
								text : local.btn.stop,
								id:'stop_virtual_machine',
								style:'margin-left:10px;padding-left:26px;',
								icon : '/images/emergency/stop.png'
							},{
								xtype : "button",
								text : local.btn.delete0,
								id:'delete_virtual_machine',
								style:'margin-left:10px;padding-left:26px;',
								icon : '/images/emergency/delete.png'
							}
                         ]
	          },*/{
	        	  xtype: 'panel',
	        	  width:'100%',
	        	  id:'vncImageId',
	        	  border:false,
	        	  html:''
	        	  //html:'<img id="vncViewId" src="/images/emergency/remote.png" width=382 height=300 >',
	        		  /*listeners:{
	        		  afterrender:function(){
	        			  //var state=emergencyMapDate.VM_MANAGER_INFO
	        			  console.log(emergencyMapDate.VM_MANAGER_INFO);
	        		  }
	        	  }*/
	          }
	          ]/*,
	          listeners:{
	        	  afterrender:function(me,opts){
	        		  var vmState=this.vmManager.vmState;
	        		  if(vmState==1){
	        			  Ext.getCmp("vncImageId").update('<img id="vncViewId" src="/images/emergency/vm_start.png" width=382 height=300 >');
	        		  }else{
	        			  Ext.getCmp("vncImageId").update('<img id="vncViewId" src="/images/emergency/vm_stop.png" width=382 height=300 >'); 
	        		  };

	        		  Ext.get('vncViewId').on({
	        			  click: function(){
	        				  var vmConifg=emergencyMapDate.VM_MANAGER_INFO;
	        				  console.log(emergencyMapDate.VM_MANAGER_INFO);
	        				  if(vmConifg.vmState!=1){
	        					  return;
	        				  }
	        				  var vmId=vmConifg.id;
	        				  var name=vmConifg.vmName;
	        				  var url="/emergency/tovmManager!showVNCInfo.action?vmManager.id="+vmId;

	        				  var vncView= window.open(url, name, ' top=0,left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no');  
	        				  if (!vncView) {
	        					  return false;
	        				  } 
	        			  }
	        		  });
	        	  }
	          }*/
});
/**
 * 应急日志模块
 */
/**
 * 重写pageToolBar doReFresh
 * auth:wangshaodong
 */
Ext.define("acesure.emergency.view.PagingToolbar1",{
	extend :"Ext.PagingToolbar",
	alias:"widget.pagingToolbar1",
	doRefresh : function() {
		if(null==emergencyMapDate.VM_MANAGER_INFO){
			Ext.getCmp("virtual_log_id").getComponent("emergencyLogItemId").store.load();
		}else{
			var vmName=emergencyMapDate.VM_MANAGER_INFO.vmName;
			Ext.getCmp("virtual_log_id").getComponent("emergencyLogItemId").store.load({params:{"vmName":vmName}});
		}
		
	}
});
/**
 * 虚拟机一览页面日志处理
 * auth:wangshaodong
 */
Ext.define("acesure.emergency.view.EmergencyLogGridPanel",{
	extend : 'Ext.grid.Panel',
	alias:"widget.emergencyLogGridPanel",
	store: "VirtualLogStore",
	height: 300,
	width:'100%',
	border:false,
	frame:false,
	enableColumnMove:false,
	enableColumnResize:false,
	trackMouseOver:false,
	style:'background:#fafbfc',
	columns : [ 
	           { header: local.num, menuDisabled:true,dataIndex: 'emergencyLogId' , width:80},
	           { header:local.log.eventId, menuDisabled:true,dataIndex: 'emergencyEventId' , width:90},
	           { header: local.log.gridLevel,menuDisabled:true,dataIndex: 'emergencyLogLevel', width:100, 
	        	   renderer:function(v) {
	        		   if(v == 1){
	        			   return "<img src='/images/log/normal.gif' align='absmiddle' />&nbsp;"+local.normal;
	        		   }else if(v == 2){
	        			   return "<img src='/images/log/error.gif' align='absmiddle' />&nbsp;"+local.defaulty;
	        		   }else if(v == 3){
	        			   return "<img src='/images/log/warning.gif' align='absmiddle' />&nbsp;"+local.warn;
	        		   }
	        	   }
	           },
	           { header:local.log.gridSource,tdCls:"font_color_999",menuDisabled:true, dataIndex: 'emergencyLogIp' , flex:2,
	        	   renderer: function(value,metaData,record,colIndex,store,view) {
	        		   return  '<div title="' + value + '"  width=350>' + value + '</div>';
	        	   }
	           },
	           { header:local.time,tdCls:"font_color_999", menuDisabled:true,dataIndex: 'emergencyLogInsertTime' , flex:1 },
	           { header:local.backup.content, tdCls:"font_color_999",menuDisabled:true,dataIndex: 'emergencyLogContent' , flex: 4,
	        	   renderer: function(value,metaData,record,colIndex,store,view) {
	        		   //metaData.tdAttr = 'data-qtip="' + value + '"';  
	        		   //meta.tdAttr = "data-qtip='"+value+"' data-qtitle='title' data-qwidth=140";
	        		   return  '<div title="' + value + '"  width=350>' + value + '</div>';
	        		   //return 
	        	   }}
	           ],
	           listeners : {
	        	   afterrender : function(){
	        		   this.store.load();
	        	   }
	           },
	           dockedItems: [{
	        	   xtype: 'pagingToolbar1',
	        	   store: 'VirtualLogStore',
	        	   dock: 'bottom', //分页 位置
	        	   emptyMsg:local.toobarEmptyMsg,
	        	   displayInfo: true,
	        	   displayMsg: local.toolbarDisplayMsg,
	        	   beforePageText:local.toolbarBeforePageText,
	        	   afterPageText:local.toolbarAfterPageText

	           }]
});	

/**
 * 虚拟机设置信息与应急日志
 * auth:wangshaodong
 */
Ext.define("acesure.emergency.view.virtualSouthTabPanel",{
	extend:"Ext.tab.Panel",
	alias:"widget.virtualSouthTabPanel",
	id:'virtualSouthPanelId',
	width:"100%",
	border:false,
	cls:"tab_s",
	//margin:'20 0 0  0',
	bodyBorder:true,
	bodyStyle:'border-color:#d1dade;',
	plain:true,
	items:[
	       {
	    	   title : local.log.titleEmergencyLog,
	    	   id:'virtual_log_id',
	    	   width : '100%',
	    	   //height:"100%",
	    	   border:false,
	    	   items:[
	    	          {xtype:"emergencyLogGridPanel",itemId:"emergencyLogItemId"}
	    	          ],
	    	          listeners:{
	    	        	  beforeshow:function(){
	    	        		  var vmName=emergencyMapDate.VM_MANAGER_INFO.vmName;
	    	        		  Ext.getCmp("virtual_log_id").getComponent("emergencyLogItemId").store.load({params:{"vmName":vmName}});
	    	        	  }
	    	          }
	       }
	       ]
});

/**
 * 虚拟子网信息汇总
 * @author lidongsheng
 */
Ext.define("acesure.emergency.view.VmSubNetView",{
	extend:"Ext.Panel",
	alias:"widget.VmSubNetView",
	border:false,
	overflowY:"auto",
	layout:"vbox",
	items:[
	       {
	    	   xtype : 'label',
	    	   padding:"20 20 10 20",
	    	   height:55,
	    	   html : "<font class='font_t'>"+local.emergency.vmSubNetList+"</font>",
	    	   width : '100%'
	       },
	       /*{margin:"0 20 0 20",xtype : "virtualNodeGridPanel",flex:1,minHeight:120//height:300
	    	   },*/
	       {
	    	   xtype : 'label',
	    	   padding:"20 20 10 20",
	    	   height:55,
	    	   html : "<font class='font_t'>"+local.emergency.phySubNetList+"</font>",
	    	   width : '100%'
	       }/*,
	       {margin:"0 20 20 20",xtype:"virtualSouthTabPanel",id:"virtualSouthPanelId",height:340//height:340
	    	   }*/
	       ]
});

/**
 *修改虚拟机类型窗体
* auth:wangshaodong
 */
Ext.define("acesure.emergency.view.updateVmTypeWindow", {
	extend : 'Ext.window.Window',
	title: local.recovery.virtualType, 
	draggable: true,
	height: 300,		
	width: 350,
	id:'updateVmTypeWindow',
	layout: "vbox",
	modal: true, 
	resizable: false,
	items : [{
		xtype : 'panel',
		width: '100%',
		padding:20,
		border:false,
		defaults: {
			labelWidth: 80,
			labelAlign: "left"
		},
		items : {
			border:false,
			xtype:'radiogroup',
			fieldLabel:local.emergency.emergencyType,
			id:'vmTypeId',
			width: '100%',
			columns: 2,
			items:[
			       { id:'vmType1',boxLabel:local.recovery.takeOver ,name:'vmType',inputValue:1 },
			       { id:'vmType2',boxLabel:local.recovery.rehearse ,name:'vmType',inputValue:2 }
			       ],
			       listeners:{
			    	   'afterrender':function(me, opts){
			    		   var vmTypeWindow=Ext.getCmp("updateVmTypeWindow");
			    		   if(vmTypeWindow.vmType==1){
			    			   Ext.getCmp("vmType1").setValue(true);
			    		   }else{
			    			   Ext.getCmp("vmType2").setValue(true);
			    		   }
			    	   },
			    	   'change':function(me,newValue,oldValue,opts){
			    		   var vmTypeWindow=Ext.getCmp("updateVmTypeWindow");
			    		   var bridge_config=vmTypeWindow.getComponent("vm_type_info");

			    		   if(newValue.vmType==1){
			    			   bridge_config.update(local.recovery.exerciseHost);
			    		   }else{
			    			   bridge_config.update(local.recovery.practiceBuild);
			    		   }
			    	   }
			       }      
		}
	},{
		xtype: 'panel',
		itemId:'vm_type_info',
		border:false,
		padding:20,
		height:60,
		width: '100%',
		html:local.recovery.practiceBuild,
		listeners:{
			'afterrender':function(me, opts){
                   var vmTypeWindow=Ext.getCmp("updateVmTypeWindow");
                   if(vmTypeWindow.vmType==1){
                       me.update(local.recovery.exerciseHost);
                   }else{
                       me.update(local.recovery.practiceBuild);
                   }
               }
		}
	}],
	buttons : [{
		text :local.btn.save,
		cls:"btn_focus",
		handler : function() {
			var vmType= Ext.getCmp("vmTypeId").getChecked()[0].inputValue;
			var vmTypeWindow=Ext.getCmp("updateVmTypeWindow");
			if(vmType==emergencyMapDate.VM_MANAGER_INFO.vmType){
				Ext.MessageBox.alert(local.window.tip,local.recovery.transformation);
				return false;
			}
			var vmId=this.up('window').vmId;
			updateVirtualMachineBasisType(1,vmId,vmType);

			this.up('window').close();
		}
	},{
		text : local.btn.cancle,
		handler : function() {
			this.up('window').close();
		}
	}]	
});


/**
 * 修改虚拟机CPU窗体
* auth:wangshaodong
 */
Ext.define("acesure.emergency.view.updateVmCPUWindow", {
	extend : 'Ext.window.Window',
	title: local.recovery.modifyVirtual, 
	draggable: false,
	height: 150,		
	width: 350,
	id:'updateVmCPUWindow',
	layout: "vbox",
	modal: true, 
	resizable: false,
	items : [{
		xtype : 'panel',
		width: '100%',
		border:false,
		items : {
			xtype: 'combobox',
			padding:20,
			border:false,
			forceSelection:true,
			fieldLabel:local.emergency.numberCPU,
			id:'vm_cpu_id',
			displayField: 'name',
			valueField: 'value',
			labelSeparator: '：',
			queryMode: 'local',
			store: 'VmCPUStore',
			listeners:{
				afterrender:function(me, opts){
					this.store.load({callback:function(records, operation, success){
						var cpukernel=me.up('window').cpukernel;
						me.setValue(cpukernel);
						document.getElementById("vm_cpu_id-inputEl").disabled=true;
					}
					});
				}
			}
		}
	}],
	buttons : [{
		text :local.btn.save,
		cls:"btn_focus",
		handler : function() {

			var vmCpuView=this.up('window');
			var vmCpuValue=vmCpuView.query("combobox")[0].getValue();
			updateVirtualMachineBasisType(3,vmCpuView.vmId,vmCpuValue);
			this.up('window').close();
		}
	},{
		text :local.btn.cancle,
		handler : function() {
			this.up('window').close();
		}
	}]	
});

/**
 * 更新虚拟机内存窗口
 * auth:wangshaodong
 */
Ext.define("acesure.emergency.view.updateVmMemoryWindow", {
	extend : 'Ext.window.Window',
	title:local.recovery.parameters, 
	draggable: false,
	width: 350,
	id:'updateVmMemoryWindow',
	layout: "vbox",
	modal: true, 
	resizable: false,
	items : [{
		xtype : 'panel',
		padding:20,
		border:false,
		layout: "hbox",
		width: '100%',
		items :[
		        {
		        	xtype :'slider',
		        	fieldLabel:local.recovery.memoryControl,
		        	labelSeparator: '：',
		        	height: 214,
		        	vertical: true,
		        	minValue: 1,
		        	listeners:{
		        		afterrender:function(me, opts){
		        			var vmMemoryWindow=me.up('window');
		        			Ext.Ajax.request({
		        				url:'/emergency/tocomputeNodes!findComNodeByVmId.action',
		        				params:{"vmId":vmMemoryWindow.vmId},
		        				timeout: 40000,
		        				success: function(resp,opts) {
		        					var comNode=JSON.parse(resp.responseText);
		        					me.setMaxValue(comNode.memSize);
		        					me.setValue(vmMemoryWindow.freeMemory);
		        				},
		        				failure: function(resp,opts) {
		        				}
		        			});
		        		},
		        		change:function(me, newValue, thumb,  opts){
		        			var vmMemoryView=me.up('window').query("textfield")[0];
		        			vmMemoryView.setValue(newValue);
		        		}
		        	}
		        },{
		        	xtype : 'displayfield',
		        	value : local.recovery.memorySize+local.colon
		        },{
		        	xtype:'numberfield',
		        	itemId:'vm_memory_id',
		        	minValue: 1,
		        	width: 95,
		        	listeners:{
		        		change:function(v,newValue, oldValue, eOpts ){
		        			var memSlider=v.up('panel').down("slider");
	            			if(newValue>memSlider.maxValue){
	            				Ext.MessageBox.alert(local.window.tip,local.emergency.memorMaxNum+memSlider.maxValue+"！");
	            				newValue=memSlider.maxValue;
	            				v.setValue(newValue);
	            			}else if(newValue<1){
	            				Ext.MessageBox.alert(local.window.tip,local.emergency.memorMinNum);
	            				v.setValue(1);
	            			}
	            			memSlider.setValue(newValue);
	            		}
		        	}
		        },{
		        	xtype : 'displayfield',
		        	value : "MB"
		        }]
	}],
	buttons : [{
		text :local.btn.save,
		cls:"btn_focus",
		handler : function() {

			var vmMemoryView=this.up('window');
			var vmMemoryValue=vmMemoryView.query("textfield")[0].getValue();
			updateVirtualMachineBasisType(2,vmMemoryView.vmId,vmMemoryValue);
			this.up('window').close();
		}
	},{
		text : local.btn.cancle,
		handler : function() {
			this.up('window').close();
		}
	}]	
});

/**
 *修改虚拟机网卡驱动窗体
 * auth:wangshaodong
 */
Ext.define("acesure.emergency.view.updateVmNicWindow", {
	extend : 'Ext.window.Window',
	title:local.recovery.ardDriver, 
	draggable: false,
	height: 300,		
	width: 350,
	id:'updateVmNicWindow',
	layout: "vbox",
	modal: true, 
	resizable: false,
	items : [{
		xtype : 'panel',
		padding:20,
		border:false,
		width: '100%',
		defaults: {
			labelWidth: 80,
			labelAlign: "left"
		},
		items : {
			xtype:'radiogroup',
			fieldLabel:local.recovery.nicDriver,
			id:'vmNicId',
			width: '100%',
			columns: 1,
			items:[//==1 e1000,==2 HW type,==3 virtIO
			       { id:'vmNic1',boxLabel:'e1000' ,name:'vmNic',inputValue:1 },
			       { id:'vmNic2',boxLabel:'HW' ,name:'vmNic',inputValue:2 },
			       { id:'vmNic3',boxLabel:'virtIO' ,name:'vmNic',inputValue:3 }
			       ],
			       listeners:{
			    	   'afterrender':function(me, opts){
			    		   var vmNicWindow=Ext.getCmp("updateVmNicWindow");

			    		   if(vmNicWindow.nicDriverType==1||vmNicWindow.nicDriverType==0){
			    			   Ext.getCmp("vmNic1").setValue(true);
			    		   } else if(vmNicWindow.nicDriverType==2){
			    			   Ext.getCmp("vmNic2").setValue(true);
			    		   }else{
			    			   Ext.getCmp("vmNic3").setValue(true);
			    		   }

			    	   }
			       }      
		}
	}],
	buttons : [{
		text : local.btn.save,
		cls:"btn_focus",
		handler : function() {
			var vmNic= Ext.getCmp("vmNicId").getChecked()[0].inputValue;
			var vmId=this.up('window').vmId;
			updateVirtualMachineBasisType(4,vmId,vmNic);
			this.up('window').close();
		}
	},{
		text :local.btn.cancle,
		handler : function() {
			this.up('window').close();
		}
	}]	
});

/**
 *修改虚拟机硬盘的类型窗体
 * auth:wangshaodong
 */
Ext.define("acesure.emergency.view.updateVmHardDiskTypeWindow", {
	extend : 'Ext.window.Window',
	title: local.recovery.diskType, 
	draggable: false,
	height: 300,		
	width: 350,
	id:'updateVmHardDiskTypeWindow',
	layout: "vbox",
	modal: true, 
	resizable: false,
	items : [{
		xtype : 'panel',
		padding:20,
		border:false,
		width: '100%',
		defaults: {
			labelWidth: 80,
			labelAlign: "left"
		},
		items : {
			xtype:'radiogroup',
			fieldLabel:local.recovery.diskDriver,
			id:'vmHardDiskTypeId',
			width: '100%',
			columns: 1,
			items:[
			       { id:'vmHardDiskType0',boxLabel:'IDE' ,name:'vmHardDiskType',inputValue:0 },
			       { id:'vmHardDiskType2',boxLabel:'SATA' ,name:'vmHardDiskType',inputValue:2 },
			       { id:'vmHardDiskType4',boxLabel:'virtIO' ,name:'vmHardDiskType',inputValue:4 }
			       ],
			       listeners:{
			    	   'afterrender':function(me, opts){
			    		   var vmHardDiskTypeWindow=Ext.getCmp("updateVmHardDiskTypeWindow");

			    		   if(vmHardDiskTypeWindow.hardDiskType==0){
			    			   Ext.getCmp("vmHardDiskType0").setValue(true);
			    		   } else if(vmHardDiskTypeWindow.hardDiskType==1||vmHardDiskTypeWindow.hardDiskType==2){
			    			   Ext.getCmp("vmHardDiskType2").setValue(true);
			    		   }else if(vmHardDiskTypeWindow.hardDiskType==4){
			    			   Ext.getCmp("vmHardDiskType4").setValue(true);
			    		   }
			    	   }
			       }      
		}
	}],
	buttons : [{
		text : local.btn.save,
		cls:"btn_focus",
		handler : function() {
			var vmHardDisk= Ext.getCmp("vmHardDiskTypeId").getChecked()[0].inputValue;
			var vmId=this.up('window').vmId;
			updateVirtualMachineBasisType(6,vmId,vmHardDisk);
			this.up('window').close();
		}
	},{
		text : local.btn.cancle,
		handler : function() {
			this.up('window').close();
		}
	}]	
});

/**
 *修改虚拟机显卡的类型窗体
 * auth:wangshaodong
 */
Ext.define("acesure.emergency.view.updateVmGraphicsWindow", {
	extend : 'Ext.window.Window',
	title: local.recovery.graphicsType, 
	draggable: false,
	height: 300,		
	width: 350,
	id:'updateVmGraphicsWindow',
	layout: "vbox",
	modal: true, 
	resizable: false,
	items : [{
		xtype : 'panel',
		padding:20,
		border:false,
		width: '100%',
		defaults: {
			labelWidth: 80,
			labelAlign: "left"
		},
		items : {
			xtype:'radiogroup',
			fieldLabel:local.recovery.GPUType,
			id:'vmGraphicsId',
			width: '100%',
			columns: 1,
			items:[
			       {id:'vmGraphics0',boxLabel:'Cirrus',name: 'vmGraphics',inputValue:0,checked:true},
			       {id:'vmGraphics1',boxLabel:'Default',name: 'vmGraphics',inputValue:1,hidden:true},
			       {id:'vmGraphics2',boxLabel:'QXL',name: 'vmGraphics',inputValue:2,hidden:true},
			       {id:'vmGraphics3',boxLabel:'VGA',name: 'vmGraphics',inputValue:3},
			       {id:'vmGraphics4',boxLabel:'VMVGA',name: 'vmGraphics',inputValue:4,hidden:true},
			       {id:'vmGraphics5',boxLabel:'Xen',name: 'vmGraphics',inputValue:5,hidden:true}
			       ],
			       listeners:{
			    	   'afterrender':function(me, opts){
			    		   var updateVmGraphicsWindow=Ext.getCmp("updateVmGraphicsWindow");

			    		   if(updateVmGraphicsWindow.vmDisplayType==0){
			    			   Ext.getCmp("vmGraphics0").setValue(true);
			    		   } else if(updateVmGraphicsWindow.vmDisplayType==3){
			    			   Ext.getCmp("vmGraphics3").setValue(true);
			    		   }
			    	   }
			       }      
		}
	}],
	buttons : [{
		text :local.btn.save,
		cls:"btn_focus",
		handler : function() {
			var vmGraphics= Ext.getCmp("vmGraphicsId").getChecked()[0].inputValue;
			var vmId=this.up('window').vmId;
			updateVirtualMachineBasisType(7,vmId,vmGraphics);
			this.up('window').close();
		}
	},{
		text :local.btn.cancle,
		handler : function() {
			this.up('window').close();
		}
	}]	
});

/**
 *修改虚拟机显卡的类型窗体
 * auth:wangshaodong
 */
Ext.define("acesure.emergency.view.updateVmNicConfigWindow", {
	extend : 'Ext.window.Window',
	title: local.recovery.typeBridge, 
	draggable: false,
	height: 300,		
	width: 420,
	id:'updateVmNicConfigWindow',
	modal: true, 
	resizable: false,
	items : [{
		xtype : 'panel',
		border:false,
		margin:10,
		width: '100%',
		items : [
		         /*{
		        	 xtype : 'displayfield',
		        	 value :local.recovery.cardIndex+local.colon
		         },*/{
		        	 xtype: 'textfield',
		        	 fieldLabel:local.emergency.NTDev,
		        	 disabled:true,
		        	 width: 380
		         },{
		        	 xtype: 'combobox',
		        	 fieldLabel:local.emergency.selectCards,
		        	 emptyText : local.emergency.chooseCard,
		        	 displayField: 'computeNicName',
		        	 valueField: 'computeNicId',
		        	 //labelSeparator: '：',
		        	 queryMode: 'local',
		        	 width:380,
		        	 store: 'ComputeNodesNicStore',
		        	 listeners:{
		        		 'afterrender':function(me, opts){
		        			 me.getStore().load({params:{'computeNodesNic.computeId':me.up('window').nic.nodeId}});
		        		 }
		        	 }
		         }
		         ]
	}],
	listeners:{
		'afterrender':function(me, opts){
			var nic=me.nic;
			//me.query("displayfield")[0].setValue(local.recovery.cardIndex+local.colon+nic.vmNicIndex);
			me.query("textfield")[0].setValue(nic.vmDeviceNicName);
			if(nic.vmNodeNicId!=0){
				me.query("combobox")[0].setValue(parseInt(nic.vmNodeNicId));
			}
		}
	},		    
	buttons : [{
		text :local.btn.save,
		cls:"btn_focus",
		handler : function() {
			var vmNicConfigWindow =this.up('window');
			var vmNodeNicId= vmNicConfigWindow.query("combobox")[0].getValue();
			updateVirtualMachNicInfo(vmNicConfigWindow.nic,vmNodeNicId );
			this.up('window').close();
		}
	},{
		text : local.btn.cancle,
		handler : function() {
			this.up('window').close();
		}
	}]	
});

/**
 * 
 * LocalHardDiskWin:增加外部存储
 * @data 2016-5-3
 * @auth WangShaoDong
 */
Ext.define("acesure.emergency.view.RemoteHardDiskWin",{
	extend:'Ext.window.Window',
	title:local.recovery.remoteDisk,
	draggable:true,
	height:500,						//高度
	width:800,						//宽度
	modal:true,//是否模态窗口，默认为false
	resizable:false,
	border:false,
	id:'remoteHardDiskWinId',
	layout:"hbox",
	items:[  {
		xtype : 'remoteHardDiskDeviceTree',
		region : 'west',
		floating : false,
		width : 220,
		height:"100%",
		cls:"tree_scroll bgcolor",
		bodyStyle:'background:#f5f8fa;',
		bodyBorder:false,
		listeners : {
			itemclick:function(record, item, index, e, eOpts ){
				//子节点才会触发
				if(null == item.data.children){
					var sourceSysType=emergencyMapDate.VM_MANAGER_INFO.sysType;
					var sysType=item.raw.sysType;
					if(sourceSysType<32&&sysType>=32){
						Ext.MessageBox.alert(local.window.tip,"系统类型不匹配，创建的应急主机可能无法正常使用此磁盘！");
					};
					if(sourceSysType>=32&&sysType<32){
						Ext.MessageBox.alert(local.window.tip,"系统类型不匹配，创建的应急主机可能无法正常使用此磁盘！");
					};
					HARDDISK_DEVICEID= item.raw.deviceId ;
					var remoteHardDiskPanelId = Ext.getCmp('remoteHardDiskPanelId');
					remoteHardDiskPanelId.removeAll();
					remoteHardDiskPanelId.add({xtype:'remoteHardDiskPanel'});
					remoteHardDiskPanelId.doLayout();
				}
			},
			render: function(value,metaData,record,colIndex,store,view) {  
				metaData.tdAttr = 'data-qtip="' + value + '"';  
				return value;  
			}
		}
	},{
		xtype : 'panel',
		id:'remoteHardDiskPanelId',
		flex:1,
		height:"100%",
		overflowY:"auto",
		floating : false,
		border:false,
		items:[{
			border:false,
			html:'<div style="margin-top:40px;font-size:20px;text-align:center;">'+local.emergency.informationAccord+'<br><br>'+local.emergency.configuredMount+'</div>'
		}]
	}],
	buttons:[{
		text:local.btn.save,
		cls:"btn_focus",
		textAlign:'center',
		handler:function(){
			var check=null;
			var hardDiskPanle=Ext.getCmp('remoteHardDiskPanelId').down("remoteHardDiskPanel");
			if(hardDiskPanle){
				check=hardDiskPanle.getChecked();
			}
			if(null!=check&&check.length>0){
				addVirManagerHardDiskInfo(HARDDISKINFO.vmimgId);
			}
			Ext.getCmp("remoteHardDiskWinId").close();
		}
	},{
		text:local.btn.cancle,
		id:'cancel',
		handler:function(){
			Ext.getCmp("remoteHardDiskWinId").close();
		}
	}],
	initComponent : function() {
		var me = this;
		//this.up("windows").virId;
		VIRID=this.virId;
		Ext.applyIf(me, { 
		});
		me.callParent(arguments);
	}
});   

/**
 * @description：单机增加硬盘时显示其他设备信息
 * @data 2016-5-3
 * @auth WangShaoDong
 */
Ext.define("Ext.emergency.view.RemoteHardDiskDeviceTree",{
	extend : 'Ext.tree.Panel',
	alias : 'widget.remoteHardDiskDeviceTree',
	useArrows:true,
	rootVisible:false,
	border:true,
	frame:false,
	sortable:false,
	loadMask : {
		msg : local.loading
	},//store:"HardDiskDeviceTreeStore"
	initComponent : function() {
		var me = this;
		var hardDiskDeviceTreeStore=Ext.create("acesure.emergency.store.HardDiskDeviceTreeStore");
		hardDiskDeviceTreeStore.load({params:{"vmManagerModel.virId":VIRID,"vmManagerModel.type":2}});
		Ext.applyIf(me, { 
			store:hardDiskDeviceTreeStore
		});
		me.callParent(arguments);
	}
});

/**
 * @description：单机增加硬盘时显示其他设备硬盘信息面板
 * @data 2016-5-3
 * @auth WangShaoDong
 */
Ext.define("acesure.emergency.view.RemoteHardDiskPanel",{
	extend:"Ext.tree.TreePanel",
	alias:'widget.remoteHardDiskPanel',
	useArrows:true,
	border:false,
	cls:"tree_scroll",
	rootVisible:false,//不可见根
	multiSelect:true,
	loadMask:{msg:local.dataLoading},
	initComponent : function() {
		var me = this;
		var otherDeviceHardDiskStore=Ext.create("acesure.emergency.store.OtherDeviceHardDiskStore");
		otherDeviceHardDiskStore.load({params:{"vmManagerModel.deviceId":HARDDISK_DEVICEID}});
		Ext.applyIf(me, {
			store:otherDeviceHardDiskStore
		});
		HARDDISK_DEVICEID=null;
		me.callParent(arguments);
	},
	listeners:{
		checkchange:function(node, checked,obj){
			var checkedNodes = this.getChecked();
			for(var i=0;i<checkedNodes.length;i++){
				var n = checkedNodes[i];
				if(node.get("id") != n.get("id")){
					n.set("checked" , false);
				}
			}
			if(this.getChecked().length!=0){
				HARDDISKINFO=node.raw;
			}else{
				HARDDISKINFO=null;
			}
		}
	}
});
/**
 * 本地磁盘显示窗口
 * auth:wangshaodong
 */
Ext.define("acesure.emergency.view.LocalHardDiskPanelWin",{
	extend:'Ext.window.Window',
	title:local.recovery.localDisk,
	draggable:true,
	height:400,						//高度
	width:700,						//宽度
	modal:true,//是否模态窗口，默认为false
	resizable:false,
	border:false,
	layout:"fit",
	id:'localHardDiskPanelId',
	items:[{
		xtype:"hardDiskSelectGrid"
	}],
	buttons:[
	         {
	        	 text:local.btn.save,
	        	 cls:"btn_focus",
	        	 textAlign:'center',
	        	 handler:function(){
	        		 var records=Ext.getCmp("hardDiskSelectGridId").getSelectionModel().getSelection()[0];
	        		 addVirManagerHardDiskInfo(records.data.vmimgId);
	        		 Ext.getCmp("localHardDiskPanelId").close();

	        	 }
	         },{
	        	 text:local.btn.cancle,
	        	 id:'cancel',
	        	 handler:function(){
	        		 Ext.getCmp("localHardDiskPanelId").close();
	        	 }
	         }],
	         initComponent:function(){
	        	 var me=this;
	        	 Ext.apply(this,{
	        	 });
	        	 this.callParent();
	         }
});
/**
 * 本地磁盘显示窗口，磁盘信息显示表格
 * auth:wangshaodong
 */
Ext.define('acesure.emergency.view.HardDiskSelectGrid',{
	extend:'Ext.grid.GridPanel',
	alias:'widget.hardDiskSelectGrid',
	id:'hardDiskSelectGridId',
	initComponent:function(){

		var virtualTabPanel=Ext.getCmp("virtualTabPanel");
		var virId=virtualTabPanel.virtualIndex;
		var virManHardDiskStore=Ext.create("acesure.emergency.store.VirManHardDiskStore");
		virManHardDiskStore.load({params:{"vmManagerModel.virId":virId}});

		var sm = new Ext.selection.CheckboxModel({  
			dataIndex: "index", 
			mode:'single',
			singleSelect: true,
			showHeaderCheckbox :false,
			checkOnly :true
		}); 

		Ext.apply(this, {
			store:virManHardDiskStore,
			selModel:sm,
			columns : [
			           {
			        	   header : local.recovery.diskIndex,
			        	   dataIndex : 'diskIndex',
			        	   menuDisabled:true,
			        	   width : '14%',
			        	   renderer : function(value, cellmeta, record, rowIndex, columnIndex) {
			        		   return local.recovery.disk+value;
			        	   }
			           },
			           {
			        	   header : local.recovery.diskURL,
			        	   dataIndex : 'diskFilePath',
			        	   menuDisabled:true,
			        	   width : '60%',
			        	   renderer : function(value, cellmeta, record, rowIndex, columnIndex) {
			        		   return '<div title="' + value + '"  width=350>' + value + '</div>';
			        	   }
			           },
			           {
			        	   header :local.recovery.operatingSystem,
			        	   dataIndex : 'isOS',
			        	   menuDisabled:true,
			        	   width : '26%',
			        	   renderer : function(value, cellmeta, record, rowIndex, columnIndex) {
			        		   return value==2?local.null0:local.recovery.have;
			        	   }
			           },
			           {
			        	   header : '',
			        	   dataIndex : 'vmimgId',
			        	   hidden:true
			           }
			           ]
		});
		this.callParent(arguments);
	}
});
/**
 * 网卡显示窗口
 * auth:wangshaodong
 */
Ext.define("acesure.emergency.view.NetWorkSelectWin",{
	extend:'Ext.window.Window',
	title:local.emergency.newIncreaseCard,
	draggable:true,
	height:400,						//高度
	width:400,						//宽度
	modal:true,//是否模态窗口，默认为false
	resizable:false,
	border:false,
	layout:"fit",
	id:"virAddNiciId",
	items:[{
		xtype:"netWorkSelectGrid"
	}],
	buttons:[
	         {
	        	 text:local.btn.save,
	        	 cls:"btn_focus",
	        	 textAlign:'center',
	        	 handler:function(){
	        		 var deviceNicId=new Array();
	        		 var records=Ext.getCmp("netWorkSelectGridId").getSelectionModel().getSelection();
	        		 if(records.length==0){
	        			 Ext.MessageBox.alert(local.window.tip,local.emergency.pleasCard);
	        			 return false;
	        		 }else{
	        			 for(i=0;i<records.length;i++){
	        				 deviceNicId[i]=records[i].raw.id;
	        			 }
	        		 };
	        		 var window=this.up("window");
	        		 var vmId=window.vmId;
	        		 Ext.Ajax.request({
	        			 url:'/emergency/tovmManager!addVmNic.action',
	        			 timeout:40000,
	        			 params:{"vmManagerNic.vmId":vmId,"deviceNic":deviceNicId.toString()},
	        			 success: function(resp,opts) {
	        				 var nic=JSON.parse(resp.responseText);
	        				 showMsg(nic);
	        				 loadVmConfigNetInfo(vmId);
	        				 Ext.getCmp("virAddNiciId").close();
	        			 },
	        			 failure: function(resp,opts) {
//	        				 Ext.MessageBox.alert(local.window.tip,local.recovery.networkAdapter);
	        				 Ext.websure.MsgError("WF-30110",local.recovery.networkAdapter);
	        			 }
	        		 });
	        	 }
	         },
	         {
	        	 text:local.btn.cancle,
	        	 id:'cancel',
	        	 handler:function(){
	        		 this.up("window").close();
	        	 }
	         }]
});
/**
 * 网卡显示窗口，网卡信息展示列表
 * auth:wangshaodong
 */
Ext.define('acesure.emergency.view.NetWorkSelectGrid',{
	extend:'Ext.grid.GridPanel',
	alias:'widget.netWorkSelectGrid',
	id:'netWorkSelectGridId',
	initComponent:function(){
		var deviceNicStore=Ext.create("acesure.emergency.store.NetWorkListStore");
		deviceNicStore.load({params:{"vmManagerModel.deviceId":emergencyMapDate.VM_MANAGER_INFO.deviceId,
			"vmManagerModel.virId":emergencyMapDate.VM_MANAGER_INFO.id,"vmManagerModel.type":2}});//type:2,表示修改虚拟机

		var sm = new Ext.selection.CheckboxModel({  
			dataIndex: "index", 
			mode:'SIMPLE'
			/*singleSelect: true,
			showHeaderCheckbox :false,
			checkOnly :true*/
		}); 

		Ext.apply(this, {
			store:deviceNicStore,
			selModel:sm,
			columns : [
			           {
			        	   header : local.emergency.index,
			        	   dataIndex : 'index',
			        	   width:50,
			        	   hidden:true,
			        	   renderer : function(value, cellmeta, record, rowIndex, columnIndex) {
			        		   return value;
			        	   }
			           },
			           {
			        	   header : 'MAC',
			        	   dataIndex : 'mac',
			        	   flex:1,
			        	   renderer : function(value, cellmeta, record, rowIndex, columnIndex) {
			        		   return value;
			        	   }
			           },
			           {
			        	   header : local.IP,
			        	   dataIndex : 'ip',
			        	   flex:1,
			        	   renderer : function(value, cellmeta, record, rowIndex, columnIndex) {
			        		   return value;
			        	   }
			           }
			           ]
		});
		this.callParent(arguments);
	}
});



Ext.define("acesure.emergency.view.authorizeEmergencyWindow", {
	extend : 'Ext.window.Window',
	title: local.emergency.authEmerWinTitle, 
	draggable: true,
	height: 380,		
	width: 400,
	id:'authorizeEmergencyWindow',
	layout: "vbox",
	border:false,
	modal: true, 
	resizable: false,
	items : [{
		xtype:"fieldset",
		title:local.emergency.authType,
		margin:"10 10 0 10",
		width: '100%',
		//height:120,
		padding:"0 10 10 10",
		items : {
			//border:false,
			//labelWidth:"100%",
			xtype:'radiogroup',
			//fieldLabel:"授权类型",
			//margin:10,
			id:'authorizedEmergencyType',
			width: '100%',
			columns: 2,
			items:[
			       {padding:"6 0 0 40",boxLabel:local.recovery.takeOver ,name:'emergency',inputValue:1 },
			       {padding:"6 0 0 30",boxLabel:local.recovery.rehearse ,name:'emergency',inputValue:2 }
			       ]     
		}
	},{
		xtype:"fieldset",
		title:local.emergency.authDevNumInfo,
		margin:"20 10 0 10",
		width:"100%",
		//border:false,
		padding:"0 10 10 10",
		//html:"总授权设备信息：应急2个，演练2个</br>余授权设备信息：接管2个，演练2个",
		listeners:{
			afterrender:function(v){
				showEmergencyLicenseSize(v);
				/*console.log(licenseInfo);
				if(licenseInfo){
					var htmlStr="总授权设备信息：应急"+licenseInfo.allTakeOver+"个，演练"+
					licenseInfo.allEmulation+"个</br>余授权设备信息：接管"+licenseInfo.remainTakeOver+"个，演练"+licenseInfo.remainEmulation+"个";
					v.update(htmlStr);
				}*/
			}
		}
	},{
		xtype:"fieldset",
		title:local.explain,
		margin:"20 10 0 10",
		padding:"0 10 10 10",
		//height:0,
		width: '100%',
		html:"<font color='red'>"+local.emergency.authDevNumInfoExplain+"</span>"
	}],
	buttons : [{
		text :local.btn.save,
		cls:"btn_focus",
		handler : function(v) {
			var vmType= Ext.getCmp("authorizedEmergencyType").getChecked()[0].inputValue;
			var deviceId=v.up('window').deviceId;
			var type=v.up('window').type;
			var virType=v.up('window').virType;//1:快照接管，2：快照演练，3：快照快速接管，4：快照快速演练，5：设备快速接管
			var snapSetId=v.up('window').snapSetId;
			var addEmeType;
			var addEmuType;
			if(vmType==1){
				addEmeType=1;
			}else {
				addEmeType=0;
			};
			if(vmType==2){
				addEmuType=2;
			}else {
				addEmuType=0;
			}
			//setInfo插入
			//var result=addDeviceEmergencyLicense(deviceId,addEmeType,addEmuType);
			Ext.Ajax.request({
				url:'/emergency/tovmManager!addDeviceEmergencyLicense.action',
				params:{
					"deviceId":deviceId,
					"takeover":addEmeType,
					"emulation":addEmuType
				},
				timeout: 100000, 
				success: function(resp,opts) {
					var vmResponse=JSON.parse(resp.responseText);
					var vmResponse=JSON.parse(resp.responseText);
					var msgCode=vmResponse[0].msgCode;
					var msgContent=vmResponse[0].msgContent;
					//>30000异常，=30000正常
					if(msgCode>30000){
						Ext.websure.MsgError(msgCode,msgContent);
						v.up('window').close();
						return false;
					}else{
						//type==1:设备快速接管,type==2：快照接管演练，type==3:自动接管
						if(type==1){
							if(vmType==1){
								Ext.websure.MsgTip.msg(local.window.tip, msgContent,true);
								if(Ext.getCmp("takeOverId")){
									AYTHORIZEEMERGENCY=1;
								};
								//deviceFastEmergency(deviceId);//设备快速接管
								
							}else{
								Ext.websure.MsgTip.msg(local.window.tip, msgContent,true);
								if(Ext.getCmp("takeOverId")){
									AYTHORIZEEMERGENCY=2;
								};
							}
						}else if(type==2){
							
							//快照点判断是否设置接管或则演练机全局变量
							if(addEmeType==1){
								AYTHORIZEEMERGENCY=1;
							}else{
								AYTHORIZEEMERGENCY=2;
							}
							
							if(virType==1){
								
								if(addEmuType==2){//演练授权无法创建接管机
									Ext.MessageBox.alert(local.window.tip,local.emergency.devAuthEmuSuccessButCreateHostFailure);	
								}else{
									configNewVmMachine(snapSetId,1);//创建接管虚拟机
								}
							}else if(virType==2){
								
								configNewVmMachine(snapSetId,2);//创建演练虚拟机
								
							}else if(virType==3){
								
								if(addEmuType==2){//演练授权无法快速启动接管机
									Ext.MessageBox.alert(local.window.tip,local.emergency.devAuthEmuSuccessButCreateQuickHostFailure);	
								}else{
									fastConfigNewVmMachine(deviceId,1,snapSetId);//快速创建接管虚拟机
								}
								
							}else if(virType==4){
								
								fastConfigNewVmMachine(deviceId,2,snapSetId);//快速创建演练虚拟机
								
							}else{
								Ext.websure.MsgTip.msg(local.window.tip, msgContent,true);
							}
						}else{
							Ext.websure.MsgTip.msg(local.window.tip, msgContent,true);
							if(Ext.getCmp("takeOverId")){
								if(addEmeType==1){
									AYTHORIZEEMERGENCY=1;
								}else{
									AYTHORIZEEMERGENCY=2;
								}
							};
						}
						v.up('window').close();
					}
					//刷新左侧树
					Ext.getCmp('grobleTreePanel').getStore().reload();
				},
				failure: function(resp,opts) {
					Ext.MessageBox.alert(local.window.tip,local.emergency.devSetHostError);
				}
			});
		}
	},{
		text : local.btn.cancle,
		handler : function(v) {
			v.up('window').close();
		}
	}]
});


Ext.define("acesure.emergency.view.updateEmergencyLicenseWindow", {
	extend : 'Ext.window.Window',
	title: local.emergency.updateDevEmerAuthWinTitle, 
	draggable: true,
	height: 380,		
	width: 400,
	id:'updateEmergencyLicenseWindow',
	layout: "vbox",
	border:false,
	modal: true, 
	resizable: false,
	items : [{
		xtype:"fieldset",
		title:local.emergency.authType,
		margin:"10 10 0 10",
		width: '100%',
		//height:120,
		padding:"0 10 10 10",
		items : {
			xtype:'radiogroup',
			id:'updateEmergencyLicenseType',
			width: '100%',
			columns: 2,
			items:[
			       {padding:"6 0 0 40",boxLabel:local.recovery.takeOver ,name:'emergency',inputValue:1,checked:true },
			       {padding:"6 0 0 30",boxLabel:local.recovery.rehearse ,name:'emergency',inputValue:2,disabled:true }
			       ]   
		}
	},{
		xtype:"fieldset",
		title:local.emergency.authDevNumInfo,
		margin:"20 10 0 10",
		width:"100%",
		padding:"0 10 10 10",
		listeners:{
			afterrender:function(v){
				showEmergencyLicenseSize(v);
			}
		}
	},{
		xtype:"fieldset",
		title:local.explain,
		margin:"20 10 0 10",
		padding:"0 10 10 10",
		//height:0,
		width: '100%',
		html:"<font color='red'>"+local.emergency.authDevNumInfoExplain+"</span>"
	}],
	buttons : [{
		text :local.btn.save,
		cls:"btn_focus",
		handler : function(v) {
			var deviceId=v.up('window').deviceId;
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
					if(!vmResponse){
						Ext.MessageBox.alert(local.window.tip,local.emergency.devSetHostFailure);
					}else{
						AYTHORIZEEMERGENCY=1;
						Ext.getCmp('grobleTreePanel').getStore().reload();
					}
						v.up('window').close();
				},
				failure: function(resp,opts) {
					Ext.MessageBox.alert(local.window.tip,local.emergency.devSetHostError);
				}
			});
			
		}
	},{
		text : local.btn.cancle,
		handler : function(v) {
			v.up('window').close();
		}
	}]
});

/**
 * 配置自动接管窗口
 * auth:wangshaodong
 */
Ext.define("acesure.emergency.view.configAutoTakeoverWindow", {
	extend : 'Ext.window.Window',
	width:400,
	//height:500,
	id:'configAutoTakeoverWindow',
	title:local.emergency.autoTakeoverWinTitle,
	border:false,
	modal: true, 
	resizable: false,
	items: {
		xtype:"panel",
		border:false,
		items:[{
			xtype:'fieldset',
			title:local.emergency.autoTakeoverWinTitle,
			margin:10,
			autoHeight:true,
			items:[{
				border: false,
				defaults:{border: false},
				items:[{
					width:"100%",
					xtype:'checkbox',
					id:'vir-set-id',
					boxLabel:local.emergency.openAutoTakeover,
					listeners:{
						afterrender:function(v){
							if(setInfo){
								if(setInfo.state==1){
									v.setValue(true);
								}else{
									v.setValue(false);
								}
							}
						},
						change:function( v, newValue, oldValue, eOpts ){
							if(newValue){
								Ext.getCmp("Interrupt-min-id").setDisabled(false);
							}else{
								Ext.getCmp("Interrupt-min-id").setDisabled(true);
								Ext.getCmp("Interrupt-min-id").reset();
							}
						}
					}
				},
				{
					border:false,
					layout:"hbox",
					margin:"10 0 10 0",
					items:[
					       {
					    	   width:120,
					    	   xtype:"label",
					    	   html:'客户机离线时间：'
					       },
					       {
					    	   xtype:'combobox',
					    	   id:'Interrupt-min-id',
					    	   disabled:true,  
					    	   editable:false,  //不可编辑
					    	   value:3,  //默认3分钟
					    	   width:60,
					    	   store : [[3,3],[6,6],[9,9],[12,12],[15,15]],
					    	   listeners:{
					    		   afterrender:function(v){
					    			   if(setInfo && setInfo.state==1){
					    				   v.setValue(setInfo.netInterruptMin);
					    			   }
					    		   }
					    	   }
					    	   
					    	
					       },{
					    	   xtype:"label",
					    	   width:30,
					    	   html:"分钟"
					       }]
				}]
			},{
				width:350,
				border: false,
				//html:'源设备IP地址：'+deviceInfo.ip,
				listeners:{
					afterrender:function(v){
						 v.update(local.emergency.gridName+local.colon+deviceInfo.pageText);
					}
				}
			},{
				width:350,
				border: false,
				//html:'源设备IP地址：'+deviceInfo.ip,
				listeners:{
					afterrender:function(v){
						 v.update(local.emergency.gridIP+local.colon+deviceInfo.ip);
					}
				}
			}/*,{
				width:350,
				border: false,
				margin:"10 0 10 0",
				//html:'创建时间：'+Ext.util.Format.date("2016-01-10","Y-m-d H:i:s"),
				listeners:{
					afterrender:function(v){
						 v.update('创建时间：'+Ext.util.Format.date(new Date(),"Y-m-d H:i:s"));
					}
				}
			}*/]
		},{
			xtype:'fieldset',
			title:local.explain,
			margin:10,
			padding:"0 10 10 10",
			html:local.emergency.clientExplain
		}
		]},
		buttons:[
		         {
		        	text:local.btn.save,cls:"btn_focus",handler:function(v){
		        		var checked=Ext.getCmp("vir-set-id").getValue()?1:2;
		        		var netInterruptMin=Ext.getCmp("Interrupt-min-id").getValue();
		        		//保存警告框
		        		Ext.MessageBox.show({
		                    title: '确认保存自动接管设置?',
		                    msg: '如果设备计划关机或重启时长超过设定的离线时间， 接管机依然会启动并接管该设备',
		                    buttons: Ext.MessageBox.YESNO,
		                    buttonText:{ 
		                        yes: "确认", 
		                        no: "取消" 
		                    },
		                    icon: Ext.MessageBox.QUESTION,
		                    fn: function(btn){
	                    		if(btn == 'yes'){
	                                var deviceId=deviceInfo.deviceId;
	                            	addVmManagerSetInfo(deviceId,checked,netInterruptMin);
	                    		}
	                    	}
		                });
		        		
                    	/*//保存警告框
                    	Ext.MessageBox.confirm('确认保存自动接管设置?','如果设备计划关机或重启时长超过设定的离线时间， 接管机依然会启动并接管该设备',function(btn){
                    		if(btn == 'yes'){
                                var deviceId=deviceInfo.deviceId;
                            	addVmManagerSetInfo(deviceId,checked,netInterruptMin);
                    		}
                    	});*/

		        	}
		         },
		         {
		        	text:local.btn.cancle,handler:function(v){
		        		Ext.getCmp("configAutoTakeoverWindow").close();
		        	}
		         }
		         ],
    initComponent:function(){
       deviceInfo=this.deviceInfo;
       setInfo=this.setInfo;
       Ext.apply(this,{
       });
       this.callParent();
    }
});