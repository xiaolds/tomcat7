/**
 * author:yangbobin 
 * date:2015-10-28
 */
var activeSymbol = null;    //记录当前选中的存储路径 symbol 如 S1
var activeMonitorType = null;    //记录当前监控类型,如CPU监控,IO监控
/**
 * 存储节点页面
 */
Ext.define('acesure.recovery.view.StorageNode', {
	extend : 'Ext.panel.Panel',
	id:'storageNode',
	width : '100%',
	border : false,
	bodyBorder:false,
	style:'border:0',
	overflowY:"auto",
	bodyStyle:'border:0',
	alias : 'widget.storageNode',
	items : [ {
				height:60,
				itemId : 'storageNodeToolbar',    //存储节点页面toolBar
				xtype : 'storageNodeToolbar'
			},{
				itemId : 'generalView',    //浏览图
				xtype : 'generalView'
			} ]
});

/**
 * 存储节点toolbar (存储名称 + 概览图按钮 + 文件浏览按钮 )
 */
Ext.define('acesure.recovery.view.StorageNodeToolbar', {
	extend : 'Ext.Toolbar',
	id:'storageNodeToolbar',
	alias : 'widget.storageNodeToolbar',
	padding:'0 25 0 25',
	border:false,
	items : [ {
		itemId : 'storageNodeName',
		xtype : "panel",
		border : false,
		minWidth:360,
		height:24,
		cls:'font_h4',
		html : ''    //默认为空
	},{
		id:'arrowAndSymbol',
		hidden :true,    //默认隐藏
		xtype:'panel',
		height:24,
		border:false,
		layout:'hbox',
		items:[{
			itemId:'arrow',
			width : 20,
			height:24,
			xtype : 'button',
			border:false,
			cls:'ie8',
			style:'background:none',
			icon : '/images/common/arrow_right.png',
			iconAlign : 'right',
			listeners : {
				'click' : showSymbolList
			}
		},{
			itemId : 'activeSymbol',
			xtype : 'button',
			cls:'ie8 font_h4 btn_adr activeSymbol',
			overCls:'adr_over',
			padding:'0 4 0 4',
			html : '',    //当前激活的symbol
			listeners : {
				'click' : showSymbolList
			}
		}]
	}, '->', {
		xtype : 'button',
		itemId:'generalViewBtn',
		text : local.btn.viewGeneral,
		cls:'ie8 btn_node_active',
		border:false,
		style:'padding-left:26px;background:none',
		icon : '/images/common/run.png',
		handler : function() {
			showGeneralView(this);
		}
	}, {
		xtype : 'button',
		itemId:'fileViewBtn',
		text : local.btn.viewFile,
		border:false,
		cls:'ie8',
		style:'padding-left:26px;background:none',
		icon : '/images/common/list.png',
		handler : function() {
			showFileView(this,null);
		}
	} ]
});

/**
 * 文件概览图
 */
Ext.define('acesure.recovery.view.GeneralView',{
	extend : 'Ext.panel.Panel',
	id:'generalView',
	alias : 'widget.generalView',
	width : '100%',
	border : false,
	items : [ {
		padding:'0 20 20 20',
		itemId:'storagePathUseInfo',
		xtype:'storagePathUseInfo'
	}, {
		itemId:'storageInfo',
		xtype:'storageInfo'
	} ]
});

/**
 * 存储介质基本信息及存储介质空间使用分布图表
 */
Ext.define('acesure.recovery.view.StoragePathUseInfo',{
	extend : 'Ext.panel.Panel',
	id:'storagePathUseInfo',
	alias : 'widget.storagePathUseInfo',
	width : '100%',
	height :465,
	overflowX:'auto',
	border : false,
	bodyStyle:'background:#f5f8fa;padding:20px;',
	layout : 'hbox',
	items : [ {
		width:360,
		itemId:'storagePathInfo',
		xtype:'storagePathInfo'
	}, {
		flex:1,
		itemId:'spaceUseChart',
		xtype:'spaceUseChart'
	} ]
});

/**
 * 存储节点下存储路径使用信息面板
 */
Ext.define('acesure.recovery.view.StoragePathInfo',{
	extend : 'Ext.panel.Panel',
	id:'storagePathInfo',
	alias : 'widget.storagePathInfo',
	width : '100%',
	bodyStyle:'background:#f5f8fa;',
	border : false,
	defaults:{
		width:'90%',
		border:false,
		bodyStyle:'background:#f5f8fa;'
	},
	style:'border:0',
	layout : 'vbox',
	items : [ {
		xtype:'panel',
		itemId : 'symbolBtnList',
	//	style:"margin-bottom:80px",
		items:[]    //symbol 按钮列表
	}, {
		itemId:'storagePathInfos',
		padding:'80 0 0 0 ',
		width:'96%',
		html:'<font class="font_h2">...</font><br/><br/>'+local.recovery.space+'<br/><hr/><p>...</p>'
	} ]
});

/**
 * 存储空间使用空间大小图表 
 */
Ext.define('acesure.recovery.view.SpaceUseChart',{
	extend : 'Ext.panel.Panel',
	id:'spaceUseChart',
	alias : 'widget.spaceUseChart',
	style:'background:#fff;border:5px solid #d1dade;vertical-align: middle;',
	height :'100%',
	border:false,
	defaults:{
		width:'100%',
	    border:false,
	    bodyPadding:'0 0 0 10',
	    bodyCls:'vertical_text',
	    margin:1.5
	},
	padding : 5,
	layout : 'vbox',    //竖形排列
	items : []
});

/**
 * 存储节点监控信息面板
 */
Ext.define('acesure.recovery.view.StorageInfo', {
	extend : 'Ext.panel.Panel',
	id:'storageInfo',
	height : 210,
	border:false,
	style:"border-bottom:1px solid #d1dade",
	alias : 'widget.storageInfo',
	items : [ {
				height:70,
				itemId : 'storageInfoToolbar',
		   		xtype : 'storageInfoToolbar'
			},{
				xtype : 'storageMonitor'
			}]
});

/**
 * 存储节点运行状态监控 (存储节点名称 + 监控时间段选择框)
 */
Ext.define('acesure.recovery.view.storageInfoToolbar', {
	extend : 'Ext.Toolbar',
	id:'storageInfoToolbar',
	alias : 'widget.storageInfoToolbar',
	padding:'0 25 0 25',
	style:'border:0;border-top:1px solid #d1dade;border-bottom:1px solid #eef2f4;background:#fcfdfd',
	layout:"hbox",
	items : [ {
		xtype : "panel",
		border : false,
		width : 32,
		height : 32,
		html : '<img src="/images/recovery/node_save.png"/>'
	}, {
		itemId : 'storageNodeName',
		xtype : "panel",
		border : false,
		minWidth : 200,
		cls:'font_h4',
		bodyStyle:"background:none",
		html : ''    //默认为空
	}, {
		itemId : 'timeZone',
		xtype : "panel",
		border : false,
		flex:1,
		bodyStyle:"text-align:center;background:none",
		html : ''    //默认为空
	},{
		xtype: 'combobox',
        width: 160,
        labelWidth: 40,
        fieldLabel:local.time, 
        lableAlign: 'right',
		store : [[1,local.recovery.lastOne],[6,local.recovery.lastSix],[12,local.recovery.in12Hours]],
		valueField : 'type',
		editable : false,
		displayField : 'name',
		id: 'systemTimeId',
		emptyText:local.recovery.chooseTime,
		listeners:{
			'select' : function(){
				loadStoStateData(this.value);
			}
		}
		
	}]
});

/**
 * 定义存储器不在线展示页
 */
Ext.define('acesure.recovery.view.StorageOffLine', {
            extend : 'Ext.panel.Panel',
            id : 'storageOffLine',
            alias : 'widget.storageOffLine',
            border: false,
            width : '100%',
            height : 650,
            bodyStyle:"height:100%",
            style:'text-align:center;margin-top:80px;',
            html:"<span class='offlineClsText'>"+local.recovery.storageOnline+"</span>"
});

/**
 * 定义存储器未授权展示页
 */
Ext.define('acesure.recovery.view.StorageUnauthorized', {
            extend : 'Ext.panel.Panel',
            id : 'storageUnauthorized',
            alias : 'widget.storageUnauthorized',
            border: false,
            width : '100%',
            height : 650,
            bodyStyle:"height:100%",
            style:'text-align:center;margin-top:80px;',
            html:"<span class='offlineClsText'>存储节点未授权</span>"
});
/**
 * 定义存储节点监控Panel
 */
Ext.define('acesure.recovery.view.StorageMonitor',{
	extend : 'Ext.tab.Panel',
	id:'storageMonitor',
	alias : 'widget.storageMonitor',
	cls : 'verticaltab',
	bodyStyle:'border:none;border-left:1px solid #eef2f4;padding:10px;padding-left:0;',
	// 添加tabbar,修改 背景的宽度
	tabBar : {
		width : 115,
		minTabWidth : 95,
		maxTabWidth : 95,
		height : 80,
		orientation : 'top'    // vertical
	},
	tabPosition : 'left',    // 竖形排列
	height : 150,
	enableTabScroll : true,
	activeTab : 0,
	items : [
	         {
				title : 'I/O',
				width : '100%',
				itemId : 'ioChart',
				items:{
					xtype : 'storageMonitorChart'		
				},
				layout: 'fit',
				listeners: { activate: function(){
					actChart(this,IO_MONITOR);
					}
				}
			}/*, {
				title : 'SCSI',
				width : '100%',
				itemId : 'ipNetChart',
				items:{
					xtype : 'storageMonitorChart'
				},
				layout: 'fit',
				listeners: { activate: function(){
					actChart(this,2);
					}
				}
			}, {
				title : 'FC'+local.web,
				width : '100%',
				itemId : 'FCNetChart',
				items:{
					xtype : 'storageMonitorChart'
				},
				layout: 'fit',
				listeners: { activate: function(){
					actChart(this,3);
					}
				}
			}*/ ]
});

var colors=['#00aaaa','#00aaaa','#00aaaa','#00aaaa'];
Ext.define('Ext.chart.theme.charTheme',{
    extend:'Ext.chart.theme.Base',
    constructor:function(config){
        this.callParent([Ext.apply({colors:colors},config)]);
    }
});

/**
 * 定义存储节点监控折线图
 */
Ext.define('acesure.recovery.view.StorageMonitorChart', {
	extend : 'Ext.chart.Chart',
	id:'storageMonitorChart',
	alias : 'widget.storageMonitorChart',
	animate : true,
	theme:"charTheme",
	shadow : false,
	width:'100%',
	height:'100%',
	boder:false,
	store : 'StorageRunStateStore',
	axes : [ {
		type : 'Numeric',
		position : 'left',
		fields : [ 'rate' ],
		minimum : 0,    //最小值
		maximum : 100,    //最大值
		title : false,
		grid : true,
		label:{
           renderer:function(val){
                if(val%20==0){
                    return val;
                }else{
                    return '';
                }
           }
       }
	}, {
		type : 'Category',
		position : 'bottom',
		fields : [ 'showDate' ],    //X轴展示时间
		title : false,
		grid:false,
		dashSize: 1,    //控制刻度的长度
		label:{
			renderer:function(val){
				    return val;
			}
		}
	} ],
	series : [ {
		type : 'line',
		theme:'Green',
		showMarkers:false,
		xField : 'chartDate',
		yField : 'rate',
		tips: {
            trackMouse: true,
            width: 100,
            height: 60,
            style:'word-wrap:break-word;word-break:break-all;text-align:center;',
            renderer: function(storeItem, item) {
            	           showMonitorTip(this,storeItem);
                        }
            }
	} ]
});

/**
 * 设置定时任务，定时获取状态信息
 */
var task_getRunState = null;

/**
 * 激活tabPanel面板 Function
 * params: monitorType 监控类型
 */
function actChart(self,monitorType){
	
	activeMonitorType = monitorType;
	var chartPanel = self;
	chartPanel.removeAll();
	
	//添加状态监控折线图
	chartPanel.add({
		xtype:'storageMonitorChart',
		itemId:'storageMonitorChart'
	});
	
	chartPanel.doLayout();
	//加载存储器运行状态数据
	loadStoStateData(AN_HOUR);    //默认加载最近1小时数据  
	
}

/*
 * 查看存储器最近1/6/12小时的运行状态
 */
function loadStoStateData(timeArea){
	
	Ext.getCmp('storageMonitorChart').store.load({
		params:{
			storageId:activeStorage.id,    //当前存储器id
			monitorType : activeMonitorType,    //监控类型
			timeArea:timeArea    //监控时间段
		},
		//当store 加载完毕
		callback: function(records,opt,success){
			
			//更新监控时间段标题
            var storageInfoToolbar = Ext.getCmp('storageInfoToolbar');
            var timeAreaLabel = storageInfoToolbar.query("[itemId='timeZone']")[0];
			showMonitorLabel(records,timeAreaLabel);
		}
	});
}

/**
 * 文件浏览点击事件
 */
function showFileView(self,deviceId){
	//修改按钮背景样式
	var generalViewBut = self.previousSibling();    //获取概览图按钮
	generalViewBut.removeCls('btn_node_active');
	self.addCls('btn_node_active');
	
	var arrowAndSymbol = Ext.getCmp('arrowAndSymbol');
	var activeSymbolLabel = arrowAndSymbol.getComponent('activeSymbol');
	activeSymbolLabel.update(activeSymbol);    //设置显示的symbol
	arrowAndSymbol.show();    //显示箭头及存储别名
		
	//修改问文件浏览页面
	var storageNode = Ext.getCmp('storageNode');
	storageNode.remove('generalView');
	var fileView = Ext.getCmp('fileView');
	if(fileView){
		fileView.destroy();
	}
	storageNode.add({
		itemId:'fileView',
		xtype:'fileView'
	});
	storageNode.doLayout();
	
	var deviceListTreePanel = Ext.getCmp('deviceListTreePanel');
	var deviceAndVmimgStore = deviceListTreePanel.getStore();    //获取列表数数据源
	deviceAndVmimgStore.load({
		params:{
			symbol : activeSymbol
		},
		callback: function(records, operation, success) {
			var length = records.length;
			var blankPanel = Ext.getCmp('blankPanel');
			
			if(length==0){
				if(blankPanel) return;
				var fileView = Ext.getCmp('fileView');
				fileView.add({
					xtype:'blankPanel'
				});
				fileView.doLayout();
			}else{
				if(blankPanel) blankPanel.destroy();
			}
			
       		//点击设备/新磁盘进入文件浏览展开相应的设备树
			if(deviceId){
				var record = null;
				if(deviceId.indexOf("d_")!=-1){
					//点击设备-展开设备-快照组
					 record = deviceAndVmimgStore.getById(deviceId);
					 deviceListTreePanel.expandNode(record,false);
				}else{
					//点击-新磁盘-展开新磁盘组
					var newDiskGroupNode = deviceAndVmimgStore.getById("newDiskGroup");
					deviceListTreePanel.expandNode(newDiskGroupNode,true);
					//展开后获取newDisk记录
					record = deviceAndVmimgStore.getById(deviceId);
				}
				deviceListTreePanel.getSelectionModel().select(record);
			}
		 }
	});
	
}

/**
 * 概览图点击事件
 */
function showGeneralView(self){
	//修改按钮背景样式
	var fileViewBut = self.nextSibling();    //获取文件浏览按钮
	fileViewBut.removeCls('btn_node_active');
	self.addCls('btn_node_active');
	
	//隐藏箭头及存储别名
	var arrowAndSymbol = Ext.getCmp('arrowAndSymbol');
	arrowAndSymbol.hide();
	
	var storageNode = Ext.getCmp('storageNode');
	storageNode.remove('fileView');
	var generalView = Ext.getCmp('generalView');
	if(generalView){
		generalView.destroy();
	}
	storageNode.add({
		itemId:'generalView',
		xtype:'generalView'
	});
	storageNode.doLayout();
	
	//获取存储节点首页显示信息
	showStPathBaseInfo();
	
	//修改存储节点名称
	var storageInfoBar =  Ext.getCmp('storageInfoToolbar');
	var storageLabel = storageInfoBar.getComponent('storageNodeName');
	storageLabel.update('<span>'+local.recovery.nodeSave+'：'+activeStorage.title+'</span>');
	
}

/**
 * 展示存储别名列表
 */
function showSymbolList(button,e){
	var symbolList = Ext.getCmp("symbolList");
	if(symbolList){
		symbolList.destroy();
	}
	//创建SymbolList菜单
	var symbolListMenu = Ext.create('Ext.menu.Menu',{
		id : 'symbolList',
		border : true,
		style : {
			overflow : 'visible'
		},
		items : []
	});
	//请求symbolList 数据
	Ext.Ajax.request({
		url : '/recovery/tostorageAction!showSymbolList.action',
		params:{
			'storage.id' : activeStorage.id
		},
		success:function(response,options){
			var res = JSON.parse(response.responseText);
			var symbolList = res.symbolList;    //存储别名列表
			for(i in symbolList){
				symbolListMenu.add({
					text : symbolList[i],
					icon : '/images/common/green.png',
					listeners:{
						'click':function(){
							getDeviceListBySymbol(this.text);
						}
					}
				});
			}
			
		},
		failure:function(){
		}
	});
	//显示菜单
	symbolListMenu.showBy(button);
}

/**
 * 根据存储别名获取 设备列表
 */
function getDeviceListBySymbol(symbol){
	activeSymbol = symbol;    //点击菜单后，将symbol设置激活
	var arrowAndSymbol = Ext.getCmp('arrowAndSymbol');
	var symbolLabel = arrowAndSymbol.getComponent('activeSymbol');
	symbolLabel.update(activeSymbol);    //更新symbol显示
	
	var deviceListTreePanel = Ext.getCmp('deviceListTreePanel');
	var deviceAndVmimgStore = deviceListTreePanel.getStore();    //获取列表数数据源
	deviceAndVmimgStore.load({
		params:{
			symbol : symbol
		},
		callback: function(records, operation, success) {
			var length = records.length;
			var blankPanel = Ext.getCmp('blankPanel');
			
			if(length==0){
				if(blankPanel) return;
				var fileView = Ext.getCmp('fileView');
				fileView.add({
					xtype:'blankPanel'
				});
				fileView.doLayout();
			}else{
				if(blankPanel) blankPanel.destroy();
			}
		}
	});
}
