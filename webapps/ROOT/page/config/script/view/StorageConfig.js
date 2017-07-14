/**
 * author:yangbobin date:2015-11-09
 * description:存储节点设置
 */

var node = null;    //记录当前TreePanel选中的node

/**
 * 存储节点设置主框架
 */
Ext.define('acesure.config.view.StorageConfig', {
	extend : 'Ext.panel.Panel',
	border : false,
	alias : 'widget.storageConfig',
	id : 'storageConfigPanel',
	layout:"vbox",
	items : [ {
		width:"100%",
		height : 108,
		style:'background:#fafbfc;border:0;border-bottom:1px solid #e3eaec',
		defaults:{bodyStyle:'background:#fafbfc'},
		padding:'0 25 0 25',
		xtype : 'storageConfigBar',
		listeners : {
			'render' : function(v,opts) {
				setStorageNodeCount();    //设置存储节点数量显示
				//控制页面按钮权限
				POWER_OP.filterEnableWidgetsOfExtjs(v, CURRENT_USER.getSystemPower());
			}
		}
	}, {
		flex:1,
		width:"100%",
		minHeight:100,
		border:false,
		xtype : 'storageConfigTreePanel'
	}, {
		/*height:360,*///高度太小底部显示不完全
		border:false,
		flex:1.5,
		width:"100%",
		xtype : 'storageConfigInfo'
	} ]

});

/**
 * 系统设置-存储节点-主框架 toolbar
 */
Ext.define('acesure.config.view.StorageConfigBar', {
	extend : 'Ext.Toolbar',
	id:'storageConfigBar',
	alias : 'widget.storageConfigBar',
	items : [ {
		xtype : "panel",
		border : false,
		width : 48,
		height : 42,
		html : '<img src="/images/config/node_save.png"/>'
	}, {
		xtype : "panel",
		id : 'storageCountLabel',
		width:250,
		border : false,
		html : '<font class="font_h3">'+local.config.nodeSave+'</font>'
	}, "->", {
		xtype : 'button',
		text : local.btn.new0,
		id : 'systemconfig_stonode_add',
		itemId : 'systemconfig_stonode_add',
		style:'padding-left:26px',
		icon : '/images/common/new_16.png',
		action: 'power'
	}, {
		xtype : 'button',
		text : local.btn.config,
		id : 'systemconfig_stonode_config',
		itemId : 'systemconfig_stonode_config',
		style:'padding-left:26px',
		icon : '/images/common/set_black.png',
		action: 'power'
	} ]
});

/**
 * 系统设置-存储节点-主框架 TreePanel
 */
Ext.define('acesure.config.view.StorageConfigTreePanel', {
	extend : 'Ext.tree.TreePanel',
	id : 'storageConfigTreePanel',
/*	width : '100%',*/
	alias : 'widget.storageConfigTreePanel',
	useArrows : true,
	enableColumnResize:false,
	enableColumnMove:false,
	enableColumnHide:false,
	cls:'treePanel_icon_no grid_border',
	rootVisible : false,    // 不可见根
	initComponent : function() {
		var me = this;
		var treeStore = Ext.create('acesure.config.store.StorageAndPathTreeStore').load();
		Ext.applyIf(me, {
			store : treeStore,
			columns : [
					{
						xtype : 'treecolumn',
						menuDisabled:true,
						header : local.config.address,
						flex:3,
						sortable : true,
						dataIndex : 'text',
						renderer : function(value, cellmeta, record, rowIndex, columnIndex, store) {
							var state=record.data["state"]; 
							var leaf=record.data["leaf"]; 
							if(leaf == false){
								if(state==1){
									return  "<img src='/images/recovery/mount_on.png' />&nbsp;&nbsp;" + value ;
								}else{
									return  "<img src='/images/recovery/mount.png' />&nbsp;&nbsp;" + value ;
								}	
							}else{
								return  value ;
							}
						}
					},
					{
						header : local.config.name,
						flex:2,
						menuDisabled:true,
						sortable : true,
						dataIndex : 'name'
					},
					{
						header : local.config.storageFirst,
						flex:1,
						menuDisabled:true,
						dataIndex : 'recommand',
						renderer:function(v){
							if(v==1){
								return '<image src="/images/config/recommand.png"/>';
							}else{
								return '';
							}
						}
					},
					/*{
						header : local.config.storageType,
						width : '15%',menuDisabled:true,
						sortable : true,
						dataIndex : 'type',
						renderer:function(v){
							if(v==1){
								return local.config.storageTypeLocal;
							}else if(v==2){
								return local.config.storageTypeWeb;
							}else if(v==3){
								return local.config.storageTypeBackup;
							}
						}
					},*/
					{
						header : local.config.maxUserNum,
						flex:1,
						menuDisabled:true,
						sortable : true,
						dataIndex : 'maxUserNum'
					},
					{
						header : local.config.state,
						flex:1,
						menuDisabled:true,
						dataIndex : 'state',
						renderer : function(v) {
							if(v==1){
								return '<span style="color: #02CC9A;">'+local.normal+'</span>';
							}else if(v==2){
								return '<span style="color: #ffab5e;">'+local.abnormal+'</span>';
							}
						}
					},{
						header : local.config.authState,
						flex:1,
                        menuDisabled:true,
                        dataIndex : 'licState',
                        renderer : function(v) {
                            if(v==1){
                                return '<span style="color: #ffab5e;">'+local.unAuth+'</span>';
                            }else if(v==2){
                            	return '<span style="color: #02CC9A;">'+local.authed+'</span>';
                            }
                        }
					}]
		});
		me.callParent(arguments);
	},
	listeners : {
		itemclick : {
			fn : storageTreeClick
		},
		itemcontextmenu :{
			fn : storageTreeRightMenu
		}
	}
});

/**
 *  定制TreePanel record 选中右键菜单
 */
var storageRightMenu = Ext.create('Ext.menu.Menu',{
					id : 'storageCfgRightMenu',
					items : [
							{
								id : 'sysconfig_stonode_setdefaultvms',
								itemId : 'systemconfig_stonode_setdefaultvms',
								icon : "/images/config/menu_default.png",
								text :local.config.menuSetDefault,
								action : 'power',
								listeners : {
									'click' : function() {
										setDefaultVMS(node);
									}
								}
							},
							{
								id : 'sysconfig_stonode_delstorage',
								itemId : 'systemconfig_stonode_delstorage',
								icon : "/images/config/menu_delete.png",
								text :local.config.menuDelStorage,
								action : 'power',
								listeners : {
									'click' : function() {
										Ext.Msg.confirm({
										              title:local.window.tip,
										              msg:local.config.delStorageMsg,
										              buttons : Ext.MessageBox.YESNO,
										              fn:function(command){
    										              	if (command == "yes") {
                                                                deleteStorage(node);
                                                            }
										              }
										});
									}
								}
							},
							{
								id : 'sysconfig_stonode_delmedium',
								itemId : 'systemconfig_stonode_delmedium',
								icon : "/images/config/menu_delete.png",
								text : local.config.menuDelMedia,
								action : 'power',
								listeners : {
									'click' : function() {
										Ext.Msg.confirm({
                                                      title:local.window.tip,
                                                      msg:local.config.delStorageNodeMsg,
                                                      buttons : Ext.MessageBox.YESNO,
                                                      fn:function(command){
                                                            if (command == "yes") {
                                                                deleteStoragePath(node);
                                                            }
                                                      }
                                        });
									}
								}
							}/*, {
								id : 'sysconfig_stonode_setfirstip',
								icon : "/images/config/ip.png",
								text :local.config.menuSetFirstIP+ 'IP',
								action : 'power',
								listeners : {
									click : function() {
										setStoragePathIp(node);
									}
								}
							}*//*, {
								id : 'storagePathRedirectConfig',
								icon : "/images/config/recommand.png",
								text : local.config.menuMediaRedirect,    //介质重定向，国际化文件已删除
								listeners : {
									click : function() {
										var storageRedirectWin = Ext.create('acesure.config.view.StorageRedirectCfg');
										storageRedirectWin.show();
									}
								}
							}*/ ]
				});

/**
 * 系统设置-存储节点-详细信息面板
 */
Ext.define('acesure.config.view.StorageConfigInfo', {
	extend : 'Ext.panel.Panel',
	id : 'storageConfigInfo',
	alias : 'widget.storageConfigInfo',
	//width : '100%',
	border:false,
/*	height:392,*/
	layout:"vbox",
	items : [
			{
				xtype : 'toolbar',
				height:70,
				width:"100%",
				padding:'0 25 0 25',
				style:'background:#fafbfc;border:0;border-top:1px solid #d1dade;border-bottom:1px solid #EEF2F4',
				defaults:{style:'background:#fafbfc;'},
				items : [ {
					xtype : "panel",
					border : false,
					width : 35,
					height : 31,
					bodyStyle:'background:#fafbfc;',
					html : '<img src="/images/config/info.png"/>'
				}, {
					xtype : "panel",
					border : false,
					bodyStyle:'background:#fafbfc;',
					html : '<font class="font_h4">'+local.btn.detailInfo+'</font>'
				} ]
			},
			{
				border:false,
				flex:1,
				width:"100%",
				itemId :'infoGrid'
				/*xtype : 'storageInfoGrid'*/
			} ]
});

/**
 * 详细信息面板->存储节点信息表格
 */
Ext.define('acesure.config.view.StorageInfoGrid',{
	extend:'Ext.grid.property.Grid',
	id:'storageInfoGrid',
	alias : 'widget.storageInfoGrid',
	hideHeaders : true,
	border:false,
	bodyStyle:'border-top:0',
	sortableColumns : false,
	nameColumnWidth : 150,
	sourceConfig : {
		uniqueId : {
			displayName :local.config.storageIP
		},
		name : {
			displayName : local.config.storageName
		},
		state : {
			displayName : local.config.state,
			renderer : function(v) {
				if(v==1){
					return '<span style="color: #02CC9A;">'+local.normal+'</span>';
				}else if(v==2){
					return '<span style="color: #ffab5e;">'+local.abnormal+'</span>';
				}
			}
		},
		licState : {
            displayName : '授权状态',
            renderer : function(v) {
            	if(v==1){
                    return '<span style="color: #ffab5e;">未授权</span>';
                }else if(v==2){
                    return '<span style="color: #02CC9A;">已授权</span>';
                }
            }
        },
		ipLan : {
			displayName : local.config.IPFirstChoose
		},
		ipNet : {
			displayName : local.config.IPStandbyChoose
		},
		userCmdPort : {
			displayName : local.config.storagePort
		},
		maxUserNum : {
			displayName : local.config.maxUserNum
		},
		systemType : {
			displayName : local.config.host
		},
		setupTime : {
			displayName : local.config.time
		},
		version : {
			displayName : local.config.storageVersion
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

/**
 * 存储路径信息表格
 */
Ext.define('acesure.config.view.StoragePathGrid',{
	extend:'Ext.grid.property.Grid',
	id:'storagePathGrid',
	alias : 'widget.storagePathGrid',
	hideHeaders : true,
	border:false,
	bodyStyle:'border-top:0',
	sortableColumns : false,
	nameColumnWidth : 150,
	sourceConfig : {
		name : {
			displayName : local.config.mediaName
		},
		path : {
			displayName :local.config.mediaSrc
		},
		freeSize : {
			displayName : local.config.freeSpace,
			renderer : function(v) {
				return v+"[GB]";
			}
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

/**
 * 存储器设置 window
 */
Ext.define('acesure.config.view.StorageCfgWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.storageCfgWin',
	id : 'storageCfgWin',
	border: false,
	title :local.config.windowConfigTitle,
	modal : true,
	resizable:false,
	constrain: true,
	layout: 'fit',
	items : [{
		id : 'storageCfgForm',
		xtype : 'form',
		border : false,
		width : 400,
		bodyPadding : 10,
		autoScroll : true,
		fieldDefaults : {
			labelAlign : 'right',
			labelWidth : 100,
			msgTarget : 'side'
		},
		items : [{
			xtype : 'fieldset',
			title :local.config.windowConfigInfo,
			padding:10,
			defaultType : 'textfield',
			defaults : {
				allowBlank : false,
				anchor : '100%'
			},
			items : [{
						hidden:true, 
						id:'id',
						name:'storage.id'
					}, {
						fieldLabel :local.config.storageName,
						id:'name',
						name : 'storage.name',
						maxLength:30,
						regex:/^(?!_)(?!.*?_$)[a-zA-Z0-9_]+$/,
						regexText:local.config.storageNameType
                        //vtype :'alphanum'
					}, /*{
						fieldLabel : local.config.IPFirstChoose,
						id:'ipLan',
						regex:/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                        regexText: local.config.IPFormatError,
                        name : 'storage.ipLan'
					}, {
                        fieldLabel : local.config.IPStandbyChoose+local.config.IPListTip,    //对应的国际化文字已删除
                        xtype:'textarea',
                        id:'ipNet',
                        allowBlank : true,
                        //regex:/^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])[,]?\n*\s*)*$/,
                        regex:/^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]))(,(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]))*$/,
                        regexText: local.config.IPListFormatError,
                        name : 'storage.ipNet'
                    },*/
					{
                        fieldLabel : local.config.IPFirstChoose,
                        xtype:'combo',
                        id:'ipLan', 
                        emptyText:local.config.chooseIP,
                        editable : false,
                        displayField:'ipDisplay',
                        valueField:'ipValue',
                        store:'StorageIPListStore',
                        queryMode:'local',
                        name : 'storage.ipLan',
                        listeners:{
                            afterrender:function(self){
                            	var storageConfigTreePanel = Ext.getCmp('storageConfigTreePanel');
                                var selected = storageConfigTreePanel.getSelectionModel().selected;//被选中对象
                                var storageNode = selected.get(0);    //获取选中节点
                                var storageId = storageNode.data.id;            
                                
                                self.store.load({
                                    params : {
                                        'storage.id' : storageId
                                    },
                                    callback : function(records, operation, success) {
                                        self.setValue(records[0].data.ipValue);
                                    }
                                });
                            },  
                            change:function(self,newValue,oldValue){
                                if(typeof(oldValue) != "undefined"){
                                    var ipNetCmp = Ext.getCmp('ipNet');
                                    var ipNet = ipNetCmp.getValue().replace(/(^\s+)|(\s+$)/g, "");
                                    //首选IP被替换后保存在备用IP
                                    if(ipNet.indexOf(oldValue)==-1){
                                        ipNet = oldValue+','+ipNet;
                                        ipNetCmp.setValue(ipNet);
                                    }
                                }
                            }
                        }
                    },{
                        xtype:"panel",
                        border:false,
                        layout:"hbox",
                        items:[
                                
                                {
                                    fieldLabel : local.config.IPStandbyChoose,
                                    xtype:'textarea',
                                    id:'ipNet',
                                    width:300,
                                    allowBlank : true,
                                    regex:/^((\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5]))(,(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])){0,2}$/,
                                    regexText: local.config.IPListFormatError,
                                    name : 'storage.ipNet'
                                },
                                {
                                    xtype:"button",
                                    style:"margin-left:3px;padding-left:0",
                                    texrAlign:"left",
                                    width:55,
                                    cls:"ip_add_btn",
                                    //html:local.btn.new0,
                                    html:local.btn.modify,
                                    handler:function(){ 
                                    	var ipNetCmp = this.previousSibling(); 
                                    	addIpAddress(ipNetCmp);
                                    }
                                }
                               ]
                    }/*, {
						fieldLabel : local.config.storagePort,
						xtype:'numberfield',
						hideTrigger:true,
						//maskRe:/[\d\-]/,
						id:'userCmdPort',
						name : 'storage.userCmdPort',
						readOnly:true
					}*//*, {
						fieldLabel : local.config.storageMaxNum,
						xtype:'numberfield',
						hideTrigger:true,
						//maskRe:/[\d\-]/,
						id:'maxManageNum',
						name : 'storage.maxManageNum'
					}*/, {
						fieldLabel : local.config.maxUserNum,
						xtype:'numberfield',
						regex:/^[1-9]\d*$/,
						regexText:local.config.integer,
						hideTrigger:true,
						maxValue : 100,
						margin:"5 0 0 0",
						minValue : 1,
						id:'maxUserNum',
						name : 'storage.maxUserNum'
					}/*, {
						fieldLabel : local.config.clientMaxUserNum,
						xtype:'numberfield',
						hideTrigger:true,
						//maskRe:/[\d\-]/,
						id:'maxUserRwNum',
						name : 'storage.maxUserRwNum'
					}*/, {
						fieldLabel : local.config.isExistPath,
						id:'isExistPath',
						name : 'storage.isExistPath',
						xtype:'combo',
						editable : false,
						//模拟store存放路径
						store:Ext.create('Ext.data.ArrayStore',{
								fields:['openValue','openName'],
								data:[[1,local.disabled],
								      [2,local.open]
								     ]}
						),
						queryMode:'local',
						displayField:'openName',
						valueField:'openValue'
					}]
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
				html:local.config.storageConfigWinMsg
					}]
		}]
	}],
	buttons : [
	           {
	            text:local.btn.save,
	            cls:"btn_focus",
	            id:'saveStorageCfg'
              },{
				text : local.btn.cancle,
				handler : function() {
					this.up('window').close();
				}}
	           
			]
});

/**
 * 定义 “新建”存储介质窗口
 */
Ext.define('acesure.config.view.StoragePathAddWin', {
	extend : 'Ext.window.Window',
	alias : 'widget.storagePathAddWin',
	id : 'storagePathAddWin',
	border: false,
	width:450,
	height:400,
	title : local.config.windowNewVmsTitle,
	modal : true,
	resizable:false,
	constrain: true,
	layout: 'fit',
	items : [{
		id : 'storagePathAddForm',
		xtype : 'form',
		border : false,
		width : 400,
		bodyPadding : 10,
		autoScroll : true,
		fieldDefaults : {
			labelAlign : 'right',
			labelWidth : 105,
			msgTarget : 'side'
		},
		items : [{
			xtype : 'fieldset',
			title : local.config.windowNewVmsInfo,
			defaultType : 'textfield',
			padding:10,
			defaults : {
				allowBlank : false,
				anchor : '100%'
			},
			items : [{
						xtype:'hidden',
						id:'id',
						name:'storagePath.storageId'
					},{
						fieldLabel : local.config.windowNewVmsMediaName,
						id:'name',
						cls:'disabled_text',
						readOnly : true
					}, {
						fieldLabel : local.config.mediaName,
						id:'symbol',
						name : 'storagePath.symbol',
						cls:'disabled_text',
						readOnly : true
					}, {
						fieldLabel : local.config.windowNewVmsSaveSrc,
						id:'storagePath',
						name : 'storagePath.path',
						xtype:'combo',
						emptyText:local.config.chooseStorageSrc,
						editable : false,
						store:Ext.create('Ext.data.ArrayStore',{
								fields:[
								   {name: 'valfield', type:"int"},//值
						           {name: 'diskName'},
						           {name: 'disfield'}, //键
						           {name: 'size', type:"int"},
						           {name: 'usedSize', type:"int"}
								]}
						),
						queryMode:'local',
						displayField:'disfield',
						valueField:'valfield'
					}, {
						fieldLabel : 'IP'+local.address,
						xtype:'combo',
						id:'ipLan', 
						emptyText:local.config.chooseIP,
						editable : false,
						displayField:'ipDisplay',
						valueField:'ipValue',
						store:'StorageIPListStore',
						queryMode:'local',
						name : 'storagePath.ipLan' 
					}]
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
				html:local.config.windowNewVmsExplain
					}]
		}]
	}],
	buttons : [{
        text: local.btn.save,
        cls:"btn_focus",
        id:'addStoragePathBtn'
    },{
		text : local.btn.cancle,
		handler : function() {
			this.up('window').close();
		}
	}]
});

/**
 * 定义 “设置首选IP”窗口
 */
Ext.define('acesure.config.view.StoragePathIpCfg', {
	extend : 'Ext.window.Window',
	alias : 'widget.StoragePathIpCfg',
	id : 'storagePathIpCfg',
	border: false,
	title : local.config.storagePathIpCfg,
	modal : true,
	resizable:false,
	constrain: true,
	layout: 'fit',
	items : [{
		id:'storagePathIpCfgForm',
		xtype : 'form',
		border : false,
		width : 260,
		bodyPadding : '5 0 0 0',
		autoScroll : true,
		fieldDefaults : {
			labelAlign : 'right',
			labelWidth : 80,
			msgTarget : 'side'
		},
		items : [{
			xtype : 'fieldset',
			border : 0,
			defaultType : 'textfield',
			defaults : {
				allowBlank : false,
				anchor : '100%'
			},
			items : [{
						xtype:'hidden',
						id:'pathId',
						name:'storagePath.pathId'
					},/*{
						fieldLabel : '首选IP地址 ',
						xtype:'combo',
						id:'remark',
                        name : 'storagePath.remark',    //remark暂作为首选ip地址
						editable : false,
						//ip地址列表
						store:'StorageIPListStore',
						queryMode:'local',
						displayField:'ipDisplay',
						valueField:'ipValue'
					}*/{
						fieldLabel : local.config.IPIn,
						id:'ipLan',
						regex:/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                        regexText: local.config.IPFormatError,
						name : 'storagePath.ipLan'
					},{
						fieldLabel : local.config.IPOut,
						id:'ipNet',
						allowBlank : true,
						regex:/^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
                        regexText: local.config.IPFormatError,
						name : 'storagePath.ipNet'
					}]
		}]
	}],
	buttons : [{
        text: local.btn.save,
        cls:"btn_focus",
        id:'saveStoragePathIp',
        listeners : {
			'click' : function() {
				saveStoragePathIp();
			}
		}
    },{
		text : local.btn.cancle,
		handler : function() {
			this.up('window').close();
		}}]
});

//介质重定向窗口
/*Ext.define('acesure.config.view.StorageRedirectCfg', {
	extend : 'Ext.window.Window',
	alias : 'widget.StorageRedirectCfg',
	id : 'storageRedirectCfg',
	border: false,
	title : '介质重定向设置',
	modal : true,
	resizable:false,
	constrain: true,
	layout: 'fit',
	items : [{
				fieldLabel : '存储介质',
				width : 350,
				height: 30,
				bodyPadding : 50,
				labelAlign : 'right',
				labelWidth : 60,
				name : 'storagePath',
				xtype:'combo',
				emptyText:'请选择一个存储介质',
				editable : false,
				//模拟store存放路径
				store:Ext.create('Ext.data.ArrayStore',{
						fields:['storagePath','path'],
						data:[['1','S1:[/mnt/sda/StoreBackup][300 GB]'],
						      ['2','S2:[/mnt/sda/StoreBackup][300 GB]'],
						      ['3','S3:[/mnt/sda/StoreBackup][300 GB]']]}
				),
				queryMode:'remote',
				displayField:'path',
				valueField:'storagePath',
				listeners:{
					'render':function(){
						//this.setValue('已经分配完毕!');
					}
				}}],
	buttons : [{
	            text: '设置',
	            id:'saveStorageRedirectCfg'
            },{
				text : ' 取消',
				handler : function() {
					this.up('window').close();
				}
			}]
});*/

/**
 * 系统设置-存储节点-TreePanel itemClick 点击事件
 */
function storageTreeClick(me, record, item, index, e) {
	node = record.data;//将record 赋予 全局变量node
	var isPath = record.data.leaf;
	var data = record.data;//记录数据
	var storageCfgBtn = Ext.getCmp('systemconfig_stonode_config');
	var storagePathAddBtn = Ext.getCmp('systemconfig_stonode_add');
	
	//判断是否为 叶子节点
	if(isPath){
		//设置“设置”&“新增”按钮不可用
		storageCfgBtn.setDisabled(true);
		storagePathAddBtn.setDisabled(true);
		//展示存储路径表格
		showStoragePathInfo(data);
	}else{
		//设置“设置”&“新增”按钮可用
		storageCfgBtn.setDisabled(false);
		storagePathAddBtn.setDisabled(false);
		//展示存储信息表格
		showStorageInfo(data);
	}
	
	//控制页面“设置”&“新增”按钮权限
	var storageConfigPanel = Ext.getCmp('storageConfigPanel');
	var storageConfigBar = storageConfigPanel.query('storageConfigBar')[0];
	POWER_OP.filterEnableWidgetsOfExtjs(storageConfigBar, CURRENT_USER.getSystemPower());
}

/**
 * 显示存储节点信息 Function
 */
function showStorageInfo(storage) {
	//获得属性面板
	var storageConfigInfo = Ext.getCmp('storageConfigInfo');
	//获得属性表格
	var infoGrid = storageConfigInfo.getComponent('infoGrid');
	//如果 表格为 存储器信息表格，则只修改数据源
	if(infoGrid.getXType() == 'storageInfoGrid'){
		infoGrid.setSource({
			'uniqueId' : storage.uniqueId,
			'name' : storage.name,
			'state' : storage.state,
			'licState' : storage.licState,
			'ipLan' : storage.ipLan,
			'ipNet' : storage.ipNet,
			'userCmdPort' : storage.userCmdPort,
			'maxUserNum' : storage.maxUserNum,
			'systemType' : storage.systemType, 
			'setupTime' : storage.setupTime,
			'version' : storage.version
		});
	}else{
		storageConfigInfo.remove(infoGrid);
		storageConfigInfo.add({
			itemId:'infoGrid',
			xtype:'storageInfoGrid',
			flex:1,
			width:"100%",
			overflowY:"auto",
			//设置数据源
			source : {
				'uniqueId' : storage.uniqueId,
				'name' : storage.name,
				'state' : storage.state,
				'licState' : storage.licState,
				'ipLan' : storage.ipLan,
				'ipNet' : storage.ipNet,
				'userCmdPort' : storage.userCmdPort,
				'maxUserNum' : storage.maxUserNum,
				'systemType' : storage.systemType,
				'setupTime' : storage.setupTime,
				'version' : storage.version
			}
		});
		storageConfigInfo.doLayout();
	}
}

/**
 * 显示存储路径信息 Function 
 */
function showStoragePathInfo(storagePath) {
	//获得属性面板
	var storageConfigInfo = Ext.getCmp('storageConfigInfo');
	//获得属性表格
	var infoGrid = storageConfigInfo.getComponent('infoGrid');
	//如果表格 为存储器路径表格，则只修改数据源
	if(infoGrid.getXType() == 'storagePathGrid'){
		infoGrid.setSource({
			'name' : storagePath.symbol,
			'path' : storagePath.path,
			'freeSize' : storagePath.freeSize
		});
	}else{
		storageConfigInfo.remove(infoGrid);
		storageConfigInfo.add({
			itemId:'infoGrid',
			flex:1,
			overflowY:"auto",
			width:"100%",
			xtype:'storagePathGrid',
			//设置数据源
			source: {
				'name' : storagePath.symbol,
				'path' : storagePath.path,
				'freeSize' : storagePath.freeSize
			}
		});
		storageConfigInfo.doLayout();
	}
}

/**
 * 定义系统设置-存储节点-TreePanel 右键菜单点击事件
 */
function storageTreeRightMenu(view,record,item,rowIndex,e){
			
	node = record.data;//将record 赋予 全局变量node
	e.preventDefault();//阻止浏览器默认右键菜单
	storageRightMenu.showAt(e.getXY());
	//根据用户权限过滤按钮
	POWER_OP.filterEnableMenuOfExtjs(storageRightMenu,CURRENT_USER.getSystemPower());
	
	var isPath = record.data.leaf;
	if(isPath){
	//显示存储路径右键菜单
		Ext.getCmp('sysconfig_stonode_setdefaultvms').show();
		Ext.getCmp('sysconfig_stonode_delstorage').hide();
		Ext.getCmp('sysconfig_stonode_delmedium').show();
		/*Ext.getCmp('sysconfig_stonode_setfirstip').show();*/
		/*Ext.getCmp('storagePathRedirectConfig').enable();*/
	}else{
	//显示存储节点右键菜单
		Ext.getCmp('sysconfig_stonode_setdefaultvms').hide();
		Ext.getCmp('sysconfig_stonode_delstorage').show();
		Ext.getCmp('sysconfig_stonode_delmedium').hide();
		/*Ext.getCmp('sysconfig_stonode_setfirstip').hide();*/
		/*Ext.getCmp('storagePathRedirectConfig').disable();*/
	}
	
}


/**
 * 设置默认VMS Function
 */
function setDefaultVMS(node){
	Ext.Ajax.request({
		url:'/config/tostorageConfigAction!setDefaultVMS.action',
		timeout : 10000,    //设置10秒超时
		params:{
			'storagePath.pathId' : node.pathId,
			'storagePath.storageId':node.storageId
			},
		success:function(response,options){
			var res = eval("("+response.responseText+")");
            msgCode = res.msgCode;
            msgContent = res.msgContent;
            //反馈提示
            showResultDialog(msgCode,msgContent);
            //刷新树形表格
            Ext.getCmp('storageConfigTreePanel').getStore().load(); 
			
		},
		failure:function(){
//			Ext.Msg.alert(local.window.tip,local.config.setDefaultVMSFailure);
			Ext.websure.MsgError("WF-30081",local.config.setDefaultVMSFailure);
			Ext.getCmp('storageConfigTreePanel').getStore().load(); 
		}
	});
}

/**
 * 设置首选IP Function
 */
function setStoragePathIp(node){
	var storagePathIpCfg = Ext.getCmp("storagePathIpCfg");
	if(storagePathIpCfg){
		storagePathIpCfg.destroy();
	}
	var storagePathIpCfgWin = Ext.create('acesure.config.view.StoragePathIpCfg');
	Ext.getCmp('pathId').setValue(node.pathId);
	Ext.getCmp('ipLan').setValue(node.ipLan);
	Ext.getCmp('ipNet').setValue(node.ipNet);
	storagePathIpCfgWin.show();
//	Ext.getCmp('remark').setValue(node.remark);
//	Ext.getCmp('remark').store.load({
//		params:{
//			'storage.id' : node.storageId	
//		},
//		callback: function(records, operation, success) {
//			//ip列表加载之后，展示添加窗口
//			storagePathIpCfgWin.show();
//	    }
//	});
}

/**
 * 设置首选IP “保存”按钮点击事件
 */
function saveStoragePathIp(){
	if (!Ext.getCmp('storagePathIpCfgForm').getForm().isValid()) {
		return ;
		}
	Ext.getCmp('storagePathIpCfgForm').getForm().submit({
		method : 'post',
		type : 'submit',
		url : '/config/tostorageConfigAction!updateStoragePath.action',
		success : function(form, action) {
			var res = action.result;
			msgCode = res.msgCode;
            msgContent = res.msgContent;
            
            //关闭窗口，刷新数据
            Ext.getCmp('storagePathIpCfg').close();
            Ext.getCmp('storageConfigTreePanel').getStore().load();
            //反馈提示
            showResultDialog(msgCode,msgContent);
            
		},
		failure : function(form, action) {
//			Ext.MessageBox.alert(local.window.tip, local.config.eidtMediaIPFailure,function(){
			Ext.websure.MsgError("WF-30082", local.config.eidtMediaIPFailure,function(){
				Ext.getCmp("storagePathIpCfg").close();
			});
		}
	});
}

/**
 * 删除存储器路径 Function
 */
function deleteStoragePath(node){
	var msgCode = 0;
	var msgContent = '';
	Ext.Ajax.request({
		url:'/config/tostorageConfigAction!delStoragePath.action',
		timeout : 100000,    //设置10秒超时
		params:{
			'storagePath.pathId' : node.pathId
			},
		success:function(response,options){
			var res = eval("("+response.responseText+")");
			msgCode = res.msgCode;    //消息码
			msgContent = res.msgContent;    //消息内容
			//操作反馈提示
			showResultDialog(msgCode,msgContent);
			//刷新树形表格
			Ext.getCmp('storageConfigTreePanel').getStore().load(); 
			//更新详细信息面板
			refreshInfoGrid();
		},
		failure:function(){
//			Ext.Msg.alert(local.window.tip,local.config.delMediaIPFailure);
			Ext.websure.MsgError("WF-30083",local.config.delMediaIPFailure);
			Ext.getCmp('storageConfigTreePanel').getStore().load(); 
		}
	});
}

/**
 * 删除存储节点 Function
 */
function deleteStorage(node){
	var msgCode = 0;
	var msgContent = '';
	Ext.Ajax.request({
		url:'/config/tostorageConfigAction!delStorage.action',
		timeout : 10000,    //设置10秒超时
		params:{
			'storage.id' : node.id
			},
		success:function(response,options){
			var res = eval("("+response.responseText+")");
			msgCode = res.msgCode;
			msgContent = res.msgContent;
			//操作反馈提示
            showResultDialog(msgCode,msgContent);
			 //刷新树形表格
            Ext.getCmp('storageConfigTreePanel').getStore().load(); 
            //更新存储节点数量
            setStorageNodeCount();
            //更新详细信息面板
            refreshInfoGrid();    
		},
		failure:function(){
//			Ext.Msg.alert(local.window.tip,local.config.delStorageFailure);
			Ext.websure.MsgError("WF-30084",local.config.delStorageFailure);
			Ext.getCmp('storageConfigTreePanel').getStore().load(); 
		}
	});
}

/**
 * 设置框架Toolbar 存储节点标题数量
 */
function setStorageNodeCount(){
	Ext.Ajax.request({
		url:'/config/tostorageConfigAction!getStorageCount.action',
		timeout : 10000,    //设置10秒超时
		success:function(response,options){
			var res = eval("("+response.responseText+")");
			var storageCount = res.storageCount;    //获取存储器数量（<br>'+local.config.title2+storageCount+local.config.title3+'</font>）
			Ext.getCmp('storageCountLabel').update('<font class="font_h3">'+local.config.nodeSave+'</font>');
		},
		failure:function(){
//			Ext.Msg.alert(local.window.tip,local.config.getStorageNumFailure);
			Ext.websure.MsgError("WF-30085",local.config.getStorageNumFailure);
		}
	});
}

/**
 * 更新详细信息 表格 Function
 */
function refreshInfoGrid(){
	//获得属性面板
	var storageConfigInfo = Ext.getCmp('storageConfigInfo');
	//获得属性表格
	var infoGrid = storageConfigInfo.getComponent('infoGrid');
	//清空属性表格内容
	infoGrid.setSource(null);
}



/**
 * The tree of storages contain paths, eg: used in page 'systemconfig' to backup
 * database automaticly and regularly, written by xuyingan
 */
Ext.define('acesure.config.view.StoragesTree', {
	extend : 'Ext.tree.Panel',
	alias : 'widget.storagesTree',
	id : "storagesTreeId",
	cls:"icon_radio",
	useArrows : true,
	rootVisible : false,
	frame : false,
	sortable : false,
	onlyLeafCheckable : true,
	checkModel : "double",
	store : "StoragesStore",
	loadMask : {
		msg : local.loading
	},
	listeners : {
		checkchange : function(node, checked, obj) {
			var checkedNodes = this.getChecked();
			for ( var i = 0; i < checkedNodes.length; i++) {
				var n = checkedNodes[i];
				if (node.get("id") != n.get("id")) {
					n.set("checked", false);
				}
			}
			var checks = this.getChecked();
			var path = "";
			if (checks.length>0) {
				path = checks[0].get('path');
			} 
			this.nextSibling().setValue(path);
		}
	}
});