Ext.define('TTApp.components.KPIBox', {
    extend: 'Ext.Button',
    xtype: 'kpi-box',

    html: 'loading...',
    cls: 'kpiBox',
    margin: '12 12 0 12',
    
    width: '100%',
    store: null,

    propertyName: '',
    propertyTitle: 'KPI',
    propertyValue: '',
    propertyType: 'number',
    propertyUrl: '',
    refreshRate: 60,
    propertyColor: "#333",

    setKPI: function (value) {
        let me=this;
        me.propertyValue=value;
        this.setHtml(
            "<div class='block' style='color:"+me.propertyColor+"'>"+
            "   <h1>"+me.propertyValue+"</h1>"+
            "   <h2>"+me.propertyTitle+"</h2>"+
            "</div>"
        );
    },

    getStore: function () {
        return this.store;
    },

    initComponent: function () {
        let me=this;
        me.callParent();
        
        if (me.propertyUrl!==undefined && me.propertyUrl!=="") {
            me.store = Ext.create('Ext.data.Store',{
                listeners: {
                    load: function (store,record,success) {
                        if (success) {
                            me.setKPI(record[0].data[me.propertyName]);
                        }
                    }
                }, 
                proxy: {
                    type: 'ajax',
                    url: me.propertyUrl,
                    reader: {
                        rootProperty: 'data',
                        totalProperty: 'count'
                    }
                }
            });
            me.store.load();
        }
    }
});