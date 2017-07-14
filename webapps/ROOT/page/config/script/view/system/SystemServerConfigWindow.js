/**
 * 系统设置-服务器设置
 * --徐英安-
 * 此页面暂时不用
 */
Ext.define('acesure.config.view.system.SystemServerConfigWindow', {
	extend : 'Ext.window.Window',
	alias : 'widget.serverConfigWin',
	id : 'serverConfigWin',
	width:510,
	title:"<span style='color:#FFF'>修改管理平台设置信息</span>",
	bodyBorder:false,
	border:false,
	resizable:false,
	buttonAlign:"right",
	modal:true,
	layout:"fit",
	
	initComponent : function(){
		var me = this;
		Ext.applyIf(me, {
			items : [{
				border:false,
				padding:10,
				bodyBorder:false,
				items:[
					{
						xtype:'fieldset',
						title: '操作',
						collapsible:false,
						autoHeight:true,
						labelWidth:90,
						padding:10,
						items:[
						    {
						    	xtype:'panel',
						    	layout:'hbox',
						    	border:false,
						    	items:[{
						    		 xtype:'textfield',
						    		 width:240,
									 id:'systemServerLanIp',
									 fieldLabel:'内网IP地址',
									 enableKeyEvents:true					      												
									},{
										xtype:'label',
										text:'[正确格式：192.168.1.200]',
										style:{ color:'red' }
									}]
						    },
						    {
						    	xtype:'panel',
						    	layout:'hbox',
						    	padding:"10 0 0 0 ",
						    	border:false,
						    	items:[{
						    		 xtype:'textfield',
						    		 width:240,
									 id:'systemServerNetIp',
									 fieldLabel:'外网IP地址',
									 enableKeyEvents:true
									 
									},{
										xtype:'label',
										text:'[正确格式：192.168.1.200]',
										style:{ color:'red' }
									}]
						    },
						    {
						    	xtype:'panel',
						    	layout:'hbox',
						    	padding:"10 0 0 0 ",
						    	border:false,
						    	items:[{
						    		 xtype:'numberfield',
						    		 width:240,
									 id:'systemWebPort',
									 fieldLabel:'WEB访问端口',
									 disabled:true,
									 enableKeyEvents:true								 
									},{
										xtype:'label',
										text:'[输入范围：1000~65535]',
										style:{ color:'red' }
									}]
						    },				
						    {
						    	xtype:'panel',
						    	layout:'hbox',
						    	border:false,
						    	padding:"10 0 0 0 ",
						    	items:[{
						    		 xtype:'numberfield',
						    		 width:240,
									 id:'systemMsgPort',
									 fieldLabel:'消息通讯端口',
									 disabled:true,
									 enableKeyEvents:true									 
									},{
										xtype:'label',
										text:'[输入范围：1000~65535]',
										style:{ color:'red' }
									}]
						    }
						]
					},{
						xtype:'fieldset',
						title: '说明',
						padding:10,
						collapsible: false,
						autoHeight:true,
						html:'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;设置访问服务器时使用的 WEB 地址，客户端登录访问时用到。例如：WEB 地址：http://192.168.0.46:9800/。<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;消息服务器：消息的中间控制器，用于维持终端与管理端之间、存储节点与管理端之间的消息通信。'
					}
				]
			}			    
		    ],			              
			buttons : [{
			            text:"保存",
			            cls:"btn_focus",
			            id:'serverConfigSaveBtn'
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


 