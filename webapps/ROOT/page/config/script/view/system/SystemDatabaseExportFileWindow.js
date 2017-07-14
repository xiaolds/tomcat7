Ext.define('acesure.config.view.system.SystemDatabaseExportFileWindow', {
	extend : 'Ext.window.Window',
	alias : 'widget.dbExportFileWin',
	id : 'dbExportFileWin',
	width:300,
	height:170,
	title:local.config.exportConfig,
	border:false,
	resizable:false,
	buttonAlign:"right",
	modal:true,
	
	initComponent : function(){
		var me = this;
						
		Ext.applyIf(me, {
			items : [{
				id:'sysDbExportPanel',
				border:false,
				padding:10,
				html:local.config.exportingLoading
			}			    
		    ],			              
			buttons : [{
			            text:local.btn.down,
			            hidden:true,
			            id:'dbExportFileBtn'
	    			},{
						text : local.btn.cancle,
						handler : function() {						
							this.up('window').close();
						}
	    			}
	    			]
		}
	)
		me.callParent(arguments);	
	}
})