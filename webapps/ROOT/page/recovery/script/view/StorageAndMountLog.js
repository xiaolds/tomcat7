
Ext.define('acesure.view.recovery.RecoveryLogGrid', {
	extend : 'Ext.grid.Panel',
	alias :'widget.recoveryLogGrid',
	id: 'recoveryLogGridId',
	enableColumnResize:false,
	store : 'RecoveryLogStore',
	margin:'10 20 20 20',
    style:'border:1px solid #e3eaec;border-bottom:none;',
	border : false,
	columns : [ 
	           { header:local.gridLevel, dataIndex: 'storageLogLevel', flex : 1, 
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
	           { header: local.gridSource, dataIndex: 'storageLogType' , flex : 1,
	           	renderer : function(v){
	           		if(v == 1){
	           			return local.recovery.storeLog;
	           		}else if(v == 2){
	           			return local.recovery.mountLog;
	           		}
	           	}
	           },
	           { header: local.eventId, dataIndex: 'storageEventId' , flex : 1},
	           { header:local.IP, dataIndex: 'storageLogIp' , flex : 1 },
	           { header:local.time, dataIndex: 'storageLogInsertTime' , flex : 1 },
	           { header:local.content, dataIndex: 'storageLogContent' , flex: 1 }
	       ],
	       listeners : {
		       	afterrender : function(){
		       		Ext.getCmp("recoveryLogGridId").store.load();
		       	}
	       },
	       dockedItems: [{
	   		   id: 'recoveryLogPage',
	           xtype: 'pagingtoolbar',
	           store: 'RecoveryLogStore',
	           dock: 'bottom', //分页 位置
	           emptyMsg: local.toobarEmptyMsg,
	           displayInfo: true,
	           displayMsg:local.toolbarDisplayMsg,
	           beforePageText:local.toolbarBeforePageText,
	           afterPageText: local.toolbarAfterPageText
	          
	   	}]
});

Ext.define('acesure.view.recovery.StorageAndMountLog', {
	extend : 'Ext.panel.Panel',
	width : '100%',
	border : false,
	alias : 'widget.storageAndMountLog',
	items: [{
		xtype: 'recoveryLogGrid'
	}]
});