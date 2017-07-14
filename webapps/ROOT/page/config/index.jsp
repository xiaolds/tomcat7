<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>

<!DOCTYPE html>
<html>
<head>
	<jsp:include page="/page/common/Extjs.jsp"></jsp:include>
	<jsp:include page="/page/common/Lang.jsp"></jsp:include>
	<jsp:include page="/page/common/commonJs.jsp"></jsp:include>
	<script type="text/javascript" src="/page/config/script/controller/ConfigGlobal.js"></script>
	<script type="text/javascript" src="/page/config/script/controller/ConfigHandle.js"></script> 
    <script type="text/javascript" src="/page/common/USBKey.js"></script>  	 	
    <script type="text/javascript" src="/page/config/script/view/main.js"></script> 
</head> 
<body>
</body>
</html>