Ext.define(
		'acesure.config.view.account.AccountGridPanel',
		{
			extend : 'Ext.grid.GridPanel',
			alias : "widget.accountGridPanel",
			id : 'accountListGrid',
			enableColumnResize:false,
			enableColumnMove:false,
			enableColumnHide:false,
			initComponent : function() {
				var me = this;
				Ext.applyIf(me, {					
					store : 'AccountGridStore',
					columns : [
							{
								dataIndex : "userId",
								hidden : true
							},
							{
								xtype : 'rownumberer',
								menuDisabled:true,
								header : local.config.rowNum,
								align : 'center',
								width : '5%'
							},
							{
								header : local.config.userName,
								align : 'left',
								menuDisabled:true,
								dataIndex : 'userName',
								width : '15%'
							},
							{
								header : local.config.role,
								align : 'left',
								menuDisabled:true,
								dataIndex : 'role',
								width : '15%',
								renderer : function(val) {
									if (notNull(val)) {
										var rolename = val.roleName.trim();
										if (rolename == ADMIN) {
											rolename = ADMIN_CN;
										} else if (rolename == SECURITY) {
											rolename = SECURITY_CN;
										} else if(rolename == AUDITOR){
											rolename = AUDITOR_CN;
										} 
										return rolename;
									} else {
										return EMPTY;
									}
								}
							},
							{
								header : local.state,
								menuDisabled:true,
								dataIndex : 'userState',
								xtype : 'gridcolumn',
								align : 'left',
								width : '10%',
								renderer : function(val) {
									if (NORMAL == val) {
										return ENABLE;
									} else if (NOT_NORMAL == val) {
										return DISABLE;
									} else {
										return EMPTY;
									}
								}
							},
							{
								header : local.config.validationType,
								dataIndex : 'userLoginType',
								menuDisabled:true,
								xtype : 'gridcolumn',
								align : 'left',
								width : '15%',
								renderer : function(val) {
									if (USBKEY_TYPE_LOGIN == val) {
										return USBKEY_DESC;
									} else if (BOTH_TYPE_LOGIN == val) {
										return PASSWORD_OR_USBKEY_DESC;
									} else if (PASSWORD_TYPE_LOGIN == val) {
										return PASSWORD_DESC;
									} else {
										return EMPTY;
									}
								}
							},
							{
								header : local.config.describe,
								width : '20%',
								menuDisabled:true,
								dataIndex : 'userRemark'
							},
							{
								header : local.btn.operate,
								flex : 1,
								menuDisabled:true,
								renderer : function(value, cellmeta, record, rowIndex, columnIndex, store) {
									var userID = record.data["userId"];
									var userName = record.data["userName"];
									var modifyStr = "<a href='javascript:void(0);' onclick='openAccountModifyWindow(\"\", this.name)' name='systemconfig_account_update' style='text-decoration:none;' class='color_green'>"
											+ local.btn.modify
											+ "</a>";
									var deleteStr = "&nbsp;&nbsp;<a href='javascript:void(0);' onclick='deleteSingleAccount("
											+ userID
											+ ", \""
											+ userName
											+ "\" ,this.name)' name='systemconfig_account_del' style='text-decoration:none;color:#F33737'>"
											+ local.btn.delete0
											+ "</a>";
									if (isCurrentUserCanModify(userName)) {
										return "<div>" + modifyStr + "</div>";
									}
									if (isCurrentUserCanModifyAndDelete(userName)) {
										return "<div>" + modifyStr + deleteStr + "</div>";
									}
									return "<div></div>";
								}
							} ],
					dockedItems : [ {
						xtype : 'pagingtoolbar',
						store : 'AccountGridStore',
						dock : 'bottom',
						emptyMsg : local.toobarEmptyMsg,
						displayInfo : true,
						displayMsg :local.toolbarDisplayMsg,
						beforePageText : local.toolbarBeforePageText,
						afterPageText : local.toolbarAfterPageText,
						listeners : {
							change : function(v, data, eOpts) {
								if(data==null){
									v.moveFirst();
								}								
								POWER_OP.filterEnableDomsInGridpanelColumnOfExtjs(v.up('panel'), CURRENT_USER.getSystemPower());
							}
						}
					} ]
				});

				me.callParent(arguments);
			}

		});
