---
slug: dual-platform-renewal
order: 1
title: 双系プラットフォームリニューアル
category: PM
period: 2026.03 - 2026.06
team: 4名体制
cover: /assets/hero-racer.webp
stacks: React, Three.js, WebGL, TensorFlow.js, TypeScript
cardDate: 2026.03
cardExcerpt: UI/UX、Laravel、Next.js を横断して運用基盤を再設計。高負荷な記事更新とキャンペーン配信に耐える情報設計へ刷新。
cardTags: 要件定義, UI設計, Next.js, Laravel, Vercel
thumbnail: /assets/hero/gp-ciber-machine-dogfight-mini.png
---

## Project Details

運用中の2系統プラットフォームを、編集体験と表示速度の両面から再設計しました。既存Laravel基盤を活かしながら、Next.js側で表示レイヤーを整理し、キャンペーンや記事更新に耐えられる構造へ移行しています。

- 既存CMS運用の課題を洗い出し、更新頻度の高い領域と固定化できる領域を分離。
- Figma上で主要画面、カード、記事導線、CTAの情報密度を再設計。
- Next.jsの静的生成と再検証を前提に、配信速度と運用柔軟性を両立。
- Laravel側の既存データ構造を壊さず、段階的な移行ができる実装方針を策定。

## Outcome

記事更新、キャンペーン差し替え、LP展開を同じ設計ルールで扱える状態にしました。今後のWordPress REST API連携やプレビュー導線にも接続しやすい構成です。
