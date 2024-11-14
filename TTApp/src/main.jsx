import React from 'react'
import ReactDOM from 'react-dom/client'
import { Fill, ReExtProvider } from '@sencha/reext'
import App from './App'

Fill();
var reactroot = ReactDOM.createRoot(document.getElementById('root'));
var ReExtData = { 
    "sdkversion": "7.8.0", 
    "toolkit": "classic", 
    "theme": "triton", // Do not include the "theme-"" prefix
    "packages": {
        "charts": true,
        "fontawesome": true,
        "ux": false ,
        "calendar": false,
        "d3": false ,
        "exporter": true, // THIS MIGHT CAUSE AN ISSUE IF YOU DON'T HAVE A COMMERCIAL LICENSE, BE SURE TO DEACTIVATE IT IF YOU WANT TO USE IT
        "pivot": false ,
        "pivotd3": false ,
        "pivotlocale": false,
        "froalaeditor": false
    },
    "rtl": false, 
    "locale": "en", 
    "debug": true, 
    "urlbase": "./", 
    "location": "remote",  // CHANGE TO LOCAL IF YOU HAVE AN SDK. Put the sdk in your public folder
    "overrides": false,
    // NEW
    "customfolder": "custom", // name of the folder in public
    "customfiles": [ 
        "EditWindow.jsx",

        "TaskGrid.jsx",
        "TaskGridController.jsx",

        "stores/Status.jsx",
        "stores/Activities.jsx",
        "stores/Users.jsx",

        "components/KPIBox.jsx",
        "components/CurrentTask.jsx",
    ] 
}

reactroot.render(
    <React.StrictMode>
        <ReExtProvider ReExtData={ReExtData} splash={true}>
            <App />
        </ReExtProvider>
    </React.StrictMode>
)
