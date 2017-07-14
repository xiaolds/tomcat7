//定义图表主题
var colors=['#34bbbb','#fe8e1c','#3a9dff'];
Ext.define('Ext.chart.theme.sysCharTheme',{
	extend:'Ext.chart.theme.Base',
	constructor:function(config){
		this.callParent([Ext.apply({colors:colors},config)]);
	}	
});

var logType = "";

Ext.define('acesure.view.report.SystemReportList', {
	extend: 'Ext.panel.Panel',
	width: '100%',
	border: false,
	alias: 'widget.systemReportList',
	id: 'systemReportListId',
	//bodyStyle:'overflow-y:auto;',
	layout:"vbox",
	items: [{
		width:"100%",
		height:108,
		xtype: 'reportHeadToolBar'
	},{
		width:"100%",
		xtype: 'reportCenterComboBox'
	},{
		flex:1,
		overflowY:"auto",
		xtype: 'systemReportTreePanel'
	}],
	listeners:{
		render:function(v, eOpts){
			POWER_OP.filterEnableWidgetsOfExtjs(v, CURRENT_USER.getReportlogPower());
		}
	}
	
});

Ext.define('acesure.view.report.SystemReportTreePanel', {
	extend: 'Ext.panel.Panel',
	width: '100%',
	border: false,
	alias: 'widget.systemReportTreePanel',
	id: 'systemReportTreePanelId',
	bodyStyle:'overflow-y:auto;',
	items: [{
		xtype: 'systemReportCharTree'
	}]
	
});

Ext.define("acesure.view.report.ReportHeadToolBar", {
	extend : 'Ext.Toolbar',
	alias : 'widget.reportHeadToolBar',
	padding:'0 0 0 25',
	style:' border:0;background:#fafbfc;border-bottom:1px solid #d1dade',
	defaults:{bodyStyle:'background:#fafbfc'},
	loadMask: true,
	items : [{
		 		xtype : "panel",
		 		border : false,
		 		width:48,
		 		height:42,
		 		html : '<img src="/images/log/report_system_title.png"/>'
	         }, {
		 		xtype : "panel",
		 		border : false,
		 		minWidth:300,
		 		id : 'systemLogHeadId',
		 		html : "<font class='font_h3'>"+local.log.rerReport+"</font><br>"+local.log.title2+" "+local.log.title3+" "+local.log.title4
	         },"->",{
				xtype : "button",
				text : local.btn.refresh, 
				style:'padding-left:26px',
				icon : '/images/common/refresh.png',
				handler : function() {
        		 	var reportLogPanel = Ext.getCmp('reportLogPanel');
        		 	reportLogPanel.removeAll();
		  			reportLogPanel.add({
		  				xtype : 'systemReportList'
		  			});
				}
			}, {
				xtype: 'combobox',
		        width: 160,
		        labelWidth: 40,
		        fieldLabel:local.time , 
		        lableAlign: 'right',
				store : [[1,local.log.oneMonth],[2,local.log.threeMonth],[3,local.log.sixMonth],[4,local.log.oneYear],[5,local.recovery.tabAll]],
				valueField : 'type',
				editable : false,
				displayField : 'name',
				id: 'exportTimeId',
				emptyText:local.log.chTime,
				value : 1
			}, {
				xtype : "button",
				text : local.btn.export0, 
				style:'padding-left:26px',
				icon : '/images/log/export.png',
				id : 'systemTimeExportId',
				itemId : 'reportlog_report_performexport',
				handler: function(){
					Ext.getCmp('exportTimeId').setVisible(true);
					Ext.getCmp('systemTimeExportId').setVisible(false);
					Ext.getCmp('systemReprotExportId').setVisible(true);
				}
			}, {
				xtype : "button",
				text : local.btn.export0, 
				style:'padding-left:26px',
				icon : '/images/log/export.png',
				id : 'systemReprotExportId'
			}, {
				xtype : "panel",
				id : 'systemReprotShrink',
				border:false,
				width:56,
				margin:0,
				height:"100%",
				html: "<div class='shrink' onclick='fadeout();'><img src='/images/backup/shrink.png'/></div>"
			}],
			listeners:{
		    	afterrender:function(){
		    		Ext.getCmp('exportTimeId').setVisible(false);
		    		Ext.getCmp('systemReprotExportId').setVisible(false);
		    		Ext.Ajax.request({
		    			url: '/syslog/toSystemReport!findSystemLogTopStatus.action',
						success : function(response, options) {
							var obj = Ext.decode(response.responseText);
							if(typeof(obj.details) != "undefined"){
								Ext.getCmp("systemLogHeadId").update("<font class='font_h3'>"+local.log.rerReport+"</font><br>"+
										local.log.title2+obj.details.day+local.log.title3+obj.details.reportError+local.log.title4);
							}
						}
		    		})
		    	}
			}
});

//返回事件
function fadeout() {
	var reportLogPanel = Ext.getCmp('reportLogPanel');
	reportLogPanel.removeAll();
	reportLogPanel.add({
		xtype : 'logView'
	});
	reportLogPanel.doLayout();
}

Ext.define("acesure.view.report.ReportCenterComboBox", {
	extend : 'Ext.Toolbar',
	alias : 'widget.reportCenterComboBox',
	id : 'reportCenterComboBox',
	height: 50,
	padding:'16 25 0 25',
	border: false,
	items : [{
			xtype: 'combobox',
	        width: 180,
	        labelWidth: 40,
	        fieldLabel: local.btn.show, 
	        lableAlign: 'right',
			store : [['1',local.showByDevName],['2',local.showByIPName],['3',local.showByDevDescribleName]],
			valueField : 'type',
			editable : false,
			displayField : 'name',
			id: 'systemViewId',
			emptyText: local.log.disType,
			listeners:{
				select:function(value,record){
					logType = value.value;
					var systemTimeId = Ext.getCmp("systemTimeId").value;
		    		var beginDate = Ext.getCmp("beginDateId").value;
		    		var endDate = Ext.getCmp("endDateId").value;
		    		
		    		//如果为自定义时间查询,判断时间段是否正确
		    		var value = getReportLogViewCheck(systemTimeId,beginDate,endDate);
		    		if(value){
		    			var systemReportTreePanelId = Ext.getCmp('systemReportTreePanelId');
		    			systemReportTreePanelId.removeAll();
		    			systemReportTreePanelId.add({
		    				xtype : 'systemReportCharTree'
		    			});
		    		}
				}
			}
		},"->" ,{
				xtype: 'combobox',
                width: 160,
                labelWidth: 40,
                fieldLabel:local.time, 
                lableAlign: 'right',
				store : [[1,local.log.defaults],[2,local.log.oneDay],[3,local.log.oneWeek],[4,local.log.halfMonth],[5,local.log.oneMonth],[6,local.log.custom]],
				valueField : 'type',
				editable : false,
				displayField : 'name',
				id: 'systemTimeId',
				emptyText:local.log.chTime,
				listeners:{
					select:function(value,record){
						var serverType = value.value;
						if(serverType == 6){
							 Ext.getCmp('systemReprotSeachTime').setVisible(true);
						}else{
							Ext.getCmp('systemReprotSeachTime').setVisible(false);
							Ext.getCmp('beginDateId').setValue();
							Ext.getCmp('endDateId').setValue();
							
						}
					}
				}
			}, {
				xtype :'toolbar',
				id : 'systemReprotSeachTime',
				border : false,
				items : [{
		 			xtype: 'datefield',
		 			id : 'beginDateId',
		             width: 130,
		             format :'Y-m-d',
		             editable : false,
		             labelWidth: 40,
		             maxValue: new Date(),
		             minValue:new Date(new Date().getTime() - 90*86400000)
		 		}, ' - ', {
		 			xtype: 'datefield',
		 			id : 'endDateId',
		             width: 130,
		             format :'Y-m-d',
		             editable : false,
		             maxValue: new Date(),
		             minValue:new Date(new Date().getTime() - 90*86400000)
		 		}]
			},{
				xtype : "button",
				text : local.btn.inquire,
				id: 'searchSystemTime'
			}],
			listeners:{
		    	afterrender:function(){
		    		Ext.getCmp('systemReprotSeachTime').setVisible(false);
		    	}
		    }
});

var charTree = Ext.define("acesure.view.report.SystemReportCharTree",{
	extend : 'Ext.panel.Panel',
	alias : 'widget.systemReportCharTree',
	id: 'systemReportCharTreeId',
	border : false,
	width : '100%',
	listeners:{
    	afterrender:function(){
			var systemReportCharTreeId = Ext.getCmp("systemReportCharTreeId");
			var ylength = 70;
			Ext.Ajax.request({
				url: '/syslog/toSystemEntire!findLogDevicesTree.action',
				params : {
					"logType" : logType
				},
				success: function (response) {
					var obj = eval("(" + response.responseText + ")").children;
					logType = eval("(" + response.responseText + ")").logType;
					var cou = 0;
					for(var i = 0;i < obj.length;i++){
						if("createGroup" != obj[i].id && "createNewDevice" != obj[i].id){
				   			if(obj[i].children.length>0){
							systemReportCharTreeId.add({
								xtype : 'fieldset',
								id : 'fieldset'+obj[i].id,
								title :obj[i].text,
								border : "1 0 0 0",
								collapsible : true,
								margin:20,
								style:'border-color:#e6e6e6;padding:10px 20px 20px 0;',
								defaults : {
									anchor : '100%'
								},
								items : [{
									xtype : 'panel',
									id : 'panel'+obj[i].id,
									name : 'panel'+obj[i].id,
									width : '100%',
									height : '100%',
									layout : 'column',
			    					columns : 2,
			    					border : false
					    		}]
					 		});
				 		}
			 		}
					}
			 		for(var k = 0 ;k<obj.length; k++){
						var pannelgroup = Ext.getCmp("panel"+obj[k].id+"");
						if("createGroup" != obj[k].id && "createNewDevice" != obj[k].id){
						 	cou = cou+obj[k].children.length;
							for(var m = 0 ;m<obj[k].children.length; m++){
								var pan = new Ext.panel.Panel({ 
									id :'sonPanel'+obj[k].children[m].id,
									width : '100%',
									border : false,
									layout: {
										type: 'table',
										columns: 2    // 列数
									},
									defaults: {
										width:280,
										style:'cursor:pointer'
									},
									items :[{
								        id : 'gson'+obj[k].children[m].id,
								        style:'cursor:default',
								        bodyStyle: 'padding-top:14px',
								        border : false,
								        width:20,
								        height:34,
//								        html: "<div><img src='/images/backup/pc_big_online.png'/></div>",
							            listeners: {
							            	afterrender : function() {    //渲染后添加事件
						            			var sonPanel=this;
						            			var status = obj[k].children[m].status;    //设备状态 1-在线  2-不在线  0-新加入   3-正在备份
						            			var standby = obj[k].children[m].standby;    //设备是否双机  1:是双机 2：非双击
							            		if(1 == status){
					            					if(1 == standby){
					            						sonPanel.update("<div><img style='float:left;' src='/images/common/pc_online_two.png'></img></span></div>");
					            					}else{
					            						sonPanel.update("<div><img style='float:left;' src='/images/common/pc_online_one.png'></img></span></div>");
					            					}
						            			}else if(2 == status){
						            				if(1 == standby){
					            						sonPanel.update("<div><img style='float:left;' src='/images/common/pc_offline_two.png'></img></span></div>");
					            					}else{
					            						sonPanel.update("<div><img style='float:left;' src='/images/common/pc_offline_one.png'></img></span></div>");
					            					}
						            			}else if(0 == status){
						            				sonPanel.update("<div><img style='float:left;' src='/images/common/pc_online_new.png'></img></span></div>");
						            			}else{
						            				sonPanel.update("<div><img style='float:left;' src='/images/common/pc_error_one.png'></img></span></div>");
						            			};
						            		}
						            	}
								    },{
							            id:'sername'+obj[k].children[m].id,
							            style:'cursor:default',
							            border : false,
							            height:34,
							            bodyStyle: 'padding-top:10px;padding-right:20px;',
							            html : '<font class="font_h4" title="'+obj[k].children[m].text+'">'+obj[k].children[m].text+'</font>'
						       	 	},{
						       	 		colspan: 2,
						       	 		margin:'8 0 0 0 ',
						       	 		border : false,
						       	 		id:'chart'+obj[k].children[m].id,
						       	 		listeners: {
							            	afterrender : function() {
							            		getDeviceById(obj[k].children[m].id);
							            	}
							            }
						        	}]
								});
								pannelgroup.add(pan);
							}
						}
					}
		 		}
	 		})
   		}
   }
});

/*
 * 根据deviceId 得到图表
 */
function getDeviceById(deviceId){
	var deviceChartId = Ext.getCmp("chart"+deviceId);
	deviceChartId.add({
		html: '<div id="main'+deviceId+ '"style="width:260px;height:180px;cursor:default;background:#fbfbfb url(\'/images/log/null.png\') no-repeat center center" ></div>',    //为ChartPie准备一个具备大小（宽高）的Dom
		border : false,
		listeners : {
	    	afterrender : function(){
	    		var systemTimeId = Ext.getCmp("systemTimeId").value;
	    		var beginDate = Ext.getCmp("beginDateId").value;
	    		var endDate = Ext.getCmp("endDateId").value;
	    		
	    		Ext.Ajax.request({
            		method : 'post',
				    url: '/syslog/toSystemReport!findSysReportByDeviceId.action',
				    params : {
				    	"deviceId": deviceId,
				    	"systemTimeId": systemTimeId,
				    	"beginDate": beginDate,
				    	"endDate": endDate
				    },
				    success: function (response){
				    	var obj = Ext.decode(response.responseText);
				    	if(obj.addup == null || typeof(obj.addup) == "undefined" || obj.addup == ''){
				    		return ;
				    	}
				    	else{
				    		for(var i = 0 ; i < obj.addup.length; i++){
				    			var value = obj.addup[i];
				    			
				    			var myChart = echarts.init(document.getElementById('main'+value.id),'macarons'); 
						
								var option = echartValue(value);
		
								// 为echarts对象加载数据 
								myChart.setOption(option);
				    		}
				    	}
				    }
				});
	    	}
	    }
	});
};

/*
 * 验证自定义时间查询,时间段是否正确
 */
function getReportLogViewCheck(systemTimeId,beginDate,endDate){
	if(systemTimeId == 6){
		if(beginDate == null && endDate == null){
			Ext.MessageBox.alert(local.window.tip,local.log.chTime+local.mark);
			return false;
		}
		if(beginDate != null && endDate != null){
			//开始时间
			beginDate = formatDate(beginDate,"yyyy-MM-dd");
			//结束时间
			endDate = formatDate(endDate,"yyyy-MM-dd");
			
			//计算天数差的函数，通用  
			function DateDiff(beginDate, endDate){  //beginDate和endDate是2016-01-01格式  
				var aDate, oDate1, oDate2, iDays;  
				aDate = beginDate.split("-");  
				oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);  //转换为12-18-2016格式  
				aDate = endDate.split("-");  
				oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);  
				iDays = parseInt(Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 /24);  //把相差的毫秒数转换为天数  
				return iDays;  
			} 
			
			if(DateDiff(beginDate,endDate) > 31){
				Ext.MessageBox.alert(local.window.tip,local.log.noMonth);
				return false;
			}else if(DateDiff(beginDate,endDate) < 7){
				Ext.MessageBox.alert(local.window.tip,local.log.noWeek);
				return false;
			}
		}
		
		// 计算 beginDate endDate 是否超过数据保留限制，默认时间为1个月 TODO
		function chkEffectiveDate(beginDate, endDate, effTime) {
			// 计算有效日期
			var date = Ext.Date.add(new Date(), Ext.Date.MONTH, -1);
			var dateNum = Date.parse(date);
			console.debug("dateNum", dateNum);
			console.debug("dateNum1", Date.parse(beginDate));
			console.debug("dateNum2", Date.parse(endDate));
			
			// 判断当前选择的日期是否早于有效时间
			if(Date.parse(beginDate) < dateNum || Date.parse(endDate) < dateNum) {
				Ext.MessageBox.alert(local.window.tip,"历史数据只保留一个月，请重新选择日期");
				return false;
			}
		}
		
		/*if(!(beginDate != null && endDate != null)) {
			chkEffectiveDate(beginDate, endDate, -1);
		}*/
		
		
	}
	return true;
}

//图表数据
function echartValue(obj){
	/*//取最大值
	function getMarkLine(){
		var d = [];
		if(obj.disk != null){
    		for(var i = 0 ; i < obj.disk.length; i++){
    			if(obj.disk[i] >= 60){
    				d = [
	                    //纵轴，默认	
	                    {type : 'max', name: '最大值', itemStyle:{normal:{color:'#dc143c'}}}
				    ]
    			}
    		}
    	}
	    return d;
	}*/
	
	//图表
	var option = {
		/*title : {
			text: '使用率(%)',
	        textStyle: {
	        	fontSize: 8,
        		color: '#666'
        	}
	    },*/
		backgroundColor:'#fff',
		legend: {
	    	x: 'center',
	        data: ["cpu", "mem"/*,"disk"*/]
	   	},
		grid: {
	    	x: 30,
	    	y: 23,
	    	x2: 23,
	   		y2: 23,
	    	backgroundColor: '#fff',
	  		borderWidth:0,
	  		borderColor:'#fff'
	    },
	    xAxis: [{
	    	type: 'category',
	        boundaryGap: false, 
	        axisLine :{
	        	lineStyle:{    //X轴样式
	        		color: '#717475',
	            	width: 1
	            }
	        },
	        axisTick:{
	      	    show:true
	        },
	        data: obj.date
	    }],
	    yAxis : [{
	    	type : 'value',
	    	name : local.log.usage,
	        max: 100,
	        min: 0,
	        axisTick:{    //显示刻度
	      		show:true
	      	},
	        axisLine :{
	            lineStyle:{    //Y轴样式
	               color: '#717475',
	               width: 1
	            }
	        }
	    }],
	    //无数据 取消动画效果
	    noDataLoadingOption:{
     		text: ' ',
    		effect: 'bubble',
    		effectOption : {
   	 			effect: {
     				n: 0
      			}
    		},
    		textStyle: {    //字体大小
    			fontSize: 14
    		}
		},
	    series: [{
	            name:'cpu',
	            type:'line',
	            symbol:"none",
	            itemStyle: {    
		        	normal: {
		        		color: '#3d9efe',    //折线颜色
			        	lineStyle:{    //折线宽度
			        		width: 1.8
			        	}
		        	}
		        },
	            data: obj.cpu
		},{
	            name:'mem',
	            type:'line',
	            symbol:"none",
	            itemStyle: {
		        	normal: {
		        		color: '#27b7b7',    //折线颜色
			        	lineStyle:{    //折线宽度
			        		width: 1.8
			        	}
		        	}
		        },
	            data: obj.mem
	    }/*,{
	            name:'disk',
	            type:'line',
	            symbol:"none",
	            itemStyle: {
		        	normal: {
		        		color: '#fe8d1b',    //折线颜色
			        	lineStyle:{    //折线宽度
			        		width: 1.8
			        	}
		        	}
		        },
		        markLine : {    //最大值
		        	data : getMarkLine()
		        },
	            data: obj.disk
	    }*/]
	};
	return option;
}
