/*
 * 集群日志头部显示
 */
Ext.define("acesure.view.sysLog.ClusterLogToolbar", {
	extend : 'Ext.Toolbar',
	alias : 'widget.clusterLogToolbar',
	height:108,
	padding:'0 0 0 25',
	style:'border:0;border-bottom:1px solid #d1dade;background:#fafbfc;',
	defaults:{bodyStyle:'background:#fafbfc'},
	items : [ {
				xtype : "panel",
				border : false,
				width:48,
				height:42,
				html : '<img src="/images/log/log_system_title.png"/>'
		 }, {
				xtype : "panel",
				border : false,
				html : "<font class='font_h3'>"+local.log.clusterLog+"</font>"
		 },
		 "->",
		 {
			xtype : "button",
			text :local.btn.refresh,
			style:'padding-left:26px',
			icon : '/images/common/refresh.png',
			id: 'clusterLogRefreshId',
			handler : function() {
				//设置时间搜索框为空
				Ext.getCmp("beginDateId").setValue();	
				Ext.getCmp("endDateId").setValue();
		    	
				var beginDateId = Ext.getCmp("beginDateId");
		    	var endDateId = Ext.getCmp("endDateId");
		    	
		    	//搜索条件
		    	var params = {
		    		beginDateId : beginDateId.value,
		    		endDateId : endDateId.value
		    	};
				
				var clusterLogGridId = Ext.getCmp("clusterLogGridId");	
				clusterLogGridId.getStore().reload({
					params : params	
				});
			}
		}, {
			xtype : "button",
			text :local.btn.export0, 
			style:'padding-left:26px',
			icon : '/images/log/export.png',
			id: 'clusterLogExportId',
			itemId:'reportlog_log_backupexport'
		},{
			xtype : "panel",
			id : 'clusterLogShrink',
			border:false,
			width:56,
			margin:0,
			height:"100%",
			html: "<div class='shrink' onclick='fadeout();'><img src='/images/backup/shrink.png'/></div>"
		}]
});

function fadeout() {
	var reportLogPanel = Ext.getCmp('reportLogPanel');	
	reportLogPanel.removeAll();
	reportLogPanel.add({
		xtype : 'logView'
	});
	reportLogPanel.doLayout();

} 

/*
 * 时间搜索框
 */
Ext.define("acesure.view.log.report.ClusterSearchToolbar", {
	extend : 'Ext.Toolbar',
	alias : 'widget.clusterSearchToolbar',
	height: 58,
	padding:20,
	border:false,
	items : [ '<font class="font_t">'+local.log.clusterLog+'</font>', "->" ,{
				xtype:'combobox',
				store : new Ext.data.SimpleStore({
					fields : ['value', 'text'],
					data : [[0, local.log.allModule],
					        [1, local.log.backup], 
					        [2, local.log.emergency],
					        [3, local.log.storage],
					        [4, local.log.warning]]
				}),
				displayField : "text",    //显示的
				valueField : "value",    //需要提交的值
				forceSelection : true,
				typeAhead : true,
				editable: false,
		        id: 'clusterLogModule',	//集群日志模块
		        labelWidth: 40,
		        fieldLabel: local.log.clusterModule,
		        width: 150
			},{
				xtype:'combobox',
				store : new Ext.data.SimpleStore({
					fields : ['value', 'text'],
					data : [[1, local.normal], [2, local.defaulty],[3, local.warn]]
				}),
				displayField : "text",    //显示的
				valueField : "value",    //需要提交的值
				forceSelection : true,
				typeAhead : true,
				editable: false,
				id: 'clusterLogLevel',
		        labelWidth: 40,
		        fieldLabel: local.gridLevel,
		        width: 150
			},{
				xtype: 'datefield',
                width: 170,
                format :'Y-m-d',
                id: 'beginDateId',
                editable : false,
                labelWidth: 40,
                fieldLabel: local.time
			}, ' - ',{
				xtype: 'datefield',
                width: 120,
                format :'Y-m-d',
                id: 'endDateId',
                editable : false
			}, {
				xtype : "button",
				text : local.btn.inquire,
				id: 'searchClusterLogBut'
			},{
				xtype : "button",
				text :local.log.reset,
				id : 'resetClusterLogBut'
			} ]
});



/*
 * 集群日志列表
 */
Ext.define('acesure.view.sysLog.ClusterLogGrid', {
	extend : 'Ext.grid.Panel',
	alias :'widget.clusterLogGrid',
	id: 'clusterLogGridId',
	store : 'sysLog.ClusterLogStore',	
	margin:'10 20 20 20',
	border:false,
	enableColumnResize:false,
	enableColumnMove:false,
	enableColumnHide:false,
    style:'border:1px solid #e3eaec;',
	columns : [ 
	    { header: local.num,  menuDisabled:true,dataIndex: 'clusterLogId', width:80 },
	    { header: local.log.eventId,  menuDisabled:true,dataIndex: 'clusterEventId' , width:90},
        { header: local.log.gridLevel,  menuDisabled:true,dataIndex: 'clusterLogLevel', width:100, 
        	renderer:function(v) {
        		if(v == 1){
        			return "<img src='/images/log/normal.gif' align='absmiddle' />&nbsp;"+local.normal;
        		}else if(v == 2){
        			return "<img src='/images/log/error.gif' align='absmiddle' />&nbsp;"+local.defaulty;
        		}else if(v == 3){
        			return "<img src='/images/log/warning.gif' align='absmiddle' />&nbsp;"+local.warn;
        		}
        	}
        },
        { header:local.log.gridSource,  menuDisabled:true,tdCls:"font_color_999",dataIndex: 'clusterLogIp' , flex: 1},
        { header:local.time,tdCls:"font_color_999", menuDisabled:true, dataIndex: 'clusterLogCreateTime' , width:200 },
        { header:local.backup.content , tdCls:"font_color_999", menuDisabled:true,dataIndex: 'clusterLogContent' , flex: 2,
        	renderer : function(v,m,record,ri,ci) {
				return "<div title='" + v + "'>" + v + "</div>";
			}
        }
    ],
    listeners : {
    	afterrender : function(){
    		Ext.getCmp("clusterLogGridId").store.load();
    	}
    },
    dockedItems: [{
		id: 'clusterLogPage',
        xtype: 'pagingtoolbar',
        store: 'sysLog.ClusterLogStore',
        dock: 'bottom',    //分页 位置
        emptyMsg:local.toobarEmptyMsg,
        displayInfo: true,
        displayMsg:local.toolbarDisplayMsg,
        beforePageText:local.toolbarBeforePageText,
        afterPageText:local.toolbarAfterPageText
       
	}]
});

/*
 * 集群日志全布局
 */
Ext.define('acesure.view.sysLog.ClusterLogList', {
	extend : 'Ext.panel.Panel',
	width : '100%',
	border : false,
	layout:"vbox",
	overflowY:"auto",
	alias : 'widget.clusterLogList',
	items: [{
		width:"100%",
		xtype : 'clusterLogToolbar'
	},{
		width:"100%",
		xtype: 'clusterSearchToolbar'
	},{
		flex:1,
		width:"100%",
		minHeight:200,
		maxHeight:563,
		xtype: 'clusterLogGrid'
	}],
	listeners:{
		render:function(v, eOpts){
			POWER_OP.filterEnableWidgetsOfExtjs(v, CURRENT_USER.getReportlogPower());
		}
	}
});