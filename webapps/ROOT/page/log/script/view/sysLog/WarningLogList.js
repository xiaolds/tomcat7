Ext.define("acesure.view.sysLog.WarningLogToolbar", {
	extend : 'Ext.Toolbar',
	alias : 'widget.warningLogToolbar',
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
						html : "<font class='font_h3'>"+local.log.titleWarnLog+"</font>"
				 },
				 "->",
				 {
				xtype : "button",
				text : local.btn.refresh,
				style:'padding-left:26px',
				icon : '/images/common/refresh.png',
				handler : function() {
					Ext.getCmp("beginDateId").setValue();
			    	Ext.getCmp("endDateId").setValue();
					
			    	var beginDateId = Ext.getCmp("beginDateId");
			    	var endDateId = Ext.getCmp("endDateId");
			    	var params = {
		        		beginDateId : beginDateId.value,
		        		endDateId : endDateId.value
		        	};
					var warningLogGridId = Ext.getCmp("warningLogGridId");
					warningLogGridId.getStore().reload({
						params : params
					});
				}
			}, {
				xtype : "button",
				text : local.btn.export0, 
				style:'padding-left:26px',
				icon : '/images/log/export.png',
				id : 'warningLogExportId',
				itemId : 'reportlog_log_warnexport'
			}, {
				xtype : "panel",
				id : 'warningLogShrink',
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

Ext.define("acesure.view.log.report.WarningCenterToolbar", {
	extend : 'Ext.Toolbar',
	alias : 'widget.warningCenterToolbar',
	height: 58,
	padding:20,
	border:false,
	items : [ '<font class="font_t">'+local.log.titleWarnLog+'</font>', "->" ,{
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
		        id: 'warningLogLevel',
		        labelWidth: 40,
		        fieldLabel: local.gridLevel,
		        width: 150
			},{
				xtype: 'datefield',
                width: 170,
                format :'Y-m-d',
                editable : false,
                id: 'beginDateId',
                labelWidth: 40,
                fieldLabel: local.time
			},' - ',{
				xtype: 'datefield',
                width: 120,
                format :'Y-m-d',
                editable : false,
                id: 'endDateId'
			}, {
				xtype : "button",
				text : local.btn.inquire,
				id: 'searchWarningLogBut'
			},{
				xtype : "button",
				text :local.log.reset,
				id: 'resetWarningLogBut'
			} ]
});

	 
Ext.define('acesure.view.sysLog.WarningLogGrid', {
		extend:'Ext.grid.Panel',
	    xtype: 'row-expander-grid',
	    alias:'widget.warningLogGrid',
	    id: 'warningLogGridId',
	    store: 'sysLog.WarningLogStore',
	    border:false,
		enableColumnResize:false,
		enableColumnMove:false,
		enableColumnHide:false,
	    //height:563,
	    margin:'10 20 20 20',
	    style:'border:1px solid #e3eaec;',
	    columns: [ 
	        { header:local.num, menuDisabled:true,dataIndex: 'warningLogId', width:80 },
	        { header: local.log.gridEvent+"ID",menuDisabled:true, dataIndex: 'warningEventId' , width:90},
	        { header:local.log.gridLevel,menuDisabled:true, dataIndex: 'warningLogLevel', width:100,
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
	        { header: local.log.gridSource,tdCls:"font_color_999", menuDisabled:true,dataIndex: 'warningLogIp' , flex:1 },
	        { header: local.time, tdCls:"font_color_999",menuDisabled:true,dataIndex: 'warningLogInsertTime' , width:200 },
	        { header: local.backup.content, tdCls:"font_color_999",menuDisabled:true,dataIndex: 'warningLogContent' , flex:2,
	        	renderer : function(v,m,record,ri,ci) {
					return "<div title='" + v + "'>" + v + "</div>";
				}
	        }
	    ],
	    listeners : {
	    	afterrender : function(){
	    		Ext.getCmp("warningLogGridId").store.load();
	    	}
	    },
	    dockedItems: [{
			id:'warningLogPage',
	        xtype: 'pagingtoolbar',
	        store: 'sysLog.WarningLogStore',
	        dock: 'bottom', //分页 位置
	        emptyMsg:local.toobarEmptyMsg,
            displayInfo: true,
            displayMsg:local.toolbarDisplayMsg,
            beforePageText:local.toolbarBeforePageText,
            afterPageText:local.toolbarAfterPageText	
		}]
	});

Ext.define('acesure.view.sysLog.WarningLogList', {
	extend : 'Ext.panel.Panel',
	width : '100%',
	border : false,
	layout:"vbox",
	overflowY:"auto",
	alias : 'widget.warningLogList',
	items: [{
		width:"100%",
		xtype : 'warningLogToolbar'
	},{
		width:"100%",
		xtype : 'warningCenterToolbar'
	},{
		width:"100%",
		flex:1,
		minHeight:200,
		maxHeight:563,
		xtype : 'warningLogGrid'
	}],
	listeners:{
		render:function(v, eOpts){
			POWER_OP.filterEnableWidgetsOfExtjs(v, CURRENT_USER.getReportlogPower());
		}
	}
});