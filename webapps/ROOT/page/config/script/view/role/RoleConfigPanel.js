Ext.define(
		'acesure.config.view.role.RoleConfigPanel',
		{
			extend : 'Ext.panel.Panel',
			alias : 'widget.roleConfigPanel',
			border:false,
			id : 'roleMainPanel',
			layout:"vbox",
			items : [
					{
						xtype : 'toolbar',
						id : 'cliToolBar',
						width:"100%",
						padding : '0 25 0 25',
						height : 108,
						style : 'background:#fafbfc;border:0;border-bottom:1px solid #e3eaec',
						defaults : {
							bodyStyle : 'background:#fafbfc'
						},
						items : [
								{
									xtype : "panel",
									border : false,
									width : 48,
									height : 42,
									html : '<img src="/images/config/account.png"/ style="width:48px;height:42px">'
								},
								{
									xtype : "panel",
									border : false,
									html : "<font class='font_h3'>"
											+ local.config.roleAdmin
											+ "</font>"
								}, '->', {
									id : 'sysconfig_role_add',
									itemId : 'systemconfig_role_add',
									xtype : 'button',
									text : local.config.roleNew,
									style : 'padding-left:26px',
									icon : '/images/common/new_16.png',
									action : 'power'
								} ]
					}, {
						xtype : 'roleGridPanel',
						width : '100%',
						flex:1,
						border : false
					} ],
			listeners : {
				render : function(v, eOpts) {
					POWER_OP.filterEnableWidgetsOfExtjs(v, CURRENT_USER.getSystemPower());
				}
			}
		});
