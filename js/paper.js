/**
 * AI论文工坊 - 核心逻辑
 */

// ========== Coze 智能体配置 ==========
const PAPER_AI_CONFIG = {
    botId: '7647099879441236003',
    apiUrl: 'https://api.coze.cn/v3/chat',
    accessToken: 'pat_ZpsorG48WgFU36y8jM8f1mhON6LTaaDs3pVp8MuNokNFj6WhduC7wSGjV7aVkoUU',
};

let _paperAiConversationId = '';
let _paperAiIsThinking = false;

// ========== 功能切换 ==========
let _currentFunc = '';

function switchPaperFunc(funcName) {
    _currentFunc = funcName;

    // 隐藏欢迎面板，显示功能面板和AI面板
    document.getElementById('paperWelcome').style.display = 'none';
    document.getElementById('paperFuncPanels').style.display = 'block';
    document.getElementById('paperAiPanel').style.display = 'flex';

    // 隐藏所有功能面板
    document.querySelectorAll('.paper-func-panel').forEach(p => p.style.display = 'none');

    // 显示目标面板
    const panel = document.getElementById('panel_' + funcName);
    if (panel) panel.style.display = 'block';

    // 更新左侧选中状态
    document.querySelectorAll('.paper-func-item').forEach(item => {
        item.classList.toggle('active', item.dataset.func === funcName);
    });

    // 滚动到顶部
    document.querySelector('.paper-main').scrollTop = 0;
}

// ========== 切换/折叠 AI 面板 ==========
function togglePaperAi() {
    const body = document.getElementById('paperAiBody');
    const toggleBtn = document.querySelector('.paper-ai-toggle');
    if (body.style.display === 'none') {
        body.style.display = 'flex';
        toggleBtn.textContent = '−';
    } else {
        body.style.display = 'none';
        toggleBtn.textContent = '+';
    }
}

// ========== 调用 Coze 智能体 ==========
async function callPaperAiBot(question) {
    if (!PAPER_AI_CONFIG.accessToken) {
        throw new Error('未配置Coze访问令牌');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PAPER_AI_CONFIG.accessToken}`,
    };

    const chatBody = {
        bot_id: PAPER_AI_CONFIG.botId,
        user_id: 'paper_user_' + Date.now(),
        stream: true,
        auto_save_history: true,
        additional_messages: [
            {
                role: 'user',
                content: question,
                content_type: 'text',
            }
        ],
    };

    if (_paperAiConversationId) {
        chatBody.conversation_id = _paperAiConversationId;
    }

    const response = await fetch(PAPER_AI_CONFIG.apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(chatBody),
    });

    if (!response.ok) {
        let errMsg = `API请求失败 (HTTP ${response.status})`;
        try {
            const errData = await response.json();
            if (errData.msg) errMsg += ': ' + errData.msg;
            if (errData.code) errMsg += ` [code:${errData.code}]`;
        } catch (e) { /* ignore */ }
        throw new Error(errMsg);
    }

    // 读取SSE流（标准SSE格式: event:xxx\ndata:{...}\n\n）
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let replyText = '';
    let currentEvent = '';
    let completed = false;

    while (!completed) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        // 按双换行分割SSE事件块
        const blocks = buffer.split('\n\n');
        buffer = blocks.pop() || '';

        for (const block of blocks) {
            const lines = block.split('\n');
            let eventType = '';
            let eventData = null;

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;

                if (trimmed.startsWith('event:')) {
                    eventType = trimmed.slice(6).trim();
                } else if (trimmed.startsWith('data:')) {
                    const jsonStr = trimmed.slice(5).trim();
                    if (jsonStr === '[DONE]') {
                        completed = true;
                        break;
                    }
                    try {
                        eventData = JSON.parse(jsonStr);
                    } catch (e) { /* skip */ }
                }
            }

            if (!eventData) continue;

            // 保存对话ID
            if (eventData.conversation_id) {
                _paperAiConversationId = eventData.conversation_id;
            }

            // 处理 delta 事件 — 内容可能在 content 或 reasoning_content 字段
            if (eventType === 'conversation.message.delta') {
                const delta = eventData.content || eventData.reasoning_content || '';
                replyText += delta;
            }
            // conversation.message.completed
            else if (eventType === 'conversation.message.completed') {
                // completed 事件里的完整内容
                const content = (eventData.data && eventData.data.content) || '';
                if (content && !replyText.includes(content)) {
                    replyText = content; // 用完整内容替换
                }
            }
            // conversation.chat.completed
            else if (eventType === 'conversation.chat.completed') {
                completed = true;
                break;
            }
            // 兼容旧格式：直接在data里的role/type（仅当不是delta事件时）
            else if (eventData.role === 'assistant' && eventData.type === 'answer') {
                const c = eventData.content || eventData.reasoning_content || '';
                replyText += c;
            }
        }
    }

    return replyText || '抱歉，我没有获取到有效的回复内容。';
}

// ========== 本地AI模拟回复（当Coze API不可用时的fallback） ==========
function generatePaperAiResponse(question) {
    const q = question.toLowerCase();
    if (q.includes('选题') || q.includes('题目') || q.includes('topic')) {
        return '好的，以下是我为你推荐的论文选题方向：\n\n**1. 数字经济与金融方向**\n• 数字金融对中小企业融资约束的影响研究\n• 区块链供应链金融信用风险评估\n• 央行数字货币对货币政策传导机制的影响\n\n**2. 绿色金融方向**\n• 绿色信贷政策对企业绿色技术创新的影响\n• ESG评级与上市公司股价波动关系研究\n• 碳排放权交易对高耗能企业转型的影响\n\n**3. 公司治理方向**\n• 股权集中度与企业创新投入的关系研究\n• 高管薪酬激励对企业绩效的影响\n• 机构投资者持股与企业社会责任履行\n\n💡 告诉我你的专业方向和研究兴趣，我可以进一步定制选题建议！';
    }
    if (q.includes('开题') || q.includes('报告') || q.includes('proposal')) {
        return '开题报告一般包含以下核心部分：\n\n**1. 选题背景与意义**\n• 研究背景：描述现实问题或理论空白\n• 研究意义：理论意义 + 实践意义\n\n**2. 国内外研究现状**\n• 梳理已有研究成果\n• 指出现有研究不足和空白\n\n**3. 研究内容与方法**\n• 研究目标：解决什么问题\n• 研究内容：具体研究哪些方面\n• 研究方法：实证/案例/比较研究等\n\n**4. 技术路线与进度安排**\n• 研究步骤流程图\n• 合理的时间表\n\n**5. 预期成果与创新点**\n• 预期达到的研究成果\n• 本研究的创新之处\n\n💡 需要我针对你的具体选题详细展开某一部分吗？';
    }
    if (q.includes('文献') || q.includes('综述') || q.includes('literature')) {
        return '撰写高质量文献综述的关键步骤：\n\n**1. 确定检索策略**\n• 使用CNKI、Web of Science等数据库\n• 关键词组合检索，注意同义词\n• 设定合理时间范围（通常近5-10年）\n\n**2. 筛选与阅读文献**\n• 按相关度、引用量筛选高质量文献\n• 重点阅读摘要、引言和结论\n• 做好笔记，标注关键观点\n\n**3. 分类与归纳**\n• 按主题/方法/时间等维度分类\n• 总结各研究的主要贡献\n• 识别研究空白和争议点\n\n**4. 撰写技巧**\n• 按逻辑主线组织，而非简单罗列\n• 用"然而""此外""与此不同"等过渡词\n• 最后总结研究缺口，引出你的研究\n\n💡 需要我帮你梳理某个具体领域的文献综述框架吗？';
    }
    if (q.includes('润色') || q.includes('改写') || q.includes('polish')) {
        return '以下是论文润色的一些建议：\n\n**1. 语言表达优化**\n• 避免口语化表达，使用学术词汇\n• 句式多样化，长短句结合\n• 确保逻辑连贯，段落过渡自然\n\n**2. 结构完整性**\n• 检查摘要是否包含目的、方法、结果、结论\n• 引言是否有清晰的问题提出\n• 结论是否回应了研究问题\n\n**3. 常见问题检查**\n• 标点符号规范（中英文标点混用）\n• 图表编号和引用是否正确\n• 参考文献格式是否统一\n\n💡 如果你有一段需要润色的具体内容，可以直接发给我！';
    }
    // 默认回复
    return `关于"${question.substring(0, 30)}..."这个问题：

我可以帮你从以下几个方面来解答：
• 📚 相关理论基础
• 🔍 实证研究方法
• 📊 数据获取途径
• 📝 论文写作建议

请告诉我你更关注哪个方面，或者补充更多背景信息，我可以给你更精准的指导！\n\n<i style="color:#94a3b8;font-size:11px;">（本地AI响应 — 如需更强大的智能体服务，请确保Coze访问令牌有效）</i>`;
}

// ========== 向论文智能体提问 ==========
async function askPaperAi(presetQuestion) {
    const input = document.getElementById('paperAiInput');
    const question = presetQuestion || input.value.trim();
    if (!question || _paperAiIsThinking) return;

    if (!presetQuestion) input.value = '';

    const messagesContainer = document.getElementById('paperAiMessages');
    const welcome = document.getElementById('paperAiWelcome');
    const quickActions = document.getElementById('paperAiQuickActions');

    // 隐藏欢迎面板
    if (welcome) welcome.style.display = 'none';
    if (quickActions) quickActions.style.display = 'none';

    // 添加用户消息
    addPaperAiMessage('user', question);

    // 显示思考动画
    _paperAiIsThinking = true;
    const thinkingEl = document.createElement('div');
    thinkingEl.className = 'paper-ai-thinking';
    thinkingEl.innerHTML = '🤔 AI正在思考<span class="thinking-dot">.</span><span class="thinking-dot">.</span><span class="thinking-dot">.</span>';
    thinkingEl.id = 'paperAiThinking';
    messagesContainer.appendChild(thinkingEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
        const response = await callPaperAiBot(question);
        const thinking = document.getElementById('paperAiThinking');
        if (thinking) thinking.remove();
        addPaperAiMessage('assistant', response);
    } catch (error) {
        const thinking = document.getElementById('paperAiThinking');
        if (thinking) thinking.remove();
        console.error('Coze API 调用失败:', error);
        // 降级到本地AI回复
        const fallbackResponse = generatePaperAiResponse(question);
        addPaperAiMessage('assistant', fallbackResponse);
    }

    _paperAiIsThinking = false;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ========== HTML 转义 ==========
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// ========== 简易 Markdown 渲染 ==========
function paperMarkdownToHtml(text) {
    if (!text) return '';
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:8px;margin:8px 0;">');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#7c3aed;text-decoration:underline;">$1</a>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/```([\s\S]*?)```/g, '<pre style="background:#f1f5f9;padding:12px;border-radius:8px;overflow-x:auto;font-size:13px;"><code>$1</code></pre>');
    html = html.replace(/`([^`]+)`/g, '<code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:13px;">$1</code>');
    html = html.replace(/\n/g, '<br>');

    return html;
}

// ========== 添加消息 ==========
function addPaperAiMessage(role, content) {
    const messagesContainer = document.getElementById('paperAiMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `paper-ai-msg ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'paper-ai-msg-avatar';
    avatar.textContent = role === 'user' ? '👤' : '🤖';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'paper-ai-msg-content';
    contentDiv.innerHTML = role === 'user'
        ? content.replace(/\n/g, '<br>')
        : paperMarkdownToHtml(content);

    msgDiv.appendChild(avatar);
    msgDiv.appendChild(contentDiv);
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ========== 生成论文内容（本地模拟，可接入Coze） ==========
async function paperGenerate(funcName) {
    const resultDiv = document.getElementById(funcName + '_result');
    if (!resultDiv) return;

    // 显示加载
    resultDiv.className = 'paper-result show';
    resultDiv.innerHTML = `
        <div class="paper-loading">
            <div class="loading-spinner"></div>
            <span>AI正在为你生成内容，请稍候...</span>
        </div>
    `;

    // 模拟延迟
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 根据功能生成内容
    let content = '';
    switch (funcName) {
        case 'topic':
            content = generateTopics();
            break;
        case 'proposal':
            content = generateProposal();
            break;
        case 'literature':
            content = generateLiterature();
            break;
        case 'polish':
            content = await generatePolish();
            break;
        case 'reduce':
            content = await generateReduce();
            break;
        case 'format':
            content = generateFormat();
            break;
        case 'empirical':
            content = generateEmpirical();
            break;
        case 'data_guide':
            content = generateDataGuide();
            break;
        case 'code_help':
            content = generateCodeHelp();
            break;
        case 'finance_topic':
            content = generateFinanceTopics();
            break;
        default:
            content = '<p>该功能正在开发中...</p>';
    }

    resultDiv.innerHTML = content;
}

// ========== 各功能的内容生成 ==========

function getInput(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
}

function getSelect(id) {
    const el = document.getElementById(id);
    return el ? el.value : '';
}

// 1. 智能选题
function generateTopics() {
    const major = getInput('topic_major') || '未指定专业';
    const field = getInput('topic_field') || '综合领域';
    const type = getSelect('topic_type') || '不限类型';
    const level = getSelect('topic_level') || 'medium';
    const extra = getInput('topic_extra');

    const levelMap = { easy: '入门级（数据易获取）', medium: '中级（有一定研究深度）', hard: '高级（创新性强）' };
    const typeMap = { course: '课程论文', graduate: '毕业论文', research: '科研习作' };

    const topics = getTopicLibrary(major, field);

    return `
        <h3>📋 选题参数</h3>
        <p><strong>专业方向：</strong>${major} &nbsp;|&nbsp; <strong>研究领域：</strong>${field} &nbsp;|&nbsp; <strong>论文类型：</strong>${typeMap[type] || type} &nbsp;|&nbsp; <strong>难度：</strong>${levelMap[level]}</p>
        ${extra ? `<p><strong>补充说明：</strong>${extra}</p>` : ''}

        <h3>💡 推荐选题（共${topics.length}个）</h3>
        <ol>
            ${topics.map((t, i) => `
                <li>
                    <strong>${t.title}</strong>
                    <ul>
                        <li>📊 <strong>数据来源：</strong>${t.dataSource}</li>
                        <li>🔬 <strong>研究方法：</strong>${t.method}</li>
                        <li>⭐ <strong>可行性：</strong>${t.feasibility}</li>
                        <li>💡 <strong>创新点：</strong>${t.innovation}</li>
                    </ul>
                </li>
            `).join('')}
        </ol>
        <p style="margin-top:12px;color:var(--text-secondary);font-size:13px;">💡 以上选题均为可落地研究，数据可获取。建议结合导师意见和个人兴趣进一步筛选。如需更精准的选题，可以补充更多细分方向信息。</p>
    `;
}

function getTopicLibrary(major, field) {
    const isFinance = /金融|经济|会计|财税|国贸|经管|管理|财务|审计|资本|银行|证券/.test(major + field);
    const isCS = /计算机|软件|人工智能|AI|算法|数据|网络|信息/.test(major + field);
    const isArts = /文学|历史|哲学|艺术|设计|音乐|美术/.test(major + field);

    if (isFinance) {
        return [
            { title: '数字化转型对企业全要素生产率的影响研究——基于沪深A股上市公司数据', dataSource: 'CSMAR数据库、上市公司年报', method: '固定效应面板回归 + 中介效应检验', feasibility: '⭐⭐⭐⭐⭐ 数据充分，变量定义清晰', innovation: '引入文本分析法量化数字化转型程度' },
            { title: 'ESG评级对企业融资约束的缓解效应——基于PSM-DID的实证分析', dataSource: 'Wind ESG评级、CSMAR财务数据', method: 'PSM-DID双重差分', feasibility: '⭐⭐⭐⭐⭐ 数据可获取，方法成熟', innovation: '细分ESG三个维度分别考察' },
            { title: '绿色信贷政策对重污染企业技术创新的影响', dataSource: 'CSMAR、国家统计局', method: 'DID + 异质性分析', feasibility: '⭐⭐⭐⭐ 政策冲击清晰', innovation: '区分绿色创新与一般创新' },
            { title: '供应链集中度对企业财务风险的影响——基于制造业上市公司的实证研究', dataSource: 'CSMAR供应链数据库', method: '面板回归 + 门槛模型', feasibility: '⭐⭐⭐⭐ 数据可获取', innovation: '引入非线性门槛效应' },
            { title: '高管海外背景对企业国际化战略的影响研究', dataSource: 'CSMAR人物特征数据库', method: 'Logit回归 + 工具变量', feasibility: '⭐⭐⭐⭐ 变量可度量', innovation: '构建海外经历综合指标' },
            { title: '数字普惠金融对城乡居民消费差距的影响', dataSource: '北大数字金融指数、统计年鉴', method: '空间计量模型', feasibility: '⭐⭐⭐⭐ 宏观数据可得', innovation: '考虑空间溢出效应' },
        ];
    }

    if (isCS) {
        return [
            { title: '基于深度学习的文本情感分析系统设计与实现', dataSource: '公开数据集（微博、豆瓣等）', method: 'BERT + BiLSTM模型', feasibility: '⭐⭐⭐⭐⭐ 开源数据充足', innovation: '多模态融合情感分析' },
            { title: '面向边缘计算的任务调度优化算法研究', dataSource: '仿真实验数据', method: '强化学习 + 启发式算法', feasibility: '⭐⭐⭐⭐ 可仿真验证', innovation: '自适应调度策略' },
            { title: '基于知识图谱的智能问答系统构建', dataSource: 'Wikipedia、CN-DBpedia', method: '图神经网络', feasibility: '⭐⭐⭐⭐ 知识图谱资源丰富', innovation: '多跳推理问答' },
        ];
    }

    if (isArts) {
        return [
            { title: '网络文学IP改编的叙事策略与文化传播研究', dataSource: '文学作品、影视改编数据', method: '文本分析 + 案例研究', feasibility: '⭐⭐⭐⭐ 素材丰富', innovation: '跨媒介叙事比较' },
            { title: '当代城市公共艺术的社会功能与接受研究', dataSource: '实地调研、问卷调查', method: '田野调查 + 统计分析', feasibility: '⭐⭐⭐ 需实地调研', innovation: '公众参与视角' },
        ];
    }

    // 通用选题
    return [
        { title: `${field}领域的研究现状与发展趋势分析`, dataSource: '中国知网、Web of Science', method: '文献计量分析', feasibility: '⭐⭐⭐⭐⭐ 文献资源充足', innovation: '可视化知识图谱' },
        { title: `基于问卷调查的${field}问题实证研究`, dataSource: '问卷调查数据', method: '因子分析 + 结构方程', feasibility: '⭐⭐⭐⭐ 可自主收集', innovation: '构建理论模型' },
        { title: `${field}中的影响因素分析——以${major}为例`, dataSource: '公开统计数据', method: '多元回归分析', feasibility: '⭐⭐⭐⭐ 数据可获取', innovation: '多维度因素交互' },
        { title: `"双碳"目标下${field}的绿色转型路径研究`, dataSource: '政策文件、行业报告', method: '案例比较分析', feasibility: '⭐⭐⭐⭐ 政策热点', innovation: '政策与实践衔接' },
    ];
}

// 2. 开题报告
function generateProposal() {
    const title = getInput('proposal_title') || '未指定题目';
    const major = getInput('proposal_major') || '相关专业';
    const degree = getSelect('proposal_degree') || 'bachelor';
    const keywords = getInput('proposal_keywords') || '相关领域';

    const degreeMap = { bachelor: '本科', master: '硕士', phd: '博士' };

    return `
        <h3>📋 ${title}</h3>
        <p><strong>专业：</strong>${major} &nbsp;|&nbsp; <strong>学位：</strong>${degreeMap[degree]} &nbsp;|&nbsp; <strong>关键词：</strong>${keywords}</p>

        <h3>一、研究背景与意义</h3>
        <h4>1.1 研究背景</h4>
        <p>随着${keywords}领域的快速发展，${title}已成为学术界和实务界关注的热点问题。当前，该领域面临着一系列亟待解决的理论和实践挑战，深入研究这一问题对于推动学科发展和指导实践具有重要意义。</p>

        <h4>1.2 研究意义</h4>
        <p><strong>理论意义：</strong>本研究将丰富${keywords}领域的理论框架，填补现有研究中的空白，为后续研究提供新的分析视角和理论支撑。</p>
        <p><strong>实践意义：</strong>研究成果可为相关政策制定提供参考依据，为企业/机构决策提供数据支持，具有重要的现实应用价值。</p>

        <h3>二、国内外研究现状</h3>
        <p>近年来，国内外学者围绕${keywords}开展了大量研究。国外研究主要集中在理论模型构建和跨国比较分析方面，而国内研究则更多关注中国情境下的实证检验。现有研究虽然取得了丰硕成果，但在研究视角、方法和数据方面仍有拓展空间。</p>

        <h3>三、研究内容与方法</h3>
        <h4>3.1 研究内容</h4>
        <ol>
            <li>梳理${keywords}的理论基础和相关文献</li>
            <li>构建理论分析框架，提出研究假设</li>
            <li>进行实证检验与结果分析</li>
            <li>开展稳健性检验和异质性分析</li>
            <li>总结研究结论并提出政策建议</li>
        </ol>

        <h4>3.2 研究方法</h4>
        <p>本研究采用理论分析与实证研究相结合的方法。理论部分运用文献归纳法；实证部分采用描述性统计、相关性分析和多元回归分析等方法，并运用Stata/Python进行数据处理和模型估计。</p>

        <h3>四、创新点</h3>
        <ol>
            <li><strong>研究视角创新：</strong>从多维度综合分析${keywords}问题</li>
            <li><strong>研究方法创新：</strong>综合运用多种计量方法进行稳健性检验</li>
            <li><strong>数据使用创新：</strong>采用最新可得的面板数据，扩大样本覆盖面</li>
        </ol>

        <h3>五、技术路线</h3>
        <p>文献梳理 → 理论分析 → 研究假设 → 数据收集 → 实证检验 → 稳健性检验 → 结论建议</p>

        <h3>六、参考文献（示例格式）</h3>
        <p style="font-size:13px;color:var(--text-secondary);">[1] 作者. 论文题目[J]. 期刊名, 年份, 卷(期): 页码.<br>[2] 作者. 论文题目[J]. 期刊名, 年份, 卷(期): 页码.<br>（实际写作中请根据研究主题检索并补充具体文献）</p>
    `;
}

// 3. 文献综述
function generateLiterature() {
    const topic = getInput('lit_topic') || '该研究领域';
    const abstracts = getInput('lit_abstracts');

    return `
        <h3>📖 ${topic}——文献综述</h3>

        <h3>一、研究脉络梳理</h3>
        <p>关于${topic}的研究，学术界经历了从理论探讨到实证检验、从单一维度到多维度分析的发展历程。早期研究主要关注概念界定和理论框架构建，近年来越来越多的研究开始关注其影响因素、作用机制和经济后果。</p>

        <h3>二、主要研究观点</h3>
        <ol>
            <li><strong>理论机制方面：</strong>现有研究从资源基础观、制度理论、信号传递理论等多个理论视角解释了相关现象。</li>
            <li><strong>实证研究方面：</strong>大量研究利用上市公司数据、宏观统计数据等进行了实证检验，得出了丰富的研究结论。</li>
            <li><strong>异质性分析方面：</strong>部分研究关注了不同行业、不同地区、不同企业特征下的差异表现。</li>
        </ol>

        <h3>三、研究述评</h3>
        <p>综合来看，现有研究在以下方面仍有拓展空间：</p>
        <ul>
            <li>研究视角可进一步拓展，关注更多元的理论解释</li>
            <li>研究方法可更加多样化，综合运用多种计量技术</li>
            <li>数据样本可进一步扩大，提高研究结论的外部效度</li>
            <li>机制分析可更加深入，揭示黑箱中的传导路径</li>
        </ul>

        <h3>四、未来研究方向</h3>
        <p>基于以上分析，未来研究可以从以下方向深入：</p>
        <ol>
            <li>引入更前沿的研究方法和数据</li>
            <li>关注政策冲击的准自然实验设计</li>
            <li>开展跨国比较研究</li>
            <li>结合人工智能和大数据技术进行文本分析</li>
        </ol>
    `;
}

// 4. 全文润色
async function generatePolish() {
    const text = getInput('polish_text') || '';
    const style = getSelect('polish_style') || 'academic';

    if (!text) {
        return `<h3>✨ 润色结果</h3><p style="color:var(--text-secondary);">请在上方输入需要润色的文本内容。</p>`;
    }

    const styleDesc = { academic: '学术严谨型', concise: '简洁精炼型', professional: '专业深度型' };
    const stylePrompt = {
        academic: '请将以下文本润色为学术严谨风格，使用规范学术用语，优化逻辑结构。',
        concise: '请将以下文本润色为简洁精炼风格，去除冗余表述，提升信息密度。',
        professional: '请将以下文本润色为专业深度风格，使用领域专业术语，增强学术深度。'
    };

    try {
        const prompt = `${stylePrompt[style] || stylePrompt['academic']}\n\n原文：\n${text}\n\n请只输出润色后的完整文本，不要添加任何解释说明。`;
        const polished = await callPaperAiBot(prompt);

        return `
            <h3>✨ 润色结果（${styleDesc[style]}）</h3>
            <h4>📝 原文</h4>
            <div style="background:#f8fafc;padding:16px;border-radius:8px;border-left:3px solid #94a3b8;margin-bottom:16px;">
                <p style="color:var(--text-secondary);white-space:pre-wrap;">${escapeHtml(text)}</p>
            </div>
            <h4>✨ 润色后</h4>
            <div style="background:#ecfdf5;padding:16px;border-radius:8px;border-left:3px solid var(--primary);">
                <p style="white-space:pre-wrap;">${polished}</p>
            </div>
            <h4>📊 润色说明</h4>
            <ul>
                <li>已去除口语化表达，替换为学术规范用语</li>
                <li>优化了语句结构和逻辑衔接</li>
                <li>精简了冗余表述，提升信息密度</li>
                <li>统一了专业术语的使用</li>
            </ul>
        `;
    } catch (error) {
        console.error('润色调用失败:', error);
        return `
            <h3>✨ 润色结果</h3>
            <p style="color:#e53e3e;">AI润色服务暂时不可用，请稍后重试。</p>
            <p style="color:var(--text-secondary);">错误信息：${escapeHtml(error.message)}</p>
        `;
    }
}

// 5. 智能降重
async function generateReduce() {
    const text = getInput('reduce_text') || '';
    if (!text) {
        return `<h3>🔄 降重结果</h3><p style="color:var(--text-secondary);">请在上方输入需要降重的文本内容。</p>`;
    }

    try {
        const prompt = `请对以下论文段落进行智能降重改写。要求：
1. 采用同义替换和句式重组，改变表达方式
2. 保留原文的核心学术逻辑、关键数据和结论
3. 使用规范的学术语言
4. 不要改变原文的技术含义

原文：
${text}

请只输出降重后的完整文本，不要添加任何解释说明。`;
        const reduced = await callPaperAiBot(prompt);

        return `
            <h3>🔄 降重结果</h3>
            <h4>📝 原文</h4>
            <div style="background:#f8fafc;padding:16px;border-radius:8px;border-left:3px solid #94a3b8;margin-bottom:16px;">
                <p style="color:var(--text-secondary);white-space:pre-wrap;">${escapeHtml(text)}</p>
            </div>
            <h4>🔄 降重后</h4>
            <div style="background:#fef3c7;padding:16px;border-radius:8px;border-left:3px solid var(--warning);">
                <p style="white-space:pre-wrap;">${reduced}</p>
            </div>
            <h4>📊 降重说明</h4>
            <ul>
                <li>采用同义替换策略，保留核心学术逻辑</li>
                <li>调整了句式结构，改变表达方式</li>
                <li>预计可降低重复率约30%-50%（实际效果需查重验证）</li>
                <li>建议降重后人工复核，确保学术严谨性</li>
            </ul>
        `;
    } catch (error) {
        console.error('降重调用失败:', error);
        return `
            <h3>🔄 降重结果</h3>
            <p style="color:#e53e3e;">AI降重服务暂时不可用，请稍后重试。</p>
            <p style="color:var(--text-secondary);">错误信息：${escapeHtml(error.message)}</p>
        `;
    }
}

// 6. 格式排版
function generateFormat() {
    const text = getInput('format_text') || '';
    const style = getSelect('format_style') || 'gbt7714';

    if (!text) {
        return `<h3>📐 排版结果</h3><p style="color:var(--text-secondary);">请在上方输入需要格式化的论文内容。</p>`;
    }

    const styleNames = { gbt7714: 'GB/T 7714', apa: 'APA', mla: 'MLA', chicago: 'Chicago' };

    return `
        <h3>📐 排版结果（${styleNames[style]}格式）</h3>
        <div style="background:#fff;padding:24px;border:1px solid var(--border);border-radius:8px;font-family:'Times New Roman','宋体',serif;line-height:1.8;">
            <h4 style="text-align:center;font-size:18px;margin-bottom:20px;">论文标题</h4>
            <p style="text-indent:2em;">${text}</p>
        </div>
        <h4>📊 格式说明</h4>
        <ul>
            <li><strong>字体：</strong>正文宋体/Times New Roman，标题黑体</li>
            <li><strong>字号：</strong>正文小四（12pt），标题三号（16pt）</li>
            <li><strong>行距：</strong>1.5倍行距</li>
            <li><strong>页边距：</strong>上下2.54cm，左右3.18cm</li>
            <li><strong>引用格式：</strong>${styleNames[style]}</li>
        </ul>
        <p style="color:var(--text-secondary);font-size:13px;">💡 提示：完整的格式排版功能需要接入后端服务，目前展示为基础格式预览。</p>
    `;
}

// 7. 实证模型辅导
function generateEmpirical() {
    const model = getSelect('emp_model') || 'ols';
    const question = getInput('emp_question') || '';

    const modelInfo = {
        ols: {
            name: 'OLS 普通最小二乘法',
            intro: 'OLS是计量经济学中最基础的回归方法，适用于连续型因变量的线性关系估计。',
            formula: 'Y = α + βX + γControls + ε',
            steps: ['检验多重共线性（VIF）', '进行异方差检验（Breusch-Pagan检验）', '如存在异方差，使用稳健标准误', '报告R²和调整R²'],
            stata: `* OLS回归基本代码
reg Y X control1 control2, robust
est store m1
* 检验多重共线性
vif
* 异方差检验
estat hettest`,
            note: 'OLS要求满足经典线性回归假设（线性、严格外生、无完全多重共线性、球形扰动项）。若不满足，需考虑其他模型。'
        },
        fe: {
            name: '固定效应模型',
            intro: '固定效应模型通过控制个体效应来消除不随时间变化的遗漏变量偏误，是面板数据分析的核心方法。',
            formula: 'Yit = α + βXit + γControlsit + μi + εit',
            steps: ['进行Hausman检验判断固定效应vs随机效应', '控制个体固定效应（i.id）', '控制时间固定效应（i.year）', '使用聚类稳健标准误'],
            stata: `* 设定面板结构
xtset id year
* 固定效应回归
xtreg Y X control1 control2, fe robust
* Hausman检验
xtreg Y X control1 control2, fe
est store fe
xtreg Y X control1 control2, re
est store re
hausman fe re`,
            note: '固定效应模型只能估计随时间变化的变量的系数，不随时间变化的变量（如性别、地区等）会被差分掉。'
        },
        did: {
            name: 'DID 双重差分',
            intro: 'DID通过比较处理组和对照组在政策前后的差异来识别因果效应，是政策评估的黄金标准。',
            formula: 'Yit = α + β(Treati × Postt) + γTreati + δPostt + εit',
            steps: ['明确定义处理组和对照组', '验证平行趋势假设', '构建Treat和Post交互项', '进行平行趋势检验（事件研究法）', '安慰剂检验'],
            stata: `* DID回归
gen did = treat * post
reg Y did treat post controls, cluster(id)
* 事件研究法（平行趋势检验）
forvalues i = -4/4 {
    gen pre\`i' = (period == \`i' & treat == 1)
}
reg Y pre* post* controls, cluster(id)`,
            note: 'DID的关键前提是平行趋势假设——处理组和对照组在政策前应有相同的变化趋势。'
        },
        psm: {
            name: 'PSM 倾向得分匹配',
            intro: 'PSM通过匹配倾向得分相近的处理组和对照组样本来解决样本选择偏误问题。',
            formula: 'PScore = P(Treat=1|X) = Φ(γX)',
            steps: ['估计倾向得分（Logit/Probit）', '进行匹配（最近邻/核匹配/半径匹配）', '平衡性检验（pstest）', '计算ATT', '敏感性分析'],
            stata: `* PSM匹配
logit treat X1 X2 X3
predict pscore, pr
psmatch2 treat X1 X2 X3, outcome(Y) logit neighbor(1) common ate
pstest X1 X2 X3, both graph`,
            note: 'PSM只能解决可观测变量的选择偏误，无法解决不可观测变量导致的内生性问题。'
        },
        mediation: {
            name: '中介效应模型',
            intro: '中介效应模型用于检验自变量是否通过中介变量间接影响因变量。',
            formula: 'Step1: Y = cX + e1 → Step2: M = aX + e2 → Step3: Y = c\'X + bM + e3',
            steps: ['逐步回归法（Baron & Kenny）', 'Sobel检验', 'Bootstrap法检验间接效应', '报告直接效应和间接效应'],
            stata: `* 中介效应三步法
reg Y X controls         // 总效应 c
reg M X controls         // a路径
reg Y X M controls       // b路径和直接效应 c'
* Bootstrap检验
bootstrap r(ind_eff) r(dir_eff), reps(1000): mediate_test`,
            note: '逐步回归法的统计效力较低，推荐使用Bootstrap法检验间接效应的显著性。'
        },
        moderation: {
            name: '调节效应模型',
            intro: '调节效应模型检验调节变量如何影响自变量与因变量之间关系的方向和强度。',
            formula: 'Y = α + β1X + β2M + β3(X×M) + ε',
            steps: ['中心化处理自变量和调节变量', '构建交互项X×M', '检验交互项系数β3的显著性', '简单斜率分析', '绘制调节效应图'],
            stata: `* 中心化处理
sum X
gen X_c = X - r(mean)
sum M
gen M_c = M - r(mean)
* 调节效应回归
gen inter = X_c * M_c
reg Y X_c M_c inter controls, robust
* 简单斜率分析
margins, dydx(X) at(M=(-1 0 1))`,
            note: '建议先中心化再构建交互项，以降低多重共线性并便于解释。'
        },
        threshold: {
            name: '门槛回归模型',
            intro: '门槛模型用于检验变量之间是否存在非线性关系，即当门槛变量超过某个阈值时，关系发生结构性变化。',
            formula: 'Yit = α + β1Xit·I(qit≤γ) + β2Xit·I(qit>γ) + εit',
            steps: ['确定门槛变量', '检验门槛效应是否存在（单一/双重/三重门槛）', '估计门槛值', '分区间报告回归结果'],
            stata: `* 门槛回归（需安装xthreg）
xthreg Y controls, rx(X) qx(threshold_var) thnum(1) trim(0.05) bs(300)
* 双重门槛
xthreg Y controls, rx(X) qx(threshold_var) thnum(2) trim(0.05) bs(300)`,
            note: '门槛模型适用于面板数据，需要先通过检验确认门槛效应的存在和数量。'
        },
        panel: {
            name: '面板回归',
            intro: '面板数据回归综合利用截面和时间两个维度的信息，提高估计效率并控制个体异质性。',
            formula: 'Yit = α + βXit + γControlsit + μi + λt + εit',
            steps: ['确定面板结构（xtset）', '选择混合OLS/固定效应/随机效应', 'Hausman检验', '控制个体和时间效应', '使用聚类标准误'],
            stata: `* 面板设定
xtset id year
* 描述性统计
xtsum Y X control1 control2
* 固定效应
xtreg Y X control1 control2 i.year, fe cluster(id)
* 随机效应
xtreg Y X control1 control2 i.year, re cluster(id)`,
            note: '面板数据应关注组内和组间变异，选择合适的模型设定以得到一致估计。'
        }
    };

    const info = modelInfo[model];
    if (!info) return '<p>请选择有效的模型类型。</p>';

    return `
        <h3>📊 ${info.name}</h3>
        <p style="font-size:14px;color:var(--text-secondary);margin-bottom:16px;">${info.intro}</p>

        <h4>📐 模型公式</h4>
        <div style="background:#f8fafc;padding:16px;border-radius:8px;text-align:center;font-size:15px;font-family:'Times New Roman',serif;margin-bottom:16px;">
            ${info.formula}
        </div>

        <h4>🔬 分析步骤</h4>
        <ol>
            ${info.steps.map(s => `<li>${s}</li>`).join('')}
        </ol>

        <h4>💻 Stata代码示例</h4>
        <pre><code>${info.stata}</code></pre>

        <h4>⚠️ 注意事项</h4>
        <div class="warning-box">${info.note}</div>

        ${question ? `<h4>📝 你的研究问题</h4><p>${question}</p><p style="color:var(--text-secondary);font-size:13px;">💡 建议根据上述步骤和代码模板，结合你的具体变量进行调整。</p>` : ''}
    `;
}

// 8. 数据查找指引
function generateDataGuide() {
    const dataType = getInput('data_type') || '财经数据';
    const detail = getInput('data_detail') || '';

    return `
        <h3>🗄️ ${dataType}——数据查找指引</h3>

        <h4>📊 推荐数据源</h4>
        <table style="width:100%;border-collapse:collapse;margin:12px 0;">
            <tr style="background:var(--primary-bg);">
                <th style="padding:10px;text-align:left;border:1px solid var(--border);">数据源</th>
                <th style="padding:10px;text-align:left;border:1px solid var(--border);">数据内容</th>
                <th style="padding:10px;text-align:left;border:1px solid var(--border);">获取方式</th>
            </tr>
            <tr>
                <td style="padding:10px;border:1px solid var(--border);"><strong>CSMAR</strong></td>
                <td style="padding:10px;border:1px solid var(--border);">上市公司财务、治理、交易数据</td>
                <td style="padding:10px;border:1px solid var(--border);">高校购买 → 图书馆数据库</td>
            </tr>
            <tr style="background:#f8fafc;">
                <td style="padding:10px;border:1px solid var(--border);"><strong>Wind</strong></td>
                <td style="padding:10px;border:1px solid var(--border);">宏观经济、行业、金融数据</td>
                <td style="padding:10px;border:1px solid var(--border);">高校/机构购买 → Wind终端</td>
            </tr>
            <tr>
                <td style="padding:10px;border:1px solid var(--border);"><strong>CNRDS</strong></td>
                <td style="padding:10px;border:1px solid var(--border);">特色研究数据库（ESG、专利等）</td>
                <td style="padding:10px;border:1px solid var(--border);">高校购买 → 图书馆数据库</td>
            </tr>
            <tr style="background:#f8fafc;">
                <td style="padding:10px;border:1px solid var(--border);"><strong>国家统计局</strong></td>
                <td style="padding:10px;border:1px solid var(--border);">宏观统计年鉴、人口普查数据</td>
                <td style="padding:10px;border:1px solid var(--border);">免费 → data.stats.gov.cn</td>
            </tr>
            <tr>
                <td style="padding:10px;border:1px solid var(--border);"><strong>巨潮资讯网</strong></td>
                <td style="padding:10px;border:1px solid var(--border);">上市公司年报、公告</td>
                <td style="padding:10px;border:1px solid var(--border);">免费 → cninfo.com.cn</td>
            </tr>
            <tr style="background:#f8fafc;">
                <td style="padding:10px;border:1px solid var(--border);"><strong>北大数字金融</strong></td>
                <td style="padding:10px;border:1px solid var(--border);">数字普惠金融指数</td>
                <td style="padding:10px;border:1px solid var(--border);">免费申请 → idf.pku.edu.cn</td>
            </tr>
        </table>

        <h4>📋 数据获取步骤</h4>
        <ol>
            <li><strong>明确数据需求：</strong>列出所有需要的变量、时间范围和样本范围</li>
            <li><strong>选择数据源：</strong>根据数据类型选择最适合的数据库</li>
            <li><strong>下载数据：</strong>通过学校图书馆或免费渠道获取</li>
            <li><strong>数据清洗：</strong>处理缺失值、异常值，合并多来源数据</li>
            <li><strong>变量构建：</strong>计算所需的衍生变量和指标</li>
        </ol>

        ${detail ? `<h4>📝 你的需求分析</h4><p>${detail}</p><p style="color:var(--text-secondary);font-size:13px;">💡 建议优先从CSMAR获取上市公司相关数据，结合国家统计局补充宏观经济指标。</p>` : ''}
    `;
}

// 9. Stata/Python代码
function generateCodeHelp() {
    const lang = getSelect('code_lang') || 'stata';
    const analysis = getSelect('code_analysis') || 'descriptive';
    const vars = getInput('code_vars') || '';

    const analysisMap = {
        descriptive: { name: '描述性统计', desc: '展示变量的基本统计特征' },
        regression: { name: '回归分析', desc: '检验变量间的因果关系' },
        robustness: { name: '稳健性检验', desc: '验证主回归结果的可靠性' },
        heterogeneity: { name: '异质性分析', desc: '检验不同子样本中的效应差异' }
    };

    const info = analysisMap[analysis];

    const stataCodes = {
        descriptive: `* ===== 描述性统计 =====
* 基本描述统计
summarize Y X1 X2 control1 control2, detail
* 分组描述统计
bysort industry: summarize Y X1 X2
* 相关性矩阵
pwcorr Y X1 X2 control1 control2, star(0.05)
* 导出描述统计表
estpost summarize Y X1 X2 control1 control2, detail
esttab using desc_stats.rtf, cells("count mean sd min p50 max") replace`,
        regression: `* ===== 回归分析 =====
* 设定面板结构
xtset id year
* 基准回归（固定效应）
xtreg Y X1 X2 controls, fe cluster(id)
est store m1
* 加入更多控制变量
xtreg Y X1 X2 controls1 controls2, fe cluster(id)
est store m2
* 输出回归表
esttab m1 m2 using reg_results.rtf, star(* 0.10 ** 0.05 *** 0.01) replace`,
        robustness: `* ===== 稳健性检验 =====
* 1. 替换被解释变量
xtreg Y_alt X1 X2 controls, fe cluster(id)
* 2. 替换解释变量
xtreg Y X1_alt X2 controls, fe cluster(id)
* 3. 缩尾处理（1%和99%分位）
winsor2 Y X1 X2, replace cuts(1 99)
xtreg Y X1 X2 controls, fe cluster(id)
* 4. 滞后一期自变量
xtreg Y L.X1 L.X2 controls, fe cluster(id)`,
        heterogeneity: `* ===== 异质性分析 =====
* 按行业分组
bysort industry: xtreg Y X1 X2 controls, fe cluster(id)
* 按企业规模分组（中位数分组）
sum size, detail
gen large_firm = (size > r(p50))
xtreg Y X1 X2 controls if large_firm == 1, fe cluster(id)
xtreg Y X1 X2 controls if large_firm == 0, fe cluster(id)
* 交互项法
gen inter = X1 * group_var
xtreg Y X1 group_var inter controls, fe cluster(id)`
    };

    const pythonCodes = {
        descriptive: `# ===== 描述性统计 =====
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# 加载数据
df = pd.read_csv('data.csv')

# 描述统计
print(df[['Y', 'X1', 'X2']].describe())

# 相关性热力图
corr = df[['Y', 'X1', 'X2']].corr()
sns.heatmap(corr, annot=True, cmap='coolwarm')
plt.show()`,
        regression: `# ===== 回归分析 =====
import statsmodels.api as sm
from linearmodels.panel import PanelOLS

# OLS回归
X = df[['X1', 'X2', 'control1']]
X = sm.add_constant(X)
model = sm.OLS(df['Y'], X)
results = model.fit(cov_type='cluster', cov_kwds={'groups': df['id']})
print(results.summary())

# 面板固定效应
df = df.set_index(['id', 'year'])
model_fe = PanelOLS(df['Y'], df[['X1', 'X2']], entity_effects=True)
res_fe = model_fe.fit()
print(res_fe.summary)`,
        robustness: `# ===== 稳健性检验 =====
# 替换变量
X_alt = df[['X1_alt', 'X2']]
model_robust = sm.OLS(df['Y_alt'], sm.add_constant(X_alt))
results_robust = model_robust.fit()
print(results_robust.summary())

# 缩尾处理
for col in ['Y', 'X1', 'X2']:
    q1 = df[col].quantile(0.01)
    q99 = df[col].quantile(0.99)
    df[col] = df[col].clip(q1, q99)`,
        heterogeneity: `# ===== 异质性分析 =====
# 分组回归
for group_name, group_data in df.groupby('industry'):
    X = group_data[['X1', 'X2']]
    model = sm.OLS(group_data['Y'], sm.add_constant(X))
    results = model.fit()
    print(f'\\n行业: {group_name}')
    print(f'X1系数: {results.params["X1"]:.4f}, t值: {results.tvalues["X1"]:.2f}')

# 交互项
df['inter'] = df['X1'] * df['group_var']
model_inter = sm.OLS(df['Y'], sm.add_constant(df[['X1', 'group_var', 'inter']]))
print(model_inter.fit().summary())`
    };

    const code = lang === 'stata' ? stataCodes[analysis] : pythonCodes[analysis];

    return `
        <h3>💻 ${lang.toUpperCase()} 代码（${info.name}）</h3>
        <p style="font-size:14px;color:var(--text-secondary);margin-bottom:16px;">${info.desc}</p>

        ${vars ? `<p><strong>变量说明：</strong>${vars}</p>` : ''}

        <h4>📝 代码</h4>
        <pre><code>${code}</code></pre>

        <h4>📊 结果解读要点</h4>
        <ul>
            <li>关注系数的符号、大小和统计显著性</li>
            <li>比较不同模型设定下的系数变化</li>
            <li>检查R²或within R²以评估模型拟合</li>
            <li>关注F统计量或Wald检验的整体显著性</li>
        </ul>
        <p style="color:var(--text-secondary);font-size:13px;">💡 提示：代码中的变量名请替换为你实际数据中的变量名。</p>
    `;
}

// 10. 财经专项选题库
function generateFinanceTopics() {
    const field = getSelect('fin_field') || 'finance';
    const type = getSelect('fin_type') || 'empirical';
    const sub = getInput('fin_sub') || '';

    const fieldNames = {
        finance: '金融学', accounting: '会计学', tax: '财税',
        esg: 'ESG与可持续发展', capital: '资本市场', governance: '公司治理',
        trade: '国际贸易', econ: '经济学'
    };

    const typeNames = { empirical: '实证研究', case: '案例分析', theoretical: '理论分析' };

    const topicsLibrary = {
        finance: [
            '数字金融发展对商业银行风险承担的影响研究',
            '绿色信贷政策对企业绿色创新的激励效应',
            '金融科技对中小企业融资效率的影响——基于供应链金融视角',
            '利率市场化改革对商业银行盈利能力的影响分析',
            '资本市场开放对企业投资效率的影响——基于"陆港通"的准自然实验',
        ],
        accounting: [
            '审计师行业专长对审计质量的影响研究',
            '数字化转型对企业会计信息质量的影响',
            'ESG信息披露对企业价值的影响——基于重污染行业的实证研究',
            '内部控制质量对企业创新投入的影响机制研究',
            '商誉减值风险的影响因素与经济后果研究',
        ],
        tax: [
            '增值税改革对企业税负的影响——基于制造业的实证分析',
            '税收优惠对企业研发投入的激励效应研究',
            '个人所得税改革对居民消费的影响',
            '环保税对企业绿色技术创新的影响',
            '减税降费政策对中小企业发展的影响评估',
        ],
        esg: [
            'ESG表现对企业融资成本的影响研究',
            '碳中和目标下企业ESG转型的路径与绩效研究',
            'ESG评级分歧对企业价值的影响',
            '绿色债券发行对企业环境绩效的影响',
            '碳排放权交易对企业技术创新的影响——基于试点政策的准自然实验',
        ],
        capital: [
            '注册制改革对IPO抑价率的影响研究',
            '机构投资者持股对企业创新的影响',
            '融资融券制度对股价同步性的影响',
            '股权质押对企业风险承担行为的影响',
            '分析师关注对企业盈余管理的影响研究',
        ],
        governance: [
            '董事会多样性对企业绩效的影响',
            '高管薪酬激励与企业创新——基于薪酬差距视角',
            '独立董事网络对企业并购绩效的影响',
            '家族企业代际传承对企业创新的影响',
            '国有资本参股对民营企业治理效率的影响',
        ],
        trade: [
            '中美贸易摩擦对中国出口企业的影响研究',
            '自贸区政策对企业出口绩效的影响——基于DID模型',
            '汇率波动对中国进出口贸易的影响',
            '数字贸易对中国制造业全球价值链地位的影响',
            'RCEP协定对中国跨境电商发展的影响研究',
        ],
        econ: [
            '数字经济对区域经济高质量发展的影响',
            '新型城镇化对城乡收入差距的影响',
            '人口老龄化对经济增长的影响机制研究',
            '产业政策对企业全要素生产率的影响',
            '基础设施投资对区域经济收敛的影响',
        ]
    };

    const topics = topicsLibrary[field] || topicsLibrary['finance'];
    const fieldName = fieldNames[field] || field;

    return `
        <h3>🏦 ${fieldName} 专项选题库（${typeNames[type]}）</h3>
        ${sub ? `<p><strong>细分方向：</strong>${sub}</p>` : ''}

        <ol>
            ${topics.map(t => `<li><strong>${t}</strong></li>`).join('')}
        </ol>

        <h4>📊 选题建议</h4>
        <ul>
            <li>以上选题均为财经经管领域的热点和前沿方向</li>
            <li>建议结合数据可得性选择最适合的题目</li>
            <li>可在此基础上进一步细化研究视角和变量设计</li>
            <li>实证类选题需要确保数据库中有对应的变量</li>
        </ul>
        <p style="color:var(--text-secondary);font-size:13px;">💡 如需更精准的选题推荐，可使用左侧"智能选题生成"功能，输入具体专业和方向。</p>
    `;
}

// ========== 页面初始化 ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 AI论文工坊已就绪');
    console.log('  ✅ 全学科基础功能：智能选题 | 开题报告 | 文献综述 | 全文润色 | 智能降重 | 格式排版');
    console.log('  ✅ 财经专精特色：实证模型 | 数据指引 | Stata/Python代码 | 专项选题库');
    console.log('🤖 Coze AI论文智能体已就绪');
    console.log('   Bot ID:', PAPER_AI_CONFIG.botId);
    console.log('   💡 在左侧选择功能后，可在右侧底部AI面板提问');
});
