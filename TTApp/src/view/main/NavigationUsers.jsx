import ReExt from "@sencha/reext";
import { useState } from "react";
import { Dashboard } from "../dashboard/Dashboard";
import { AdminGrid } from "../grids/AdminGrid";
import { UserGrid } from "../grids/UserGrid";


export const NavigationUsers = (props) => {
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
                title: 'Timetracker Application',
                cls: 'users-title-bar',
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
                        tabRotation: 0,
                    }
                }
            }}
            onTabChange={(tabPanel,newCard,oldCard) => {
                setCard(newCard);
            }}
        >
            
            <UserGrid title="My Tasks" getUserData = {getUserData} />

            
        </ReExt>
    );
}
