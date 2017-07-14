Ext.define('acesure.config.view.client.ClientUninstallConfigWindow', {
	extend : 'Ext.window.Window',
	alias : 'widget.uninstallConfigWin',
	id : 'uninstallConfigWin',
	width:500,
	height:400,
	title:"<span>修改卸载终端属性</span>",
	border:false,
	resizable:false,
	buttonAlign:"right",
	modal:true,
	
	initComponent : function(){
		var me = this;
						
		Ext.applyIf(me, {
			items : [{
				//layout:'form',
				padding:10,
				border:false,
				items:[
					{
						xtype:'fieldset',
						title: '操作',
						id:"UninstallPanel",
						collapsible: false,
						autoHeight:true,
						labelWidth:1,
						items:[
							{
								xtype:'radio',
								id:'setUninstallPwd',
								name:'setUninstallPwd',
								boxLabel:'不设置终端设备卸载密码',
								listeners:{'change':function(){																							
										if(this.checked){
											Ext.getCmp('inputUninatallPwd').disable();
											Ext.getCmp('confirmUninatallPwd').disable();
										}else{
											Ext.getCmp('inputUninatallPwd').enable();
											Ext.getCmp('confirmUninatallPwd').enable();
										}
									}
								}
							},{
								xtype:'radio',
								name:'setUninstallPwd',
								boxLabel:'设置终端设备卸载密码'
							},{
								xtype:'panel',
								layout: 'form',
								border:false,
								style:"margin-left:8px",
								labelWidth:60,
								items:{xtype:'textfield',id:'inputUninatallPwd',fieldLabel:'输入密码',inputType:'password',disabled:true,width:200}
							},{
								xtype:'panel',
								layout: 'form',
								border:false,
								style:"margin-left:8px",
								labelWidth:60,
								items:{xtype:'textfield',id:'confirmUninatallPwd',fieldLabel:'确认密码',inputType:'password',disabled:true,width:200}
							}
						]
					},{
						xtype:'fieldset',
						title: '说明',
						collapsible: false,
						autoHeight:true,
						padding:10,
						html:'如果设置终端卸载密码，那么所有的终端设备只有在输入密码的情况下才可以卸载，该密码由管理员下发给各个终端设备。'
					}
				]
			}			    
		    ],			              
			buttons : [{
			            text:"保存",
			            id:'serverConfigSave'
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


 