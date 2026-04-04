// ========================================
// ТРЕКЕР ПРИВЫЧЕК — app.js
// ========================================

// === CONSTANTS ===
const ICONS = [
  '💪','🏃','🧘','🏋️','⚽','🏊','🚴','🧗','🥊','🎾',
  '💧','🥗','💊','😴','🧴','🦷','🍎','🥤','🌿','❤️',
  '📚','📝','🎨','🎵','🎸','💻','🧠','📖','✏️','🔬',
  '💼','📊','💡','🎯','⏰','📧','📱','🗂️','📋','✅',
  '🏠','🧹','🍳','🛒','🌱','🧺','🔧','🛏️','🚿','🗑️',
  '🎮','🎬','🎧','☕','🍷','🧩','♟️','🎲','📸','🌅',
  '⭐','🔥','💎','🌟','🎪'
];

const CATEGORIES = {
  sport:  { name: 'Спорт',       icon: '🏃' },
  health: { name: 'Здоровье',    icon: '💚' },
  growth: { name: 'Саморазвитие', icon: '📚' },
  work:   { name: 'Работа',      icon: '💼' }
};

const COLORS = ['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD'];

const FREQUENCY_LABELS = {
  daily: 'Каждый день',
  '1week': '1 раз/нед.',
  '3week': '3 раза/нед.',
  '4week': '4 раза/нед.',
  '5week': '5 раз/нед.'
};

const FREQUENCY_TARGET = { daily: 7, '1week': 1, '3week': 3, '4week': 4, '5week': 5 };

// === RPG RESOURCES ===
const RESOURCES = {
  sport:  { name: 'Сила',      icon: '💪', color: '#e74c3c' },
  health: { name: 'Живучесть', icon: '❤️', color: '#2ecc71' },
  growth: { name: 'Разум',     icon: '🧠', color: '#3498db' },
  work:   { name: 'Энергия',   icon: '⚡', color: '#f39c12' }
};

function getStreakMultiplier(streak) {
  if (streak >= 30) return 5;
  if (streak >= 14) return 3;
  if (streak >= 7) return 2;
  if (streak >= 3) return 1.5;
  return 1;
}

// === COLLECTIBLE CARDS ===
const CARD_RARITIES = {
  common:    { name: 'Обычная',     border: '#95a5a6', bg: 'linear-gradient(135deg, #636e72, #2d3436)', glow: 'none' },
  rare:      { name: 'Редкая',      border: '#3498db', bg: 'linear-gradient(135deg, #0984e3, #6c5ce7)', glow: '0 0 15px rgba(52,152,219,0.4)' },
  epic:      { name: 'Эпическая',   border: '#9b59b6', bg: 'linear-gradient(135deg, #6c5ce7, #e84393)', glow: '0 0 20px rgba(155,89,182,0.5)' },
  legendary: { name: 'Легендарная',  border: '#f1c40f', bg: 'linear-gradient(135deg, #f39c12, #e74c3c, #f1c40f)', glow: '0 0 25px rgba(241,196,15,0.6)' }
};

// Placeholder cards — user will replace art/details later
const ALL_CARDS = [
  // === COMMON (cheap, starter cards) ===
  { id: 'c1', name: 'Новичок', emoji: '🐣', quote: 'Каждый мастер когда-то был новичком.', rarity: 'common',
    cost: { sport: 5, health: 5 } },
  { id: 'c2', name: 'Кофеман', emoji: '☕', quote: 'Но сначала — кофе.', rarity: 'common',
    cost: { work: 8, growth: 3 } },
  { id: 'c3', name: 'Книжный червь', emoji: '📖', quote: 'Ещё одна глава...', rarity: 'common',
    cost: { growth: 10, health: 3 } },
  { id: 'c4', name: 'Бегун', emoji: '🏃', quote: 'Ветер в лицо, мысли — прочь.', rarity: 'common',
    cost: { sport: 12 } },
  { id: 'c5', name: 'Мечтатель', emoji: '💭', quote: 'А что если...', rarity: 'common',
    cost: { growth: 8, work: 5 } },
  { id: 'c6', name: 'Ранняя пташка', emoji: '🌅', quote: 'Мир принадлежит тем, кто рано встаёт.', rarity: 'common',
    cost: { health: 8, work: 5 } },
  { id: 'c7', name: 'Качок', emoji: '💪', quote: 'Ещё один подход!', rarity: 'common',
    cost: { sport: 8, health: 5 } },
  { id: 'c8', name: 'Стажёр', emoji: '📋', quote: 'Шеф, а что дальше?', rarity: 'common',
    cost: { work: 10, growth: 3 } },

  // === RARE ===
  { id: 'r1', name: 'Самурай', emoji: '⚔️', quote: 'Дисциплина — мой меч.', rarity: 'rare',
    cost: { sport: 25, growth: 15 } },
  { id: 'r2', name: 'Алхимик', emoji: '⚗️', quote: 'Превращаю привычки в золото.', rarity: 'rare',
    cost: { growth: 20, health: 15, work: 10 } },
  { id: 'r3', name: 'Шерлок', emoji: '🔍', quote: 'Элементарно, Ватсон.', rarity: 'rare',
    cost: { growth: 30, work: 15 } },
  { id: 'r4', name: 'Спартанец', emoji: '🛡️', quote: 'Это! СПАРТА!', rarity: 'rare',
    cost: { sport: 30, health: 15 } },
  { id: 'r5', name: 'Монах', emoji: '🧘', quote: 'Тишина говорит громче слов.', rarity: 'rare',
    cost: { health: 25, growth: 15 } },
  { id: 'r6', name: 'Архитектор', emoji: '📐', quote: 'Я строю свою жизнь по чертежу.', rarity: 'rare',
    cost: { work: 25, growth: 20 } },
  { id: 'r7', name: 'Викинг', emoji: '🪓', quote: 'Вальхалла ждёт!', rarity: 'rare',
    cost: { sport: 25, health: 15 } },
  { id: 'r8', name: 'Хакер', emoji: '💻', quote: 'Я в матрице.', rarity: 'rare',
    cost: { growth: 25, work: 20 } },
  { id: 'r9', name: 'Целитель', emoji: '💊', quote: 'Исцеление — в привычках.', rarity: 'rare',
    cost: { health: 30, growth: 15 } },
  { id: 'r10', name: 'Ниндзя', emoji: '🥷', quote: 'Тихо. Быстро. Эффективно.', rarity: 'rare',
    cost: { sport: 20, work: 20 } },

  // === EPIC ===
  { id: 'e1', name: 'Бэтмен', emoji: '🦇', quote: 'Я — ночь.', rarity: 'epic',
    cost: { sport: 60, growth: 40, work: 30 } },
  { id: 'e2', name: 'Тони Старк', emoji: '🤖', quote: 'Гений, миллиардер, филантроп.', rarity: 'epic',
    cost: { growth: 50, work: 50, sport: 20 } },
  { id: 'e3', name: 'Мастер Йода', emoji: '🟢', quote: 'Делай. Или не делай. Нет «попробую».', rarity: 'epic',
    cost: { growth: 60, health: 40 } },
  { id: 'e4', name: 'Тор', emoji: '⚡', quote: 'Я всё ещё достоин!', rarity: 'epic',
    cost: { sport: 70, health: 30 } },
  { id: 'e5', name: 'Доктор Стрэндж', emoji: '🔮', quote: 'Я просмотрел 14 000 605 вариантов.', rarity: 'epic',
    cost: { growth: 70, health: 30 } },
  { id: 'e6', name: 'Джон Уик', emoji: '🖊️', quote: 'Карандашом. Чёртовым карандашом.', rarity: 'epic',
    cost: { sport: 50, work: 40, health: 20 } },
  { id: 'e7', name: 'Мияги', emoji: '🥋', quote: 'Воск наложить, воск снять.', rarity: 'epic',
    cost: { sport: 40, growth: 40, health: 30 } },
  { id: 'e8', name: 'Шерлок Холмс', emoji: '🎻', quote: 'Мой мозг — чердак.', rarity: 'epic',
    cost: { growth: 80, work: 30 } },

  // === LEGENDARY ===
  { id: 'l1', name: 'Гэндальф', emoji: '🧙', quote: 'Ты не пройдёшь! ...мимо своих привычек.', rarity: 'legendary',
    cost: { growth: 100, health: 60, sport: 40 } },
  { id: 'l2', name: 'Танос', emoji: '🟣', quote: 'Неизбежен.', rarity: 'legendary',
    cost: { sport: 80, health: 60, growth: 60, work: 50 } },
  { id: 'l3', name: 'Один', emoji: '👁️', quote: 'Я пожертвовал глазом ради мудрости.', rarity: 'legendary',
    cost: { growth: 120, sport: 60, health: 50 } },
  { id: 'l4', name: 'Будда', emoji: '☸️', quote: 'Путь — это и есть цель.', rarity: 'legendary',
    cost: { health: 100, growth: 80, work: 40 } },
  { id: 'l5', name: 'Леонардо', emoji: '🎨', quote: 'Простота — высшая форма изящества.', rarity: 'legendary',
    cost: { growth: 100, work: 80, sport: 40 } },
  { id: 'l6', name: 'Чак Норрис', emoji: '👊', quote: 'Чак не отмечает привычки. Привычки отмечают Чака.', rarity: 'legendary',
    cost: { sport: 150, health: 100, work: 50 } },
];

const MONTHS_RU = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
const DAYS_RU = ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'];

// === DATA LAYER ===
function loadData(key, def) {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : def; } catch { return def; }
}
function saveData(key, val) { localStorage.setItem(key, JSON.stringify(val)); }

let habits = loadData('habits', []);
let completions = loadData('completions', []);
let notes = loadData('notes', []);
let points = loadData('points', 0);
let unlockedBadges = loadData('unlockedBadges', []);
let resources = loadData('resources', { sport: 0, health: 0, growth: 0, work: 0 });
// Migration: remove old home/rest resources
delete resources.home;
delete resources.rest;
saveData('resources', resources);
let ownedCards = loadData('ownedCards', []);
let firstOpenDate = loadData('firstOpenDate', null);
if (!firstOpenDate) { firstOpenDate = todayStr(); saveData('firstOpenDate', firstOpenDate); }
// Track interesting events for achievements
let tracker = loadData('tracker', {
  lostStreaks: [],      // {habitId, streak, date} — when a streak was broken
  deletedHabits: 0,     // count of soft-deleted habits
  editCount: 0,         // how many times habits were edited
  longestLostStreak: 0, // biggest streak ever lost
  lastOpenDate: null,    // for detecting gaps
  openDates: [],         // all dates app was opened
});
// Record today's open
if (!tracker.openDates) tracker.openDates = [];
if (!tracker.openDates.includes(todayStr())) {
  tracker.openDates.push(todayStr());
}
tracker.lastOpenDate = todayStr();
saveData('tracker', tracker);

function persist() {
  saveData('habits', habits);
  saveData('completions', completions);
  saveData('notes', notes);
  saveData('points', points);
  saveData('unlockedBadges', unlockedBadges);
  saveData('tracker', tracker);
  saveData('resources', resources);
  saveData('ownedCards', ownedCards);
}

// === UTILITIES ===
function genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
function todayStr() { return new Date().toISOString().slice(0, 10); }
function dateStr(d) { return new Date(d).toISOString().slice(0, 10); }

function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

function getWeekNumber(dateStr) {
  const d = new Date(dateStr);
  const start = new Date(d.getFullYear(), 0, 1);
  const diff = (d - start + ((start.getTimezoneOffset() - d.getTimezoneOffset()) * 60000));
  return Math.floor(diff / 604800000);
}

function formatDate(iso) {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS_RU[d.getMonth()]} ${d.getFullYear()}`;
}

function formatTime(iso) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
}

function formatDateFull() {
  const d = new Date();
  return `${d.getDate()} ${MONTHS_RU[d.getMonth()]} ${d.getFullYear()}, ${DAYS_RU[d.getDay()]}`;
}

// === HABIT CRUD ===
let editingHabitId = null;
let selectedCategory = null;
let selectedColor = COLORS[0];
let selectedIcon = ICONS[0];

function getActiveHabits() { return habits.filter(h => h.active !== false); }

function createHabit(data) {
  const h = { id: genId(), ...data, active: true, createdAt: new Date().toISOString() };
  habits.push(h);
  addPoints(5);
  persist();
  checkAchievements();
  return h;
}

function updateHabit(id, data) {
  const idx = habits.findIndex(h => h.id === id);
  if (idx !== -1) {
    habits[idx] = { ...habits[idx], ...data };
    tracker.editCount = (tracker.editCount || 0) + 1;
    persist();
  }
}

function deleteHabit(id) {
  const idx = habits.findIndex(h => h.id === id);
  if (idx !== -1) {
    // Track lost streak on deletion
    const streak = getStreak(id);
    if (streak > 0) {
      tracker.lostStreaks.push({ habitId: id, streak, date: todayStr() });
      tracker.longestLostStreak = Math.max(tracker.longestLostStreak || 0, streak);
    }
    tracker.deletedHabits = (tracker.deletedHabits || 0) + 1;
    habits[idx].active = false;
    persist();
    checkAchievements();
  }
}

// === COMPLETIONS ===
function isCompletedToday(habitId) {
  const today = todayStr();
  return completions.some(c => c.habitId === habitId && c.date === today);
}

function completeHabit(habitId) {
  if (isCompletedToday(habitId)) return;
  // Detect broken streaks: if last completion was 2+ days ago but there was a streak before
  const dates = getCompletionDates(habitId).sort();
  if (dates.length > 0) {
    const lastDate = dates[dates.length - 1];
    const gap = daysBetween(lastDate, todayStr());
    if (gap >= 2) {
      // There was a gap — calculate what the streak was before the gap
      let oldStreak = 1;
      for (let i = dates.length - 2; i >= 0; i--) {
        if (daysBetween(dates[i], dates[i+1]) === 1) oldStreak++;
        else break;
      }
      if (oldStreak >= 2) {
        tracker.lostStreaks.push({ habitId, streak: oldStreak, date: lastDate, gap });
        tracker.longestLostStreak = Math.max(tracker.longestLostStreak || 0, oldStreak);
        saveData('tracker', tracker);
      }
    }
  }
  const now = new Date().toISOString();
  completions.push({ habitId, date: todayStr(), time: now });
  addPoints(10);

  const streak = getStreak(habitId);
  const streakBonuses = { 3: 25, 7: 50, 14: 100, 30: 200, 60: 400, 100: 800 };
  if (streakBonuses[streak]) addPoints(streakBonuses[streak]);

  if (checkPerfectWeek()) addPoints(100);

  // === Earn resources ===
  const habit = habits.find(h => h.id === habitId);
  if (habit && RESOURCES[habit.category]) {
    const mult = getStreakMultiplier(streak);
    const earned = Math.floor(1 * mult);
    resources[habit.category] = (resources[habit.category] || 0) + earned;
    saveData('resources', resources);
    if (mult > 1) {
      toast(`+${earned} ${RESOURCES[habit.category].icon} ${RESOURCES[habit.category].name} (x${mult} стрик!)`, 'success');
    }
  }

  persist();
  checkAchievements();
  updateResourceHUD();
}

function getCompletionsForHabit(habitId) {
  return completions.filter(c => c.habitId === habitId);
}

function getCompletionDates(habitId) {
  return [...new Set(completions.filter(c => c.habitId === habitId).map(c => c.date))];
}

function isCompletedOnDate(habitId, date) {
  return completions.some(c => c.habitId === habitId && c.date === date);
}

// === STREAKS ===
function getStreak(habitId) {
  const habit = habits.find(h => h.id === habitId);
  if (!habit) return 0;
  const dates = getCompletionDates(habitId).sort();
  if (dates.length === 0) return 0;

  if (habit.frequency === 'daily') {
    let streak = 0;
    let check = todayStr();
    // if not completed today, start from yesterday
    if (!dates.includes(check)) {
      const y = new Date(); y.setDate(y.getDate() - 1);
      check = dateStr(y);
    }
    while (dates.includes(check)) {
      streak++;
      const d = new Date(check); d.setDate(d.getDate() - 1);
      check = dateStr(d);
    }
    return streak;
  } else {
    // Weekly: count consecutive weeks meeting target
    const target = FREQUENCY_TARGET[habit.frequency] || 1;
    const weekMap = {};
    dates.forEach(d => {
      const wk = getWeekNumber(d);
      weekMap[wk] = (weekMap[wk] || 0) + 1;
    });
    const currentWeek = getWeekNumber(todayStr());
    let streak = 0;
    let wk = currentWeek;
    while (weekMap[wk] >= target || (wk === currentWeek && (weekMap[wk] || 0) >= 0)) {
      if (weekMap[wk] >= target) streak++;
      else if (wk !== currentWeek) break;
      wk--;
    }
    return streak;
  }
}

function getMaxStreak(habitId) {
  const habit = habits.find(h => h.id === habitId);
  if (!habit) return 0;
  const dates = getCompletionDates(habitId).sort();
  if (dates.length === 0) return 0;

  if (habit.frequency === 'daily') {
    let max = 1, cur = 1;
    for (let i = 1; i < dates.length; i++) {
      if (daysBetween(dates[i-1], dates[i]) === 1) { cur++; max = Math.max(max, cur); }
      else cur = 1;
    }
    return max;
  }
  return getStreak(habitId);
}

function getMaxStreakOverall() {
  return Math.max(0, ...getActiveHabits().map(h => getMaxStreak(h.id)));
}

function checkPerfectWeek() {
  const active = getActiveHabits();
  if (active.length === 0) return false;
  const today = new Date();
  const dayOfWeek = today.getDay() || 7;
  if (dayOfWeek < 7) return false;
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const ds = dateStr(d);
    for (const h of active) {
      if (h.frequency === 'daily' && !isCompletedOnDate(h.id, ds)) return false;
    }
  }
  return true;
}

// === NOTES ===
let currentNoteHabitId = null;

function addNote(habitId, title, text) {
  notes.push({ id: genId(), habitId, title, text, createdAt: new Date().toISOString() });
  addPoints(3);
  persist();
  checkAchievements();
}

function getNotesForHabit(habitId) {
  return notes.filter(n => n.habitId === habitId).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
}

// === POINTS & LEVELS ===
function getLevel(pts) { return Math.floor(Math.sqrt((pts || 0) / 100)) + 1; }

function addPoints(n) {
  const oldLevel = getLevel(points);
  points += n;
  saveData('points', points);
  const newLevel = getLevel(points);
  if (newLevel > oldLevel) showLevelUp(newLevel);
  updateHeader();
}

function getLevelProgress() {
  const lvl = getLevel(points);
  const thisLvlPts = ((lvl - 1) ** 2) * 100;
  const nextLvlPts = (lvl ** 2) * 100;
  return (points - thisLvlPts) / (nextLvlPts - thisLvlPts);
}

// === ACHIEVEMENTS SYSTEM — fun, ironic, game-style badges ===
function buildAchievements() {
  const badges = [];
  let idCounter = 0;
  const id = () => `b${++idCounter}`;

  // ---- HELPERS ----
  const maxSt = () => Math.max(0, ...getActiveHabits().map(h => getStreak(h.id)));
  const activeDays = () => new Set(completions.map(c => c.date)).size;
  const byDateMap = () => { const m = {}; completions.forEach(c => { m[c.date] = (m[c.date]||0)+1; }); return m; };
  const earlyCount = () => completions.filter(c => new Date(c.time).getHours() < 8).length;
  const lateCount = () => completions.filter(c => new Date(c.time).getHours() >= 22).length;
  const multiStreak = (days) => getActiveHabits().filter(h => getStreak(h.id) >= days).length;
  const catStreak = (cat) => Math.max(0, ...getActiveHabits().filter(h=>h.category===cat).map(h=>getStreak(h.id)), 0);
  const lostStreaks = () => tracker.lostStreaks || [];
  const maxLost = () => Math.max(0, ...lostStreaks().map(s => s.streak));
  const totalLost = () => lostStreaks().length;
  const hasComeback = () => getActiveHabits().some(h => {
    const dates = getCompletionDates(h.id).sort();
    for (let i = 1; i < dates.length; i++) {
      if (daysBetween(dates[i-1], dates[i]) >= 4) {
        const after = dates.slice(i);
        let s = 1;
        for (let j = 1; j < after.length; j++) { if (daysBetween(after[j-1], after[j]) === 1) s++; else break; }
        if (s >= 3) return true;
      }
    }
    return false;
  });
  // Has a habit with 0 completions for 14+ days since creation
  const ghostHabits = () => getActiveHabits().filter(h => {
    const comps = getCompletionsForHabit(h.id);
    if (comps.length > 0) return false;
    return daysBetween(h.createdAt.slice(0,10), todayStr()) >= 14;
  });
  // Habit completed every day at roughly same hour (within 1hr) for 5+ days
  const clockworkHabit = () => getActiveHabits().some(h => {
    const comps = completions.filter(c => c.habitId === h.id).sort((a,b) => a.date.localeCompare(b.date)).slice(-7);
    if (comps.length < 5) return false;
    const hours = comps.map(c => new Date(c.time).getHours());
    const avg = hours.reduce((a,b)=>a+b,0) / hours.length;
    return hours.every(h => Math.abs(h - avg) <= 1);
  });
  // Only 1 habit completed when 3+ available
  const lazyDay = () => {
    const active = getActiveHabits().filter(h => h.frequency === 'daily');
    if (active.length < 3) return false;
    const todayComps = completions.filter(c => c.date === todayStr());
    return todayComps.length === 1;
  };
  // Rebuilt a lost streak: had a streak X, lost it, then got streak X again on same habit
  const rebuiltStreak = () => lostStreaks().some(ls => {
    const current = getStreak(ls.habitId);
    return current >= ls.streak;
  });

  const b = (cat, name, icon, desc, rarity, bonus, check, progress, hidden = false) =>
    badges.push({ id: id(), category: cat, name, icon, desc, rarity, bonus, check, progress, hidden });

  // =============================================
  //  ПЕРВЫЕ ШАГИ — classic beginnings
  // =============================================
  b('begin', 'Первый шаг', '👣', 'Создайте первую привычку. Все великие дела начинаются с одной кнопки!', 'common', 5,
    () => habits.length >= 1, () => Math.min(1, habits.length));
  b('begin', 'Инициация', '🎓', 'Выполните привычку впервые. Ритуал пройден!', 'common', 10,
    () => completions.length >= 1, () => Math.min(1, completions.length));
  b('begin', 'Архитектор', '🏗️', 'Создайте 5 привычек. Вы явно что-то затеваете...', 'rare', 20,
    () => habits.length >= 5, () => Math.min(1, habits.length / 5));
  b('begin', 'Мания величия', '🤴', '20 привычек. Вы уверены, что справитесь?..', 'epic', 50,
    () => habits.length >= 20, () => Math.min(1, habits.length / 20));

  // =============================================
  //  СТРИКИ — the grind
  // =============================================
  b('streaks', 'Огонёк', '🔥', '3 дня подряд. Искра зажглась!', 'common', 10,
    () => maxSt() >= 3, () => Math.min(1, maxSt() / 3));
  b('streaks', 'Рабочая неделя', '💼', '5 дней. Как на работу, только добровольно!', 'common', 15,
    () => maxSt() >= 5, () => Math.min(1, maxSt() / 5));
  b('streaks', 'Неделька!', '🏃', '7 дней без срывов!', 'rare', 25,
    () => maxSt() >= 7, () => Math.min(1, maxSt() / 7));
  b('streaks', 'Формирование привычки', '🧬', '21 день подряд. Учёные говорят, что привычка закрепилась. Учёные врут.', 'rare', 75,
    () => maxSt() >= 21, () => Math.min(1, maxSt() / 21));
  b('streaks', 'Машина', '🤖', '30 дней. Биип-буп, выполняю протокол!', 'epic', 100,
    () => maxSt() >= 30, () => Math.min(1, maxSt() / 30));
  b('streaks', 'Несгибаемый', '💎', '60 дней. Даже алмаз завидует вашей твёрдости!', 'epic', 200,
    () => maxSt() >= 60, () => Math.min(1, maxSt() / 60));
  b('streaks', 'Легенда', '🌟', '100 дней подряд. О вас будут слагать песни!', 'legendary', 500,
    () => maxSt() >= 100, () => Math.min(1, maxSt() / 100));
  b('streaks', 'Целый год!', '👑', '365 дней. Вы — финальный босс дисциплины!', 'legendary', 1500,
    () => maxSt() >= 365, () => Math.min(1, maxSt() / 365));

  // =============================================
  //  ПАДЕНИЯ И КАМБЭКИ — the drama!
  // =============================================
  b('drama', 'Ой...', '😬', 'Потеряйте стрик в 3+ дня. Бывает с лучшими!', 'common', 5,
    () => lostStreaks().some(s => s.streak >= 3), () => maxLost() >= 3 ? 1 : Math.min(1, maxLost() / 3));
  b('drama', 'Больно!', '💔', 'Потеряйте стрик в 7+ дней. Неделя... коту под хвост.', 'rare', 15,
    () => lostStreaks().some(s => s.streak >= 7), () => maxLost() >= 7 ? 1 : Math.min(1, maxLost() / 7));
  b('drama', 'Трагедия', '😭', 'Месяц трудов может исчезнуть за секунду...', 'epic', 30,
    () => lostStreaks().some(s => s.streak >= 30), () => maxLost() >= 30 ? 1 : Math.min(1, maxLost() / 30), true);
  b('drama', 'Катастрофа', '☄️', 'Когда падают звёзды, земля содрогается', 'legendary', 50,
    () => lostStreaks().some(s => s.streak >= 100), () => maxLost() >= 100 ? 1 : Math.min(1, maxLost() / 100), true);
  b('drama', 'Серийный срыватель', '🎭', 'Некоторые коллекционируют не успехи...', 'rare', 20,
    () => totalLost() >= 5, () => Math.min(1, totalLost() / 5), true);
  b('drama', 'Сизиф', '🪨', 'Камень, гора, повтор. Снова и снова и снова.', 'epic', 40,
    () => lostStreaks().filter(s => s.streak >= 10).length >= 3,
    () => Math.min(1, lostStreaks().filter(s => s.streak >= 10).length / 3), true);

  b('drama', 'Феникс', '🔥', 'Вернитесь после 3+ дней пропуска, продержитесь 3 дня. Из пепла!', 'rare', 30,
    hasComeback, () => hasComeback() ? 1 : 0);
  b('drama', 'Реванш', '⚔️', 'Восстановите потерянный стрик до прежнего уровня. Месть!', 'epic', 100,
    rebuiltStreak, () => rebuiltStreak() ? 1 : 0);
  b('drama', 'Нокдаун', '🥊', 'Потеряйте стрик и в тот же день начните заново!', 'rare', 25,
    () => lostStreaks().some(s => {
      return completions.some(c => c.habitId === s.habitId && daysBetween(s.date, c.date) <= 1 && c.date > s.date);
    }),
    () => lostStreaks().length > 0 ? 0.5 : 0);
  b('drama', 'Американские горки', '🎢', 'Вверх-вниз-вверх. Карусель, от которой кружится голова.', 'epic', 60,
    () => getActiveHabits().some(h => {
      const lost = lostStreaks().filter(s => s.habitId === h.id && s.streak >= 7);
      return lost.length > 0 && getStreak(h.id) >= 7;
    }),
    () => getActiveHabits().some(h => lostStreaks().some(s => s.habitId === h.id && s.streak >= 7)) ? 0.5 : 0, true);
  b('drama', 'Ложная надежда', '🎪', 'На этот раз точно получится... наверное... может быть...', 'epic', 30,
    () => getActiveHabits().some(h => lostStreaks().filter(s => s.habitId === h.id && s.streak >= 3).length >= 3),
    () => {
      const mx = Math.max(0, ...getActiveHabits().map(h => lostStreaks().filter(s => s.habitId === h.id && s.streak >= 3).length));
      return Math.min(1, mx / 3);
    }, true);
  b('drama', 'Упрямый осёл', '🫏', 'Падал. Вставал. Падал. Вставал. Снова падал. И снова встал.', 'legendary', 80,
    () => getActiveHabits().some(h => {
      const lost = lostStreaks().filter(s => s.habitId === h.id).length;
      return lost >= 5 && getStreak(h.id) >= 1;
    }),
    () => {
      const mx = Math.max(0, ...getActiveHabits().map(h => lostStreaks().filter(s => s.habitId === h.id).length));
      return Math.min(1, mx / 5);
    }, true);

  // =============================================
  //  ЛЕНЬ И ПРОКРАСТИНАЦИЯ — dark side
  // =============================================
  b('lazy', 'Минималист', '🦥', 'Выполните ровно 1 привычку из 3+ доступных. Тактическая лень!', 'common', 5,
    lazyDay, () => lazyDay() ? 1 : 0);
  b('lazy', 'Оптимист', '🌸', 'Намерение — это уже половина дела. Ведь так?..', 'rare', 10,
    () => ghostHabits().length >= 1, () => ghostHabits().length >= 1 ? 1 : 0, true);
  b('lazy', 'Коллекционер пыли', '🕸️', 'Некоторые вещи лучше смотрятся на полке. Нетронутые.', 'epic', 20,
    () => ghostHabits().length >= 3, () => Math.min(1, ghostHabits().length / 3), true);
  b('lazy', 'Не судьба', '🪦', 'Удалите привычку. Покойся с миром!', 'common', 5,
    () => (tracker.deletedHabits || 0) >= 1, () => Math.min(1, (tracker.deletedHabits||0)));
  b('lazy', 'Серийный убийца', '🗡️', 'У кладбища привычек появился постоянный посетитель.', 'rare', 15,
    () => (tracker.deletedHabits || 0) >= 5, () => Math.min(1, (tracker.deletedHabits||0) / 5), true);
  b('lazy', 'Предательство', '🔪', 'Сначала любил, потом... ну вы поняли.', 'epic', 25,
    () => {
      const deleted = habits.filter(h => h.active === false);
      return deleted.some(h => completions.some(c => c.habitId === h.id && c.date === todayStr()));
    },
    () => 0, true);
  b('lazy', 'Всё сложно', '🔄', 'Перекрасить, переименовать, поменять иконку... идеал недостижим.', 'rare', 15,
    () => (tracker.editCount || 0) >= 10, () => Math.min(1, (tracker.editCount||0) / 10), true);
  b('lazy', 'Тихий уход', '👻', 'Не удалена. Не выполнена. Просто... существует.', 'epic', 15,
    () => getActiveHabits().some(h => {
      const comps = getCompletionsForHabit(h.id);
      if (comps.length === 0) return daysBetween(h.createdAt.slice(0,10), todayStr()) >= 30;
      const last = comps.sort((a,b) => b.date.localeCompare(a.date))[0].date;
      return daysBetween(last, todayStr()) >= 30;
    }),
    () => 0, true);
  b('lazy', 'Реанимация', '💉', 'Она уже не дышала... но вы нашли пульс.', 'rare', 20,
    () => {
      return completions.some(c => {
        if (c.date !== todayStr()) return false;
        const prev = completions.filter(x => x.habitId === c.habitId && x.date < c.date).sort((a,b) => b.date.localeCompare(a.date));
        if (prev.length === 0) {
          const h = habits.find(h => h.id === c.habitId);
          return h && daysBetween(h.createdAt.slice(0,10), todayStr()) >= 20;
        }
        return daysBetween(prev[0].date, c.date) >= 20;
      });
    },
    () => 0, true);
  b('lazy', 'Прокрастинатор года', '🏅', 'Приходить каждый день. Смотреть. Не делать. Искусство.', 'legendary', 30,
    () => {
      const opens = tracker.openDates || [];
      const today = todayStr();
      let streak = 0;
      for (let i = 0; i < opens.length; i++) {
        const d = new Date(today);
        d.setDate(d.getDate() - i);
        const ds = dateStr(d);
        if (!opens.includes(ds)) break;
        const dayComps = completions.filter(c => c.date === ds);
        if (dayComps.length > 0) break;
        streak++;
      }
      return streak >= 7;
    },
    () => 0, true);
  b('lazy', 'Всё или ничего', '🎲', 'Сегодня герой, завтра... ну, завтра другой день.', 'rare', 15,
    () => {
      const active = getActiveHabits().filter(h => h.frequency === 'daily');
      if (active.length === 0) return false;
      const yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
      const yd = dateStr(yesterday);
      const allYesterday = active.every(h => isCompletedOnDate(h.id, yd));
      const noneToday = !active.some(h => isCompletedToday(h.id));
      return allYesterday && noneToday;
    },
    () => 0, true);
  b('lazy', 'Фаворит', '⭐', 'У вас есть любимчик. И все остальные это знают.', 'rare', 15,
    () => {
      const active = getActiveHabits();
      const has30 = active.some(h => getCompletionsForHabit(h.id).length >= 30);
      const hasZero = active.some(h => getCompletionsForHabit(h.id).length === 0);
      return has30 && hasZero;
    },
    () => 0, true);

  // =============================================
  //  ГРИНД — pure volume
  // =============================================
  b('grind', 'Новичок', '🌱', '10 выполнений. Семечко посажено!', 'common', 10,
    () => completions.length >= 10, () => Math.min(1, completions.length / 10));
  b('grind', 'Полтинник', '🎰', '50 выполнений. Джекпот!', 'rare', 40,
    () => completions.length >= 50, () => Math.min(1, completions.length / 50));
  b('grind', 'Сотня', '💯', '100 выполнений. Три цифры, одна цель!', 'rare', 80,
    () => completions.length >= 100, () => Math.min(1, completions.length / 100));
  b('grind', 'Гриндер', '⚙️', '500 выполнений. Гринд — это образ жизни!', 'epic', 300,
    () => completions.length >= 500, () => Math.min(1, completions.length / 500));
  b('grind', 'Тысячник', '🏆', '1000 выполнений. ВЫ. МОНСТР.', 'legendary', 600,
    () => completions.length >= 1000, () => Math.min(1, completions.length / 1000));

  // =============================================
  //  ПЕРФЕКЦИОНИЗМ — perfection
  // =============================================
  b('perfect', 'Чистый день', '✨', 'Все ежедневные привычки за день. Чистота!', 'common', 15,
    () => {
      const a = getActiveHabits().filter(h => h.frequency === 'daily');
      return a.length > 0 && a.every(h => isCompletedToday(h.id));
    },
    () => {
      const a = getActiveHabits().filter(h => h.frequency === 'daily');
      return a.length === 0 ? 0 : a.filter(h => isCompletedToday(h.id)).length / a.length;
    });
  b('perfect', 'Хет-трик', '🎩', '3 идеальных дня подряд. Фокус!', 'rare', 40,
    () => perfectDaysStreak() >= 3, () => Math.min(1, perfectDaysStreak() / 3));
  b('perfect', 'Безупречная неделя', '💫', '7 дней подряд. Ни одного промаха!', 'epic', 100,
    () => perfectDaysStreak() >= 7, () => Math.min(1, perfectDaysStreak() / 7));
  b('perfect', 'Бог дисциплины', '🏛️', '30 идеальных дней. Вам нужен свой храм!', 'legendary', 500,
    () => perfectDaysStreak() >= 30, () => Math.min(1, perfectDaysStreak() / 30));
  b('perfect', 'Абсолют', '💯', '100% за 30 дней. Это вообще возможно?!', 'legendary', 600,
    () => completionRate30() >= 1, () => completionRate30());

  // =============================================
  //  ВРЕМЯ СУТОК — when you do it matters
  // =============================================
  b('time', 'Ранняя пташка', '🐤', '10 раз до 8 утра. Кто рано встаёт...', 'common', 15,
    () => earlyCount() >= 10, () => Math.min(1, earlyCount() / 10));
  b('time', 'Повелитель рассвета', '☀️', '50 раз до 8 утра. Солнце встаёт, чтобы увидеть ВАС!', 'epic', 80,
    () => earlyCount() >= 50, () => Math.min(1, earlyCount() / 50));
  b('time', 'Полуночник', '🦉', '10 раз после 22:00. Тишина — лучший мотиватор!', 'common', 15,
    () => lateCount() >= 10, () => Math.min(1, lateCount() / 10));
  b('time', 'Лорд тьмы', '🌑', '50 раз после 22:00. Ночь принадлежит вам!', 'epic', 80,
    () => lateCount() >= 50, () => Math.min(1, lateCount() / 50));
  b('time', 'Бессонница', '😵', 'Есть часы, когда даже луна уже спит...', 'epic', 100,
    () => completions.some(c => { const h = new Date(c.time).getHours(); return h >= 3 && h < 5; }),
    () => completions.some(c => { const h = new Date(c.time).getHours(); return h >= 3 && h < 5; }) ? 1 : 0, true);
  b('time', 'Как часы', '⏰', 'Выполняйте одну привычку в одно и то же время 5 дней подряд (+-1 час). Швейцарская точность!', 'rare', 40,
    clockworkHabit, () => clockworkHabit() ? 1 : 0);

  // =============================================
  //  АКТИВНОСТЬ ЗА ДЕНЬ — burst mode
  // =============================================
  b('burst', 'Продуктивный день', '⚡', '5 привычек за день. Энергия!', 'rare', 30,
    () => Object.values(byDateMap()).some(v => v >= 5), () => { const mx = Math.max(0,...Object.values(byDateMap())); return Math.min(1, mx/5); });
  b('burst', 'Ураган', '🌪️', '10 привычек за день. Вас не остановить!', 'epic', 80,
    () => Object.values(byDateMap()).some(v => v >= 10), () => { const mx = Math.max(0,...Object.values(byDateMap())); return Math.min(1, mx/10); });
  b('burst', 'Скоростной забег', '⏱️', '3+ привычки за 10 минут. Спидран!', 'epic', 80,
    () => {
      const sorted = completions.filter(c => c.date === todayStr()).sort((a,b) => new Date(a.time) - new Date(b.time));
      for (let i = 0; i <= sorted.length - 3; i++) {
        if ((new Date(sorted[i+2].time) - new Date(sorted[i].time)) / 60000 <= 10) return true;
      }
      return false;
    },
    () => Math.min(1, completions.filter(c => c.date === todayStr()).length / 3));

  // =============================================
  //  МУЛЬТИ-СТРИКИ — juggling
  // =============================================
  b('multi', 'Жонглёр', '🤹', '2 привычки со стриком 7+ дней. Жонглируете достойно!', 'rare', 40,
    () => multiStreak(7) >= 2, () => Math.min(1, multiStreak(7) / 2));
  b('multi', 'Дирижёр', '🎼', '3 со стриком 7+. Вы управляете оркестром!', 'epic', 80,
    () => multiStreak(7) >= 3, () => Math.min(1, multiStreak(7) / 3));
  b('multi', 'Повелитель хаоса', '🌀', '5 со стриком 7+. Хаос укрощён!', 'legendary', 200,
    () => multiStreak(7) >= 5, () => Math.min(1, multiStreak(7) / 5));

  // =============================================
  //  РАЗНООБРАЗИЕ — variety
  // =============================================
  b('style', 'Радуга', '🌈', 'Все 6 цветов. Жизнь — палитра!', 'rare', 30,
    () => new Set(habits.map(h=>h.color)).size >= 6, () => Math.min(1, new Set(habits.map(h=>h.color)).size / 6));
  b('style', 'Мастер на все руки', '🔧', 'Привычки во всех 4 категориях. Разносторонняя личность!', 'rare', 30,
    () => new Set(habits.map(h=>h.category)).size >= 4, () => Math.min(1, new Set(habits.map(h=>h.category)).size / 4));
  b('style', 'Эмодзи-маньяк', '😜', '12+ разных иконок. Вы любите картинки!', 'rare', 40,
    () => new Set(habits.map(h=>h.icon)).size >= 12, () => Math.min(1, new Set(habits.map(h=>h.icon)).size / 12));

  // =============================================
  //  СЕКРЕТЫ И ПАСХАЛКИ — hidden gems
  // =============================================
  b('secret', 'Понедельничный герой', '😤', 'Самый тяжёлый день недели? Не для вас.', 'rare', 40,
    () => {
      if (new Date().getDay() !== 1) return false;
      const a = getActiveHabits().filter(h => h.frequency === 'daily');
      return a.length > 0 && a.every(h => isCompletedToday(h.id));
    },
    () => {
      if (new Date().getDay() !== 1) return 0;
      const a = getActiveHabits().filter(h => h.frequency === 'daily');
      return a.length === 0 ? 0 : a.filter(h => isCompletedToday(h.id)).length / a.length;
    }, true);
  b('secret', 'Пятница 13-е', '🖤', 'Некоторые даты несут особую энергию. Вы не суеверны?', 'epic', 100,
    () => completions.some(c => { const d = new Date(c.date); return d.getDay() === 5 && d.getDate() === 13; }),
    () => completions.some(c => { const d = new Date(c.date); return d.getDay() === 5 && d.getDate() === 13; }) ? 1 : 0, true);
  b('secret', 'Новый год, новый я', '🎆', 'Когда мир празднует, вы работаете над собой.', 'epic', 100,
    () => completions.some(c => c.date.endsWith('-01-01')),
    () => completions.some(c => c.date.endsWith('-01-01')) ? 1 : 0, true);
  b('secret', '11:11', '🕯️', 'Когда цифры на часах становятся зеркалом...', 'epic', 50,
    () => completions.some(c => { const d = new Date(c.time); return d.getHours() === 11 && d.getMinutes() === 11; }),
    () => completions.some(c => { const d = new Date(c.time); return d.getHours() === 11 && d.getMinutes() === 11; }) ? 1 : 0, true);
  b('secret', 'Палиндром', '🪞', 'Прочитайте дату задом наперёд. Видите?', 'legendary', 150,
    () => completions.some(c => { const s = c.date.replace(/-/g,''); return s === s.split('').reverse().join(''); }),
    () => completions.some(c => { const s = c.date.replace(/-/g,''); return s === s.split('').reverse().join(''); }) ? 1 : 0, true);
  b('secret', 'Воин выходных', '🛡️', '4 субботы+воскресенья подряд!', 'rare', 50,
    () => weekendWarrior() >= 4, () => Math.min(1, weekendWarrior() / 4));
  b('secret', 'Ночной дожор', '🍕', 'Здоровье и полночь — ироничное сочетание.', 'epic', 40,
    () => completions.some(c => {
      const h = habits.find(x => x.id === c.habitId);
      return h && h.category === 'health' && new Date(c.time).getHours() < 4 && new Date(c.time).getHours() >= 0;
    }),
    () => 0, true);
  b('secret', 'Спортсмен на диване', '🛋️', 'Тренировка — да. Работа — ну, это другой вид спорта.', 'rare', 20,
    () => {
      const sportDone = getActiveHabits().filter(h => h.category === 'sport').some(h => isCompletedToday(h.id));
      const workHabits = getActiveHabits().filter(h => h.category === 'work');
      const workDone = workHabits.some(h => isCompletedToday(h.id));
      return sportDone && workHabits.length > 0 && !workDone;
    },
    () => 0, true);
  b('secret', 'Утро чемпиона', '🏆', 'Пока мир ещё спит, кто-то уже всё сделал.', 'rare', 30,
    () => {
      const byDate = {};
      completions.forEach(c => {
        if (new Date(c.time).getHours() < 9) {
          byDate[c.date] = (byDate[c.date]||0)+1;
        }
      });
      return Object.values(byDate).some(v => v >= 3);
    },
    () => 0, true);
  b('secret', 'Двойной удар', '👊', 'Молния бьёт дважды. И очень быстро.', 'epic', 50,
    () => {
      const sorted = [...completions].sort((a,b) => new Date(a.time) - new Date(b.time));
      for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].date === sorted[i-1].date && sorted[i].habitId !== sorted[i-1].habitId) {
          if ((new Date(sorted[i].time) - new Date(sorted[i-1].time)) / 1000 <= 60) return true;
        }
      }
      return false;
    },
    () => 0, true);
  b('secret', 'Одержимость', '🔒', 'Одна. Единственная. Ничего кроме неё не существует.', 'legendary', 60,
    () => getActiveHabits().some(h => {
      if (getStreak(h.id) < 30) return false;
      const others = getActiveHabits().filter(x => x.id !== h.id);
      return others.length > 0 && others.every(x => getStreak(x.id) === 0);
    }),
    () => 0, true);
  b('secret', 'Ностальгия', '📼', 'Иногда нужно уйти, чтобы вернуться.', 'rare', 20,
    () => {
      const opens = tracker.openDates || [];
      if (opens.length < 2) return false;
      const sorted = [...opens].sort();
      for (let i = 1; i < sorted.length; i++) {
        if (daysBetween(sorted[i-1], sorted[i]) >= 14) return true;
      }
      return false;
    },
    () => 0, true);
  b('secret', 'Графоман на максималках', '📏', 'Когда каждый символ на счету. Буквально.', 'epic', 30,
    () => notes.some(n => (n.text || '').length === 500),
    () => 0, true);
  b('secret', 'Дневник — сила', '📓', 'Записывать — значит помнить. Помнить — значит расти.', 'rare', 20,
    () => (tracker.diaryExports || 0) >= 5, () => Math.min(1, (tracker.diaryExports||0) / 5), true);

  // =============================================
  //  КАТЕГОРИИ — специализация
  // =============================================
  // Спорт
  b('cat', 'Качок', '💪', 'Стрик 7 дней в спорте. Мышцы уже болят!', 'rare', 25,
    () => catStreak('sport') >= 7, () => Math.min(1, catStreak('sport') / 7));
  b('cat', 'Олимпиец', '🥇', 'Стрик 30 дней в спорте. Можно на олимпиаду!', 'epic', 80,
    () => catStreak('sport') >= 30, () => Math.min(1, catStreak('sport') / 30));
  // Здоровье
  b('cat', 'ЗОЖник', '🥬', 'Стрик 7 дней в здоровье. Смузи уже в блендере!', 'rare', 25,
    () => catStreak('health') >= 7, () => Math.min(1, catStreak('health') / 7));
  b('cat', 'Бессмертный (почти)', '♾️', 'Стрик 30 дней в здоровье. Эликсир молодости?', 'epic', 80,
    () => catStreak('health') >= 30, () => Math.min(1, catStreak('health') / 30));
  // Саморазвитие
  b('cat', 'Книжный червь', '🐛', 'Стрик 7 дней в саморазвитии. Мозг прокачивается!', 'rare', 25,
    () => catStreak('growth') >= 7, () => Math.min(1, catStreak('growth') / 7));
  b('cat', 'Мудрец', '🧙', 'Стрик 30 дней в саморазвитии. Борода уже растёт!', 'epic', 80,
    () => catStreak('growth') >= 30, () => Math.min(1, catStreak('growth') / 30));
  // Работа
  b('cat', 'Трудоголик', '⌨️', 'Стрик 7 дней в работе. Босс доволен!', 'rare', 25,
    () => catStreak('work') >= 7, () => Math.min(1, catStreak('work') / 7));
  b('cat', 'CEO', '👔', 'Стрик 30 дней в работе. Повышение!', 'epic', 80,
    () => catStreak('work') >= 30, () => Math.min(1, catStreak('work') / 30));

  // =============================================
  //  ИСПОЛЬЗОВАНИЕ — loyalty
  // =============================================
  b('usage', 'Первая неделя', '📅', '7 активных дней. Мы уже друзья!', 'common', 10,
    () => activeDays() >= 7, () => Math.min(1, activeDays() / 7));
  b('usage', 'Месяц с нами', '🗓️', '30 активных дней. Постоянный клиент!', 'common', 25,
    () => activeDays() >= 30, () => Math.min(1, activeDays() / 30));
  b('usage', 'Старожил', '🏚️', '100 активных дней. Вы тут живёте?', 'epic', 100,
    () => activeDays() >= 100, () => Math.min(1, activeDays() / 100));
  b('usage', 'Годовщина', '🎂', '365 активных дней. С ДР трекера!', 'legendary', 500,
    () => activeDays() >= 365, () => Math.min(1, activeDays() / 365));

  // =============================================
  //  ЗАМЕТКИ — writing
  // =============================================
  b('notes', 'Первая запись', '📝', 'Написать первую заметку!', 'common', 5,
    () => notes.length >= 1, () => Math.min(1, notes.length));
  b('notes', 'Блогер', '💻', '10 заметок. У вас тут целый блог!', 'rare', 20,
    () => notes.length >= 10, () => Math.min(1, notes.length / 10));
  b('notes', 'Графоман', '🖋️', '50 заметок. Пора писать книгу!', 'epic', 60,
    () => notes.length >= 50, () => Math.min(1, notes.length / 50));
  b('notes', 'Летописец', '📜', '100 заметок. Бестселлер!', 'legendary', 150,
    () => notes.length >= 100, () => Math.min(1, notes.length / 100));

  // =============================================
  //  ОЧКИ — milestones
  // =============================================
  b('points', 'Первая сотня', '🪙', '100 очков. Копейка рубль бережёт!', 'common', 10,
    () => points >= 100, () => Math.min(1, points / 100));
  b('points', 'Тысячник', '🤑', '1000 очков. Богатство дисциплины!', 'rare', 50,
    () => points >= 1000, () => Math.min(1, points / 1000));
  b('points', 'Магнат', '💎', '5000 очков. Форбс нервно курит!', 'epic', 100,
    () => points >= 5000, () => Math.min(1, points / 5000));
  b('points', 'Миллионер духа', '👑', '10000 очков. Деньги — ничто, дисциплина — всё!', 'legendary', 300,
    () => points >= 10000, () => Math.min(1, points / 10000));

  // =============================================
  //  МЕТА — badge hunting
  // =============================================
  b('meta', 'Охотник', '🔍', '5 бейджей. Коллекция начата!', 'common', 15,
    () => unlockedBadges.length >= 5, () => Math.min(1, unlockedBadges.length / 5));
  b('meta', 'Собиратель', '🧲', '15 бейджей. Полка заполняется!', 'rare', 30,
    () => unlockedBadges.length >= 15, () => Math.min(1, unlockedBadges.length / 15));
  b('meta', 'Музейный работник', '🏛️', '30 бейджей. Выставка!', 'epic', 80,
    () => unlockedBadges.length >= 30, () => Math.min(1, unlockedBadges.length / 30));
  b('meta', 'Покажи мне всё!', '🌟', 'ВСЕ бейджи. Абсолютный мастер!', 'legendary', 1000,
    () => false, () => 0);

  // Fix ultimate badge
  const totalBadges = badges.length;
  const ultimate = badges[badges.length - 1];
  ultimate.check = () => unlockedBadges.length >= totalBadges - 1;
  ultimate.progress = () => Math.min(1, unlockedBadges.length / (totalBadges - 1));

  return badges;
}

const ALL_BADGES = buildAchievements();

// Helper functions for achievements
function perfectDaysStreak() {
  const active = getActiveHabits().filter(h => h.frequency === 'daily');
  if (active.length === 0) return 0;
  let streak = 0;
  let d = new Date();
  // Check today first, if not all done, start from yesterday
  let ds = dateStr(d);
  if (!active.every(h => isCompletedOnDate(h.id, ds))) {
    d.setDate(d.getDate() - 1);
    ds = dateStr(d);
  }
  while (active.every(h => isCompletedOnDate(h.id, ds))) {
    streak++;
    d.setDate(d.getDate() - 1);
    ds = dateStr(d);
  }
  return streak;
}

function completionRate30() { return completionRateN(30); }

function completionRateN(n) {
  const active = getActiveHabits().filter(h => h.frequency === 'daily');
  if (active.length === 0) return 0;
  let total = 0, done = 0;
  for (let i = 0; i < n; i++) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const ds = dateStr(d);
    active.forEach(h => { total++; if (isCompletedOnDate(h.id, ds)) done++; });
  }
  return total > 0 ? done / total : 0;
}

function weekendWarrior() {
  const active = getActiveHabits();
  if (active.length === 0) return 0;
  let count = 0;
  const d = new Date();
  // go back and check weekends
  for (let w = 0; w < 52; w++) {
    const sat = new Date(d);
    sat.setDate(sat.getDate() - sat.getDay() - 1 - (w * 7));
    const sun = new Date(sat);
    sun.setDate(sun.getDate() + 1);
    const satStr = dateStr(sat);
    const sunStr = dateStr(sun);
    const satOk = active.some(h => isCompletedOnDate(h.id, satStr));
    const sunOk = active.some(h => isCompletedOnDate(h.id, sunStr));
    if (satOk && sunOk) count++;
    else break;
  }
  return count;
}

function checkAchievements() {
  ALL_BADGES.forEach(badge => {
    if (unlockedBadges.includes(badge.id)) return;
    try {
      if (badge.check()) {
        unlockedBadges.push(badge.id);
        points += badge.bonus;
        saveData('points', points);
        saveData('unlockedBadges', unlockedBadges);
        showAchievementPopup(badge);
        showConfetti();
      }
    } catch {}
  });
  updateHeader();
}

// === UI RENDERING ===
function renderHabits() {
  const container = document.getElementById('habits-container');
  const active = getActiveHabits();

  if (active.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">🚀</div>
        <div class="empty-state-text">Начните свой путь</div>
        <div class="empty-state-sub">Создайте первую привычку и начните собирать стрики, ачивки и коллекционные карточки!</div>
      </div>`;
    return;
  }

  const grouped = {};
  Object.keys(CATEGORIES).forEach(cat => {
    const hs = active.filter(h => h.category === cat);
    if (hs.length > 0) grouped[cat] = hs;
  });

  let html = '';
  Object.entries(grouped).forEach(([cat, hs]) => {
    html += `<div class="category-group">
      <div class="category-title">${CATEGORIES[cat].icon} ${CATEGORIES[cat].name}</div>
      <div class="habits-grid">${hs.map(h => renderCard(h)).join('')}</div>
    </div>`;
  });

  container.innerHTML = html;
  bindCardEvents();
}

function renderCard(h) {
  const done = isCompletedToday(h.id);
  const streak = getStreak(h.id);
  const last7 = getLast7Days(h.id);
  const habitNotes = getNotesForHabit(h.id);
  const recentNotes = habitNotes.slice(0, 3);

  let streakHtml = '';
  if (streak > 0) {
    streakHtml = `<span class="streak-badge${streak >= 7 ? ' pulsing' : ''}">🔥 ${streak}</span>`;
  }

  let notesHtml = '';
  if (recentNotes.length > 0) {
    notesHtml = `<div class="notes-preview">
      ${recentNotes.map(n => `<div class="note-preview-item"><span class="note-icon">📝</span><span>${escHtml(n.title || n.text.slice(0,50))}</span></div>`).join('')}
      ${habitNotes.length > 3 ? `<span class="notes-more" data-habit="${h.id}" data-action="all-notes">ещё ${habitNotes.length - 3}...</span>` : ''}
    </div>`;
  }

  return `<div class="habit-card" data-id="${h.id}">
    <div class="habit-card-accent" style="background:${h.color}"></div>
    <div class="habit-card-header">
      <div class="habit-card-info">
        <span class="habit-card-icon">${h.icon}</span>
        <span class="habit-card-name">${escHtml(h.name)}</span>
        ${h.description ? `<div class="habit-card-desc">${escHtml(h.description)}</div>` : ''}
      </div>
      <div class="habit-card-actions">
        <button title="Заметка" data-action="note" data-habit="${h.id}">📝</button>
        <button title="Редактировать" data-action="edit" data-habit="${h.id}">✏️</button>
        <button title="Удалить" data-action="delete" data-habit="${h.id}">🗑️</button>
      </div>
    </div>
    <div class="habit-card-meta">
      <span class="habit-frequency-badge">${FREQUENCY_LABELS[h.frequency]}</span>
      ${streakHtml}
    </div>
    <div class="mini-calendar">${last7.map(d => `<div class="mini-calendar-dot${d.filled?' filled':''}${d.today?' today':''}"></div>`).join('')}</div>
    <button class="btn btn-complete${done?' done':''}" data-action="complete" data-habit="${h.id}" ${done?'disabled':''}>
      ${done ? '✅ Выполнено' : '☐ Отметить выполнение'}
    </button>
    ${notesHtml}
  </div>`;
}

function getLast7Days(habitId) {
  const result = [];
  const today = todayStr();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(); d.setDate(d.getDate() - i);
    const ds = dateStr(d);
    result.push({ date: ds, filled: isCompletedOnDate(habitId, ds), today: ds === today });
  }
  return result;
}

function escHtml(s) {
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML;
}

function bindCardEvents() {
  document.querySelectorAll('[data-action="complete"]').forEach(btn => {
    btn.addEventListener('click', () => {
      completeHabit(btn.dataset.habit);
      renderHabits();
      toast('Привычка выполнена! +10 очков', 'success');
    });
  });
  document.querySelectorAll('[data-action="edit"]').forEach(btn => {
    btn.addEventListener('click', () => openEditHabit(btn.dataset.habit));
  });
  document.querySelectorAll('[data-action="delete"]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Удалить привычку?')) {
        deleteHabit(btn.dataset.habit);
        renderHabits();
        toast('Привычка удалена', 'info');
      }
    });
  });
  document.querySelectorAll('[data-action="note"]').forEach(btn => {
    btn.addEventListener('click', () => openNotes(btn.dataset.habit));
  });
  document.querySelectorAll('[data-action="all-notes"]').forEach(el => {
    el.addEventListener('click', () => openNotes(el.dataset.habit));
  });
}

// === HEADER UPDATE ===
function updateHeader() {
  const lvl = getLevel(points);
  document.getElementById('level-label').textContent = `Уровень ${lvl}`;
  document.getElementById('points-label').textContent = `${points} очков`;
  const prog = getLevelProgress();
  document.getElementById('xp-fill').style.width = `${Math.round(prog * 100)}%`;
}

// === MODAL HELPERS ===
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

document.querySelectorAll('[data-close]').forEach(btn => {
  btn.addEventListener('click', () => closeModal(btn.dataset.close));
});

document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal(overlay.id);
  });
});

// === HABIT FORM ===
function populateIcons() {
  const container = document.getElementById('icon-select');
  container.innerHTML = ICONS.map(ic =>
    `<button type="button" class="icon-btn${ic===selectedIcon?' selected':''}" data-icon="${ic}">${ic}</button>`
  ).join('');
  container.querySelectorAll('.icon-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.icon-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedIcon = btn.dataset.icon;
    });
  });
}

document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedCategory = btn.dataset.cat;
  });
});

document.querySelectorAll('.color-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    selectedColor = btn.dataset.color;
  });
});

document.getElementById('btn-add-habit').addEventListener('click', () => {
  editingHabitId = null;
  document.getElementById('modal-habit-title').textContent = 'Новая привычка';
  document.getElementById('habit-name').value = '';
  document.getElementById('habit-desc').value = '';
  document.getElementById('habit-frequency').value = 'daily';
  selectedCategory = null;
  selectedColor = COLORS[0];
  selectedIcon = ICONS[0];
  resetFormSelections();
  populateIcons();
  openModal('modal-habit');
});

function openEditHabit(id) {
  const h = habits.find(x => x.id === id);
  if (!h) return;
  editingHabitId = id;
  document.getElementById('modal-habit-title').textContent = 'Редактировать привычку';
  document.getElementById('habit-name').value = h.name;
  document.getElementById('habit-desc').value = h.description || '';
  document.getElementById('habit-frequency').value = h.frequency;
  selectedCategory = h.category;
  selectedColor = h.color;
  selectedIcon = h.icon;
  resetFormSelections();
  document.querySelector(`.cat-btn[data-cat="${h.category}"]`)?.classList.add('selected');
  document.querySelector(`.color-btn[data-color="${h.color}"]`)?.classList.add('selected');
  populateIcons();
  setTimeout(() => {
    const iconBtn = document.querySelector(`.icon-btn[data-icon="${h.icon}"]`);
    if (iconBtn) { document.querySelectorAll('.icon-btn').forEach(b=>b.classList.remove('selected')); iconBtn.classList.add('selected'); }
  }, 0);
  openModal('modal-habit');
}

function resetFormSelections() {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('selected'));
  document.querySelectorAll('.color-btn').forEach(b => b.classList.remove('selected'));
}

document.getElementById('btn-save-habit').addEventListener('click', () => {
  const name = document.getElementById('habit-name').value.trim();
  if (!name) { toast('Введите название', 'error'); return; }
  if (!selectedCategory) { toast('Выберите категорию', 'error'); return; }

  const data = {
    name,
    description: document.getElementById('habit-desc').value.trim(),
    category: selectedCategory,
    color: selectedColor,
    icon: selectedIcon,
    frequency: document.getElementById('habit-frequency').value
  };

  if (editingHabitId) {
    updateHabit(editingHabitId, data);
    toast('Привычка обновлена', 'success');
  } else {
    createHabit(data);
    toast('Привычка создана! +5 очков', 'success');
  }

  closeModal('modal-habit');
  renderHabits();
  updateHeader();
});

// === NOTES MODAL ===
function openNotes(habitId) {
  currentNoteHabitId = habitId;
  const h = habits.find(x => x.id === habitId);
  document.getElementById('modal-notes-title').textContent = `Заметки — ${h ? h.icon + ' ' + h.name : ''}`;
  document.getElementById('note-title').value = '';
  document.getElementById('note-text').value = '';
  document.getElementById('note-char-count').textContent = '0';
  renderNotesList(habitId);
  openModal('modal-notes');
}

function renderNotesList(habitId) {
  const list = document.getElementById('notes-list');
  const habitNotes = getNotesForHabit(habitId);
  if (habitNotes.length === 0) {
    list.innerHTML = '<p style="color:#aaa;text-align:center;padding:20px;">Пока нет заметок</p>';
    return;
  }
  list.innerHTML = habitNotes.map(n => `
    <div class="note-item">
      <div class="note-item-date">${formatDate(n.createdAt)} ${formatTime(n.createdAt)}</div>
      ${n.title ? `<div class="note-item-title">${escHtml(n.title)}</div>` : ''}
      <div class="note-item-text">${escHtml(n.text)}</div>
    </div>
  `).join('');
}

document.getElementById('note-text').addEventListener('input', (e) => {
  document.getElementById('note-char-count').textContent = e.target.value.length;
});

document.getElementById('btn-save-note').addEventListener('click', () => {
  const title = document.getElementById('note-title').value.trim();
  const text = document.getElementById('note-text').value.trim();
  if (!title) { toast('Введите название заметки', 'error'); return; }
  addNote(currentNoteHabitId, title, text);
  document.getElementById('note-title').value = '';
  document.getElementById('note-text').value = '';
  document.getElementById('note-char-count').textContent = '0';
  renderNotesList(currentNoteHabitId);
  renderHabits();
  toast('Заметка добавлена! +3 очка', 'success');
});

// === ACHIEVEMENTS MODAL ===
const BADGE_CATEGORIES = {
  all: '🏠 Все',
  begin: '👣 Старт',
  streaks: '🔥 Стрики',
  drama: '💔 Драма',
  lazy: '🦥 Тёмная сторона',
  grind: '⚙️ Гринд',
  perfect: '✨ Перфекционизм',
  time: '🕐 Время',
  burst: '⚡ Активность',
  multi: '🤹 Мульти',
  style: '🌈 Разнообразие',
  secret: '🔮 Секреты',
  cat: '🏷️ Категории',
  usage: '📅 Верность',
  notes: '📝 Заметки',
  points: '🪙 Очки',
  meta: '🏆 Мета'
};

let currentBadgeFilter = 'all';

document.getElementById('btn-achievements').addEventListener('click', () => {
  renderAchievements();
  openModal('modal-achievements');
});

document.getElementById('btn-cards').addEventListener('click', () => {
  renderCardShop();
  openModal('modal-cards');
});

function renderAchievements() {
  const totalUnlocked = unlockedBadges.length;
  const totalAll = ALL_BADGES.length;
  const hiddenTotal = ALL_BADGES.filter(b => b.hidden).length;
  const hiddenFound = ALL_BADGES.filter(b => b.hidden && unlockedBadges.includes(b.id)).length;
  // Header stats
  const header = document.getElementById('achievements-header');
  if (header) {
    const pct = Math.round(totalUnlocked / totalAll * 100);
    header.innerHTML = `
      <div class="ach-hero">
        <div class="ach-hero-ring">
          <svg viewBox="0 0 120 120" class="ach-ring-svg">
            <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="8"/>
            <circle cx="60" cy="60" r="52" fill="none" stroke="url(#achGrad)" stroke-width="8"
              stroke-dasharray="${Math.round(pct * 3.27)} 327" stroke-linecap="round" transform="rotate(-90 60 60)"/>
            <defs><linearGradient id="achGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#f39c12"/><stop offset="100%" stop-color="#e74c3c"/>
            </linearGradient></defs>
          </svg>
          <div class="ach-ring-text">
            <span class="ach-ring-num">${totalUnlocked}</span>
            <span class="ach-ring-sep">из ${totalAll}</span>
          </div>
        </div>
        <div class="ach-hero-info">
          <div class="ach-hero-title">Коллекция бейджей</div>
          <div class="ach-hero-sub">${pct}% собрано</div>
          <div class="ach-hero-secrets">🔮 Секреты: ${hiddenFound} из ${hiddenTotal} найдено</div>
          <div class="ach-hero-rarity">
            <span class="ach-r-dot common-dot"></span>${ALL_BADGES.filter(b=>b.rarity==='common'&&unlockedBadges.includes(b.id)).length}
            <span class="ach-r-dot rare-dot"></span>${ALL_BADGES.filter(b=>b.rarity==='rare'&&unlockedBadges.includes(b.id)).length}
            <span class="ach-r-dot epic-dot"></span>${ALL_BADGES.filter(b=>b.rarity==='epic'&&unlockedBadges.includes(b.id)).length}
            <span class="ach-r-dot legendary-dot"></span>${ALL_BADGES.filter(b=>b.rarity==='legendary'&&unlockedBadges.includes(b.id)).length}
          </div>
        </div>
      </div>
    `;
  }

  // Filters
  const filterContainer = document.getElementById('achievements-filter');
  filterContainer.innerHTML = Object.entries(BADGE_CATEGORIES).map(([key, label]) => {
    const catBadges = key === 'all' ? ALL_BADGES : ALL_BADGES.filter(b => b.category === key);
    const catUnlocked = catBadges.filter(b => unlockedBadges.includes(b.id)).length;
    const countLabel = key === 'all' ? '' : ` ${catUnlocked}/${catBadges.length}`;
    return `<button class="filter-btn${key===currentBadgeFilter?' active':''}" data-filter="${key}">${label}${countLabel}</button>`;
  }).join('');
  filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => { currentBadgeFilter = btn.dataset.filter; renderAchievements(); });
  });

  // Grid — sort by rarity (common→legendary), hidden at bottom, progress within same group
  const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
  const grid = document.getElementById('achievements-grid');
  let filtered = currentBadgeFilter === 'all' ? [...ALL_BADGES] : ALL_BADGES.filter(b => b.category === currentBadgeFilter);
  filtered.sort((a, bb) => {
    const aU = unlockedBadges.includes(a.id);
    const bU = unlockedBadges.includes(bb.id);
    // 1. Unlocked first, locked second
    if (aU !== bU) return aU ? -1 : 1;
    // 2. Among locked: non-hidden above hidden
    if (!aU && !bU) {
      const aHidden = a.hidden;
      const bHidden = bb.hidden;
      if (aHidden !== bHidden) return aHidden ? 1 : -1;
    }
    // 3. Sort by rarity (common first, legendary last)
    const aR = rarityOrder[a.rarity] || 0;
    const bR = rarityOrder[bb.rarity] || 0;
    if (aR !== bR) return aR - bR;
    // 4. Within same group: by progress desc
    let aP = 0, bP = 0;
    try { aP = a.progress(); } catch {}
    try { bP = bb.progress(); } catch {}
    return bP - aP;
  });

  grid.innerHTML = filtered.map(b => {
    const unlocked = unlockedBadges.includes(b.id);
    const isHidden = b.hidden && !unlocked;
    let prog = 0;
    try { prog = b.progress(); } catch {}
    // Unlocked badges always show 100%
    if (unlocked) prog = 1;
    const pctW = Math.round(prog * 100);

    if (isHidden) {
      return `<div class="badge-card hidden-card" data-badge-id="${b.id}">
        <div class="badge-card-glow hidden-glow-bg"></div>
        <div class="badge-card-icon hidden-icon">❓</div>
        <div class="badge-card-name">???</div>
        <div class="badge-card-hint">${b.name}</div>
        <div class="badge-card-bar"><div class="badge-card-fill hidden-fill" style="width:${pctW}%"></div></div>
      </div>`;
    }

    const rarityLabel = {common:'Обычный',rare:'Редкий',epic:'Эпический',legendary:'Легендарный'}[b.rarity];
    return `<div class="badge-card ${b.rarity}-card${unlocked ? ' unlocked-card' : ' locked-card'}" data-badge-id="${b.id}">
      <div class="badge-card-glow ${b.rarity}-glow-bg"></div>
      ${unlocked ? `<div class="badge-card-check">✓</div>` : ''}
      ${b.hidden && unlocked ? `<div class="badge-card-secret">🔮</div>` : ''}
      <div class="badge-card-icon${unlocked ? '' : ' grayscale-icon'}">${b.icon}</div>
      <div class="badge-card-name">${b.name}</div>
      <div class="badge-card-rarity ${b.rarity}-text">${rarityLabel}</div>
      <div class="badge-card-bar"><div class="badge-card-fill ${b.rarity}-fill" style="width:${pctW}%"></div></div>
      <div class="badge-card-pct">${pctW}%</div>
    </div>`;
  }).join('');

  grid.querySelectorAll('.badge-card').forEach(item => {
    item.addEventListener('click', () => showBadgeDetail(item.dataset.badgeId));
  });
}

function showBadgeDetail(badgeId) {
  const badge = ALL_BADGES.find(b => b.id === badgeId);
  if (!badge) return;

  // Track badge clicks
  if (!tracker.badgeClicks) tracker.badgeClicks = [];
  if (!tracker.badgeClicks.includes(badgeId)) {
    tracker.badgeClicks.push(badgeId);
    saveData('tracker', tracker);
  }

  const unlocked = unlockedBadges.includes(badge.id);
  const isHidden = badge.hidden && !unlocked;
  let prog = 0;
  try { prog = badge.progress(); } catch {}
  if (unlocked) prog = 1;
  const pctW = Math.round(prog * 100);

  const rarityNames = { common: 'Обычный', rare: 'Редкий', epic: 'Эпический', legendary: 'Легендарный' };
  const rarityColors = { common: '#95a5a6', rare: '#3498db', epic: '#9b59b6', legendary: '#f39c12' };

  const displayIcon = isHidden ? '🔮' : badge.icon;
  const displayName = isHidden ? badge.name : badge.name;
  const displayDesc = isHidden ? `<em>"${badge.desc}"</em>` : badge.desc;
  const rarityColor = isHidden ? '#9b59b6' : rarityColors[badge.rarity];
  const rarityName = isHidden ? 'Секретный' : rarityNames[badge.rarity];

  const isSecret = badge.hidden;
  document.getElementById('badge-detail-title').textContent = isHidden ? '🔮 Секретный бейдж' : (isSecret && unlocked ? '🔮 ' + badge.name : badge.name);
  document.getElementById('badge-detail-body').innerHTML = `
    <div class="bd-icon-wrap ${unlocked ? 'bd-unlocked' : ''}" style="--rarity-color:${rarityColor}">
      <div class="bd-icon-bg" style="background:radial-gradient(circle, ${rarityColor}33 0%, transparent 70%)"></div>
      <div class="bd-icon">${displayIcon}</div>
    </div>
    ${isHidden ? `<div class="bd-secret-name">${displayName}</div>` : ''}
    ${isSecret && unlocked ? `<div class="bd-secret-name">🔮 Секретное достижение раскрыто!</div>` : ''}
    ${isSecret && unlocked ? `<div class="bd-condition">📋 Условие: ${badge.desc}</div>` : `<div class="bd-desc">${isHidden ? `<em>"${badge.desc}"</em>` : badge.desc}</div>`}
    <div class="bd-rarity" style="color:${rarityColor}">
      <span class="bd-rarity-dot" style="background:${rarityColor}"></span>
      ${rarityName}
      ${badge.bonus ? ` · +${badge.bonus} очков` : ''}
    </div>
    <div class="bd-progress-wrap">
      <div class="bd-progress-bar">
        <div class="bd-progress-fill" style="width:${pctW}%;background:${rarityColor}"></div>
      </div>
      <div class="bd-progress-text">${pctW}%</div>
    </div>
    <div class="bd-status ${unlocked ? 'bd-status-unlocked' : 'bd-status-locked'}">
      ${unlocked ? '🏆 Получено!' : isHidden ? '🔮 Раскройте секрет...' : '🔒 В процессе'}
    </div>
    ${isHidden && !unlocked ? '<div class="bd-hint-note">Подсказка скрыта в названии бейджа</div>' : ''}
  `;
  openModal('modal-badge-detail');
  checkAchievements();
}

// === STATS MODAL ===
document.getElementById('btn-stats').addEventListener('click', () => {
  const totalCompletions = completions.length;
  const maxStreak = getMaxStreakOverall();
  const rate30 = Math.round(completionRate30() * 100);

  document.getElementById('stats-body').innerHTML = `
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${totalCompletions}</div>
        <div class="stat-label">Всего выполнений</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">🔥 ${maxStreak}</div>
        <div class="stat-label">Макс. стрик</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${rate30}%</div>
        <div class="stat-label">За 30 дней</div>
      </div>
    </div>
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">${getActiveHabits().length}</div>
        <div class="stat-label">Активных привычек</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${unlockedBadges.length}/${ALL_BADGES.length}</div>
        <div class="stat-label">Бейджей</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${notes.length}</div>
        <div class="stat-label">Заметок</div>
      </div>
    </div>
  `;
  openModal('modal-stats');
});

// === DIARY ===
document.getElementById('btn-diary').addEventListener('click', () => {
  const text = generateDiary();
  document.getElementById('diary-text').textContent = text;
  tracker.diaryExports = (tracker.diaryExports || 0) + 1;
  saveData('tracker', tracker);
  openModal('modal-diary');
  checkAchievements();
});

document.getElementById('btn-copy-diary').addEventListener('click', () => {
  const text = document.getElementById('diary-text').textContent;
  navigator.clipboard.writeText(text).then(() => {
    toast('Скопировано в буфер обмена!', 'success');
  }).catch(() => {
    toast('Ошибка копирования', 'error');
  });
});

function generateDiary() {
  // Track diary exports for achievement
  tracker.diaryExports = (tracker.diaryExports || 0) + 1;
  saveData('tracker', tracker);
  checkAchievements();
  const today = todayStr();
  const active = getActiveHabits();
  let lines = [];
  lines.push(`📋 Трекер привычек — ${formatDateFull()}`);
  lines.push('═══════════════════════════════════');

  const grouped = {};
  Object.keys(CATEGORIES).forEach(cat => {
    const hs = active.filter(h => h.category === cat);
    if (hs.length > 0) grouped[cat] = hs;
  });

  let doneCount = 0;
  let totalCount = 0;

  Object.entries(grouped).forEach(([cat, hs]) => {
    lines.push(`${CATEGORIES[cat].icon} ${CATEGORIES[cat].name}`);
    hs.forEach(h => {
      totalCount++;
      const comp = completions.find(c => c.habitId === h.id && c.date === today);
      const streak = getStreak(h.id);
      const streakStr = streak > 0 ? ` 🔥${streak}` : '';
      if (comp) {
        doneCount++;
        const time = formatTime(comp.time);
        lines.push(`  ✅ ${h.icon} ${h.name} (${time})${streakStr}`);
      } else {
        lines.push(`  ⬜ ${h.icon} ${h.name}`);
      }
      // today's notes
      const todayNotes = notes.filter(n => n.habitId === h.id && n.createdAt.startsWith(today));
      todayNotes.forEach(n => {
        lines.push(`     📝 ${n.text}`);
      });
    });
  });

  lines.push('──────────────────────────────────');
  const pct = totalCount > 0 ? Math.round(doneCount / totalCount * 100) : 0;
  lines.push(`Итого: ${doneCount}/${totalCount} (${pct}%)`);
  lines.push(`Уровень: ${getLevel(points)} | Очки: ${points}`);

  return lines.join('\n');
}

// === TOAST ===
function toast(msg, type = 'info') {
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  const icons = { success: '✅', error: '❌', info: 'ℹ️' };
  el.innerHTML = `<span>${icons[type] || ''}</span><span>${msg}</span>`;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// === LEVEL UP ANIMATION ===
function showLevelUp(level) {
  document.getElementById('new-level-num').textContent = level;
  const overlay = document.getElementById('level-up-overlay');
  overlay.classList.add('active');
  showConfetti();
  setTimeout(() => overlay.classList.remove('active'), 3000);
  overlay.addEventListener('click', () => overlay.classList.remove('active'), { once: true });
}

// === ACHIEVEMENT POPUP ===
const achievementQueue = [];
let achievementShowing = false;

function showAchievementPopup(badge) {
  achievementQueue.push(badge);
  if (!achievementShowing) processAchievementQueue();
}

let achievementTimer = null;
function processAchievementQueue() {
  if (achievementQueue.length === 0) { achievementShowing = false; return; }
  achievementShowing = true;
  const badge = achievementQueue.shift();
  const popup = document.getElementById('achievement-popup');
  if (achievementTimer) { clearTimeout(achievementTimer); achievementTimer = null; }

  // Reset
  popup.classList.remove('show');
  void popup.offsetHeight;

  document.getElementById('achievement-popup-icon').textContent = badge.icon;
  document.getElementById('achievement-popup-name').textContent = badge.name;
  document.getElementById('achievement-popup-rarity').className = `achievement-popup-rarity ${badge.rarity}`;

  // Show with small delay for transition
  requestAnimationFrame(() => {
    popup.classList.add('show');

    const dismiss = () => {
      popup.classList.remove('show');
      popup.removeEventListener('click', dismiss);
      achievementTimer = setTimeout(() => {
        processAchievementQueue();
      }, 600);
    };

    popup.addEventListener('click', dismiss);

    // Auto-dismiss after 3.5s
    achievementTimer = setTimeout(dismiss, 3500);
  });

  // Click to dismiss
  popup.onclick = () => {
    if (achievementTimer) clearTimeout(achievementTimer);
    popup.classList.remove('show');
    achievementTimer = setTimeout(() => {
      processAchievementQueue();
    }, 400);
  };
}

// === CONFETTI ===
function showConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#FF6B6B','#4ECDC4','#45B7D1','#FFEAA7','#DDA0DD','#f1c40f','#2ecc71','#e74c3c'];

  for (let i = 0; i < 120; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: Math.random() * 10 + 4,
      h: Math.random() * 6 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 10
    });
  }

  let frame = 0;
  function animate() {
    if (frame > 180) { ctx.clearRect(0, 0, canvas.width, canvas.height); return; }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.05;
      p.rot += p.rotSpeed;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, 1 - frame / 180);
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
    });
    frame++;
    requestAnimationFrame(animate);
  }
  animate();
}

// === CARD COLLECTION SYSTEM ===
function canAffordCard(card) {
  return Object.entries(card.cost).every(([res, amount]) => (resources[res] || 0) >= amount);
}

function buyCard(cardId) {
  const card = ALL_CARDS.find(c => c.id === cardId);
  if (!card || ownedCards.includes(cardId)) return;
  if (!canAffordCard(card)) {
    toast('Недостаточно ресурсов!', 'error');
    return;
  }
  // Spend resources
  Object.entries(card.cost).forEach(([res, amount]) => {
    resources[res] -= amount;
  });
  ownedCards.push(cardId);
  persist();
  showConfetti();
  toast(`Карточка "${card.name}" добавлена в коллекцию!`, 'success');
  renderCardShop();
  updateResourceHUD();
}

function updateResourceHUD() {
  const el = document.getElementById('resource-hud');
  if (!el) return;
  el.innerHTML = Object.entries(RESOURCES).map(([key, r]) => {
    const val = resources[key] || 0;
    return `<div class="res-item" title="${r.name}"><span class="res-icon">${r.icon}</span><span class="res-val">${val}</span></div>`;
  }).join('');
}

function renderCardShop() {
  const grid = document.getElementById('card-shop-grid');
  const collection = document.getElementById('card-collection-grid');
  if (!grid || !collection) return;

  // Stats
  const statsEl = document.getElementById('card-collection-stats');
  if (statsEl) {
    const owned = ownedCards.length;
    const total = ALL_CARDS.length;
    const pct = Math.round(owned / total * 100);
    statsEl.innerHTML = `
      <div class="card-stats-row">
        <span>Собрано: <b>${owned}</b> из <b>${total}</b> (${pct}%)</span>
      </div>
      <div class="card-stats-resources">
        ${Object.entries(RESOURCES).map(([k,r]) =>
          `<span class="card-res-badge" style="--res-color:${r.color}">${r.icon} ${resources[k] || 0}</span>`
        ).join('')}
      </div>
    `;
  }

  // Available cards for shop
  const available = ALL_CARDS.filter(c => !ownedCards.includes(c.id));

  // Shop (available cards)
  grid.innerHTML = available.length === 0
    ? '<div class="cards-empty">Все карточки собраны! 🎉</div>'
    : available.map(c => renderShopCard(c)).join('');

  grid.querySelectorAll('.shop-card-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      buyCard(btn.dataset.cardId);
    });
  });

  grid.querySelectorAll('.shop-card').forEach(el => {
    el.addEventListener('click', () => showCardDetail(el.dataset.cardId));
  });

  // Collection — owned + empty slots for unowned
  const collectionHtml = ALL_CARDS.map(c => {
    if (ownedCards.includes(c.id)) return renderCollectionCard(c);
    return renderEmptySlot(c.rarity);
  }).join('');
  collection.innerHTML = collectionHtml;

  collection.querySelectorAll('.collection-card:not(.empty-slot)').forEach(el => {
    el.addEventListener('click', () => showCardDetail(el.dataset.cardId));
  });
}

function renderShopCard(card) {
  const rarity = CARD_RARITIES[card.rarity];
  const affordable = canAffordCard(card);
  const owned = ownedCards.includes(card.id);
  const costHtml = Object.entries(card.cost).map(([res, amount]) => {
    const r = RESOURCES[res];
    const has = (resources[res] || 0) >= amount;
    return `<span class="cost-tag ${has ? 'cost-ok' : 'cost-no'}">${r.icon}${amount}</span>`;
  }).join('');

  return `<div class="shop-card ${card.rarity}-shop${owned ? ' shop-card-owned' : ''}" data-card-id="${card.id}">
    <div class="shop-card-bg" style="background:${rarity.bg}"></div>
    <div class="shop-card-inner">
      <div class="shop-card-emoji">${card.emoji}</div>
      <div class="shop-card-name">${card.name}</div>
      <div class="shop-card-quote">${card.quote}</div>
      <div class="shop-card-cost">${costHtml}</div>
      ${owned
        ? '<div class="shop-card-owned-tag">В коллекции</div>'
        : `<button class="shop-card-btn ${affordable ? '' : 'btn-disabled'}" data-card-id="${card.id}" ${affordable ? '' : 'disabled'}>
            ${affordable ? 'Купить' : 'Не хватает'}
          </button>`
      }
    </div>
  </div>`;
}

function renderCollectionCard(card) {
  const rarity = CARD_RARITIES[card.rarity];
  return `<div class="collection-card ${card.rarity}-collection" data-card-id="${card.id}" style="--card-glow:${rarity.glow}">
    <div class="collection-card-bg" style="background:${rarity.bg}"></div>
    <div class="collection-card-inner">
      <div class="collection-card-emoji">${card.emoji}</div>
      <div class="collection-card-name">${card.name}</div>
      <div class="collection-card-quote">${card.quote}</div>
    </div>
  </div>`;
}

function renderEmptySlot(rarity) {
  const r = CARD_RARITIES[rarity];
  return `<div class="collection-card empty-slot ${rarity}-empty">
    <div class="empty-slot-inner">
      <div class="empty-slot-icon">?</div>
      <div class="empty-slot-label">${r.name}</div>
    </div>
  </div>`;
}

function showCardDetail(cardId) {
  const card = ALL_CARDS.find(c => c.id === cardId);
  if (!card) return;
  const rarity = CARD_RARITIES[card.rarity];
  const owned = ownedCards.includes(card.id);
  const affordable = canAffordCard(card);

  // Track badge clicks for meta achievement
  tracker.badgeClicks = (tracker.badgeClicks || 0) + 1;
  saveData('tracker', tracker);

  const costHtml = Object.entries(card.cost).map(([res, amount]) => {
    const r = RESOURCES[res];
    const has = (resources[res] || 0) >= amount;
    const cur = resources[res] || 0;
    return `<div class="cd-cost-row">
      <span class="cd-cost-icon">${r.icon}</span>
      <span class="cd-cost-name">${r.name}</span>
      <div class="cd-cost-bar-wrap">
        <div class="cd-cost-bar" style="width:${Math.min(100, (cur/amount)*100)}%;background:${has ? '#2ecc71' : '#e74c3c'}"></div>
      </div>
      <span class="cd-cost-val ${has ? 'cd-ok' : 'cd-no'}">${cur}/${amount}</span>
    </div>`;
  }).join('');

  document.getElementById('card-detail-title').textContent = card.name;
  document.getElementById('card-detail-body').innerHTML = `
    <div class="cd-card-full ${card.rarity}-preview">
      <div class="cd-preview-bg" style="background:${rarity.bg}"></div>
      <div class="cd-preview-emoji">${card.emoji}</div>
      <div class="cd-preview-name">${card.name}</div>
    </div>
    <div class="cd-quote">"${card.quote}"</div>
    <div class="cd-costs">${costHtml}</div>
    ${owned
      ? '<div class="cd-owned">В коллекции</div>'
      : `<button class="cd-buy-btn ${affordable ? '' : 'btn-disabled'}" onclick="buyCard('${card.id}');closeModal('modal-card-detail');" ${affordable ? '' : 'disabled'}>
          ${affordable ? 'Купить' : 'Не хватает ресурсов'}
        </button>`
    }
  `;
  openModal('modal-card-detail');
}

// === ONE-TIME RESET (remove after first load) ===
if (!loadData('_reset_v3', false)) {
  localStorage.clear();
  saveData('_reset_v3', true);
  location.reload();
}

// === INIT ===
populateIcons();
updateHeader();
updateResourceHUD();
renderHabits();
checkAchievements();
