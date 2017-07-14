/**
 * PowerOperation infomation  by xuyingan
 */

var PowerOperation = {
	/**
	 * init operation about power
	 */
	create : function() {
		/**
		 * The property of power controller
		 */
		this.POWER_PROPERTY = 'itemId';

		/**
		 * The default dom in the gridpanel column
		 */
		this.GRIDPANEL_DEFAULT_DOM_TAG = 'a';

		/**
		 * The default xtype in the panel
		 */
		this.PANEL_DEFAULT_BUTTON_XTYPE = 'button';

		/**
		 * The beginning of powerkey string as type tags, but private variables
		 */
		this.__POWER_SYSTEMCONFIG_TAG = 'systemconfig_';
		this.__POWER_BACKUP_TAG = 'backup_';
		this.__POWER_RECOVERY_TAG = 'recovery_';
		this.__POWER_REPORTLOG_TAG = 'reportlog_';
		this.__POWER_EMERGENCY_TAG = 'emergency_';

		/**
		 * The special doms need a unique disposal in html
		 */
		this.HTML_SPECIAL_TAG = 'span';
		
		/**
		 * The special widgets need a unique disposal in extjs
		 */
		this.EXTJS_SPECIAL_WIDGET_ACTIONCOLUMN = 'actioncolumn';
		this.EXTJS_SPECIAL_WIDGET_PANEL = 'panel';
		
		/**
		 * The delay time of render
		 */
		if (navigator.userAgent.indexOf("Firefox")>0) {
			this.__TIME_DELAY_RENDER = 100;
		} else {
			this.__TIME_DELAY_RENDER = 0;
		}
		
	},

	/**
	 * filter widgets of extjs for power limit used name of widget, eg: 'button'
	 * 
	 * @param panel
	 *            panel or panelID
	 * @param power
	 * @param widgetName
	 *            default name of parameter is Xtype 'button'
	 */
	filterEnableWidgetsOfExtjs : function(panel, power, widgetName) {
		var _panel;
		var _widgetName = this.PANEL_DEFAULT_BUTTON_XTYPE;
		if (notNull(widgetName)) {
			_widgetName = widgetName.trim();
		}
		if (typeof panel == 'object') {
			_panel = panel;
		} else if (typeof panel == 'string') {
			_panel = Ext.getCmp(panel);
		} else {
			return;
		}		
		var widgets;
		if (widgetName == this.EXTJS_SPECIAL_WIDGET_ACTIONCOLUMN) {
			widgets = _panel.query(this.EXTJS_SPECIAL_WIDGET_ACTIONCOLUMN)[0].items;
		} else {
			widgets = _panel.query(_widgetName + '[' + this.POWER_PROPERTY + ']');
		}		
		this._renderPageWidgetsInPower(widgets, power, widgetName);				
	},

	/**
	 * filter doms of property as 'html' in extjs for power limit used name of
	 * dom, eg: 'button'
	 * 
	 * @param panel
	 *            panel or panelID
	 * @param power
	 * @param domName
	 *            default name of parameter is Tag 'a'
	 * 
	 */
	filterEnableDomsInHtmlOfExtjs : function(panel, power, domName) {
		var _domName = this.GRIDPANEL_DEFAULT_DOM_TAG;
		if (notNull(domName)) {
			_domName = domName.trim();
		}
		var _panelID;
		if (typeof panel == 'object') {
			_panelID = panel.id;
		} else if (typeof panel == 'string') {
			_panelID = panel;
		} else {
			return;
		}
		var doms = Ext.get(_panelID).query(_domName);
		if (_domName == this.HTML_SPECIAL_TAG) {
			this._renderPageSpansInPower(doms, power);
		} else {
			this._renderPageDomsInPower(doms, power);
		}
		
	},

	/**
	 * filter doms of gridpanel column in extjs for power limit used name of
	 * dom, eg: 'a'
	 * 
	 * @param panel
	 *            panel or panelID
	 * @param power
	 * @param domName
	 *            default name of parameter is Tag 'a'
	 */
	filterEnableDomsInGridpanelColumnOfExtjs : function(panel, power, domName) {
		var _domName = this.GRIDPANEL_DEFAULT_DOM_TAG;
		if (notNull(domName)) {
			_domName = domName.trim();
		}
		var _panelID;
		if (typeof panel == 'object') {
			_panelID = panel.id;
		} else if (typeof panel == 'string') {
			_panelID = panel;
		} else {
			return;
		}
		var self = this;
		delay(this.__TIME_DELAY_RENDER, function() {
			var doms = Ext.get(_panelID).query(_domName);
			self._renderPageDomsInPower(doms, power);
		});
	},

	/**
	 * filter items of menu in extjs for power limit
	 * 
	 * @param menu
	 *            menuid or menu
	 * @param power
	 */
	filterEnableMenuOfExtjs : function(menu, power) {
		var _menu;
		if (typeof menu == 'object') {
			_menu = menu;
		} else if (typeof menu == 'string') {
			_menu = Ext.getCmp(menu);
		} else {
			return;
		}
		var items = _menu.query('[' + this.POWER_PROPERTY + ']');
		this._renderPageWidgetsInPower(items, power);
	},
	

	/**
	 * filter treepanel treenode for power limit
	 * 
	 * @param treepanel
	 *            treepanelid or treepanel
	 * @param power
	 */
	filterEnableTreePanel : function(treepanel, power) {
		var _treepanel;
		if (typeof treepanel == 'object') {
			_treepanel = treepanel;
		} else if (typeof treepanel == 'string') {
			_treepanel = Ext.getCmp(treepanel);
		} else {
			return ;
		}
		if (isNull(power)) {			
			_treepanel.hide();
			return ;
		}
		var delnodes = [];
		this._renderTreeNodeInPower(_treepanel.getRootNode(), delnodes, power);
		for (var i = 0; i < delnodes.length; i++) {
			_treepanel.getStore().getNodeById(delnodes[i]).remove();
		}
	},
	
	/**
	 * judge widget has specifed power by itemId
	 * 
	 * @param widget
	 * @param power
	 */
	hasSpecifiedPower : function(widget, power) {
		if (isNull(widget) || isNull(power)) {
			return false;
		} 
		var _itemId;
		if (typeof widget == 'object') {
			_itemId = widget.query('[' + this.POWER_PROPERTY + ']')[0].itemId;
		} else if (typeof widget == 'string') {
			_itemId = widget.trim();
		} else {
			return false;
		}
		var len = power.length;
		if (0 == len) {
			return false;
		}
		for (var i=0; i < len; i++) {
			if (_itemId == power[i].trim()) {
				return true;
			}
		}
		return false;
	},
	
	/**
	 * render doms in page for power limit, but private method
	 * 
	 * @param doms
	 * @param power
	 */
	_renderPageDomsInPower : function(doms, power) {
		var isEmptyPower;
		if (isNull(power)) {
			isEmptyPower = true;
		}
		for (var d in doms) {
			var isRegularKey = this._isRegularPowerkey(doms[d].name);
			if (isEmptyPower) {
				if (isRegularKey) {
					//doms[d].style.display = 'none';
					//doms[d].remove();
					removeElement(doms[d]);
				}
			} else {
				var count = 0;
				for (var i = 0; i < power.length; i++) {					
					if (this._isRegularPowerkey(doms[d].name) && doms[d].name.trim() != power[i].trim()) {
						++count;
					}
				}
				if (count == i) {
					//doms[d].style.display = 'none';		
					//doms[d].remove();
					removeElement(doms[d]);
				}
			}

		}
	},

	/**
	 * render doms 'span' in page for power limit, but private method, as a special method for Tag 'span'
	 * 
	 * @param doms
	 * @param power
	 */
	_renderPageSpansInPower : function(doms, power) {
		var isEmptyPower;
		if (isNull(power)) {
			isEmptyPower = true;
		}
		for ( var d in doms) {
			var isRegularKey = this._isRegularPowerkey(doms[d].lang);
			if (isEmptyPower) {
				if (isRegularKey) {
					doms[d].style.display = 'none';
				}
			} else {
				var count = 0;
				for (var i = 0; i < power.length; i++) {					
					if (this._isRegularPowerkey(doms[d].lang) && doms[d].lang.trim() != power[i].trim()) {
						++count;
					}
				}
				if (count == i) {
					doms[d].style.display = 'none';					
				}
			}

		}
	},
	
	/**
	 * render widgets in page for power limit, but private method
	 * 
	 * @param widgets
	 * @param power
	 * @param widgetName
	 */
	_renderPageWidgetsInPower : function(widgets, power, widgetName) {
		var isEmptyPower;
		if (isNull(power)) {
			isEmptyPower = true;
		}
		for (var w in widgets) {
			if (isEmptyPower) {
				if (notNull(widgetName) && widgetName == this.EXTJS_SPECIAL_WIDGET_PANEL) {
					widgets[w].hide();
				} else {
					widgets[w].disable();
				}				
			} else {
				var count = 0;
				for (var i = 0; i < power.length; i++) {
					var itemID = isNull(widgets[w].itemId) ? EMPTY : widgets[w].itemId.trim();					
					if (itemID != power[i].trim()) {
						++count;
					}
				}
				if (count == i) {
					if (notNull(widgetName) && widgetName == this.EXTJS_SPECIAL_WIDGET_PANEL) {
						widgets[w].hide();
					} else if (!widgets[w].disabled) {						
						widgets[w].disable();
					}					
				} 
			}
		}
	},
	
	/**
	 * render treenode for power limit, but private method
	 * 
	 * @param root
	 * @param delnodes
	 * @param power
	 */
	_renderTreeNodeInPower : function(root, delnodes, power) {
		var childnodes = root.childNodes;
		if(isNull(childnodes)) {
			return ;
		}
		var rootnum = 0;
	    for (var i = 0; i < childnodes.length; i++) {	    	
	        var node = childnodes[i];
	        if(isNull(node)) {
	        	continue;
	        }
	        var data = node.data;
	        if(data.leaf) {
	        	var count = 0;
	        	var leafID = data.id.trim();	        	
	        	for (var j = 0; j < power.length; j++) {
	        		if (leafID != power[j].trim()) {
	        			++count;
	        		}
	        	}
	        	if (count == j) {
	        		delnodes.push(leafID);
	        		++rootnum;	        		
	        		if (rootnum == childnodes.length) {
	        			delnodes.push(node.parentNode.data.id.trim());
	        		}	        		
	        	}
	        }  
	        if(node.childNodes.length > 0) {  
	        	this._renderTreeNodeInPower(node, delnodes, power);    
	        } 	        
	    }
	},
	
	/**
	 * check regular powerkey, but private method
	 * 
	 * @param powerkey
	 * @returns {Boolean}
	 */
	_isRegularPowerkey : function(powerkey) {
		if (isNull(powerkey)) {
			return false;
		}
		powerkey = powerkey.trim();
		if (powerkey.indexOf(this.__POWER_SYSTEMCONFIG_TAG) == 0) {
			return true;
		}
		if (powerkey.indexOf(this.__POWER_BACKUP_TAG) == 0) {
			return true;
		}
		if (powerkey.indexOf(this.__POWER_RECOVERY_TAG) == 0) {
			return true;
		}
		if (powerkey.indexOf(this.__POWER_REPORTLOG_TAG) == 0) {
			return true;
		}
		if (powerkey.indexOf(this.__POWER_EMERGENCY_TAG) == 0) {
			return true;
		}
		return false;
	}
};

var POWER_OP = PowerOperation;
POWER_OP.create();
