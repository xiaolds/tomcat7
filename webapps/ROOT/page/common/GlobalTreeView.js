var everGroup = null;
var beforeMoveGroupType = null;
var beforeMoveGroupDeviceCount = null;

Ext.define("Sharera.util.TreeFilter",{  
        filterByText: function(text,by) {  
            this.filterBy(text, by);  
        },  
        
        filterBy: function(text, by) {  
            this.clearFilter();  
            var view = this.getView(),  
                me = this,  
                nodesAndParents = [];  
            // Find the nodes which match the search term, expand them.  
            // Then add them and their parents to nodesAndParents.  
            this.getRootNode().cascadeBy(function(tree, view){  
                var currNode = this;             
                if(currNode && currNode.data[by] && currNode.data[by].toString().toLowerCase().indexOf(text.toLowerCase()) > -1) {  
                    me.expandPath(currNode.getPath());  
                    while(currNode.parentNode) {  
                        nodesAndParents.push(currNode.id);  
                        currNode = currNode.parentNode;  
                    }  
                }  
            }, null, [me, view]);  
            // Hide all of the nodes which aren't in nodesAndParents  
            this.getRootNode().cascadeBy(function(tree, view){  
                var uiNode = view.getNodeByRecord(this);  
                if(uiNode && !Ext.Array.contains(nodesAndParents, this.id)) {  
                    Ext.get(uiNode).setDisplayed('none');  
                }  
            }, null, [me, view]);  
        },  
        clearFilter: function() {  
            var view = this.getView();  
            this.getRootNode().cascadeBy(function(tree, view){  
                var uiNode = view.getNodeByRecord(this);  
                if(uiNode) {  
                    Ext.get(uiNode).setDisplayed('table-row');  
                }  
            }, null, [this, view]);  
              
        }  
          
    });  

var tree = Ext.define("websure.backup.view.GlobalTreeView", {
				extend : 'Ext.tree.TreePanel',
				alias : 'widget.grobleTreePanel',
				id : 'grobleTreePanel',
				cls:'tree_scroll bgcolor',
				border:false,
				floatable:false,
				draggable:false,
				enableDD:false,
				enableColumnMove:false,
				enableDD : true,
				bodyBorder:false,
				mixins: {  
           			treeFilter: 'Sharera.util.TreeFilter'  
        		},    
				useArrows : true,//使用箭头
				lines:true,//节点之间连接的横竖线
				//autoScroll : true,
				//overflowY:"auto",
				rootVisible : false, //默认不显示根节点
				store : 'GlobalTreeStore',
				tbar:[{  
			        xtype: 'trigger',  
			        triggerCls: 'x-form-search-trigger',  
			        onTriggerClick: function () {  
			            this.setValue('');  
			            var panel=this.ownerCt.ownerCt;  
			            panel.clearFilter();  
			        },  
			        width:'100%',  
			        padding:'10 5 6 5',
			        height:28,
			        cls:'ipt_search',
			        emptyText:local.search,  
			        enableKeyEvents: true,  
			        listeners: {  
			            keyup: {  
			                fn: function (field, e) {  
			                	var panel=this.ownerCt.ownerCt;  
			                    if (Ext.EventObject.ESC == e.getKey()) {  
			                        field.onTriggerClick();  
			                    } else {  
			                        panel.filterByText(this.getRawValue(),'text');  
			                    }  
			                }  
			            }
			        }   
			    }],  
				fbar: [
				  { cls:'btn_fbar1',
				  	xtype: 'button', 
				  	id:'refresh_tree',
				  	text:local.btn.refresh,
				  	listeners: {
				  		'click':function(){
					//刷新store即刷新树
						Ext.getCmp('grobleTreePanel').getStore().reload();
						}
					}
				  },
				  	{
						xtype : 'button',
						text : local.btn.show,
						id : 'showButton',
						cls:'btn_fbar2',
						icon : '/images/common/arrow_down.png',
						iconAlign : 'right',
						listeners : {
							'click' : getShowMenu
						}
					}
				],
				viewConfig : {
					plugins : {
						ptype : 'treeviewdragdrop',
						appendOnly : false
					},
					listeners:{
						beforedrop:function(node,data,overModel,dropPosition,dropFunction,options){
							var recordID = data.records[0].raw.id;
							if(recordID.split("-")[1] == 'd'){
    						    var licenseFlag_ = getDeviceLicenseFlag(data.records[0].raw.id); //设备是否已授权
    				  			if(!licenseFlag_){
    								Ext.MessageBox.alert(local.window.tip, local.unauthDevNoOperate);
    								return false;
    							}
							}
							everGroup = data.records[0].data.parentId;
							beforeMoveGroupType = data.records[0].parentNode.raw.groupType;
							beforeMoveGroupDeviceCount = data.records[0].parentNode.raw.deviceCount;
							
							if("before" == dropPosition){
								if(overModel.data.id.indexOf("-g")>0 || "createGroup" == overModel.data.id){
									Ext.MessageBox.alert(local.window.tip,local.devMoveFailure);
					 		 		return false;
								}
							}else if ("append" == dropPosition){
								if("createGroup" == overModel.data.id){
									Ext.MessageBox.alert(local.window.tip,local.creatGroupFailure);
					 		 		return false;
								}
							}else if ("after" == dropPosition){
								if("createGroup" == overModel.data.id || overModel.data.id.indexOf("-g")>0){
									Ext.MessageBox.alert(local.window.tip,local.devMoveFailure);
					 		 		return false;
								}
							}
					},
					 drop:function(node,data,overModel,dropPosition,options){
					 	var groupType = data.records[0].parentNode.raw.groupType;
						    //ajax的操作把数据同步到后台数据库
					 		//1:获取移动设备原来的分组
					 		//2：获取设备现在移动到的分组
					 		var selectGroup=data.records[0].data.parentId;
					 		var afterMoveGroupType = data.records[0].parentNode.raw.groupType;
					 		//3：比较两个分组是否一致，一致则不进行保存，不一致只进行数据库更新，并刷新页面
					 		if(everGroup == selectGroup){
//					 			Ext.MessageBox.alert("提示","该设备未移动到其他分组，不做修改！");
					 			Ext.MessageBox.alert(local.window.tip,local.devNotEidt);
//					 			Ext.websure.MsgError("32024", "该设备未移动到其他分组，不做修改！");
					 		}else{
					 			//判断当前操作的设备是集群设备还是非集群设备 
					 			if(0 != beforeMoveGroupType){//当前移动的设备处于集群中
										//1、首先判断该集群是不是处于还原设置的状态下
										Ext.Ajax.request({
											url : '/backup/todeviceAction!findClusterState.action',
											params : {
												clusterId : everGroup.split("-")[0]
											},
											success : function(response, options) {
												var obj=Ext.decode(response.responseText);
												if(4 == obj.result){
													//判断集群是否为双机集群
													if(3 == beforeMoveGroupType){//双机
															Ext.websure.MsgError("WF-30010",local.backup.doubleGroupDeviceCannotModify,function(){
																Ext.getCmp('grobleTreePanel').getStore().reload();
																return false;
															})
													}else{//不是双机集群
														//判断当前的集群台数是否大于3台
														if(3<beforeMoveGroupDeviceCount){
															//判断移入的分组不是集群分组
															if(0 != afterMoveGroupType){
																Ext.websure.MsgError("WF-30010",local.backup.clusterGroupDeviceOnlyInNoneCluster,function(){
																	Ext.getCmp('grobleTreePanel').getStore().reload();
																	return false;
																});
															}else{//移入的分组不是集群
																//3、移出群组
																Ext.Ajax.request({
																	url : '/backup/todeviceAction!moveDeviceFromClusterToCommon.action',
																	params : {
										                            			clusterId : everGroup.split("-")[0],//原来所在集群的Id
										                            			selectGroup:selectGroup.split("-")[0],//选择后的分组Id
										                            			deviceId : data.records[0].data.id.split("-")[0]//移动的设备Id
											                            	},
																	success : function(response, options) {
																		var obj=Ext.decode(response.responseText);
																		console.log(obj);
																		var code = obj.msgCode;
																		var content = obj.msgContent;
																		showResultDialog(code, content);
																		Ext.getCmp("grobleTreePanel").getStore().reload();
																	}
																});
															}
														}else{
															Ext.websure.MsgError("WF-30010",local.backup.clusterGroupDeviceLeast3,function(){
																Ext.getCmp('grobleTreePanel').getStore().reload();
																return false;
															})
														}
													}
												}else{//移出设备需要在集群初始化的情况下才可以操作
													Ext.websure.MsgError("WF-30010",local.backup.clusterGroupDeviceRemoveInInit,function(){
														Ext.getCmp('grobleTreePanel').getStore().reload();
														return false;
													})
												}
											}
										});
					 			}else{//当前移动的设备处于非集群中
					 				//判断该设备是否要移入集群中
					 				if(0 != afterMoveGroupType){//移入到集群中
					 					
					 					//判断移入到集群组的单机设备是否处于还原设置 状态
					 					Ext.Ajax.request({
                                            url : '/backup/tobackupAction!getDiskCloneByDeviceId.action',  //TODO获取设备状态 
                                            params : {
                                                deviceId : data.records[0].data.id.split("-")[0]
                                            },
                                            success : function(response, options) {
                                            	var obj=Ext.decode(response.responseText);
                                            	var diskCloneState = obj.detail.state;
                                            	//设备未还原设置
                                                if(5 != diskCloneState){
                                                	Ext.websure.MsgError("WF-30010","设备没有还原设置,不能移入集群组中!",function(){
                                                        Ext.getCmp('grobleTreePanel').getStore().reload();
                                                        return false;
                                                    });
                                                }else{
            					 					//判断移入的集群组是否处于初始化状态
            					 					Ext.Ajax.request({
            											url : '/backup/todeviceAction!findClusterState.action',
            											params : {
            												clusterId : selectGroup.split("-")[0]
            											},
            											success : function(response, options) {
            												var obj=Ext.decode(response.responseText);
            												if(4 == obj.result){
            													//判断移入的集群是否为双机集群
            													if(3 == afterMoveGroupType){//双机
            														Ext.websure.MsgError("WF-30010",local.backup.doubleGroupDeviceCannotModify,function(){
            															Ext.getCmp('grobleTreePanel').getStore().reload();
            															return false;
            														})
            													}else {//集群
            														//移入群组
            														Ext.Ajax.request({
            															url : '/backup/todeviceAction!moveDeviceToCluster.action',
            															params : {
            								                            			selectGroup : selectGroup.split("-")[0],
            								                            			deviceId : data.records[0].data.id.split("-")[0]
            									                            	},
            															success : function(response, options) {
            																var obj=Ext.decode(response.responseText);
            																console.log(obj);
            																var code = obj.msgCode;
            																var content = obj.msgContent;
            																showResultDialog(code, content);
            																Ext.getCmp("grobleTreePanel").getStore().reload();
            															}
            														});
            													}
            												}else{//非初始化状态
            												     Ext.websure.MsgError("WF-30010",local.backup.culsterInitCanInDevice,function(){
            														Ext.getCmp('grobleTreePanel').getStore().reload();
            														return false;
            													});
            												}
            											}
            										});
                                                }
                                            },       
                                            failure : function() {
                                            	Ext.websure.MsgError("WF-30039","查询设备状态失败");
                                            }
					 					});
					 					
					 				}else{//移入到非集群中
					 					Ext.Ajax.request({
											url : '/backup/todeviceAction!updateDeviceGroup.action',
											params : {
												selectGroup : selectGroup.split("-")[0],
												everGroup : everGroup.split("-")[0],
												deviceId : data.records[0].data.id.split("-")[0]
											},
											success : function(response, options) {
												var obj = Ext.decode(response.responseText);
												var code = obj.msgCode;
												var content = obj.msgContent;
												if(MSG_NORMAL==code){
													Ext.websure.MsgTip.msg(local.window.tip, content, true);
		//											Ext.getCmp('grobleTreePanel').getStore().reload();
												}else{
													Ext.websure.MsgError(code, content);
												}
											},       
											failure : function() {
												Ext.websure.MsgError("WF-30039",local.devReloadFailure);
											}
										});
					 				}
					 			}
					 		}
						 }
					}
				},  
	        listeners: {  
	            afterrender: function(){
	            }
	        }   
				
	});
    // 刷新树
function refrechTree() {
	var tree = Ext.getCmp("grobleTreePanel");
	tree.getLoader().load(tree.getRootNode(), function() {
				tree.expandAll();
			});
}

//获取某个设备的实时授权  //deviceID 如：5-d
function getDeviceLicenseFlag(deviceID){
	var deviceLicenseFlag = false;  //设备是否授权标识
    Ext.Ajax.request({
                url : '/backup/todeviceAction!getDeviceAuthState.action',
                async : false,
                params : {
                    deviceId : deviceID.split("-")[0]
                },
                success : function(response, options) {
                    var obj = Ext.decode(response.responseText);
                    if(1==obj.licenseFlag){
                    	deviceLicenseFlag = true;
                    }
                }
            });
    return deviceLicenseFlag;
}

// 显示操作下拉菜单
function getShowMenu(button, e) {
	var exitCDAPMenu = Ext.getCmp("CDAPShowMenu");
	if (exitCDAPMenu) {
		exitCDAPMenu.destroy();
	}
	
	var cdapMenu = new Ext.menu.Menu({
				id : 'CDAPShowMenu',
				style : {
					overflow : 'visible'
				},
				items : [{
							text : local.showByDevName,
							checked: false,
							type:1,
							icon:'/images/common/icon_device_name.png',
                            group: "theme",
                            checkHandler: onItemcheck
						}, {
							text : local.showByIPName,
							checked: false,
							type:2,
							icon:'/images/common/icon_ip.png',
                            group: "theme",
                            checkHandler: onItemcheck
						},{
							text : local.showByDevDescribleName,
							checked: false,
							type:3,
							icon:'/images/common/icon_device_describle.png',
                            group: "theme",
                            checkHandler: onItemcheck
						}]
			});
	cdapMenu.showBy(button);
}

function onItemcheck(item){
	var type = item.type;
	Ext.getCmp("grobleTreePanel").store.reload({
										params : {
											type : type
										}
									});
}