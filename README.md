# 🚀 Personal Productivity Suite

개인 생산성을 높이는 5가지 자동화 프로젝트 모음입니다.

## 📦 포함된 프로젝트

### 1. 📝 [Notion Manager](./notion-manager/)
Notion API를 활용한 파일 생성 및 관리 자동화

**주요 기능:**
- 자동 페이지 생성
- 양방향 동기화 (로컬 ↔ Notion)
- 데이터베이스 관리
- 템플릿 기반 콘텐츠 생성

**Skills:**
- Notion Page Creator
- Notion Sync

**MCP Servers:**
- @modelcontextprotocol/server-notion
- @modelcontextprotocol/server-filesystem

---

### 2. 📚 [Obsidian Vault](./obsidian-vault/)
Obsidian vault의 파일 생성 및 관리 자동화

**주요 기능:**
- 자동 노트 생성
- Daily Notes 관리
- 링크 체크 및 수정
- Vault 구조 정리

**Skills:**
- Obsidian Note Creator
- Vault Organizer

**MCP Servers:**
- @modelcontextprotocol/server-filesystem
- @modelcontextprotocol/server-memory
- @modelcontextprotocol/server-git

---

### 3. 💰 [Finance Tracker](./finance-tracker/)
개인 재무 추적 및 예산 관리

**주요 기능:**
- 지출 추적
- 수입 관리
- 예산 설정 및 모니터링
- 통계 및 리포트 생성

**Skills:**
- Expense Tracker
- Budget Analyzer

**MCP Servers:**
- @modelcontextprotocol/server-sqlite
- @modelcontextprotocol/server-filesystem

---

### 4. 📔 [Daily Journal](./daily-journal/)
일일 저널 작성 및 분석 자동화

**주요 기능:**
- 아침/저녁 저널 자동 생성
- 감정 추적
- 목표 관리
- 주간/월간 회고

**Skills:**
- Journal Writer
- Journal Analyzer

**MCP Servers:**
- @modelcontextprotocol/server-filesystem
- @modelcontextprotocol/server-time

---

### 5. 🤖 [Task Automation](./task-automation/)
개인 작업 자동화 및 워크플로우 관리

**주요 기능:**
- YAML 기반 워크플로우
- Cron 스케줄링
- GitHub/Slack 통합
- 조건부 실행

**Skills:**
- Workflow Executor
- Task Scheduler

**MCP Servers:**
- @modelcontextprotocol/server-github
- @modelcontextprotocol/server-slack
- @modelcontextprotocol/server-filesystem
- @modelcontextprotocol/server-time

---

## 🏗️ Monorepo 구조

```
personal-productivity-suite/
├── notion-manager/          # Notion 파일 관리
│   ├── .claude/
│   │   ├── settings.json
│   │   └── skills/
│   ├── .mcp.json
│   ├── src/
│   └── package.json
│
├── obsidian-vault/          # Obsidian vault 관리
│   ├── .claude/
│   ├── .mcp.json
│   ├── src/
│   └── vault/
│
├── finance-tracker/         # 재무 관리
│   ├── .claude/
│   ├── .mcp.json
│   ├── src/
│   └── data/
│
├── daily-journal/           # 일일 저널
│   ├── .claude/
│   ├── .mcp.json
│   ├── src/
│   └── entries/
│
└── task-automation/         # 작업 자동화
    ├── .claude/
    ├── .mcp.json
    ├── src/
    └── workflows/
```

## 🚀 빠른 시작

### 전체 설치

각 프로젝트의 의존성을 설치합니다:

```bash
# 각 프로젝트 디렉토리에서
cd notion-manager && npm install
cd ../obsidian-vault && npm install
cd ../finance-tracker && npm install
cd ../daily-journal && npm install
cd ../task-automation && npm install
```

또는 한 번에:

```bash
for dir in notion-manager obsidian-vault finance-tracker daily-journal task-automation; do
  cd $dir && npm install && cd ..
done
```

### 환경 설정

각 프로젝트의 `.env.example` 파일을 `.env`로 복사하고 설정:

```bash
# 각 프로젝트에서
cp .env.example .env
# 그리고 .env 파일 편집
```

### Claude Code와 함께 사용

각 프로젝트는 **프로젝트 스코프**로 구성되어 있습니다:

```bash
# 특정 프로젝트로 이동
cd notion-manager

# Claude Code 시작
# Claude가 자동으로 .claude/settings.json과 .mcp.json을 인식합니다
```

Claude Code가 시작되면:
- 프로젝트별 MCP 서버가 자동 로드됩니다
- 프로젝트별 Skills가 활성화됩니다
- 설정된 환경 변수가 적용됩니다
- SessionStart 훅이 실행됩니다

## 🛠️ 프로젝트별 설정

### Notion Manager

```env
NOTION_API_KEY=your_api_key
NOTION_DATABASE_ID=your_database_id
```

[Notion Developers](https://www.notion.so/my-integrations)에서 API 키 발급

### Obsidian Vault

```env
VAULT_PATH=/path/to/your/obsidian/vault
TEMPLATES_PATH=./templates
```

### Finance Tracker

```env
DATA_DIR=./data
CURRENCY=KRW
```

### Daily Journal

```env
JOURNAL_DIR=./entries
TIMEZONE=Asia/Seoul
```

### Task Automation

```env
GITHUB_TOKEN=your_github_token
SLACK_WEBHOOK=your_slack_webhook
```

## 📖 사용 가이드

### 1. Notion으로 문서 동기화

```bash
cd notion-manager
npm start
# Claude Code에게 "README.md를 Notion으로 동기화해줘" 요청
```

### 2. Obsidian 노트 생성

```bash
cd obsidian-vault
npm run daily
# 또는 Claude에게 "오늘의 Daily Note 만들어줘"
```

### 3. 지출 추적

```bash
cd finance-tracker
npm run add-expense
# 또는 Claude에게 "점심 식사 15,000원 지출 기록해줘"
```

### 4. 일기 작성

```bash
cd daily-journal
npm run morning
# 또는 Claude에게 "오늘의 아침 저널 작성해줘"
```

### 5. 자동화 워크플로우 실행

```bash
cd task-automation
npm run workflow daily-standup
# 또는 스케줄러 시작: npm run daemon
```

## 🎯 Claude Code Skills 활용

각 프로젝트의 `.claude/skills/` 디렉토리에 정의된 Skills가 자동으로 활성화됩니다.

**예제:**

```
사용자: "오늘의 Notion 회의록 페이지 만들어줘"
Claude: [Notion Page Creator 스킬 사용]
        → 템플릿 로드
        → 페이지 생성
        → URL 반환
```

## 🔧 프로젝트 스코프 설정

각 프로젝트는 독립적인 설정을 가집니다:

- **`.claude/settings.json`**: 프로젝트별 권한, 환경 변수, 훅
- **`.mcp.json`**: 프로젝트별 MCP 서버
- **`.claude/skills/`**: 프로젝트별 스킬

이를 통해:
- ✅ 프로젝트별로 다른 MCP 서버 사용
- ✅ 프로젝트별로 다른 권한 설정
- ✅ 프로젝트 특화 스킬 자동 활성화
- ✅ 팀원과 설정 공유 (git으로 관리)

## 💡 사용 팁

### 1. 프로젝트 간 연계

```bash
# Task Automation으로 다른 프로젝트 자동화
cd task-automation

# workflows/morning-routine.yaml
# - Daily Journal 아침 저널 생성
# - Finance Tracker에서 어제 지출 요약
# - Obsidian에 Daily Note 생성
# - Notion에 오늘 할 일 페이지 생성
```

### 2. 정기 백업

```bash
# Task Automation으로 각 프로젝트 데이터 백업
npm run workflow weekly-backup
```

### 3. 통합 대시보드

```bash
# Task Automation으로 모든 프로젝트 통계 수집
npm run workflow dashboard
```

## 📊 프로젝트 선택 가이드

| 프로젝트 | 사용 시나리오 | 난이도 |
|---------|--------------|--------|
| Notion Manager | 팀 협업, 문서 관리 | ⭐⭐⭐ |
| Obsidian Vault | 개인 지식 관리, PKM | ⭐⭐ |
| Finance Tracker | 가계부, 예산 관리 | ⭐⭐ |
| Daily Journal | 자기 성찰, 일기 | ⭐ |
| Task Automation | 반복 작업 자동화 | ⭐⭐⭐⭐ |

## 🤝 기여하기

각 프로젝트는 독립적으로 개선할 수 있습니다:

1. 새로운 Skills 추가: `.claude/skills/` 디렉토리
2. 워크플로우 템플릿 추가
3. MCP 서버 통합 추가
4. 문서 개선

## 📄 라이선스

MIT - 각 프로젝트 폴더 참조

## 🔗 관련 링크

- [Claude Code Documentation](https://code.claude.com/docs)
- [MCP Documentation](https://modelcontextprotocol.io/)
- [Claude Code Skills](https://code.claude.com/docs/en/skills)

---

**Made with ❤️ and Claude Code**

각 프로젝트의 자세한 사용법은 해당 프로젝트의 README.md를 참조하세요.
