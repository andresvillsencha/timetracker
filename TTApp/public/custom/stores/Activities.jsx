Ext.define('TTApp.stores.Activities', {
    extend: 'Ext.data.Store',
    alias: 'store.activity_store',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'http://ttbackend.sencha.local/filters/getActivities.php',
        reader: {
            rootProperty: 'data',
            totalProperty: 'count'
        }
    }
});