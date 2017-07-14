/**
* 应急接管页面，计算节点页面，工具
* auth:wangshaodong
*/
Ext.define("acesure.emergency.view.countToolBar", {
	extend : 'Ext.Toolbar',
	alias : 'widget.countToolBar',
	id : 'countToolBar',
	height:70,
	padding:'0 25 0 25',
	style:'background:#fafbfc;border:0;border-bottom:1px solid #eef2f4;',
	items : [ 
			{
				xtype : "panel",
				border : false,
				width:32,
				height:32,
				bodyStyle:"background:none",
				html : '<img src="/images/recovery/node_count.png"/>'
			}, {
				xtype : "panel",
				border : false,
				itemId : 'nodeTitle',
				cls:'font_h4',
				bodyStyle:"background:none",
				html : '<font class="font_h4">'+'...'+'</font>'
			}, {
                itemId : 'timeZone',
                xtype : "panel",
                border : false,
                flex:1,
                bodyStyle:"text-align:center;background:none",
                html : ''    //默认为空
            }, {
                xtype: 'combobox',
                width: 160,
                labelWidth: 40,
                fieldLabel: local.log.gridTime, 
                lableAlign: 'right',
                store : [[1,local.recovery.lastOne],[6,local.recovery.lastSix ],[12,local.recovery.in12Hours]],
                valueField : 'type',
                editable : false,
                displayField : 'name',
        		id: 'c',
                emptyText:local.log.chTime,
                listeners:{
                    'select' : function(){
                        loadCalRunData(this.value);
                    }
                }
            }
			]
});


/**
* 应急接管-计算节点-工具栏
*/
Ext.define("acesure.emergency.view.ComputeNodeToolBar", {
	extend : 'Ext.Toolbar',
	alias : 'widget.computeNodeToolBar',
	width:"100%",
	height:60,
	padding:'0 25 0 25',
	border : false,
	items : [ 
			{
				xtype : "panel",
				border : false,
				bodyBorder:false,
				bodyStyle:"border:none",
				id:'compute_node_name',
				minWidth:360,
				height:24,
				html : ""
			}, {
				xtype : "panel",
				id:'compute_node_capa',
				border : false,
				bodyStyle:"border:none",
				bodyBorder:false,
				width:300,
				height:24,
				html : ""
			}
			/*,"->", 
			{
				xtype : "button",
				text : local.emergency.computePanel,
				border:false,
				icon : '/images/common/run.png',
				cls:'ie8 btn_node_active',				
				style:'padding-left:26px;background:none',
				action : 'findRunVmList'
			}*//*, {
				xtype : "button",
				text : local.emergency.calnodeVirtual,
				border:false,
				icon : '/images/common/run.png',
				cls:'ie8',				
				style:'padding-left:26px;background:none',
				icon : '/images/common/list.png',
				action :'findVmList'
			}*/ ]
});

 /**
  * 定义图表主题
  * auth:wangshaodong
  */
var colors=['#00aaaa','#00aaaa','#00aaaa','#00aaaa'];
Ext.define('Ext.chart.theme.charTheme',{
	extend:'Ext.chart.theme.Base',
	constructor:function(config){
		this.callParent([Ext.apply({colors:colors},config)]);
	}
});
/**
 * 定义图表
 * auth:wangshaodong
 */
Ext.define('acesure.emergency.view.EmergencyTakeOverChart', {
	       extend : 'Ext.chart.Chart',
		   alias : 'widget.emergencyTakeOverChart',
		   store : 'CalNodeRunStateStore',
		 	//动画
	       animate: true,
	       //阴影
	       shadow: false,
	       theme:"charTheme",
	       axes: [{
	           type: 'Numeric',
	           position: 'left',
	           fields: ['rate'],
	           title: false,
	           minimum : 0,    //最小值
               maximum : 100,    //最大值
	           grid: true,
	           label:{
                   renderer:function(val){
                   	    if(val%20==0){
                            return val;
                   	    }else{
                   	    	return '';
                   	    }
                   }
               }
	       }, {
	    	   type:'Category',
	           position: 'bottom',
	           fields: ['showDate'],
	           title: false,
	           grid: false,
	           dashSize: 1,    //控制刻度的长度
	           label:{
                   renderer:function(val){
                    	return val;
                   }
               }
	       }],
	       series: [{
	           type: 'line',
	           axis: 'left',
	           gutter: 80,
	           showMarkers:false,    //隐藏点标记
	           theme:'Green',
	           xField: 'chartDate',
	           yField: ['rate'],
	           //线的样式
	           style:{'stroke-width':1},
	           //点的样式
	           marketConfig:{radius:5},
               tips: {
                    trackMouse: true,
                    width: 100,
                    height: 60,
                    style:'word-wrap:break-word;word-break:break-all;text-align:center;',
                    renderer: function(storeItem, item) {
                    	
                    	showMonitorTip(this,storeItem);
                    }
                }
	           
	       }]
	   });
/**
 * 定义图表布局
 * auth:wangshaodong
 */
Ext.define('acesure.emergency.view.CalNodeTabPanel', {
	extend:"Ext.Panel",
	alias:"widget.calNodeTabPanel",
    width: "100%",
    border:false,
    layout: 'column',
    cls:'chart_t',
    bodyStyle:"padding:20px;"
	});	

//记录当前激活的监控类型
var calMonitorType = null;
/**
 * 计算节点运行状态监控表
 * auth:yangbobin
 */
Ext.define('acesure.emergency.view.CalNodeMonitor', {
    extend : 'Ext.tab.Panel',
    id:'calNodeMonitor',
    alias : 'widget.calNodeMonitor',
    cls : 'verticaltab',
    bodyStyle:'border:0;border-left:1px solid #eef2f4;border-right:1px solid #eef2f4;padding:10px;padding-left:0;',
    // 添加tabbar,修改 背景的宽度
    tabBar : {
        width : 115,
        minTabWidth : 95,
        maxTabWidth : 95,
        height : 80,
        orientation : 'top'    // vertical
    },
    tabPosition : 'left',    // 竖形排列
    height : 150,
    enableTabScroll : true,
    activeTab : 0,
    items:[{
                title : 'CPU',
                width : '100%',
                itemId : 'cpuChart',
                items:{
                    xtype : 'emergencyTakeOverChart'       
                },
                layout: 'fit',
                listeners: { activate: function(){
                    activeChart(this,CPU_MONITOR);
                    }
                }
            },{
                title : local.memory,
                width : '100%',
                itemId : 'memoryChart',
                layout: 'fit',
                listeners: { activate: function(){
                    activeChart(this,MEMORY_MONITOR);
                    }
                }
            },{
                title :local.web,
                width : '100%',
                itemId : 'netChart',
                layout: 'fit',
                listeners: { activate: function(){
                    activeChart(this,NET_MONITOR);
                    }
                }
            }]
    }); 
    
/**
 * 各个分类计算节点虚拟机列表
 * auth:wangshaodong
 */
/*Ext.define("acesure.emergency.view.CalNodeGridPanel",{
	extend : 'Ext.grid.Panel',
	alias:"widget.calNodeGridPanel",
	store: "VirtualMachNodeStore",
    width:'100%',
    height:400,
    border:false,
    frame:false,
    enableColumnMove:false,
    trackMouseOver:false,
	style:"border-top:1px solid #d1dade",
	layout:'fit',
	viewConfig: {  
        forceFit: true 		
    },
    columns:[{
	        		header: local.emergency.gridServerName,
	        		dataIndex: 'vmName',
	        		flex:1,
	        		menuDisabled:true,
	        		sortable: false,
	        		renderer : function(value, cellmeta, record, rowIndex, columnIndex, store) {
	        			var onLineFlg=record.data["vmState"];
	        			
	        			if(onLineFlg==1){ //在线
	        				return "<img src='/images/emergency/server_16on.png' />&nbsp&nbsp<span style='font-weight:bold;'>"+value+"</span>";
	        			}else{  //不在线
	        				return "<img src='/images/emergency/server_16.png' />&nbsp&nbsp<span style='font-weight:bold;'>"+value+"</span>";
	        			}
	        		}
	        	},
	        	{
	        		header: local.emergency.gridIP,
	        		dataIndex: 'deviceIp',
	        		flex:1,
	        		menuDisabled:true,
	        		sortable: false 
	        	},{	
	        		header: local.emergency.gridName, 
	        		dataIndex: 'deviceName', 
	        		tdCls:"font_color_999",
	        		flex:1,
	        		menuDisabled:true,
	        		sortable: true
	        	},{
                 header:local.emergency.emergencyType,
                 dataIndex: 'vmType', 
                 tdCls:"font_color_999",
                 flex:0.5,
                 menuDisabled:true,
                 sortable: true,
                 renderer : function(value, cellmeta, record, rowIndex, columnIndex, store) {
                     return emergencyMapDate.VM_TYPE[value][1];
                 }
                },{
	        		header: local.emergency.gridNode,
	        		dataIndex: 'nodeName', 
	        		tdCls:"font_color_999",
	        		flex:1,
	        		menuDisabled:true,
	        		sortable: true
	        	},{
	        		header: local.emergency.gridState,
	        		dataIndex: 'vmState', 
	        		flex:1,
	        		renderer : function(v, p, r) {
	        			if(v==1){
	        				return "<img src='/images/common/green.png' /><span style='font-weight:bold;color:#2db200'>"+local.starting+"</span>";
	        			}else if(v==2){
	        				return "<img src='/images/common/gray.png' /><span style='font-weight:bold;color:#ccc'>"+local.unstart+"</span>";
	        			}else{
	        				return "<img src='/images/common/orange.png' /><span style='font-weight:bold;color:#ffab5e'>"+local.unconfig+"</span>";
	        			}
	        		},
	        		menuDisabled:true,
	        		sortable: true
	        	},{  
                    header: local.emergency.gridHander,  
                    xtype : 'actioncolumn',
                    flex:1.5,
                    align : 'center',
                    //id : 'virtualNodeGridAction',
                    items: [{  
                        action: 'start', 
                        itemId:'emergency_calnode_statrvm',
                        getClass: function(v, metaData, record) {          // Or return a class from a function
                            if(record.get("vmState")==2){
                                this.items[0].tooltip = local.btn.start;
                                return 'startYes';
                            }else{
                                this.items[0].tooltip = '';
                                return 'startNo';
                            }

                        },
                        handler: function (grid, rowIndex, colIndex, node, e, record, rowEl) { 
                            if(record.get("vmState")==2){
                                this.fireEvent('itemclick', this, grid, rowIndex, colIndex, node, e, record, rowEl); 
                            }
                        }  
                    },{ icon: '', tooltip: ''},
                    {  
                        action: 'stop', 
                        itemId:'emergency_calnode_stopvm',
                        getClass: function(v, metaData, record) {          // Or return a class from a function
                            if(record.get("vmState")==1){
                                this.items[2].tooltip = local.btn.stop;
                                return 'stopYes';
                            }else{
                                return 'stopNo';
                            }
                        },
                        handler: function (grid, rowIndex, colIndex, node, e, record, rowEl) {     
                            if(record.get("vmState")==1){
                                this.fireEvent('itemclick', this, grid, rowIndex, colIndex, node, e, record, rowEl);  
                            }
                        }
                    },{ icon: '', tooltip: ''},
                    {  
                        action: 'delete',
                        itemId:'emergency_calnode_delvm',
                        getClass: function(v, metaData, record) {          // Or return a class from a function
                            if(record.get("vmState")==2||record.get("vmState")==0){
                                this.items[4].tooltip =local.btn.delete0;
                                return 'deleteYes';
                            }else{
                                return 'deleteNo';
                            }
                        },
                        handler: function (grid, rowIndex, colIndex, node, e, record, rowEl) {
                            if(record.get("vmState")==2||record.get("vmState")==0){
                                this.fireEvent('itemclick', this, grid, rowIndex, colIndex, node, e, record, rowEl);  
                            }
                        }   
                    }]
                }
	        	]
});*/


/**
 * 计算节点运行状态
 * auth:wangshaodong
 */
Ext.define("acesure.emergency.view.CalNodeRunPanel",{
	extend:"Ext.Panel",
	alias:"widget.calNodeRunPanel",
	width:"100%",
	height:339,
	border:false,
	html:"<div class='line_wrap'>"+
				   "<div class='propery'>"+
				     "<h4>"+local.emergency.gridAbility+"</h4>"+
				     "<ul></ul>"+
			       "</div>"+
			      "<div class='web'>"+
			      "<h4>"+local.web+"</h4>"+
				      "<ul></ul>"+
				    "</div>"+
				    "<div id='line_div'></div>"+
			 "</div>"
});


/**
 * 计算节点图表
 * auth:wangshaodong
 */
Ext.define("acesure.emergency.view.calNodeSouthPanel",{
	extend:"Ext.Panel",
	alias:"widget.calNodeSouthPanel",
	width:"100%",
	border:false,
	style:'border-top:1px solid #d1dade;border-bottom:1px solid #d1dade;',
	items:[
		       {xtype:"countToolBar",height:70},
		       {xtype:"calNodeMonitor",height:200}
	       ]
});

/**
 * 计算节点面板
 * auth:wangshaodong
 */ 
Ext.define("acesure.emergency.view.CalNodeView",{
	extend:"Ext.Panel",
	id:'calNodeView',
	alias:"widget.calNodeView",
	width:"100%",
	height:"100%",
	border:false,
	overflowY:"auto",
	layout:"vbox",
	items:[
	        {xtype : "computeNodeToolBar"},
			{xtype : "calNodeRunPanel"},
			{xtype : "calNodeSouthPanel"}
		]
});


	