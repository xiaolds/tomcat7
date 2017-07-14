//保存目标设备信息
var TargetDeviceInfo=null;
//克隆Id
var DISKCLONEID=null;
//源设备ID
var SourceDeviceId=null;
//源系统类型
var SourceSysType=null;
//快照集ID
var SNAPSETID=null;
//选中的快照Id
var SNAPSHOTID=null;
//选中的分区Id
var PARID=null;
//挂载类型
var MOUNTTYPE=null;
//挂载权限
var MOUNTPOWER=null;
//硬盘ID
var HARDDISKID=null;

/**
 *挂载设置模块
 *auth:wangshaodong
 */
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
 *点击挂载设置按钮弹出窗口，左侧按钮（快照选择，设置，目标设备）
 */
Ext.define("acesure.recovery.view.LeftButton",{
	extend:"Ext.panel.Panel",
	alias:"widget.leftButton",
	id:"leftButtonId",
	width:150,
	border:false,
	layout:"vbox",
	cls:'left_tree',
	items:[
	       //设置分区
	       {
	    	   xtype:"button",
	    	   width:150,
	    	   style:'padding-left:26px;',
	    	   textAlign:'left',
	    	   icon:'/images/common/set_black.png',
	    	   text:local.btn.config,
	    	   id:"mountSettingId"
	       },
	       //目标设备
	       {
	    	   xtype:"button",
	    	   width:150,
	    	   style:'padding-left:26px;',
	    	   textAlign:'left',
	    	   icon:'/images/common/pc_online_one.png',
	    	   text:"目标设备",
	    	   id:"targetDeviceId",
	    	   disabled:"true"
	       }
	       ]

});

/**
 * 快照选择，分区选择设置页面
 */
Ext.define("acesure.recovery.view.MountWinShowP1",{
	extend:"Ext.panel.Panel",
	alias:"widget.mountWinShowP1",
	border:false,
	items:[
	       {
	    	   xtype:'snapShotTreeGrid',
	    	   overflowY:'auto',
	    	   height:300
	       },
	       {
	    	   xtype:"form",
	    	   layout:'form',
	    	   id:'p2From',
	    	   labelWidth:55,
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
	    	   layout:"vbox",
	    	   items:[
	    	          //设置挂载名称
	    	          {
	    	        	  width:"100%",
	    	        	  fieldLabel:local.recovery.mountName,
	    	        	  id:'remotemountName',
	    	        	  labelWidth:115,
	    	        	  disabled:false,
	    	        	  value:'mount',
	    	        	  maxLength:30,
	    	        	  enforceMaxLength:true,
//	    	        	  regex:/^(?!_)(?!.*?_$)[a-zA-Z0-9_]+$/,
	    	        	  regex:/^[a-zA-Z0-9_]*$/,
	    	        	  regexText:local.recovery.wrapNum,
	    	        	  listeners:{
	    	        		  render:function(){
	    	        			  this.setValue("mount_"+new Date().getTime());
	    	        		  }
	    	        		 
	    	        	  }
	    	          },
	    	          //设置挂载盘符
	    	          {
	    	        	  width:"100%",
	    	        	  xtype:'combo',
	    	        	  mode:'local',
	    	        	  fieldLabel:local.recovery.mountDriveDirectory,
	    	        	  labelWidth:115,
	    	        	  id:'remotemountpartLetter',
	    	        	  valueField:"value",
	    	        	  displayField:"text",
	    	        	  emptyText:local.recovery.plMountDriveDirectory,
	    	        	  maxLength:30,
	    	        	  enforceMaxLength:true,
//	    	        	  regex:/^(?!_)(?!.*?_$)[a-zA-Z0-9_:]+$/,
	    	        	  regex:/^[a-zA-Z0-9_:\/\\]*$/,
	    	        	  //regexText:local.recovery.wrapNum,
	    	        	  regexText:local.recovery.wrapNumMore,
	    	        	  hidden:true,
	    	        	  editable:true,
	    	        	  listeners:{
	    	        		  render:function(){
	    	        			  if(LINUX.indexOf(parseInt(SourceSysType))!=-1){
	    	        				  this.store=new Ext.data.SimpleStore({
	    	        					  fields:['value','text'],
	    	        					  data:REMOTEMOUNT_LIN
	    	        				  });
	    	        				 // this.setValue("mount1");
	    	        			  }else{
	    	        				  this.store=new Ext.data.SimpleStore({
	    	        					  fields:['value','text'],
	    	        					  data:REMOTEMOUNT_WIN
	    	        				  });
	    	        				  //this.setValue("Z");
	    	        			  };
	    	        		  }
	    	        	  }
	    	          },{
	    	        	  width:"100%",
	    	        	  height:50,
	    	        	  xtype:"fieldset",
	    	        	  title:local.explain,
	        	          collapsible:false,
	        	          html:local.recovery.TCPDisk
	    	          }
	    	          ]
	       }
	       ]
});
/**
 *目标设备页面
 */
Ext.define("acesure.recovery.view.MountWinShowP2",{
	extend:"Ext.panel.Panel",
	alias:"widget.mountWinShowP2",
	border:false,
	items:[
	       {
	    	   xtype:"panel",
	    	   width:'100%',
	    	   height:30,
	    	   border:false,
	    	   items:[
	    	          {
	    	        	  xtype:"label",
	    	        	  html:local.recovery.chooseTargetDevice+"&nbsp;"
	    	          },
	    	          {
	    	        	  xtype:"button",
	    	        	  text:local.recovery.matchSystem,
	    	        	  cls:'ie8 btn_node_active',
	    	        	  border:false,
	    	        	  style:'padding-left:26px;background:none',
	    	        	  icon : '/images/common/list.png',
	    	        	  handler:function(){
	    	        		  var fileViewBut = this.nextSibling();    //获取文件浏览按钮
	    	        		  fileViewBut.removeCls('btn_node_active');
	    	        		  this.addCls('btn_node_active');
	    	        		  var targetDeviceCon=Ext.getCmp("secondMountConfigLeftId").store;
	    	        		  targetDeviceCon.load({params:{sysType:SourceSysType}});
	    	        	  }
	    	          }/*,
	    	          {
	    	        	  xtype:"button",
	    	        	  text:local.recovery.matchMountTypeList,
	    	        	  cls:'ie8',
	    	        	  border:false,
	    	        	  style:'padding-left:26px;background:none',
	    	        	  icon : '/images/common/run.png',
	    	        	  handler:function(){
	    	        		  var fileViewBut = this.previousSibling();    //获取文件浏览按钮
	    	        		  fileViewBut.removeCls('btn_node_active');
	    	        		  this.addCls('btn_node_active');
	    	        		  var targetDeviceConAll=Ext.getCmp("secondMountConfigLeftId").store;
	    	        		  targetDeviceConAll.load();
	    	        	  }
	    	          }*/]
	       },
	       {
	    	   xtype:"panel",
	    	   width:'100%',
	    	   style:'margin-top:20px',
	    	   layout:"hbox",
	    	   border:false,
	    	   items:[
	    	          {
	    	        	  xtype:"panel",
	    	        	  flex:1.4,
	    	        	  height:300,
	    	        	  border:false,
	    	        	  items:{xtype:"secondMountConfigLeft"}
	    	          },{
	    	        	  xtype:"panel",
	    	        	  style:"margin-left:10px",
	    	        	  flex:1,
	    	        	  height:300,
	    	        	  border:false,
	    	        	  items:[
	    	        	         {
	    	        	        	 id:'checkTargetDeviceInfo',
	    	        	        	 xtype:'fieldset',
	    	        	        	 width:"100%",
	    	        	        	 title:local.recovery.targetDeviceName,
	    	        	        	 collapsible:false,
	    	        	        	 autoHeight:true,
	    	        	        	 html:local.recovery.chooseDevice
	    	        	         },{
	    	        	        	 xtype:'fieldset',
	    	        	        	 id:'mountCautionId',
	    	        	        	 style:"margin-top:20px;padding-bottom:10px;",
	    	        	        	 title:local.explain,
	    	        	        	 width:"100%",
	    	        	        	 collapsible:false,
	    	        	        	 autoHeight:true,
	    	        	        	 defaultType:'textfield',
	    	        	        	 html:local.recovery.mountWinExplain
	    	        	         }/*,{
	    	        	        	 xtype:'label',
	    	        	        	 id:'mountCautionId',
	    	        	        	 hidden:true,
	    	        	        	 html:"<font style='font-weight:bold;' color='red'>*&nbsp当前设备无法设置ISCSI和FC挂载</font>"
	    	        	         }*/
	    	        	         ]
	    	          }
	    	          ]},
	    	          {
	    	        	  xtype:"radiogroup",
	    	        	  fieldLabel:local.recovery.mountType,
	    	        	  id:"mountTypeId",
	    	        	  width:'100%',
	    	        	  columns:3,
	    	        	  margin:"20 0 0 0",
	    	        	  items:[
	    	        	         {boxLabel:local.recovery.mountWinPart,name:'mount_type',inputValue:1},
	    	        	         {boxLabel:local.recovery.ISCSIMount,name:'mount_type',inputValue:2},
	    	        	         {boxLabel:local.recovery.FCMount,name:'mount_type',inputValue:3}
	    	        	         ],
	    	        	         listeners:{
	    	        	        	 change:function(me, newValue, oldValue, eOpts){
	    	        	        		 if(null==TargetDeviceInfo){
	    	        	        			 Ext.MessageBox.alert(local.window.tip,local.recovery.targetDeviceChoose);
	    	        	        			 this.reset();
	    	        	        		 }else{

	    	        	        			 var deviceId=TargetDeviceInfo.deviceId;
	    	        	        			 var mountType=this.getValue().mount_type;
	    	        	        			 
                                             //--begin---检测FC挂载授权
                                             if(mountType==3){
                                                    Ext.Ajax.request({
                                                         url:'/recovery/recoveryAction!findStorageAuth.action',
                                                           success: function(resp,opts) {
                                                               var sysAuth=JSON.parse(resp.responseText);  //解析系统授权信息
                                                               if(!sysAuth.enableFCMount){
                                                                    //提示FC挂载功能未授权,并设置FC挂载禁用
                                                                    Ext.websure.MsgError(local.unAuth,local.recovery.FCMount+local.recovery.noAuthPleApplyAuth);
                                                                    me.items.get(2).setDisabled(true);  //设置FC挂载禁用
                                                                    me.reset();  //重置选择
                                                                    return;
                                                               }
                                                           }
                                                });
                                             }
                                            //--end---检测FC挂载授权
                                            
	    	        	        			 var connectionStr=Ext.getCmp("selectConnectionStr");
	    	        	        			 if(mountType==2||mountType==3){
	    	        	        				 connectionStr.store.load({params:{deviceTreeId:deviceId,type:mountType}});
	    	        	        				 connectionStr.setValue("0");
	    	        	        				 connectionStr.show();
	    	        	        			 }else{
	    	        	        				 connectionStr.hide();
	    	        	        			 };
	    	        	        		 }
	    	        	        	 },
	    	        	        	 afterrender:function(){
	    	        	        		 if(PARID==null){
	    	        	        			 this.items.get(0).setDisabled(true);
	    	        	        		 }else{
	    	        	        			 this.items.get(0).setDisabled(false);
	    	        	        			 this.items.get(1).setDisabled(true);
	    	        	        			 this.items.get(2).setDisabled(true);
	    	        	        		 }

	    	        	        	 }
	    	        	         }
	    	          },
	    	          {
	    	        	  xtype:"radiogroup",
	    	        	  fieldLabel:local.recovery.mountPower,
	    	        	  id:"mountPowerId",
	    	        	  width:'100%',
	    	        	  columns:3,
	    	        	  margin:"20 0 0 0",
	    	        	  items:[
	    	        	         {boxLabel:local.powerRead,name:'mountAuthority',inputValue:1},
	    	        	         {boxLabel:local.powerReadWrite,name:'mountAuthority',inputValue:2}
	    	        	         //{boxLabel:"读/写（数据保留）",name:'mountAuthority',inputValue:2},
	    	        	         //{boxLabel:"读/写（数据不保留）",name:'mountAuthority',inputValue:3},
	    	        	         ],
	    	        	         listeners:{
	    	        	        	 afterrender:function(v){
	    	        	        		 if(PARID!=null){
	    	        	        			 this.items.get(1).setDisabled(true);
	    	        	        			 //this.items.get(2).setDisabled(true);
	    	        	        			 v.setValue({mountAuthority:1});
	    	        	        		 }else{
	    	        	        			 this.items.get(0).setDisabled(false);
	    	        	        			 this.items.get(1).setDisabled(false);
	    	        	        			 //this.items.get(2).setDisabled(false);
	    	        	        			 v.setValue({mountAuthority:2});
	    	        	        		 }
	    	        	        	 },
	    	        	        	 change:function( v, newValue, oldValue, eOpts ){
	    	        	        		 //windows系统挂只读可能会出问题给用户提示
	    	        	        		 if(PARID==null){
	    	        	        			 if(TargetDeviceInfo!=null&&TargetDeviceInfo.sysType==0&&newValue.mountAuthority==1){
	    	        	        				 Ext.MessageBox.alert(local.window.tip,local.recovery.winSysMountSuggestion);
	    	        	        				 return false;
	    	        	        			 }
	    	        	        		 }
	    	        	        	 }
	    	        	         }

	    	          },
	    	          {
	    	        	  xtype:'combo',
	    	        	  queryMode:'local',
	    	        	  layout:'hbox',
	    	        	  cls:"combo_width",
	    	        	  fieldLabel:local.recovery.mountTarget,
	    	        	  id:'selectConnectionStr',
	    	        	  valueField:"value",
	    	        	  displayField:"text",
	    	        	  emptyText:local.recovery.plMountTarge,
	    	        	  editable:false,
	    	        	  triggerAction:"all",
	    	        	  margin:"20 0 0 0",
	    	        	  store:'ConnectionMountStore',
	    	        	  hidden:true
	    	          }
	    	          ]
});

/**
 *目标设备设置页面
 */
Ext.define("acesure.recovery.view.SecondMountConfigLeft",{
	extend:"Ext.tree.TreePanel",
	alias:"widget.secondMountConfigLeft",
	id:"secondMountConfigLeftId",
	useArrows:true,
	border:false,
	style:'border:1px solid #b5b8c8',
	rootVisible:false,//不可见根
	multiSelect:true,
	height:300,
	loadMask:{msg:local.dataLoading},
	initComponent : function() {
		var me = this;

		var targetDeviceStore=Ext.create("acesure.recovery.store.RemoteMountTargetMac");
		targetDeviceStore.load({params:{sysType:SourceSysType}});

		Ext.applyIf(me, {
			store:targetDeviceStore,
			columns:[{
				xtype:'treecolumn',
				header:"<img src='/images/recovery/device.png'/>&nbsp"+local.recovery.localRecovery,
				width:"100%",
				sortable:false,
				renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
					var ip=record.data["ip"];
					var name=record.data["computerName"];
					var sysType=record.data["sysType"];
					var clientSystype=record.data["clientSystype"];
					/*if(clientSystype<SourceSysType){
						return "";
					};*/
					
					if(sysType==0){
						return name+"("+ip+")"+"[Window]";
					}else{
						return name+"("+ip+")"+"[Linux]";
					};
				}
			}]
		});
		me.callParent(arguments);
	},
	listeners:{
		itemclick:function(store,record,item,index,e,eOpts){
			var deviceB=record.data;
			var sysType=null;
			if(deviceB.sysType==0){
				sysType="Windows";
			}else{
				sysType="Linux";
			}
			var deviceInfo="<table>";
			deviceInfo+="<tr><td>"+local.pcName+local.colon+"</td><td class='config_font_color'>"+deviceB["computerName"]+"</td></tr>";
			deviceInfo+="<tr><td>"+local.IP+local.colon+"</td><td class='config_font_color'>"+deviceB.ip+"</td></tr>";
			deviceInfo+="<tr><td>"+local.pcID+local.colon+"</td><td class='config_font_color'>"+deviceB.deviceId+"</td></tr>";
			deviceInfo+="<tr><td>"+local.sysType+local.colon+"</td><td class='config_font_color'>"+sysType+"</td></tr>";
			deviceInfo+="</table>";
			Ext.getCmp('checkTargetDeviceInfo').body.dom.innerHTML=deviceInfo;
			TargetDeviceInfo=deviceB;

			var fc=TargetDeviceInfo.fc;
			var iscsi=TargetDeviceInfo.iscsi;

			var mountTypeId=Ext.getCmp("mountTypeId");
			mountTypeId.reset();

			if(fc==1&&PARID==null){//可以进行fc挂载
				mountTypeId.items.get(2).setDisabled(false);
			}else{//不可以进行fc挂载
				mountTypeId.items.get(2).setDisabled(true);
			}
			if(iscsi==1&&PARID==null){//可以进行iscsi挂载
				mountTypeId.items.get(1).setDisabled(false);
			}else{//不可以进行iscsi挂载
				mountTypeId.items.get(1).setDisabled(true);
			}
			if(iscsi!=1&&fc!=1&&PARID==null){
				var preHtml=local.recovery.mountWinExplain+'<br>';
				 preHtml=preHtml+"<font style='font-weight:bold;' color='red'>"+local.recovery.configure+"</font>";
				 Ext.getCmp("mountCautionId").update(preHtml);
			}else{
				var preHtml=local.recovery.mountWinExplain;
				Ext.getCmp("mountCautionId").update(preHtml);
			}
		}
	}
});
Ext.define('acesure.recovery.view.SnapShotTreeGrid',{
	extend:'Ext.tree.Panel',
	alias:'widget.snapShotTreeGrid',
	id:"snapShotTreeGridId",
	useArrows:true,
	rootVisible:false,
	border:true,
	frame:false,
	sortable:false,
	loadMask : {
		msg : local.loading
	},
	initComponent : function() {
		var me = this;
		var vmInfoStore=Ext.create("acesure.recovery.store.VmingInfoStore");
		vmInfoStore.load({params:{diskCloneId:DISKCLONEID,snapSetId:SNAPSETID}});
		Ext.applyIf(me, {
			store:vmInfoStore,
			columns : [{
				xtype : 'treecolumn',
				text : local.disk,
				flex : 2.5,
				sortable : true,
				dataIndex : 'diskAndVmdkName'
			},
			{
				xtype : 'numbercolumn',
				format : '0.0G',
				text : local.backup.diskInfoGridSize,
				flex : 1,
				sortable : true,
				dataIndex : 'parTotalSec',
				align : 'center'
			},{
				xtype : 'numbercolumn',
				text :local.recovery.startSector,
				flex : 1,
				sortable : true,
				dataIndex : 'parStartSec',
				align : 'center'
			}, {
				text : local.recovery.diskInfoGridFormat,
				flex : 1,
				dataIndex : 'parFileSystem'
			}, {
				text : "挂载点",
				flex : 1,
				dataIndex : 'lvmPoint'
			}/*,
			{text:'运行状态',dataIndex:'runningStatus',flex:1,renderer:function(v,m,r){
				//根据分区运行状态去判断
				if(v=="0"){
					return"<imgsrc='/images/common/green.png'></img>&nbsp;&nbsp;<fontstyle='color:green'>"+local.backup.diskInfoGridStateNot+"</font>";
				}else if(v=="1"){
					return"<imgsrc='/images/common/green.png'></img>&nbsp;&nbsp;<fontstyle='color:green'>"+local.recovery.mirror+"</font>";
				}else if (v=="2"){
					return"<imgsrc='/images/common/gray.png'></img>&nbsp;&nbsp;<fontstyle='color:gray'>"+local.backup.diskInfoGridStateOver+"</font>";
				}else if (v=="3"){
					return"<imgsrc='/images/common/gray.png'></img>&nbsp;&nbsp;<fontstyle='color:gray'>"+local.backup.diskInfoGridStateError+"</font>";
				}else if(v=="4"){
					return"<imgsrc='/images/common/gray.png'></img>&nbsp;&nbsp;<fontstyle='color:gray'>"+local.recovery.check+"/font>";
				}else if(v=="5"){
					return"<imgsrc='/images/common/gray.png'></img>&nbsp;&nbsp;<fontstyle='color:gray'>"+local.recovery.error+"</font>";
				}else{
					return "";
				}
			}}*/
			]
		});
		me.callParent(arguments);
	},
	listeners:{

		//LVM挂载

		checkchange:function(node, checked,obj){
			var treeGrid=Ext.getCmp("snapShotTreeGridId");
			if(!node.loaded){//子节点是否加载  
				node.expand();  
			}
			
			if(node.parentNode.id==treeGrid.getRootNode().id){//当前结点为选择的硬盘节点
				//判断硬盘节点是全选还是非全选
				if(checked){
					//清空其他硬盘的选中状态
					var diskChedked=treeGrid.getChecked();
					for(var i=0;i<diskChedked.length;i++){
						var n = diskChedked[i];
						if(node.get("id") != n.get("id")){
							n.set("checked" , false);
						}
					}
					//选中所有子节点
					selChild(node, checked);
					HARDDISKID=node.raw.hardDiskId;
					SNAPSHOTID=node.get("snapShotId");
				}else{
					//清除所有子节点
					dSelChild(node, checked);
					//HARDDISKID=null;
				}
				//不显示挂载目录
				Ext.getCmp('remotemountpartLetter').hide();
				//分区信息置空
				PARID=null;
				
			}else{//选中的是分区节点
				var checkedNodes = this.getChecked();
				//父节点是否被选中，如果选中则清除除本节点以外的其他节点,在选中本节点
				if(node.parentNode.data.checked){
					for(var i=0;i<checkedNodes.length;i++){
						var n = checkedNodes[i];
						n.set("checked" , false);
					}
					node.set("checked" , true);
				}else{//父节点未选中，则做本节点的常规操作单选处理
					for(var i=0;i<checkedNodes.length;i++){
						var n = checkedNodes[i];
						if(node.get("id") != n.get("id")){
							n.set("checked" , false);
						}
					}
				}
				//保存分区信息
				PARID=node.raw.parId;
				//硬盘信息置空
				HARDDISKID=null;
				//快照信息
				SNAPSHOTID=node.get("snapShotId");
				//显示挂载目录
				Ext.getCmp('remotemountpartLetter').show();
			};
			
			if(this.getChecked().length==0){
				SNAPSHOTID=null;
			}
			
			/*if(node。){
				
			};*/
			
			//父姐节点选择选中子节点
			
			/*var checkedNodes = this.getChecked();
			for(var i=0;i<checkedNodes.length;i++){
				var n = checkedNodes[i];
				if(node.get("id") != n.get("id")){
					n.set("checked" , false);
				}
			}
			if(this.getChecked().length!=0){
				PARID=node.raw.parId;
				HARDDISKID=node.raw.hardDiskId;
				SNAPSHOTID=node.get("snapShotId");
				if(HARDDISKID==null){
					Ext.getCmp('remotemountpartLetter').show();
				}else{
					Ext.getCmp('remotemountpartLetter').hide();
				}

			}else{
				SNAPSHOTID=null;
				PARID=null;
				HARDDISKID=null;
			}*/
		}
	}
});
function dSelParent(node, checked) {
	if (checked) {
		if (node.parentNode.id!="service_root_check_node") {
			node.parentNode.ui.checkbox.checked = checked;
			node.parentNode.attributes.checked = checked;
			selParent(node.parentNode, checked);
		}
	}
}
function selChild(node, checked) {
	node.eachChild(function(child) {
		child.set("checked" , true);
	/*child.ui.checkbox.checked = checked;
	child.attributes.checked = checked;
	selChild(child, checked);*/
	});
}
function dSelChild(node, checked) {
	node.eachChild(function(child) {
		child.set("checked" , false);
	/*child.ui.checkbox.checked = checked;
	child.attributes.checked = checked;
	selChild(child, checked);*/
	});
}
/**
 *设置，目标设备汇总页面
 */
Ext.define("acesure.recovery.view.MountWinShowTot",{
	extend:"Ext.panel.Panel",
	alias:"widget.mountWinShowTot",
	id:"mountWinShowTotId",
	layout:'card',
	//height:'100%',
	cls:'config',
	style:'background:#fff;border-left:1px solid #d1dade;padding:20px;',
	activeItem:0,
	border:false,
	items:[
	       {
	    	   xtype:"mountWinShowP1",id:"p0"}
	       ],
	       buttons:[
	                {
	                	text:local.btn.previous,
	                	textAlign:'center',
	                	id:'creataRemoteMountBnt1',
	                	disabled:true,
	                	hidden:true,
	                	handler:changePage
	                },{
	                	text:local.btn.next,
	                	textAlign:'center',
	                	id:'creataRemoteMountBnt2',
	                	handler:changePage
	                },
	                {
	                	text:local.btn.save,
	                	textAlign:'center',
	                	id:'creataRemoteMountBnt3',
	                	cls:"btn_focus",
	                	disabled:true,
	                	handler:function(){
	                		 
//	                		var regex=/^(?!_)(?!.*?_$)[a-zA-Z0-9_]+$/;
	                		var regexList=/^[a-zA-Z0-9_:\/\\]*$/;
	                		var regex=/^[a-zA-Z0-9_]*$/;
	                		var mountName=Ext.getCmp('remotemountName').getValue();
	                		if(!mountName.match(regex)){
	                			Ext.MessageBox.alert(local.window.tip,local.recovery.underline);
	                			return false;
	                		}
	                		/*if(mountName.length>30){
	                			Ext.MessageBox.alert(local.window.tip,"挂载名称长度超过限制");
	                			return false;
	                		}*/
	                		if(null==TargetDeviceInfo){
	                			Ext.MessageBox.alert(local.window.tip,local.recovery.targetDeviceChoose);
	                			return false;
	                		}

	                		var mountType=null;
	                		if(Ext.getCmp('mountTypeId').getChecked().length==0){
	                			Ext.MessageBox.alert(local.window.tip,local.recovery.plType);
	                			return false;
	                		}else{
	                			mountType=Ext.getCmp('mountTypeId').getChecked()[0].inputValue;
	                		}
	                		
	                		var mountLetter=Ext.getCmp('remotemountpartLetter').getValue();
	                		if(mountType==1&&(null==mountLetter||mountLetter.replace(/(^s*)|(s*$)/g, "").length ==0)){
	                			Ext.MessageBox.alert(local.window.tip,local.recovery.mountDiskNoConfig);
	                			return false;
	                		};
	                		
	                		/*if(mountType==1&&mountLetter.length>30){
	                			Ext.MessageBox.alert(local.window.tip,"挂载盘符长度超过限制");
	                			return false;
	                		}*/
	                		if(mountType==1&&(!mountLetter.match(regexList))){
	                			Ext.MessageBox.alert(local.window.tip,local.recovery.mountDrive+local.recovery.wrapNumMore);
	                			return false;
	                		}
	                		
	                		var mountPower=null;
	                		if(Ext.getCmp('mountPowerId').getChecked().length==0){
	                			Ext.MessageBox.alert(local.window.tip,local.recovery.plMount);
	                			return false;
	                		}else{
	                			mountPower=Ext.getCmp('mountPowerId').getChecked()[0].inputValue;
	                		}
	                		
	                		
	                		var conStr=Ext.getCmp('selectConnectionStr').getRawValue();
	                		
	                		var myMask = new Ext.LoadMask("mountWinShowTotId", {   
	            				msg : local.recovery.pleaseLater 
	            			});
	                		myMask.show();
	                		
	                		Ext.Ajax.request({
	                			url:'/recovery/mountAction!setMountInfo.action',
	                			timeout: 100000,
	                			params:{
	                				vmdkId:SNAPSHOTID,
	                				reMountType:mountType,
	                				reMountPower:mountPower,
	                				parId:PARID,
	                				tarId:TargetDeviceInfo.deviceId,
	                				reMountName:mountName,
	                				reMountLetter:mountLetter,
	                				conncetionStr:conStr,
	                				sourceId:SourceDeviceId,
	                				hardDiskId:HARDDISKID
	                			}, 
	                			success: function(resp,opts) {
	                				myMask.hide();
	                				var mountRes=JSON.parse(resp.responseText);
	                				showMsg(mountRes);
	                				Ext.getCmp('MountConfigWindowId').close();
	                				expandCurrentDataCollection(SNAPSETID.split('-')[0]);
	                				SNAPSHOTID=null;
	                			},    
	                			failure: function(resp,opts) {
	                				myMask.hide();
//	                				Ext.MessageBox.alert(local.window.tip,local.recovery.tipMountConfigError);
	                				Ext.websure.MsgError("WF-30121",local.recovery.tipMountConfigError);
	                				SNAPSHOTID=null;
	                			}
	                		});
	                	}
	                },
	                {
	                	text:local.btn.cancle,
	                	id:'cancel', 
	                	handler:function(){
	                		SNAPSHOTID=null;
	                		Ext.getCmp('MountConfigWindowId').close();
	                	}
	                }]
});
/**
 * 切换子面板
 * @param btn
 */
function changePage(btn){
	var panelId=Ext.getCmp("mountWinShowTotId").layout.activeItem.id;
	var index=Number(panelId.substring(1));
	if(btn.text==local.btn.previous){
		//清空目标设备信息
		//TargetDeviceInfo=null;
		index-=1;
		if(index==0){ 
			Ext.getCmp('creataRemoteMountBnt1').hide();
			Ext.getCmp('creataRemoteMountBnt2').show();
			Ext.getCmp('creataRemoteMountBnt2').enable();				
			Ext.getCmp('creataRemoteMountBnt3').disable();
			Ext.getCmp('targetDeviceId').disable();
			Ext.getCmp('mountSettingId').enable();
		};
		if(index<0){
			index=0;
		}
	}else{
		index+=1;
		if(index==1){
			if(SNAPSHOTID==null){
				Ext.MessageBox.alert(local.window.tip,local.recovery.snapshot);
				index--;
			}else{
				if(null==Ext.getCmp("p1")){
					Ext.getCmp("mountWinShowTotId").add({xtype:"mountWinShowP2",id:"p1"}); 
				}else{
					//var p1=Ext.getCmp("p1").remove("mountTypeId");
					var mountType=Ext.getCmp("mountTypeId");
					var mountPower=Ext.getCmp("mountPowerId");
					mountType.reset();
					mountPower.reset();
					if(PARID==null){
						if(null!=TargetDeviceInfo){
							var fc=TargetDeviceInfo.fc;
							var iscsi=TargetDeviceInfo.iscsi;
							mountType.items.get(0).setDisabled(true);
							if(fc==1&&PARID==null){//可以进行fc挂载
								mountType.items.get(2).setDisabled(false);
							}else{//不可以进行fc挂载
								mountType.items.get(2).setDisabled(true);
							}
							if(iscsi==1&&PARID==null){//可以进行iscsi挂载
								mountType.items.get(1).setDisabled(false);
							}else{//不可以进行iscsi挂载
								mountType.items.get(1).setDisabled(true);
							}
						}else{
							mountType.items.get(0).setDisabled(true);
							mountType.items.get(1).setDisabled(false);
							mountType.items.get(2).setDisabled(false);
						}
						mountPower.items.get(0).setDisabled(false);
	        			mountPower.items.get(1).setDisabled(false);
	        			//mountPower.items.get(2).setDisabled(false);
	        		 }else{
	        			 mountType.items.get(0).setDisabled(false);
	        			 mountType.items.get(1).setDisabled(true);
	        			 mountType.items.get(2).setDisabled(true);
	        			 mountPower.items.get(0).setDisabled(false);
	        			 mountPower.items.get(1).setDisabled(true);
	        			 //mountPower.items.get(2).setDisabled(true);
	        		 }
					//Ext.getCmp("mountWinShowTotId").remove(p1);
					//Ext.getCmp("mountWinShowTotId").add({xtype:"mountWinShowP2",id:"p1"}); 
				}
			}
		}
		if(index==1){
			Ext.getCmp('creataRemoteMountBnt1').show();
			Ext.getCmp('creataRemoteMountBnt1').enable();					
			Ext.getCmp('creataRemoteMountBnt2').hide();
			Ext.getCmp('creataRemoteMountBnt3').enable();
			Ext.getCmp('targetDeviceId').enable();
			Ext.getCmp('mountSettingId').disable();
		}
		if(index>1){
			index=1;
		}
	};
	Ext.getCmp("mountWinShowTotId").layout.setActiveItem('p'+index);
}


Ext.define("acesure.recovery.view.MountWinShow",{
	extend:'Ext.window.Window',
	id:"MountConfigWindowId",
	title:local.btn.mountConfig,
	draggable:false,
	height:650,						//高度
	width:900,						//宽度
	modal:true,//是否模态窗口，默认为false
	resizable:false,
	layout:"border",
	items:[{region:'west',xtype:"leftButton"},{region:'center',xtype:"mountWinShowTot"}],
	initComponent:function(){
		var me=this;
		DISKCLONEID=this.ddIds;
		SourceDeviceId=this.deviceIdWin;
		SourceSysType=this.typeWin;
		SNAPSETID=this.snapSetIdWin;
		TargetDeviceInfo=null;
		Ext.apply(this,{
		});
		this.callParent();
	}
});
