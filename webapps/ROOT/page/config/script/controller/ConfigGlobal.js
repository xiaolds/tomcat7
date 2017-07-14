/**
 * 设置模块的全局变量 by xuyingan
 */

var ERROR_LOGIN_MIN_COUNT = 3;
var ERROR_LOGIN_MAX_COUNT = 20;

var LOCK_LOGIN_MIN_MINUTE = 1;
var LOCK_LOGIN_MAX_MINUTE = 1000;

var PASSWORD_OUTDATE_MIN_DAY = 1;
var PASSWORD_OUTDATE_MAX_DAY = 1000;

var DONE_OPEN = local.turned;
var DONE_CLOSE = local.closed;
var NOT_CONFIG = local.unconfig;
var DONE_CONFIG = local.configed;
var NOT_EXPORT = local.unexport;
var ENABLE = local.enable;
var DISABLE = local.disabled;

var DEVICE = "device";
var STONODE = "stonode";
var CALNODE = "calnode";

var MSG = "msg";
var SMS = "sms";
var MAIL = "mail";


var PHONE_REGEX = /^(1[3-8]\d{9})$/;
var All_PHONE_REGEX = /^((\d{3,4}-)*\d{7,8}(-\d{3,4})*|1[3-8]\d{9})$/;
var TEXT_REGEX = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
var PATH_LINUX_REGEX = /^(\/([0-9a-zA-Z]+))+$/;
var NORMAL_NAME_REGEX = /^[\u4e00-\u9fa5_a-zA-Z0-9_]{1,12}$/;


var REQUIRED_ASTERISK = "*";
var LICENSE_PIDS_SPLIT = ",";
var LICENSE_PRODUCT_LENGTH = 16;
var LICENSE_BASIC_PRODUCT_TAG = "DT";
var LICNSE_EXTEND_PRODUCT_TAG = "ST";
var LICENSE_DESC_PIDS_SPLIT = ':';
var LICENSE_DESC_VALUE_SPLIT = '#';
var LICENSE_DESC_BOOLEAN_TYPE = 0;
var LICENSE_DESC_NOT_BOOLEAN_TYPE = 1;


var PASSWORD_TYPE_LOGIN = 0;
var USBKEY_TYPE_LOGIN = 1;
var BOTH_TYPE_LOGIN = 2;
var USBKEY_DESC = "USB-KEY";
var PASSWORD_DESC =local.backup.password;
var PASSWORD_OR_USBKEY_DESC = local.passUSBKEY;



