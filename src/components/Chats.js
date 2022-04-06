import React, { useRef, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ChatEngine, getOrCreateChat } from 'react-chat-engine';
import { auth } from '../components/firebase';

import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import Data from './Data';
 
function Chats() {
  const didMountRef = useRef(false); 
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState(null);

  useEffect(() =>{
    setUsers(Data);
  }, [])

  function createDirectChat(creds) {
    getOrCreateChat(
        creds,
        { is_direct_chat: true, usernames: [username] },
        () => setUsername('')
    )
   }

  // function renderChatForm(creds) {
  //   return (
  //       <div>
  //           <h3>Start a chat</h3>
  //           <ul className="list-group">
  //           {users.map(u => (
  //           <li style={{"cursor":"pointer"}} onClick={() => createDirectChat(creds, u.username)} key={Math.random()} className="list-group-item">{u.username}</li>
  //           ))}
  //           </ul>
  //       </div>
  //   );
  //   }

    function startDirectChat(creds) {
      setUsername("simonmumina2000@gmail.com");
      console.log(username);
      createDirectChat(creds);
    }

 

//   console.log(user);

  const handleLogout = async () =>{
    await auth.signOut();
    history.push('/');
  }

  async function getFile(url){
    const response = await fetch(url);
    const data = await response.blob();

    return new File([data], "userPhoto.jpg", { type: "image/jpeg"});
  }

  useEffect(() =>{
    if (!didMountRef.current){
        didMountRef.current = true
    
    if (!user || user === null){
        history.push('/');
        return;
    }
    axios.get('https://api.chatengine.io/users/me/', {
        headers: {
            "project-id": process.env.REACT_APP_CHAT_ENGINE_PROJECT_ID,
            "user-name": user.email,
            "user-secret": user.uid,
        }
    })
    .then(() =>{
        setLoading(false);
    })
    .catch(() =>{
        let formdata = new FormData();
        formdata.append('email', user.email);
        formdata.append('username', user.email);
        formdata.append('secret', user.uid);

        getFile(user.photoURL)
        .then((avatar) =>{
            formdata.append('avatar',avatar, avatar.name)

            axios.post('https://api.chatengine.io/users/',
            formdata,
            { headers: {
                "private-key": process.env.REACT_APP_CHAT_ENGINE_KEY
            }} 
            )
            .then(() =>{
                setLoading(false);
            })
            .catch((error) =>{
                console.log(error);
            })
        });
    })
    }
  }, [user, history])


  if(!user || loading) return "Loading..."
  return (
    <div className="chats-page">
        <nav className="navbar navbar-expand-md bg-primary navbar-dark">
          
          <a className="navbar-brand" href="#">Chat App</a>

          
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>

          
          <div className="collapse navbar-collapse" id="collapsibleNavbar">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="#">Link</a>
              </li>
              
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" id="navbardrop" data-toggle="dropdown">
                Direct message
              </a>
              <div className="dropdown-menu">
                <span className="dropdown-item">Hitman</span>
                <a className="dropdown-item" href="#">Simon</a>
                <a className="dropdown-item" href="#">Mumina</a>
              </div>
            </li>

            <li className="nav-item">
                <a className="nav-link" href="#">Create Group</a>
              </li>

            <li className="nav-item">
                <a onClick={handleLogout} className="nav-link" href="#">Logout</a>
              </li>
            </ul>
          </div>
        </nav>

        <ChatEngine 
        height = "calc(100vh - 50px)"
        projectID = { process.env.REACT_APP_CHAT_ENGINE_PROJECT_ID }
        userName = {user.email}
        userSecret = {user.uid}
        onConnect={(creds) => startDirectChat(creds)}
        // onGetOtherPeople={(chatId, people) => console.log(people)}
        // renderNewChatForm={(creds) => renderChatForm(creds)}
        />
    </div>
  );
}

export default Chats;