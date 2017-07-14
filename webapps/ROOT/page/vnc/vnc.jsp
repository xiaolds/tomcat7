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

<title><fmt:message key="vnc_console"/></title>

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style"  content="black-translucent" />
<link rel="apple-touch-startup-image" href="images/screen_320x460.png" />
<link rel="apple-touch-icon" href="images/screen_57x57.png"/>

<!-- Stylesheets -->
<link rel="stylesheet" href="/page/vnc/css/base.css" title="plain"/>
<!--[if IE]>
    <script type="text/javascript" src="/app/plugins/html5.js"></script>
    <script type="text/javascript" src="/app/plugins/excanvas.compiled.js"></script>
<![endif]-->
<script type="text/javascript" src="/app/ext-4.2.1/ext-lang-chinese.js"></script>
<script src="/page/vnc/script/util.js"></script>
</head>
<body>
<div class="wrap">
    <div class="vnc_top"  id="vnc_status_bar">
        <ul class="left_btn_wrap"><%--
            <li class="left_btn">
                <a class="vnc_btn">
                    <i class="btn_top_icon icon_operate"></i>
                    操作
                    <i class="btn_top_icon icon_arrow"></i>
                </a>
                <dl>
                    <dd><a id="connect_VM"  href="#"  onclick="javascript:operateVM(0)">连接终端</a></dd>
                    <dd><a id="disconnect_VM"  href="#"  onclick="javascript:operateVM(1)">断开连接</a></dd>
                </dl>
            </li>
            --%><li class="left_btn" id="left_btn">
                <a class="vnc_btn"><i class="btn_top_icon icon_send"></i><fmt:message key="send_order"/><i class="btn_top_icon icon_arrow"></i></a>
                <dl>
                    <dd><a href="#"   id ="sendKey_Alt_Del"  onclick="javacript:sendCtrlAltDel()">Ctrl+Alt+Del</a></dd>
                </dl>
            </li>
        </ul>
        <p class="vnc_title">${vncConfigModel.vncTitle}(<span id="vm_title"><fmt:message key="no_connect"/></span>)</p>
        <div class="right_btn_wrap" id="right_btn_wrap">
            <a id=""  href="#"  onclick="window.close()"><i class="btn_top_icon icon_connect"></i><fmt:message key="close_current_page"/></a>
            <a id="operate_conn_VM"  href="#"  onclick="javascript:operateVM(0)"><i class="btn_top_icon icon_connect"></i><fmt:message key="connect"/></a>
            <a id="operate_disc_VM"  href="#"  onclick="javascript:operateVM(1)"><i class="btn_top_icon icon_connect_stop"></i><fmt:message key="disconnect"/></a>
            <a onclick="javascript:refreshPage()" href="#" ><i class="btn_top_icon icon_refresh"></i><fmt:message key="refresh"/></a>
        </div>
    </div>
    <div class="main" id="vncBox">
        <canvas id="noVNC_canvas" width="1024px" height="800px">
            Canvas not supported.
        </canvas>
    </div>
</div>
</body>
  
    <div id="confirmDilog" class="dragHide"></div>
    <form name="refreshForm" action="" method="post">
        <input type="hidden" name="title"  value="${vncConfigModel.vncTitle}" />
        <input type="hidden" name="token"  value="${vncConfigModel.token}" />
        <input type="hidden" name="status"  value="${vncConfigModel.status}" />
        <input type="hidden" name="host"  value="${vncConfigModel.hostIp}" />
        <input type="hidden" name="port"  value="${vncConfigModel.hostPort}" />
    </form>
    
	<script>
	
	function refreshPage() {
		window.location.reload();
	/*var form = document.forms.refreshForm;
		var request_url = "";
	    var dataStr = "id=" + 'null' + "&operateType=" + 99;
		$.ajax({
        	url : request_url,
        	type : "POST",
        	data : dataStr, 
        	success : function(msg) {
        		var value = msg.trim().split(";");
        		form.status.value = value[0];
        		form.host.value = value[1];
				form.submit();
        	},
        	error : function(XMLHttpRequest, textStatus, errorThrown) {
        		alertMsg(1, 0);
        	}
        });*/
	}
	
        /*jslint white: false */
        /*global window, $, Util, RFB, */
        "use strict";

        // Load supporting scripts
        Util.load_scripts(["webutil.js", "base64.js", "websock.js", "des.js", "jquery.min.js",
                           "keysymdef.js", "keyboard.js", "input.js", "display.js",
                            "inflator.js","rfb.js","keysym.js"]);
       
        var rfb;
        var host, port, password, path, token;
        var resizeTimeout;
        //0:normal 1:fatal
        var connect_status;
        
        function passwordRequired(rfb) {
            $D('pass_required').style.display = "block";
        }
        
        function setPassword() {
            rfb.sendPassword($D('vnc_password_input').value);
            $D('vnc_password_input').value = "";
            $D('pass_required').style.display = "none";
        }
        
        function sendCtrlAltDel() {
            rfb.sendCtrlAltDel();
            return false;
        }
			       
        
        function operateVM(type) {
             
           //后期加上登录限制 
        	 switch (type) {
        			case 0: //连接
        			     initRFB();
	                    rfb.connect(host, port, password, path);
        				break;
        			case 1: //断开
        			     rfb.disconnect();
        			    break;
        			case 2: //刷新
        				if (connect_status == 1) {
        					rfb.connect(host, port, password, path);
        			     } else {
        					rfb.disconnect();
        				 }
        				break;
        			default:
        			    break;
        			}
	     }
        
        function xvpShutdown() {
            rfb.xvpShutdown();
            return false;
        }
        function xvpReboot() {
            rfb.xvpReboot();
            return false;
        }
        function xvpReset() {
            rfb.xvpReset();
            return false;
        }
        
        function updateState(rfb, state, oldstate, msg) {
            var level;
            var vmTitle=$D('vm_title');
            var operateConnType= $D('operate_conn_VM');
            var operateDiscType= $D('operate_disc_VM');
         
            switch (state) {
                case 'failed':
                    level = "error"; 
                    vmTitle.innerHTML = '<fmt:message key="connect_exception"/>';
                	operateConnType.style.display = "block";
                	operateDiscType.style.display = "none";
                	connect_status = 1;
                 break;
                case 'fatal':        
                	level = "error"; 
                	vmTitle.innerHTML = '<fmt:message key="connect_fail"/>';
                	operateConnType.style.display = "block";
                	operateDiscType.style.display = "none";
                	//operateType.innerHTML = '<i class="btn_top_icon icon_connect"></i>连接';
                	connect_status = 1;
                break;
                case 'normal':       
                	level = "normal";
                	var title = '<fmt:message key="connecting"/>';
                	vmTitle.innerHTML = title;
                	operateConnType.style.display = "none";
                	operateDiscType.style.display = "block";
                	//operateType.innerHTML = '<i class="btn_top_icon icon_connect"></i>断开';
                	connect_status = 0;
                break;
                case 'disconnected': 
                    if('failed'==oldstate)break;
                	level = "normal";
                	vmTitle.innerHTML = '<fmt:message key="connect_close"/>';
                	operateConnType.style.display = "block";
                	operateDiscType.style.display = "none";
                	//operateType.innerHTML = '<i class="btn_top_icon icon_connect"></i>连接';
                	connect_status = 1;
                break;
                case 'loaded':       
                	level = "normal";
                	vmTitle.innerHTML = '<fmt:message key="on_connect"/>';
                	operateConnType.style.display = "none";
                	operateDiscType.style.display = "block";
                	//operateType.innerHTML = '<i class="btn_top_icon icon_connect"></i>断开';
                	connect_status = 0;
                break;
                default:             
                	level = "warn";
                	operateConnType.style.display = "block";
                	operateDiscType.style.display = "none";
                    //operateType.innerHTML = '<i class="btn_top_icon icon_connect"></i>连接';
                    connect_status = 1;
                break;
            }
            
          if (typeof(msg) !== 'undefined'&& level!='normal') {
                // vmTitle.innerHTML = msg;
                //console.info(msg);
            }	
        }
        
        
        function UIresize() {
            if (WebUtil.getQueryVar('resize', true)) {
                var innerW = window.innerWidth;
                var innerH = window.innerHeight;
                var controlbarH = $D('vnc_status_bar').offsetHeight;
                var padding = 5;
                if (innerW !== undefined && innerH !== undefined)
                    rfb.setDesktopSize(innerW, innerH - controlbarH - padding);
            }
        }
        
         window.onresize = function () {
            // When the window has been resized, wait until the size remains
            // the same for 0.5 seconds before sending the request for changing
            // the resolution of the session
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function(){
                UIresize();
            }, 500);
        };
        
        function updateBarShow(){
        
        }
       
       function FBUComplete(rfb, fbu) {
            UIresize();
            rfb.set_onFBUComplete(function() { });
        }
       
        function xvpInit(ver) {
            var xvpbuttons;
            //xvpbuttons = $D('noVNC_xvp_buttons');
            if (ver >= 1) {
                //xvpbuttons.style.display = 'inline';
            } else {
                //xvpbuttons.style.display = 'none';
            }
        }
        
        function initRFB(){
              rfb = new RFB({
		              'target': $D('noVNC_canvas'),
		              'encrypt': WebUtil.getQueryVar('encrypt',(window.location.protocol === "https:")),
		              'repeaterID':   WebUtil.getQueryVar('repeaterID', ''),
		              'true_color':   WebUtil.getQueryVar('true_color', true),
		              'local_cursor': WebUtil.getQueryVar('cursor', true),
		              'shared':       WebUtil.getQueryVar('shared', true),
		              'view_only':    WebUtil.getQueryVar('view_only', false),
		              'onUpdateState':  updateState,
		              'onXvpInit':    xvpInit,
		              'onPasswordRequired':  passwordRequired,
		              'onFBUComplete': FBUComplete
		              });
        }
        
        
        window.onscriptsload = function () {
            WebUtil.init_logging(WebUtil.getQueryVar('logging', 'error'));
			host ="${vncConfigModel.hostIp}";
			port ="${vncConfigModel.hostPort}";

            // if port == 80 (or 443) then it won't be present and should be
            // set manually
            if (!port) {
                if (window.location.protocol.substring(0,5) == 'https') {
                    port = 443;
                }
                else if (window.location.protocol.substring(0,4) == 'http') {
                    port = 80;
                }
            }

            // If a token variable is passed in, set the parameter in a cookie.
            // This is used by nova-novncproxy.
           /*  token = WebUtil.getQueryVar('token', null);
            if (token) {
                WebUtil.createCookie('token', token, 1)
            } */

            password = WebUtil.getQueryVar('password', '');
            //path = WebUtil.getQueryVar('path', 'websockify');
            path = "websockify/?token=${vncConfigModel.token}";

            if ((!host) || (!port)) {
                updateState(null, 'fatal', null, 'Must specify host and port in URL');
                return;
            }
               initRFB();     
              rfb.connect(host, port, password, path);
             
            $(".vnc_btn").live("click",function(){
                 $(this).parent("li").toggleClass("active").siblings().removeClass("active");
            });
           //在其他地方点击，隐藏右键菜单
          $(document).bind('mousedown',function(e){
            //判断点击范围，不在文件或者不在右键菜单里面
            if($(e.target).parents(".left_btn_wrap").length == 0&&$(e.target).parents(".left_btn dl").length == 0){
                $(".left_btn").removeClass("active");
            }
        });
        };
      </script>
<script type="text/javascript"> 
if(navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion .split(";")[1].replace(/[ ]/g,"")=="MSIE8.0") 
{ 
	var vncBox=document.getElementById("vncBox");
	var rightBtn=document.getElementById("right_btn_wrap");
	var leftBtn=document.getElementById("left_btn");
	vncBox.style.background="none";
	rightBtn.style.display="none";
	leftBtn.style.display="none";
	vncBox.innerHTML="<div class='vnc_ie8'>你的浏览器版本太低，不能使用此功能，建议升级到IE8以上版本<div>"
} 
</script>
</body>
</html>
</fmt:bundle>