# V5 题库与程序检查

## 内容架构
- 新增 questions4.js、questions5.js、questions6.js，每组 60 题。
- App 现在载入六组题库，共 360 题。
- 混合随机卷从六组题库各抽取 10 题，组成 60 题。
- 原始 questions.js 仍未进入程序入口。

## 三组新增题库的差异
- 模拟卷四：以对话片段、最佳下一步、教练遗漏、角色切换、关系修复和成长整合为主。
- 模拟卷五：以组织赞助、第三方敏感信息、利益冲突、伦理处理顺序、最不恰当行为和教练督导为主。
- 模拟卷六：以心理风险递进、核心能力行为辨识、教练假设与偏见、细微回应选择为主。

## 技术检查
- questions4.js、questions5.js、questions6.js 均通过 Node JavaScript 语法检查。
- questionBanks.js 通过 Node JavaScript 语法检查。
- 每组题库 60 题，答案位置平均分布为 A/B/C/D 各 15 题。
- 因当前执行环境无法在时限内完成 npm install，未在本环境完成 Vite production build；Vercel 会依 package.json 安装并构建。
