Ext.define(		
		'acesure.config.view.account.AccountBindMachineWindow',
		{
			extend : 'Ext.window.Window',
			alias : 'widget.accountBindMachineWin',
			id : 'accountBindMachineWin',
			width : 600,
			height:500,
			border : false,
			title : local.config.bindMachine,
			cls : 'toolbar', // 设置底部toolbar背景颜色和边框
			modal : true,
			resizable : false,
			constrain : true,
			layout : 'fit',
			initComponent : function() {
				var me = this;
				Ext.applyIf(me, {					
					items : [ {
						xtype : 'form',
						id : 'userBindForm',
						border : false,
						padding : 10,
						overflowY : 'auto', // 超出自动垂直滚动
						//width : "100%",
						defaultType : 'textfield',
						items : [													
								{
									xtype : 'fieldset',
									title : local.config.deviceGroup,
									cls:"config_auth_field",
									collapsible : true,											
									items : [{
			                        	 width: 85,
			                             xtype: 'checkbox',
			                             boxLabel: local.config.autoFill,
			    	                     id: 'autofillDevgroup',
			                             cls:"config_ahth_check",
			                             style: 'background:#fff;position: absolute; top:0px; right: 10px;',
			                             listeners: {
			                            	 change : function(v, newVal, oldVal, eOpts) {
			                            		 autofillListenerAsChange(v, newVal);					                            							                            		
			                            		 // initCheckboxListenerAsChange(v, newVal);
			                            		 // initCheckboxListenerAsChange(v, newVal, NORMAL, v.up('form').query('#userName')[0].getValue());	                            		 
			                            	 }/*,
			                            	 render : function(v, eOpts) {					                            		
			                            		 // initCheckboxListenerAsRender(v);
			                            	 }*/
			                             }
			                         }, {
										xtype : 'checkboxgroup',
										id : 'deviceGroup',
										columns : 2,
										padding : 5
									} ]
								},
								{
									xtype : 'fieldset',
									title : local.config.nodeSave,
									cls:"config_auth_field",
									width : '100%',
									collapsible : true,											
									items : [ {
			                        	 width: 85,
			                             xtype: 'checkbox',
			                             boxLabel: local.config.autoFill,
			    	                     id: 'autofillStonode',
			                             cls:"config_ahth_check",
			                             style: 'background:#fff;position: absolute; top:0px; right: 10px;',
			                             listeners: {
			                            	 change : function(v, newVal, oldVal, eOpts) {
			                            		 autofillListenerAsChange(v, newVal);					                            		
			                            		 // initCheckboxListenerAsChange(v, newVal);	                            		 
			                            	 }/*,
			                            	 render : function(v, eOpts) {
			                            		 initCheckboxListenerAsRender(v);
			                            	 }*/
			                             }
			                         },{
										xtype : 'checkboxgroup',
										id : 'stonodeGroup',
										flex : 1,
										columns : 1,
										padding : 5
									} ]
								},
								{
									xtype : 'fieldset',
									title : local.emergency.nodeCount,
									cls:"config_auth_field",
									width : '100%',											
									collapsible : true,
									items : [ {
			                        	 width: 85,
			                             xtype: 'checkbox',
			                             boxLabel: local.config.autoFill,
			    	                     id: 'autofillCalnode',
			                             cls:"config_ahth_check",
			                             style: 'background:#fff;position: absolute; top:0px; right: 10px;',
			                             listeners: {
			                            	 change : function(v, newVal, oldVal, eOpts) {					                            		
			                            		 autofillListenerAsChange(v, newVal);					                            	
			                            		 // initCheckboxListenerAsChange(v, newVal);	                            		 
			                            	 }/*,
			                            	 render : function(v, eOpts) {
			                            		 initCheckboxListenerAsRender(v);
			                            	 }*/
			                             }
			                         },{
										xtype : 'checkboxgroup',
										id : 'calnodeGroup',
										flex : 1,
										columns : 1,
										padding : 5
									} ]
								},{
									xtype : 'fieldset',
									id : 'reguseroptioninfo',
									title : local.explain,
									padding : 10,
									autoHeight : true,
									collapsed : false,
									html : local.config.codeTip
								} ]
							}
							],
							buttons : [ {
								text : local.btn.save,
								cls:"btn_focus",
								id : 'accountBindMachineSave'
							}, {
								text : local.btn.cancle,
								handler : function() {
									this.up('window').close();
								}
							} ]
						});
				me.callParent(arguments);
			}
		});
