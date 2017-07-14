<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    <jsp:include page="/page/common/Extjs.jsp"></jsp:include>
	<jsp:include page="/page/common/Lang.jsp"></jsp:include>
	<jsp:include page="/page/common/commonJs.jsp"></jsp:include>
	
    <script type="text/javascript" src="/page/log/script/view/report/Main.js"></script>
  	<script type="text/javascript" src="/echarts/dist/echarts.js"></script>
  	<script type="text/javascript" src="/echarts/echarts-all.js"></script>
  	<script type="text/javascript"  src="/app/plugins/jquery.min.js"></script>
  </head>
  
  <body>
  <div id="log_div" style="display:none;position:absolute;top:60px;width:100%;height:100%;background:#fff;text-align:center;line-height:300px;font-size:40px;color:#ddd;">
  	<script type="text/javascript">
			document.write(local.log.logNoAuth)
	</script>
  </div>
  </body>
</html>