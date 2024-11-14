import ReExt from "@sencha/reext";


export const DeadlineTasks = (props) => {
    return (
        <ReExt 
            xtype="grid"
            config={{
                id: 'chart_deadline',
                store: {
                    autoLoad: true,
                    proxy: {
                        type: 'ajax',
                        url: 'http://ttbackend.sencha.local/tasks/kpi/tasksDeadline.php',
                        reader: {
                            rootProperty: 'data',
                            totalProperty: 'count'
                        }
                    }
                },
                columns: [{
                    dataIndex: "task_id",
                    text: "Id",
                    width: 100
                }, {
                    dataIndex: "full_name",
                    text: "User",
                    flex: 1
                }, {
                    dataIndex: "activity",
                    text: "Activity",
                    width: 140
                }, {
                    xtype: 'datecolumn',
                    dataIndex: "deadline_date",
                    text: "Deadline",
                    width: 140
                }, {
                    dataIndex: "remaining_time",
                    text: "Days Remaining",
                    width: 140,
                    renderer: function (value) {
                        return (value<0)  ? "<b style='color: #900;'>"+value+"</b>" : "<b>"+value+"</b>"
                    }
                } ]
            }}
        />
    )
}