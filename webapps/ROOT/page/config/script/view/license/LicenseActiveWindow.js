Ext.define('acesure.config.view.license.LicenseActiveWindow', {	
	extend : 'Ext.window.Window',
	alias : 'widget.licenseActiveWin',
	id : 'licenseActiveWin',
	width : 400,
	height : 250,
	title :local.btn.productActive,
	border : false,
	resizable : false,
	buttonAlign : "right",
	modal : true,
	initComponent : function() {
		var me = this;
		Ext.applyIf(me, {			
			items : [ {
				xtype : 'form',
				id : 'activeForm',
				border : false,
				fileUpload : true,
				labelWidth : 80,
				padding : 10,
				items : [
						{
							xtype : 'fieldset',
							title : local.config.winFileName,
							collapsible : false,
							autoHeight : true,
							items : [ {
								xtype : 'fileuploadfield',
								width : 346,
								labelWidth:70,
								emptyText : local.config.winFileChoose,
								fieldLabel : local.config.winFileType,
								name : 'upload',
								buttonText : local.btn.viewFile,
								allowBlank : false,
								blankText : local.config.fileNoNull,
								msgTarget : "under"
							} ]
							
						},
						{
							xtype : 'fieldset',
							title : local.explain,
							collapsible : false,
							autoHeight : true,
							padding : 10,
							html : local.config.winFileChooseFromThis
						} ]
			} ],
			buttons : [ {
				text : local.btn.active,
				id : 'uploadActiveBtn'
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
