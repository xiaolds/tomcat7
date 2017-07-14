Ext.Loader.setConfig({
	enabled : true
});

Ext.application({
	name : "acesure.initialization",
	appFolder : '/page/initialization/script',
	layout : "fit",
	controllers : ['InitializationController'],
	// 当前页面加载完成执行的函数
	launch : function() {
		// 页面加载完成之后执行
		Ext.create("acesure.initialization.view.MainPanel");
	}
});

Ext.define('acesure.initialization.view.MainPanel', {
	extend : 'Ext.panel.Panel',
	height : 650,
	width : 960,
	border : false,
	renderTo : 'content',
	layout:"fit",
	initComponent : function() {
		var me = this;
		me.items = [{
			xtype : 'panel',
			region : 'center',
			id: 'initializationPanel',
			border:false,
			items : [{
				xtype : 'InitializationList'
			}]
		}];

		me.callParent(arguments);
	}
});