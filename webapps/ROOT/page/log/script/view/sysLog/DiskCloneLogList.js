/*
 * 头部显示
 */
Ext.define("acesure.view.sysLog.DiskCloneLogToolbar", {
	extend : 'Ext.Toolbar',
	alias : 'widget.diskCloneLogToolbar',
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
				html : "<font class='font_h3'>"+local.backup.backupLog+"</font>"
		 },
		 "->",
		 {
			xtype : "button",
			text :local.btn.refresh,
			style:'padding-left:26px',
			icon : '/images/common/refresh.png',
			id: 'diskCloneLogRefreshId',
			handler : function() {
				//设置时间搜索框为空
				Ext.getCmp("beginDateId").setValue();	// TODO
				Ext.getCmp("endDateId").setValue();
		    	
				var beginDateId = Ext.getCmp("beginDateId");
		    	var endDateId = Ext.getCmp("endDateId");
		    	
		    	//搜索条件
		    	var params = {
		    		beginDateId : beginDateId.value,
		    		endDateId : endDateId.value
		    	};
				
				var diskCloneLogGridId = Ext.getCmp("diskCloneLogGridId");
				diskCloneLogGridId.getStore().reload({
					params : params
				});
			}
		}, {
			xtype : "button",
			text :local.btn.export0, 
			style:'padding-left:26px',
			icon : '/images/log/export.png',
			id: 'diskCloneLogExportId',
			itemId:'reportlog_log_backupexport'
		},{
			xtype : "panel",
			id : 'diskCloneLogShrink',
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
Ext.define("acesure.view.log.report.DiskCloneSearchToolbar", {
	extend : 'Ext.Toolbar',
	alias : 'widget.diskCloneSearchToolbar',
	height: 58,
	padding:20,
	border:false,
	items : [ '<font class="font_t">'+local.backup.backupLog+'</font>', "->" ,{
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
		        id: 'diskCloneLogLevel',
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
				id: 'searchDiskCloneLogBut'
			},{
				xtype : "button",
				text :local.log.reset,
				id : 'resetDiskCloneLogBut'
			} ]
});

/*
 * 备份日志列表
 */
Ext.define('acesure.view.sysLog.DiskCloneLogGrid', {
	extend : 'Ext.grid.Panel',
	alias :'widget.diskCloneLogGrid',
	id: 'diskCloneLogGridId',
	store : 'sysLog.DiskCloneLogStore',
	margin:'10 20 20 20',
	border:false,
	enableColumnResize:false,
	enableColumnMove:false,
	enableColumnHide:false,
    style:'border:1px solid #e3eaec;',
	columns : [ 
	    { header: local.num,  menuDisabled:true,dataIndex: 'diskCloneLogId', width:80 },
	    { header: local.log.eventId,  menuDisabled:true,dataIndex: 'diskCloneEventId' , width:90},
        { header: local.log.gridLevel,  menuDisabled:true,dataIndex: 'diskCloneLogLevel', width:100, 
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
        { header:local.log.gridSource,  menuDisabled:true,tdCls:"font_color_999",dataIndex: 'diskCloneLogIp' , flex: 1},
        { header:local.time,tdCls:"font_color_999", menuDisabled:true, dataIndex: 'diskCloneLogCreateTime' , width:200 },
        { header:local.backup.content , tdCls:"font_color_999", menuDisabled:true,dataIndex: 'diskCloneLogContent' , flex: 2,
        	renderer : function(v,m,record,ri,ci) {
				return "<div title='" + v + "'>" + v + "</div>";
			}
        }
    ],
    listeners : {
    	afterrender : function(){
    		Ext.getCmp("diskCloneLogGridId").store.load();
    	}
    },
    dockedItems: [{
		id: 'diskCloneLogPage',
        xtype: 'pagingtoolbar',
        store: 'sysLog.DiskCloneLogStore',
        dock: 'bottom',    //分页 位置
        emptyMsg:local.toobarEmptyMsg,
        displayInfo: true,
        displayMsg:local.toolbarDisplayMsg,
        beforePageText:local.toolbarBeforePageText,
        afterPageText:local.toolbarAfterPageText
       
	}]
});

/*
 * 备份日志全布局
 */
Ext.define('acesure.view.sysLog.DiskCloneLogList', {
	extend : 'Ext.panel.Panel',
	width : '100%',
	border : false,
	layout:"vbox",
	overflowY:"auto",
	alias : 'widget.diskCloneLogList',
	items: [{
		width:"100%",
		xtype : 'diskCloneLogToolbar'
	},{
		width:"100%",
		xtype: 'diskCloneSearchToolbar'
	},{
		flex:1,
		width:"100%",
		minHeight:200,
		maxHeight:563,
		xtype: 'diskCloneLogGrid'
	}],
	listeners:{
		render:function(v, eOpts){
			POWER_OP.filterEnableWidgetsOfExtjs(v, CURRENT_USER.getReportlogPower());
		}
	}
});