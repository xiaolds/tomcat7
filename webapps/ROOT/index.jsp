<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%
	String path = request.getContextPath();
	String basePath = request.getScheme() + "://" + request.getServerName() + ":" + request.getServerPort() + path + "/";
%>

  <!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
 <HTML>
  <HEAD>
   <TITLE> IE8支持HTML5+CSS3 </TITLE>
<!--[if IE]>
    <script src="/app/plugins/html5.js" type="text/javascript"></script>
    <script type="text/javascript" src="/app/plugins/excanvas.compiled.js"></script>
<![endif]-->
 <head>
 
 <style type="text/css">
 body { 
     background: #444; 
     color: #FFF;
     font-family: Helvetica, Arial, sans-serif;
     text-align: center;
 }
 
 #cv {
    width: 600px; height: 400px;
    background: #000;
    border-radius: 20px;
    padding: 20px;
    margin: 20px auto;
    box-shadow: 0 0 40px #222;
    behavior: url(/css/PIE.htc);
}
 </style>
 
 <script type="text/javascript">
 function test() {
 var ctx = document.getElementById("cv").getContext("2d");
   
   ctx.fillStyle = "#aa0000";
   ctx.beginPath();
   ctx.arc(100, 100, 25, 0, Math.PI*2, true);
   ctx.closePath();
   ctx.fill();
 }
 
 window.onload = test;
  </script>
 
 </head>
 
 <body>
 <canvas id="cv"></canvas>
 </body>