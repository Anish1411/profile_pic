import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrashAlt, faPencilAlt, faEnvelope, faPhone, faGlobe } from '@fortawesome/free-solid-svg-icons';
import Wait from './Component/waiting';
import EditPopup from './Component/EditPopup';

function App() {
  const [userProfiles, setUserProfiles] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let fetchTimeout;

    const fetchUsers = async () => {
      try {
        // Fetching user data from API

        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        const users = response.data.slice(0, 10);

        // generating avatar using Dicebar API

        const updatedUserProfiles = await Promise.all(
          users.map(async (user) => {
            const avatarResponse = await axios.get(`https://avatars.dicebear.com/v2/avataaars/${user.username}.svg?options[mood][]=happy`, {
              params: {
                background: 'transparent',
                width: 200,
                height: 200,
              },
            });

            return {
              id: user.id,
              username: user.username,
              email: user.email,
              phone: user.phone,
              website: user.website,
              avatar: avatarResponse.config.url,
              liked: false,
            };
          })
        );

        setUserProfiles(updatedUserProfiles);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchTimeout = setTimeout(() => {
      fetchUsers();
    }, 1500);

    return () => clearTimeout(fetchTimeout);
  }, []);

  const handleLike = (userId) => {
    setUserProfiles((prevUserProfiles) =>
      prevUserProfiles.map((user) =>
        user.id === userId ? { ...user, liked: !user.liked } : user
      )
    );
  };

  const handleDelete = (userId) => {
    setUserProfiles((prevUserProfiles) =>
      prevUserProfiles.filter((user) => user.id !== userId)
    );
  };

  const handleEdit = (userId) => {
    setEditUserId(userId);
  };

  const handleSaveEdit = (editedUser) => {
    setUserProfiles((prevUserProfiles) =>
      prevUserProfiles.map((user) =>
        user.id === editUserId ? { ...user, ...editedUser } : user
      )
    );
    setEditUserId(null);
  };

  const handleCancelEdit = () => {
    setEditUserId(null);
  };

  return (
    <div className="container">
      {isLoading ? (
        <div className="loadingSpinner">
          <Wait />
        </div>
      ) : (
        <div className="userList">
          {userProfiles.map((user) => (
            <div key={user.id} className="userCard">
              <div className="avatarSection">
                <img src={user.avatar} alt={`Avatar for ${user.username}`} className="avatar" />
              </div>
              <div className="userDetails">
                <p className="username">{user.username}</p>
                <p className="userDetail">
                  <FontAwesomeIcon icon={faEnvelope} className="icon" />
                  {user.email}
                </p>
                <p className="userDetail">
                  <FontAwesomeIcon icon={faPhone} className="icon" />
                  {user.phone}
                </p>
                <p className="userDetail">
                  <FontAwesomeIcon icon={faGlobe} className="icon" />
                  {user.website}
                </p>
              </div>
              <div className="actions">
                <span
                  className={`actionIcon ${user.liked ? 'liked' : ''}`}
                  onClick={() => handleLike(user.id)}
                >
                  <FontAwesomeIcon
                    icon={faHeart}
                    className={`heartIcon ${user.liked ? 'fill' : ''}`}
                  />
                </span>
                <span className="actionIcon" onClick={() => handleEdit(user.id)}>
                  <FontAwesomeIcon icon={faPencilAlt} className="editIcon" />
                </span>
                <span className="actionIcon" onClick={() => handleDelete(user.id)}>
                  <FontAwesomeIcon icon={faTrashAlt} className="trashIcon" />
                </span>

              </div>
            </div>
          ))}
        </div>
      )}

      {editUserId && (
        <EditPopup
          user={userProfiles.find((user) => user.id === editUserId)}
          onSave={handleSaveEdit}
          onCancel={handleCancelEdit}
        />
      )}
    </div>
  );
}

export default App;
