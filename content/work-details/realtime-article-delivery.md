---
slug: realtime-article-delivery
title: リアルタイム記事配信基盤
category: PM
period: 2026.03 - 2026.06
team: 4名体制
cover: /assets/hero-racer.webp
stacks: React, Three.js, WebGL, TensorFlow.js, TypeScript
---

## Project Details

WordPressを編集基盤として残しながら、Next.jsで高速表示する記事配信フローを設計しました。編集者が慣れた管理画面で更新し、公開ページはVercel上で安定して配信できる構成です。

- WordPress REST APIから記事、カテゴリ、アイキャッチ、タグ情報を取得。
- ISRを使い、公開後の反映速度とキャッシュ効率のバランスを調整。
- 記事カード、詳細ページ、一覧ページへ展開しやすいデータ形式に正規化。
- SEO向けのタイトル、概要、画像、構造化データの拡張余地を確保。

## Outcome

CMSの使いやすさを保ちながら、フロントエンド側の表示品質とパフォーマンスを改善しました。今後はプレビュー、下書き確認、タグ別導線も同じ構造で追加できます。
