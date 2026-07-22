# ICF ACC Exam Simulator

一个可直接部署到 Vercel 的中文 ICF ACC 模拟考试 App。

## 功能

- 60 题单选题，90 分钟倒计时
- 原顺序或随机题序
- 自动保存未完成进度（浏览器 localStorage）
- 题号导航、标记题目、交卷确认
- 总分与六大模块统计
- 交卷后查看正确答案与个人作答
- 手机、平板、电脑自适应

> 本项目为自主学习模拟工具，不是 ICF 官方考试或官方题库。

## 本地运行

需要安装 Node.js 20 或更新版本。

```bash
npm install
npm run dev
```

浏览器打开终端显示的本地网址，通常是 `http://localhost:5173`。

## 建置测试

```bash
npm run build
npm run preview
```

## 上传 GitHub

### 方法一：GitHub 网页上传（最容易）

1. 登录 GitHub，建立一个新的 repository，例如 `icf-acc-exam-app`。
2. 不要勾选自动建立 README、.gitignore 或 License。
3. 解压下载的项目压缩包。
4. 在新 repository 页面选择 **uploading an existing file**。
5. 把项目文件全部拖入；不要上传外层资料夹本身。
6. 填写 commit 说明，例如 `Initial ICF ACC exam app`，然后提交。

### 方法二：命令行

在项目目录执行：

```bash
git init
git add .
git commit -m "Initial ICF ACC exam app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/icf-acc-exam-app.git
git push -u origin main
```

把 `YOUR_USERNAME` 改成你的 GitHub 用户名。

## 部署 Vercel

1. 登录 Vercel。
2. 选择 **Add New → Project**。
3. 在 GitHub repository 清单中找到 `icf-acc-exam-app`，点击 **Import**。
4. Framework Preset 通常会自动识别为 **Vite**。
5. 保持以下默认值：
   - Build Command：`npm run build`
   - Output Directory：`dist`
   - Install Command：`npm install`
6. 点击 **Deploy**。
7. 部署完成后，Vercel 会提供公开网址。

以后每次把修改 push 到 GitHub 的 `main` 分支，Vercel 会自动重新部署。

## 修改题目

题库位于：

```text
src/questions.js
```

每题格式：

```js
{
  id: 1,
  section: '主题',
  question: '题干',
  options: ['选项A', '选项B', '选项C', '选项D'],
  answer: 'B'
}
```
