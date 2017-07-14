Ext.define("acesure.view.sysLog.UserLogToolbar", {
	extend : 'Ext.Toolbar',
	alias : 'widget.userLogToolbar',
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
				html : "<font class='font_h3'>"+local.log.AccOpeLog+"</font>"
		 },
		 "->",
		 {
			xtype : "button",
			text :local.btn.refresh,
			style:'padding-left:26px',
			icon : '/images/common/refresh.png',
			id: 'userLogRefreshId',
			handler : function() {
				Ext.getCmp("beginDateId").setValue();
		    	Ext.getCmp("endDateId").setValue();
				
		    	var beginDateId = Ext.getCmp("beginDateId");
		    	var endDateId = Ext.getCmp("endDateId");
		    	var params = {
	        		beginDateId : beginDateId.value,
	        		endDateId : endDateId.value
	        	};
		    	
				var userGridId = Ext.getCmp("userLogGridId");
				userGridId.getStore().reload({
					params : params
				});
			}
		}, {
			xtype : "button",
			text :local.btn.export0, 
			style:'padding-left:26px',
			icon : '/images/log/export.png',
			id: 'userLogExportId',
			handler : function() {
				Ext.Msg.alert(local.window.tip, local.btn.export0);
			}
		} ]
});

Ext.define("acesure.view.log.report.UserLogSearchToolbar", {
	extend : 'Ext.Toolbar',
	alias : 'widget.userLogSearchToolbar',
	height: 58,
	padding:20,
	border:false,
	items : [ '<font class="font_t">'+local.log.AccOpeLog+'</font>', "->" ,{
				xtype: 'datefield',
                width: 120,
                format :'Y-m-d',
                id: 'beginDateId',
                editable : false
			},' - ', {
				xtype: 'datefield',
                width: 120,
                format :'Y-m-d',
                id: 'endDateId',
                editable : false
			}, {
				xtype : "button",
				text : local.btn.inquire,
				id: 'searchUserLogBut'
			},{
				xtype : "button",
				text :local.log.reset,
				id : 'resetUserLogBut'
			} ]
});


Ext.define('acesure.view.sysLog.UserLogGrid', {
	extend : 'Ext.grid.Panel',
	alias :'widget.userLogGrid',
	id: 'userLogGridId',
	store : 'sysLog.UserLogStore',
	height:520,
	margin:'10 20 20 20',
    style:'border:1px solid #e3eaec;',
	border : false,
	columns : [ 
	    { header:local.num, dataIndex: 'systemLogId',width:80 },
	    { header:local.log.eventId,width:90,
	    	renderer:function(v) {
	    		return "3000";
	    	}
	    },
        { header: local.log.gridLevel, dataIndex: 'systemLogLevel', width:100, 
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
        { header: local.log.gridSource, dataIndex: 'systemLogManager' , flex : 1 },
        { header: local.time, dataIndex: 'systemLogInsertTime' , width:200},
        { header: local.backup.content, dataIndex: 'systemLogContent' , flex: 2,
        	renderer : function(v,m,record,ri,ci) {
				return "<div title='" + v + "'>" + v + "</div>";
			}
        }
    ],
    listeners : {
    	afterrender : function(){
    		Ext.getCmp("userLogGridId").store.load();
    	}
    },
    dockedItems: [{
		id: 'userLogPage',
        xtype: 'pagingtoolbar',
        store: 'sysLog.UserLogStore',
        dock: 'bottom', //分页 位置
        emptyMsg:local.toobarEmptyMsg,
        displayInfo: true,
        displayMsg:local.toolbarDisplayMsg,
        beforePageText:local.toolbarBeforePageText,
        afterPageText:local.toolbarAfterPageText	
	}]
});

Ext.define('acesure.view.sysLog.UserLogList', {
	extend : 'Ext.panel.Panel',
	width : '100%',
	border : false,
	alias : 'widget.userLogList',
	items: [{
		xtype : 'userLogToolbar'
	},{
		xtype: 'userLogSearchToolbar'
	},{
		xtype: 'userLogGrid'
	}]
});