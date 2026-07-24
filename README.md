# ICF ACC Exam Simulator V5

六组中文 ACC 进阶模拟题库，每组 60 题，共 360 题。

## 题库
- questions1.js 至 questions3.js：既有进阶题库
- questions4.js：对话决策、遗漏辨识、角色切换与成长整合
- questions5.js：组织赞助、第三方信息、利益冲突、伦理顺序与教练督导
- questions6.js：心理风险递进、核心能力行为辨识、偏见假设与细微回应

原始且较简单的 `questions.js` 不会被载入。

## 本地运行
```bash
npm install
npm run dev
```

## Vercel
将本项目推送至 GitHub 后，在 Vercel 导入该 repository。Framework Preset 选 Vite，Build Command 为 `npm run build`，Output Directory 为 `dist`。
