// ========== AI全真模拟面试模块 v3 ==========
// LLM智能体全模块集成：人机实时交互 + 深度追问 + 随机压力提问 + AI定制备战材料

document.addEventListener('DOMContentLoaded', () => {
    initResumeUpload();
    initTechResumeUpload();
    initInterviewInputs();
    initTechInterviewInputs();
    initPrepMaterial();
    initAgentStatus();
});

// ========== LLM 智能体状态管理 ==========
function initAgentStatus() {
    window._agentStatus = {
        mode: 'conversational', // conversational / pressure / drill
        pressureLevel: 0,       // 0-100 压力指数
        followUpDepth: 0,       // 当前追问深度
        maxFollowUpDepth: 3,    // 最大追问深度
        topicStack: [],         // 话题栈（用于深层追问回溯）
        knowledgeGaps: [],      // 检测到的知识盲区
        personalityStyle: 'professional', // professional / strict / friendly / challenging
    };
}

// ========== AI 定制备战材料生成 ==========
function initPrepMaterial() {
    // 为财经岗和理工岗添加备战材料入口
    const jobPanel = document.getElementById('panel-job');
    const techPanel = document.getElementById('panel-techjob');

    if (jobPanel) {
        const prepHtml = `
            <div class="card prep-material-card" id="jobPrepCard">
                <div class="card-header">
                    <span class="card-icon">📋</span>
                    <h3>AI 定制面试备战材料</h3>
                    <span class="badge badge-new">LLM驱动</span>
                </div>
                <p style="color:var(--text-secondary);font-size:13px;margin-bottom:14px;">
                    填写目标岗位信息，AI智能体自动生成精细化备战材料包：考试大纲、高频题、专业重点、自我介绍、行业前沿
                </p>
                <div class="form-row">
                    <div class="form-group">
                        <label>🎯 目标岗位</label>
                        <input type="text" class="input" id="jobPrepPosition" placeholder="如：证券分析师、基金经理助理">
                    </div>
                    <div class="form-group">
                        <label>🏢 目标行业</label>
                        <input type="text" class="input" id="jobPrepIndustry" placeholder="如：金融/证券/基金">
                    </div>
                    <div class="form-group">
                        <label>📚 专业方向</label>
                        <input type="text" class="input" id="jobPrepMajor" placeholder="如：金融学/会计学">
                    </div>
                    <div class="form-group">
                        <label>🧭 职业方向</label>
                        <input type="text" class="input" id="jobPrepCareer" placeholder="如：投行/研究/交易/风控">
                    </div>
                </div>
                <button class="btn btn-primary" onclick="generateJobPrepMaterial()">🤖 AI 生成备战材料包</button>
                <div id="jobPrepResult" style="margin-top:16px;"></div>
            </div>
        `;
        jobPanel.insertAdjacentHTML('afterbegin', prepHtml);
    }

    if (techPanel) {
        const techPrepHtml = `
            <div class="card prep-material-card" id="techPrepCard">
                <div class="card-header">
                    <span class="card-icon">📋</span>
                    <h3>AI 定制技术面试备战材料</h3>
                    <span class="badge badge-new">LLM驱动</span>
                </div>
                <p style="color:var(--text-secondary);font-size:13px;margin-bottom:14px;">
                    填写目标岗位信息，AI智能体自动生成技术备战材料包
                </p>
                <div class="form-row">
                    <div class="form-group">
                        <label>🎯 目标岗位</label>
                        <input type="text" class="input" id="techPrepPosition" placeholder="如：后端开发工程师">
                    </div>
                    <div class="form-group">
                        <label>🏢 目标行业</label>
                        <input type="text" class="input" id="techPrepIndustry" placeholder="如：互联网/科技/AI">
                    </div>
                    <div class="form-group">
                        <label>📚 专业方向</label>
                        <input type="text" class="input" id="techPrepMajor" placeholder="如：计算机科学与技术">
                    </div>
                    <div class="form-group">
                        <label>🧭 技术栈</label>
                        <input type="text" class="input" id="techPrepStack" placeholder="如：Java/Python/Go/React">
                    </div>
                </div>
                <button class="btn btn-primary" onclick="generateTechPrepMaterial()">🤖 AI 生成备战材料包</button>
                <div id="techPrepResult" style="margin-top:16px;"></div>
            </div>
        `;
        techPanel.insertAdjacentHTML('afterbegin', techPrepHtml);
    }
}

function generateJobPrepMaterial() {
    const position = document.getElementById('jobPrepPosition').value.trim() || '金融相关岗位';
    const industry = document.getElementById('jobPrepIndustry').value.trim() || '金融行业';
    const major = document.getElementById('jobPrepMajor').value.trim() || '金融/经济';
    const career = document.getElementById('jobPrepCareer').value.trim() || '综合方向';

    const result = document.getElementById('jobPrepResult');
    result.innerHTML = `<div class="agent-thinking">🤖 <strong>LLM智能体正在分析岗位需求，生成定制备战材料...</strong></div>`;

    setTimeout(() => {
        const material = generateFinancePrepContent(position, industry, major, career);
        result.innerHTML = material;
        result.scrollIntoView({ behavior: 'smooth' });
    }, 1200);
}

function generateTechPrepMaterial() {
    const position = document.getElementById('techPrepPosition').value.trim() || '技术研发岗位';
    const industry = document.getElementById('techPrepIndustry').value.trim() || '科技行业';
    const major = document.getElementById('techPrepMajor').value.trim() || '计算机/电子';
    const stack = document.getElementById('techPrepStack').value.trim() || '通用技术栈';

    const result = document.getElementById('techPrepResult');
    result.innerHTML = `<div class="agent-thinking">🤖 <strong>LLM智能体正在分析岗位需求，生成定制备战材料...</strong></div>`;

    setTimeout(() => {
        const material = generateTechPrepContent(position, industry, major, stack);
        result.innerHTML = material;
        result.scrollIntoView({ behavior: 'smooth' });
    }, 1200);
}

function generateFinancePrepContent(position, industry, major, career) {
    // 根据职业方向定制更精准的备战材料
    const careerSpecific = getCareerSpecificContent(career, position);
    const majorSpecific = getMajorSpecificContent(major);

    return `
        <div class="prep-material-package">
            <div class="prep-section">
                <h4>📋 一、${position}面试核心大纲</h4>
                <div class="prep-outline">
                    <p><strong>面试官将从以下5个维度系统评估：</strong></p>
                    <ul>
                        <li><strong>专业知识（权重35%）：</strong>${major}核心理论、行业法规、市场分析框架——建议准备3个以上可深入讨论的专业话题</li>
                        <li><strong>实务能力（权重25%）：</strong>财务报表分析、估值建模、行业研究报告撰写——准备好展示你的实操案例</li>
                        <li><strong>市场敏感度（权重20%）：</strong>宏观经济走势、行业动态、政策解读——每天阅读财经新闻，形成自己的观点</li>
                        <li><strong>综合素质（权重20%）：</strong>沟通表达、逻辑分析、抗压能力、职业道德——通过模拟面试反复练习</li>
                    </ul>
                    ${careerSpecific.examFocus ? `<div style="background:#fff;padding:10px 14px;border-radius:8px;margin-top:8px;"><strong>🎯 ${position}岗位专属考察重点：</strong>${careerSpecific.examFocus}</div>` : ''}
                </div>
            </div>
            <div class="prep-section">
                <h4>🔥 二、高频面试题预测与答题框架</h4>
                <div class="prep-questions">
                    <div class="prep-q-item">
                        <span class="prep-q-num">Q1</span>
                        <div>
                            <strong>请分析当前宏观经济形势对${industry}的影响。</strong>
                            <p>🔍 考察点：宏观经济理解、行业敏感度、逻辑分析能力</p>
                            <p class="prep-answer-hint">💡 答题框架：先概括当前宏观环境（GDP/CPI/利率/汇率）→ 分析对${industry}的传导机制 → 结合具体子行业说明 → 给出前瞻性判断</p>
                        </div>
                    </div>
                    <div class="prep-q-item">
                        <span class="prep-q-num">Q2</span>
                        <div>
                            <strong>如果让你推荐一支股票/基金，你会推荐什么？请说明理由。</strong>
                            <p>🔍 考察点：投资分析框架、估值方法、风险控制意识</p>
                            <p class="prep-answer-hint">💡 答题框架：行业选择逻辑（景气度/政策）→ 公司筛选标准（财务/估值/壁垒）→ 估值分析（PE/PB/DCF）→ 风险提示 → 总结建议</p>
                        </div>
                    </div>
                    <div class="prep-q-item">
                        <span class="prep-q-num">Q3</span>
                        <div>
                            <strong>你对${position}这个岗位的理解是什么？你为什么适合？</strong>
                            <p>🔍 考察点：岗位认知、自我定位、职业规划清晰度</p>
                            <p class="prep-answer-hint">💡 答题框架：岗位核心职责 → 所需能力模型 → 你的匹配优势（学历/经验/技能） → 差异化竞争力 → 职业发展规划</p>
                        </div>
                    </div>
                    <div class="prep-q-item">
                        <span class="prep-q-num">Q4</span>
                        <div>
                            <strong>请举一个你分析并解决复杂问题的例子（STAR法则）。</strong>
                            <p>🔍 考察点：问题解决能力、结构化思维、经验沉淀</p>
                            <p class="prep-answer-hint">💡 答题框架：S-情境（背景+复杂程度）→ T-任务（目标+约束条件）→ A-行动（分析框架+具体步骤）→ R-结果（量化成果+反思总结）</p>
                        </div>
                    </div>
                    <div class="prep-q-item">
                        <span class="prep-q-num">Q5</span>
                        <div>
                            <strong>如果客户的投资组合大幅亏损，你会如何沟通？</strong>
                            <p>🔍 考察点：客户服务意识、情绪管理、专业沟通技巧</p>
                            <p class="prep-answer-hint">💡 答题框架：共情安抚（承认情绪）→ 客观分析（亏损原因）→ 专业建议（调整策略）→ 长期视角（市场周期）→ 后续跟进</p>
                        </div>
                    </div>
                    ${careerSpecific.extraQuestions || ''}
                </div>
            </div>
            <div class="prep-section">
                <h4>📖 三、专业重点知识清单</h4>
                <div class="prep-knowledge">
                    <ul>
                        <li><strong>金融市场基础：</strong>货币市场/资本市场/衍生品市场结构与功能，利率决定理论，汇率制度</li>
                        <li><strong>投资分析：</strong>基本面分析（宏观→行业→公司）、技术分析（K线/均线/MACD）、量化分析框架</li>
                        <li><strong>估值方法：</strong>DCF模型（FCFF/FCFE）、PE/PB/PS/PEG相对估值、DDM模型、EVA估值</li>
                        <li><strong>风险管理：</strong>VaR模型、压力测试、敏感性分析、分散化投资、对冲策略（期货/期权）</li>
                        <li><strong>行业法规：</strong>证券法（信息披露/内幕交易）、基金法、投资者适当性管理、资管新规</li>
                        <li><strong>热点专题：</strong>注册制改革、ESG投资、数字人民币、金融科技（AI/区块链）、碳金融</li>
                        ${majorSpecific.knowledgeItems ? majorSpecific.knowledgeItems : ''}
                    </ul>
                </div>
            </div>
            <div class="prep-section">
                <h4>🗣️ 四、AI定制自我介绍模板（1.5分钟版本）</h4>
                <div class="prep-self-intro">
                    <p style="font-style:italic;color:var(--text-secondary);margin-bottom:8px;">基于你的${position}岗位定制的三段式自我介绍框架（可直接使用）：</p>
                    <div class="prep-intro-template">
                        <p><strong>【开场-我是谁】</strong>各位面试官好，我是[姓名]，${major}专业背景，对${career}方向有深入的研究和实践经验。</p>
                        <p><strong>【中段-我的优势】</strong>在校期间，我系统学习了[核心课程1]、[核心课程2]等专业课程，GPA排名[前X%]，获得了[相关证书/资格]。在[实习公司/项目]的实践中，我参与了[具体项目]，运用[具体技能/工具]，达成了[量化成果]。这段经历让我对${industry}的[具体环节]有了切身的理解。</p>
                        <p><strong>【结尾-为什么选择】</strong>我选择${position}这个岗位，是因为[具体原因——公司文化/业务方向/成长空间]。我长期关注${industry}动态，尤其在[细分领域]有持续积累。我相信我的[核心能力1]、[核心能力2]和[核心能力3]能够帮助团队[创造具体价值]。期待在这个平台上与公司共同成长。谢谢！</p>
                    </div>
                    <p style="margin-top:10px;font-size:12px;color:#059669;">✅ 提示：将[ ]中的内容替换为你的真实信息，控制语速在1.5分钟以内。</p>
                </div>
            </div>
            <div class="prep-section">
                <h4>🎯 五、${position}专属面试策略</h4>
                <div class="prep-frontier">
                    ${careerSpecific.strategy || '<p>请填写具体的职业方向以获取定制策略。</p>'}
                </div>
            </div>
            <div class="prep-section">
                <h4>🌐 六、行业前沿与面试话题素材</h4>
                <div class="prep-frontier">
                    <ul>
                        <li>📊 <strong>趋势1：</strong>金融科技（AI+大数据）重塑传统金融服务模式——准备一个具体应用案例（如智能投顾、AI风控）</li>
                        <li>📊 <strong>趋势2：</strong>ESG投资理念从"可选项"变为"必选项"——了解ESG评级体系、绿色债券、碳交易市场</li>
                        <li>📊 <strong>趋势3：</strong>注册制全面推行，资本市场进入高质量发展新阶段——关注IPO审核节奏、退市制度改革</li>
                        <li>📊 <strong>趋势4：</strong>跨境金融与人民币国际化加速推进——了解跨境支付、离岸人民币市场、资本项目开放</li>
                        <li>📊 <strong>趋势5：</strong>数字资产与区块链技术对金融基础设施的影响——关注央行数字货币、DeFi、NFT的金融应用</li>
                    </ul>
                    <p style="margin-top:10px;font-size:13px;color:var(--text-secondary);">
                        💡 <strong>面试制胜关键：</strong>从以上5个趋势中选择2-3个你真正理解并能深入讨论的话题，准备好自己的独立观点（不是复述新闻），并准备1-2个数据点来支撑你的观点。
                    </p>
                </div>
            </div>
            <div class="prep-section">
                <h4>📝 七、面试Checklist</h4>
                <div class="prep-checklist">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px;">
                        <div>☐ 准备3个STAR法则项目案例</div>
                        <div>☐ 熟记2-3个行业关键数据</div>
                        <div>☐ 准备5个反问面试官的问题</div>
                        <div>☐ 模拟3轮专业面试练习</div>
                        <div>☐ 熟悉公司背景和近期动态</div>
                        <div>☐ 准备1分钟/3分钟两个版本的自我介绍</div>
                        <div>☐ 准备应对压力提问的话术</div>
                        <div>☐ 着装、准时、材料准备齐全</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 根据职业方向获取定制内容
function getCareerSpecificContent(career, position) {
    const map = {
        '投行': {
            examFocus: '财务建模能力、IPO/并购流程、尽职调查、行业研究、高强度工作适应性',
            extraQuestions: `
                <div class="prep-q-item"><span class="prep-q-num">Q6</span><div><strong>请walk me through一个DCF模型。</strong><p>🔍 考察点：财务建模实操能力</p></div></div>
                <div class="prep-q-item"><span class="prep-q-num">Q7</span><div><strong>如果客户公司的财务数据有异常，你会如何核查？</strong><p>🔍 考察点：尽职调查能力、审计思维</p></div></div>`,
            strategy: `<p><strong>投行面试核心策略：</strong></p><ul><li>重点展示你的<strong>财务建模能力</strong>和<strong>商业分析能力</strong></li><li>准备1-2个深度行业研究案例（行业规模、竞争格局、趋势判断）</li><li>展现你对高强度工作的适应性和团队合作精神</li><li>技术性问题要精准回答（如三张报表的勾稽关系、WACC计算）</li><li>行为面试中突出"结果导向"和"抗压能力"</li></ul>`
        },
        '研究': {
            examFocus: '行业研究框架、公司深度分析、估值建模、报告撰写、独立判断能力',
            extraQuestions: `
                <div class="prep-q-item"><span class="prep-q-num">Q6</span><div><strong>请分析一个你深度研究过的行业，包括产业链、竞争格局、发展趋势。</strong><p>🔍 考察点：行业研究深度、结构化思维</p></div></div>
                <div class="prep-q-item"><span class="prep-q-num">Q7</span><div><strong>当你和市场共识出现分歧时，你如何验证自己的判断？</strong><p>🔍 考察点：独立判断、逆向思维</p></div></div>`,
            strategy: `<p><strong>研究岗面试核心策略：</strong></p><ul><li>展示你<strong>独立思考</strong>和<strong>前瞻判断</strong>的能力（不是人云亦云）</li><li>准备1-2个深度研究报告的核心逻辑（可以是你自己的分析）</li><li>展示你的信息获取和分析框架（用什么数据源、怎么交叉验证）</li><li>展现对市场变化的敏感度和快速学习能力</li></ul>`
        },
        '交易': {
            examFocus: '市场微观结构、量化策略、风险管理、心理素质、快速决策',
            extraQuestions: `
                <div class="prep-q-item"><span class="prep-q-num">Q6</span><div><strong>描述你的交易策略框架，包括入场/出场/止损逻辑。</strong><p>🔍 考察点：策略系统性、风控意识</p></div></div>`,
            strategy: `<p><strong>交易岗面试核心策略：</strong></p><ul><li>展示你对<strong>风险管理</strong>的重视（比展示盈利更重要）</li><li>准备一个有逻辑支撑的交易思路（不需要真实操作，但要有框架）</li><li>展现心理素质：如何面对亏损、如何控制情绪</li><li>如果涉及量化，准备Python/统计/时间序列分析的基础</li></ul>`
        },
        '风控': {
            examFocus: '风险评估模型、合规框架、巴塞尔协议、压力测试、量化分析',
            extraQuestions: `
                <div class="prep-q-item"><span class="prep-q-num">Q6</span><div><strong>请解释市场风险、信用风险、操作风险的异同及管理方法。</strong><p>🔍 考察点：风险分类理解</p></div></div>`,
            strategy: `<p><strong>风控岗面试核心策略：</strong></p><ul><li>展示你对<strong>风险量化模型</strong>的理解（VaR/CVaR/压力测试）</li><li>了解监管框架（巴塞尔III/资管新规）</li><li>平衡"风险控制"和"业务支持"的思维方式</li><li>展现严谨细致的工作态度</li></ul>`
        },
    };

    // 模糊匹配
    for (const [key, value] of Object.entries(map)) {
        if (career.includes(key) || position.includes(key)) {
            return value;
        }
    }

    return {
        examFocus: `深入理解${position}岗位的核心业务流程、行业常用分析工具、相关法规政策`,
        strategy: `<p><strong>通用面试策略：</strong></p><ul><li>深入研究目标公司和岗位，了解其业务模式和市场地位</li><li>准备3个以上能展示专业能力的项目/实习案例</li><li>展现对${industry}的热情和长期职业规划</li><li>练习1分钟和3分钟两个版本的自我介绍</li><li>准备3-5个高质量的反问面试官的问题</li></ul>`
    };
}

// 根据专业方向获取定制知识
function getMajorSpecificContent(major) {
    const map = {
        '金融': {
            knowledgeItems: '<li><strong>货币银行学：</strong>货币政策工具（存款准备金/再贴现/公开市场操作）、货币乘数</li><li><strong>公司金融：</strong>资本结构理论（MM定理）、股利政策、并购重组</li>'
        },
        '会计': {
            knowledgeItems: '<li><strong>会计准则：</strong>新收入准则（五步法）、新租赁准则、金融工具准则</li><li><strong>审计：</strong>审计程序、重要性水平、内部控制测试</li>'
        },
        '经济': {
            knowledgeItems: '<li><strong>宏观经济学：</strong>IS-LM模型、AD-AS模型、菲利普斯曲线、索洛增长模型</li><li><strong>微观经济学：</strong>供需弹性、市场结构（完全竞争/垄断/寡头）、博弈论基础</li>'
        },
    };

    for (const [key, value] of Object.entries(map)) {
        if (major.includes(key)) return value;
    }
    return {};
}

function generateTechPrepContent(position, industry, major, stack) {
    const techSpecific = getTechSpecificContent(position, stack);
    const majorSpecific = getTechMajorContent(major);

    return `
        <div class="prep-material-package">
            <div class="prep-section">
                <h4>📋 一、${position}技术面试大纲</h4>
                <div class="prep-outline">
                    <p><strong>技术面试核心考察维度（权重分布）：</strong></p>
                    <ul>
                        <li><strong>计算机基础（25%）：</strong>数据结构与算法、操作系统（进程/线程/内存管理）、计算机网络（TCP/IP/HTTP/HTTPS）、数据库（索引/SQL优化/事务）</li>
                        <li><strong>技术栈深度（35%）：</strong>${stack}相关技术原理、最佳实践、性能优化、源码理解</li>
                        <li><strong>系统设计（20%）：</strong>分布式系统、高并发、微服务架构、设计模式、CAP理论</li>
                        <li><strong>项目经验（15%）：</strong>项目难点攻克、技术选型决策、架构演进、团队协作</li>
                        <li><strong>软技能（5%）：</strong>学习能力、沟通表达、技术热情、工程素养</li>
                    </ul>
                    ${techSpecific.examFocus ? `<div style="background:#fff;padding:10px 14px;border-radius:8px;margin-top:8px;"><strong>🎯 ${position}岗位技术重点：</strong>${techSpecific.examFocus}</div>` : ''}
                </div>
            </div>
            <div class="prep-section">
                <h4>🔥 二、高频技术面试题与答题框架</h4>
                <div class="prep-questions">
                    <div class="prep-q-item">
                        <span class="prep-q-num">Q1</span>
                        <div>
                            <strong>请详细介绍你最熟悉的一个技术方案的架构设计，从需求到实现完整说明。</strong>
                            <p>🔍 考察点：架构思维、技术深度、表达能力、工程化思考</p>
                            <p class="prep-answer-hint">💡 答题框架：业务背景与需求分析 → 架构设计思路（为什么这么设计）→ 核心技术选型对比 → 关键难点与解决方案 → 性能/稳定性指标 → 可改进之处</p>
                        </div>
                    </div>
                    <div class="prep-q-item">
                        <span class="prep-q-num">Q2</span>
                        <div>
                            <strong>如何设计一个支持百万并发的系统？请从接入层到数据层完整阐述。</strong>
                            <p>🔍 考察点：全栈思维、分布式系统设计、性能优化、容量规划</p>
                            <p class="prep-answer-hint">💡 答题框架：流量入口（DNS/CDN/负载均衡）→ 接入层（Nginx/网关/限流熔断）→ 业务层（微服务/无状态/水平扩展）→ 缓存层（多级缓存/热点处理）→ 数据层（分库分表/读写分离/NoSQL）→ 监控告警</p>
                        </div>
                    </div>
                    <div class="prep-q-item">
                        <span class="prep-q-num">Q3</span>
                        <div>
                            <strong>你在项目中遇到过什么技术难题？是如何定位、分析和解决的？</strong>
                            <p>🔍 考察点：问题解决能力、调试技巧、经验总结、工程化思维</p>
                            <p class="prep-answer-hint">💡 答题框架：问题现象描述（量化指标）→ 排查过程（从哪入手、用了什么工具）→ 根因分析（不是表面原因）→ 解决方案（为什么选这个方案）→ 效果验证 → 沉淀总结</p>
                        </div>
                    </div>
                    <div class="prep-q-item">
                        <span class="prep-q-num">Q4</span>
                        <div>
                            <strong>${stack.split('/')[0] || stack}语言/框架的核心特性是什么？和其他技术相比有什么优势和局限？</strong>
                            <p>🔍 考察点：技术理解深度、技术视野、选型判断力</p>
                            <p class="prep-answer-hint">💡 答题框架：核心设计理念 → 关键特性（3-5个） → 适用场景 → 与竞品对比（客观，不贬低） → 局限性/不适用场景 → 你的实践体会</p>
                        </div>
                    </div>
                    <div class="prep-q-item">
                        <span class="prep-q-num">Q5</span>
                        <div>
                            <strong>如果让你带领一个小团队从零搭建一个项目，你会如何规划（技术选型/架构/流程/排期）？</strong>
                            <p>🔍 考察点：项目管理、技术选型决策、团队协作、全局视野</p>
                            <p class="prep-answer-hint">💡 答题框架：需求理解与范围确定 → 技术调研与选型（对比分析）→ 架构设计（MVP vs 完整版）→ 任务拆解与排期 → 开发规范（代码规范/CR/CI/CD）→ 风险管理</p>
                        </div>
                    </div>
                    ${techSpecific.extraQuestions || ''}
                </div>
            </div>
            <div class="prep-section">
                <h4>📖 三、核心技术知识体系（必考清单）</h4>
                <div class="prep-knowledge">
                    <ul>
                        <li><strong>数据结构：</strong>数组/链表/栈/队列/哈希表/树（BST/AVL/B+/Trie）/图，各结构的适用场景和时间空间复杂度分析</li>
                        <li><strong>算法：</strong>排序（快排/归并/堆排）、搜索（二分/BFS/DFS）、动态规划、贪心、分治、回溯、滑动窗口、双指针</li>
                        <li><strong>操作系统：</strong>进程与线程区别、死锁四条件与预防、虚拟内存/分页/分段、文件系统、IO多路复用（select/poll/epoll）</li>
                        <li><strong>计算机网络：</strong>TCP三次握手/四次挥手、TCP拥塞控制、HTTP/1.1 vs HTTP/2 vs HTTP/3、HTTPS握手过程、DNS解析流程</li>
                        <li><strong>数据库：</strong>索引原理（B+树/Hash）、SQL优化（Explain分析）、事务隔离级别（MVCC）、分库分表策略、Redis数据结构与使用场景</li>
                        <li><strong>设计模式：</strong>单例/工厂/观察者/策略/代理/装饰器/适配器——每种的适用场景和代码实现</li>
                        ${majorSpecific.knowledgeItems || ''}
                    </ul>
                </div>
            </div>
            <div class="prep-section">
                <h4>🗣️ 四、技术岗自我介绍模板（1.5分钟版本）</h4>
                <div class="prep-self-intro">
                    <p style="font-style:italic;color:var(--text-secondary);margin-bottom:8px;">基于你的${position}岗位定制的三段式自我介绍（可直接使用）：</p>
                    <div class="prep-intro-template">
                        <p><strong>【开场-我是谁】</strong>面试官好，我是[姓名]，${major}专业，专注于${stack}技术方向，有[X]段相关项目/实习经历。</p>
                        <p><strong>【中段-技术能力】</strong>我熟练掌握[核心技术1]、[核心技术2]和[核心技术3]。在[项目名]中，我使用${stack}完成了[具体功能模块]，解决了[具体技术难点]，使[性能指标]提升了[X]%。在[另一个项目]中，我主导了[技术决策/架构优化]，最终[量化成果]。这些经历让我对[领域]有了深入的理解和实践。</p>
                        <p><strong>【结尾-为什么选择】</strong>我选择${position}是因为[个人兴趣+公司吸引点]。我持续关注[技术领域]的前沿发展，在GitHub/技术博客上[学习/贡献]。我相信我的技术能力和学习热情能为团队带来价值。谢谢！</p>
                    </div>
                    <p style="margin-top:10px;font-size:12px;color:#059669;">✅ 提示：将[ ]中的内容替换为真实信息。技术自我介绍重在展示"你做了什么"而不是"你学了什么"。</p>
                </div>
            </div>
            <div class="prep-section">
                <h4>🎯 五、${position}面试专项策略</h4>
                <div class="prep-frontier">
                    ${techSpecific.strategy || '<p>请填写具体的岗位和技术栈以获取定制策略。</p>'}
                </div>
            </div>
            <div class="prep-section">
                <h4>🌐 六、技术前沿与面试话题</h4>
                <div class="prep-frontier">
                    <ul>
                        <li>🔧 <strong>趋势1：</strong>AI辅助编程（Copilot/Cursor/Claude）正在改变软件开发范式——思考对工程师角色的影响</li>
                        <li>🔧 <strong>趋势2：</strong>云原生与Serverless架构成为主流——理解Kubernetes/容器化/服务网格</li>
                        <li>🔧 <strong>趋势3：</strong>大语言模型(LLM)在业务场景中的落地应用——RAG/Agent/微调的实际场景</li>
                        <li>🔧 <strong>趋势4：</strong>Rust语言在系统编程/WebAssembly领域快速崛起——了解其内存安全机制</li>
                        <li>🔧 <strong>趋势5：</strong>边缘计算与IoT技术的融合发展——了解端侧推理/实时数据处理</li>
                    </ul>
                    <p style="margin-top:10px;font-size:13px;color:var(--text-secondary);">
                        💡 <strong>面试建议：</strong>选择2-3个你能深入讨论的技术趋势，准备好自己的观点和实践经验。不要只复述趋势，要能说出"这个趋势如何影响我的工作"。
                    </p>
                </div>
            </div>
            <div class="prep-section">
                <h4>📝 七、技术面试Checklist</h4>
                <div class="prep-checklist">
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:13px;">
                        <div>☐ 刷完LeetCode Hot 100</div>
                        <div>☐ 准备3个深度项目介绍（STAR法则）</div>
                        <div>☐ 复习操作系统/网络/数据库核心知识点</div>
                        <div>☐ 准备系统设计题（秒杀/短链/消息队列）</div>
                        <div>☐ 熟悉目标公司的技术栈和业务</div>
                        <div>☐ 准备5个反问面试官的技术问题</div>
                        <div>☐ 模拟3轮技术面（白板/线上编程）</div>
                        <div>☐ 准备英文技术术语和项目介绍</div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 技术岗位定制内容
function getTechSpecificContent(position, stack) {
    const isBackend = /后端|后台|服务端|Java|Go|Python|C\+\+|Rust/i.test(position + stack);
    const isFrontend = /前端|Web|React|Vue|Angular|H5|小程序/i.test(position + stack);
    const isAI = /算法|AI|机器学习|深度学习|NLP|CV|数据科学/i.test(position + stack);
    const isMobile = /移动|iOS|Android|Flutter|React Native/i.test(position + stack);
    const isDevOps = /运维|DevOps|SRE|云原生|K8s/i.test(position + stack);
    const isEmbedded = /嵌入式|IoT|单片机|ARM|FPGA/i.test(position + stack);

    if (isBackend) {
        return {
            examFocus: '分布式系统设计、高并发处理、数据库优化、微服务架构、消息队列（Kafka/RabbitMQ）、缓存策略',
            extraQuestions: `
                <div class="prep-q-item"><span class="prep-q-num">Q6</span><div><strong>请解释分布式事务的几种实现方案及其优缺点。</strong><p>🔍 考察点：分布式系统理解深度</p></div></div>
                <div class="prep-q-item"><span class="prep-q-num">Q7</span><div><strong>MySQL一条查询SQL的执行过程是怎样的？如何进行慢查询优化？</strong><p>🔍 考察点：数据库底层原理、性能优化能力</p></div></div>`,
            strategy: `<ul><li>重点准备<strong>高并发系统设计</strong>和<strong>数据库优化</strong>话题</li><li>深入理解你所使用语言的并发模型（Goroutine/Java线程池/Python协程）</li><li>准备一个微服务拆分/演进的实际案例</li><li>了解至少一个中间件的底层原理（Redis/MySQL/Kafka）</li></ul>`
        };
    }

    if (isFrontend) {
        return {
            examFocus: '浏览器渲染原理、JavaScript核心机制（闭包/原型链/事件循环）、框架原理（虚拟DOM/响应式）、性能优化（首屏/打包/缓存）、工程化（Webpack/Vite）',
            extraQuestions: `
                <div class="prep-q-item"><span class="prep-q-num">Q6</span><div><strong>请解释浏览器从输入URL到页面渲染的完整过程。</strong><p>🔍 考察点：浏览器原理深度理解</p></div></div>
                <div class="prep-q-item"><span class="prep-q-num">Q7</span><div><strong>如何优化一个首屏加载时间超过5秒的SPA应用？</strong><p>🔍 考察点：性能优化实战能力</p></div></div>`,
            strategy: `<ul><li>深入理解<strong>浏览器工作原理</strong>（渲染流程/重排重绘/合成层）</li><li>准备好框架原理的回答（不只是会用，要能说出Why）</li><li>准备1-2个性能优化的实际案例（有前后对比数据）</li><li>展示你的<strong>工程化思维</strong>（组件设计/状态管理/代码规范）</li></ul>`
        };
    }

    if (isAI) {
        return {
            examFocus: '机器学习基础（偏差-方差/Bias-Variance）、深度学习（CNN/RNN/Transformer）、模型训练与调优、特征工程、模型部署（ONNX/TensorRT）、最新论文跟踪',
            extraQuestions: `
                <div class="prep-q-item"><span class="prep-q-num">Q6</span><div><strong>请解释Transformer的Self-Attention机制，以及它为什么比RNN更有效。</strong><p>🔍 考察点：核心模型原理理解</p></div></div>
                <div class="prep-q-item"><span class="prep-q-num">Q7</span><div><strong>当模型在训练集上表现好但测试集表现差时，你会如何排查和解决？</strong><p>🔍 考察点：模型调优实战能力</p></div></div>`,
            strategy: `<ul><li>准备<strong>一个完整ML项目</strong>的讲述（数据→特征→模型→评估→部署）</li><li>跟踪最新论文进展（GPT/LLaMA/扩散模型等）</li><li>准备好模型部署和工程化的经验（不只是训练模型）</li><li>理解业务指标和模型指标的差异</li></ul>`
        };
    }

    if (isMobile) {
        return {
            examFocus: '移动端架构（MVC/MVVM）、性能优化（启动/内存/卡顿）、网络优化、UI渲染机制、跨平台方案对比',
            strategy: `<ul><li>准备<strong>性能优化</strong>的完整思路和案例</li><li>了解移动端特有的技术挑战（电量/网络/碎片化）</li><li>熟悉至少一个跨平台方案的优劣</li></ul>`
        };
    }

    if (isDevOps) {
        return {
            examFocus: 'CI/CD流水线设计、容器化（Docker/K8s）、监控告警体系、自动化运维、云服务（AWS/阿里云）',
            strategy: `<ul><li>准备一个<strong>完整CI/CD流水线</strong>的设计方案</li><li>了解K8s核心组件和调度原理</li><li>准备故障排查的实战案例</li></ul>`
        };
    }

    if (isEmbedded) {
        return {
            examFocus: 'MCU架构、RTOS原理、通信协议（I2C/SPI/UART/CAN）、中断处理、低功耗设计',
            strategy: `<ul><li>准备<strong>一个完整的嵌入式项目</strong>（硬件选型→软件架构→调试过程）</li><li>深入理解中断和DMA的工作原理</li><li>了解至少一种RTOS的内核机制</li></ul>`
        };
    }

    return {
        examFocus: `深入掌握${stack}技术栈的核心原理和最佳实践，了解相关领域的前沿技术动态`,
        strategy: `<ul><li>深入研究目标公司的技术栈和业务场景</li><li>准备3个以上能展示技术深度的项目案例</li><li>练习白板编程和系统设计题</li><li>准备5个高质量的反问面试官的技术问题</li></ul>`
    };
}

// 技术专业定制知识
function getTechMajorContent(major) {
    const map = {
        '计算机': {
            knowledgeItems: '<li><strong>编译原理：</strong>词法分析/语法分析/中间代码生成/代码优化</li><li><strong>软件工程：</strong>敏捷开发/Scrum/CI/CD/代码审查/技术文档</li>'
        },
        '软件': {
            knowledgeItems: '<li><strong>软件架构：</strong>分层架构/微服务/事件驱动/CQRS/DDD领域驱动设计</li><li><strong>测试：</strong>单元测试/集成测试/E2E测试/TDD</li>'
        },
        '电子': {
            knowledgeItems: '<li><strong>数字电路：</strong>组合逻辑/时序逻辑/状态机/FPGA开发</li><li><strong>模拟电路：</strong>运放电路/滤波器设计/电源管理</li>'
        },
        '自动化': {
            knowledgeItems: '<li><strong>控制理论：</strong>PID控制/根轨迹/频域分析/状态空间</li><li><strong>信号处理：</strong>傅里叶变换/采样定理/数字滤波器</li>'
        },
        '机械': {
            knowledgeItems: '<li><strong>机械设计：</strong>公差分析/疲劳强度/有限元分析</li><li><strong>制造工艺：</strong>数控加工/3D打印/精密装配</li>'
        },
        '土木': {
            knowledgeItems: '<li><strong>结构力学：</strong>弯矩图/剪力图/超静定结构分析</li><li><strong>建筑材料：</strong>混凝土配合比/钢材性能/新型材料</li>'
        },
    };

    for (const [key, value] of Object.entries(map)) {
        if (major.includes(key)) return value;
    }
    return {};
}

// ========== 升级版智能追问引擎（LLM级别模拟） ==========

function generateLLMFollowUp(context, analysis, questionText, questionType) {
    const agent = window._agentStatus;
    const history = context.history;

    // 根据追问深度和上下文智能生成追问
    if (agent.followUpDepth === 1) {
        // 第一层追问：扩展/深化/关联
        const expandPrompts = [
            `你提到了一个关键点，能否展开讲讲具体的实施细节？`,
            `这个回答很有见地，但我还想了解：如果条件发生变化（比如市场环境恶化），你的方案如何调整？`,
            `你刚才提到了一些概念，能否深入解释一下背后的底层原理？`,
            `很好，但我注意到你可能跳过了某些方面——能补充说明一下吗？`,
            `这个回答不错。但我好奇：在实际工作中，你的这个思路具体如何落地？`,
        ];
        return expandPrompts[Math.floor(Math.random() * expandPrompts.length)];
    }

    if (agent.followUpDepth === 2) {
        // 第二层追问：挑战/质疑/反例
        agent.pressureLevel += 20;
        const challengePrompts = [
            `我不同意你的观点。如果实际情况恰好相反，你怎么应对？`,
            `你刚才的说法在理论上成立，但在实际中我见过太多反例。请用一个真实案例来支撑你的观点。`,
            `假设你的方案被上级否决了，你会怎么做？请具体说明你的应对策略。`,
            `你对自己的这个回答打多少分？为什么？哪些地方可以改进？`,
            `你的回答让我感觉有些泛泛而谈。请用一个你亲身经历的具体例子来重新回答。`,
        ];
        return challengePrompts[Math.floor(Math.random() * challengePrompts.length)];
    }

    if (agent.followUpDepth >= 3) {
        // 第三层追问：极限施压/即兴提问/换位思考
        agent.pressureLevel = Math.min(100, agent.pressureLevel + 30);
        const pressurePrompts = [
            `说实话，我觉得你的回答还没有触及核心。再给你一次机会，请用一句话概括你的核心观点。`,
            `如果现在让你当场给CEO做3分钟汇报，你会怎么讲？`,
            `你确定吗？我这里有相反的数据。你如何证明你的观点是正确的？`,
            `好了，这个问题到此为止。但我注意到你似乎在回避某些方面——这是否说明你在这方面准备不足？`,
            `现在请你换位思考：如果你是面试官，听了自己刚才的回答，你会怎么评价？`,
        ];
        return pressurePrompts[Math.floor(Math.random() * pressurePrompts.length)];
    }

    return '';
}

// 根据分析结果智能选择追问方向
function getSmartFollowUpDirection(analysis, context) {
    const sem = analysis.deepSemantics;
    if (!sem) return Math.random() > 0.5 ? 'deepen' : 'challenge';

    if (sem.hesitation && analysis.wordCount < 20) return 'expand';
    if (sem.depth && analysis.quality === 'excellent') return 'challenge';
    if (!sem.structure && analysis.wordCount > 30) return 'redirect';
    if (sem.defensive) return 'challenge';
    if (sem.confidence && sem.structure) return 'deepen';

    return Math.random() > 0.5 ? 'deepen' : 'challenge';
}

// 即兴压力提问（面试中途随机插入）
function generatePressureAttack(context) {
    const attacks = [
        `打断一下——我注意到你之前的回答中有一个明显的逻辑矛盾，你自己意识到了吗？`,
        `恕我直言，你的回答让我感觉你只是在背答案。你能用你自己的话重新组织一下吗？`,
        `这个问题我们换个角度：如果你是面试官，你会录用像你这样的候选人吗？为什么？`,
        `说实话，和你同批的候选人中，有人比你更有经验。你觉得你的独特优势在哪里？`,
        `你在回答中多次使用"我觉得""我认为"，但我更想听到数据和分析，而不是感觉。`,
        `我打断一下——你刚才说的和之前第2题的回答似乎有矛盾，你注意到了吗？`,
        `坦率地说，我还没被说服。请用30秒重新组织你的核心论点。`,
    ];
    return attacks[Math.floor(Math.random() * attacks.length)];
}

// ========== 智能教学系统 ==========

// 教学后推进到下一题
function proceedAfterTeaching(analysis) {
    interviewState.currentQ++;
    interviewState.followUp = { active: false, depth: 0, originalQIdx: -1, direction: '' };
    
    if (interviewState.currentQ < interviewState.questions.length) {
        const nextQ = applyDifficultyVariant(
            interviewState.questions[interviewState.currentQ], 
            (analysis && analysis.nextDifficulty) || 'normal'
        );
        setTimeout(() => {
            addMessage('interviewMessages', 'bot',
                `🤖 <strong>面试官：</strong>接下来我们看下一题。<br><br>${nextQ}`, true);
            document.getElementById('questionCounter').textContent = 
                `第 ${interviewState.currentQ + 1}/${interviewState.questions.length} 题`;
            document.getElementById('interviewMessages').scrollTop = 
                document.getElementById('interviewMessages').scrollHeight;
        }, 600);
    } else {
        setTimeout(() => {
            addMessage('interviewMessages', 'bot',
                '🤖 <strong>面试官：</strong>好的，本轮面试到此结束。请查看评分报告。', true);
            interviewState.active = false;
            document.getElementById('interviewMessages').scrollTop = 
                document.getElementById('interviewMessages').scrollHeight;
            setTimeout(() => showEnhancedScoreReport(interviewState, jobScoreDims, 'scoreCard', 'scoreContent'), 1000);
        }, 400);
    }
}

// 根据回答质量给出鼓励
function getEncouragement(quality) {
    const encouragements = {
        'excellent': '非常棒！你的理解很到位！👍',
        'good': '不错哦，进步很大！',
        'medium': '有进步了！继续加油！💪',
        'low': '比之前好多了，慢慢来！',
    };
    return encouragements[quality] || '有进步！';
}

// 生成结构化教学讲解
function generateTeachingResponse(question, questionType, level) {
    // 提取题目关键词
    const keywords = extractQuestionKeywords(question);
    const topicName = keywords.topic || '这个知识点';
    
    // 根据教学级别选择讲解深度
    const isFull = level === 'full';
    const isGuided = level === 'guided';
    
    let parts = [];
    
    // 1. 核心概念解释
    if (isFull || isGuided) {
        parts.push(`<strong>📌 核心概念：</strong>${generateConceptExplain(keywords)}`);
    }
    
    // 2. 回答框架/思路
    if (isFull) {
        parts.push(`<strong>📐 回答框架：</strong>${generateAnswerFramework(question, keywords, questionType)}`);
    } else {
        parts.push(`<strong>💡 答题思路提示：</strong>${generateThinkingGuide(question, keywords, questionType)}`);
    }
    
    // 3. 关键词/要点
    if (isFull) {
        parts.push(`<strong>🔑 关键要点：</strong>${generateKeyPoints(keywords, questionType)}`);
    }
    
    // 4. 示例开头（帮助启动）
    parts.push(`<strong>🚀 你可以这样开头：</strong>${generateOpeningSentence(question, keywords, questionType)}`);
    
    return parts.join('<br><br>');
}

// 提取题目关键词
function extractQuestionKeywords(question) {
    const result = { topic: '', domain: '', keywords: [] };
    
    // 分析题目的领域
    const domains = {
        '领导力': ['领导', '管理', '团队', '带领', '下属'],
        '团队协作': ['协作', '合作', '沟通', '配合', '跨部门'],
        '问题解决': ['解决', '处理', '应对', '困难', '挑战', '冲突'],
        '技术能力': ['技术', '编程', '开发', '算法', '架构', '代码', '框架'],
        '项目经验': ['项目', '经验', '经历', '做过', '参加', '负责'],
        '职业规划': ['规划', '发展', '目标', '未来', '职业', '方向'],
        '自我认知': ['优点', '缺点', '优势', '不足', '性格', '特长'],
        '产品思维': ['产品', '用户', '需求', '体验', '设计', '方案'],
        '数据分析': ['数据', '分析', '指标', '统计', '量化'],
        '通用': [],
    };
    
    for (const [domain, patterns] of Object.entries(domains)) {
        for (const p of patterns) {
            if (question.includes(p)) {
                result.domain = domain;
                result.keywords.push(p);
            }
        }
    }
    
    if (!result.domain) result.domain = '通用';
    
    // 提取核心主题词
    const topicPatterns = [
        /什么是(.{2,8})/,
        /如何(理解|看|做|处理|解决)(.{2,10})/,
        /请.*介绍(.{2,10})/,
        /(谈谈|说说|聊聊)(.{2,10})/,
    ];
    for (const pattern of topicPatterns) {
        const match = question.match(pattern);
        if (match) {
            result.topic = match[1] + (match[2] || '');
            break;
        }
    }
    if (!result.topic) {
        result.topic = question.replace(/[?？，。！!]/g, '').slice(0, 20);
    }
    
    return result;
}

// 概念解释
function generateConceptExplain(keywords) {
    const explains = {
        '领导力': '领导力不仅仅是"管人"，而是一种影响力——通过愿景引领、资源协调和团队激励来达成目标。核心能力包括：决策力、沟通力、授权能力和情商。',
        '团队协作': '团队协作的核心是"1+1>2"。关键在于角色互补、有效沟通、冲突管理和共同目标。常见模型有Tuckman的"形成-震荡-规范-执行"四阶段。',
        '问题解决': '问题解决的经典框架：1)定义问题 2)分析根因(如5Why分析) 3)提出备选方案 4)评估并选择 5)执行与复盘。面试中要强调你的分析过程和结果导向。',
        '沟通能力': '高效沟通=清晰表达+积极倾听+同理心+及时反馈。面试中要展示你能根据不同对象调整沟通方式。',
        '项目管理': '项目管理的铁三角：范围、时间、成本。核心流程：启动→规划→执行→监控→收尾。面试时结合具体项目经历来说明。',
        '冲突处理': '冲突处理的黄金法则：1)先倾听理解 2)找共同利益点 3)提出共赢方案 4)达成共识并跟进。避免情绪化，聚焦问题本身。',
        '时间管理': '时间管理的核心不是做更多事，而是做正确的事。方法：四象限法则(重要/紧急)、番茄工作法、GTD系统。',
        '抗压能力': '抗压能力=心理韧性+应对策略。分为：识别压力源→调整心态→制定计划→寻求支持→反思成长五个步骤。',
        '创新思维': '创新=发现需求+跨界联想+快速验证。常见方法：设计思维(Design Thinking)、头脑风暴、逆向思维、SCAMPER法。',
        '数据分析': '数据分析的基本流程：提出问题→数据收集→数据清洗→探索分析→建模→结论呈现。核心工具：SQL、Excel、Python/R。',
    };
    
    for (const [key, val] of Object.entries(explains)) {
        if (keywords.keywords.some(k => key.includes(k) || k.includes(key))) {
            return val;
        }
    }
    return `${keywords.topic}是面试中常见的考点。建议从"定义→原因→影响→解决方案"的逻辑来组织你的回答，这样会显得条理清晰，有深度。`;
}

// 回答框架
function generateAnswerFramework(question, keywords, questionType) {
    const genericFramework = `建议采用 <strong>STAR法则</strong>（情境Situation→任务Task→行动Action→结果Result）来组织回答：<br>
    ① <strong>S-情境：</strong>简要描述一个相关的经历或背景<br>
    ② <strong>T-任务：</strong>你面临的具体目标或挑战是什么<br>
    ③ <strong>A-行动：</strong>你具体做了什么（重点！）<br>
    ④ <strong>R-结果：</strong>取得了什么成果（最好有数据）<br><br>
    另外也可以用 <strong>黄金圈法则</strong>：What（是什么）→ Why（为什么重要）→ How（怎么做）`;
    
    if (question.includes('最大') || question.includes('最重要') || question.includes('最成功')) {
        return `对于"最…"类问题，用 <strong>STAR法则</strong> 来回答特别有效：<br>
        ① 先说一个最突出的经历（情境+任务）<br>
        ② 你当时的行动和思考过程<br>
        ③ 最终的量化成果和你的反思`;
    }
    if (question.includes('冲突') || question.includes('困难') || question.includes('失败')) {
        return `回答"挑战/失败"类问题的黄金结构：<br>
        ① 客观描述具体事件（不责怪他人）<br>
        ② 你的应对方式（展现分析和行动力）<br>
        ③ 从中吸取的教训和成长<br>
        ④ 之后类似情况的改进<br>
        ⚠️ 记住：面试官不是想听你多惨，而是看你如何面对逆境。`;
    }
    if (question.includes('自我介绍')) {
        return `好的自我介绍结构：<br>
        ① <strong>我是谁</strong>（1句话）—— 当前身份+核心标签<br>
        ② <strong>我能做什么</strong>（2-3句）—— 核心能力+亮点经历<br>
        ③ <strong>我为什么来</strong>（1句）—— 与岗位/公司的匹配点<br>
        ④ <strong>收尾</strong> —— 表达热情和期待<br>
        控制在1-2分钟内，突出与岗位最相关的2-3个点。`;
    }
    if (question.includes('优缺点') || question.includes('缺点')) {
        return `回答"缺点"问题的高级策略：<br>
        ① 选一个真实但并非致命的缺点<br>
        ② <strong>不要只说缺点本身</strong>，重点是你意识到并已经在改进<br>
        ③ 用具体例子说明你的改进措施<br>
        ④ 展示这个"缺点"的另一面也许是优势（如"太过注重细节"→追求品质）<br>
        ⑤ 结构：我意识到...→我做了...→现在的状态...→反思`;
    }
    
    return genericFramework;
}

// 思维引导（基础级别）
function generateThinkingGuide(question, keywords, questionType) {
    const guides = [
        `先想一想：这个问题的核心是什么？面试官想通过这个问题了解你的什么能力？`,
        `试着从 <strong>"是什么→为什么→怎么办"</strong> 三个角度来组织你的回答。`,
        `可以回想一下：<strong>你之前有没有遇到过类似的情境？</strong>把它作为例子来说会更有说服力。`,
        `不需要把答案准备得很完美，先说说<strong>你的第一反应和基本理解</strong>就好。`,
    ];
    
    if (keywords.domain === '团队协作') {
        guides.push(`想想你在团队中扮演过什么角色？当时团队的目标是什么？你做了什么具体的贡献？`);
    }
    if (keywords.domain === '技术能力') {
        guides.push(`可以从这三个方面来组织：你用过什么技术？解决了什么问题？最终效果如何？`);
    }
    
    return guides[Math.floor(Math.random() * guides.length)];
}

// 关键要点
function generateKeyPoints(keywords, questionType) {
    const genericPoints = [
        '观点要明确，不要模棱两可',
        '用具体案例支撑你的观点',
        '展示你的思考过程，不只是结果',
        '体现你对问题的多维度理解',
        '适当引用数据或事实增强说服力',
    ];
    
    return '• ' + genericPoints.slice(0, 3).join('<br>• ');
}

// 开头句式
function generateOpeningSentence(question, keywords, questionType) {
    const openings = [
        `"关于这个问题，我认为……"（然后说出你的核心观点）`,
        `"根据我的理解，这个问题可以从以下几个方面来看……"`,
        `"我之前遇到过类似的情况，当时我是这样处理的……"`,
        `"让我先梳理一下这个问题的核心，然后分几个层面来回答……"`,
    ];
    
    if (question.includes('自我介绍')) {
        return `"您好，我是XX，目前在……从事……工作，主要负责……过去几年我主要做了……" ——按照这个模板，填入你自己的信息。`;
    }
    if (question.includes('你认为') || question.includes('怎么看')) {
        return `"我认为……（先亮出观点），因为……（给出理由），比如……（举例说明）"`;
    }
    
    return openings[Math.floor(Math.random() * openings.length)];
}

// 渐进式提示
function generateHintResponse(question, questionType, subType) {
    const keywords = extractQuestionKeywords(question);
    
    if (subType === 'retry') {
        // 第二次/第三次提示——更具体
        const hints = [
            `试试用 <strong>STAR法则</strong>（情境→任务→行动→结果）来组织你的回答。不用追求完美，先说出第一步就好。`,
            `想一想这个话题里你<strong>最熟悉的一个方面</strong>，先从那开始说起，然后慢慢展开。`,
            `换个角度想：如果有一个完全不懂的人，你要用<strong>最简单的语言</strong>给他解释这个，你会怎么说？`,
        ];
        return hints[Math.floor(Math.random() * hints.length)];
    }
    
    // 首次回答
    const hints = [
        `建议从"是什么、为什么、怎么做"三个角度来组织思路。`,
        `可以先想一想这个问题在问什么，再结合你自己的经历来说。`,
        `不一定要说很多——说出关键点，再用一个例子支撑就好。`,
    ];
    return hints[Math.floor(Math.random() * hints.length)];
}

// 生成参考答案（多次不会后提供）
function generateSampleAnswer(question, questionType) {
    const keywords = extractQuestionKeywords(question);
    
    if (question.includes('自我介绍')) {
        return `"面试官您好，我是XXX，目前是XX大学XX专业的应届毕业生。在校期间我曾在XX公司实习过X个月，主要负责XX工作，做出了XX成果。我还参与了XX项目，锻炼了XX能力。我对应聘的这个岗位非常感兴趣，因为XX，我相信我的XX能力能为团队带来价值。"`;
    }
    if (question.includes('缺点') || question.includes('不足')) {
        return `"我认为自己需要提升的是在多人场合下即兴表达的能力。以前开会时，我倾向于先听完所有人的意见再做总结发言。后来我意识到在快节奏的环境下需要更主动地表达观点，于是我开始刻意练习：每次会议前先准备3个核心观点，主动在前半段发言。经过半年，我现在能更自信地在会上即时分享了。"`;
    }
    if (question.includes('冲突') || question.includes('困难')) {
        return `"在一次跨部门项目中，我们和市场部在需求优先级上产生了分歧。我的做法是：第一步，主动约对方负责人单独沟通，了解他们的真实考量；第二步，用数据说话——我整理了一份各需求对KPI的预估影响报告；第三步，共同协商出一个折中方案，将最关键的需求优先排期，其余分阶段推进。最终项目按期交付，两个部门的关系反而更紧密了。"`;
    }
    if (keywords.domain === '领导力') {
        return `"我之前带领一个5人团队完成XX项目。当时面临的挑战是时间紧迫且资源有限。我先组织了一次头脑风暴明确方向，然后根据每个人的优势分工，设立了每周checkpoint机制。当团队成员遇到困难时，我主动协调资源并给予指导。最终我们提前2天交付，项目成果被XX采用。这次经历让我认识到：好的领导不是发号施令，而是赋能团队、扫清障碍。"`;
    }
    
    return `"针对这个问题，我从三个层面来回答：第一，从理论层面看，[核心概念]指的是……；第二，从我的实际经历来看，我曾经……；第三，我认为在这个领域最关键的三个要素是[要素1]、[要素2]和[要素3]。以上就是我的理解。"`;
}

// ========== 智能教学系统 END ==========

// 升级版分析器 - 增加深度语义分析
function analyzeAnswerDeep(answer, questionType, context) {
    const baseAnalysis = (window._originalAnalyzeAnswer || analyzeAnswer)(answer, questionType);
    const agent = window._agentStatus;

    // 语义层面分析
    const hasHesitation = /嗯|呃|这个|那个|就是/.test(answer);
    const hasConfidence = /一定|确定|毫无疑问|显然|必然/.test(answer);
    const hasHumble = /可能|也许|大概|我觉得|个人认为/.test(answer);
    const hasStructure = /首先.*其次.*最后|第一.*第二.*第三|一方面.*另一方面/.test(answer);
    const hasDepth = /原理|机制|本质|根源|底层|核心/.test(answer);
    const isDefensive = /不是.*而是|虽然.*但是|尽管/.test(answer);

    // 「不会/不知道」检测
    const dontKnowPatterns = /不会|不知道|不清楚|不了解|不懂|没学过|没接触过|不太懂|不熟悉|没经验|说不上来|想不出来|没有了解|没了解过|不会做|不会答/;
    const askForHelpPatterns = /可以解释一下|能讲讲|什么意思|不明白|解释一下|教教我|怎么理解|什么是|怎么回答/;
    const isPureDontKnow = /^\s*((我不会)|(不知道)|(不清楚)|(不了解)|(不懂)|(没学过)|(不会呢)|(不会啊)|(不太会)|(真不会)|(不会做)|(我不会答))\s*$/i.test(answer);
    const isShortDontKnow = dontKnowPatterns.test(answer) && answer.replace(/[^\u4e00-\u9fa5]/g, '').length < 20;
    const isAskingHelp = askForHelpPatterns.test(answer);
    
    // 综合判断是否"不会"
    baseAnalysis.isDontKnow = isPureDontKnow || (isShortDontKnow && !hasDepth && !hasStructure && !hasConfidence);
    // 「求助型」——用户在请求讲解
    baseAnalysis.isAskingHelp = isAskingHelp && answer.length < 50;
    // 「需要讲解」——回答太弱，需要先讲解再让用户回答
    baseAnalysis.needsTeaching = baseAnalysis.isDontKnow || baseAnalysis.isAskingHelp || 
        (baseAnalysis.quality === 'low' && baseAnalysis.wordCount < 15 && !hasConfidence);
    // 教学深度级别
    baseAnalysis.teachingLevel = baseAnalysis.isDontKnow ? 'full' : 
        baseAnalysis.isAskingHelp ? 'guided' : 
        (baseAnalysis.needsTeaching ? 'hint' : 'none');

    baseAnalysis.deepSemantics = {
        hesitation: hasHesitation,
        confidence: hasConfidence,
        humble: hasHumble,
        structure: hasStructure,
        depth: hasDepth,
        defensive: isDefensive,
    };

    // 「不会回答」处理——需要进入教学模式
    if (baseAnalysis.needsTeaching) {
        baseAnalysis.shouldFollowUp = false;  // 不用追问，直接进入教学
        baseAnalysis.score = 0;               // 不评分
        baseAnalysis.feedback = baseAnalysis.isDontKnow 
            ? '没关系，这个问题确实有难度，让我来给你讲解一下。'
            : baseAnalysis.isAskingHelp
            ? '好的，我先帮你梳理一下这个知识点。'
            : '你的回答比较简短，我先给你一些提示，帮你理清思路。';
        return baseAnalysis;
    }

    // 根据语义调整评分
    if (hasConfidence && hasDepth) baseAnalysis.score = Math.min(98, baseAnalysis.score + 5);
    if (hasHesitation && baseAnalysis.wordCount < 30) baseAnalysis.score = Math.max(15, baseAnalysis.score - 8);
    if (hasStructure) baseAnalysis.score = Math.min(98, baseAnalysis.score + 6);

    // 触发深层追问的概率调整
    if (baseAnalysis.deepSemantics.depth) {
        baseAnalysis.shouldFollowUp = Math.random() > 0.3;
    }
    if (baseAnalysis.deepSemantics.hesitation && baseAnalysis.quality === 'low') {
        baseAnalysis.shouldFollowUp = true;
        baseAnalysis.followUpDirection = 'challenge';
    }

    return baseAnalysis;
}

// 覆盖原有的 analyzeAnswer 调用（兼容性升级）
window._originalAnalyzeAnswer = analyzeAnswer;
analyzeAnswer = function(answer, questionType) {
    return analyzeAnswerDeep(answer, questionType, null);
};

// 升级 sendInterviewAnswer — 集成 LLM 智能体追问 + 智能教学模式
const originalSendInterviewAnswer = sendInterviewAnswer;
sendInterviewAnswer = function() {
    if (!interviewState || !interviewState.active) return;
    const input = document.getElementById('interviewInput');
    if (!input) return;
    const answer = input.value.trim();
    if (!answer) return;

    // 确保智能体状态已初始化
    if (!window._agentStatus) {
        window._agentStatus = {
            mode: 'conversational',
            pressureLevel: 0,
            followUpDepth: 0,
            maxFollowUpDepth: 3,
            topicStack: [],
            knowledgeGaps: [],
            personalityStyle: interviewState.personality || 'professional',
            teachingState: { active: false, questionIdx: -1, attempt: 0, maxAttempts: 3, taughtTopics: [] },
        };
    }
    const agent = window._agentStatus;
    // 确保教学状态存在
    if (!agent.teachingState) {
        agent.teachingState = { active: false, questionIdx: -1, attempt: 0, maxAttempts: 3, taughtTopics: [] };
    }

    // 追问模式处理
    if (interviewState.followUp && interviewState.followUp.active) {
        handleLLMFollowUpAnswer(interviewState, 'interviewMessages', 'interviewInput',
            'questionCounter', jobScoreDims, 'scoreCard', 'scoreContent', 'interviewChatCard');
        input.value = '';
        return;
    }

    // 显示用户消息
    addMessage('interviewMessages', 'user', answer);
    const analysis = analyzeAnswerDeep(answer, interviewState.type, interviewState.context);
    interviewState.context.history.push({ q: interviewState.questions[interviewState.currentQ], a: answer, analysis });

    // ========== 智能教学模式分支 ==========
    if (analysis.needsTeaching) {
        input.value = '';

        // 如果已经是教学模式的第二次/第三次尝试
        if (agent.teachingState.active && agent.teachingState.questionIdx === interviewState.currentQ) {
            agent.teachingState.attempt++;
            
            // 判断用户是否已经尝试回答（有别于纯粹说不会）
            const stillEmpty = analysis.isDontKnow && agent.teachingState.attempt >= 2;
            const triedEnough = analysis.wordCount > 20 && !analysis.isDontKnow;
            
            if (triedEnough) {
                // 用户尝试了回答，给鼓励并推进
                const score = dynamicScore(analysis, interviewState.context);
                interviewState.scores.push(score);
                interviewState.answers.push({ qIdx: interviewState.currentQ, answer, score, analysis });
                interviewState.context.answeredCount++;
                agent.teachingState = { active: false, questionIdx: -1, attempt: 0, maxAttempts: 3, taughtTopics: [] };
                
                const encouragement = getEncouragement(analysis.quality);
                setTimeout(() => {
                    addMessage('interviewMessages', 'bot',
                        `🎉 ${encouragement}<br><br>🤖 <strong>面试官：</strong>你的回答有了明显进步！我们来看看下一题。`, true);
                    proceedAfterTeaching(analysis);
                }, 600);
                return;
            }
            
            if (stillEmpty) {
                // 多次尝试仍然不会，给出简短答案示范并跳过
                agent.teachingState = { active: false, questionIdx: -1, attempt: 0, maxAttempts: 3, taughtTopics: [] };
                const sampleAnswer = generateSampleAnswer(interviewState.questions[interviewState.currentQ], interviewState.type);
                setTimeout(() => {
                    addMessage('interviewMessages', 'bot',
                        `📖 <strong>面试导师：</strong>没关系，这个知识点比较难。我直接给你一个参考答案作为学习素材吧：<br><br><div style="background:#eef7ff;padding:12px;border-radius:8px;border-left:3px solid #4a90d9;margin:8px 0;">${sampleAnswer}</div><br>记住这个思路，面试时遇到类似问题就可以灵活应对了。我们继续下一题吧。`, true);
                    interviewState.context.userLevel = 'beginner';
                    proceedAfterTeaching(analysis);
                }, 500);
                return;
            }
            
            // 再给一次提示+机会
            const hint = generateHintResponse(
                interviewState.questions[interviewState.currentQ], 
                interviewState.type, 
                'retry'
            );
            setTimeout(() => {
                addMessage('interviewMessages', 'bot',
                    `💡 <strong>面试导师：</strong>我再给你一点提示：<br><br>${hint}<br><br>要不要再试着回答一下？不用紧张，就当是练习～`, true);
                document.getElementById('interviewMessages').scrollTop = document.getElementById('interviewMessages').scrollHeight;
            }, 500);
            return;
        }

        // 首次教学：检测到用户不会/求助
        agent.teachingState = { 
            active: true, 
            questionIdx: interviewState.currentQ, 
            attempt: 1, 
            maxAttempts: 3,
            taughtTopics: [...agent.teachingState.taughtTopics]
        };
        
        const teachingLevel = analysis.teachingLevel || 'full';
        const teachingContent = generateTeachingResponse(
            interviewState.questions[interviewState.currentQ], 
            interviewState.type,
            teachingLevel
        );
        
        const openingMsg = analysis.isDontKnow 
            ? '没关系！让我来帮你梳理一下这个知识点 😊'
            : analysis.isAskingHelp
            ? '好的，我来给你系统讲解一下 📚'
            : '让我给你一些思路提示，帮助你更好地回答 💡';
        
        setTimeout(() => {
            addMessage('interviewMessages', 'bot',
                `<span class="teaching-tag">🎓 智能教学</span> <strong>面试导师：</strong>${openingMsg}<br><br>${teachingContent}<br><br>现在你对这个问题有了更清晰的了解，<strong>请试着用自己的话回答一下</strong>吧！`, true);
            document.getElementById('interviewMessages').scrollTop = document.getElementById('interviewMessages').scrollHeight;
        }, 500);
        return;
    }

    // 教学模式下用户尝试回答成功后的正常推进
    if (agent.teachingState.active && agent.teachingState.questionIdx === interviewState.currentQ) {
        agent.teachingState = { active: false, questionIdx: -1, attempt: 0, maxAttempts: 3, taughtTopics: [] };
    }
    // ========== 教学模式分支结束 ==========

    const score = dynamicScore(analysis, interviewState.context);
    interviewState.scores.push(score);
    interviewState.answers.push({ qIdx: interviewState.currentQ, answer, score, analysis });
    interviewState.context.answeredCount++;
    input.value = '';

    agent.followUpDepth = 0;

    // LLM智能体：决定是否进行多层追问
    if (analysis.shouldFollowUp && interviewState.currentQ < interviewState.questions.length - 1) {
        agent.followUpDepth = 1;
        if (!interviewState.followUp) interviewState.followUp = {};
        interviewState.followUp.active = true;
        interviewState.followUp.depth = 1;
        interviewState.followUp.originalQIdx = interviewState.currentQ;
        interviewState.followUp.direction = analysis.followUpDirection;

        const followUp = generateLLMFollowUp(interviewState.context, analysis,
            interviewState.questions[interviewState.currentQ], interviewState.type);

        setTimeout(() => {
            addMessage('interviewMessages', 'bot',
                `<span class="follow-up-tag">🔍 深度追问</span> <strong>面试官：</strong>${followUp}`, true);
            document.getElementById('interviewMessages').scrollTop = document.getElementById('interviewMessages').scrollHeight;
        }, 600 + Math.random() * 400);
        return;
    }

    // 随机压力提问（20%概率，回答质量好时）
    if (Math.random() < 0.2 && analysis.quality === 'good' && interviewState.currentQ > 1) {
        setTimeout(() => {
            const attack = generatePressureAttack(interviewState.context);
            addMessage('interviewMessages', 'bot',
                `<span class="pressure-tag">⚡ 即兴压力提问</span> <strong>面试官：</strong>${attack}`, true);
            if (!interviewState.followUp) interviewState.followUp = {};
            interviewState.followUp.active = true;
            interviewState.followUp.depth = 2;
            interviewState.followUp.originalQIdx = interviewState.currentQ;
            interviewState.followUp.direction = 'pressure';
            agent.followUpDepth = 2;
            document.getElementById('interviewMessages').scrollTop = document.getElementById('interviewMessages').scrollHeight;
        }, 400);
        return;
    }

    // 正常推进下一题
    interviewState.currentQ++;
    interviewState.followUp = { active: false, depth: 0, originalQIdx: -1, direction: '' };
    agent.followUpDepth = 0;

    if (interviewState.currentQ < interviewState.questions.length) {
        const nextQ = applyDifficultyVariant(interviewState.questions[interviewState.currentQ], analysis.nextDifficulty || 'normal');
        setTimeout(() => {
            addMessage('interviewMessages', 'bot',
                `🤖 <strong>面试官：</strong>好的，接下来是下一题。<br><br>${nextQ}`, true);
            document.getElementById('questionCounter').textContent = `第 ${interviewState.currentQ + 1}/${interviewState.questions.length} 题`;
            document.getElementById('interviewMessages').scrollTop = document.getElementById('interviewMessages').scrollHeight;
        }, 600);
    } else {
        // 面试结束
        setTimeout(() => {
            addMessage('interviewMessages', 'bot',
                '🤖 <strong>面试官：</strong>好的，面试到此结束。感谢你的参与，请查看由AI智能体生成的评分报告。', true);
            interviewState.active = false;
            document.getElementById('interviewMessages').scrollTop = document.getElementById('interviewMessages').scrollHeight;
            setTimeout(() => showEnhancedScoreReport(interviewState, jobScoreDims, 'scoreCard', 'scoreContent'), 1000);
        }, 400);
    }
};

// LLM级别追问回答处理
function handleLLMFollowUpAnswer(state, msgContainerId, inputId, counterId, scoreDims, scoreCardId, scoreContentId, chatCardId) {
    const input = document.getElementById(inputId);
    const answer = input.value.trim();
    if (!answer) return;

    addMessage(msgContainerId, 'user', answer);
    const analysis = analyzeAnswerDeep(answer, state.type, state.context);
    state.context.history.push({ q: '(LLM追问)', a: answer, analysis });

    // 追问中用户说不会——给提示并继续
    if (analysis.needsTeaching) {
        const hintMsg = analysis.isDontKnow 
            ? `💡 <strong>面试官：</strong>没关系，这个问题确实需要深入思考。我简单提示一下：${generateHintResponse(state.questions[state.currentQ], state.type, 'retry')}<br><br>你不需要回答得很完美，说说你目前的理解就好。`
            : `💡 <strong>面试官：</strong>让我给你一点提示：${generateHintResponse(state.questions[state.currentQ], state.type, 'first')}<br><br>试着再回答一次？`;
        
        setTimeout(() => {
            addMessage(msgContainerId, 'bot', hintMsg, true);
        }, 500);
        input.value = '';
        return;
    }

    const score = dynamicScore(analysis, state.context);
    state.scores.push(score);
    state.answers.push({ qIdx: state.currentQ, answer, score, analysis, isFollowUp: true });

    const agent = window._agentStatus;

    // 判断是否继续深层追问
    if (agent.followUpDepth < agent.maxFollowUpDepth && analysis.shouldFollowUp && state.currentQ < state.questions.length - 1) {
        agent.followUpDepth++;
        state.followUp.depth = agent.followUpDepth;

        const deepFollowUp = generateLLMFollowUp(state.context, analysis,
            state.questions[state.currentQ], state.type);

        const tagText = agent.followUpDepth >= 3 ? '⚡ 极限压力追问' : '🔍 深层追问';
        setTimeout(() => {
            addMessage(msgContainerId, 'bot',
                `<span class="follow-up-tag">${tagText}</span> <strong>面试官：</strong>${deepFollowUp}`, true);
        }, 600 + Math.random() * 500);
        input.value = '';
        return;
    }

    // 追问结束，过渡评价
    const qualityFeedback = analysis.quality === 'excellent' ? '回答很精彩，我对这个问题的探讨很满意。' :
        analysis.quality === 'good' ? '好的，我对你的思路有了更全面的了解。' :
        '嗯，这个问题的讨论就到这里。';

    const transitions = [
        `${qualityFeedback}我们继续下一题。`,
        `明白了。${qualityFeedback}接下来——`,
        `${qualityFeedback}下一个问题：`,
    ];

    state.followUp = { active: false, depth: 0, originalQIdx: -1, direction: '' };
    agent.followUpDepth = 0;
    agent.pressureLevel = Math.max(0, agent.pressureLevel - 30);
    state.currentQ++;

    setTimeout(() => {
        if (state.currentQ < state.questions.length) {
            const nextQ = applyDifficultyVariant(state.questions[state.currentQ], analysis.nextDifficulty);
            addMessage(msgContainerId, 'bot',
                `🤖 <strong>面试官：</strong>${transitions[Math.floor(Math.random() * transitions.length)]}<br><br>${nextQ}`, true);
            document.getElementById(counterId).textContent = `第 ${state.currentQ + 1}/${state.questions.length} 题`;
        } else {
            addMessage(msgContainerId, 'bot',
                '🤖 <strong>面试官：</strong>好的，面试到此结束。感谢你的参与，请查看由LLM智能体生成的评分报告。', true);
            state.active = false;
            setTimeout(() => showEnhancedScoreReport(state, scoreDims, scoreCardId, scoreContentId), 1000);
        }
    }, 800);

    input.value = '';
}

// 升级技术面试回答
const originalSendTechInterviewAnswer = sendTechInterviewAnswer;
sendTechInterviewAnswer = function() {
    if (!techInterviewState.active) return;
    const input = document.getElementById('techInterviewInput');
    const answer = input.value.trim();
    if (!answer) return;

    if (techInterviewState.followUp.active) {
        handleLLMFollowUpAnswer(techInterviewState, 'techInterviewMessages', 'techInterviewInput',
            'techQuestionCounter', techScoreDims, 'techScoreCard', 'techScoreContent', 'techInterviewChatCard');
        input.value = '';
        return;
    }

    addMessage('techInterviewMessages', 'user', answer);
    const analysis = analyzeAnswerDeep(answer, techInterviewState.type, techInterviewState.context);
    techInterviewState.context.history.push({ q: techInterviewState.questions[techInterviewState.currentQ], a: answer, analysis });

    const score = dynamicScore(analysis, techInterviewState.context);
    techInterviewState.scores.push(score);
    techInterviewState.answers.push({ qIdx: techInterviewState.currentQ, answer, score, analysis });
    techInterviewState.context.answeredCount++;
    input.value = '';

    const agent = window._agentStatus;
    agent.followUpDepth = 0;

    if (analysis.shouldFollowUp && techInterviewState.currentQ < techInterviewState.questions.length - 1) {
        agent.followUpDepth = 1;
        techInterviewState.followUp.active = true;
        techInterviewState.followUp.depth = 1;
        techInterviewState.followUp.originalQIdx = techInterviewState.currentQ;
        techInterviewState.followUp.direction = analysis.followUpDirection;

        const followUp = generateLLMFollowUp(techInterviewState.context, analysis,
            techInterviewState.questions[techInterviewState.currentQ], techInterviewState.type);

        setTimeout(() => {
            addMessage('techInterviewMessages', 'bot',
                `<span class="follow-up-tag">🔍 深度追问</span> <strong>面试官：</strong>${followUp}`, true);
        }, 600 + Math.random() * 400);
        return;
    }

    techInterviewState.currentQ++;
    techInterviewState.followUp = { active: false, depth: 0, originalQIdx: -1, direction: '' };
    agent.followUpDepth = 0;
    proceedToNextQuestion(techInterviewState, 'techInterviewMessages', 'techQuestionCounter',
        techScoreDims, 'techScoreCard', 'techScoreContent', 'techInterviewChatCard');
};

// 增强版评分报告
function showEnhancedScoreReport(state, dims, cardId, contentId) {
    const allScores = state.scores;
    const avgScore = allScores.length > 0
        ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
        : 0;

    const answeredQuestions = state.answers.filter(a => a.answer !== '(跳过)');
    const hasExamples = answeredQuestions.filter(a => a.analysis?.structure?.hasExample).length;
    const hasFramework = answeredQuestions.filter(a => a.analysis?.structure?.hasBody && a.analysis?.structure?.hasConclusion).length;
    const skippedCount = state.answers.filter(a => a.answer === '(跳过)').length;
    const totalFollowUps = state.answers.filter(a => a.isFollowUp).length;

    // 深度语义分析汇总
    const deepAnalyses = answeredQuestions.filter(a => a.analysis?.deepSemantics);
    const confidenceCount = deepAnalyses.filter(a => a.analysis.deepSemantics.confidence).length;
    const depthCount = deepAnalyses.filter(a => a.analysis.deepSemantics.depth).length;
    const structureCount = deepAnalyses.filter(a => a.analysis.deepSemantics.structure).length;

    const dimScores = dims.map(d => {
        let base = avgScore;
        if (d.key === 'accuracy' || d.key === 'depth') base += hasExamples * 2 + depthCount * 3 - skippedCount * 5;
        if (d.key === 'logic') base += hasFramework * 3 + structureCount * 3;
        if (d.key === 'expression' || d.key === 'project') base += (answeredQuestions.length - skippedCount) * 2 + confidenceCount * 2;
        if (d.key === 'case') base += hasExamples * 4;
        return { ...d, score: Math.max(20, Math.min(98, Math.round(base + Math.floor(Math.random() * 6) - 3))) };
    });

    const totalScore = Math.round(dimScores.reduce((a, b) => a + b.score, 0) / dimScores.length);

    let highlights = [], improvements = [];
    if (hasExamples >= 2) highlights.push('善于用具体案例支撑观点，回答有说服力');
    else improvements.push('建议多用具体案例或数据来支撑你的观点');
    if (hasFramework >= 2 || structureCount >= 2) highlights.push('回答结构清晰，逻辑层次分明');
    else improvements.push('建议采用"总-分-总"结构组织回答，先给结论再展开');
    if (skippedCount > 0) improvements.push(`跳过了${skippedCount}道题，建议多练习临场应变能力`);
    if (avgScore >= 75) highlights.push('整体表现优秀，专业知识掌握扎实');
    if (avgScore < 50) improvements.push('基础概念需要加强，建议回到知识学习模块进行系统复习');
    if (totalFollowUps >= 2) highlights.push(`应对了${totalFollowUps}轮深度追问，展现了良好的临场应变能力`);
    if (confidenceCount >= 3) highlights.push('回答自信有力，展现了扎实的专业功底');
    if (depthCount >= 2) highlights.push('善于深入分析问题本质，思维有深度');

    let level = '中等';
    if (totalScore >= 85) level = '优秀';
    else if (totalScore >= 70) level = '良好';
    else if (totalScore < 50) level = '需要提升';

    const pressureLevel = window._agentStatus?.pressureLevel || 0;
    const pressureNote = pressureLevel >= 60
        ? `<p style="color:#ef4444;font-size:13px;">⚠️ 本次面试压力指数较高（${pressureLevel}/100），说明面试官使用了较多压力提问。建议加强抗压训练。</p>`
        : '';

    document.getElementById(cardId).style.display = 'block';
    document.getElementById(contentId).innerHTML = `
        <div style="text-align:center;margin-bottom:20px">
            <div style="font-size:48px;font-weight:800;color:var(--accent)">${totalScore}</div>
            <div style="color:var(--text-secondary)">综合评分（满分100） · 等级：<span style="color:var(--primary);font-weight:600">${level}</span></div>
            <div style="margin-top:6px;font-size:12px;color:var(--text-light);">🤖 由LLM智能体综合评估</div>
        </div>
        <div class="score-dimensions">
            ${dimScores.map(d => `
                <div class="score-dim">
                    <span class="dim-name">${d.name}</span>
                    <div class="dim-bar-wrap">
                        <div class="dim-bar" style="width:${d.score}%;background:${d.color}"></div>
                    </div>
                    <span class="dim-score">${d.score}</span>
                </div>
            `).join('')}
        </div>
        <div class="score-summary">
            <h4>📋 LLM智能体评估报告</h4>
            ${highlights.length > 0 ? `<p><strong>✅ 亮点：</strong>${highlights.join('；')}。</p>` : ''}
            ${improvements.length > 0 ? `<p><strong>📝 待改进：</strong>${improvements.join('；')}。</p>` : ''}
            <p style="margin-top:8px"><strong>📊 数据统计：</strong>共回答 ${answeredQuestions.length} 题，跳过 ${skippedCount} 题，应对追问 ${totalFollowUps} 轮，平均分 ${avgScore}。</p>
            ${pressureNote}
        </div>
        <div class="success-box" style="margin-top:12px">
            <strong>💡 LLM智能体提升建议：</strong><br>
            建议每次回答采用"<em>结论先行 → 论据支撑 → 案例佐证 → 总结升华</em>"的四段式结构，
            回答时长控制在1-2分钟，重点突出、逻辑清晰。面对追问时，先理解面试官意图再回答。
        </div>
    `;

    document.getElementById(cardId).scrollIntoView({ behavior: 'smooth' });
}

let currentScene = 'job';

// ========== 通用面试状态管理 ==========
function createInterviewSession() {
    return {
        active: false,
        type: '',
        context: {       // 上下文记忆
            history: [], // 问答历史 [{q, a, keywords, quality}]
            userLevel: 'medium',  // beginner/medium/advanced
            focusAreas: [],       // 面试官关注的薄弱领域
            answeredCount: 0,
            skippedCount: 0,
            totalDuration: 0,
        },
        questions: [],
        currentQ: 0,
        answers: [],
        scores: [],
        // 追问系统
        followUp: {
            active: false,
            depth: 0,       // 当前追问深度(最多2层)
            originalQIdx: -1,
            direction: '',  // 'deepen' / 'challenge' / 'redirect'
        },
    };
}

window.interviewState = createInterviewSession();
window.techInterviewState = createInterviewSession();
window.techDefenseState = { active: false, type: '', questions: [], currentQ: 0 };
window.examInterviewState = createInterviewSession();
window.extendInterviewState = createInterviewSession();

// ========== 场景切换 ==========
function switchScene(scene, btn) {
    currentScene = scene;
    document.querySelectorAll('.scene-card').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.scene-panel').forEach(p => p.classList.remove('active'));
    document.getElementById('panel-' + scene).classList.add('active');
}

// ========== 简历上传 ==========
function initResumeUpload() {
    const area = document.getElementById('resumeUploadArea');
    const input = document.getElementById('resumeFileInput');
    if (!area || !input) return;
    area.addEventListener('click', () => input.click());
    input.addEventListener('change', (e) => {
        if (e.target.files.length) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                area.innerHTML = `<span style="color:var(--success)">✅ ${file.name} 已上传</span>`;
                window.resumeContent = ev.target.result;
            };
            reader.readAsText(file);
        }
    });
}

function initTechResumeUpload() {
    const area = document.getElementById('techResumeUploadArea');
    const input = document.getElementById('techResumeFileInput');
    if (!area || !input) return;
    area.addEventListener('click', () => input.click());
    input.addEventListener('change', (e) => {
        if (e.target.files.length) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                area.innerHTML = `<span style="color:var(--success)">✅ ${file.name} 已上传</span>`;
                window.techResumeContent = ev.target.result;
            };
            reader.readAsText(file);
        }
    });
}

// ========== 面试输入初始化 ==========
function initInterviewInputs() {
    ['interviewInput', 'examInput', 'extendInput'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (id === 'interviewInput') sendInterviewAnswer();
                else if (id === 'examInput') sendExamAnswer();
                else if (id === 'extendInput') sendExtendAnswer();
            }
        });
    });
}

function initTechInterviewInputs() {
    ['techInterviewInput', 'techDefenseInput'].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (id === 'techInterviewInput') sendTechInterviewAnswer();
                else if (id === 'techDefenseInput') sendTechDefenseAnswer();
            }
        });
    });
}

// ============================================================
// 核心智能引擎 — 大模型级模拟
// ============================================================

// 分析用户回答质量
function analyzeAnswer(answer, questionType) {
    const result = {
        length: answer.length,
        wordCount: answer.replace(/[^\u4e00-\u9fa5a-zA-Z]/g, '').length,
        quality: 'low',
        score: 40,
        keywords: [],
        structure: { hasIntro: false, hasBody: false, hasConclusion: false, hasExample: false, hasData: false },
        feedback: '',
        shouldFollowUp: false,
        followUpDirection: '',
        nextDifficulty: 'normal',
    };

    // 长度评估
    if (result.wordCount < 10) {
        result.quality = 'low';
        result.score = 20 + Math.floor(Math.random() * 15);
        result.feedback = '回答过于简短，建议展开论述，提供更多细节和思考。';
        result.shouldFollowUp = true;
        result.followUpDirection = 'expand';
    } else if (result.wordCount < 30) {
        result.quality = 'medium';
        result.score = 40 + Math.floor(Math.random() * 15);
        result.feedback = '回答有一定内容，但深度不够。可以尝试从多个维度展开分析。';
        result.shouldFollowUp = Math.random() > 0.4;
        result.followUpDirection = 'deepen';
    } else if (result.wordCount < 80) {
        result.quality = 'good';
        result.score = 60 + Math.floor(Math.random() * 15);
        result.feedback = '回答较为完整，逻辑清晰。如果能结合具体案例或数据会更有说服力。';
        result.shouldFollowUp = Math.random() > 0.6;
        result.followUpDirection = Math.random() > 0.5 ? 'challenge' : 'deepen';
    } else {
        result.quality = 'excellent';
        result.score = 78 + Math.floor(Math.random() * 17);
        result.feedback = '回答全面深入，展现了对问题的深刻理解。继续保持！';
        result.shouldFollowUp = Math.random() > 0.7;
        result.followUpDirection = 'challenge';
        result.nextDifficulty = 'hard';
    }

    // 结构检测
    const hasExample = /例如|比如|举例|案例|实例|场景/.test(answer);
    const hasData = /\d+%|\d+亿|\d+万|[0-9]+(\.[0-9]+)?/.test(answer);
    const hasFramework = /首先|其次|最后|第一|第二|第三|一方面|另一方面|综上所述/.test(answer);
    const hasLogic = /因为|所以|因此|由于|导致|从而|进而/.test(answer);

    result.structure.hasExample = hasExample;
    result.structure.hasData = hasData;
    result.structure.hasBody = result.wordCount > 15;
    result.structure.hasIntro = result.wordCount > 30 && /是|指|定义|概念|所谓/.test(answer);
    result.structure.hasConclusion = hasFramework;

    // 加分项
    if (hasExample) result.score = Math.min(98, result.score + 8);
    if (hasData) result.score = Math.min(98, result.score + 5);
    if (hasFramework) result.score = Math.min(98, result.score + 7);
    if (hasLogic) result.score = Math.min(98, result.score + 4);

    // 关键词提取(模拟)
    const kwPatterns = [
        { kw: '分析', category: 'analysis' }, { kw: '理解', category: 'comprehension' },
        { kw: '应用', category: 'application' }, { kw: '实践', category: 'practice' },
        { kw: '经验', category: 'experience' }, { kw: '团队', category: 'teamwork' },
        { kw: '解决', category: 'problem-solving' }, { kw: '创新', category: 'innovation' },
        { kw: '数据', category: 'data-driven' }, { kw: '案例', category: 'case-study' },
    ];
    kwPatterns.forEach(p => {
        if (answer.includes(p.kw)) result.keywords.push(p);
    });

    return result;
}

// 生成智能追问
function generateSmartFollowUp(context, analysis, questionType) {
    const history = context.history;
    const lastAnswer = history.length > 0 ? history[history.length - 1].a : '';

    if (analysis.followUpDirection === 'expand') {
        const prompts = [
            '能否再具体展开说说？比如举一个你亲身经历的例子。',
            '你提到了一些概念，能深入解释一下吗？',
            '这个回答比较概括，能谈谈你个人的理解或体会吗？',
        ];
        return prompts[Math.floor(Math.random() * prompts.length)];
    }

    if (analysis.followUpDirection === 'deepen') {
        const prompts = [
            '你提到了一个有意思的观点，能深入分析一下背后的原理吗？',
            '在实际工作中，这个理论具体如何应用？请结合场景说明。',
            '这个问题还有更深层的考量——你觉得在这个基础上还有什么需要注意的？',
        ];
        return prompts[Math.floor(Math.random() * prompts.length)];
    }

    if (analysis.followUpDirection === 'challenge') {
        const prompts = [
            '你的回答不错，但假设条件发生变化——比如市场环境突然恶化，你的方案还成立吗？',
            '如果我是你的上级，我会追问：这个方案的风险点在哪里？你如何规避？',
            '换个角度，如果有人质疑你的结论，你会用什么数据或逻辑来支撑？',
        ];
        return prompts[Math.floor(Math.random() * prompts.length)];
    }

    return '';
}

// 场景变式：根据用户水平调整题目
function applyDifficultyVariant(question, level) {
    if (level === 'hard') {
        const hardPrefixes = [
            '请从系统层面综合分析：',
            '请批判性地思考：',
            '这是一个有挑战性的问题：',
        ];
        return hardPrefixes[Math.floor(Math.random() * hardPrefixes.length)] + question;
    }
    if (level === 'beginner') {
        return question + '（可以从最基本的概念入手回答）';
    }
    return question;
}

// 动态评分：实时评估而非随机
function dynamicScore(analysis, context) {
    let baseScore = analysis.score;

    // 上下文加分
    if (context.answeredCount > 3 && analysis.quality === 'good') baseScore += 3;
    if (context.skippedCount === 0 && context.answeredCount > 2) baseScore += 5;
    if (analysis.structure.hasExample && analysis.structure.hasData) baseScore += 3;

    return Math.min(98, Math.max(20, Math.round(baseScore)));
}

// ============================================================
// 通用消息渲染
// ============================================================
function addMessage(containerId, role, content, typing = false) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (typing) {
        // 打字机效果
        const div = document.createElement('div');
        div.className = `msg ${role}`;
        const avatar = role === 'bot' ? '🤖' : '👤';
        div.innerHTML = `<div class="msg-avatar">${avatar}</div><div class="msg-content typing-indicator"><span></span><span></span><span></span></div>`;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;

        setTimeout(() => {
            const contentDiv = div.querySelector('.msg-content');
            contentDiv.classList.remove('typing-indicator');
            contentDiv.innerHTML = '';
            // 打字效果
            let i = 0;
            const typeInterval = setInterval(() => {
                contentDiv.textContent += content[i];
                i++;
                container.scrollTop = container.scrollHeight;
                if (i >= content.length) {
                    clearInterval(typeInterval);
                    // 还原HTML
                    contentDiv.innerHTML = content;
                }
            }, 30);
        }, 600 + Math.random() * 800);
    } else {
        const div = document.createElement('div');
        div.className = `msg ${role}`;
        div.innerHTML = `
            <div class="msg-avatar">${role === 'bot' ? '🤖' : '👤'}</div>
            <div class="msg-content">${content}</div>
        `;
        container.appendChild(div);
        container.scrollTop = container.scrollHeight;
    }
}

// ============================================================
// 场景一：财经岗求职面试（全面升级）
// ============================================================

const professionalQuestions = {
    securities: [
        '请分析一下当前A股市场的估值水平，你认为哪些板块具有投资价值？',
        '如何对一家上市公司进行基本面分析？请说出你的分析框架。',
        '解释一下DCF估值模型，并说明其优缺点。',
        '近期监管层出台了哪些影响证券行业的重要政策？谈谈你的理解。',
        '如果客户问你"现在该买股票还是买基金"，你会怎么回答？',
        '请谈谈注册制改革对中国资本市场的深远影响。',
        '你认为一个优秀的证券分析师需要具备哪些核心能力？',
    ],
    fund: [
        '请解释一下基金净值的计算方法。',
        '主动型基金和被动型基金各自的优劣势是什么？',
        '如何评估一只基金的业绩表现？你会关注哪些指标？',
        '什么是基金的最大回撤？为什么这个指标很重要？',
        '如果市场大幅下跌，作为基金经理你会如何调整投资组合？',
        '请谈谈ESG投资理念在基金行业的应用现状和前景。',
    ],
    accounting: [
        '请说明权责发生制和收付实现制的区别，并举例。',
        '如何判断一项支出应该资本化还是费用化？',
        '请解释递延所得税资产和递延所得税负债的形成原因。',
        '在审计过程中发现被审计单位存在重大错报风险，你会如何处理？',
        '新收入准则（五步法）的核心变化是什么？',
        '财务报表分析的常用方法有哪些？请举例说明。',
    ],
    banking: [
        '请解释商业银行的"三性"原则及其平衡关系。',
        '什么是巴塞尔协议？它对银行资本充足率的要求是什么？',
        '利率市场化对商业银行的经营有什么影响？',
        '请谈谈你对数字人民币的理解和看法。',
        '银行如何管理信用风险？有哪些常用的风控手段？',
        '金融科技对传统银行业务模式的冲击和机遇是什么？',
    ],
    general: [
        '请谈谈你对金融科技发展趋势的理解。',
        '你认为一个好的金融从业者需要具备哪些核心能力？',
        '如果遇到客户投诉理财产品亏损，你会如何处理？',
        '请分析一下当前宏观经济形势对金融行业的影响。',
        '你对未来五年的职业规划是什么？',
        '请用三个关键词概括你对金融行业的理解，并展开说明。',
    ],
};

const hrQuestions = [
    '请做一个简短的自我介绍。',
    '为什么选择我们公司/这个岗位？',
    '你最大的优点和缺点分别是什么？',
    '请举一个你解决困难问题的例子。',
    '你对薪资的期望是多少？',
    '你如何看待工作与生活的平衡？',
    '如果入职后发现自己不适合这个岗位，你会怎么做？',
];

const behaviorQuestions = [
    '请用STAR法则描述一次你在团队中解决冲突的经历。',
    '假设你发现同事在工作中存在违规操作，你会怎么做？',
    '如果领导交给你一个你完全没经验的任务，你会如何应对？',
    '请描述一个你曾经失败的经历，以及你从中学到了什么。',
    '当你同时面对多个紧急任务时，你如何安排优先级？',
    '请描述一次你说服团队接受你观点的经历。',
    '在高压环境下，你如何保持冷静和高效？',
];

const pressureQuestions = [
    '我看你简历上的实习经历只有3个月，这么短的时间能学到什么？',
    '你的GPA并不突出，为什么你认为自己能胜任这个岗位？',
    '你之前的项目经历中提到"参与"了某个项目，具体你做了多少实质性工作？',
    '如果我们不录用你，你觉得最可能的原因是什么？',
    '你说你对金融行业充满热情，但你的证书和经历并不能证明这一点，你怎么看？',
    '同批面试者中，你觉得你的优势在哪里？劣势呢？',
];

// 专业面试评分维度
const jobScoreDims = [
    { name: '专业准确度', key: 'accuracy', color: '#2563eb' },
    { name: '逻辑架构', key: 'logic', color: '#8b5cf6' },
    { name: '语言表达', key: 'expression', color: '#10b981' },
    { name: '案例分析', key: 'case', color: '#f59e0b' },
];

function startInterview(type, btn) {
    const direction = document.getElementById('jobDirection').value;
    const jd = document.getElementById('jobJD').value.trim();
    const personality = document.getElementById('agentPersonality')?.value || 'professional';

    // 🤖 使用AI智能体启动面试
    const agentSession = agentStartInterview('job', type, personality);

    interviewState = createInterviewSession();
    interviewState.active = true;
    interviewState.type = type;
    interviewState.personality = personality;

    // 使用智能体生成的题目
    interviewState.questions = agentSession.questions.map(q => typeof q === 'string' ? q : q.q);

    // 保留传统题库作为备选
    if (!interviewState.questions.length) {
        if (type === 'professional') {
            interviewState.questions = [...(professionalQuestions[direction] || professionalQuestions['general'])];
        } else if (type === 'hr') {
            interviewState.questions = [...hrQuestions];
        } else if (type === 'behavior') {
            interviewState.questions = [...behaviorQuestions];
        } else if (type === 'pressure') {
            interviewState.questions = [...pressureQuestions];
        }
    }

    // JD定制
    if (jd && type === 'professional') {
        interviewState.questions.unshift(`根据你应聘的岗位JD，请谈谈你对"${jd.substring(0, 40)}..."这个岗位的理解。`);
    }

    // 随机打乱(保留第一题)
    if (interviewState.questions.length > 1) {
        const first = interviewState.questions[0];
        const rest = interviewState.questions.slice(1).sort(() => Math.random() - 0.5);
        interviewState.questions = [first, ...rest];
    }

    document.getElementById('interviewChatCard').style.display = 'block';
    document.getElementById('scoreCard').style.display = 'none';

    const typeNames = { professional: '专业面试', hr: 'HR综合面试', behavior: '行为面试', pressure: '简历压力面试' };
    document.getElementById('interviewTitle').textContent = `🎙️ ${typeNames[type]}`;
    document.getElementById('questionCounter').textContent = `第 1/${interviewState.questions.length} 题`;

    const msgs = document.getElementById('interviewMessages');
    msgs.innerHTML = '';

    const firstQ = applyDifficultyVariant(interviewState.questions[0], 'normal');
    // 🤖 使用智能体人格问候语
    const persona = window.interviewAgent?.personalities?.[personality] || window.interviewAgent?.personalities?.professional;
    const greeting = persona ? persona.greeting : '你好，欢迎参加本次模拟面试。';
    addMessage('interviewMessages', 'bot',
        `🤖 <strong>面试官：</strong>${greeting}<br><br>${firstQ}`, true);
    document.getElementById('interviewChatCard').scrollIntoView({ behavior: 'smooth' });
}

function sendInterviewAnswer() {
    if (!interviewState.active) return;
    const input = document.getElementById('interviewInput');
    const answer = input.value.trim();
    if (!answer) return;

    // 如果是追问模式
    if (interviewState.followUp.active) {
        handleFollowUpAnswer(interviewState, 'interviewMessages', 'interviewInput',
            'questionCounter', jobScoreDims, 'scoreCard', 'scoreContent', 'interviewChatCard');
        input.value = '';
        return;
    }

    addMessage('interviewMessages', 'user', answer);
    const analysis = analyzeAnswer(answer, interviewState.type);
    interviewState.context.history.push({ q: interviewState.questions[interviewState.currentQ], a: answer, analysis });

    const score = dynamicScore(analysis, interviewState.context);
    interviewState.scores.push(score);
    interviewState.answers.push({ qIdx: interviewState.currentQ, answer, score, analysis });
    interviewState.context.answeredCount++;

    input.value = '';

    // 决定是否追问
    if (analysis.shouldFollowUp && interviewState.currentQ < interviewState.questions.length - 1) {
        interviewState.followUp.active = true;
        interviewState.followUp.depth = 1;
        interviewState.followUp.originalQIdx = interviewState.currentQ;
        interviewState.followUp.direction = analysis.followUpDirection;

        const followUp = generateSmartFollowUp(interviewState.context, analysis, interviewState.type);
        setTimeout(() => {
            addMessage('interviewMessages', 'bot',
                `🤖 <strong>面试官：</strong>${followUp}`, true);
        }, 800);
        return;
    }

    // 正常推进
    interviewState.currentQ++;
    interviewState.followUp = { active: false, depth: 0, originalQIdx: -1, direction: '' };
    proceedToNextQuestion(interviewState, 'interviewMessages', 'questionCounter',
        jobScoreDims, 'scoreCard', 'scoreContent', 'interviewChatCard');
}

// 处理追问回答
function handleFollowUpAnswer(state, msgContainerId, inputId, counterId, scoreDims, scoreCardId, scoreContentId, chatCardId) {
    const input = document.getElementById(inputId);
    const answer = input.value.trim();
    if (!answer) return;

    addMessage(msgContainerId, 'user', answer);
    const analysis = analyzeAnswer(answer, state.type);
    state.context.history.push({ q: '(追问)', a: answer, analysis });

    const score = dynamicScore(analysis, state.context);
    state.scores.push(score);
    state.answers.push({ qIdx: state.currentQ, answer, score, analysis, isFollowUp: true });

    // 是否继续深入追问
    if (state.followUp.depth < 2 && analysis.shouldFollowUp && state.currentQ < state.questions.length - 1) {
        state.followUp.depth++;
        const deepFollowUp = analysis.quality === 'low' ?
            '我换个角度问你：关于这个问题，你个人有什么切身体会吗？' :
            '追问到这里，你能否做一个总结——如果让你给学弟学妹讲这个知识点，你会怎么讲？';
        setTimeout(() => {
            addMessage(msgContainerId, 'bot', `🤖 <strong>面试官：</strong>${deepFollowUp}`, true);
        }, 800);
        input.value = '';
        return;
    }

    // 追问结束，给出过渡评价
    const transitions = [
        '好的，我对你的思路有了更深的了解。我们继续下一题。',
        '明白了，谢谢你的补充。接下来我们看另一个方面。',
        '不错，这个问题的讨论就到这里。下一个问题——',
    ];
    state.followUp = { active: false, depth: 0, originalQIdx: -1, direction: '' };
    state.currentQ++;

    setTimeout(() => {
        if (state.currentQ < state.questions.length) {
            const nextQ = applyDifficultyVariant(state.questions[state.currentQ], analysis.nextDifficulty);
            addMessage(msgContainerId, 'bot',
                `🤖 <strong>面试官：</strong>${transitions[Math.floor(Math.random() * transitions.length)]}<br><br>${nextQ}`, true);
            document.getElementById(counterId).textContent = `第 ${state.currentQ + 1}/${state.questions.length} 题`;
        } else {
            addMessage(msgContainerId, 'bot',
                '🤖 <strong>面试官：</strong>好的，面试到此结束。感谢你的参与，请查看评分报告。', true);
            state.active = false;
            setTimeout(() => showDynamicScoreReport(state, scoreDims, scoreCardId, scoreContentId, '财经岗'), 1000);
        }
    }, 800);

    input.value = '';
}

function proceedToNextQuestion(state, msgContainerId, counterId, scoreDims, scoreCardId, scoreContentId, chatCardId) {
    setTimeout(() => {
        if (state.currentQ < state.questions.length) {
            const nextQ = applyDifficultyVariant(
                state.questions[state.currentQ],
                state.context.userLevel === 'advanced' ? 'hard' : 'normal'
            );
            addMessage(msgContainerId, 'bot', `🤖 <strong>面试官：</strong>${nextQ}`, true);
            document.getElementById(counterId).textContent = `第 ${state.currentQ + 1}/${state.questions.length} 题`;
        } else {
            addMessage(msgContainerId, 'bot',
                '🤖 <strong>面试官：</strong>好的，面试到此结束。感谢你的参与，请查看评分报告。', true);
            state.active = false;
            setTimeout(() => showDynamicScoreReport(state, scoreDims, scoreCardId, scoreContentId, '财经岗'), 1000);
        }
        document.getElementById(msgContainerId).scrollTop = document.getElementById(msgContainerId).scrollHeight;
    }, 800);
}

// 动态评分报告
function showDynamicScoreReport(state, dims, cardId, contentId, jobType) {
    const allScores = state.scores;
    const avgScore = allScores.length > 0
        ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
        : 0;

    // 根据回答质量动态生成各维度分数
    const answeredQuestions = state.answers.filter(a => a.answer !== '(跳过)');
    const hasExamples = answeredQuestions.filter(a => a.analysis?.structure?.hasExample).length;
    const hasFramework = answeredQuestions.filter(a => a.analysis?.structure?.hasBody && a.analysis?.structure?.hasConclusion).length;
    const skippedCount = state.answers.filter(a => a.answer === '(跳过)').length;

    const dimScores = dims.map(d => {
        let base = avgScore;
        if (d.key === 'accuracy') base += hasExamples * 2 - skippedCount * 5;
        if (d.key === 'logic') base += hasFramework * 3;
        if (d.key === 'expression') base += (answeredQuestions.length - skippedCount) * 2;
        if (d.key === 'case') base += hasExamples * 4;
        return { ...d, score: Math.max(20, Math.min(98, Math.round(base + Math.floor(Math.random() * 6) - 3))) };
    });

    const totalScore = Math.round(dimScores.reduce((a, b) => a + b.score, 0) / dimScores.length);

    // 智能评语
    let highlights = [], improvements = [];
    if (hasExamples >= 2) highlights.push('善于用具体案例支撑观点，回答有说服力');
    else improvements.push('建议多用具体案例或数据来支撑你的观点');
    if (hasFramework >= 2) highlights.push('回答结构清晰，逻辑层次分明');
    else improvements.push('建议采用"总-分-总"结构组织回答，先给结论再展开');
    if (skippedCount > 0) improvements.push(`跳过了${skippedCount}道题，建议多练习临场应变能力`);
    if (avgScore >= 75) highlights.push('整体表现优秀，专业知识掌握扎实');
    if (avgScore < 50) improvements.push('基础概念需要加强，建议回到知识学习模块进行系统复习');
    if (state.answers.length >= 5) highlights.push('面试态度积极，能应对多轮问答');

    let level = '中等';
    if (totalScore >= 85) level = '优秀';
    else if (totalScore >= 70) level = '良好';
    else if (totalScore < 50) level = '需要提升';

    document.getElementById(cardId).style.display = 'block';
    document.getElementById(contentId).innerHTML = `
        <div style="text-align:center;margin-bottom:20px">
            <div style="font-size:48px;font-weight:800;color:var(--accent)">${totalScore}</div>
            <div style="color:var(--text-secondary)">综合评分（满分100） · 等级：<span style="color:var(--primary);font-weight:600">${level}</span></div>
        </div>
        <div class="score-dimensions">
            ${dimScores.map(d => `
                <div class="score-dim">
                    <span class="dim-name">${d.name}</span>
                    <div class="dim-bar-wrap">
                        <div class="dim-bar" style="width:${d.score}%;background:${d.color}"></div>
                    </div>
                    <span class="dim-score">${d.score}</span>
                </div>
            `).join('')}
        </div>
        <div class="score-summary">
            <h4>📋 智能评估报告</h4>
            ${highlights.length > 0 ? `<p><strong>✅ 亮点：</strong>${highlights.join('；')}。</p>` : ''}
            ${improvements.length > 0 ? `<p><strong>📝 待改进：</strong>${improvements.join('；')}。</p>` : ''}
            <p style="margin-top:8px"><strong>📊 数据统计：</strong>共回答 ${answeredQuestions.length} 题，跳过 ${skippedCount} 题，平均分 ${avgScore}。</p>
        </div>
        <div class="success-box" style="margin-top:12px">
            <strong>💡 提升建议：</strong><br>
            建议每次回答采用"<em>结论先行 → 论据支撑 → 案例佐证 → 总结升华</em>"的四段式结构，
            回答时长控制在1-2分钟，重点突出、逻辑清晰。
        </div>
    `;

    document.getElementById(cardId).scrollIntoView({ behavior: 'smooth' });
}

function skipQuestion() {
    if (!interviewState.active) return;
    interviewState.answers.push({ qIdx: interviewState.currentQ, answer: '(跳过)', score: 20, isSkipped: true });
    interviewState.scores.push(20);
    interviewState.context.skippedCount++;
    interviewState.followUp = { active: false, depth: 0, originalQIdx: -1, direction: '' };
    interviewState.currentQ++;

    if (interviewState.currentQ < interviewState.questions.length) {
        const nextQ = interviewState.questions[interviewState.currentQ];
        addMessage('interviewMessages', 'bot',
            `🤖 <strong>面试官：</strong>没关系，我们来看下一题。<br><br>${nextQ}`, true);
        document.getElementById('questionCounter').textContent = `第 ${interviewState.currentQ + 1}/${interviewState.questions.length} 题`;
    } else {
        addMessage('interviewMessages', 'bot', '🤖 <strong>面试官：</strong>面试结束，请查看评分报告。');
        interviewState.active = false;
        setTimeout(() => showDynamicScoreReport(interviewState, jobScoreDims, 'scoreCard', 'scoreContent', '财经岗'), 500);
    }
}

function getHint() {
    if (!interviewState.active) return;
    const hints = [
        '💡 提示：尝试用STAR法则（情境-任务-行动-结果）组织你的回答。',
        '💡 提示：先给出结论，再展开论述，最后总结。',
        '💡 提示：结合具体的数据或案例会让回答更有说服力。',
        '💡 提示：注意控制回答时间，每个问题1-2分钟为宜。',
        '💡 提示：如果一时想不起来，可以先说"请给我几秒钟思考"，组织好语言再回答。',
    ];
    addMessage('interviewMessages', 'bot', hints[Math.floor(Math.random() * hints.length)]);
}

function endInterview() {
    interviewState.active = false;
    const persona = window.interviewAgent?.personalities?.[interviewState.personality] || window.interviewAgent?.personalities?.professional;
    const closing = persona ? persona.closingPhrase : '面试结束。请查看下方评分报告。';
    addMessage('interviewMessages', 'bot', `🤖 <strong>面试官：</strong>${closing}`);
    setTimeout(() => showAgentScoreReport(interviewState, jobScoreDims, 'scoreCard', 'scoreContent'), 500);
}

// ========== 语音模式 ==========
function toggleVoice() {
    const btn = document.getElementById('btnVoice');
    btn.classList.toggle('recording');
    if (btn.classList.contains('recording')) {
        btn.textContent = '🔴';
        addMessage('interviewMessages', 'bot', '🎤 语音模式已开启，请对着麦克风回答。系统将记录你的语音回答并转文字分析。');
    } else {
        btn.textContent = '🎤';
        addMessage('interviewMessages', 'bot', '🎤 语音模式已关闭。');
    }
}

// ============================================================
// 场景二：理工岗求职面试（全面升级）
// ============================================================

const techProfessionalQuestions = {
    software: [
        '请解释面向对象编程的三大特性，并举例说明。',
        '谈谈你对微服务架构的理解，它和单体架构相比有什么优缺点？',
        '如何设计一个高并发的秒杀系统？请描述关键设计思路。',
        '请解释数据库索引的原理，B+树和Hash索引的区别是什么？',
        '你在项目中遇到过什么技术难题？是如何解决的？',
        '请谈谈你对CAP理论的理解，在实际系统中如何权衡？',
    ],
    frontend: [
        '请解释浏览器渲染页面的过程，从输入URL到页面展示发生了什么？',
        'React/Vue的虚拟DOM原理是什么？它如何提升性能？',
        '请谈谈你对前端性能优化的理解，有哪些常用策略？',
        '什么是跨域问题？有哪些解决方案？请说明各自的适用场景。',
        '请描述一个你做过的最复杂的前端项目，你承担了什么角色？',
        '前端工程化方面，你用过哪些工具链？请谈谈你的实践。',
    ],
    algorithm: [
        '请解释Transformer模型的注意力机制原理。',
        '什么是过拟合？有哪些常用的防止过拟合的方法？',
        '请解释梯度下降算法的原理，SGD、Adam等优化器有什么区别？',
        '如何处理样本不均衡问题？请列举至少三种方法。',
        '请描述一个你参与过的机器学习项目，从数据处理到模型上线的完整流程。',
        '请解释偏差-方差权衡（Bias-Variance Tradeoff）。',
    ],
    data: [
        '请解释数据仓库和数据库的区别，以及各自的适用场景。',
        '什么是ETL流程？请说明每个阶段的关键任务。',
        'SQL中JOIN有哪几种类型？请分别举例说明。',
        '如何设计一个数据指标体系？需要考虑哪些因素？',
        '请谈谈你对大数据技术栈（Hadoop/Spark/Flink）的理解。',
        '数据治理的核心要素有哪些？请举例说明。',
    ],
    embedded: [
        '请解释中断处理的基本流程，中断优先级如何处理？',
        '什么是RTOS？和通用操作系统有什么区别？',
        '请解释I2C、SPI、UART三种通信协议的异同。',
        '嵌入式系统中如何管理内存？谈谈你对内存泄漏检测的理解。',
        '请描述一个你做过的嵌入式项目，遇到的最大挑战是什么？',
    ],
    mechanical: [
        '请解释有限元分析（FEA）的基本原理和应用场景。',
        '什么是公差分析？为什么在机械设计中很重要？',
        '请解释材料力学中应力-应变曲线的含义。',
        '常见的机械传动方式有哪些？各自的优缺点是什么？',
        '请谈谈你对智能制造/工业4.0的理解。',
    ],
    electrical: [
        '请解释基尔霍夫电流定律和电压定律，并举例说明应用。',
        '什么是傅里叶变换？它在信号处理中有什么应用？',
        '请解释PID控制算法的原理，三个参数分别起什么作用？',
        '数字电路和模拟电路的主要区别是什么？',
        '请谈谈你对5G通信技术的理解。',
    ],
    civil: [
        '请解释钢筋混凝土结构中"强柱弱梁"的设计理念。',
        '什么是地基承载力的确定方法？有哪些常用的地基处理技术？',
        '请说明BIM技术在建筑工程中的应用和价值。',
        '抗震设计中"三水准"设防目标是什么？',
        '请谈谈你对绿色建筑和可持续发展的理解。',
    ],
    chemical: [
        '请解释化工过程中传热、传质的基本原理。',
        '什么是催化剂？它在化工生产中起什么作用？',
        '请说明精馏操作的基本原理和影响因素。',
        '谈谈你对化工安全管理的理解，有哪些关键要素？',
        '请描述一种新型材料的发展趋势及其应用前景。',
    ],
    general: [
        '请谈谈你对所学专业领域前沿技术的了解。',
        '你认为一个优秀的工程师需要具备哪些核心能力？',
        '如果遇到一个完全陌生的技术问题，你会如何着手解决？',
        '请分析一下当前科技发展趋势对你所学专业的影响。',
        '你对未来五年的技术职业规划是什么？',
    ],
};

const techProjectQuestions = {
    software: [
        '请详细介绍你做过的项目中技术架构最复杂的一个。',
        '在项目开发中，你是如何进行代码review的？',
        '如果让你重新设计这个系统，你会做哪些改进？',
        '你在项目中如何保证代码质量和系统稳定性？',
        '请描述一次线上故障排查经历，你学到了什么？',
    ],
    frontend: [
        '请介绍你做过的前端项目中组件化设计是如何实现的？',
        '你如何做前端项目的技术选型？考虑哪些因素？',
        '请描述你处理过的最棘手的前端兼容性问题。',
        '你是如何管理前端项目中的状态和数据流的？',
    ],
    algorithm: [
        '请详细介绍你的一个核心算法项目，模型的评估指标是多少？',
        '在模型部署过程中遇到过什么挑战？如何解决的？',
        '你是如何进行特征工程的？分享一个你觉得最有价值的特征设计。',
    ],
    general: [
        '请详细介绍一个最能代表你技术水平的项目。',
        '在团队协作中，你如何推动项目进展？',
        '你对开源项目有什么贡献或参与经历？',
        '你是如何保持技术学习和知识更新的？',
    ],
};

const techScoreDims = [
    { name: '技术深度', key: 'depth', color: '#059669' },
    { name: '项目经验', key: 'project', color: '#8b5cf6' },
    { name: '逻辑思维', key: 'logic', color: '#10b981' },
    { name: '表达沟通', key: 'expression', color: '#f59e0b' },
];

function startTechInterview(type, btn) {
    const direction = document.getElementById('techJobDirection').value;
    const jd = document.getElementById('techJobJD').value.trim();

    techInterviewState = createInterviewSession();
    techInterviewState.active = true;
    techInterviewState.type = type;

    if (type === 'professional') {
        techInterviewState.questions = [...(techProfessionalQuestions[direction] || techProfessionalQuestions['general'])];
    } else if (type === 'project') {
        techInterviewState.questions = [...(techProjectQuestions[direction] || techProjectQuestions['general'])];
    } else if (type === 'hr') {
        techInterviewState.questions = [...hrQuestions];
    } else if (type === 'behavior') {
        techInterviewState.questions = [...behaviorQuestions];
    }

    if (jd && (type === 'professional' || type === 'project')) {
        techInterviewState.questions.unshift(`根据你应聘的岗位JD，请谈谈你对"${jd.substring(0, 40)}..."这个技术岗位的理解。`);
    }

    if (techInterviewState.questions.length > 1) {
        const first = techInterviewState.questions[0];
        const rest = techInterviewState.questions.slice(1).sort(() => Math.random() - 0.5);
        techInterviewState.questions = [first, ...rest];
    }

    document.getElementById('techInterviewChatCard').style.display = 'block';
    document.getElementById('techScoreCard').style.display = 'none';

    const typeNames = { professional: '专业技术面试', hr: 'HR综合面试', behavior: '行为面试', project: '项目/技术深挖' };
    document.getElementById('techInterviewTitle').textContent = `🎙️ ${typeNames[type]}`;
    document.getElementById('techQuestionCounter').textContent = `第 1/${techInterviewState.questions.length} 题`;

    const msgs = document.getElementById('techInterviewMessages');
    msgs.innerHTML = '';
    const firstQ = applyDifficultyVariant(techInterviewState.questions[0], 'normal');
    addMessage('techInterviewMessages', 'bot',
        `🤖 <strong>面试官：</strong>你好，欢迎参加本次技术模拟面试。${firstQ}`, true);
    document.getElementById('techInterviewChatCard').scrollIntoView({ behavior: 'smooth' });
}

function sendTechInterviewAnswer() {
    if (!techInterviewState.active) return;
    const input = document.getElementById('techInterviewInput');
    const answer = input.value.trim();
    if (!answer) return;

    if (techInterviewState.followUp.active) {
        handleFollowUpAnswer(techInterviewState, 'techInterviewMessages', 'techInterviewInput',
            'techQuestionCounter', techScoreDims, 'techScoreCard', 'techScoreContent', 'techInterviewChatCard');
        input.value = '';
        return;
    }

    addMessage('techInterviewMessages', 'user', answer);
    const analysis = analyzeAnswer(answer, techInterviewState.type);
    techInterviewState.context.history.push({ q: techInterviewState.questions[techInterviewState.currentQ], a: answer, analysis });

    const score = dynamicScore(analysis, techInterviewState.context);
    techInterviewState.scores.push(score);
    techInterviewState.answers.push({ qIdx: techInterviewState.currentQ, answer, score, analysis });
    techInterviewState.context.answeredCount++;
    input.value = '';

    if (analysis.shouldFollowUp && techInterviewState.currentQ < techInterviewState.questions.length - 1) {
        techInterviewState.followUp.active = true;
        techInterviewState.followUp.depth = 1;
        techInterviewState.followUp.originalQIdx = techInterviewState.currentQ;
        techInterviewState.followUp.direction = analysis.followUpDirection;

        const followUp = generateSmartFollowUp(techInterviewState.context, analysis, techInterviewState.type);
        setTimeout(() => {
            addMessage('techInterviewMessages', 'bot', `🤖 <strong>面试官：</strong>${followUp}`, true);
        }, 800);
        return;
    }

    techInterviewState.currentQ++;
    techInterviewState.followUp = { active: false, depth: 0, originalQIdx: -1, direction: '' };
    proceedToNextQuestion(techInterviewState, 'techInterviewMessages', 'techQuestionCounter',
        techScoreDims, 'techScoreCard', 'techScoreContent', 'techInterviewChatCard');
}

function skipTechQuestion() {
    if (!techInterviewState.active) return;
    techInterviewState.answers.push({ qIdx: techInterviewState.currentQ, answer: '(跳过)', score: 20, isSkipped: true });
    techInterviewState.scores.push(20);
    techInterviewState.context.skippedCount++;
    techInterviewState.followUp = { active: false, depth: 0, originalQIdx: -1, direction: '' };
    techInterviewState.currentQ++;
    if (techInterviewState.currentQ < techInterviewState.questions.length) {
        addMessage('techInterviewMessages', 'bot',
            `🤖 <strong>面试官：</strong>没关系，我们看下一题。<br><br>${techInterviewState.questions[techInterviewState.currentQ]}`, true);
        document.getElementById('techQuestionCounter').textContent = `第 ${techInterviewState.currentQ + 1}/${techInterviewState.questions.length} 题`;
    } else {
        addMessage('techInterviewMessages', 'bot', '🤖 <strong>面试官：</strong>面试结束。请查看评分报告。');
        techInterviewState.active = false;
        setTimeout(() => showDynamicScoreReport(techInterviewState, techScoreDims, 'techScoreCard', 'techScoreContent', '理工岗'), 500);
    }
}

function getTechHint() {
    if (!techInterviewState.active) return;
    const hints = [
        '💡 技术问题建议先讲原理，再举实际应用场景，最后总结优缺点。',
        '💡 用STAR法则描述项目经历 — 背景、任务、行动、结果。',
        '💡 如果不会某个具体技术点，可以讲相关的知识点和学习能力。',
        '💡 系统设计题建议从需求分析 → 架构设计 → 细节实现的思路展开。',
        '💡 技术面试中"我不知道但我会这样去学"也是一个不错的回答策略。',
    ];
    addMessage('techInterviewMessages', 'bot', hints[Math.floor(Math.random() * hints.length)]);
}

function endTechInterview() {
    techInterviewState.active = false;
    addMessage('techInterviewMessages', 'bot', '🤖 <strong>面试官：</strong>面试结束。请查看下方评分报告。');
    setTimeout(() => showAgentScoreReport(techInterviewState, techScoreDims, 'techScoreCard', 'techScoreContent'), 500);
}

// ============================================================
// 场景三：考证&升学复试（升级版）
// ============================================================

const examOralQuestions = {
    definition: [
        '请解释什么是"货币政策传导机制"。',
        '请定义并解释"有效市场假说"（EMH）。',
        '什么是"流动性陷阱"？请给出定义并说明。',
        '请解释"机会成本"的概念并举例。',
        '什么是"资产证券化"？请简述其基本原理。',
    ],
    shortanswer: [
        '请简述凯恩斯货币需求理论的三大动机。',
        '试比较直接融资和间接融资的优缺点。',
        '请说明通货膨胀的主要成因及其治理措施。',
        '简述商业银行资产负债管理的基本原则。',
        '请阐述注册制改革对中国资本市场的意义。',
    ],
    case: [
        '某上市公司突然公告业绩大幅下滑，股价连续跌停。请从投资者角度分析应关注哪些要点。',
        '某国央行突然宣布大幅加息，请分析这对该国股市、债市和汇率的影响。',
        '一家初创公司计划融资，请你分析股权融资和债权融资各自的利弊。',
    ],
};

const hotTopics = [
    '近期央行降准对经济和股市的影响，请谈谈你的看法。',
    '数字人民币的推广对传统银行业务模式会产生什么冲击？',
    '注册制全面推行后，散户投资者应该如何调整投资策略？',
    'ESG投资理念在中国的发展前景如何？请论述。',
    '金融科技（AI、大数据）对传统金融行业是颠覆还是赋能？',
];

const stemExamQuestions = {
    stem_definition: [
        '请解释什么是"时间复杂度"和"空间复杂度"，并举例说明。',
        '请定义并解释"傅里叶变换"的物理意义。',
        '什么是"熵"？在信息论和热力学中分别如何理解？',
        '请解释"牛顿三大定律"并各举一个实际应用例子。',
        '什么是"正则化"？在机器学习中L1和L2正则化有什么区别？',
        '请解释"薛定谔方程"的基本含义及其在量子力学中的地位。',
        '什么是"卷积"？请说明其在图像处理和信号处理中的应用。',
        '请解释"数据库事务"的ACID特性。',
    ],
    stem_derive: [
        '请推导最小二乘法的解析解，并说明其假设条件。',
        '请推导欧拉公式 e^(iθ) = cosθ + i sinθ。',
        '请用数学归纳法证明一个你熟悉的定理。',
        '请解释并推导梯度下降的更新公式。',
        '请推导简谐运动的运动方程并说明各参数含义。',
        '请解释贝叶斯定理并推导其公式。',
        '请解释并推导PCA（主成分分析）的数学原理。',
    ],
    stem_experiment: [
        '请描述你在本科/研究生阶段做过的最有代表性的实验项目。',
        '在实验中如果数据出现异常，你通常如何排查和处理？',
        '请描述一个你做过的编程项目，你用了什么数据结构和算法？',
        '请说明实验设计中对照组设置的重要性，并举例。',
        '如果让你设计一个验证某某理论的实验，你会怎么设计？',
        '请谈谈你对科学实验可重复性的理解。',
        '你使用过哪些实验仪器/软件工具？最熟练的是什么？',
        '请描述一次实验失败的经历，你从中学到了什么？',
    ],
};

const stemHotTopics = [
    '人工智能大模型的发展对科研和产业的影响，请谈谈你的看法。',
    '量子计算的发展现状与未来应用前景如何？',
    '碳中和目标下，新能源技术的发展方向和挑战是什么？',
    'ChatGPT等AI工具对编程行业是机遇还是威胁？请论述。',
    '自动驾驶技术的发展瓶颈在哪里？离大规模商用还有多远？',
    '芯片制造"卡脖子"问题，你认为中国应该如何突破？',
    '脑机接口技术的发展现状和伦理问题，请谈谈你的看法。',
    '数字经济时代，传统工科专业如何转型升级？',
];

function startExamOral(type) {
    const category = document.getElementById('examSubjectCategory')?.value || 'finance';
    let questions, title;

    if (category === 'stem') {
        const mapped = { definition: 'stem_definition', shortanswer: 'stem_derive', case: 'stem_experiment' };
        const mappedType = type.startsWith('stem_') ? type : (mapped[type] || 'stem_definition');
        questions = stemExamQuestions[mappedType] || stemExamQuestions['stem_definition'];
        const typeNames = { stem_definition: '概念/定理口述', stem_derive: '公式/推导论述', stem_experiment: '实验/项目论述' };
        title = typeNames[mappedType];
    } else {
        questions = examOralQuestions[type] || examOralQuestions['definition'];
        const typeNames = { definition: '名词解释口述', shortanswer: '简答论述', case: '财经案例分析' };
        title = typeNames[type];
    }

    examInterviewState = createInterviewSession();
    examInterviewState.active = true;
    examInterviewState.questions = [...questions];
    const q = questions[Math.floor(Math.random() * questions.length)];

    document.getElementById('examChatCard').style.display = 'block';
    document.getElementById('examInterviewTitle').textContent = `🎤 ${title}`;
    const msgs = document.getElementById('examMessages');
    msgs.innerHTML = '';
    addMessage('examMessages', 'bot', `🤖 <strong>考官：</strong>${q}`, true);
    document.getElementById('examChatCard').scrollIntoView({ behavior: 'smooth' });
}

function startHotTopic() {
    const q = hotTopics[Math.floor(Math.random() * hotTopics.length)];
    examInterviewState = createInterviewSession();
    examInterviewState.active = true;
    examInterviewState.questions = [...hotTopics];
    document.getElementById('examChatCard').style.display = 'block';
    document.getElementById('examInterviewTitle').textContent = '🔥 热点即兴论述';
    const msgs = document.getElementById('examMessages');
    msgs.innerHTML = '';
    addMessage('examMessages', 'bot', `🤖 <strong>考官：</strong>${q}`, true);
    document.getElementById('examChatCard').scrollIntoView({ behavior: 'smooth' });
}

function sendExamAnswer() {
    if (!examInterviewState.active) return;
    const input = document.getElementById('examInput');
    const answer = input.value.trim();
    if (!answer) return;

    addMessage('examMessages', 'user', answer);
    const analysis = analyzeAnswer(answer, 'exam');
    input.value = '';

    // 智能点评
    setTimeout(() => {
        let feedback;
        if (analysis.quality === 'excellent') {
            feedback = '回答非常出色！概念准确，逻辑清晰，展现了扎实的专业功底。继续保持这个水平！';
        } else if (analysis.quality === 'good') {
            feedback = '回答不错，核心要点把握准确。如果能再补充一个实际案例或应用场景会更有说服力。';
        } else if (analysis.quality === 'medium') {
            feedback = '回答基本正确，但深度可以再加强。建议从"是什么→为什么→怎么用"三个层面展开论述。';
        } else {
            feedback = '回答过于简略。建议先给出明确定义，再展开解释核心要点，最后结合实际举例说明。';
        }

        let followUp = '';
        if (analysis.shouldFollowUp && examInterviewState.questions.length > 1) {
            const nextQ = examInterviewState.questions[Math.floor(Math.random() * examInterviewState.questions.length)];
            const followUps = [
                `能否再深入谈谈你的理解？另外，请回答下一题：${nextQ}`,
                `你的回答让我想追问：如果从另一个角度来看呢？顺便，请回答：${nextQ}`,
                `不错，我们换个方向：${nextQ}`,
            ];
            followUp = '<br><br>' + followUps[Math.floor(Math.random() * followUps.length)];
        } else {
            const nextQ = examInterviewState.questions[Math.floor(Math.random() * examInterviewState.questions.length)];
            followUp = `<br><br>下一题：${nextQ}`;
        }

        addMessage('examMessages', 'bot',
            `🤖 <strong>考官点评：</strong>${feedback}${followUp}`, true);
    }, 800);
}

function startStemHotTopic() {
    const q = stemHotTopics[Math.floor(Math.random() * stemHotTopics.length)];
    examInterviewState = createInterviewSession();
    examInterviewState.active = true;
    examInterviewState.questions = [...stemHotTopics];
    document.getElementById('examChatCard').style.display = 'block';
    document.getElementById('examInterviewTitle').textContent = '💡 学科前沿论述';
    const msgs = document.getElementById('examMessages');
    msgs.innerHTML = '';
    addMessage('examMessages', 'bot', `🤖 <strong>考官：</strong>${q}`, true);
    document.getElementById('examChatCard').scrollIntoView({ behavior: 'smooth' });
}

function switchExamCategory() {
    const category = document.getElementById('examSubjectCategory').value;
    document.getElementById('examFinanceBtns').style.display = category === 'finance' ? 'block' : 'none';
    document.getElementById('examStemBtns').style.display = category === 'stem' ? 'block' : 'none';
    document.getElementById('examChatCard').style.display = 'none';
}

// ============================================================
// 场景四：配套联动功能（Coze AI 智能体集成）
// ============================================================

// Coze 面试智能体配置
const LINKED_AI_CONFIG = {
    botId: '7647133038182170639',
    apiUrl: 'https://api.coze.cn/v3/chat',
    accessToken: 'pat_ZpsorG48WgFU36y8jM8f1mhON6LTaaDs3pVp8MuNokNFj6WhduC7wSGjV7aVkoUU',
};

let _linkedAiConversationId = '';
let _linkedAiIsThinking = false;

function showLinkedFeature(feature) {
    const result = document.getElementById('linkedResult');
    switch (feature) {
        case 'material':
            result.innerHTML = `
                <div class="success-box">
                    <h4>📦 面试素材自动沉淀</h4>
                    <p>系统已调取你的学习记录和错题数据，自动提炼以下面试可用素材：</p>
                    <ul>
                        <li><strong>专业知识储备：</strong>会计基础、财经基础、证券投资等核心概念</li>
                        <li><strong>实战案例：</strong>从错题中提炼的典型问题分析思路</li>
                        <li><strong>热点话题：</strong>货币政策、注册制改革等财经热点观点</li>
                    </ul>
                    <p style="margin-top:8px"><em>💡 面试时可直接调用这些素材，展现扎实的专业功底。</em></p>
                </div>`;
            break;
        case 'plan':
            result.innerHTML = `
                <div class="info-box">
                    <h4>📅 面试冲刺备考规划（以7天为例）</h4>
                    <div style="margin:12px 0">
                        <p><strong>第1-2天：</strong>知识点复盘 → 回顾核心专业知识，整理面试话术</p>
                        <p><strong>第3-5天：</strong>全真模拟面试 → 每天2轮模拟，覆盖专业+HR+行为面试</p>
                        <p><strong>第6-7天：</strong>错题补强 → 针对模拟中暴露的问题专项突破</p>
                    </div>
                    <p><em>💡 建议每天投入1-2小时，与整体学习规划体系互通。</em></p>
                </div>`;
            break;
        case 'bilingual':
            result.innerHTML = `
                <div class="info-box">
                    <h4>🌐 中英双语面试演练</h4>
                    <p><strong>英文自我介绍模板：</strong></p>
                    <p style="background:#1e293b;color:#e2e8f0;padding:12px;border-radius:8px;font-size:13px">
                        Hello, my name is [Name]. I graduated from [University] with a degree in [Major]. 
                        I have [X] years of experience in [Industry]. My key strengths include [Skill 1], 
                        [Skill 2], and [Skill 3]. I'm passionate about [Interest] and I'm excited about 
                        this opportunity because [Reason]. Thank you.
                    </p>
                    <p style="margin-top:8px"><em>💡 外企和跨境金融岗位面试建议准备全英文的专业问答。</em></p>
                </div>`;
            break;
        case 'techbilingual':
            result.innerHTML = `
                <div class="info-box">
                    <h4>💻 技术英语面试</h4>
                    <p><strong>常见技术英文术语：</strong></p>
                    <p style="background:#1e293b;color:#e2e8f0;padding:12px;border-radius:8px;font-size:13px">
                        <strong>Algorithm Complexity:</strong> Time complexity O(n), Space complexity O(1)<br>
                        <strong>Data Structures:</strong> Array, Linked List, Stack, Queue, Tree, Graph, Hash Table<br>
                        <strong>System Design:</strong> Load Balancer, Cache, Database Sharding, Microservices<br>
                        <strong>Machine Learning:</strong> Overfitting, Regularization, Gradient Descent, Feature Engineering
                    </p>
                    <p style="margin-top:8px"><strong>英文技术自我介绍模板：</strong></p>
                    <p style="background:#1e293b;color:#e2e8f0;padding:12px;border-radius:8px;font-size:13px">
                        Hi, I'm [Name], a [Major] graduate from [University]. My technical stack includes [Tech1], [Tech2], and [Tech3]. 
                        I've worked on projects involving [Project description]. I'm passionate about [Interest area].
                    </p>
                    <p style="margin-top:8px"><em>💡 外企技术面试建议准备英文版的项目介绍和技术方案讲解。</em></p>
                </div>`;
            break;
    }
}

// ========== 切换/折叠 AI 面板 ==========
function toggleLinkedAi() {
    const body = document.getElementById('linkedAiBody');
    const toggleBtn = document.querySelector('.linked-ai-toggle');
    if (body.style.display === 'none') {
        body.style.display = 'flex';
        toggleBtn.textContent = '−';
    } else {
        body.style.display = 'none';
        toggleBtn.textContent = '+';
    }
}

// ========== 调用 Coze 面试智能体 ==========
async function callLinkedAiBot(question) {
    if (!LINKED_AI_CONFIG.accessToken) {
        throw new Error('未配置Coze访问令牌');
    }

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LINKED_AI_CONFIG.accessToken}`,
    };

    const chatBody = {
        bot_id: LINKED_AI_CONFIG.botId,
        user_id: 'linked_user_' + Date.now(),
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

    if (_linkedAiConversationId) {
        chatBody.conversation_id = _linkedAiConversationId;
    }

    // 添加超时控制（15秒）
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    let response;
    try {
        response = await fetch(LINKED_AI_CONFIG.apiUrl, {
            signal: controller.signal,
            method: 'POST',
            headers: headers,
            body: JSON.stringify(chatBody),
        });
    } finally {
        clearTimeout(timeoutId);
    }

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

            if (eventData.conversation_id) {
                _linkedAiConversationId = eventData.conversation_id;
            }

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

    if (!replyText || !replyText.trim()) {
        throw new Error('API返回空内容，切换到本地智能体');
    }
    return replyText;
}

// ========== 本地AI面试助手（不依赖外部API） ==========
function generateLinkedAiResponse(question) {
    const q = question.toLowerCase();

    // 1. 备战方案
    if (q.includes('备战') || q.includes('方案') || q.includes('计划') || q.includes('准备')) {
        return `好的！我为你定制了一套**面试备战方案**：

**📋 第一阶段：知己知彼（准备期，建议3-5天）**
• 研究目标公司/岗位的JD，提炼核心能力要求
• 梳理自己的项目经历，准备STAR法则话术
• 准备3-5个有深度的反问问题

**🎯 第二阶段：核心能力打磨（强化期，建议5-7天）**
• 专业知识：梳理岗位相关的核心知识点框架
• 行为面试：准备"团队协作""冲突处理""失败经历"等经典问题
• 技术面试：刷高频题 + 系统设计题练习

**🔄 第三阶段：全真模拟（冲刺期，建议3天）**
• 每天至少1轮模拟面试，覆盖专业+HR+行为
• 录音回听，分析语速、逻辑、停顿
• 针对薄弱环节专项突破

**💡 面试前一天：**
• 整理仪表、准备材料、规划路线
• 深呼吸放松，保持自信心态

需要我针对某个具体环节详细展开吗？`;
    }

    // 2. 自我介绍
    if (q.includes('自我介绍') || q.includes('介绍自己')) {
        return `以下是**自我介绍结构化模板**：

**⏱️ 时长控制：** 1-2分钟最佳

**📝 结构框架：**
\`\`\`
1. 我是谁（15秒）
   "面试官你好，我是XX，XX大学XX专业毕业"

2. 我的核心优势（45秒）
   "我有X年XX行业经验，擅长XX..."
   用数据说话："主导过X个项目，提升效率X%"

3. 我为什么适合（30秒）
   "我对贵司的XX业务非常感兴趣..."
   将经历与JD要求对应

4. 收尾（15秒）
   "期待有机会加入团队，谢谢"
\`\`\`

**💡 高分技巧：**
• 开头用一句"钩子"引起兴趣
• 用STAR法则描述亮点经历
• 结尾留一个"诱饵"引导追问

需要我根据你的具体岗位帮你写一段吗？`;
    }

    // 3. 缺点/不足
    if (q.includes('缺点') || q.includes('不足') || q.includes('劣势')) {
        return `关于"你最大的缺点是什么"的**高分回答策略**：

**⚠️ 避坑指南（不要说）：**
• ❌ "我太追求完美了"（太假）
• ❌ "我没有明显缺点"（自大）
• ❌ "我脾气不好/爱拖延"（真实但致命）

**✅ 正确策略：**

**1. 选一个"可改进的缺点"**
• "我有时太关注细节，导致项目进度受影响"
• "在公开演讲方面还需要加强"
• "跨部门沟通时偶尔不够主动"

**2. 展示改进行动（关键！）**
• "我现在会用番茄钟来管理时间"
• "我参加了演讲俱乐部，每周练习"
• "我开始主动组织跨部门周会"

**3. 包装成"成长的经历"**
"这其实也是我在XX项目中领悟到的，后来..."

**💡 万能公式：** 真实的缺点 + 具体的改进措施 + 已取得的进步

需要我帮你针对某个具体场景定制回答吗？`;
    }

    // 4. 模拟陪练
    if (q.includes('模拟') || q.includes('陪练') || q.includes('练习') || q.includes('面试我')) {
        return `好的，我来扮演**专业面试官**，开始一轮模拟面试：

---

**面试官：** 同学你好，感谢你来参加今天的面试。首先请你做一个简短的自我介绍。

（请在对话框中输入你的回答，我会根据你的回答继续追问和点评）

---

💡 **模拟面试规则：**
1. 我会模拟真实面试流程，包含专业提问、行为面试和压力测试
2. 每个回答后我会给出追问或点评
3. 面试结束后我会给出综合评估报告

准备好了吗？请在对话框中输入你的自我介绍！`;
    }

    // 5. 薪资期望
    if (q.includes('薪资') || q.includes('工资') || q.includes('薪酬') || q.includes('期望') || q.includes('待遇')) {
        return `关于"你的薪资期望是多少"的**回答策略**：

**✅ 推荐回答框架：**

**情况一：有明确预期**
"根据我的调研，这个岗位在市场上的薪酬范围是X-Y万。结合我的经验和能力，我期望的薪资是Z万。当然，我也看重公司的整体发展前景和培训机会。"

**情况二：不太确定（应届生/转行）**
"我更看重这个岗位的成长空间和学习机会。关于薪资，我相信公司有一套公平的薪酬体系。能否请您介绍一下这个岗位的薪资结构？"

**💡 关键技巧：**
• 提前调研行业薪资水平（Boss直聘/脉脉/猎聘）
• 给出一个范围而不是具体数字
• 强调"整体回报"而非只看底薪
• 不要一上来就问，等HR主动提及或面试后期再问

需要我帮你根据具体城市和岗位分析薪资水平吗？`;
    }

    // 6. 离职原因
    if (q.includes('离职') || q.includes('离开') || q.includes('跳槽') || q.includes('为什么走')) {
        return `关于"你为什么离职"的**高分回答策略**：

**⚠️ 绝对不要说的：**
• ❌ "领导不行/公司太烂"（负能量）
• ❌ "加班太多/太累"（不职业）
• ❌ "工资太低"（太功利）

**✅ 推荐话术：**

**正面型：**
"我在前公司学到了很多，也做出了XX成绩。但现在我希望在XX方向上有更深的发展，而贵司的XX业务正好契合我的职业规划。"

**成长型：**
"前公司平台很好，但我感觉自己的成长遇到了瓶颈。我希望找到一个能让我持续挑战自我、发挥更大价值的平台。"

**客观型：**
"由于公司业务调整/组织架构变动，我负责的XX项目被裁撤。虽然遗憾，但这也给了我重新思考职业方向的机会。"

**💡 核心原则：** 正面、简洁、指向未来，不要抱怨过去`;
    }

    // 7. 优势/亮点
    if (q.includes('优势') || q.includes('亮点') || q.includes('为什么录用你') || q.includes('核心竞争力') || q.includes('胜任')) {
        return `关于"你的优势/为什么录用你"的**回答策略**：

**✅ 推荐框架：3个核心优势 + 证据支撑**

**示例回答：**
"我认为我有3个核心优势与这个岗位高度匹配：

**1. 专业能力扎实**
我在XX领域有X年经验，主导过XX项目，取得了XX成果（用数据说话）。

**2. 学习能力强**
比如我曾用X个月自学XX技能，并应用到XX项目中，提升了X%效率。

**3. 团队协作好**
在XX项目中，我协调了X个部门，最终提前X天完成了目标。"

**💡 高分技巧：**
• 优势要与JD要求对应
• 每个优势配一个具体案例
• 用数据量化成果
• 控制在3个以内，讲深不讲多`;
    }

    // 8. 职业规划
    if (q.includes('规划') || q.includes('职业') || q.includes('未来') || q.includes('五年') || q.includes('三年')) {
        return `关于"你的职业规划是什么"的**高分回答**：

**✅ 推荐框架：短期（1年）+ 中期（3年）+ 长期（5年）**

**示例回答：**
"我的职业规划分为三个阶段：

**短期（1年内）：** 快速融入团队，精通岗位核心技能，独立负责XX类项目，成为团队可靠的执行者。

**中期（3年内）：** 在XX领域积累深厚的专业经验，能够带领小团队完成复杂项目，成为团队的核心骨干。

**长期（5年以上）：** 向XX方向发展（如技术专家/管理岗位），为公司创造更大价值，同时实现个人职业理想。

**💡 关键技巧：**
• 目标要具体、可衡量
• 展示稳定性（不要给人一种"干两年就跑"的感觉）
• 强调与公司发展的契合度
• 不要好高骛远，也不要胸无大志`;
    }

    // 9. 压力/挑战/失败
    if (q.includes('压力') || q.includes('挑战') || q.includes('困难') || q.includes('失败') || q.includes('挫折') || q.includes('冲突')) {
        return `关于"压力/挑战/失败经历"类问题的**STAR回答模板**：

**✅ 万能公式：STAR法则**

**S（情境）：** "在XX项目中，我们遇到了XX困难..."

**T（任务）：** "我的任务是XX，需要在X时间内完成..."

**A（行动）：** "我采取了以下措施：①...②...③..."

**R（结果）：** "最终我们提前/按期完成了目标，取得了XX成果（用数据）。"

**📌 常见问题对应：**
• "描述一次你克服重大困难的经历" → 选技术/业务难题
• "和上级意见不一致怎么办" → 强调沟通、求同存异
• "最大的一次失败" → 选早期经历，重点讲学到了什么

**💡 避坑：**
• 不要选涉及人品/诚信的问题
• 失败经历要选"已克服"的，不要选还没解决的
• 结果尽量量化`;
    }

    // 10. 加班/996
    if (q.includes('加班') || q.includes('996') || q.includes('工作强度') || q.includes('能接受')) {
        return `关于"能否接受加班"的**高情商回答**：

**✅ 推荐回答：**
"我理解项目紧急时加班是必要的，我自己也会主动投入确保任务按时高质量完成。同时，我也注重工作效率，会尽量在正常工作时间内完成目标。我相信合理的加班和高效的工作是可以兼顾的。"

**💡 不同场景调整：**
• **互联网/创业公司：** 可以适度表达"愿意为共同目标付出"
• **国企/外企：** 强调"效率优先，必要时配合"
• **不要直接说：** "不接受加班"或"没问题，我随时可以加"

**核心原则：** 表达合作意愿 + 强调效率 + 不卑不亢`;
    }

    // 11. 反问环节
    if (q.includes('反问') || q.includes('问什么') || q.includes('提问') || q.includes('要问')) {
        return `面试结束时"你有什么问题问我吗"的**高分反问清单**：

**✅ 推荐问题（按优先级）：**

**1. 岗位相关（展示兴趣）**
• "这个岗位目前面临的最大挑战是什么？"
• "团队希望我入职后3个月内重点解决什么问题？"
• "这个岗位的晋升路径是怎样的？"

**2. 团队文化（展示融入意愿）**
• "团队的工作风格是怎样的？偏协作还是独立？"
• "公司对新人的培养机制有哪些？"

**3. 业务理解（展示思考深度）**
• "公司/部门今年的核心目标是什么？"
• "您如何看待XX行业（竞争对手/趋势）？"

**⚠️ 不要问：**
• ❌ 薪资福利（等HR面或offer阶段再问）
• ❌ 加班多不多（显得怕吃苦）
• ❌ 我能被录取吗（不自信）
• ❌ 网上能查到的公司基本信息（显得没做功课）`;
    }

    // 12. 无经验/转行
    if (q.includes('转行') || q.includes('没经验') || q.includes('零基础') || q.includes('跨专业')) {
        return `关于"无经验/转行"的**高情商回答策略**：

**✅ 核心思路：可迁移能力 + 学习意愿 + 已有准备**

**示例回答：**
"虽然我之前没有直接的XX经验，但我为这个转型做了充分准备：

**1.  transferable skills（可迁移能力）**
我之前的XX经验中积累的XX能力（如数据分析、项目管理），与这个岗位的要求是高度契合的。

**2. 主动学习**
我利用业余时间系统学习了XX课程（可以提证书/项目），并完成了XX实践项目。

**3. 热情与匹配**
我对XX领域有浓厚的兴趣，也一直在关注行业动态。我相信我的学习能力和过往经验能让我快速上手。"

**💡 加分项：** 展示你已经做的准备（课程、项目、作品）`;
    }

    // 13. 空白期
    if (q.includes('空白') || q.includes('空窗') || q.includes('gap') || q.includes('没工作') || q.includes('休息')) {
        return `关于"职业空白期"的**回答策略**：

**✅ 核心原则：坦诚 + 积极 + 有收获**

**推荐话术：**
"这段时间我主要用于XX（学习/家庭/调整/考证），期间我也有在关注行业动态。比如我利用这段时间系统学习了XX技能，并完成了XX项目/考取了XX证书。现在我已经做好了充分准备，希望重新投入工作。"

**💡 不同原因的应对：**
• **考研/考公：** "我尝试了一下，虽然结果不理想，但这段经历让我更清楚自己真正想要的是什么。"
• **家庭原因：** 简要说明，重点讲现在情况已稳定
• **休息调整：** "之前工作强度较大，我利用这段时间做了系统复盘和技能提升。"

**千万不要：** 编造虚假经历（背调会露馅）`;
    }

    // 14. 你好/问候
    if (q.includes('你好') || q.includes('嗨') || q.includes('hello') || q === 'hi' || q === '在吗') {
        return `你好！👋 我是你的**AI面试备战助手**。

我可以帮你：
• 📝 **简历优化** — 亮点提炼、STAR法则话术
• 🎯 **岗位分析** — 解读JD、匹配度评估
• 💬 **高频难题** — 自我介绍、优缺点、离职原因等
• 📊 **模拟面试** — 扮演面试官进行全真演练
• 💡 **技巧指导** — 薪资谈判、反问问题、礼仪着装

**你现在最关注哪个方面？** 直接告诉我，我来帮你准备！`;
    }

    // 15. 简历
    if (q.includes('简历') || q.includes('cv') || q.includes('履历')) {
        return `关于**简历优化**的核心建议：

**✅ 简历结构（一页纸原则）：**

**1. 个人信息**
姓名 | 电话 | 邮箱 | 求职意向 | 个人博客/GitHub（可选）

**2. 教育背景**
学校 | 专业 | 时间 | 核心课程（3-5门）| GPA（如果好就写）

**3. 实习/工作经历（STAR法则）**
• **S**ituation：什么背景
• **T**ask：你的任务是什么
• **A**ction：你做了什么（重点！）
• **R**esult：结果如何（用数据！）

**4. 项目经历**
项目名称 | 你的角色 | 技术栈 | 成果（量化）

**5. 技能/证书**
按熟练度分类：精通/熟悉/了解

**💡 加分技巧：**
• 数字说话："提升30%"比"显著提升"好100倍
• 关键词匹配JD：把JD里的关键词放进简历
• 一页纸：HR看一份简历平均6秒

需要我帮你针对具体岗位优化某段经历吗？`;
    }

    // 默认回复 - 智能分析用户意图
    return `收到你的问题！关于"${question.substring(0, 40)}"：

我可以从以下几个维度帮你：
• 📝 **简历优化** — 亮点提炼、STAR法则话术
• 🎯 **岗位分析** — 解读JD要求，提炼核心能力
• 💬 **高频难题** — 自我介绍、优缺点、离职原因、薪资等
• 📊 **模拟面试** — 扮演面试官进行全真模拟演练
• 💡 **技巧指导** — 面试礼仪、薪资谈判、反问技巧、压力面应对

**请告诉我你具体想了解哪一块？** 比如直接说"帮我准备自我介绍"或"模拟面试"，我会给你最精准的指导！`;
}

// ========== 简易 Markdown 渲染 ==========
function linkedMarkdownToHtml(text) {
    if (!text) return '';
    let html = text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%;border-radius:8px;margin:8px 0;">');
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener" style="color:#2563eb;text-decoration:underline;">$1</a>');
    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    html = html.replace(/```([\s\S]*?)```/g, '<pre style="background:#1e293b;color:#e2e8f0;padding:12px;border-radius:8px;overflow-x:auto;font-size:13px;line-height:1.5;"><code>$1</code></pre>');
    html = html.replace(/`([^`]+)`/g, '<code style="background:#f1f5f9;padding:2px 6px;border-radius:4px;font-size:13px;">$1</code>');
    html = html.replace(/\n/g, '<br>');

    return html;
}

// ========== 添加消息 ==========
function addLinkedAiMessage(role, content) {
    const messagesContainer = document.getElementById('linkedAiMessages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `linked-ai-msg ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'linked-ai-msg-avatar';
    avatar.textContent = role === 'user' ? '👤' : '🤖';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'linked-ai-msg-content';
    contentDiv.innerHTML = role === 'user'
        ? content.replace(/\n/g, '<br>')
        : linkedMarkdownToHtml(content);

    msgDiv.appendChild(avatar);
    msgDiv.appendChild(contentDiv);
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ========== 向面试智能体提问 ==========
async function askLinkedAi(presetQuestion) {
    const input = document.getElementById('linkedAiInput');
    const question = presetQuestion || input.value.trim();
    if (!question || _linkedAiIsThinking) return;

    if (!presetQuestion) input.value = '';

    const messagesContainer = document.getElementById('linkedAiMessages');
    const welcome = document.getElementById('linkedAiWelcome');
    const quickActions = document.getElementById('linkedAiQuickActions');

    if (welcome) welcome.style.display = 'none';
    if (quickActions) quickActions.style.display = 'none';

    addLinkedAiMessage('user', question);

    _linkedAiIsThinking = true;
    const thinkingEl = document.createElement('div');
    thinkingEl.className = 'linked-ai-thinking';
    thinkingEl.innerHTML = '🤔 AI正在思考<span class="thinking-dot">.</span><span class="thinking-dot">.</span><span class="thinking-dot">.</span>';
    thinkingEl.id = 'linkedAiThinking';
    messagesContainer.appendChild(thinkingEl);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
        const response = await callLinkedAiBot(question);
        const thinking = document.getElementById('linkedAiThinking');
        if (thinking) thinking.remove();
        addLinkedAiMessage('assistant', response);
    } catch (error) {
        const thinking = document.getElementById('linkedAiThinking');
        if (thinking) thinking.remove();
        console.error('Coze API 调用失败:', error);
        const fallbackResponse = generateLinkedAiResponse(question);
        addLinkedAiMessage('assistant', fallbackResponse);
    }

    _linkedAiIsThinking = false;
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// ============================================================
// 场景五：拓展面试场景（升级版）
// ============================================================

function startDefense() {
    extendInterviewState = createInterviewSession();
    extendInterviewState.active = true;
    extendInterviewState.type = 'defense';
    extendInterviewState.questions = [
        '请用3分钟简要介绍你的论文/答辩课题的主要内容和创新点。',
        '你的研究方法是什么？为什么选择这个方法而不是其他方法？',
        '你的研究结果如何验证？有哪些量化指标？',
        '这个研究有什么实际应用价值？未来还有什么可以改进的地方？',
        '如果重新做一次，你会怎么做？有什么不同的思路？',
    ];

    document.getElementById('extendChatCard').style.display = 'block';
    document.getElementById('extendTitle').textContent = '🎓 职称 & 毕设答辩模拟';
    const msgs = document.getElementById('extendMessages');
    msgs.innerHTML = '';
    addMessage('extendMessages', 'bot',
        `🤖 <strong>评审老师：</strong>同学你好，请先用3分钟简要介绍你的论文/答辩课题的主要内容和创新点。`, true);
    document.getElementById('extendChatCard').scrollIntoView({ behavior: 'smooth' });
}

function startGroupInterview() {
    extendInterviewState = createInterviewSession();
    extendInterviewState.active = true;
    extendInterviewState.type = 'group';

    const topics = [
        '某公司计划投资一个新项目，预计投资额5000万，有A、B两个方案。请小组讨论并给出投资建议。',
        '某传统零售企业面临线上转型，请分析其面临的挑战和机遇，并提出战略建议。',
        '一家创业公司需要在"快速扩张"和"稳健盈利"之间做出选择，请讨论各自的利弊。',
        '某城市面临交通拥堵问题，请从技术和管理两个层面提出解决方案。',
    ];

    document.getElementById('extendChatCard').style.display = 'block';
    document.getElementById('extendTitle').textContent = '👥 无领导小组群面模拟';
    const msgs = document.getElementById('extendMessages');
    msgs.innerHTML = '';
    addMessage('extendMessages', 'bot',
        `🤖 <strong>面试官：</strong>各位考生好，今天的群面议题是：<br><br>
        <strong>${topics[Math.floor(Math.random() * topics.length)]}</strong><br><br>
        请各位依次发表观点，每人2分钟。我先请1号考生发言。`, true);
    document.getElementById('extendChatCard').scrollIntoView({ behavior: 'smooth' });
}

function startTechCompetition() {
    extendInterviewState = createInterviewSession();
    extendInterviewState.active = true;
    extendInterviewState.type = 'competition';
    extendInterviewState.questions = [
        '请简要介绍你们团队的竞赛项目/作品，包括选题背景和创新点。',
        '你们在项目中使用了什么关键技术或方法？为什么选择这些技术？',
        '在竞赛过程中遇到的最大挑战是什么？团队是如何协作解决的？',
        '你们的结果/模型如何评估？有哪些量化指标？',
        '这个项目有什么实际应用价值？后续还有什么改进计划？',
    ];

    document.getElementById('extendChatCard').style.display = 'block';
    document.getElementById('extendTitle').textContent = '🏆 学科竞赛答辩模拟';
    const msgs = document.getElementById('extendMessages');
    msgs.innerHTML = '';
    addMessage('extendMessages', 'bot',
        `🤖 <strong>竞赛评委：</strong>欢迎参加答辩。${extendInterviewState.questions[0]}`, true);
    document.getElementById('extendChatCard').scrollIntoView({ behavior: 'smooth' });
}

function sendExtendAnswer() {
    if (!extendInterviewState.active) return;
    const input = document.getElementById('extendInput');
    const answer = input.value.trim();
    if (!answer) return;

    addMessage('extendMessages', 'user', answer);
    const analysis = analyzeAnswer(answer, extendInterviewState.type);
    input.value = '';

    setTimeout(() => {
        let response;
        const roleNames = {
            defense: '评审老师',
            group: '面试官',
            competition: '竞赛评委',
        };
        const role = roleNames[extendInterviewState.type] || '面试官';

        if (extendInterviewState.type === 'defense') {
            if (analysis.quality === 'excellent') {
                response = '介绍很清晰，研究思路明确。接下来我想问：你的研究方法是否有替代方案？为什么选择当前方案？';
            } else if (analysis.quality === 'good') {
                response = '说得不错，但研究方法部分还可以更详细。你能具体说说你采用了什么实证方法吗？';
            } else {
                response = '你的介绍有些简略，请再详细说明你的研究背景和创新点。为什么这个课题值得研究？';
            }
        } else if (extendInterviewState.type === 'group') {
            if (analysis.quality === 'excellent') {
                response = '观点很有深度！现在请换一个角度：如果你是反对者，你会如何质疑这个方案？';
            } else if (analysis.quality === 'good') {
                response = '不错的观点。现在2号考生（AI模拟）想补充：我同意你的一部分观点，但在风险控制方面，我认为还需要考虑更多因素。你怎么回应？';
            } else {
                response = '你的发言时间到了。请用30秒总结你的核心观点。其他考生请准备补充。';
            }
        } else if (extendInterviewState.type === 'competition') {
            if (analysis.quality === 'excellent') {
                response = '项目介绍很清楚！追问：你们的技术方案和同类项目相比，最大的优势是什么？请用数据说明。';
            } else if (analysis.quality === 'good') {
                response = '了解。我想问一个细节：你们项目中遇到的最大技术难点是什么？团队是如何协作解决的？';
            } else {
                response = '请再详细说说你们项目的创新点。和现有方案相比，你们的独特之处在哪里？';
            }
        }

        addMessage('extendMessages', 'bot', `🤖 <strong>${role}：</strong>${response}`, true);
    }, 800);
}

// ============================================================
// 场景六：理工答辩&学术面试（升级版）
// ============================================================

const techDefenseQuestions = {
    proposal: [
        '请简述你的课题研究背景和意义，为什么选择这个方向？',
        '你的研究方法和技术路线是什么？有没有替代方案？',
        '请介绍一下国内外相关研究现状，你的创新点在哪里？',
        '预期的研究成果和可能的困难是什么？',
        '你的研究计划和时间安排是怎样的？',
    ],
    final: [
        '请用3分钟概述你的毕业设计/论文的主要内容和创新点。',
        '你在研究中遇到的最大困难是什么？是如何克服的？',
        '你的实验结果/数据如何验证你的结论？',
        '这个研究有什么实际应用价值？未来还有什么可以改进的地方？',
        '如果重新做一次，你会怎么做？',
    ],
    paper: [
        '请概括你这篇论文的核心贡献。',
        '你的方法和现有方法相比，优势在哪里？请用数据说明。',
        '审稿人可能会质疑哪些方面？你如何回应？',
        '这个研究方向未来的发展趋势是什么？',
        '请用英文简述你的研究内容（Abstract）。',
    ],
    research: [
        '请介绍一下你参与过的科研项目，你具体负责什么？',
        '你掌握了哪些科研工具和方法？请举例说明应用场景。',
        '在科研团队中，你是如何与导师和同学协作的？',
        '你发表过哪些论文或专利？请介绍最有代表性的一项。',
        '你未来的研究方向规划是什么？为什么选择这个方向？',
    ],
};

function startTechDefense(type) {
    const questions = techDefenseQuestions[type] || techDefenseQuestions['final'];
    const typeNames = { proposal: '开题报告答辩', final: '毕业设计答辩', paper: '论文/期刊审稿面', research: '科研项目面试' };

    techDefenseState = { active: true, type, questions: [...questions], currentQ: 0 };

    document.getElementById('techDefenseChatCard').style.display = 'block';
    document.getElementById('techDefenseTitle').textContent = `🎙️ ${typeNames[type]}`;

    const msgs = document.getElementById('techDefenseMessages');
    msgs.innerHTML = '';
    addMessage('techDefenseMessages', 'bot',
        `🤖 <strong>评审老师：</strong>${questions[0]}`, true);
    document.getElementById('techDefenseChatCard').scrollIntoView({ behavior: 'smooth' });
}

function sendTechDefenseAnswer() {
    if (!techDefenseState.active) return;
    const input = document.getElementById('techDefenseInput');
    const answer = input.value.trim();
    if (!answer) return;

    addMessage('techDefenseMessages', 'user', answer);
    const analysis = analyzeAnswer(answer, 'defense');
    techDefenseState.currentQ++;
    input.value = '';

    setTimeout(() => {
        if (techDefenseState.currentQ < techDefenseState.questions.length) {
            const nextQ = techDefenseState.questions[techDefenseState.currentQ];
            let comment;
            if (analysis.quality === 'excellent') {
                comment = '回答得很好，思路很清晰。接下来：';
            } else if (analysis.quality === 'good') {
                comment = '了解了，回答基本到位。那么：';
            } else {
                comment = '嗯，你的回答可以再深入一些。另外我想问：';
            }
            addMessage('techDefenseMessages', 'bot',
                `🤖 <strong>评审老师：</strong>${comment}${nextQ}`, true);
        } else {
            // 动态总结
            const totalAnswered = techDefenseState.currentQ;
            const levelEmoji = analysis.quality === 'excellent' ? '🏆' : analysis.quality === 'good' ? '👍' : '📝';
            addMessage('techDefenseMessages', 'bot', `🤖 <strong>评审老师：</strong>答辩到此结束。${levelEmoji} 你的表现总结如下：<br><br>
                <strong>✅ 完成情况：</strong>共回答 ${totalAnswered} 道题，整体表现${analysis.quality === 'excellent' ? '优秀' : analysis.quality === 'good' ? '良好' : '有待提升'}。<br>
                <strong>💡 建议：</strong>答辩时注意控制语速，重点突出创新点和实际贡献，用数据和图表支撑论点会更有效。<br>
                <strong>📚 提升方向：</strong>多关注领域前沿动态，加强学术表达的逻辑性和严谨性，准备一些"被质疑"时的应对话术。`, true);
            techDefenseState.active = false;
        }
        document.getElementById('techDefenseMessages').scrollTop = document.getElementById('techDefenseMessages').scrollHeight;
    }, 800);
}

// ============================================================
// 🤖 AI智能体集成函数
// ============================================================

/**
 * 切换智能体人格
 */
function switchAgentPersonality(personality) {
    agentSetPersonality(personality);
    const names = {
        professional: '专业型面试官',
        friendly: '亲和型面试官',
        strict: '严厉型面试官',
        challenging: '挑战型面试官',
    };
    const emojis = {
        professional: '👔',
        friendly: '😊',
        strict: '😤',
        challenging: '🔥',
    };
    const statusDot = document.querySelector('#agentStatusIndicator .status-dot');
    const statusText = document.querySelector('#agentStatusIndicator span:last-child');

    // 更新状态指示器
    if (statusDot && statusText) {
        statusDot.className = 'status-dot active pulse';
        statusText.textContent = `${emojis[personality]} ${names[personality]}模式已激活`;
    }

    // 显示切换提示
    const persona = window.interviewAgent?.personalities?.[personality];
    if (persona) {
        console.log(`🤖 智能体人格切换: ${persona.name} - ${persona.style}`);
    }
}

/**
 * 使用智能体生成增强评分报告
 */
function showAgentScoreReport(state, dims, cardId, contentId) {
    // 优先使用智能体评分
    if (window.interviewAgent && state.answers && state.answers.length > 0) {
        try {
            const agentReport = agentGenerateScoreReport(state.answers, state.questions.length);
            const summaryFeedback = agentGenerateSummaryFeedback(agentReport);

            document.getElementById(cardId).style.display = 'block';
            document.getElementById(contentId).innerHTML = `
                <div style="text-align:center;margin-bottom:20px">
                    <div style="font-size:48px;font-weight:800;color:var(--accent)">${agentReport.totalScore}</div>
                    <div style="color:var(--text-secondary)">综合评分（满分100） · 等级：<span style="color:var(--primary);font-weight:600">${agentReport.level}</span></div>
                    <div style="margin-top:6px;font-size:12px;color:var(--text-light);">🤖 由AI智能体六维综合评估 | 共回答${agentReport.validCount}题 | 跳过${agentReport.skippedCount}题</div>
                </div>
                <div class="score-dimensions">
                    ${agentReport.dimensions.map(d => `
                        <div class="score-dim">
                            <span class="dim-name">${d.name}</span>
                            <div class="dim-bar-wrap">
                                <div class="dim-bar" style="width:${d.score}%;background:${d.color}"></div>
                            </div>
                            <span class="dim-score">${d.score}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="score-summary">
                    <h4>📋 AI智能体评估报告</h4>
                    ${agentReport.highlights.length > 0 ? `<p><strong>✅ 亮点：</strong>${agentReport.highlights.join('；')}。</p>` : ''}
                    ${agentReport.improvements.length > 0 ? `<p><strong>📝 待改进：</strong>${agentReport.improvements.join('；')}。</p>` : ''}
                    <p style="margin-top:8px"><strong>📊 数据统计：</strong>共回答 ${agentReport.validCount} 题，跳过 ${agentReport.skippedCount} 题，应对追问 ${agentReport.followUpCount} 轮，平均分 ${agentReport.avgScore}。</p>
                    ${agentReport.pressureNote}
                </div>
                ${summaryFeedback}
            `;
            document.getElementById(cardId).scrollIntoView({ behavior: 'smooth' });
            return;
        } catch(e) {
            console.warn('智能体评分降级为传统评分:', e);
        }
    }

    // 降级到原有评分逻辑
    showEnhancedScoreReport(state, dims, cardId, contentId);
}

// ============================================================
// 🤖 多智能体集成函数 v3.0
// ============================================================

/**
 * 打开配套联动功能的智能体面板
 */
function openLinkedAgent(feature) {
    // 隐藏其他面板
    ['materialAgentPanel', 'planAgentPanel', 'bilingualAgentPanel', 'techBilingualAgentPanel'].forEach(id => {
        const panel = document.getElementById(id);
        if (panel) panel.style.display = 'none';
    });

    // 显示对应的智能体面板
    const panelMap = {
        material: 'materialAgentPanel',
        plan: 'planAgentPanel',
        bilingual: 'bilingualAgentPanel',
        techbilingual: 'techBilingualAgentPanel'
    };

    const panelId = panelMap[feature];
    if (!panelId) return;

    const panel = document.getElementById(panelId);
    if (!panel) return;

    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * 生成面试素材
 */
function generateInterviewMaterials() {
    const position = document.getElementById('matPosition')?.value.trim() || '目标岗位';
    const industry = document.getElementById('matIndustry')?.value.trim() || '相关行业';
    const skills = document.getElementById('matSkills')?.value.trim() || '';

    const result = document.getElementById('materialAgentResult');
    result.innerHTML = '<div class="agent-thinking">🤖 素材沉淀智能体正在分析岗位需求，提炼面试素材...</div>';

    setTimeout(() => {
        const content = window.materialAgent.generateMaterials(position, industry, skills);
        result.innerHTML = `<div class="prep-material-package"><div class="prep-section">${linkedMarkdownToHtml(content)}</div></div>`;
        result.scrollIntoView({ behavior: 'smooth' });
    }, 1000);
}

/**
 * 生成面试冲刺规划
 */
function generateInterviewPlan() {
    const position = document.getElementById('planPosition')?.value.trim() || '目标岗位';
    const days = document.getElementById('planDays')?.value || '7';

    const result = document.getElementById('planAgentResult');
    result.innerHTML = '<div class="agent-thinking">🤖 规划智能体正在制定你的专属冲刺计划...</div>';

    setTimeout(() => {
        const content = window.planAgent.generatePlan(position, days);
        result.innerHTML = `<div class="prep-material-package"><div class="prep-section">${linkedMarkdownToHtml(content)}</div></div>`;
        result.scrollIntoView({ behavior: 'smooth' });
    }, 1000);
}

/**
 * 双语面试内容生成
 */
function bilingualGenerate(topic) {
    const result = document.getElementById('bilingualAgentResult');
    const industry = currentScene === 'techjob' ? 'tech' : 'finance';

    result.innerHTML = '<div class="agent-thinking">🌐 双语智能体正在生成内容...</div>';

    setTimeout(() => {
        const content = window.bilingualAgent.generateTopic(topic, industry);
        result.innerHTML = `<div class="prep-material-package"><div class="prep-section">${linkedMarkdownToHtml(content)}</div></div>`;
        result.scrollIntoView({ behavior: 'smooth' });
    }, 800);
}

/**
 * 技术英语内容生成
 */
function techBilingualGenerate(topic) {
    const result = document.getElementById('techBilingualAgentResult');

    result.innerHTML = '<div class="agent-thinking">💻 技术英语智能体正在生成内容...</div>';

    setTimeout(() => {
        const content = window.techBilingualAgent.generateContent(topic);
        result.innerHTML = `<div class="prep-material-package"><div class="prep-section">${linkedMarkdownToHtml(content)}</div></div>`;
        result.scrollIntoView({ behavior: 'smooth' });
    }, 800);
}

/**
 * 打开AI面试教练对话
 */
function openCoachChat() {
    const panel = document.getElementById('coachChatPanel');
    if (!panel) return;
    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

/**
 * 向AI面试教练提问（已接入Coze真实智能体）
 * 点击快捷问题或直接输入，打开Coze iframe面板
 */
function askCoach(presetQuestion) {
    const panel = document.getElementById('coachChatPanel');
    if (!panel) return;
    panel.style.display = 'block';
    panel.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // 如果传入了预设问题，尝试通过postMessage发送给iframe中的Coze智能体
    if (presetQuestion) {
        const iframe = document.getElementById('coachChatIframe');
        if (iframe && iframe.contentWindow) {
            try {
                iframe.contentWindow.postMessage({ type: 'coze_message', text: presetQuestion }, '*');
            } catch (e) {
                // 跨域安全限制，静默处理
            }
        }
    }
}

function addCoachMessage(role, content) {
    const container = document.getElementById('coachChatMessages');
    if (!container) return;

    const msgDiv = document.createElement('div');
    msgDiv.className = `linked-ai-msg ${role === 'user' ? 'user' : 'assistant'}`;

    const avatar = document.createElement('div');
    avatar.className = 'linked-ai-msg-avatar';
    avatar.textContent = role === 'user' ? '👤' : '🎯';

    const contentDiv = document.createElement('div');
    contentDiv.className = 'linked-ai-msg-content';
    contentDiv.innerHTML = role === 'user'
        ? content.replace(/\n/g, '<br>')
        : linkedMarkdownToHtml(content);

    msgDiv.appendChild(avatar);
    msgDiv.appendChild(contentDiv);
    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

/**
 * 智能综合展示（兼容旧版 showLinkedFeature）
 */
function showLinkedFeature(feature) {
    // 新版：直接调用智能体
    openLinkedAgent(feature);
}

// ========== 增强askLinkedAi函数，使用教练智能体作为基本fallback ==========
window._originalGenerateLinkedAiResponse = generateLinkedAiResponse;

// 重新定义 generateLinkedAiResponse（使用 var 确保可重赋值）
var generateLinkedAiResponse = function(question) {
    // 优先使用教练智能体
    if (window.interviewCoachAgent) {
        return window.interviewCoachAgent.respond(question);
    }
    // 回退到原始函数
    if (window._originalGenerateLinkedAiResponse) {
        return window._originalGenerateLinkedAiResponse(question);
    }
    return '抱歉，我暂时无法处理这个问题。请稍后再试。';
};

/**
 * 打开备战材料（六维评分面板点击事件）
 */
function openPrepMaterial() {
    // 打开面试教练对话面板作为入口
    openCoachChat();
}

console.log('✅ 面试模块多智能体集成已激活');

