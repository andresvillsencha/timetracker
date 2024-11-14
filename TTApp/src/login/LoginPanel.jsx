import ReExt from "@sencha/reext";

export const LoginPanel = (props) => {
    const handleLogin = (result) => {
        props.loginMethod(result);
    }

    return (
        <ReExt 
            xtype="panel"
            config={{
                bodyStyle: {
                    background: 'url(/resources/background.jpg)',
                    backgroundSize: 'cover'
                },
                layout: {
                    type: 'center'
                }
            }}
        >
            <ReExt
                xtype="form"
                style={{
                    width: 300,
                    height: 400
                }}
                config={{
                    title: 'Time Tracker',
                    bodyPadding: 16,
                    defaults: {
                        xtype: 'textfield',
                        width: '100%',
                        labelAlign: 'top',
                        allowBlank: false,
                        msgTarget: 'side',
                        minLength: 4,
                        maxLength: 50,
                        enforceMaxLength: true
                    },
                    items: [{
                        xtype: 'image',
                        src: '/resources/logo.png',
                        height: 98
                    }, {
                        name: 'username',
                        fieldLabel: 'Email',
                        vtype: 'email',
                        value: (localStorage.getItem('username')!==undefined) ? localStorage.getItem('username') : ""
                    },{
                        name: 'password',
                        fieldLabel: 'Password',
                        inputType: 'password',
                        maxLength: 12
                    }, {
                        xtype: 'checkboxfield',
                        name: 'pwdvisible',
                        boxLabel: 'View Password',
                        handler: function () {
                            let pwdField = this.previousSibling();
                            pwdField.inputEl.dom.type = (this.checked)  ? 'text' : 'password';
                        }
                    }, {
                        xtype: 'button',
                        text: 'Login',
                        handler: function () {
                            let form = this.up('panel').getForm();
                            let panel = this.up('panel');

                            if (form.isValid()) {
                                // PERFORM LOGIN
                                panel.mask('validating');
                                form.submit({
                                    url: 'http://ttbackend.sencha.local/login/login.php',
                                    success: function (form, action) {
                                        console.log('success');
                                        panel.unmask();
                                        handleLogin(action.result);

                                    }, 
                                    failure: function (form, action) {
                                        panel.unmask();
                                        Ext.Msg.alert('Couldnt login', action.result.message);
                                    }
                                });
                            } else {
                                Ext.Msg.alert('Missing Credentials','Make sure you enter a valid email and password');
                            }
                        }
                    }]
                }}
             >
            </ReExt>
        </ReExt>
    );
 }