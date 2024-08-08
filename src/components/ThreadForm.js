import React, { useState } from 'react';
import { addThread } from '../services/firestoreService';

const ThreadForm = ({ userId }) => {
    const [title, setTitle] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addThread(title, userId);
            setTitle('');
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <h2>Create New Thread</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="thread-title">Title:</label>
                    <input
                        id="thread-title"
                        name="title"
                        type="text"
                        placeholder="Thread Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoComplete="off"
                    />
                </div>
                <button type="submit">Create</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
};

export default ThreadForm;
