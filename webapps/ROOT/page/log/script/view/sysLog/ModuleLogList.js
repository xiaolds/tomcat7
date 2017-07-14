Ext.define("acesure.view.sysLog.ModuleLogToolbar", {
	extend : 'Ext.Toolbar',
	alias : 'widget.moduleLogToolbar',
	height:108,
	padding:'0 25 0 25',
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
				html : "<font class='font_h3'>"+local.log.moduleRun+"</font>"
		 },
		 "->",
		 {
			xtype : "button",
			text :local.btn.refresh,
			style:'padding-left:26px',
			icon : '/images/common/refresh.png',
			id: 'moduleLogRefreshId',
			handler : function() {
				Ext.getCmp("beginDateId").setValue();
		    	Ext.getCmp("endDateId").setValue();
				
		    	var beginDateId = Ext.getCmp("beginDateId");
		    	var endDateId = Ext.getCmp("endDateId");
		    	var params = {
	        		beginDateId : beginDateId.value,
	        		endDateId : endDateId.value
	        	};
				var moduleGridId = Ext.getCmp("moduleLogGridId");
				moduleGridId.getStore().reload({
					params : params
				});
			}
		}, {
			xtype : "button",
			text : local.btn.export0, 
			style:'padding-left:26px',
			icon : '/images/log/export.png',
			id: 'moduleLogExportId',
			handler : function() {
				Ext.Msg.alert(local.window.tip, local.btn.export0);
			}
		} ]
});

Ext.define("acesure.view.log.report.ModuleLogSearchToolbar", {
	extend : 'Ext.Toolbar',
	alias : 'widget.moduleLogSearchToolbar',
	height: 58,
	padding:20,
	border:false,
	items : [ '<font class="font_t">'+local.log.moduleRun+'</font>', "->" ,{
				xtype: 'datefield',
                width: 120,
                format :'Y-m-d',
                id: 'beginDateId',
                editable : false
			}, ' - ',{
				xtype: 'datefield',
                width: 120,
                format :'Y-m-d',
                id: 'endDateId',
                editable : false
			}, {
				xtype : "button",
				text :local.btn.inquire,
				id: 'searchModuleLogBut'
			},{
				xtype : "button",
				text :local.log.reset,
				id : 'resetModuleLogBut'
			} ]
});


Ext.define('acesure.view.sysLog.ModuleLogGrid', {
	extend : 'Ext.grid.Panel',
	alias :'widget.moduleLogGrid',
	id: 'moduleLogGridId',
	store : 'sysLog.ModuleLogStore',
	height:520,
	enableColumnResize:false,
	enableColumnMove:false,
	enableColumnHide:false,
	margin:'10 20 20 20',
    style:'border:1px solid #e3eaec;',
	border : false,
	columns : [ 
	    { header:local.num,  menuDisabled:true,dataIndex: 'systemLogId', width:80 },
	    { header: local.log.eventId, width:90, menuDisabled:true,
	    	renderer:function(v) {
	    		return "3001";
	    	}
	    },
		{ header:local.log.gridLevel, menuDisabled:true, dataIndex: 'systemLogLevel', width:100, 
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
		{ header:local.log.gridSource,  menuDisabled:true,dataIndex: 'systemLogManager' , flex : 1 },
        { header: local.time,  menuDisabled:true,dataIndex: 'systemLogInsertTime' , width:200 },
		{ header: local.backup.content,  menuDisabled:true,dataIndex: 'systemLogContent' , flex: 2,
        	renderer : function(v,m,record,ri,ci) {
				return "<div title='" + v + "'>" + v + "</div>";
			}
		}
	],
    listeners : {
    	afterrender : function(){
    		Ext.getCmp("moduleLogGridId").store.load();
    	}
    },
    dockedItems: [{
		id: 'moduleLogPage',
        xtype: 'pagingtoolbar',
        store: 'sysLog.ModuleLogStore',
        dock: 'bottom', //分页 位置
        emptyMsg: local.toobarEmptyMsg,
        displayInfo: true,
        displayMsg: local.toolbarDisplayMsg,
        beforePageText:  local.toolbarBeforePageText,
        afterPageText: local.toolbarAfterPageText
       
	}]
});

Ext.define('acesure.view.sysLog.ModuleLogList', {
	extend : 'Ext.panel.Panel',
	width : '100%',
	border : false,
	alias : 'widget.moduleLogList',
	items: [{
		xtype : 'moduleLogToolbar'
	},{
		xtype: 'moduleLogSearchToolbar'
	},{
		xtype: 'moduleLogGrid'
	}]
});