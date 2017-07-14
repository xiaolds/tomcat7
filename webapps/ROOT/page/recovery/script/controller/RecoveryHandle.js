/**
 * 
 *恢复存储 UI 处理事件
 * author:yangbobin
 * date:2016-7-3
 */
 
 
 /**
 * 点击存储节点响应事件
 */
function activateStorageNode(me,eOpts){
    activeSymbol = null;    
    activeStorage = me;    //将当前激活存储节点记录
    
    //隐藏刷新按钮
    var refreshBtn = Ext.getCmp('refreshBtn');
    refreshBtn.hide();
    //1.清除面板
    activeStorage.removeAll();
    var storageNode = Ext.getCmp('storageNode');
    if(storageNode){
        storageNode.destroy();
    }
    var storageOffLine = Ext.getCmp('storageOffLine');
    if(storageOffLine){
        storageOffLine.destroy();
    }
    var storageUnauthorized = Ext.getCmp('storageUnauthorized');
    if(storageUnauthorized){
    	storageUnauthorized.destroy();
    }
    //2.添加面板
    //节点未授权
    if(activeStorage.licState==1){
    	showUnauthorizedPage();    //存储节点未授权
    }
    //节点已授权
    else{
        if(activeStorage.state==1){
            showOnLinePage();    //存储在线
        }else{
            showOffLinePage();    //存储离线
        }
    }
    
}

/**
 * 展示存储节点在线页面
 */
function showOnLinePage(){
    activeStorage.add({
        itemId : 'storageNode',
        xtype:'storageNode'
    });
    activeStorage.doLayout();
    
    //获取存储节点首页显示信息
    showStPathBaseInfo();
}

/**
 * 展示存储节点不在线页面
 */
function showOffLinePage(){
    activeStorage.add({
            itemId : 'storageOffLine',
            xtype : 'storageOffLine'
         });
    activeStorage.doLayout();
}
/**
 * 展示存储节点未授权页面
 */
function showUnauthorizedPage(){
    activeStorage.add({
            itemId : 'storageUnauthorized',
            xtype : 'storageUnauthorized'
         });
    activeStorage.doLayout();
}
 
 /**
 * 展现存储介质列表基本信息
 */
function showStPathBaseInfo(){
     //1.获取存储介质列表信息
    Ext.Ajax.request({
        url : '/recovery/tostorageAction!showSymbolList.action',
        params:{
            'storage.id' : activeStorage.id
        },
        success:function(response,options){
            var res=JSON.parse(response.responseText);
            var symbolList = res.symbolList;    //获取存储路径别名列表
            
            //当前无已选中的介质，则设置第一个为默认选中
            if(!activeSymbol){
            	activeSymbol = symbolList[0];
            }

            //动态修改存储路径按钮
            var storagePathInfo =  Ext.getCmp('storagePathInfo');
            var symbolBtnList = storagePathInfo.query("[itemId='symbolBtnList']")[0];
            
            symbolBtnList.removeAll();
            for (i in symbolList)
            {
            	if(symbolList[i]==activeSymbol){
                    cls = 'ie8 tab_storage tab_storage_active';    //激活样式
                }else{
                    cls = 'ie8 tab_storage';    //未激活样式
                }
                symbolBtnList.add({                         
                    xtype:'button',                         
                    text:symbolList[i],                     
                    width:50,
                    cls:"ie8 tab_storage",
                    margin:"0 5 0 0",
                    //style:'margin-right:5px;',                  
                    handler : function() {                  
                        var activeButton = this;            
                        showStBaseAndUseInfo(activeButton);  
                    }                                       
                });                                         
                
            };
            symbolBtnList.doLayout();
            
            //展示当前选中介质信息
            var activeButton = symbolBtnList.query("button[text="+activeSymbol+"]")[0];
            if(activeButton){
                showStBaseAndUseInfo(activeButton);
            }else{
                //存储节点下暂无介质
                var storagePathInfos = storagePathInfo.query("[itemId='storagePathInfos']")[0];
                storagePathInfos.update('<font class="font_h2">'+local.recovery.storageMediaNone+'</font>');
                storagePathInfos.update('<br/><br/>'+local.recovery.storageNoMediaNone+'<br/><hr/><p>'+local.recovery.addNode+'</p>');
            }
        },
        failure:function(){
//            Ext.Msg.alert(local.window.tip,local.recovery.webErrorGetSMListFailure);
        	Ext.websure.MsgError("WF-30113",local.recovery.webErrorGetSMListFailure);
        }
    });
}
 
 /**
  * 存储介质点击处理事件
  */
 function showStBaseAndUseInfo(activeButton){
    activeSymbol = activeButton.text;    //当前选中的symbol
    
    //设置当前选中按钮的样式
    var storagePathInfo = Ext.getCmp('storagePathInfo');
    var symbolBtnList = storagePathInfo.query("panel button");
    
    for(var i = 0;i<symbolBtnList.length;i++){
        symbolBtnList[i].removeCls('tab_storage tab_storage_active');
        symbolBtnList[i].addCls('tab_storage');
    }
    activeButton.addCls('tab_storage tab_storage_active');
    
    //修改介质基本信息
    modifyStPathBaseInfo();
}

/**
 * 修改存储介质基本信息
 */
function modifyStPathBaseInfo(){
	
	//获取基本信息组件
    var storagePathInfo = Ext.getCmp('storagePathInfo');
    var storagePathInfos = storagePathInfo.query("[itemId='storagePathInfos']")[0];
    
	var mask = new Ext.LoadMask(storagePathInfos, {msg:local.recovery.infoLoading});
    mask.show();
    controlFileView(false);
    controlSymbolButton(false);
    controlTabPanel(false);
    //根据symbol 获取存储器信息
    Ext.Ajax.request({
        url : '/recovery/tostorageAction!showStoragePathInfoBySymbol.action',
        timeout : 10000,    //设置10秒超时
        async : true,
        params:{
            'storagePath.symbol' : activeSymbol
        },
        success:function(response,options){
        	mask.hide();
        	controlFileView(true);
        	controlSymbolButton(true);
        	controlTabPanel(true);
            var res = JSON.parse(response.responseText);
            var storagePath = res.storagePath;
            
            var vmsUsedSize = storagePath.usedSize;  //存储介质已用空间
            var vmsTotalSize = storagePath.size;    //存储介质总空间
            var vmsFreeSize = storagePath.freeSize;;    //存储介质剩余空间
            //修改介质基本信息(名称/总空间/已使用/路径)
            storagePathInfos.update('<font class="font_h2">'+activeSymbol+'</font><br/><br/>总空间 '+bytesToSize(vmsTotalSize)+' 已用 '+bytesToSize(vmsUsedSize)+'<br/><hr/><p>'+storagePath.path+'</p>');
            //修改介质使用信息图表
            modifyStPathUseInfo(vmsTotalSize,vmsFreeSize);    
        },
        failure:function(){
        	mask.hide();
        	controlFileView(true);
        	controlSymbolButton(true);
        	controlTabPanel(true);
//            Ext.Msg.alert(local.window.tip,local.recovery.webErrorGetSMFailure);
        	Ext.websure.MsgError("WF-30114",local.recovery.webErrorGetSMFailure);
        }
    });
}
/**
 * 修改介质使用信息图表
 */
function modifyStPathUseInfo(vmsTotalSize,vmsFreeSize){
	var spaceUseChart = Ext.getCmp('spaceUseChart');
	var mask = new Ext.LoadMask(spaceUseChart, {msg:local.recovery.mediaInfoLoading});
    mask.show();
    controlFileView(false);
    controlSymbolButton(false);
    controlTabPanel(false);
    //根据symbol获取使用信息
     Ext.Ajax.request({
        url : '/recovery/tostorageAction!showStoragePathUseInfo.action',
        timeout : 10000,    //设置10秒超时
        params:{
            'storagePath.symbol' : activeSymbol
        },
        success:function(response,options){
        	mask.hide();
        	controlFileView(true);
        	controlSymbolButton(true);
        	controlTabPanel(true);
            var res = JSON.parse(response.responseText);
            var customDiskList = res.customDiskList;    //用户自定义磁盘列表
            var deviceStorageInfoList = res.deviceStorageInfoList;    //存储介质上设备使用统计
            
            //修改介质使用分布图表  (客户机占用/用户自定义磁盘占用/剩余空间)
            spaceUseChart.removeAll();
        
            //1.修改客户机占用图表
            for(i in deviceStorageInfoList){
                var deviceStorageInfo = deviceStorageInfoList[i];
                var totalUseSize = deviceStorageInfo.totalUseSize;    //客户机占用空间
                var usedRatio = totalUseSize/vmsTotalSize;    //占用比例
                var clusterIdentity = deviceStorageInfo.clusterIdentity;    //0：普通机器,1 集群机器
                var computeName = deviceStorageInfo.computerName;    //客户端名称
                if(clusterIdentity == 1){
                	computeName = '[Cluster]' + computeName;  //根据6.1 UX 集群机器显示名称如[Cluster]客户端名称
                }
                
                spaceUseChart.add({
                    height:330*usedRatio,
                    minHeight :'20',    //添加最小高度，防止高度过小被覆盖
                    itemId:'d_'+deviceStorageInfo.deviceId,
                    listeners: {
                        render: function(c) {
                        c.body.on('click', function() { 
                             // 左键点击进入设备-快照树,并选中当前设备
                            var fileViewBtn = Ext.getCmp('storageNodeToolbar').query("button[itemId='fileViewBtn']")[0];
                            showFileView(fileViewBtn,c.itemId);
                            });
                        },
                        scope: this
                    },
                    style:'background:#7ba3ba;',
                    bodyStyle:'background:#7ba3ba;color:#fff;',
                    html:'<a style="cursor:pointer"><img src="/images/recovery/icon_storage.png" style="vertical-align:middle;"/>&nbsp;&nbsp;'
                        +'<b style="display:inline-block;width:30%;min-width:200px;">'+computeName+'</b>'
                        +'<b style="display:inline-block;width:30%;text-align:center">'+deviceStorageInfo.ip+'</b>'+local.usedSize+bytesToSize(totalUseSize)+'</a>'
                });
            };
            //2.修改用户自定义磁盘占用图表
            for(j in customDiskList){
                var customDisk = customDiskList[j];
                var dataSize = customDisk.vmimgCurrentLength;    //用户自定义磁盘实际占用空间
                var sizeRatio = dataSize/vmsTotalSize;    //占用比例
                spaceUseChart.add({
                    height:330*sizeRatio,
                    minHeight :'20',    //添加最小高度，防止高度过小被覆盖
                    itemId:'v_'+customDisk.vmimgId,
                    listeners: {
                        render: function(c) {
                        c.body.on('click', function() { 
                             // 左键点击进入设备-快照树，并选中当前新磁盘
                            var fileViewBtn = Ext.getCmp('storageNodeToolbar').query("button[itemId='fileViewBtn']")[0];
                            showFileView(fileViewBtn,c.itemId);
                            });
                        },
                        scope: this
                    },
                    style:'background:#0aa',
                    bodyStyle:'background:#0aa;color:#fff;',
                    html:'<a style="cursor:pointer"><img src="/images/recovery/disk.png" style="vertical-align:middle;"/>&nbsp;&nbsp;'
                        +'<b style="display:inline-block;width:60%;">'+customDisk.vmimgFileName+'</b>'
                        +local.recovery.dataSize+bytesToSize(dataSize)+'</a>'
                });
            };
            //3.修改 ”更多“按钮
            spaceUseChart.add({
                height:'20',
                style:'background:#e0e0e0',
                listeners: {
                    render: function(c) {
                    c.body.on('click', function() { 
                        var fileViewBtn = Ext.getCmp('storageNodeToolbar').query("button[itemId='fileViewBtn']")[0];
                        showFileView(fileViewBtn,null);
                        });
                    },
                    scope: this
                },
                bodyStyle:'background:#e0e0e0;text-align:center;',
                html:'<a style="cursor:pointer"><font color = "#000"><b>'+local.btn.moreInfo+'...</b></font></a>'
            });
            //4.修改介质剩余空间图表
            spaceUseChart.add({
                flex:1,
                minHeight :'20',    //添加最小高度，防止高度过小被覆盖
                style:'background:#e0e0e0',
                bodyStyle:'background:#e0e0e0;text-align:center;',
                html:'<font color = "#000"><b> '+local.config.freeSpace+bytesToSize(vmsFreeSize)+'</b></font>'
            });
            spaceUseChart.doLayout();
                
            },
            failure:function(){
            	mask.hide();
            	controlFileView(true);
            	controlSymbolButton(true);
            	controlTabPanel(true);
//                Ext.Msg.alert(local.window.tip,local.recovery.webErrorGetSMUseFailure);
            	Ext.websure.MsgError("WF-30115",local.recovery.webErrorGetSMUseFailure);
            }
    });
}

/**
 * 文件浏览按钮可用/不可用
 */
function controlFileView(flag){
	var fileViewBtn = Ext.getCmp('storageNodeToolbar').query("button[itemId='fileViewBtn']")[0];
	if(flag){
		fileViewBtn.enable();
	}else{
        fileViewBtn.disable();
	}
}
/**
 * 概览图按钮可用/不可用
 */
function controlGeneralView(flag){
	var generalViewBtn = Ext.getCmp('storageNodeToolbar').query("button[itemId='generalViewBtn']")[0];
    if(flag){
    	generalViewBtn.enable();
    }else{
        generalViewBtn.disable();
    }
}
/**
 * 存储介质列表按钮可用/不可用
 */
function controlSymbolButton(flag){
	var storagePathInfo = Ext.getCmp('storagePathInfo');
    var symbolBtnList = storagePathInfo.query("[itemId='symbolBtnList']");
    if(flag){
    	for(i in symbolBtnList){
           symbolBtnList[i].enable();
        }
    }else{
	    for(i in symbolBtnList){
           symbolBtnList[i].disable();
        }
    }
}
/**
 * 恢复存储主面板tabPanel按钮可用/不可用
 */
function controlTabPanel(flag){
	var storageTabPanel = Ext.getCmp('storageTabPanel');
	var tabPanelList = storageTabPanel.items.items;
	 if(flag){
        for(i in tabPanelList){
           tabPanelList[i].enable();
        }
    }else{
        for(i in tabPanelList){
           tabPanelList[i].disable();
        }
    }
}

/**
 * bytes 转化为其他计量单位
 */
function bytesToSize(bytes) {
    if (bytes === 0) return '0 B';
    var k = 1024,
        sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
        i = Math.floor(Math.log(bytes) / Math.log(k));
   return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}
/**
 * 
 * getStorageMaxSize:获取存储介质大小
 * @data 2016-7-28
 * @auth WangShaoDong
 */
function getStorageMaxSize(data1,data2,me){
	var unit=data1;
	var symbol=data2;
	var returnData=0;
	Ext.Ajax.request({
		url:'/recovery/recoveryAction!getStorageMaxSize.action',
		timeout: 40000,
		params:{
			unit:unit,
			symbol:symbol
		}, 
		success: function(resp,opts) {
			returnData=JSON.parse(resp.responseText);
			me.setMaxValue(returnData);
		},
		failure: function(resp,opts) {
			
		}
	});
}
/**
 * 
 * stepIntoMountSnapShot:单击源设备名跳转到原设备对应的快照页面
 * @data 2016-8-6
 * @auth WangShaoDong
 */
function stepIntoMountSnapShot(deviceId){
	var contentPanel = Ext.getCmp('recoveryContentPanel');
	var grobleTreePanel=contentPanel.previousSibling("grobleTreePanel");
	var treeNodes=grobleTreePanel.getStore().getRootNode();
	var childnodes = treeNodes.childNodes;
	for(i=0;i<childnodes.length;i++){
		var groupNodes=childnodes[i].childNodes;
		for(j=0;j<groupNodes.length;j++){
			var deviceNodes=groupNodes[j];
			var treeDeviceId=deviceNodes.raw.deviceId;
			if(deviceId==treeDeviceId){
				grobleTreePanel.getSelectionModel().select(deviceNodes); 
		  		contentPanel.removeAll();
		  		var mount = Ext.create("acesure.recovery.view.Mount",{
		  			clusterIdentity:deviceNodes.raw.clusterIdentity,
		  			deviceId:deviceNodes.raw.deviceId,
					deviceName:deviceNodes.raw.pageText,
					uuid:deviceNodes.raw.uuid,
					sysInfo:deviceNodes.raw.sysInfo,
					version:deviceNodes.raw.version,
					type:deviceNodes.raw.clientSystype,
					ip:deviceNodes.raw.ip,
		    	    deviceType:deviceNodes.raw.deviceType,
		    	    deviceState:deviceNodes.raw.status
	  			});
	  			contentPanel.add( mount );
		  		contentPanel.doLayout();
			}
		}
	}
}