# 📝 Notion Manager

Notion API를 활용한 파일 생성 및 관리 자동화 도구입니다.

## ✨ 주요 기능

- 🎯 **자동 페이지 생성**: 템플릿 기반 Notion 페이지 자동 생성
- 🔄 **양방향 동기화**: 로컬 파일과 Notion 페이지 동기화
- 💾 **백업 관리**: Notion 콘텐츠 로컬 백업
- 📊 **데이터베이스 관리**: Notion 데이터베이스 항목 일괄 추가/수정

## 🚀 시작하기

### 1. 환경 설정

`.env` 파일을 생성하고 다음 정보를 입력하세요:

```env
NOTION_API_KEY=your_notion_api_key_here
NOTION_DATABASE_ID=your_database_id_here
```

### 2. Notion API Key 발급

1. [Notion Developers](https://www.notion.so/my-integrations)에서 새 integration 생성
2. API Key 복사
3. Notion 페이지에서 integration 연결

### 3. 설치 및 실행

```bash
npm install
npm start
```

## 📖 사용 예제

### 페이지 생성

```javascript
// src/create-page.js 사용
npm run create-page
```

### 동기화

```bash
# 로컬 → Notion
npm run sync

# 백업 (Notion → 로컬)
npm run backup
```

## 🛠️ Claude Code Skills

이 프로젝트는 다음 Skills를 포함합니다:

- **Notion Page Creator**: Notion 페이지 자동 생성
- **Notion Sync**: 로컬-Notion 양방향 동기화

## 📚 MCP Servers

- **@modelcontextprotocol/server-notion**: Notion API 연동
- **@modelcontextprotocol/server-filesystem**: 파일 시스템 관리

## 📝 템플릿 예제

`src/templates/` 디렉토리에 다양한 페이지 템플릿이 포함되어 있습니다:

- 회의록
- 프로젝트 계획
- 일일 노트
- 독서 기록

## 🔧 설정

`.claude/settings.json`에서 프로젝트별 설정 관리:

- 권한 설정
- 환경 변수
- 세션 시작 훅

## 📄 라이선스

MIT
