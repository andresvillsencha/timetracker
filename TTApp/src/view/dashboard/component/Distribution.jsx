import ReExt from "@sencha/reext";


export const Distribution = (props) => {
    return (
        <ReExt 
            xtype="polar"
            config={{
                id: 'chart_distribution',
                store: {
                    autoLoad: true,
                    proxy: {
                        type: 'ajax',
                        url: 'http://ttbackend.sencha.local/tasks/kpi/tasksPerUser.php',
                        reader: {
                            rootProperty: 'data',
                            totalProperty: 'count'
                        }
                    }
                },
                insetPadding: 40,
                interactions: ['rotate'],
                series: [{
                    type: 'pie',

                    label: {
                        field: 'full_name',
                        calloutLine: {
                            length: 20,
                            width: 3
                        }
                    },
                    angleField: 'full_time',
                    hightlight: true,
                    
                    tooltip: {
                        trackMouse: true,
                        renderer: function (tooltip, record, item) {
                            tooltip.setHtml(record.get('full_name')+": "+Ext.util.Format.number(record.get('full_time'),"0.00"));
                        }
                    }
                }]
                
            }}
        />
    )
}