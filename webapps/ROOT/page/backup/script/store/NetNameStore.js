Ext.define('websure.backup.store.NetNameStore', {
    extend: 'Ext.data.Store',
    fields: ['netName', 'type'],
    proxy: {
        type: 'ajax',
        url: '/warning/towarningAction!findDeviceHwNetInfoBydeviceId.action',
        reader: {
            type: 'json',
            root: 'detail'
        }
    }
});