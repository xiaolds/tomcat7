Ext.define('acesure.config.view.client.ClientInstallConfigWindow', {
	extend : 'Ext.window.Window',
	alias : 'widget.installConfigWin',
	id : 'installConfigWin',
	width:500,
	height:400,
	title:"<span>修改备份终端配置</span>",
	border:false,
	resizable:false,
	buttonAlign:"right",
	modal:true,
	
	initComponent : function(){
		var me = this;
						
		Ext.applyIf(me, {
			items : [{
				//layout:'form',
				border:false,
				padding:10,
				items:[
					{
						xtype:'fieldset',
						title: '操作',
						collapsible: false,
						autoHeight:true,
						padding:10,
						items:[
							{
								xtype:'panel',
								layout: 'column',
								border:false,
								items:[
									{
										columnWidth:.5,
										layout: 'form',
										border:false,
										labelWidth:1,
										items:{xtype:'checkbox',id:'clientBackupInfo',boxLabel:'显示终端托盘图标'}
									},{
										columnWidth:.5,
										layout: 'form',
										border:false,
										labelWidth:1,
										items:{xtype:'checkbox',id:'clientBackupProgressBar',boxLabel:'显示备份悬浮框'}
									}
								]
							},{
								xtype:'panel',
								layout: 'column',
								border:false,
								items:[
									{
										columnWidth:.5,
										layout: 'form',
										border:false,
										labelWidth:1,
										items:{xtype:'checkbox',id:'forbidDelData',boxLabel:'禁止删除数据',hidden: false}
									},{
										columnWidth:.5,
										layout: 'form',
										border:false,
										labelWidth:1,
										items:{xtype:'checkbox',id:'mergeBackupSets',boxLabel:'合并备份集',hidden: false}
									}
								]
							},{
								xtype:'panel',
								layout: 'column',
								border:false,
								items:[
									{
										columnWidth:.5,
										layout: 'form',
										border:false,
										labelWidth:1,
										items:{xtype:'checkbox',id:'clientShortcuts',boxLabel:'创建桌面快捷方式',hidden: false}
									},{
										columnWidth:.5,
										layout: 'form',
										border:false,
										labelWidth:1,
										items:{xtype:'checkbox',id:'clientStartMenu',boxLabel:'添加到开始菜单',hidden: false}
									}
								]
							},{
								xtype:'panel',
								layout: 'column',
								border:false,
								items:[
									{
										columnWidth:.5,
										layout: 'form',
										border:false,
										labelWidth:1,
										items:{xtype:'checkbox',id:'clientShowWeb',boxLabel:'启动备份界面',hidden: false}
									},{
										columnWidth:.5,
										layout: 'form',
										border:false,
										labelWidth:1,
										items:{xtype:'checkbox',id:'clientRightMenu',boxLabel:'添加系统右键菜单',hidden: false}
									}
								]
							},{
								xtype:'checkbox',
								id:'clientSound',
								boxLabel:'启用声音',
								hidden: true
							}
						]
					},{
						xtype:'fieldset',
						title: '说明',
						collapsible: false,
						autoHeight:true,
						padding:10,
						html:'控制终端安装后配置的参数。'
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


 