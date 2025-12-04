---
name: "Obsidian Note Creator"
description: "Obsidian vault에 노트를 생성하고 관리하는 스킬"
---

## Description

Obsidian 마크다운 노트를 생성하고, 링크를 연결하며, 메타데이터를 관리합니다.

## When to Use

- 새로운 노트를 생성할 때
- 일일 노트(Daily Notes)를 자동 생성할 때
- 템플릿 기반 노트를 만들 때
- 노트 간 링크를 생성할 때

## How to Use

1. 노트 제목과 위치 결정
2. Front matter (YAML) 메타데이터 생성
3. 마크다운 콘텐츠 작성
4. 관련 노트와 링크 연결
5. 태그 및 카테고리 설정

## Note Structure

```markdown
---
title: "노트 제목"
date: 2025-12-04
tags: [tag1, tag2]
aliases: [별칭1, 별칭2]
---

# 노트 제목

노트 내용...

## 관련 링크

- [[관련 노트 1]]
- [[관련 노트 2]]
```

## Best Practices

- 일관된 front matter 형식 사용
- 의미 있는 파일명 사용 (공백 대신 하이픈)
- 태그 계층 구조 활용 (#프로젝트/개발)
- 양방향 링크 적극 활용
