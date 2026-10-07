# 我的镜头素材

把自己的视频或画面上传到这个目录，网页会自动识别并显示。支持 MP4 / WebM / MOV / M4V / PNG / JPG / WebP / GIF。建议视频使用 H.264 编码的 MP4，文件名可直接使用中文。

点击网页右上角「添加镜头」，进入 GitHub 上传页，拖入文件并点击 **Commit changes**。回到镜头库点击「同步」，等待 GitHub Pages 更新后即可播放。

这是公开仓库，上传后内容可以公开访问。GitHub 浏览器上传每个文件最多 25 MiB；这个镜头库适合短片段和画面。[文件上传说明](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)。GitHub Pages 发布站点最大为 1 GB，长期存放大量原片可改用专门的视频存储。[站点容量说明](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)。

## 分类与标题

文件放在 `shots/分类名/镜头.mp4` 时，网页会以「分类名」作为分类。直接放在 `shots/` 下的文件归入「未分类」。

如需自定义标题、标签、封面和说明，可在根目录 `library-config.js` 的 `metadata` 中按仓库文件路径配置。已有样例可作参考。未配置的文件也会自动入库。

`人物竖卡转场-示意.mp4` 是用原创插画和动效代码制作的示意视频，作为第一条样例。原始录屏和真实人物画面没有上传。
