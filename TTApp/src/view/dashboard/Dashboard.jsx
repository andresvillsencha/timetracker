import ReExt from '@sencha/reext';
import { DeadlineTasks } from './component/DeadlineTasks';
import { Billing } from './component/Billing';
import { TasksPerActivity } from './component/TasksPerActivity';
import { TasksPerUser } from './component/TasksPerUser';
import { Distribution } from './component/Distribution';


export const Dashboard = (props) => {
  return (
    <ReExt
      xtype='panel'
      config={{
        layout: {
          type: 'hbox',
          align: 'stretch'
        },
        tbar: [{
          xtype: 'datefield',
          value: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          itemId: 'startDate'
        }, {
          xtype: 'datefield',
          value: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
          itemId: 'endDate'
        }, {
          xtype: 'button',
          text: 'Reload',
          handler: function (btn) {
            let params = {
              startDate: Ext.Date.format(btn.up().getComponent('startDate').getValue(), 'm/d/Y'),
              endDate: Ext.Date.format(btn.up().getComponent('endDate').getValue(), 'm/d/Y')
            };
            btn.reloadStore('chart_deadline', params);
            btn.reloadStore('chart_billing', params);
            btn.reloadStore('chart_distribution', params);
            btn.reloadStore('chart_activities', params);
            btn.reloadStore('chart_users', params);

            btn.reloadStore('deadline_met', params);
            btn.reloadStore('less_than_three_days', params);
            btn.reloadStore('less_than_a_week', params);
            btn.reloadStore('all_tasks', params);
          },
          reloadStore: function (nameStore, params) {
            let store = Ext.getCmp(nameStore).getStore();
            store.getProxy().setExtraParams(params);
            store.load();
          }
        }]
      }}>
      
            <ReExt xtype='panel' config={{ flex: 1, layout: { type: 'vbox', align: 'stretch' } }}>
                <ReExt xtype='panel' config={{ flex: 1, layout: { type: 'hbox', align: 'stretch' } }}>
                    <ReExt xtype='panel' config={{ title: 'Tasks Expiring Soon', flex: 1, layout: 'fit' }}>
                        <DeadlineTasks />
                    </ReExt>
                    <ReExt xtype='panel' config={{ title: 'Billing', flex: 1, layout: 'fit' }}>
                        <Billing />
                    </ReExt>
                </ReExt>
                <ReExt xtype='panel' config={{ flex: 1, layout: { type: 'hbox', align: 'stretch' } }}>
                    <ReExt xtype='panel' config={{ title: 'Tasks per Activity', flex: 1, layout: 'fit' }}>
                        <TasksPerActivity />
                    </ReExt>
                    <ReExt xtype='panel' config={{ title: 'Tasks per User', flex: 1, layout: 'fit' }}>
                        <TasksPerUser />
                    </ReExt>
                    <ReExt xtype='panel' config={{ title: 'Task Distribution', flex: 1, layout: 'fit' }}>
                        <Distribution />
                    </ReExt>
                </ReExt>
            </ReExt>
            <ReExt xtype='panel' config={{ width: 320, layout: { type: 'vbox', align: 'stretch' }, bodyStyle: { backgroundColor: '#eee' } }}>
                <ReExt
          xtype='kpi-box'
          config={{
            id: 'deadline_met',
            height: 200,
            propertyName: 'deadline_met',
            propertyColor: '#933',
            propertyTitle: 'Expired Tasks',
            propertyUrl: 'http://ttbackend.sencha.local/tasks/kpi/tasksDeadlineTotal.php'
          }} />
        
                <ReExt
          xtype='kpi-box'
          config={{
            height: 200,
            id: 'less_than_three_days',
            propertyName: 'less_than_three_days',
            propertyColor: '#993',
            propertyTitle: 'Tasks that are about to expire',
            propertyUrl: 'http://ttbackend.sencha.local/tasks/kpi/tasksDeadlineTotal.php'
          }} />
        
                <ReExt
          xtype='kpi-box'
          config={{
            height: 200,
            id: 'less_than_a_week',
            propertyName: 'less_than_a_week',
            propertyColor: '#339',
            propertyTitle: 'Less than a week',
            propertyUrl: 'http://ttbackend.sencha.local/tasks/kpi/tasksDeadlineTotal.php'
          }} />
        
                <ReExt
          xtype='kpi-box'
          config={{
            height: 200,
            id: 'all_tasks',
            propertyName: 'all_tasks',
            propertyColor: '#393',
            propertyTitle: 'Tasks',
            propertyUrl: 'http://ttbackend.sencha.local/tasks/kpi/tasksDeadlineTotal.php'
          }} />
        
            </ReExt>
        </ReExt>);

};