/**
 * CurrentUser infomation  by xuyingan
 */

/**
 * The basic object for inherit
 */
var object = {
		isA: function(aBase){
			var self = this;
			while(self){
				if(self==aBase){
					return true;
				}else{
					self = self.Type;
				}
			}
			return false;
		}
};


/**
 * The funtion in prototype mode of disguise
 * @param aBaseClass 
 * @param aClassDefine
 * @returns {_class}
 */
function Class(aBaseClass, aClassDefine){
	function _class(){
		this.Type = aBaseClass;
		for(var prop in aClassDefine){
			this[prop] = aClassDefine[prop];
		}
	}
	_class.prototype = aBaseClass;
	return new _class();
}

/**
 * The general account
 */
var Account = {
		/**
		 * init account basic infomation
		 * @param user
		 * @param args
		 */
		create: function(user, args){
			/**
			 * init account infomation used parameter as 'user'
			 */
			this._user = user;
			this._userid = user.userId;
			this._username = user.userName;
			/**
			 * init account infomation used parameter as 'args'
			 */
			this.args = args;
		},
		
		/**
		 * get username of the account
		 * @returns
		 */
		getUserName: function(){
			return this._username;
		},
		
		/**
		 * get userid of the account
		 * @returns
		 */
		getUserID: function(){
			return this._userid;
		},
		
		/**
		 * get user information
		 * @returns
		 */
		getUser: function(){
			return this._user;
		}
}


/**
 * The account of specified role with certain power
 */
var RoleAccount = Class(Account, {
	/**
	 * init account in certain role  
	 * @param user
	 * @param power
	 * @param args
	 */
	create: function(user, power, args){
		/**
		 * inherit Account 
		 */
		Account.create.call(this, user, args);
		/**
		 * init role information
		 */
		this._role = user.role;
		this._roleid = user.role.roleId;
		this._rolename = user.role.roleName;
		
		/**
		 * init power of account used parameter as 'power'
		 */
		this._power = power;
	},
	
	/**
	 * get name of the role
	 * @returns
	 */
	getRoleName: function(){
		return this._rolename;
	},
	
	/**
	 * get id of the role
	 * @returns
	 */
	getRoleID: function(){
		return this._roleid;
	},
	
	/**
	 * set power of account
	 * @param power
	 */
	setPower: function(power){
		this._power = power;
	},
	
	/**
	 * classify power used certain key, but private method
	 * @param power
	 * @param keyClassify
	 * @returns
	 */
	_classifyPower: function(power, keyClassify){
		var powerClassify = null;
		for ( var i = 0; i < power.length; i++) {
			var powerTrim = power[i].trim();
			if (powerTrim.indexOf(keyClassify) == 0) {
				if (null == powerClassify) {
					powerClassify = new Array();
				}
				powerClassify.push(powerTrim);
			}
		}
		return powerClassify;
	},
	
	/**
	 * get power of the backup module
	 * @returns
	 */
	getBackupPower : function() {
		return this._classifyPower(this._power, BACKUP);
	},
	
	/**
	 * get power of the recovery module
	 * @returns
	 */
	getRecoveryPower : function() {
		return this._classifyPower(this._power, RECOVERY);
	},
	
	/**
	 * get power of reportlog module
	 * @returns
	 */
	getReportlogPower : function() {
		return this._classifyPower(this._power, REPORTLOG);
	},
	
	/**
	 * get power of system module
	 * @returns
	 */
	getSystemPower : function() {
		return this._classifyPower(this._power, SYSTEMCONFIG);
	},
	
	/**
	 * get power of emergency module
	 */
	getEmergencyPower : function() {
		return this._classifyPower(this._power, EMERGENCY);
	}
});


/**
 * The account of specified role with certain power including using three-managers mode or not
 */
var ThreeModeAccount = Class(RoleAccount, {
	/**
	 * init account in certain role using three-managers mode
	 * @param user
	 * @param power
	 * @param isThreeMode
	 * @param args
	 */
	create: function(user, power, isThreeMode, args){
		/**
		 * inherit RoleAccount 
		 */
		RoleAccount.create.call(this, user, power, args);
		/**
		 * init three-managers mode information
		 */
		this._isThreeMode = isThreeMode;
		
	},
	/**
	 * has used three-managers mode or not
	 * @returns
	 */
	isThreeMode : function() {
		if (isNull(this._isThreeMode)) {
			return false;
		}
		return this._isThreeMode;
	}

});


/**
 * The basic infomation of current login user 
 */
var CURRENT_USER = ThreeModeAccount;
