<%@ page language="java" pageEncoding="UTF-8"%>
<%
String extPath = request.getContextPath();
String extBasePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+extPath+"/";
%>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<!--优先使用 IE 最新版本和 Chrome-->
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<!--360浏览器QQ，搜狗等双内核浏览器，默认使用chrome内核-->
<meta name="renderer" content="webkit"> 
<!-- Extjs 核心样式库 -->
<link rel="stylesheet" type="text/css" href="/app/ext-4.2.1/resources/ext-theme-neptune/ext-theme-my.css" />
<!--浏览器地址栏中的图标，收藏夹中的图标-->
<link href="/oem/favicon.ico" mce_href="favicon.ico" rel="bookmark" type="image/x-icon" />
<link href="/oem/favicon.ico" mce_href="favicon.ico" rel="icon" type="image/x-icon" />
<link href="/oem/favicon.ico" mce_href="favicon.ico" rel="shortcut icon" type="image/x-icon" />

<!-- 共用样式，需放在ext核心样式的后面-->
<link rel="stylesheet" type="text/css" href="/css/base.css"/> 
<jsp:include page="/oem/Oem.jsp"></jsp:include>  

<!-- Extjs 核心脚本 -->
<script type="text/javascript" src="/app/ext-4.2.1/ext-all.js"></script>