/**
 * Regular Expression 验证工具集 by xuyingan
 */

/**
 * 电话格式合法
 * @param phoneText
 * @returns {Boolean}
 */
function isPhone(phoneText){
	var regExp = /^((\d{3,4}-)*\d{7,8}(-\d{3,4})*|1[3-8]\d{9})$/;
	var retBool = regExp.test(phoneText);
	return retBool;
}

/**
 * 电话格式不合法
 * @param phoneText
 * @returns {Boolean}
 */
function notPhone(phoneText){
	return !isPhone(phoneText); 
}

/**
 * IP格式合法
 * @param IPText
 * @returns {Boolean}
 */
function isIP(IPText){
	var regExp = /^((?:(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(?:25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d))))$/;
	var retBool = regExp.test(IPText);
	return retBool;
}

/**
 * IP格式不合法
 * @param IPText
 * @returns {Boolean}
 */
function notIP(IPText){
	return !isIP(IPText);
}

/**
 * 整型格式合法
 * @param intText
 * @returns
 */
function isInt(intText){
	var regExp = /^-?\d+$/;
	var retBool = regExp.test(intText);
	return retBool;
}

/**
 * 整型格式不合法
 * @param intText
 * @returns
 */
function notInt(intText){
	return !isInt(intText);
}

/**
 * 包含字母和数字
 * @param text
 * @returns
 */
function isIncludeLettersAndNumbers(text){
	var regExp = /^(?!\D+$)(?![^a-z]+$)[a-zA-Z\d]{0,}$/;
	var retBool = regExp.test(text);
	return retBool;
}

/**
 * 不包含字母和数字
 * @param text
 * @returns
 */
function notIncludeLettersAndNumbers(text){
	return !isIncludeLettersAndNumbers(text);
}

/**
 * validate the license-reg product-uuid rightful, written by xuyingan
 * 
 * @param pid
 * @returns
 */
function isLicenseProduct(pid) {
	var regExp = /^(ST|DT)[\-]\d{13}$/;
	var ret = regExp.test(pid);
	return ret;
}

/**
 * validate the license-reg product-uuid error, written by xuyingan
 * 
 * @param pid
 * @returns
 */
function notLicenseProduct(pid) {
	return !isLicenseProduct(pid);
}


/**
 * validate the legal path in linux, written by xuyingan
 * 
 * @param path
 * @returns
 */
function isLinuxPath(path) {
	var regExp = /^(\/([0-9a-zA-Z]+))+$/;
	return regExp.test(path);
}

/**
 * validate the illegal path in linux, written by xuyingan
 * 
 * @param path
 * @returns
 */
function notLinuxPath(path) {
	return !isLinuxPath(path);
}


