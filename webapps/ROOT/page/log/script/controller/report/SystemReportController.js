 Ext.define('acesure.controller.report.SystemReportController',{
        extend : 'Ext.app.Controller',
        alias:"widget.systemReportController",
        views:['report.SystemReportList','report.LogTree','report.LogView'],
        stores:['report.SystemReportStore','report.LogTreeStore'],
        models:['report.SystemReportModel','report.LogTreeModel'],
        init: function(){
        	this.control({
        		//性能报表-时间搜索
        		'reportCenterComboBox button[id=searchSystemTime]' : {
	    			click : this.searchSystemTime
	    		},//性能报表-导出
	        	'reportHeadToolBar button[id=systemReprotExportId]' : {
	        		click : this.systemReprotExport
	        	}
        	})        
        },
        //时间搜索
        searchSystemTime : function(){
        	var systemTimeId = Ext.getCmp("systemTimeId").value;
        	var beginDate = Ext.getCmp("beginDateId").value;
        	var endDate = Ext.getCmp("endDateId").value;
        	
        	if(systemTimeId == 0 || systemTimeId == null){
        		Ext.MessageBox.alert(local.window.tip,local.log.chTime+local.mark);
        		return false;
        	}else if(systemTimeId == 6){    //自定义时间筛选
        		if(beginDate != null && endDate != null){
        			if(beginDate > endDate){
            			Ext.MessageBox.alert(local.window.tip,local.log.noExceed);
            			return false;
            		}
        		}
        	}
        	//如果为自定义时间查询,判断时间段是否正确
        	var value = getReportLogViewCheck(systemTimeId,beginDate,endDate);
        	if(value){
        		Ext.Ajax.request({
    	    		method : 'post',
    			    url: '/syslog/toSystemReport!searchSysReportByTimeId.action',
    			    params : {
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
    			    			
    			    			var myChart = echarts.init(document.getElementById('main'+value[0].id),'macarons'); 
    					
    							var option = echartValue(value[0]);
    	
    							// 为echarts对象加载数据 
    							myChart.setOption(option);
    			    		}
    			    	}
    			    }
    			});
        	}
        },//性能报表-导出
        systemReprotExport : function(){
        	var exportTimeId = Ext.getCmp("exportTimeId").value;
        	window.open('/syslog/toSystemReport!SystemReportExport.action?exportTimeId='+exportTimeId);
        	//隐藏时间选择框
        	Ext.getCmp('exportTimeId').setVisible(false);
        	Ext.getCmp('systemTimeExportId').setVisible(true);
        	Ext.getCmp('systemReprotExportId').setVisible(false);
        }
});
 
 
 
//格式化日期,
function formatDate(date,format){
	var paddNum = function(num){
		num += "";
		return num.replace(/^(\d)$/,"0$1");
	}
	//指定格式字符
	var cfg = {
		yyyy : date.getFullYear() //年 : 4位
		,yy : date.getFullYear().toString().substring(2)//年 : 2位
		,M  : date.getMonth() + 1  //月 : 如果1位的时候不补0
		,MM : paddNum(date.getMonth() + 1) //月 : 如果1位的时候补0
		,d  : date.getDate()   //日 : 如果1位的时候不补0
		,dd : paddNum(date.getDate())//日 : 如果1位的时候补0
		,hh : date.getHours()  //时
		,mm : date.getMinutes() //分
		,ss : date.getSeconds() //秒
	}
	format || (format = "yyyy-MM-dd hh:mm:ss");
	return format.replace(/([a-z])(\1)*/ig,function(m){return cfg[m];});
} 