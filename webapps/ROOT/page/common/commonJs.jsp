<%@ page language="java" pageEncoding="UTF-8"%>
<%
String extPath = request.getContextPath();
String extBasePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+extPath+"/";
%>

<!-- Ext消息提示框,自定义弹窗插件，支持自定义显示时间 -->
<script type="text/javascript" defer="defer" src="/page/common/MsgTip.js"></script>

<!-- 公用密码强制修改 -->
<script type="text/javascript" defer="defer" src="/page/common/ForceModifyPassword.js"></script>

<!--共用头部大菜单-->
<script type="text/javascript" src="/page/common/GlobalConstants.js"></script>
<script type="text/javascript" src="/page/common/Common.js"></script>
<script type="text/javascript" src="/page/common/RegExp.js"></script>
<script type="text/javascript" src="/page/common/CurrentUser.js"></script>
<script type="text/javascript" src="/page/common/PowerOperation.js"></script>
<script type="text/javascript"  defer="defer" src="/page/common/GlobalMenu.js"></script>


<!-- 公用消息通知 -->
<script type="text/javascript" defer="defer" src="/page/msgcenter/script/view/main.js"></script>
