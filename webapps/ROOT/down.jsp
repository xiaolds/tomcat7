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
<link href="/css/down.css" rel="stylesheet" type="text/css" />
    <jsp:include page="/oem/Oem.jsp"></jsp:include> 
<script type="text/javascript">
  //for wget downLink
  function copyUrl(urlLink,fileName){
      var downURL = window.location.protocol + "//" + window.location.host + urlLink;  
      var wgetLink = "wget "+downURL+" -O "+fileName;    //wget link -O downFileName  重命名下载文件
      
      var copyBox=document.getElementById("copyWrap");
      var copyBody=document.getElementById("copyBody");

      copyBox.style.display="block"
      copyBody.innerHTML=wgetLink;
  }
  function colseCopy(){
  	var copyBox=document.getElementById("copyWrap");
  	copyBox.style.display="none";
  }
</script>
  </head>
<body>
<div class='content'>
<div class="login_logo">
    <div class="login_header">
        <a class="setup" href="/down.jsp"  target="_self"><fmt:message key="local_down"/></a>
        <a class="help" href="/help.jsp" target="_self"><fmt:message key="local_help"/></a><!--
        <a class="lang">English</a>
    --></div>
    <img class="logo_icon" src="/oem/logo_login.png" width="500px" height="176px">
</div>

<div class="title_wrap">
	<i class="title_icon"></i>
	<span><fmt:message key="local_down"/></span>
</div>

<div class='wrap1'>
<div class='list'>
	<div class="list_top">
			<i class="sys_icon"></i>
			<div class="list_tr">
				<h3>Windows 2003,2008,2012</h3>
				<a href='/admin/toUserAction!downClient?type=9'>32/64Win<fmt:message key="local_down_client"/></a>
			</div>
	</div>
</div>
<div class='list'>
<div class="list_top">
		<i class="sys_icon sys_icon_linux"></i>
		<div class="list_tr">
			<h3>RedHat 5/6,Centos 5/6<br>Kylin 2.6.32</h3>
			<a href='/admin/toUserAction!downClient?type=11'>Redhat5i686<fmt:message key="local_down_client"/></a><span title="<fmt:message key='local_down_urlcopy'/>" class="icon_copy" onClick="copyUrl('/admin/toUserAction%21downClient?type=11','Clone_Client_Redhat5i686.zip')"></span><br>
			<a href='/admin/toUserAction!downClient?type=12'>Redhat5x86_64<fmt:message key="local_down_client"/></a><span title="<fmt:message key='local_down_urlcopy'/>"  class="icon_copy" onClick="copyUrl('/admin/toUserAction%21downClient?type=12','Clone_Client_Redhat5x86_64.zip')"></span><br>
		</div>
		</div>
		</div>
		
		<div class='list'>
				<div class="list_top">
					<i class="sys_icon sys_icon_redhat"></i>
					<div class="list_tr">
						<h3>RedHat 4,Centos 4</h3>
						<a href='/admin/toUserAction!downClient?type=14'>Redhat4i686_32<fmt:message key="local_down_client"/></a><span title="<fmt:message key='local_down_urlcopy'/>"  class="icon_copy" onClick="copyUrl('/admin/toUserAction%21downClient?type=14','Clone_Client_Redhat4i686.zip')"></span><br>
						<a href='/admin/toUserAction!downClient?type=15'>Redhat4x86_64<fmt:message key="local_down_client"/></a><span title="<fmt:message key='local_down_urlcopy'/>"  class="icon_copy" onClick="copyUrl('/admin/toUserAction%21downClient?type=15','Clone_Client_Redhat4x86_64.zip')"></span>
						</div>
						</div>
				</div>
				<div class='list'>
				<div class="list_top">
                    <i class="sys_icon sys_icon_cenos"></i>
                    <div class="list_tr">
                        <h3>RedHat 7,Centos 7</h3>
                        <a href='/admin/toUserAction!downClient?type=16'>Redhat7x86_64<fmt:message key="local_down_client"/></a><span title="<fmt:message key='local_down_urlcopy'/>"  class="icon_copy" onClick="copyUrl('/admin/toUserAction%21downClient?type=16','Clone_Client_Redhat7x86_64.zip')"></span>
                        </div>
                        </div>
                </div>
                <div class='list'>
                <div class="list_top">
                    <i class="sys_icon sys_icon_suse"></i>
                    <div class="list_tr">
                        <h3>Suse10/11</h3>
                        <a href='/admin/toUserAction!downClient?type=17'>Suse10i686<fmt:message key="local_down_client"/></a><span title="<fmt:message key='local_down_urlcopy'/>"  class="icon_copy" onClick="copyUrl('/admin/toUserAction%21downClient?type=17','Clone_Client_Suse10i686.zip')"></span><br>
                        <a href='/admin/toUserAction!downClient?type=18'>Suse10x86_64<fmt:message key="local_down_client"/></a><span title="<fmt:message key='local_down_urlcopy'/>"  class="icon_copy" onClick="copyUrl('/admin/toUserAction%21downClient?type=18','Clone_Client_Suse10x86_64.zip')"></span>
                        </div>
                        </div>
                </div>
</div>	
</div>
<div id="copyWrap" class="copy_wrap">
	<div class="copy_bg"></div>
	<div class="copy_body">
		<div id="copyBody"  class="copy_inner"></div>
		<a id="copyClose" class="copy_close" title="close" onClick="colseCopy()"></a>
	</div>
</div>
</body>
</html>
</fmt:bundle>