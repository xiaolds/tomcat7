<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <jsp:include page="/page/common/Extjs.jsp"></jsp:include>
	<jsp:include page="/page/common/Lang.jsp"></jsp:include>
          <link rel="stylesheet" href="/css/initialization.css"/>
    <script type="text/javascript" src="/page/initialization/script/view/Main.js"></script>
    <script type="text/javascript" src="/app/plugins/jquery.min.js"></script>
    <script>
    	window.onload=function(){
    		// 自动生成年份
    		var thisYearId = document.getElementById("thisYear"), thisYear = (new Date()).getFullYear();
    		thisYearId.innerHTML = thisYear;
    	}
    </script>
  </head>
  
  <body>
  	<div class="wrap">
    		<div class="install_header">配置向导</div>
    		<div class='content'  id="content"></div>
    		<div class="cpr">Copyright (C) 2012-<span id="thisYear"></span> Data Backup Center. All right reserved. </div>
    </div>
  </body>
</html>