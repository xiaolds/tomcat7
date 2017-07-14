
/**
 * 定义磁盘信息tree 创建共享磁盘
 */
Ext.define('websure.backup.view.ClusterSelectDiskinfoList', {
			extend : 'Ext.tree.Panel',
			alias : 'widget.ClusterSelectDiskinfoList',
			id : 'clusterSelectDiskinfoList',
			useArrows : true,
			rootVisible : false,
			multiSelect : true,
			sortableColumns:false,
			enableColumnMove:false,
			enableColumnResize:false,
			store : 'ClusterAllDeviceHardDiskStore',
			columns : [{
						xtype : 'treecolumn',
						text : local.backup.deviceDisk,
						flex : 2,
						menuDisabled:true,
						tdCls:"font_bold",
						dataIndex : 'device_hard_Name'
					},{
						xtype : 'column',
						text :"deviceId",
						flex : 1.5,
						menuDisabled:true,
						dataIndex : 'deviceId',
						hidden : true
						
					},{
						text : local.backup.deviceStandbyModel,
						width:130,
						menuDisabled:true,
						align : 'left',
						dataIndex : 'standbyModel',
						hidden : true
					}, {
						xtype : 'column',
						text : local.backup.deviceType,
						flex : 1.5,
						menuDisabled:true,
						dataIndex : 'deviceType',
						hidden : true
					},{
						xtype : 'column',
						text : local.backup.hardIndex,
						flex : 1.5,
						menuDisabled:true,
						dataIndex : 'hardIndex',
						hidden : true
					}, {
						xtype : 'column',
						menuDisabled:true,
						text :local.backup.clusterTypeShareDisk,
						flex : 1,					
						dataIndex : 'hardDiskIsShared',
						hidden : true
					},{
						menuDisabled:true,
						text : local.backup.diskInfoGridSize,
						width:110,
						menuDisabled:true,					
						dataIndex : 'totalSector',
						align : 'left'
					}, {
						text : local.backup.hardType,
						width:130,
						menuDisabled:true,
						dataIndex : 'hardType',
						hidden : true
					}],
			loadMask : {
				msg : local.loading
			},
			listeners : {
				'checkchange' : function(node, checked) {//传递两个参数,一个是当前节点,一个是当前节点的选中状态
					node.set('checked', checked);//将当前状态付给node
					node.parentNode.eachChild(function(item) {
						if(item.id != node.id){		
							item.set('checked', false);
						}
					});
				},
				'afteritemexpand':function(){
					disabledCheckboxShareConfig();
				},
				'afteritemcollapse':function(){
					disabledCheckboxShareConfig();
				}
			}
		});
/**
 * 共享磁盘panel
 */
Ext.define('websure.backup.view.ClusterConfigShareDisk', {
	extend : 'Ext.panel.Panel',
	border : false,
	width:'100%',
	flex:1,
	alias : 'widget.ClusterConfigShareDisk',
	id : 'clusterConfigShareDisk',
	layout : 'vbox',
	items : [{
				xtype : 'label',
				html : '<b>'+local.backup.chooseshareDisk+'</b>',
				height : 25
			}, {
				xtype : 'ClusterSelectDiskinfoList',
				flex:1,
				width : '100%'
			}]
});


/*
 * 备份配置弹出窗口
 */
Ext.define("websure.backup.view.CreateClusterShareHard", {
	extend : 'Ext.window.Window',
	title : local.backup.createClusterShareHard,
	draggable : false,
	height : 600,
	width : 800,
	closable : true,
	id : 'CreateClusterShareHardWindow',
	layout : "border",    //窗口布局类型
	modal : true,    //是否模态窗口，默认为false
	resizable : false,
	constructor : function(config) {
		var me = this;
		me.items = [{
					xtype : 'form',
					region : 'center',
					border:false,
					style : 'background:#fff;padding:20px;',
					layout:'vbox',
					items : [{
						margin:'0 0 10 0',
						xtype : 'textfield',
						id : 'clusterShareName',
						name :'clusterShareName',
						width:745,
						labelWidth :90,
						fieldLabel:local.backup.clusterShareName
                        },{
						xtype : 'ClusterConfigShareDisk',
						listeners : {
							'afterrender' : function(record) {
								var store_disk = Ext.getCmp("clusterSelectDiskinfoList").getStore(); 
								//console.log(Ext.getCmp("clusterSelectDiskinfoList").columns[5])
								if(null != store_disk){
									store_disk.getRootNode().removeAll();//清空数据
								}
								
								 store_disk.setProxy({
						            type: 'ajax',  
						            url: '/backup/todeviceAction!getClusterShareHardDiskInfoForCreate.action',
						            reader : {
										type : 'json',
										root: 'children'
									}
						        });
								store_disk.load({
										params : {
											clusterId : clusterId
										},
										callback: function(records, operation, success) {
											disabledCheckboxShareConfig();
									    }
								});
							}
							
						}
					}]
				}, {
					xtype : 'panel',
					region : 'south',
					width : '100%',
					//height:72,
					border : false,
					style:'background:#fafbfc;border-top:1px solid #d1dade;padding:20px',
					bodyStyle:'background:#fafbfc',
					defaults : {
						style : 'margin-left:10px'
					},
					alias : 'widget.configbuttonfirst',
					layout : 'hbox',
					items : [{flex:1,border:false},
							 {
								xtype : 'button',
								text : local.btn.save,
								cls:"btn_focus",
								id : 'clusterSaveButton',
								handler : function() {
									var sharedName = Ext.util.Format.trim(Ext.getCmp("clusterShareName").getValue());
									
									if("" == sharedName){
										Ext.MessageBox.alert(local.window.tip,local.backup.clusterShareNameBlankPleaseReEnter);
										return;
									}
									if(sharedName.length>10){
										Ext.MessageBox.alert(local.window.tip,local.backup.clusterShareNameLengthLess10);
										return;
									}
									if(__isTCZF(sharedName)){
										Ext.MessageBox.alert(local.window.tip,local.backup.clusterShareNameCannotHaveSpecialChars);
										return;
									}
									// 禁用按钮
									var saveBut = Ext.getCmp("clusterSaveButton");
									saveBut && saveBut.disable();
									//判断共享磁盘的名称是否重复
									Ext.Ajax.request({
										url : '/backup/todeviceAction!getShareNameIsExist.action',
										params : {
											clusterId : clusterId,
											shareName : sharedName
										},
										success : function(response, options) {
											// 开启按钮
											var saveBut = Ext.getCmp("clusterSaveButton");
											saveBut && saveBut.enable();
											var obj = Ext.decode(response.responseText);
											if(obj.info > 0){
												Ext.MessageBox.alert(local.window.tip,local.backup.clusterShareNameExistPleaseReEnter);
												return;
											}
											
											//判断选中的共享磁盘
											var chs = Ext.getCmp("clusterSelectDiskinfoList").getChecked();//获取当前树中被选中的所有节点
											var deviceLength = Ext.getCmp("clusterSelectDiskinfoList").getStore().getRootNode().childNodes.length
											if(chs.length != deviceLength){
												Ext.MessageBox.alert(local.window.tip,local.backup.clusterEveryDeviceMustChooseOneDisk);
												return;
											}
											
											//获取选择磁盘信息
											var arrForDeviceHardDisks = [];
									        Ext.Array.each(chs, function(item){
									        	arrForDeviceHardDisks.push(item.data.deviceId+":"+item.data.hardIndex+":"+item.data.standbyModel);
									        });
									        
									        //保存共享磁盘信息
											Ext.Ajax.request({
												url : '/backup/toclusterAction!saveShareDiskInfo.action',
												params : {
													arrForDeviceHardDisks : arrForDeviceHardDisks,
													shareName : sharedName,
													clusterId : clusterId
												},
												success : function(response, options) {
													var obj = Ext.decode(response.responseText);
														var code = obj.msgCode;
														var content = obj.msgContent;
														if(MSG_NORMAL==code){
															Ext.websure.MsgTip.msg(local.window.tip, content, true);
																Ext.getCmp('CreateClusterShareHardWindow').destroy();
																var configShareDisk = Ext.getCmp('configShareDisk');
																	configShareDisk.removeAll();
																var configContentPanel = Ext.getCmp('configContentPanel');
																	configContentPanel.remove(configShareDisk)
																	configContentPanel.add({
																			xtype : 'ConfigShareDisk',
																			id : 'configShareDisk'
																	})
																	configContentPanel.doLayout(); 
														}else{
															Ext.websure.MsgError(code, content);
														}
												},
												failure : function() {
													Ext.websure.MsgError("WF-30010",local.backup.clusterEveryDeviceMustChooseOneDisk);
												}
											})
										},
										failure : function() {
											Ext.websure.MsgError("WF-30010",local.backup.shareDiskNameRepeatFailure);
										}
									})
								}
							},{
								xtype : 'button',
								text : local.btn.cancle,
								id : 'clusterCancelButton',
								handler : function() {
//									currentPanel = 1;
									Ext.getCmp('CreateClusterShareHardWindow').destroy();
									      
								}
							} ]

				}];
		me.callParent(arguments);
	},
	listeners : {
	
	}
});

/**
 * 判断特殊字符
 * @param {} s
 * @return {}
 */
function __isTCZF(s) {
	var re =/[`~!@#$%^&*_+<>{}\/'"“‘[\]]/im;
	return re.test(s);
}

//是否为共享磁盘，是则禁用复选框
function disabledCheckboxShareConfig(){
	var devTree = Ext.getCmp("clusterSelectDiskinfoList").getStore().getRootNode().childNodes;
	for(i=0;i<devTree.length;i++){
		var childNodes=devTree[i].childNodes;    //二级子节点
		for(j=0;j<childNodes.length;j++){
			    var node=childNodes[j];
				var thisValue=node.get("hardDiskIsShared");
			    console.log(thisValue);
				if(thisValue==1){
						var id=node.id.slice(59);
						$("tr[data-recordid="+id+"]").find("td:first div.x-grid-cell-inner input").addClass("disabled").attr("disabled","disabled").css("opacity","0.3");
			  }
		}
	}
}