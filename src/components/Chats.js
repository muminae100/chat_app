import React, { useRef, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { ChatEngine } from 'react-chat-engine';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import Header from './Header';
 
function Chats() {
  const didMountRef = useRef(false); 
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const { user } = useAuth();

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


    let formData = new FormData();
    formData.append('usernames', ["smuminaetx100@gmail.com"]);
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
  }, [user, history])


  if(!user || loading) return "Loading..."
  return (
    <div className="chats-page">
        <Header />
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