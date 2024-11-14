import ReExt from "@sencha/reext";
import { KPIBox } from "./KPIBox";
import { ExpiringSoon } from "./parts/ExpiringSoon";
import { Billing } from "./parts/Billing";
import { TasksPerActivity } from "./parts/TasksPerActivity";
import { TasksPerUser } from "./parts/TasksPerUser";
import { TasksPercentage } from "./parts/TasksPercentage";


export const DashboardNew = (props) => {
    return (
        <ReExt 
            xtype="panel"
            
            style={{ width: "100%", height: '100%' }}
            config={{
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                tbar: [{
                    xtype: 'datefield',
                    name: 'startDate',
                    value: new Date((new Date()).getFullYear(), (new Date()).getMonth(), 1)
                },{
                    xtype: 'datefield',
                    name: 'endDate',
                    value: new Date((new Date()).getFullYear(), (new Date()).getMonth() + 1, 0)
                }, {
                    xtype: 'button',
                    text: 'Reload'
                }]
            }}
        >
            <ReExt  xtype="panel"  
                config={{ 
                    flex: 1, 
                    layout: { type: 'vbox',  align: 'stretch' },
                }} >
                    {/* TOP PANEL */}
                        <ReExt xtype="panel" config={{ flex: 1, layout: { type: 'hbox',  align: 'stretch' } }} >
                            <ReExt xtype="panel" config={{ title: 'Expiring Soon', flex: 1, layout:'fit' }}>
                                <ExpiringSoon />
                            </ReExt>
                            <ReExt xtype="panel" config={{ title: 'Billing', flex: 1, layout:'fit' }}>
                                <Billing />
                            </ReExt>
                        </ReExt>
                    {/* BOTTOM PANEL */}
                        <ReExt xtype="panel" config={{ flex: 1, layout: { type: 'hbox',  align: 'stretch' } }} >
                            <ReExt xtype="panel" config={{ title: 'Tasks per Activity', flex: 1, layout:'fit' }}>
                                <TasksPerActivity />
                            </ReExt>
                            <ReExt xtype="panel" config={{ title: 'Tasks per User', flex: 1, layout:'fit' }}>
                                <TasksPerUser />
                            </ReExt>
                            <ReExt xtype="panel" config={{ title: 'Distribution of Tasks', flex: 1, layout:'fit' }}>
                                <TasksPercentage />
                            </ReExt> 
                        </ReExt>
            </ReExt>
            {/* KPI Panel */}
            <ReExt 
                xtype="panel"
                config={{ 
                    width: 300, 
                    bodyStyle: {
                        backgroundColor: "#eee"
                    },
                    layout: {
                        type: 'vbox',
                        align: 'stretch'
                    },
                }} >
                    <KPIBox title="Expired Tasks" type="number" height="120px" color="#933" name="deadline_met" url="http://ttbackend.sencha.local/tasks/kpi/tasksDeadlineTotal.php" />
                    <KPIBox title="Expires in less than 3 days" type="number" height="120px" color="#993" name="less_than_three_days" url="http://ttbackend.sencha.local/tasks/kpi/tasksDeadlineTotal.php"  />
                    <KPIBox title="Expires in less than a week" type="number" height="120px" color="#396" name="less_than_a_week" url="http://ttbackend.sencha.local/tasks/kpi/tasksDeadlineTotal.php" />
                    <KPIBox title="All Tasks" type="number" height="120px" color="#369" name="all_tasks" url="http://ttbackend.sencha.local/tasks/kpi/tasksDeadlineTotal.php"  />
            </ReExt>
        </ReExt>
    )
}