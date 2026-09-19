HFSS 产品展示页｜轻量化拆分版

使用方法
1. 保持整个文件夹结构不变。
2. 直接双击 index.html 即可打开。
3. 页面通过相对路径加载 images/、css/、js/ 和 software-demo.html。

本次处理
- 原 index.html：83,149 bytes
- 新 index.html：12,149 bytes
- 主页面内嵌 CSS -> css/main.css
- 主页面内嵌 JS -> js/main.js
- iframe srcdoc 演示页 -> software-demo.html
- 演示页 CSS/JS -> css/software-demo.css / js/software-demo.js
- 移除重复 Cloudflare Insights 统计脚本，便于离线使用
- 图片统一放在 images/ 目录

重要说明：图片来源
上传的 index(1).html 中没有 data:image/base64 图片数据，只包含以下相对路径引用：
- images/logo.png
- images/icon.png
- images/qr.png
- images/kefu-qr.png
但上传内容中没有这 4 个真实图片文件，因此无法从 HTML 恢复原图。

为了让页面解压后不出现破图，本包生成了临时占位图：
- logo.png / icon.png：临时 HF 图标
- qr.png / kefu-qr.png：明确标注“原图缺失”的不可扫码占位图

拿到原始图片后，直接用原图覆盖 images/ 下的同名文件即可，无需修改任何 HTML。
