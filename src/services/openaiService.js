import axios from 'axios';
import { getPosts } from './firestoreService'; // スレッドの投稿を取得する関数をインポート

export const generateThreadOrPost = async (prompt, threadId = null) => {
    const apiKey = process.env.REACT_APP_OPENAI_API_KEY;
    if (!apiKey) {
        throw new Error("OpenAI API key is missing");
    }

    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
    };

    let threadContent = "";
    if (threadId) {
        const posts = await getPosts(threadId);
        threadContent = posts.map(post => `${post.handleName}: ${post.content}`).join('\n');
    }

    const data = {
        model: 'gpt-3.5-turbo', // または 'gpt-4'
        messages: [
            { role: 'system', content: '以下のスレッドに基づいて、適切な返信を生成してください。' },
            { role: 'user', content: `スレッドの内容:\n${threadContent}\n\n質問またはコメント: ${prompt}` }
        ],
        max_tokens: 150,
    };

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', data, { headers });
        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error generating thread or post:', error.response ? error.response.data : error);
        throw error;
    }
};
