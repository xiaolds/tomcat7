/**
 * 全局常量的配置 by xuyingan
 */

var PASSWORD_MIN_LENGTH = 8;
var PASSWORD_MAX_LENGTH = 50;  

var PASSWORD_CHECK_TYPE_OF_NOT_CHECK = 0;
var PASSWORD_CHECK_TYPE_OF_LETTERS_AND_NUMBERS = 1;

var NO_OPERATION_TO_EXIT_SECOND = 5*60*1000;
var VNC_STATE_CHECK_TIMER_SECOND = 1*1000;
var SINGLE_LOGIN_TIMER_CHECK_SECOND = 5*1000;
var LOGOUT_DELAY_SECOND = 1*1000;
var MENU_SELECT_DELAY_SECOND = 500;
var GOTO_LOGIN_LINK_HREF = "/login.jsp";
var GOTO_HOME_LINK_HREF = "/page/backup/index.jsp";

var MSG_NORMAL = 30000;
var NORMAL = 1;
var NOT_NORMAL = 0;
var EMPTY = "";
var BLANK = " ";
var SEMICOLON = ";";
var COLON = ":";
var BAR = "-";
var TIME_PLACEHOLDER_ZERO = "0";
var BOOLEAN_FALSE_BINARY = '0';
var BOOLEAN_TRUE_BINARY = '1';

var MENU_SELECT_CLASSNAME = "ta active";

var ADMIN = "admin";
var SECURITY = "security";
var AUDITOR = "auditor";

var ADMIN_CN = local.admin;
var SECURITY_CN = local.security;
var AUDITOR_CN = local.auditor;

var REPORTLOG = "reportlog";
var SYSTEMCONFIG = "systemconfig";
var BACKUP = "backup";
var RECOVERY = "recovery";
var EMERGENCY = "emergency";
 
var TAG_A = 'a';
var TAG_BUTTON = 'button';
var XTYPE_BUTTON = TAG_BUTTON;

//计算节点及存储节点监控类型相关
var CPU_MONITOR = 1;    //CPU使用率监控
var MEMORY_MONITOR = 2;    //内存使用率监控
var NET_MONITOR = 3;    //网络使用率监控
var IO_MONITOR = 1;    //磁盘IO使用率监控

//计算节点及存储节点监控时间段
var AN_HOUR = 1;    //1小时
var SIX_HOUR = 6;    //6小时
var TWELVE_HOUR = 12;    //12小时