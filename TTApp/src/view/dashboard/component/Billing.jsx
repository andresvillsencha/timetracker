import ReExt from "@sencha/reext";


export const Billing = (props) => {
    return (
        <ReExt 
            xtype="cartesian"
            config={{
                id: 'chart_billing',
                store: {
                    autoLoad: true,
                    proxy: {
                        type: 'ajax',
                        url: 'http://ttbackend.sencha.local/tasks/kpi/tasksBilled.php',
                        reader: {
                            rootProperty: 'data',
                            totalProperty: 'count'
                        }
                    }
                },
                axes: [{
                    type: 'numeric', position: 'left', grid: true, title: 'USD'
                }, {
                    type: 'category', position: 'bottom', grid: true, title: 'Month'
                }],
                series: [{
                    style: {
                        minGapWidth: 20
                    },
                    type: 'line',
                    xField: 'month_billed',
                    yField: [ "total_billed" ],
                    colors: [ "#369" ],
                    
                    marker: {
                        radius: 4,
                        lineWidth: 2
                    },
                    tooltip: {
                        trackMouse: true,
                        renderer: function (tooltip, record, item) {
                            tooltip.setHtml(record.get('month_billed')+": $"+Ext.util.Format.number(record.get('total_billed'),"0.00"));
                        }
                    }
                }]
                
            }}
        />
    )
}