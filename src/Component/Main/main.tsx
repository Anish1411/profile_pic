import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './main.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faTrashAlt, faPencilAlt, faEnvelope, faPhone, faGlobe } from '@fortawesome/free-solid-svg-icons';
import Wait from '../WaitingSpinnerComponent/waiting.tsx';
import EditPopup from '../EditUserDetails/EditPopup.tsx';

interface UserProfile {
    id: number;
    username: string;
    email: string;
    phone: string;
    website: string;
    avatar: string;
    liked: boolean;
}

const API_USERS_URL = 'https://jsonplaceholder.typicode.com/users';
const DICEBEAR_API_URL = 'https://avatars.dicebear.com/v2/avataaars';

function Main() {
    const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
    const [editUserId, setEditUserId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let fetchTimeout: NodeJS.Timeout;

        const fetchUserProfiles = () => {
            axios.get(API_USERS_URL)
                .then(response => {
                    const users: any[] = response.data.slice(0, 10);

                    Promise.all(
                        users.map(user => {
                            return axios.get(`${DICEBEAR_API_URL}/${user.username}.svg`, {
                                params: {
                                    options: {
                                        mood: ['happy'],
                                    },
                                    background: 'transparent',
                                    width: 200,
                                    height: 200,
                                },
                            }).then(avatarResponse => ({
                                id: user.id,
                                username: user.username,
                                email: user.email,
                                phone: user.phone,
                                website: user.website,
                                avatar: avatarResponse.config.url,
                                liked: false,
                            }));
                        })
                    ).then(updatedUserProfiles => {
                        setUserProfiles(updatedUserProfiles);
                        setIsLoading(false);
                    });
                })
                .catch(error => {
                    console.error('Error fetching user data:', error);
                });
        };

        fetchTimeout = setTimeout(fetchUserProfiles, 1500);

        return () => clearTimeout(fetchTimeout);
    }, []);

    const handleLike = (userId: number) => {
        setUserProfiles((prevUserProfiles) =>
            prevUserProfiles.map((user) => (user.id === userId ? { ...user, liked: !user.liked } : user))
        );
    };

    const handleDelete = (userId: number) => {
        setUserProfiles((prevUserProfiles) => prevUserProfiles.filter((user) => user.id !== userId));
    };

    const handleEdit = (userId: number) => {
        setEditUserId(userId);
    };

    const handleSaveEdit = (editedUser: Partial<UserProfile>) => {
        setUserProfiles((prevUserProfiles) =>
            prevUserProfiles.map((user) => (user.id === editUserId ? { ...user, ...editedUser } : user))
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
                                <span className={`actionIcon ${user.liked ? 'liked' : ''}`} onClick={() => handleLike(user.id)}>
                                    <FontAwesomeIcon icon={faHeart} className={`heartIcon ${user.liked ? 'fill' : ''}`} />
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

export default Main;
