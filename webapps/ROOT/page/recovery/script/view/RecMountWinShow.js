 //保存目标设备信息
var TargetDeviceInfo=null;
//克隆Id
var DISKID=null;
//源设备ID
var DestDeviceId=null;
//源系统类型
var SourceSysType=null;
//快照集ID
var SNAPSETID=null;
//挂载类型
var MOUNTTYPE=null;
//挂载Id
var MOUNTID=null;
//挂载名称
var MOUNTNAME=null;
/**
 *挂载配置模块
 *auth:wsd
 */
//windows挂载盘符
var REMOTEMOUNT_WIN=[
                     ['Z','Z:'],
                     ['Y','Y:'],
                     ['X','X:'],
                     ['W','W:'],
                     ['V','V:'],
                     ['U','U:'],
                     ['T','T:'],
                     ['S','S:'],
                     ['R','R:'],
                     ['Q','Q:'],
                     ['P','P:'],
                     ['O','O:'],
                     ['M','M:'],
                     ['N','N:'],
                     ['L','L:']
                     ];
//Linux挂载点
var REMOTEMOUNT_LIN=[
                     ['mount1','mount1'],
                     ['mount2','mount2'],
                     ['mount3','mount3'],
                     ['mount4','mount4'],
                     ['mount5','mount5'],
                     ['mount6','mount6'],
                     ['mount7','mount7']
                     ];

var WINDOWS=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28];
var LINUX=[32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92];

/**
 *目标设备页面
 */
Ext.define("acesure.recovery.view.RecMountWinShowP2",{
	extend:"Ext.panel.Panel",
	alias:"widget.recMountWinShowP2",
	border:false,
	style:"padding:20px",
	items:[
	       {
	    	   xtype:"panel",
	    	   width:'100%',
	    	   height:30,
	    	   border:false,
	    	   html:local.recovery.choosedTargetDevice
	       },{
	    	   xtype:"recSecondMountConfigLeft",
	    	   width:'100%',
	    	   height:200,
	    	   border:false
	       },{
	    	   xtype:'fieldset',
	    	   style:"margin-top:20px;padding-bottom:10px;",
	    	   title:local.explain,
	    	   collapsible:false,
	    	   autoHeight:true,
	    	   defaultType:'textfield',
	    	   html:local.recovery.mountWinExplain
	       },{
	    	   xtype:"form",
	    	   width:"100%",
	    	   layout:'vbox',
	    	   id:'p2From',
	    	   frame:false,	
	    	   defaults:{
	    		   allowBlank:false,
	    		   selectOnFocus:true,
	    		   msgTarget:'side'
	    	   },
	    	   style:"margin-top:10px;",
	    	   defaultType:'textfield',
	    	   bodyBorder:false,
	    	   border:false,
	    	   items:[
	    	          //配置挂载名称
	    	          {
	    	        	  fieldLabel:local.recovery.mountName,
	    	        	  width:"100%",
	    	        	  labelWidth:100,
	    	        	  id:'recRemotemountName',
	    	        	  value:'mount',
	    	        	  maxLength:30,
	    	        	  //enforceMaxLength:true,
	    	        	  regex:/^[a-zA-Z0-9_]*$/,
	    	        	  regexText:local.recovery.wrapNum,
	    	        	  listeners:{
	    	        		  afterrender:function(){
	    	        			  this.setValue(MOUNTNAME);
	    	        		  }
	    	        	  }
	    	          },
	    	          //设置挂载盘符
	    	          {
	    	        	  xtype:'combo',
	    	        	  mode:'local',
	    	        	  fieldLabel:local.recovery.mountDrive,
	    	        	  width:"100%",
	    	        	  labelWidth:100,
	    	        	  id:'recRemotemountpartLetter',
	    	        	  store:Ext.create('Ext.data.ArrayStore',{
	    	        	  	      fields:[{name:'value'},
	    	        	  	      	      {name:'text'}]
	    	        	  }),
	    	        	  queryMode:'local',
	    	        	  valueField:"value",
	    	        	  displayField:"text",
	    	        	  maxLength:30,
	    	        	  emptyText:local.recovery.chooseDisk,
	    	        	  regex:/^[a-zA-Z0-9_:\/\\]*$/,
	    	        	  regexText:local.recovery.wrapNumMore,
	    	        	/*  regex:/^(?!_)(?!.*?_$)[a-zA-Z0-9_\-]+$/,
	    	        	  regexText:"挂载盘符/目录只能包含字母，数字，下划线",*/
	    	        	  triggerAction:"all",
	    	        	  editable:true,
	    	        	  hidden:true,
	    	        	  listeners:{
	    	        		  afterrender:function(){
	    	        			  if(MOUNTTYPE==2||MOUNTTYPE==3||MOUNTTYPE==4||MOUNTTYPE==5){
	    	        				  this.hide();
	    	        			  }else{
	    	        				  if(LINUX.indexOf(SourceSysType)!=-1){
	    	        					  /*this.store=new Ext.data.SimpleStore({
	    	        						  fields:['value','text'],
	    	        						  data:REMOTEMOUNT_LIN
	    	        					  });*/
	    	        				  	this.store.loadData(REMOTEMOUNT_LIN);
	    	        				  }else{
	    	        					  /*this.store=new Ext.data.SimpleStore({
	    	        						  fields:['value','text'],
	    	        						  data:REMOTEMOUNT_WIN
	    	        					  });*/
	    	        				  	this.store.loadData(REMOTEMOUNT_WIN);
	    	        				  };
	    	        				  //console.log(MOUNTLETTER);
	    	        				  this.setValue(MOUNTLETTER);
	    	        				  this.show();
	    	        			  }
	    	        		  }
	    	        	  }
	    	          },
	    	          {
	    	        	  xtype:'combo',
	    	        	  queryMode:'local',
	    	        	  layout:'hbox',
	    	        	  labelWidth:100,
	    	        	  fieldLabel:local.recovery.mountTarget,
	    	        	  width:"100%",
	    	        	  id:'recSelectConnectionStr',
	    	        	  valueField:"value",
	    	        	  displayField:"text",
	    	        	  emptyText:local.recovery.plMountTarget,
	    	        	  editable:false,
	    	        	  triggerAction:"all",
	    	        	  margin:"10 0 0 0",
	    	        	  store:'ConnectionMountStore'
	    	        	  //hidden:true
	    	          }
	    	          ]}]
});

/**
 *目标设备配置页面
 */
Ext.define("acesure.recovery.view.RecSecondMountConfigLeft",{
	extend:"Ext.tree.TreePanel",
	alias:"widget.recSecondMountConfigLeft",
	id:"recSecondMountConfigLeftId",
	useArrows:true,
	border:false,
	style:'border:1px solid #b5b8c8',
	rootVisible:false,	//不可见根
	multiSelect:true,
	loadMask:{msg:local.dataLoading},
	initComponent : function() {
		var me = this;
		var configTarget=Ext.create("acesure.recovery.store.ConfigTargetDevice");
		configTarget.load({params:{sysType:SourceSysType,mountType:MOUNTTYPE},
			callback: function(records, operation, success) {
				if(DestDeviceId){
					var record = null;
					for(i=0;i<records.length;i++){
						tRecord=records[i];
						if(DestDeviceId==tRecord.get("deviceId")){
							record=tRecord;
						}
					};
					if(record){
						me.getSelectionModel().select(record);
						TargetDeviceInfo=record.data;
						var connectionStr=Ext.getCmp("recSelectConnectionStr");
						connectionStr.store.load({params:{deviceTreeId:TargetDeviceInfo.deviceId,type:MOUNTTYPE}});
						//console.log(MOUNTTYPE);
						if(MOUNTTYPE==2||MOUNTTYPE==3||MOUNTTYPE==4||MOUNTTYPE==5){
							connectionStr.setValue("0");
							connectionStr.show();
						}else{
							connectionStr.hide();
						};
					}
				}
			 }	
		});
		Ext.applyIf(me, {
			store:configTarget,
			columns:[{
				xtype:'treecolumn',
				header:"<img src='/images/recovery/device.png'/>&nbsp"+local.recovery.localRecovery,
				width:"100%",
				sortable:false,
				renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
					
					var name=record.data["computerName"];
					var ip=record.data["ip"];
					if(MOUNTTYPE==2||MOUNTTYPE==4){
						return name+"("+ip+")"+"[ISCSI]";
					}else if(MOUNTTYPE==3||MOUNTTYPE==5){
						return name+"("+ip+")"+"[FC]";
					}else{
						return name+"("+ip+")"+"["+local.recovery.mountWinPart+"]";
					};
				}
			}]
		});
		me.callParent(arguments);
	},
	listeners:{
		itemclick:function(store,record,item,index,e,eOpts){
			var deviceB=record.data;
			TargetDeviceInfo=deviceB;
			var connectionStr=Ext.getCmp("recSelectConnectionStr");
			if(null==TargetDeviceInfo){
				Ext.MessageBox.alert(local.window.tip,local.recovery.targetDeviceChoose);
				this.setValue({"mount_type":1});
			}else{
				var deviceId=TargetDeviceInfo.deviceId;
				connectionStr.store.load({params:{deviceTreeId:deviceId,type:MOUNTTYPE}});
				if(MOUNTTYPE==2||MOUNTTYPE==3||MOUNTTYPE==4||MOUNTTYPE==5){
					connectionStr.setValue("0");
					connectionStr.show();
				}else{
					connectionStr.hide();
					connectionStr.setValue("none");
				};
			}
		}

	}
});	

/**
 *配置，目标设备汇总页面
 */
Ext.define("acesure.recovery.view.RecMountWinShowTot",{
	extend:"Ext.panel.Panel",
	alias:"widget.recMountWinShowTot",
	id:"recMountWinShowTotId",
	height:'100%',
	activeItem:0,
	border:false,
	items:[
	       {xtype:"recMountWinShowP2",id:"p1"}
	       ],
	       buttons:[{
	    	   text:local.btn.save,
	    	   cls:"btn_focus",
	    	   textAlign:'center',
	    	   id:'recCreataRemoteMountBnt3',
	    	   handler:function(){
	    		   
//	    		   var recRegex=/^(?!_)(?!.*?_$)[a-zA-Z0-9_\-]+$/;
	    		   
	    		   var recRegexList=/^[a-zA-Z0-9_:\/\\]*$/;
	    		   var recRegex=/^[a-zA-Z0-9_]*$/;
	    		   if(null==TargetDeviceInfo){
	    			   Ext.MessageBox.alert(local.window.tip,local.recovery.targetDeviceChoose);
	    			   return false;
	    		   }

	    		   var mountLetter=Ext.getCmp('recRemotemountpartLetter').getValue();
	    		   if(MOUNTTYPE==1&&(null==mountLetter||mountLetter.replace(/(^s*)|(s*$)/g, "").length ==0)){
	    			   Ext.MessageBox.alert(local.window.tip,local.recovery.mountConfiguration);
	    			   return false;
	    		   }
	    		   if(MOUNTTYPE==1&&mountLetter.length>30){
	    			   Ext.MessageBox.alert(local.window.tip,local.recovery.mountDiskLenghtLongTip);
		    			  return false;
	    		   }
	    		   if(MOUNTTYPE==1&&(!mountLetter.match(recRegexList))){
	    			   Ext.MessageBox.alert(local.window.tip,local.recovery.mountDrive+local.recovery.wrapNumMore);
	    			   return false;
	    		   }

	    		   var webName=Ext.getCmp('recRemotemountName').getValue();
	    		  if(!webName.match(recRegex)){
    				   Ext.MessageBox.alert(local.window.tip,local.recovery.underline);
    				   return false;
	    		   }
	    		  //挂载名称不允许为空（nico添加）
	    		  if(webName.length==0){
	    			  Ext.MessageBox.alert(local.window.tip,local.recovery.mountNameNoNull);
	    			  return false;
	    		  }
	    		  if(webName.length>30){
	    			  Ext.MessageBox.alert(local.window.tip,local.recovery.mountNameLenghtLongTip);
	    			  return false;
	    		  }
	    		   var conStr=Ext.getCmp('recSelectConnectionStr').getRawValue();
	    		   var myMask = new Ext.LoadMask("recMountWinShowTotId", {   
	    			   msg :local.recovery.BeConfiguration
	    		   });	
	    		   myMask.show();
	    		   Ext.Ajax.request({
	    			   url:'/recovery/mountAction!updateMountInfo.action',
	    			   timeout: 100000,
	    			   params:{
	    				   reMountLetter:mountLetter,
	    				   mountId:MOUNTID,
	    				   tarId:TargetDeviceInfo.deviceId,
	    				   conncetionStr:conStr,
	    				   mountType:MOUNTTYPE,
	    				   mountWebName:webName
	    			   }, 
	    			   success: function(resp,opts) {
	    				   myMask.hide();
	    				   var mountRes=JSON.parse(resp.responseText);
	    				   // var mountListStore=Ext.getCmp("mountListId").getStore();
	    				   showMsg(mountRes);
	    				   Ext.getCmp('recMountConfigWindowId').close();

	    				   var mountList=Ext.getCmp("mountListId");

	    				   var mountListStore=mountList.getStore();
	    				   mountListStore.load({
	    					   callback:function(records, operation, success){
	    						   var record = null;
	    						   for(i=0;i<records.length;i++){
	    							   tRecord=records[i];
	    							   if(MOUNTID==tRecord.get("mountId")){
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
//	    				   Ext.MessageBox.alert(local.window.tip,local.recovery.tipMountConfigError);
	    				   Ext.websure.MsgError("WF-30123",local.recovery.tipMountConfigError);
	    			   }
	    		   });
	    	   }
	       }
	       ,
	       {
	    	   text:local.btn.cancle,
	    	   id:'cancel',
	    	   handler:function(){
	    		   Ext.getCmp('recMountConfigWindowId').close();
	    	   }
	       }]
});


Ext.define("acesure.recovery.view.RecMountWinShow",{
	extend:'Ext.window.Window',
	id:"recMountConfigWindowId",
	title:local.btn.mountConfig,
	draggable:true,
	height:520,						//高度
	width:600,						//宽度
	modal:true,//是否模态窗口，默认为false
	resizable:false,
	layout:"fit",
	items:[{region:'center',xtype:"recMountWinShowTot"}],
	initComponent:function(){
		DISKID=this.diskID;
		SourceSysType=this.typeWin;
		VMID=this.vmID;
		PARID=this.partID;
		DestDeviceId=this.deviceID;
		MOUNTTYPE=this.mountType;
		MOUNTPOWER=this.mountPower;
		MOUNTLETTER=this.mountLetter;
		MOUNTID=this.mountId;
		MOUNTNAME=this.mountName;
		TargetDeviceInfo=null;
		this.callParent();
	}
});