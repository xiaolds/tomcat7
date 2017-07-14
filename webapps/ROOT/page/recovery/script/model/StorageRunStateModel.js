/**
 * description:存储器运行状态model
 * author:yangbobin
 * date:2016-1-20
 */
Ext.define('acesure.recovery.model.StorageRunStateModel',{
	extend:'Ext.data.Model',
	alias:'widget.storageRunStateModel',
	fields:[
        { name : 'rate', type : 'int' },    //CPU/磁盘IO使用率
        {name:"showDate",type:"string"},    //页面X轴展示时间
        { name : 'chartDate', type : 'String' }    //监控时间
	]
});