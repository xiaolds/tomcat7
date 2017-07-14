
/**
 * author:王尔堃 
 * description:Tree
 * 
 */
var store = Ext.create('Ext.data.TreeStore', {
			proxy : {
				type : 'ajax',
				url : '/backup/todeviceAction!getDevicesTree.action',
				reader : {
					type : 'json'
					/*	root:'treeList'*/
				}
			},
			root : {
				text : '根节点',
				expanded : true
			}
		});

var tree = Ext.define('datasure.ui.grobleTreePanel', {
	extend : 'Ext.tree.TreePanel',
	alias : 'widget.grobleTreePanel',
	region : 'west',
	split : true,
	width : 198,
	height : 625,
	useArrows : true,//使用箭头
	animCollapse : true,
	autoScroll : true,
	rootVisible : false, //默认不显示根节点
	store : store,
	viewConfig : {
		plugins : {
			ptype : 'treeviewdragdrop',
			appendOnly : false
		}
	},
	collapsible : true
		//是否可以折叠  
	});
	
/**
 * author:王尔堃 
 * description:Grid
 * 
 */
	
	 var store = Ext.create('Ext.data.Store', {
                fields: ["cataId", "cataNo", "cataRemark", "cataTitle", "cataObjectName", "cataeditstatusName",
                     "cataPublishName", "cataEndDate", "holyUpdateTime", "catapushtime"],
                pageSize: 20,  //页容量5条数据
                //是否在服务端排序 （true的话，在客户端就不能排序）
                remoteSort: false,
                remoteFilter: true,
                proxy: {
                    type: 'ajax',
                    url: 'data/globalGridData.js',
                    reader: {   //这里的reader为数据存储组织的地方，下面的配置是为json格式的数据，例如：[{"total":50,"rows":[{"a":"3","b":"4"}]}]
                        type: 'json', //返回数据类型为json格式
                        root: 'rows',  //数据
                        totalProperty: 'total' //数据总条数
                    }
                },
                sorters: [{
                    //排序字段。
                    property: 'ordeId',
                    //排序类型，默认为 ASC 
                    direction: 'desc'
                }],
                autoLoad: true  //即时加载数据
            });
	
	
Ext.define('datasure.ui.globalGridPanel', {
			extend : 'Ext.grid.Panel',
			alias : 'widget.globalGridPanel',
            store: store,
            height: 400,
            width:800,
            selModel: { selType: 'checkboxmodel' },   //选择框
            columns: [                    
                          { text: '型录ID', dataIndex: 'cataId', align: 'left', maxWidth: 80 },
                          { text: '型录编号', dataIndex: 'cataNo',  maxWidth: 120 },
                          { text: '助记标题', dataIndex: 'cataTitle', align: 'left', minWidth: 80 },
                          { text: '应用对象', dataIndex: 'cataObjectName', maxWidth: 80, align: 'left' },                        
                          { text: '发布状态', dataIndex: 'cataPublishName', maxWidth: 80 },
                          { text: '活动截止日期', dataIndex: 'cataEndDate',xtype:'datecolumn',dateFormat :'Y-m-d H:i:s' },
                          { text: '更新时间', dataIndex: 'holyUpdateTime',xtype:'datecolumn',dateFormat :'Y-m-d H:i:s'},
                          { text: '发布时间', dataIndex: 'catapushtime',xtype:'datecolumn',dateFormat :'Y-m-d H:i:s'}
                       ],
            bbar: [{
                xtype: 'pagingtoolbar',
                store: store,
                displayMsg: '显示 {0} - {1} 条，共计 {2} 条',
                emptyMsg: "没有数据",
                beforePageText: "当前页",
                afterPageText: "共{0}页",
                displayInfo: true                 
            }]
        });

/**
 * author:杨柏彬
 * description:日期选择器封装
 * 
 */
Ext.define('datasure.ui.field.Date', {
	extend : 'Ext.form.field.Date',
	alias : 'widget.commonDate',
	editable : false,  //禁止输入字符
	allowBlank : false, //不允许为空
	format: 'm/d/Y',
	//maxValue : new Date() //日期最大值
	initComponent: function() {
		  this.format = this.format;
		  this.callParent();
	  }
});
/**
 * author:薛茹 
 * description:ToggleButtons
 * 
 */
Ext.define('datasure.ui.button.ToggleButtons', {
    extend: 'Ext.Container',
    xtype: 'toggle-buttons',
    width: 500,

    initComponent: function() {
        Ext.apply(this, {
            width: 475,
            xtype: 'container',
                layout: {
                    type: 'table',
                    columns: 4,
                    tdAttrs: { style: 'padding: 5px 10px;' }
                },
                defaults: {
                    enableToggle: true
                },

                items: [{
                    xtype: 'component',
                    html: 'Text Only'
                }, {
                    xtype: 'button',
                    text: 'Small'
                }, {
                    xtype: 'button',
                    text: 'Medium',
                    scale: 'medium'
                }, {
                    xtype: 'button',
                    text: 'Large',
                    scale: 'large'
                }, {
                    xtype: 'component',
                    html: 'Icon Only'
                }, {
                    glyph: 72,
                    xtype: 'button'
                }, {
                    xtype: 'button',
                    glyph: 72,
                    scale: 'medium'
                }, {
                    xtype: 'button',
                    glyph: 72,
                    scale: 'large'
                }, {
                    xtype: 'component',
                    html: 'Icon and Text (left)'
                }, {
                    xtype: 'button',
                    glyph: 72,
                    text: 'Small'
                }, {
                    xtype: 'button',
                    glyph: 72,
                    text: 'Medium',
                    scale: 'medium'
                }, {
                    xtype: 'button',
                    glyph: 72,
                    text: 'Large',
                    scale: 'large'
                }, {
                    xtype: 'component',
                    html: 'Icon and Text (top)'
                }, {
                    xtype: 'button',
                    glyph: 72,
                    text: 'Small',
                    iconAlign: 'top'
                }, {
                    xtype: 'button',
                    glyph: 72,
                    text: 'Medium',
                    scale: 'medium',
                    iconAlign: 'top'
                }, {
                    xtype: 'button',
                    glyph: 72,
                    text: 'Large',
                    scale: 'large',
                    iconAlign: 'top'
                }, {
                    xtype: 'component',
                    html: 'Icon and Text (right)'
                }, {
                    xtype: 'button',
                    glyph: 72,
                    text: 'Small',
                    iconAlign: 'right'
                }, {
                    xtype: 'button',
                    glyph: 72,
                    text: 'Medium',
                    scale: 'medium',
                    iconAlign: 'right'
                }, {
                    xtype: 'button',
                    glyph: 72,
                    text: 'Large',
                    scale: 'large',
                    iconAlign: 'right'
                }, {
                    xtype: 'component',
                    html: 'Icon and Text (bottom)'
                }, {
                    xtype: 'button',
                    glyph: 72,
                    text: 'Small',
                    iconAlign: 'bottom'
                }, {
                    xtype: 'button',
                    glyph: 72,
                    text: 'Medium',
                    scale: 'medium',
                    iconAlign: 'bottom'
                }, {
                    xtype: 'button',
                    glyph: 72,
                    text: 'Large',
                    scale: 'large',
                    iconAlign: 'bottom'
                }]
        });
        this.callParent();
    }

});

/**
 * author:薛茹 
 * description:RegisterForm
 * 
 */
Ext.define('datasure.ui.form.RegisterForm', {
    extend: 'Ext.form.Panel',
    xtype: 'register-form',


    width: 355,
    frame: true,
    title: 'Register',
    bodyPadding: 10,
    autoScroll:true,


    fieldDefaults: {
        labelAlign: 'right',
        labelWidth: 115,
        msgTarget: 'side'
    },

    initComponent: function() {
        Ext.apply(this,{
            items:[{
            xtype: 'fieldset',
            title: 'User Info',
            defaultType: 'textfield',
            defaults: {
                anchor: '100%'
            },
            items: [
                { allowBlank:false, fieldLabel: 'User ID', name: 'user', emptyText: 'user id' },
                { allowBlank:false, fieldLabel: 'Password', name: 'pass', emptyText: 'password', inputType: 'password' },
                { allowBlank:false, fieldLabel: 'Verify', name: 'pass', emptyText: 'password', inputType: 'password' }
            ]},
            {
                xtype: 'fieldset',
                title: 'Contact Information',
                defaultType: 'textfield',
                defaults: {
                    anchor: '100%'
                },
                items: [{
                    fieldLabel: 'First Name',
                    emptyText: 'First Name',
                    name: 'first'
                },
                    {
                        fieldLabel: 'Last Name',
                        emptyText: 'Last Name',
                        name: 'last'
                    },
                    {
                        fieldLabel: 'Company',
                        name: 'company'
                    },
                    {
                        fieldLabel: 'Email',
                        name: 'email',
                        vtype: 'email'
                    },
                    {
                        xtype: 'combobox',
                        fieldLabel: 'State',
                        name: 'state',
                        store: ['01','02'],
                        valueField: 'abbr',
                        displayField: 'state',
                        typeAhead: true,
                        queryMode: 'local',
                        emptyText: 'Select a state...'
                    },
                    {
                        xtype: 'datefield',
                        fieldLabel: 'Date of Birth',
                        name: 'dob',
                        allowBlank: false,
                        maxValue: new Date()
                    }]
            }]
    });
        this.callParent();
    },

    buttons: [{
        text: 'Register',
        disabled: true,
        formBind: true
    }]
});
/**
 * author:薛茹 
 * description:LoginForm
 * 
 */
Ext.define('datasure.ui.form.LoginForm', {
    extend: 'Ext.form.Panel',
    xtype: 'login-form',
    title: 'Login',
    frame:true,
    width: 320,
    bodyPadding: 10,
    defaultType: 'textfield',
    defaults: {
        anchor: '100%'
    },
    items: [
        {
            allowBlank: false,
            fieldLabel: 'User ID',
            name: 'user',
            emptyText: 'user id'
        },
        {
            allowBlank: false,
            fieldLabel: 'Password',
            name: 'pass',
            emptyText: 'password',
            inputType: 'password'
        },
        {
            xtype:'checkbox',
            fieldLabel: 'Remember me',
            name: 'remember'
        }
    ],
    buttons: [
        { text:'Register' },
        { text:'Login' }
    ]
});
/**
 * author:彭富菲
 * description:LoginForm
 * 
 */
Ext.define('datasure.ui.toolbar.BasicToolbar', {
    extend: 'Ext.toolbar.Toolbar',
    xtype: 'basic-toolbar',
    id: 'basic-toolbars',

    initComponent: function() {
        Ext.apply(this, {
            items: [{
                xtype:'splitbutton',
                text:'Menu Button',
                glyph: 0,//横向沟纹;0为不显示
                menu:[
                {
                    text:'Menu Button 1'
                },
                {
                	text:'Menu Button 2'
                }]
            }]
        });
        this.callParent();
    }
});
/**
 * author:徐应安
 * search栏定义
 * TODO productStateMap() 的格式定义参考以下
 * var productStateMap=function(){
	          //(0.禁止 1.未激活(正常状态) 2.已激活)
	         return new Ext.data.Store({ 
                                fields : ['type','name'],
                                 data : [
                                            {"type":0,"name":"禁止"},
                                            {"type":1, "name":"未使用"},
                                            {"type":2, "name":"已使用"}
                                           ]
                            });
};
 * 
 * 
 * 
 */
Ext.define('datasure.ui.view.search.FilterBar', {
    extend: 'Ext.panel.Panel',
    alias:'widget.filterBar',
    layout: {
        type: 'hbox',
        align: 'middle'
    },
    border: 0,
    padding:'20 0 10 0',
    initComponent: function() {
        var me = this;
        Ext.applyIf(me, {
        	items: [
     			   {				 
	     				xtype:'textfield',
	     				width: 90,
	     				emptyText: '快速检索设备',					
	     				lableAlign: 'right',
	     				name:'postCode',				 
	     				regex: /^[1-9]\d{5}(?!\d)$/,				 
	     				regexText : '请输入正确的邮政编码'			 								
     				},	
     	            {
                        xtype: 'combobox',
                        width: 160,
                        labelWidth: 70,
                        fieldLabel: '负载服务器', 
                        lableAlign: 'right',
     					store : productStateMap(),
     					valueField : 'type',
     					editable : false,
     					displayField : 'name',
     					queryMode : 'local',
     					emptyText: '请选择状态'
                     },
                     {
                         xtype: 'datefield',
                         padding: '0 0 0 30',
                         width: 150,
                         labelWidth: 30,
                         id : 'time_from',
                         format :'Y-m',
                         editable : false,
                         fieldLabel: '时间',
                         lableAlign: 'right'
                     },
                     {
                         xtype: 'datefield',
                         padding: '0 0 0 30',
                         width: 150,
                         labelWidth: 15,
                         id : 'time_to',
                         format :'Y-m',
                         editable : false,
                         fieldLabel: 'to',
                         lableAlign: 'right'
                     },
                     {
		     	    	xtype: 'button',
		     	        text: '查询'
		     	     },
		     	     {
		     	    	xtype: 'button',
		     	        text: '导出'	        
		     	    }]
        });

        me.callParent(arguments);
    }

});

var generateData = function(n, floor){
    var data = [],
    p = (Math.random() *  11) + 1,
    i;
    
    floor = (!floor && floor !== 0)? 20 : floor;
    
    for (i = 0; i < (n || 12); i++) {
        data.push({
            name: Ext.Date.monthNames[i % 12],
            data1: Math.floor(Math.max((Math.random() * 100), floor))
        });
    }
return data;
};

var store1 = Ext.create('Ext.data.JsonStore', {
    fields: ['name', 'data1'],
    data: generateData()
});






/**
 * author:王少东
 * description:图表
 * 
 */
Ext.define('datasure.ui.chartCommom', {
//var chart = Ext.create('Ext.chart.Chart', {
	 extend : 'Ext.chart.Chart',
	 	alias : 'widget.chartCommom',
       animate: true,
       shadow: true,
       store: store1,
       axes: [{
           type: 'Numeric',
           position: 'left',
           fields: ['data1'],
           title: false,
           grid: true
       }, {
           type: 'Category',
           position: 'bottom',
           fields: ['name'],
           title: false
       }],
       series: [{
           type: 'line',
           axis: 'left',
           gutter: 80,
           theme:'Green',
           xField: 'name',
           yField: ['data1']
       }]
   });

