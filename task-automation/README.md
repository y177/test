# 🤖 Task Automation

개인 작업을 자동화하고 생산성을 높이는 도구입니다.

## ✨ 주요 기능

- 🔄 **워크플로우 자동화**: YAML로 정의하는 자동화 워크플로우
- ⏰ **작업 스케줄링**: Cron 기반 정기 작업 실행
- 🔗 **통합 지원**: GitHub, Slack, Email 등
- 📊 **모니터링**: 실행 히스토리 및 로그 관리
- 🎯 **조건부 실행**: 상황에 따른 작업 실행

## 🚀 시작하기

### 1. 설치

```bash
npm install
```

### 2. 환경 설정

`.env` 파일 생성:

```env
WORKFLOWS_DIR=./workflows
GITHUB_TOKEN=your_github_token
SLACK_WEBHOOK=your_slack_webhook_url
```

### 3. 첫 워크플로우 실행

```bash
npm run workflow daily-standup
```

## 📖 사용 방법

### 워크플로우 정의

`workflows/daily-standup.yaml` 예제:

```yaml
name: "Daily Standup Report"
description: "일일 스탠드업 리포트 자동 생성"
schedule: "0 9 * * 1-5"  # 평일 오전 9시

steps:
  - name: "GitHub Issues 확인"
    action: github.getIssues
    params:
      state: open
      assignee: "@me"

  - name: "리포트 생성"
    action: template.render
    params:
      template: standup.md

  - name: "Slack 전송"
    action: slack.sendMessage
    params:
      channel: "#standup"
```

### 워크플로우 실행

```bash
# 특정 워크플로우 실행
npm run workflow <workflow-name>

# 모든 워크플로우 목록
npm run list

# 스케줄러 데몬 시작
npm run daemon
```

### 스케줄 작업

```bash
# 스케줄러 시작
npm run schedule

# 특정 작업 즉시 실행
npm run run <task-name>
```

## 🛠️ 내장 액션

### GitHub 통합
- `github.getIssues`: 이슈 조회
- `github.createIssue`: 이슈 생성
- `github.getPRs`: PR 조회
- `github.createPR`: PR 생성
- `github.mergePR`: PR 병합

### 파일 작업
- `file.read`: 파일 읽기
- `file.write`: 파일 쓰기
- `file.copy`: 파일 복사
- `file.delete`: 파일 삭제
- `file.move`: 파일 이동

### 커뮤니케이션
- `slack.sendMessage`: Slack 메시지
- `slack.uploadFile`: 파일 업로드
- `email.send`: 이메일 발송

### 유틸리티
- `http.request`: HTTP 요청
- `template.render`: 템플릿 렌더링
- `script.run`: 셸 스크립트 실행
- `wait`: 대기

## 📝 워크플로우 예제

### 1. 매일 백업

```yaml
name: "Daily Backup"
schedule: "0 0 * * *"

steps:
  - name: "백업 생성"
    action: script.run
    params:
      command: "tar -czf backup.tar.gz ./data"

  - name: "클라우드 업로드"
    action: file.upload
    params:
      file: "backup.tar.gz"
      destination: "cloud://backups/"

  - name: "완료 알림"
    action: slack.sendMessage
    params:
      channel: "#admin"
      message: "✅ 백업 완료"
```

### 2. PR 리뷰 리마인더

```yaml
name: "PR Review Reminder"
schedule: "0 10,15 * * 1-5"

steps:
  - name: "대기 중인 PR 확인"
    action: github.getPRs
    params:
      state: open
      review: required

  - name: "리뷰어 알림"
    action: slack.sendMessage
    params:
      channel: "#code-review"
      message: "🔍 리뷰 대기 중인 PR: {{ steps.0.count }}개"
```

### 3. 주간 리포트

```yaml
name: "Weekly Report"
schedule: "0 17 * * 5"

steps:
  - name: "이번 주 이슈 조회"
    action: github.getIssues
    params:
      closed: thisWeek

  - name: "리포트 생성"
    action: template.render
    params:
      template: weekly-report.md
      data: "{{ steps.0.output }}"

  - name: "이메일 발송"
    action: email.send
    params:
      to: "team@example.com"
      subject: "주간 리포트"
      body: "{{ steps.1.output }}"
```

## ⏰ Cron 스케줄 예제

```yaml
# 매일 오전 9시
"0 9 * * *"

# 평일 오후 5시
"0 17 * * 1-5"

# 매주 월요일 오전 10시
"0 10 * * 1"

# 매월 1일 자정
"0 0 1 * *"

# 매 15분마다
"*/15 * * * *"

# 매시간 정각
"0 * * * *"
```

## 🛠️ Claude Code Skills

- **Workflow Executor**: 워크플로우 실행 및 관리
- **Task Scheduler**: 작업 스케줄링 및 모니터링

## 📚 MCP Servers

- **@modelcontextprotocol/server-github**: GitHub API 통합
- **@modelcontextprotocol/server-slack**: Slack 통합
- **@modelcontextprotocol/server-filesystem**: 파일 시스템 관리
- **@modelcontextprotocol/server-time**: 시간 및 스케줄 관리

## 📊 모니터링

### 실행 히스토리

```bash
# 최근 실행 내역
npm run list -- --history

# 특정 워크플로우 히스토리
npm run workflow <name> -- --history
```

### 로그 확인

로그는 `logs/` 디렉토리에 저장됩니다:

```
logs/
├── workflows/
│   ├── daily-standup.log
│   └── weekly-report.log
└── scheduler.log
```

## 🔧 고급 기능

### 조건부 실행

```yaml
steps:
  - name: "이슈 확인"
    action: github.getIssues

  - name: "알림 (조건부)"
    action: slack.sendMessage
    condition: "{{ steps.0.count > 0 }}"
    params:
      message: "이슈 {{ steps.0.count }}개 발견"
```

### 에러 처리

```yaml
steps:
  - name: "API 호출"
    action: http.request
    onError: continue  # 또는 stop, retry
    retries: 3
    timeout: 5000
```

### 변수 사용

```yaml
variables:
  channel: "#general"
  threshold: 10

steps:
  - name: "메시지 전송"
    action: slack.sendMessage
    params:
      channel: "{{ variables.channel }}"
```

## 💡 사용 사례

1. **일일 루틴**: 매일 아침 스탠드업 리포트
2. **백업 자동화**: 정기 데이터 백업
3. **알림**: PR 리뷰, 이슈 업데이트 알림
4. **리포트**: 주간/월간 통계 리포트
5. **데이터 동기화**: 서비스 간 데이터 동기화
6. **정리 작업**: 임시 파일, 로그 정리

## 📁 디렉토리 구조

```
task-automation/
├── workflows/          # 워크플로우 정의
│   ├── daily-standup.yaml
│   ├── weekly-report.yaml
│   └── backup.yaml
├── src/               # 소스 코드
├── logs/              # 실행 로그
└── docs/              # 문서
```

## 📄 라이선스

MIT
