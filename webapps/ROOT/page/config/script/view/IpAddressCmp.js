Ext.define("acesure.config.view.IpAddressCmp",{
	extend:"Ext.form.FieldSet",
	alias:"widget.uxipfield",
	border: false,
	layout: 'hbox',
	token: '.',
	//width: 490,
	//height:70,
	//margin:10,
	padding:20,
	defaults:{
		maskRe: /[0-9]/,
		maxLength: 3,
		listeners: {
			'focus': function(f){
				f.selectText();
			}
		}
	},
	initComponent: function()
	{
		this.items = [
		              {
		            	  xtype:"label",
		            	  html: local.config.IPStandbyChoose+":",
		            	  width:90,
		            	  border: false
		              },{
		            	  xtype:'numberfield',
		            	  id:'ip0',
		            	  width:70,
		            	  enableKeyEvents:true,
		            	  hideTrigger: true,
		            	  keyNavEnabled: true,
		            	  mouseWheelEnabled: false,
		            	  minValue:1,
		            	  maxValue:255,
		            	  listeners: {  
		            	        change: function(field, value) {  
		            	        	this.validate();
		            	            value = parseInt(value, 10);  
		            	            if(value>100&&value<256){
		            	            	Ext.getCmp("ip1").focus();
		            	            };
		            	        },
		            	        keyup:function(src,evt){
		            	        	var inputValue = src.rawValue;
		            	            if(inputValue.indexOf('.')>0){
                                        Ext.getCmp("ip1").focus();
                                    };
		            	        	
		            	            var val=src.getValue();
		            	            if(val){
		            	            	val = val.toString().replace(/["^d]/g,'');
		            	            }
                                    src.setValue(val);
		            	        }
		            	    }
		              }, {
		            	  html: '.',
		            	  baseCls: null,
		            	  bodyStyle: 'font-weight: bold; font-size-adjust: .9',
		            	  border: false
		              }, {
		            	  xtype:'numberfield',
		            	  id:'ip1',
		            	  width:70,
		            	  enableKeyEvents:true,
		            	  hideTrigger: true,
		            	  keyNavEnabled: true,
		            	  mouseWheelEnabled: false,
		            	  minValue:0,
		            	  maxValue:255,
		            	  listeners: {  
		            	        change: function(field, value) {  
		            	            value = parseInt(value, 10);  
		            	            if(value>100&&value<256){
		            	            	Ext.getCmp("ip2").focus();
		            	            };
		            	        },
                                keyup:function(src,evt){
                                	//监听输入.号自动换格子
                                    var inputValue = src.rawValue;
                                    if(inputValue.indexOf('.')>0){
                                        Ext.getCmp("ip2").focus();
                                    };
                                    //过滤非法字符
                                    var val=src.getValue();
                                    if(val){
                                        val = val.toString().replace(/["^d]/g,'');
                                    }
                                    src.setValue(val);
                                    
                                    //监听键盘backspace 自动退格子
                                    var eventKey = evt.getKey();
                                    if(eventKey==8 && (!val || val.length==0)){
                                         Ext.getCmp("ip0").focus();
                                    }
                                }  
		            	    }
		              }, {
		            	  html: '.',
		            	  baseCls: null,
		            	  bodyStyle: 'font-weight: bold; font-size-adjust: .9',
		            	  border: false
		              }, {
		            	  xtype:'numberfield',
		            	  width:70,
		            	  id:'ip2',
		            	  enableKeyEvents:true,
		            	  hideTrigger: true,
		            	  keyNavEnabled: true,
		            	  mouseWheelEnabled: false,
		            	  minValue:0,
		            	  maxValue:255,
		            	  listeners: {  
		            	        change: function(field, value) {  
		            	            value = parseInt(value, 10);  
		            	            if(value>100&&value<256){
		            	            	Ext.getCmp("ip3").focus();
		            	            };
		            	        },
                                keyup:function(src,evt){
                                	var inputValue = src.rawValue;
                                    if(inputValue.indexOf('.')>0){
                                        Ext.getCmp("ip3").focus();
                                    };
                                	
                                    var val=src.getValue();
                                    if(val){
                                        val = val.toString().replace(/["^d]/g,'');
                                    }
                                    src.setValue(val);
                                    
                                    var eventKey = evt.getKey();
                                    if(eventKey==8 && (!val || val.length==0)){
                                         Ext.getCmp("ip1").focus();
                                    }
                                }  
		            	    }
		              }, {
		            	  html: '.',
		            	  baseCls: null,
		            	  bodyStyle: 'font-weight: bold; font-size-adjust: .9',
		            	  border: false
		              }, {
		            	  xtype:'numberfield',
		            	  id:'ip3',
		            	  enableKeyEvents:true,
		            	  minValue:0,
		            	  maxValue:255,
		            	  regex:/^[1-9]\d*$/,
                          regexText:local.config.integer,
		            	  width:70,
		            	  hideTrigger: true,
		            	  keyNavEnabled: true,
		            	  mouseWheelEnabled: false,
		            	  listeners: {  
                                keyup:function(src,evt){
                                    var val=src.getValue();
                                    if(val){
                                        val = val.toString().replace(/["^d]/g,'');
                                    }
                                    src.setValue(val);
                                    
                                    var eventKey = evt.getKey();
                                    if(eventKey==8 && (!val || val.length==0)){
                                         Ext.getCmp("ip2").focus();
                                    }
                                }  
                            }  
		              }],

		              this.callParent(arguments);
	}

});
/**
 * 创建IP添加窗口
 * @param {} ipNetCmp
 *        备用IP组件
 */
function addIpAddress(ipNetCmp){
	var ipAddWin = Ext.create('Ext.window.Window',{
                                border: false,
                                title :local.config.calNodeConfigIPStandby,
                                modal : true,
                                resizable:false,
                                constrain: true,
                                layout: 'vbox',
                                width:480,
                                //heigth:270,
                                items : [
                                         {
                                             xtype: "uxipfield"
                                         } ,{
                                             xtype: 'label',
                                             text: 'Tips:备用IP满三个时，新设置的备用IP会将第一个备用IP挤掉。',
                                             margin: '0 0 0 10'
                                         }
                                         ],
                                         buttons : [
                                                    {
                                                        text:local.btn.save,
                                                        cls:"btn_focus",
                                                        handler : function() {
                                                            var ip0=Ext.getCmp("ip0").getValue();
                                                            var ip1=Ext.getCmp("ip1").getValue();
                                                            var ip2=Ext.getCmp("ip2").getValue();
                                                            var ip3=Ext.getCmp("ip3").getValue();
                                                            if(null==ip0||null==ip1||null==ip2||null==ip3){
                                                                Ext.MessageBox.alert(local.window.tip,local.config.completeIP);
                                                            }else{
                                                                if(ip0<0||ip0>255||ip1<0||ip1>255||ip2<0||ip2>255||ip3<0||ip3>255){
                                                                    Ext.MessageBox.alert(local.window.tip,local.config.IPRangeError);
                                                                    return false;
                                                                }
                                                                var ip=ip0+'.'+ip1+'.'+ip2+'.'+ip3;
                                                                //var backUpIp=Ext.getCmp(nodeIpNetId).getValue().replace(/(^\s+)|(\s+$)/g, "");
                                                                var backUpIp=ipNetCmp.getValue().replace(/(^\s+)|(\s+$)/g, "");
                                                                //备用IP为空
                                                                if(backUpIp.length==0){
                                                                    backUpIp = ip;
                                                                }else{
                                                                //备用IP不为空
                                                                    //过滤重复的IP
                                                                    if(backUpIp.indexOf(ip)<0){
                                                                        backUpIp = backUpIp+','+ip;
                                                                    }
                                                                    
                                                                    var ipArr = backUpIp.split(',');
                                                                    if(ipArr.length == 4){
                                                                    	backUpIp = ipArr[1] + ','+ ipArr[2] + ',' + ipArr[3];
                                                                    }
                                                                }
                                                                
                                                                ipNetCmp.setValue(backUpIp);
                                                                this.up('window').close();
                                                            }
                                                        }
                                                    },{
                                                        text : local.btn.cancle,
                                                        handler : function() {
                                                            this.up('window').close();
                                                        }}
                            
                                                    ]
                            });
                            
    ipAddWin.show();
}
