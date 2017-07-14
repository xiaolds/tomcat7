<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt"  prefix="fmt" %>

<%
String path = request.getContextPath();
String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<% String local=Locale.getDefault().toString(); %><!-- 获取当前用户的语言环境 -->

<fmt:setLocale value="<%=local%>"/> 

<!DOCTYPE HTML>
<fmt:bundle basename="/international/acesureWeb"> 
<html>
  <head>
  <base href="<%=basePath%>">
    <meta charset="utf-8">
    <!--优先使用 IE 最新版本和 Chrome-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <!--360浏览器QQ，搜狗等双内核浏览器，默认使用chrome内核-->
    <meta name="renderer" content="webkit">
    <!--浏览器地址栏中的图标，收藏夹中的图标-->
<link href="/oem/favicon.ico" mce_href="favicon.ico" rel="bookmark" type="image/x-icon" />
<link href="/oem/favicon.ico" mce_href="favicon.ico" rel="icon" type="image/x-icon" />
<link href="/oem/favicon.ico" mce_href="favicon.ico" rel="shortcut icon" type="image/x-icon" />
<link href="/css/down.css" rel="stylesheet" type="text/css" />
    <jsp:include page="/oem/Oem.jsp"></jsp:include> 
  </head>
  
<body>
<div class='content'>
<div class="login_logo">
    <div class="login_header">
        <a class="setup" href="/down.jsp"  target="_self"><fmt:message key="local_down"/></a>
        <a class="help" href="/help.jsp" target="_self"><fmt:message key="local_help"/></a>
        <!--<a class="lang">English</a>
    --></div>
    <img class="logo_icon" src="/oem/logo_login.png" width="500px" height="176px">
</div>
<div class="title_wrap">
	<i class="title_icon title_icon_help"></i>
	<span><fmt:message key="local_help"/></span>
</div>
<div class='wrap'>
	<ul>
		<li><a href="/help/down_help.jsp?cid=1"" ><i class="icon_pdf"></i><span><fmt:message key="local_help_doc1"/></span></a></li>
		<li><a href="/help/down_help.jsp?cid=2"><i class="icon_pdf"></i><span><fmt:message key="local_help_doc2"/></span></a></li>
	</ul>
</div>	
</div>
</body>
</html>
</fmt:bundle>