/*此代码暂时不用*/
Ext.define('acesure.config.view.system.SystemDBBackupWindow', {
	extend : 'Ext.window.Window',
	alias : 'widget.sysDBBackupWin',
	id : 'sysDBBackupWin',
	width:350,
	bodyStyle:"background-color:#FFFFFF",
	title:local.config.modifyDatabaseBackupAuto,
	bodyBorder:false,
	resizable:false,
	buttonAlign:"right",
	modal:true,
	
	initComponent : function(){
		var me = this;
				
		Ext.applyIf(me, {
			items : [{
				  xtype: 'form',
				  id:'dbBackupModifyForm',
				  layout:"form",
				  style:"margin-left:3px",
			      width:330,
			      defaultType: 'textfield',
			      items:[{
						xtype:'fieldset',
						title: local.basicInfo,
						collapsible: false,
						autoHeight:true,					
						items:[{
							id:'dbBackupPath',
							xtype:'textfield',
							name:'dbBackupPath',
							fieldLabel:'自动备份路径', //错误
							blankText:"角色名不能为空",
							maxLength :25,																						
							msgTarget:"under",
							allowBlank: false
				        }]
				},{
		        	xtype:'fieldset',		        
					id:'reguseroptioninfo',
					title: '说明',
					autoHeight:true,
					collapsed: false,
					defaultType: 'textfield',
					html:'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;修改角色名,请确定角色名唯一.'
				}]
			}
			    
		    ],			              
			buttons : [{
			            text:local.btn.save,
			            id:'roleModifySave'
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


 