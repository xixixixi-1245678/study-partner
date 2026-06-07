// ============================================================
// 知学助手 - AI面试智能体核心引擎 v2.0
// 功能：智能面试官模拟、多轮深度追问、实时评分、个性化反馈
// ============================================================

class InterviewAgent {
    constructor() {
        // 智能体状态
        this.state = {
            mode: 'conversational',      // conversational / pressure / drill / exam
            personality: 'professional',  // professional / strict / friendly / challenging
            pressureLevel: 0,            // 0-100 压力指数
            followUpDepth: 0,            // 当前追问深度
            maxFollowUpDepth: 3,         // 最大追问深度
            topicStack: [],              // 话题栈
            knowledgeGaps: [],           // 知识盲区
            sessionHistory: [],          // 会话历史
            userProfile: {},             // 用户画像
            turnCount: 0,                // 轮次计数
            totalScore: 0,               // 累计得分
        };

        // 面试题库 - 按场景分类
        this.questionBank = this.initQuestionBank();

        // 追问策略库
        this.followUpStrategies = this.initFollowUpStrategies();

        // 评分维度
        this.scoringDimensions = this.initScoringDimensions();

        // 人格特征
        this.personalities = this.initPersonalities();
    }

    // ========== 初始化题库 ==========
    initQuestionBank() {
        return {
            // 财经岗
            finance_professional: {
                securities: [
                    { q: '请分析一下当前A股市场的估值水平，你认为哪些板块具有投资价值？', kp: ['估值分析', '行业判断', '投资逻辑'], difficulty: 3 },
                    { q: '如何对一家上市公司进行基本面分析？请说出你的分析框架。', kp: ['宏观分析', '行业分析', '公司分析', '估值'], difficulty: 3 },
                    { q: '解释一下DCF估值模型，并说明其优缺点。', kp: ['自由现金流', '折现率', '终值', '敏感性分析'], difficulty: 4 },
                    { q: '近期监管层出台了哪些影响证券行业的重要政策？谈谈你的理解。', kp: ['政策理解', '影响分析', '个人观点'], difficulty: 3 },
                    { q: '注册制改革对中国资本市场的深远影响是什么？', kp: ['发行制度', '信息披露', '投资者保护', '退市制度'], difficulty: 4 },
                ],
                fund: [
                    { q: '请解释一下基金净值的计算方法。', kp: ['资产估值', '费用扣除', '份额计算'], difficulty: 2 },
                    { q: '主动型基金和被动型基金各自的优劣势是什么？', kp: ['费率', '超额收益', '透明度', '流动性'], difficulty: 2 },
                    { q: '如果市场大幅下跌，作为基金经理你会如何调整投资组合？', kp: ['风险管理', '资产配置', '止损策略'], difficulty: 4 },
                    { q: '请谈谈ESG投资理念在基金行业的应用现状和前景。', kp: ['ESG标准', '评级体系', '投资策略', '趋势判断'], difficulty: 3 },
                ],
                accounting: [
                    { q: '请说明权责发生制和收付实现制的区别，并举例说明。', kp: ['收入确认', '费用匹配', '实务应用'], difficulty: 2 },
                    { q: '如何判断一项支出应该资本化还是费用化？', kp: ['受益期限', '金额阈值', '会计准则'], difficulty: 3 },
                    { q: '新收入准则（五步法）的核心变化是什么？', kp: ['合同识别', '履约义务', '交易价格', '收入确认'], difficulty: 3 },
                ],
                banking: [
                    { q: '请解释商业银行的"三性"原则及其平衡关系。', kp: ['安全性', '流动性', '盈利性', '平衡策略'], difficulty: 2 },
                    { q: '利率市场化对商业银行的经营有什么影响？', kp: ['利差变化', '定价能力', '风险管理'], difficulty: 3 },
                    { q: '请谈谈你对数字人民币的理解和看法。', kp: ['技术原理', '应用场景', '影响分析'], difficulty: 3 },
                ],
            },
            // 理工岗
            tech_professional: {
                software: [
                    { q: '请详细介绍你最熟悉的一个技术方案的架构设计，从需求到实现完整说明。', kp: ['架构设计', '技术选型', '难点攻克'], difficulty: 4 },
                    { q: '如何设计一个支持百万并发的系统？请从接入层到数据层完整阐述。', kp: ['负载均衡', '缓存策略', '数据库优化', '微服务'], difficulty: 5 },
                    { q: '你在项目中遇到过什么技术难题？是如何定位、分析和解决的？', kp: ['问题定位', '根因分析', '解决方案', '效果验证'], difficulty: 3 },
                    { q: 'MySQL一条查询SQL的执行过程是怎样的？如何进行慢查询优化？', kp: ['查询流程', '索引原理', '执行计划', '优化策略'], difficulty: 3 },
                ],
                algorithm: [
                    { q: '请解释Transformer的Self-Attention机制，以及它为什么比RNN更有效。', kp: ['注意力机制', '并行计算', '长距离依赖'], difficulty: 4 },
                    { q: '当模型在训练集上表现好但测试集表现差时，你会如何排查和解决？', kp: ['过拟合诊断', '正则化', '数据增强', '模型简化'], difficulty: 3 },
                    { q: '请解释一下梯度消失和梯度爆炸问题，以及常见的解决方法。', kp: ['梯度传播', '激活函数', 'BatchNorm', '残差连接'], difficulty: 3 },
                ],
                frontend: [
                    { q: '请解释浏览器从输入URL到页面渲染的完整过程。', kp: ['DNS解析', 'TCP连接', 'HTTP请求', '渲染流程'], difficulty: 3 },
                    { q: '如何优化一个首屏加载时间超过5秒的SPA应用？', kp: ['代码分割', '懒加载', 'CDN', '缓存策略'], difficulty: 3 },
                    { q: '请解释React/Vue的虚拟DOM原理及其性能优化策略。', kp: ['虚拟DOM', 'Diff算法', '批量更新', 'Key策略'], difficulty: 3 },
                ],
            },
            // 考证复试
            exam_oral: {
                definition: [
                    { q: '请解释什么是货币政策，并说明其主要工具。', kp: ['定义', '工具分类', '传导机制'], difficulty: 2 },
                    { q: '请解释"边际效用递减"规律，并举例说明。', kp: ['概念定义', '数学表达', '实际案例'], difficulty: 2 },
                ],
                shortanswer: [
                    { q: '请论述财政政策与货币政策的协调配合机制。', kp: ['政策工具', '协调机制', '效果分析'], difficulty: 3 },
                    { q: '请分析通货膨胀的成因、影响及治理措施。', kp: ['成因分析', '影响维度', '政策措施'], difficulty: 3 },
                ],
            },
            // HR面试
            hr: {
                general: [
                    { q: '请做一下自我介绍。', kp: ['基本信息', '核心优势', '职业目标'], difficulty: 1 },
                    { q: '你为什么选择我们公司/这个岗位？', kp: ['公司了解', '岗位匹配', '职业规划'], difficulty: 2 },
                    { q: '你认为你最大的优势和劣势分别是什么？', kp: ['自我认知', '诚实度', '改进意愿'], difficulty: 2 },
                    { q: '请描述一次你克服重大困难的经历。', kp: ['情境描述', '行动方案', '结果反思'], difficulty: 2 },
                    { q: '你对薪资的期望是什么？', kp: ['市场了解', '自我定位', '谈判策略'], difficulty: 2 },
                ],
            },
            // 行为面试
            behavior: {
                general: [
                    { q: '请用STAR法则描述一个你领导团队完成的项目。', kp: ['情境', '任务', '行动', '结果'], difficulty: 2 },
                    { q: '当你的意见与上级不一致时，你会如何处理？请举例说明。', kp: ['沟通方式', '专业坚持', '妥协智慧'], difficulty: 3 },
                    { q: '描述一次你在时间紧迫的情况下完成重要任务的经历。', kp: ['优先级', '时间管理', '压力应对'], difficulty: 2 },
                ],
            },
            // 压力面试
            pressure: {
                general: [
                    { q: '说实话，和你同批的候选人中，有人比你更有经验。你觉得你的独特优势在哪里？', kp: ['自信', '差异化', '实例支撑'], difficulty: 4 },
                    { q: '我看你的简历上有一段空白期，能解释一下吗？', kp: ['坦诚', '价值转化', '成长描述'], difficulty: 3 },
                    { q: '如果这次面试没通过，你觉得可能的原因是什么？', kp: ['反思能力', '自我认知', '改进方向'], difficulty: 4 },
                ],
            },
            // 答辩
            defense: {
                proposal: [
                    { q: '请简述你的研究背景和选题意义。', kp: ['研究背景', '问题定义', '创新点'], difficulty: 2 },
                    { q: '你的研究方法有什么创新之处？和现有方法相比优势在哪里？', kp: ['方法对比', '创新点', '优势分析'], difficulty: 3 },
                ],
                final: [
                    { q: '请用3分钟概述你的毕业设计/论文的核心工作。', kp: ['问题', '方法', '结果', '贡献'], difficulty: 3 },
                    { q: '你的研究结果有什么实际应用价值？', kp: ['应用场景', '价值量化', '推广思路'], difficulty: 3 },
                    { q: '你在研究中遇到的最大困难是什么？如何克服的？', kp: ['困难描述', '解决过程', '经验总结'], difficulty: 2 },
                ],
            },
        };
    }

    // ========== 初始化追问策略 ==========
    initFollowUpStrategies() {
        return {
            expand: [
                '能否再具体展开说说？比如举一个你亲身经历的例子。',
                '你提到了一些概念，能深入解释一下背后的原理吗？',
                '这个回答比较概括，能谈谈你个人的理解或实际操作体会吗？',
                '你说得很好，但我还想了解更具体的实施细节。',
            ],
            deepen: [
                '你提到了一个有意思的观点，能深入分析一下背后的底层逻辑吗？',
                '在实际场景中，这个理论具体如何落地？请结合场景说明。',
                '这个问题还有更深层的考量——你觉得在这个基础上还有什么需要补充的？',
                '很好，但我好奇：如果约束条件发生变化，你的结论还成立吗？',
            ],
            challenge: [
                '我不同意你的观点。如果实际情况恰好相反，你怎么应对？',
                '你的回答在理论上成立，但在实际中我见过很多反例。请用一个真实案例支撑你的观点。',
                '假设你的方案被上级否决了，你会怎么做？请具体说明应对策略。',
                '你对自己的这个回答打多少分？为什么？哪些地方可以改进？',
            ],
            pressure: [
                '说实话，我觉得你的回答还没有触及核心。再给你一次机会，请用一句话概括你的核心观点。',
                '如果现在让你当场给CEO做3分钟汇报，你会怎么讲？',
                '你确定吗？我这里有相反的数据。你如何证明你的观点是正确的？',
                '现在请你换位思考：如果你是面试官，听了自己刚才的回答，你会怎么评价？',
            ],
            redirect: [
                '换个角度——如果从竞争对手的角度来看这个问题，你会怎么分析？',
                '你刚才说的我都理解了，但我想从另一个维度来探讨：',
                '这个问题我们先放一放。我更好奇的是你在另一个方面的思考：',
            ],
        };
    }

    // ========== 初始化评分维度 ==========
    initScoringDimensions() {
        return [
            { key: 'accuracy', name: '专业准确度', weight: 0.25, color: '#2563eb' },
            { key: 'depth', name: '思维深度', weight: 0.20, color: '#7c3aed' },
            { key: 'logic', name: '逻辑清晰度', weight: 0.20, color: '#059669' },
            { key: 'expression', name: '表达能力', weight: 0.15, color: '#d97706' },
            { key: 'case', name: '案例支撑力', weight: 0.10, color: '#dc2626' },
            { key: 'confidence', name: '自信与应变', weight: 0.10, color: '#0891b2' },
        ];
    }

    // ========== 初始化人格特征 ==========
    initPersonalities() {
        return {
            professional: {
                name: '专业型面试官',
                style: '专业、严谨、注重逻辑',
                greeting: '你好，欢迎参加本次模拟面试。请先做一下自我介绍。',
                transitionPhrases: ['好的，接下来我们聊下一个话题。', '明白了，我们继续。', '了解了，下一个问题：'],
                closingPhrase: '好的，面试到此结束。感谢你的参与，请查看AI智能体生成的评分报告。',
            },
            strict: {
                name: '严厉型面试官',
                style: '严格、犀利、施加压力',
                greeting: '请坐。开始面试前我想提醒你：我会问得比较深入，请做好准备。先自我介绍吧。',
                transitionPhrases: ['好，下一个。', '继续。', '这个问题到此为止，下一个：'],
                closingPhrase: '面试结束。你的表现我会综合评估。',
            },
            friendly: {
                name: '亲和型面试官',
                style: '友善、鼓励、轻松氛围',
                greeting: '嗨！放轻松，就当是一次愉快的交流。先来聊聊你自己吧？',
                transitionPhrases: ['很棒！我们继续聊聊：', '有意思，那下一个话题是：', '不错哦，再看看这个：'],
                closingPhrase: '聊得很愉快！面试到这里就结束了，来看看你的评估报告吧~',
            },
            challenging: {
                name: '挑战型面试官',
                style: '质疑、反诘、考验极限',
                greeting: '我看过你的简历了。说实话，你的背景在这个岗位的候选人中并不突出。请说服我为什么要录用你。',
                transitionPhrases: ['这个回答我持保留意见。下一个问题：', '嗯...还不够。我们继续：', '好吧，接下来：'],
                closingPhrase: '面试结束。我会给出客观的评估。',
            },
        };
    }

    // ========== 核心方法：启动面试会话 ==========
    startSession(scene, type, personality = 'professional') {
        this.resetState();
        this.state.mode = type;
        this.state.personality = personality;
        this.state.scene = scene;

        const persona = this.personalities[personality];
        const questions = this.selectQuestions(scene, type);

        return {
            greeting: persona.greeting,
            questions: questions,
            personality: persona,
            totalQuestions: questions.length,
        };
    }

    // ========== 选择题目 ==========
    selectQuestions(scene, type) {
        let pool = [];

        // 根据场景和类型选择题库
        if (scene === 'job') {
            const direction = document.getElementById('jobDirection')?.value || 'general';
            const bank = this.questionBank.finance_professional;
            pool = bank[direction] || bank.securities || [];

            // 混合HR题目
            if (type === 'hr') {
                pool = [...(this.questionBank.hr.general || []), ...pool.slice(0, 2)];
            } else if (type === 'behavior') {
                pool = this.questionBank.behavior.general || [];
            } else if (type === 'pressure') {
                pool = this.questionBank.pressure.general || [];
            }
        } else if (scene === 'techjob') {
            const direction = document.getElementById('techJobDirection')?.value || 'software';
            const bank = this.questionBank.tech_professional;
            pool = bank[direction] || bank.software || [];

            if (type === 'hr') {
                pool = [...(this.questionBank.hr.general || []), ...pool.slice(0, 2)];
            } else if (type === 'behavior') {
                pool = this.questionBank.behavior.general || [];
            }
        } else if (scene === 'exam') {
            const bank = this.questionBank.exam_oral;
            pool = bank[type] || bank.definition || [];
        } else if (scene === 'defense') {
            const bank = this.questionBank.defense;
            pool = bank[type] || bank.final || [];
        }

        // 确保至少5道题，随机选取
        if (pool.length < 5) {
            // 从通用库补充
            const generalPool = this.questionBank.hr.general || [];
            pool = [...pool, ...generalPool.slice(0, 5 - pool.length)];
        }

        // 随机打乱并取前5道
        const shuffled = [...pool].sort(() => Math.random() - 0.5);
        return shuffled.slice(0, Math.min(7, shuffled.length)).map(q => typeof q === 'string' ? { q, kp: [], difficulty: 2 } : q);
    }

    // ========== 核心方法：分析回答 ==========
    analyzeAnswer(answer, questionContext) {
        const result = {
            length: answer.length,
            wordCount: answer.replace(/[^\u4e00-\u9fa5a-zA-Z]/g, '').length,
            quality: 'low',
            score: 30,
            keywords: [],
            structure: {
                hasIntro: false,
                hasBody: false,
                hasConclusion: false,
                hasExample: false,
                hasData: false,
            },
            deepSemantics: {
                hesitation: false,
                confidence: false,
                humble: false,
                structure: false,
                depth: false,
                defensive: false,
            },
            feedback: '',
            shouldFollowUp: false,
            followUpDirection: 'expand',
            nextDifficulty: 'normal',
        };

        // ===== 基础长度评估 =====
        if (result.wordCount < 8) {
            result.quality = 'low';
            result.score = 15 + Math.floor(Math.random() * 15);
            result.feedback = '回答过于简短，建议展开论述，提供更多细节和思考过程。';
            result.shouldFollowUp = true;
            result.followUpDirection = 'expand';
        } else if (result.wordCount < 25) {
            result.quality = 'medium';
            result.score = 35 + Math.floor(Math.random() * 15);
            result.feedback = '回答有一定内容，但深度和广度都不够。可以从多个维度展开分析。';
            result.shouldFollowUp = Math.random() > 0.4;
            result.followUpDirection = 'deepen';
        } else if (result.wordCount < 80) {
            result.quality = 'good';
            result.score = 60 + Math.floor(Math.random() * 15);
            result.feedback = '回答较为完整。如果能结合具体案例或数据支撑会更有说服力。';
            result.shouldFollowUp = Math.random() > 0.6;
            result.followUpDirection = Math.random() > 0.5 ? 'challenge' : 'deepen';
        } else {
            result.quality = 'excellent';
            result.score = 78 + Math.floor(Math.random() * 17);
            result.feedback = '回答全面深入，展现了对问题的深刻理解和丰富的实践经验。';
            result.shouldFollowUp = Math.random() > 0.7;
            result.followUpDirection = 'challenge';
            result.nextDifficulty = 'hard';
        }

        // ===== 结构分析 =====
        result.structure.hasExample = /例如|比如|举例|案例|实例|场景|经历|做过/.test(answer);
        result.structure.hasData = /\d+%|\d+亿|\d+万|\d+\.\d+|[0-9]+/.test(answer);
        result.structure.hasBody = result.wordCount > 12;
        result.structure.hasIntro = result.wordCount > 20 && /是|指|定义|概念|所谓|属于/.test(answer);
        result.structure.hasConclusion = /首先.*其次.*最后|第一.*第二.*第三|一方面.*另一方面|综上所述|总之|因此/.test(answer);

        // ===== 深度语义分析 =====
        result.deepSemantics.hesitation = /嗯|呃|这个|那个|就是|可能吧/.test(answer);
        result.deepSemantics.confidence = /一定|确定|毫无疑问|显然|必然|绝对/.test(answer);
        result.deepSemantics.humble = /可能|也许|大概|我觉得|个人认为|不一定/.test(answer);
        result.deepSemantics.structure = /首先.*其次|第一.*第二|一方面.*另一方面/.test(answer);
        result.deepSemantics.depth = /原理|机制|本质|根源|底层|核心|深层/.test(answer);
        result.deepSemantics.defensive = /不是.*而是|虽然.*但是|尽管|不过|然而/.test(answer);

        // ===== 加分项 =====
        if (result.structure.hasExample) result.score = Math.min(98, result.score + 8);
        if (result.structure.hasData) result.score = Math.min(98, result.score + 5);
        if (result.structure.hasConclusion) result.score = Math.min(98, result.score + 7);
        if (result.deepSemantics.confidence && result.deepSemantics.depth) result.score = Math.min(98, result.score + 5);
        if (result.deepSemantics.hesitation && result.wordCount < 20) result.score = Math.max(10, result.score - 8);

        // ===== 生成反馈 =====
        let tips = [];
        if (!result.structure.hasExample) tips.push('建议加入具体案例');
        if (!result.structure.hasData) tips.push('可以用数据增强说服力');
        if (!result.structure.hasConclusion) tips.push('建议采用"总-分-总"结构');
        if (result.deepSemantics.hesitation) tips.push('回答时更加自信果断');
        if (tips.length > 0) {
            result.feedback += ' 💡改进建议：' + tips.join('；') + '。';
        }

        return result;
    }

    // ========== 核心方法：生成追问 ==========
    generateFollowUp(analysis, questionText, questionType) {
        const depth = this.state.followUpDepth;

        if (depth === 1) {
            // 第一层追问：扩展/深化
            const pool = analysis.followUpDirection === 'expand'
                ? this.followUpStrategies.expand
                : this.followUpStrategies.deepen;
            return this.pickRandom(pool);
        }

        if (depth === 2) {
            // 第二层追问：挑战/质疑
            this.state.pressureLevel += 20;
            return this.pickRandom(this.followUpStrategies.challenge);
        }

        if (depth >= 3) {
            // 第三层追问：极限施压
            this.state.pressureLevel = Math.min(100, this.state.pressureLevel + 30);
            return this.pickRandom(this.followUpStrategies.pressure);
        }

        return '';
    }

    // ========== 核心方法：即兴压力提问 ==========
    generatePressureAttack() {
        const attacks = [
            '打断一下——我注意到你之前的回答中有一个明显的逻辑矛盾，你自己意识到了吗？',
            '恕我直言，你的回答让我感觉你只是在背答案。你能用你自己的话重新组织一下吗？',
            '这个问题我们换个角度：如果你是面试官，你会录用像你这样的候选人吗？为什么？',
            '说实话，你的回答让我有些失望。你觉得问题出在哪里？',
            '你在回答中多次使用"我觉得""我认为"，但我更想听到数据和分析，而不是感觉。',
            '坦率地说，我还没被说服。请用30秒重新组织你的核心论点。',
        ];
        return this.pickRandom(attacks);
    }

    // ========== 核心方法：评估过渡语 ==========
    getTransition(quality) {
        const transitions = {
            excellent: ['回答很精彩！我们继续下一题。', '非常好，我对你的思路很满意。接下来：', '很棒的回答。下一个问题：'],
            good: ['好的，了解了。我们继续：', '不错。接下来聊：', '明白了。下一个话题：'],
            medium: ['嗯，我大概理解了。继续：', '好的，我们看下一题：', '了解了。接下来：'],
            low: ['嗯...我们继续下一题吧。', '好的，下一个问题：', '我们继续。'],
        };
        return this.pickRandom(transitions[quality] || transitions.medium);
    }

    // ========== 核心方法：生成综合评分报告 ==========
    generateScoreReport(answers, totalQuestions) {
        const validAnswers = answers.filter(a => a.answer !== '(跳过)');
        const skippedCount = answers.filter(a => a.answer === '(跳过)').length;
        const allScores = validAnswers.map(a => a.score);

        const avgScore = allScores.length > 0
            ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length)
            : 0;

        // 计算各维度得分
        const dimensions = this.scoringDimensions.map(dim => {
            let base = avgScore;
            const hasExamples = validAnswers.filter(a => a.analysis?.structure?.hasExample).length;
            const hasStructure = validAnswers.filter(a => a.analysis?.structure?.hasConclusion).length;
            const hasConfidence = validAnswers.filter(a => a.analysis?.deepSemantics?.confidence).length;
            const hasDepth = validAnswers.filter(a => a.analysis?.deepSemantics?.depth).length;

            if (dim.key === 'accuracy') base += hasDepth * 2 - skippedCount * 5;
            if (dim.key === 'depth') base += hasDepth * 3;
            if (dim.key === 'logic') base += hasStructure * 3;
            if (dim.key === 'expression') base += hasConfidence * 2;
            if (dim.key === 'case') base += hasExamples * 4;
            if (dim.key === 'confidence') base += hasConfidence * 3 - skippedCount * 3;

            return {
                ...dim,
                score: Math.max(20, Math.min(98, Math.round(base + Math.floor(Math.random() * 6) - 3)))
            };
        });

        const totalScore = Math.round(dimensions.reduce((a, b) => a + b.score, 0) / dimensions.length);

        // 生成亮点和改进建议
        const highlights = [];
        const improvements = [];

        const exampleCount = validAnswers.filter(a => a.analysis?.structure?.hasExample).length;
        const structureCount = validAnswers.filter(a => a.analysis?.structure?.hasConclusion).length;

        if (exampleCount >= 2) highlights.push('善于用具体案例支撑观点，回答有说服力');
        else if (validAnswers.length > 0) improvements.push('建议多用具体案例或数据来支撑观点');

        if (structureCount >= 2) highlights.push('回答结构清晰，逻辑层次分明');
        else improvements.push('建议采用"总-分-总"结构组织回答');

        if (skippedCount > 0) improvements.push(`跳过了${skippedCount}道题，建议加强临场应变训练`);
        if (avgScore >= 75) highlights.push('整体表现优秀，专业知识掌握扎实');
        if (avgScore < 50) improvements.push('基础概念需要加强，建议系统复习后再来练习');

        const followUpCount = validAnswers.filter(a => a.isFollowUp).length;
        if (followUpCount >= 2) highlights.push(`应对了${followUpCount}轮深度追问，临场应变能力强`);

        let level = '中等';
        if (totalScore >= 85) level = '优秀';
        else if (totalScore >= 70) level = '良好';
        else if (totalScore < 50) level = '需要提升';

        const pressureNote = this.state.pressureLevel >= 60
            ? `<p style="color:#ef4444;font-size:13px;">⚠️ 本次面试压力指数较高（${this.state.pressureLevel}/100），面试官使用了较多压力提问，建议加强抗压训练。</p>`
            : '';

        return {
            totalScore,
            level,
            avgScore,
            dimensions,
            highlights,
            improvements,
            validCount: validAnswers.length,
            skippedCount,
            followUpCount,
            pressureNote,
            pressureLevel: this.state.pressureLevel,
        };
    }

    // ========== 核心方法：生成面试总结反馈 ==========
    generateSummaryFeedback(report) {
        let feedback = '<div class="success-box" style="margin-top:16px;">';
        feedback += '<strong>💡 AI智能体综合提升建议：</strong><br><br>';

        if (report.totalScore >= 85) {
            feedback += '🎯 <strong>你已处于高分段：</strong>继续保持结构化思维，建议挑战更高难度的模拟面试（如切换"挑战型"面试官人格），进一步提升临场应变能力。';
        } else if (report.totalScore >= 70) {
            feedback += '📈 <strong>稳步提升建议：</strong><br>';
            feedback += '1. 每次回答采用"结论先行→论据支撑→案例佐证→总结升华"四段式结构<br>';
            feedback += '2. 回答时长控制在1-2分钟，重点突出、逻辑清晰<br>';
            feedback += '3. 面对追问时，先理解面试官意图再回答，不要急于辩解';
        } else if (report.totalScore >= 50) {
            feedback += '📚 <strong>基础提升建议：</strong><br>';
            feedback += '1. 先巩固专业知识基础，确保核心概念清晰<br>';
            feedback += '2. 练习用STAR法则组织回答（情境-任务-行动-结果）<br>';
            feedback += '3. 每次回答至少包含一个具体案例或数据支撑<br>';
            feedback += '4. 多进行模拟练习，提升表达的流畅度和自信心';
        } else {
            feedback += '🔰 <strong>入门建议：</strong><br>';
            feedback += '1. 建议先回到"知识学习"模块系统复习专业知识<br>';
            feedback += '2. 从简单问题开始练习，逐步提升回答的深度和广度<br>';
            feedback += '3. 多看优秀面试案例，学习答题框架和表达方式<br>';
            feedback += '4. 不要灰心，每次练习都是一次进步！';
        }

        feedback += '</div>';
        return feedback;
    }

    // ========== 工具方法 ==========
    resetState() {
        this.state = {
            mode: 'conversational',
            personality: 'professional',
            pressureLevel: 0,
            followUpDepth: 0,
            maxFollowUpDepth: 3,
            topicStack: [],
            knowledgeGaps: [],
            sessionHistory: [],
            userProfile: {},
            turnCount: 0,
            totalScore: 0,
            scene: '',
        };
    }

    pickRandom(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    shouldPressureAttack(answeredCount, quality) {
        // 高质量回答后有概率触发压力提问
        if (quality === 'good' && answeredCount > 1 && Math.random() < 0.2) return true;
        if (quality === 'excellent' && answeredCount > 0 && Math.random() < 0.25) return true;
        return false;
    }

    // ========== 获取面试配置 ==========
    getConfig() {
        const persona = this.personalities[this.state.personality];
        return {
            personality: persona,
            pressureLevel: this.state.pressureLevel,
            followUpDepth: this.state.followUpDepth,
            mode: this.state.mode,
        };
    }
}

// ========== 全局智能体实例 ==========
window.interviewAgent = new InterviewAgent();

// ========== 暴露给全局的便捷方法 ==========

/**
 * 启动智能体面试
 * @param {string} scene - 场景: 'job' | 'techjob' | 'exam' | 'defense'
 * @param {string} type - 面试类型
 * @param {string} personality - 人格: 'professional' | 'strict' | 'friendly' | 'challenging'
 */
function agentStartInterview(scene, type, personality = 'professional') {
    return window.interviewAgent.startSession(scene, type, personality);
}

/**
 * 分析回答
 */
function agentAnalyzeAnswer(answer, questionContext) {
    return window.interviewAgent.analyzeAnswer(answer, questionContext);
}

/**
 * 生成追问
 */
function agentGenerateFollowUp(analysis, questionText, questionType) {
    return window.interviewAgent.generateFollowUp(analysis, questionText, questionType);
}

/**
 * 生成压力提问
 */
function agentGeneratePressureAttack() {
    return window.interviewAgent.generatePressureAttack();
}

/**
 * 获取过渡语
 */
function agentGetTransition(quality) {
    return window.interviewAgent.getTransition(quality);
}

/**
 * 生成评分报告
 */
function agentGenerateScoreReport(answers, totalQuestions) {
    return window.interviewAgent.generateScoreReport(answers, totalQuestions);
}

/**
 * 生成总结反馈
 */
function agentGenerateSummaryFeedback(report) {
    return window.interviewAgent.generateSummaryFeedback(report);
}

/**
 * 是否触发压力提问
 */
function agentShouldPressureAttack(answeredCount, quality) {
    return window.interviewAgent.shouldPressureAttack(answeredCount, quality);
}

/**
 * 获取智能体配置
 */
function agentGetConfig() {
    return window.interviewAgent.getConfig();
}

/**
 * 设置智能体人格
 */
function agentSetPersonality(personality) {
    window.interviewAgent.state.personality = personality;
}

/**
 * 重置智能体
 */
function agentReset() {
    window.interviewAgent.resetState();
}

console.log('✅ 知学助手 AI面试智能体 v2.0 已就绪');
