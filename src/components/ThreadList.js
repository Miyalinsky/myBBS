import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getThreads } from '../services/firestoreService';

const ThreadList = () => {
    const [threads, setThreads] = useState([]);

    useEffect(() => {
        const fetchThreads = async () => {
            const threads = await getThreads();
            setThreads(threads);
        };

        fetchThreads();
    }, []);

    return (
        <div>
            <h2>Threads</h2>
            <ul>
                {threads.map(thread => (
                    <li key={thread.id}>
                        <Link to={`/threads/${thread.id}`}>{thread.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ThreadList;
