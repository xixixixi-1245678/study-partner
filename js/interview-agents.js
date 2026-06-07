// ============================================================
// 知学助手 - 多智能体系统 v3.0
// 面试板块各子功能独立智能体
// ============================================================

// ==================== 智能体基类 ====================
class BaseAgent {
    constructor(name, icon, description) {
        this.name = name;
        this.icon = icon;
        this.description = description;
        this.conversationHistory = [];
        this.state = {};
    }

    think(duration = 800) {
        return new Promise(resolve => setTimeout(resolve, duration + Math.random() * 600));
    }

    remember(role, content) {
        this.conversationHistory.push({ role, content, time: Date.now() });
        if (this.conversationHistory.length > 50) this.conversationHistory.shift();
    }

    reset() {
        this.conversationHistory = [];
        this.state = {};
    }
}

// ==================== 1. 智能题库智能体 ====================
class QuestionBankAgent extends BaseAgent {
    constructor() {
        super('智能题库', '🧠', '按岗位/专业/难度自动匹配题目');
        this.banks = this._initBanks();
    }

    _initBanks() {
        return {
            // 财经类
            finance: {
                macro: [
                    '请分析当前宏观经济形势下，央行货币政策的主要目标和传导路径。',
                    '通货膨胀的成因有哪些？不同类型通胀的治理措施有什么区别？',
                    '汇率变动对一国进出口贸易有什么影响？请结合具体案例分析。',
                    '财政政策与货币政策如何协调配合实现宏观调控目标？',
                    '请分析利率市场化改革对商业银行经营的深远影响。',
                    'GDP核算的三种方法分别是什么？各自有什么局限性？',
                ],
                investment: [
                    '如何对一家上市公司进行系统的基本面分析？请给出分析框架。',
                    '请解释DCF估值模型的核心逻辑，并说明其优缺点和适用场景。',
                    '请比较PE、PB、PS、PEG等相对估值方法的适用条件。',
                    '什么是有效市场假说？它对投资策略有什么指导意义？',
                    '技术分析和基本面分析各自的逻辑基础和局限性是什么？',
                    '如何构建一个多元化的投资组合？请说明资产配置的逻辑。',
                ],
                banking: [
                    '商业银行的核心业务模式是什么？请分析其盈利来源和风险。',
                    '什么是巴塞尔协议Ⅲ？它对银行资本充足率提出了什么要求？',
                    '请分析影子银行的风险特征和监管挑战。',
                    '数字人民币的发行对商业银行会产生什么影响？',
                    '利率市场化对中小银行的经营策略有什么特殊影响？',
                    '商业银行如何通过资产负债管理来平衡三性原则？',
                ],
                accounting: [
                    '请说明权责发生制和收付实现制的核心区别，并举例说明。',
                    '新收入准则（五步法）的核心内容是什么？和旧准则相比有什么变化？',
                    '如何判断一项支出应该资本化还是费用化？请说明判断标准。',
                    '什么是递延所得税？它产生的原因是什么？',
                    '财务报表分析的常用方法和核心指标有哪些？',
                    '企业合并报表的编制涉及哪些关键调整？',
                ],
                securities: [
                    '注册制改革对A股市场生态产生了哪些深远影响？',
                    '请分析IPO审核过程中重点关注哪些财务和法律问题。',
                    '什么是资产证券化？请说明其基本结构和运作流程。',
                    '请分析上市公司并购重组的主要动因和常见风险。',
                    '什么是内幕交易？如何界定和防范？',
                    '请谈谈你对北交所定位和发展前景的看法。',
                ]
            },
            // 理工类
            tech: {
                cs_basics: [
                    '请解释操作系统中的进程调度算法，并比较各自的适用场景。',
                    'TCP三次握手和四次挥手的过程是怎样的？为什么需要这些步骤？',
                    '数据库索引的底层数据结构是什么？B+树相比B树的优势在哪里？',
                    '什么是死锁？产生死锁的四个必要条件是什么？如何预防和检测？',
                    '请解释虚拟内存的工作原理，分页和分段有什么区别？',
                    'HTTP/1.1、HTTP/2、HTTP/3各自有什么改进？QUIC协议的优势是什么？',
                ],
                algorithms: [
                    '请用代码实现快速排序，并分析其时间复杂度和空间复杂度。',
                    '请解释动态规划的核心思想，并举例说明解题步骤。',
                    '什么是红黑树？它如何保证平衡性？和AVL树有什么区别？',
                    '请解释图的最短路径算法（Dijkstra、Bellman-Ford、Floyd）的区别。',
                    '什么是贪心算法？请说明它和动态规划的主要区别。',
                    '如何判断一个算法的时空复杂度？请举例分析。',
                ],
                system_design: [
                    '如何设计一个支持百万并发的秒杀系统？请从各层次说明。',
                    '请设计一个分布式ID生成器，需要考虑全局唯一和高可用。',
                    '如何设计一个高性能的短链接系统？请说明核心设计思路。',
                    '请设计一个实时消息推送系统，需要考虑在线状态和离线消息。',
                    '如何设计一个分布式限流系统？请比较几种限流算法。',
                    '请设计一个支持海量数据存储的日志系统，说明关键设计挑战。',
                ],
                ai_ml: [
                    '请解释Transformer模型的自注意力机制，为什么它比RNN更有效？',
                    '什么是过拟合？有哪些常见的防止过拟合的方法？',
                    '请解释梯度下降算法的原理，SGD、Momentum、Adam的区别是什么？',
                    '如何处理样本不均衡问题？请列举至少4种方法。',
                    '请解释偏差-方差权衡（Bias-Variance Tradeoff）在模型选择中的意义。',
                    '什么是迁移学习？它在实际应用中有哪些典型场景？',
                ],
                frontend: [
                    '请详细解释浏览器从输入URL到页面渲染的完整过程。',
                    'React/Vue的虚拟DOM原理是什么？它如何提升渲染性能？',
                    '请谈谈你对前端性能优化的理解和常用策略。',
                    '什么是跨域问题？有哪些解决方案？各自的原理是什么？',
                    '请解释闭包的概念、应用场景及可能引起的内存泄漏问题。',
                    '前端工程化方面，Webpack/Vite的核心原理和差异是什么？',
                ],
                mobile: [
                    '请解释Android/iOS的内存管理机制和常见的内存泄漏场景。',
                    '跨平台开发方案（React Native/Flutter/uni-app）的优劣对比。',
                    '移动端性能优化有哪些核心指标？如何监控和优化？',
                    '请解释移动应用的冷启动和热启动的区别，以及优化方法。',
                ],
                devops: [
                    '请设计一套完整的CI/CD流水线，说明各阶段的关键工具和操作。',
                    'Docker和Kubernetes的核心概念和关系是什么？',
                    '如何设计一个高可用的监控告警系统？需要关注哪些核心指标？',
                    '什么是服务网格（Service Mesh）？它解决了什么问题？',
                ]
            },
            // 通用面试
            general: {
                hr: [
                    '请做一个简短的自我介绍。（1分钟版本）',
                    '你为什么选择我们公司/这个岗位？',
                    '你最大的优点和缺点分别是什么？',
                    '请描述一次你克服重大困难的经历。',
                    '你对未来五年的职业规划是什么？',
                    '你对薪资的期望是什么？请说明你的依据。',
                ],
                behavior: [
                    '请用STAR法则描述一次你成功领导团队完成项目的经历。',
                    '当你的意见与上级不一致时，你会怎么处理？请举例说明。',
                    '描述一次你在时间紧迫的情况下完成重要任务的经历。',
                    '请你讲一个你曾经失败的经历，以及你从中学到了什么。',
                    '如果同事在工作中存在违规操作被你发现，你会怎么做？',
                    '当你同时面对多个紧急任务时，如何安排优先级？',
                ],
                pressure: [
                    '说实话，和你同批的候选人中有人比你更有经验，你觉得你的独特优势在哪里？',
                    '我看你的简历上有一段空白期，能解释一下这段时间你在做什么吗？',
                    '如果这次面试没通过，你觉得最可能的原因是什么？',
                    '你对自己的这个回答打多少分？为什么？',
                    '你认为你最大的失败是什么？你从中学到了什么？',
                    '如果让你重新开始你的职业生涯，你会做什么不同的选择？',
                ]
            }
        };
    }

    /**
     * 根据场景生成题目
     * @param {string} category - 类别: 'finance' | 'tech' | 'general'
     * @param {string} subCategory - 子类别
     * @param {number} count - 生成数量
     * @param {string} difficulty - 难度: 'basic' | 'medium' | 'hard'
     */
    generateQuestions(category, subCategory = null, count = 5, difficulty = 'medium') {
        let pool = [];

        if (category === 'finance') {
            if (subCategory && this.banks.finance[subCategory]) {
                pool = [...this.banks.finance[subCategory]];
            } else {
                // 从财经所有子类混合
                Object.values(this.banks.finance).forEach(arr => pool.push(...arr));
            }
        } else if (category === 'tech') {
            if (subCategory && this.banks.tech[subCategory]) {
                pool = [...this.banks.tech[subCategory]];
            } else {
                Object.values(this.banks.tech).forEach(arr => pool.push(...arr));
            }
        } else if (category === 'general') {
            if (subCategory && this.banks.general[subCategory]) {
                pool = [...this.banks.general[subCategory]];
            } else {
                Object.values(this.banks.general).forEach(arr => pool.push(...arr));
            }
        }

        // 打乱并取需要的数量
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(count, shuffled.length));

        // 智能补充说明
        const categoryNames = {
            finance: '金融财经类', tech: '理工技术类', general: '通用综合类'
        };
        const intro = `为你从${categoryNames[category] || '综合'}题库中精选了 ${selected.length} 道面试题：`;

        return { intro, questions: selected, total: pool.length };
    }

    /**
     * 根据JD分析推荐题型
     */
    analyzeJdAndRecommend(jdText) {
        const jd = jdText.toLowerCase();
        let category = 'general';
        let subCategories = [];
        let recommendations = [];

        if (/金融|证券|基金|银行|投行|会计|审计|风控|保险|信托/.test(jd)) {
            category = 'finance';
            if (/证券|投行|ipo|并购|承销/.test(jd)) subCategories.push('securities');
            if (/基金|资管|投资|组合/.test(jd)) subCategories.push('investment');
            if (/银行|存贷|利率/.test(jd)) subCategories.push('banking');
            if (/会计|审计|财报|准则/.test(jd)) subCategories.push('accounting');
            recommendations = ['专业知识面试', '财务分析', '行业研究'];
        } else if (/开发|编程|算法|前端|后端|测试|运维|数据|ai|机器学习|java|python|go|react|vue/.test(jd)) {
            category = 'tech';
            if (/算法|ai|机器学习|nlp|cv|深度学习/.test(jd)) subCategories.push('ai_ml');
            if (/前端|react|vue|h5|js|css/.test(jd)) subCategories.push('frontend');
            if (/后端|java|go|python|服务端|微服务/.test(jd)) subCategories.push('cs_basics');
            if (/移动|ios|android|flutter|小程序/.test(jd)) subCategories.push('mobile');
            if (/运维|devops|云原生|k8s|docker/.test(jd)) subCategories.push('devops');
            if (/系统设计|架构|设计模式/.test(jd)) subCategories.push('system_design');
            recommendations = ['技术基础', '系统设计', '项目深挖', '算法编程'];
        }

        if (subCategories.length === 0) {
            subCategories = [null];
            recommendations = ['HR综合面试', '行为面试', '专业知识'];
        }

        const questions = this.generateQuestions(category, subCategories[0], 5);
        questions.recommendations = recommendations;
        questions.category = category;

        return questions;
    }

    /**
     * 生成完整的模拟面试题集
     */
    generateFullInterviewSet(scene, direction, type) {
        let questions = [];
        const typeNames = {
            professional: '专业面试', hr: 'HR综合面试', behavior: '行为面试', pressure: '压力面试'
        };
        const name = typeNames[type] || '面试';

        if (scene === 'job') {
            const financeMap = {
                securities: ['securities', 'investment', 'macro'],
                fund: ['investment', 'macro'],
                accounting: ['accounting'],
                banking: ['banking', 'macro'],
                general: ['investment', 'banking', 'accounting']
            };
            const subKey = (financeMap[direction] || ['investment'])[0];
            questions = this.generateQuestions('finance', subKey, 7).questions;
        } else if (scene === 'techjob') {
            const techMap = {
                software: ['cs_basics', 'system_design'],
                frontend: ['frontend', 'cs_basics'],
                algorithm: ['ai_ml', 'algorithms'],
                data: ['cs_basics', 'system_design'],
                embedded: ['cs_basics'],
                general: ['cs_basics', 'algorithms']
            };
            const subKey = (techMap[direction] || ['cs_basics'])[0];
            questions = this.generateQuestions('tech', subKey, 7).questions;
        }

        if (type === 'hr') {
            const hrQuestions = this.generateQuestions('general', 'hr', 5).questions;
            questions = [...hrQuestions, ...questions.slice(0, 2)];
        } else if (type === 'behavior') {
            questions = this.generateQuestions('general', 'behavior', 5).questions;
        } else if (type === 'pressure') {
            questions = this.generateQuestions('general', 'pressure', 6).questions;
        }

        return { name, questions };
    }

    /**
     * 为智能题库面板生成HTML展示
     */
    generateBankPanelHtml(category, subCategory, count = 10) {
        const result = this.generateQuestions(category, subCategory, count);
        let html = `<div class="bank-panel"><div class="bank-panel-header">
            <span class="bank-panel-icon">${this.icon}</span>
            <div><strong>${this.name}</strong><br><small>${result.intro}</small></div>
        </div>`;

        html += '<div class="bank-question-list">';
        result.questions.forEach((q, i) => {
            html += `<div class="bank-q-item" onclick="startPracticeFromBank(${i}, '${category}', '${subCategory || ''}')">
                <span class="bank-q-num">${i + 1}</span>
                <div class="bank-q-text">${q.substring(0, 80)}${q.length > 80 ? '...' : ''}</div>
                <span class="bank-q-action">练习 ▶</span>
            </div>`;
        });
        html += '</div>';

        html += `<div class="bank-panel-footer">
            <span>题库共 ${result.total} 道题</span>
            <button class="btn btn-outline btn-sm" onclick="refreshQuestionBank('${category}', '${subCategory || ''}')">🔄 换一批</button>
        </div></div>`;

        return html;
    }
}

// ==================== 2. 面试素材沉淀智能体 ====================
class MaterialAgent extends BaseAgent {
    constructor() {
        super('面试素材沉淀', '📦', '调取学习记录、提炼面试可用素材');
    }

    /**
     * 根据岗位和用户信息生成面试素材
     */
    generateMaterials(position, industry, skills) {
        position = position || '目标岗位';
        industry = industry || '相关行业';

        return `
### 📦 面试素材沉淀报告

**目标岗位：${position} | 行业：${industry}**

---

**🔑 核心专业概念（必会清单）**
${this._getCoreConcepts(industry)}

---

**📊 数据说话 — 面试可用数据点**
${this._getDataPoints(industry)}

---

**💼 项目经历素材 — STAR法则话术**
${this._getProjectTemplates(position)}

---

**🔥 行业热点素材**
${this._getHotTopics(industry)}

---

**✍️ 个人故事素材库**
${this._getPersonalStories(position)}

---

> 💡 建议将以上素材制作成个人"面试素材卡"，面试前反复练习，做到信手拈来。
`;
    }

    _getCoreConcepts(industry) {
        if (/金融|证券|基金|银行|投行/.test(industry)) {
            return `- 货币政策工具：存款准备金、再贴现、公开市场操作 → 传导机制
- 估值方法：DCF（FCFF/FCFE）、PE/PB/PS/PEG、DDM
- 风险管理：VaR、压力测试、情景分析、敏感性分析
- 财务报表：三张表勾稽关系、杜邦分析体系
- 行业分析框架：波特五力模型、SWOT、PEST分析`;
        }
        if (/互联网|科技|IT|软件/.test(industry)) {
            return `- 数据结构：数组/链表/栈/队列/树/图/哈希表 → 时空复杂度
- 算法：排序/搜索/DP/贪心/分治/回溯 → 实际应用场景
- 系统设计：高并发/分布式/微服务/缓存/消息队列
- 数据库：索引原理、SQL优化、事务隔离级别
- 网络：TCP/IP、HTTP/HTTPS、DNS、CDN`;
        }
        return `- 行业基础知识框架
- 核心方法论和分析工具
- 行业法规和标准
- 最新发展趋势和技术前沿`;
    }

    _getDataPoints(industry) {
        if (/金融/.test(industry)) {
            return `- GDP增速、CPI/PPI、M2增速、社融规模 → 宏观经济背景
- LPR利率、国债收益率、汇率 → 市场环境
- A股总市值、日均成交量、北向资金流向 → 市场情绪
- 行业PE/PB估值分位数 → 行业判断依据`;
        }
        if (/互联网|IT/.test(industry)) {
            return `- QPS/TPS指标、响应时间P99/P50 → 性能数据
- 系统可用性（99.9% vs 99.99%）→ 可靠性指标
- 日活用户数、转化率、留存率 → 业务指标
- 服务器数量、数据库容量、带宽 → 规模描述`;
        }
        return `- 行业关键数据指标
- 市场规模和增长率
- 竞争对手分析数据
- 个人项目成果量化数据`;
    }

    _getProjectTemplates(position) {
        const templates = [
            `**项目1：[项目名称]**
- S（情境）：公司需要解决[XX问题]，面临[XX挑战]
- T（任务）：我负责[XX模块]，目标是在[X]时间内达到[XX指标]
- A（行动）：①分析需求，设计了[XX方案] ②使用[XX技术/方法]实施 ③协调[X]个团队推进
- R（结果）：上线后[XX指标]提升了[XX%]，获得[XX认可]

**项目2：[项目名称]**
- S：团队在做[XX产品]时遇到了[XX瓶颈]
- T：由我主导[XX优化/重构]，关键约束是[XX]
- A：①定位瓶颈在[XX] ②提出[XX方案]（对比了X个备选）③分[XX]阶段推进
- R：[瓶颈指标]从[XX]改善到[XX]（提升[XX%]），被推广到[X]个场景`];
        return templates.join('\n\n');
    }

    _getHotTopics(industry) {
        if (/金融/.test(industry)) {
            return `- 🔥 AI+金融：智能投顾、AI风控、量化交易
- 🔥 ESG投资：绿色债券、碳交易、可持续发展
- 🔥 数字人民币：跨境支付、零售场景、金融普惠
- 🔥 注册制改革：信息披露、退出机制、投资者保护`;
        }
        if (/互联网|IT/.test(industry)) {
            return `- 🔥 大模型/AIGC：GPT/Claude应用、提示工程、Agent开发
- 🔥 云原生：Kubernetes、Service Mesh、Serverless
- 🔥 WebAssembly：前端性能优化、边缘计算
- 🔥 Rust：系统编程、内存安全、WebAssembly`;
        }
        return `- 🔥 行业数字化转型趋势
- 🔥 新技术对行业的影响
- 🔥 行业政策变化和监管动态
- 🔥 跨界融合与创新机会`;
    }

    _getPersonalStories(position) {
        return `- **最大成就故事：** [简述成就] → 展示"结果导向"特质
- **克服困难故事：** [简述挑战] → 展示"坚韧"特质
- **团队协作故事：** [简述合作] → 展示"团队精神"
- **学习成长故事：** [简述学习] → 展示"自驱力"
- **创新改进故事：** [简述创新] → 展示"创造力"

建议每个故事用STAR法则书写，控制在1-2分钟口述长度。`;
    }
}

// ==================== 3. 面试冲刺规划智能体 ====================
class PlanAgent extends BaseAgent {
    constructor() {
        super('面试冲刺规划', '📅', '根据剩余天数定制阶段计划');
    }

    /**
     * 根据剩余天数生成冲刺计划
     */
    generatePlan(position, daysRemaining = 7) {
        const days = parseInt(daysRemaining) || 7;
        let plan = '';

        if (days >= 14) {
            plan = this._generateLongPlan(position, days);
        } else if (days >= 7) {
            plan = this._generateMediumPlan(position, days);
        } else if (days >= 3) {
            plan = this._generateShortPlan(position, days);
        } else {
            plan = this._generateUrgentPlan(position, days);
        }

        return plan;
    }

    _generateLongPlan(position, days) {
        const week1 = Math.ceil(days * 0.3);
        const week2 = Math.ceil(days * 0.35);
        const week3 = days - week1 - week2;

        return `### 📅 ${position} 面试冲刺规划（${days}天）

---

**🎯 总体目标：** 系统准备 + 模拟演练 + 精细打磨

---
**📚 第1阶段：知识巩固期（第1-${week1}天）**

| 时间 | 任务 | 目标 |
|------|------|------|
| 上午 1h | 专业知识复习 | 梳理岗位核心知识框架，整理3-5个重点专题 |
| 下午 1h | 面试题库练习 | 每天练习10道高频题，提交AI评估 |
| 晚间 30min | 行业动态阅读 | 每日财经/科技新闻，形成自己的观点 |

**🎯 阶段目标：** 完成知识体系梳理，能熟练回答80%专业知识问题

---
**🔄 第2阶段：模拟强化期（第${week1 + 1}-${week1 + week2}天）**

| 时间 | 任务 | 目标 |
|------|------|------|
| 上午 40min | 专业面试模拟 | 每天1轮全真模拟，AI评分+追问 |
| 下午 40min | HR/行为面试模拟 | 锻炼综合素质，练习STAR法则 |
| 晚间 20min | 复盘和总结 | 记录薄弱环节，针对性补强 |

**🎯 阶段目标：** 完成5+轮模拟，平均分达到70+

---
**💪 第3阶段：冲刺打磨期（第${week1 + week2 + 1}-${days}天）**

| 时间 | 任务 | 目标 |
|------|------|------|
| 上午 30min | 弱点专项突破 | 针对之前模拟中暴露的弱项精准练习 |
| 下午 30min | 压力面试训练 | 开启"挑战型"面试官模式，锻炼抗压 |
| 晚间 20min | 最终准备 | 准备面试着装/材料/路线/反问问题 |

**🎯 阶段目标：** 信心满满，做好万全准备！
`;
    }

    _generateMediumPlan(position, days) {
        const phase1 = Math.ceil(days * 0.4);
        const phase2 = days - phase1;

        return `### 📅 ${position} 面试冲刺规划（${days}天）

---

**📚 第1阶段：知识+模拟并行（第1-${phase1}天）**
- 每天上午 1h：专业知识重点复习 + 10道面试题练习
- 每天下午 30min：1轮全真模拟面试（交替专业面/HR面/行为面）
- 每天晚间 20min：当日复盘，标记薄弱知识点

**🔄 第2阶段：冲刺强化（第${phase1 + 1}-${days}天）**
- 每天上午 30min：弱点针对性突破
- 每天下午 40min：压力面试模拟（挑战型面试官）
- 晚间：整理个人素材库，准备反问问题

**📋 每日Checklist：**
- ☐ 完成1轮模拟面试
- ☐ 复习3个核心知识点
- ☐ 阅读2条行业新闻并形成观点
- ☐ 练习1个STAR法则项目讲述
`;
    }

    _generateShortPlan(position, days) {
        return `### 📅 ${position} 面试冲刺规划（${days}天 — 紧凑模式）

---
**⚡ 每天安排：**
- 上午 1h：快速回顾核心知识 + 刷高频面试题
- 下午 1h：2轮全真模拟面试（含压力模式）
- 晚间 30min：复盘总结 + 弱点补强

**📌 重点事项：**
1. 优先练习自我介绍（准备1分钟和3分钟两个版本）
2. 用STAR法则准备3个核心项目故事
3. 准备3-5个高质量反问面试官的问题
4. 了解公司背景和近期动态
5. 每天至少1轮完整模拟面试

**⚠️ 最后${days}天，全力以赴！**
`;
    }

    _generateUrgentPlan(position, days) {
        return `### ⚡ ${position} 紧急冲刺（仅剩${days}天）

---
**🚨 紧急行动清单：**
1. ⏰ **立即**：练习自我介绍（1分钟版本），反复录音直到流畅自然
2. 📝 **今天**：用STAR法则写出3个最亮眼的项目故事
3. 🎯 **今晚**：完成至少1轮模拟面试
4. 📊 **明天**：复习岗位核心知识点（只看最重要的）
5. 🔥 **面试前**：了解公司概况 + 准备3个反问问题 + 整理仪表

**核心策略：不求面面俱到，但求重点突出！**

记住：自信 > 完美！`;
    }
}

// ==================== 4. 中英双语面试智能体 ====================
class BilingualAgent extends BaseAgent {
    constructor() {
        super('中英双语面试教练', '🌐', '英文自我介绍、专业问答、外企面试');
    }

    /**
     * 生成英文面试主题内容
     */
    generateTopic(topic, industry = 'general') {
        switch (topic) {
            case 'self_intro':
                return this._generateSelfIntro(industry);
            case 'common_qa':
                return this._generateCommonQA(industry);
            case 'professional':
                return this._generateProfessionalQA(industry);
            case 'mock':
                return this._startMockInterview(industry);
            case 'writing':
                return this._optimizeSelfIntro(industry);
            default:
                return this._generateDefault(industry);
        }
    }

    _generateSelfIntro(industry) {
        if (/金融|finance/i.test(industry)) {
            return `### 🌐 English Self-Introduction Template (Finance)

**⏱️ Duration:** 1.5 - 2 minutes

---

**Opening (15 seconds)**
> "Good morning/afternoon. My name is [Name]. I graduated from [University] with a degree in [Major], and I'm passionate about the financial services industry."

**Core Strengths (45 seconds)**
> "During my studies, I developed a strong foundation in [Core Subject 1], [Core Subject 2], and financial analysis. I've obtained [Certificate — e.g., CFA Level 1 / CPA]. 
>
> In my internship at [Company], I was responsible for [Key Task], where I applied [Skill] to achieve [Quantified Result]. This experience deepened my understanding of how financial theories are applied in real-world scenarios."

**Why This Role (30 seconds)**
> "I'm particularly drawn to this position at [Company] because of [Specific Reason — company reputation/growth area/culture]. I believe my skills in [Skill 1], [Skill 2], and [Skill 3] align well with what you're looking for. I'm excited about the opportunity to contribute to your team."

**Closing (15 seconds)**
> "Thank you for your consideration. I look forward to the opportunity to discuss how I can bring value to your organization."

---

**💡 Key Phrases to Practice:**
- "I'd like to highlight..." — 我想强调
- "One example would be..." — 举个例子
- "What sets me apart is..." — 我的不同之处在于
- "I'm particularly passionate about..." — 我特别热爱`;
        } else {
            return `### 🌐 English Self-Introduction Template (Tech)

**⏱️ Duration:** 1.5 - 2 minutes

---

**Opening (15 seconds)**
> "Hi, I'm [Name], a [Major] graduate from [University]. I specialize in [Tech Stack], with [X] years of hands-on experience in [Domain]."

**Technical Expertise (45 seconds)**
> "My core technical skills include [Tech 1], [Tech 2], and [Tech 3]. Most recently at [Company/Project], I built [System/Feature] that handled [Scale — e.g., 10K QPS] and improved [Metric] by [X]%.
>
> One challenge I'm particularly proud of solving was [Technical Challenge]. I approached it by [Your Solution], which resulted in [Impact]."

**Why This Role (30 seconds)**
> "I'm excited about [Company]'s work in [Area], especially [Specific Project/Technology]. I see a great fit between my background in [Your Expertise] and the challenges your team is tackling."

**Closing (15 seconds)**
> "I'd love to contribute to impactful projects at [Company]. Thank you for your time."

---

**💡 Tech Interview English Phrases:**
- "I was responsible for..." — 我负责
- "The key challenge was..." — 关键挑战是
- "We achieved this by..." — 我们通过...实现了这个
- "The impact was..." — 带来的影响是`;
        }
    }

    _generateCommonQA(industry) {
        const financeQA = `### 📋 Common English Interview Q&A

---

**Q1: Tell me about yourself.**
> Keep it under 2 minutes. Structure: Who you are → What you've done → Why this role. See the template above for a detailed framework.

**Q2: Why do you want to work here?**
> "I've been following [Company]'s [Recent Achievement/Product], and I'm impressed by [Specific Aspect]. Your focus on [Area] aligns with my career interests. Additionally, I believe my experience in [Relevant Skill] can contribute to [Company Goal]."

**Q3: What's your greatest strength?**
> "My greatest strength is [Strength + Evidence]. For example, during [Project], I [Action] which resulted in [Quantified Result]."

**Q4: What's your greatest weakness?**
> "I sometimes [Authentic Weakness], especially when [Situation]. However, I'm actively working on this by [Improvement]. For instance, [Example of Progress]."

**Q5: Where do you see yourself in 5 years?**
> "In the short term, I want to [1-Year Goal]. Within 3-5 years, I hope to [Long-term Goal] and contribute to [Company's Growth]. I see [Company] as the ideal place for this growth."

---

**🔥 Quick Practice:** Try answering each question out loud in English!`;

        return financeQA;
    }

    _generateProfessionalQA(industry) {
        if (/金融|finance/i.test(industry)) {
            return `### 💼 Professional English — Finance

---

**Key Financial English Vocabulary:**
| English | 中文 | Usage |
|---------|------|-------|
| Monetary Policy | 货币政策 | "The central bank's monetary policy affects..." |
| Fiscal Policy | 财政政策 | "Fiscal policy tools include..." |
| Valuation | 估值 | "We use DCF for valuation purposes..." |
| Diversification | 分散化 | "Portfolio diversification reduces risk..." |
| Liquidity | 流动性 | "Market liquidity is crucial for..." |
| Risk Management | 风险管理 | "Risk management involves identifying..." |
| Capital Market | 资本市场 | "The capital market plays a key role in..." |

**Sample Professional Response:**
> Q: "How would you analyze an investment opportunity?"
>
> A: "I would start with a **top-down approach**. First, I'd assess the **macroeconomic environment** — GDP growth, inflation, interest rates. Then, I'd analyze the **industry dynamics** using Porter's Five Forces. Finally, I'd evaluate the **company fundamentals** including financial statements, competitive advantages, and management quality. Based on this analysis, I'd determine the **fair value** using DCF and comparable company analysis."`;
        } else {
            return `### 💻 Professional English — Tech

---

**Key Tech English Vocabulary:**
| English | 中文 | Usage |
|---------|------|-------|
| Scalability | 可扩展性 | "The system needs to handle scalability..." |
| Trade-off | 权衡 | "There's a trade-off between A and B..." |
| Bottleneck | 瓶颈 | "We identified the bottleneck in..." |
| Latency | 延迟 | "We reduced latency from 500ms to 50ms..." |
| Throughput | 吞吐量 | "The system's throughput is 1000 QPS..." |
| Fault Tolerance | 容错 | "We designed for fault tolerance by..." |
| Refactoring | 重构 | "I led the refactoring of..." |

**Sample Technical Response:**
> Q: "How would you design a system to handle 1 million concurrent users?"
>
> A: "I'd approach this using a **layered architecture**. At the **access layer**, I'd use CDN + DNS load balancing, and Nginx for reverse proxy. At the **application layer**, I'd implement a **microservices** architecture with stateless services for horizontal scaling. For **caching**, I'd use a multi-level strategy — Redis for hot data and local cache. At the **database layer**, I'd apply **sharding** and read-write separation. Finally, I'd implement **circuit breakers** and **rate limiting** for protection."`;
        }
    }

    _startMockInterview(industry) {
        return `### 🎙️ English Mock Interview

---
**Interviewer:** Welcome to the interview. Let's start with a brief introduction. Tell me about yourself.

**You (respond below):**

---

📝 *Type your English response in the AI chat box, and I'll provide feedback and follow-up questions!*

**After your response, I'll evaluate:**
- Fluency and pronunciation-ready structure
- Grammar accuracy
- Professional vocabulary usage
- Content completeness and impact`;
    }

    _optimizeSelfIntro(industry) {
        return `### ✍️ Self-Introduction Optimization Guide

---

**1. Structure Check (3-Part Formula)**
- ✅ Hook: Start with a compelling opening (not just "Hi, my name is...")
- ✅ Substance: 2-3 specific achievements with numbers
- ✅ Connection: Why you + this company = great fit

**2. Common Mistakes to Avoid:**
- ❌ Reciting your resume ("I worked at X, then Y, then Z...")
- ❌ Being too humble ("I'm just a fresh graduate...")
- ❌ Being too vague ("I learned a lot...")
- ✅ Instead: Focus on impact and contribution

**3. Power Words to Include:**
- "Led" / "Drove" / "Spearheaded" — 主导
- "Achieved" / "Delivered" / "Improved" — 达成
- "Designed" / "Built" / "Implemented" — 构建
- "Optimized" / "Streamlined" / "Reduced" — 优化

**4. Practice Drill:**
Record yourself saying the intro 5 times. Each time, try to make it sound more natural and conversational. Time yourself — keep it under 2 minutes.`;
    }

    _generateDefault(industry) {
        return `### 🌐 Bilingual Interview Coach

I can help you with:

📝 **Self Introduction** — Structured templates for different industries
💬 **Common Q&A** — Top 5 most-frequent English interview questions
🏢 **Professional English** — Industry-specific vocabulary and responses
🎙️ **Mock Interview** — Practice a full English interview with me
✍️ **Writing Optimization** — Polish your self-introduction

What would you like to practice?`;
    }
}

// ==================== 5. 技术英语面试智能体 ====================
class TechBilingualAgent extends BaseAgent {
    constructor() {
        super('技术英语面试教练', '💻', '英文技术术语、算法讲解、科研英文');
    }

    generateContent(type, field = 'general') {
        switch (type) {
            case 'terminology': return this._genTerminology(field);
            case 'algorithm': return this._genAlgorithmExplain(field);
            case 'system_design': return this._genSystemDesign(field);
            case 'project': return this._genProjectExplain(field);
            case 'scientific': return this._genScientificAbstract(field);
            default: return this._genDefault(field);
        }
    }

    _genTerminology(field) {
        const commonTerms = `
### 💻 Essential Tech English Terminology

---

**Algorithms & Data Structures**
| English | 中文 | Example |
|---------|------|---------|
| Time Complexity | 时间复杂度 | "The time complexity of quicksort is O(n log n) on average." |
| Space Complexity | 空间复杂度 | "We need to consider space complexity when dealing with large datasets." |
| Hash Table | 哈希表 | "A hash table provides O(1) average lookup time." |
| Recursion | 递归 | "This problem can be solved elegantly using recursion." |
| Greedy Algorithm | 贪心算法 | "A greedy algorithm makes locally optimal choices at each step." |
| Dynamic Programming | 动态规划 | "DP breaks down the problem into overlapping subproblems." |

**System Design & Architecture**
| English | 中文 | Example |
|---------|------|---------|
| Load Balancer | 负载均衡器 | "We use a round-robin load balancer to distribute traffic." |
| Cache Invalidation | 缓存失效 | "Cache invalidation is one of the hardest problems in CS." |
| Single Point of Failure | 单点故障 | "We eliminated the single point of failure by adding redundancy." |
| Horizontal Scaling | 水平扩展 | "The system can handle increased load through horizontal scaling." |
| Circuit Breaker | 熔断器 | "The circuit breaker pattern prevents cascading failures." |
| Write-Ahead Log | 预写日志 | "The database uses a WAL for crash recovery." |

**AI / Machine Learning**
| English | 中文 | Example |
|---------|------|---------|
| Overfitting | 过拟合 | "The model is overfitting — it performs well on training data but poorly on test data." |
| Gradient Descent | 梯度下降 | "We optimize the loss function using stochastic gradient descent." |
| Backpropagation | 反向传播 | "Backpropagation computes the gradient of the loss with respect to each weight." |
| Feature Engineering | 特征工程 | "Good feature engineering is often more important than model choice." |

**Verbs for Technical Discussions**
- **Implement** — "I implemented a distributed cache..." (实现了)
- **Optimize** — "We optimized the query by adding an index..." (优化了)
- **Refactor** — "I refactored the legacy codebase..." (重构了)
- **Deploy** — "We deployed to production using CI/CD..." (部署了)
- **Troubleshoot** — "I troubleshooted the memory leak by..." (排查了)
`;
        return commonTerms;
    }

    _genAlgorithmExplain(field) {
        return `### 🧮 Explaining Algorithms in English

---

**Template Structure (for any algorithm explanation):**

> **1. What is it?** — Brief definition
> **2. How does it work?** — Step-by-step mechanism
> **3. Complexity Analysis** — Time & Space Big-O
> **4. When to use it?** — Practical scenarios
> **5. Example** — Simple walk-through

---

**Example: Explaining Binary Search**

**What is it?**
> "Binary search is an efficient algorithm for finding an element in a **sorted array**. It works by repeatedly dividing the search interval in half."

**How does it work?**
> "We start by comparing the target value with the middle element. If they're equal, we're done. If the target is smaller, we search the left half. If larger, we search the right half. We repeat until we either find the element or the interval becomes empty."

**Complexity:**
> "The time complexity is **O(log n)** because we halve the search space with each iteration. The space complexity is **O(1)** for the iterative version."

**When to use it:**
> "Use binary search when you have a sorted collection and need fast lookups. It's the foundation for many data structures like B-trees and is used in database indexing."

---

**Practice Drill:** Try explaining a BFS (Breadth-First Search) using this 5-step template!`;
    }

    _genSystemDesign(field) {
        return `### 🏗️ System Design in English — Key Phrases

---

**Opening the Design Discussion:**
- "Let me start by **clarifying the requirements**..." — 先明确需求
- "First, I'll outline the **high-level architecture**..." — 先概述高层架构
- "The key **constraints** we need to consider are..." — 关键约束是
- "Let's think about this in terms of **scale**..." — 从规模角度考虑

**Discussing Trade-offs:**
- "There's a **trade-off** between consistency and availability here..." — 这是一致性和可用性的权衡
- "We could use X, but the **downside** is..." — 可以用X，但缺点是
- "The **bottleneck** in this design would be..." — 这个设计的瓶颈在于
- "We can **mitigate** this risk by..." — 可以通过...来缓解风险

**Estimating Capacity:**
- "Assuming **X requests per second**..." — 假设每秒X个请求
- "That would require approximately **Y GB of storage**..." — 大约需要Y GB存储
- "With a **99.9% SLA**, we need..." — 按照99.9%的SLA，我们需要

**Wrapping Up:**
- "To **summarize**, the design consists of..." — 总结，设计包括
- "There are a few areas for **further optimization**..." — 有几个待优化方向
- "If I had more time, I'd also consider..." — 如果时间允许，还会考虑

---

**Practice:** Pick a system (e.g., URL shortener) and describe its design using these phrases!`;
    }

    _genProjectExplain(field) {
        return `### 💻 Explaining Your Project in English

---

**STAR Framework in English:**

> **S — Situation:** "The project was about..."
> **T — Task:** "My responsibility was to..."
> **A — Action:** "I approached this by..."
> **R — Result:** "As a result, we achieved..."

**Full Example:**

> **S:** "At my previous internship, we noticed that our API response time was averaging **3 seconds**, which severely impacted user experience."
>
> **T:** "I was tasked with **reducing the average response time** to under 500ms without changing the underlying database."
>
> **A:** "I started by **profiling the slow queries** and identifying the bottleneck — a missing index on a frequently queried column. I also **implemented Redis caching** for hot data and **introduced query batching** for bulk operations."
>
> **R:** "After deploying these changes, the average response time dropped to **180ms** — a **94% improvement**. The system could now handle **3x more traffic** without additional infrastructure cost."

**Key Verbs for Action Description:**
- **Investigated** / **Analyzed** — 调查/分析
- **Designed** / **Architected** — 设计/架构
- **Implemented** / **Developed** — 实现/开发
- **Tested** / **Validated** — 测试/验证
- **Deployed** / **Released** — 部署/发布
- **Monitored** / **Measured** — 监控/衡量

**Now you try!** Write your project story using this STAR framework.`;
    }

    _genScientificAbstract(field) {
        return `### 📄 Writing Scientific Abstracts (英文科研摘要)

---

**Standard Abstract Structure:**

1. **Background** (1-2 sentences) — What's the problem?
2. **Objective** (1 sentence) — What did you aim to do?
3. **Methods** (2-3 sentences) — How did you do it?
4. **Results** (2-3 sentences) — What did you find?
5. **Conclusion** (1-2 sentences) — What does it mean?

**Useful Phrases:**
- "In this paper, we propose..." — 本文提出
- "To address this challenge, we..." — 为解决这个挑战
- "Experimental results demonstrate that..." — 实验结果表明
- "Our approach achieves state-of-the-art performance on..." — 达到了SOTA性能
- "This work opens up new possibilities for..." — 为...开辟了新可能

**Example Abstract:**

> "Accurate stock price prediction remains a significant challenge in quantitative finance. **In this paper**, we propose a **novel hybrid model** combining LSTM networks with a transformer-based attention mechanism for multi-step stock prediction. **We evaluate** our approach on 5 years of S&P 500 constituent data across 11 sectors. **Experimental results show** that our model outperforms traditional methods by **12.3%** in RMSE and **8.7%** in directional accuracy. **These findings suggest** that attention-based architectures have significant potential in financial time series analysis."`;
    }

    _genDefault(field) {
        return `### 💻 Technical English Coach

I help you prepare for technical interviews in English:

📖 **Terminology Guide** — Essential tech vocabulary with examples
🧮 **Algorithm Explanations** — Learn to explain algorithms clearly
🏗️ **System Design Discussions** — Key phrases for architecture discussions
💻 **Project Presentations** — STAR framework for English project talks
📄 **Scientific Abstracts** — Academic writing in English

Choose a topic to get started!`;
    }
}

// ==================== 6. 面试教练智能体（增强版） ====================
class InterviewCoachAgent extends BaseAgent {
    constructor() {
        super('面试教练', '🎯', '全方位面试辅导教练');
    }

    /**
     * 综合响应 — 理解用户意图并给出针对性回答
     */
    respond(question) {
        const q = question.toLowerCase();

        // 自我介绍
        if (q.includes('自我介绍') || q.includes('介绍自己')) {
            return this._selfIntroGuide();
        }
        // 面试备战方案
        if (q.includes('备战') || q.includes('方案') || q.includes('计划') || q.includes('准备')) {
            return this._prepPlanGuide();
        }
        // 模拟面试
        if (q.includes('模拟') || q.includes('陪练') || q.includes('练习') || q.includes('面试我')) {
            return this._mockInterviewStart();
        }
        // 缺点/不足
        if (q.includes('缺点') || q.includes('不足') || q.includes('劣势')) {
            return this._weaknessGuide();
        }
        // 优势/亮点
        if (q.includes('优势') || q.includes('亮点') || q.includes('为什么录用') || q.includes('核心竞争力') || q.includes('胜任')) {
            return this._strengthGuide();
        }
        // 薪资
        if (q.includes('薪资') || q.includes('工资') || q.includes('薪酬') || q.includes('待遇') || q.includes('期望')) {
            return this._salaryGuide();
        }
        // 离职原因
        if (q.includes('离职') || q.includes('离开') || q.includes('跳槽') || q.includes('为什么走')) {
            return this._departureGuide();
        }
        // 职业规划
        if (q.includes('规划') || q.includes('职业') || q.includes('未来') || q.includes('五年')) {
            return this._careerPlanGuide();
        }
        // 压力面
        if (q.includes('压力') || q.includes('挑战') || q.includes('困难') || q.includes('失败') || q.includes('挫折') || q.includes('冲突')) {
            return this._challengeGuide();
        }
        // 加班
        if (q.includes('加班') || q.includes('996') || q.includes('工作强度')) {
            return this._overtimeGuide();
        }
        // 反问
        if (q.includes('反问') || q.includes('问什么') || q.includes('提问')) {
            return this._reverseQuestionGuide();
        }
        // 转行/无经验
        if (q.includes('转行') || q.includes('没经验') || q.includes('零基础') || q.includes('跨专业')) {
            return this._careerChangeGuide();
        }
        // 空白期
        if (q.includes('空白') || q.includes('空窗') || q.includes('gap') || q.includes('没工作') || q.includes('休息')) {
            return this._gapGuide();
        }
        // 简历
        if (q.includes('简历') || q.includes('cv') || q.includes('履历')) {
            return this._resumeGuide();
        }
        // 面试礼仪
        if (q.includes('礼仪') || q.includes('着装') || q.includes('穿着') || q.includes('穿什么')) {
            return this._etiquetteGuide();
        }
        // 面试后跟进
        if (q.includes('感谢') || q.includes('跟进') || q.includes('面试后') || q.includes('offer') || q.includes('结果')) {
            return this._followUpGuide();
        }
        // 你好/问候
        if (q.includes('你好') || q.includes('嗨') || q.includes('hello') || q === 'hi' || q === '在吗') {
            return `你好！👋 我是你的**AI面试教练**。

我可以帮你：
• 📝 **简历优化** — 亮点提炼、STAR法则话术
• 🎯 **岗位分析** — 解读JD、匹配度评估
• 💬 **高频难题** — 自我介绍、优缺点、离职原因等
• 📊 **模拟面试** — 扮演面试官进行全真演练
• 💡 **技巧指导** — 薪资谈判、反问问题、礼仪着装
• 🌐 **中英双语** — 英文自我介绍、专业英语问答
• 📦 **素材沉淀** — 提炼面试可用素材

**你现在最关注哪个方面？** 直接告诉我，我来帮你准备！`;
        }

        // 默认智能回复
        return `收到你的问题！关于"${question.substring(0, 40)}"：

我可以从以下几个维度帮你：
• 📝 **简历优化** — 亮点提炼、STAR法则话术
• 🎯 **岗位分析** — 解读JD要求，提炼核心能力
• 💬 **高频难题** — 自我介绍、优缺点、离职原因、薪资等
• 📊 **模拟面试** — 扮演面试官进行全真模拟演练
• 💡 **技巧指导** — 面试礼仪、薪资谈判、反问技巧、压力面应对
• 🌐 **中英双语** — 英文面试、专业术语
• 📅 **备考规划** — 按时间定制冲刺计划

**请告诉我你具体想了解哪一块？** 比如直接说"帮我准备自我介绍"或"模拟面试"，我会给你最精准的指导！`;
    }

    // ===== 各专项辅导内容 =====

    _selfIntroGuide() {
        return `### 📝 自我介绍 — 高分模板

**⏱️ 时长：1-2分钟最佳**

**黄金结构：**
\`\`\`
1. 我是谁（15秒）
2. 我的核心优势（45秒）— 用数据说话
3. 我为什么适合（30秒）— 与JD对应
4. 收尾（15秒）— 表达期待
\`\`\`

**高分技巧：**
• 开头用"钩子"引起兴趣（不要只说"我是XX"）
• 用STAR法则描述1-2个亮点经历
• 每个优势配一个数据（"提升30%"比"显著提升"好100倍）
• 结尾留一个"诱饵"引导追问

需要我根据你的具体岗位帮你写一段吗？`;
    }

    _prepPlanGuide() {
        return `### 📅 面试备战方案

**📋 第一阶段：准备期（3-5天）**
• 研究公司/岗位JD，提炼核心要求
• 梳理项目经历，准备STAR法则话术
• 准备好反问问题

**🎯 第二阶段：强化期（5-7天）**
• 专业知识框架梳理
• 行为面试经典问题准备
• 技术/专业面试题练习

**🔄 第三阶段：冲刺期（3天）**
• 每天至少1轮模拟面试
• 针对薄弱环节专项突破
• 整理仪表、准备材料

需要针对某个环节详细展开吗？`;
    }

    _mockInterviewStart() {
        return `### 🎙️ 模拟面试开始

---

**面试官：** 同学你好，感谢你来参加今天的面试。首先请你做一个简短的自我介绍。

（请在下方对话框中输入你的回答，我会根据你的回答进行追问和点评）

---

💡 **模拟面试规则：**
1. 我会模拟真实面试流程，包含专业提问、行为面试和压力测试
2. 每个回答后我会给出追问或点评
3. 面试结束后我会给出综合评估报告

准备好了吗？请在对话框中输入你的自我介绍！`;
    }

    _weaknessGuide() {
        return `### 🎯 "最大的缺点是什么" — 高分策略

**⚠️ 避坑：**
• ❌ "我太追求完美" — 太假
• ❌ "我没明显缺点" — 自大
• ❌ 真实但致命的缺点

**✅ 正确策略：**
1. 选"可改进的缺点"
2. 展示已在改进的行动
3. 包装成成长经历

**万能公式：** 真实缺点 + 具体改进 + 已有进步

需要我帮你定制一个具体版本吗？`;
    }

    _strengthGuide() {
        return `### 💪 "你的优势是什么" — 回答策略

**✅ 框架：3个核心优势 + 数据支撑**

**示例：**
> "我有3个核心优势与岗位匹配：
> 1. 专业能力扎实 — 在XX领域有X年经验，主导过XX项目
> 2. 学习能力强 — 曾在X个月自学XX技能应用于XX项目
> 3. 团队协作好 — 协调X个部门完成XX目标"

**要点：** 每个优势配案例 + 用数据 + 控制在3个以内`;
    }

    _salaryGuide() {
        return `### 💰 "薪资期望" — 回答技巧

**有明确预期：**
> "根据我的调研，市场上这个岗位的薪酬范围是X-Y万。结合我的经验和能力，我期望Z万。同时也看重整体发展前景。"

**不确定（应届生）：**
> "我更看重成长空间和学习机会。关于薪资，相信公司有公平的体系。能否先介绍一下岗位的薪资结构？"

**技巧：** 提前调研 + 给范围不给定数 + 强调整体回报`;
    }

    _departureGuide() {
        return `### 🔄 "为什么离职" — 高分策略

**❌ 不要说：** 领导不行/加班太多/工资太低

**✅ 推荐话术：**
• **正面型：** 在前公司学到很多，现在希望在新方向上发展
• **成长型：** 感觉遇到瓶颈，希望挑战更大的平台
• **客观型：** 公司业务调整/架构变动

**核心：** 正面、简洁、指向未来`;
    }

    _careerPlanGuide() {
        return `### 🎯 "职业规划" — 回答框架

**三段式：**

**短期（1年内）：** 融入团队，精通核心技能
**中期（3年内）：** 成为核心骨干，能带小团队
**长期（5年+）：** 向着技术专家/管理方向发展

**要点：** 具体可衡量 + 展示稳定性 + 与公司发展契合`;
    }

    _challengeGuide() {
        return `### ⚡ "压力/挑战/失败" — STAR法则模板

**万能公式：**
• **S（情境）：** 在XX项目中遇到XX困难
• **T（任务）：** 需要在X时间内完成任务
• **A（行动）：** 采取了①②③措施
• **R（结果）：** 达成XX成果（用数据）

**避坑：** 失败经历选"已克服"的，结果要量化`;
    }

    _overtimeGuide() {
        return `### ⏰ "加班"问题 — 高情商回答

**推荐话术：**
> "我理解项目紧急时加班是必要的，会主动确保任务完成。同时我也注重效率，尽量在工作时间内完成目标。"

**策略：** 表达合作意愿 + 强调效率 + 不卑不亢`;
    }

    _reverseQuestionGuide() {
        return `### 🎤 面试结束反问清单

**✅ 推荐问题：**
• "这个岗位目前最大的挑战是什么？"
• "我入职后3个月内最需要解决的问题？"
• "团队的晋升路径是怎样的？"
• "公司对新人的培养机制有哪些？"

**⚠️ 不要问：** 薪资福利（等HR面）、加班多不多、网上能查到的信息`;
    }

    _careerChangeGuide() {
        return `### 🔄 转行/无经验 — 回答策略

**核心思路：** 可迁移能力 + 学习意愿 + 已有准备

**示例：**
> "虽然没有直接经验，但我为转型做了充分准备：
> 1. 可迁移能力：之前的XX经验与岗位契合
> 2. 主动学习：完成了XX课程/项目
> 3. 热情匹配：长期关注该领域"

**加分项：** 展示已做的准备（课程/证书/项目）`;
    }

    _gapGuide() {
        return `### 📅 职业空白期 — 回答策略

**核心：** 坦诚 + 积极 + 有收获

**推荐话术：**
> "这段时间主要用于XX（学习/家庭/调整），期间也在关注行业动态。比如系统学习了XX技能，完成了XX项目。现在已经做好充分准备。"

**不同原因：**
• 考研/考公 → 虽然结果不理想，但更清楚自己想要什么
• 家庭原因 → 简要说明，强调已稳定
• 休息调整 → 做了系统复盘和技能提升`;
    }

    _resumeGuide() {
        return `### 📄 简历优化核心建议

**一页纸原则** — HR看一份简历平均6秒

**结构：**
1. 个人信息 — 姓名/电话/邮箱/求职意向
2. 教育背景 — 学校/专业/核心课程
3. 实习/工作经历（STAR法则，最重要！）
4. 项目经历 — 项目名/你的角色/成果
5. 技能/证书

**加分：** 数字说话 + 关键词匹配JD + 一页纸`;
    }

    _etiquetteGuide() {
        return `### 👔 面试礼仪要点

**着装：** 正装/商务休闲，干净整洁，提前了解公司dress code

**到达：** 提前10-15分钟，不要过早也不要迟到

**沟通：**
• 目光交流自然，不要紧盯也不要游离
• 微笑适度，展现自信和亲和力
• 坐姿端正，不要抖腿、玩手指

**离场：** 感谢面试官，礼貌道别，可简短表达期待`;
    }

    _followUpGuide() {
        return `### 📧 面试后跟进技巧

**感谢信（24小时内发送）：**
> "感谢您今天抽出时间面谈。通过交流，我对XX岗位和贵司的XX业务有了更深入的了解，也更加确认这是我的理想方向。期待您的回复。"

**跟进节奏：**
• 面试后24h → 发感谢信
• 1周无回复 → 礼貌跟进
• 2周无回复 → 可能已不匹配，继续找

**注意：** 不要频繁催促，保持专业礼貌`;
    }
}

// ==================== 全局智能体实例 ====================
window.questionBankAgent = new QuestionBankAgent();
window.materialAgent = new MaterialAgent();
window.planAgent = new PlanAgent();
window.bilingualAgent = new BilingualAgent();
window.techBilingualAgent = new TechBilingualAgent();
window.interviewCoachAgent = new InterviewCoachAgent();

// ==================== 智能题库面板全局函数 ====================

// 存储当前题库状态
window._bankState = {};

/**
 * 打开智能题库面板
 */
function openQuestionBank() {
    let category = 'general';
    let subCategory = null;

    // 根据当前场景自动选择类别
    if (currentScene === 'job') {
        category = 'finance';
        const dir = document.getElementById('jobDirection')?.value || 'securities';
        subCategory = dir;
    } else if (currentScene === 'techjob') {
        category = 'tech';
        const dir = document.getElementById('techJobDirection')?.value || 'software';
        const techMap = {
            software: 'cs_basics', frontend: 'frontend', algorithm: 'ai_ml',
            data: 'cs_basics', embedded: 'cs_basics', mechanical: 'cs_basics',
            electrical: 'cs_basics', civil: 'cs_basics', chemical: 'cs_basics',
            general: 'algorithms'
        };
        subCategory = techMap[dir] || 'cs_basics';
    }

    window._bankState = { category, subCategory };

    const panel = document.getElementById('questionBankPanel');
    if (!panel) return;

    panel.style.display = 'block';
    refreshQuestionBank(category, subCategory);
    panel.scrollIntoView({ behavior: 'smooth' });
}

/**
 * 刷新题库
 */
function refreshQuestionBank(category, subCategory) {
    const content = document.getElementById('questionBankContent');
    if (!content) return;

    category = category || window._bankState.category || 'general';
    subCategory = subCategory || window._bankState.subCategory || null;
    window._bankState = { category, subCategory };

    content.innerHTML = window.questionBankAgent.generateBankPanelHtml(category, subCategory, 10);
}

/**
 * 从题库开始练习某道题
 */
function startPracticeFromBank(index, category, subCategory) {
    const questions = window._bankState._lastQuestions;
    if (!questions || !questions[index]) {
        // 重新获取
        const result = window.questionBankAgent.generateQuestions(category, subCategory, 10);
        window._bankState._lastQuestions = result.questions;
        if (!result.questions[index]) return;
    }

    const question = window._bankState._lastQuestions
        ? window._bankState._lastQuestions[index]
        : window.questionBankAgent.generateQuestions(category, subCategory, 1).questions[0];

    if (!question) return;

    // 切换到当前场景对应的面试面板
    if (currentScene === 'job') {
        startInterviewFromQuestion(question);
    } else if (currentScene === 'techjob') {
        startTechInterviewFromQuestion(question);
    } else {
        // 通用练习
        startExamInterviewFromQuestion(question);
    }
}

function startInterviewFromQuestion(question) {
    interviewState = createInterviewSession();
    interviewState.active = true;
    interviewState.type = 'professional';
    interviewState.questions = [question];
    interviewState.currentQ = 0;

    document.getElementById('interviewChatCard').style.display = 'block';
    document.getElementById('scoreCard').style.display = 'none';
    document.getElementById('interviewTitle').textContent = '🧠 智能题库练习';
    document.getElementById('questionCounter').textContent = '题库练习';

    const msgs = document.getElementById('interviewMessages');
    msgs.innerHTML = '';
    addMessage('interviewMessages', 'bot',
        `🧠 <strong>智能题库：</strong>${question}`, true);
    document.getElementById('interviewChatCard').scrollIntoView({ behavior: 'smooth' });
}

function startTechInterviewFromQuestion(question) {
    techInterviewState = createInterviewSession();
    techInterviewState.active = true;
    techInterviewState.type = 'professional';
    techInterviewState.questions = [question];
    techInterviewState.currentQ = 0;

    document.getElementById('techInterviewChatCard').style.display = 'block';
    document.getElementById('techScoreCard').style.display = 'none';
    document.getElementById('techInterviewTitle').textContent = '🧠 智能题库练习';
    document.getElementById('techQuestionCounter').textContent = '题库练习';

    const msgs = document.getElementById('techInterviewMessages');
    msgs.innerHTML = '';
    addMessage('techInterviewMessages', 'bot',
        `🧠 <strong>智能题库：</strong>${question}`, true);
    document.getElementById('techInterviewChatCard').scrollIntoView({ behavior: 'smooth' });
}

function startExamInterviewFromQuestion(question) {
    examInterviewState = createInterviewSession();
    examInterviewState.active = true;
    examInterviewState.questions = [question];
    document.getElementById('examChatCard').style.display = 'block';
    document.getElementById('examInterviewTitle').textContent = '🧠 智能题库练习';
    const msgs = document.getElementById('examMessages');
    msgs.innerHTML = '';
    addMessage('examMessages', 'bot',
        `🧠 <strong>考官：</strong>${question}`, true);
    document.getElementById('examChatCard').scrollIntoView({ behavior: 'smooth' });
}

console.log('✅ 知学助手多智能体系统 v3.0 已就绪');
console.log('   🧠 智能题库智能体 | 📦 素材沉淀智能体 | 📅 冲刺规划智能体');
console.log('   🌐 双语面试智能体 | 💻 技术英语智能体 | 🎯 面试教练智能体');
