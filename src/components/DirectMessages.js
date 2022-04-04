import React, { useState } from 'react';

import { ChatEngine, getOrCreateChat } from 'react-chat-engine';
import { useAuth } from '../contexts/AuthContext';

const DirectChatPage = () => {
	const [username, setUsername] = useState('');
    const { user } = useAuth();

	function createDirectChat(creds) {
		getOrCreateChat(
			creds,
			{ is_direct_chat: true, usernames: [username] },
			() => setUsername('')
		)
	}

	function renderChatForm(creds) {
		return (
			<div>
				<input 
					placeholder='Username' 
					value={username} 
					onChange={(e) => setUsername(e.target.value)} 
				/>
				<button onClick={() => createDirectChat(creds)}>
					Create
				</button>
			</div>
		)
	}

	return (
        <ChatEngine 
        height = "calc(100vh - 66px)"
        projectID = { process.env.REACT_APP_CHAT_ENGINE_PROJECT_ID }
        userName = {user.email}
        userSecret = {user.uid}
        renderNewChatForm={(creds) => renderChatForm(creds)}
        />
	)
}

export default DirectChatPage;