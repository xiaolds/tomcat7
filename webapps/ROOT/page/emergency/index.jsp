<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<!DOCTYPE html>
<html>
<head>
		<jsp:include page="/page/common/Extjs.jsp"></jsp:include>
		<jsp:include page="/page/common/Lang.jsp"></jsp:include>
		<jsp:include page="/page/common/commonJs.jsp"></jsp:include>
		<script type="text/javascript" src="/app/plugins/jquery.min.js"></script>
		<script type="text/javascript" src="/page/emergency/script/controller/EmergencyMapDate.js"></script>
		<script type="text/javascript" src="/page/emergency/script/controller/EmergencyHandle.js"></script>
		<script type="text/javascript" src="/page/common/GlobalTreeView.js"></script>
		<link rel="stylesheet" type="text/css" href="/app/plugins/tabScrollerMenu/TabScrollerMenu.css"/> 
		<link rel="stylesheet" type="text/css" href="/page/ux/grid/css/GridFilters.css" />
        <link rel="stylesheet" type="text/css" href="/page/ux/grid/css/RangeMenu.css" />
		<link rel="stylesheet" type="text/css" href="/css/snap.css" />
		<script type="text/javascript" src="/app/plugins/tabScrollerMenu/TabScrollerMenu.js"></script>
		<script type="text/javascript" src="/page/emergency/script/view/Main.js"></script>
		
		<script type="text/javascript"  src="/page/common/CommHtmlData.js"></script> 
		
<body>
</body>
</html>