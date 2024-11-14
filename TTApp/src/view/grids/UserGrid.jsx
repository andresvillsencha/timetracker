import ReExt from "@sencha/reext";


export const UserGrid = (props) => {
    const getUserData = () => {
        return props.getUserData();
    }
    
    return (
        <ReExt 
            xtype="taskgrid"
            config={{
                title: props.title,
                gridType: 'usertasks',
                getUserData: getUserData()
            }}
        />
    )
}