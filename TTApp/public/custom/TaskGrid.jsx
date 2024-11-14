Ext.define('TTApp.custom.TaskGrid', {
    extend: 'Ext.grid.Panel',
    xtype: 'taskgrid',
    title: 'Task Grid',

    controller: "task-grid-ctrl",

    listeners: {
        select: function (obj, record, index, op) {
            let statusId = record.get('status_id');
            let forMe = (record.get('assigned_to')==this.getUserData.id_user);
            let inactive = record.get('active')=='0';

            this.down('toolbar').getComponent('startButton').setDisabled(inactive || !forMe || statusId==3 || statusId==6);
            this.down('toolbar').getComponent('optionsButton').setDisabled(inactive || !forMe || statusId>3);
        },
        deselect: function () {
            this.down('toolbar').getComponent('startButton').setDisabled(true);
            this.down('toolbar').getComponent('optionsButton').setDisabled(true);
        },
    },

    tbar: [{ 
        text: 'Refresh',
        iconCls: 'fa fa-sync',
        cls: 'my-button',
        handler: function (btn) {
            let grid = btn.up('grid');
            grid.getStore().load();
        }
    }, {
        text: 'Start Task',
        iconCls: 'fa fa-play',
        cls: 'start-task-button',
        itemId: 'startButton',
        statusId: 3,
        handler: 'changeStatus',
        disabled:true
    },{
        text: 'Task Options',
        iconCls: 'fa fa-bars',
        cls: 'stop-task-button',
        itemId: 'optionsButton',
        disabled: true,
        menu: [{
            text: 'Pause/Stop',
            iconCls: 'fa fa-stop',
            statusId: 4,
            handler: 'changeStatus'
        }, {
            text: 'Finish',
            iconCls: 'fa fa-flag-checkered',
            statusId: 5,
            handler: 'changeStatus'
        }, {
            text: 'Cancel',
            iconCls: 'fa fa-times',
            statusId: 6,
            handler: 'changeStatus'
        }]
    },'->', {
        xtype: 'current-task',
        itemId: 'currentTaskController'
    }, {
        text: 'Timer',
        itemId: 'timerButton',
        handler: 'startStopTimer'
        // TIME 
    }, {
        text: 'Options',
        itemId: 'options',
        menu: [{
            text: 'Add New',
            handler: function (btn) {
                let grid = btn.up('grid');
                // Open an Edit Window 
                    let myWindow=Ext.create('TTApp.EditWindow', {
                        title: 'New Task',
                        rowData: null,
                        userData: grid.getUserData,
                        panelType: 'new',
                        taskId: 0,
                        gridStore: grid.getStore()
                    });
                    myWindow.show();
            }
        }, {
            text: 'Export to Excel',
            cfg: { type: 'excel07', ext: 'xlsx' },
            handler: 'doExport'
        }, {
            text: 'Export to CSV',
            cfg: { type: 'csv', ext: 'csv' },
            handler: 'doExport'
        }]
    }],
    bbar: {
        xtype: 'pagingtoolbar',
    },
    plugins: {
        gridfilters: true,
        gridexporter: true

    },
    viewConfig: {
        getRowClass: function (row,rowIndex,rowParams,store) {
            if (row.data.active!=1) {
                return 'inactive-class';
            } else if (Date.parse(row.data.deadline_date)<new Date()) {
                return 'expired-class';
            } else {
                return '';
            }
        }
    },
    store: {
        remoteSort: true,
        remoteFilter: true,
        sorters: [{
            property: 'deadline_date',
            direction: 'ASC'
        }],
        listeners: {
            beforeload: function (store, op) {
                store.getProxy().setExtraParams({
                    userId: store.userId
                });
            }
        },
        proxy: {
            type: 'ajax',
            url: 'http://ttbackend.sencha.local/tasks/GetTasks.php',
            reader: {
                rootProperty: 'data',
                totalProperty: 'count'
            }
        }
    },
    columns: [{
        text: 'Task Id',
        dataIndex: 'task_id',
        width: 120,
        filter: 'number',
        hidden: true
    }, {
        text: 'Admin Name',
        dataIndex: 'admin_name',
        width: 200,
        filter: 'string',
        hideable: false
    }, {
        text: 'User Name',
        dataIndex: 'user_name',
        width: 200,
        filter: 'string'
    }, {
        text: 'Activity',
        dataIndex: 'activity_id',
        renderer: function (value,cell,row) {
            return "<span class='fa fa-"+row.data.icon+"'></span> "+row.data.activity;
        },
        width: 200,
        filter: {
            type: 'list',
            idField: 'activity_id',
            labelField: 'activity',
            store: {
                type: 'activity_store'
            }
        }
    }, {
        text: 'Status',
        dataIndex: 'status_id',
        width: 200,
        renderer: function (value,cell,row) {
            return "<b style='color:#"+row.data.color+";'>"+row.data.status+"</b>";
        },
        filter: {
            type: 'list',
            idField: 'status_id',
            labelField: 'status',
            store: {
                type: 'status_store'
            }
        }
    }, {
        text: 'Productive',
        dataIndex: 'productive',
        width: 80,
        renderer: function (value,cell,row) {
            return (value==1) ? "Productive" : "Unproductive";
        },
        filter: 'boolean'
    }, {
        xtype: 'datecolumn',
        text: 'Deadline',
        dataIndex: 'deadline_date',
        width: 150,
        filter: {
            type: 'date',
            value: {
                gt: new Date()
            }
        }
    }, {
        text: 'Estimated time',
        dataIndex: 'estimated_time',
        width: 80,
    }, {
        text: 'Elapsed Time',
        dataIndex: 'elapsed_time',
        width: 80,
        renderer: function (value) {
            return Ext.util.Format.number(value/60,"0.00");
        }
    }, {
        text: 'Hourly Cost',
        dataIndex: 'price',
        width: 80,
        renderer: function (value) {
            return "$"+Ext.util.Format.number(value,"0.00");
        }
    }, {
        text: 'Invoiced Amount',
        dataIndex: 'invoiced_amount',
        width: 80,
        renderer: function (value) {
            return "$"+Ext.util.Format.number(value,"0.00");
        }
    }, {
        text: 'Notes',
        dataIndex: 'notes',
        flex: 1,
        minWidth: 140
    }, {
        text: 'Active',
        dataIndex: 'active',
        width: 80,
        filter: {
            type: 'boolean',
            value: 1
        },
        renderer: function (value) {
            return (value==1) ? "Active" : "Hidden";
        }
    }, {
        xtype: 'actioncolumn',
        sortable: false,
        menuDisabled: true,
        items: [{
            iconCls: 'fa fa-edit',
            tooltip: 'Edit Task',
            isDisabled: function (gridTable, rowIndex, colIndex, action, row) {
                return gridTable.up('grid').gridType!=='admin';
            },
            handler: function (grid, rowIndex, colIndex) {
                // Open an Edit Window
                    let rowData = grid.getStore().getAt(rowIndex);
                    let myWindow=Ext.create('TTApp.EditWindow', {
                        rowData: rowData.data,
                        userData: grid.getUserData,
                        panelType: 'edit',
                        taskId: rowData.data.task_id,
                        gridStore: grid.getStore()
                    });
                    myWindow.show();
            }
        }, {
            iconCls: 'fa fa-trash',
            tooltip: 'Delete Row',
            isDisabled: function (gridTable, rowIndex, colIndex, action, row) {
                return gridTable.up('grid').gridType!=='admin';
            },
            handler: function (grid, rowIndex, colIndex) {
                // Open an Confirm Window
                Ext.Msg.confirm('Delete',"Are you sure?", function (btn) {
                    if (btn==='yes') {
                        // DELETE
                        let taskId = grid.getStore().getAt(rowIndex).get('task_id');
                        grid.mask('Deleting...');
                        Ext.Ajax.request({
                            url: 'http://ttbackend.sencha.local/tasks/editTask.php',
                            method: 'DELETE',
                            params: {
                                taskId: taskId
                            },
                            success: function () {
                                grid.unmask();
                                grid.getStore().load();
                            },
                            failure: function () {
                                grid.unmask();
                            },
                        });
                    }
                });
            }
        }, {
            iconCls: 'fa fa-eye',
            tooltip: 'View Task Details',
            handler: function (grid, rowIndex, colIndex) {
                // Open an Edit Window
                    let rowData = grid.getStore().getAt(rowIndex);
                    let myWindow=Ext.create('Ext.window.Window', {
                        title: 'Details',
                        width: 1000,
                        minHeight: 600,
                        layout: {
                            type: 'hbox',
                            align: 'stretch'
                        },
                        modal: true,
                        bbar: ['->',{
                            xtype: 'button',
                            text: 'Close',
                            handler: function () {
                                myWindow.close();
                            }
                        }],
                        items: [{
                            xtype: 'panel',
                            width: 500,
                            bodyPadding: 16,
                            layout: {
                                type: 'vbox',
                                align: 'stretch'
                            },
                            defaults: {
                                labelAlign: 'top',
                                xtype: 'textfield',
                                width: '100%',
                                readOnly: true,
                                defaults: {
                                    labelAlign: 'top',
                                    xtype: 'textfield',
                                    width: '100%',
                                    readOnly: true,
                                    flex: 1,
                                },
                            },
                            items: [{
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                items: [{
                                    fieldLabel: 'Id',
                                    value: rowData.data.task_id,
                                }, {
                                    xtype: 'datefield',
                                    fieldLabel: 'Deadline',
                                    value: new Date(rowData.data.deadline_date),
                                }, ], 
                            }, {
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                items: [{
                                    fieldLabel: 'Productive',
                                    fieldStyle: {
                                        color: (rowData.data.productive!="0") ? '#396' : '#933',
                                        fontWeight: 'bold',
                                    },
                                    value: (rowData.data.productive!="0") ? 'Productive' : 'Unproductive',
                                }, {
                                    fieldLabel: 'Hourly Rate',
                                    value: "$"+Ext.util.Format.number(rowData.data.price,"0,000.00"),
                                }, {
                                    fieldStyle: { fontWeight: 'bold' },
                                    fieldLabel: 'Billed Amount',
                                    value: "$"+Ext.util.Format.number(rowData.data.invoiced_amount,"0,000.00"),
                                }]
                            }, {
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                items: [{
                                    fieldLabel: 'Admin',
                                    value: rowData.data.admin_name
                                }, {
                                    fieldStyle: { fontWeight: 'bold' },
                                    fieldLabel: 'Asigned to',
                                    value: rowData.data.user_name
                                }]
                            }, {
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                items: [{
                                    fieldStyle: { fontWeight: 'bold' },
                                    fieldLabel: 'Activity',
                                    value: rowData.data.activity
                                }, {
                                    fieldStyle: { color: "#"+rowData.data.color, fontWeight: 'bold' },
                                    fieldLabel: 'Status',
                                    value: rowData.data.status
                                }]
                            }, {
                                xtype: 'fieldcontainer',
                                layout: 'hbox',
                                items: [{
                                    fieldLabel: 'Estimated Time',
                                    value: rowData.data.estimated_time+' h'
                                }, {
                                    fieldStyle: { 
                                        fontWeight: 'bold',
                                        color: ((rowData.data.elapsed_time/60)/rowData.data.estimated_time>1) 
                                            ? "#933" 
                                            : ((rowData.data.elapsed_time/60)/rowData.data.estimated_time>0.8) 
                                                ? "#993" 
                                                : "#333", 
                                    },
                                    fieldLabel: 'Elapsed Time',
                                    value: Ext.util.Format.number(rowData.data.elapsed_time/60,"0.00")+' h'
                                }]
                            }, {
                                xtype: 'textareafield',
                                fieldLabel: 'Notes',
                                value: rowData.data.notes
                            }]
                        },{
                            xtype: 'grid',
                            flex: 2,
                            store: {
                                autoLoad: true,
                                remoteSort: false,
                                remoteFilter: false,
                                sorters: [{
                                    property: 'task_track_id',
                                    direction: 'DESC'
                                }],
                                listeners: {
                                    beforeload: function (store, op) {
                                        store.getProxy().setExtraParams({
                                            userId: store.userId,
                                            taskId: rowData.get('task_id')
                                        });
                                    }
                                },
                                proxy: {
                                    type: 'ajax',
                                    url: 'http://ttbackend.sencha.local/tasks/GetTasksEvents.php',
                                    reader: {
                                        rootProperty: 'data',
                                        totalProperty: 'count'
                                    }
                                }
                            },
                            columns: [{
                                text: 'User',
                                dataIndex: 'full_name',
                                width: 200
                            }, {
                                text: 'Status',
                                dataIndex: 'status',
                                width: 120
                            },{
                                text: 'Start',
                                dataIndex: 'start_date',
                                flex: 1
                            },{
                                text: 'End',
                                dataIndex: 'end_date',
                                flex: 1
                            },{
                                text: 'Notes',
                                dataIndex: 'notes',
                                flex: 1
                            }]
                        }]
                    });
                    myWindow.show();
            }
        }, ]
    }],
    initComponent: function () {
        let me=this;
        this.callParent();
        let toolbar=this.down('toolbar');

        if (this.gridType==='admin') {
            toolbar.getComponent('startButton').setHidden(true);
            toolbar.getComponent('optionsButton').setHidden(true);
            toolbar.getComponent('currentTaskController').setHidden(true);
            this.getStore().userId  = 0;
        } else {
            this.getStore().userId  = this.getUserData.id_user;
            toolbar.getComponent('currentTaskController').setup(me,this.getUserData.id_user);
            toolbar.getComponent('options').setHidden(true);
        }
        this.getStore().load();

        this.getController().initTimer(60,true);
    }
});