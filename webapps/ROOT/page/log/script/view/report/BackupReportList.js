/*
 * 备份报表头部toolbar
 */
var preCap='';
Ext.define("acesure.view.log.report.BackupLogHeadToolbar", {
	extend : 'Ext.Toolbar',
	alias : 'widget.backupLogHeadToolbar',
	padding:'0 0 0 25',
	height:108,
	style:'border:0;border-bottom:1px solid #d1dade;background:#fafbfc;',
	defaults:{bodyStyle:'background:#fafbfc'},
	items : [{
		xtype : "panel",
		border : false,
		width:48,
		height:42,
		html : '<img src="/images/log/report_system_title.png"/>'
	}, {
		xtype : "panel",
		border : false,
		minWidth:300,
		id : 'backupLogHeadId',
		html : "<font class='font_h3'>"+local.log.backupReport+"</font><br>"+local.log.title2+" "+local.log.title2day
	},"->",{
		xtype : "button",
		text : local.btn.refresh,
		style:'padding-left:26px',
		icon : '/images/common/refresh.png',
		handler : function() {
			//刷新
			var reportLogPanel = Ext.getCmp('reportLogPanel');
			reportLogPanel.removeAll();
			reportLogPanel.add({
					xtype : 'backupReportList'
				});
			}
	}, {
		xtype : "button",
		text : local.btn.export0, 
		style:'padding-left:26px',
		icon : '/images/log/export.png',
		id: 'backupReportExportId',
		itemId : 'reportlog_report_backupexport'
	}, {
		xtype : "panel",
		id : 'backupReportShrink',
		border:false,
		width:56,
		margin:0,
		height:"100%",
		html: "<div class='shrink' onclick='fadeout();'><img src='/images/backup/shrink.png'/></div>"
	}],
	listeners:{
    	afterrender:function(){
    		Ext.Ajax.request({
    			url: '/syslog/toSystemEntire!findSystemEntireTopStatus.action',
				success : function(response, options) {
					var obj = Ext.decode(response.responseText);
					if(typeof(obj.details) != "undefined"){
						Ext.getCmp("backupLogHeadId").update("<font class='font_h3'>"+local.log.backupReport+"</font><br>"+
								local.log.backupReport+local.comma+local.log.title2+obj.details.day+local.log.title2day);
					}
				}
    		});
    	}
	}
});

//返回事件
function fadeout() {
	var reportLogPanel = Ext.getCmp('reportLogPanel');
	reportLogPanel.removeAll();
	reportLogPanel.add({
		xtype : 'logView'
	});
	reportLogPanel.doLayout();

}

/*
 * 备份报表tab标题，全部/正常/异常/未配置
 */
Ext.define("acesure.view.report.BackupReportTab", {
	extend : 'Ext.Panel',
	alias : 'widget.backupReportTab',
	id : 'backupReportTabId',
	height: 128,
	border:false,
	layout:'hbox',
	items : [{
		xtype : "label",
		flex:1,
		height:"100%",
		id : "backupReportTabAll",
		cls:"tabss tab_btn_active",
		overCls:"tab_btn_hover",
		style:"padding:16px 0;border-right:1px solid #F1F4F5;text-align:center;font-size:20px;color:#666;",
		html : "<span class='font_50'>0</span></br>"+local.recovery.tabAll,
		listeners : {
			render: function(c) {
				c.getEl().on('click', function() { 
					var tabBtn = Ext.ComponentQuery.query("#backupReportTabId label");
					var tabBtn2 = Ext.query(".tabss");
					
					for(var i = 0;i < tabBtn.length;i++){
						tabBtn[i].removeCls("tab_btn_active");
					}
					c.addCls("tab_btn_active");
					//设备状态值 1.全部
					var state = "1";
					getGridRefurbishStore(state);
				});
			}
		}
	},{
		xtype : "label",
		flex:1,
		height:"100%",
		id : "backupReportTabNormal",
		cls:"tabss",
		overCls:"tab_btn_hover",
		style:"padding:16px 0;border-right:1px solid #F1F4F5;text-align:center;font-size:20px;color:#00aaaa;",
		html : "<span class='font_50'>0</span></br>"+local.normal,
		listeners : {
			render: function(c) {
				c.getEl().on('click', function() { 
					var tabBtn=Ext.ComponentQuery.query("#backupReportTabId label");
					for(var i=0;i<tabBtn.length;i++){
						tabBtn[i].removeCls("tab_btn_active");
					}
					c.addCls("tab_btn_active");
					
					//设备状态值 2：正常
					var state = "2";
					getGridRefurbishStore(state);
				});
			}
		}
	},{
		xtype : "label",
		flex:1,
		height:"100%",
		cls:"tabss",
		overCls:"tab_btn_hover",
		id : "backupReportTabAbnormal",
		style:"padding:16px 0;border-right:1px solid #F1F4F5;text-align:center;font-size:20px;color:#FF9326;",
		html : "<span class='font_50'>0</span></br>"+local.abnormal,
		listeners : {
			render: function(c) {
				c.getEl().on('click', function() { 
					var tabBtn=Ext.ComponentQuery.query("#backupReportTabId label");
					for(var i=0;i<tabBtn.length;i++){
						tabBtn[i].removeCls("tab_btn_active");
					}
					c.addCls("tab_btn_active");
					//设备状态值  3：异常
					var state = "3";
					getGridRefurbishStore(state);
				});
			}
		}
	},{
		xtype : "label",
		flex:1,
		height:"100%",
		cls:"tabss",
		id : 'backupReportTabNotConfig',
		overCls:"tab_btn_hover",
		style:"padding:16px 0;text-align:center;font-size:20px;color:#ccc;",
		html : "<span class='font_50'>0</span></br>"+local.unconfig,
		listeners : {
			render: function(c) {
				c.getEl().on('click', function() { 
					var tabBtn=[];
					tabBtn=Ext.ComponentQuery.query("#backupReportTabId label");
					for(var i=0;i<tabBtn.length;i++){
						tabBtn[i].removeCls("tab_btn_active");
					}
					c.addCls("tab_btn_active");
					//设备状态值  4:未配置
					var state = "4";
					getGridRefurbishStore(state);
				});
			}
		}
	}],
	listeners:{
    	afterrender:function(){
    		Ext.Ajax.request({
    			url: '/syslog/toSystemBackupLog!findBackupReportLogBystatesCount.action',
				success : function(response, options) {
					var obj = Ext.decode(response.responseText);
					if(typeof(obj.detail) != "undefined"){
						//全部
						Ext.getCmp("backupReportTabAll").update("<span class='font_50'>"+obj.detail[0].all+"</span></br>"+local.recovery.tabAll);
						//正常
						Ext.getCmp("backupReportTabNormal").update("<span class='font_50'>"+obj.detail[0].normal+"</span></br>"+local.normal);
						//异常
						Ext.getCmp("backupReportTabAbnormal").update("<span class='font_50'>"+obj.detail[0].abnormity+"</span></br>"+local.abnormal);
						//未配置
						Ext.getCmp("backupReportTabNotConfig").update("<span class='font_50'>"+obj.detail[0].notconfig+"</span></br>"+local.unconfig);
					}
				}
    		});
    	}
	}
});

/*
 * 根据不同的类型，重新加载store
 */
function getGridRefurbishStore(state){
	var backLogStore = Ext.getCmp("backupReportGridId").getStore();
	backLogStore.removeAll();
	backLogStore.load({
		params : {
			state : state
		}
	});
}

/*
 * 备份报表表格
 */
Ext.define('acesure.view.report.BackupReportGrid', {
	extend:'Ext.grid.Panel',
	alias : 'widget.backupReportGrid',
	id : 'backupReportGridId',
	width:"100%",
	height:300,
	border:false,
	overflowY:"auto", 
	enableColumnResize:false,
	enableColumnMove:false,
	enableColumnHide:false,
	store: 'report.BackupReportStore',
	style:'border-top:1px solid #e3eaec;',
	columns: [ 
	    { header:"deviceIds", menuDisabled:true,dataIndex: 'deviceId', hideable: false, hidden: true},
		{ header:local.device,  menuDisabled:true,dataIndex: 'computerName' , flex:1},
		{ header:local.IP,  menuDisabled:true,dataIndex: 'ip', flex:1},
		{ header:local.log.sysTime, menuDisabled:true, dataIndex: 'synchrIntervalValue' , flex:1,
			renderer : function(v, p, r) {
				var synchrType = r.get("synchrIntervalType");
				if(synchrType == 0){
					synchrType = local.s;
				}else if(synchrType == 1){
					synchrType =local.m;
				}else if(synchrType == 2){
					synchrType = local.hour;
				}else{
					synchrType = local.day;
				}
				return v+" "+synchrType;
			}
		},
		{ header:local.backup.synTimeLast,  menuDisabled:true,dataIndex: 'vmimgModifyTime' , flex:1},
		{ header:local.log.capUsed,  menuDisabled:true,dataIndex: 'use' , width:300,
			renderer : function(v, p, r) {
				var unit = v.substr(v.length-2);    //获得单位
				v = v.substr(0,v.length-2);    //截取值，去除单位
    			var id=Ext.id();
    			var pro1="pro1"+id;
    			var wValue = v;
    			if(unit == "GB"){
    				wValue = (v*0.065).toFixed(2);
    			}else if(unit == "MB"){
    				wValue = (v/1024*0.065).toFixed(2);
    			}else if(unit == "TB"){
    			    //如果值大于3072GB则都按200px显示
    				if(v <= 3){
    					wValue = (v*1024*0.065).toFixed(2);
    				}else{
    					wValue = 200;
    				}
    			}else{
    				wValue = 0.1;
    			}
    			var cpuId=Ext.String.format('<div id="{0}" class="cap_bar_wrap"><span style="width: '+wValue+'px;" class="cap_bar"></span><span class="cap_bar_text">'+v+unit+'</span></div>', pro1);
    			return cpuId;
    		} 
		}
	],
	listeners : {
    	afterrender : function(){
    		//设备状态值 1.全部
			var state = "1";
			getGridRefurbishStore(state);
    	}
    }
});

/*
 * 备份报表-容量占用-头部toolbar
 */
Ext.define("acesure.view.report.BackupReportCapToolbar", {
	extend : 'Ext.Toolbar',
	alias : 'widget.backupReportCapToolbar',
	height:70,
	padding:'0 25 0 25',
	style:'background:#fafbfc;border:0;border-top:1px solid #d1dade;border-bottom:1px solid #eef2f4;',
	items : [{
				xtype : "panel",
				border : false,
				width:32,
				height:32,
				html : '<img src="/images/recovery/node_save.png"/>'
			}, {
				xtype : "panel",
				border : false,
				bodyStyle:"background:none",
				html : '<font class="font_h4">'+local.log.capUsed+'</font>'
			}, {
				xtype : "panel",
				border : false,
				bodyStyle:"background:none",
				id: 'logDailyCapacityId',
				html : local.log.logDailyCapText
			}
			,"->", {
				xtype: 'combobox',
				 width: 160,
                labelWidth: 40,
                fieldLabel: local.time,  
                lableAlign: 'right',
				store : [[1,local.log.halfMonth],[2,local.log.oneMonth],[3,local.log.halfYear],[4,local.log.oneYear]],
				valueField : 'type',
				editable : false,
				displayField : 'name',
				value : 1,
				listeners:{
					'select' : function(v){
						Ext.getCmp("backupReportCapChartInId").store.load({
							params : {
								logTimeId : v.value
							}
			    		});
					}
				}
			}],
			listeners:{
				afterrender : function(){
					Ext.Ajax.request({
		    			url: '/syslog/toSystemBackupLog!findBackupReportLogByDailyCapacity.action',
						success : function(response, options) {
							var obj = Ext.decode(response.responseText);
							if(typeof(obj.detail) != "undefined"){
								Ext.getCmp("logDailyCapacityId").update(local.log.newDailyCapText+obj.detail.useValue+"GB"+local.comma+local.log.mbFree+obj.detail.overplus+"GB");
							}
						}
					});
				}
			}
});
/*
 * 容量占用图表
 */
Ext.define('acesure.view.report.BackupReportCapChartIN', {
	extend:"Ext.chart.Chart",
	alias:"widget.backupReportCapChartIn",
	id:"backupReportCapChartInId",
    animate: true,
    shadow: false,
    store: 'report.BackupReportChartStore',
    axes: [{
        type: 'Numeric',
        position: 'left',    //设置轴的位置
        fields: ['dateChart'],
        title: false,
        grid: true,
        minimum:0    //最小值
    }, {
        type: 'Category',
        position: 'bottom',    //设置轴的位置
        fields: ['name'],
        label:{
			renderer:function(val){
				return "";
			}
		}
    }],
    series: [{
        type: 'column',
        axis: 'left',
        gutter: 30,    //单个条之间的间隔距离
        xField: 'name',    //X轴
        yField: 'dateChart',    //Y轴
        tips: {    //鼠标悬浮
            trackMouse: true,
            width: 200,
            height: 55,
            renderer: function(storeItem, item) {
            	var value = "";
            	var dateCharts = storeItem.get('dateChart');
            	
            	if(typeof(dateCharts) == "string"){
            		value = "<font>"+local.log.dateChart+"</font>";
            	}else{
            		if(dateCharts >= 1024){
            			dateCharts = (dateCharts/1024).toFixed(2) + "TB";
            		}else{
            			dateCharts = dateCharts + "GB";
            		}
            		value = "<font>"+local.log.chart+":"+ dateCharts +"</font>";
            	}
            	this.setTitle("<font>"+local.time+":"+ storeItem.get('name') +"</font><br>" + value);
            }
        }
    }],
    listeners : {
    	afterrender : function(){
    		Ext.getCmp("backupReportCapChartInId").store.load({
				params : {
					logTimeId : 1
				}
    		});
    	}
    }
});	

/*
 * 容量占用-图表
 */
Ext.define('acesure.view.report.BackupReportCapChart', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.backupReportCapChart',
	width: "100%",
	//height: 300,
	padding:30,
	autoShow: true,
	layout: 'fit',
	border:false,
	items: {
		xtype:"backupReportCapChartIn"
	}
});

/*
 * 备份列表-全局布局
 */
Ext.define('acesure.view.report.BackupReportList', {
		extend : 'Ext.panel.Panel',
		alias : 'widget.backupReportList',
		id: 'backupReportListId',
		border:false,
		//bodyStyle:'overflow-y:auto;',
		layout:"vbox",
		items: [{
			width:"100%",
			xtype : 'backupLogHeadToolbar'
		},{
			border:false,
			flex:1,
			width:"100%",
			overflowY:"auto",
			layout:"vbox",
			items:[{
						width:"100%",
						xtype : 'backupReportTab'
					},{
						flex:1,
						minHeight:150,
						xtype : 'backupReportGrid'
					},{
						width:"100%",
						xtype : 'backupReportCapToolbar'
					},{
						flex:1,
						minHeight:150,
						xtype : 'backupReportCapChart'
					}]
		}],
		listeners:{
			render:function(v, eOpts){
				POWER_OP.filterEnableWidgetsOfExtjs(v, CURRENT_USER.getReportlogPower());
			}
		}
});	

