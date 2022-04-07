import React, {useState} from 'react';
import { auth } from '../components/firebase';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';


function Header() {
    const { user } = useAuth();
    const history = useHistory();
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

  const handleLogout = async () =>{
    await auth.signOut();
    history.push('/');
  }

  const handleSubmit = (e) =>{
    e.preventDefault();
    createGroup();
  }



  return (
    <nav className="navbar navbar-expand-md bg-primary navbar-dark">
          
          <span className="navbar-brand">Chat App</span>

          
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
            <span className="navbar-toggler-icon"></span>
          </button>

          
          <div className="collapse navbar-collapse" id="collapsibleNavbar">
            <ul className="navbar-nav">

            <li className="nav-item">
                <a className="nav-link" href="/chats">Chat with Me</a>
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

  )
}

export default Header;