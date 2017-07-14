Ext.define('acesure.config.view.license.LicenseRegisterWindow', {
	extend : 'Ext.window.Window',
	alias : 'widget.licenseRegWin',
	id : 'licenseRegWin',
	width : 450,
	//bodyStyle : "background-color:#FFFFFF",
	title : local.btn.productRegister,
	border : false,
	bodyBorder : false,
	draggable:false,
	//resizable : false,
	buttonAlign : "right",
	modal : true,
	initComponent : function() {
		var me = this;
		Ext.applyIf(me, {
			items : [
					{
						border : false,
						xtype : "form",
						width : "100%",
						defaults : {
							xtype : 'textfield',
							width : 360,
							margin:"8 20 0 20"
						},
						items : [
								{
									xtype : 'radiogroup',
									fieldLabel : local.config.activeWay,
									items : [
											{
												xtype : 'radio',
												width : 100,
												id : "state",
												name : 'state',
												inputValue : '1',
												boxLabel : local.config.activeWayOnline,
												checked : true,
												handler : function(v) {
													if (v.getValue()) {
														var activeBtn = v.up('window').query('#activeBtn')[0];
														var downloadBtn = activeBtn.nextSibling();
														activeBtn.show();
														downloadBtn.hide();														
													}
												}
											},
											{
												xtype : 'radio',
												width : 100,
												name : 'state',
												inputValue : '2',
												boxLabel : local.config.activeWayOffline,
												handler : function(v) {
													if (v.getValue()) {                 
														var downloadBtn = v.up('window').query('#downloadBtn')[0];
														var activeBtn = downloadBtn.previousSibling();														
														downloadBtn.show();	
														activeBtn.hide();
													}
												}
											} ]
								},{
									xtype: 'panel',
									border: false,
									width:"100%",
									padding:"4 0 5 0",
									margin:0,
									style:"text-align:center;background:#fff4d2",
									bodyStyle:"background:#fff4d2",
									html: local.config.licenseActiveOnlineTip
									},
								{
									id : "donePids",
									name : 'customer.donePids',
									xtype : 'textarea',
									width : 360,
									height : 50,								
									fieldLabel : local.config.activeProNum,
									cols : 17,
									disabled : true
								},
								{
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
								} ]
					},
					{
						xtype : 'fieldset',
						id : 'reguseroptioninfo',
						title : local.explain,
						margin:"0 20 20 20",
						padding:"0 10 10 10",
						autoHeight : true,
						collapsed : false,
						html :local.config.licenseRegisterWinMsg
					} ],
			buttons : [ {
				text : local.btn.active,
				cls : "btn_focus",
				id : 'activeBtn'
			}, {
				text : local.btn.down,
				cls : "btn_focus",
				id : 'downloadBtn',
				hidden : true
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