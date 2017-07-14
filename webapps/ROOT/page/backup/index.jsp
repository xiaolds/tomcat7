<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<base href="<%=basePath%>">
<jsp:include page="/page/common/Extjs.jsp"></jsp:include>
<jsp:include page="/page/common/Lang.jsp"></jsp:include>
<jsp:include page="/page/common/commonJs.jsp"></jsp:include>
<script type="text/javascript" src="/page/common/GlobalTreeView.js"></script>
<script type="text/javascript"  src="/app/plugins/jquery.min.js"></script>
<script type="text/javascript" src="/app/plugins/radialindicator.js"></script>
<script type="text/javascript" src="/app/plugins/cycle.js"></script>
<!--slider滑动条-->
<link rel="stylesheet" href="/css/jslider.css" type="text/css"/>
<script type="text/javascript" src="/app/plugins/jquery.dependClass.js"></script>
<script type="text/javascript" src="/app/plugins/jquery.slider.js"></script>

<script type="text/javascript" src="/page/backup/script/view/Main.js"></script>
<script type="text/javascript" src="/page/backup/script/common/CommonFun.js"></script>

<script type="text/javascript" src="/app/plugins/ajax-pushlet-client.js"></script>	

<script type="text/javascript">
var userName ="${sessionScope.currentUser.userName }";

if (PL.sessionId == null) {
		PL.userId="${sessionScope.currentUser.userName }";//用EL表达式选择用户名，如果没用到的，
		                                           //可以自己直接定义如：“PL.userId="liu"”
	}
//初始化pushlet客户端
	PL._init(); 
	PL.joinListen('/mess');//监听该主题的事件，如果发生该主题的事件，那么onData()方法会被调用  
	//接收到事件后，显示服务器信息
	 function onData(event){ 
		 var con ="";
		 if (undefined != event.get(userName) && "" != event.get(userName)) {
			  con = event.get(userName)
			  var conArray = con.split(";");
			  
			  for (var i=0;i<conArray.length ;i++ ){   
			        if("" != conArray[i]){
			        	var stateArray = conArray[i].split("-");
			        	console.log(stateArray[0]+"+++"+stateArray[1]);
			        	if(stateArray[0] == selectDeviceId){
				        	var item = Ext.getCmp("grobleTreePanel").getStore().getNodeById(stateArray[0]+"-d");
				        	console.log(item);
				        	item.raw.status=stateArray[1];
				        	//设备状态:1：在线2：不在线 3：异常
				        	if(1 == stateArray[1]){//设备在线
				        		if(1 == stateArray[2]){//1:双机
				        			item.raw.pageIco = "pc_big_online_two.png"
				        			//item.raw.icon = "/images/common/pc_online_two.png"
				        		}else{
				        			item.raw.pageIco = "pc_big_online_one.png"
				        			//item.raw.icon = "/images/common/pc_online_one.png"
				        		}
				        	}else if(2 == stateArray[1]){//设备不在线
				        		if(1 == stateArray[2]){//1:双机
				        			item.raw.pageIco = "pc_big_offline_two.png"
				        			//item.raw.icon = "/images/common/pc_offline_two.png"
				        			//item.icon.src = "/images/common/pc_offline_two.png"; 
				        		}else{
				        			item.raw.pageIco = "pc_big_offline_one.png"
				        			//item.raw.icon = "/images/common/pc_offline_one.png"
				        		}
				        	}else{//设备异常
				        		if(1 == stateArray[2]){//1:双机
				        			item.raw.pageIco = "pc_big_error_two.png"
				        			//item.raw.icon = "/images/common/pc_error_two.png"
				        		}else{
				        			item.raw.pageIco = "pc_big_error_one.png"
				        			//item.raw.icon = "/images/common/pc_error_one.png"
				        		}
				        	}
				        	//Ext.getCmp("grobleTreePanel").doLayout();
				        	//
							Ext.getCmp("grobleTreePanel").getSelectionModel().select(item);
							Ext.getCmp("grobleTreePanel").fireEvent("itemclick",null,item);
						}
			        }   
			    }  
			  Ext.getCmp("grobleTreePanel").getStore().load();//刷新左侧树
			  if(null == selectDeviceId && null == clusterId){
				  var contentPanel = Ext.getCmp('contentPanel');
					contentPanel.removeAll();
					contentPanel.add({
								xtype : 'BackupView',
								itemId : 'BackupMonitorsPanel'
							});
					contentPanel.doLayout();
			  }
		 }
		 console.log("激活的普通页面为："+selectDeviceId+"----激活的集群页面"+clusterId)
	 }
	
</script>
<style>

#box{
	width:126px;
	margin:15px auto 0 auto;
	height:126px;
	font-size:20px;
	line-height:24px;
	padding-top:37px;
	text-align:center;
	background: url(/images/backup/yuan01.png);
}
</style>
<script>
<%--首页展示设备的小箭头切换函数--%>
	$(".device_view legend").live("click",function(){
		var the=$(this).parent(".device_view");
		if(the.find(".field_cont").is(":visible")){
			the.find(".icon_arrow").addClass("icon_arrow_hide");
			the.find(".field_cont").hide();
		}
		else{
			the.find(".icon_arrow").removeClass("icon_arrow_hide");
			the.find(".field_cont").show();
		}
	})
</script>
</head>

<body>
<div width='300' height='400' id="target"></div> 
</body>
</html>
