/*
 * 应急接管主框架
 * auth:wangshaodong
 */
Ext.define('acesure.emergency.view.Emergency', {
	extend : 'Ext.panel.Panel',
	//width : '100%',
	alias : 'widget.emergency',
	border:false,
	id:"emergencyId",
	//overflowX : 'auto',
	//overflowY:'auto',
	layout:"vbox",
	bodyStyle:'background:#fff;',
	items : [
		            {
		            	xtype : 'toolBar',
		            	height:108,
		            	width:"100%",
		            	style:'background:#fafbfc'
		            }, {
		            	flex:1,
		            	width:"100%",
		            	xtype : 'tabPanel'
		            }
			]

	});
	
/**
* 应急接管头部
* auth:wangshaodong
*/
Ext.define("acesure.emergency.view.Toolbar", {
	extend : 'Ext.Toolbar',
	alias : 'widget.toolBar',
	padding:'0 25 0 25',
	border:false,
	items : [ {
				xtype : "panel",
				border : false,
				width:48,
				height:42,
				bodyStyle: 'background:#fafbfc;',
				html : '<img src="/images/emergency/server.png"/>'
			}, {
				xtype : "panel",
				id:'vm_online_id',
				border : false,
				width:250,
				bodyStyle: 'background:#fafbfc;',
				html : "<font class='font_h3'>"+local.emergency.title+"</font><br>"+local.emergency.virtualZero,
				listeners:{
					afterrender : function(me, opts) {
							Ext.Ajax.request({
								method : 'post',
								url : emergencyMapDate.EmergencyMapURL('tovmManager','findVmManagerOnline'),
								async:true,
								timeout: 10000,//10秒
								success : function(response, options) {
									var obj=Ext.decode(response.responseText);
									me.update("<font class='font_h3'>"+local.emergency.title+"</font><br>"+local.log.title1+obj.detail+local.emergency.virtual)	;
								},
								failure : function() {
									me.update("<font class='font_h3'>"+local.emergency.title+"</font><br>"+local.emergency.virtualZero)	;
								}
							});
					}
				}
			},
			"->", 
			{
				xtype : "button",
				text : local.btn.refresh,
				id:"computeNodeRefreshId",
				style:'padding-left:26px;',
				icon : '/images/common/refresh.png',
				handler : function() {
					Ext.getCmp("virtualNodeGridPanelId").getStore().load();
				}
			}]
});
	
/**
* 应急接管主面板
* auth:wangshaodong
*/
Ext.define('acesure.emergency.view.TabPanel', {
	extend : 'Ext.tab.Panel',
	alias : 'widget.tabPanel',
	activeTab : 0,
	id: "tabPanel",
	cls:'tab_big',
	plain:true,
	style:'background:#fafbfc',
	bodyStyle:'border:0;border-top:1px solid #d1dade;',
	defaults:{border:false},
	store:"EmergencyInitializeStore",
	plugins: [{
        ptype: 'tabscrollermenu',
        maxText  : 15,
        pageSize : 5
    }],
	items : [ 
	],
	listeners:{
		afterrender : function() {
			initializeEmergencyPanel();
		},
		tabchange:function( tabPanel, newCard, oldCard, eOpts ){
			var id=newCard.id;
			if(id=="virtualFirstId"){
				//显示工具栏刷新按钮
				var refreshPanel=Ext.getCmp("computeNodeRefreshId");
				refreshPanel.show();
				Ext.getCmp("virtualNodeGridPanelId").getStore().load();
			}
		}
		
	}
});


/**
 * 虚拟机模块容器
 */
Ext.define("acesure.emergency.view.ImportVMmodelWindow", {
	extend : 'Ext.window.Window',
    title: local.emergency.importvMachine, 
    draggable: false,
    height: 600,		
    width: 800,
    id:'ImportVMmodelWindow',
    layout: "border",
    modal: true, 
    resizable: false,
    items : [{
		 				xtype : 'panel',
		 				region : 'center',
		 				border:false,							
		 				items : [{
		 					           
		 						   }]
		 			 }],
 	 buttons : [{
					 	 text : local.btn.save,
					 	 handler : function() {
			             }
 	                 },{
				 		  text : local.btn.cancle,
				 		  handler : function() {
 				                  this.up('window').close();
 			              }
 	                 }]	
	
});

/**
 *计算节点不在线,未授权展示页
 */
Ext.define('acesure.emergency.view.CalNodeOffLine', {
            extend : 'Ext.panel.Panel',
            id : 'calNodeOffLine',
            alias : 'widget.calNodeOffLine',
            border: false,
            width : '100%',
            height : 650,
            bodyStyle:"height:100%",
            style:'text-align:center;margin-top:80px;',
            html:"<span class='offlineClsText'>"+local.emergency.computeOnline+"</span>"
});

/**
 * 
 * dynamicAddFirstVirPanel:页面初次加载，动态加载虚拟机列表信息
 * @data 2016-9-27
 * @auth WangShaoDong
 */
var dynamicAddFirstVirPanel=function(){
	//增加虚拟机一览页面
	var virPanel=Ext.getCmp(this.id);
	virPanel.removeAll();
	virPanel.add({
		xtype:"VirtualMachView",
		itemId:"virtualMachViewItemId"
	});
};

/**
 * 
 * fadeout:返回到存储恢复页面
 * @data 2016-4-22
 * @auth WangShaoDong
 */
function fadeout() {
	var contentPanel = Ext.getCmp('contentPanel');
		contentPanel.removeAll();
		contentPanel.add({
			xtype : 'emergency',
			itemId : 'emergencyPanel'
		});
		contentPanel.doLayout();
} 
