
Ext.define("acesure.emergency.model.CalNodeRunStateModel",{
	extend:"Ext.data.Model",
	alias:"widget.calNodeRunStateModel",
	fields:[
	        {name:"chartDate",type:"string"},    //时间
	        {name:"showDate",type:"string"},    //页面X轴展示时间
	        {name:"rate",type:"int"}    //比率
	]
});