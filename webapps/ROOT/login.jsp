<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%> 
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
    <meta charset="utf-8">
    <!--优先使用 IE 最新版本和 Chrome-->
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <!--360浏览器QQ，搜狗等双内核浏览器，默认使用chrome内核-->
    <meta name="renderer" content="webkit">
    <!--浏览器地址栏中的图标，收藏夹中的图标-->
<link href="/oem/favicon.ico" mce_href="favicon.ico" rel="bookmark" type="image/x-icon" />
<link href="/oem/favicon.ico" mce_href="favicon.ico" rel="icon" type="image/x-icon" />
<link href="/oem/favicon.ico" mce_href="favicon.ico" rel="shortcut icon" type="image/x-icon" />
    <!-- Extjs 核心样式库 -->
	<link rel="stylesheet" type="text/css" href="/app/ext-4.2.1/resources/ext-theme-neptune/ext-theme-my.css" />
    <link charset="utf-8" rel="stylesheet" href="/css/base.css">
    <link charset="utf-8" rel="stylesheet" href="/css/login.css">   
    <jsp:include page="/oem/Oem.jsp"></jsp:include>   
	<!-- Extjs 核心脚本 -->
	<script type="text/javascript" src="/app/ext-4.2.1/ext-all.js"></script>
	<!-- Extjs 国际化脚本 -->
<script type="text/javascript" src="/app/ext-4.2.1/ext-lang-zh_CN.js"></script>
<script type="text/javascript" src="/app/ext-4.2.1/ext-lang-chinese.js"></script>
	<!-- 账户登录-->		
    <script type="text/javascript" src="/page/common/USBKey.js"></script>
    <script type="text/javascript" src="/page/common/Login.js"></script>  
</head>
<body>
<div class="login_logo">
    <div class="login_header">
        <a class="setup" href="/down.jsp"  target="_blank"><fmt:message key="local_down"/></a>
        <a class="help" href="/help.jsp" target="_blank"><fmt:message key="local_help"/></a>
        <!--<a class="lang">English</a>
    --></div>
    <img class="logo_icon" src="/oem/logo_login.png" width="500px" height="176px">
</div>
<div class="login_tab_wrap clear">
   <div id="loginTab" class="login_tab clear">
	   <a class="active"><fmt:message key="local_login_typeNormal"/></a>
	   <a><fmt:message key="local_login_typeUK"/></a>    
   </div>
</div>
<div id="formWrap" class="login">
	<form id="loginForm" name="loginForm" class="login_form"  method="post" action="">
		<ul>   			
			<li class="ipt user_wrap">
				<input type="text" class="username" id="userName" name="userName" placeholder="<fmt:message key='local_login_user'/>" value="">
			</li>
			<li class="ipt pass_wrap">
				<input type="password" class="password" id="userPwd" name="userPwd" placeholder="<fmt:message key='local_login_password'/>" value="">	
				<div id="capsLockTipWrap" style="position:absolute;top:0;left:0;">
				</div>
				<input type="hidden"  name="userLoginType" id="userLoginType" value="">
			</li>      			
    		<li id="ukWrap" name="ukWrap" class="ipt uk_wrap">
     			<div class="uk_left" align="left" ><fmt:message key="local_login_UKstate"/></div>
     			<input class="password" name="edtResult" type="text" id="edtResult" size="60"  disabled=true>
     		</li>	
			<li id='loginBtn' name="loginBtn" class="ipt submit_wrap">
				<input type="button" id="submit" name="submit" value="<fmt:message key='local_login_login'/>" class="submit" onclick="login()">
			</li>
			<li id="ukText" name="ukText" class="uk_text">
				<a href="javascript:void(0)" onclick="downloadUSBKeyControl()"><fmt:message key="local_login_downUK"/></a>
			</li>
			<li id="loginInfo" class="login_info">
				<img id="loginImg" width=16 height=16 src="/images/backup/error.png"/>
				<span id="loginResult"></span>
			</li>
		</ul>
	</form>
</div>
<div class="copyright">
	Copyright (C) 2012-<span id="thisYear"></span> Data Backup Center. All rights reserved. 
</div>
</body>
</html>
</fmt:bundle>