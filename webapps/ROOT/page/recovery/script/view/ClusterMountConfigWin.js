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
//快照是否可被挂载
var VMDKMOUNTFLAG=false;

/**
 *挂载设置模块
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
var LINUX=[32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84,85,86,87,89,90,91,92];

/**
 * 挂载配置主窗口
 */
Ext.define("acesure.recovery.view.ClusterMountConfigWin",{
    extend:'Ext.window.Window',
    id:"clusterMountConfigWin",
    title:local.recovery.clusterConfig,
    draggable:false,
    height:650,                     //高度
    width:900,                      //宽度
    modal:true,//是否模态窗口，默认为false
    resizable:false,
    layout:"border",
    items:[{region:'west',xtype:"clusterLeftButton"},{region:'center',xtype:"clusterMountConfig"}],
    initComponent:function(){
        var me=this;
        DISKCLONEID=this.ddIds;
        //SourceDeviceId=this.deviceIdWin;
        //SourceSysType=this.typeWin;
        SNAPSETID=this.snapSetIdWin;
        TargetDeviceInfo=null;
        Ext.apply(this,{
        });
        this.callParent();
    }
});


/**
 *集群挂载设置中心面板
 */
Ext.define("acesure.recovery.view.ClusterMountConfig",{
    extend:"Ext.panel.Panel",
    alias:"widget.clusterMountConfig",
    id:"clusterMountConfig",
    layout:'card',
    cls:'config',
    style:'background:#fff;border-left:1px solid #d1dade;padding:20px;',
    activeItem:0,
    border:false,
    items:[
           {
               xtype:"clusterMountConfigP1",id:"p0"}
           ],
           buttons:[
                    {
                        text:local.btn.previous,
                        textAlign:'center',
                        id:'preBtn',
                        disabled:true,
                        hidden:true,
                        handler:changePage
                    },{
                        text:local.btn.next,
                        textAlign:'center',
                        id:'nextBtn',
                        handler:changePage,
                        listeners: {
                        	click:function(){
                        		//防止挂载已经应急或者挂载过的快照
                        		if(SNAPSHOTID==null){
                                  Ext.MessageBox.alert(local.window.tip,local.recovery.snapshot);
                                  return false;
                        		}
                        		if(!VMDKMOUNTFLAG){
                        			 Ext.MessageBox.alert(local.window.tip,local.recovery.chooseSnapIllegal);
                                     return false;
                        		}
                        		
                                var targetDeviceTree=Ext.getCmp("secondMountConfigLeftId");
                                if(targetDeviceTree){
                                	var deviceTreeStore = targetDeviceTree.getStore();
                                	deviceTreeStore.load({params:{sysType:SourceSysType}}); 
                                }
                        	}
                        }
                        
                    },
                    {
                        text:local.btn.save,
                        textAlign:'center',
                        id:'saveMountConfigBtn',
                        cls:"btn_focus",
                        disabled:true,
                        handler:function(){
                             
                            var regexList=/^[a-zA-Z0-9_:\/\\]*$/;
                            var regex=/^[a-zA-Z0-9_]*$/;
                            var mountName=Ext.getCmp('remotemountName').getValue();
                            if(!mountName.match(regex)){
                                Ext.MessageBox.alert(local.window.tip,local.recovery.underline);
                                return false;
                            }
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
                            
                            var myMask = new Ext.LoadMask("clusterMountConfig", {   
                                msg : local.recovery.pleaseLater 
                            });
                            myMask.show();
                            
                            //保存挂载配置信息
                            Ext.Ajax.request({
                                url:'/recovery/mountAction!setMountInfo.action',
                                timeout: 100000,
                                params:{
                                    vmdkId:SNAPSHOTID,                 //快照ID
                                    reMountType:mountType,             //挂载类型
                                    reMountPower:mountPower,           //挂载权限
                                    parId:PARID,                       //分区ID
                                    tarId:TargetDeviceInfo.deviceId,   //目标设备ID
                                    reMountName:mountName,             //挂载名称
                                    reMountLetter:mountLetter,         //挂载盘符
                                    conncetionStr:conStr,              //lvm 挂载字符串
                                    sourceId:SourceDeviceId,           //源设备ID
                                    hardDiskId:HARDDISKID              //硬盘ID
                                }, 
                                success: function(resp,opts) {
                                    myMask.hide();
                                    var mountRes=JSON.parse(resp.responseText);
                                    showMsg(mountRes);
                                    Ext.getCmp('clusterMountConfigWin').close();
                                    //expandCurrentDataCollection(SNAPSETID.split('-')[0]); 
                                    //expandCurrentDataCollection(DISKCLONEID);
                                    expandClusterCurrentDataCollection(DISKCLONEID);
                                },    
                                failure: function(resp,opts) {
                                    myMask.hide();
                                    Ext.websure.MsgError("WF-30121",local.recovery.tipMountConfigError);
                                }
                            });
                        }
                    },
                    {
                        text:local.btn.cancle,
                        id:'cancel',
                        handler:function(){
                            Ext.getCmp('clusterMountConfigWin').close();
                        }
                    }]
});

/**
 *点击挂载设置按钮弹出窗口，左侧按钮（快照选择，设置，目标设备）
 */
Ext.define("acesure.recovery.view.ClusterLeftButton",{
    extend:"Ext.panel.Panel",
    alias:"widget.clusterLeftButton",
    id:"clusterLeftButton",
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
               text:local.btn.config,  //挂载基础配置选择按钮
               id:"mountBaseConfigBtn"
           },
           //目标设备
           {
               xtype:"button",
               width:150,
               style:'padding-left:26px;',
               textAlign:'left',
               icon:'/images/common/pc_online_one.png',
               text:local.recovery.targetDevice,
               id:"targetDeviceBtn",
               disabled:"true"
           }
           ]

});

/**
 * 挂载盘符数据源
 */
var letterStore = new Ext.data.ArrayStore({

                    fields: [  
                        {name: 'value', type: 'string'},
                        {name: 'text',type: 'string'}
                    ]
                  });

/**
 * 集群挂载配置第一页（用于选择分区/硬盘 配置挂载名称及盘符）
 */
Ext.define("acesure.recovery.view.ClusterMountConfigP1",{
    extend:"Ext.panel.Panel",
    alias:"widget.clusterMountConfigP1",
    border:false,
    items:[
           {
               xtype:'shareDiskTree',   //共享磁盘树
               overflowY:'auto',
               height:180
           },
           {
               xtype:'clusterSnapShotTree',   //设备树
               overflowY:'auto',
               height:180
           	
           },
           {   //挂载名称+挂载盘符form
               xtype:"form",
               layout:'form',
               id:'mountNameAndLetterForm',
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
                          store: letterStore,
                          valueField:"value",
                          displayField:"text",
                          emptyText:local.recovery.plMountDriveDirectory,
                          maxLength:30,
                          enforceMaxLength:true,
                          regex:/^[a-zA-Z0-9_:\/\\]*$/,
                          regexText:local.recovery.wrapNumMore,
                          hidden:true,
                          editable:false,
                          defaultListConfig:{
                             loadMask: false
                          },
                          listeners:{
                              'expand':function(filed,opt){
                              	var me = this;
                                if(LINUX.indexOf(parseInt(SourceSysType))!=-1){
                                	me.getStore().loadData(REMOTEMOUNT_LIN);
                                  }else{
                                    me.getStore().loadData(REMOTEMOUNT_WIN);
                                  };
                              }
                          }
                      },{
                          width:"100%",
                          height:50,
                          xtype:"fieldset",
                          title:local.explain,
                          collapsible:false,
                          html:local.recovery.TCPDisk   //挂载说明
                      }
                      ]
           }
           ]
});
/**
 *目标设备页面
 */
Ext.define("acesure.recovery.view.ClusterMountConfigP2",{
    extend:"Ext.panel.Panel",
    alias:"widget.clusterMountConfigP2",
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
                      }]
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
                                 //{boxLabel:"读/写（数据不保留）",name:'mountAuthority',inputValue:3}
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
        //targetDeviceStore.getProxy().url = '/recovery/mountAction!getClusterMountTargetDevice.action';  //变更为集群Store的URL
        //targetDeviceStore.load({params:{sysType:SourceSysType,clusterId:CLUSTERID}});
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

/**
 * 共享磁盘树型面板展示
 */
Ext.define('acesure.recovery.view.ShareDiskTree',{
    extend:'Ext.tree.Panel',
    alias:'widget.shareDiskTree',
    id:"shareDiskTree",
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
        var vmInfoStore=Ext.create("acesure.recovery.store.ShareDiskTreeStore");
        vmInfoStore.load({params:{diskCloneId:DISKCLONEID,snapSetId:SNAPSETID,clusterId:CLUSTERID}});
        Ext.applyIf(me, {
            store:vmInfoStore,
            columns : [{
                xtype : 'treecolumn',
                menuDisabled:true,
                sortable:false,
                text : local.disk,
                flex : 2.8,
                tdCls:"check_dis",
                dataIndex : 'diskAndVmdkName'
            },
            {
                xtype : 'numbercolumn',
                menuDisabled:true,
                sortable:false,
                format : '0.0G',
                text : local.backup.diskInfoGridSize,
                flex : 1,
                dataIndex : 'parTotalSec',
                align : 'center'
            },{
                xtype : 'numbercolumn',
                menuDisabled:true,
                sortable:false,
                text :local.recovery.startSector,
                flex : 1,
                dataIndex : 'parStartSec',
                align : 'center'
            }, {
                text : local.recovery.diskInfoGridFormat,
                menuDisabled:true,
                sortable:false,
                flex : 1,
                dataIndex : 'parFileSystem'
            }, {
                text : local.recovery.title1,
                menuDisabled:true,
                sortable:false,
                flex : 1,
                dataIndex : 'lvmPoint'
            }
            ]
        });
        me.callParent(arguments);
    },
    listeners : {
    	'afteritemexpand' : function(node, index, item, eOpts){
    		//设置子节点不可以 勾选
    		disabledCheckbox();
    	},
    	'checkchange' : function(node,checked){
    		//设置子节点不可以 勾选
    		disabledCheckbox();
    		//选中父节点，展开子节点
    		if(!node.loaded){
                node.expand();  
            }
    		
			//选中某个共享磁盘
			if(checked){
				clearMountConfigTreeNode();
                node.set("checked" , true);
                chooseSameDisk(node,checked);  //同步选中下边磁盘
                selChild(node, checked); 
                SNAPSHOTID = node.data.snapShotId;  //设置快照集ID
                VMDKMOUNTFLAG = vmdkMountVerify(SNAPSHOTID);  //检测快照是否可挂载
                SourceSysType = node.raw.sysType;  //设置设备系统类型
                SourceDeviceId = node.raw.sourceDeviceId;
                HARDDISKID = node.raw.hardDiskId;  //记录选中硬盘ID
			}else{
			//取消节点	
				dSelChild(node, checked);
				cancleChooseSameDisk(node,checked);  //同步取消下边磁盘
				HARDDISKID = null;
			}
			
            //共享磁盘无分区概念,不能进行卷/分区挂载
            Ext.getCmp('remotemountpartLetter').hide();
            Ext.getCmp('remotemountpartLetter').setValue(null); //置空
            //置空分区记录
            PARID=null;
			
		}
    }
});

/**
 * 集群设备-硬盘-分区 展示
 */
Ext.define('acesure.recovery.view.ClusterSnapShotTree',{
    extend:'Ext.tree.Panel',
    alias:'widget.clusterSnapShotTree',
    id:"clusterSnapShotTree",
    useArrows:true,
    rootVisible:false,
    hideHeaders:true,
    border:true,
    frame:false,
    sortable:false,
    loadMask : {
        msg : local.loading
    },
    initComponent : function() {
        var me = this;
        var vmInfoStore=Ext.create("acesure.recovery.store.ClusterMountDiskStore");
        vmInfoStore.load({params:{diskCloneId:DISKCLONEID,snapSetId:SNAPSETID,clusterId:CLUSTERID}});
        Ext.applyIf(me, {
            store:vmInfoStore,
            columns : [{
                xtype : 'treecolumn',
                text : local.disk,
                flex : 2.8,
                dataIndex : 'diskAndVmdkName'
            },
            {
                xtype : 'numbercolumn',
                format : '0.0G',
                text : local.backup.diskInfoGridSize,
                flex : 1,
                dataIndex : 'parTotalSec',
                align : 'center'
            },{
                xtype : 'numbercolumn',
                text :local.recovery.startSector,
                flex : 1,
                dataIndex : 'parStartSec',
                align : 'center'
            }, {
                text : local.recovery.diskInfoGridFormat,
                flex : 1,
                dataIndex : 'parFileSystem'
            }, {
                text : local.recovery.title1,
                flex : 1,
                dataIndex : 'lvmPoint'
            }
            ]
        });
        me.callParent(arguments);
    },
    listeners : {
        'afteritemexpand' : function(node, index, item, eOpts){
            disabledShareDiskCheckBox();
        },
        'afteritemcollapse' : function(node, index, item, eOpts){
        	disabledShareDiskCheckBox();
        },
        'checkchange' : function(node,checked){
            //选中父节点，展开子节点
            if(!node.loaded){
                node.expand();  
            }
            
            Ext.getCmp('remotemountpartLetter').setValue(null); //置空
            //选择硬盘
            if(!node.data.leaf){
            	Ext.getCmp('remotemountpartLetter').hide();
            	if(checked){
            		SNAPSHOTID = node.raw.snapShotId;  //快照ID
            		VMDKMOUNTFLAG = vmdkMountVerify(SNAPSHOTID);  //检测快照是否可挂载
            		SourceSysType = node.raw.sysType;  //设置设备系统类型
            		SourceDeviceId = node.raw.sourceDeviceId;  //源设备ID
            		HARDDISKID=node.raw.hardDiskId;  //记录硬盘ID
            		clearMountConfigTreeNode();
            		node.set("checked" , true);
                    selChild(node, checked);
            	}else{
            		dSelChild(node, checked);
            		HARDDISKID = null;
            	}
            	
            }else{
                //选择某个分区
            	SourceSysType = node.raw.sysType;  //设置设备系统类型
            	SourceDeviceId = node.raw.sourceDeviceId;
            	SNAPSHOTID = node.raw.snapShotId;  //快照ID
            	VMDKMOUNTFLAG = vmdkMountVerify(SNAPSHOTID);  //检测快照是否可挂载
            	PARID = node.raw.parId;  //记录分区ID
            	Ext.getCmp('remotemountpartLetter').show();  //分区挂载
            	if(checked){
            		//分区所在硬盘是否被选中
                    if(node.parentNode.data.checked){
                        clearMountConfigTreeNode();
                        node.set("checked" , true);
                    }else{
                        clearMountConfigTreeNode();
                        node.set("checked" , true);
                    }
                            		
            	}else{
            		//分区所在硬盘是否被选中
                    if(node.parentNode.data.checked){
                        clearMountConfigTreeNode();
                        node.set("checked" , true);
                    }else{
                        node.set("checked" , false);
                    }
            	}
            	
            	HARDDISKID=null;  //置空硬盘记录
            	
            }
            
        }
    }
});


/**
 * 检查某个快照集的使用状态
 * 是否被用于挂载
 */
function checkSnapSetMountState(vmimgId){
	
	var ifMountCfg = false;
	//后台检查磁盘文件是否可以进行挂载设置
    Ext.Ajax.request({
        url : '/recovery/recoveryAction!checkVmdkMountCfgState.action',    //磁盘是否可被创建挂载
        timeout : 10000,    //设置10秒超时
        async : false,
        params : {
            'vmimgId' : vmimgId
        },
        success : function(response, options) {
            var res=JSON.parse(response.responseText);
            var msgCode = res.msgCode;
            var msgContent = res.msgContent;
            
            if(msgCode == 30000){
                ifMountCfg = true;
            }else{
                //弹窗提示，不可挂载原因
                showResultDialog(msgCode,msgContent);
            }
        },
        failure : function(resp, opts) {
            Ext.websure.MsgError("WF-30117", local.recovery.tipMCE);
        }
    });  
}

/**
 * 清空某个树型节点所有的已check 的节点 
 */
function clearCheckdNodes(treePanel){
	 var checkNodes = treePanel.getChecked();
                for(var i=0;i<checkNodes.length;i++){
                    var n = checkNodes[i];
                        n.set("checked" , false);
                }
	
}

/**
 * 清空集群挂载配置磁盘，分区已勾选节点
 */
function clearMountConfigTreeNode(){
	var shareDiskTree = Ext.getCmp('shareDiskTree');  //共享磁盘树
    var clusterSnapShotTree = Ext.getCmp('clusterSnapShotTree');  //设备-硬盘-分区树
            
    clearCheckdNodes(shareDiskTree);  //清空共享磁盘选中
    clearCheckdNodes(clusterSnapShotTree);  //清空设备-硬盘-分区树选中
}

function dSelParent(node, checked) {
    if (checked) {
        if (node.parentNode.id!="service_root_check_node") {
            node.parentNode.ui.checkbox.checked = checked;
            node.parentNode.attributes.checked = checked;
            selParent(node.parentNode, checked);
        }
    }
}
/**
 * 选中指定节点的子节点
 * @param {} node
 * @param {} checked
 */
function selChild(node, checked) {
    node.eachChild(function(child) {
        child.set("checked" , true);
    });
}
/**
 * 反勾选指定节点的子节点
 * @param {} node
 * @param {} checked
 */
function dSelChild(node, checked) {
    node.eachChild(function(child) {
        child.set("checked" , false);
    });
    SNAPSHOTID=null;
}

/**
 * 切换子面板
 * @param btn
 */
function changePage(btn){
    var panelId=Ext.getCmp("clusterMountConfig").layout.activeItem.id;
    var index=Number(panelId.substring(1));
    if(btn.text==local.btn.previous){
        //清空目标设备信息
        //TargetDeviceInfo=null;
        index-=1;
        if(index==0){
            Ext.getCmp('preBtn').hide();
            Ext.getCmp('nextBtn').show();
            Ext.getCmp('nextBtn').enable();               
            Ext.getCmp('saveMountConfigBtn').enable();
            Ext.getCmp('targetDeviceBtn').disable();
            Ext.getCmp('mountBaseConfigBtn').enable();
        };
        if(index<0){
            index=0;
        }
    }else{
        index+=1;
        if(index==1){
            if(SNAPSHOTID==null){
                //console.log(SNAPSHOTID);
                Ext.MessageBox.alert(local.window.tip,local.recovery.snapshot);
                index--;
            }else{
                if(null==Ext.getCmp("p1")){
                    Ext.getCmp("clusterMountConfig").add({xtype:"clusterMountConfigP2",id:"p1"}); 
                    //Ext.getCmp('saveMountConfigBtn').addCls("btn_focus");
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
                }
            }
        }
        if(index==1){
            Ext.getCmp('preBtn').show();
            Ext.getCmp('preBtn').enable();                   
            Ext.getCmp('nextBtn').hide();
            Ext.getCmp('saveMountConfigBtn').enable();
            Ext.getCmp('targetDeviceBtn').enable();
            Ext.getCmp('mountBaseConfigBtn').disable();
        }
        if(index>1){
            index=1;
        }
    };
    Ext.getCmp("clusterMountConfig").layout.setActiveItem('p'+index);
}
/*禁用共享磁盘复选框*/
function disabledCheckbox(){
    var gridTr=$("#shareDiskTree-body table tr.x-grid-tree-node-leaf");
    gridTr.each(function(){
            $(this).find("td:first div.x-grid-cell-inner input").attr("disabled","disabled");
            $(this).find("td:first div.x-grid-cell-inner input").css("opacity","0.3");
    });
}

/**
 * 禁用共享磁盘组成硬盘的复选框及子节点复选框
 */
function disabledShareDiskCheckBox(){
	//获取设备——硬盘-分区树
    var devTree = Ext.getCmp("clusterSnapShotTree").getStore().getRootNode().childNodes;  //设备节点集合
    for(i=0;i<devTree.length;i++){
        var childNodes=devTree[i].childNodes;    //[硬盘节点集合]
        for(j=0;j<childNodes.length;j++){
                var node=childNodes[j];          //[硬盘节点]
                var clusterType=node.get("clusterType");  //硬盘类型0：普通磁盘，1：共享磁盘
                if(clusterType==1){
                        var id=node.get('id');
                        $("tr[data-recordid="+id+"]").find("td:first div.x-grid-cell-inner input").attr("disabled","disabled").css("opacity","0.3");
                        if(node.hasChildNodes( )){      //如果有子节点，则禁用子节点
                            var nodeC = childNodes[j].childNodes;    //三级子节点
                            var length = nodeC.length;
                            for(k=0;k<length;k++){
                                var thisNodeId=nodeC[k];
                                var thisId=thisNodeId.get('id');
                                $("tr[data-recordid="+thisId+"]").find("td:first div.x-grid-cell-inner input").attr("disabled","disabled").css("opacity","0.3");
                            }
                        }
              }
        }
    }	
}

/**
 * 选中共享磁盘中的数据，下面的磁盘同步选择
 */
function chooseSameDisk(node, checked){
    node.eachChild(function(child) {
        var id=child.raw.diskIdentity;    //选中的设备——硬盘索引
        var devTree = Ext.getCmp("clusterSnapShotTree").getStore().getRootNode().childNodes;    //获取下面硬盘的第一级子节点
        for(i=0;i<devTree.length;i++){
            var childNodes=devTree[i].childNodes;    //二级子节点
            for(j=0;j<childNodes.length;j++){
                var nodes=childNodes[j];
                var harddiskid=nodes.raw.diskIdentity;
                if(harddiskid==id){
                    nodes.set("checked" , true);
                    selChild(nodes,checked);    //选中子节点
                }
            }
        }
    });
    disabledShareDiskCheckBox();
}

/**
 * 取消选中共享磁盘中的数据，下面的磁盘同步选择
 */
function cancleChooseSameDisk(node, checked){
    node.eachChild(function(child) {
        var id=child.raw.diskIdentity;    //选中的硬盘id
        var devTree = Ext.getCmp("clusterSnapShotTree").getStore().getRootNode().childNodes;    //获取下面硬盘的第一级子节点
        for(i=0;i<devTree.length;i++){
            var childNodes=devTree[i].childNodes;    //二级子节点
            for(j=0;j<childNodes.length;j++){
                var nodes=childNodes[j];
                var harddiskid=nodes.raw.diskIdentity;
                if(harddiskid==id){
                    nodes.set("checked" , false);
                    dSelChild(nodes,checked);    //取消选中子节点
                }
            }
        }
    });
    disabledShareDiskCheckBox();
}


/**
 * 验证快照，是否可以进行挂载
 */
function vmdkMountVerify(vmimgId){
	
	var ifMountCfg = false;
	   
    Ext.Ajax.request({
        url : '/recovery/recoveryAction!checkVmdkMountCfgState.action',    //磁盘是否可被创建挂载
        timeout : 10000,    //设置10秒超时
        async : false,
        params : {
            'vmimgId' : "v_"+vmimgId  //后台接收参数类型 v_id;
        },
        success : function(response, options) {
            var res=JSON.parse(response.responseText);
            var msgCode = res.msgCode;
            var msgContent = res.msgContent;
            
            if(msgCode == 30000){
                ifMountCfg = true;
                Ext.getCmp('nextBtn').setDisabled(false);  //选择的磁盘可以挂载，则将下一步按钮置点亮
            }else{
                //弹窗提示，不可挂载原因
                showResultDialog(msgCode,msgContent);
                Ext.getCmp('nextBtn').setDisabled(true); //选择的磁盘不能挂载，则将下一步按钮置灰
            }
        },
        failure : function(resp, opts) {
            Ext.websure.MsgError("WF-30117", local.recovery.tipMCE);
        }
    }); 
    return ifMountCfg;
}
