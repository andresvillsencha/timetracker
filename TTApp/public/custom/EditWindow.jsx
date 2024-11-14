// Ext.Define -- exact class

Ext.define('TTApp.EditWindow', {
    extend: 'Ext.window.Window',
    xtype: 'tt-edit-window',
    title: 'Edit Task',
    width: 500,
    minHeight: 400,
    modal: true,

    layout: 'fit',
    userData: null,
    panelType: 'new',
    taskId: 0,
    gridStore: null,

    bodyPadding: 16,
    resizable: false,

    buttons: [{
        text: 'Save and Close',
        handler: function () {
            // Validating the data
                let wind=this.up('tt-edit-window');
                let form = wind.down('form');
                let formObj = form.getForm();
                let data = formObj.getValues();

                if (formObj.isValid()) {
                    // SAVE
                        wind.mask('Saving');
                        formObj.submit({
                            url: 'http://ttbackend.sencha.local/tasks/editTask.php',
                            method: (wind.panelType=='new') ? 'POST' : 'PUT',
                            params: {
                                taskId: wind.taskId
                            },
                            success: function() {
                                wind.unmask();
                                console.log('success');
                                if (wind.gridStore !== null) wind.gridStore.load();
                                wind.close();
                            },
                            failure: function () {
                                wind.unmask();
                                console.log('failure');
                            }
                        });
                } else {
                    Ext.Msg.alert('Oops', 'There is something wrong');
                }
        }
    }, {
        text: 'Cancel',
        handler: function () {
            this.up('tt-edit-window').close();
        }
    }],

    items: [{
        xtype: 'form',
        layout: 'vbox',
        bodyStyle: {
            border: 'none'
        },
        items: [{
            xtype: 'combobox',
            fieldLabel: 'Created by',
            name: 'created_by',
            itemId: 'created_by',
            value: '',
            width: '100%',
            displayField: 'full_name',
            valueField: 'user_id',
            queryMode: 'local',
            readOnly: true,
            store: {
                type: 'users_store'
            }
        }, {
            xtype: 'combobox',
            fieldLabel: 'Assigned To',
            name: 'assigned_to',
            itemId: 'assigned_to',
            value: '',
            width: '100%',
            displayField: 'full_name',
            valueField: 'user_id',
            queryMode: 'local',
            allowBlank: false,
            store: {
                type: 'users_store'
            }
        }, {
            xtype: 'combobox',
            fieldLabel: 'Activity',
            name: 'activity_id',
            itemId: 'activity_id',
            value: '',
            width: '100%',
            displayField: 'activity',
            valueField: 'activity_id',
            queryMode: 'remote',
            queryParam: 'q',
            minChars: 1,
            allowBlank: false,
            store: {
                type: 'activity_store'
            }
        }, {
            xtype: 'combobox',
            fieldLabel: 'Status',
            name: 'status_id',
            itemId: 'status_id',
            value: '',
            width: '100%',
            displayField: 'status',
            valueField: 'status_id',
            queryMode: 'remote',
            queryParam: 'q',
            minChars: 1,
            allowBlank: false,
            store: {
                type: 'status_store'
            }
        }, {
            xtype: 'numberfield',
            fieldLabel: 'Estimated Time',
            name: 'estimated_time',
            itemId: 'estimated_time',
            value: '1',
            width: '100%',
            allowBlank: false,
        }, {
            xtype: 'datefield',
            fieldLabel: 'Deadline date',
            name: 'deadline_date',
            itemId: 'deadline_date',
            value: new Date(),
            width: '100%',
            allowBlank: false
        }, {
            xtype: 'textareafield',
            fieldLabel: 'Notes',
            name: 'notes',
            itemId: 'notes',
            value: "",
            width: '100%',
            height: 60
        }],
    }],

    

    initComponent: function () {
        this.callParent();

        let form = this.down('form');
        // LETS GET ONE FIELD
            if (this.rowData!==null) {
                form.getForm().setValues(this.rowData);
                form.getComponent('deadline_date').setValue(new Date(this.rowData.deadline_date));
            } else if (this.userData!==null) {
                form.getComponent('created_by').setValue(this.userData.id_user);
            }

            if (this.panelType==='new') {
                form.getComponent('deadline_date').setMinValue(new Date());
                form.getComponent('status_id').allowBlank=true;
                form.getComponent('status_id').allowBlank=true;
            }
    },

});