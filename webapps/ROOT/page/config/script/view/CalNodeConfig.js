Ext.define('acesure.config.view.CalNodeConfig', {
	extend : 'Ext.panel.Panel',
	border : false,
	alias : 'widget.CalNodeConfig',
	id:"calNodeConfigId",
	layout:"vbox",
	items : [ {
		height:108,
		width:"100%",
		padding:'0 25 0 25',
		style:'background:#fafbfc;border:0;border-bottom:1px solid #e3eaec',
		defaults:{bodyStyle:'background:#fafbfc'},
		xtype : 'CalNodeConfigBar'
	}, {
		width:"100%",
		flex:1,
		minHeight:150,
		border:false,
		xtype : 'calNodeConfigList'
	}, {
		border:false,
		flex:2,
		width:"100%",
		xtype : 'calNodeConfigInfo'
	} ]

});


var calNodeCount=2;
Ext.define('acesure.config.view.calNodeConfig.CalNodeConfigBar', {
	extend : 'Ext.Toolbar',
	alias : 'widget.CalNodeConfigBar',
	items : [ {
		xtype : "panel",
		border : false,
		width : 48,
		height : 42,
		html : '<img src="/images/config/node_count.png"/>'
	}, {
		xtype : "panel",
		border : false,
		id:"calNodeCountId",
		html : '<font class="font_h3">'+local.emergency.nodeCount+'</font><br>'
	}, '->', {
		xtype : 'button',
		itemId : 'systemconfig_calnode_config',
		text : local.btn.config,
		style:'padding-left:26px',
		icon : '/images/common/set_black.png',
		handler : function() {
			var calNodeConfigList = Ext.getCmp('calNodeConfigListId');
			var selected = calNodeConfigList.getSelectionModel().selected;
			if(selected.length==0){
				Ext.MessageBox.alert(local.window.tip, local.config.chooseCalNodeTip);
			};
			if(selected.get(0).raw.authorized==2){
				Ext.MessageBox.alert(local.window.tip, local.calNodeNoAuth);
				return false;
			};
			var win=Ext.create("acesure.config.view.CalculateCfgWin",{
				calNodeInfo:selected.get(0).raw
			}).show();
			var calNodeInfo=selected.get(0);
			win.down('form').loadRecord(calNodeInfo);
		} 
	} ],
	listeners:{
		render : function(v,opts){
			  POWER_OP.filterEnableWidgetsOfExtjs(v,CURRENT_USER.getSystemPower());
		}
	}
});


Ext.define('acesure.config.view.CalNodeConfig.CalNodeConfigList', {
	extend : 'Ext.grid.GridPanel',
	alias : 'widget.calNodeConfigList',
	id:"calNodeConfigListId",
	//overflowY:'auto',
	enableColumnResize:false,
	enableColumnMove:false,
	enableColumnHide:false,
	initComponent : function() {
		var me = this;
		var nodeStore=Ext.create("acesure.config.store.CalNodeStore").load();
		Ext.applyIf(me, {
			store:nodeStore,
			columns : [{
				header: local.IP,
				flex: 1,
				menuDisabled:true,
				sortable: false,
				renderer : function(value, cellmeta, record, rowIndex, columnIndex, store) {
					var ip=record.data["nodeIpLan"];
					var port=record.data["nodeLocalPort"];
					var state=record.data["nodeState"];
					if(state==1){
						return  "<img src='/images/recovery/mount_on.png' />&nbsp;&nbsp;" + ip ;
					}else{
						return  "<img src='/images/recovery/mount.png' />&nbsp;&nbsp;" + ip ;
					}
				}
			},
			{
				header: local.config.calNodeName,
				dataIndex: 'nodeName',
				flex: 1,
				menuDisabled:true,
				sortable: false ,
				renderer : function(v, p, r) {
						return v;
				}
			},{	
				header: local.config.calNodeUniqueName, 
				flex: 1,
				dataIndex: 'nodeUniqueName',
				sortable: true,
				menuDisabled:true,
				renderer : function(v, p, r) {
					return v;
				}
			},{
				header: local.config.calNodeSysType,
				dataIndex: 'nodeSysType', 
				flex: 1.2,
				menuDisabled:true,
				renderer : function(v, p, r) {
					return v;
				} 
				
			},/*{
				header: local.config.calNodeMaxNum,
				dataIndex: 'nodeMaxNum', 
				flex: 1,
				renderer : function(v, p, r) {
					//return "<span style='color:#2db200'>"+v+"</span>";
					return v;
				} 
			},*/
			{
				header: local.config.state,
				dataIndex: 'nodeState', 
				flex: 1,
				menuDisabled:true,
				renderer : function(v, p, r) {
					if(v==1){
						return "<span style='color:#02CC9A'>"+local.normal+"</span>";
					}else{
						return "<span style='color:#ffab5e'>"+local.abnormal+"</span>";
					}
				}
			},
			{
				header: local.config.authState,
				menuDisabled:true,
				dataIndex: 'authorized', 
				flex: 1,
				renderer : function(v, p, r) {
					if(v==1){
						return "<span style='color:#02CC9A'>"+local.authed+"</span>";
					}else{
						return "<span style='color:#ffab5e'>"+local.unAuth+"</span>";
					}
				}
			}   
			/*,{
				header : local.emergency.gridHander,
				dataIndex : 'mountId',
				sortable: false,
				flex: 1,
				renderer: function (value, cellmeta, record, rowIndex, columnIndex) {  
					//激活操作，页面显示
					var active="<a name='systemconfig_calnode_delcalnode' href='javascript:void(0);' onclick='confirmDelete("+record.data.nodeId+");' style='text-decoration:none;'><font style=\"color:red;font-weight:bold;\">"+local.btn.delete0+"</font></a> ";
					return "<div >" + active + "</div>";  
				}
			}*/  ]
		});
		me.callParent(arguments);
		me.on('itemclick',function(me, record, item, index, e){
			var data = record.data;
			showCalNodeInfo(data);
		});
		/*me.on('itemcontextmenu',function(me, record, item, index, e){
            var data = record.data;
            var rightMenu = Ext.create('Ext.menu.Menu',{
                                items : [{
                                       itemId : 'systemconfig_calnode_delcalnode',
                                       text : '删除计算节点',
                                       icon : "/images/config/menu_delete.png",
                                       action : 'power',
                                       listeners : {
                                       	    'click' : function(){
                                       	    	confirmDelete(data.nodeId);
                                       	    }
                                       }
                                       }]
                            });
            e.preventDefault();//阻止浏览器默认右键菜单                
            rightMenu.showAt(e.getXY());
            //根据用户权限过滤按钮
         POWER_OP.filterEnableMenuOfExtjs(rightMenu,CURRENT_USER.getSystemPower());
        });*/
		me.on('render',function(me){
		    //过滤用户删除计算节点权限
			POWER_OP.filterEnableDomsInGridpanelColumnOfExtjs(me, CURRENT_USER.getSystemPower());
        });
	}
});

Ext.define('acesure.config.view.CalNodeConfigInfo', {
	extend : 'Ext.panel.Panel',
	id : 'calNodeConfigInfo',
	alias : 'widget.calNodeConfigInfo',
	//width : '100%',
	border:false,
	//height:500,
	layout:"vbox",
	items : [
			{
				xtype : 'toolbar',
				width:"100%",
				height:70,
				padding:'0 25 0 25',
				style:'background:#fafbfc;border:0;border-top:1px solid #d1dade;border-bottom:1px solid #EEF2F4',
				defaults:{style:'background:#fafbfc;'},
				items : [ {
					xtype : "panel",
					border : false,
					width : 35,
					height : 31,
					bodyStyle:"background:none",
					html : '<img src="/images/config/info.png"/>'
				}, {
					xtype : "panel",
					border : false,
					bodyStyle:"background:none",
					html :"<fong class='font_h4'>" +local.btn.detailInfo+"</font>"
				} ]
			},
			{
				border:false,
				itemId :'infoGrid'
			} ]
});

Ext.define('acesure.config.view.CalNodeInfoGrid',{
	extend:'Ext.grid.property.Grid',
	alias : 'widget.calNodeInfoGrid',
	hideHeaders : true,
	border:false,
	bodyStyle:'border-top:0',
	sortableColumns : false,
	//overflowY:'auto',
	autoFitColumns: true,
	nameColumnWidth:200,
	sourceConfig : {
		nodeUniqueId : {
			displayName :local.config.calNodeUniqueName
		},
		nodeName : {
			displayName :local.config.calNodeName
		},
		firstIp : {
			displayName :local.config.calNodeFristIP,
			renderer : function(v) {
				return Ext.String.format(
						'<span style="color: #02CC9A;">{0}</span>',
						v);
			}
		},
		nextIp : {
			displayName :local.config.calNodeStandbyIP,
			renderer : function(v) {
				return Ext.String.format(
						'<span style="color: #02CC9A;">{0}</span>',
						v);
			}
		},
		/*maxNum : {
			displayName : local.config.calNodeMaxNum
		},*/
		sysType : {
			displayName :local.config.calNodeSysType
		},
		installTime : {
			displayName :local.config.calNodeInstallTime
		},
		createTime : {
			displayName :local.config.calNodeCreatTime
		},
		updateTime : {
			displayName : local.config.calNodeUpdateTime
		}
	},
	listeners : {
		beforeedit : {
			fn : function() {
				return false;
			}
		}
	}
});


function showCalNodeInfo(calNode) {
	var calNodeConfigInfo = Ext.getCmp('calNodeConfigInfo');
	var infoGrid = calNodeConfigInfo.getComponent('infoGrid');
	calNodeConfigInfo.remove(infoGrid);
	calNodeConfigInfo.add({
		xtype:"calNodeInfoGrid",
		itemId:"infoGrid",
		flex:1,
		width:"100%",
		overflowY:"auto",
		source:{
			
			'nodeUniqueId' : calNode.nodeUniqueName,
			'nodeName' : calNode.nodeName,
			'firstIp' : calNode.nodeIpLan,
			'nextIp' : calNode.nodeIpNet,
			//'maxNum' : calNode.nodeMaxNum,
			'sysType' : calNode.nodeSysType,
			'installTime' : calNode.nodeInstallTime,
			'createTime' : calNode.nodeCreateTime,
			'updateTime' : calNode.nodeUpdateTime
		}
	});
	calNodeConfigInfo.doLayout();
}




/**
 * 配置计算节点弹出窗口
 */
Ext.define('acesure.config.view.CalculateCfgWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.calculateCfgWin',
	id : 'calculateCfgWinId',
	border: false,
	title :local.config.calNodeConfig,
	modal : true,
	resizable:false,
	constrain: true,
	layout: 'fit',
	width:500,
	heigth:500,
	items : [
	         

	         {
		id : 'calculateCfgForm',
		xtype : 'form',
		border : false,
		bodyPadding : 10,
		autoScroll : true,
		fieldDefaults : {
			labelAlign : 'right',
			labelWidth : 120,
			msgTarget : 'side'
		},
		items : [{
			xtype : 'fieldset',
			title :local.config.calNodeConfigInfo,
			padding:10,
			defaultType : 'textfield',
			defaults : {
				allowBlank : false,
				anchor : '100%'
			},
			items : [{
						hidden:true, 
						id:'nodeId',
						name:'nodeId'
					}, {
						fieldLabel :local.config.calNodeName,
						id:'nodeName',
						name : "nodeName",
                        //vtype :'alphanum',
	    	        	//regex:/^(?!_)(?!.*?_$)[a-zA-Z0-9_]+$/,
						regex:/^(?!_)(?!.*?_$)[a-zA-Z0-9_]+$/,
						regexText:local.config.storageNameType,
                        maxLength:30
						//readOnly : true
					},
					{
						fieldLabel : local.config.calNodeFristIP,
						id:'nodeIpLan',
						name : 'nodeIpLan',
						xtype:'combo',
						editable : false,
						queryMode:'local',
						displayField:'openName',
						valueField:'openValue',
						listeners:{
							afterrender:function(){
								var ipList=calNodeInfo.ipTotal;
								this.store=Ext.create('Ext.data.ArrayStore',{
									fields:['openValue','openName'],
									data:ipList
								});
							}
						}
					},
					{
						xtype:"panel",
						border:false,
						layout:"hbox",
						items:[
								
								{
									fieldLabel : local.config.calNodeStandbyIP,
									xtype:'textarea',
									id:'nodeIpNet',
									width:330,
									allowBlank : true,
									regex:/^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]))(,(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){0,2}$/,
									regexText: local.config.IPListFormatError,
									name : 'nodeIpNet'
									//readOnly:true
								},
								{
									xtype:"button",
									style:"margin-left:10px",
									//html:local.btn.new0,
									html:local.btn.modify,
									handler:function(){
    									//Ext.create("acesure.config.view.IpSetWin").show();
										var ipNetCmp = this.previousSibling(); 
                                        addIpAddress(ipNetCmp);
									}
								}
						       ]
					}/*,
					{
						fieldLabel : local.config.calNodeMaxNum,
						xtype:'numberfield',
						hideTrigger:true,
						id:'nodeMaxNum',
						name : 'nodeMaxNum',
						disabled:true
					}*/]
		}, {
            xtype : 'fieldset',
            title : local.explain,
            padding:10,
            defaults : {
                anchor : '100%'
            },
            items : [{
                xtype:'panel',
                border : false,
                html:local.config.calNodeConfigWinMsg
                    }]
        }]
	}],
	buttons : [
	           {
	            text:local.btn.save,
	            cls:"btn_focus",
	            handler : function() {
	            	saveCalNodeCfg();
				}
              },{
				text : local.btn.cancle,
				handler : function() {
					this.up('window').close();
				}}
	           
			],
			initComponent:function(){
				calNodeInfo=this.calNodeInfo;
				Ext.apply(this,{
				});
				this.callParent();
			}

});


/**
 * 增加IP弹出窗口
 */
Ext.define('acesure.config.view.IpSetWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.ipSetWin',
	id : 'ipSetWinId',
	border: false,
	title :local.config.calNodeConfigIPStandby,
	modal : true,
	resizable:false,
	constrain: true,
	layout: 'fit',
	width:450,
	heigth:80,
	items : [
	         {
	        	 xtype: "uxipfield"
	         }
	         ],
	         buttons : [
	                    {
	                    	text:local.btn.save,
	                    	cls:"btn_focus",
	                    	handler : function() {
	                    		var ip0=Ext.getCmp("ip0").getValue();
	                    		var ip1=Ext.getCmp("ip1").getValue();
	                    		var ip2=Ext.getCmp("ip2").getValue();
	                    		var ip3=Ext.getCmp("ip3").getValue();
	                    		if(null==ip0||null==ip1||null==ip2||null==ip3){
	                    			Ext.MessageBox.alert(local.window.tip,local.config.completeIP);
	                    		}else{
	                    			if(ip0<0||ip0>255||ip1<0||ip1>255||ip2<0||ip2>255||ip3<0||ip3>255){
	                    				Ext.MessageBox.alert(local.window.tip,local.config.IPRangeError);
	                    				return false;
	                    			}
	                    			var ip=ip0+'.'+ip1+'.'+ip2+'.'+ip3;
		                    		var backUpIp=Ext.getCmp("nodeIpNet").getValue().replace(/(^\s+)|(\s+$)/g, "");
		                    		
		                    		//备用IP为空
		                    		if(backUpIp.length==0){
		                    			backUpIp = ip;
		                    		}else{
	                    			//备用IP不为空
		                    			//过滤重复的IP
		                    			if(backUpIp.indexOf(ip)<0){
    		                    			backUpIp = backUpIp+','+ip;
		                    			}
		                    		}
		                    		
		                    		Ext.getCmp("nodeIpNet").setValue(backUpIp);
		                    		this.up('window').close();
	                    		}
	                    	}
	                    },{
	                    	text : local.btn.cancle,
	                    	handler : function() {
	                    		this.up('window').close();
	                    	}}

	                    ]
});

/**
 * 
 * saveCalNodeCfg:保存虚拟机配置
 * @data 2016-4-20
 * @auth WangShaoDong
 */
function saveCalNodeCfg(){
	var calNodeCfgForm=Ext.getCmp("calculateCfgForm");
	if (!calNodeCfgForm.isValid()) {
		Ext.MessageBox.alert(local.window.tip,local.config.dataIsValidText);
		return false;
	}
	/*var nodeMaxNum = parseInt(Ext.getCmp("nodeMaxNum").getValue(), 10);  
	if(nodeMaxNum<=0){
	Ext.MessageBox.alert(local.window.tip,local.config.maxNumConfig);
		return false;
	};*/
	var myMask = new Ext.LoadMask('calculateCfgWinId', {   
		msg : local.config.updateCalNodeLoading
	});
	myMask.show();

	Ext.Ajax.request({
		//请求地址
		url: '/emergency/tocomputeNodes!updateComputeNodeInfo.action',
		method:'post',
		timeout: 40000,
		//提交参数组
		params: {
			"computeNode.nodeName":Ext.getCmp("nodeName").getValue(),
			"computeNode.nodeId":Ext.getCmp("nodeId").getValue(),
			"computeNode.nodeIpLan":Ext.getCmp("nodeIpLan").getValue(),
			"computeNode.nodeIpNet":Ext.getCmp("nodeIpNet").getValue()
			//"computeNode.nodeMaxManageNum":nodeMaxNum
		},
		success: function(response, options) {
			myMask.hide();
			var json = JSON.parse(response.responseText);  
			var msgCode=json[0].msgCode;
			var msgContent=json[0].msgContent;
			if(msgCode>30000){
				Ext.websure.MsgError(msgCode,msgContent);
			}else{
				Ext.websure.MsgTip.msg(local.window.tip, msgContent,true);
				Ext.getCmp("calculateCfgWinId").close();
				refreshCalNodeCfg();
			}
		},
		failure: function(resp,opts) {
			myMask.hide();
//			Ext.MessageBox.alert(local.window.tip,local.config.calNodeConfigError);
			Ext.websure.MsgError("WF-30079",local.config.calNodeConfigError);
		}
	});
}

/**
 * 增加备用IP
 */
Ext.define("acesure.config.view.CalNodeConfig.IpField",{
	extend:"Ext.form.FieldSet",
	alias:"widget.uxipfield",
	border: false,
	baseCls: null,
	layout: 'table',
	token: '.',
	layoutConfig: {
		columns: 8
	},
	width: 380,
	height:60,
	margin:10,
	defaults:{
		maskRe: /[0-9]/,
		maxLength: 3,
		listeners: {
			'focus': function(f){
				f.selectText();
			}
		}
	},
	initComponent: function()
	{
		this.items = [
		              {
		            	  html: local.config.IPStandbyChoose+":",
		            	  baseCls: null,
		            	  border: false
		              },{
		            	  xtype:'numberfield',
		            	  id:'ip0',
		            	  width:80,
		            	  enableKeyEvents:true,
		            	  hideTrigger: true,
		            	  keyNavEnabled: true,
		            	  mouseWheelEnabled: false,
		            	  minValue:1,
		            	  maxValue:255,
		            	  listeners: {  
		            	        change: function(field, value) {  
		            	        	this.validate();
		            	            value = parseInt(value, 10);  
		            	            if(value>100&&value<256){
		            	            	Ext.getCmp("ip1").focus();
		            	            };
		            	        },
		            	        keyup:function(src,evt){
		            	        	var inputValue = src.rawValue;
		            	            if(inputValue.indexOf('.')>0){
                                        Ext.getCmp("ip1").focus();
                                    };
		            	        	
		            	            var val=src.getValue();
		            	            if(val){
		            	            	val = val.toString().replace(/["^d]/g,'');
		            	            }
                                    src.setValue(val);
		            	        }
		            	    }
		              }, {
		            	  html: '.',
		            	  baseCls: null,
		            	  bodyStyle: 'font-weight: bold; font-size-adjust: .9',
		            	  border: false
		              }, {
		            	  xtype:'numberfield',
		            	  id:'ip1',
		            	  width:80,
		            	  enableKeyEvents:true,
		            	  hideTrigger: true,
		            	  keyNavEnabled: true,
		            	  mouseWheelEnabled: false,
		            	  minValue:0,
		            	  maxValue:255,
		            	  listeners: {  
		            	        change: function(field, value) {  
		            	            value = parseInt(value, 10);  
		            	            if(value>100&&value<256){
		            	            	Ext.getCmp("ip2").focus();
		            	            };
		            	        },
                                keyup:function(src,evt){
                                	//监听输入.号自动换格子
                                    var inputValue = src.rawValue;
                                    if(inputValue.indexOf('.')>0){
                                        Ext.getCmp("ip2").focus();
                                    };
                                    //过滤非法字符
                                    var val=src.getValue();
                                    if(val){
                                        val = val.toString().replace(/["^d]/g,'');
                                    }
                                    src.setValue(val);
                                    
                                    //监听键盘backspace 自动退格子
                                    var eventKey = evt.getKey();
                                    if(eventKey==8 && (!val || val.length==0)){
                                         Ext.getCmp("ip0").focus();
                                    }
                                }  
		            	    }
		              }, {
		            	  html: '.',
		            	  baseCls: null,
		            	  bodyStyle: 'font-weight: bold; font-size-adjust: .9',
		            	  border: false
		              }, {
		            	  xtype:'numberfield',
		            	  width:80,
		            	  id:'ip2',
		            	  enableKeyEvents:true,
		            	  hideTrigger: true,
		            	  keyNavEnabled: true,
		            	  mouseWheelEnabled: false,
		            	  minValue:0,
		            	  maxValue:255,
		            	  listeners: {  
		            	        change: function(field, value) {  
		            	            value = parseInt(value, 10);  
		            	            if(value>100&&value<256){
		            	            	Ext.getCmp("ip3").focus();
		            	            };
		            	        },
                                keyup:function(src,evt){
                                	var inputValue = src.rawValue;
                                    if(inputValue.indexOf('.')>0){
                                        Ext.getCmp("ip3").focus();
                                    };
                                	
                                    var val=src.getValue();
                                    if(val){
                                        val = val.toString().replace(/["^d]/g,'');
                                    }
                                    src.setValue(val);
                                    
                                    var eventKey = evt.getKey();
                                    if(eventKey==8 && (!val || val.length==0)){
                                         Ext.getCmp("ip1").focus();
                                    }
                                }  
		            	    }
		              }, {
		            	  html: '.',
		            	  baseCls: null,
		            	  bodyStyle: 'font-weight: bold; font-size-adjust: .9',
		            	  border: false
		              }, {
		            	  xtype:'numberfield',
		            	  id:'ip3',
		            	  enableKeyEvents:true,
		            	  minValue:0,
		            	  maxValue:255,
		            	  regex:/^[1-9]\d*$/,
                          regexText:local.config.integer,
		            	  width:80,
		            	  hideTrigger: true,
		            	  keyNavEnabled: true,
		            	  mouseWheelEnabled: false,
		            	  listeners: {  
                                keyup:function(src,evt){
                                    var val=src.getValue();
                                    if(val){
                                        val = val.toString().replace(/["^d]/g,'');
                                    }
                                    src.setValue(val);
                                    
                                    var eventKey = evt.getKey();
                                    if(eventKey==8 && (!val || val.length==0)){
                                         Ext.getCmp("ip2").focus();
                                    }
                                }  
                            }  
		              }],

		              this.callParent(arguments);
	}

});

/**
 * 
 * refreshCalNodeCfg:计算节点配置完成后刷新页面
 * @data 2016-4-20
 * @auth WangShaoDong
 */
function refreshCalNodeCfg(){
	var calNodeConfigListId=Ext.getCmp("calNodeConfigListId");
	calNodeConfigListId.getStore().load();
	var calNodeConfigInfo=Ext.getCmp("calNodeConfigInfo");
	var inForGrid=calNodeConfigInfo.getComponent("infoGrid");
	inForGrid.setSource(null);
}
/**
 * 
 * deleteCalNodeRecord:删除计算节点记录
 * @data 2016-4-21
 * @auth WangShaoDong
 */
function deleteCalNodeRecord(data){
	var nodeID=data;
	Ext.Ajax.request({
		//请求地址
		url: '/emergency/tocomputeNodes!deleteComputeNode.action',
		method:'post',
		timeout: 40000,
		//提交参数组
		params: {
			nodeId:nodeID
		},
		success: function(response, options) {
			var json = JSON.parse(response.responseText);  
			showMsg(json);
			refreshCalNodeCfg();
		},
		failure: function(resp,opts) {
//			Ext.MessageBox.alert(local.window.tip,local.config.calNodeDelError);
			Ext.websure.MsgError("WF-30080",local.config.calNodeDelError);
		}
	});
}

function confirmDelete(data){
	Ext.MessageBox.confirm(local.window.tip, local.config.calNodeDelConfirm, function(btn){
		if(btn=='yes'){
			deleteCalNodeRecord(data);
		}else{

		}
	});
}
