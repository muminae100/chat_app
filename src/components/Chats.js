import React from 'react';
import { useHistory } from 'react-router-dom';
import { ChatEngine } from 'react-chat-engine';
import { auth } from '../components/firebase';
 
function Chats() {
  const history = useHistory();
  const handleLogout = async () =>{
    await auth.signOut();
    history.push('/');
  }
  return (
    <div className="chats-page">
        <div className="nav-bar">
            <div className="logo-tab">
                Chat app
            </div>
            <div onClick={handleLogout} className="logout-tab">
                Logout
            </div>
        </div>
        <ChatEngine 
        height = "calc(100vh - 66px)"
        projectId = "cbb27171-c896-42ed-918c-96d3a4e101e6"
        userName = "."
        userSecret = "."    
        />
    </div>
  );
}

export default Chats;