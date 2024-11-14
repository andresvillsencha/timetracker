import ReExt from "@sencha/reext";


export const TasksPerUser = (props) => {
    return (
        <ReExt 
            xtype="cartesian"
            config={{
                id: 'chart_users',
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
                axes: [{
                    type: 'numeric', position: 'left', grid: true, title: 'Count'
                }, {
                    type: 'category', position: 'bottom', grid: true, title: 'Users'
                }],
                series: [{
                    style: {
                        minGapWidth: 20
                    },
                    type: 'bar',
                    stacked: false,
                    xField: 'full_name',
                    yField: [ "num_tasks" ],
                    colors: [ "#396" ]
                }]
                
            }}
        />
    )
}