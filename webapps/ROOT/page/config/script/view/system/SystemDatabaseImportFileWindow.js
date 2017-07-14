Ext.define('acesure.config.view.system.SystemDatabaseImportFileWindow', {	
	extend : 'Ext.window.Window',
	alias : 'widget.dbImportFileWin',
	id : 'dbImportFileWin',
	width : 450,
	height : 250,
	title :local.config.importConfig,
	border : false,
	resizable : false,
	buttonAlign : "right",
	modal : true,
	initComponent : function() {
		var me = this;
		Ext.applyIf(me, {			
			items : [ {
				xtype : 'form',
				id : 'importForm',
				border : false,
				fileUpload : true,
				labelWidth : 80,
				padding : 10,
				items : [
						{
							xtype : 'fieldset',
							title : local.config.exportConfigFile,
							collapsible : false,
							autoHeight : true,
							items : [ {
								xtype : 'fileuploadfield',
								width : 380,
								emptyText : local.config.chooseSQL,
								fieldLabel : local.config.SQLFile,
								name : 'upload',
								buttonText : local.btn.viewFile
							} ]
						},
						{
							xtype : 'fieldset',
							title : local.explain,
							collapsible : false,
							autoHeight : true,
							padding : 10,
							html :local.config.chooseSQLMsg
							}]
			} ],
			buttons : [ {
				text : local.btn.import0,
				id : 'dbImportFileBtn'
			}, {
				text : local.btn.cancle,
				handler : function() {
					this.up('window').close();
				}
			} ]
		})
		me.callParent(arguments);
	}
})
