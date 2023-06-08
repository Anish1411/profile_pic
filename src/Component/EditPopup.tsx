import React, { useState, ChangeEvent, FormEvent } from "react";
import "./EditPopup.css";

interface EditPopupProps {
    user: {
        username: string;
        email: string;
        phone: string;
        website: string;
    };
    onSave: (editedUser: {
        username: string;
        email: string;
        phone: string;
        website: string;
    }) => void;
    onCancel: () => void;
}

const EditPopup: React.FC<EditPopupProps> = ({ user, onSave, onCancel }) => {
    const [editedUser, setEditedUser] = useState({
        username: user.username,
        email: user.email,
        phone: user.phone,
        website: user.website,
    });

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedUser((prevEditedUser) => ({ ...prevEditedUser, [name]: value }));
    };

    const handleSave = (e: FormEvent) => {
        e.preventDefault();
        onSave(editedUser);
    };

    return (
        <div className="editOverlay">
            <div className="editPopup">
                <h2>Edit User</h2>
                <form onSubmit={handleSave}>
                    <div className="formGroup">
                        <label htmlFor="username">
                            <span className="required">*</span> Username :
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={editedUser.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="formGroup">
                        <label htmlFor="email">
                            <span className="required">*</span> Email :
                        </label>
                        <input
                            type="text"
                            id="email"
                            name="email"
                            value={editedUser.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="formGroup">
                        <label htmlFor="phone">
                            <span className="required">*</span> Phone :
                        </label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={editedUser.phone}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="formGroup">
                        <label htmlFor="website">
                            <span className="required">*</span> Website :
                        </label>
                        <input
                            type="text"
                            id="website"
                            name="website"
                            value={editedUser.website}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="buttons">
                        <button className="cancelButton" onClick={onCancel}>
                            Cancel
                        </button>
                        <button className="saveButton" type="submit">
                            Ok
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditPopup;
