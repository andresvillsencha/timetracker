Ext.define('TTApp.components.CurrentTask', {
    extend: 'Ext.Button',
    xtype: 'current-task',

    text: 'Current Task',
    minWidth: 200,
    itemId: 'currentTask',
    iconCls: 'fa fa-hourglass',

    currentTime: 0, // time in seconds
    taskId: 0,

    userId: 0,
    linkedGrid: null,
    timerController: null,
    
    pollStatus: false,
    pollCheck: 10,
    pollCheckCounter:0,

    store: null,

    initComponent: function () {
        this.callParent();
        this.initTimer();
    },

    handler: function (btn) {
        // Select task
        if (this.taskId>0 && this.linkedGrid!==null) {
            let record = this.linkedGrid.store.find('task_id',this.taskId);
            this.linkedGrid.getSelectionModel().select(record);
        }
    },

    setup: function (grid,userId) {
        this.linkedGrid=grid;
        this.userId=userId;
        this.setupStore();
    },

    reload: function () {
        this.store.load();
    },

    setupStore: function () {
        let me=this;
        me.stopTimer();
        me.store=Ext.create('Ext.data.Store',{
            autoLoad: true,
            proxy: {
                type: 'ajax',
                url: 'http://ttbackend.sencha.local/tasks/GetCurrentTask.php?userId='+me.userId,
                reader: {
                    rootProperty: 'data',
                    totalProperty: 'count'
                }
            },
            listeners: {
                load: function (store,records,success,op,eOpts) {
                    me.stopTimer();
                    if (records.length>0) {
                        let data=records[0].data;
                        me.currentTime=data.elapsed_time*60;
                        me.taskId=data.task_id;
                    } else {
                        me.currentTime=0;
                        me.taskId=0;
                        me.setText('No task currently running');
                    }
                    me.startTimer();
                }
            }
        });
    },
    
    /* STARTS THE TIMER */
    initTimer: function () {
        let me=this;
        me.timerController=new Ext.util.TaskRunner();
    }, 

    findInProgress: function () {
        let me=this;
        let recordNum = (me.taskId!==null) ? me.linkedGrid.store.find('task_id',me.taskId) : null;
        let record = (recordNum!==null) ? me.linkedGrid.store.getAt(recordNum) : null;
        if (record!==null && record.data.status_id==3) { // In progress
            return true;
        } else if (me.pollStatus) {
            me.pollCheckCounter++;
            me.pollCheckCounter%=me.pollCheck;
            if (me.pollCheckCounter==0) me.store.load();
            return false;
        }
    },

    /* Changes the text every second */
    startTimer: function () {
        let me=this;
        me.timerController.start({
            run: function () {
                let running=me.findInProgress();
                if (running) { // id 3 is in progress
                    me.currentTime++;
                    let hours = Math.floor(me.currentTime/3600);
                    let minutes = Math.floor((me.currentTime%3600)/60);
                    let seconds = Math.floor(me.currentTime%60);
                    me.setText('Task <b>'+me.taskId+'</b>: '+hours+' h '+Ext.String.leftPad(minutes, 2, '0')+' m '+Ext.String.leftPad(seconds, 2, '0')+' s');
                } else {
                    me.setText('No task currently running');
                }
            },
            interval: 1000
        });
    },

    /* Stop the timer */
    stopTimer: function () {
        let me=this;
        if (me.timerController!==null && me.timerController.timerId!==undefined && me.timerController.timerId!==null) {
            me.timerController.stopAll();
        }
    }
});