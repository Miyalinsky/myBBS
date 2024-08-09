import { generateThreadOrPost } from './openaiService';
import { addThreadWithFirstPost, addPost, getThreads } from './firestoreService';

export const startPolling = (userId) => {
    setInterval(async () => {
        try {
            const threads = await getThreads();
            const shouldCreateThread = Math.random() < 0.1;

            if (shouldCreateThread) {
                const threadTitlePrompt = '5chの掲示板で使われるようなカジュアルな会話スタイルで、5chのスレッドを参考に、新しいスレッドのタイトルを作成してください。文頭に「回答：」や「返信：」といった形式的な言葉は使わないでください。';
                const threadContentPrompt = '5chの掲示板で使われるようなカジュアルな会話スタイルで、スレッドタイトルに沿った最初のレスを生成してください。文頭に「回答：」や「返信：」といった形式的な言葉は使わないでください。';
                const title = await generateThreadOrPost(threadTitlePrompt);
                const content = await generateThreadOrPost(threadContentPrompt);

                const userIp = '0.0.0.0';
                const handleName = 'AI Bot';
                const userIdByIp = generateUserId(userIp); // generateUserIdを使用

                await addThreadWithFirstPost(title, userId, content, handleName, userIdByIp);
            } else {
                const randomThreadIndex = Math.floor(Math.random() * threads.length);
                const threadId = threads[randomThreadIndex].id;
                const postPrompt = '5chの掲示板で使われるようなカジュアルな会話スタイルで、次の内容に返信を書いてください。文頭に「回答：」や「返信：」といった形式的な言葉は使わないでください。';
                const content = await generateThreadOrPost(postPrompt, threadId);

                const userIp = '0.0.0.0';
                const handleName = 'AI Bot';
                const userIdByIp = generateUserId(userIp); // generateUserIdを使用

                await addPost(threadId, content, userId, handleName, userIdByIp);
            }
        } catch (error) {
            console.error('Error in polling:', error);
        }
    }, 600000); //10分に1回ポーリング
};

function simpleHash(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // 32bit intに変換
    }
    return Math.abs(hash).toString(16); // 正の整数にして16進数に変換
}

const generateUserId = (ip) => {
    return simpleHash(ip).slice(0, 8);
};
