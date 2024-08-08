import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPosts, addPost } from '../services/firestoreService';
import axios from 'axios';
import crypto from 'crypto-browserify';

const ThreadDetail = ({ userId }) => {
    const { threadId } = useParams();
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState('');
    const [handleName, setHandleName] = useState('');
    const [error, setError] = useState('');
    const [userIp, setUserIp] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            const posts = await getPosts(threadId);
            setPosts(posts);
        };

        fetchPosts();
        fetchUserIp();
    }, [threadId]);

    const fetchUserIp = async () => {
        try {
            const response = await axios.get('https://api.ipify.org?format=json');
            setUserIp(response.data.ip);
        } catch (error) {
            console.error('Error fetching user IP: ', error);
        }
    };

    const generateUserId = (ip) => {
        return crypto.createHash('sha256').update(ip).digest('hex').slice(0, 8);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const userIdByIp = generateUserId(userIp);
            await addPost(threadId, content, userId, handleName || '名無し', userIdByIp);
            setContent('');
            setHandleName('');
            const updatedPosts = await getPosts(threadId);
            setPosts(updatedPosts);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div>
            <button
                onClick={() => navigate(-1)}
                style={{
                    marginBottom: '10px',
                    padding: '10px 20px',
                    backgroundColor: '#007BFF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                Back
            </button>
            <h2>Thread Detail</h2>
            <ul>
                {posts.map((post, index) => (
                    <li key={post.id}>
                        <div>
                            <strong>{String(index + 1).padStart(4, '0')}</strong> {post.handleName} {new Date(post.createdAt.toDate()).toLocaleString()}
                        </div>
                        <div>{post.content}</div>
                        <div style={{ textAlign: 'right', fontSize: 'smaller', color: 'gray' }}>ID: {post.userIdByIp}</div>
                    </li>
                ))}
            </ul>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="handle-name">Handle Name:</label>
                    <input
                        id="handle-name"
                        name="handleName"
                        type="text"
                        placeholder="Handle Name (Optional)"
                        value={handleName}
                        onChange={(e) => setHandleName(e.target.value)}
                        autoComplete="off"
                    />
                </div>
                <div>
                    <label htmlFor="post-content">New Post:</label>
                    <textarea
                        id="post-content"
                        name="content"
                        placeholder="Write your post here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </div>
                <button type="submit">Post</button>
            </form>
            {error && <p>{error}</p>}
        </div>
    );
};

export default ThreadDetail;
