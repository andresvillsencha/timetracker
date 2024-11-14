import ReExt from '@sencha/reext';
import { useContext, createContext, useState } from 'react';
import { Navigation } from './view/main/Navigation';
import { NavigationAdmin } from './view/main/NavigationAdmin';
import { NavigationUsers } from './view/main/NavigationUsers';
import { LoginPanel } from './login/LoginPanel';


const Samp = () => {
  const[isAuth, setIsAuth] = useState(false);

  const handleLogin = (params) => {
    localStorage.setItem('username', params.email);
    if (params.success) {
      let dataString = Ext.util.Base64.encode(Ext.encode(params));
      sessionStorage.setItem("authData",dataString);
    }
    setIsAuth(params.success);
  }

  const handleLogout = () => {
    let dataString = Ext.util.Base64.encode(Ext.encode({}));
    sessionStorage.setItem("authData",dataString);

    setIsAuth(false);
    window.location.reload(false);
  }

  const getLoginData = () => {
    let sessionData = sessionStorage.getItem("authData");
    if (sessionData !== null) {
      return Ext.decode(Ext.util.Base64.decode(sessionData));
    } else {
      return {
        id_user: 0,
        token: "",
        success: false
      }
    }
  }

  const renderView = () => {
    let data = getLoginData();

    if (isAuth || data.success) {
      switch (data.role_id) {
        case "1": // Sys Admin
          return <Navigation logoutMethod = {handleLogout} userData = {data} />
        break;
        case "2": // Manager
          return <NavigationAdmin logoutMethod = {handleLogout} userData = {data} />
        break;
        case "3": // User
          return <NavigationUsers logoutMethod = {handleLogout} userData = {data} />
        break;
      }
    } else {
      return <LoginPanel loginMethod = {handleLogin} />
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {renderView()}
    </div>
  )
}

export default Samp;
