<%@ page language="java" import="java.util.*,java.io.*" pageEncoding="utf-8"%>
<%
String path = request.getContextPath();
String basePath = request.getScheme() + "://"
    + request.getServerName() + ":" + request.getServerPort()
    + path + "/";
%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
   <base href="<%=basePath%>">
</head>
<%
   int key=Integer.parseInt(request.getParameter("cid"));
   out.clear();
   out = pageContext.pushBody();
   String pdfPath="AceSure使用操作手册.pdf";
    switch (key) {
	case 1:pdfPath="AceSure使用操作手册.pdf";break;
	case 2:pdfPath="AceSure安装配置手册.pdf"; break;
	case 3:pdfPath="AceSure UI功能规格说明书.pdf"; break;
	case 4:pdfPath="AceSure帮助指南.xlsx"; break;
	default:pdfPath="AceSure使用操作手册.pdf";   
		break;
	}
    response.setContentType("application/pdf");
    response.setHeader("Content-Disposition", "attachment;filename="+new String(pdfPath.getBytes("gb2312"),"iso-8859-1"));
   try {
	   String path1=application.getRealPath(request.getRequestURI());
	   String dir=new java.io.File(path1).getParent();
       String strPdfPath = new String(dir+"/"+pdfPath);
    //判断该路径下的文件是否存在
    File file = new File(strPdfPath);
    if (file.exists()) {
     DataOutputStream temps = new DataOutputStream(response.getOutputStream());
     DataInputStream in = new DataInputStream(new FileInputStream(strPdfPath));

     byte[] b = new byte[2048];
     while ((in.read(b)) != -1) {
      temps.write(b);
      temps.flush();
     }

     in.close();
     temps.close();
    } 

   } catch (Exception e) {
    out.println(e.getMessage());
   }
%>
<body>
   <br>
</body>
</html>
