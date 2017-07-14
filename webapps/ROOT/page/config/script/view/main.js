Ext.Loader.setConfig({
			enabled : true
		});
Ext.application({
			name : "acesure.config",
			appFolder : '/page/config/script',
			controllers : ['ConfigController'],
			launch : function() {
				Ext.create("acesure.view.config.mainPanel");
			}
		});

/**
 * 系统配置模块主框架
 */

Ext.define('acesure.view.config.mainPanel', {
			extend : 'Ext.container.Viewport',
			border : false,	
			layout : 'border', 
			id:'allPanel',
			minWidth:1250,
			initComponent : function() {
				var me = this;
				me.items = [ {
	            	xtype:'GlobalMenu',
	            	region : 'north',
	            	border:false,
	            	height:60
	            },{
					xtype : 'panel',
					region : 'west',
					width : 239,
					height: '100%',
					border:false,
					bodyStyle:'background:#f5f8fa;',
					items : [{
						xtype : 'configTreePanel'
					}]
				}, {
					xtype : 'panel',
					region : 'center',
					border:false,
					style:'border-left:1px solid #d1dade;',
					layout:"fit",
					items : [{
						xtype : 'storageConfig'						
					}]
				}];
				me.callParent(arguments);
			}
		});