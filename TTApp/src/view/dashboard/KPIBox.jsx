import ReExt from "@sencha/reext";


export const KPIBox = (props) => {
    return (
        <ReExt 
            xtype="kpi-box"
            config={{
                height: props.height || 200,
                propertyTitle: props.title,
                propertyName: props.name,
                propertyType: props.type,
                propertyUrl: props.url,
                propertyColor: (props.color!==undefined && props.color!==null) ? props.color : "#333"
            }}
        />
    )
}