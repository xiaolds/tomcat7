Ext.define('acesure.config.view.account.AccountSearchWindow', {
	extend : 'Ext.window.Window',
	alias : 'widget.accountSearchWin',
	id : 'accountSearchWin',
	width : 400,
	cls : 'toolbar', // 设置底部toolbar背景颜色和边框
	bodyStyle : "background-color:#FFFFFF",
	title : local.config.winSearchAccount,
	border : false,
	bodyBorder : false,
	resizable : false,
	buttonAlign : "right",
	modal : true,

	initComponent : function() {
		var me = this;

		Ext.applyIf(me, {
			items : [ {
				border : false,
				xtype : "form",
				padding : 10,
				items : [ {
					xtype : 'fieldset',
					title : local.config.winSearchAccountCon,
					collapsible : false,
					autoHeight : true,
					items : [ {
						xtype : 'textfield',
						id : 'userNameSearch',
						fieldLabel : local.config.userName
					}, {
						xtype : 'combo',
						mode : 'local',
						fieldLabel : local.config.accountState,
						id : 'userStateSearch',
						store : new Ext.data.SimpleStore({
							fields : [ "value", "text" ],
							data : [ [ 2, local.null0 ], [ 1, local.enable ], [ 0, local.disabled] ]
						}),
						valueField : "value",
						displayField : "text",
						value : 2,
						editable : false,
						triggerAction : "all",
						hidden:true
					}, {
						xtype : 'combo',
						mode : 'local',
						fieldLabel : local.config.role,
						id : 'roleIdSearch',
						store : 'AccountAllRoleStore',
						valueField : "roleId",
						displayField : "roleName",
						editable : false,
						triggerAction : "all"
					} ]
				}, {
					xtype : 'fieldset',
					title : local.explain,
					collapsible : false,
					autoHeight : true,
					defaultType : 'textfield',
					html :local.config.winSearchAccountText
				} ]
			}],
			buttons : [ {
				text : local.btn.searchAccount,
				cls:"btn_focus",
				id : 'accountSearchBtn'
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