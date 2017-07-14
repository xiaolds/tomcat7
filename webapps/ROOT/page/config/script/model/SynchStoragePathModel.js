/**
 * author:yangbobin
 * date:2016-8-31
 * desc:介质同步Model
 */
 Ext.define('acesure.config.model.SynchStoragePathModel', {
    extend : 'Ext.data.Model',      
    fields : [
              { name: 'id', type: 'int' },           //介质同步ID
              { name: 'src', type: 'string' },       //来源VMS
              { name: 'dest', type: 'string'},       //目标VMS
              { name: 'planDay_show', type: 'string'},    //同步计划时间
              { name: 'timeArea', type:'string'},      //运行时间范围
              { name: 'interval', type:'string'},      //备份间隔时间
              { name: 'status', type:'int'}
         ]
});

