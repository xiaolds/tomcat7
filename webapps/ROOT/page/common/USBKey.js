/**
 * The USB-Key infomation  by xuyingan
 */

var USBKey = {
	/**
	 * init USB-Key
	 */
	create : function() {
		/**
		 * The USB-Key api interface
		 */
		this.USBKeyInterface = null;

		/**
		 * The USB-Key infomation, eg:HID and count in system, but private variabls
		 */
		this._USBKeyHID = null;
		this._USBKeyCount = 0;
		this._USBKeyVersion = null;
		this._username = null;
		this._password = null;

		/**
		 * The basic interface for ie and not ie, but private variables
		 */
		this.__BASIC_INTERFACE_IE = "ViKeyActiveX.ViKeyInterface.1"
		this.__BASIC_INTERFACE_NOT_IE = "ViKeyInterface";		
		
		/**
		 * The core infomation of USB-Key innner config, but private variable
		 */
		this._USBKeyLength = 0;
		this._USBKeyAddress = 0;
		this.__KEY_OF_GRANT_USER_LOGIN = "11111111";		
		
		/**
		 * The count of USB-Key in system, but private variables
		 */
		this.__ERROR_USBKEY_IN_SYSTEM = -1;
		this.__NONE_USBKEY_IN_SYSTEM = 0;
		this.__SINGLE_USBKEY_IN_SYSTEM = 1;
		this.__MULTIPLE_USBKEY_IN_SYSTEM = 2;
		
		/**
		 * The tips about USB-key infomation, but private variables
		 */
		this.__TIP_NO_USBKEY_CONTROL = local.tipInstallUKControl;
		this.__TIP_HEADER = local.window.tip;
		this.__TIP_SINGLE_IN_SYSTEM = local.tipSysHasUK;
		this.__TIP_MULTI_IN_SYSTEM = local.tipSysHasUKNum;
		this.__TIP_NO_IN_SYSTEM = local.tipSysNoUK;
		this.__TIP_USBKEY_SELF_FAIL = local.tipUKFailure;

		/**
		 * init USB-Key parameters used private method
		 */
		this._loadUSBKeyInterface();
	},

	/**
	 * load USB-Key interface include create usbkey tool, but private method
	 * 
	 * @returns {Boolean}
	 */
	_loadUSBKeyInterface : function() {
		try {
			if (document.implementation && document.implementation.createDocument && typeof XSLTProcessor != 'undefined') {
				this.USBKeyInterface = document.getElementById(this.__BASIC_INTERFACE_NOT_IE);
			} else {
				this.USBKeyInterface = new ActiveXObject(this.__BASIC_INTERFACE_IE);
			}
			this._USBKeyCount = this.USBKeyInterface.IVikeyFind();
		} catch (e) {
			Ext.Msg.alert(this.__TIP_HEADER, this.__TIP_NO_USBKEY_CONTROL);
			return false;
		}
		return true;
	},

	/**
	 * check USB-Key in system or not, and show message in specify form, return value: 1-single, 2-multiple, 0-none
	 * 
	 * @returns {Boolean}
	 */
	checkHasUSBKey : function() {
		var ViKeyIndex = 0;
		this._USBKeyCount = (this.USBKeyInterface==null) ? this.__NONE_USBKEY_IN_SYSTEM : this.USBKeyInterface.IVikeyFind();
		var FM = window.document.loginForm;
		if (this.USBKeyInterface.IViKeyGetError() == this.__NONE_USBKEY_IN_SYSTEM) {
			if (this._USBKeyCount == this.__SINGLE_USBKEY_IN_SYSTEM) {
				this._USBKeyHID = this.USBKeyInterface.IVikeyGetHID(ViKeyIndex);
				FM.edtResult.value = this.__TIP_SINGLE_IN_SYSTEM + this._USBKeyHID;
				return this.__SINGLE_USBKEY_IN_SYSTEM;
			} else {
				FM.edtResult.value = this.__TIP_MULTI_IN_SYSTEM + this._USBKeyCount;
				return this.__MULTIPLE_USBKEY_IN_SYSTEM;
			}
		} else {
			FM.edtResult.value = this.__TIP_NO_IN_SYSTEM;
			return this.__NONE_USBKEY_IN_SYSTEM;
		}
	},

	/**
	 * check USB-Key in system or not, return value: 1-single, 2-multiple, 0-none, -1-error
	 * 
	 * @returns {Boolean}
	 */
	hasUSBKey : function() {
		var ViKeyIndex = 0;
		try {
			this._USBKeyCount = (this.USBKeyInterface==null) ? this.__NONE_USBKEY_IN_SYSTEM : this.USBKeyInterface.IVikeyFind();
		} catch (e) {
			return this.__ERROR_USBKEY_IN_SYSTEM;
		}
		
		if (this.USBKeyInterface.IViKeyGetError() == this.__NONE_USBKEY_IN_SYSTEM) {
			if (this._USBKeyCount == this.__SINGLE_USBKEY_IN_SYSTEM) {
				this._USBKeyHID = this.USBKeyInterface.IVikeyGetHID(ViKeyIndex);
				return this.__SINGLE_USBKEY_IN_SYSTEM;
			} else {
				return this.__MULTIPLE_USBKEY_IN_SYSTEM;
			}
		} else {
			return this.__NONE_USBKEY_IN_SYSTEM;
		}
	},
	
	/**
	 * get USB-Key HID
	 * 
	 * @returns
	 */
	getUSBKeyHID : function() {
		return this._USBKeyHID;
	},
	
	/**
	 * get USB-Key count in system 
	 * @returns {Number}
	 */
	getUSBKeyCountInSystem : function() {
		return this._USBKeyCount;
	},
	
	/**
	 * get the name of user granted USB-Key
	 * @returns
	 */
	getUserName : function(){
		var ViKeyIndex = 0;
		this._USBKeyAddress = 0;
		this._USBKeyLength = 32;
		this._username	= this.USBKeyInterface.IVikeyReadData(ViKeyIndex, this._USBKeyAddress, this._USBKeyLength);
		if (this.USBKeyInterface.IViKeyGetError() !=0) {
			return null;
		} else {
			return this._username.trim();
		}
	},
	
	/**
	 * get the password of user granted USB-Key
	 * @returns
	 */
	getUserPassword : function(){
		var ViKeyIndex = 0;
		this._USBKeyAddress = 32;
		this._USBKeyLength = 32;
		this._password = this.USBKeyInterface.IVikeyReadData(ViKeyIndex, this._USBKeyAddress, this._USBKeyLength);
		if (this.USBKeyInterface.IViKeyGetError() !=0 ) {
			return null;
		} else {
			return this._password.trim();
		}
	},
	
	/**
	 * set the name of user granted USB-Key
	 * @param username
	 * @returns {Boolean}
	 */
	setUserName : function(username){
		var ViKeyIndex = 0;
		this._USBKeyAddress = 0;
		this._USBKeyLength = 16;
		this._username = username;		
		this.USBKeyInterface.IVikeyWriteData(ViKeyIndex, this._USBKeyAddress, this._USBKeyLength, username);
		if (this.USBKeyInterface.IViKeyGetError() ==0) {
			return true;
		} else {
			return false;
		}
	},
	
	/**
	 * set the password of user granted USB-Key
	 * @param password
	 * @returns {Boolean}
	 */
	setUserPassword : function(password){
		var ViKeyIndex = 0;
		this._USBKeyAddress = 32;
		this._USBKeyLength = 16;
		this._password = password;		
		this.USBKeyInterface.IVikeyWriteData(ViKeyIndex, this._USBKeyAddress, this._USBKeyLength, password);
		if (this.USBKeyInterface.IViKeyGetError() ==0) {
			return true;
		} else {
			return false;
		}
	},
	
	/**
	 * get the version of USB-Key
	 * @returns
	 */
	getVersion : function(){
		this._USBKeyVersion = this.USBKeyInterface.IGetVersion();
		if (this.USBKeyInterface.IViKeyGetError() ==0) {
			return this._USBKeyVersion;
		} else {
			return this.USBKeyInterface.IViKeyGetError();
		}
	},
	
	/**
	 * grant the authority of logining to user
	 */
	grantUserLogin : function() {
		var ViKeyIndex = 0;
		this.USBKeyInterface.IVikeyUserLogin(ViKeyIndex, this.__KEY_OF_GRANT_USER_LOGIN);	
		if(this.USBKeyInterface.IViKeyGetError() !=0)	
		{
			Ext.Msg.alert(this.__TIP_HEADER, this.__TIP_USBKEY_SELF_FAIL);
		}
	}
};

var USB_KEY = USBKey;
