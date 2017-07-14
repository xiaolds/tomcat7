Ext.define('acesure.config.view.system.SystemDatabaseConfigWindow', {
	extend : 'Ext.window.Window',
	alias : 'widget.databaseConfigWin',
	id : 'databaseConfigWin',
	width : 500,
	title : local.config.modifyDatabaseBackupAuto,
	border : false,
	resizable : false,
	buttonAlign : "right",
	draggable : false,
	modal : true,
	initComponent : function() {
		var me = this;
		Ext.applyIf(me, {
			items : [ {
				border : false,
				padding : 10,
				items : [ {
					xtype : 'fieldset',
					id : 'databaseConfigSet',
					title : local.config.databaseBackupAutoOpen,
					padding : 10,
					bodyBorder : false,
					collapsible : false,
					checkboxToggle : true,
					autoHeight : true,
					items : [{
						xtype : "storagesTree",
						height : 150,
						//bodyBorder : false,
						//border : false,
						overflowY : "auto",
						width : '100%'
					},{
						id : 'backuppath',
						xtype : 'textfield',
						fieldLabel : local.config.path,
						labelWidth:65,
						width:340,
						margin:"10 0 10 0",
						regex : PATH_LINUX_REGEX,
						regexText : local.config.pathError,
						allowBlank : false,						
						blankText : local.config.pathNoNull,
						msgTarget : "side",
						border : false,
						listeners : {
							change : function(field, newValue, oldValue) {
								var tree = field.previousSibling();
								var checkedNodes = tree.getChecked();
								for ( var i = 0; i < checkedNodes.length; i++) {
									var node = checkedNodes[i];
									if (newValue == node.get('path')) {
										node.set("checked", true);
									} else {
										node.set("checked", false);
									}
								}
							}
						}
					}]
				}, {
					xtype : 'fieldset',
					title : local.explain,
					collapsible : false,
					autoHeight : true,
					padding : 10,
					html : local.config.pathConfig
				} ]
			} ],
			buttons : [ {
				text : local.btn.save,
				cls : "btn_focus",
				id : 'dbAutoBackupBtn'
			}, {
				text : local.btn.cancle,
				handler : function() {
					this.up('window').close();
				}
			} ]
		})
		me.callParent(arguments);
	}
});