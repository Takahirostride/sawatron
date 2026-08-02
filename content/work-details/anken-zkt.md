---
slug: anken-zkt
order: 1
title: 教育系アプリ保守運用案件
category: FE / BE
period: 2026.05 - 2026.07
team: 4名体制～
cover: /assets/hero-racer.webp
modalImage: /assets/hero/gp-ciber-machine-dogfight-mini.png
stacks: HTML Living Standard, CSS/SCSS, TypeScript, Next.js, React, Go, MySQL , Copilot, Git, VSCODE, A5SQL, Node.js, Docker, Backlog
cardExcerpt: SES参画案件。某教育系 SaaS / 業務管理システムの管理画面の改修における、フロントエンドやバックエンドの技術的サポートを担当。
cardTags: Next.js, React, Go, MySQL, Docker, TypeScript
thumbnail: /assets/hero/gp-ciber-machine-dogfight-mini.png
---

## Project Details

![Project Details thumbnail](/assets/hero/gp-ciber-machine-dogfight-mini.png){width=360 height=152}

● 某教育系SaaS / 業務管理システム管理画面の改修（Next / React / TypeScript / Go）
 - 既存システムのバックエンド連携調査（Go/API × DB）
 - API連携上の実装における、UIUX上での大量通信時の不具合解消やパフォーマンスを改善
 - UT（ユニットテスト）作成。単体テスト仕様書の整備

## Outcome

![Outcome thumbnail](/assets/hero/gp-ciber-machine-stream.webp){width=300 height=160}

① 業務系DB調査・仕様突合（受講講座の請求・割引ロジック）
請求・割引ドメインのデータ調査。開発DB約180テーブルから料金関連を抽出し、その後、料金・割引・請求に関係するテーブルをキーワード・DDL・除外ルールで体系化して割引上限（頭打ち）の適用有無を項目単位でマトリックス化した。A5:SQL、ER図、API設計書を用いた突合をし、クライアント向け説明資料のベースを作成。

② 受講料請求除外画面のボタン制御不具合修正・設計書整備
請求除外関連画面のフロントエンド不具合調査・修正。チェックボックス操作に連動するボタン活性状態の制御ロジックを見直し、UseStateなど状態管理方式の変更と画面仕様書の整備を実施。通信環境が限定されていたため、Nextのモックサーバー上で画面処理などは解決。画面の状態管理において仕様書を追記し、UTまで反映。
 - DevTools Performanceや、5,000 行 × 複数セルの一括 DOM生成で高負荷時のデバッグ状態を再現
 - React.memo / useCallback / 描画方式見直しなどの改善方針を提案
