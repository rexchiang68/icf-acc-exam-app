import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Flag,
  Layers3,
  RotateCcw,
  ShieldCheck,
  Trophy,
} from 'lucide-react';
import { QUESTION_BANKS, getBank } from './questionBanks.js';
import './styles.css';

const STORAGE_KEY = 'icf-acc-exam-state-v3';
const EXAM_SECONDS = 90 * 60;
const EXAM_LENGTH = 60;

function shuffle(items) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function createMixedExam() {
  const perBank = Math.floor(EXAM_LENGTH / QUESTION_BANKS.length);
  const remainder = EXAM_LENGTH % QUESTION_BANKS.length;
  const selected = QUESTION_BANKS.flatMap((bank, index) => {
    const count = perBank + (index < remainder ? 1 : 0);
    return shuffle(bank.questions).slice(0, count);
  });
  return shuffle(selected);
}

function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, '0');
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
}

function App() {
  const [mode, setMode] = useState('home');
  const [selectedBank, setSelectedBank] = useState('bank1');
  const [randomizeOrder, setRandomizeOrder] = useState(false);
  const [examTitle, setExamTitle] = useState('ACC 模拟卷一');
  const [examQuestions, setExamQuestions] = useState([]);
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
      if (state?.mode === 'exam' && !state.submitted && Array.isArray(state.examQuestions)) {
        setExamQuestions(state.examQuestions);
        setExamTitle(state.examTitle || 'ACC 模拟考试');
        setIndex(state.index || 0);
        setAnswers(state.answers || {});
        setFlags(state.flags || {});
        setTimeLeft(state.timeLeft ?? EXAM_SECONDS);
        setMode('exam');
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    if (mode !== 'exam' || submitted) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ mode, examTitle, examQuestions, index, answers, flags, timeLeft, submitted }),
    );
  }, [mode, examTitle, examQuestions, index, answers, flags, timeLeft, submitted]);

  useEffect(() => {
    if (mode !== 'exam' || submitted) return undefined;
    if (timeLeft <= 0) {
      setSubmitted(true);
      setMode('result');
      localStorage.removeItem(STORAGE_KEY);
      return undefined;
    }
    const timer = setInterval(() => setTimeLeft((current) => current - 1), 1000);
    return () => clearInterval(timer);
  }, [mode, submitted, timeLeft]);

  const current = examQuestions[index];
  const answeredCount = Object.keys(answers).length;
  const flaggedCount = Object.values(flags).filter(Boolean).length;
  const score = useMemo(
    () => examQuestions.reduce((sum, question) => sum + (answers[question.id] === question.answer ? 1 : 0), 0),
    [examQuestions, answers],
  );

  const categoryStats = useMemo(() => {
    const stats = {};
    examQuestions.forEach((question) => {
      if (!stats[question.section]) stats[question.section] = { total: 0, correct: 0 };
      stats[question.section].total += 1;
      if (answers[question.id] === question.answer) stats[question.section].correct += 1;
    });
    return Object.entries(stats);
  }, [examQuestions, answers]);

  const bankStats = useMemo(() => {
    const stats = {};
    examQuestions.forEach((question) => {
      if (!stats[question.bankLabel]) stats[question.bankLabel] = { total: 0, correct: 0 };
      stats[question.bankLabel].total += 1;
      if (answers[question.id] === question.answer) stats[question.bankLabel].correct += 1;
    });
    return Object.entries(stats);
  }, [examQuestions, answers]);

  function startExam() {
    let questions;
    let title;
    if (selectedBank === 'mixed') {
      questions = createMixedExam();
      title = 'ACC 混合随机卷';
    } else {
      const bank = getBank(selectedBank);
      questions = randomizeOrder ? shuffle(bank.questions) : [...bank.questions];
      title = bank.label;
    }

    setExamQuestions(questions);
    setExamTitle(title);
    setIndex(0);
    setAnswers({});
    setFlags({});
    setTimeLeft(EXAM_SECONDS);
    setSubmitted(false);
    setMode('exam');
  }

  function finishExam() {
    if (!window.confirm(`你已作答 ${answeredCount}/${examQuestions.length} 题。确定提交吗？`)) return;
    setSubmitted(true);
    setMode('result');
    localStorage.removeItem(STORAGE_KEY);
  }

  function reset() {
    localStorage.removeItem(STORAGE_KEY);
    setMode('home');
    setExamQuestions([]);
  }

  if (mode === 'home') {
    return (
      <main className="page hero">
        <section className="hero-card">
          <div className="brand"><ShieldCheck size={32} /><span>ICF ACC Exam Simulator</span></div>
          <h1>选择一组 ACC 模拟考试</h1>
          <p>目前仅使用三组达到 ACC 情境判断难度的题库。原始的 questions.js 已从程序入口完全移除，不会被载入或抽题。</p>

          <div className="metrics">
            <div><strong>3</strong><span>高难度题库</span></div>
            <div><strong>60</strong><span>每次题数</span></div>
            <div><strong>90</strong><span>考试分钟</span></div>
          </div>

          <fieldset className="bank-picker">
            <legend>考试模式</legend>
            {QUESTION_BANKS.map((bank) => (
              <label className={`bank-option ${selectedBank === bank.id ? 'selected' : ''}`} key={bank.id}>
                <input
                  type="radio"
                  name="bank"
                  value={bank.id}
                  checked={selectedBank === bank.id}
                  onChange={() => setSelectedBank(bank.id)}
                />
                <span><strong>{bank.label}</strong><small>{bank.description}</small></span>
              </label>
            ))}
            <label className={`bank-option mixed ${selectedBank === 'mixed' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="bank"
                value="mixed"
                checked={selectedBank === 'mixed'}
                onChange={() => setSelectedBank('mixed')}
              />
              <Layers3 size={21} />
              <span><strong>混合随机卷</strong><small>从三组题库各随机抽取 20 题，再打乱组成全新的 60 题模拟卷。</small></span>
            </label>
          </fieldset>

          {selectedBank !== 'mixed' && (
            <label className="shuffle-option">
              <input
                type="checkbox"
                checked={randomizeOrder}
                onChange={(event) => setRandomizeOrder(event.target.checked)}
              />
              打乱本卷题目顺序
            </label>
          )}

          <div className="actions">
            <button className="primary" onClick={startExam}>开始 90 分钟模拟考试</button>
          </div>
          <p className="note">本工具为自主学习模拟题，并非 ICF 官方考试或官方题库。</p>
        </section>
      </main>
    );
  }

  if (mode === 'result') {
    const percentage = Math.round((score / examQuestions.length) * 100);
    return (
      <main className="page result-page">
        <section className="result-card">
          <Trophy size={42} />
          <h1>考试结果</h1>
          <p className="exam-result-title">{examTitle}</p>
          <div className="score">{score}<span>/ {examQuestions.length}</span></div>
          <p className="score-caption">正确率 {percentage}%</p>

          {selectedBank === 'mixed' || bankStats.length > 1 ? (
            <div className="stats-block">
              <h2>各题库表现</h2>
              <div className="stats-list">
                {bankStats.map(([name, stat]) => (
                  <div className="stat-row" key={name}><span>{name}</span><strong>{stat.correct}/{stat.total}</strong></div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="stats-block">
            <h2>各主题表现</h2>
            <div className="stats-list">
              {categoryStats.map(([name, stat]) => (
                <div className="stat-row" key={name}><span>{name}</span><strong>{stat.correct}/{stat.total}</strong></div>
              ))}
            </div>
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
        <header className="topbar"><strong>{examTitle} · 答题回顾</strong><button className="secondary small" onClick={reset}>返回首页</button></header>
        <div className="review-list">
          {examQuestions.map((question, questionIndex) => (
            <article className="review-item" key={question.id}>
              <div className="review-head">
                <span>第 {questionIndex + 1} 题 · {question.section} · {question.bankLabel}</span>
                {answers[question.id] === question.answer ? <span className="correct">正确</span> : <span className="wrong">错误</span>}
              </div>
              <h3>{question.question}</h3>
              {question.options.map((option, optionIndex) => {
                const letter = ['A', 'B', 'C', 'D'][optionIndex];
                const isCorrect = letter === question.answer;
                const chosen = letter === answers[question.id];
                return (
                  <div className={`review-option ${isCorrect ? 'answer-key' : ''} ${chosen && !isCorrect ? 'chosen-wrong' : ''}`} key={letter}>
                    <strong>{letter}.</strong> {option}
                  </div>
                );
              })}
              <p className="answer-line">正确答案：{question.answer}　你的答案：{answers[question.id] || '未作答'}</p>
            </article>
          ))}
        </div>
      </main>
    );
  }

  if (!current) return null;

  return (
    <main className="exam-shell">
      <header className="topbar">
        <div><strong>{examTitle}</strong><span className="sub">第 {index + 1} / {examQuestions.length} 题</span></div>
        <div className={`timer ${timeLeft < 600 ? 'urgent' : ''}`}><Clock3 size={18} />{formatTime(timeLeft)}</div>
      </header>

      <div className="progress"><div style={{ width: `${((index + 1) / examQuestions.length) * 100}%` }} /></div>

      <div className="exam-grid">
        <aside className="navigator">
          <div className="nav-summary"><span>已答 {answeredCount}</span><span>标记 {flaggedCount}</span></div>
          <div className="number-grid">
            {examQuestions.map((question, questionIndex) => (
              <button
                type="button"
                key={question.id}
                className={`${questionIndex === index ? 'active' : ''} ${answers[question.id] ? 'answered' : ''} ${flags[question.id] ? 'flagged' : ''}`}
                onClick={() => setIndex(questionIndex)}
              >
                {questionIndex + 1}
              </button>
            ))}
          </div>
          <button className="submit" onClick={finishExam}>提交试卷</button>
        </aside>

        <section className="question-card">
          <div className="question-meta">
            <span>{current.section} · {current.bankLabel}</span>
            <button className={`flag-btn ${flags[current.id] ? 'on' : ''}`} onClick={() => setFlags((currentFlags) => ({ ...currentFlags, [current.id]: !currentFlags[current.id] }))}>
              <Flag size={17} />{flags[current.id] ? '已标记' : '标记'}
            </button>
          </div>
          <h2>{index + 1}. {current.question}</h2>
          <div className="options">
            {current.options.map((option, optionIndex) => {
              const letter = ['A', 'B', 'C', 'D'][optionIndex];
              return (
                <label className={`option ${answers[current.id] === letter ? 'selected' : ''}`} key={letter}>
                  <input
                    type="radio"
                    name={`q-${current.id}`}
                    checked={answers[current.id] === letter}
                    onChange={() => setAnswers((currentAnswers) => ({ ...currentAnswers, [current.id]: letter }))}
                  />
                  <span className="letter">{letter}</span><span>{option}</span>
                </label>
              );
            })}
          </div>
          <div className="question-actions">
            <button className="secondary" disabled={index === 0} onClick={() => setIndex((currentIndex) => currentIndex - 1)}><ChevronLeft size={18} />上一题</button>
            {index < examQuestions.length - 1 ? (
              <button className="primary" onClick={() => setIndex((currentIndex) => currentIndex + 1)}>下一题<ChevronRight size={18} /></button>
            ) : (
              <button className="primary" onClick={finishExam}><CheckCircle2 size={18} />提交试卷</button>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
