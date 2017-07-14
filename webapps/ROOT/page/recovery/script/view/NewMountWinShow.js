//保存目标设备信息
var TargetDeviceInfo=null;
//克隆Id
var DISKID=null;
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
//分区标识
var MOUNTLETTER=null;
//挂载Id
var MOUNTID=null;
/**
 *挂载配置模块
 *auth:wsd
 */
/**
 *点击挂载配置按钮弹出窗口，左侧按钮（快照选择，配置，目标设备）
 */
Ext.define("acesure.recovery.view.NewMountLeftButton",{
	extend:"Ext.panel.Panel",
	alias:"widget.newMountLeftButton",
	id:"newMountLeftButtonId",
	width:150,
	border:false,
	layout:"vbox",
	cls:'left_tree',
	items:[
	       //配置分区
	       {
	    	   xtype:"button",
	    	   width:150,
	    	   style:'padding-left:26px;',
	    	   textAlign:'left',
	    	   icon:'/images/common/set_black.png',
	    	   text:local.btn.config,
	    	   id:"newMountSettingId"
	       },
	       //目标设备
	       {
	    	   xtype:"button",
	    	   width:150,
	    	   style:'padding-left:26px;',
	    	   textAlign:'left',
	    	   icon:'/images/common/pc_online_one.png',
	    	   text:local.recovery.targetDevice,
	    	   id:"newTargetDeviceId",
	    	   disabled:"true"
	       }
	       ]

});

/**
 * 快照选择，分区选择配置页面
 */
Ext.define("acesure.recovery.view.NewMountWinShowP1",{
	extend:"Ext.panel.Panel",
	alias:"widget.newMountWinShowP1",
	border:false,
	items:[
	       {
	    	   xtype:'newSnapShotTreeGrid',
	    	   height:200,
	    	   disabled:true
	       },
	       {
	    	   xtype:"form",
	    	   layout:'form',
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
	    	          //配置挂载名称
	    	          {
	    	        	  width:"100%",
	    	        	  fieldLabel:local.recovery.mountName,
	    	        	  labelWidth:115,
	    	        	  id:'newRemotemountName',
	    	        	  value:'mount',
	    	        	  maxLength:30,
	    	        	  enforceMaxLength:true,
	    	        	 // regex:/^(?!_)(?!.*?_$)[a-zA-Z0-9_]+$/, 
	    	        	  regex:/^[a-zA-Z0-9_]*$/,
	    	        	  regexText:local.recovery.wrapNum,
	    	        	  listeners:{
	    	        		  render:function(){
	    	        			  this.setValue("mount_"+new Date().getTime());
	    	        		  }
	    	        	  }
	    	          }
	    	          ]}
	       ]
});

/**
 *目标设备页面
 */
Ext.define("acesure.recovery.view.NewMountWinShowP2",{
	extend:"Ext.panel.Panel",
	alias:"widget.newMountWinShowP2",
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
	    	          }
	    	          /*{
	    	        	  xtype:"button",
	    	        	  text:'匹配当前系统',
	    	        	  cls:'ie8 btn_node_active',
	    	        	  border:false,
	    	        	  style:'padding-left:26px;background:none',
	    	        	  icon : '/images/common/list.png',
	    	        	  handler:function(){
	    	        		  var fileViewBut = this.nextSibling();    //获取文件浏览按钮
	    	        		  fileViewBut.removeCls('btn_node_active');
	    	        		  this.addCls('btn_node_active');
	    	        		  var targetDeviceCon=Ext.getCmp("newSecondMountConfigLeftId").store;
	    	        		  targetDeviceCon.load({params:{sysType:SourceSysType}});
	    	        	  }
	    	          },*/
	    	          /*{
	    	        	  xtype:"button",
	    	        	  text:'全部',
	    	        	  cls:'ie8',
	    	        	  border:false,
	    	        	  style:'padding-left:26px;background:none',
	    	        	  icon : '/images/common/run.png',
	    	        	  handler:function(){
	    	        		  var fileViewBut = this.previousSibling();    //获取文件浏览按钮
	    	        		  fileViewBut.removeCls('btn_node_active');
	    	        		  this.addCls('btn_node_active');
	    	        		  var targetDeviceConAll=Ext.getCmp("newSecondMountConfigLeftId").store;
	    	        		  targetDeviceConAll.load();
	    	        	  }
	    	          }*/]
	       },
	       {
	    	   xtype:"panel",
	    	   width:'100%',
	    	   layout:"hbox",
	    	   border:false,
	    	   items:[
	    	          {
	    	        	  xtype:"panel",
	    	        	  flex:1.5,
	    	        	  height:300,
	    	        	  border:false,
	    	        	  items:{xtype:"newSecondMountConfigLeft"}
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
	    	        	        	 title:local.recovery.targetDeviceInfo,
	    	        	        	 collapsible:false,
	    	        	        	 autoHeight:true,
	    	        	        	 html:local.recovery.chooseDevice
	    	        	         },{
	    	        	        	 xtype:'fieldset',
	    	        	        	 id:'newMountCautionId',
	    	        	        	 style:"margin-top:20px;padding-bottom:10px;",
	    	        	        	 title:local.explain,
	    	        	        	 collapsible:false,
	    	        	        	 autoHeight:true,
	    	        	        	 defaultType:'textfield',
	    	        	        	 html:local.recovery.mountWinExplain
	    	        	         }
	    	        	         ]
	    	          }
	    	          ]},
	    	          {
	    	        	  xtype:"radiogroup",
	    	        	  fieldLabel:local.recovery.mountType,
	    	        	  id:"newMountTypeId",
	    	        	  width:'100%',
	    	        	  columns:3,
	    	        	  margin:"20 0 0 0",
	    	        	  items:[
	    	        	         {boxLabel:local.recovery.ISCSIMount,name:'new_mount_type',inputValue:4},
	    	        	         {boxLabel:local.recovery.FCMount,name:'new_mount_type',inputValue:5}
	    	        	         ],
	    	        	         listeners:{
	    	        	        	 change:function(me, newValue, oldValue, eOpts){
	    	        	        		 var connectionStr=Ext.getCmp("newSelectConnectionStr");
	    	        	        		 if(null==TargetDeviceInfo){
	    	        	        			 Ext.MessageBox.alert(local.window.tip,local.recovery.targetDeviceChoose);
	    	        	        			 this.reset();
	    	        	        		 }else{
	    	        	        		 
	    	        	        		 	var mountType=this.getValue().new_mount_type;
	    	        	        		 	//--begin---检测FC挂载授权
                                             if(mountType==5){
                                                    Ext.Ajax.request({
                                                         url:'/recovery/recoveryAction!findStorageAuth.action',
                                                           success: function(resp,opts) {
                                                               var sysAuth=JSON.parse(resp.responseText);  //解析系统授权信息
                                                               if(!sysAuth.enableFCMount){
                                                                    //提示FC挂载功能未授权,并设置FC挂载禁用
                                                                    Ext.websure.MsgError("未授权",local.recovery.FCMount+" 功能尚未授权,请至设置页面申请授权");
                                                                    me.items.get(1).setDisabled(true);  //设置FC挂载禁用
                                                                    me.reset();  //重置选择
                                                                    return;
                                                               }
                                                           }
                                                });
                                             }
                                            //--end---检测FC挂载授权
	    	        	        		 	
	    	        	        			 var deviceId=TargetDeviceInfo.deviceId;
	    	        	        			 connectionStr.store.load({params:{deviceTreeId:deviceId,type:this.getValue().new_mount_type}});
	    	        	        			 if(this.getValue().new_mount_type=="4"||this.getValue().new_mount_type=="5"){
	    	        	        				 connectionStr.setValue("0");
	    	        	        				 connectionStr.show();
	    	        	        			 }else{
	    	        	        				 connectionStr.hide();
	    	        	        				 connectionStr.setValue("none");
	    	        	        			 };
	    	        	        		 }
	    	        	        	 }
	    	        	         }
	    	          },
	    	          {
	    	        	  xtype:"radiogroup",
	    	        	  fieldLabel:local.recovery.mountPower,
	    	        	  id:"newMountPowerId",
	    	        	  width:'100%',
	    	        	  columns:3,
	    	        	  margin:"20 0 0 0",
	    	        	  items:[
	    	        	         {boxLabel:local.powerRead,name:'newMountAuthority',inputValue:1},
	    	        	         {boxLabel:local.powerReadWrite,name:'newMountAuthority',inputValue:2,checked:true}
	    	        	         //{boxLabel:"读/写（数据保留）",name:'newMountAuthority',inputValue:2}
	    	        	         ]
	    	          },
	    	          {
	    	        	  xtype:'combo',
	    	        	  cls:"combo_width",
	    	        	  queryMode:'local',
	    	        	  fieldLabel:local.recovery.mountTarget,
	    	        	  id:'newSelectConnectionStr',
	    	        	  valueField:"value",
	    	        	  displayField:"text",
	    	        	  emptyText:local.recovery.plMountTarget,
	    	        	  editable:false,
	    	        	  triggerAction:"all",
	    	        	  margin:"20 0 0 0",
	    	        	  store:'ConnectionMountStore',
	    	        	  hidden:true
	    	          }


	    	          ]
});

/**
 *目标设备配置页面
 */
Ext.define("acesure.recovery.view.NewSecondMountConfigLeft",{
	extend:"Ext.tree.TreePanel",
	alias:"widget.newSecondMountConfigLeft",
	id:"newSecondMountConfigLeftId",
	useArrows:true,
	border:false,
	style:'border:1px solid #b5b8c8',
	rootVisible:false,//不可见根
	multiSelect:true,
	height:300,
	loadMask:{msg:local.dataLoading},
	initComponent : function() {
		var me = this;
		var configTarget=Ext.create("acesure.recovery.store.RemoteMountTargetMac");
		configTarget.load();
		Ext.applyIf(me, {
			store:configTarget,
			columns:[{
				xtype:'treecolumn',
				header:"<img src='/images/recovery/device.png'/>&nbsp"+local.recovery.localRecovery, //可用设备列表
				width:"100%",
				sortable:false,
				renderer:function(value,cellmeta,record,rowIndex,columnIndex,store){
					var ip=record.data["ip"];
					var name=record.data["computerName"];
					var sysType=record.data["sysType"];
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
			deviceInfo+="<tr><td>"+local.recovery.targetDeviceIP+local.colon+"</td><td class='config_font_color'>"+deviceB.ip+"</td></tr>";
			deviceInfo+="<tr><td>"+local.pcID+local.colon+"</td><td class='config_font_color'>"+deviceB.deviceId+"</td></tr>";
			deviceInfo+="<tr><td>"+local.backup.systemType+local.colon+"</td><td class='config_font_color'>"+sysType+"</td></tr>";
			deviceInfo+="</table>";
			Ext.getCmp('checkTargetDeviceInfo').body.dom.innerHTML=deviceInfo;
			TargetDeviceInfo=deviceB;
			var fc=TargetDeviceInfo.fc;
			var iscsi=TargetDeviceInfo.iscsi;
			//挂载类型
			var newMountTypeId=Ext.getCmp("newMountTypeId");
			//重置挂载类型
			newMountTypeId.reset();

			if(fc==1&&PARID==null){//可以进行fc挂载
				newMountTypeId.items.get(1).setDisabled(false);
			}else{//不可以进行fc挂载
				newMountTypeId.items.get(1).setDisabled(true);
			}
			if(iscsi==1&&PARID==null){//可以进行iscsi挂载
				newMountTypeId.items.get(0).setDisabled(false);
			}else{//不可以进行iscsi挂载
				newMountTypeId.items.get(0).setDisabled(true);
			}
			if(iscsi!=1&&fc!=1&&PARID==null){
				var preHtml=local.recovery.mountWinExplain+'<br>';
				 preHtml=preHtml+"<font style='font-weight:bold;' color='red'>"+local.recovery.configure+"</font>";
				 Ext.getCmp("newMountCautionId").update(preHtml);
			}else{
				var preHtml=local.recovery.mountWinExplain;
				Ext.getCmp("newMountCautionId").update(preHtml);
			}
			
		}

	}
});	
Ext.define('acesure.recovery.view.NewSnapShotTreeGrid',{
	extend:'Ext.tree.Panel',
	alias:'widget.newSnapShotTreeGrid',
	id:"newSnapShotTreeGridId",
	useArrows:true,
	rootVisible:false,	// 不可见根
	border:true,
	frame:false,
	sortable:false,
	loadMask:{msg:local.dataLoading},
	initComponent : function() {
		var me = this;
		var newMountStore=Ext.create("acesure.recovery.store.NewMountStore");
		newMountStore.load({params:{mountId:MOUNTID}});
		Ext.applyIf(me, {
			store:newMountStore
		});
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
				SNAPSHOTID=node.get("snapShotId");
			}else{
				SNAPSHOTID=null;
			}
		}
	}
});
/**
 *配置，目标设备汇总页面
 */
Ext.define("acesure.recovery.view.NewMountWinShowTot",{
	extend:"Ext.panel.Panel",
	alias:"widget.newMountWinShowTot",
	id:"newMountWinShowTotId",
	layout:'card',
	cls:'config',
	style:'background:#fff;border-left:1px solid #d1dade;padding:20px;',
	activeItem:0,
	border:false,
	items:[
	       {xtype:"newMountWinShowP1",id:"p0"}
	       ],
	       buttons:[

	                {
	                	text:local.btn.previous,
	                	textAlign:'center',
	                	id:'newCreataRemoteMountBnt1',
	                	disabled:true,
	                	hidden:true,
	                	handler:changePage
	                },{
	                	text:local.btn.next,
	                	textAlign:'center',
	                	id:'newCreataRemoteMountBnt2',
	                	handler:changePage
	                },
	                {
	                	text:local.btn.save,
	                	cls:"btn_focus",
	                	textAlign:'center',
	                	id:'newCreataRemoteMountBnt3',
	                	disabled:true,
	                	handler:function(){
	                		if(null==TargetDeviceInfo){
	                			Ext.MessageBox.alert(local.window.tip,local.recovery.targetDeviceChoose);
	                			return false;
	                		};
	                		var mountType=null;
	                		if(Ext.getCmp('newMountTypeId').getChecked().length==0){
	                			Ext.MessageBox.alert(local.window.tip,local.recovery.targetDeviceChoose);
	                			return false;
	                		}else{
	                			mountType=Ext.getCmp('newMountTypeId').getChecked()[0].inputValue;
	                		}
	                		var mountPower=null;
	                		if(Ext.getCmp('newMountPowerId').getChecked()==0){
	                			Ext.MessageBox.alert(local.window.tip,local.recovery.targetDeviceChoose);
	                			return false;
	                		}else{
	                			mountPower=Ext.getCmp('newMountPowerId').getChecked()[0].inputValue;
	                		}

	                		var mountName=Ext.getCmp('newRemotemountName').getValue();
	                		var regex=/^[a-zA-Z0-9_]*$/;
	                		if(!mountName.match(regex)){
	                			Ext.MessageBox.alert(local.window.tip,local.recovery.underline);
	                			return false;
	                		}
	                		
	                		var conStr=Ext.getCmp('newSelectConnectionStr').getRawValue();
	                		var myMask = new Ext.LoadMask("newMountWinShowTotId", {   
	            				msg : local.recovery.Configuration  
	            			});
	            			myMask.show();
	                		Ext.Ajax.request({
	                			url:'/recovery/recoveryAction!updateNewMountInfo.action',
	                			timeout: 100000,
	                			params:{
	                				reMountType:mountType,
	                				reMountPower:mountPower,
	                				reMountName:mountName,
	                				mountId:MOUNTID,
	                				tarId:TargetDeviceInfo.deviceId,
	                				conncetionStr:conStr,
	                				vmdkId:SNAPSHOTID
	                			}, 
	                			success: function(resp,opts) {
	                				myMask.hide();
	                				
	                				var mountRes=JSON.parse(resp.responseText);
	                				showMsg(mountRes);
	                				Ext.getCmp('newMountConfigWindowId').close();
	                				var mountList=Ext.getCmp("mountListId");
	                				
	                				var recoveryListStore=mountList.getStore();
	                				recoveryListStore.load({
	          		  				  callback:function(records, operation, success){
	          		  					POWER_OP.filterEnableDomsInGridpanelColumnOfExtjs(mountList,CURRENT_USER.getRecoveryPower());
	          		  				  }
	          		  			  });
	                				//更新日志信息
	                				Ext.getCmp("recoveryLogGridId").getStore().load();
	                			},    
	                			failure: function(resp,opts) {
	                				myMask.hide();
//	                				Ext.MessageBox.alert(local.window.tip,local.recovery.mountCon);
	                				Ext.websure.MsgError("WF-30122",local.recovery.mountCon);
	                				Ext.getCmp('newMountConfigWindowId').close();
	                			}
	                		});
	                	}
	                },
	                {
	                	text:local.btn.cancle,
	                	id:'cancel',
	                	handler:function(){
	                		Ext.getCmp('newMountConfigWindowId').close();
	                	}
	                }]
});
/**
 * 切换子面板
 * @param btn
 */
function changePage(btn){
	var panelId=Ext.getCmp("newMountWinShowTotId").layout.activeItem.id;
	var index=Number(panelId.substring(1));
	if(btn.text==local.btn.previous){
		index-=1;
		if(index==0){
			Ext.getCmp('newCreataRemoteMountBnt1').hide();
			Ext.getCmp('newCreataRemoteMountBnt2').show();
			Ext.getCmp('newCreataRemoteMountBnt2').enable();				
			Ext.getCmp('newCreataRemoteMountBnt3').enable();
			Ext.getCmp('newTargetDeviceId').disable();
			Ext.getCmp('newMountSettingId').enable();
		};
		if(index<0){
			index=0;
		}
	}else{
		index+=1;

		if(index==1){

			if(null==Ext.getCmp("p1")){
				Ext.getCmp("newMountWinShowTotId").add({xtype:"newMountWinShowP2",id:"p1"}); 
			}else{
				//Ext.getCmp("newMountWinShowTotId").remove(p1);
				//Ext.getCmp("newMountWinShowTotId").add({xtype:"newMountWinShowP2",id:"p1"}); 
			}
		}
		if(index==1){
			Ext.getCmp('newCreataRemoteMountBnt1').show();
			Ext.getCmp('newCreataRemoteMountBnt1').enable();					
			Ext.getCmp('newCreataRemoteMountBnt2').hide();
			Ext.getCmp('newCreataRemoteMountBnt3').enable();
			Ext.getCmp('newTargetDeviceId').enable();
			Ext.getCmp('newMountSettingId').disable();
		}
		if(index>1){
			index=1;
		}
	};
	Ext.getCmp("newMountWinShowTotId").layout.setActiveItem('p'+index);
}


Ext.define("acesure.recovery.view.NewMountWinShow",{
	extend:'Ext.window.Window',
	id:"newMountConfigWindowId",
	title:local.btn.mountConfig,
	draggable:false,
	height:680,						//高度
	width:900,							//宽度
	modal:true,//是否模态窗口，默认为false
	resizable:false,
	layout:"border",
	items:[{region:'west',xtype:"newMountLeftButton"},{region:'center',xtype:"newMountWinShowTot"}],
	initComponent:function(){
		var me=this;
		MOUNTID=this.mountId;
		SNAPSHOTID=this.vmdkId;
		SourceSysType=this.typeWin;
		TargetDeviceInfo=null;
		Ext.apply(this,{
		});
		this.callParent();
	}
});