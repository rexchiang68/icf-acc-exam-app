# ICF ACC Exam Simulator V3

这是一个以 React + Vite 制作的纯前端 ICF ACC 中文模拟考试 App。

## 本版题库规则

- 只载入 `questions1.js`、`questions2.js`、`questions3.js`
- 原始的 `questions.js` 不会被 `main.jsx` 或 `questionBanks.js` 引用
- 可选择三份固定 60 题模拟卷
- 可选择「混合随机卷」：从三组题库各随机抽取 20 题，共 60 题
- 混合卷会为题目加入题库前缀，避免三组题目的重复编号互相覆盖

## 本地启动

```bash
npm install
npm run dev
```

## 生产构建

```bash
npm run build
```

## GitHub / Vercel

将整个项目上传至 GitHub，再于 Vercel 导入该 Repository。Vercel 通常会自动识别 Vite：

- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

不需要环境变量或数据库。
