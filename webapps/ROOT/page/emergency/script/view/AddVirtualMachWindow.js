//克隆Id
var DISKCLONEID=null;
//源设备ID
var SourceDeviceId=null;
//源系统类型
var SourceSysType=null;
//快照集ID
var SNAPSETID=null;
//其他设备硬盘Id
var HARDDISK_DEVICEID=null;
//其他设备硬盘
var HARDDISKINFO=null;
//接管模式
var EMERGENCYTYPE=null;
//选中的计算节点
var CALCULATENODE=null;
//计算节点信息
var COMPUTENODEINFO=null;
//设备名称+ip
var DEVICENAME = null;
var MODELINFO=null;
var DATAPOINTTIME=1000; //小颗粒的跨度为1秒钟
var SERVER_NAME;
//标识集群虚拟机，仅用于创建虚拟机createVmManager中
var CLUSTERVMFLAG = null;
//单击授权
var AUTHORITY = null;
/**
 * @description：页面初始化
 * @data 2016-4-7
 * @auth WangShaoDong
 */
Ext.define("acesure.emergency.view.AddVirtualMachWindow", {
	extend : 'Ext.window.Window',
	alias:"widget.addVirtualMachWindow",
	draggable: true,
	width: 660,
	id:'addVirtualMachWindow',
	layout: "vbox",
	modal: true, 
	border:false,
	resizable: false,
	buttons : [{
		text : local.btn.new0,
		id:"virtualMachWindowAddButton",
		cls:"btn_focus",
		handler : function() {			
			createVmManager(SourceDeviceId,EMERGENCYTYPE,SNAPSETID,CLUSTERVMFLAG);
		},
		listeners:{
			afterrender:function(v){
				if(Ext.getCmp("emergencyAuthorizationPanel")){
					Ext.getCmp("emergencyAuthorizationPanel").hide();
				}
				if(EMERGENCYTYPE==5){
					v.setText(local.btn.save);
				}
			}
		}
	},{
		text : local.btn.cancle,
		handler : function() {
			Ext.getCmp('addVirtualMachWindow').close();
		}
	}],
	initComponent:function(){
		var me=this;
		DISKCLONEID=this.ddIds;
		SourceDeviceId=this.deviceIdWin;
		SourceSysType=this.typeWin;
		SNAPSETID=this.snapSetIdWin;
		EMERGENCYTYPE=this.emergencyType;
		DEVICENAME = this.deviceName;
		CALCULATENODE=null;
		COMPUTENODEINFO=null;
		MODELINFO=this.modelInfo;
		AUTHORITY = this.deviceAuthority;
		var emergencyWinSelect=null;
		if(EMERGENCYTYPE==1){//普通接管
			CLUSTERVMFLAG = 0;
			emergencyWinSelect="emergencyTakeOver";
			me.title=local.emergency.emergencyConfig;
		}else if(EMERGENCYTYPE==2){//普通演练
			CLUSTERVMFLAG = 0;
			emergencyWinSelect="emergencyEmulation";
			me.title=local.emergency.rehearseCon;
		}else if(EMERGENCYTYPE==3){//集群接管
			CLUSTERVMFLAG = 1;
			EMERGENCYTYPE =1;
			me.title=local.emergency.clusterTakeOver;
			emergencyWinSelect="clusterTakeOver";
		}else if(EMERGENCYTYPE==4){//集群演练
			CLUSTERVMFLAG = 1;
			EMERGENCYTYPE =2;
			me.title=local.emergency.clusterRehearse;
			emergencyWinSelect="clusterTakeOver";
		}else{
			CLUSTERVMFLAG = 0;
			emergencyWinSelect="emergencyFastConfig";
			me.title=local.emergency.preconfiguredFast;
		}
		Ext.apply(this,{
			items:{xtype:emergencyWinSelect}
		});
		this.callParent();
	}
});

/**
 * @description：集群接管设置
 * @data 2017-3-9
 * @auth ZhangJiaChen
 */
Ext.define("acesure.emergency.view.ClusterTakeOver",{
	extend:"Ext.form.Panel",
	alias:"widget.clusterTakeOver",
	width:'100%',
	border:false,		
	layout:'vbox',
	items: [
	        {
	        	xtype: 'panel',
	        	width:'100%',
	        	layout: 'hbox',
	        	bodyStyle:"border:0;border-bottom:1px solid #eee",
	        	items: [
	        	        {
	        	        	xtype: 'panel',
	        	        	width: 110,
	        	        	height:'100%',
	        	        	border:false,	
	        	        	padding:'0 0 0 10',
	        	        	style:'background:#fafbfc;',
	        	        	bodyStyle:'background:#fafbfc;',
	        	        	bodyCls:'vertical_text',
	        	        	html:local.emergency.basicCon
	        	        },
	        	        {
	        	        	xtype: 'panel',
	        	        	flex:1,
	        	        	border:false,
	        	        	defaults:{
     	        	    	   margin:'0 20 5 20'
	        	        	},
	        	        	items:[
	        	        	       {
	        	        	       		xtype:"panel",
	        	        	       		id:'emergencyAuthorizationPanel',
	        	        	       		border:false,
	        	        	       		layout:"hbox",
	        	        	       		height:40,
	        	        	       		margin:0,
	        	        	       		bodyStyle:'background:#fff4d2;',
	        	        	       		items:[
										{
										    fieldLabel : local.emergency.needAuth,
										    xtype:'panel',
										    id:'emergencyAuthorizationTextArea',
		        	        	       		padding:'10 0 0 0',
		        	        	       		bodyStyle:'padding-left:20px;background:#fff4d2;',
										    height:40,
										    width:250,
										    value:'testmsg',
										    border:false
										},
										{
										    xtype:"button",
										    icon:'/images/common/icon_auth.png',
										    style:"margin-left:1px;padding-left:17px",
										    texrAlign:"center",
										    margin:'5 0 0 20',
										    width:100,
										    height:30,
										    cls:"ip_add_btn",
										    html:local.emergency.needAuth,
										    handler:function(){
										    	var takeOver = 0;
										    	var emulation = 0;
										    	if(EMERGENCYTYPE == 1){
										    		takeOver = 1;
										    	}else{
										    		emulation = 1;
										    	}
										    	Ext.Ajax.request({
													url:'/emergency/tovmManager!addDeviceEmergencyLicense.action',
													params:{
														"deviceId":SourceDeviceId,
														"takeover":takeOver,
														"emulation":emulation
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
														}else{
															Ext.Msg.alert(local.window.tip,local.emergency.authSuccess);
															Ext.getCmp("virtualMachWindowAddButton").setDisabled(false);
															Ext.getCmp("emergencyAuthorizationPanel").hide();
															}
														}
										    		});
										    	}
											}
										]
	        	        	       },
	        	        	       {
	        	        	    	   xtype: 'combobox',
	        	        	    	   fieldLabel:local.emergency.clusterTarget,
	        	        	    	   width: 350,
	        	        	    	   labelWidth:130,
	        	        	    	   margin:'10 0 5 20',
	        	        	    	   labelCls:"label_icon label_icon_cal",
	        	        	    	   id:'aimName',
	        	        	    	   maxLength:100,
	        	        	    	   displayField:'deviceName',
	        	        	    	   valueField:'deviceId',
	        	        	    	   forceSelection : true,
	        	        	    	   editable : false,
	        	        	    	   listConfig: {
	        	        	    	   	tpl: ['<table width="100%"><tpl for=".">', '<tr data-qtip="{tip}">', '<td role="option" class="x-boundlist-item">{deviceName}</td>', '</tr>', '</tpl></table>']
                                       },
	        	        	    	   listeners : {
	        	        	    		   afterrender:function(v){
	        	        	    			   Ext.Ajax.request({
	        	        	    				   url:'/emergency/tovmManager!getClusterallDevice.action',
	        	        	    				   params : {
	        	       	    						'deviceId' : SourceDeviceId,
	        	       	    						"diskCloneId":SNAPSETID.split("-")[0]
	        	        	    				   },
	        	        	    				   success: function(resp,opts) {
	        	        	    					   var result=Ext.decode(resp.responseText).info;
	        	        	    					   var states = Ext.create('Ext.data.Store', {
	        	        	    						    fields: ['deviceId', 'deviceName','tip'],
	        	        	    						    data : result
	        	        	    						});
	        	        	    					   Ext.getCmp("aimName").bindStore(states);
	        	        	    					   //选择当前页面对应的diskCloneid
	        	        	    					   //Ext.getCmp("aimName").setValue(SourceDeviceId);
	        	        	    				   },
	        	        	    				   failure: function(resp,opts) {
	        	        	    				   }
	        	        	    			   });
	        	        	    		   },
	        	        	    		   'select':function(combo, records, eOpts){
	        	        	    			   Ext.Ajax.request({
	        	        	    				   url:'/backup/todeviceAction!getClusterDeviceInfoByMaterDiskClone.action',
	        	        	    				   params:{"diskCloneId":SNAPSETID.split("-")[0],
	        	        	    					   			"setId":SNAPSETID.split("-")[1],
	        	        	    					   			"deviceId":combo.value}, 
	        	        	    				   success: function(resp,opts) {
	        	        	    					   var returnJson= JSON.parse(resp.responseText).info;
	        	        	    					   if(returnJson.diskCloneId == null){
	        	        	    						   Ext.Msg.alert(local.window.tip,returnJson);
	        	        	    						   Ext.getCmp("virtualMachWindowAddButton").setDisabled(true);
	        	        	    						   return;
	        	        	    					   }else{
	        	        	    						   Ext.getCmp("virtualMachWindowAddButton").setDisabled(false);
	        	        	    					   }
	        	        	    					   //本地变量赋值
	        	        	    					   DISKCLONEID = returnJson.diskCloneId;
	        	        	    					   SourceDeviceId = returnJson.deviceId;
	        	        	    					   SourceSysType= returnJson.typeWin;
	        	        	    					   SNAPSETID = returnJson.diskCloneId + "-" + SNAPSETID.split("-")[1];
	        	        	    					   LICENSEEMERGENCY = returnJson.licenseEmergency;
	        	        	    					   //页面赋值
	        	        	    					   Ext.getCmp("systemTypeId").setValue(SourceSysType+'');
	        	        	    					   Ext.getCmp("hardDiskAndVmdkId").removeAll();
	        	        	    					   Ext.getCmp("netWordConfigId").removeAll();
	        	        	    					   
	        	        	    					   //判断授权
	        	        	    					   initEmergencyAuthorizationPanel(
	        	        	    							   returnJson.licenseEmergency,
	        	        	    							   returnJson.remainTakeOver,
	        	        	    							   returnJson.remainEmulation
	        	        	    					   );
	        	        	    					   
	        	        	    					   //判断是否已经被配置了应急接管虚拟机
	        	        	    					   if( returnJson.flag == true ){
	        	        	    						   Ext.Msg.alert(local.window.tip,local.emergency.snapUsedCannotCreat);
	        	        	    						   Ext.getCmp("virtualMachWindowAddButton").setDisabled(true);
	        	        	    						   Ext.getCmp("emergencyAuthorizationPanel").hide();
	        	        	    					   }else{
	        	        	    						   //Ext.getCmp("virtualMachWindowAddButton").setDisabled(false);
	        	        	    					   }
	        	        	    					   
	        	        	    					   listDeviceAllHardDisks();
	        	        	    					   listAllDeviceNic();
	        	        	    					   
	        	        	    				   },
	        	        	    				   failure: function(resp,opts) {
	        	        	    					   
	        	        	    				   }
	        	        	    			   });
	        	        	    			   
	        	        	    			   //加载对应的计算节点
	        	        	    			   	var cnodeStore = Ext.getCmp("computeNoteId").getStore();
	        	        	    			   	cnodeStore.load({
	        	        	    			   		params:{"deviceId":SourceDeviceId},
	        	        	    			   		callback:function(records, options, success){
	        	        	    			   			if(records.length!=0){
	        	        	    			   				var firstValue=records[0].data.id;
	        	        	    			   				CALCULATENODE=firstValue;
	        	        	    			   				COMPUTENODEINFO=records[0].data;
	        	        	    			   				Ext.getCmp("computeNoteId").setValue(firstValue);
	        	        	    			   				var cpuSlider=Ext.getCmp("cpuSlider");
	        	        	    			   				cpuSlider.setMaxValue(COMPUTENODEINFO.logicCpu);
	        	        	    			   				var memSlider=Ext.getCmp("memSlider");
	        	        	    			   				memSlider.setMaxValue(COMPUTENODEINFO.memSize);
	        	        	    			   			}else{
	        	        	    			   				Ext.MessageBox.alert(local.window.tip,local.emergency.noCalnode);
	        	        	    			   				return false;
	        	        	    			   			}
	        	        	    			   		}
	        	        	    			   	});
	        	        	    		   }
	        	        	    	   }
	        	        	       },
	        	        	       {
	        	        	    	   xtype: 'textfield',
	        	        	    	   fieldLabel:local.emergency.hostName,
	        	        	    	   width: 350,
	        	        	    	   labelWidth:130,
	        	        	    	   labelCls:"label_icon label_icon_type ",
	        	        	    	   id:'vmName',
	        	        	    	   maxLength:30,
	        	        	    	   enforceMaxLength:true,
	        	        	    	   allowBlank: false,
	        	        	    	   blankText:local.emergency.hostNameNullMess,
	        	        	    	   vtype :'alphanum',  
	        	        	    	   vtypeText : local.emergency.hostNameFormatMess,
	        	        	    	   listeners : {
	        	        	    		   afterrender:function(){
	        	        	    			   Ext.Ajax.request({
	        	        	    				   url:'/emergency/tovmManager!getMaxVmManagetId.action',
	        	        	    				   success: function(resp,opts) {
	        	        	    					   Ext.getCmp("vmName").setValue('Cluster_Server_'+resp.responseText);
	        	        	    				   },
	        	        	    				   failure: function(resp,opts) {
	        	        	    				   }
	        	        	    			   });
	        	        	    		   }
	        	        	    	   }
	        	        	       },
	        	        	       {
	        	        	    	   xtype: 'combobox',
	        	        	    	   displayField: 'name',
	        	        	    	   valueField: 'id',
	        	        	    	   fieldLabel: local.emergency.nodeCount,
	        	        	    	   labelWidth:130,
	        	        	    	   labelCls:"label_icon label_icon_cal ",
	        	        	    	   id: 'computeNoteId',
	        	        	    	   width: 350,
	        	        	    	   queryMode:'local',
	        	        	    	   blankText :local.emergency.pleaseSelect,
	        	        	    	   forceSelection : true,
	        	        	    	   editable : false,
	        	        	    	   store:'CalculateNodesStore',
	        	        	    	   listeners:{
	        	        	    		   select:function(combo, records, eOpts){
	        	        	    			   var calNodeId=Ext.getCmp("computeNoteId").getValue();

	        	        	    			   CALCULATENODE=calNodeId;
	        	        	    			   COMPUTENODEINFO=records[0].data;

	        	        	    			   //每次重选计算节点重新加载网卡数据
	        	        	    			   var netWordConfig=Ext.getCmp("netWordConfigId");
	        	        	    			   netWordConfig.removeAll();
	        	        	    			   switchComputeNodesUpdateNic();


	        	        	    			   //设置最大Cpu和内存
	        	        	    			   var cpuSlider=Ext.getCmp("cpuSlider");
	        	        	    			   cpuSlider.setMaxValue(COMPUTENODEINFO.logicCpu);
	        	        	    			   var memSlider=Ext.getCmp("memSlider");
	        	        	    			   memSlider.setMaxValue(COMPUTENODEINFO.memSize);
	        	        	    		   },
	        	        	    		   change:function( me, newValue, oldValue, eOpts ){
	        	        	    		   	    var computeNodeId = newValue;
	        	        	    		   	    //加载计算机点下的虚拟子网列表
	        	        	    		   	    loadVmSubList(computeNodeId);
	        	        	    		   }
	        	        	    	   }
	        	        	       },
	        	        	       {
	        	        	    	   xtype: 'combobox',
	        	        	    	   displayField: 'systemName',
	        	        	    	   valueField: 'value',
	        	        	    	   fieldLabel: local.emergency.operatingSystem,
	        	        	    	   labelWidth:130,
	        	        	    	   labelCls:"label_icon label_icon_sys ",
	        	        	    	   queryMode: 'local',
	        	        	    	   id: 'systemTypeId',
	        	        	    	   editable:false,
	        	        	    	   width: 350,
	        	        	    	   store: 'SystemTypeStore',
	        	        	    	   listeners:{
	        	        	    		   afterrender:function(v){
	        	        	    			   var defaultValue=SourceSysType;
	        	        	    			   v.setValue(defaultValue+'');
	        	        	    		   }
	        	        	    	   }
	        	        	       },
	        	        	       {
	        	        	    	   xtype: 'panel',
	        	        	    	   height: 25,
	        	        	    	   border:false,	
	        	        	    	   layout: {  
	        	        	    		   type: 'hbox',  
	        	        	    		   align: 'middle'
	        	        	    	   },
	        	        	    	   items : [
	        	        	    	            {   
	        	        	    	            	xtype: 'slider',
	        	        	    	            	id:'cpuSlider',
	        	        	    	            	fieldLabel:local.emergency.numberCPU,
	        	        	    	            	labelCls:"label_icon label_icon_cpu",
	        	        	    	            	width: 350,
	        	        	    	            	labelWidth:130,
	        	        	    	            	increment: 1,
	        	        	    	            	minValue: 1,
	        	        	    	            	value:1,
	        	        	    	            	tipText: function(thumb){
	        	        	    	            		return Ext.String.format('<b >{0}</b>',thumb.value);
	        	        	    	            	},
	        	        	    	            	listeners : {
	        	        	    	            		change : function(v,newValue, oldValue, eOpts){
	        	        	    	            			v.up('panel').down("numberfield").setValue(this.getValue());
	        	        	    	            		}
	        	        	    	            	}
	        	        	    	            } ,
	        	        	    	            {
	        	        	    	            	xtype:'numberfield',
	        	        	    	            	margin: '0 0 0 10',
	        	        	    	            	id:'valueCpuKernel',
	        	        	    	            	width: 95,
	        	        	    	            	value:1,
	        	        	    	            	minValue: 1,
	        	        	    	            	listeners:{
	        	        	    	            		change:function(v,newValue, oldValue, eOpts ){
	        	        	    	            			if(newValue>COMPUTENODEINFO.logicCpu){
	        	        	    	            				Ext.MessageBox.alert(local.window.tip,local.emergency.numberCPUMaximum+COMPUTENODEINFO.logicCpu+local.mark);
	        	        	    	            				newValue=COMPUTENODEINFO.logicCpu;
	        	        	    	            				v.setValue(newValue);
	        	        	    	            			}
	        	        	    	            			var cpuSlider=v.up('panel').down("slider");
	        	        	    	            			cpuSlider.setValue(newValue);
	        	        	    	            		}
	        	        	    	            	}

	        	        	    	            },  
	        	        	    	            {
	        	        	    	            	xtype:'displayfield',
	        	        	    	            	value:local.emergency.core,
	        	        	    	            	fieldStyle:{'padding-left':'5px'}
	        	        	    	            }
	        	        	    	            ]
	        	        	       },
	        	        	       {
	        	        	    	   xtype: 'panel',
	        	        	    	   height: 25,
	        	        	    	   border:false,
	        	        	    	   layout: {  
	        	        	    		   type: 'hbox',  
	        	        	    		   align: 'middle'
	        	        	    	   },
	        	        	    	   items : [
	        	        	    	            {   
	        	        	    	            	xtype: 'slider',
	        	        	    	            	fieldLabel:local.memory,
	        	        	    	            	labelCls:"label_icon label_icon_mem ",
	        	        	    	            	labelWidth:130,
	        	        	    	            	id:"memSlider",
	        	        	    	            	width: 350,
	        	        	    	            	minValue:1,
	        	        	    	            	value:512,
	        	        	    	            	useTips: true,
	        	        	    	            	tipText: function(thumb){
	        	        	    	            		return Ext.String.format('<b >{0}MB</b>',thumb.value);
	        	        	    	            	},
	        	        	    	            	listeners : {
	        	        	    	            		change : function(v,newValue, oldValue, eOpts){
	        	        	    	            			v.up('panel').down("numberfield").setValue(newValue);
	        	        	    	            		}
	        	        	    	            	}
	        	        	    	            } ,
	        	        	    	            {
	        	        	    	            	xtype:'numberfield',
	        	        	    	            	id:'memorySizeId',
	        	        	    	            	margin: '0 0 0 10',
	        	        	    	            	width: 95,
	        	        	    	            	value: 512,
	        	        	    	            	minValue: 1,
	        	        	    	            	listeners:{
	        	        	    	            		change:function(v,newValue, oldValue, eOpts ){
	        	        	    	            			if(newValue>COMPUTENODEINFO.memSize){
	        	        	    	            				Ext.MessageBox.alert(local.window.tip,local.emergency.memorMaximum+COMPUTENODEINFO.memSize+local.mark);
	        	        	    	            				newValue=COMPUTENODEINFO.memSize;
	        	        	    	            				v.setValue(newValue);
	        	        	    	            			}
	        	        	    	            			var memSlider=v.up('panel').down("slider");
	        	        	    	            			memSlider.setValue(newValue);
	        	        	    	            		}
	        	        	    	            	}
	        	        	    	            },  
	        	        	    	            {
	        	        	    	            	xtype:'displayfield',
	        	        	    	            	value:'MB',
	        	        	    	            	fieldStyle:{'padding-left':'5px'}
	        	        	    	            }
	        	        	    	            ]
	        	        	       }
	        	        	       ]
	        	        }
	        	        ]
	        },
	        {
	        	xtype: 'panel',
	        	layout: 'hbox',
	        	width:'100%',
	        	id:'virtualStorageId',
	        	height:200,
	        	bodyStyle:"border:0;border-bottom:1px solid #eee",
	        	items: [
	        	        {
	        	        	xtype: 'panel',
	        	        	width: 110,
	        	        	height:'100%',
	        	        	border:false,	
	        	        	padding:'0 0 0 10',
	        	        	style:'background:#fafbfc;',
	        	        	bodyStyle:'background:#fafbfc;',
	        	        	bodyCls:'vertical_text',
	        	        	html:local.storage
	        	        },
	        	        {
	        	        	xtype: 'panel',
	        	        	flex:1,
	        	        	border:false,
	        	        	height:"100%",
	        	        	layout:"vbox",
	        	        	//padding:"0 10 10 6",
	        	        	items:[
	        	        	       {
	        	        	    	   xtype: 'checkboxgroup',
	        	        	    	   id:'hardDiskAndVmdkId',
	        	        	    	   width: "100%",	        	        	    	         	        	    	   	        	        	    	   
	        	        	    	   flex:1,
	        	        	    	   overflowY:"auto",
	        	        	    	   border:false,
	        	        	    	   columns:1,
	        	        	    	   //padding:10,
	        	        	    	   defaults:{margin:"10 0 0 10"},
	        	        	    	   //bodyStyle:"overflow-y:auto;",
	        	        	    	   items: []
	        	        	       },
	        	        	       {
	        	        	    	   xtype: 'panel',
	        	        	    	   height: 25,
	        	        	    	   width: 160,
	        	        	    	   margin:10,
	        	        	    	   border:false,
	        	        	    	   html:'<a style="text-decoration:underline;cursor:pointer;color:#00aaaa" href="#" onclick="AddDeviceHardDisks();">+'+local.emergency.increaseStorage+'</a>'//TODO
	        	        	       }
	        	        	       ]
	        	        }
	        	        ]
	        },{
	        	xtype: 'panel',
	        	layout: 'hbox',
	        	width:'100%',
	        	id:'virtualNetWorkId',
	        	hidden:false, 
	        	bodyStyle:"border:0;border-bottom:1px solid #eee",
	        	items: [
	        	        {
	        	        	xtype: 'panel',
	        	        	width: 110,
	        	        	height:'100%',
	        	        	border:false,	
	        	        	padding:'0 0 0 10',
	        	        	style:'background:#fafbfc;',
	        	        	bodyStyle:'background:#fafbfc;',
	        	        	bodyCls:'vertical_text',
	        	        	html:local.web
	        	        },
	        	        {
	        	        	xtype: 'panel',
	        	        	flex:1,
	        	        	border:false,
	        	        	padding:"0 0 20 0",
	        	        	defaults: {
	        	        		border:false,
	        	        		margin: '10 0 0 10'
	        	        	},
	        	        	items:[
	        	        	       {
	        	        	    	   xtype: 'panel',
	        	        	    	   disable:true,
	        	        	    	   id:'netWordConfigId',
	        	        	    	   width: 550,
	        	        	    	   columns: 1,
	        	        	    	   items: []
	        	        	       }
	        	        	       ]
	        	        }],
	        	        listeners:{
	        	        	afterrender:function(){
	        	        		//集群演练模式隐藏网卡面板
	        	        		if(EMERGENCYTYPE%2 == 1){
	        	        			//Ext.getCmp(this.id).show();
	        	        		}else{
	        	        			Ext.getCmp(this.id).setHeight(0);
	        	        		}
	        	        	}
	        	        }
	        },{
	        	xtype:"panel",
	        	layout: 'hbox',
	        	width:'100%',
	        	height:100,
	        	border:false,
	        	bodyStyle:"border:0;",
	        	items:[	{
	        		xtype: 'panel',
	        		width: 110,
	        		height:'100%',
	        		border:false,	
	        		padding:'0 0 0 10',
	        		style:'background:#fafbfc;',
	        		bodyStyle:'background:#fafbfc;',
	        		bodyCls:'vertical_text',
	        		html:local.emergency.granule
	        	},
	        	{

	        		xtype: 'panel',
    	        	flex:1,
    	        	border:false,
    	        	height:"100%",
    	        	layout:"vbox",
	        		items:[
	        		       {
	        		    	   xtype: 'checkbox',
	        		    	   margin: '10 0 0 10',
	        		    	   width: "100%",
	        		    	   text:local.emergency.granuleOpen,
	        		    	   flex:1,
	        		    	   id:'particleSwitch',  //小颗粒开关,是否启动小颗粒
	        		    	   value:false,  //默认不开启小颗粒
	        		    	   overflowY:"auto",
	        		    	   border:false,
	        		    	   columns:1,
	        		    	   defaults:{margin:"10 0 0 10"},
	        		    	   listeners:{
	        		    		   change:function(v,newValue, oldValue, eOpts ){

	        		    			   if(newValue){
	        		    				   Ext.getCmp("dataPointSliderId").setDisabled(false);
	        		    			       //Ext.getCmp("dataPointTextId").setDisabled(false);
	        		    			   }else{
	        		    				   Ext.getCmp("dataPointSliderId").setDisabled(true);
	        		    				  // Ext.getCmp("dataPointTextId").setDisabled(true);
	        		    			   }
	        		    		   },
	        		    		   afterrender:function(v){
	        		    			   if(v.getValue()){
	        		    				   Ext.getCmp("dataPointSliderId").setDisabled(false);
	        		    				   //Ext.getCmp("dataPointTextId").setDisabled(false);
	        		    			   }else{
	        		    				   Ext.getCmp("dataPointSliderId").setDisabled(true);
	        		    				  // Ext.getCmp("dataPointTextId").setDisabled(true);
	        		    			   }
	        		    		   }
	        		    	   }

	        		       },{   
	        		    	   xtype: 'slider',
	        		    	   margin: '10 0 0 10',
	        		    	   fieldLabel:local.emergency.granuleStorage,
	        		    	   //labelCls:"label_icon label_icon_cpu",
	        		    	   labelWidth:130,
	        		    	   id:'dataPointSliderId',
	        		    	   width: 450,
	        		    	   increment: 1,
	        		    	   minValue: 1,
	        		    	   maxValue:100,
	        		    	   value:1,
	        		    	   maxModifyTime:'',
	        		    	   minModifyTime:'',
	        		    	   dataPointValue:'',
	        		    	   plugins: new Ext.slider.Tip({  
	        		    	        getText: function (thumb) { 
	        		    	        	console.log(thumb.value);
	        		    	        	var tempTime=DATAPOINTTIME*thumb.value;
	        		    	        	var date = new Date(tempTime+minModifyTime.time);
	        		    	        	return  local.emergency.granuleTime+date.toLocaleString();
	        		    	        }  
	        		    	    }),  
	        		    	   listeners : {
	        		    		   change:function(v,newValue, oldValue, eOpts ){
	        		    	        	var tempTime=DATAPOINTTIME*newValue;
	        		    	        	var date = new Date(tempTime+minModifyTime.time);
	        		    	        	//v.setValue(date.toString());
	        		    	        	v.dataPointValue=date;
	        		    	        	//console.log(dataPointValue);
  	        		    	        	Ext.getCmp("dataPointTextId").setValue(date.toLocaleString());
	        		    	        	
	        		    		   },afterrender:function(v){
		    		        		   Ext.Ajax.request({
		        	    				   url:'/emergency/tovmManager!getDataPointVmdkInfo.action',
		        	    				   params : {
		        	    						'diskCloneId' : DISKCLONEID,
		        	    						'setId':SNAPSETID
		        	    					},
		        	    				   success: function(resp,opts) {
		        	    					   var result=Ext.decode(resp.responseText);
		        	    					   if(result.success==1){
		        	    						   maxModifyTime=result.maxModifyTime;
		        	    						   minModifyTime=result.minModifyTime; 
		        	    						   //每拉一次，间隔1秒钟
		        	    						   v.setMaxValue(parseInt((maxModifyTime.time-minModifyTime.time)/DATAPOINTTIME));
		        	    						   
		        	    						   //设置默认的小颗粒时间
                                                   var defaultTime = new Date(minModifyTime.time);
                                                   v.dataPointValue=defaultTime;
                                                   var defaultPartDate = format(defaultTime, 'yyyy-MM-dd HH:mm:ss');
                                                   Ext.getCmp("dataPointTextId").setValue(defaultPartDate);
		        	    					   };
		        	    				   },
		        	    				   failure: function(resp,opts) {
		        	    				   }
		        	    			   });
		    		        	   }
	        		    	   }
	        		       } ,
	        		       {
	        		    	   xtype:'textfield',
	        		    	   margin: '10 0 10 10',
	        		    	   fieldLabel:local.emergency.granuleTime,
	        		    	   id:'dataPointTextId',
	        		    	   labelWidth:130,
	        		    	   width: 350,
	        		    	   disabled:true,
							   //regex:/^([0-9]{4})-([0-9]{2})-([0-9]{2})\s([0-9]{2}):([0-9]{2}):([0-9]{2})$/,
							   //regexText:'时间格式格式错误!',
	        		    	   listeners:{
	        		    		   change:function(v,newValue, oldValue, eOpts ){
	        		    			     //Ext.getCmp("dataPointSliderId").setValue(newValue);
	        		    		   }
	        		    	   }
	        		       }]
	        	}
	        	],listeners:{
		        	   afterrender:function(v){
		        		   Ext.Ajax.request({
    	    				   url:'/emergency/tovmManager!checkDeviceHasBeenDataPoint.action',
    	    				   params : {
    	    						'diskCloneId' : DISKCLONEID
    	    					},
    	    				   success: function(resp,opts) {
    	    					   var result=Ext.decode(resp.responseText);
    	    					   //TODO 
    	    					   if(result.isOrNo=="yes"){
    	    						   v.show();
    	    					   }else{
    	    						   v.hide();
    	    					   };
    	    				   },
    	    				   failure: function(resp,opts) {
    	    				   }
    	    			   });
		        	   }
		           }

	        }
	        ,{
                xtype: 'panel',
                layout: 'hbox',
                width:'100%',
                id:'virtualNetWorkPanel',
                hidden:true, 
                bodyStyle:"border:0;border-bottom:1px solid #eee",
                items: [
                        {
                            xtype: 'panel',
                            width: 110,
                            height:'100%',
                            border:false,   
                            padding:'0 0 0 10',
                            style:'background:#fafbfc;',
                            bodyStyle:'background:#fafbfc;',
                            bodyCls:'vertical_text',
                            html:local.web
                        },
                        {
                            xtype: 'panel',
                            flex:1,
                            border:false,
                            padding:"0 0 20 0",
                            defaults: {
                                border:false,
                                margin: '10 0 0 10'
                            },
                            items:[
                                   {
                                       xtype: 'panel',
                                       disable:true,
                                       id:'vmSubNet',
                                       width: 550,
                                       columns: 1,
                                       items: [{
                                               xtype: 'checkbox',
                                               boxLabel:'是否启用虚拟子网',
                                               border:false,
                                               columns:1,
                                               listeners:{
                                                   change:function(v,newValue, oldValue, eOpts ){
                                                       	   var vmNetComponent = v.nextSibling();
                                                       	   vmNetComponent.setReadOnly(!newValue);
                                                       }} 
                                            },{
                                               xtype: 'combobox',
                                               readOnly: true,  //默认未启用虚拟子网，列表设为只读
                                               displayField: 'computeVirtualNicName',
                                               valueField: 'computeVirtualNicId',
                                               fieldLabel: '虚拟子网',
                                               labelWidth:130,
                                               id: 'vmNet',
                                               width: 350,
                                               store:Ext.create('Ext.data.ArrayStore',{
                                                fields:[
                                                   {name: 'computeVirtualNicId'},//值
                                                   {name: 'computeVirtualNicName'},
                                                   {name: 'tip'}
                                                ]}
                                               ),
                                               listConfig: {
                                                 tpl: ['<table width="100%"><tpl for=".">', '<tr data-qtip="{tip}">', '<td role="option" class="x-boundlist-item">{computeVirtualNicName}</td>', '</tr>', '</tpl></table>']
                                               },
                                               queryMode:'local',
                                               editable : false
                                           }]
                                   }
                                   ]
                        }],
                        listeners:{
                            afterrender:function(v){
                                //集群演练模式显示
                                if(EMERGENCYTYPE == 2){
                                	v.show();
                                }
                            }
                        }
            }]
});


/**
 * 加载计算节点虚拟子网列表 
 */
function loadVmSubList(computeNodeId){
	       Ext.Ajax.request({
                   url:'/emergency/tocomputeNodesNic!getComputeNodesVirtualNicByNodeId.action',
                   params : {nodeId : computeNodeId},
                   success: function(resp,opts) {
                       var datas=Ext.decode(resp.responseText).detail;
                       Ext.getCmp("vmNet").getStore().loadData(datas);
                   }
               });
}


/**
 * @description：接管模式
 * @data 2016-4-7
 * @auth WangShaoDong
 */
Ext.define("acesure.emergency.view.EmergencyTakeOver",{
	extend:"Ext.form.Panel",
	alias:"widget.emergencyTakeOver",
	width:'100%',
	border:false,		
	layout:'vbox',
	items: [
	        {
	        	xtype: 'panel',
	        	width:'100%',
	        	layout: 'hbox',
	        	bodyStyle:"border:0;border-bottom:1px solid #eee",
	        	items: [
	        	        {
	        	        	xtype: 'panel',
	        	        	width: 110,
	        	        	height:'100%',
	        	        	border:false,	
	        	        	padding:'0 0 0 10',
	        	        	style:'background:#fafbfc;',
	        	        	bodyStyle:'background:#fafbfc;',
	        	        	bodyCls:'vertical_text',
	        	        	html:local.emergency.basicCon
	        	        },
	        	        {
	        	        	xtype: 'panel',
	        	        	flex:1,
	        	        	border:false,
	        	        	padding:10,
	        	        	items:[
									{
											xtype:"panel",
											id:'deviceEmergencyAuthorizationPanel',
											border:false,
											layout:"hbox",
											height:40,
											margin:10,
											bodyStyle:'background:#fff4d2;',
											listeners:{
												afterrender:function(v){
													//判断是否需要授权
													initDeviceEmergencyAuthorizationPanel();
												}
											},
											items:[
														{
														    fieldLabel : local.emergency.needAuth,
														    xtype:'panel',
														    id:'emergencyAuthorizationTextArea',
													   		padding:'10 0 0 0',
													   		bodyStyle:'padding-left:20px;background:#fff4d2;',
														    height:40,
														    width:250,
														    value:'testmsg',
														    border:false
														},
														{
														    xtype:"button",
														    icon:'/images/common/icon_auth.png',
														    style:"margin-left:1px;padding-left:17px",
														    texrAlign:"center",
														    margin:'5 0 0 20',
														    width:100,
														    height:30,
														    cls:"ip_add_btn",
														    html:local.emergency.needAuth,
														    handler:function(){
														    	var takeOver = 0;
														    	var emulation = 0;
														    	if(EMERGENCYTYPE == 1){
														    		takeOver = 1;
														    	}else{
														    		emulation = 1;
														    	}
														    	Ext.Ajax.request({
																	url:'/emergency/tovmManager!addDeviceEmergencyLicense.action',
																	params:{
																		"deviceId":SourceDeviceId,
																		"takeover":takeOver,
																		"emulation":emulation
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
																		}else{
																			Ext.Msg.alert(local.window.tip,local.emergency.authSuccess);
																			Ext.getCmp("virtualMachWindowAddButton").setDisabled(false);
																			Ext.getCmp("deviceEmergencyAuthorizationPanel").hide();
																			}
																		}
														    		});
														    	}
															}
														]
									},
	        	        	       {
	        	        	    	   xtype: 'textfield',
	        	        	    	   fieldLabel:local.emergency.hostName,
	        	        	    	   width: 350,
	        	        	    	   labelWidth:130,
	        	        	    	   labelCls:"label_icon label_icon_type ",
	        	        	    	   id:'vmName',
	        	        	    	   maxLength:30,
	        	        	    	   enforceMaxLength:true,
	        	        	    	   allowBlank: false,
	        	        	    	   blankText:local.emergency.hostNameNullMess,
	        	        	    	   vtype :'alphanum',  
	        	        	    	   vtypeText : local.emergency.hostNameFormatMess,
	        	        	    	   listeners : {
	        	        	    		   afterrender:function(){
	        	        	    			   Ext.Ajax.request({
	        	        	    				   url:'/emergency/tovmManager!getMaxVmManagetId.action',
	        	        	    				   success: function(resp,opts) {
	        	        	    					   Ext.getCmp("vmName").setValue('Server_'+resp.responseText);
	        	        	    					   SERVER_NAME = 'Server_'+resp.responseText;
	        	        	    				   },
	        	        	    				   failure: function(resp,opts) {
	        	        	    				   }
	        	        	    			   });
	        	        	    		   }/*,
	        	        	    		   blur:function( v, The, eOpts ){
	        	        	    			   if(!v.isValid() ){
	        	        	    				   Ext.MessageBox.alert(local.window.tip,"虚拟机名称超过最大长度");
	        	        	    			   }   
	        	        	    		   }*/
	        	        	    	   }
	        	        	       },
	        	        	       {
	        	        	    	   xtype: 'combobox',
	        	        	    	   displayField: 'name',
	        	        	    	   valueField: 'id',
	        	        	    	   fieldLabel: local.emergency.nodeCount,
	        	        	    	   labelWidth:130,
	        	        	    	   labelCls:"label_icon label_icon_cal ",
	        	        	    	   id: 'computeNoteId',
	        	        	    	   queryMode:'local',
	        	        	    	   width: 350,
	        	        	    	   blankText :local.emergency.pleaseSelect,
	        	        	    	   forceSelection : true,
	        	        	    	   editable : false,
	        	        	    	   store:'CalculateNodesStore',
	        	        	    	   listeners:{
	        	        	    		   afterrender:function(v){
	        	        	    			   this.store.load({params:{
	        	        	    				   "setId":SNAPSETID
	        	        	    			   },callback:function(records, options, success){
	        	        	    				   if(records.length!=0){
	        	        	    					   var firstValue=records[0].data.id;
	        	        	    					   CALCULATENODE=firstValue; 
	        	        	    					   COMPUTENODEINFO=records[0].data;
	        	        	    					   v.setValue(firstValue);

	        	        	    					   var cpuSlider=Ext.getCmp("cpuSlider");
	        	        	    					   cpuSlider.setMaxValue(COMPUTENODEINFO.logicCpu);
	        	        	    					   var memSlider=Ext.getCmp("memSlider");
	        	        	    					   memSlider.setMaxValue(COMPUTENODEINFO.memSize);
	        	        	    					   
	        	        	    					   listAllDeviceNic();
	        	        	    				   }else{
	        	        	    					   Ext.MessageBox.alert(local.window.tip,local.emergency.noCalnode);
	        	        	    					   return false;
	        	        	    				   }
	        	        	    			   }});

	        	        	    		   },
	        	        	    		   expand:function(v,eOpts ){
	        	        	    			   this.store.load({params:{
	        	        	    				   "setId":SNAPSETID
	        	        	    			   }});
	        	        	    		   },
	        	        	    		   select:function(combo, records, eOpts){	        	       
	        	        	    			   var calNodeId=Ext.getCmp("computeNoteId").getValue();

	        	        	    			   CALCULATENODE=calNodeId;
	        	        	    			   COMPUTENODEINFO=records[0].data;

	        	        	    			   //每次重选计算节点重新加载网卡数据
	        	        	    			   var netWordConfig=Ext.getCmp("netWordConfigId");
	        	        	    			   netWordConfig.removeAll();
	        	        	    			   switchComputeNodesUpdateNic();


	        	        	    			   //设置最大Cpu和内存
	        	        	    			   var cpuSlider=Ext.getCmp("cpuSlider");
	        	        	    			   cpuSlider.setMaxValue(COMPUTENODEINFO.logicCpu);
	        	        	    			   var memSlider=Ext.getCmp("memSlider");
	        	        	    			   memSlider.setMaxValue(COMPUTENODEINFO.memSize);
	        	        	    		   }
	        	        	    	   }
	        	        	       },
	        	        	       {
	        	        	    	   xtype: 'combobox',
	        	        	    	   displayField: 'systemName',
	        	        	    	   valueField: 'value',
	        	        	    	   fieldLabel: local.emergency.operatingSystem,
	        	        	    	   labelWidth:130,
	        	        	    	   labelCls:"label_icon label_icon_sys ",
	        	        	    	   queryMode: 'local',
	        	        	    	   id: 'systemTypeId',
	        	        	    	   editable:false,
	        	        	    	   width: 350,
	        	        	    	   store: 'SystemTypeStore',
	        	        	    	   listeners:{
	        	        	    		   afterrender:function(v){
	        	        	    			   var defaultValue=SourceSysType;
	        	        	    			   v.setValue(defaultValue+'');
	        	        	    		   }
	        	        	    	   }
	        	        	       },
	        	        	       {
	        	        	    	   xtype: 'panel',
	        	        	    	   height: 25,
	        	        	    	   border:false,	
	        	        	    	   layout: {  
	        	        	    		   type: 'hbox',  
	        	        	    		   align: 'middle'
	        	        	    	   },
	        	        	    	   items : [
	        	        	    	            {   
	        	        	    	            	xtype: 'slider',
	        	        	    	            	id:'cpuSlider',
	        	        	    	            	fieldLabel:local.emergency.numberCPU,
	        	        	    	            	labelCls:"label_icon label_icon_cpu",
	        	        	    	            	width: 350,
	        	        	    	            	labelWidth:130,
	        	        	    	            	increment: 1,
	        	        	    	            	minValue: 1,
	        	        	    	            	value:1,
	        	        	    	            	tipText: function(thumb){
	        	        	    	            		return Ext.String.format('<b >{0}</b>',thumb.value);
	        	        	    	            	},
	        	        	    	            	listeners : {
	        	        	    	            		change : function(v,newValue, oldValue, eOpts){
	        	        	    	            			v.up('panel').down("numberfield").setValue(this.getValue());
	        	        	    	            		}
	        	        	    	            	}
	        	        	    	            } ,
	        	        	    	            {
	        	        	    	            	xtype:'numberfield',
	        	        	    	            	margin: '0 0 0 10',
	        	        	    	            	id:'valueCpuKernel',
	        	        	    	            	width: 95,
	        	        	    	            	value:1,
	        	        	    	            	minValue: 1,
	        	        	    	            	listeners:{
	        	        	    	            		change:function(v,newValue, oldValue, eOpts ){
	        	        	    	            			if(newValue>COMPUTENODEINFO.logicCpu){
	        	        	    	            				Ext.MessageBox.alert(local.window.tip,local.emergency.numberCPUMaximum+COMPUTENODEINFO.logicCpu+local.mark);
	        	        	    	            				newValue=COMPUTENODEINFO.logicCpu;
	        	        	    	            				v.setValue(newValue);
	        	        	    	            			}
	        	        	    	            			var cpuSlider=v.up('panel').down("slider");
	        	        	    	            			cpuSlider.setValue(newValue);
	        	        	    	            		}
	        	        	    	            	}

	        	        	    	            },  
	        	        	    	            {
	        	        	    	            	xtype:'displayfield',
	        	        	    	            	value:local.emergency.core,
	        	        	    	            	fieldStyle:{'padding-left':'5px'}
	        	        	    	            }
	        	        	    	            ]
	        	        	       },
	        	        	       {
	        	        	    	   xtype: 'panel',
	        	        	    	   height: 25,
	        	        	    	   border:false,
	        	        	    	   layout: {  
	        	        	    		   type: 'hbox',  
	        	        	    		   align: 'middle'
	        	        	    	   },
	        	        	    	   items : [
	        	        	    	            {   
	        	        	    	            	xtype: 'slider',
	        	        	    	            	fieldLabel:local.memory,
	        	        	    	            	labelCls:"label_icon label_icon_mem ",
	        	        	    	            	labelWidth:130,
	        	        	    	            	id:"memSlider",
	        	        	    	            	width: 350,
	        	        	    	            	minValue:1,
	        	        	    	            	value:512,
	        	        	    	            	useTips: true,
	        	        	    	            	tipText: function(thumb){
	        	        	    	            		return Ext.String.format('<b >{0}MB</b>',thumb.value);
	        	        	    	            	},
	        	        	    	            	listeners : {
	        	        	    	            		change : function(v,newValue, oldValue, eOpts){
	        	        	    	            			v.up('panel').down("numberfield").setValue(newValue);
	        	        	    	            		}
	        	        	    	            	}
	        	        	    	            } ,
	        	        	    	            {
	        	        	    	            	xtype:'numberfield',
	        	        	    	            	id:'memorySizeId',
	        	        	    	            	margin: '0 0 0 10',
	        	        	    	            	width: 95,
	        	        	    	            	value: 512,
	        	        	    	            	minValue: 1,
	        	        	    	            	listeners:{
	        	        	    	            		change:function(v,newValue, oldValue, eOpts ){
	        	        	    	            			if(newValue>COMPUTENODEINFO.memSize){
	        	        	    	            				Ext.MessageBox.alert(local.window.tip,local.emergency.memorMaximum+COMPUTENODEINFO.memSize+local.mark);
	        	        	    	            				newValue=COMPUTENODEINFO.memSize;
	        	        	    	            				v.setValue(newValue);
	        	        	    	            			}
	        	        	    	            			var memSlider=v.up('panel').down("slider");
	        	        	    	            			memSlider.setValue(newValue);
	        	        	    	            		}
	        	        	    	            	}
	        	        	    	            },  
	        	        	    	            {
	        	        	    	            	xtype:'displayfield',
	        	        	    	            	value:'MB',
	        	        	    	            	fieldStyle:{'padding-left':'5px'}
	        	        	    	            }
	        	        	    	            ]
	        	        	       }
	        	        	       ]
	        	        }
	        	        ]
	        },
	        {
	        	xtype: 'panel',
	        	layout: 'hbox',
	        	width:'100%',
	        	id:'virtualStorageId',
	        	height:200,
	        	bodyStyle:"border:0;border-bottom:1px solid #eee",
	        	items: [
	        	        {
	        	        	xtype: 'panel',
	        	        	width: 110,
	        	        	height:'100%',
	        	        	border:false,	
	        	        	padding:'0 0 0 10',
	        	        	style:'background:#fafbfc;',
	        	        	bodyStyle:'background:#fafbfc;',
	        	        	bodyCls:'vertical_text',
	        	        	html:local.storage
	        	        },
	        	        {
	        	        	xtype: 'panel',
	        	        	flex:1,
	        	        	border:false,
	        	        	height:"100%",
	        	        	layout:"vbox",
	        	        	//padding:"0 10 10 6",
	        	        	items:[
	        	        	       {
	        	        	    	   xtype: 'checkboxgroup',
	        	        	    	   id:'hardDiskAndVmdkId',
	        	        	    	   width: "100%",	        	        	    	         	        	    	   	        	        	    	   
	        	        	    	   flex:1,
	        	        	    	   overflowY:"auto",
	        	        	    	   border:false,
	        	        	    	   columns:1,
	        	        	    	   //padding:10,
	        	        	    	   defaults:{margin:"10 0 0 10"},
	        	        	    	   //bodyStyle:"overflow-y:auto;",
	        	        	    	   items: [
	        	        	    	           ],
	        	        	    	           listeners:{
	        	        	    	        	   afterrender:listDeviceAllHardDisks
	        	        	    	           }
	        	        	       },
	        	        	       {
	        	        	    	   xtype: 'panel',
	        	        	    	   height: 25,
	        	        	    	   width: 160,
	        	        	    	   margin:10,
	        	        	    	   border:false,
	        	        	    	   html:'<a style="text-decoration:underline;cursor:pointer;color:#00aaaa" href="#" onclick="AddDeviceHardDisks();">+'+local.emergency.increaseStorage+'</a>'//TODO
	        	        	       }
	        	        	       ]
	        	        }
	        	        ]
	        },{
	        	xtype: 'panel',
	        	layout: 'hbox',
	        	width:'100%',
	        	id:'virtualNetWorkId',
	        	hidden:true, 
	        	bodyStyle:"border:0;border-bottom:1px solid #eee",
	        	items: [
	        	        {
	        	        	xtype: 'panel',
	        	        	width: 110,
	        	        	height:'100%',
	        	        	border:false,	
	        	        	padding:'0 0 0 10',
	        	        	style:'background:#fafbfc;',
	        	        	bodyStyle:'background:#fafbfc;',
	        	        	bodyCls:'vertical_text',
	        	        	html:local.web
	        	        },
	        	        {
	        	        	xtype: 'panel',
	        	        	flex:1,
	        	        	border:false,
	        	        	padding:"0 0 20 0",
	        	        	defaults: {
	        	        		border:false,
	        	        		margin: '10 0 0 10'
	        	        	},
	        	        	items:[
	        	        	       {
	        	        	    	   xtype: 'panel',
	        	        	    	   id:'netWordConfigId',
	        	        	    	   width: 550,
	        	        	    	   columns: 1,
	        	        	    	   items: [
	        	        	    	           ],
	        	        	  /*  	           listeners:{
	        	        	    	        	   afterrender:listAllDeviceNic
	        	        	    	           }*/
	        	        	       }/*,
	        	        	       {
	        	        	    	   xtype: 'panel',
	        	        	    	   height: 25,
	        	        	    	   width: 110,
	        	        	    	   border:false,
	        	        	    	   html:'<a href="#" onclick="AddNetWorkCards();" style="text-decoration:underline;cursor:pointer;">+增加网卡</a> '//TODO
	        	        	       }*/
	        	        	       ]
	        	        }
	        	        ],
	        	        listeners:{
	        	        	afterrender:function(){
	        	        		//接管模式显示，演练模式不显示
	        	        		if(EMERGENCYTYPE==1){
	        	        			Ext.getCmp(this.id).show();
	        	        		}else{
	        	        			Ext.getCmp(this.id).hide();
	        	        		}
	        	        	}
	        	        }
	        },{
	        	xtype:"panel",
	        	layout: 'hbox',
	        	width:'100%',
	        	height:100,
	        	border:false,
	        	bodyStyle:"border:0;",
	        	items:[	{
	        		xtype: 'panel',
	        		width: 110,
	        		height:'100%',
	        		border:false,	
	        		padding:'0 0 0 10',
	        		style:'background:#fafbfc;',
	        		bodyStyle:'background:#fafbfc;',
	        		bodyCls:'vertical_text',
	        		html:local.emergency.granule
	        	},
	        	{

	        		xtype: 'panel',
    	        	flex:1,
    	        	border:false,
    	        	height:"100%",
    	        	layout:"vbox",
	        		items:[
	        		       {
	        		    	   xtype: 'checkbox',
	        		    	   margin: '10 0 0 10',
	        		    	   width: "100%",
	        		    	   boxLabel:'开启',
	        		    	   flex:1,
	        		    	   id:'particleSwitch',  //小颗粒开关,是否启动小颗粒
	        		    	   value:false,  //默认不开启小颗粒
	        		    	   overflowY:"auto",
	        		    	   border:false,
	        		    	   columns:1,
	        		    	   defaults:{margin:"10 0 0 10"},
	        		    	   listeners:{
	        		    		   change:function(v,newValue, oldValue, eOpts ){

	        		    			   if(newValue){
	        		    				   Ext.getCmp("dataPointSliderId").show();
	        		    				   Ext.getCmp("dataPointTextId").show();
	        		    			   }else{
	        		    				   Ext.getCmp("dataPointSliderId").hide();
	        		    				   Ext.getCmp("dataPointTextId").hide();
	        		    			   }
	        		    		   },
	        		    		   afterrender:function(v){
	        		    			   if(v.getValue()){
	        		    				   Ext.getCmp("dataPointSliderId").show();
	        		    				   Ext.getCmp("dataPointTextId").show();
	        		    			   }else{
	        		    				   Ext.getCmp("dataPointSliderId").hide();
	        		    				   Ext.getCmp("dataPointTextId").hide();
	        		    			   }
	        		    		   }
	        		    	   }

	        		       },{   
	        		    	   xtype: 'slider',
	        		    	   hidden: true,  //默认隐藏
	        		    	   margin: '10 0 0 10',
	        		    	   fieldLabel:local.emergency.granuleStorage,
	        		    	   //labelCls:"label_icon label_icon_cpu",
	        		    	   labelWidth:130,
	        		    	   id:'dataPointSliderId',
	        		    	   width: 450,
	        		    	   increment: 1,
	        		    	   minValue: 1,
	        		    	   maxValue:100,
	        		    	   value:1,
	        		    	   maxModifyTime:'',
	        		    	   minModifyTime:'',
	        		    	   dataPointValue:'',
	        		    	   tipText: function(thumb){
                                        var tempTime=DATAPOINTTIME*thumb.value;
                                        var date = new Date(tempTime+minModifyTime.time);
                                        var dateStr = format(date, 'yyyy-MM-dd HH:mm:ss');
                                        return local.emergency.granuleTime+dateStr;
                               },
	        		    	   /*plugins: new Ext.slider.Tip({  
	        		    	        getText: function (thumb) { 
	        		    	        	//console.log(thumb.value);
	        		    	        	var tempTime=DATAPOINTTIME*thumb.value;
	        		    	        	var date = new Date(tempTime+minModifyTime.time);
	        		    	        	var dateStr = format(date, 'yyyy-MM-dd HH:mm:ss');
	        		    	        	return  "颗粒时间: "+dateStr;
	        		    	        }  
	        		    	    }), */ 
	        		    	   listeners : {
	        		    		   change:function(v,newValue, oldValue, eOpts ){
	        		    	        	var tempTime=DATAPOINTTIME*newValue;
	        		    	        	var date = new Date(tempTime+minModifyTime.time);
	        		    	        	var dateStr = format(date, 'yyyy-MM-dd HH:mm:ss');
	        		    	        	v.dataPointValue=date;
  	        		    	        	Ext.getCmp("dataPointTextId").setValue(dateStr);
	        		    	        	
	        		    		   },afterrender:function(v){
		    		        		   Ext.Ajax.request({
		        	    				   url:'/emergency/tovmManager!getDataPointVmdkInfo.action',
		        	    				   params : {
		        	    						'diskCloneId' : DISKCLONEID,
		        	    						'setId':SNAPSETID
		        	    					},
		        	    				   success: function(resp,opts) {
		        	    					   var result=Ext.decode(resp.responseText);
		        	    					   if(result.success==1){
		        	    						   maxModifyTime=result.maxModifyTime;
		        	    						   minModifyTime=result.minModifyTime; 
		        	    						   //每拉一次，间隔1秒钟
		        	    						   v.setMaxValue(parseInt((maxModifyTime.time-minModifyTime.time)/DATAPOINTTIME));
		        	    						   //设置默认的小颗粒时间
                                                   var defaultTime = new Date(minModifyTime.time);
                                                   v.dataPointValue=defaultTime;
                                                   var defaultPartDate = format(defaultTime, 'yyyy-MM-dd HH:mm:ss');
                                                   Ext.getCmp("dataPointTextId").setValue(defaultPartDate);
		        	    					   };
		        	    				   },
		        	    				   failure: function(resp,opts) {
		        	    				   }
		        	    			   });
		    		        	   }
	        		    	   }
	        		       } ,
	        		       {
	        		    	   xtype:'textfield',
	        		    	   hidden: true,  //默认隐藏
	        		    	   margin: '10 0 10 10',
	        		    	   fieldLabel:local.emergency.granuleTime,
	        		    	   id:'dataPointTextId',
	        		    	   labelWidth:130,
	        		    	   width: 350,
	        		    	   readOnly :true,
	        		    	   //disabled:true,
							   //regex:/^([0-9]{4})-([0-9]{2})-([0-9]{2})\s([0-9]{2}):([0-9]{2}):([0-9]{2})$/,
							   //regexText:'时间格式格式错误!',
	        		    	   listeners:{
	        		    		   change:function(v,newValue, oldValue, eOpts ){
	        		    			     //Ext.getCmp("dataPointSliderId").setValue(time);
	        		    		   }
	        		    	   }
	        		       }]
	        	}
	        	],listeners:{
		        	   afterrender:function(v){
		        		   Ext.Ajax.request({
    	    				   url:'/emergency/tovmManager!checkDeviceHasBeenDataPoint.action',
    	    				   params : {
    	    						'diskCloneId' : DISKCLONEID
    	    					},
    	    				   success: function(resp,opts) {
    	    					   var result=Ext.decode(resp.responseText);
    	    					   //TODO 
    	    					   if(result.isOrNo=="yes"){
    	    						   v.show();
    	    					   }else{
    	    						   v.hide();
    	    					   };
    	    				   },
    	    				   failure: function(resp,opts) {
    	    				   }
    	    			   });
		        	   }
		           }

	        }
	        ]
});


/**
 * @description 虚拟机模板设置
 * @data 2016-4-7
 * @auth WangShaoDong
 */
Ext.define("acesure.emergency.view.EmergencyFastConfig",{
	extend:"Ext.form.Panel",
	alias:"widget.emergencyFastConfig",
	width:'100%',
	border:false,		
	layout:'vbox',
	items: [
	        {
	        	xtype: 'panel',
	        	width:'100%',
	        	layout: 'hbox',
	        	bodyStyle:"border:0;border-bottom:1px solid #eee",
	        	items: [
	        	        {
	        	        	xtype: 'panel',
	        	        	width: 110,
	        	        	height:'100%',
	        	        	border:false,	
	        	        	padding:'0 0 0 10',
	        	        	style:'background:#fafbfc;',
	        	        	bodyStyle:'background:#fafbfc;',
	        	        	bodyCls:'vertical_text',
	        	        	html:local.emergency.basicCon
	        	        },
	        	        {
	        	        	xtype: 'panel',
	        	        	flex:1,
	        	        	border:false,
	        	        	padding:20,
	        	        	items:[
	        	        	       {
	        	        	    	   xtype: 'combobox',
	        	        	    	   displayField: 'name',
	        	        	    	   valueField: 'id',
	        	        	    	   fieldLabel: local.emergency.nodeCount,
	        	        	    	   labelWidth:130,
	        	        	    	   labelCls:"label_icon label_icon_cal ",
	        	        	    	   id: 'computeNoteId',
	        	        	    	   queryMode:'local',
	        	        	    	   width: 350,
	        	        	    	   blankText :local.emergency.pleaseSelect,
	        	        	    	   forceSelection : true,
	        	        	    	   editable : false,
	        	        	    	   store:'CalculateNodesStore',
	        	        	    	   listeners:{
	        	        	    		   afterrender:function(v){
	        	        	    			   this.store.load({params:{
	        	        	    				   "deviceId":SourceDeviceId
	        	        	    			   },callback:function(records, options, success){
	        	        	    				   if(records.length!=0){
	        	        	    					   if(MODELINFO==null){
	        	        	    						   var firstValue=records[0].data.id;
	        	        	    						   v.setValue(firstValue);
	        	        	    						   CALCULATENODE=firstValue;
	        	        	    						   COMPUTENODEINFO=records[0].data;
	        	        	    						   var cpuSlider=Ext.getCmp("cpuSlider");
	        	        	    						   cpuSlider.setMaxValue(COMPUTENODEINFO.logicCpu);
	        	        	    						   var memSlider=Ext.getCmp("memSlider");
	        	        	    						   memSlider.setMaxValue(COMPUTENODEINFO.memSize);
	        	        	    					   }else{

	        	        	    						   var index=0;
	        	        	    						   for(i=0;i<records.length;i++){
	        	        	    							   if(records[i].data.id==MODELINFO.comNodeId){
	        	        	    								   index=i;
	        	        	    								   break;
	        	        	    							   }
	        	        	    						   }
	        	        	    						   var firstValue=records[index].data.id;
	        	        	    						   v.setValue(firstValue);
	        	        	    						   CALCULATENODE=firstValue;
	        	        	    						   COMPUTENODEINFO=records[index].data;
	        	        	    						   /*var cpuSlider=Ext.getCmp("cpuSlider");
		        	        	    					   cpuSlider.setMaxValue(COMPUTENODEINFO.logicCpu);
		        	        	    					   var memSlider=Ext.getCmp("memSlider");
		        	        	    					   memSlider.setMaxValue(COMPUTENODEINFO.memSize);*/
	        	        	    					   }
	        	        	    				   }else{
	        	        	    					   Ext.MessageBox.alert(local.window.tip,local.emergency.noCalnode);
	        	        	    					   return false;
	        	        	    				   }
	        	        	    			   }});

	        	        	    		   },
	        	        	    		   select:function(combo, records, eOpts){
	        	        	    			   var calNodeId=combo.getValue();
	        	        	    			   CALCULATENODE=calNodeId;
	        	        	    			   COMPUTENODEINFO=records[0].data;
	        	        	    			   //每次重选计算节点重新加载网卡数据
	        	        	    			   var netWordConfig=Ext.getCmp("netWordConfigId");
	        	        	    			   netWordConfig.removeAll();
	        	        	    			   switchComputeNodesUpdateNic();

	        	        	    			   //设置最大Cpu和内存
	        	        	    			   var cpuSlider=Ext.getCmp("cpuSlider");
	        	        	    			   cpuSlider.setMaxValue(records[0].logicCpu);
	        	        	    			   var memSlider=Ext.getCmp("memSlider");
	        	        	    			   memSlider.setMaxValue(records[0].memSize);
	        	        	    		   }
	        	        	    	   }
	        	        	       },
	        	        	       {
	        	        	    	   xtype: 'combobox',
	        	        	    	   displayField: 'systemName',
	        	        	    	   valueField: 'value',
	        	        	    	   fieldLabel:local.emergency.operatingSystem,
	        	        	    	   labelWidth:130,
	        	        	    	   labelCls:"label_icon label_icon_sys ",
	        	        	    	   queryMode: 'local',
	        	        	    	   id: 'systemTypeId',
	        	        	    	   editable:false,
	        	        	    	   width: 350,
	        	        	    	   store: 'SystemTypeStore',
	        	        	    	   listeners:{
	        	        	    		   afterrender:function(v){
	        	        	    			   if(MODELINFO==null){
	        	        	    				   var defaultValue=SourceSysType;
	        	        	    				   v.setValue(defaultValue+'');
	        	        	    			   }else{
	        	        	    				   var defaultValue=MODELINFO.sysType;
	        	        	    				   v.setValue(defaultValue+'');
	        	        	    			   }

	        	        	    		   }
	        	        	    	   }
	        	        	       },
	        	        	       {
	        	        	    	   xtype: 'panel',
	        	        	    	   height: 25,
	        	        	    	   border:false,	
	        	        	    	   layout: {  
	        	        	    		   type: 'hbox',  
	        	        	    		   align: 'middle'
	        	        	    	   },
	        	        	    	   items : [
	        	        	    	            {   
	        	        	    	            	xtype: 'slider',
	        	        	    	            	id:'cpuSlider',
	        	        	    	            	fieldLabel:local.emergency.numberCPU,
	        	        	    	            	labelCls:"label_icon label_icon_cpu",
	        	        	    	            	width: 350,
	        	        	    	            	labelWidth:130,
	        	        	    	            	increment: 1,
	        	        	    	            	minValue: 1,
	        	        	    	            	value:1,
	        	        	    	            	tipText: function(thumb){
	        	        	    	            		return Ext.String.format('<b >{0}</b>',thumb.value);
	        	        	    	            	},
	        	        	    	            	listeners : {
	        	        	    	            		change : function(v,newValue, oldValue, eOpts){
	        	        	    	            			v.up('panel').down("numberfield").setValue(this.getValue());
	        	        	    	            		},
	        	        	    	            		render:function(v){
	        	        	    	            			if(MODELINFO!=null){
	        	        	    	            				v.setMaxValue(MODELINFO.maxLogicCpu);
	        	        	    	            				v.setValue(MODELINFO.cpuKernel);
	        	        	    	            			}
	        	        	    	            		}
	        	        	    	            	}
	        	        	    	            } ,
	        	        	    	            {
	        	        	    	            	xtype:'numberfield',
	        	        	    	            	margin: '0 0 0 10',
	        	        	    	            	id:'valueCpuKernel',
	        	        	    	            	width: 95,
	        	        	    	            	value:1,
	        	        	    	            	minValue: 1,
	        	        	    	            	listeners:{
	        	        	    	            		blur:function(v){
	        	        	    	            			if(v.getValue()>COMPUTENODEINFO.logicCpu){
	        	        	    	            				Ext.MessageBox.alert(local.window.tip,local.emergency.numberCPUMaximum+COMPUTENODEINFO.logicCpu+local.mark);
	        	        	    	            				v.setValue(COMPUTENODEINFO.logicCpu);
	        	        	    	            			}
	        	        	    	            			var cpuSlider=v.up('panel').down("slider");
	        	        	    	            			cpuSlider.setValue(v.getValue());
	        	        	    	            		},render:function(v){
	        	        	    	            			if(MODELINFO!=null){
	        	        	    	            				v.setValue(MODELINFO.cpuKernel);
	        	        	    	            			}
	        	        	    	            		}
	        	        	    	            	}

	        	        	    	            },  
	        	        	    	            {
	        	        	    	            	xtype:'displayfield',
	        	        	    	            	value:local.emergency.core,
	        	        	    	            	fieldStyle:{'padding-left':'5px'}
	        	        	    	            }
	        	        	    	            ]
	        	        	       },
	        	        	       {
	        	        	    	   xtype: 'panel',
	        	        	    	   height: 25,
	        	        	    	   border:false,
	        	        	    	   layout: {  
	        	        	    		   type: 'hbox',  
	        	        	    		   align: 'middle'
	        	        	    	   },
	        	        	    	   items : [
	        	        	    	            {   
	        	        	    	            	xtype: 'slider',
	        	        	    	            	fieldLabel:local.memory,
	        	        	    	            	labelCls:"label_icon label_icon_mem ",
	        	        	    	            	labelWidth:130,
	        	        	    	            	id:"memSlider",
	        	        	    	            	width: 350,
	        	        	    	            	//increment:64,
	        	        	    	            	minValue: 1,
	        	        	    	            	value:512,
	        	        	    	            	useTips: true,
	        	        	    	            	tipText: function(thumb){
	        	        	    	            		return Ext.String.format('<b >{0}MB</b>', thumb.value);
	        	        	    	            	},
	        	        	    	            	listeners : {
	        	        	    	            		change : function(v,newValue, oldValue, eOpts){
	        	        	    	            			v.up('panel').down("numberfield").setValue(this.getValue());
	        	        	    	            		},
	        	        	    	            		render:function(v){
	        	        	    	            			if(MODELINFO!=null){ 
	        	        	    	            				v.setMaxValue(MODELINFO.maxMemory);
	        	        	    	            				v.setValue(MODELINFO.memory);
	        	        	    	            			}
	        	        	    	            		}
	        	        	    	            		/*change : function(v,newValue, oldValue, eOpts){
	        	        	    	            			v.up('panel').down("numberfield").setValue(this.getValue());
	        	        	    	            		},
	        	        	    	            		afterrender:function(v){
	        	        	    	            			if(MODELINFO==null){
	        	        	    	            				v.setValue(1);
	        	        	    	            				//v.up('panel').down("numberfield").setValue(1);
	        	        	    	            			}else{
	        	        	    	            				v.setValue(MODELINFO.cpuKernel);
	        	        	    	            				//v.up('panel').down("numberfield").setValue(MODELINFO.cpuKernel);
	        	        	    	            			}
	        	        	    	            		}*/
	        	        	    	            	}
	        	        	    	            } ,
	        	        	    	            {
	        	        	    	            	xtype:'numberfield',
	        	        	    	            	id:'memorySizeId',
	        	        	    	            	margin: '0 0 0 10',
	        	        	    	            	width: 95,
	        	        	    	            	value: 512,
	        	        	    	            	minValue: 1,
	        	        	    	            	//enableKeyEvents:true,
	        	        	    	            	listeners:{
	        	        	    	            		blur:function(v){
	        	        	    	            			if(v.getValue()>COMPUTENODEINFO.memSize){
	        	        	    	            				Ext.MessageBox.alert(local.window.tip,local.emergency.memorMaximum+COMPUTENODEINFO.memSize+local.mark);
	        	        	    	            				v.setValue(COMPUTENODEINFO.memSize);
	        	        	    	            			}
	        	        	    	            			var memSlider=v.up('panel').down("slider");
	        	        	    	            			memSlider.setValue(v.getValue());
	        	        	    	            		},
	        	        	    	            		afterrender:function(v){
	        	        	    	            			if(MODELINFO!=null){
	        	        	    	            				v.setValue(MODELINFO.memory);
	        	        	    	            			}
	        	        	    	            		}
	        	        	    	            	}
	        	        	    	            },  
	        	        	    	            {
	        	        	    	            	xtype:'displayfield',
	        	        	    	            	value:'MB',
	        	        	    	            	fieldStyle:{'padding-left':'5px'}
	        	        	    	            }
	        	        	    	            ]
	        	        	       }
	        	        	       ]
	        	        }
	        	        ]
	        },{
	        	xtype: 'panel',
	        	layout: 'hbox',
	        	width:'100%',
	        	id:'virtualNetWorkId',
	        	bodyStyle:"border:0;border-bottom:1px solid #eee",
	        	items: [
	        	        {
	        	        	xtype: 'panel',
	        	        	width: 110,
	        	        	height:'100%',
	        	        	border:false,	
	        	        	padding:'0 0 0 10',
	        	        	style:'background:#fafbfc;',
	        	        	bodyStyle:'background:#fafbfc;',
	        	        	bodyCls:'vertical_text',
	        	        	html:local.web
	        	        },
	        	        {
	        	        	xtype: 'panel',
	        	        	flex:1,
	        	        	border:false,
	        	        	padding:"0 0 20 0",
	        	        	defaults: {
	        	        		border:false,
	        	        		margin: '10 0 0 10'
	        	        	},
	        	        	items:[
	        	        	       {
	        	        	    	   xtype: 'panel',
	        	        	    	   id:'netWordConfigId',
	        	        	    	   width: 550,
	        	        	    	   columns: 1,
	        	        	    	   items: [
	        	        	    	           ],
	        	        	    	           listeners:{
	        	        	    	        	   afterrender:listAllDeviceNic
	        	        	    	           }

	        	        	       }/*,
	        	        	       {
	        	        	    	   xtype: 'panel',
	        	        	    	   height: 25,
	        	        	    	   width: 100,
	        	        	    	   border:false,
	        	        	    	   html:'<a href="#" onclick="AddNetWorkCards();" style="text-decoration:underline;cursor:pointer;">+增加网卡</a> '
	        	        	       }*/
	        	        	       ]
	        	        }
	        	        ]
	        }
	        ]/*,
	        listeners:{
	        	afterrender:function(v){
	        		MODELINFO=v.up("window").modelInfo;
	        	}
	        }*/
});

/**
 * @description：单机增加硬盘时弹出窗口
 * @data 2016-4-7
 * @auth WangShaoDong
 */
Ext.define("acesure.emergency.view.HardDiskWin",{
	extend:'Ext.window.Window',
	title:local.emergency.increaseStorage,
	draggable:true,
	height:500,						//高度
	width:800,						//宽度
	modal:true,//是否模态窗口，默认为false
	resizable:false,
	border:false,
	id:'hardDiskWinId',
	layout:"hbox",
	items:[  {
		xtype : 'hardDiskDeviceTree',
		region : 'west',
		floating : false,
		width : 220,
		height:"100%",
		border:false,
		cls:"tree_scroll bgcolor",
		bodyStyle:'background:#f5f8fa;',
		bodyBorder:false,
		listeners : {
			itemclick:function(record, item, index, e, eOpts ){
				//子节点才会触发
				if(null == item.data.children){
					var sysType=item.raw.sysType;
					if(SourceSysType<32&&sysType>=32){
						Ext.MessageBox.alert(local.window.tip,local.emergency.sysTypeNoMatch);
					};
					if(SourceSysType>=32&&sysType<32){
						Ext.MessageBox.alert(local.window.tip,local.emergency.sysTypeNoMatch);
					};
					HARDDISK_DEVICEID= item.raw.deviceId ;
					var hardDiskPanelId = Ext.getCmp('hardDiskPanelId');
					hardDiskPanelId.removeAll();
					hardDiskPanelId.add({xtype:'hardDiskPanel'});
					hardDiskPanelId.doLayout();
				}

			}
		}

	},{
		xtype : 'panel',
		id:'hardDiskPanelId',
		flex:1,
		height:"100%",
		overflowY:"auto",
		floating : false,
		border:false,
		style:"border-left:1px solid #ccc",
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
			var hardDiskPanle=Ext.getCmp('hardDiskPanelId').down("hardDiskPanel");
			if(hardDiskPanle){
				check=hardDiskPanle.getChecked();
			}
			if(null!=check&&check.length>0){
				var boxLabelInfo='<span><i class="vm_icon vm_icon_disk"></i>['+local.emergency.externalDrives+':'+HARDDISKINFO.index+','+local.capacity+':'+HARDDISKINFO.size+'GB]</span>'+'<span>&nbsp;&nbsp;&nbsp;'+HARDDISKINFO.name+'</span>';
				var chk = new Ext.form.Checkbox({boxLabel:boxLabelInfo, name: 'cb-auto-1',inputValue:HARDDISKINFO.id}); 
				Ext.getCmp("hardDiskAndVmdkId").add(chk);
			}
			Ext.getCmp("hardDiskWinId").close();
		}
	},
	{
		text:local.btn.cancle,
		id:'cancel',
		handler:function(){
			Ext.getCmp("hardDiskWinId").close();
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
 * @description：单机增加硬盘时显示其他设备信息
 * @data 2016-4-7
 * @auth WangShaoDong
 */
Ext.define("Ext.emergency.view.HardDiskDeviceTree",{
	extend : 'Ext.tree.TreePanel',
	alias : 'widget.hardDiskDeviceTree',
//	cls:'bgcolor',
	useArrows : true,
	rootVisible : false, 
	initComponent : function() {
		var me = this;
		var hardDiskDeviceTreeStore=Ext.create("acesure.emergency.store.HardDiskDeviceTreeStore");
		hardDiskDeviceTreeStore.load({params:{"vmManagerModel.deviceId":SourceDeviceId,
			"vmManagerModel.type":1}});
		Ext.applyIf(me, {
			store:hardDiskDeviceTreeStore
		});
		me.callParent(arguments);
	}
});

/**
 * @description：单机增加硬盘时显示其他设备硬盘信息面板
 * @data 2016-4-7
 * @auth WangShaoDong
 */
Ext.define("acesure.emergency.view.HardDiskPanel",{
	extend:"Ext.tree.TreePanel",
	alias:'widget.hardDiskPanel',
	useArrows:true,
	border:false,
	cls:"tree_scroll",
	rootVisible:false,//不可见根
	multiSelect:true,
	loadMask:{msg:local.dataLoading},
	initComponent : function() {
		var me = this;
		var OtherDeviceHardDiskStore=Ext.create("acesure.emergency.store.OtherDeviceHardDiskStore");
		OtherDeviceHardDiskStore.load({params:{"vmManagerModel.deviceId":HARDDISK_DEVICEID}});
		Ext.applyIf(me, {
			store:OtherDeviceHardDiskStore
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
 * @description：单机增加网络时弹出窗口
 * @data 2016-4-7
 * @auth WangShaoDong
 */
/*Ext.define("acesure.emergency.view.NetWorkSelectWin",{
	extend:'Ext.window.Window',
	title:"新增网卡",
	draggable:true,
	height:400,						//高度
	width:400,						//宽度
	modal:true,//是否模态窗口，默认为false
	resizable:false,
	border:false,
	layout:"fit",
	id:'NetWorkSelectWinId',
	items:[{
		xtype:"netWorkSelectGrid"
	}],
	buttons:[
	         {
	        	 text:local.btn.save,
	        	 cls:"btn_focus",
	        	 textAlign:'center',
	        	 handler:function(){
	        		 var records=Ext.getCmp("netWorkSelectGridId").getSelectionModel().getSelection();
	        		 if(records.length==0){
	        			 Ext.MessageBox.alert(local.window.tip,local.emergency.pleasCard);
	        			 return false;
	        		 }else{
	        			 dynamicAddNetWorkCards(records);
	        			 Ext.getCmp("NetWorkSelectWinId").close();
	        		 }
	        	 }
	         },
	         {
	        	 text:local.btn.cancle,
	        	 id:'cancel',
	        	 handler:function(){
	        		 Ext.getCmp("NetWorkSelectWinId").close();
	        	 }
	         }],
	         initComponent:function(){
	        	 var me=this;
	        	// console.log(me.selectNetWorkId);
	        	 Ext.apply(this,{
	        	 });
	        	 this.callParent();
	         }
});*/
/**
 * @description：单机增加网络时显示网络信息
 * @data 2016-4-7
 * @auth WangShaoDong
 */


/*Ext.define('acesure.emergency.view.NetWorkSelectGrid',{
	extend:'Ext.grid.GridPanel',
	alias:'widget.netWorkSelectGrid',
	id:'netWorkSelectGridId',
	store:'NetWorkListStore',
	html:'12313',
	initComponent:function(){

		var sm = new Ext.selection.CheckboxModel({  
			dataIndex: "index" 
			//mode:'single',
			//singleSelect: true,
			//showHeaderCheckbox :false
			//checkOnly :true
		}); 

		Ext.apply(this, {
			//store:deviceNicStore,
			selModel:sm,
			columns : [
			           {
			        	   header :local.emergency.index,
			        	   dataIndex : 'index',
			        	   //width : '10%',
			        	   width:50,
			        	   renderer : function(value, cellmeta, record, rowIndex, columnIndex) {
			        		   return value;
			        	   }
			           },
			           {
			        	   header : 'MAC',
			        	   dataIndex : 'mac',
			        	   //width : '28%',
			        	   flex:1,
			        	   renderer : function(value, cellmeta, record, rowIndex, columnIndex) {
			        		   return value;
			        	   }
			           },
			           {
			        	   header : 'IP',
			        	   dataIndex : 'ip',
			        	   flex:1,
			        	   //width : '28%',
			        	   renderer : function(value, cellmeta, record, rowIndex, columnIndex) {
			        		   return value;
			        	   }
			           },
			           ]
		});
		this.callParent(arguments);
	},
	listeners:{
		afterrender:function(){
			var netWorkId=this.up("window").selectNetWorkId;
			this.store.load({params:{"vmManagerModel.deviceId":SourceDeviceId,"vmManagerModel.netWorkId":netWorkId,"vmManagerModel.type":1}
				callback:function(records, operation, success){
					if(records.length==0){
						Ext.getCmp("netWorkSelectGridId").update("<div class='offlineClsTextS'>2544444444444</div>");
					}
				}	
			});
		}
	}
});*/
/**
 * @description：单机增加网络时弹出窗口后点击保存时先前页面增加一条网络数据
 * @data 2016-4-7
 * @auth WangShaoDong
 */
Ext.define("acesure.emergency.view.AddNetworkConfig",{
	extend:"Ext.panel.Panel",
	alias:"widget.addNetworkConfig",
	layout:'column', 
	style:"padding-top:5px;",
	border:false,
	config:{rawData:'',check:'',comId:''},
	items:[
	       {
	    	   xtype:"checkboxgroup",
	    	   width:220,
	    	   height:24,
	    	   style:"display:inline-block;line-height:24px",
	    	   listeners:{
	    		   afterrender:function(v){
	    			   //获取选取的网卡信息
	    			   var id=rawData.id;
	    			   var name=rawData.name;
	    			   var ip=rawData.ip;
	    			   var index=rawData.index;
	    			   var updateStr='<span><i class="vm_icon vm_icon_net"></i>'+local.emergency.card+index+'&nbsp;['+ip+']</span>';
	    			   var flag = false;
	    			   if(EMERGENCYTYPE == 2){
	    				   flag = true;
	    			   }
	    			   if(EMERGENCYTYPE == 5&&comId != -1){
	    				   flag = true;
	    			   }
	    			   var flag2 =  false;
	    			   if(CLUSTERVMFLAG == 1&&EMERGENCYTYPE == 2){
	    				   flag2 = true;
	    			   }
	    			   v.add({    
	    				   boxLabel:updateStr,    
	    				   name : 'vir_network_checkbox',
	    				   checked:flag,
	    				   disabled:flag2
	    			   }); 
	    			   this.netWorkId=id;
	    		   }/*,
	    		   change:function( v, newValue, oldValue, eOpts){
	    			   console.log(newValue);
	    			   console.log(oldValue);
	    		   }*/
	    	   }
	       },
	       {
	    	   xtype: 'combobox',
	    	   displayField: 'computeNicName',
	    	   valueField: 'computeNicId',
	    	   emptyText:local.emergency.chooseCard,
	    	   style:"margin-left:10px;",
	    	   labelSeparator: '',
	    	   queryMode: 'local',
	    	   editable:false,
	    	   width: 220,
	    	   store: 'ComputeNodesNicStore',
	    	   listeners:{
	    		   afterrender:function(v){
	    			   this.store.load({params:{"computeNodesNic.computeId":CALCULATENODE}});
	    			   if(EMERGENCYTYPE == 2){
	    				   v.hide();
	    			   }else{
	    				   v.show();
	    			   }
	    			   if(comId!=-1){
	    				   v.setValue(parseInt(comId));
	    			   } 
	    		   }
	    	   }
	       }/*,{
	    	   xtype: 'button',
	    	   text : '',
	    	   height: 16,
	    	   width: 16,
	    	   cls:"btn_big btn_a",
	    	   style:"margin-left:10px;",
	    	   border:false,
	    	   handler:function(){
	    		   var addnetPanel=Ext.getCmp(this.id).up('panel');
	    		   addnetPanel.destroy();
	    	   }
	       }*/],
	       initComponent:function(){
	    	   var me=this;
	    	   rawData=this.rawData;
	    	   check=this.check;
	    	   comId=this.comIds;
	    	   Ext.apply(this,{
	    	   });
	    	   this.callParent();          
	       }
});







/**
 * @description：页面初始渲染时显示网络信息面板
 * @data 2016-4-7
 * @auth WangShaoDong
 */
/*Ext.define("acesure.emergency.view.NetworkConfig",{
	extend:"Ext.panel.Panel",
	alias:"widget.networkConfig",
	layout:'column', 
	style:"padding-top:5px",
	border:false,
	items:[
	       {
	    	   xtype:"label",
	    	   width:200,
	    	   width:260,
	    	   height:24,
	    	   text:'',
	    	   style:"display:inline-block;line-height:24px",
	    	   html:'',
	    	   listeners:{
	    		   afterrender:addNetWorkByDeviceId
	    	   }
	       },
	       {
	    	   xtype: 'combobox',
	    	   displayField: 'computeNicName',
	    	   valueField: 'computeNicId',
	    	   emptyText:local.emergency.selectCard,
	    	   style:"margin-left:10px;",
	    	   labelSeparator: '',
	    	   queryMode: 'local',
	    	   width: 180,
	    	   store: 'ComputeNodesNicStore'
	       }]
});*/









/**
 * @description：演练模式
 * @data 2016-4-7
 * @auth WangShaoDong
 */
Ext.define("acesure.emergency.view.EmergencyEmulation",{
	extend:"Ext.form.Panel",
	alias:"widget.emergencyEmulation",
	width:'100%',
	border:false,		
	layout:'vbox',
	items: [
	        {
	        	xtype: 'panel',
	        	width:'100%',
	        	layout: 'hbox',
	        	bodyStyle:"border:0;border-bottom:1px solid #eee",
	        	items: [
	        	        {
	        	        	xtype: 'panel',
	        	        	width: 110,
	        	        	height:'100%',
	        	        	border:false,	
	        	        	padding:'0 0 0 10',
	        	        	style:'background:#fafbfc;',
	        	        	bodyStyle:'background:#fafbfc;',
	        	        	bodyCls:'vertical_text',
	        	        	html:local.emergency.basicCon
	        	        },
	        	        {
	        	        	xtype: 'panel',
	        	        	flex:1,
	        	        	border:false,
	        	        	padding:10,
	        	        	items:[
{
	xtype:"panel",
	id:'deviceEmergencyAuthorizationPanel',
	border:false,
	layout:"hbox",
	height:40,
	margin:10,
	bodyStyle:'background:#fff4d2;',
	listeners:{
		afterrender:function(v){
			//判断是否需要授权
			initDeviceEmergencyAuthorizationPanel();
		}
	},
	items:[
				{
				    fieldLabel : local.emergency.needAuth,
				    xtype:'panel',
				    id:'emergencyAuthorizationTextArea',
			   		padding:'10 0 0 0',
			   		bodyStyle:'padding-left:20px;background:#fff4d2;',
				    height:40,
				    width:250,
				    value:'testmsg',
				    border:false
				},
				{
				    xtype:"button",
				    icon:'/images/common/icon_auth.png',
				    style:"margin-left:1px;padding-left:17px",
				    texrAlign:"center",
				    margin:'5 0 0 20',
				    width:100,
				    height:30,
				    cls:"ip_add_btn",
				    html:local.emergency.needAuth,
				    handler:function(){
				    	var takeOver = 0;
				    	var emulation = 0;
				    	if(EMERGENCYTYPE == 1){
				    		takeOver = 1;
				    	}else{
				    		emulation = 1;
				    	}
				    	Ext.Ajax.request({
							url:'/emergency/tovmManager!addDeviceEmergencyLicense.action',
							params:{
								"deviceId":SourceDeviceId,
								"takeover":takeOver,
								"emulation":emulation
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
								}else{
									Ext.Msg.alert(local.window.tip,local.emergency.authSuccess);
									Ext.getCmp("virtualMachWindowAddButton").setDisabled(false);
									Ext.getCmp("deviceEmergencyAuthorizationPanel").hide();
									}
								}
				    		});
				    	}
					}
				]
},
	        	        	       {
	        	        	    	   xtype: 'textfield',
	        	        	    	   fieldLabel:local.emergency.rehearseName,
	        	        	    	   width: 350,
	        	        	    	   id:'vmName',
	        	        	    	   maxLength:30,
	        	        	    	   enforceMaxLength:true,
	        	        	    	   allowBlank: false,
	        	        	    	   labelWidth:130,
	        	        	    	   labelCls:"label_icon label_icon_type",
	        	        	    	   blankText:local.config.emailAddrNoNull,
	        	        	    	   vtype :'alphanum',  
	        	        	    	   vtypeText :local.emergency.hostNameFormatMess,
	        	        	    	   listeners : {
	        	        	    		   afterrender:function(){
	        	        	    			   Ext.Ajax.request({
	        	        	    				   url:'/emergency/tovmManager!getMaxVmManagetId.action',
	        	        	    				   success: function(resp,opts) {
	        	        	    					   Ext.getCmp("vmName").setValue('Server_'+resp.responseText);
	        	        	    					   SERVER_NAME = 'Server_'+resp.responseText;
	        	        	    				   },
	        	        	    				   failure: function(resp,opts) {
	        	        	    				   }
	        	        	    			   });
	        	        	    		   }/*,
	        	        	    		   blur:function( v, The, eOpts ){
	        	        	    			   if(!v.isValid() ){
	        	        	    				   Ext.MessageBox.alert(local.window.tip,"虚拟机名称超过最大长度");
	        	        	    			   }   
	        	        	    		   }*/
	        	        	    	   }
	        	        	       },
	        	        	       {
	        	        	    	   xtype: 'combobox',
	        	        	    	   displayField: 'name',
	        	        	    	   valueField: 'id',
	        	        	    	   fieldLabel: local.emergency.nodeCount,
	        	        	    	   labelCls:"label_icon label_icon_cal",
	        	        	    	   id: 'computeNoteId',
	        	        	    	   queryMode:'local',
	        	        	    	   width: 350,
	        	        	    	   labelWidth:130,
	        	        	    	   blankText :local.emergency.pleaseSelect,
	        	        	    	   forceSelection : true,
	        	        	    	   editable : false,
	        	        	    	   store:'CalculateNodesStore',
	        	        	    	   listeners:{
	        	        	    		   afterrender:function(){
	        	        	    			   this.store.load({params:{
	        	        	    				   "setId":SNAPSETID
	        	        	    			   },callback:function(records, options, success){
	        	        	    				   if(records.length!=0){

	        	        	    					   var firstValue=records[0].data.id;
	        	        	    					   CALCULATENODE=firstValue;
	        	        	    					   COMPUTENODEINFO=records[0].data;
	        	        	    					   Ext.getCmp("computeNoteId").setValue(firstValue);

	        	        	    					   var cpuSlider=Ext.getCmp("cpuSlider");
	        	        	    					   cpuSlider.setMaxValue(COMPUTENODEINFO.logicCpu);
	        	        	    					   var memSlider=Ext.getCmp("memSlider");
	        	        	    					   memSlider.setMaxValue(COMPUTENODEINFO.memSize);
	        	        	    				   }else{
	        	        	    					   Ext.MessageBox.alert(local.window.tip,local.emergency.noCalnode);
	        	        	    					   return false;
	        	        	    				   }
	        	        	    			   }});

	        	        	    		   },
	        	        	    		   expand:function(v,eOpts ){
	        	        	    			   this.store.load({params:{
	        	        	    				   "setId":SNAPSETID
	        	        	    			   }});
	        	        	    		   },
	        	        	    		   change:function( me, newValue, oldValue, eOpts ){
	        	        	    		   	    var computeNodeId = newValue;
                                                //加载计算机点下的虚拟子网列表
                                                loadVmSubList(computeNodeId);
	        	        	    		   }
	        	        	    	   }
	        	        	       },
	        	        	       {
	        	        	    	   xtype: 'combobox',
	        	        	    	   displayField: 'systemName',
	        	        	    	   valueField: 'value',
	        	        	    	   fieldLabel: local.emergency.operatingSystem,
	        	        	    	   labelCls:"label_icon label_icon_sys",
	        	        	    	   labelWidth:130,
	        	        	    	   queryMode: 'local',
	        	        	    	   id: 'systemTypeId',
	        	        	    	   editable:false,
	        	        	    	   width: 350,
	        	        	    	   store: 'SystemTypeStore',
	        	        	    	   listeners:{
	        	        	    		   afterrender:function(){
	        	        	    			   var defaultValue=SourceSysType;
	        	        	    			   Ext.getCmp(this.id).setValue(defaultValue+'');
	        	        	    		   }
	        	        	    	   }
	        	        	       },

	        	        	       {
	        	        	    	   xtype: 'panel',
	        	        	    	   height: 25,
	        	        	    	   border:false,	
	        	        	    	   layout: {  
	        	        	    		   type: 'hbox',  
	        	        	    		   align: 'middle'
	        	        	    	   },
	        	        	    	   items : [
	        	        	    	            {   
	        	        	    	            	xtype: 'slider',
	        	        	    	            	id:'cpuSlider',
	        	        	    	            	fieldLabel:local.emergency.numberCPU,
	        	        	    	            	labelCls:"label_icon label_icon_cpu",
	        	        	    	            	labelWidth:130,
	        	        	    	            	width: 350,
	        	        	    	            	increment: 1,
	        	        	    	            	minValue: 1,
	        	        	    	            	value:1,
	        	        	    	            	tipText: function(thumb){
	        	        	    	            		return Ext.String.format('<b >{0}</b>',thumb.value);
	        	        	    	            	},
	        	        	    	            	listeners : {
	        	        	    	            		change : function(v,newValue, oldValue, eOpts){
	        	        	    	            			v.up('panel').down("numberfield").setValue(this.getValue());
	        	        	    	            		}
	        	        	    	            	}
	        	        	    	            } ,
	        	        	    	            {
	        	        	    	            	xtype:'numberfield',
	        	        	    	            	margin: '0 0 0 10',
	        	        	    	            	id:'valueCpuKernel',
	        	        	    	            	width: 95,
	        	        	    	            	minValue: 1,
	        	        	    	            	value:1,
	        	        	    	            	listeners:{
	        	        	    	            		change:function(v,newValue, oldValue, eOpts ){
	        	        	    	            			if(newValue>COMPUTENODEINFO.logicCpu){
	        	        	    	            				Ext.MessageBox.alert(local.window.tip,local.emergency.numberCPUMaximum+COMPUTENODEINFO.logicCpu+local.mark);
	        	        	    	            				newValue=COMPUTENODEINFO.logicCpu;
	        	        	    	            				v.setValue(newValue);
	        	        	    	            			}
	        	        	    	            			var cpuSlider=v.up('panel').down("slider");
	        	        	    	            			cpuSlider.setValue(newValue);
	        	        	    	            		}
	        	        	    	            	}
	        	        	    	            },  
	        	        	    	            {
	        	        	    	            	xtype:'displayfield',
	        	        	    	            	value:local.emergency.core,
	        	        	    	            	fieldStyle:{'padding-left':'5px'}
	        	        	    	            }
	        	        	    	            ]
	        	        	       },
	        	        	       {
	        	        	    	   xtype: 'panel',
	        	        	    	   height: 25,
	        	        	    	   border:false,
	        	        	    	   layout: {  
	        	        	    		   type: 'hbox',  
	        	        	    		   align: 'middle'
	        	        	    	   },
	        	        	    	   items : [
	        	        	    	            {   
	        	        	    	            	xtype: 'slider',
	        	        	    	            	fieldLabel:local.memory,
	        	        	    	            	id:"memSlider",
	        	        	    	            	labelCls:"label_icon label_icon_mem",
	        	        	    	            	labelWidth:130,
	        	        	    	            	width: 350,
	        	        	    	            	minValue: 1,
	        	        	    	            	value:512,
	        	        	    	            	tipText: function(thumb){
	        	        	    	            		return Ext.String.format('<b >{0}MB</b>', thumb.value);
	        	        	    	            	},
	        	        	    	            	listeners : {
	        	        	    	            		change : function(v,newValue, oldValue, eOpts){
	        	        	    	            			v.up('panel').down("numberfield").setValue(newValue);
	        	        	    	            		}/*,
	        	        	    	            		move:function( v, The, eOpts ){
	        	        	    	            			console.log(v);
	        	        	    	            		}*/
	        	        	    	            	}
	        	        	    	            } ,
	        	        	    	            {
	        	        	    	            	xtype:'numberfield',
	        	        	    	            	id:'memorySizeId',
	        	        	    	            	margin: '0 0 0 10',
	        	        	    	            	width: 95,
	        	        	    	            	value: 512,
	        	        	    	            	minValue: 1,
	        	        	    	            	listeners:{
	        	        	    	            		change:function(v,newValue, oldValue, eOpts ){
	        	        	    	            			if(newValue>COMPUTENODEINFO.memSize){
	        	        	    	            				Ext.MessageBox.alert(local.window.tip,local.emergency.memorMaximum+COMPUTENODEINFO.memSize+local.mark);
	        	        	    	            				newValue=COMPUTENODEINFO.memSize;
	        	        	    	            				v.setValue(newValue);
	        	        	    	            			}
	        	        	    	            			var memSlider=v.up('panel').down("slider");
	        	        	    	            			memSlider.setValue(newValue);
	        	        	    	            		}
	        	        	    	            	}
	        	        	    	            },  
	        	        	    	            {
	        	        	    	            	xtype:'displayfield',
	        	        	    	            	value:'MB',
	        	        	    	            	fieldStyle:{'padding-left':'5px'}
	        	        	    	            }
	        	        	    	            ]
	        	        	       }
	        	        	       ]
	        	        }
	        	        ]
	        },
	        {
	        	xtype: 'panel',
	        	layout: 'hbox',
	        	width:'100%',
	        	id:'virtualStorageId',
	        	height:200,
	        	bodyStyle:"border:0;border-bottom:1px solid #eee",
	        	items: [
	        	        {
	        	        	xtype: 'panel',
	        	        	width: 110,
	        	        	height:'100%',
	        	        	border:false,	
	        	        	padding:'0 0 0 10',
	        	        	style:'background:#fafbfc;',
	        	        	bodyStyle:'background:#fafbfc;',
	        	        	bodyCls:'vertical_text',
	        	        	html:local.storage
	        	        },
	        	        {
	        	        	xtype: 'panel',
	        	        	flex:1,
	        	        	border:false,
	        	        	height:"100%",
	        	        	layout:"vbox",
	        	        	items:[
	        	        	       {
	        	        	    	   xtype: 'checkboxgroup',
	        	        	    	   id:'hardDiskAndVmdkId',
	        	        	    	   width: "100%",
	        	        	    	   //height:160,
	        	        	    	   flex:1,
	        	        	    	   overflowY:"auto",
	        	        	    	   border:false,
	        	        	    	   columns:1,
	        	        	    	   defaults:{margin:"10 0 0 10"},
	        	        	    	   //bodyStyle:"overflow-y:auto;",

	        	        	    	   items: [
	        	        	    	           ],
	        	        	    	           listeners:{
	        	        	    	        	   afterrender:listDeviceAllHardDisks
	        	        	    	           }
	        	        	       },
	        	        	       {
	        	        	    	   xtype: 'panel',
	        	        	    	   height: 25,
	        	        	    	   width:160,
	        	        	    	   margin:10,
	        	        	    	   border:false,	
	        	        	    	   html:'<a style="text-decoration:underline;cursor:pointer;color:#00aaaa" href="#" onclick="AddDeviceHardDisks();">+'+local.emergency.increaseStorage+'</a>'//TODO
	        	        	       }
	        	        	       ]
	        	        }
	        	        ]
	        },{
	        	xtype:"panel",
	        	layout: 'hbox',
	        	width:'100%',
	        	height:100,
	        	border:false,
	        	bodyStyle:"border:0;",
	        	items:[	{
	        		xtype: 'panel',
	        		width: 110,
	        		height:'100%',
	        		border:false,	
	        		padding:'0 0 0 10',
	        		style:'background:#fafbfc;',
	        		bodyStyle:'background:#fafbfc;',
	        		bodyCls:'vertical_text',
	        		html:local.emergency.granule
	        	},
	        	{

	        		xtype: 'panel',
    	        	flex:1,
    	        	border:false,
    	        	height:"100%",
    	        	layout:"vbox",
	        		items:[
	        		       {
	        		    	   xtype: 'checkbox',
	        		    	   margin: '10 0 0 10',
	        		    	   width: "100%",
	        		    	   boxLabel:local.open,
	        		    	   id:'particleSwitch',  //小颗粒开关,是否启动小颗粒
                               value:false,  //默认不开启小颗粒
	        		    	   flex:1,
	        		    	   overflowY:"auto",
	        		    	   border:false,
	        		    	   columns:1,
	        		    	   defaults:{margin:"10 0 0 10"},
	        		    	   listeners:{
	        		    		   change:function(v,newValue, oldValue, eOpts ){

	        		    			   if(newValue){
	        		    				   Ext.getCmp("dataPointSliderId").show();
	        		    				   Ext.getCmp("dataPointTextId").show();
	        		    			   }else{
	        		    				   Ext.getCmp("dataPointSliderId").hide();
	        		    				   Ext.getCmp("dataPointTextId").hide();
	        		    			   }
	        		    		   },
	        		    		   afterrender:function(v){
	        		    			   if(v.getValue()){
	        		    				   Ext.getCmp("dataPointSliderId").show();
	        		    				   Ext.getCmp("dataPointTextId").show();
	        		    			   }else{
	        		    				   Ext.getCmp("dataPointSliderId").hide();
	        		    				   Ext.getCmp("dataPointTextId").hide();
	        		    			   }
	        		    		   }
	        		    	   }

	        		       },{   
	        		    	   xtype: 'slider',
	        		    	   hidden: true,  //默认隐藏
	        		    	   margin: '10 0 0 10',
	        		    	   fieldLabel:local.emergency.granuleStorage,
	        		    	   //labelCls:"label_icon label_icon_cpu",
	        		    	   labelWidth:130,
	        		    	   id:'dataPointSliderId',
	        		    	   width: 450,
	        		    	   increment: 1,
	        		    	   minValue: 1,
	        		    	   maxValue:100,
	        		    	   value:1,
	        		    	   maxModifyTime:'',
	        		    	   minModifyTime:'',
	        		    	   dataPointValue:'',
	        		    	   tipText: function(thumb){
                                        var tempTime=DATAPOINTTIME*thumb.value;
                                        var date = new Date(tempTime+minModifyTime.time);
                                        var dateStr = format(date, 'yyyy-MM-dd HH:mm:ss');
                                        return  local.emergency.granuleTime+dateStr;
                               },
	        		    	   /*plugins: new Ext.slider.Tip({  
	        		    	        getText: function (thumb) { 
	        		    	        	var tempTime=DATAPOINTTIME*thumb.value;
	        		    	        	var date = new Date(tempTime+minModifyTime.time);
	        		    	        	var dateStr = format(date, 'yyyy-MM-dd HH:mm:ss');
	        		    	        	return  "颗粒时间: "+dateStr;
	        		    	        }  
	        		    	    }), */ 
	        		    	   listeners : {
	        		    		   change:function(v,newValue, oldValue, eOpts ){
	        		    	        	var tempTime=DATAPOINTTIME*newValue;
	        		    	        	var date = new Date(tempTime+minModifyTime.time);
	        		    	        	var dateStr = format(date, 'yyyy-MM-dd HH:mm:ss');
	        		    	        	v.dataPointValue=date;
  	        		    	        	Ext.getCmp("dataPointTextId").setValue(dateStr);
	        		    		   },afterrender:function(v){
		    		        		   Ext.Ajax.request({
		        	    				   url:'/emergency/tovmManager!getDataPointVmdkInfo.action',
		        	    				   params : {
		        	    						'diskCloneId' : DISKCLONEID,
		        	    						'setId':SNAPSETID
		        	    					},
		        	    				   success: function(resp,opts) {
		        	    					   var result=Ext.decode(resp.responseText);
		        	    					   if(result.success==1){
		        	    						   maxModifyTime=result.maxModifyTime;
		        	    						   minModifyTime=result.minModifyTime; 
		        	    						   //每拉一次，间隔1秒钟
		        	    						   v.setMaxValue(parseInt((maxModifyTime.time-minModifyTime.time)/DATAPOINTTIME));
		        	    						   
		        	    						   //设置默认的小颗粒时间
                                                   var defaultTime = new Date(minModifyTime.time);
                                                   v.dataPointValue=defaultTime;
                                                   var defaultPartDate = format(defaultTime, 'yyyy-MM-dd HH:mm:ss');
                                                   Ext.getCmp("dataPointTextId").setValue(defaultPartDate);
		        	    					   };
		        	    				   },
		        	    				   failure: function(resp,opts) {
		        	    				   }
		        	    			   });
		    		        	   }
	        		    	   }
	        		       } ,
	        		       {
	        		    	   xtype:'textfield',
	        		    	   hidden: true,  //默认隐藏
	        		    	   margin: '10 0 10 10',
	        		    	   fieldLabel:local.emergency.granuleTime,
	        		    	   id:'dataPointTextId',
	        		    	   labelWidth:130,
	        		    	   width: 350,
	        		    	   readOnly :true,
	        		    	   //disabled:true,
							   //regex:/^([0-9]{4})-([0-9]{2})-([0-9]{2})\s([0-9]{2}):([0-9]{2}):([0-9]{2})$/,
							   //regexText:'时间格式格式错误!',
	        		    	   listeners:{
	        		    		   change:function(v,newValue, oldValue, eOpts ){
	        		    		   	   //Ext.getCmp("dataPointSliderId").setValue(newValue);	        		    		   	    
	        		    		   }
	        		    	   }
	        		       }]
	        	}
	        	],listeners:{
		        	   afterrender:function(v){
		        		   Ext.Ajax.request({
    	    				   url:'/emergency/tovmManager!checkDeviceHasBeenDataPoint.action',
    	    				   params : {
    	    						'diskCloneId' : DISKCLONEID
    	    					},
    	    				   success: function(resp,opts) {
    	    					   var result=Ext.decode(resp.responseText);
    	    					   //TODO 
    	    					   if(result.isOrNo=="yes"){
    	    						   v.show();
    	    					   }else{
    	    						   v.hide();
    	    					   };
    	    				   },
    	    				   failure: function(resp,opts) {
    	    				   }
    	    			   });
		        	   }
		           }

	        },{
	        	xtype: 'panel',
	        	layout: 'hbox',
	        	width:'100%',
	        	id:'virtualNetWorkId',
	        	hidden:false, 
	        	bodyStyle:"border:0;border-bottom:1px solid #eee",
	        	items: [
	        	        {
	        	        	xtype: 'panel',
	        	        	width: 110,
	        	        	height:'100%',
	        	        	border:false,	
	        	        	padding:'0 0 0 10',
	        	        	style:'background:#fafbfc;',
	        	        	bodyStyle:'background:#fafbfc;',
	        	        	bodyCls:'vertical_text',
	        	        	html:local.web
	        	        },
	        	        {
	        	        	xtype: 'panel',
	        	        	flex:1,
	        	        	border:false,
	        	        	padding:"0 0 20 0",
	        	        	defaults: {
	        	        		border:false,
	        	        		margin: '10 0 0 10'
	        	        	},
	        	        	items:[
	        	        	       {
	        	        	    	   xtype: 'panel',
	        	        	    	   id:'netWordConfigId',
	        	        	    	   width: 550,
	        	        	    	   columns: 1,
	        	        	    	   items: [],
	        	        	    	   listeners:{
	        	        	    		   afterrender:function(){
	        	        	    		   	   listAllDeviceNic();
	        	        	    		       Ext.getCmp('virtualNetWorkId').setHeight(0);
	        	        	    		   }
	        	        	    	   }
	        	        	       }
	        	        	]
	        	        }
	        	      ]},{
                xtype: 'panel',
                layout: 'hbox',
                width:'100%',
                id:'virtualNetWorkPanel',
                hidden:true, 
                bodyStyle:"border:0;border-bottom:1px solid #eee",
                items: [
                        {
                            xtype: 'panel',
                            width: 110,
                            height:'100%',
                            border:false,   
                            padding:'0 0 0 10',
                            style:'background:#fafbfc;',
                            bodyStyle:'background:#fafbfc;',
                            bodyCls:'vertical_text',
                            html:local.web
                        },
                        {
                            xtype: 'panel',
                            flex:1,
                            border:false,
                            padding:"0 0 20 0",
                            defaults: {
                                border:false,
                                margin: '10 0 0 10'
                            },
                            items:[
                                   {
                                       xtype: 'panel',
                                       disable:true,
                                       id:'vmSubNet',
                                       width: 550,
                                       columns: 1,
                                       items: [{
                                               xtype: 'checkbox',
                                               boxLabel:'是否启用虚拟子网',
                                               border:false,
                                               columns:1,
                                               listeners:{
                                                   change:function(v,newValue, oldValue, eOpts ){
                                                           var vmNetComponent = v.nextSibling();
                                                           vmNetComponent.setReadOnly(!newValue);
                                                       }} 
                                            },{
                                               xtype: 'combobox',
                                               readOnly: true,  //默认未启用虚拟子网，列表设为只读
                                               displayField: 'computeVirtualNicName',
                                               valueField: 'computeVirtualNicId',
                                               fieldLabel: '虚拟子网',
                                               labelWidth:130,
                                               id: 'vmNet',
                                               width: 350,
                                               store:Ext.create('Ext.data.ArrayStore',{
                                                fields:[
                                                   {name: 'computeVirtualNicId'},//值
                                                   {name: 'computeVirtualNicName'},
                                                   {name: 'tip'}
                                                ]}
                                               ),
                                               listConfig: {
                                                 tpl: ['<table width="100%"><tpl for=".">', '<tr data-qtip="{tip}">', '<td role="option" class="x-boundlist-item">{computeVirtualNicName}</td>', '</tr>', '</tpl></table>']
                                               },
                                               queryMode:'local',
                                               editable : false
                                           }]
                                   }
                                   ]
                        }],
                        listeners:{
                            afterrender:function(v){
                                //集群演练模式显示
                                if(EMERGENCYTYPE == 2){
                                    v.show();
                                }
                            }
                        }
            }
	        ]
});

/**
 * 
 * dynamicAddNetWorkCards:点击增加网卡信息，动态添加网卡信息
 * @data 2016-4-7
 * @auth WangShaoDong
 */
/*function dynamicAddNetWorkCards(data){
	var netWordConfigId=Ext.getCmp("netWordConfigId");
	for(i=0;i<netWordConfigId.items.length;i++){
		var netWorkId=netWordConfigId.items.get(i).items.get(0).netWorkId;
		if(data.id==netWorkId){
			Ext.MessageBox.alert(local.window.tip,"当前网卡信息存在,请勿重复添加");
			return;
		}
	}
	for(i=0;i<data.length;i++){
		var AddNetworkConfig=Ext.create("acesure.emergency.view.AddNetworkConfig",{
			rawData:data[i].data
		});
		netWordConfigId.add(AddNetworkConfig);
	}
};*/



/*function addNetWordConfigByAll(){
	var netWordConfigId=Ext.getCmp("netWordConfigId");
	Ext.Ajax.request({
		url:'/emergency/tovmManager!getDeviceNetWork.action',
		params:{"vmManagerModel.deviceId":SourceDeviceId},
		timeout: 40000,
		success: function(resp,opts) {
			var netWorkInfoList=JSON.parse(resp.responseText);
			for(i=0;i<netWorkInfoList.length;i++){
				var AddNetworkConfig=Ext.create("acesure.emergency.view.AddNetworkConfig",{
					rawData:data
				});
				netWordConfigId.add(
						AddNetworkConfig
				);
			}

		},
		failure: function(resp,opts) {
		}
	});

};*/
/**
 * 
 * listDeviceAllHardDisks:创建虚拟机显示所有快照集硬盘，并默认选中系统盘，以及LVM中有系统盘的所有LVM盘
 * @data 2016-4-7
 * @auth WangShaoDong
 */
function listDeviceAllHardDisks(){
	var hardDiskAndVmdkId=Ext.getCmp("hardDiskAndVmdkId");
	Ext.Ajax.request({ 
		url:'/emergency/tovmManager!getHardDiskAndVmdk.action',
		params:{"vmManagerModel.snapSetId":SNAPSETID},
		timeout: 100000,
		success: function(resp,opts) {
			var vminfoList=JSON.parse(resp.responseText).detail;
			for(i=0;i<vminfoList.length;i++){
				var index=vminfoList[i].index;
				var totalSize=vminfoList[i].totalSize;
				var hardDiskId=vminfoList[i].hardDiskId;
				var vmdkId=vminfoList[i].vmdkId;
				var vmdkName=vminfoList[i].vmdkName;
				var id=vminfoList[i].id;
				var hasOs=vminfoList[i].hasOs;
				var lvm=vminfoList[i].lvm;
				var flag = vminfoList[i].flag;
				var boxLabelInfo='';
				var chk=null;
				
				var shareFlag = '';
				if(flag =="SharedDisk"){
					shareFlag = local.emergency.sharedDisk;
				}
				
				if(hasOs==2){//无系统
					if(lvm==2){//lvm
						boxLabelInfo='<span><i class="vm_icon vm_icon_disk"></i>['+local.disk+index+shareFlag+local.comma+local.capacity+local.colon+totalSize+'GB]</span>'+'<span>&nbsp;&nbsp;&nbsp;'+vmdkName+'</span>';
						chk = new Ext.form.Checkbox({boxLabel:boxLabelInfo, name: 'cb-auto-1',inputValue:id,checked:true,disabled:true}); 
					}else{
						boxLabelInfo='<span><i class="vm_icon vm_icon_disk"></i>['+local.disk+index+shareFlag+local.comma+local.capacity+local.colon+totalSize+'GB]</span>'+'<span>&nbsp;&nbsp;&nbsp;'+vmdkName+'</span>';
						chk = new Ext.form.Checkbox({boxLabel:boxLabelInfo, name: 'cb-auto-1',inputValue:id,checked:true}); 
					}
				}else{
					boxLabelInfo='<span><i class="vm_icon vm_icon_disk"></i>['+local.disk+index+shareFlag+local.emergency.systemDisk1+local.comma+local.capacity+local.colon+totalSize+'GB]</span>'+'<span>&nbsp;&nbsp;&nbsp;'+vmdkName+'</span>';
					chk = new Ext.form.Checkbox({boxLabel:boxLabelInfo, name: 'cb-auto-1',inputValue:id,checked:true,disabled:true}); 
				}
				hardDiskAndVmdkId.add(chk);
			}
		},
		failure: function(resp,opts) {
		}
	});
}

/**
 * 
 * addNetWorkByDeviceId:页面渲染时显示第一条网卡信息
 * @data 2016-4-7
 * @auth WangShaoDong
 */
/*function addNetWorkByDeviceId(){
	var netWork=Ext.getCmp(this.id);
	Ext.Ajax.request({
		url:'/emergency/tovmManager!getDeviceNetWork.action',
		params:{"vmManagerModel.deviceId":SourceDeviceId},
		timeout: 100000,
		success: function(resp,opts) {
			var netWorkInfo=JSON.parse(resp.responseText)[0];
			var id=netWorkInfo.id;
			var name=netWorkInfo.name;
			var ip=netWorkInfo.ip;
			var index=netWorkInfo.index;

			var updateStr='<span><i class="vm_icon vm_icon_disk"></i>'+local.emergency.card+index+'&nbsp;&nbsp;&nbsp;['+name+'('+ip+')]</span>';
			netWork.update(updateStr);
			//网卡Id
			netWork.netWorkId=id;
		},
		failure: function(resp,opts) {
		}
	});
}*/
/**
 * 
 * listAllDeviceNic:创建接管虚拟机一览显示设备所有网卡
 * @data 2016-9-6
 * @auth WangShaoDong
 * @param type=1:创建虚拟机显示网卡信息，type=2:修改虚拟机增加网卡，弹出窗口显示未设置的设备网卡信息。
 */
function listAllDeviceNic(){
	var netWordConfigId=Ext.getCmp("netWordConfigId");
	var netWorkStore=Ext.create("acesure.emergency.store.NetWorkListStore");
	netWorkStore.load({params:{"vmManagerModel.deviceId":SourceDeviceId,"vmManagerModel.netWorkId":"","vmManagerModel.type":1},

		callback:function(records, operation, success){

			//虚拟机预设置显示网络信息
			if(MODELINFO!=null){
				var nicList=MODELINFO.nicList;
				var nicArray=nicList.split(";");

				//设备网卡Id列表
				var deviceNicArray=new Array();
				//对应已经设置过的计算节点网卡信息
				var comNicArray=new Array();

				for(j=0;j<nicArray.length;j++){
					var virNicArray=nicArray[j].split(",");
					var virNicIndex=virNicArray[0];
					deviceNicArray[j]=virNicArray[1];
					comNicArray[j]=virNicArray[2];
				}

				//做过预设置的模板，再设置时默认自动选中先前的设置。
				for(i=0;i<records.length;i++){
					var checked=false;
					var index=-1;
					for(k=0;k<deviceNicArray.length;k++){
						if(deviceNicArray[k]==records[i].data.id){
							index=k;
							checked=true;
							break;
						}
					}
					
					//自动填充做过模板的设备设置的计算节点网卡信息
					var comId=index==-1?-1:comNicArray[index];
					netWordConfigId.add({
						xtype:"addNetworkConfig",
						rawData:records[i].data,
						check:checked,
						comIds:comId
					});

				}
			}else{//创建接管虚拟机显示网络信息
				var checked=false;
				for(i=0;i<records.length;i++){
					netWordConfigId.add({
						xtype:"addNetworkConfig",
						rawData:records[i].data,
						check:checked,
						comIds:-1//默认不设置计算节点网卡信息，用户添加完网卡后手动编辑网卡增加计算节点网卡桥接网络
					});
				}
			}
		}
	});
}
function switchComputeNodesUpdateNic(){
	var netWordConfigId=Ext.getCmp("netWordConfigId");
	var netWorkStore=Ext.create("acesure.emergency.store.NetWorkListStore");
	netWorkStore.load({params:{"vmManagerModel.deviceId":SourceDeviceId,"vmManagerModel.netWorkId":"","vmManagerModel.type":1},
		callback:function(records, operation, success){
			var checked=false;
			for(i=0;i<records.length;i++){
				netWordConfigId.add({
					xtype:"addNetworkConfig",
					rawData:records[i].data,
					check:checked,
					comIds:-1//默认不设置计算节点网卡信息，用户添加完网卡后手动编辑网卡增加计算节点网卡桥接网络
				});
			}
		}
	});
}

//设置权限相关
function initEmergencyAuthorizationPanel(deviceEmergency,remainTakeOver,remainEmulation){
	var emergencyAuthorizationPanel = Ext.getCmp("emergencyAuthorizationPanel");
	if(EMERGENCYTYPE == deviceEmergency){
		emergencyAuthorizationPanel.hide();
		Ext.getCmp("virtualMachWindowAddButton").setDisabled(false);
		return;
	}
	if(EMERGENCYTYPE == 2 && deviceEmergency == 1){
		Ext.getCmp("virtualMachWindowAddButton").setDisabled(false);
		emergencyAuthorizationPanel.hide();
		return;
	}
	emergencyAuthorizationPanel.show();
	if(remainTakeOver == -1){
		remainTakeOver = '无限制';
	}
	if(remainEmulation == -1){
		remainEmulation = '无限制';
	}
	Ext.getCmp("emergencyAuthorizationTextArea").update("应急剩余:<font color='red'>"+remainTakeOver+"</font>      演练剩余:<font color='red'>"+remainEmulation+"</font>");
	//禁用按钮
	Ext.getCmp("virtualMachWindowAddButton").setDisabled(true);
}

//单机设置权限
function initDeviceEmergencyAuthorizationPanel(){
	var emergencyAuthorizationPanel = Ext.getCmp("deviceEmergencyAuthorizationPanel");
	if(EMERGENCYTYPE == AUTHORITY){
		emergencyAuthorizationPanel.hide();
		Ext.getCmp("virtualMachWindowAddButton").setDisabled(false);
		return;
	}
	if(EMERGENCYTYPE == 2 && AUTHORITY == 1){
		Ext.getCmp("virtualMachWindowAddButton").setDisabled(false);
		emergencyAuthorizationPanel.hide();
		return;
	}
	
	Ext.Ajax.request({
		url:'/emergency/tovmManager!showEmergencyLicenseSize.action',
		timeout: 100000,
		async:false,
		success: function(resp,opts) {
			var licenseInfo=JSON.parse(resp.responseText);
			if(licenseInfo){
				var remainTakeOver = licenseInfo.remainTakeOver;
				var remainEmulation = licenseInfo.remainEmulation;
				emergencyAuthorizationPanel.show();
				if(remainTakeOver == -1){
					remainTakeOver = '无限制';
				}
				if(remainEmulation == -1){
					remainEmulation = '无限制';
				}
				Ext.getCmp("emergencyAuthorizationTextArea").update("应急剩余:<font color='red'>"+remainTakeOver+"</font>      演练剩余:<font color='red'>"+remainEmulation+"</font>");
				//禁用按钮
				Ext.getCmp("virtualMachWindowAddButton").setDisabled(true);
			}
		},
		failure: function(resp,opts) {
			Ext.MessageBox.alert(local.window.tip,local.emergency.deviceConfigVirError);
		}
	});
}
