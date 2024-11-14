Ext.define('TTApp.stores.Users', {
    extend: 'Ext.data.Store',
    alias: 'store.users_store',
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'http://ttbackend.sencha.local/filters/getUsers.php',
        reader: {
            rootProperty: 'data',
            totalProperty: 'count'
        }
    }
});