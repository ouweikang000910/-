# Motion Effect Library · 视频动效库

把参考视频中的动效拆成可回放、可慢放、可拖动时间轴的代码示例。当前条目是 **人物竖卡转场**，包含 6 项动效及分层开关。

## 在线镜头展示

**[打开视频动效库](https://ouweikang000910.github.io/-/)** · 无需下载或登录，手机与电脑均可直接观看。

网页包含完整镜头播放、四张关键分镜、六项动效拆解、慢放时间轴和图层开关。点击「分享镜头」可复制保留当前时刻、选中动效、速度及图层状态的链接。

网页通过 GitHub Pages 从 `main` 分支根目录发布，更新 `index.html` 后推送到该分支即可自动更新。`.nojekyll` 保留原始静态文件。示意分镜位于 `assets/shots/`，动效变化后也需重新截取。

## 直接预览

下载仓库后，双击根目录 `index.html`。页面及示意素材全部保存在仓库内，离线打开无需安装依赖。

页面支持播放与重播、0.25× / 0.5× / 1× / 1.5× 调速、时间轴定位、分段播放、分层开关及 GSAP 运动代码复制。

也可以用已安装的 Node.js 启动本地预览：

```bash
npm run dev
```

浏览器打开终端打印的 `http://127.0.0.1:4173`。服务仅监听本机，按 Ctrl+C 停止；设置 `PORT` 可更换端口。

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
index.html                       在线镜头展示、交互预览与分享
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

修改运动时注意：交互预览和渲染合成中的时间轴目前各保存一份，应同步修改两者；说明和代码片段保存在 `effect-data.json` 与交互页中。真实人物复用需替换为抠像后的前景素材，原背景与科技卡片保持独立。

已验证离线预览、时间定位、0.25 倍慢放、分层开关、初始/转场/最终状态，以及合成的静态、运行时、布局、动效和文字对比度检查。

第三方组件说明见 [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md)。
