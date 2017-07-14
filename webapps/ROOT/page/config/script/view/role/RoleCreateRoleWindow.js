Ext.define('acesure.config.view.role.RoleCreateRoleWindow', {
	extend : 'Ext.window.Window',
	alias : 'widget.roleCreateRoleWin',
	id : 'roleCreateRoleWin',
	width:350,
	title:local.config.roleNew,
	border:false,
	resizable:false,
	buttonAlign:"right",
	modal:true,
	
	initComponent : function(){
		var me = this;
						
		Ext.applyIf(me, {
			items : [{
				 border:false,
				 xtype: "form",
				 padding:10,
					items:
					[
						{
							xtype:'fieldset',
							title: local.config.roleNew,
							collapsible: false,
							autoHeight:true,
							labelWidth:70,
							items:[
								{
									xtype:'textfield',
									id:'roleName',
									name: 'role.roleName',
									fieldLabel:local.config.roleName,
									msgTarget : "side",
									allowBlank : false,
									blankText : local.config.roleNameNoNull,
									regex : NORMAL_NAME_REGEX,
									regexText : local.config.roleNameTip,
									width:280
								},{
						        	xtype:'combo',
									mode: 'local',
									fieldLabel:local.config.auth,
									id:'powerBindType',
									name:'powerBindType',
									store:new Ext.data.SimpleStore({
										fields: ["value", "text"],
										data: [[1, local.config.general], [2, local.config.define]] 
									}),
									valueField :"value",
									displayField: "text",
									value:1,
									editable:false,
									triggerAction:"all",
									width:280
						        },{
									xtype:'textarea',
									id:'remark',
									name:'role.remark',
									fieldLabel:local.config.roleDescrible,
									maxLength :100,
									msgTarget : "side",
									width:280
								},
							]
						},{
							xtype:'fieldset',
							title: local.explain,
							collapsible: false,
							autoHeight:true,
							defaultType: 'textfield',
							padding:10,
							html:local.config.roleDescribleMsg
						}
					]  
			}			    
		    ],			              
			buttons : [{
			            text:local.btn.save,
			            cls:"btn_focus",
			            id:'roleCreateRoleSave'
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