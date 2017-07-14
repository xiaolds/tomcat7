/**
 * 角色的Grid显示列表 by xuyingan
 */
Ext.define('acesure.config.view.role.RoleGridPanel', {
			extend : 'Ext.grid.GridPanel',
			alias : "widget.roleGridPanel",
			id : 'roleListGrid',
			enableColumnResize:false,
			enableColumnMove:false,
			enableColumnHide:false,		
			initComponent : function() {
				var me = this;							
				Ext.applyIf(me, {
							store : 'RoleGridStore',					       
							columns : [{
							    dataIndex : "roleId",
							    hidden: true
						    },{
						    	 xtype : 'rownumberer',
						    	 menuDisabled:true,
								 header : local.config.rowNum,
						    	 align : 'center',
								 width:80
						    },{
						        header:local.config.roleName,
						        align : 'left',
						        menuDisabled:true,
						        dataIndex:'roleName',
						        width:'15%',
						        renderer: function(val){
						        	var rolename = val.trim();
									if (rolename == ADMIN) {
										rolename = ADMIN_CN;
									} else if (rolename == SECURITY) {
										rolename = SECURITY_CN;
									} else if(rolename == AUDITOR){
										rolename = AUDITOR_CN;
									} 
									return rolename;
						        }
						    },{
						        header:local.config.describe,
						        width:'20%',
						        menuDisabled:true,
						        dataIndex:'remark'						       
						    },{
								header : local.btn.operate,								
								flex:1,
								menuDisabled:true,
								renderer: function(value, cellmeta, record, rowIndex, columnIndex, store){
									var roleID = record.data["roleId"];
									var roleName = record.data["roleName"];	
				        	        var modifyStr = "<a href='javascript:void(0);' onclick='openRoleModifyWindow(\"\", this.name)' name='systemconfig_role_modify' style='text-decoration:none;' class='color_green'>"+local.btn.modify+"</a>&nbsp;&nbsp;";
				        	        var grantPowerStr = "<a href='javascript:void(0);' onclick='openGrantPowerWindow("+roleID+", \""+roleName+"\", this.name)' name='systemconfig_role_grantpower' style='text-decoration:none;'  class='color_green'>"+local.btn.grant+"</a>";  
				        	        var deleteStr = "&nbsp;&nbsp;<a href='javascript:void(0);' onclick='deleteSingleRole("+roleID+", \""+roleName+"\", this.name)' name='systemconfig_role_delete' style='text-decoration:none;color:#F33737'>"+local.btn.delete0+"</a>";				        	        				        	        					        	        
				        	        if (isCurrentRoleCanModify(roleName)) {
				        	        	if (isManager(roleName)) {
				        	        		return "<div>" + modifyStr + "</div>";
				        	        	}
				        	        	return "<div>" + modifyStr + grantPowerStr + "</div>";
									}
				        	        if (isCurrentRoleCanModifyAndDelete(roleName)) {
				        	        	if (isManager(roleName)) {
				        	        		return "<div>" + modifyStr + deleteStr + "</div>";
				        	        	}
				        	        	return "<div>" + modifyStr + grantPowerStr + deleteStr + "</div>";
				        	        }
				        	        return "<div></div>";				        	        				        	        
				        	      }															
						    }],
						    dockedItems: [{							    	
		                        xtype: 'pagingtoolbar',
		                        store: 'RoleGridStore',  
		                        dock: 'bottom', 
		                        emptyMsg: local.toobarEmptyMsg,
		                        displayInfo: true,
		                        displayMsg: local.toolbarDisplayMsg,
		                        beforePageText: local.toolbarBeforePageText,
		                        afterPageText: local.toolbarAfterPageText,
		                        listeners:{
		                        	change: function(v, data, eOpts){
		                        		if (data == null) {
											v.moveFirst();
										}
		                        		POWER_OP.filterEnableDomsInGridpanelColumnOfExtjs(v.up('panel'), CURRENT_USER.getSystemPower());
		                        	}
		                        }
						    }]
						});
				me.callParent(arguments);
			}
		});