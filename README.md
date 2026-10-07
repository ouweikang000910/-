# Motion Effect Library · 视频动效库

一个保存在 GitHub 仓库中的个人镜头库：收藏视频片段、画面和动效，支持搜索、分类、在线播放与分享。已放入 **人物竖卡转场** 示例，并保留 6 项动效的详细拆解。

## 在线个人镜头库

**[打开我的镜头库](https://ouweikang000910.github.io/-/)** · 手机与电脑均可直接观看。

首页用于持续收藏自己的镜头，支持视频 / 画面分类、关键词搜索、缩略图预览、慢放、下载与镜头分享。首条示例是人物竖卡转场的插画视频，原动效拆解保存在 [effect.html](https://ouweikang000910.github.io/-/effect.html)。

### 添加自己的镜头

1. 点击首页右上角「添加镜头」，进入 GitHub 上传页。
2. 使用有仓库写入权限的账号登录，拖入视频或图片，点击 **Commit changes**。
3. 返回镜头库点击「同步」，新素材会自动出现在列表中；网页更新可能需要等待片刻。

素材实际保存在仓库 `shots/` 目录中，不依赖浏览器保存文件。访客无需登录即可观看；上传内容在这个公开仓库中可被公开访问。浏览器只缓存素材目录以应对暂时无法同步的情况，不缓存视频文件。

支持 MP4 / WebM / MOV / M4V / PNG / JPG / WebP / GIF，视频推荐 H.264 编码的 MP4。网页上传每个文件最多 25 MiB，GitHub Pages 发布站点最大为 1 GB，适合短片段收藏。[上传限制](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)、[站点限制](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)。

网页直接读取公开仓库中的 `shots/` 文件目录，保存素材后会自动发现新条目，无需逐条登记。把素材存入 `shots/分类名/文件.mp4` 即可按文件夹分类；自定义标题、标签和封面可参考 `library-config.js`。读取失败时显示上次保存的目录，并提供重新同步入口。

GitHub Pages 从 `main` 分支根目录发布，更新代码或素材并推送后即可自动更新。`.nojekyll` 保留原始静态文件。旧版带时间轴的分享链接会自动跳转到动效拆解页。

## 本地预览

```bash
npm run dev
```

浏览器打开 `http://127.0.0.1:4173`，本地服务会读取 `shots/` 目录。服务仅监听本机，按 Ctrl+C 停止；设置 `PORT` 可更换端口。动效拆解 `effect.html` 仍支持直接双击离线打开。

## 可复用动效

| 动效 | 参考录屏中的近似时间 | 核心机制 |
| --- | --- | --- |
| 科技竖卡从下方升起 | 2.65–3.16 s | 圆角遮罩、Y 位移、透明度 |
| 人物缩小入卡 | 3.12–3.55 s | 独立前景、缩放、Y 位移 |
| 背景淡出与辉光 | 3.18–3.75 s | 原背景透明度、背后柔光 |
| 顶部标签放大出现 | 3.43–3.68 s | 整组缩放与透明度 |
| 关键词纵向展开 | 5.88–6.04 s | scaleY 与透明度 |
| 科技纹理与环境粒子 | 3.25–7.77 s | 固定种子布局、小幅漂移 |

插画人物与科技网格用于说明运动机制。时间来自录屏视觉分析，误差约 ±0.05 秒；参数和缓动曲线是示意复现建议，无法视为原作者工程的精确参数。原始录屏与真实人物关键帧保留在本地。

## 编辑与导出

`render-project/index.html` 是独立的 HyperFrames 合成：1280 × 720，时长约 7.78 秒，单个可寻址的暂停 GSAP 时间轴，键名为 `portrait-effect`。

```bash
npm run check   # 检查合成
npm run studio  # 打开 HyperFrames 时间轴编辑器
npm run render  # 导出到 renders/portrait-card.mp4，30 fps，无声
```

这三个命令使用固定的 HyperFrames 0.8.139。首次调用需要联网下载 CLI。检查和导出需要可用的 Chrome / Chromium；导出另需 FFmpeg 和 FFprobe。可使用 HyperFrames 支持的 `HYPERFRAMES_BROWSER_PATH`、`HYPERFRAMES_FFMPEG_PATH`、`HYPERFRAMES_FFPROBE_PATH` 指定本机程序。

## 代码结构

```text
index.html                       个人镜头库首页
library.js / library.css         分类、搜索、目录同步、预览与分享
library-config.js                仓库配置及镜头标题、标签、封面
shots/                           实际存放自己的视频和画面
effect.html                      单镜头动效拆解、时间轴与分层控制
assets/shots/                    四张插画分镜
assets/favicon.svg               网页图标
.nojekyll                        GitHub Pages 静态发布配置
effect-data.json                 六项动效说明、时间、建议参数及代码片段
render-project/index.html        可编辑、可渲染的合成主体
render-project/index.motion.json 动效出现时刻断言
render-project/assets/           本地 GSAP、人物与科技网格 SVG
docs/analysis.txt                完整拆解说明和剪映 / AE 实现参考
scripts/serve.mjs                无第三方依赖的本机静态预览服务
```

修改运动时注意：effect.html 和渲染合成中的时间轴目前各保存一份，应同步修改两者；说明和代码片段保存在 `effect-data.json` 与交互页中。真实人物复用需替换为抠像后的前景素材，原背景与科技卡片保持独立。

已验证离线预览、时间定位、0.25 倍慢放、分层开关、初始/转场/最终状态，以及合成的静态、运行时、布局、动效和文字对比度检查。

第三方组件说明见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
