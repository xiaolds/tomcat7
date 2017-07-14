
/**
 * author:yangbobin 
 * date:2015-12-30 文件浏览页面JS
 */
Ext.define('acesure.recovery.view.FileView', {
			extend : 'Ext.panel.Panel',
			id : 'fileView',
			width : '100%',
			border : false,
			style : 'border-top:1px solid #d1dade',
			alias : 'widget.fileView',
			autoScroll : false,
			items : [{
						itemId : 'deviceListTreePanel',    // deviceList
						xtype : 'deviceListTreePanel'    // 设备-硬盘-快照树
					}]
		});

/**
 * 文件浏览属树形面板
 */
Ext.define('acesure.recovery.view.DeviceListTreePanel', {
			extend : 'Ext.tree.TreePanel',
			id : 'deviceListTreePanel',
			alias : 'widget.deviceListTreePanel',
			useArrows : true,
			cls : 'treePanel_icon grid_border',
			maxHeight : '650',
			border : false,
			singleExpand : true,    //一次展开一个节点
			rootVisible : false,    // 不可见根
			setRootNode: function() {
		        if (this.getStore().autoLoad) {
		            this.callParent(arguments);
		        }
		    },
			initComponent : function() {
				var self = this;
				Ext.applyIf(self, {
							store : 'DeviceAndVmimgStore',
							columns : [{
										header : local.pcID,
										dataIndex : 'deviceId',
										hidden : true,
										hideable: false,
										width : '5%'
									}, {
										xtype : 'treecolumn',
										header : local.pcName,
										dataIndex : 'name',
										width : '30%'
									}, {
										header : local.IP,
										dataIndex : 'ip',
										width : '20%',
										sortable : false,
										menuDisabled : true
									}, {
										header : local.useSize,
										dataIndex : 'usedSize',
										width : '20%',
										doSort: function(state) {
										var dataStore = Ext.getCmp('deviceListTreePanel').getStore();
                                        var field = this.getSortParam();
                                        dataStore.sort({
                                            property: field,
                                            direction: state,
                                            sorterFn: function(v1, v2){
                                                v1 = v1.get(field);	
                                                v2 = v2.get(field);
                                                var flag = compareSize(v1,v2);
                                                return flag;
                                            }
                                        });
                                    }
									}, {
										header : local.recovery.synTimeLast,
										dataIndex : 'lastSynchTime',
										flex : 1
									}]
						});
				self.callParent(arguments);
			},
			listeners : {
				itemcontextmenu : {
					fn : dsfMountCfgAndDel
				},
				beforeitemexpand : {
					fn : function(record,eOpts){
						 	var self = this;  
					        var proxy = self.getStore().getProxy();  
					        proxy.extraParams.symbol = activeSymbol;  
					}
				},
				afteritemexpand : { 
					fn : function( node, index, item, eOpts ){
    						var nodeID = node.data['id'];
                            var record = this.getStore().getById(nodeID);
                            this.getSelectionModel().select(record);
					}
				},
				beforeload : {
					fn : function (store, operation, eOpts){
						loadMask = new Ext.LoadMask(this,{
                           msg :local.recovery.dataLoad,
                           removeMask : true    // 完成后移除
                        });            
                        loadMask.show();
                        controlGeneralView(false);
					}
				},
				load : {
					fn : function(me, node, records, successful, eOpts){
						loadMask.hide();
						controlGeneralView(true);
					}
				}
			}
		});

/**
 * 定义存储介质上无数据空面板
 */
Ext.define('acesure.recovery.view.BlankPanel', {
			extend : 'Ext.panel.Panel',
			id : 'blankPanel',
			alias : 'widget.blankPanel',
			border: false,
			width : '100%',
			height : 650,
			bodyStyle : "height:100%",
			style:'text-align:center;margin-top:80px;',
			html:"<span class='offlineClsText'></span>"
		});
	
/**
 * 定义右键 “挂载设置”&"快照删除"按钮及操作
 */
function dsfMountCfgAndDel(self, record, item, index, e){
	var isDsf = record.data.leaf;    //是否为磁盘文件
	var dsf = record.data;    //磁盘文件信息记录
	//选择磁盘文件
	if(isDsf){
        var vmimgType = dsf.vmimgType;    //dsf文件类型 1.完整的快照 2.增量的快照 3..临时的快照  4.空的虚拟磁盘 5.虚拟磁盘(有数据) 
        //--begin--定义右键菜单
        var cfgMenu = Ext.create('Ext.menu.Menu',{
        	            minWidth : 100,
                        items:[/*{//--begin--定义挂载设置菜单
                                text : local.btn.mountConfig,
                                itemId : 'recovery_stonode_configmount',    //设置挂载
                                icon : "/images/recovery/mount/guazai.png",
                                iconCls : 'iconWidth',  
                                listeners : {
                                	click : {
                                	   fn : function(){
                                       	   	 dsfMountCfg(dsf,record);
                                	   }
                                	}
                                }
                                //--end--定义挂载设置菜单
                            },*/{
                                //--begin--定义删除磁盘菜单
                            	text :local.recovery.removeDisk,
                                itemId : 'recovery_stonode_deltempdisk',    //删除磁盘
                                icon : "/images/config/menu_delete.png",
                                iconCls : 'iconWidth',
                                listeners : {
                                    click : {
                                       fn:function(){
                                       	    //弹出确认删除提示框
                                           	Ext.Msg.confirm({
                                                          title:local.window.tip,
                                                          msg:local.recovery.removeFile,
                                                          buttons : Ext.MessageBox.YESNO,
                                                          fn:function(command){
                                                                if (command == "yes") {
                                                                    dsfDel(dsf);
                                                                }
                                                          }
                                            });
                                       }
                                    }
                            }
                                //--end--定义删除快照菜单
                            }]
        });
        e.preventDefault();    // 阻止浏览器默认右键菜单
        cfgMenu.showAt(e.getXY());
        //根据用户权限赋予用户操作权限
        POWER_OP.filterEnableMenuOfExtjs(cfgMenu,CURRENT_USER.getRecoveryPower());
        //--end--定义右键菜单
	}else{
		e.preventDefault();    // 阻止浏览器默认右键菜单
	}
}
/**
 * 快照文件挂载设置
 */
function dsfMountCfg(dsf,record){	
	var isCustomDsf = false;    //标识是否为自定义磁盘文件

	//判断dsf文件 是否为自定义
	var parentNodeId = record.parentNode.get('id');
	if(parentNodeId == 'newDiskGroup'){
		isCustomDsf = true;
	}
	
	var ifMountCfg = false;    //标识dsf是否可以被挂载
	//后台检查磁盘文件是否可以进行挂载设置
	Ext.Ajax.request({
        url : '/recovery/recoveryAction!checkVmdkMountCfgState.action',    //磁盘是否可被创建挂载
        timeout : 10000,    //设置10秒超时
        async : false,
        params : {
            'vmimgId' : dsf.id
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
//            Ext.MessageBox.alert(local.window.tip, local.recovery.tipMCE);
        	Ext.websure.MsgError("WF-30117", local.recovery.tipMCE);
        }
    });  
    if(!ifMountCfg){
    	return;    //当前文件不可挂载，直接跳出
    }
    //针对自定义磁盘及非自定义磁盘进行处理
	if(isCustomDsf){
		//自定义磁盘挂载设置
		mountCustomDisk(dsf.id);
	}else{
		//克隆产生的快照挂载设置
		var deviceNode = record.parentNode.parentNode;    //获取设备节点  dsf->硬盘->设备
		var typeWin = deviceNode.get('sysType');    //设备系统类型
		var snapSetId = dsf.diskcloneId+"-"+dsf.snapshotSetId;    //组装snapSetId 
		var configMountWin = Ext.create("acesure.recovery.view.MountWinShow", {
                                snapSetIdWin : snapSetId,
                                typeWin : typeWin
                            });
        configMountWin.show();
	}
	
}
/**
 * 快照文件删除
 */
function dsfDel(dsf){
    var ifDel = false;    //标识当前快照是否可被删除
    //--begin--后台判断是否可被删除
    Ext.Ajax.request({
        url : '/recovery/recoveryAction!checkVmdkDelState.action',    //磁盘文件是否可被删除   
        timeout : 10000,    //设置10秒超时
        async :  false,
        params : {
            'vmimgId' : dsf.id
        },
        success : function(response, options) {
              var res=JSON.parse(response.responseText);
              var msgCode = res.msgCode;
              var msgContent = res.msgContent;
            
              if(msgCode == 30000){
                  ifDel = true;
              }else{
                  //弹窗提示，不可删除原因
                  showResultDialog(msgCode,msgContent);
              }
        },
        failure : function(resp, opts) {
//            Ext.MessageBox.alert(local.window.tip,local.recovery.failedType );
        	Ext.websure.MsgError("WF-30118",local.recovery.failedType );
        }        
    });
    //--end--后台判断是否可被删除
    if(!ifDel){
    	return;    //不可删除，跳出当前逻辑
    }
    //--begin--后台删除操作
    var myMask = new Ext.LoadMask(Ext.getBody(), {msg:local.recovery.deleLater});
    myMask.show();
    Ext.Ajax.request({
        url : '/recovery/recoveryAction!deleteVmdkById.action',
        timeout : 10000,    //设置10秒超时
        params : {
            'vmimgId' : dsf.id
        },
        success : function(response, options) {
            myMask.hide();
            var res=JSON.parse(response.responseText);
            msgCode = res.msgCode;
            msgContent = res.msgContent;
            //弹窗提示，提示成功或失败
            showResultDialog(msgCode,msgContent);
            //重新加载数据源
            if(msgCode == 30000){
            	Ext.getCmp('deviceListTreePanel').store.reload();
            }
        },
        failure : function(resp, opts) {
            myMask.hide();
//            Ext.MessageBox.alert(local.window.tip,local.recovery.tipDSnapE);
            Ext.websure.MsgError("WF-30119",local.recovery.tipDSnapE);
        }
    });
    
}

/**
 * 自定义磁盘挂载设置
 */
function mountCustomDisk(vmimgId){
	
		Ext.Ajax.request({
				//获取新磁盘的挂载信息
				url : '/recovery/mountAction!getCustomDiskMountInfo.action',
				timeout : 10000,    //设置10秒超时
				params : {
					'vmimgId' : vmimgId    //like : v_1
				},
				success : function(response, options) {
					var res=JSON.parse(response.responseText);
					var mountId = res.mount.mountId;    //挂载ID
					vmimgId = res.mount.vmingId;    //自定义磁盘ID
					//调用新磁盘挂载设置接口
					newMountConfig(mountId,vmimgId);
				},
				failure : function(resp, opts) {
//					Ext.MessageBox.alert(local.window.tip,local.recovery.tipMCE);
					Ext.websure.MsgError("WF-30120",local.recovery.tipMCE);
				}
			});
	
}

/**
 * 自定义容量大小比较(统一转换为Byte后比较大小)
 * @param {} v1
 * @param {} v2
 */
function compareSize(v1,v2){
	v1 = converToByte(v1);
    v2 = converToByte(v2);
    
    return v1 > v2 ? 1 : (v1 < v2 ? -1 : 0);
}

/**
 * 容量单位转换(Other to Byte)
 * @param {} size
 */
function converToByte(size){
	//null or undefine to Byte
	if(!size){
		size = -1;
	}
	//KB to Byte
	else if(size.indexOf("KB")>0){
		size = size.replace("KB","");
        size = parseFloat(size)*1024;
	}
	//MB to Byte
	else if(size.indexOf("MB")>0){
        size = size.replace("MB","");
        size = parseFloat(size)*1024*1024;
    }
    //GB to Byte
    else if(size.indexOf("GB")>0){
        size = size.replace("GB","");
        size = parseFloat(size)*1024*1024*1024;
    }
     //TB to Byte
    else if(size.indexOf("TB")>0){
        size = size.replace("TB","");
        size = parseFloat(size)*1024*1024*1024*1024;
    }
    //Byte to Byte
    else if(size.indexOf("B")>0){
        size = size.replace("B","");
        size = parseFloat(size); 
    }
    
    return size;
}