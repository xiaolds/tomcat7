Ext.define('acesure.controller.report.EntireReportController', {
	extend : 'Ext.app.Controller',
	alias  : "widget.entireReportController",
	views  : ['report.EntireReportList','report.BackupReportList'],
	models : ['report.EntireDeviceModel','report.BackupReportModel'],
	stores : ['report.EntireDeviceStore','report.BackupReportStore','report.BackupReportChartStore'],
	init: function(){
    	this.control({
			'entireReportToolbar button[id=searchEntireReportBut]' : {
				click : this.searchEntireReportButs
			},
			'entireReportToolbar button[id=resetEntireReportBut]' : {
				click : this.resetEntireReportButs
			},
			'headToolbar button[id=entireReportExportId]' : {
				click : this.entireReportExport
			},//备份报表-导出
			'backupLogHeadToolbar button[id=backupReportExportId]' : {
				click : this.backupReportExport
			}
    	})        
    },
	//搜索
	searchEntireReportButs : function(){
		var beginDateId = Ext.getCmp("beginDateId").value;
    	var endDateId = Ext.getCmp("endDateId").value;
    	var entireTimeId = Ext.getCmp("entireTimeId").value;
    	
    	if(entireTimeId == 0 || entireTimeId == null){
    		Ext.MessageBox.alert(local.window.tip,local.log.chTime+local.mark);
    		return false;
    	}else if(entireTimeId == 6){
    		if(beginDateId == null && endDateId == null){
    			Ext.MessageBox.alert(local.window.tip,local.window.tip,local.log.chTime+local.mark);
    			return false;
    		}else if(beginDateId != null && endDateId != null){
    			if(beginDateId > endDateId){
        			Ext.MessageBox.alert(local.window.tip,local.log.noExceed);
        			return false;
        		}
    		}
    	}
    	
    	Ext.Ajax.request({
			method : 'post',
		    url: '/syslog/toSystemEntire!searchScatterByDeviceTime.action',
		    params : {
		    	"entireTimeId":entireTimeId,
		    	"beginDateId": beginDateId,
		    	"endDateId": endDateId
		    },
			success: function (response){
		    	var obj = Ext.decode(response.responseText);
		    	
				if(obj.scatterUp == null || typeof(obj.scatterUp) == "undefined" || obj.scatterUp == ''){
		    		return ;
		    	}
				else{
					
			    	for(var i = 0 ; i < obj.scatterUp.length; i++){
						var value = obj.scatterUp[i];
			    		 // 基于准备好的dom，初始化echarts图表
					    var myChart = echarts.init(document.getElementById('main'+value[0].id),'macarons'); 
					    
					    var option = getScatterOption(value[0]);
					    
						// 为echarts对象加载数据 
					    myChart.setOption(option);
					     
					    var deviceScatterId = Ext.getCmp("entire-scatter"+value[0].id);
						deviceScatterId.removeAll();
						
						deviceScatterId.add({
		    				border : false,
		    				cls:"log_chart_title",
		    				html: "<font style='color:#666;'>"+value[0].errorCount+local.log.aMistake+ value[0].warnCount +local.log.awarning+"</font>"
						});
						deviceScatterId.doLayout();
		    			
			    	}    //for end
				}    //else end
			}
    	});
    	
    	//删除已点击，显示出来的表格
		var footPanelId = Ext.getCmp("footPanelId");
		if(typeof(footPanelId) != "undefined"){
			footPanelId.removeAll();
		}
	},
	
	//重置
	resetEntireReportButs : function(){
		Ext.getCmp("beginDateId").setValue();
    	Ext.getCmp("endDateId").setValue();
	},
	//故障报表-导出
	entireReportExport : function(){
		var exportTimeId = Ext.getCmp("exportTimeId").value;
		window.open('/syslog/toSystemEntire!EntireReportExport.action?exportTimeId='+exportTimeId);
		//隐藏时间选择框
		Ext.getCmp('exportTimeId').setVisible(false);
		Ext.getCmp('reportTimeExportId').setVisible(true);
		Ext.getCmp('entireReportExportId').setVisible(false);
	},
	//备份报表-导出
	backupReportExport : function(){
		window.open('/syslog/toSystemBackupLog!BackupReportExport.action');
	}
});