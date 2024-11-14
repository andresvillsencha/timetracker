import ReExt from "@sencha/reext";
import { useState } from "react";
import { Dashboard } from "../dashboard/Dashboard";
import { AdminGrid } from "../grids/AdminGrid";
import { UserGrid } from "../grids/UserGrid";


export const Navigation = (props) => {
    const [card, setCard] = useState(false);

    const logout = () => {
        props.logoutMethod();
    }

    const getUserData = () => {
        return props.userData;
    }

    return (
        <ReExt 
            xtype="tabpanel"
            config={{
                title: 'Timetracker Application [SysAdmin]',
                header: {
                    items: [{
                        xtype: 'button',
                        text: 'Logout',
                        handler: function () {
                            logout();
                        }
                    }]
                },
                responsiveConfig: {
                    tall: {
                        tabPosition: 'top'
                    }, 
                    wide: {
                        tabPosition: 'left',
                        tabRotation: 0
                    }
                }
            }}
            onTabChange={(tabPanel,newCard,oldCard) => {
                setCard(newCard);
            }}
        >
            
            <Dashboard title="Dashboard" getUserData = {getUserData} />
            <AdminGrid title="Admin Tasks" getUserData = {getUserData} />
            <UserGrid title="My Tasks" getUserData = {getUserData} />

            
        </ReExt>
    );
}
