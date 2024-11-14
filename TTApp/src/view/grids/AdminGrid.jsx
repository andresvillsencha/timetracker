import ReExt from "@sencha/reext";


export const AdminGrid = (props) => {
    const getUserData = () => {
        return props.getUserData();
    }

    return (
        <ReExt 
            xtype="taskgrid"
            config={{
                title: props.title,
                gridType: 'admin',
                getUserData: getUserData()
            }}
        />
    )
}