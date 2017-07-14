<%@ page language="java" pageEncoding="UTF-8"%>
<%
String extPath = request.getContextPath();
String extBasePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+extPath+"/";
%>
<!-- Extjs 国际化脚本 -->
<script type="text/javascript" src="/app/ext-4.2.1/ext-lang-zh_CN.js"></script>
<script type="text/javascript" src="/app/ext-4.2.1/ext-lang-chinese.js"></script>
<%--update下面有数据库需要更新的中英文--%>