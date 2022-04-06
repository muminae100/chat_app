import React, { useRef, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ChatEngine } from 'react-chat-engine';
import { auth } from '../components/firebase';

import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
 
function Chats() {
  const didMountRef = useRef(false); 
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const { user } = useAuth();
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState(null);
  const [value, setValue] = useState('');

  const createGroup = () =>{
    let formData = new FormData();
    formData.append('title', value);
    formData.append('is_direct_chat', false);

    axios.post('https://api.chatengine.io/chats/',
    formData,
    {headers: {
        "Project-ID": process.env.REACT_APP_CHAT_ENGINE_PROJECT_ID,
        "User-Name": user.email,
        "User-Secret": user.uid,
    }
    })
    .then((res) =>{
      console.log(res);
    })
    .catch((error) =>{
      console.log(error.message);
    })

  }

  // const createChat = (usernm) =>{
  //   setUsername(usernm);
  //   createDirectChat();
  // }

  const createDirectChat = () =>{
    console.log("username is",username);
    let formData = new FormData();
    formData.append('usernames', [username]);
    formData.append('is_direct_chat', true);

    axios.put('https://api.chatengine.io/chats/',
    formData,
    {headers: {
        "Project-ID": process.env.REACT_APP_CHAT_ENGINE_PROJECT_ID,
        "User-Name": user.email,
        "User-Secret": user.uid,
    }
    })
    .then((res) =>{
      console.log(res);
    })
    .catch((error) =>{
      console.log(error.message);
    })

  }

  const handleSubmit = (e) =>{
    e.preventDefault();
    createGroup();
  }

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
    axios.get('https://api.chatengine.io/users/', {
        headers: {
            "private-key": process.env.REACT_APP_CHAT_ENGINE_KEY,
        }
    })
    .then((response) =>{
      if(response.status === 200){
        setUsers(response.data);
        // console.log(response.data);
      }
    });


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
        formdata.append('first_name', user.displayName);
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
          
          <span className="navbar-brand">Chat App</span>

          
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>

          
          <div className="collapse navbar-collapse" id="collapsibleNavbar">
            <ul className="navbar-nav">
              
            <li className="nav-item dropdown">
              <span className="nav-link dropdown-toggle" id="navbardrop" data-toggle="dropdown">
                Direct message
              </span>
              <div className="dropdown-menu">
                {users.map(u =>(
                  <>
                  <span key={Math.random()}
                  className="dropdown-item"
                  onClick={() =>setUsername(u.email)}
                  >{u.email}</span>
                  <span key={Math.random()} onClick={createDirectChat}>Chat</span>
                  </>
                ))}
               
              </div>
            </li>

            <form className="form-inline" onSubmit={handleSubmit}>
              <input 
              className="form-control mr-sm-2" 
              type="text" name="textInput" 
              placeholder="Create new group" 
              value = {value}
              onChange={(e) => setValue(e.target.value)}
              />

              <button className="btn btn-success" type="submit">Create Group</button>
            </form>

            <li className="nav-item">
                <span onClick={handleLogout} className="nav-link">Logout</span>
              </li>
            </ul>
          </div>
        </nav>

        <ChatEngine 
        height = "calc(100vh - 50px)"
        projectID = { process.env.REACT_APP_CHAT_ENGINE_PROJECT_ID }
        userName = {user.email}
        userSecret = {user.uid}
        />
    </div>
  );
}

export default Chats;