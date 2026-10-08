# 森林照片环绕 / Forest Photo Orbit

参考用户提供的「录屏2026-10-08 12.16.51.mov」制作的可复用动效。9 秒，1280 × 720，30 fps，无音轨。

## 打开与使用

双击 `viewer.html` 打开交互预览，支持播放、循环、慢放、拖动时间轴、分层开关和替换照片。无需安装依赖或登录。替换照片仅保留在当前预览中，刷新后恢复默认；下载的 MP4 使用默认照片。

点击「下载复刻视频」获取成片。根目录 `index.html` 是可编辑的 HyperFrames 合成，`assets/orbit.js` 与交互预览共用同一套运动代码。

## 动效关系

- 12 张带白边的照片围绕人物沿椭圆轨道旋转；以深度透视产生近大远小。
- 人物是深度为 0 的前景平面。照片在正深度经过胸前，在负深度被人物遮挡。
- 每张照片独立转向，配合小幅上下浮动，形成空间穿插。
- 5.6 秒起，「the-meta colorize」标签在头部上方进入。

参考录屏总长约 12.58 秒，开头约 3 秒为停帧；本作品以之后的有效运动段为参考，独立重建 9 秒动效，不含录屏软件界面和中文字幕。

## 素材说明

背景与人物由 imagegen 参考录屏关键帧重建；人物使用透明静态前景层，未复刻原片的口型和手势变化。照片素材是生成的 4 × 3 森林摄影图集。这是动效关系的复刻，素材细节与原片可能不同。

所有运行素材均为本地文件，预览和渲染不依赖在线 CDN。照片替换通过浏览器本地文件对象完成，网页不会自动上传用户选择的照片。

## 编辑与渲染

```sh
npm run studio
npm run check
npm run render
```

项目固定使用 HyperFrames 0.8.139。渲染需要 Node.js、Chromium 浏览器和 FFmpeg。使用 CLI 返回的完整 Studio 预览网址（包含 `#project/项目目录名`）；关闭预览可运行 `npx hyperframes@0.8.139 preview --stop`。

参数与源代码：`shot-plan.json`、`assets/orbit.js`、`assets/orbit.css`。将自己的照片放到 `assets/`，在 `index.html` 的 `orbit` 初始化后调用 `orbit.replacePhotos(['assets/your-photo.jpg', 'assets/other.jpg']);`，即可渲染新的成片。不足 12 张时会循环填充。资产来源与生成记录见 `assets/index.md`。
