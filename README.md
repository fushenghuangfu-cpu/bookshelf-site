# 官网 / Website

`website/` 是一份可以整夹复制的静态站点。把它里面的文件（不是 `website` 这个文件夹本身）放到 `fushenghuangfu-cpu/bookshelf-site` 仓库根目录，GitHub Pages 就会提供：

- https://fushenghuangfu-cpu.github.io/bookshelf-site/
- https://fushenghuangfu-cpu.github.io/bookshelf-site/privacy.html
- https://fushenghuangfu-cpu.github.io/bookshelf-site/terms.html

文案在 `languages/*.json`。缺某一条时页面回退到英文。`assets/main.js` 按脚本所在目录去取 JSON，因此在 `/bookshelf-site/` 子路径下也能加载。

下面这些截图目前不在仓库里。页面会在图片加载失败时藏起对应的图，不会留破图。

# 如何替换官网截图 / How to replace website screenshots

官网的截图路径写在 `website/assets/screenshots/<lang>-1.jpg`, `<lang>-2.jpg`, `<lang>-3.jpg`。
`<lang>` 使用官方支持的四个语言代码之一：

- `en` – 英文
- `zh-Hans` – 简体中文
- `ja` – 日文
- `es` – 西班牙文

## 文件命名

将你的截图分别放到：

```
website/assets/screenshots/en-1.jpg
website/assets/screenshots/en-2.jpg
website/assets/screenshots/en-3.jpg
website/assets/screenshots/zh-Hans-1.jpg
website/assets/screenshots/zh-Hans-2.jpg
website/assets/screenshots/zh-Hans-3.jpg
website/assets/screenshots/ja-1.jpg
website/assets/screenshots/ja-2.jpg
website/assets/screenshots/ja-3.jpg
website/assets/screenshots/es-1.jpg
website/assets/screenshots/es-2.jpg
website/assets/screenshots/es-3.jpg
```

网站会根据当前语言自动替换 `<img src>` 中的 `<lang>-N.jpg`。

## 建议规格（非强制）

- 比例：9:16（竖屏手机截图），与 CSS 中 `aspect-ratio: 9/16` 匹配
- 分辨率：至少 1080×1920（推荐 iPhone 真机截图 1170×2532）
- 格式：JPG 或 WebP，体积控制在 400KB 以内

## 建议内容

| 文件 | 建议展示 |
|---|---|
| `-1.jpg` | 书库主界面（突出书架 / 网格布局 / 导入入口） |
| `-2.jpg` | 小说阅读界面（突出排版、主题、夜间模式） |
| `-3.jpg` | 漫画或有声书界面（覆盖三类内容） |

## 缺少某语言的截图怎么办

如果某个语言目录下没有对应截图，浏览器会显示图片占位。
可以让所有语言共用一套英文截图 —— 把英文三张图复制/软链接到其他语言目录即可，或自行修改 `index.html` 中的默认 `src`。
