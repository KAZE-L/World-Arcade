# 印度節奏盒子 (Indian Rhythm Box)

這是一個基於React的節奏遊戲，靈感來自於節奏盒子，採用印度音樂主題和像素風格。

## 功能特點

- 像素風格的視覺效果
- 印度音樂主題 (塔布拉鼓、西塔琴、襯底音色、人聲)
- 拖放式節奏創作
- 即時音頻播放與循環
- 響應式設計
- React Hook架構

## 技術棧

- React 18 (with Hooks)
- Next.js 14
- Web Audio API
- CSS3 動畫
- 拖放 API

## 目錄結構

```
src/app/RagaBox/
├── page.js          # 主要React組件
├── styles.css       # 樣式文件
├── components/      # 組件目錄
│   └── AudioManager.js  # 音頻管理器
└── README.md       # 說明文件

public/RagaBox/     # 靜態資源 (Next.js public目錄)
├── img/            # 圖片資源
│   ├── bg_01.png   # 背景圖片
│   ├── c0_idle.gif # 空閒狀態圖片
│   └── c*_flash.gif # 各種角色動畫 (20個文件)
└── audio/          # 音頻資源
    ├── tabla_*.wav # 塔布拉鼓音效
    ├── sitar_*.wav # 西塔琴音效
    ├── pad_*.wav   # 襯底音效
    └── vocal_*.wav # 人聲音效
```

## 使用方法

1. 從底部工具列拖拽音樂元素到舞台上的8個槽位
2. 點擊播放按鈕開始/停止音樂
3. 點擊舞台上的角色可以移除該槽位
4. 不同類型的音樂元素可以組合創作出豐富的節奏

## 開發狀態

✅ 已完成轉換為React組件
✅ 目錄結構整理完成
✅ 拖放功能正常運作
✅ 音頻播放系統運作正常 