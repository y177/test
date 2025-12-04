# 📚 Obsidian Vault Manager

Obsidian vault의 파일 생성 및 관리를 자동화하는 도구입니다.

## ✨ 주요 기능

- 📝 **자동 노트 생성**: 템플릿 기반 마크다운 노트 생성
- 🔗 **링크 관리**: 깨진 링크 탐지 및 수정
- 🏷️ **태그 정리**: 태그 체계 자동 정리
- 📊 **Vault 분석**: 노트 통계 및 인사이트
- 🗓️ **일일 노트**: Daily Notes 자동 생성

## 🚀 시작하기

### 1. 설치

```bash
npm install
```

### 2. Vault 경로 설정

`.env` 파일 생성:

```env
VAULT_PATH=/path/to/your/obsidian/vault
TEMPLATES_PATH=./templates
```

### 3. 실행

```bash
npm start
```

## 📖 사용 예제

### 일일 노트 생성

```bash
npm run daily
```

### Vault 정리

```bash
npm run organize
```

### 링크 체크

```bash
npm run link-check
```

### 통계 보기

```bash
npm run stats
```

## 🛠️ Claude Code Skills

- **Obsidian Note Creator**: 노트 자동 생성
- **Vault Organizer**: Vault 구조 정리 및 최적화

## 📚 MCP Servers

- **@modelcontextprotocol/server-filesystem**: Vault 파일 관리
- **@modelcontextprotocol/server-memory**: 노트 메타데이터 관리
- **@modelcontextprotocol/server-git**: 버전 관리

## 📝 템플릿

`templates/` 디렉토리에 포함된 템플릿:

- 📅 Daily Note
- 📚 Book Note
- 💡 Idea Note
- 📊 Meeting Note
- 🎯 Project Note

## 🎨 Front Matter 예제

```yaml
---
title: "노트 제목"
date: 2025-12-04
tags: [개발, 프로젝트]
aliases: [별칭]
status: in-progress
---
```

## 🔧 Obsidian 플러그인 추천

- **Dataview**: 노트 데이터 쿼리
- **Templater**: 고급 템플릿 기능
- **Calendar**: 일일 노트 관리
- **Graph Analysis**: 링크 구조 시각화

## 📁 권장 Vault 구조

```
vault/
├── 00-inbox/          # 새로운 노트
├── 10-daily/          # 일일 노트
├── 20-projects/       # 프로젝트 노트
├── 30-areas/          # 영역별 노트
├── 40-resources/      # 참고 자료
├── 50-archives/       # 아카이브
└── templates/         # 템플릿
```

## 📄 라이선스

MIT
