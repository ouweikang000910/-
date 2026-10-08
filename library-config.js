window.SHOT_LIBRARY = {
  owner: 'ouweikang000910',
  repository: '-',
  branch: 'main',
  folder: 'shots',
  title: '我的镜头库',
  featured: 'shots/森林照片环绕-复刻.mp4',
  metadata: {
    'shots/森林照片环绕-复刻.mp4': {
      title: '森林照片环绕',
      category: '动效',
      tags: ['森林', '3D 环绕', '照片', '前后遮挡'],
      description: '9 秒复刻：12 张白边照片围绕人物旋转，包含透视、前后遮挡、轻微浮动与标签进入。',
      cover: 'assets/shots/forest-orbit.png',
      duration: 9,
      size: 11393305,
      effect: 'effects/forest-orbit/viewer.html',
      sample: true
    },
    'shots/人物竖卡转场-示意.mp4': {
      title: '人物竖卡转场',
      category: '动效',
      tags: ['人物', '科技竖卡', '关键词'],
      description: '7.78 秒的插画示意：竖卡升起、人物入卡、背景淡出、标签出现与关键词展开。',
      cover: 'assets/shots/04-emphasis.png',
      duration: 7.78,
      size: 1762980,
      effect: 'effect.html',
      sample: true
    }
  },
  fallback: [{path: 'shots/森林照片环绕-复刻.mp4', type: 'blob', size: 11393305}, {path: 'shots/人物竖卡转场-示意.mp4', type: 'blob', size: 1762980}]
};
