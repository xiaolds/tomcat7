Ext.define('acesure.config.view.client.ClientRegisterConfigWindow', {
	extend : 'Ext.window.Window',
	alias : 'widget.registerConfigWin',
	id : 'registerConfigWin',
	width:400,
	title:"<span style='color:#FFF'>修改终端配置信息</span>",
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
						items:[
							{
								xtype:'panel',
								layout: 'form',
								border:false,
								labelWidth:1,
								items:[
									{xtype:'checkbox',id:'enableRegist',boxLabel:'允许自动注册'}
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
										//labelWidth:1,
										items:{
											xtype:'checkbox',
											boxLabel:'限制使用空间(MB)',
											id:'isLimitSpace',
											listeners:{
													'check':function(){
														if(this.checked){
															Ext.getCmp('maxSpaceSize').enable();
														}else{
															Ext.getCmp('maxSpaceSize').disable();
														}
													}
											}
										}
									},{
										columnWidth:.5,
										layout: 'form',
										border:false,
										items:{xtype:'numberfield',id:'maxSpaceSize',value:10240,width:100,disabled:true}
									}
								]
							}
						]
					},{
						xtype:'fieldset',
						title: '说明',
						width:370,
						collapsible: false,
						autoHeight:true,
						padding:10,
						html:'可以控制终端注册使用的参数,控制终端注册时，是否限制该终端账户的可用空间。'
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


 