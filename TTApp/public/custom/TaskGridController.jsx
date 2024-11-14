Ext.define('TTApp.custom.TaskGridController', {
    extend: "Ext.app.ViewController",
    alias: "controller.task-grid-ctrl",

    runner: null,
    timerCounter: 0,
    refreshInterval: 60,

    changeStatus: function(btn, event) {
        let grid = this.getView();
        let selectedRecord = grid.getSelectionModel().getSelection();

        if (selectedRecord.length > 0 ) {
            let taskId = selectedRecord[0].data.task_id;
            let userData = grid.getUserData;
            
            grid.down('toolbar').getComponent('startButton').setDisabled(true);
            grid.down('toolbar').getComponent('optionsButton').setDisabled(true);

            Ext.Ajax.request({
                url: 'http://ttbackend.sencha.local/tasks/TaskStatus.php',
                method: 'POST',
                params: {
                    taskId: taskId,
                    userId: userData.id_user,
                    token: userData.token,
                    statusId: btn.statusId
                },
                success: function () {
                    grid.unmask();
                    grid.getStore().load();
                    grid.down('toolbar').getComponent('currentTaskController').reload();
                },
                failure: function () {
                    grid.unmask();
                },
            });
        }
    },

    initTimer: function (refreshInterval,init) {
        let me=this;
        let timerButton = me.getView().down('toolbar').getComponent('timerButton');

        if (init) {
            me.runner = new Ext.util.TaskRunner();
        }
        me.refreshInterval=refreshInterval;
        me.runner.start({
            run: function () {
                timerButton.setText("Refresh in "+(refreshInterval-me.timerCounter));
                me.timerCounter++;
                if (me.timerCounter>refreshInterval) {
                    me.getView().getStore().load();
                    me.timerCounter=0;
                }
            },
            interval: 1000
        });

    },

    startStopTimer: function () {
        let me=this;
        let timerButton = me.getView().down('toolbar').getComponent('timerButton');

        if (me.runner.timerId!==null) {
            me.runner.stopAll();
            timerButton.setText("Refresh Paused");
        } else {
            me.timerCounter=0;
            me.getView().getStore().load();
            me.initTimer(me.refreshInterval,false)
        }

    },

    doExport: function (btn) {
        let config = Ext.merge({
            title: 'Tasks',
            fileName: 'Tasks.'+btn.cfg.ext
        }, btn.cfg);

        this.getView().saveDocumentAs(config);
    }
    
});