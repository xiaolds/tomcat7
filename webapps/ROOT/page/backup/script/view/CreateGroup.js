
/**
 * Group中的一些常量
 */
var GROUP_CONSTANT = {
		groupNameLenLimit: 25			// 分组名称长度限制
}


/**
 * 左侧显示待选择设备
 */
Ext.define("websure.backup.view.CreateGroupTreeView", {
				extend : 'Ext.tree.TreePanel',
				alias : 'widget.CreateGroupTreeView',
				id : 'CreateGroupTreeView',
				border:false,
				enableColumnMove:false,
				bodyBorder:false,
				useArrows : true,//使用箭头
				rootVisible : false, //默认不显示根节点
				store : 'CreateGroupTreeStore'
	});

/**
 * 右侧显示已选择设备
 */
Ext.define('websure.backup.view.rightShowDevice', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.rightShowDevice',
	id:'rightShowDevice',
	hideHeaders : true,
	border:false,
	store: 'CreateGroupDeviceShowStore',
	columns: [
	          { header: 'deviceId', dataIndex: 'deviceId', flex: 0.2 ,hidden:true},
	          { header: 'deviceName', dataIndex: 'deviceName', flex: 1 }],
	height: "100%",
	width: "100%",
	listeners : {
				itemdblclick:function(record, item, index, e, eOpts ){
					var selId = item.data.deviceId;
					var index = this.store.find('deviceId',selId);  
					this.store.removeAt(index);
				}
			}
});

/**
 * 创建分组模块
 */
Ext.define("websure.backup.view.CreateGroup", {
	extend : 'Ext.window.Window',
	title : local.backup.winCreatGroup,
	draggable : false,
	height : 600,
	width : 700,
	border:false,
	id : 'createGroup',
	layout : "border", //窗口布局类型
	modal : true, //是否模态窗口，默认为false
	bodyStyle:'background:#fff',
	resizable : false,
	constructor : function(config) {
		var me = this;
		me.items = [{
					xtype : 'panel',
					region : 'north',
					height: 60,
					border : false,
					margin:'20 20 10 20',
					items : [{
						xtype : 'textfield',//分组名字
						id : 'GroupName',
						name :'GroupName',
						width:500,
						labelWidth :70,
						fieldLabel:local.backup.groupName    //群组名称
					},{
						xtype:'radiogroup',
						id:'Grouptype',
						width:500,
						fieldLabel:local.backup.groupType,
						labelWidth :70,
						items:[
							{boxLabel:local.backup.groupTypeNormal,id:"Grouptype_1",name:'Grouptype',inputValue:0,checked:true},
							{boxLabel:local.backup.groupTypeCluster,id:"Grouptype_2",name:'Grouptype',inputValue:2},
							{boxLabel:local.backup.groupTypeDouble,id:"Grouptype_3",name:'Grouptype',inputValue:3}
							],
						listeners : {
	     					'check' : function(checkbox, checked){ 
	                        	
	                        },
	                        'change' : function(me, newValue, oldValue, eOpts){
	                        	
	                        	//验证系统是否有集群备份功能
	                        	validateClusterBackupAuth(me,newValue);
	                        }
			               }
						}]
				},{
					xtype : 'panel',
					region : 'west',
					width:330,
					style:'margin-left:20px;border:1px solid #0aa;border-top:none;',
					title : local.backup.winChooseDevice,
					overflowY : 'auto',
					border : false,
					items : [{
						xtype : 'CreateGroupTreeView',
						listeners : {
							afterrender:function(){
								Ext.getCmp("CreateGroupTreeView").store.setProxy({  
						           type : 'ajax',
									url : '/backup/todeviceAction!getCreateGroupTree.action',
									reader : {
										type : 'json',
										root: 'children'
									}
						        })
								Ext.getCmp("CreateGroupTreeView").store.load();
							},
							itemdblclick:function(record, item, index, e, eOpts ){
								//console.log(item)
								var selId = item.data.id;
								if("g" == selId.split("-")[1]){
									return;
								}
								
								//添加进集群分组(groupType[2,3])的机器，必须处于还原配置状态
								var groupType = Ext.getCmp('Grouptype').getValue().Grouptype;								
								if(groupType == 2 || groupType == 3){
								    //1.运行2.暂停3.异常4.主备切换中5.未配置
								    var diskCloneState = item.raw.diskcloneState;
									if(diskCloneState !=5 ){
										Ext.websure.MsgError("WF-30011",'该设备未还原配置,不能添加进集群分组!');
                                        return;
									}
								}								
								
								var store = Ext.getCmp("rightShowDevice").store;
//								var index = store.find('deviceId',item.data.id.split("-")[0]);   
								var index = store.find('deviceName',item.data.text);   
								
								if(index == -1){
									store.add({deviceId:item.data.id.split("-")[0],deviceName:item.data.text,deviceSys:item.raw.deviceSysType});
								}else{
//									Ext.MessageBox.alert(local.window.tip,local.backup.winAddDeviceFailure);
									Ext.websure.MsgError("WF-30011",local.backup.winAddDeviceFailure);
								}
							}
				          
						}
					}]
					}, {
					xtype : 'panel',
					region : 'center',
					title : local.backup.winDevice,
					border:false,
					overflowY : 'auto',
					style:'margin-left:20px;margin-right:20px;border:1px solid #0aa;border-top:none;',
					items : [{
							xtype : 'rightShowDevice'	//右侧区域(显示设备)
					}]
				}, {
					xtype : 'panel',
					region : 'south',
					width : '100%',
					border : false,
					margin:20,
					alias : 'widget.configbuttonfirst',
					layout : 'hbox',
					items : [{  
	                            html : "<a href='javascript:void(0)' onclick='addExtraDevice()'>"+local.backup.winAddExtraDevice+"</a>", //这个点了以后页面会出现在中间面板上
	                            border:false
                        	},{
								flex : 1,
								border : false
							}, {
								xtype : 'button',
								text : local.btn.save,
								cls:"btn_focus",
								id : 'saveButton',
								margin:'0 10 0 10',
								handler : function() {
									var store = Ext.getCmp("rightShowDevice").store;
									var groupName = Ext.util.Format.trim(Ext.getCmp("GroupName").getValue());
									var typeGroup = Ext.getCmp('Grouptype').getChecked()[0].inputValue;
									
									//获取选择设备ID
									var arrForDevicesIds = [];
									var arrForDevicesSys = [];
									if(store.data.length>0){
										Ext.Array.each(store.data.items, function(item){
							        		 arrForDevicesIds.push(item.data.deviceId);
							        		 arrForDevicesSys.push(item.data.deviceSys);
							        	});
									}
									
									// 检测分组名唯一性
									chkGroupNameUniq(groupName, typeGroup, arrForDevicesIds, arrForDevicesSys, function(){
										// 创建分组
										allocateGroup(groupName, arrForDevicesIds, typeGroup);
									});
								}
							}, {
								xtype : 'button',
								text : local.btn.cancle,
								id : 'cancelButton',
								handler : function() {
									Ext.getCmp("rightShowDevice").store.removeAll();
									Ext.getCmp("createGroup").destroy();
								}
							}]
				}];
		me.callParent(arguments);
	},
	listeners : {
		'afterrender' : function() {
//			Ext.getCmp("CreateGroupTreeView").store.reload();
		},
		'close' : function(){
      		Ext.getCmp("rightShowDevice").store.removeAll();
			Ext.getCmp("createGroup").destroy();
  		}
	}
});


/**
 * 检查分组名称是否合法并唯一，检查集群分组系统是否匹配
 * @param groupName：分组名称
 * @param typeGroup： 分组种类
 * @param arrForDevicesIds： 分组中机器ID
 * @param arrForDevicesSys： 分组中机器系统ID
 */
function chkGroupNameUniq(groupName, typeGroup, arrForDevicesIds, arrForDevicesSys, callback){
	
	if("" == groupName){
		Ext.MessageBox.alert(local.window.tip,local.backup.winGroupNotNull);
		return;
	}
	
	if(groupName.length > GROUP_CONSTANT.groupNameLenLimit){
		Ext.MessageBox.alert(local.window.tip,local.backup.winCreatGroupTipNameLength);
		return;
	}
	
	/**
	 * 判断特殊字符
	 */
	if(__isTCZF(groupName)){
		Ext.MessageBox.alert(local.window.tip,local.backup.winCreatGroupTipNameSpecial);
		return;
	}

	var max = Math.max.apply(null, arrForDevicesSys);//最大值
	var min = Math.min.apply(null, arrForDevicesSys);//最小值
	
	if(2 == typeGroup){	// 集群设备
		if(arrForDevicesIds.length < 3){
			Ext.websure.MsgError("WF-30012",local.backup.clusterGroupDeviceGreater3);
			return;
		}
		if(!((max > 28 && min > 28) || (max < 28 && min < 28))){
			Ext.websure.MsgError("WF-30012",local.backup.clusterGroupDeviceSystemMustSame);
			return;
		}
	}else if(3 == typeGroup){	// 双机分组
		if(arrForDevicesIds.length != 2){
			Ext.websure.MsgError("WF-30012",local.backup.doubleGroupDeviceMust2);
			return;
		}
		
		if(!((max > 28 && min > 28) || (max < 28 && min < 28))){
			Ext.websure.MsgError("WF-30012",local.backup.doubleGroupDeviceSystemMustSame);
			return;
		}
	}
	
	// 与后台通信检查分组名称
	Ext.Ajax.request({
		url : '/backup/todeviceAction!selectGroupByName.action',
		params : {
			groupName : groupName
		},
		success : function(response, options) {
			var obj = Ext.decode(response.responseText);
			if(obj.total >0){
				Ext.MessageBox.alert(local.window.tip,local.backup.winGroupExist);
				return;
			}
			
			if(typeof(callback) === "function") {
				callback();
			}
		},
		failure : function() {
			Ext.websure.MsgError("WF-30013",local.backup.winCreatGroupFailure);
		}
	});
	
}

/**
 * 创建集群分组
 * @param groupName 集群分组名
 * @param arrForDevicesIds 分组机器ID
 * @param typeGroup: 分组类型
 */
function allocateGroup(groupName, arrForDevicesIds, typeGroup){
	
	Ext.Ajax.request({
		url : '/backup/todeviceAction!allocationGroup.action',
		params : {
			groupName : groupName,
			deviceIdList:arrForDevicesIds,
			typeGroup:typeGroup
		},
		success : function(response, options) {
			var obj=Ext.decode(response.responseText);
			var code = obj.msgCode;
			var content = obj.msgContent;
			if(MSG_NORMAL==code){
				Ext.websure.MsgTip.msg(local.window.tip, content, true);
				Ext.getCmp("rightShowDevice").store.removeAll();
				Ext.getCmp("createGroup").destroy();
				Ext.getCmp("grobleTreePanel").getStore().load();
			}else{
				Ext.websure.MsgError(code, content);
			}
		},
		failure : function() {
			Ext.websure.MsgError("WF-30012",local.backup.winCreatGroupFailure);
		}
	});
	
}

function addExtraDevice(){
	var param = {
            		deviceId : -1,
            		type:2,
            		operaType:0
            	}
	Ext.create('websure.backup.view.CreateNewDevice',param).show();
}

/**
 * 判断特殊字符
 * @param {} s
 * @return {}
 */
function __isTCZF(s) {
	var re =/[`~!@#$%^&*_+<>{}\/'"“‘[\]]/im;
	return re.test(s);
}

/**
 * author:YangBobin
 * desc:创建集群分组时
 *      验证系统是否拥有集群授权
 */
function validateClusterBackupAuth(me,newValue){
	
	//更新分区类型之后，清空之前选择的设备
    Ext.getCmp("rightShowDevice").store.removeAll();
	/**
     * groupType:    0:普通分组 2：集群分组  3：双机分组
     *  创建集群分组时,验证系统是否有集群备份功能
     *  若无集群分组授权，弹窗提示
     */
    var groupType = newValue.Grouptype;
    if(groupType==2 || groupType==3){
            Ext.Ajax.request({
                    url : '/backup/toclusterAction!getClusterLicense.action',
                    success : function(response, options) {
                        var obj = Ext.decode(response.responseText);
                        var enableClusterBackup = obj.enableClusterBackup;
                        //1:开启集群备份 0：关闭集群备份
                        if(enableClusterBackup == 0 ){
                            if(groupType==2){
                                 me.reset(); //重置
                                 me.items.get(1).setDisabled(true);
                                 Ext.websure.MsgError("WF-30011",'集群备份功能未授权,不能创建集群分组!');
                            }else{
                                 me.reset(); //重置
                                 me.items.get(2).setDisabled(true);
                                 Ext.websure.MsgError("WF-30012",'集群备份功能未授权,不能创建双机分组!');
                            }
                        }
                    }
            });
    }
}
