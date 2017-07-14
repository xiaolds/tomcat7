/**
 * author:yangbobin date:2015-10-28
 */
//恢复存储-全部挂载Tab页
Ext.define('acesure.recovery.view.RecoveryList', {
	extend : 'Ext.panel.Panel',
	border : false,
	//padding:20,
	alias : 'widget.recoveryList',
	//autoScroll : false,
	layout:"vbox",
	overflowY:"auto",
	items : [{
		xtype : 'label',
		height:55,
		padding:"20 20 10 20",
		html : "<font class='font_t'>"+local.recovery.mountInformation+"</font>",
		width : '100%'
	}, {
		itemId : 'mountList',
		flex:1,
		width:"100%",
		minHeight:150,
		margin:"0 20 0 20",
		xtype : 'mountList'// 存储列表
	}, {
		xtype : 'label',
		height:55,
		html : "<font class='font_t'>"+local.recovery.titleInfo+"</font>",
		width : '100%',
		padding:"20 20 10 20"
	},{
		xtype : "logInfoTabPanel",
		//padding:"10 0 0 0",
		id:"bottomId"
	} ]

});


Ext.define("acesure.recovery.view.StorageInfoTabPanel",{
	extend:"Ext.tab.Panel",
	alias:"widget.storageInfoTabPanel",
	activeTab : 0,
	defaults:{border:false},
	plain:true,
	cls:'tab_s',
	width:"100%",
	//height:300,
	margin:"0 20 20 20",
	height:340,
	bodyStyle:"border-color:#d1dade",
	items:[{
		title:"挂载信息",
		xtype:"bottomInfo",
		itemId:"bottomInfoItemId"
	},
	{
		title:"日志信息",
		xtype:"recoveryLogGrid"
	}]
});


Ext.define("acesure.recovery.view.LogInfoTabPanel",{
	extend:"Ext.tab.Panel",
	alias:"widget.logInfoTabPanel",
	activeTab : 0,
	plain:true,
	cls:'tab_s',
	margin:"0 20 20 20",
	width:"100%",
	height:340,
	bodyStyle:'border:1px solid #d1dade;',
	defaults:{border:false},
	items:[
	       {
	    	   title:local.recovery.blogInfo,
	    	   xtype:"recoveryLogGrid"
	       }]
});



Ext.define('acesure.recovery.view.BottomInfo', {
	extend : 'Ext.panel.Panel',
	// height : 720,
	//width : '100%',
	border : false,
	alias : 'widget.bottomInfo',
	height:"100%",
	//autoScroll : false,
	overflowY:"auto",
	items : [ /*{
				height:70,
				itemId : 'mountToolbar',
				xtype : 'mountToolbar'//挂载点Toolbar
			}, */{
				height:"100%",
				itemId : 'mountInfo',
				xtype : 'mountInfo'// 挂载点信息
			} ]
});

//挂载点Toolbar
Ext.define('acesure.recovery.view.MountToolbar', {
	extend : 'Ext.Toolbar',
	alias : 'widget.mountToolbar',
	padding:'0 25 0 25',
	style:'border:0;border-top:1px solid #d1dade;background:#fcfdfd',
	items : [ {
		xtype : "panel",
		border : false,
		width : 32,
		height : 32,
		html : '<img src="/images/recovery/mount32.png"/>'
	}, {
		itemId : 'mountName',
		xtype : "panel",
		minWidth : 200,
		border : false,
		cls:'font_h4',
		html : 'Mount0'//默认为空
	}]
});
//挂载信息
Ext.define('acesure.recovery.view.MountInfo', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.mountInfo',
	id : 'mountInfo',
	width : '100%',
	height : '100%',
	layout : 'column',
	border : false,
	bodyBorder:false,
	items : [ {
		columnWidth : 0.5,
		nameColumnWidth:130,
		border:false,
		xtype : 'propertygrid',
		bodyBorder:false,
		itemId : 'nameAndDevice',
		hideHeaders : true,
		sortableColumns : false,
		source : {
			'mountName' : '',
			'mountDevice' : '',
			'mountDeviceIP':'',
			'mountCreateTime':'',
			'mountPower':'',
			'partLabel' : '',
			'state' : '1' 



		},
		sourceConfig : {
			mountName : {
				displayName : local.recovery.mountName
			},
			mountDevice : {
				displayName : local.recovery.targetDeviceName
			},
			mountDeviceIP : {
				displayName :local.recovery.targetDeviceIP
			},
			mountCreateTime : {
				displayName : local.recovery.mountTime
			},
			mountPower : {
				displayName : local.recovery.mountPower,
				renderer : function(v){
					if(v == '1'){
						return local.powerRead;
					}else{
						return local.powerReadWrite;
					}
				}
			},partLabel : {
				displayName :local.recovery.mountDriveDirectory
			},
			state : {
				displayName : local.recovery.mountState,
				renderer : function(v){
					if(v == '1'||v == '2'||v == '3'||v == '4'||v == '6'||v == '8'){
						return local.recovery.mountStateNot;
					}else if(v == '7'||v == '5'){
						return local.recovery.mountStateYes;
					}else{
						return local.recovery.mountStateFailure;
					}
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
	}, {
		columnWidth : 0.5,
		nameColumnWidth:130,
		border:false,
		bodyBorder:false,
		xtype : 'propertygrid',
		itemId : 'labelAndState',
		hideHeaders : true,
		sortableColumns : false,
		source : {
			'vmimgPath':'',
			'sourceDeviceName':'',
			'sourceDeviceIp':'',
			'sourceLabel':'',
			'storageName':'',
			'harddiskName':'',
			'storage':''
		},
		sourceConfig : {
			vmimgPath : {
				displayName : local.snapInfo,
				renderer : function(v){
					return '<div title="' + v + '">' + v+ '</dv>';
				}
			},
			
			sourceDeviceName : {
				displayName : local.recovery.gridName
			},
			sourceDeviceIp : {
				displayName : local.emergency.gridIP
			},
			harddiskName : {
				displayName : local.recovery.sourceDrive
			},
			sourceLabel : {
				displayName : local.recovery.sourcePartition
			},
			storageName : {
				displayName : local.recovery.storageMedium,
				renderer : function(v){
					return '<div title="' + v + '" >' + v+ '</div>';
				}
			},
			storage : {
				displayName : local.recovery.nodeSave,
				renderer : function(v){
					return v;
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
	} ]
});
Ext.define('acesure.view.recovery.', {
	extend : 'Ext.grid.Panel',
	alias :'widget.recoveryLogGrid',
	id: 'recoveryLogGridId',
	height:"100%",
	//margin:'10 0 0 0',
	store:"RecoveryLogStore",
	enableColumnResize:false,
	columns : [ 
	           { header: local.num, menuDisabled:true,dataIndex: 'storageLogId' , width:80},
	           { header: local.eventId,menuDisabled:true,dataIndex: 'storageEventId' , width:90},
	           { header: local.gridLevel,menuDisabled:true,dataIndex: 'storageLogLevel', width:100, 
	        	   renderer:function(v) {
	        		   if(v == 1){
	        			   return "<img src='/images/log/normal.gif' align='absmiddle' />&nbsp;"+local.normal;
	        		   }else if(v == 2){
	        			   return "<img src='/images/log/error.gif' align='absmiddle' />&nbsp;"+local.defaulty;
	        		   }else if(v == 3){
	        			   return "<img src='/images/log/warning.gif' align='absmiddle' />&nbsp;"+local.warn;
	        		   }
	        	   }
	           },
	           { header: local.gridSource, tdCls:"font_color_999",menuDisabled:true,dataIndex: 'storageLogIp' , flex : 1 ,
	        	   renderer: function(value,metaData,record,colIndex,store,view) {  
	        		   //metaData.tdAttr = 'data-qtip="' + value + '"';  
	        		   return '<div title="' + value + '">' + value + '</div>';
	        	   } 
	           },
	           { header: local.time, tdCls:"font_color_999",menuDisabled:true,dataIndex: 'storageLogInsertTime' , flex : 1 },
	           { header: local.content, tdCls:"font_color_999",menuDisabled:true,dataIndex: 'storageLogContent' , flex: 2,
	        	   renderer: function(value,metaData,record,colIndex,store,view) {  
	        		   //metaData.tdAttr = 'data-qtip="' + value + '"';  
	        		   return '<div title="' + value + '">' + value + '</div>';
	        	   } 
	           }
	           ],
	           listeners : {
	        	   afterrender : function(){
	        		   Ext.getCmp("recoveryLogGridId").store.load();
	        	   }
	           },
	           dockedItems: [{
	        	   id: 'recoveryLogPage',
	        	   xtype: 'pagingtoolbar',
	        	   store: 'RecoveryLogStore',
	        	   dock: 'bottom', //分页 位置
	        	   emptyMsg: local.toobarEmptyMsg,
	        	   displayInfo: true,
	        	   displayMsg: local.toolbarDisplayMsg,
	        	   beforePageText: local.toolbarBeforePageText,
	        	   afterPageText:local.toolbarAfterPageText

	           }]
});