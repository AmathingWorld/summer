document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 元素引用 ---
    const selectCharButtons = document.querySelectorAll('.char-button'); // 選擇所有角色按鈕
    const charAvatar = document.getElementById('char-avatar');
    const charName = document.getElementById('char-name');
    const charJobName = document.getElementById('char-job-name'); // 職業名稱顯示
    const charLevel = document.getElementById('char-level');
    const charCurrentXp = document.getElementById('char-current-xp');
    const charXpNeeded = document.getElementById('char-xp-needed');
    const charXpBar = document.getElementById('char-xp-bar');
    const charMoney = document.getElementById('char-money'); // 金錢顯示
    const charAttack = document.getElementById('char-attack'); // 攻擊力顯示
    const charDefense = document.getElementById('char-defense'); // 防禦力顯示
    const taskList = document.getElementById('task-list');
    const skillList = document.getElementById('skill-list'); // 招式列表
    const resetDailyTasksBtn = document.getElementById('reset-daily-tasks-btn');
    const fullResetBtn = document.getElementById('full-reset-btn');
    const body = document.body;

    // 每日/週統計相關元素
    const prevWeekBtn = document.getElementById('prev-week-btn');
    const nextWeekBtn = document.getElementById('next-week-btn');
    const currentStatsWeekSpan = document.getElementById('current-stats-week');
    const chartTypeRadios = document.querySelectorAll('input[name="chart-type"]');
    const weeklyStatsChartCtx = document.getElementById('weeklyStatsChart').getContext('2d');
    let weeklyStatsChart; // Chart.js 實例

    // 角色設定彈出視窗相關元素
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeModalButtons = document.querySelectorAll('.close-button'); // 選擇所有關閉按鈕
    const charNameInput = document.getElementById('char-name-input');
    const jobSelectionDiv = document.getElementById('job-selection');
    const avatarSelectionDiv = document.getElementById('avatar-selection');
    const saveSettingsBtn = document.getElementById('save-settings-btn');

    // 任務設定彈出視窗相關元素
    const manageTasksBtn = document.getElementById('manage-tasks-btn'); // 新增的任務設定按鈕
    const manageTasksModal = document.getElementById('manage-tasks-modal'); // 任務設定 Modal
    const newManagedTaskNameInput = document.getElementById('new-managed-task-name');
    const newManagedTaskXpInput = document.getElementById('new-managed-task-xp');
    const newManagedTaskMoneyInput = document.getElementById('new-managed-task-money');
    const addManagedTaskBtn = document.getElementById('add-managed-task-btn');
    const managedTaskList = document.getElementById('managed-task-list'); // 任務設定介面中的任務列表
    const saveManagedTasksBtn = document.getElementById('save-managed-tasks-btn');


    // --- 職業數據 (包含初始屬性、每級成長和招式列表) ---
    const jobs = {
        knight: {
            id: 'knight',
            name: '晨曦騎士',
            maleAvatar: 'images/male_knight.png',
            femaleAvatar: 'images/male_knight.png', // 騎士職業只有男性頭像，這裡也給一個預設
            bgImage: 'images/knight_background.png',
            primaryColor: '#4a6fa5',
            accentColor: '#ffc870',
            baseAttack: 10, // 基礎攻擊力
            baseDefense: 8, // 基礎防禦力
            attackPerLevel: 2, // 每級攻擊力成長
            defensePerLevel: 1, // 每級防禦力成長
            skills: [ // 招式列表，索引對應等級-1
                { name: '基礎斬擊', attack: 5 }, // Lv 1
                { name: '重擊', attack: 10 },    // Lv 2
                { name: '格擋反擊', attack: 8 },  // Lv 3
                { name: '聖光庇護', attack: 0, defenseBoost: 5 } // Lv 4 (示例招式，可自訂)
            ]
        },
        sage: {
            id: 'sage',
            name: '星語賢者',
            maleAvatar: 'images/female_sage.png', // 賢者職業只有女性頭像，這裡也給一個預設
            femaleAvatar: 'images/female_sage.png',
            bgImage: 'images/sage_background.png',
            primaryColor: '#c996ac',
            accentColor: '#e0d0bb',
            baseAttack: 6,
            baseDefense: 5,
            attackPerLevel: 1,
            defensePerLevel: 1,
            skills: [
                { name: '魔力飛彈', attack: 7 },
                { name: '寒冰箭', attack: 12 },
                { name: '火焰衝擊', attack: 15 },
                { name: '元素護盾', attack: 0, defenseBoost: 7 }
            ]
        },
        explorer: {
            id: 'explorer',
            name: '探索者', // 新職業
            maleAvatar: 'images/male_explorer.png',
            femaleAvatar: 'images/female_explorer.png',
            bgImage: 'images/explorer_background.png',
            primaryColor: '#6c7a89',
            accentColor: '#f0ad4e',
            baseAttack: 8,
            baseDefense: 6,
            attackPerLevel: 1.5,
            defensePerLevel: 1,
            skills: [
                { name: '快速射擊', attack: 6 },
                { name: '陷阱設置', attack: 9 },
                { name: '精準瞄準', attack: 13 },
                { name: '煙霧彈', attack: 0, evasion: true }
            ]
        },
        artisan: {
            id: 'artisan',
            name: '工匠', // 新職業
            maleAvatar: 'images/male_artisan.png',
            femaleAvatar: 'images/female_artisan.png',
            bgImage: 'images/artisan_background.png',
            primaryColor: '#a78864',
            accentColor: '#92b5b3',
            baseAttack: 7,
            baseDefense: 9,
            attackPerLevel: 1,
            defensePerLevel: 2,
            skills: [
                { name: '工具揮擊', attack: 5 },
                { name: '臨時護甲', attack: 0, defenseBoost: 8 },
                { name: '機關陷阱', attack: 10 },
                { name: '能量注入', attack: 15 }
            ]
        },
        healer: {
            id: 'healer',
            name: '治療師', // 新職業 (可設定為中性頭像)
            maleAvatar: 'images/neutral_healer.png',
            femaleAvatar: 'images/neutral_healer.png',
            bgImage: 'images/healer_background.png',
            primaryColor: '#8dcb7b',
            accentColor: '#fffacd',
            baseAttack: 5,
            baseDefense: 7,
            attackPerLevel: 1,
            defensePerLevel: 1.5,
            skills: [
                { name: '治癒微光', attack: 0, heal: 10 },
                { name: '聖言術', attack: 8 },
                { name: '淨化之光', attack: 12 },
                { name: '群體治療', attack: 0, heal: 20 }
            ]
        }
    };

    // 所有可選頭像，方便在設定中選擇
    // 如果您有更多頭像，請在這裡添加
    const availableAvatars = [
        { id: 'avatar-knight-m', src: 'images/male_knight.png', gender: 'male', jobId: 'knight' },
        { id: 'avatar-sage-f', src: 'images/female_sage.png', gender: 'female', jobId: 'sage' },
        { id: 'avatar-explorer-m', src: 'images/male_explorer.png', gender: 'male', jobId: 'explorer' },
        { id: 'avatar-artisan-f', src: 'images/female_artisan.png', gender: 'female', jobId: 'artisan' },
        { id: 'avatar-healer-n', src: 'images/neutral_healer.png', gender: 'neutral', jobId: 'healer' }
    ];

    // --- 角色資料與預設任務 ---
    // 預設的 "每日任務" 列表，這些任務是固定的，不能被使用者刪除
    const defaultDailyTasks = {
        male: [
            { id: 'default-task-male-1', text: '吸地', xp: 50, money: 20, isCompleted: false, isDefault: true },
            { id: 'default-task-male-2', text: '洗碗', xp: 60, money: 25, isCompleted: false, isDefault: true },
            { id: 'default-task-male-3', text: '整理浴室', xp: 80, money: 30, isCompleted: false, isDefault: true },
            { id: 'default-task-male-4', text: '煮飯', xp: 70, money: 35, isCompleted: false, isDefault: true },
            { id: 'default-task-male-5', text: '倒垃圾', xp: 40, money: 15, isCompleted: false, isDefault: true }
        ],
        female: [
            { id: 'default-task-female-1', text: '拖地', xp: 50, money: 20, isCompleted: false, isDefault: true },
            { id: 'default-task-female-2', text: '整理餐桌', xp: 40, money: 15, isCompleted: false, isDefault: true },
            { id: 'default-task-female-3', text: '整理沙發', xp: 50, money: 20, isCompleted: false, isDefault: true },
            { id: 'default-task-female-4', text: '煮飯', xp: 70, money: 35, isCompleted: false, isDefault: true },
            { id: 'default-task-female-5', text: '倒垃圾', xp: 40, money: 15, isCompleted: false, isDefault: true }
        ]
    };

    // 預設的角色數據，將在載入時被儲存的數據覆蓋
    const defaultCharacters = {
        male: {
            name: '晨曦騎士',
            gender: 'male',
            jobId: 'knight',
            customAvatar: null,
            level: 1,
            xp: 0,
            money: 0,
            attack: 0,
            defense: 0,
            learnedSkills: [],
            tasks: JSON.parse(JSON.stringify(defaultDailyTasks.male)) // 初始任務為預設任務
        },
        female: {
            name: '星語賢者',
            gender: 'female',
            jobId: 'sage',
            customAvatar: null,
            level: 1,
            xp: 0,
            money: 0,
            attack: 0,
            defense: 0,
            learnedSkills: [],
            tasks: JSON.parse(JSON.stringify(defaultDailyTasks.female)) // 初始任務為預設任務
        }
    };

    let characters = {}; // 實際使用的角色數據，從 localStorage 載入或使用 defaultCharacters
    let currentPlayerType = 'male'; // 當前選擇的角色性別 (male/female)

    // 經驗值升級曲線
    const XP_PER_LEVEL = [0, 100, 200, 350, 550, 800, 1100, 1500, 2000, 2600, 3300, 4100, 5000, 6000, 7100, 8300, 9600, 11000, 12500, 14100, 15800]; // 每個等級所需的總XP

    // --- 本地儲存鍵名 ---
    const LOCAL_STORAGE_KEY = 'rpgDailyChecklistData_V4'; // 更改鍵名以避免舊數據衝突
    const LAST_RESET_DATE_KEY = 'rpgLastResetDate';
    const WEEKLY_STATS_KEY = 'rpgWeeklyStats'; // 儲存週統計數據

    let weeklyStats = {}; // 儲存每週任務完成情況的物件 { 'YYYY-MM-DD': { male: { tasks:X, xp:Y, money:Z }, female: { ... } } }
    let currentStatsWeekStartDate = getStartOfWeek(new Date()); // 當前顯示統計表的週開始日期

    // --- 日期工具函數 ---
    function getTodayDateString(date = new Date()) {
        const now = date;
        const offset = now.getTimezoneOffset() * 60 * 1000; // 考慮瀏覽器時區偏移
        const taiwanTime = new Date(now.getTime() + (8 * 60 * 60 * 1000) + offset); // UTC+8
        return taiwanTime.toISOString().split('T')[0]; //格式為 YYYY-MM-DD
    }

    // 獲取一週的開始日期 (假設週一為一週的開始)
    function getStartOfWeek(date) {
        const d = new Date(date);
        const day = d.getDay(); // 0 = Sunday, 1 = Monday
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // 如果是週日，則回到上週一
        d.setDate(diff);
        d.setHours(0, 0, 0, 0); // 清除時間部分
        return d;
    }

    // 格式化日期範圍顯示 (YYYY/MM/DD - YYYY/MM/DD)
    function formatDateRange(startDate) {
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6); // 加上六天得到週日
        return `${startDate.getFullYear()}/${(startDate.getMonth() + 1).toString().padStart(2, '0')}/${startDate.getDate().toString().padStart(2, '0')} - ${endDate.getFullYear()}/${(endDate.getMonth() + 1).toString().padStart(2, '0')}/${endDate.getDate().toString().padStart(2, '0')}`;
    }

    // --- 初始化與資料載入 ---
    function loadGameData() {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
            characters = JSON.parse(savedData);
            // 確保新屬性 (attack, defense, learnedSkills, isDefault) 存在於舊數據中
            for (const charType in characters) {
                const char = characters[charType];
                if (char.gender === undefined) char.gender = charType;
                if (char.jobId === undefined) char.jobId = charType === 'male' ? 'knight' : 'sage';
                if (char.customAvatar === undefined) char.customAvatar = null;
                if (char.money === undefined) char.money = 0;
                if (char.attack === undefined) char.attack = 0;
                if (char.defense === undefined) char.defense = 0;
                if (char.learnedSkills === undefined) char.learnedSkills = [];

                // 合併任務：確保預設任務存在，並保留使用者自訂的任務
                char.tasks = mergeTasks(defaultDailyTasks[char.gender], char.tasks);

                char.tasks.forEach(task => {
                    if (task.money === undefined) task.money = 20;
                    if (task.xp === undefined) task.xp = 50;
                    if (task.isDefault === undefined) { // 標記舊數據中的預設任務
                        task.isDefault = task.id.startsWith('default-task-');
                    }
                });

                // 確保每個職業的預設招式都至少有基礎斬擊
                if (char.learnedSkills.length === 0 && char.level >= 1 && jobs[char.jobId]?.skills[0]) {
                    char.learnedSkills.push(jobs[char.jobId].skills[0]);
                }
            }
        } else {
            // 如果沒有儲存數據，使用預設數據並深拷貝，防止修改到 defaultCharacters 原始數據
            characters = JSON.parse(JSON.stringify(defaultCharacters));
            // 初始學習基礎招式
            Object.values(characters).forEach(char => {
                if (char.level >= 1 && jobs[char.jobId]?.skills[0]) {
                    char.learnedSkills.push(jobs[char.jobId].skills[0]);
                }
            });
        }

        const savedWeeklyStats = localStorage.getItem(WEEKLY_STATS_KEY);
        if (savedWeeklyStats) {
            weeklyStats = JSON.parse(savedWeeklyStats);
        } else {
            weeklyStats = {};
        }

        // 檢查是否需要自動重置任務
        checkAndResetDailyTasks();
        renderCharacter(characters[currentPlayerType]); // 初始渲染當前角色
        renderWeeklyStatsChart(); // 初始渲染週統計圖表
    }

    // 合併任務：保留使用者自訂的新增任務，並更新預設任務的狀態和屬性
    function mergeTasks(defaultTasks, loadedTasks) {
        const mergedTasksMap = new Map();

        // 1. 將所有預設任務加入地圖
        defaultTasks.forEach(task => {
            mergedTasksMap.set(task.id, { ...task }); // 深拷貝預設任務
        });

        // 2. 遍歷已載入任務，更新或新增
        loadedTasks.forEach(task => {
            if (mergedTasksMap.has(task.id)) {
                // 如果是預設任務，更新其完成狀態，並保留目前的屬性 (允許修改預設任務的名稱/XP/Money)
                // 注意：這裡的邏輯是，一旦預設任務被載入過，它的 XP/Money 將以儲存的為準，而不是 defaultDailyTasks
                // 但為了「還原預設任務」的需求，我們需要一個方式來判斷它是否仍然是預設任務。
                // 這裡假設 isDefault 標記為 true 的任務其 id 會符合 default-task-male-x 或 female-task-x
                // 並且允許這些預設任務的名稱/XP/Money 被使用者修改。
                // 如果要禁止修改預設任務的 XP/Money，則在複製時直接使用 defaultDailyTasks 的值。
                const defaultTemplate = defaultTasks.find(d => d.id === task.id);
                mergedTasksMap.set(task.id, {
                    ...defaultTemplate, // 從最新預設模板複製，確保 isDefault 為 true
                    text: task.text, // 允許修改名稱
                    xp: task.xp,     // 允許修改XP
                    money: task.money, // 允許修改Money
                    isCompleted: task.isCompleted, // 保留完成狀態
                    isDefault: true // 確保標記為預設任務
                });
            } else {
                // 如果是使用者新增的任務，直接加入
                mergedTasksMap.set(task.id, { ...task, isDefault: false }); // 確保自訂任務標記為非預設
            }
        });

        return Array.from(mergedTasksMap.values());
    }


    function saveGameData() {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(characters));
        localStorage.setItem(WEEKLY_STATS_KEY, JSON.stringify(weeklyStats));
    }

    // --- 角色顯示與更新 ---
    function renderCharacter(char) {
        currentPlayerType = char.gender; // 確保 currentPlayerType 與當前渲染角色性別一致

        // 更新按鈕 active 狀態
        selectCharButtons.forEach(button => {
            button.classList.remove('active');
            // 根據按鈕的 dataset.job-id 和當前角色的 job-id 來判斷是否激活
            if (button.dataset.jobId === char.jobId) {
                if ((char.gender === 'male' && button.id === 'select-male') ||
                    (char.gender === 'female' && button.id === 'select-female')) {
                    button.classList.add('active');
                }
            }
            // 更新按鈕上的頭像 (確保預設顯示正確)
            const img = button.querySelector('img');
            const job = jobs[button.dataset.jobId];
            if (job) {
                img.src = button.id === 'select-male' ? job.maleAvatar : job.femaleAvatar;
            }
        });


        // 更新 body class 以應用主題顏色
        // 先移除所有 job- 相關的 class
        body.className = body.className.split(' ').filter(c => !c.startsWith('job-')).join(' ');
        body.classList.add(`job-${char.jobId}`); // 新增當前職業的 class

        // 更新角色資訊
        charAvatar.src = char.customAvatar || (char.gender === 'male' ? jobs[char.jobId].maleAvatar : jobs[char.jobId].femaleAvatar);
        charName.textContent = char.name;
        charJobName.textContent = jobs[char.jobId].name; // 顯示職業名稱
        charLevel.textContent = char.level;
        charMoney.textContent = char.money; // 更新金錢顯示

        // 計算並顯示戰鬥屬性
        const jobData = jobs[char.jobId];
        char.attack = jobData.baseAttack + (char.level - 1) * jobData.attackPerLevel;
        char.defense = jobData.baseDefense + (char.level - 1) * jobData.defensePerLevel;
        charAttack.textContent = Math.round(char.attack); // 四捨五入顯示
        charDefense.textContent = Math.round(char.defense); // 四捨五入顯示

        updateXpBar(char.xp, char.level);

        // 更新背景圖片
        document.body.style.backgroundImage = `url('${jobs[char.jobId].bgImage}')`;

        // 重新渲染任務列表和招式列表
        renderTasks();
        renderSkills();
        saveGameData(); // 保存當前角色狀態
    }

    function updateXpBar(xp, level) {
        const currentLevelXpNeeded = XP_PER_LEVEL[level] || Infinity;
        const previousLevelXp = XP_PER_LEVEL[level - 1] || 0;
        const xpForCurrentLevel = xp - previousLevelXp;
        const totalXpForCurrentLevelSegment = currentLevelXpNeeded - previousLevelXp;

        let percentage = (totalXpForCurrentLevelSegment > 0) ? (xpForCurrentLevel / totalXpForCurrentLevelSegment) * 100 : 100;
        if (percentage > 100) percentage = 100;
        if (percentage < 0) percentage = 0;

        charXpBar.style.width = `${percentage}%`;
        charCurrentXp.textContent = xp;
        charXpNeeded.textContent = (currentLevelXpNeeded === Infinity) ? 'MAX' : currentLevelXpNeeded;

        // 檢查是否升級
        checkLevelUp();
    }

    function checkLevelUp() {
        const char = characters[currentPlayerType];
        const currentLevelXpNeeded = XP_PER_LEVEL[char.level] || Infinity;

        // 確保還有下一個等級
        if (char.level < XP_PER_LEVEL.length - 1 && char.xp >= currentLevelXpNeeded) {
            char.level++;
            alert(`${char.name} 升級了！達到等級 ${char.level}！`);

            // 學習新招式
            const newSkill = jobs[char.jobId].skills[char.level - 1]; // 等級 N 對應 skills[N-1]
            if (newSkill && !char.learnedSkills.some(s => s.name === newSkill.name)) {
                char.learnedSkills.push(newSkill);
                alert(`${char.name} 學會了新招式: ${newSkill.name}！`);
                renderSkills(); // 更新招式列表顯示
            }

            // 重新計算並顯示戰鬥屬性
            const jobData = jobs[char.jobId];
            char.attack = jobData.baseAttack + (char.level - 1) * jobData.attackPerLevel;
            char.defense = jobData.baseDefense + (char.level - 1) * jobData.defensePerLevel;
            charAttack.textContent = Math.round(char.attack);
            charDefense.textContent = Math.round(char.defense);

            updateXpBar(char.xp, char.level); // 再次更新XP條以反映新等級的進度
            saveGameData();
        } else if (char.level >= XP_PER_LEVEL.length - 1) {
            charXpNeeded.textContent = 'MAX';
            charXpBar.style.width = '100%';
        }
    }

    // --- 任務管理 (主要顯示介面) ---
    function renderTasks() {
        taskList.innerHTML = ''; // 清空現有列表
        characters[currentPlayerType].tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.className = `task-item ${task.isCompleted ? 'completed' : ''}`;
            listItem.dataset.taskId = task.id; // 儲存任務ID

            listItem.innerHTML = `
                <input type="checkbox" class="task-checkbox" ${task.isCompleted ? 'checked' : ''}>
                <span class="task-content">${task.text}</span>
                <span class="xp-award">+${task.xp} XP</span>
                <span class="money-award">+${task.money} 💰</span>
            `;

            const checkbox = listItem.querySelector('.task-checkbox');
            checkbox.addEventListener('change', () => toggleTaskCompletion(task.id, checkbox.checked));

            taskList.appendChild(listItem);
        });
    }

    function toggleTaskCompletion(taskId, isCompleted) {
        const char = characters[currentPlayerType];
        const task = char.tasks.find(t => t.id === taskId);

        if (task) {
            task.isCompleted = isCompleted;
            const today = getTodayDateString();
            const currentWeekStart = getTodayDateString(getStartOfWeek(new Date()));

            // 初始化每日/每週統計數據
            if (!weeklyStats[currentWeekStart]) {
                weeklyStats[currentWeekStart] = {};
            }
            if (!weeklyStats[currentWeekStart][today]) {
                weeklyStats[currentWeekStart][today] = {
                    male: { tasks: 0, xp: 0, money: 0 },
                    female: { tasks: 0, xp: 0, money: 0 }
                };
            }

            if (isCompleted) {
                char.xp += task.xp;
                char.money += task.money; // 增加金錢
                weeklyStats[currentWeekStart][today][char.gender].tasks++;
                weeklyStats[currentWeekStart][today][char.gender].xp += task.xp;
                weeklyStats[currentWeekStart][today][char.gender].money += task.money;

                // 視覺效果：XP 和金錢提示
                const listItem = taskList.querySelector(`[data-task-id="${taskId}"]`);
                if (listItem) {
                    const xpAwardSpan = listItem.querySelector('.xp-award');
                    const moneyAwardSpan = listItem.querySelector('.money-award');

                    if (xpAwardSpan) {
                        xpAwardSpan.style.opacity = 1;
                        xpAwardSpan.style.transform = 'translateY(-10px)';
                        setTimeout(() => { xpAwardSpan.style.opacity = 0; xpAwardSpan.style.transform = 'translateY(0)'; }, 800);
                    }
                    if (moneyAwardSpan) {
                        moneyAwardSpan.style.opacity = 1;
                        moneyAwardSpan.style.transform = 'translateY(-10px)';
                        setTimeout(() => { moneyAwardSpan.style.opacity = 0; moneyAwardSpan.style.transform = 'translateY(0)'; }, 800);
                    }
                }

            } else {
                char.xp -= task.xp;
                char.money -= task.money; // 扣除金錢
                if (char.xp < 0) char.xp = 0;
                if (char.money < 0) char.money = 0;
                weeklyStats[currentWeekStart][today][char.gender].tasks = Math.max(0, weeklyStats[currentWeekStart][today][char.gender].tasks - 1);
                weeklyStats[currentWeekStart][today][char.gender].xp = Math.max(0, weeklyStats[currentWeekStart][today][char.gender].xp - task.xp);
                weeklyStats[currentWeekStart][today][char.gender].money = Math.max(0, weeklyStats[currentWeekStart][today][char.gender].money - task.money);
            }
            // 重新渲染UI
            updateXpBar(char.xp, char.level);
            charMoney.textContent = char.money; // 更新金錢顯示
            renderTasks();
            renderWeeklyStatsChart(); // 更新統計圖表
            saveGameData();
        }
    }

    function resetDailyTasks() {
        // 清除所有角色的任務完成狀態，但保留自訂任務本身
        Object.values(characters).forEach(char => {
            char.tasks.forEach(task => {
                task.isCompleted = false;
            });
        });
        saveGameData();
        renderTasks();
        alert('今日任務已重置！');
    }

    // --- 招式顯示 ---
    function renderSkills() {
        skillList.innerHTML = '';
        const char = characters[currentPlayerType];
        if (char.learnedSkills.length === 0) {
            const noSkillsItem = document.createElement('li');
            noSkillsItem.className = 'skill-item';
            noSkillsItem.textContent = '尚未學習任何招式。升級可學習新招式！';
            skillList.appendChild(noSkillsItem);
            return;
        }
        char.learnedSkills.forEach(skill => {
            const listItem = document.createElement('li');
            listItem.className = 'skill-item';
            let skillInfo = `<span class="skill-name">${skill.name}</span>`;
            if (skill.attack) {
                skillInfo += ` <span class="skill-attack">(攻擊力: ${skill.attack})</span>`;
            }
            if (skill.defenseBoost) {
                skillInfo += ` <span class="skill-defense">(防禦提升: ${skill.defenseBoost})</span>`;
            }
            if (skill.heal) {
                skillInfo += ` <span class="skill-heal">(治療量: ${skill.heal})</span>`;
            }
            if (skill.evasion) {
                skillInfo += ` <span class="skill-evasion">(閃避招式)</span>`;
            }
            listItem.innerHTML = skillInfo;
            skillList.appendChild(listItem);
        });
    }

    // --- 自動重置邏輯 ---
    function checkAndResetDailyTasks() {
        const lastResetDate = localStorage.getItem(LAST_RESET_DATE_KEY);
        const today = getTodayDateString();

        if (lastResetDate !== today) {
            console.log('Detected new day. Resetting daily tasks for all characters.');
            Object.values(characters).forEach(char => {
                // 將所有任務的完成狀態重置為 false
                char.tasks.forEach(task => {
                    task.isCompleted = false;
                });

                // 將預設任務還原成 defaultDailyTasks 中的內容 (名稱、XP、Money)
                // 並保留使用者新增的任務
                const restoredDefaultTasks = JSON.parse(JSON.stringify(defaultDailyTasks[char.gender]));
                const customTasks = char.tasks.filter(task => !task.isDefault);
                char.tasks = [...restoredDefaultTasks, ...customTasks];
            });
            localStorage.setItem(LAST_RESET_DATE_KEY, today);
            saveGameData();
            if (document.readyState === 'complete') {
                renderTasks();
                // 如果是新的一天，且正在查看當前週的統計，則圖表數據需要更新
                if (getTodayDateString(currentStatsWeekStartDate) === getTodayDateString(getStartOfWeek(new Date()))) {
                    renderWeeklyStatsChart();
                }
            }
        }
    }

    // --- 週統計長條圖功能 ---
    function renderWeeklyStatsChart() {
        const weekStartDate = currentStatsWeekStartDate;
        currentStatsWeekSpan.textContent = formatDateRange(weekStartDate);

        const labels = []; // 顯示的日期
        const maleData = { tasks: [], xp: [], money: [] };
        const femaleData = { tasks: [], xp: [], money: [] };

        // 生成一週的日期標籤和數據
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStartDate);
            date.setDate(weekStartDate.getDate() + i);
            const dateString = getTodayDateString(date);
            const displayDay = ['週日', '週一', '週二', '週三', '週四', '週五', '週六'][date.getDay()];
            labels.push(`${displayDay}\n${(date.getMonth() + 1)}/${date.getDate()}`); // 顯示格式：週x\n月/日

            const dayStats = weeklyStats[getTodayDateString(getStartOfWeek(date))]?.[dateString] || { male: { tasks: 0, xp: 0, money: 0 }, female: { tasks: 0, xp: 0, money: 0 } };

            maleData.tasks.push(dayStats.male.tasks);
            maleData.xp.push(dayStats.male.xp);
            maleData.money.push(dayStats.male.money);

            femaleData.tasks.push(dayStats.female.tasks);
            femaleData.xp.push(dayStats.female.xp);
            femaleData.money.push(dayStats.female.money);
        }

        const selectedChartType = document.querySelector('input[name="chart-type"]:checked').value;
        let chartTitle = '';
        let datasets = [];
        let yAxisLabel = '';

        // 這裡可以根據實際選擇的角色來決定圖例標籤，但為了簡化，仍然使用預設的男女角色作為統計圖表的代表
        const jobKnight = jobs.knight; // 代表男性角色數據
        const jobSage = jobs.sage;     // 代表女性角色數據

        if (selectedChartType === 'tasks') {
            chartTitle = '每週完成任務數量';
            yAxisLabel = '任務數';
            datasets = [
                {
                    label: `男性角色 (${jobKnight.name}數據)`,
                    data: maleData.tasks,
                    backgroundColor: jobKnight.primaryColor,
                    borderColor: jobKnight.accentColor,
                    borderWidth: 1
                },
                {
                    label: `女性角色 (${jobSage.name}數據)`,
                    data: femaleData.tasks,
                    backgroundColor: jobSage.primaryColor,
                    borderColor: jobSage.accentColor,
                    borderWidth: 1
                }
            ];
        } else if (selectedChartType === 'xp') {
            chartTitle = '每週獲得經驗值';
            yAxisLabel = '經驗值';
            datasets = [
                {
                    label: `男性角色 (${jobKnight.name}數據)`,
                    data: maleData.xp,
                    backgroundColor: jobKnight.primaryColor,
                    borderColor: jobKnight.accentColor,
                    borderWidth: 1
                },
                {
                    label: `女性角色 (${jobSage.name}數據)`,
                    data: femaleData.xp,
                    backgroundColor: jobSage.primaryColor,
                    borderColor: jobSage.accentColor,
                    borderWidth: 1
                }
            ];
        } else if (selectedChartType === 'money') {
            chartTitle = '每週獲得金錢';
            yAxisLabel = '金錢';
            datasets = [
                {
                    label: `男性角色 (${jobKnight.name}數據)`,
                    data: maleData.money,
                    backgroundColor: jobKnight.primaryColor,
                    borderColor: jobKnight.accentColor,
                    borderWidth: 1
                },
                {
                    label: `女性角色 (${jobSage.name}數據)`,
                    data: femaleData.money,
                    backgroundColor: jobSage.primaryColor,
                    borderColor: jobSage.accentColor,
                    borderWidth: 1
                }
            ];
        }

        if (weeklyStatsChart) {
            weeklyStatsChart.data.labels = labels;
            weeklyStatsChart.data.datasets = datasets;
            weeklyStatsChart.options.plugins.title.text = chartTitle;
            weeklyStatsChart.options.scales.y.title.text = yAxisLabel;
            weeklyStatsChart.update();
        } else {
            weeklyStatsChart = new Chart(weeklyStatsChartCtx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: datasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        title: {
                            display: true,
                            text: chartTitle,
                            color: 'var(--text-color)',
                            font: { size: 18, family: "'Noto Sans TC', sans-serif" }
                        },
                        legend: {
                            labels: {
                                color: 'var(--text-color)',
                                font: { family: "'Noto Sans TC', sans-serif" }
                            }
                        }
                    },
                    scales: {
                        x: {
                            stacked: false, // 不堆疊
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: 'var(--text-color)', font: { family: "'Noto Sans TC', sans-serif" } }
                        },
                        y: {
                            stacked: false, // 不堆疊
                            beginAtZero: true,
                            grid: { color: 'rgba(255, 255, 255, 0.1)' },
                            ticks: { color: 'var(--text-color)', font: { family: "'Noto Sans TC', sans-serif" } },
                            title: {
                                display: true,
                                text: yAxisLabel,
                                color: 'var(--text-color)',
                                font: { family: "'Noto Sans TC', sans-serif" }
                            }
                        }
                    }
                }
            });
        }

        // 判斷是否為當前週，禁用下一週按鈕
        const todayStartOfWeek = getStartOfWeek(new Date());
        if (getTodayDateString(weekStartDate) === getTodayDateString(todayStartOfWeek)) {
            nextWeekBtn.disabled = true;
        } else {
            nextWeekBtn.disabled = false;
        }
    }

    function navigateStatsWeek(direction) { // direction: -1 for prev, 1 for next
        const newDate = new Date(currentStatsWeekStartDate);
        newDate.setDate(newDate.getDate() + (direction * 7)); // 每次加減一週
        currentStatsWeekStartDate = getStartOfWeek(newDate); // 確保是週的開始
        renderWeeklyStatsChart();
    }

    // --- 全域重置功能 ---
    function fullResetGame() {
        if (confirm('警告！這將會清除所有角色的等級、經驗值、金錢、攻擊力、防禦力、招式、所有任務和每日/每週統計數據。此操作無法復原！您確定要繼續嗎？')) {
            if (confirm('最後確認：您確定要徹底重置所有遊戲進度嗎？這將無法恢復！')) {
                localStorage.clear(); // 清除所有 localStorage 數據
                window.location.reload(); // 重載頁面以完全重置應用狀態
            }
        }
    }

    // --- 角色設定彈出視窗功能 ---
    function openSettingsModal() {
        const char = characters[currentPlayerType];

        // 載入當前角色姓名
        charNameInput.value = char.name;

        // 渲染職業選項
        jobSelectionDiv.innerHTML = '';
        for (const jobId in jobs) {
            const job = jobs[jobId];
            const jobOption = document.createElement('div');
            jobOption.className = `job-option ${char.jobId === job.id ? 'selected' : ''}`;
            jobOption.dataset.jobId = job.id;
            // 根據性別顯示對應的頭像，如果沒有則使用通用佔位圖
            const avatarSrc = (char.gender === 'male' ? job.maleAvatar : job.femaleAvatar) || 'https://placehold.co/50x50?text=Avatar';
            jobOption.innerHTML = `
                <img src="${avatarSrc}" alt="${job.name}頭像">
                <span>${job.name}</span>
            `;
            jobOption.addEventListener('click', () => {
                document.querySelectorAll('.job-option').forEach(opt => opt.classList.remove('selected'));
                jobOption.classList.add('selected');
                // 同步更新 avatar 預覽 (選擇職業時，頭像選項會更新為該職業相關的頭像)
                updateAvatarOptions(job.id, char.gender);
            });
            jobSelectionDiv.appendChild(jobOption);
        }

        // 渲染頭像選項
        updateAvatarOptions(char.jobId, char.gender); // 根據當前職業和性別初始化頭像選項

        settingsModal.style.display = 'flex'; // 顯示 Modal
    }

    function updateAvatarOptions(selectedJobId, selectedGender) {
        avatarSelectionDiv.innerHTML = '';
        const char = characters[currentPlayerType];

        // 過濾出與當前選定職業或性別相關，或通用的頭像
        const relevantAvatars = availableAvatars.filter(avatar =>
            avatar.jobId === selectedJobId ||
            avatar.gender === selectedGender ||
            avatar.gender === 'neutral'
        );

        // 如果沒有相關頭像，則加入預設的男/女頭像作為選項
        if (relevantAvatars.length === 0) {
            relevantAvatars.push({ id: 'default-male', src: jobs.knight.maleAvatar, gender: 'male', jobId: 'knight' });
            relevantAvatars.push({ id: 'default-female', src: jobs.sage.femaleAvatar, gender: 'female', jobId: 'sage' });
        }

        // 確保不會重複
        const uniqueAvatars = [];
        const seenSrc = new Set();
        relevantAvatars.forEach(avatar => {
            if (!seenSrc.has(avatar.src)) {
                uniqueAvatars.push(avatar);
                seenSrc.add(avatar.src);
            }
        });

        uniqueAvatars.forEach(avatar => {
            const avatarOption = document.createElement('div');
            // 判斷是否為當前選中的頭像：
            // 1. 如果有自訂頭像，且自訂頭像的 src 與當前選項的 src 匹配
            // 2. 如果沒有自訂頭像 (customAvatar 為 null)，且當前選項是該角色性別和職業的預設頭像
            const isSelected = (char.customAvatar === avatar.src) ||
                               (char.customAvatar === null &&
                                (
                                    (selectedGender === 'male' && avatar.src === jobs[selectedJobId].maleAvatar) ||
                                    (selectedGender === 'female' && avatar.src === jobs[selectedJobId].femaleAvatar)
                                ));

            avatarOption.className = `avatar-option ${isSelected ? 'selected' : ''}`;
            avatarOption.dataset.avatarSrc = avatar.src;
            avatarOption.innerHTML = `<img src="${avatar.src}" alt="頭像">`;
            avatarOption.addEventListener('click', () => {
                document.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
                avatarOption.classList.add('selected');
            });
            avatarSelectionDiv.appendChild(avatarOption);
        });
    }

    function saveSettings() {
        const char = characters[currentPlayerType];

        // 保存姓名
        char.name = charNameInput.value.trim() || defaultCharacters[currentPlayerType].name;

        // 保存職業
        const selectedJobOption = document.querySelector('.job-option.selected');
        const oldJobId = char.jobId;
        if (selectedJobOption) {
            char.jobId = selectedJobOption.dataset.jobId;
            // 如果職業發生變化，且新職業有預設招式，則清空已學習招式並學習新職業的基礎招式
            if (oldJobId !== char.jobId) {
                char.learnedSkills = [];
                if (jobs[char.jobId]?.skills[0]) {
                    char.learnedSkills.push(jobs[char.jobId].skills[0]);
                }
            }
        }

        // 保存頭像
        const selectedAvatarOption = document.querySelector('.avatar-option.selected');
        if (selectedAvatarOption) {
            char.customAvatar = selectedAvatarOption.dataset.avatarSrc;
        } else {
            // 如果沒有明確選中，則恢復為當前職業的預設頭像
            char.customAvatar = (char.gender === 'male' ? jobs[char.jobId].maleAvatar : jobs[char.jobId].femaleAvatar);
        }

        renderCharacter(char); // 重新渲染角色資訊以更新UI
        settingsModal.style.display = 'none'; // 隱藏 Modal
        saveGameData(); // 保存數據
    }

    // --- 任務設定彈出視窗功能 ---
    function openManageTasksModal() {
        renderManagedTasks(); // 每次打開時重新渲染列表
        manageTasksModal.style.display = 'flex';
    }

    function renderManagedTasks() {
        managedTaskList.innerHTML = ''; // 清空現有列表
        const char = characters[currentPlayerType];

        char.tasks.forEach(task => {
            const listItem = document.createElement('li');
            listItem.className = `managed-task-item`;
            listItem.dataset.taskId = task.id;

            const isDefaultTask = task.isDefault;

            listItem.innerHTML = `
                <input type="text" class="task-name-input" value="${task.text}" ${isDefaultTask ? '' : ''}>
                <input type="number" class="task-xp-input" value="${task.xp}" min="10" ${isDefaultTask ? '' : ''}>
                <input type="number" class="task-money-input" value="${task.money}" min="0" ${isDefaultTask ? '' : ''}>
                <button class="delete-task-btn" ${isDefaultTask ? 'disabled' : ''}>刪除</button>
            `;

            const nameInput = listItem.querySelector('.task-name-input');
            const xpInput = listItem.querySelector('.task-xp-input');
            const moneyInput = listItem.querySelector('.task-money-input');
            const deleteBtn = listItem.querySelector('.delete-task-btn');

            // 監聽輸入框的變化，即時更新數據
            nameInput.addEventListener('change', (e) => {
                task.text = e.target.value.trim();
                saveGameData();
                renderTasks(); // 更新主介面任務列表
            });
            xpInput.addEventListener('change', (e) => {
                task.xp = Math.max(10, parseInt(e.target.value, 10) || 10);
                e.target.value = task.xp; // 確保顯示的是有效值
                saveGameData();
                renderTasks();
            });
            moneyInput.addEventListener('change', (e) => {
                task.money = Math.max(0, parseInt(e.target.value, 10) || 0);
                e.target.value = task.money; // 確保顯示的是有效值
                saveGameData();
                renderTasks();
            });

            deleteBtn.addEventListener('click', () => deleteTask(task.id));

            managedTaskList.appendChild(listItem);
        });
    }

    function addManagedTask() {
        const taskName = newManagedTaskNameInput.value.trim();
        let taskXp = parseInt(newManagedTaskXpInput.value, 10);
        let taskMoney = parseInt(newManagedTaskMoneyInput.value, 10);

        if (isNaN(taskXp) || taskXp < 10) taskXp = 50;
        if (isNaN(taskMoney) || taskMoney < 0) taskMoney = 20;

        if (taskName) {
            const char = characters[currentPlayerType];
            const newTaskId = `custom-task-${char.gender}-${Date.now()}`;
            char.tasks.push({ id: newTaskId, text: taskName, xp: taskXp, money: taskMoney, isCompleted: false, isDefault: false });
            newManagedTaskNameInput.value = '';
            newManagedTaskXpInput.value = '50';
            newManagedTaskMoneyInput.value = '20';
            renderManagedTasks(); // 更新任務設定介面
            renderTasks(); // 更新主介面任務列表
            saveGameData();
        } else {
            alert('任務名稱不能為空！');
        }
    }

    function deleteTask(taskId) {
        const char = characters[currentPlayerType];
        // 確保不是預設任務才能刪除
        const taskToDelete = char.tasks.find(t => t.id === taskId);
        if (taskToDelete && !taskToDelete.isDefault) {
            char.tasks = char.tasks.filter(t => t.id !== taskId);
            renderManagedTasks(); // 更新任務設定介面
            renderTasks(); // 更新主介面任務列表
            saveGameData();
        } else {
            alert('預設任務無法刪除！');
        }
    }


    // --- 事件監聽器 ---
    selectCharButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetCharType = button.id === 'select-male' ? 'male' : 'female';
            renderCharacter(characters[targetCharType]);
        });
    });

    resetDailyTasksBtn.addEventListener('click', () => {
        if (confirm('確定要手動重置今日所有任務嗎？這將還原預設任務的名稱、經驗、金錢，並清空所有任務的完成狀態。')) {
            resetDailyTasks();
        }
    });

    prevWeekBtn.addEventListener('click', () => navigateStatsWeek(-1));
    nextWeekBtn.addEventListener('click', () => navigateStatsWeek(1));
    chartTypeRadios.forEach(radio => {
        radio.addEventListener('change', renderWeeklyStatsChart); // 選擇不同圖表類型時更新
    });

    fullResetBtn.addEventListener('click', fullResetGame);

    // 角色設定 Modal 事件
    settingsBtn.addEventListener('click', openSettingsModal);
    saveSettingsBtn.addEventListener('click', saveSettings);

    // 任務設定 Modal 事件
    manageTasksBtn.addEventListener('click', openManageTasksModal);
    addManagedTaskBtn.addEventListener('click', addManagedTask);
    newManagedTaskNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addManagedTask();
    });
    newManagedTaskXpInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addManagedTask();
    });
    newManagedTaskMoneyInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addManagedTask();
    });
    saveManagedTasksBtn.addEventListener('click', () => {
        manageTasksModal.style.display = 'none'; // 隱藏 Modal
    });


    // 處理所有 Modal 的關閉按鈕
    closeModalButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            const modalId = event.target.dataset.modalId;
            document.getElementById(modalId).style.display = 'none';
        });
    });

    // 點擊 Modal 外部關閉 Modal
    window.addEventListener('click', (event) => {
        if (event.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
        if (event.target === manageTasksModal) {
            manageTasksModal.style.display = 'none';
        }
    });

    // --- 初始載入遊戲資料 ---
    loadGameData();
});