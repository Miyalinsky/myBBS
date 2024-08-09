import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPosts, addPost, getThreadTitle, deletePost } from '../services/firestoreService';
import { checkIfUserIsAdmin } from '../services/authService';
import axios from 'axios';
import crypto from 'crypto-browserify';
import './ThreadDetail.css'; // CSSファイルをインポート

const ThreadDetail = ({ userId }) => {
    const { threadId } = useParams();
    const [posts, setPosts] = useState([]);
    const [content, setContent] = useState('');
    const [handleName, setHandleName] = useState('');
    const [error, setError] = useState('');
    const [userIp, setUserIp] = useState('');
    const [threadTitle, setThreadTitle] = useState('');
    const [isAdmin, setIsAdmin] = useState(false); // 管理者かどうかのステータス
    const navigate = useNavigate();
    const textAreaRef = useRef(null);

    useEffect(() => {
        const fetchThreadData = async () => {
            try {
                const posts = await getPosts(threadId);
                const title = await getThreadTitle(threadId);
                const isAdminUser = await checkIfUserIsAdmin(userId); // 管理者かどうかを確認
                setPosts(posts);
                setThreadTitle(title);
                setIsAdmin(isAdminUser); // 管理者ステータスを設定
            } catch (error) {
                console.error(error);
            }
        };

        fetchThreadData();
        fetchUserIp();
    }, [threadId, userId]);

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

    const handleDeletePost = async (postId) => {
        if (isAdmin) {
            if (window.confirm("本当にこのレスを削除しますか？")) {
                await deletePost(threadId, postId);
                const updatedPosts = await getPosts(threadId);
                setPosts(updatedPosts);
            }
        } else {
            alert("この操作を行う権限がありません。");
        }
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
        adjustTextAreaHeight(e.target);
    };

    const adjustTextAreaHeight = (textarea) => {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    };

    useEffect(() => {
        if (textAreaRef.current) {
            adjustTextAreaHeight(textAreaRef.current);
        }
    }, [content]);

    const escapeHtml = (unsafe) => {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
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
            <h2>{threadTitle}</h2>
            <ul>
                {posts.map((post, index) => (
                    <li key={post.id} className="post">
                        <div className="post-header" style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <div>
                                <strong>{String(index + 1).padStart(4, '0')}</strong> {post.handleName} {new Date(post.createdAt.toDate()).toLocaleString()}
                            </div>
                            <div>ID: {post.userIdByIp}</div>
                        </div>
                        <div className="post-content">{escapeHtml(post.content)}</div>
                        {isAdmin && (
                            <button
                                onClick={() => handleDeletePost(post.id)}
                                style={{ display: 'block', marginLeft: 'auto', backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px' }}
                            >
                                レスを削除
                            </button>
                        )}
                    </li>
                ))}
            </ul>
            <div className="form-container">
                <form onSubmit={handleSubmit}>
                    <input
                        id="handle-name"
                        name="handleName"
                        type="text"
                        placeholder="名前（省略化）"
                        value={handleName}
                        onChange={(e) => setHandleName(e.target.value)}
                        autoComplete="off"
                    />
                    <textarea
                        id="post-content"
                        name="content"
                        value={content}
                        onChange={handleContentChange}
                        ref={textAreaRef}
                        rows="1"
                        style={{ overflow: 'hidden' }}
                    />
                    <button type="submit">Post</button>
                </form>
                {error && <p>{error}</p>}
            </div>
        </div>
    );
};

export default ThreadDetail;
