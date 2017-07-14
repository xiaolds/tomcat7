Ext.define('acesure.config.view.role.RoleAuthWindow', {
	extend : 'Ext.window.Window',
	alias : 'widget.roleAuthWin',
	id : 'roleAuthWin',
	width:850,
	height:650,
	border: false,
	title :local.btn.grant,    //分配权限
	modal : true,
	resizable:false,
	overflowY:'auto',    //超出自动垂直滚动
	constrain: true,    
	layout: 'vbox',
	defaults:{
		width:"100%"
	},
	initComponent : function(){
		var me = this;
		Ext.applyIf(me, {
			items : [{
			         xtype:'panel',
			         border:false,
			         layout:'hbox',
			         items:[{
			        	 	xtype: 'form',
			        	 	border:false,
			        	 	items:[{
			        	 		xtype:'textfield',
								id:'roleId',
								hidden:true
			        	 	}]
						},{
				        	 xtype:'panel',
				        	 width:110,
				        	 height:'100%',
				        	 border:false,
				        	 padding:'0 0 0 10',
				        	 style:'background:#fafbfc;',
					         bodyStyle:'background:#fafbfc;',
					         bodyCls:'vertical_text',
					         html:local.config.backupWarningAuth
				            },{
		                		xtype:'panel',
		                		id:'deviceDomain',
		                		layout:'vbox',
		                		flex:1,
		                		border:false,
		                		padding:'10 20 10 20',
		                		items:[{ 
			                		 xtype: 'fieldset',
			                         title: local.config.backupWarning,
			                         width:'100%',
			                         cls:"config_auth_field",
			                         collapsible: true,
			                         items: [{
			                        	 width: 70,
			                             xtype: 'checkbox',
			                             boxLabel:local.config.checkAllOrNot,
			                             cls:"config_ahth_check",
			                             style: 'background:#fff;position: absolute; top:0px; right: 10px;',
			                             listeners: {
			                            	 change : function(v, newVal, oldVal, eOpts) {
			                            		 initCheckboxListenerAsChange(v, newVal);
			                            	 }/*,
			                            	 render : function(v, eOpts) {
			                            		 initCheckboxListenerAsRender(v);
			                            	 }*/
			                             }
			                         },{
			                        	    xtype : 'checkboxgroup',
			                        	    id:'devicePower',
					                		columns: 4
			                         }]	
			                	}]
	                		}]
		             },{
						 width:'100%',
				         style:'border-top:1px solid #EEF2F4;',
						 id:'calnodeDomain',
				         xtype:'panel',
				         border:false,
				         layout:'hbox',
				         items:[{
						        	xtype:'panel',
						        	width:110,
						        	height:'100%',
						        	border:false,
						        	padding:'0 0 0 10',
						        	style:'background:#fafbfc;',
							        bodyStyle:'background:#fafbfc;',
							        bodyCls:'vertical_text',
							        html:local.config.emergencyAuth
			                	},{
			                		xtype:'panel',
			                		layout:'vbox',
			                		flex:1,
			                		border:false,
			                		padding:'10 20 10 20',
			                		items:[{ 
				                		 xtype: 'fieldset',
				                         title: local.config.emergency,							                        
				                         width:'100%',
				                         cls:"config_auth_field",
				                         collapsible: true,				        	         
				                         items: [{
				                        	 width: 70,
				                             xtype: 'checkbox',
				                             boxLabel: local.config.checkAllOrNot,
				                             cls:"config_ahth_check",
				                             style: 'background:#fff;position: absolute; top:0px; right: 10px;',
				                             listeners: {
				                            	 change : function(v, newVal, oldVal, eOpts) {
				                            		 initCheckboxListenerAsChange(v, newVal);	                            		 
				                            	 }/*,
				                            	 render : function(v, eOpts) {
				                            		 initCheckboxListenerAsRender(v);
				                            	 }*/
				                             }
				                         },{ 
						                		xtype : 'checkboxgroup',
						                		id : 'calnodePower',
						                		flex:1,
						                		columns: 4,	
						                		defaults:{margin:'0 0 8px 0'}     
						                	}]	
				                	}]
		                		}
			                ]},{
								 width:'100%',
						         xtype:'panel',
						         style:'border-top:1px solid #EEF2F4;',
						         id:'stonodeDomain',
						         border:false,
						         layout:'hbox',
						         items:[{
							        	xtype:'panel',
							        	width:110,
							        	height:'100%',
							        	border:false,
							        	padding:'0 0 0 10',
							        	style:'background:#fafbfc;',
								        bodyStyle:'background:#fafbfc;',
								        bodyCls:'vertical_text',
								        html:local.config.storageAuth
				                	},{
				                		xtype:'panel',
				                		layout:'vbox',
				                		flex:1,
				                		border:false,
				                		padding:'10 20 10 20',
				                		items:[{ 
					                		 xtype: 'fieldset',
					                         title: local.config.storage,
					                         width:'100%',
					                         cls:"config_auth_field",
					                         collapsible: true,
					                         items: [{
					                        	 width: 70,
					                             xtype: 'checkbox',
					                             boxLabel: local.config.checkAllOrNot,
					                             cls:"config_ahth_check",
					                             style: 'background:#fff;position: absolute; top:0px; right: 10px;',
					                             listeners: {
					                            	 change : function(v, newVal, oldVal, eOpts) {
					                            		 initCheckboxListenerAsChange(v, newVal);                      		 
					                            	 }/*,
					                            	 render : function(v, eOpts) {
					                            		 initCheckboxListenerAsRender(v);
					                            	 }*/
					                             }
					                         },{ 
							                		xtype : 'checkboxgroup',
							                		id : 'stonodePower',
							                		flex:1,
							                		columns: 4,	
							                		defaults:{margin:'0 0 8px 0'}
							                	}]	
					                	}]
			                		}
				            ]},			                
			                {
						         xtype:'panel',						        
						         border:false,
						         width:"100%",
						         style:'border-top:1px solid #EEF2F4;',
						         layout:'hbox',
						         items:[{
						        	 xtype:'panel',
						        	 width:110,
						        	 height:'100%',
						        	 border:false,
						        	 padding:'0 0 0 10',
						        	 style:'background:#fafbfc;',
							         bodyStyle:'background:#fafbfc;',
							         bodyCls:'vertical_text',
							         html:local.config.reportLogAuth
				                	},{
				                		xtype:'panel',
				                		layout:'vbox',
				                		flex:1,
				                		border:false,
				                		padding:'10 20 10 20',
				                		items:[{ 
					                		 xtype: 'fieldset',
					                		 width:"100%",
					                         title:local.config.reportLog,
					                         id: 'reportLogDomain', 
					                         cls:"config_auth_field",
					                         collapsible: true,
					                         items: [{
					                        	 width: 70,
					                             xtype: 'checkbox',
					                             boxLabel: local.config.checkAllOrNot,
					                             cls:"config_ahth_check",
					                             style: 'background:#fff;position: absolute; top:0px; right: 10px;',
					                             listeners: {
					                            	 change : function(v, newVal, oldVal, eOpts) {
					                            		 initCheckboxListenerAsChange(v, newVal);	                            		 
					                            	 }/*,
					                            	 render : function(v, eOpts) {
					                            		 initCheckboxListenerAsRender(v);
					                            	 }*/
					                             }
					                         },{
							                		xtype : 'checkboxgroup',
							                		id : 'reportLogPower',
							                		columns: 4,
							                		flex:1,
							                		defaults:{margin:'0 0 8px 0'}
							                	}]	
					                	}]
				                }]
			                },
			                {
						         xtype:'panel',						        
						         border:false,
						         width:"100%",
						         style:'border-top:1px solid #EEF2F4;',
						         layout:'hbox',
						         items:[{
						        	 xtype:'panel',
						        	 width:110,
						        	 height:'100%',
						        	 border:false,
						        	 padding:'0 0 0 10',
						        	 style:'background:#fafbfc;',
							         bodyStyle:'background:#fafbfc;',
							         bodyCls:'vertical_text',
							         html:local.config.sysAuth
				                	},{
				                		xtype:'panel',
				                		layout:'vbox',
				                		flex:1,
				                		border:false,
				                		padding:'10 20 10 20',
				                		items:[
					                	{ 
					                		 xtype: 'fieldset',
					                         title: local.config.title,
					                         id : 'sysConfigDomain',
					                         width:'100%',
					                         cls:"config_auth_field",
					                         collapsible: true,
					                         items: [{
					                        	 width: 70,
					                             xtype: 'checkbox',
					                             boxLabel: local.config.checkAllOrNot,
					                             cls:"config_ahth_check",
					                             style: 'background:#fff;position: absolute; top:0px; right: 10px;',
					                             listeners: {
					                            	 change : function(v, newVal, oldVal, eOpts) {
					                            		 initCheckboxListenerAsChange(v, newVal);
					                            	 }/*,
					                            	 render : function(v, eOpts) {
					                            		 initCheckboxListenerAsRender(v);
					                            	 }*/
					                             }
					                         },{
							                		xtype : 'checkboxgroup',
							                		id: 'sysPower',
							                		columns: 4,
							                		flex:1,
							                		defaults:{margin:'0 0 8px 0'}
							                	}]
					                		
					                	}]
				                }]
			                },
			                {
						         xtype:'panel',
						         border:false,
						         style:'border-top:1px solid #EEF2F4;',
						         layout:'hbox',
						         hidden: true,
						         items:[{
						        	 xtype:'panel',
						        	 width:110,
						        	 minHeight:44,
						        	 border:false,
						        	 padding:'0 0 0 10',
						        	 style:'background:#fafbfc;',
							         bodyStyle:'background:#fafbfc;',
							         bodyCls:'vertical_text',
							         html:local.config.othersAuth
						         }]
			                }
		],			              
		buttons : [{
		            text:local.btn.save,
		            cls:"btn_focus",
		            id:'roleSaveAuthWin'
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