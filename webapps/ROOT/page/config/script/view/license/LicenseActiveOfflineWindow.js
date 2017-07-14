Ext.define('acesure.config.view.license.LicenseActiveOfflineWindow', {
	extend : 'Ext.window.Window',
	alias : 'widget.licenseActiveOffWin',
	id : 'licenseActiveOffWin',
	width : 660,
	height:730,	
	title : local.config.activeWayOffline,
	border : false,
	bodyBorder : false,
	draggable:false,
	modal : true,
	resizable:false,
	layout:"border",
	initComponent : function() {
		var me = this;
		Ext.applyIf(me, {			
			items : [{				
				region : 'west',
				width:150,
				style:"background:#fafafa;border-right:1px solid #DBE0E2;",
				bodyStyle:"background:#fafafa",
				border:false,
				layout:"vbox",
				items : [{
				    	   xtype:"button",
				    	   width:150,
				    	   cls:"ie8 left_btn left_btn_active",
				    	   style:'padding-left:26px;',
				    	   textAlign:'left',
				    	   icon:'/images/config/icon_down.png',
				    	   text:local.config.btnDownRegisteFile,					    	   
				    	   handler : function() {						    		   
				    		   me.query('#downloadForm')[0].show();
							   me.query('#activeForm')[0].hide();
							   me.query('#downloadBtn')[0].show();
							   me.query('#activeOffBtn')[0].hide();
							   this.addCls("left_btn_active");
							   this.nextSibling().removeCls("left_btn_active");
							}
				       },{
				    	   xtype:"button",
				    	   width:150,
				    	   style:'padding-left:26px;',
				    	   textAlign:'left',
				    	   cls:"ie8 left_btn",
				    	   icon:'/images/config/icon_active.png',
				    	   text:local.btn.productActive,						    	   
				    	   handler : function() {						    		   
				    		   me.query('#downloadForm')[0].hide();
							   me.query('#activeForm')[0].show();
							   me.query('#downloadBtn')[0].hide();
							   me.query('#activeOffBtn')[0].show();
							   this.addCls("left_btn_active");
							   this.previousSibling().removeCls("left_btn_active");
							}
				       }]		
			},{
				region : 'center',
				border : false,
				xtype : "form",
				id:'downloadForm',
				style:"background:#fff",
				width : "100%",
				defaults : {
					xtype : 'textfield',
					width : 360,
					margin:"8 0 0 20"
				},
				items : [{
					xtype: 'panel',
					border: false,
					width:"100%",
					padding:"4 0 5 0",
					margin:0,
					style:"text-align:center;background:#fff4d2",
					bodyStyle:"background:#fff4d2",
					html: local.config.licenseAcitveOfflineTip
				},{							
					id : "donePids",
					name : 'customer.donePids',
					xtype : 'textarea',
					width : 360,
					height : 50,								
					fieldLabel : local.config.activeProNum,
					cols : 17,
					disabled : true
				},{
					id : 'readyPids',
					name : 'customer.readyPids',
					fieldLabel : local.config.proNum,
					xtype : 'textarea',
					width : 360,
					height : 50,
					autoScroll : true,
					emptyText : local.config.proNumText,
					allowBlank : false,
					blankText : local.config.proNumNoNull,
					listeners : {
						render: function(v) {											 
							 tailTextWidgetTip(v, REQUIRED_ASTERISK);
		                }
					}
				},
				{
					id : 'customerName',
					name : 'customer.customerName',
					fieldLabel : local.config.customerName,
					maxLength : 25,
					allowBlank : false,
					blankText : local.config.customerNameNoNull,
					listeners : {
						render: function(v) {											 
							tailTextWidgetTip(v, REQUIRED_ASTERISK);
		                }
					}
				},
				{
					id : 'contact',
					name : 'customer.contact',
					maxLength : 25,
					fieldLabel : local.config.contact,
					allowBlank : false,
					blankText : local.config.contactNoNull,
					listeners : {
						render: function(v) {											 
							tailTextWidgetTip(v, REQUIRED_ASTERISK);
		                }
					}
				},
				{
					id : 'phone',
					name : 'customer.phone',
					maxLength : 25,
					fieldLabel : local.config.contactPhone,
					regex : All_PHONE_REGEX,
					regexText : local.config.licenseRightContactPhone,
					allowBlank : false,						
					blankText :local.config.contactPhoneNoNull,
					listeners : {
						render: function(v) {											
							tailTextWidgetTip(v, REQUIRED_ASTERISK);
		                }
					}
				},
				{
					id : 'email',
					name : 'customer.email',
					fieldLabel : local.log.emailAdress,										
					vtype : 'email',
					vtypeText : local.config.inputRightEmailTip,
					allowBlank : false,
					blankText : local.config.emailNoNull,
					listeners : {																				
						render: function(v) {											 
							tailTextWidgetTip(v, REQUIRED_ASTERISK);
		                }
					}
				},
				{
					id : 'addr',
					name : 'customer.addr',
					fieldLabel : local.address,
					allowBlank : false,
					blankText : local.config.addrNoNull,
					listeners : {
						render: function(v) {											 
							tailTextWidgetTip(v, REQUIRED_ASTERISK);
		                }
					}
				},
				{
					id : 'industry',
					name : 'customer.industry',
					fieldLabel : local.config.industry,
					allowBlank : false,
					blankText : local.config.industryNoNull,
					listeners : {
						render: function(v) {												
							tailTextWidgetTip(v, REQUIRED_ASTERISK);
		                }
					}
				},
				{
					id : 'remark',
					name : 'customer.remark',
					fieldLabel : local.config.describe
				},
				{
					id : 'agentName',
					name : 'customer.agentName',
					fieldLabel : local.config.agentName
				},
				{
					id : 'agentContactor',
					name : 'customer.agentContactor',
					fieldLabel : local.config.agentContact
				},
				{
					id : 'agentAddr',
					name : 'customer.agentAddr',
					fieldLabel : local.config.agentAddr
				},{
					xtype : 'fieldset',
					title : local.explain,
					collapsible : false,
					padding : 10,
					margin:"10 20 20 20",
					width:"100%",
					html : local.config.licenseAcitveOfflineExplain
				} ]
			}, {
				hidden : true,
				region: 'center',
				xtype : 'form',
				id : 'activeForm',
				border : false,
				style:"background:#fff",
				fileUpload : true,
				labelWidth : 80,
				items : [{
					xtype: 'panel',
					border: false,
					width:"100%",
					padding:"4 0 5 0",
					margin:0,
					style:"text-align:center;background:#fff4d2",
					bodyStyle:"background:#fff4d2",
					html: local.config.licenseActiveRegisterTip
				},{					
					xtype : 'fieldset',
					title : local.config.winFileName,
					collapsible : false,
					margin:"8 20 0 20",
					autoHeight : true,
					items : [{
						xtype : 'filefield',
						width : 346,
						labelWidth:70,
						emptyText : local.config.winFileChoose,
						fieldLabel : local.config.winFileType,
						name : 'upload',
						buttonText : local.btn.viewFile,
						//allowBlank : false,
						//blankText : local.config.fileNoNull,
						msgTarget : "under"
					}]
					
				},{
					xtype : 'fieldset',
					margin:"8 20 0 20",
					title : local.explain,
					collapsible : false,
					autoHeight : true,
					padding : 10,
					html : local.config.winFileChooseFromThis2
				} ]
			}],
			buttons : [{
				text : local.btn.active,
				cls : "btn_focus",
				id : 'activeOffBtn',
				hidden : true
			}, {
				text : local.btn.down,
				cls : "btn_focus",
				id : 'downloadBtn'			
			}, {
				text : local.btn.cancle,
				handler : function() {
					this.up('window').close();
				}
			} ]
		})
		me.callParent(arguments);
	}
})