/*//磁盘信息数据集合
Ext.define('websure.backup.store.DiskInfoStore', {
    extend: 'Ext.data.Store',
    model: 'websure.backup.model.DiskInfoModel',
    groupField: "diskSel" ,//分组字段  
    data:{'items':[
        { 'diskSel': '磁盘0',  "partInfo":"[C:]40G",  "startSec":"63" ,"startSize":"39G" ,"zonedFormat":"NTFS","runningStatus":"1"},
        { 'diskSel': '磁盘0',  "partInfo":"[D:]41G",  "startSec":"64" ,"startSize":"39G" ,"zonedFormat":"NTFS","runningStatus":"2"},
        {'diskSel': '磁盘1',  "partInfo":"[C:]42G",  "startSec":"68" ,"startSize":"39G" ,"zonedFormat":"NTFS","runningStatus":"3"},
        {'diskSel': '磁盘1',  "partInfo":"[E:]43G",  "startSec":"65" ,"startSize":"39G" ,"zonedFormat":"NTFS","runningStatus":"1"}
    ]},
    proxy: {
        type: 'memory',
//	        url : '/data/diskinfoData.js',
        reader: {
            type: 'json',
            root: 'items'
        }
    }
});*/

//磁盘信息数据集合
Ext.define('websure.backup.store.BackupTaskInfoStore', {  
	    extend:'Ext.data.Store',
        model: 'websure.backup.model.BackupTaskInfoModel',
        proxy: {  
            type: 'ajax',  
            url: '/backup/tobackupdbAction!getBackupDBTaskInfo.action',
            reader : {
				type : 'json',
				root: 'info'
			}
        } 
    });  
