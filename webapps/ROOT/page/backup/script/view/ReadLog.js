var fp = "";
/*
 * 读取文件窗口
 */
Ext.define("websure.backup.view.ReadLog", {
	extend : 'Ext.window.Window',
	title : local.backup.readLog, // 附加任务类型
	draggable : false, 
	border:false,
	height : 600, 
	width : 700, 
//	overflowY:"auto",
	alias : 'widget.readLog',
	id : 'readLog',
	layout : "fit", //窗口布局类
	modal : true,	//是否模态窗口，默认为false
	resizable : false,
	constructor : function(config) {
		fp = config.filePath
		
		/**
		 * 任务模块Form表单
		 */
		 Ext.define("websure.backup.view.ReadLogPanel",{
		 	  extend:'Ext.panel.Panel',
		 	  alias : 'widget.readLogPanel',
		 	  id:'readLogPanel',
		 	  height:"100%",
		 	 overflowY:"auto",
		 	  border: false,
			  labelWidth: 50,
			  bodyStyle:"padding:10px",
			  html:""
		 });
			 
		var me = this;
		me.items = [{
			xtype : 'readLogPanel'
		}];

		me.callParent(arguments);
	},
	listeners : {
		'afterrender' : function() {
				//填充数据
				Ext.Ajax.request({
					url : '/backup/tobackupdbAction!getLogInfoForRead.action',
					params : {
						filePath : fp
					},
					success : function(response, options) {
						var obj = Ext.decode(response.responseText);
						//根据后台数据填充页面数据
						if(null != obj.info){
						Ext.getCmp("readLogPanel").update(obj.info);
						}
					},
					failure : function() {
						Ext.websure.MsgError("WF-30007",local.backup.readLogFailure);
					}
				});
		}
	}
});
