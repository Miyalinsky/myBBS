import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getThreads, getPostCount } from '../services/firestoreService';
import './ThreadList.css'; // CSSファイルをインポート

const ThreadList = () => {
    const [threads, setThreads] = useState([]);

    useEffect(() => {
        const fetchThreads = async () => {
            try {
                const threadsData = await getThreads();
                const threadsWithCount = await Promise.all(threadsData.map(async (thread) => {
                    const postCount = await getPostCount(thread.id);
                    return { ...thread, postCount };
                }));
                setThreads(threadsWithCount);
            } catch (error) {
                console.error('Error fetching threads: ', error);
            }
        };

        fetchThreads();
    }, []);

    return (
        <div className="thread-list">
            {threads.map(thread => (
                <Link key={thread.id} to={`/thread/${thread.id}`} className="thread-link">
                    <div className="thread">
                        <div className="thread-header">
                            <span className="thread-date">{new Date(thread.createdAt.toDate()).toLocaleString()}</span>
                            <span className="thread-count">{thread.postCount} レス</span>
                        </div>
                        <div className="thread-title">
                            {thread.title}
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default ThreadList;
