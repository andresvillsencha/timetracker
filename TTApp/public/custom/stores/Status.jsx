Ext.define('TTApp.stores.Status', {
    extend: 'Ext.data.Store',
    alias: 'store.status_store',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'http://ttbackend.sencha.local/filters/getStatus.php',
        reader: {
            rootProperty: 'data',
            totalProperty: 'count'
        }
    }
});