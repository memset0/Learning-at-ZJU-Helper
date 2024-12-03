# Learning-at-ZJU-Helper

学在浙大/智云课堂的辅助脚本，请配合 Tampermonkey 等脚本加载器使用。[**`通过 Greasy Fork 安装`**](https://greasyfork.org/zh-CN/scripts/488869-%E5%AD%A6%E5%9C%A8%E6%B5%99%E5%A4%A7-%E6%99%BA%E4%BA%91%E8%AF%BE%E5%A0%82-%E8%BE%85%E5%8A%A9%E8%84%9A%E6%9C%AC)。

目前正在开发中，欢迎关注...

- 良好封装的代码，您可以在 `./src/plugins/` 中编写并贡献你的插件，并获得通过上下文提供的已有工具链。参见 [示例插件](https://github.com/memset0/Learning-at-ZJU-Helper/tree/master/src/plugins/example-plugin)。
- 由于我没有在北教/蒙民伟楼的课程，对北教智云的支持可能会不完善，欢迎同学们补充。

<!-- The following content is auto-generated, please do not modify directly. -->

## 功能列表

### 更好的 PTA [`better-pintia`](https://github.com/memset0/Learning-at-ZJU-Helper/tree/master/src/plugins/better-pintia)

PTA 助手，提供以下功能：

- 复制题面 _beta_，可用于题目纠错等场景。



### 更好的视频播放器 [`better-video-player`](https://github.com/memset0/Learning-at-ZJU-Helper/tree/master/src/plugins/better-video-player)

为网课的视频播放器添加以下功能：

- 网页全屏



### 带时间戳的地址复制（精准空降） [`copy-with-timestamp`](https://github.com/memset0/Learning-at-ZJU-Helper/tree/master/src/plugins/copy-with-timestamp)

复制带时间戳的视频地址，这样再次打开时就会自动跳转到对应位置。



### 课件下载 [`download-ppt`](https://github.com/memset0/Learning-at-ZJU-Helper/tree/master/src/plugins/download-ppt)

下载智云课堂自动生成的课件，支持配置最小间隔时间，还支持多种下载方式：

- **导出为 PDF**：将所有课件导出为 PDF，会调用浏览器自带的打印对话框，也可以直接通过打印机打印。[点我下载示例文件](https://pan.memset0.cn/Share/2024/03/03/%E4%BD%BF%E7%94%A8%E8%84%9A%E6%9C%AC%E5%AF%BC%E5%87%BA%E7%9A%84%E8%AF%BE%E4%BB%B6%EF%BC%88%E9%AB%98%E7%BA%A7%E6%95%B0%E6%8D%AE%E7%BB%93%E6%9E%84%E4%B8%8E%E7%AE%97%E6%B3%95%E5%88%86%E6%9E%902024-02-26%E7%AC%AC3-5%E8%8A%82%EF%BC%89.pdf)。
  （由于浏览器性能限制，当图片数量过多时导出速度较慢。如果你有更好的解决方案，请联系我。）

- **打包下载**：将所有课件添加到压缩包中，示例如下：
  ![](https://static.memset0.cn/img/v6/2024/03/03/uEUzlIZR.png)



### 视频链接解析 [`download-video`](https://github.com/memset0/Learning-at-ZJU-Helper/tree/master/src/plugins/download-video)

添加视频解析按钮，点击后自动复制视频连接到剪贴板，可以直接下载。直播也能使用，但需要在流媒体播放器中打开。



### 专注模式 [`focus-mode`](https://github.com/memset0/Learning-at-ZJU-Helper/tree/master/src/plugins/focus-mode)

屏蔽掉无用的网页组件，使你可以专注于课堂本身。开启后智云课堂将不会显示推荐的课程、收藏点赞等无用功能。

如果需要使用被屏蔽的组件，到设置中关闭本功能即可。



### 画中画模式 [`picture-in-picture`](https://github.com/memset0/Learning-at-ZJU-Helper/tree/master/src/plugins/picture-in-picture)

> 感谢 [@Trzeth](https://github.com/Trzeth) 贡献。

允许智云课堂的视频或 PPT 兼容浏览器画中画（PIP）功能。通过点击 <svg width="20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48"><path d="M38 14H22v12h16V14zm4-8H6c-2.21 0-4 1.79-4 4v28c0 2.21 1.79 3.96 4 3.96h36c2.21 0 4-1.76 4-3.96V10c0-2.21-1.79-4-4-4zm0 32.03H6V9.97h36v28.06z"></path></svg> 按钮进入。



### 成绩嗅探 [`score-finder`](https://github.com/memset0/Learning-at-ZJU-Helper/tree/master/src/plugins/score-finder)

通过 API 查询学在浙大中已被登记但尚未公开的成绩。



> 以上功能介绍基于版本 2.0.1 生成，在最新版中可能发生改变，请参见 [项目仓库](https://github.com/memset0/Learning-at-ZJU-Helper)。

