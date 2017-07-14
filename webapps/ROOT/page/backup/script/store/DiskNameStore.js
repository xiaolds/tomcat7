Ext.define('websure.backup.store.DiskNameStore', {
    extend: 'Ext.data.Store',
    fields: ['diskName', 'type'],
    proxy: {
        type: 'ajax',
        url: '/warning/towarningAction!findDeviceHwDiskInfoBydeviceId.action',
        reader: {
            type: 'json',
            root: 'detail'
        }
    }
});