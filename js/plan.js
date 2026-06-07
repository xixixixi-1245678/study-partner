// ========== 个性化学习规划模块 v4.0 - 对话式AI智能体 ==========

// ========== 学科名称映射 ==========
const PLAN_SUBJECT_NAMES = {
    accounting: '会计基础', finance_basic: '财经基础', securities: '证券投资',
    fund: '基金从业', banking: '银行业务', tax: '税务基础', economics: '经济学',
    math_advanced: '高等数学', linear_algebra: '线性代数', probability: '概率论与数理统计',
    physics: '大学物理', chemistry: '大学化学', cs_basics: '计算机基础',
    data_structure: '数据结构与算法', operating_system: '操作系统', network: '计算机网络',
    database: '数据库原理', software_eng: '软件工程', circuit: '电路原理',
    signal: '信号与系统', mechanics: '理论力学', material_mech: '材料力学',
    cad: '机械制图/CAD', thermodynamics: '工程热力学', automation: '自动控制原理',
    civil_eng: '土木工程基础', electronics: '电子工程基础', biology: '普通生物学',
    genetics: '遗传学', biochem: '生物化学', stats_advanced: '统计学',
    ai_basics: '人工智能导论', machine_learning: '机器学习'
};

// ========== 智能体1: 思维导图知识体系构建 ==========
function onSubjectChange() {
    const subject = document.getElementById('planSubject').value;
    const subjectName = PLAN_SUBJECT_NAMES[subject] || subject;
    updateMindmapAiContext(subject, subjectName);
}

function generateMindmapOnly() {
    const subject = document.getElementById('planSubject').value;
    const subjectName = PLAN_SUBJECT_NAMES[subject] || subject;
    document.getElementById('mindmapLayout').style.display = 'flex';
    generateMindmap(subject, subjectName);
    updateMindmapAiContext(subject, subjectName);
    document.getElementById('mindmapLayout').scrollIntoView({ behavior: 'smooth' });
}

// ========== 智能体2: 对话式个性化学习规划辅导 ==========
const PLANNER_AI_CONFIG = {
    botId: '7647798200673517568',
    apiUrl: 'https://api.coze.cn/v3/chat',
    accessToken: 'pat_ZpsorG48WgFU36y8jM8f1mhON6LTaaDs3pVp8MuNokNFj6WhduC7wSGjV7aVkoUU',
};

let _plannerAiConversationId = '';
let _plannerAiIsThinking = false;
let _plannerMessageHistory = [];

// 年级与考试类型映射
const GRADE_NAMES = {
    freshman: '大一', sophomore: '大二', junior: '大三', senior: '大四', graduate: '研究生'
};

const SEMESTER_NAMES = {
    spring: '春季学期（2月-6月）', fall: '秋季学期（9月-1月）', summer: '暑假', winter: '寒假'
};

const EXAM_TYPE_NAMES = {
    final: '期末考试', midterm: '期中考试', college_entrance: '考研', cert_exam: '资格考试', other: '其他考试'
};

// 发送消息到规划智能体
async function sendPlannerMessage(presetText) {
    const input = document.getElementById('plannerInput');
    const messagesContainer = document.getElementById('plannerMessages');
    const welcomeDiv = document.getElementById('plannerWelcome');
    const sendBtn = document.getElementById('plannerSendBtn');

    const text = presetText || (input ? input.value.trim() : '');
    if (!text || _plannerAiIsThinking) return;

    // 隐藏欢迎界面，显示消息区域
    if (welcomeDiv) welcomeDiv.style.display = 'none';
    messagesContainer.style.display = 'flex';

    // 添加用户消息
    addPlannerMessage('user', text);
    if (input) input.value = '';

    // 禁用发送按钮
    if (sendBtn) sendBtn.disabled = true;
    _plannerAiIsThinking = true;

    // 显示思考中
    const thinkingId = 'planner-thinking-' + Date.now();
    showPlannerThinking(thinkingId);
    scrollPlannerToBottom();

    try {
        // 尝试调用Coze API
        const response = await callPlannerAiBot(text);
        removePlannerThinking(thinkingId);
        addPlannerMessage('assistant', response);
    } catch (apiError) {
        console.log('API调用失败，使用本地智能体:', apiError.message);
        removePlannerThinking(thinkingId);
        // 使用本地智能体响应
        const localResponse = generatePlannerAiResponse(text);
        addPlannerMessage('assistant', localResponse);
    }

    _plannerAiIsThinking = false;
    if (sendBtn) sendBtn.disabled = false;
    scrollPlannerToBottom();
}

// 显示思考中动画
function showPlannerThinking(id) {
    const messagesContainer = document.getElementById('plannerMessages');
    const thinkingDiv = document.createElement('div');
    thinkingDiv.id = id;
    thinkingDiv.className = 'planner-msg assistant';
    thinkingDiv.innerHTML = `
        <div class="planner-msg-avatar">🤖</div>
        <div class="planner-msg-content">
            <div class="planner-thinking">
                <span class="thinking-dot"></span>
                <span class="thinking-dot"></span>
                <span class="thinking-dot"></span>
                <span style="margin-left:8px;color:#94a3b8;font-size:13px;">AI正在思考...</span>
            </div>
        </div>
    `;
    messagesContainer.appendChild(thinkingDiv);
}

function removePlannerThinking(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function scrollPlannerToBottom() {
    const container = document.getElementById('plannerMessages');
    if (container) container.scrollTop = container.scrollHeight;
}

// 添加消息到聊天界面
function addPlannerMessage(role, content) {
    const messagesContainer = document.getElementById('plannerMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `planner-msg ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'planner-msg-avatar';
    avatar.textContent = role === 'user' ? '👤' : '🎓';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'planner-msg-content';

    if (role === 'user') {
        contentDiv.innerHTML = escapeHtml(content).replace(/\n/g, '<br>');
    } else {
        contentDiv.innerHTML = planMarkdownToHtml(content);
    }

    msgDiv.appendChild(avatar);
    msgDiv.appendChild(contentDiv);
    messagesContainer.appendChild(msgDiv);

    // 保存历史
    _plannerMessageHistory.push({ role, content });
}

// 本地智能体响应生成
function generatePlannerAiResponse(userMessage) {
    const msg = userMessage.toLowerCase();

    // 提取关键信息
    const extracted = extractStudyInfo(userMessage);

    // 如果用户只是打招呼或简单询问
    if (msg.match(/^(你好|您好|hi|hello|在吗|在嘛)/)) {
        return `你好！👋 我是你的专属学习规划助手。

我可以帮你：
• 📋 **制定学习规划** — 根据你的目标、时间和基础定制方案
• 📖 **推荐学习资源** — 教材、网课、习题集推荐
• 🎯 **分析学习策略** — 分阶段计划、每日安排
• ❓ **解答学习疑问** — 学科知识、备考技巧

请告诉我你的学习需求，比如：
- "我是大二学生，想备考高数期末，还有30天，每天2小时"
- "我想零基础学Python，希望3个月入门，每天1小时"`;
    }

    // 如果用户要求生成规划
    if (msg.includes('规划') || msg.includes('计划') || msg.includes('安排') || msg.includes('方案') ||
        msg.includes('学习') || msg.includes('备考') || msg.includes('复习')) {
        return generateLocalPlanResponse(extracted, userMessage);
    }

    // 通用回复
    return `感谢你的提问！💡

关于"${userMessage}"，我的建议是：

1. **明确目标**：先确定你想要达到的具体目标（考试分数、掌握程度等）
2. **评估现状**：客观评估自己当前的基础水平
3. **制定计划**：根据可用时间和目标倒推制定学习计划
4. **执行反馈**：按计划执行，定期复盘调整

如果你需要我帮你**制定具体的学习规划**，请告诉我：
- 你的年级和专业
- 想学习的学科/考试
- 可用时间和周期
- 当前基础水平

我会为你生成详细的个性化方案！`;
}

// 从用户消息中提取学习信息
function extractStudyInfo(msg) {
    const info = {
        grade: '',
        subject: '',
        goal: '',
        period: 30,
        dailyTime: 60,
        description: msg
    };

    // 提取年级
    const gradeMatch = msg.match(/(大一|大二|大三|大四|研究生)/);
    if (gradeMatch) info.grade = gradeMatch[1];

    // 提取学科
    const subjects = {
        '高等数学': 'math_advanced', '高数': 'math_advanced',
        '线性代数': 'linear_algebra', '线代': 'linear_algebra',
        '概率论': 'probability', '概率': 'probability',
        '数据结构': 'data_structure',
        '操作系统': 'operating_system', '计组': 'cs_basics',
        '计算机网络': 'network', '计算机网络': 'network',
        '数据库': 'database',
        '软件工程': 'software_eng',
        '会计': 'accounting',
        '经济学': 'economics',
        '物理': 'physics',
        '化学': 'chemistry',
        '英语': 'english',
        '政治': 'politics',
        '机器学习': 'machine_learning',
        '人工智能': 'ai_basics',
        '考研': 'graduate_entrance',
        '期末': 'final_exam',
        '期中': 'midterm'
    };

    for (const [key, val] of Object.entries(subjects)) {
        if (msg.includes(key)) {
            info.subject = key;
            break;
        }
    }

    // 提取时间（天）
    const dayMatch = msg.match(/(\d+)\s*天/);
    if (dayMatch) info.period = parseInt(dayMatch[1]);

    // 提取时间（月）
    const monthMatch = msg.match(/(\d+)\s*个月/);
    if (monthMatch) info.period = parseInt(monthMatch[1]) * 30;

    // 提取每日时长
    const hourMatch = msg.match(/(\d+)\s*小时/);
    if (hourMatch) info.dailyTime = parseInt(hourMatch[1]) * 60;

    const minuteMatch = msg.match(/(\d+)\s*分钟/);
    if (minuteMatch) info.dailyTime = parseInt(minuteMatch[1]);

    // 提取目标
    if (msg.includes('考研')) info.goal = '考研备考';
    else if (msg.includes('期末')) info.goal = '期末考试';
    else if (msg.includes('期中')) info.goal = '期中考试';
    else if (msg.includes('考证') || msg.includes('证书') || msg.includes('资格')) info.goal = '考证/资格认证';
    else if (msg.includes('入门') || msg.includes('基础')) info.goal = '夯实基础';
    else if (msg.includes('提升') || msg.includes('进阶')) info.goal = '进阶提升';
    else info.goal = '综合学习';

    return info;
}

// 生成本地学习规划响应
function generateLocalPlanResponse(info, originalMsg) {
    const subjectName = info.subject || '该学科';
    const gradeName = info.grade || '当前年级';
    const goal = info.goal || '学习目标';
    const period = info.period || 30;
    const dailyTime = info.dailyTime || 60;
    const totalHours = Math.round(period * dailyTime / 60);

    const phase1End = Math.max(1, Math.floor(period / 3));
    const phase2Start = phase1End + 1;
    const phase2End = Math.min(Math.floor(period * 2 / 3), period);
    const phase3Start = phase2End + 1;

    // 学科知识库
    const subjectKnowledge = {
        '高等数学': {
            modules: ['极限与连续', '导数与微分', '积分学', '级数', '微分方程', '多元函数'],
            keyPoints: ['洛必达法则', '泰勒展开', '定积分应用', '格林公式', '傅里叶级数'],
            resources: ['《高等数学》同济版', '宋浩老师视频课', '考研数学真题']
        },
        '线性代数': {
            modules: ['行列式', '矩阵运算', '向量空间', '线性方程组', '特征值与特征向量', '二次型'],
            keyPoints: ['矩阵求逆', '秩的计算', '基变换', '正交化', '相似对角化'],
            resources: ['《线性代数》同济版', '3Blue1Brown系列', '李永乐线代讲义']
        },
        '概率论': {
            modules: ['随机事件与概率', '随机变量', '多维随机变量', '数字特征', '大数定律', '参数估计', '假设检验'],
            keyPoints: ['全概率公式', '分布函数', '期望方差', '中心极限定理', '最大似然估计'],
            resources: ['《概率论与数理统计》浙大版', '张宇概率论课程', '历年考研真题']
        },
        '数据结构': {
            modules: ['线性表', '树与二叉树', '图论', '排序算法', '查找算法', '动态规划', '贪心算法'],
            keyPoints: ['链表操作', '二叉树遍历', '最短路径', '快速排序', '哈希表', '背包问题'],
            resources: ['《数据结构》严蔚敏版', 'LeetCode', '算法导论', '王道考研']
        },
        '操作系统': {
            modules: ['进程管理', '内存管理', '文件系统', 'I/O系统', '死锁', '虚拟化'],
            keyPoints: ['进程同步', '页面置换', '磁盘调度', '银行家算法', '虚拟内存'],
            resources: ['《操作系统》汤子瀛版', 'MIT 6.828', '王道考研操作系统']
        },
        '计算机网络': {
            modules: ['物理层', '数据链路层', '网络层', '传输层', '应用层', '网络安全'],
            keyPoints: ['TCP/IP协议', '路由算法', '拥塞控制', 'DNS解析', 'HTTP/HTTPS'],
            resources: ['《计算机网络》谢希仁版', 'Wireshark实验', 'CS144课程']
        },
        '数据库': {
            modules: ['关系模型', 'SQL语言', '数据库设计', '事务管理', '索引优化', 'NoSQL'],
            keyPoints: ['范式理论', 'SQL查询优化', 'ACID特性', '索引原理', '锁机制'],
            resources: ['《数据库系统概论》王珊版', 'MySQL官方文档', '牛客网SQL练习']
        },
        '会计': {
            modules: ['会计要素', '会计等式', '记账方法', '财务报表', '成本核算', '税务基础'],
            keyPoints: ['借贷记账法', '资产负债表', '利润表', '现金流量表', '增值税'],
            resources: ['《基础会计》', '初级会计职称教材', '会计实操课程']
        },
        '经济学': {
            modules: ['微观经济学', '宏观经济学', '国际经济学', '计量经济学', '金融学基础'],
            keyPoints: ['供需理论', '边际分析', 'GDP核算', '货币政策', '汇率制度'],
            resources: ['《经济学原理》曼昆版', '高鸿业教材', '经济学人杂志']
        },
        '机器学习': {
            modules: ['监督学习', '无监督学习', '强化学习', '深度学习', '模型评估', '特征工程'],
            keyPoints: ['线性回归', 'SVM', '决策树', '聚类算法', '神经网络', '过拟合处理'],
            resources: ['《机器学习》周志华版', '吴恩达深度学习', 'Kaggle竞赛']
        },
        '人工智能': {
            modules: ['搜索算法', '知识表示', '机器学习', '神经网络', '自然语言处理', '计算机视觉'],
            keyPoints: ['A*算法', '贝叶斯网络', '梯度下降', 'CNN/RNN', 'Transformer'],
            resources: ['《人工智能》马少平版', '吴恩达ML课程', 'PyTorch官方教程']
        },
        '物理': {
            modules: ['力学', '热学', '电磁学', '光学', '近代物理'],
            keyPoints: ['牛顿定律', '能量守恒', '麦克斯韦方程', '干涉衍射', '光电效应'],
            resources: ['《大学物理》马文蔚版', 'MIT OpenCourseWare', '费曼物理学讲义']
        }
    };

    const sk = subjectKnowledge[subjectName] || {
        modules: ['基础知识', '核心概念', '应用实践', '综合提升'],
        keyPoints: ['重点概念理解', '典型例题掌握', '实际应用能力'],
        resources: ['教材与课堂笔记', '网课视频', '习题集与真题']
    };

    const dailyTemplate = dailyTime <= 60
        ? `- 理论学习（${Math.round(dailyTime * 0.5)}分钟）：阅读教材/观看视频
- 练习巩固（${Math.round(dailyTime * 0.35)}分钟）：完成课后习题
- 复盘总结（${Math.round(dailyTime * 0.15)}分钟）：整理笔记、标记疑难点`
        : `- 理论学习（${Math.round(dailyTime * 0.4)}分钟）：系统学习新知识
- 例题精讲（${Math.round(dailyTime * 0.25)}分钟）：掌握典型解题方法
- 练习巩固（${Math.round(dailyTime * 0.25)}分钟）：独立完成作业/习题
- 复盘总结（${Math.round(dailyTime * 0.1)}分钟）：错题整理、知识框架梳理`;

    const phase1Modules = sk.modules.slice(0, Math.ceil(sk.modules.length / 2));
    const phase2Modules = sk.modules.slice(Math.ceil(sk.modules.length / 2));

    return `好的！根据你的需求，我为你制定了以下学习规划方案：

## 📋 学习概况

**学生信息**：${gradeName}
**学习学科**：${subjectName}
**学习目标**：${goal}
**备考周期**：${period}天
**每日学习时长**：${dailyTime}分钟
**预计总学习时长**：约${totalHours}小时

## 🎯 总体策略

采用"**基础夯实 → 强化提升 → 冲刺整合**"三阶段递进式学习策略：

1. **基础夯实阶段**：系统学习${subjectName}核心知识体系，建立完整的知识框架
2. **强化提升阶段**：针对重点难点进行专项突破，通过大量练习提升解题能力
3. **冲刺整合阶段**：全面复习巩固，模拟实战演练，查漏补缺

## 📅 分阶段计划

### 阶段一：基础夯实（第1-${phase1End}天）

**学习目标**：掌握${subjectName}基础概念和核心理论，建立知识框架

**重点模块**：${phase1Modules.join('、')}

**每日安排**：
${dailyTemplate}

**阶段任务**：
- 完成${phase1Modules.length}个基础模块的系统学习
- 整理每个模块的知识框架图/思维导图
- 完成基础练习题不少于${Math.max(3, Math.floor(period / 10))}套

### 阶段二：强化提升（第${phase2Start}-${phase2End}天）

**学习目标**：突破重难点，提升综合解题能力

**重点模块**：${phase2Modules.join('、')}

**阶段任务**：
- 完成${phase2Modules.length}个进阶模块的深度学习
- 重点攻克：${sk.keyPoints.slice(0, 3).join('、')}
- 完成专项练习题和历年真题${Math.max(2, Math.floor(period / 15))}套
- 建立错题本，分类整理易错知识点

### 阶段三：冲刺整合（第${phase3Start}-${period}天）

**学习目标**：全面复习，模拟实战，查漏补缺

**每日安排**：
- 上午：模拟考试/真题演练（严格计时）
- 下午：错题复盘与知识点回顾
- 晚上：薄弱环节专项突破

**阶段任务**：
- 完成至少${Math.max(2, Math.floor(period / 20))}次全真模拟考试
- 全面复习错题本，确保同类错误不再犯
- 重点回顾：${sk.keyPoints.slice(-3).join('、')}

## 📊 推荐学习资源

${sk.resources.map(r => '- ' + r).join('\n')}

---

💡 **温馨提示**：
- 坚持每日学习，保持连续性比单次时长更重要
- 每周末花30分钟回顾本周学习情况，调整下周计划
- 遇到不懂的问题及时查阅资料或提问

如果你需要我**调整规划**或有其他问题，随时告诉我！`;
}

// 调用Coze API
async function callPlannerAiBot(question) {
    if (!PLANNER_AI_CONFIG.accessToken) throw new Error('未配置Coze访问令牌');
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${PLANNER_AI_CONFIG.accessToken}` };
    const chatBody = {
        bot_id: PLANNER_AI_CONFIG.botId,
        user_id: 'planner_user_' + Date.now(),
        stream: true,
        auto_save_history: false,
        additional_messages: [{ role: 'user', content: question, content_type: 'text' }],
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    let response;
    try {
        response = await fetch(PLANNER_AI_CONFIG.apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(chatBody),
            signal: controller.signal
        });
    } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
            throw new Error('请求超时，请检查网络后重试');
        }
        throw new Error('网络请求失败: ' + (fetchError.message || '未知网络错误'));
    }
    clearTimeout(timeoutId);

    if (!response.ok) {
        let errMsg = `API请求失败 (HTTP ${response.status})`;
        try { const errData = await response.json(); if (errData.msg) errMsg += ': ' + errData.msg; } catch (e) {}
        throw new Error(errMsg);
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '', replyText = '', completed = false;
    while (!completed) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const blocks = buffer.split('\n\n');
        buffer = blocks.pop() || '';
        for (const block of blocks) {
            const lines = block.split('\n');
            let eventType = '', eventData = null;
            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;
                if (trimmed.startsWith('event:')) eventType = trimmed.slice(6).trim();
                else if (trimmed.startsWith('data:')) {
                    const jsonStr = trimmed.slice(5).trim();
                    if (jsonStr === '[DONE]') { completed = true; break; }
                    try { eventData = JSON.parse(jsonStr); } catch (e) {}
                }
            }
            if (!eventData) continue;
            if (eventType === 'conversation.message.delta') replyText += (eventData.content || eventData.reasoning_content || '');
            else if (eventType === 'conversation.message.completed') {
                const content = (eventData.data && eventData.data.content) || '';
                if (content && !replyText.includes(content)) replyText = content;
            }
            else if (eventType === 'conversation.chat.completed') { completed = true; break; }
            else if (eventData.role === 'assistant' && eventData.type === 'answer') replyText += (eventData.content || eventData.reasoning_content || '');
        }
    }
    return replyText || '抱歉，AI未能生成有效回复，请稍后重试。';
}

function planMarkdownToHtml(text) {
    if (!text) return '';
    let html = escapeHtml(text);

    // 1. 先处理代码块
    const codeBlocks = [];
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
        const idx = codeBlocks.length;
        codeBlocks.push(`<pre style="background:#f1f5f9;padding:12px;border-radius:8px;overflow-x:auto;font-size:13px;"><code>${code}</code></pre>`);
        return `%%CODEBLOCK_${idx}%%`;
    });
    html = html.replace(/`([^`]+)`/g, (_, code) => {
        const idx = codeBlocks.length;
        codeBlocks.push(`<code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:13px;">${code}</code>`);
        return `%%CODEBLOCK_${idx}%%`;
    });

    // 2. 标题
    html = html.replace(/^#### (.+)$/gm, '<h5 style="margin:12px 0 6px;font-size:14px;color:#374151;">$1</h5>');
    html = html.replace(/^### (.+)$/gm, '<h4 style="margin:14px 0 8px;font-size:16px;color:#1a1a2e;">$1</h4>');
    html = html.replace(/^## (.+)$/gm, '<h3 style="margin:18px 0 10px;font-size:18px;color:#1a1a2e;border-bottom:2px solid #7c3aed;padding-bottom:6px;">$1</h3>');

    // 3. 粗体和斜体
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong style="color:#1a1a2e;">$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');

    // 4. 先按双换行分段，处理段落
    const paragraphs = html.split(/\n\n+/);
    html = paragraphs.map(para => {
        para = para.trim();
        if (!para) return '';

        // 跳过已经是HTML标签的内容
        if (/^<(h[3-5]|ul|ol|pre|div|li)/.test(para)) return para;

        // 检测是否为列表块（每行以 - 开头）
        if (/^- /.test(para)) {
            const items = para.split(/\n/).filter(line => /^- /.test(line.trim()));
            const listItems = items.map(item => '<li style="margin-left:16px;line-height:1.8;">' + item.replace(/^- /, '') + '</li>').join('\n');
            return '<ul style="margin:8px 0;padding-left:20px;">' + listItems + '</ul>';
        }

        // 普通段落
        return '<p style="margin:8px 0;line-height:1.8;">' + para.replace(/\n/g, '<br>') + '</p>';
    }).join('');

    // 5. 恢复代码块
    html = html.replace(/%%CODEBLOCK_(\d+)%%/g, (_, idx) => codeBlocks[parseInt(idx)]);

    return '<div style="line-height:1.8;font-size:14px;color:#374151;">' + html + '</div>';
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ========== 极致详细思维导图 v3.0 ==========

function generateMindmap(subject, subjectName) {
    const mindmaps = getDeepMindmaps();
    const mm = mindmaps[subject] || generateGenericMindmap(subjectName);

    let totalNodes = 0, totalLeaves = 0;
    let hasFormulas = false, hasExamPoints = false, hasExamples = false, hasMistakes = false;
    mm.branches.forEach(branch => {
        totalNodes++;
        if (branch.subBranches) {
            branch.subBranches.forEach(sb => {
                totalNodes++;
                if (sb.leaves) totalLeaves += sb.leaves.length;
                if (sb.formulas) { totalLeaves += sb.formulas.length; hasFormulas = true; }
                if (sb.examPoints) { totalLeaves += sb.examPoints.length; hasExamPoints = true; }
                if (sb.examples) { totalLeaves += sb.examples.length; hasExamples = true; }
                if (sb.commonMistakes) { totalLeaves += sb.commonMistakes.length; hasMistakes = true; }
            });
        } else if (branch.leaves) {
            totalNodes++;
            totalLeaves += branch.leaves.length;
        }
    });

    const isCompact = totalLeaves > 20;
    const isLarge = totalLeaves > 40;
    const treeClass = isLarge ? 'mindmap-tree large-tree' : isCompact ? 'mindmap-tree compact-tree' : 'mindmap-tree';

    let html = `<div class="${treeClass}">`;
    html += `<div class="mindmap-stats">
        <span>📌 <strong>${totalNodes}</strong> 个知识模块</span>
        <span>📋 <strong>${totalLeaves}</strong> 个知识要点</span>
        ${hasFormulas ? '<span>📐 含公式</span>' : ''}
        ${hasExamPoints ? '<span>🎯 含考点</span>' : ''}
        ${hasExamples ? '<span>📝 含例题</span>' : ''}
        ${hasMistakes ? '<span>⚠️ 含易错</span>' : ''}
    </div>`;

    html += `<div class="mindmap-node root has-children" onclick="toggleMindmapDetail(this)">
        <span class="mm-icon">📌</span>
        <span class="node-label">${mm.root}</span>
        <span class="mm-badge">${totalNodes}模块 · ${totalLeaves}要点</span>
        <span class="mm-toggle">▼</span>
    </div>`;
    html += `<div class="mindmap-children expanded">`;

    mm.branches.forEach((branch, bi) => {
        const branchIcon = bi === 0 ? '📂' : bi === 1 ? '📖' : bi === 2 ? '🔬' : '📚';
        html += `<div class="mindmap-node branch has-children" onclick="toggleMindmapDetail(this)">
            <span class="mm-icon">${branchIcon}</span>
            <span class="node-label">${branch.name}</span>
            <span class="mm-toggle">▼</span>
        </div>`;
        html += `<div class="mindmap-children expanded">`;

        if (branch.subBranches) {
            branch.subBranches.forEach((sb) => {
                const sbIcon = sb.name.includes('定义') || sb.name.includes('概念') ? '📎' :
                    sb.name.includes('原理') || sb.name.includes('公式') ? '📐' :
                    sb.name.includes('考点') ? '🎯' :
                    sb.name.includes('难点') ? '🔥' :
                    sb.name.includes('技巧') ? '💡' :
                    sb.name.includes('案例') ? '📋' :
                    sb.name.includes('错题') || sb.name.includes('误区') ? '⚠️' :
                    sb.name.includes('冲刺') || sb.name.includes('速记') ? '⚡' : '📎';

                html += `<div class="mindmap-node sub-branch has-children" onclick="toggleMindmapDetail(this)">
                    <span class="mm-icon">${sbIcon}</span>
                    <span class="node-label">${sb.name}</span>
                    <span class="mm-toggle">▼</span>
                </div>`;
                html += `<div class="mindmap-children expanded">`;

                if (sb.leaves) sb.leaves.forEach(leaf => { html += `<div class="mindmap-node leaf-detail">📌 ${leaf}</div>`; });
                if (sb.formulas) sb.formulas.forEach(f => { html += `<div class="mindmap-node leaf-detail formula">📐 <code>${f}</code></div>`; });
                if (sb.examPoints) sb.examPoints.forEach(ep => { html += `<div class="mindmap-node leaf-detail exam-point">🎯 ${ep}</div>`; });
                if (sb.examples) sb.examples.forEach(ex => { html += `<div class="mindmap-node leaf-detail example">📝 ${ex}</div>`; });
                if (sb.commonMistakes) sb.commonMistakes.forEach(cm => { html += `<div class="mindmap-node leaf-detail mistake">⚠️ ${cm}</div>`; });

                html += `</div>`;
            });
        } else if (branch.leaves) {
            branch.leaves.forEach(leaf => { html += `<div class="mindmap-node leaf-detail">📌 ${leaf}</div>`; });
        }

        html += `</div>`;
    });

    html += `</div></div>`;

    html += `<div class="mindmap-legend">
        <span>📌 知识点</span><span>📐 公式</span><span>🎯 考点</span><span>📝 例题</span><span>⚠️ 易错</span>
    </div>`;

    document.getElementById('mindmapContainer').innerHTML = html;
    updateMindmapAiContext(subject, subjectName);
}

function toggleMindmapDetail(node) {
    const children = node.nextElementSibling;
    if (children && children.classList.contains('mindmap-children')) {
        const isCollapsed = children.classList.contains('collapsed');
        if (isCollapsed) { children.classList.remove('collapsed'); children.classList.add('expanded'); }
        else { children.classList.add('collapsed'); children.classList.remove('expanded'); }
        const toggle = node.querySelector('.mm-toggle');
        if (toggle) toggle.textContent = isCollapsed ? '▼' : '▶';
    }
}

function generateGenericMindmap(subjectName) {
    return {
        root: subjectName || '学科知识',
        branches: [
            { name: '基础概念', subBranches: [
                { name: '核心定义', leaves: ['<strong>定义1：</strong>基本概念的核心定义描述，理解概念的内涵与外延。','<strong>定义2：</strong>关键术语的精确定义，注意与其他相似概念的区分。','<strong>定义3：</strong>核心参数或变量的定义与物理/数学意义。'], formulas: ['核心公式表达，理解每个符号的含义'], examPoints: ['概念辨析题：区分易混淆的相关概念'], commonMistakes: ['常见误区：概念理解表面化，忽略深层含义'] },
                { name: '基本原理', leaves: ['<strong>原理1：</strong>基础定律的完整表述与数学表达式。','<strong>原理2：</strong>核心机制的详细解释与运作逻辑。'], formulas: ['原理对应的数学公式'], examPoints: ['原理应用题型：给定条件判断原理适用性'] }
            ]},
            { name: '重点内容', subBranches: [
                { name: '高频考点', leaves: ['<strong>考点1：</strong>历年考试最高频的知识点与出题形式。','<strong>考点2：</strong>次高频考点及变式考法分析。'], examples: ['典型例题1：详细解题步骤与思路分析'], commonMistakes: ['易错陷阱：常见错误选项的设计逻辑'] },
                { name: '难点解析', leaves: ['<strong>难点1：</strong>本学科公认最难理解的知识点详解。','<strong>难点2：</strong>复杂推导过程的逐步拆解。'], examples: ['综合应用题：跨知识点融合的难题解析'] }
            ]},
            { name: '实践应用', subBranches: [
                { name: '解题技巧', leaves: ['技巧1：快速估算法','技巧2：特殊值代入法'], formulas: ['关键公式速记口诀'], commonMistakes: ['计算失误的常见原因与预防'] },
                { name: '实际案例', leaves: ['案例1：经典工程/经济应用','案例2：现代前沿应用'], examples: ['案例分析题的答题框架与得分要点'] }
            ]},
            { name: '考前冲刺', subBranches: [
                { name: '错题回顾', commonMistakes: ['高频错题类型汇总','易混概念对比表'] },
                { name: '速记要点', formulas: ['必背公式清单','关键结论速记'], examPoints: ['最后冲刺阶段最值得复习的TOP考点'] }
            ]}
        ]
    };
}

function getDeepMindmaps() {
    return {
        accounting: { root: '会计基础', branches: [
            { name: '会计基本理论', subBranches: [
                { name: '四大假设', leaves: ['<strong>会计主体假设：</strong>明确会计工作服务的特定单位或组织，将企业与其所有者区分开。','<strong>持续经营假设：</strong>假定企业在可预见的未来会持续经营下去，不会破产清算。这是计提折旧、摊销的基础。','<strong>会计分期假设：</strong>将企业持续经营期间划分为若干个较短的会计期间（月/季/年），以便分期结算账目。','<strong>货币计量假设：</strong>以货币作为统一计量单位，假定币值稳定。'], formulas: ['资产 = 负债 + 所有者权益（会计恒等式）'], examPoints: ['会计主体与法律主体的区别：分公司是会计主体但不是法律主体'], commonMistakes: ['混淆会计主体和法律主体概念', '忽略持续经营假设对折旧方法的影响'] },
                { name: '六大要素', leaves: ['<strong>资产：</strong>企业拥有或控制的、预期带来经济利益的资源。分类：流动资产（≤1年）和非流动资产。','<strong>负债：</strong>企业承担的现时义务，预期会导致经济利益流出。分类：流动负债和非流动负债。','<strong>所有者权益：</strong>企业资产扣除负债后的剩余权益。包括实收资本、资本公积、盈余公积、未分配利润。','<strong>收入：</strong>日常活动导致的经济利益总流入。','<strong>费用：</strong>日常活动导致的经济利益总流出。','<strong>利润：</strong>一定期间的经营成果 = 收入 - 费用 + 利得 - 损失。'], examPoints: ['收入和利得的区分：收入来自日常活动，利得来自非日常活动'], commonMistakes: ['将预收账款误归类为收入（实为负债）'] }
            ]},
            { name: '借贷记账法', subBranches: [
                { name: '借贷规则', leaves: ['<strong>资产类：</strong>借方增加、贷方减少，余额一般在借方。','<strong>负债类：</strong>贷方增加、借方减少，余额一般在贷方。','<strong>所有者权益类：</strong>贷方增加、借方减少。','<strong>收入类：</strong>贷方增加，期末结转至本年利润（借方）。','<strong>费用类：</strong>借方增加，期末结转至本年利润（贷方）。'], formulas: ['有借必有贷，借贷必相等（记账规则）'], examPoints: ['各类账户正常余额方向的判断'], commonMistakes: ['混淆损益类科目与权益类科目的借贷方向'] },
                { name: '会计分录与试算平衡', leaves: ['<strong>简单分录：</strong>一借一贷。','<strong>复合分录：</strong>一借多贷或多借一贷。','<strong>发生额试算平衡：</strong>全部账户借方发生额合计 = 全部账户贷方发生额合计。','<strong>余额试算平衡：</strong>全部账户借方余额合计 = 全部账户贷方余额合计。'], examples: ['例：收到投资者投入银行存款100万元 → 借：银行存款100万，贷：实收资本100万'], commonMistakes: ['试算平衡通过≠记账完全正确（漏记、重记等不影响平衡）'] }
            ]},
            { name: '财务报表', subBranches: [
                { name: '资产负债表', leaves: ['<strong>定义：</strong>反映企业某一特定日期财务状况的报表，是静态报表。','<strong>结构：</strong>左侧资产（按流动性排列），右侧负债和所有者权益。','<strong>关键指标：</strong>资产负债率=总负债/总资产；流动比率=流动资产/流动负债。'], examPoints: ['资产负债表日：通常为年末12月31日'], commonMistakes: ['将资产负债表与利润表的编制日期混淆'] },
                { name: '利润表', leaves: ['<strong>定义：</strong>反映企业一定期间经营成果的动态报表。','<strong>多步式结构：</strong>营业收入 → 营业利润 → 利润总额 → 净利润。','<strong>关键指标：</strong>毛利率=(收入-成本)/收入；净利率=净利润/收入。'], formulas: ['营业利润 = 营业收入 - 营业成本 - 税金及附加 - 三费 ± 投资收益等'], examples: ['例：某公司收入1000万，成本600万，费用200万，所得税50万，净利润=150万'] }
            ]}
        ]},
        math_advanced: { root: '高等数学', branches: [
            { name: '函数与极限', subBranches: [
                { name: '极限定义与计算', leaves: ['<strong>ε-δ定义：</strong>∀ε>0, ∃δ>0, 当0<|x-x₀|<δ时，|f(x)-A|<ε。极限描述的是"无限趋近"的过程。','<strong>左右极限：</strong>x→x₀⁻（左极限）和x→x₀⁺（右极限）。极限存在⇔左右极限存在且相等。','<strong>无穷小：</strong>极限为0的变量。高阶无穷小趋近0的速度更快。'], formulas: ['lim(x→0) sinx/x = 1（第一重要极限）','lim(x→∞) (1+1/x)^x = e（第二重要极限）','等价无穷小：x→0时, sinx~x, tanx~x, ln(1+x)~x, e^x-1~x'], examples: ['例：求lim(x→0) sin(3x)/x = 3·lim(3x→0) sin(3x)/3x = 3·1 = 3'], commonMistakes: ['滥用洛必达法则（必须先验证0/0或∞/∞型）','等价无穷小替换只能在乘除中使用'] },
                { name: '连续与间断', leaves: ['<strong>连续：</strong>lim(x→x₀)f(x)=f(x₀)，即极限值=函数值。','<strong>间断点分类：</strong>第一类（可去/跳跃）和第二类（无穷/振荡）。'], examPoints: ['闭区间上连续函数的性质：有界性、最值定理、介值定理、零点定理'] }
            ]},
            { name: '微分学', subBranches: [
                { name: '导数与求导法则', leaves: ['<strong>导数定义：</strong>f\'(x)=lim(Δx→0)[f(x+Δx)-f(x)]/Δx。几何意义：曲线在该点切线的斜率。','<strong>基本求导公式：</strong>(xⁿ)\'=nxⁿ⁻¹, (sinx)\'=cosx, (cosx)\'=-sinx, (e^x)\'=e^x, (lnx)\'=1/x。'], formulas: ['链式法则：(f(g(x)))\' = f\'(g(x))·g\'(x)','乘法法则：(uv)\' = u\'v + uv\'','除法法则：(u/v)\' = (u\'v - uv\')/v²'], examples: ['例：求y=sin(x²)的导数 → y\'=cos(x²)·2x=2x·cos(x²)'] },
                { name: '中值定理与泰勒公式', leaves: ['<strong>罗尔定理：</strong>f在[a,b]连续、(a,b)可导，f(a)=f(b)→∃ξ使f\'(ξ)=0。','<strong>拉格朗日中值：</strong>∃ξ∈(a,b)，使f\'(ξ)=[f(b)-f(a)]/(b-a)。','<strong>泰勒公式：</strong>f(x)=f(x₀)+f\'(x₀)(x-x₀)+f\'\'(x₀)(x-x₀)²/2!+...。'], examPoints: ['利用拉格朗日中值定理证明不等式'], commonMistakes: ['混淆罗尔定理和拉格朗日中值定理的条件'] },
                { name: '导数应用', leaves: ['<strong>单调性：</strong>f\'(x)>0递增，f\'(x)<0递减。','<strong>极值判定：</strong>f\'(x₀)=0且f\'\'(x₀)≠0，二阶导>0为极小值，<0为极大值。','<strong>凹凸性：</strong>f\'\'(x)>0凹（下凸），f\'\'(x)<0凸（上凸）。拐点处f\'\'(x)=0且变号。'], examples: ['例：求y=x³-3x的极值 → y\'=3x²-3=0 → x=±1，y\'\'=6x，x=1时y\'\'>0极小，x=-1时y\'\'<0极大'] }
            ]},
            { name: '积分学', subBranches: [
                { name: '不定积分', leaves: ['<strong>定义：</strong>导数的逆运算，∫f(x)dx = F(x) + C。','<strong>基本公式：</strong>∫xⁿdx=xⁿ⁺¹/(n+1)+C, ∫cosxdx=sinx+C, ∫e^xdx=e^x+C。'], formulas: ['分部积分：∫udv = uv - ∫vdu','第一类换元（凑微分）：∫f(φ(x))φ\'(x)dx = ∫f(u)du'], examples: ['例：∫x·e^x dx = x·e^x - ∫e^x dx = x·e^x - e^x + C（分部积分法）'] },
                { name: '定积分与应用', leaves: ['<strong>牛顿-莱布尼茨公式：</strong>∫ₐᵇf(x)dx = F(b) - F(a)。','<strong>几何意义：</strong>曲边梯形的面积（f(x)≥0时）。'], formulas: ['旋转体体积：V = π∫ₐᵇ[f(x)]²dx（绕x轴）','平面曲线弧长：s = ∫ₐᵇ√[1+(y\')²]dx'], examples: ['例：求∫₀¹x²dx = [x³/3]₀¹ = 1/3'] }
            ]}
        ]},
        data_structure: { root: '数据结构与算法', branches: [
            { name: '线性结构', subBranches: [
                { name: '数组与链表', leaves: ['<strong>数组：</strong>连续内存，O(1)随机访问，插入/删除O(n)。适合读多写少。','<strong>单链表：</strong>节点含数据+next指针，O(n)查找，O(1)头插/头删。','<strong>双向链表：</strong>节点含prev+next指针，支持双向遍历，空间开销更大。','<strong>循环链表：</strong>尾节点指向头节点，适合循环遍历场景。'], examPoints: ['链表反转（迭代+递归）是高频面试题'], commonMistakes: ['链表操作时忘记更新指针导致断链'] },
                { name: '栈与队列', leaves: ['<strong>栈(Stack)：</strong>后进先出(LIFO)，push/pop操作O(1)。应用：函数调用栈、括号匹配、表达式求值。','<strong>队列(Queue)：</strong>先进先出(FIFO)，enqueue/dequeue操作O(1)。应用：BFS、任务调度。','<strong>循环队列：</strong>用数组实现，front和rear指针循环移动，避免假溢出。','<strong>优先队列：</strong>每次出队优先级最高的元素，通常用堆实现。'], examples: ['例：用栈判断括号匹配——遇到左括号入栈，右括号与栈顶匹配则出栈'] }
            ]},
            { name: '树结构', subBranches: [
                { name: '二叉树', leaves: ['<strong>遍历方式：</strong>前序(根左右)、中序(左根右)、后序(左右根)、层序(BFS)。','<strong>二叉搜索树(BST)：</strong>左<根<右，查找/插入平均O(log n)，最坏O(n)。','<strong>哈夫曼树：</strong>带权路径长度最短的二叉树，用于数据压缩编码。'], formulas: ['n个节点的二叉树有Catalan(n)种形态','完全二叉树高度=⌊log₂n⌋+1'], commonMistakes: ['BST删除节点时忘记处理双子节点的情况'] },
                { name: '平衡树与堆', leaves: ['<strong>AVL树：</strong>平衡因子=|左子树高度-右子树高度|≤1，通过LL/RR/LR/RL旋转维持平衡。','<strong>红黑树：</strong>弱平衡二叉搜索树，5条性质保证O(log n)，插入删除比AVL更高效。','<strong>堆：</strong>大顶堆（父≥子）、小顶堆（父≤子）。插入O(log n)，取最值O(1)。'], examples: ['例：堆排序——建堆O(n) + 依次取堆顶O(n log n) = O(n log n)'] }
            ]},
            { name: '图与算法', subBranches: [
                { name: '图遍历与最短路径', leaves: ['<strong>DFS：</strong>深度优先，用栈/递归实现，适合连通性、拓扑排序。','<strong>BFS：</strong>广度优先，用队列实现，适合最短路径（无权图）。','<strong>Dijkstra：</strong>单源最短路径，不能处理负权边，时间复杂度O(V²)或O(E log V)（堆优化）。'], formulas: ['Floyd算法：三重循环O(V³)，任意两点间最短路径'], commonMistakes: ['Dijkstra不能处理负权边，负权边需用Bellman-Ford'] },
                { name: '算法设计范式', leaves: ['<strong>分治：</strong>分解→解决→合并。归并排序O(n log n)、快速排序平均O(n log n)。','<strong>动态规划：</strong>最优子结构+重叠子问题。0-1背包O(nW)、LCS O(mn)。','<strong>贪心：</strong>每步选局部最优。活动选择、哈夫曼编码、Prim/Kruskal最小生成树。'], examples: ['例：0-1背包dp[i][w]=max(dp[i-1][w], dp[i-1][w-wᵢ]+vᵢ)'] }
            ]}
        ]},
        machine_learning: { root: '机器学习', branches: [
            { name: '监督学习', subBranches: [
                { name: '线性模型', leaves: ['<strong>线性回归：</strong>y=wᵀx+b，最小化均方误差MSE。正规方程解w=(XᵀX)⁻¹Xᵀy。','<strong>逻辑回归：</strong>用sigmoid函数做二分类，交叉熵损失。本质是线性分类器。','<strong>正则化：</strong>L1(LASSO)产生稀疏解（特征选择），L2(Ridge)缩小权重但不为零。'], formulas: ['sigmoid: σ(z)=1/(1+e^(-z))','L1正则: λΣ|wᵢ|','L2正则: λΣwᵢ²'], examples: ['例：房价预测——面积、卧室数、地段作为特征，用线性回归拟合'] },
                { name: '树模型与集成', leaves: ['<strong>决策树：</strong>ID3用信息增益、C4.5用增益率、CART用基尼系数。易过拟合需剪枝。','<strong>随机森林：</strong>Bagging+随机特征选择，多棵决策树投票，降低方差。','<strong>XGBoost：</strong>Boosting方法，二阶泰勒展开+正则化，速度精度俱佳。'], examPoints: ['Bagging降低方差，Boosting降低偏差'], commonMistakes: ['树模型不进行特征归一化（树模型对尺度不敏感）'] }
            ]},
            { name: '深度学习', subBranches: [
                { name: '核心网络结构', leaves: ['<strong>CNN：</strong>卷积层（局部连接+权值共享）+池化层（降采样）+全连接层。适合图像处理。','<strong>RNN/LSTM：</strong>处理序列数据。LSTM通过遗忘门/输入门/输出门解决长程依赖。','<strong>Transformer：</strong>自注意力机制(Self-Attention)，并行处理序列，Attention(Q,K,V)=softmax(QKᵀ/√d)V。'], formulas: ['ReLU: f(x)=max(0,x)','Softmax: softmax(xᵢ)=e^xᵢ/Σe^xⱼ'], examples: ['例：用CNN做MNIST手写数字识别——卷积→池化→卷积→池化→全连接→Softmax'] }
            ]},
            { name: '模型评估', subBranches: [
                { name: '评估指标', leaves: ['<strong>混淆矩阵：</strong>TP(真阳)、FP(假阳)、FN(假阴)、TN(真阴)。','<strong>精确率=TP/(TP+FP)</strong>（预测为正中真正为正的比例）。','<strong>召回率=TP/(TP+FN)</strong>（真正为正中被正确预测的比例）。','<strong>F1=2PR/(P+R)</strong>（精确率和召回率的调和平均）。','<strong>AUC-ROC：</strong>衡量分类器整体性能，AUC越大越好（0.5随机，1.0完美）。'], formulas: ['准确率=(TP+TN)/Total','F1-Score=2·Precision·Recall/(Precision+Recall)'], commonMistakes: ['类别不平衡时准确率会误导，应看精确率/召回率/F1'] }
            ]}
        ]},
        economics: { root: '经济学', branches: [
            { name: '微观经济学', subBranches: [
                { name: '供需理论', leaves: ['<strong>需求定律：</strong>其他条件不变，价格上升→需求量下降（需求曲线向右下方倾斜）。','<strong>供给定律：</strong>其他条件不变，价格上升→供给量上升（供给曲线向右上方倾斜）。','<strong>市场均衡：</strong>需求曲线与供给曲线交点，均衡价格P*和均衡数量Q*。'], formulas: ['需求价格弹性Ed=|(ΔQ/Q)/(ΔP/P)|','弹性>1富有弹性，弹性<1缺乏弹性'], examples: ['例：限价政策——最高限价<均衡价格→供不应求（短缺）；最低限价>均衡价格→供过于求（过剩）'] },
                { name: '消费者与市场结构', leaves: ['<strong>效用最大化：</strong>MUx/Px=MUy/Py（边际效用与价格比相等）。','<strong>完全竞争：</strong>P=MR=MC，长期经济利润为零，效率最高。','<strong>垄断：</strong>MR=MC，P>MC，存在无谓损失。'], examPoints: ['四种市场结构的特征对比（厂商数量、产品差异、进入壁垒）'] }
            ]},
            { name: '宏观经济学', subBranches: [
                { name: 'GDP与通货膨胀', leaves: ['<strong>GDP：</strong>一国在一定时期内生产的最终产品与服务的市场价值总和。','<strong>支出法GDP=C+I+G+NX</strong>（消费+投资+政府购买+净出口）。','<strong>名义GDP vs 实际GDP：</strong>实际GDP用基年价格计算，消除价格变动影响。','<strong>CPI：</strong>衡量一篮子消费品价格变动，反映生活成本变化。'], formulas: ['GDP平减指数=名义GDP/实际GDP×100','通货膨胀率=(CPI当期-CPI基期)/CPI基期×100%'], commonMistakes: ['二手交易不计入GDP（仅计算新生产的产品）'] },
                { name: '货币与财政政策', leaves: ['<strong>货币政策三大工具：</strong>存款准备金率、再贴现率、公开市场操作。','<strong>扩张性货币政策：</strong>降低利率→增加货币供给→刺激投资消费。','<strong>财政政策：</strong>政府支出乘数=1/(1-MPC)，税收乘数=-MPC/(1-MPC)。'], examples: ['例：政府增加购买100亿，MPC=0.8，乘数=5，GDP增加500亿'] }
            ]}
        ]},
        finance_basic: { root: '财经基础', branches: [
            { name: '货币与信用', subBranches: [
                { name: '货币理论', leaves: ['<strong>货币本质：</strong>固定充当一般等价物的特殊商品。','<strong>五大职能：</strong>价值尺度、流通手段、贮藏手段、支付手段、世界货币。','<strong>货币层次：</strong>M0=流通中现金，M1=M0+活期存款（狭义货币），M2=M1+定期存款+储蓄存款（广义货币）。'], examPoints: ['价值尺度只需观念上的货币，流通手段需要现实的货币'], commonMistakes: ['混淆货币职能：信用卡不是货币，是信用工具'] },
                { name: '利率与金融市场', leaves: ['<strong>名义利率 vs 实际利率：</strong>实际利率≈名义利率-通货膨胀率（费雪效应）。','<strong>复利公式：</strong>F=P×(1+r)^n。72法则：72÷年化收益率≈本金翻倍所需年数。','<strong>货币市场：</strong>≤1年，同业拆借、回购、商业票据、大额存单。','<strong>资本市场：</strong>>1年，股票、债券、基金、衍生品。'], formulas: ['单利终值：F=P(1+r×n)','复利终值：F=P(1+r)^n','永续年金现值：PV=C/r'], examples: ['例：10万元投资年化8%，30年后=10×(1.08)^30≈100.6万'] }
            ]},
            { name: '银行体系与监管', subBranches: [
                { name: '中央银行', leaves: ['<strong>三大职能：</strong>发行的银行（发行货币）、银行的银行（最后贷款人）、政府的银行（代理国库）。','<strong>货币政策目标：</strong>稳定物价、充分就业、经济增长、国际收支平衡。','<strong>存款准备金制度：</strong>商业银行吸收存款需按比例缴存央行，降准→释放流动性。'], examPoints: ['中国人民银行的职能与美联储的区别'], commonMistakes: ['混淆央行和商业银行的业务范围'] }
            ]}
        ]},
        physics: { root: '大学物理', branches: [
            { name: '力学', subBranches: [
                { name: '牛顿运动定律', leaves: ['<strong>第一定律（惯性）：</strong>不受外力时物体保持静止或匀速直线运动。惯性是物体的固有属性。','<strong>第二定律：</strong>F=ma（合外力=质量×加速度），矢量方程，瞬时关系。','<strong>第三定律：</strong>作用力与反作用力等大反向，作用在不同物体上，不能抵消。'], formulas: ['F=ma','摩擦力f=μN（滑动摩擦），f≤μₛN（静摩擦）'], examples: ['例：m=2kg物体受F=10N水平力，摩擦系数μ=0.2，求加速度→a=(10-0.2×2×9.8)/2≈3.04m/s²'] },
                { name: '动量与能量', leaves: ['<strong>动量定理：</strong>冲量I=F·Δt=Δp（动量变化）。动量守恒条件：系统合外力为零。','<strong>动能定理：</strong>合外力做功=动能变化，W=ΔEk。','<strong>机械能守恒：</strong>只有保守力（重力/弹力）做功时，Ek+Ep=常量。'], formulas: ['动能Ek=½mv²','重力势能Ep=mgh','弹性势能Ep=½kx²'], commonMistakes: ['完全非弹性碰撞中动能不守恒（转化为内能），但动量守恒'] }
            ]},
            { name: '电磁学', subBranches: [
                { name: '静电场', leaves: ['<strong>库仑定律：</strong>F=k·q₁q₂/r²，同号相斥异号相吸。','<strong>电场强度：</strong>E=F/q（单位正电荷受力）。点电荷电场E=kQ/r²。','<strong>高斯定理：</strong>穿过闭合曲面的电通量=内部净电荷/ε₀。'], formulas: ['电势能W=qV','电势V=kQ/r','电容C=Q/V','平行板电容C=ε₀S/d'] },
                { name: '磁场与电磁感应', leaves: ['<strong>安培力：</strong>F=BIL·sinθ（θ为B与I夹角），方向由左手定则确定。','<strong>法拉第定律：</strong>ε=-dΦ/dt，感应电动势=磁通量变化率的负值。','<strong>楞次定律：</strong>感应电流的磁场总是阻碍引起感应电流的磁通量变化。'], formulas: ['动生电动势ε=BLv','感生电动势ε=-dΦ/dt'], commonMistakes: ['混淆左手定则（判断安培力方向）和右手定则（判断感应电流方向）'] }
            ]}
        ]},
        automation: { root: '自动控制原理', branches: [
            { name: '数学模型', subBranches: [
                { name: '传递函数', leaves: ['<strong>定义：</strong>G(s)=Y(s)/U(s)，零初始条件下输出与输入拉氏变换之比。','<strong>典型环节：</strong>比例K、积分K/s、微分K·s、惯性K/(Ts+1)、振荡K/(T²s²+2ζTs+1)、纯滞后e^(-τs)。','<strong>结构图化简：</strong>串联相乘、并联相加、反馈闭环Φ(s)=G(s)/(1+G(s)H(s))。'], formulas: ['闭环传递函数：Φ(s)=G(s)/(1±G(s)H(s))（负反馈取+）'], examples: ['例：求G(s)=1/s与H(s)=1的闭环传递函数→Φ(s)=(1/s)/(1+1/s)=1/(s+1)'] }
            ]},
            { name: '分析方法', subBranches: [
                { name: '时域分析', leaves: ['<strong>一阶系统：</strong>时间常数T，调节时间t_s≈3T(±5%)或4T(±2%)。','<strong>二阶系统：</strong>阻尼比ζ决定响应类型。ζ=0无阻尼等幅振荡，0<ζ<1欠阻尼，ζ=1临界阻尼，ζ>1过阻尼。','<strong>性能指标：</strong>超调量σ%=e^(-πζ/√(1-ζ²))×100%，峰值时间t_p=π/(ω_n√(1-ζ²))。'], formulas: ['σ%=e^(-πζ/√(1-ζ²))×100%','t_s≈4/(ζω_n) (2%误差带)'], commonMistakes: ['超调量只与ζ有关，与ω_n无关'] },
                { name: '频域分析', leaves: ['<strong>伯德图：</strong>对数幅频L(ω)=20lg|G(jω)|(dB)+对数相频φ(ω)。','<strong>奈奎斯特判据：</strong>Z=P-N，Z=0稳定（Z为闭环右半平面极点数）。','<strong>稳定裕度：</strong>幅值裕度GM≥6dB，相位裕度PM≥30°~60°。'], formulas: ['截止频率ωc：|G(jωc)|=1 (0dB)','相位裕度PM=180°+∠G(jωc)'], examples: ['例：判断G(s)=1/[s(s+1)]的稳定性→闭环特征方程s²+s+1=0，根在左半平面，稳定'] }
            ]}
        ]},
        civil_eng: { root: '土木工程基础', branches: [
            { name: '工程材料', subBranches: [
                { name: '混凝土', leaves: ['<strong>组成：</strong>水泥+骨料（砂+石）+水+外加剂。水灰比是决定强度的关键因素。','<strong>强度等级：</strong>C15~C80，如C30表示150mm立方体28天抗压强度标准值≥30MPa。','<strong>和易性：</strong>流动性（坍落度）、粘聚性、保水性三方面。'], formulas: ['水灰比公式：f_cu=α_a·f_ce·(C/W-α_b)（鲍罗米公式）'], examPoints: ['混凝土强度影响因素排序：水灰比>水泥强度>骨料>养护>龄期'], commonMistakes: ['混淆混凝土立方体抗压强度和轴心抗压强度'] }
            ]},
            { name: '结构设计', subBranches: [
                { name: '受弯构件', leaves: ['<strong>适筋梁：</strong>受拉钢筋先屈服→受压区混凝土后压碎，延性破坏（设计目标）。','<strong>少筋梁：</strong>混凝土一开裂钢筋即屈服，脆性破坏（禁止）。','<strong>超筋梁：</strong>混凝土压碎时钢筋未屈服，脆性破坏（禁止）。'], formulas: ['正截面承载力：M≤α₁f_cbx(h₀-x/2)','相对界限受压区高度ξ_b=β₁/(1+f_y/(E_s·ε_cu))'], examples: ['例：矩形截面b×h=250×500mm，f_c=14.3MPa，f_y=360MPa，求最大承载力'] }
            ]}
        ]},
        electronics: { root: '电子工程基础', branches: [
            { name: '模拟电子', subBranches: [
                { name: '运算放大器', leaves: ['<strong>理想特性：</strong>开环增益∞、输入阻抗∞、输出阻抗0、带宽∞。','<strong>虚短：</strong>负反馈时V⁺≈V⁻（差模输入电压≈0）。','<strong>虚断：</strong>输入电流I⁺=I⁻≈0（输入阻抗无穷大）。'], formulas: ['反相放大器G=-Rf/R₁','同相放大器G=1+Rf/R₁','差分放大器Vout=(Rf/R₁)(V₂-V₁)'], examples: ['例：设计一个增益为-10的反相放大器→取R₁=1kΩ，Rf=10kΩ'] }
            ]},
            { name: '数字电路', subBranches: [
                { name: '逻辑与触发器', leaves: ['<strong>基本逻辑门：</strong>与AND(Y=AB)、或OR(Y=A+B)、非NOT(Y=Ā)、与非NAND、或非NOR、异或XOR(Y=A⊕B)。','<strong>RS触发器：</strong>S=1置位(Q=1)，R=1复位(Q=0)，S=R=1禁止。','<strong>D触发器：</strong>Q_{n+1}=D（CP上升沿），最简单的同步触发器。','<strong>JK触发器：</strong>J=K=1时翻转(Q_{n+1}=Q̄_n)，J=K=0时保持。'], examPoints: ['卡诺图化简逻辑表达式','时序电路设计：状态图→状态表→激励方程→电路图'] }
            ]}
        ]},
        linear_algebra: { root: '线性代数', branches: [
            { name: '矩阵与行列式', subBranches: [
                { name: '矩阵运算', leaves: ['<strong>矩阵乘法：</strong>A(m×n)·B(n×p)=C(m×p)，AB≠BA（不满足交换律）。','<strong>逆矩阵：</strong>AA⁻¹=A⁻¹A=E。A可逆⇔|A|≠0⇔A满秩。','<strong>伴随矩阵法：</strong>A⁻¹=A*/|A|。'], formulas: ['(AB)⁻¹=B⁻¹A⁻¹','(A^T)⁻¹=(A⁻¹)^T','|AB|=|A|·|B|'], commonMistakes: ['矩阵乘法不满足交换律，但满足结合律(AB)C=A(BC)'] },
                { name: '特征值与特征向量', leaves: ['<strong>定义：</strong>Aξ=λξ，λ为特征值，ξ≠0为特征向量。','<strong>求解：</strong>特征多项式|A-λE|=0→特征值λ→解(A-λE)ξ=0→特征向量。','<strong>对角化：</strong>若A有n个线性无关的特征向量，则A=PΛP⁻¹。'], formulas: ['迹tr(A)=Σλᵢ','|A|=Πλᵢ'], examPoints: ['实对称矩阵的特征值均为实数，不同特征值的特征向量正交'] }
            ]}
        ]},
        probability: { root: '概率论与数理统计', branches: [
            { name: '概率基础', subBranches: [
                { name: '条件概率与贝叶斯', leaves: ['<strong>条件概率：</strong>P(A|B)=P(AB)/P(B)，B发生的条件下A发生的概率。','<strong>全概率公式：</strong>P(A)=ΣP(A|Bᵢ)P(Bᵢ)（Bᵢ构成完备事件组）。','<strong>贝叶斯公式：</strong>P(Bᵢ|A)=P(A|Bᵢ)P(Bᵢ)/ΣP(A|Bⱼ)P(Bⱼ)，先验→后验。'], formulas: ['P(AB)=P(A|B)P(B)=P(B|A)P(A)'], examples: ['例：某病发病率0.1%，检测准确率99%，检测阳性后患病概率≈9%（贝叶斯更新）'] }
            ]},
            { name: '分布与推断', subBranches: [
                { name: '常见分布', leaves: ['<strong>二项分布B(n,p)：</strong>n次独立重复试验成功次数，E(X)=np，Var(X)=np(1-p)。','<strong>正态分布N(μ,σ²)：</strong>钟形曲线，68-95-99.7法则（±1σ/2σ/3σ）。','<strong>中心极限定理：</strong>独立同分布随机变量之和近似服从正态分布（n足够大）。'], formulas: ['标准化Z=(X-μ)/σ ~ N(0,1)'], examPoints: ['正态总体均值的置信区间：x̄±z_{α/2}·σ/√n'] }
            ]}
        ]},
        circuit: { root: '电路原理', branches: [
            { name: '基本定律与定理', subBranches: [
                { name: '基尔霍夫定律', leaves: ['<strong>KCL：</strong>ΣI_in=ΣI_out（节点电流代数和为零），基于电荷守恒。','<strong>KVL：</strong>ΣV=0（回路电压代数和为零），基于能量守恒。','<strong>应用：</strong>支路电流法（以支路电流为未知量）、节点电压法（以节点电压为未知量）。'], examples: ['例：两节点电路，用节点电压法：G₁₁V₁+G₁₂V₂=ΣIₛ（自导纳+互导纳=电流源和）'] },
                { name: '电路定理', leaves: ['<strong>叠加定理：</strong>线性电路中，多电源作用=各电源单独作用之和。电压源短路、电流源开路。','<strong>戴维南定理：</strong>线性含源二端网络=电压源U_oc串联电阻R_eq。','<strong>最大功率传输：</strong>当R_L=R_eq时，负载获得最大功率P_max=U_oc²/(4R_eq)。'], formulas: ['戴维南等效：U_oc=开路电压，R_eq=独立源置零后输入电阻'], commonMistakes: ['叠加定理不能用于功率计算（功率与电流/电压非线性关系）'] }
            ]}
        ]},
        network: { root: '计算机网络', branches: [
            { name: '网络体系结构', subBranches: [
                { name: 'OSI与TCP/IP', leaves: ['<strong>OSI七层：</strong>物理层→数据链路层→网络层→传输层→会话层→表示层→应用层。','<strong>TCP/IP四层：</strong>网络接口层→网际层(IP)→传输层(TCP/UDP)→应用层(HTTP/DNS等)。','<strong>封装过程：</strong>应用层数据→传输层加TCP头→网络层加IP头→链路层加帧头尾。'], examPoints: ['各层典型设备：物理层(中继器/集线器)、链路层(交换机/网桥)、网络层(路由器)'] },
                { name: 'TCP/UDP', leaves: ['<strong>TCP特性：</strong>面向连接、可靠传输（确认+重传）、流量控制（滑动窗口）、拥塞控制（慢启动/拥塞避免/快重传/快恢复）。','<strong>三次握手：</strong>SYN→SYN+ACK→ACK。seq和ack号的协商。','<strong>四次挥手：</strong>FIN→ACK→FIN→ACK。TIME_WAIT状态持续2MSL。','<strong>UDP：</strong>无连接、不可靠但速度快，适合实时应用（视频/语音/游戏）。'], formulas: ['TCP吞吐量≈min(拥塞窗口, 接收窗口)/RTT'], commonMistakes: ['混淆三次握手和四次挥手的FIN/ACK顺序'] }
            ]}
        ]},
        operating_system: { root: '操作系统', branches: [
            { name: '进程与同步', subBranches: [
                { name: '进程管理', leaves: ['<strong>进程状态：</strong>就绪(Ready)→运行(Running)→阻塞(Blocked)。五状态模型增加新建和终止。','<strong>调度算法：</strong>FCFS(非抢占)、SJF(最短作业优先)、RR(时间片轮转)、优先级调度、多级反馈队列。','<strong>进程vs线程：</strong>进程是资源分配单位，线程是CPU调度单位。同一进程线程共享地址空间。'], examPoints: ['上下文切换开销：保存/恢复寄存器、切换页表等'], commonMistakes: ['混淆并发(concurrency)和并行(parallelism)'] },
                { name: '死锁', leaves: ['<strong>四个必要条件：</strong>互斥、持有并等待、不可抢占、循环等待。打破任一条件即可预防死锁。','<strong>银行家算法：</strong>判断系统是否处于安全状态，避免死锁。需要预知最大需求。'], examples: ['例：哲学家就餐问题是经典的死锁场景——5个哲学家5根筷子，每人需要2根'] }
            ]},
            { name: '内存管理', subBranches: [
                { name: '分页与虚拟内存', leaves: ['<strong>分页：</strong>物理内存分为帧(Frame)，逻辑地址分为页(Page)，通过页表映射。','<strong>TLB：</strong>快表，缓存最近使用的页表项，加速地址转换。','<strong>页面置换算法：</strong>OPT(最优/不可实现)、FIFO、LRU(最近最久未使用)、Clock(近似LRU)。'], formulas: ['有效访问时间EAT=(1-p)×内存访问时间+p×缺页处理时间（p为缺页率）'], commonMistakes: ['Belady异常：FIFO算法在增加物理帧数时缺页次数反而增加'] }
            ]}
        ]},
        database: { root: '数据库原理', branches: [
            { name: '关系模型与SQL', subBranches: [
                { name: '关系代数', leaves: ['<strong>五种基本操作：</strong>选择σ（行筛选）、投影π（列筛选）、并∪、差-、笛卡尔积×。','<strong>连接操作：</strong>θ连接、等值连接、自然连接（自动去重同名属性）、外连接（LEFT/RIGHT/FULL）。'], formulas: ['自然连接R⋈S = π_{去重属性}(σ_{R.A=S.A}(R×S))'], commonMistakes: ['混淆WHERE和HAVING：WHERE筛选行（分组前），HAVING筛选组（分组后）'] },
                { name: '事务与索引', leaves: ['<strong>ACID：</strong>原子性(Atomicity)、一致性(Consistency)、隔离性(Isolation)、持久性(Durability)。','<strong>隔离级别：</strong>读未提交→读已提交→可重复读→可串行化（隔离性递增，性能递减）。','<strong>B+树索引：</strong>所有数据存储在叶子节点，叶子节点形成有序链表，适合范围查询。'], examPoints: ['最左前缀原则：复合索引(a,b,c)中，查询条件包含a才能使用索引'], examples: ['例：EXPLAIN SELECT * FROM users WHERE age>18 ORDER BY name——分析执行计划'] }
            ]}
        ]},
        software_eng: { root: '软件工程', branches: [
            { name: '开发方法与设计', subBranches: [
                { name: '开发模型', leaves: ['<strong>瀑布模型：</strong>需求→设计→编码→测试→维护，阶段性强，适合需求明确的项目。','<strong>敏捷开发：</strong>迭代增量、快速反馈，Scrum框架（Sprint/每日站会/回顾）。','<strong>DevOps：</strong>开发+运维一体化，CI/CD持续集成/持续交付。'], examPoints: ['敏捷宣言四大价值观：个体交互>流程工具、可工作软件>文档、客户合作>合同谈判、响应变化>遵循计划'] },
                { name: '设计原则与模式', leaves: ['<strong>SOLID原则：</strong>单一职责(SRP)、开闭(OCP:对扩展开放对修改关闭)、里氏替换(LSP)、接口隔离(ISP)、依赖倒置(DIP)。','<strong>经典设计模式：</strong>单例(全局唯一实例)、工厂(创建对象解耦)、观察者(一对多通知)、策略(算法可替换)。'], examples: ['例：策略模式——支付系统支持微信/支付宝/银行卡，运行时选择不同支付策略'] }
            ]}
        ]},
        ai_basics: { root: '人工智能导论', branches: [
            { name: '搜索与推理', subBranches: [
                { name: '搜索算法', leaves: ['<strong>盲目搜索：</strong>BFS(完备+最优，空间大)、DFS(空间小，可能不最优)、迭代加深DFS(结合二者优点)。','<strong>A*算法：</strong>f(n)=g(n)+h(n)，h(n)≤h*(n)保证最优（可采纳启发式）。','<strong>α-β剪枝：</strong>博弈树搜索优化，剪去不影响最终决策的分支。'], examples: ['例：八数码问题用A*求解，h(n)=曼哈顿距离之和'] }
            ]}
        ]},
        chemistry: { root: '大学化学', branches: [
            { name: '物理化学', subBranches: [
                { name: '热力学与平衡', leaves: ['<strong>热力学第一定律：</strong>ΔU=Q+W（内能变化=吸热+做功）。','<strong>吉布斯自由能：</strong>ΔG=ΔH-TΔS<0→反应自发进行。','<strong>化学平衡：</strong>K(平衡常数)只与温度有关。勒夏特列原理：改变条件平衡向减弱改变方向移动。'], formulas: ['ΔG=-RTlnK','范特霍夫方程：d(lnK)/dT=ΔH/(RT²)'], commonMistakes: ['催化剂不改变平衡常数和平衡位置，只加快达到平衡的速度'] }
            ]}
        ]},
        mechanics: { root: '理论力学', branches: [
            { name: '静力学与运动学', subBranches: [
                { name: '力系平衡', leaves: ['<strong>平面力系平衡方程：</strong>ΣFx=0, ΣFy=0, ΣM=0（三个独立方程）。','<strong>约束类型：</strong>柔索（只受拉）、光滑接触（法向力）、固定铰链（力）、固定端（力+力偶）。'], examples: ['例：简支梁受集中力，求支座反力→取整体为对象列平衡方程'] },
                { name: '动力学', leaves: ['<strong>动量定理：</strong>dp/dt=ΣF（外力），动量守恒条件ΣF=0。','<strong>动量矩定理：</strong>dL/dt=ΣM，动量矩守恒条件ΣM=0。','<strong>动能定理：</strong>W=ΔT（合外力做功=动能变化）。'], formulas: ['转动惯量I=Σmᵢrᵢ²','动能T=½mv²(平动)+½Iω²(转动)'], commonMistakes: ['动量守恒和动能守恒是独立的条件，不互相蕴含'] }
            ]}
        ]},
        material_mech: { root: '材料力学', branches: [
            { name: '基本变形', subBranches: [
                { name: '拉压与扭转', leaves: ['<strong>轴向拉压：</strong>σ=N/A（正应力=轴力/面积），Δl=Nl/EA（变形）。','<strong>胡克定律：</strong>σ=Eε（弹性范围内）。泊松比ν=-ε横向/ε纵向。','<strong>圆轴扭转：</strong>τ=Tρ/I_p（切应力与半径成正比），表面最大。扭转角φ=Tl/GI_p。'], formulas: ['极惯性矩I_p=πd⁴/32（实心圆轴）','空心轴I_p=π(D⁴-d⁴)/32'], commonMistakes: ['扭转切应力公式只适用于圆截面杆件'] },
                { name: '弯曲', leaves: ['<strong>纯弯曲正应力：</strong>σ=My/I_z，中性轴处σ=0，上下表面最大。','<strong>剪应力：</strong>τ=QS/(bI_z)，矩形截面中性轴处最大（τ_max=1.5V/A）。'], formulas: ['矩形截面I_z=bh³/12','挠曲线微分方程：EIw\'\'=M(x)'], examples: ['例：简支梁l=4m，均布荷载q=10kN/m，求最大弯矩M_max=ql²/8=20kN·m'] }
            ]}
        ]},
        thermodynamics: { root: '工程热力学', branches: [
            { name: '基本定律', subBranches: [
                { name: '热力学定律', leaves: ['<strong>第一定律：</strong>能量守恒，闭口系Q=ΔU+W，开口系q=Δh+w_t。','<strong>第二定律：</strong>热不能自发从低温传至高温。熵增原理：孤立系统ΔS≥0。','<strong>卡诺循环：</strong>两个等温过程+两个等熵过程，最高效率η=1-T_L/T_H。'], formulas: ['理想气体状态方程pV=nRT','绝热过程pV^k=const(k=c_p/c_v)'], examples: ['例：热源1000K，冷源300K，卡诺效率η=1-300/1000=70%'] }
            ]}
        ]},
        signal: { root: '信号与系统', branches: [
            { name: '变换分析', subBranches: [
                { name: '傅里叶与拉普拉斯', leaves: ['<strong>傅里叶变换：</strong>时域→频域，X(jω)=∫x(t)e^(-jωt)dt。揭示信号的频谱成分。','<strong>拉普拉斯变换：</strong>X(s)=∫x(t)e^(-st)dt，s=σ+jω。可分析不稳定的系统。','<strong>采样定理：</strong>f_s≥2f_max（奈奎斯特频率），否则频谱混叠。'], formulas: ['卷积定理：时域卷积⇔频域相乘','常用变换对：δ(t)↔1, e^(-at)u(t)↔1/(s+a)'], commonMistakes: ['混淆傅里叶变换和拉普拉斯变换的收敛域条件'] }
            ]}
        ]},
        cad: { root: '机械制图/CAD', branches: [
            { name: '投影与表达', subBranches: [
                { name: '三视图与剖视', leaves: ['<strong>三视图规律：</strong>主俯长对正、主左高平齐、俯左宽相等。','<strong>剖视图：</strong>全剖（对称零件）、半剖（对称零件，一半视图一半剖视）、局部剖。','<strong>断面图：</strong>只画切断面形状，分为移出断面和重合断面。'], examPoints: ['剖面线方向45°，金属材料用细实线剖面线'], commonMistakes: ['剖视图中漏画不可见轮廓线'] }
            ]}
        ]},
        cs_basics: { root: '计算机基础', branches: [
            { name: '计算机组成', subBranches: [
                { name: '冯·诺依曼架构', leaves: ['<strong>五大部件：</strong>运算器(ALU)、控制器(CU)、存储器、输入设备、输出设备。CPU=运算器+控制器。','<strong>核心思想：</strong>存储程序——程序和数据以同等地位存储在存储器中，按地址访问顺序执行。','<strong>存储层次：</strong>寄存器(L0)→Cache(L1/L2/L3)→内存→外存，速度递减、容量递增。'], examPoints: ['指令周期：取指→译码→执行→访存→写回'], commonMistakes: ['混淆哈佛架构（指令和数据分开存储）和冯·诺依曼架构'] }
            ]}
        ]},
        biology: { root: '普通生物学', branches: [
            { name: '细胞与遗传', subBranches: [
                { name: '细胞结构与分裂', leaves: ['<strong>主要细胞器：</strong>线粒体（有氧呼吸）、叶绿体（光合作用）、内质网（合成运输）、高尔基体（加工分泌）、溶酶体（消化）。','<strong>有丝分裂：</strong>产生两个遗传相同的子细胞(2n→2n)，4个时期（前中后末）。','<strong>减数分裂：</strong>产生4个遗传不同的配子(2n→n)，同源重组发生在前期I。'], examPoints: ['减数第一次分裂同源染色体分离，第二次分裂姐妹染色单体分离'] },
                { name: '遗传定律', leaves: ['<strong>分离定律：</strong>等位基因在配子形成时分离，杂合子(Aa)自交后代基因型比1:2:1。','<strong>自由组合定律：</strong>不同基因独立分配，双杂合子自交表现型比9:3:3:1。'], formulas: ['哈代-温伯格平衡：p²+2pq+q²=1（基因频率稳定条件：大种群/随机交配/无突变/无迁移/无选择）'] }
            ]}
        ]},
        stats_advanced: { root: '统计学', branches: [
            { name: '推断统计', subBranches: [
                { name: '假设检验', leaves: ['<strong>基本概念：</strong>H₀原假设（保守假设）、H₁备择假设。α=P(拒绝H₀|H₀真)为显著性水平。','<strong>p值法：</strong>p<α→拒绝H₀。p值越小，拒绝H₀的证据越强。','<strong>两类错误：</strong>I类错误（弃真，概率α）、II类错误（取伪，概率β）。'], formulas: ['Z检验：Z=(x̄-μ₀)/(σ/√n)','t检验：t=(x̄-μ₀)/(s/√n)，df=n-1'], commonMistakes: ['p<0.05不意味着H₁为真的概率是95%'] }
            ]}
        ]},
        securities: { root: '证券投资', branches: [
            { name: '股票投资', subBranches: [
                { name: '基本面分析', leaves: ['<strong>市盈率PE：</strong>股价/每股收益，衡量估值水平。高PE可能高成长也可能高估。','<strong>市净率PB：</strong>股价/每股净资产，银行股常用。'], formulas: ['PE=P/EPS','PB=P/BVPS'], examPoints: ['不同行业PE差异大，应同行业比较'], commonMistakes: ['低PE不一定便宜（可能利润不可持续）'] },
                { name: '技术分析', leaves: ['<strong>三大假设：</strong>市场行为包容一切、价格沿趋势运动、历史会重演。','<strong>常用指标：</strong>MA移动平均线、MACD、RSI、KDJ。'], examples: ['金叉：短期均线上穿长期均线→买入信号；死叉：短期下穿长期→卖出信号'] }
            ]},
            { name: '债券与基金', subBranches: [
                { name: '债券', leaves: ['<strong>债券价格与利率反向变动：</strong>市场利率↑→债券价格↓。久期越大，价格对利率越敏感。'], formulas: ['债券定价：P=Σ[C/(1+r)^t]+F/(1+r)^n'] },
                { name: '基金', leaves: ['<strong>定投优势：</strong>摊平成本、降低择时风险。微笑曲线：下跌时积累份额，上涨时获利。'] }
            ]}
        ]},
        banking: { root: '银行业务', branches: [
            { name: '商业银行业务', subBranches: [
                { name: '资产负债管理', leaves: ['<strong>三性原则：</strong>安全性>流动性>盈利性（优先级）。贷款五级分类：正常/关注/次级/可疑/损失。'], formulas: ['资本充足率=资本/风险加权资产≥8%'] }
            ]}
        ]},
        fund: { root: '基金理财', branches: [
            { name: '基金分类与运作', subBranches: [
                { name: '基金类型', leaves: ['<strong>股票型：</strong>≥80%投资股票，高风险高收益。','<strong>债券型：</strong>≥80%投资债券，中低风险。','<strong>混合型：</strong>灵活配置，风险收益居中。','<strong>货币型：</strong>投资短期货币工具，低风险低收益。'] }
            ]}
        ]},
        tax: { root: '税务基础', branches: [
            { name: '主要税种', subBranches: [
                { name: '增值税与所得税', leaves: ['<strong>增值税：</strong>对增值额征收，税率13%/9%/6%/0%。一般纳税人可抵扣进项税。','<strong>企业所得税：</strong>税率25%，高新企业15%，小微企业优惠。应纳税所得额=收入总额-不征税收入-免税收入-各项扣除-亏损弥补。'], formulas: ['增值税=销项税额-进项税额'] }
            ]}
        ]}
    };
}

function regenerateMindmap() {
    const subject = document.getElementById('planSubject').value;
    const subjectName = PLAN_SUBJECT_NAMES[subject] || subject;
    generateMindmap(subject, subjectName);
}

// ========== Coze AI 知识助手（思维导图智能体） ==========

const COZE_CONFIG = {
    botId: '7647058176340295690',
    apiUrl: 'https://api.coze.cn/v3/chat',
    accessToken: 'pat_ZpsorG48WgFU36y8jM8f1mhON6LTaaDs3pVp8MuNokNFj6WhduC7wSGjV7aVkoUU',
};

let _mindmapAiConversationId = '';
let _mindmapAiChatHistory = [];
let _mindmapAiIsThinking = false;
let _mindmapCurrentSubject = '';
let _mindmapCurrentSubjectName = '';

function toggleMindmapAi() {
    const panel = document.getElementById('mindmapAiPanel');
    const toggle = panel.querySelector('.mindmap-ai-toggle');
    if (panel.classList.contains('collapsed')) {
        panel.classList.remove('collapsed');
        toggle.textContent = '−';
    } else {
        panel.classList.add('collapsed');
        toggle.textContent = '+';
    }
}

async function askMindmapAi(presetQuestion) {
    const input = document.getElementById('mindmapAiInput');
    const question = presetQuestion || input.value.trim();
    if (!question || _mindmapAiIsThinking) return;
    if (!presetQuestion) input.value = '';

    const messagesContainer = document.getElementById('mindmapAiMessages');
    const quickActions = document.getElementById('mindmapAiQuickActions');

    addMindmapAiMessage('user', question);
    quickActions.style.display = 'none';

    _mindmapAiIsThinking = true;
    const thinkingEl = document.createElement('div');
    thinkingEl.className = 'mindmap-ai-thinking';
    thinkingEl.innerHTML = '🤔 AI正在思考<span class="thinking-dot"></span><span class="thinking-dot"></span><span class="thinking-dot"></span>';
    thinkingEl.id = 'mindmapAiThinking';
    messagesContainer.appendChild(thinkingEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
        const response = await callCozeBot(question);
        const thinking = document.getElementById('mindmapAiThinking');
        if (thinking) thinking.remove();
        addMindmapAiMessage('assistant', response);
    } catch (error) {
        const thinking = document.getElementById('mindmapAiThinking');
        if (thinking) thinking.remove();
        const fallbackResponse = generateMindmapAiResponse(question);
        addMindmapAiMessage('assistant', fallbackResponse + '\n\n<i style="color:#94a3b8;font-size:11px;">（本地AI响应 — 接入Coze Token后可获得更强大的智能体回复）</i>');
    }

    _mindmapAiIsThinking = false;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function callCozeBot(question) {
    if (!COZE_CONFIG.accessToken) throw new Error('未配置Coze访问令牌');
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${COZE_CONFIG.accessToken}` };
    const chatBody = {
        bot_id: COZE_CONFIG.botId,
        user_id: 'zhixue_user_' + Date.now(),
        stream: true,
        auto_save_history: true,
        additional_messages: [{ role: 'user', content: question, content_type: 'text' }],
    };
    if (_mindmapAiConversationId) chatBody.conversation_id = _mindmapAiConversationId;

    // 超时控制（60秒）
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    let response;
    try {
        response = await fetch(COZE_CONFIG.apiUrl, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(chatBody),
            signal: controller.signal
        });
    } catch (fetchError) {
        clearTimeout(timeoutId);
        if (fetchError.name === 'AbortError') {
            throw new Error('请求超时，请检查网络后重试');
        }
        throw new Error('网络请求失败: ' + (fetchError.message || '未知网络错误'));
    }
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`API请求失败: ${response.status}`);

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '', replyText = '', completed = false;

    while (!completed) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const blocks = buffer.split('\n\n');
        buffer = blocks.pop() || '';

        for (const block of blocks) {
            const lines = block.split('\n');
            let eventType = '', eventData = null;
            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed) continue;
                if (trimmed.startsWith('event:')) eventType = trimmed.slice(6).trim();
                else if (trimmed.startsWith('data:')) {
                    const jsonStr = trimmed.slice(5).trim();
                    if (jsonStr === '[DONE]') { completed = true; break; }
                    try { eventData = JSON.parse(jsonStr); } catch (e) {}
                }
            }
            if (!eventData) continue;
            if (eventData.conversation_id) _mindmapAiConversationId = eventData.conversation_id;
            if (eventType === 'conversation.message.delta') replyText += (eventData.content || eventData.reasoning_content || '');
            else if (eventType === 'conversation.message.completed') {
                const content = (eventData.data && eventData.data.content) || '';
                if (content && !replyText.includes(content)) replyText = content;
            }
            else if (eventType === 'conversation.chat.completed') { completed = true; break; }
            else if (eventData.role === 'assistant' && eventData.type === 'answer') replyText += (eventData.content || eventData.reasoning_content || '');
        }
    }
    return replyText || '抱歉，我没有获取到有效的回复内容。';
}

function generateMindmapAiResponse(question) {
    const subject = _mindmapCurrentSubjectName || '当前学科';
    const lowerQ = question.toLowerCase();
    if (lowerQ.includes('解释') || lowerQ.includes('概念') || lowerQ.includes('定义')) {
        return `关于**${subject}**的核心概念，我来为你详细解析：

**1. 基础概念理解**
在${subject}的学习中，首先要把握核心定义的内涵和外延。理解概念不仅要记住定义文字，更要理解其背后的逻辑和应用场景。

**2. 概念之间的关联**
知识点之间通常存在逻辑递进关系——基础概念是后续深入学习的前提。建议你按照思维导图的结构，从根节点到叶子节点逐步深入。

**3. 学习方法建议**
• 📖 **先整体后局部**：先通读思维导图全貌，再逐一攻克细节
• ✍️ **动手推导**：对于公式类知识，亲自推导一遍比死记硬背更有效
• 🔄 **间隔复习**：利用艾宾浩斯遗忘曲线，在1天、3天、7天后分别复习
• 📝 **费曼学习法**：尝试用自己的话把知识点讲给别人听

需要我针对某个具体知识点做更详细的讲解吗？`;
    }
    if (lowerQ.includes('练习') || lowerQ.includes('题目') || lowerQ.includes('出题')) {
        return `好的！针对**${subject}**的知识点，我为你设计了3道练习题：

**📝 第1题 — 概念辨析**
请判断以下说法是否正确，并说明理由：
"${subject}中的核心概念在实际应用中可能有多种理解方式。"

**📝 第2题 — 应用分析**
请结合${subject}的知识体系，分析以下场景中涉及的关键知识点，并给出你的解决方案。

**📝 第3题 — 综合思考**
请用思维导图中的3个不同层级知识点，综合分析一个实际案例，并说明各知识点之间的关联关系。

💡 **提示**：做完题目后，可以回到思维导图查看对应知识点的详细解析。`;
    }
    if (lowerQ.includes('建议') || lowerQ.includes('方法') || lowerQ.includes('记忆')) {
        return `针对**${subject}**的学习，以下是我的建议：

**🎯 学习重点**
根据思维导图的结构，建议优先掌握：
1. **基础概念层**（第一层分支）：这是所有知识的基石
2. **核心公式/原理**（第二层子分支）：考试高频考点
3. **易错知识点**：重点关注思维导图中标注⚠️的部分

**🧠 记忆方法**
• **联想记忆法**：将新知识与已有知识建立联系
• **思维导图法**：利用当前的可视化导图进行空间记忆
• **口诀记忆**：将复杂知识点编成顺口溜
• **对比记忆**：将相似概念放在一起对比区分

**📅 复习规划**
• 第1天：浏览思维导图全貌（30分钟）
• 第3天：重点攻克第二层知识点（1小时）
• 第7天：做配套习题检验掌握程度（1.5小时）
• 第14天：错题回顾 + 薄弱环节强化（1小时）`;
    }
    if (lowerQ.includes('易错') || lowerQ.includes('误区') || lowerQ.includes('陷阱')) {
        return `关于**${subject}**的常见易错点分析：

**⚠️ 高频易错类型**

**1. 概念混淆型错误**
很多同学容易混淆相似但不同的概念。建议对照思维导图仔细区分每个知识点的精确含义。

**2. 公式应用型错误**
公式记忆不准确、使用条件不清是常见问题。请查看思维导图中标注📐的公式部分，注意每个公式的适用条件。

**3. 逻辑跳跃型错误**
解题时跳过关键步骤，导致推理链断裂。建议严格按照思维导图的逻辑层次进行推导。

**4. 审题不仔细**
忽略题目中的限定条件。做题时要逐字逐句分析题干。

**💡 避免建议**
• 建立错题本，分类记录错误类型
• 每学完一个子分支，立即做对应练习
• 定期回顾思维导图中的⚠️标记内容`;
    }
    return `关于**${subject}**中你提到的"${question}"，以下是我的分析：

这是一个很好的问题！在${subject}的学习中，这个问题涉及到多个知识层面的内容。我建议你：

1. **查看思维导图**中相关的分支节点，找到对应的知识点
2. **关注细节**：展开思维导图的叶子节点，查看详细定义、公式和例题
3. **多问为什么**：不要只停留在表面理解，深入思考背后的原理

💡 你也可以尝试点击下方的快捷按钮，让我帮你更具体地分析某个知识点！`;
}

function simpleMarkdownToHtml(text) {
    if (!text) return '';
    let html = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:8px;margin:8px 0;">');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#7c3aed;text-decoration:underline;">$1</a>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/```([\s\S]*?)```/g, '<pre style="background:#f1f5f9;padding:12px;border-radius:8px;overflow-x:auto;font-size:13px;"><code>$1</code></pre>');
    html = html.replace(/`([^`]+)`/g, '<code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:13px;">$1</code>');
    html = html.replace(/(^|\n)-\s+(.+)/g, '$1<li style="margin-left:16px;">$2</li>');
    html = html.replace(/\n/g, '<br>');
    return html;
}

function addMindmapAiMessage(role, content) {
    const messagesContainer = document.getElementById('mindmapAiMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `mindmap-ai-msg ${role}`;
    const avatar = document.createElement('div');
    avatar.className = 'mindmap-ai-msg-avatar';
    avatar.textContent = role === 'user' ? '👤' : '🤖';
    const contentDiv = document.createElement('div');
    contentDiv.className = 'mindmap-ai-msg-content';
    contentDiv.innerHTML = role === 'user' ? content.replace(/\n/g, '<br>') : simpleMarkdownToHtml(content);
    msgDiv.appendChild(avatar);
    msgDiv.appendChild(contentDiv);
    messagesContainer.appendChild(msgDiv);
}

function updateMindmapAiContext(subject, subjectName) {
    _mindmapCurrentSubject = subject;
    _mindmapCurrentSubjectName = subjectName;
    _mindmapAiConversationId = '';
    _mindmapAiChatHistory = [];
    const messagesContainer = document.getElementById('mindmapAiMessages');
    if (messagesContainer) messagesContainer.innerHTML = '';
    const quickActions = document.getElementById('mindmapAiQuickActions');
    if (quickActions) quickActions.style.display = '';
}

function setCozeAccessToken(token) {
    COZE_CONFIG.accessToken = token;
    if (token) console.log('✅ Coze智能体已连接，Bot ID:', COZE_CONFIG.botId);
}

console.log('🤖 个性化学习规划 - AI智能体已就绪');
console.log('   智能体1: 思维导图知识体系 Bot ID:', COZE_CONFIG.botId);
console.log('   智能体2: 学习规划辅导 Bot ID:', PLANNER_AI_CONFIG.botId);
