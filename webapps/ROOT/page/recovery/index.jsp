<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    String basePath = request.getScheme() + "://"
            + request.getServerName() + ":" + request.getServerPort()
            + path + "/";
%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
	<head>
		<jsp:include page="/page/common/Extjs.jsp"></jsp:include>
	<jsp:include page="/page/common/Lang.jsp"></jsp:include>
	<jsp:include page="/page/common/commonJs.jsp"></jsp:include>
				<script type="text/javascript" src="/app/plugins/jquery.min.js"></script>
		<script type="text/javascript" src="/page/recovery/script/controller/RecoveryHandle.js"></script>
		<script type="text/javascript" src="/page/recovery/script/view/main.js"></script>
		<link rel="stylesheet" type="text/css" href="/css/snap.css" />
		<link rel="stylesheet" type="text/css" href="/page/ux/grid/css/GridFilters.css" />

        <link rel="stylesheet" type="text/css" href="/page/ux/grid/css/RangeMenu.css" />
		<%-- <jsp:include page="/common/CommonTree.jsp"></jsp:include>--%>	
		<script type="text/javascript" src="/page/common/GlobalTreeView.js"></script>
		<script type="text/javascript" src="/app/plugins/tabScrollerMenu/TabScrollerMenu.js"></script>
		<link rel="stylesheet" type="text/css" href="/app/plugins/tabScrollerMenu/TabScrollerMenu.css"/>
	</head>
	<body>
	</body>
</html>
