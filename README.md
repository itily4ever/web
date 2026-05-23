# Daily Schedule & Exam Planner

一个移动端优先的个人日程、学习任务、考试与招聘节点规划工具。第一版是纯前端应用，无后端、无云数据库，使用浏览器 `localStorage` 保存数据，并支持 JSON 导入导出备份。

## 功能

- 今日任务：查看当天学习任务、考试/招聘节点、重要紧急任务、已完成任务。
- 总日程：按日期分组查看任务，支持关键词、类型、优先级、状态筛选。
- 任务管理：新增、编辑、删除、完成任务。
- 考试/招聘详情：类型为考试节点或招聘事项时，可填写名称、科目、地点、分数、备注。
- 本地备份：导出 JSON、导入 JSON、双重确认清空数据。
- 手机底部导航：今日、日程、设置。
- PWA 支持：可在手机浏览器中添加到主屏幕，并缓存基础页面资源。

## 技术栈

- Vue 3
- Vite
- Vue Router
- localStorage

## 本地运行

安装依赖：

```bash
npm install
```

启动开发环境：

```bash
npm run dev
```

构建生产版本：

```bash
npm run build
```

本地预览构建结果：

```bash
npm run preview
```

## 手机添加到主屏幕

部署到 HTTPS 地址后，使用手机浏览器打开网站：

```txt
https://daily-schedule-exam-planner.vercel.app/today
```

然后在浏览器菜单中选择“添加到主屏幕”。添加后可以像普通 App 一样从桌面打开。首次打开需要联网加载资源，之后基础页面资源会被缓存；任务数据仍保存在当前手机浏览器的 `localStorage` 中，建议继续定期导出 JSON 备份。

## 数据说明

任务数据保存在浏览器 `localStorage` 中，key 为：

```txt
daily_schedule_tasks
```

注意：清理浏览器缓存、换设备、换浏览器、使用无痕模式，都可能导致本地数据丢失。建议定期在“设置”页导出 JSON 备份。

## 部署到 Vercel

1. 把本项目推送到 GitHub 仓库。
2. 打开 [Vercel](https://vercel.com/) 并登录。
3. 点击 `Add New Project`。
4. 选择你的 GitHub 仓库。
5. Vercel 会自动识别为 Vite 项目。
6. 保持默认配置即可：
   - Build Command: `npm run build`
   - Output Directory: `dist`
7. 点击 Deploy。
8. 部署完成后，先使用默认域名访问，例如 `daily-schedule.vercel.app`。

## 连接 GitHub 仓库到 Vercel

1. 在 GitHub 创建一个新仓库。
2. 将本项目代码 push 到该仓库。
3. 在 Vercel 新建项目时选择该仓库。
4. 以后每次 push 到 GitHub，Vercel 会自动重新部署。

## 以后绑定自定义域名

购买阿里云或腾讯云域名后，可以把域名绑定到 Vercel。基本流程：

1. 打开 Vercel 项目控制台。
2. 进入 `Settings`。
3. 进入 `Domains`。
4. 添加你的自定义域名。
5. Vercel 会显示需要配置的 DNS 记录。
6. 打开阿里云或腾讯云的域名 DNS 管理页面。
7. 按 Vercel 要求添加 DNS 记录。
8. 等待 DNS 生效。

购买域名不等于必须购买云服务器。这个项目的第一版是纯前端网站，Vercel 可以直接托管，不需要单独买服务器。

如果以后需要登录、多设备同步、云端备份，再考虑增加后端服务或数据库。

## 推荐目录结构

```txt
src/
├── App.vue
├── main.js
├── router/
│   └── index.js
├── stores/
│   └── taskStore.js
├── views/
│   ├── TodayView.vue
│   ├── ScheduleView.vue
│   └── SettingsView.vue
├── components/
│   ├── BottomNav.vue
│   ├── TaskCard.vue
│   ├── TaskForm.vue
│   ├── TaskList.vue
│   ├── DateTaskGroup.vue
│   ├── PriorityTag.vue
│   └── EmptyState.vue
└── utils/
    ├── date.js
    └── storage.js
```
