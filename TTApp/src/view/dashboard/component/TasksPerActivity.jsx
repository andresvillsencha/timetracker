import ReExt from "@sencha/reext";


export const TasksPerActivity = (props) => {
    return (
        <ReExt 
            xtype="cartesian"
            config={{
                id: 'chart_activities',
                store: {
                    autoLoad: true,
                    proxy: {
                        type: 'ajax',
                        url: 'http://ttbackend.sencha.local/tasks/kpi/tasksPerActivity.php',
                        reader: {
                            rootProperty: 'data',
                            totalProperty: 'count'
                        }
                    }
                },
                axes: [{
                    type: 'numeric', position: 'left', grid: true, title: 'Hours'
                }, {
                    type: 'category', position: 'bottom', grid: true, title: 'Activity'
                }],
                series: [{
                    style: {
                        minGapWidth: 20
                    },
                    type: 'bar',
                    stacked: false,
                    xField: 'activity',
                    yField: [ "avg_time", "max_time", "min_time" ],
                    colors: [ "#369", "#933", "#396" ],
                    tooltip: {
                        trackMouse: true,
                        renderer: function (tooltip, record, item) {
                            tooltip.setHtml(
                                record.get('activity')+": <br>"+
                                "<b>Average:</b> "+Ext.util.Format.number(record.get('avg_time'),"0.00")+" hours<br>" +
                                "<b>Max:</b> "+Ext.util.Format.number(record.get('max_time'),"0.00")+" hours<br>" +
                                "<b>Min:</b> "+Ext.util.Format.number(record.get('min_time'),"0.00")+" hours<br>"
                            );
                        }
                    }
                }]
                
            }}
        />
    )
}