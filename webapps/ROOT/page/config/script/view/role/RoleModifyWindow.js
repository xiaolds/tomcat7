Ext.define('acesure.config.view.role.RoleModifyWindow', {
	extend : 'Ext.window.Window',
	alias : 'widget.roleModifyWin',
	id : 'roleModifyWin',
	width:350,
	bodyStyle:"background-color:#FFFFFF",
	title:local.config.roleModify,
	border:false,
	resizable:false,
	buttonAlign:"right",
	modal:true,
	
	initComponent : function(){
		var me = this;
				
		Ext.applyIf(me, {
			items : [{
				  xtype: 'form',
				  id:'roleModifyForm',
				  layout:"form",
				  margin:10,
				  border:false,
			      width:330,
			      defaultType: 'textfield',
			      items:[{
						xtype:'fieldset',
						title: local.basicInfo,
						collapsible: false,
						autoHeight:true,					
						items:[{
							id:'roleId',
							xtype:'textfield',
							name:'role.roleId',
							hidden:true
				        },{																			
							id:'oldRoleName',
							xtype:'textfield',
							value: EMPTY,
							hidden:true
				        },{
							id:'roleName',
							xtype:'textfield',
							name:'role.roleName',
							fieldLabel:local.config.roleName,
							blankText:local.config.roleNameNoNull,
							regex : NORMAL_NAME_REGEX,
							regexText : local.config.roleNameTip,
							//maxLength :25,	
							msgTarget:"side",
							allowBlank: false,
							listeners:{
								change: function(field, newVal, oldVal){
									var oldRoleName = field.up('form').query('#oldRoleName')[0];
									if(isNull(oldVal) && isNull(oldRoleName.getValue())){
										oldRoleName.setValue(newVal);
									}
									if(isManager(oldVal)){
										field.setValue(oldVal);
									}
								}
							}
				        },{
							id:'remark',
							xtype:'textarea',
							name:'role.remark',
							msgTarget : "side",
							fieldLabel:local.config.describe,
							maxLength :100
				        }]
				},{
		        	xtype:'fieldset',	
					id:'reguseroptioninfo',
					title: local.explain,
					autoHeight:true,
					collapsed: false,
					defaultType: 'textfield',
					html:local.config.roleModifyMsg
				}]
			}
		    ],
			buttons : [{
			            text:local.btn.save,
			            cls:"btn_focus",
			            id:'roleModifySave'
	    			},{
						text : local.btn.cancle,
						handler : function() {
							this.up('window').close();
						}
	    			}]
		})
		me.callParent(arguments);	
	}
})