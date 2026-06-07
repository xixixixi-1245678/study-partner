// ========== 错题归集提升模块 ==========

// ========== Coze 智能体配置 ==========
const WRONGBOOK_AI_CONFIG = {
    botId: '7647099879441236003',
    apiUrl: 'https://api.coze.cn/v3/chat',
    accessToken: 'pat_ZpsorG48WgFU36y8jM8f1mhON6LTaaDs3pVp8MuNokNFj6WhduC7wSGjV7aVkoUU',
};

// ========== 学科名称映射（模块级，统一维护） ==========
const SUBJECT_NAMES = {
    accounting: '会计基础', finance_basic: '财经基础', securities: '证券投资',
    economics: '经济学', tax: '税务', fund: '基金理财', banking: '银行业务',
    math_advanced: '高等数学', linear_algebra: '线性代数', probability: '概率论与数理统计',
    physics: '大学物理', chemistry: '大学化学', biology: '普通生物学', stats_advanced: '统计学',
    cs_basics: '计算机基础', data_structure: '数据结构与算法', operating_system: '操作系统',
    network: '计算机网络', database: '数据库原理', software_eng: '软件工程',
    circuit: '电路原理', signal: '信号与系统', mechanics: '理论力学',
    material_mech: '材料力学', cad: '机械制图/CAD', thermodynamics: '工程热力学',
    automation: '自动控制原理', civil_eng: '土木工程基础', electronics: '电子工程基础',
    ai_basics: '人工智能导论', machine_learning: '机器学习', other: '其他'
};

// 学科关键词 -> key 映射，用于从AI回复中自动识别学科
const SUBJECT_KEYWORDS = {
    '会计': 'accounting', '分录': 'accounting', '借贷': 'accounting', '计提': 'accounting',
    '财经': 'finance_basic', '货币': 'finance_basic', '融资': 'finance_basic', '商业银行': 'finance_basic', '信用': 'finance_basic',
    '证券': 'securities', '股票': 'securities', '基金': 'securities', 'MACD': 'securities', 'KDJ': 'securities', 'β系数': 'securities', '市盈率': 'securities',
    '经济': 'economics', '供需': 'economics', '市场': 'economics', 'GDP': 'economics',
    '税务': 'tax', '增值税': 'tax', '所得税': 'tax', '纳税': 'tax',
    '理财': 'fund', '定投': 'fund',
    '银行': 'banking', '存款': 'banking', '贷款': 'banking', '利率': 'banking',
    '高等数学': 'math_advanced', '微积分': 'math_advanced', '极限': 'math_advanced', '导数': 'math_advanced', '积分': 'math_advanced', '微分': 'math_advanced',
    '线性代数': 'linear_algebra', '矩阵': 'linear_algebra', '行列式': 'linear_algebra', '特征值': 'linear_algebra', '对角化': 'linear_algebra',
    '概率论': 'probability', '数理统计': 'probability', '概率': 'probability', '正态分布': 'probability', '二项分布': 'probability', '期望': 'probability',
    '物理': 'physics', '力学': 'physics', '电磁': 'physics', '光学': 'physics', '库仑力': 'physics', '加速度': 'physics', '牛顿': 'physics',
    '化学': 'chemistry', '共价': 'chemistry', '催化': 'chemistry', '活化能': 'chemistry', '反应': 'chemistry', '分子': 'chemistry',
    '生物': 'biology', 'DNA': 'biology', '细胞': 'biology', '遗传': 'biology', '基因': 'biology', '线粒体': 'biology',
    '统计': 'stats_advanced', '回归': 'stats_advanced', '显著性': 'stats_advanced', 'R²': 'stats_advanced', '假设检验': 'stats_advanced',
    '数据结构': 'data_structure', '算法': 'data_structure', '排序': 'data_structure', '栈': 'data_structure', '二分查找': 'data_structure', '时间复杂度': 'data_structure',
    '计算机': 'cs_basics', '冯·诺依曼': 'cs_basics', 'SQL': 'cs_basics', 'HTTP': 'cs_basics', '编程': 'cs_basics',
    '网络': 'network', 'TCP': 'network', 'IP': 'network', 'OSI': 'network', '协议': 'network', '握手': 'network',
    '操作系统': 'operating_system', '进程': 'operating_system', '线程': 'operating_system', '死锁': 'operating_system',
    '数据库': 'database', '范式': 'database', '索引': 'database', '事务': 'database',
    '软件工程': 'software_eng', '设计模式': 'software_eng', '敏捷': 'software_eng', '测试': 'software_eng', '开闭原则': 'software_eng',
    '电路': 'circuit', 'KCL': 'circuit', 'RLC': 'circuit', 'RC': 'circuit', '谐振': 'circuit',
    '信号': 'signal', '奈奎斯特': 'signal', '采样': 'signal', '冲激': 'signal', '频谱': 'signal', '傅里叶': 'signal',
    '力学理论': 'mechanics', '力系': 'mechanics', '动量': 'mechanics', '扭转': 'mechanics', '切应力': 'mechanics',
    '材料力学': 'material_mech', '压杆': 'material_mech', '塑性': 'material_mech', '强度理论': 'material_mech',
    'CAD': 'cad', '制图': 'cad', '三视图': 'cad', '齿轮': 'cad', '公差': 'cad', '标注': 'cad',
    '热力学': 'thermodynamics', '卡诺': 'thermodynamics', '绝热': 'thermodynamics', '制冷': 'thermodynamics',
    '自动控制': 'automation', '传递函数': 'automation', '阻尼比': 'automation', '根轨迹': 'automation', '积分环节': 'automation',
    '土木': 'civil_eng', '混凝土': 'civil_eng', '达西': 'civil_eng', '适筋梁': 'civil_eng', '地基': 'civil_eng',
    '电子工程': 'electronics', '运放': 'electronics', '触发器': 'electronics', 'ARM': 'electronics', 'JK': 'electronics',
    '人工智能': 'ai_basics', 'A\\*算法': 'ai_basics', '产生式': 'ai_basics', '监督学习': 'ai_basics', '启发': 'ai_basics',
    '机器学习': 'machine_learning', '正则化': 'machine_learning', '随机森林': 'machine_learning', 'Transformer': 'machine_learning', 'Bagging': 'machine_learning', 'Boosting': 'machine_learning',
};

let _wrongbookAiConversationId = '';
let _wrongbookIsAnalyzing = false;

document.addEventListener('DOMContentLoaded', () => {
    initTabs();
    initUpload();
    loadWrongBook();
});

// Tab切换
function initTabs() {
    document.querySelectorAll('.wb-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.wb-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.querySelectorAll('.wb-panel').forEach(p => p.classList.remove('active'));
            document.getElementById('panel-' + tab.dataset.tab).classList.add('active');
            
            if (tab.dataset.tab === 'list') loadWrongBook();
            if (tab.dataset.tab === 'review') loadWeakPoints();
        });
    });
}

// 上传
function initUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    
    uploadArea.addEventListener('click', () => fileInput.click());
    uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.style.borderColor = 'var(--primary)'; });
    uploadArea.addEventListener('dragleave', () => { uploadArea.style.borderColor = 'var(--border)'; });
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--border)';
        if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
    });
    fileInput.addEventListener('change', (e) => { if (e.target.files.length) handleFile(e.target.files[0]); });
}

function handleFile(file) {
    if (!file.type.startsWith('image/')) { alert('请上传图片文件'); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
        document.getElementById('uploadArea').innerHTML = `
            <img src="${e.target.result}" style="max-width:100%;max-height:300px;border-radius:8px">
            <p style="margin-top:8px;color:var(--success)">✅ ${file.name} 已上传（目前支持文字输入分析，图片OCR功能持续优化中）</p>
        `;
    };
    reader.readAsDataURL(file);
}

// ========== 调用 Coze 智能体（通用SSE流式） ==========
async function callWrongbookAiBot(question) {
    if (!WRONGBOOK_AI_CONFIG.accessToken) {
        throw new Error('未配置Coze访问令牌');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WRONGBOOK_AI_CONFIG.accessToken}`,
    };

    const chatBody = {
        bot_id: WRONGBOOK_AI_CONFIG.botId,
        user_id: 'wrongbook_user_' + Date.now(),
        stream: true,
        auto_save_history: false,
        additional_messages: [
            {
                role: 'user',
                content: question,
                content_type: 'text',
            }
        ],
    };

    const response = await fetch(WRONGBOOK_AI_CONFIG.apiUrl, {
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

    // 读取SSE流
    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let replyText = '';
    let completed = false;

    while (!completed) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
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

            if (eventType === 'conversation.message.delta') {
                const delta = eventData.content || eventData.reasoning_content || '';
                replyText += delta;
            }
            else if (eventType === 'conversation.message.completed') {
                const content = (eventData.data && eventData.data.content) || '';
                if (content && !replyText.includes(content)) {
                    replyText = content;
                }
            }
            else if (eventType === 'conversation.chat.completed') {
                completed = true;
                break;
            }
            else if (eventData.role === 'assistant' && eventData.type === 'answer') {
                const c = eventData.content || eventData.reasoning_content || '';
                replyText += c;
            }
        }
    }

    return replyText || '抱歉，AI未能生成有效回复，请稍后重试。';
}

// ========== 从AI回复中自动识别学科 ==========
function detectSubjectFromAnalysis(analysisText, questionText) {
    const combinedText = (analysisText + ' ' + questionText).toLowerCase();
    
    // 用关键词匹配，按匹配数量排序
    const scores = {};
    for (const [keyword, subjectKey] of Object.entries(SUBJECT_KEYWORDS)) {
        if (combinedText.includes(keyword.toLowerCase())) {
            scores[subjectKey] = (scores[subjectKey] || 0) + 1;
        }
    }
    
    // 找最高分的学科
    let bestSubject = 'other';
    let bestScore = 0;
    for (const [key, score] of Object.entries(scores)) {
        if (score > bestScore) {
            bestScore = score;
            bestSubject = key;
        }
    }
    
    return bestSubject;
}

// ========== 分析错题（接入Coze智能体） ==========
async function analyzeWrongQuestion() {
    if (_wrongbookIsAnalyzing) return;

    const text = document.getElementById('wrongQuestionText').value.trim();
    const errorType = document.getElementById('wqErrorType').value;

    const errorTypeNames = { concept: '概念不清', calculation: '计算失误', understanding: '理解偏差', careless: '审题粗心' };
    const errorName = errorTypeNames[errorType] || errorType;

    // 显示加载状态
    _wrongbookIsAnalyzing = true;
    document.getElementById('analysisCard').style.display = 'block';
    document.getElementById('analysisContent').innerHTML = `
        <div class="paper-loading" style="display:flex;align-items:center;gap:12px;padding:20px;">
            <div class="loading-spinner"></div>
            <span>🔬 AI正在深度分析错题，请稍候...</span>
        </div>
    `;
    document.getElementById('variantCard').style.display = 'none';
    document.getElementById('analysisCard').scrollIntoView({ behavior: 'smooth' });

    try {
        // 构建错题分析prompt（让AI自动识别学科）
        const analysisPrompt = `你是一位专业的学科辅导老师。请对以下错题进行深度分析。请先根据题目内容自动识别所属学科，然后严格按照以下格式输出，用Markdown格式：

## ❌ 错因诊断
- **错误类型：** ${errorName}
- **涉及学科：** （请根据题目内容自动判断，如：会计基础、高等数学、数据结构等）
- **核心问题：** （请根据题目内容具体分析学生出错的根本原因，200字以内）

## 🎯 涉及考点
- **核心考点：** （具体的知识点名称和内容）
- **关联考点：** （与该题相关的其他知识点）
- **延伸考点：** （该考点的进阶或综合应用）

## 💡 解题思路
（给出正确的解题步骤，分步说明，每步解释为什么要这样做）

## 📝 正确答案
（给出本题的正确答案，如有多个步骤请完整展示）

## ⚠️ 避坑指南
- （指出本题容易出错的地方和常见误区）

---

错题内容：${text || '（用户未输入具体题目，请根据错误类型给出常见错题示例分析）'}`;

        const analysisResult = await callWrongbookAiBot(analysisPrompt);

        // 将AI返回的Markdown转为HTML
        const analysisHtml = wrongbookMarkdownToHtml(analysisResult);
        document.getElementById('analysisContent').innerHTML = analysisHtml;

        // 从AI分析结果中自动识别学科
        const detectedSubject = detectSubjectFromAnalysis(analysisResult, text);
        const subjectName = SUBJECT_NAMES[detectedSubject] || detectedSubject;

        // 保存到错题本
        const briefText = text || `(${subjectName}错题)`;
        saveToWrongBook({ 
            text: briefText, 
            fullAnalysis: analysisResult,
            subject: detectedSubject,
            subjectName: subjectName,
            errorType, 
            date: new Date().toLocaleDateString() 
        });

        // 生成AI变式题（传入识别的学科信息）
        await generateAiVariants(text, detectedSubject, subjectName, analysisResult);
        
    } catch (error) {
        console.error('错题分析失败:', error);
        document.getElementById('analysisContent').innerHTML = `
            <div style="padding:20px;color:#e53e3e;">
                <h4>❌ AI分析服务暂时不可用</h4>
                <p>错误信息：${escapeHtmlStr(error.message)}</p>
                <p style="margin-top:12px;">请检查网络连接后重试，或直接粘贴错题文字内容进行分析。</p>
            </div>
        `;
    }

    _wrongbookIsAnalyzing = false;
}

// ========== AI生成变式练习题 ==========
async function generateAiVariants(originalText, subject, subjectName, analysisResult) {
    const variantContent = document.getElementById('variantContent');
    const variantFeedback = document.getElementById('variantFeedback');
    
    document.getElementById('variantCard').style.display = 'block';
    variantContent.innerHTML = `
        <div class="paper-loading" style="display:flex;align-items:center;gap:12px;padding:20px;">
            <div class="loading-spinner"></div>
            <span>🎯 AI正在生成同考点变式题，请稍候...</span>
        </div>
    `;
    variantFeedback.innerHTML = '';
    document.getElementById('variantCard').scrollIntoView({ behavior: 'smooth' });

    try {
        const variantPrompt = `你是一位专业的学科辅导老师。请根据以下错题分析，生成3道同考点、同难度的变式练习题。

要求：
1. 每道题必须与原题考点相同，但改变题目表述、数据或情景
2. 题目难度与原题保持一致
3. 每道题包含4个选项（A/B/C/D），并标注正确答案
4. 每道题附简短解析（解释为什么选这个答案）

请严格按照以下JSON格式输出（不要输出其他内容）：
\`\`\`json
[
  {
    "question": "题目内容",
    "options": ["A选项", "B选项", "C选项", "D选项"],
    "answer": 0,
    "explanation": "解析说明"
  }
]
\`\`\`

原题分析摘要：${analysisResult ? analysisResult.substring(0, 500) : '学科：' + subjectName}`;

        const variantResult = await callWrongbookAiBot(variantPrompt);
        
        // 从AI返回中提取JSON
        let variants = null;
        const jsonMatch = variantResult.match(/```json\s*([\s\S]*?)\s*```/) || variantResult.match(/\[([\s\S]*)\]/);
        if (jsonMatch) {
            try {
                variants = JSON.parse(jsonMatch[1] || jsonMatch[0]);
            } catch (e) {
                // 尝试提取数组
                try {
                    const arrMatch = variantResult.match(/\[\s*\{[\s\S]*\}\s*\]/);
                    if (arrMatch) variants = JSON.parse(arrMatch[0]);
                } catch (e2) { /* fallback */ }
            }
        }

        if (variants && Array.isArray(variants) && variants.length > 0) {
            _currentVariants = variants;
            renderVariants(variants);
        } else {
            // 降级：从本地题库取
            const localVariants = (variantBank[subject] || variantBank['finance_basic']).slice(0, 3);
            _currentVariants = localVariants;
            renderVariants(localVariants);
        }

    } catch (error) {
        console.error('变式题生成失败:', error);
        // 降级到本地题库
        const localVariants = (variantBank[subject] || variantBank['finance_basic']).slice(0, 3);
        _currentVariants = localVariants;
        renderVariants(localVariants);
    }
}

let _currentVariants = [];

function renderVariants(variants) {
    const variantContent = document.getElementById('variantContent');
    variantContent.innerHTML = variants.map((v, i) => `
        <div class="variant-question" id="vq${i}">
            <span class="vq-num">${i + 1}</span>
            <span class="vq-title">${escapeHtmlStr(v.question || v.q)}</span>
            <div class="vq-options">
                ${(v.options || []).map((opt, j) => `
                    <div class="vq-option" data-idx="${j}" onclick="selectVariant(${i}, ${j}, ${v.answer})">${String.fromCharCode(65 + j)}. ${escapeHtmlStr(opt)}</div>
                `).join('')}
            </div>
            <div class="vq-feedback" id="vqFeedback${i}"></div>
        </div>
    `).join('');
}

// ========== Markdown转HTML ==========
function wrongbookMarkdownToHtml(text) {
    if (!text) return '';
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    // 标题
    html = html.replace(/^### (.+)$/gm, '<h4 style="margin:14px 0 8px;font-size:15px;color:#1a1a2e;">$1</h4>');
    html = html.replace(/^## (.+)$/gm, '<h3 style="margin:16px 0 10px;font-size:17px;color:#1a1a2e;">$1</h3>');

    // 加粗
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    // 列表项
    html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul style="margin:6px 0;padding-left:20px;">$1</ul>');

    // 代码块
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre style="background:#f1f5f9;padding:12px;border-radius:8px;overflow-x:auto;font-size:13px;"><code>$2</code></pre>');

    // 换行
    html = html.replace(/\n\n/g, '</p><p style="margin:6px 0;">');
    html = html.replace(/\n/g, '<br>');

    // 包裹
    html = '<div style="line-height:1.8;font-size:14px;">' + html + '</div>';

    return html;
}

// ========== HTML转义 ==========
function escapeHtmlStr(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// 变式题
const variantBank = {
    accounting: [
        { q: '企业计提固定资产折旧，涉及的会计要素变化是？', options: ['资产减少，费用增加', '资产增加，费用减少', '负债减少，资产增加', '所有者权益增加，资产减少'], answer: 0 },
        { q: '以下属于流动负债的是？', options: ['长期借款', '应付债券', '应付账款', '实收资本'], answer: 2 },
        { q: '收到客户前欠货款存入银行，正确的分录是？', options: ['借：银行存款 贷：应收账款', '借：应收账款 贷：银行存款', '借：银行存款 贷：主营业务收入', '借：库存现金 贷：应收账款'], answer: 0 },
    ],
    finance_basic: [
        { q: '货币在执行价值尺度职能时，货币是？', options: ['现实的货币', '观念的货币', '足值的货币', '纸币'], answer: 1 },
        { q: '以下属于直接融资方式的是？', options: ['银行贷款', '发行股票', '信托贷款', '票据贴现'], answer: 1 },
        { q: '商业银行最基本的职能是？', options: ['信用中介', '支付中介', '信用创造', '金融服务'], answer: 0 },
    ],
    securities: [
        { q: '以下哪项不属于技术分析指标？', options: ['MACD', 'KDJ', '市盈率', 'RSI'], answer: 2 },
        { q: '基金定投最大的优势是？', options: ['保证盈利', '摊平成本', '高收益', '无风险'], answer: 1 },
        { q: 'β系数为1.5的股票意味着？', options: ['比市场波动小', '与市场波动一致', '比市场波动大50%', '无风险'], answer: 2 },
    ],
    // ===== 理工类变式题库 =====
    math_advanced: [
        { q: 'lim(x→0) sin(2x)/x 的值为？', options: ['0', '1', '2', '不存在'], answer: 2 },
        { q: 'f(x)=e^x的导数为？', options: ['e^x', 'xe^(x-1)', '1', '0'], answer: 0 },
        { q: '∫₀¹ 2x dx = ？', options: ['0', '1', '2', '1/2'], answer: 1 },
    ],
    linear_algebra: [
        { q: '若|A|=2，则|2A|=？（A为3阶方阵）', options: ['4', '8', '16', '2'], answer: 2 },
        { q: '矩阵A可逆的充要条件是？', options: ['A为方阵', '|A|≠0', 'A对称', 'A正交'], answer: 1 },
        { q: 'n阶方阵有n个不同的特征值，则A可以？', options: ['对角化', '正交化', '求逆', '转置'], answer: 0 },
    ],
    probability: [
        { q: '掷一枚硬币3次，恰好2次正面的概率是？', options: ['1/8', '3/8', '1/2', '1/4'], answer: 1 },
        { q: '正态分布N(0,1)的方差是？', options: ['0', '1', 'σ', 'μ'], answer: 1 },
        { q: '若X~B(10, 0.5)，则E(X)=？', options: ['2', '5', '10', '2.5'], answer: 1 },
    ],
    physics: [
        { q: '物体质量为2kg，加速度为3m/s²，则合外力为？', options: ['5N', '6N', '1.5N', '0.67N'], answer: 1 },
        { q: '两个点电荷距离加倍，库仑力变为原来的？', options: ['2倍', '1/2', '1/4', '4倍'], answer: 2 },
        { q: '光从空气射入玻璃(n=1.5)，折射角与入射角关系？', options: ['折射角>入射角', '折射角<入射角', '相等', '全反射'], answer: 1 },
    ],
    chemistry: [
        { q: '以下哪个是共价化合物？', options: ['NaCl', 'H₂O', 'KBr', 'CaO'], answer: 1 },
        { q: '反应自发进行的条件是？', options: ['ΔH<0', 'ΔS>0', 'ΔG<0', '温度足够高'], answer: 2 },
        { q: '催化剂的作用是？', options: ['改变平衡常数', '降低活化能', '增加反应热', '改变反应方向'], answer: 1 },
    ],
    data_structure: [
        { q: '在有序数组中二分查找的时间复杂度是？', options: ['O(1)', 'O(n)', 'O(log n)', 'O(n²)'], answer: 2 },
        { q: '以下哪个排序算法时间复杂度为O(n log n)？', options: ['冒泡排序', '选择排序', '归并排序', '插入排序'], answer: 2 },
        { q: '栈的特点是？', options: ['FIFO', 'LIFO', '随机访问', '优先级'], answer: 1 },
    ],
    cs_basics: [
        { q: '冯·诺依曼架构中，程序和数据存放在？', options: ['分别存放', '同一存储器', 'CPU中', '硬盘中'], answer: 1 },
        { q: 'SQL中查询数据用哪个语句？', options: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'], answer: 2 },
        { q: 'HTTP状态码404表示？', options: ['成功', '未授权', '未找到', '服务器错误'], answer: 2 },
    ],
    network: [
        { q: 'TCP建立连接需要几次握手？', options: ['1次', '2次', '3次', '4次'], answer: 2 },
        { q: 'IP协议工作在OSI的哪一层？', options: ['链路层', '网络层', '传输层', '应用层'], answer: 1 },
        { q: '以下哪个是私有IP地址？', options: ['8.8.8.8', '192.168.1.1', '172.16.0.1', 'B和C都是'], answer: 3 },
    ],
    mechanics: [
        { q: '平面一般力系有几个独立平衡方程？', options: ['1个', '2个', '3个', '4个'], answer: 2 },
        { q: '质点系动量守恒的条件是？', options: ['内力为零', '合外力为零', '速度不变', '动能不变'], answer: 1 },
        { q: '圆轴扭转时最大切应力出现在？', options: ['圆心', '表面', '1/2半径', '随机'], answer: 1 },
    ],
    circuit: [
        { q: 'KCL定律基于什么原理？', options: ['能量守恒', '电荷守恒', '动量守恒', '质量守恒'], answer: 1 },
        { q: 'RLC串联谐振时，电路呈？', options: ['感性', '容性', '纯阻性', '不确定'], answer: 2 },
        { q: 'RC电路的时间常数τ=？', options: ['R+C', 'R*C', 'R/C', 'C/R'], answer: 1 },
    ],
    automation: [
        { q: '积分环节的传递函数为？', options: ['K', 'K/s', 'K·s', 'K/(Ts+1)'], answer: 1 },
        { q: '二阶系统阻尼比ζ=0时，系统？', options: ['过阻尼', '临界阻尼', '欠阻尼', '无阻尼等幅振荡'], answer: 3 },
        { q: '根轨迹的起点是？', options: ['闭环极点', '开环极点', '开环零点', '特征根'], answer: 1 },
    ],
    civil_eng: [
        { q: '混凝土强度主要取决于？', options: ['骨料强度', '水灰比', '砂率', '外加剂种类'], answer: 1 },
        { q: '达西定律描述的是？', options: ['土压力', '渗流速度与水头梯度关系', '地基沉降', '土体抗剪'], answer: 1 },
        { q: '适筋梁破坏的特点是？', options: ['突然脆性破坏', '钢筋先屈服，混凝土后压碎', '混凝土先压碎', '无预兆破坏'], answer: 1 },
    ],
    electronics: [
        { q: '理想运放的两个重要特性是？', options: ['虚短和虚断', '放大和滤波', '振荡和比较', '整流和稳压'], answer: 0 },
        { q: 'JK触发器中J=K=1时，Q输出？', options: ['保持', '置0', '置1', '翻转'], answer: 3 },
        { q: 'ARM Cortex-M系列属于什么架构？', options: ['冯·诺依曼', '哈佛架构', '混合架构', '普林斯顿'], answer: 1 },
    ],
    signal: [
        { q: '奈奎斯特采样定理要求采样频率至少为？', options: ['等于最高频率', '2倍最高频率', '1/2最高频率', '4倍最高频率'], answer: 1 },
        { q: '冲激函数δ(t)的面积为？', options: ['0', '1', '∞', '不确定'], answer: 1 },
        { q: '时域信号延时t₀，其频谱？', options: ['幅度改变', '相位改变', '频率改变', '无变化'], answer: 1 },
    ],
    material_mech: [
        { q: '圆轴扭转时，横截面上切应力分布为？', options: ['均匀分布', '线性分布（圆心为0）', '抛物线分布', '集中分布'], answer: 1 },
        { q: '压杆两端固定时长度系数μ=？', options: ['0.5', '0.7', '1', '2'], answer: 0 },
        { q: '塑性材料通常采用哪个强度理论？', options: ['第一强度理论', '第二强度理论', '第三或第四', '任意'], answer: 2 },
    ],
    thermodynamics: [
        { q: '卡诺循环热效率取决于？', options: ['工质种类', '高低温热源温度', '循环方式', '压力大小'], answer: 1 },
        { q: '理想气体绝热过程中pv^k=？', options: ['常数', '变量', '0', '∞'], answer: 0 },
        { q: '制冷系数COP越大说明？', options: ['制冷效果越差', '制冷效率越高', '耗功越大', '与效率无关'], answer: 1 },
    ],
    cad: [
        { q: '三视图中，主视图与俯视图的关系是？', options: ['高平齐', '长对正', '宽相等', '无关系'], answer: 1 },
        { q: '齿轮模数m越大，齿形？', options: ['越小', '越大', '不变', '与齿数有关'], answer: 1 },
        { q: '标注φ50H7中，H7表示？', options: ['直径', '公差等级', '基本偏差代号+公差等级', '粗糙度'], answer: 2 },
    ],
    software_eng: [
        { q: '开闭原则(OCP)的含义是？', options: ['对修改开放', '对扩展开放对修改关闭', '禁止继承', '只能修改不能扩展'], answer: 1 },
        { q: '单元测试通常由谁编写？', options: ['测试团队', '开发人员', '产品经理', '用户'], answer: 1 },
        { q: '敏捷开发强调？', options: ['严格文档', '响应变化', '详细计划', '大规模团队'], answer: 1 },
    ],
    biology: [
        { q: 'DNA复制方式是？', options: ['全保留', '半保留', '分散复制', '随机复制'], answer: 1 },
        { q: '细胞呼吸的主要场所是？', options: ['细胞核', '线粒体', '内质网', '高尔基体'], answer: 1 },
        { q: '杂合子(Aa)自交后代显隐比为？', options: ['1:1', '3:1', '1:2:1', '9:3:3:1'], answer: 1 },
    ],
    stats_advanced: [
        { q: '正态分布N(μ,σ²)的期望为？', options: ['σ', 'σ²', 'μ', '0'], answer: 2 },
        { q: '显著性水平α=0.05的含义？', options: ['5%概率原假设为真', '犯I类错误概率≤5%', '犯II类错误概率≤5%', '置信度5%'], answer: 1 },
        { q: 'R²=0.85表示？', options: ['85%数据在回归线上', '自变量解释85%因变量变异', '相关系数0.85', '准确率85%'], answer: 1 },
    ],
    ai_basics: [
        { q: 'A*算法中h(n)表示？', options: ['实际代价', '启发函数估计值', '总代价', '路径长度'], answer: 1 },
        { q: '产生式系统的规则形式是？', options: ['函数调用', 'IF-THEN', 'SQL语句', '数学公式'], answer: 1 },
        { q: '以下哪个是监督学习任务？', options: ['K-Means聚类', 'PCA降维', '垃圾邮件分类', 'Apriori关联规则'], answer: 2 },
    ],
    machine_learning: [
        { q: 'L1正则化会导致？', options: ['所有权重变小', '部分权重变0', '权重变大', '无影响'], answer: 1 },
        { q: '随机森林属于？', options: ['Bagging', 'Boosting', 'Stacking', 'Blending'], answer: 0 },
        { q: 'Transformer核心机制是？', options: ['卷积', '循环', '自注意力', '全连接'], answer: 2 },
    ],
};

function generateVariants(subject) {
    const variants = variantBank[subject] || variantBank['finance_basic'];
    
    document.getElementById('variantCard').style.display = 'block';
    document.getElementById('variantContent').innerHTML = variants.map((v, i) => `
        <div class="variant-question" id="vq${i}">
            <span class="vq-num">${i + 1}</span>
            <span class="vq-title">${v.q}</span>
            <div class="vq-options">
                ${v.options.map((opt, j) => `
                    <div class="vq-option" data-idx="${j}" onclick="selectVariant(${i}, ${j}, ${v.answer})">${String.fromCharCode(65 + j)}. ${opt}</div>
                `).join('')}
            </div>
            <div class="vq-feedback" id="vqFeedback${i}"></div>
        </div>
    `).join('');

    document.getElementById('variantCard').scrollIntoView({ behavior: 'smooth' });
}

function selectVariant(qIdx, optIdx, answer) {
    const container = document.getElementById(`vq${qIdx}`);
    const options = container.querySelectorAll('.vq-option');
    const feedback = document.getElementById(`vqFeedback${qIdx}`);
    const variant = _currentVariants[qIdx];

    options.forEach(o => { o.classList.remove('selected', 'correct', 'wrong'); o.style.pointerEvents = 'none'; });
    options[optIdx].classList.add('selected');

    if (optIdx === answer) {
        options[optIdx].classList.add('correct');
        feedback.className = 'vq-feedback correct show';
        feedback.textContent = '✅ 正确！你已经掌握了这个考点。';
    } else {
        options[optIdx].classList.add('wrong');
        options[answer].classList.add('correct');
        feedback.className = 'vq-feedback wrong show';
        let msg = `❌ 正确答案是 ${String.fromCharCode(65 + answer)}。`;
        if (variant && variant.explanation) {
            msg += `\n💡 解析：${variant.explanation}`;
        }
        feedback.textContent = msg;
    }
}

// 错题本存储
function saveToWrongBook(item) {
    const book = JSON.parse(localStorage.getItem('wrongBook') || '[]');
    book.unshift({ ...item, id: Date.now(), reviewed: false });
    localStorage.setItem('wrongBook', JSON.stringify(book.slice(0, 50)));
}

function loadWrongBook() {
    const book = JSON.parse(localStorage.getItem('wrongBook') || '[]');
    const container = document.getElementById('wrongListContent');
    document.getElementById('totalWrongCount').textContent = `共 ${book.length} 题`;

    if (!book.length) {
        container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-light)"><p style="font-size:48px;margin-bottom:12px">📭</p><p>还没有错题记录，快去上传吧！</p></div>';
        return;
    }

    container.innerHTML = book.map(item => `
        <div class="wrong-item">
            <div class="wi-status">${item.reviewed ? '✅' : '❌'}</div>
            <div class="wi-info">
                <h4>${item.text}</h4>
                <p>${item.date} · ${SUBJECT_NAMES[item.subject] || item.subjectName || item.subject || '其他'}</p>
                <div class="wi-meta">
                    <span class="tag tag-red">${item.errorType}</span>
                    <span class="tag tag-blue">${SUBJECT_NAMES[item.subject] || item.subjectName || item.subject || '其他'}</span>
                </div>
            </div>
            <div class="wi-actions">
                <button class="btn btn-sm btn-outline" onclick="reviewWrong(${item.id})">复习</button>
            </div>
        </div>
    `).join('');
}

function reviewWrong(id) {
    const book = JSON.parse(localStorage.getItem('wrongBook') || '[]');
    const item = book.find(i => i.id === id);
    if (item) {
        item.reviewed = true;
        localStorage.setItem('wrongBook', JSON.stringify(book));
        loadWrongBook();
        alert('已标记为已复习 ✅');
    }
}

// 薄弱考点分析
function loadWeakPoints() {
    const book = JSON.parse(localStorage.getItem('wrongBook') || '[]');
    const container = document.getElementById('weakPointsContent');

    if (book.length < 2) {
        container.innerHTML = '<div style="text-align:center;padding:40px;color:var(--text-light)"><p style="font-size:48px;margin-bottom:12px">📊</p><p>需要至少2道错题才能分析薄弱考点</p></div>';
        return;
    }

    // 统计
    const subjectCount = {};
    const errorCount = {};
    book.forEach(item => {
        subjectCount[item.subject] = (subjectCount[item.subject] || 0) + 1;
        errorCount[item.errorType] = (errorCount[item.errorType] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(subjectCount));

    const errorNames = { concept: '概念不清', calculation: '计算失误', understanding: '理解偏差', careless: '审题粗心' };

    container.innerHTML = `
        <h4 style="margin-bottom:12px">📊 薄弱学科分布</h4>
        <div class="weak-point-list">
            ${Object.entries(subjectCount).map(([subj, count]) => `
                <div class="weak-point-item">
                    <div class="wp-header">
                        <span class="wp-name">${SUBJECT_NAMES[subj] || subj}</span>
                        <span class="wp-count">${count}题</span>
                    </div>
                    <div class="wp-bar"><div class="wp-bar-fill" style="width:${(count/maxCount*100)}%"></div></div>
                    <p class="wp-suggest">💡 建议：该学科是薄弱环节，每天安排20分钟专项练习。</p>
                </div>
            `).join('')}
        </div>
        <h4 style="margin:20px 0 12px">⚠️ 错误类型分析</h4>
        <div class="weak-point-list">
            ${Object.entries(errorCount).map(([type, count]) => `
                <div class="weak-point-item">
                    <div class="wp-header">
                        <span class="wp-name">${errorNames[type] || type}</span>
                        <span class="wp-count">${count}题</span>
                    </div>
                    <div class="wp-bar"><div class="wp-bar-fill" style="width:${(count/maxCount*100)}%"></div></div>
                </div>
            `).join('')}
        </div>
        <div class="danger-box" style="margin-top:16px">
            <strong>📌 期末复习重点提醒：</strong><br>
            ① 优先复习错题数量最多的学科<br>
            ② 针对高频错误类型做专项突破<br>
            ③ 考前一周集中回顾错题本
        </div>
    `;
}
