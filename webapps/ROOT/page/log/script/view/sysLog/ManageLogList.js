Ext.define("acesure.view.sysLog.ManageLogToolbar", {
	extend : 'Ext.Toolbar',
	alias : 'widget.manageLogToolbar',
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
				html : "<font class='font_h3'>"+local.backup.operateLog+"</font>"
		 },
		 "->",
		 {
			xtype : "button",
			text :local.btn.refresh,
			style:'padding-left:26px',
			icon : '/images/common/refresh.png',
			id: 'manageLogRefreshId',
			handler : function() {
				Ext.getCmp("beginDateId").setValue();
		    	Ext.getCmp("endDateId").setValue();
				
		    	var beginDateId = Ext.getCmp("beginDateId");
		    	var endDateId = Ext.getCmp("endDateId");
		    	var params = {
	        		beginDateId : beginDateId.value,
	        		endDateId : endDateId.value
	        	};
				var manageLogGridId = Ext.getCmp("manageLogGridId");
				manageLogGridId.getStore().reload({
					params : params
				});
			}
		}, {
			xtype : "button",
			text : local.btn.export0,
			style:'padding-left:26px',
			icon : '/images/log/export.png',
			id: 'manageLogExportId',
			itemId : 'reportlog_log_opexport'
		}, {
			xtype : "panel",
			id : 'manageLogShrink',
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

Ext.define("acesure.view.log.report.ManageSearchToolbar", {
	extend : 'Ext.Toolbar',
	alias : 'widget.manageSearchToolbar',
	height: 58,
	padding:20,
	border:false,
	items : [ '<font class="font_t">'+local.backup.operateLog+'</font>', "->" ,{
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
		        id: 'manageLogLevel',
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
			},' - ', {
				xtype: 'datefield',
                width: 120,
                format :'Y-m-d',
                id: 'endDateId',
                editable : false
			}, {
				xtype : "button",
				text :local.btn.inquire,
				id: 'searchManageLogBut'
			},{
				xtype : "button",
				text :local.log.reset,
				id : 'resetManageLogBut'
			} ]
});


Ext.define('acesure.view.sysLog.ManageLogGrid', {
	extend : 'Ext.grid.Panel',
	alias :'widget.manageLogGrid',
	id: 'manageLogGridId',
	store : 'sysLog.ManageLogStore',
	margin:'10 20 20 20',
	enableColumnResize:false,
	enableColumnMove:false,
	enableColumnHide:false,
    style:'border:1px solid #e3eaec;',
	border : false,
	columns : [ 
	    { header:local.num, menuDisabled:true,dataIndex: 'manageLogId',width:80},
	    /*{ header: '事件ID', width:90,
	    	renderer:function(v) {
	    		return 30000;
	    	}
	    },*/
        { header:local.log.gridLevel,menuDisabled:true, dataIndex: 'manageLogLevel', width:100,
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
        /*{ header: local.log.gridSource,tdCls:"font_color_999", dataIndex: 'manageLogType' , flex: 1 ,
        	renderer : function(v){
        		return local.backup.operateLog;
        	}
        },*/
        { header: local.log.gridSource,menuDisabled:true, tdCls:"font_color_999",dataIndex: 'manageLogIp' , flex: 1},
        { header: local.time, menuDisabled:true,tdCls:"font_color_999",dataIndex: 'manageLogInsertTime' , width:200},
        { header: local.backup.content,menuDisabled:true,tdCls:"font_color_999",dataIndex: 'manageLogContent' , flex: 2,
        	renderer : function(v,m,record,ri,ci) {
				return "<div title='" + v + "'>" + v + "</div>";
			}
        }
    ],
    listeners : {
    	afterrender : function(){
    		Ext.getCmp("manageLogGridId").store.load();
    	}
    },
    dockedItems: [{
		id: 'systemLogPage',
        xtype: 'pagingtoolbar',
        store: 'sysLog.ManageLogStore',
        dock: 'bottom', //分页 位置
        emptyMsg:local.toobarEmptyMsg,
        displayInfo: true,
        displayMsg: local.toolbarDisplayMsg,
        beforePageText: local.toolbarBeforePageText,
        afterPageText: local.toolbarAfterPageText
       }]
});

Ext.define('acesure.view.sysLog.ManageLogList', {
	extend : 'Ext.panel.Panel',
	width : '100%',
	border : false,
	alias : 'widget.manageLogList',
	overflowY:"auto",
	layout:"vbox",
	items: [{
		width:"100%",
		xtype : 'manageLogToolbar'
	},{
		width:"100%",
		xtype: 'manageSearchToolbar'
	},{
		width:"100%",
		flex:1,
		minHeight:200,
		maxHeight:563,
		xtype: 'manageLogGrid'
	}],
	listeners:{
		render:function(v, eOpts){
			POWER_OP.filterEnableWidgetsOfExtjs(v, CURRENT_USER.getReportlogPower());
		}
	}
});