# 官网 / Website

`website/` 是一份可以整夹复制的静态站点。把它里面的文件（不是 `website` 这个文件夹本身）放到 `fushenghuangfu-cpu/bookshelf-site` 仓库根目录，GitHub Pages 就会提供：

- https://fushenghuangfu-cpu.github.io/bookshelf-site/
- https://fushenghuangfu-cpu.github.io/bookshelf-site/privacy.html
- https://fushenghuangfu-cpu.github.io/bookshelf-site/terms.html

文案在 `languages/*.json`。缺某一条时页面回退到英文。`assets/main.js` 按脚本所在目录去取 JSON，因此在 `/bookshelf-site/` 子路径下也能加载。

截图在仓库根目录的 `screenshots/`，命名为 `screenshots/<lang>-N.png`（也接受 `.jpg`）。`<lang>` 是界面语言代码，例如 `en`、`zh-Hans`、`ja`。页面当前使用：

- `screenshots/en-1.png` — 英文书库网格（说明：Your personal library），1206×2622
- `screenshots/en-6.png` — 英文夜间阅读与高亮（说明：Comfortable reading），1125×2436
- `screenshots/en-3.png` — 漫画书库（说明：Comics & audiobooks too），1206×2622

同目录的 `en-2.png`（有声书列表）、`en-4.png`（目录）和 `en-5.png`（阅读设置）还没有放上页面。

切换语言时，`assets/main.js` 只替换文件名中的语言前缀，并保留编号和扩展名。例如日文会请求 `screenshots/ja-1.png`、`screenshots/ja-6.png`、`screenshots/ja-3.png`。本地化图片加载失败时回退到对应的 `en-N.png`；只有英文文件也失败，才隐藏那一张图。

# 如何替换官网截图 / How to replace website screenshots

把文件放在仓库根目录的 `screenshots/<lang>-N.png`，不要放到 `assets/screenshots/`。编号跟页面上的三张英文图一致：书库是 `-1`，夜间阅读是 `-6`，漫画书库是 `-3`。

```
screenshots/en-1.png
screenshots/en-6.png
screenshots/en-3.png
screenshots/zh-Hans-1.png
screenshots/ja-6.png
screenshots/es-3.png
```

`<lang>` 与语言菜单里的代码一致：`en`、`zh-Hans`、`zh-Hant`、`ja`、`ko`、`fr`、`de`、`es`、`pt-BR`、`ru`、`ar`、`he`。

## 建议规格（非强制）

- 比例：保持截图原比例。页面用图片自身的宽高，并用 `object-fit: contain`，不会按 9:16 裁切。
- 现有尺寸：`en-1.png` 与 `en-3.png` 为 1206×2622，`en-6.png` 为 1125×2436。
- 格式：PNG 或 JPG。

## 建议内容

| 文件 | 建议展示 |
|---|---|
| `<lang>-1.png` | 书库主界面（网格布局） |
| `<lang>-6.png` | 夜间阅读，并带有高亮 |
| `<lang>-3.png` | 漫画书库 |

## 缺少某语言的截图怎么办

不用把英文图复制成其他语言的文件名。对应的 `<lang>-N.png` 不存在时，页面会改用 `screenshots/en-N.png`。只有这张英文图也加载失败时，才隐藏该图。
