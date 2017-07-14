
/*
 * 创建虚拟磁盘配置窗口
 */
Ext.define("acesure.recovery.view.CreateNewVming",{
	extend:'Ext.window.Window',
	title:local.recovery.creatNewVm,
	draggable:false,
	//height:400,	//不设置高度，可以根据内容高度自适应
	width:420,
	border:false,
	modal:true,	//是否模态窗口，默认为false
	resizable:false,
	/*modal:true ,s
	maskDisabled :false,*/
	layout:'fit',
	ovflowY:'auto',
	alias:"createNewVming",
	id:"createNewVmingId",
	bodyStyle:'background:#fff',
	items:{xtype:"configNewVming"},
	buttons:[
	{text :local.btn.save,
		cls:"btn_focus",
		handler:function(v){
			var values=Ext.getCmp("configNewVmingId").getForm().getValues();
			/*if(null==STORAGEID){
				Ext.MessageBox.alert(local.window.tip,"请选择存储介质");
				return false;
			};*/
			var storagePath=Ext.getCmp("storagePathTreeId").getChecked();
			if(storagePath.length==0){
				Ext.MessageBox.alert(local.window.tip,local.recovery.chooseStorageMedia);
				return false;
			};
			var symbol=storagePath[0].get("symbol");
			var storageId=storagePath[0].get("storageId");
			var path=storagePath[0].get("path");
			
			var configNewVming=Ext.getCmp("configNewVmingId");
			
			//新磁盘最大大小
			var maxValue=configNewVming.down("numberfield").maxValue;
			
			if(values["maxDiskSize"].replace(/(^s*)|(s*$)/g, "").length ==0){
				Ext.MessageBox.alert(local.window.tip,local.recovery.disSize);
				return false;
			};
			if(values["maxDiskSize"].replace(/(^s*)|(s*$)/g, "")<=0){
				Ext.MessageBox.alert(local.window.tip,local.recovery.disNumber);
				return false;
			};
			if(values["maxDiskSize"].replace(/(^s*)|(s*$)/g, "")>maxValue){
				Ext.MessageBox.alert(local.window.tip,local.recovery.diskSetNumThanMostValue+maxValue+local.mark);
				return false;
			};
			
			var regex=/^[a-zA-Z0-9_]*$/; 
			if(!values["fileName"].match(regex)){
				Ext.MessageBox.alert(local.window.tip,local.recovery.composition);
				return false;
			}
			var myMask = new Ext.LoadMask(Ext.getBody(), {   
				msg :local.recovery.creatNewDiskLoading
			});
			myMask.show();
			Ext.Ajax.request({
				url:'/recovery/recoveryAction!createNewCustomerVmdk.action',
				timeout: 30000,
				params:{
					symbol:symbol,
					storageId:storageId,
					diskSize:values["maxDiskSize"],
					gbOrGb:values["gbOrMb"],
					vmFileName:values["fileName"].replace(/(^s*)|(s*$)/g, ""),
					path:path
				}, 
				success: function(resp,opts) {
					myMask.hide();
					var mountRes=JSON.parse(resp.responseText);
					var mountList=Ext.getCmp("mountListId");
					var recoveryListStore=mountList.getStore();
					showMsg(mountRes);
					Ext.getCmp('createNewVmingId').close();
					recoveryListStore.load({
						callback:function(records, operation, success){
							//更新挂载点个数
							findMountCount();
							POWER_OP.filterEnableDomsInGridpanelColumnOfExtjs(mountList,CURRENT_USER.getRecoveryPower());
						}
					});
					
					//更新日志信息
    				Ext.getCmp("recoveryLogGridId").getStore().load();
					
				},    
				failure: function(resp,opts) {
					myMask.hide();
//					Ext.MessageBox.alert(local.window.tip,local.recovery.createabNormal);
					Ext.websure.MsgError("WF-30116",local.recovery.createabNormal);
				}
				
			});
		}
	},{
		 text : local.btn.cancle,
		 handler:function(){
				Ext.getCmp('createNewVmingId').close();
			}
	}
]
});

/*Ext.define("acesure.recovery.view.numberfield1",{
	extend :"Ext.form.NumberField",
	alias:"widget.numberfield1",
	setValue: function (v) {  
		
		v = typeof v == 'number' ? v : String(v).replace(this.decimalSeparator, ".");  
		v = isNaN(v) ? '' : String(v).replace(".", this.decimalSeparator);  
		v = isNaN(v) ? '' : this.fixPrecision(String(v).replace(".", this.decimalSeparator));  
		var ret = Ext.form.NumberField.superclass.setValue.call(this, v);  
		this.setRawValue(v);//没有这句则控件上不显示1.00  
		return ret;  

	},  

	fixPrecision: function (value) {  
		
		var nan = isNaN(value);  
		if (!this.allowDecimals || this.decimalPrecision == -1 || nan || !value) {  
			return nan ? '' : value;  
		}  
		value = this.replaceDecimalVal(value);  
		return parseFloat(value).toFixed(this.decimalPrecision);  
	}, 

	replaceDecimalVal: function (v) { 
		var vArr = v.toString().split('.');  
		if (vArr.length > 1) {  
			v=vArr[0];
			if (vArr[1] > this.decimalPrecision) {  
				var dec = vArr[1].substring(0, this.decimalPrecision);  
				v = vArr[0] + '.' + dec;  
			}  
		}  
		return v;  
	}
});*/


Ext.define("acesure.recovery.view.ConfigNewVming",{
	extend:"Ext.form.Panel",
	alias:"widget.configNewVming",
	id:"configNewVmingId",
	border : false,
	padding:20,
	layout : 'vbox',
	items:[
		{
				xtype:"storagePathTree",
				height:200,
				overflowY:"auto",
				width:'100%'
				
		},
		{
			title : local.recovery.diskSetNum,
			xtype : "fieldset",
			height : 56,
			width:'100%',
			bodyPadding : 10,
			layout : 'hbox',
			checkboxName : "interval",
			margin:"20 0 0 0",
			items : [{
					xtype : 'numberfield',
					fieldLabel : local.recovery.diskSetNumM,
					labelWidth:94,
					hideTrigger : true,//不显示控件右边的上下箭头  
					//allowDecimals : false, // 不允许输入小数
					//decimalPrecision:0,
					nanText : local.recovery.tipNumM,
					minValue : 1, // 最小值
					width:200,
					name:"maxDiskSize",
					listeners:{
						"focus":function(){
							var storagePath=Ext.getCmp("storagePathTreeId").getChecked();
							if(storagePath.length==0){
								Ext.MessageBox.alert(local.window.tip,local.recovery.chooseStorageMedia);
								return false;
							}else{
								var symbol=storagePath[0].get("symbol");
								var me=this;
								var unit=me.next("combo").value;
								getStorageMaxSize(unit,symbol,me);
							}
							
						},
						change:function(me, newValue, oldValue, eOpts ){
							var vArr = newValue.toString().split('.');  
							if (vArr.length > 1) {  
								newValue=vArr[0];
							};
							me.setValue(newValue);  
						}
					}
				}, 
				{
					xtype : "combo",
					width : 60,
					style : 'margin-left:10px',
					triggerAction : "all",
					store : new Ext.data.SimpleStore({
								fields : ['value', 'text'],
								data : [['MB', 'M'],
								['GB', 'G']
										]
							}),
					displayField : "value",
					valueField : "text",
					queryMode : "local",
					forceSelection : true,
					typeAhead : true,
					value : "G", // 默认选中
					name:"gbOrMb",
					listeners:{
						"change":function(){
							var me=this;
							
							var storagePath=Ext.getCmp("storagePathTreeId").getChecked();
							if(storagePath.length==0){
								return false;
							}else{
								var symbol=storagePath[0].get("symbol");
								var unit=me.value;
								var maxDiskSize=me.previousSibling("numberfield");
								getStorageMaxSize(unit,symbol,maxDiskSize);
								maxDiskSize.reset();
							}
						}
					}
					
				}]
		},
		{
			title : local.recovery.diskFileName,
			xtype : "fieldset",
			height : 60,
			width:'100%',
			bodyPadding : 10,
			margin:"20 0 0 0",
			items : [
						{
							xtype: "textfield",
							fieldLabel: local.recovery.diskFileName,
							width:340,
							labelWidth:80,
							cls:'line-height-no',
							name:"fileName",
							value:"newVmdk",
//		    	        	regex:/^(?!_)(?!.*?_$)[a-zA-Z0-9_\-]+$/,
							regex:/^[a-zA-Z0-9_]*$/,
							maxLength:30,
		    	        	enforceMaxLength:true,
		    	        	//regexText:local.recovery.composition,
		    	        	regexText:local.recovery.wrapNum,
							listeners:{
								render:function(){
									var newData=new Date();
									var time=Ext.Date.format(newData, 'Y_m_d\_H\_i_s');
									var hour=Ext.Date.format(newData, 'H');
									var min=Ext.Date.format(newData, 'i');
									var second=Ext.Date.format(newData, 's');
									this.setValue("0_"+time+"_new");
								}
							}
						}
					]
		}
	]
});

Ext.define('acesure.recovery.view.StoragePathTree',{
	extend:'Ext.tree.Panel',
	alias:'widget.storagePathTree',
	id:"storagePathTreeId",
	cls:"icon_radio",
	useArrows:true,
	rootVisible:false,// 不可见根
	border:true,
	frame:false,
	sortable:false,
	onlyLeafCheckable: true,
	checkModel:"double",
	store:"NewStorageConfigStore",
	loadMask : {
		msg : local.loading
	},
	listeners:{
		checkchange:function(node, checked,obj){
			var me=this;
			var checkedNodes = this.getChecked();
			for(var i=0;i<checkedNodes.length;i++){
				var n = checkedNodes[i];
				if(node.get("id") != n.get("id")){
						n.set("checked" , false);
				}
			}
			me.nextSibling("fieldset").down("numberfield").reset();
		}
	}
	
});
