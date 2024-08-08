import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPosts, addPost } from '../services/firestoreService';

const ThreadDetail = ({ userId }) => {
    const { threadId } = useParams();
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            const posts = await getPosts(threadId);
            setPosts(posts);
        };

        fetchPosts();
    }, [threadId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await addPost(threadId, content, userId);
            setContent('');
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
                {posts.map(post => (
                    <li key={post.id}>{post.content}</li>
                ))}
            </ul>
            <form onSubmit={handleSubmit}>
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
