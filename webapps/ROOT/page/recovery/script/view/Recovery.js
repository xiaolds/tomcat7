/**
 * author:yangbobin date:2015-11-06
 */
var activeStorage = null;    //记录当前激活的存储节点
/**
 * 定义恢复存储主框架
 */
Ext.define('acesure.recovery.view.Recovery', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.recovery',
	bodyStyle:'background:#fff;',
	overflowY:'auto',
	layout:"vbox",
	border:false,
	items : [ {
		width:'100%',
		height:108,
		style:'background:#fafbfc;',
		xtype : 'mainToolBar'
	}, {
		width:'100%',
		flex:1,
		xtype : 'mainTabPanel'
	} ]
});

/**
 * 定义恢复存储主框架 - toolBar
 */
Ext.define('acesure.recovery.view.MainToolBar', {
	extend : 'Ext.Toolbar',
	alias : 'widget.mainToolBar',
	padding:'0 25 0 25',
	border:false,
	defaults:{bodyStyle:'background:#fafbfc'},
	items : [ {
		xtype : "panel",
		border : false,
		width:48,
		height:42,
		html : '<img src="/images/recovery/recover.png"/>'
	}, {
		xtype : "panel",
		itemId : 'recoverLabel',
		id:"allMountInfoid",
		border : false,
		html : "<font class='font_h3'>"+local.recovery.title+"</font><br>"/*,
		listeners:{
			afterrender:findMountCount
		}*/
	}, "->", {
		xtype : 'button',
		text : local.btn.refresh,
		id: 'refreshBtn',
		style:'padding-left:26px;',
		icon : '/images/common/refresh.png',
		handler : function() { 
			var mountList=Ext.getCmp("mountListId");
			var mountListStore=mountList.getStore();
			mountListStore.load({
				callback:function(records, operation, success){
					POWER_OP.filterEnableDomsInGridpanelColumnOfExtjs(mountList,CURRENT_USER.getRecoveryPower());
				}
			});
		}
	}, {
		xtype : 'button',
		text : local.btn.creatDisk,
		itemId : 'recovery_stonode_addcustomdisk',
		style:'padding-left:26px;',
		icon : '/images/common/new_16.png',
		handler : function() {
			Ext.Ajax.request({
                     url:'/recovery/recoveryAction!findStorageAuth.action',
                       success: function(resp,opts) {
                           var stoAuth=JSON.parse(resp.responseText);  //解析系统授权信息
                           if(stoAuth.createEmptyDisk){
                           	    var createNewVming=Ext.create("acesure.recovery.view.CreateNewVming");
                                createNewVming.show();
                           }else{
                                Ext.websure.MsgError(local.unAuth,local.btn.creatDisk+local.recovery.noAuthPleApplyAuth);
                           }
                       },    
                       failure: function(resp,opts) {
                           Ext.websure.MsgError("WF-30124",local.recovery.getStorageAuthFailure);
                       }
                });  
		}
	}],
	listeners:{
		render : function(v,eOpts){
			//控制页面按钮权限
            POWER_OP.filterEnableWidgetsOfExtjs(v, CURRENT_USER.getRecoveryPower());
		}
	}
	
});

/**
 * 定义恢复存储主框架tabPanel
 */
Ext.define('acesure.recovery.view.MainTabPanel', {
	extend : 'Ext.tab.Panel',
	alias : 'widget.mainTabPanel',
	id : 'storageTabPanel',
	enableTabScroll : true,
	activeTab : 0,
	plain:true,
	border:false,
	style:'background:#fafbfc',
	bodyStyle:'border:0;border-top:1px solid #d1dade;',
	defaults:{border:false},
	cls:'tab_big',
	items : [ {
		title :local.recovery.mountList,
		itemId:'recoveryList',
		xtype : 'recoveryList',
		listeners: { 
			activate: activateRecoveryList
			}
	} ],
	plugins: [{
        ptype: 'tabscrollermenu',
        maxText  : 15,
        pageSize : 5
    }],
	// 监听tab 页变化
	listeners : {
		afterrender : function() {
			loadStorage();// 加载存储节点
		}
	}
});

/**
 * 加载存储节点 Function
 */
function loadStorage() {
	var tabPanel = Ext.getCmp('storageTabPanel');// 获取主tab组件
	var store = Ext.create('acesure.recovery.store.StorageListStore');
	store.load({
		//当store 加载完毕
		callback: function(){
			for (i = 0; i < store.getCount(); i++) {
				var storageNode = store.getAt(i);
				var id = storageNode.get('id');
				var name = storageNode.get('name');
				var state = storageNode.get('state');
				var licState = storageNode.get('licState');
				var iconCls = "";
				
				//授权状态/存储器在线离线状态图标控制
				if(licState==1){
					iconCls = "unauthorized";    //未授权样式
				}else{
					if(state==1){
                        iconCls = "onLine";    //在线
                    }else{
                        iconCls = "offLine";    //离线或异常
                    }
				}
				
				var items = {
					id : id,
					title : name,
					state : state,    //1:在线2：离线
					licState : licState,
					iconCls : iconCls,
					overflowY:"auto",
					layout:"fit",
					listeners : { activate: activateStorageNode }
				};
				tabPanel.add(items);
			}
			tabPanel.doLayout();
		}
	});
}

/**
 * 激活“全部” tabPanel Function
 */
function activateRecoveryList(){
	//显示刷新按钮
	var refreshBtn = Ext.getCmp('refreshBtn');
    refreshBtn.show();
}