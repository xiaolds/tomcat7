/**
 * author:Mr.Wang
 */

Ext.define('dz.dz_util.textFieldWithButton', {
	extend : 'Ext.form.Trigger',
	alias : 'widget.textFieldWithButton',
	validationEvent : false,
	validateOnBlur : false,
	emptyText : '',
	trigger1Class : 'x-form-clear-trigger',
	trigger2Class : 'dzx-form-search-trigger',
	hideTrigger1 : true,
	width : 180,
	hasHidden : false,
	hiddenName : '',
	hiddenValue : '',
	hiddenId : '',
	clickShow : true,// 默认值true弹出选择的窗口,如果不需要弹出需要设置成false
	clickShow1 : this.clickShow,
	clickShowSwitch : true,// 如果设置false时clickShow全部失效
	handler : function() {
	},
	onTrigger1Click : function() {
	},
	onTrigger2Click : function() {

	},
	setHiddenValue : function(v) {
		Ext.getCmp(this.hiddenId).setValue(v);
		return v;
	},
	getHiddenValue : function() {
		return Ext.getCmp(this.hiddenId).getValue();
	},
	onRender : function(ct, position) {
		dz.dz_util.textFieldWithButton.superclass.onRender.call(this, ct,
				position);
		if (this.hasHidden) {
			var tt = this.findParentByType('form');
			var hidden = new Ext.form.Hidden({
				id : this.hiddenId,
				name : this.hiddenName,
				value : this.hiddenValue

			});
			tt.add(hidden);
			tt.doLayout();
			this.hiddenId = hidden.getId();
		}
	},
	initEvents : function() {
		dz.dz_util.textFieldWithButton.superclass.initEvents.call(this);
		this.el.on('click', function() {
			if (this.clickShow && this.clickShowSwitch) {
				this.handler();
			}
		}, this);
	},
	initComponent : function() {
		this.onTrigger2Click = this.handler;
		dz.dz_util.textFieldWithButton.superclass.initComponent.call(this);
	},
	hideTriggerButton : function() {
		this.clickShow1 = this.clickShow;
		this.clickShow = false;
		this.getTrigger(1).hide();
	},
	showTriggerButton : function() {
		this.clickShow = this.clickShow1;
		this.getTrigger(1).show();
	}
});

Ext.define(
				'Ext.form.WMTextField',
				{
					extend : Ext.form.TextField,
					alias : 'widget.WMTextField',
					initComponent : function() {
						Ext.form.TextField.superclass.initComponent.call(this);
						this.addEvents('autosize', 'keydown', 'keyup',
								'keypress', 'dblclick');
					},
					initEvents : function() {
						Ext.form.TextField.superclass.initEvents.call(this);
						if (this.validationEvent == 'keyup') {
							this.validationTask = new Ext.util.DelayedTask(
									this.validate, this);
							this.mon(this.el, 'keyup', this.filterValidation,
									this);
						} else if (this.validationEvent !== false) {
							this.mon(this.el, this.validationEvent,
									this.validate, this, {
										buffer : this.validationDelay
									});
						}
						if (this.selectOnFocus || this.emptyText) {
							this.on('focus', this.preFocus, this);

							this.mon(this.el, 'mousedown', function() {
								if (!this.hasFocus) {
									this.el.on('mouseup', function(e) {
										e.preventDefault();
									}, this, {
										single : true
									});
								}
							}, this);

							if (this.emptyText) {
								this.on('blur', this.postBlur, this);
								this.applyEmptyText();
							}
						}
						if (this.maskRe
								|| (this.vtype
										&& this.disableKeyFilter !== true && (this.maskRe = Ext.form.VTypes[this.vtype
										+ 'Mask']))) {
							this
									.mon(this.el, 'keypress', this.filterKeys,
											this);
						}
						if (this.grow) {
							this.mon(this.el, 'keyup', this.onKeyUpBuffered,
									this, {
										buffer : 50
									});
							this.mon(this.el, 'click', this.autoSize, this);
						}
						if (this.enableKeyEvents) {
							this.mon(this.el, 'keyup', this.onKeyUp, this);
							this.mon(this.el, 'keydown', this.onKeyDown, this);
							this
									.mon(this.el, 'keypress', this.onKeyPress,
											this);
						}
						this.mon(this.el, 'dblclick', this.onDblClick, this);
					},

					// private
					onDblClick : function(e) {
						showWinForTextFieldToBigger(this);
						alert("xx");
					}
				});

//搜索组件
Ext.define('Ext.ux.form.SearchField', {
	extend : 'Ext.form.field.Trigger',
	alias : 'widget.searchfield',
	trigger1Cls : Ext.baseCSSPrefix + 'form-clear-trigger',
	trigger2Cls : Ext.baseCSSPrefix + 'form-search-trigger',
	hasSearch : false,
	paramName : 'query',
	initComponent : function() {
		var me = this;
		me.callParent(arguments);
		me.on('specialkey', function(f, e) {
			if (e.getKey() == e.ENTER) {
				me.onTrigger2Click();
			}
		});
		me.store.remoteFilter = true;
		if (!me.store.proxy.hasOwnProperty('filterParam')) {
			me.store.proxy.filterParam = me.paramName;
		}
		me.store.proxy.encodeFilters = function(filters) {
			return filters[0].value;
		}
	},
	afterRender : function() {
		this.callParent();
		this.triggerCell.item(0).setDisplayed(false);
	},
	onTrigger1Click : function() {
		var me = this;
		if (me.hasSearch) {
			me.setValue('');
			me.store.clearFilter();
			me.hasSearch = false;
			me.triggerCell.item(0).setDisplayed(false);
			me.updateLayout();
		}
	},
	onTrigger2Click : function() {
		var me = this, value = me.getValue();
		if (value.length > 0) {
			me.store.filter({
				id : me.paramName,
				property : me.paramName,
				value : value
			});
			me.hasSearch = true;
			me.triggerCell.item(0).setDisplayed(true);
			me.updateLayout();
		}
	}
});

Ext.define('Ext.ux.grid.feature.Searching', {  
    extend: 'Ext.grid.feature.Feature',  
    alias: 'feature.searching',  
    searchText:'查询',  
    searchTipText:'输入关键字回车查询',  
    selectAllText:'所有列',  
    position:'top',  
    iconCls: 'Zoom',  
    checkIndexes:'all',  
    disableIndexes:[],  
    dateFormat:undefined,  
    showSelectAll:true,  
    menuStyle:'checkbox',  
    minChars: 2,  
    minCharsTipText:'至少输入{0}个字符',  
    mode:'remote',  
    width:100,  
    paramNames: {  
         fields:'fields' 
        ,query:'query' 
    },  
    shortcutKey:'r',  
    shortcutModifier:'alt',  
    align:'left',  
    minLength: 2,  
    init: function (grid) {  
        this.grid = grid;  
        if (this.grid.rendered)  
            this.onRender();  
        else 
            this.grid.on('render', this.onRender, this);  
    },  
 
    onRender:function() {  
          
        var panel = this.toolbarContainer || this.grid;  
        var tb = 'bottom' === this.position ? panel.getDockedItems('toolbar[dock="bottom"]') : panel.getDockedItems('toolbar[dock="top"]');  
        if(tb.length > 0)  
            tb = tb[0]  
        else {  
            tb = Ext.create('Ext.toolbar.Toolbar', {dock: this.position});  
            panel.addDocked(tb);  
        }  
 
        this.menu = Ext.create('Ext.menu.Menu');  
 
        if('right' === this.align) {  
            tb.add('->');  
        }  
        else {  
            if(0 < tb.items.getCount()) {  
                tb.add('-');  
            }  
        }  
 
        tb.add({  
             text:this.searchText  
            ,menu:this.menu  
            ,iconCls:this.iconCls  
        });  
 
        this.field = Ext.create('Ext.form.TwinTriggerField', {  
            width:this.width,  
            qtip: 'ddd',  
            selectOnFocus:undefined === this.selectOnFocus ? true : this.selectOnFocus,  
            triggerCls: 'x-form-clear-trigger',  
            onTrigger1Click: Ext.bind(this.onTriggerClear, this),  
            minLength:this.minLength  
        });  
          
        this.field.on('render', function() {  
              
            var qtip = this.minChars ? Ext.String.format(this.minCharsTipText, this.minChars) : this.searchTipText;  
            Ext.QuickTips.register({  
                target: this.field.inputEl,  
                text: qtip  
            });  
              
            if(this.minChars) {  
                this.field.el.on({scope:this, buffer:300, keyup:this.onKeyUp});  
            }  
 
            var map = new Ext.KeyMap(this.field.el, [{  
                 key:Ext.EventObject.ENTER  
                ,scope:this 
                ,fn:this.onTriggerSearch  
            },{  
                 key:Ext.EventObject.ESC  
                ,scope:this 
                ,fn:this.onTriggerClear  
            }]);  
            map.stopEvent = true;  
        }, this, {single:true});  
 
        tb.add(this.field);  
 
        this.reconfigure();  
 
        if(this.shortcutKey && this.shortcutModifier) {  
            var shortcutEl = this.grid.getEl();  
            var shortcutCfg = [{  
                 key:this.shortcutKey  
                ,scope:this 
                ,stopEvent:true 
                ,fn:function() {  
                    this.field.focus();  
                }  
            }];  
            shortcutCfg[0][this.shortcutModifier] = true;  
            this.keymap = new Ext.KeyMap(shortcutEl, shortcutCfg);  
        }  
 
        if(true === this.autoFocus) {  
            this.grid.store.on({scope:this, load:function(){this.field.focus();}});  
        }  
    }
    ,onKeyUp:function() {  
        var length = this.field.getValue().toString().length;  
        if(0 === length || this.minChars <= length) {  
            this.onTriggerSearch();  
        }  
    }
    ,onTriggerClear:function() {  
        if (this.field.getValue()) {  
            this.field.setValue('');  
            this.field.focus();              
            this.onTriggerSearch();  
        }  
    } 
    ,onTriggerSearch:function() {  
        if(!this.field.isValid()) {  
            return;  
        }  
        var val = this.field.getValue(),  
            store = this.grid.store,  
            proxy = store.getProxy();  
 
        if('local' === this.mode) {  
            store.clearFilter();  
            if(val) {  
                store.filterBy(function(r) {  
                    var retval = false;  
                    this.menu.items.each(function(item) {  
                        if(!item.checked || retval) {  
                            return;  
                        }  
                        var rv = r.get(item.dataIndex);  
                        rv = rv instanceof Date ? Ext.Date.format(rv, this.dateFormat || r.fields.get(item.dataIndex).dateFormat) : rv;  
                        var re = new RegExp(val, 'gi');  
                        retval = re.test(rv);  
                    }, this);  
                    if(retval) {  
                        return true;  
                    }  
                    return retval;  
                }, this);  
            }  
            else {  
            }  
        }  
        else if(proxy instanceof Ext.data.proxy.Server) {  
            if(store.lastOptions && store.lastOptions.params) {  
                store.lastOptions.params[store.paramNames.start] = 0;  
            }  
 
            var fields = [];  
            this.menu.items.each(function(item) {  
                if(item.checked && item.dataIndex) {  
                    fields.push(item.dataIndex);  
                }  
            });  
 
            delete(proxy.extraParams[this.paramNames.fields]);  
            delete(proxy.extraParams[this.paramNames.query]);  
            if (store.lastOptions && store.lastOptions.params) {  
                delete(proxy.lastOptions.params[this.paramNames.fields]);  
                delete(proxy.lastOptions.params[this.paramNames.query]);  
            }  
            if(fields.length) {  
                proxy.extraParams[this.paramNames.fields] = (fields);  
                proxy.extraParams[this.paramNames.query] = (val);  
            }  
 
        
            store.load();  
        }  
 
    }
    ,setDisabled:function() {  
        this.field.setDisabled.apply(this.field, arguments);  
    } 
    ,enable:function() {  
        this.setDisabled(false);  
    } 
    ,disable:function() {  
        this.setDisabled(true);  
    } 
    ,reconfigure:function() {  
        var menu = this.menu;  
        menu.removeAll();  
 
        if(this.showSelectAll && 'radio' !== this.menuStyle) {  
            menu.add({  
                xtype: 'menucheckitem',  
                text:this.selectAllText,  
                checked:!(this.checkIndexes instanceof Array),  
                hideOnClick:false,  
                handler:function(item) {  
                    var checked = item.checked;  
                    item.parentMenu.items.each(function(i) {  
                        if(item !== i && i.setChecked && !i.disabled) {  
                            i.setChecked(checked);  
                        }  
                    });  
                }  
            },'-');  
        }  
 
        var columns = this.grid.headerCt.items.items;  
        var group = undefined;  
        if('radio' === this.menuStyle) {  
            group = 'g' + (new Date).getTime();      
        }  
          
        Ext.each(columns, function(column) {  
            var disable = false;  
            if(column.text && column.dataIndex && column.dataIndex != '') {  
                Ext.each(this.disableIndexes, function(item) {  
                    disable = disable ? disable : item === column.dataIndex;  
                });  
                if(!disable) {  
                    menu.add({  
                        xtype: 'menucheckitem',  
                        text: column.text,  
                        hideOnClick: false,  
                        group:group,  
                        checked: 'all' === this.checkIndexes,  
                        dataIndex: column.dataIndex
                    });  
                }  
            }  
        }, this);  
        if(this.checkIndexes instanceof Array) {  
            Ext.each(this.checkIndexes, function(di) {  
                var item = menu.items.findBy(function(itm) {  
                    return itm.dataIndex === di;  
                });  
                if(item) {  
                    item.setChecked(true, true);  
                }  
            }, this);  
        }  
        if(this.readonlyIndexes instanceof Array) {  
            Ext.each(this.readonlyIndexes, function(di) {  
                var item = menu.items.findBy(function(itm) {  
                    return itm.dataIndex === di;  
                });  
                if(item) {  
                    item.disable();  
                }  
            }, this);  
        }  
 
    } 
 
});  
