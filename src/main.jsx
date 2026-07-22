import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { CheckCircle2, ChevronLeft, ChevronRight, Clock3, Flag, RotateCcw, ShieldCheck, Trophy } from 'lucide-react';
import { questions } from './questions.js';
import './styles.css';

const STORAGE_KEY = 'icf-acc-exam-state-v1';
const EXAM_SECONDS = 90 * 60;

function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function App() {
  const [mode, setMode] = useState('home');
  const [examQuestions, setExamQuestions] = useState(questions);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flags, setFlags] = useState({});
  const [timeLeft, setTimeLeft] = useState(EXAM_SECONDS);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const state = JSON.parse(saved);
      if (state?.mode === 'exam' && !state.submitted) {
        setExamQuestions(state.examQuestions || questions);
        setIndex(state.index || 0);
        setAnswers(state.answers || {});
        setFlags(state.flags || {});
        setTimeLeft(state.timeLeft ?? EXAM_SECONDS);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (mode !== 'exam' || submitted) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ mode, examQuestions, index, answers, flags, timeLeft, submitted }));
  }, [mode, examQuestions, index, answers, flags, timeLeft, submitted]);

  useEffect(() => {
    if (mode !== 'exam' || submitted) return;
    if (timeLeft <= 0) {
      setSubmitted(true);
      setMode('result');
      return;
    }
    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [mode, submitted, timeLeft]);

  const current = examQuestions[index];
  const answeredCount = Object.keys(answers).length;
  const score = useMemo(() => examQuestions.reduce((sum, q) => sum + (answers[q.id] === q.answer ? 1 : 0), 0), [examQuestions, answers]);

  const categoryStats = useMemo(() => {
    const map = {};
    examQuestions.forEach(q => {
      if (!map[q.section]) map[q.section] = { total: 0, correct: 0 };
      map[q.section].total += 1;
      if (answers[q.id] === q.answer) map[q.section].correct += 1;
    });
    return Object.entries(map);
  }, [examQuestions, answers]);

  function startExam(randomize = false) {
    setExamQuestions(randomize ? shuffle(questions) : questions);
    setIndex(0);
    setAnswers({});
    setFlags({});
    setTimeLeft(EXAM_SECONDS);
    setSubmitted(false);
    setMode('exam');
  }

  function finishExam() {
    if (!window.confirm(`你已作答 ${answeredCount}/60 题。确定提交吗？`)) return;
    setSubmitted(true);
    setMode('result');
    localStorage.removeItem(STORAGE_KEY);
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    setMode('home');
  }

  if (mode === 'home') {
    return (
      <main className="page hero">
        <section className="hero-card">
          <div className="brand"><ShieldCheck size={32} /><span>ICF ACC Exam Simulator</span></div>
          <h1>60 题中文 ACC 模拟考试</h1>
          <p>依据 2025 ICF Core Competencies 与最新 Code of Ethics 设计。以情境判断为主，聚焦边界、合约、保密、核心能力、伦理反思与转介。</p>
          <div className="metrics">
            <div><strong>60</strong><span>单选题</span></div>
            <div><strong>90</strong><span>分钟</span></div>
            <div><strong>6</strong><span>主题模块</span></div>
          </div>
          <div className="actions">
            <button className="primary" onClick={() => startExam(false)}>按原顺序开始</button>
            <button className="secondary" onClick={() => startExam(true)}>随机题序开始</button>
          </div>
          <p className="note">本工具为自主学习模拟题，并非 ICF 官方考试或官方题库。</p>
        </section>
      </main>
    );
  }

  if (mode === 'result') {
    const pct = Math.round((score / examQuestions.length) * 100);
    return (
      <main className="page result-page">
        <section className="result-card">
          <Trophy size={42} />
          <h1>考试结果</h1>
          <div className="score">{score}<span>/ 60</span></div>
          <p className="score-caption">正确率 {pct}%</p>
          <div className="stats-list">
            {categoryStats.map(([name, stat]) => (
              <div className="stat-row" key={name}>
                <span>{name}</span>
                <strong>{stat.correct}/{stat.total}</strong>
              </div>
            ))}
          </div>
          <div className="actions">
            <button className="primary" onClick={() => setMode('review')}>查看答题回顾</button>
            <button className="secondary" onClick={reset}><RotateCcw size={17} />重新开始</button>
          </div>
        </section>
      </main>
    );
  }

  if (mode === 'review') {
    return (
      <main className="review-page">
        <header className="topbar"><strong>答题回顾</strong><button className="secondary small" onClick={reset}>返回首页</button></header>
        <div className="review-list">
          {examQuestions.map((q, i) => (
            <article className="review-item" key={q.id}>
              <div className="review-head"><span>第 {i + 1} 题 · {q.section}</span>{answers[q.id] === q.answer ? <span className="correct">正确</span> : <span className="wrong">错误</span>}</div>
              <h3>{q.question}</h3>
              {q.options.map((opt, oi) => {
                const letter = ['A','B','C','D'][oi];
                const isCorrect = letter === q.answer;
                const chosen = letter === answers[q.id];
                return <div className={`review-option ${isCorrect ? 'answer-key' : ''} ${chosen && !isCorrect ? 'chosen-wrong' : ''}`} key={letter}><strong>{letter}.</strong> {opt}</div>;
              })}
              <p className="answer-line">正确答案：{q.answer}　你的答案：{answers[q.id] || '未作答'}</p>
            </article>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="exam-shell">
      <header className="topbar">
        <div><strong>ICF ACC 模拟考试</strong><span className="sub">第 {index + 1} / 60 题</span></div>
        <div className={`timer ${timeLeft < 600 ? 'urgent' : ''}`}><Clock3 size={18} />{formatTime(timeLeft)}</div>
      </header>

      <div className="progress"><div style={{ width: `${((index + 1) / 60) * 100}%` }} /></div>

      <div className="exam-grid">
        <aside className="navigator">
          <div className="nav-summary"><span>已答 {answeredCount}</span><span>标记 {Object.values(flags).filter(Boolean).length}</span></div>
          <div className="number-grid">
            {examQuestions.map((q, i) => (
              <button key={q.id} className={`${i === index ? 'active' : ''} ${answers[q.id] ? 'answered' : ''} ${flags[q.id] ? 'flagged' : ''}`} onClick={() => setIndex(i)}>{i + 1}</button>
            ))}
          </div>
          <button className="submit" onClick={finishExam}>提交试卷</button>
        </aside>

        <section className="question-card">
          <div className="question-meta"><span>{current.section}</span><button className={`flag-btn ${flags[current.id] ? 'on' : ''}`} onClick={() => setFlags(f => ({...f, [current.id]: !f[current.id]}))}><Flag size={17} />{flags[current.id] ? '已标记' : '标记'}</button></div>
          <h2>{index + 1}. {current.question}</h2>
          <div className="options">
            {current.options.map((opt, oi) => {
              const letter = ['A','B','C','D'][oi];
              return (
                <label className={`option ${answers[current.id] === letter ? 'selected' : ''}`} key={letter}>
                  <input type="radio" name={`q-${current.id}`} checked={answers[current.id] === letter} onChange={() => setAnswers(a => ({...a, [current.id]: letter}))} />
                  <span className="letter">{letter}</span><span>{opt}</span>
                </label>
              );
            })}
          </div>
          <div className="question-actions">
            <button className="secondary" disabled={index === 0} onClick={() => setIndex(i => i - 1)}><ChevronLeft size={18} />上一题</button>
            {index < 59 ? <button className="primary" onClick={() => setIndex(i => i + 1)}>下一题<ChevronRight size={18} /></button> : <button className="primary" onClick={finishExam}><CheckCircle2 size={18} />提交试卷</button>}
          </div>
        </section>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
