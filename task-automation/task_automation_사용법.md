# 🤖 Task Automation 완벽 가이드

## 📋 목차

1. [개요](#개요)
2. [사용 가능한 작업](#사용-가능한-작업)
3. [Claude Code와 함께 사용하기](#claude-code와-함께-사용하기)
4. [프롬프트 예제 5가지](#프롬프트-예제-5가지)
5. [워크플로우 작성 가이드](#워크플로우-작성-가이드)
6. [고급 기능](#고급-기능)
7. [트러블슈팅](#트러블슈팅)

---

## 개요

Task Automation은 반복적인 작업을 자동화하는 강력한 도구입니다. YAML 파일로 워크플로우를 정의하고, Cron 스케줄로 자동 실행하거나 수동으로 실행할 수 있습니다.

### 핵심 개념

- **워크플로우(Workflow)**: 여러 단계의 작업을 순차적으로 실행하는 자동화 프로세스
- **액션(Action)**: 각 단계에서 실행되는 구체적인 작업 (예: GitHub API 호출, 파일 읽기, Slack 메시지 전송)
- **스케줄(Schedule)**: Cron 표현식을 사용한 정기 실행 설정
- **스킬(Skills)**: Claude Code가 워크플로우를 더 쉽게 생성/관리할 수 있게 돕는 도구

---

## 사용 가능한 작업

### 1. 📋 워크플로우 관리

#### 워크플로우 목록 확인
```bash
npm run list
```

#### 특정 워크플로우 실행
```bash
npm run workflow <워크플로우-이름>

# 예제
npm run workflow example-daily-standup
```

#### 워크플로우 히스토리 확인
```bash
npm run list -- --history
```

### 2. ⏰ 스케줄러 작업

#### 스케줄러 데몬 시작 (백그라운드 실행)
```bash
npm run daemon
```

#### 스케줄 작업 즉시 실행
```bash
npm run run <작업-이름>
```

#### 스케줄러 시작 (포그라운드)
```bash
npm run schedule
```

### 3. 🔨 개발/테스트 작업

#### 개발 모드로 시작
```bash
npm start
```

#### 워크플로우 유효성 검사
```bash
node src/validate-workflow.js workflows/my-workflow.yaml
```

---

## Claude Code와 함께 사용하기

Task Automation 프로젝트는 Claude Code와 완벽하게 통합됩니다.

### 자동 로드되는 기능

1. **MCP 서버 (4개)**
   - `filesystem`: 워크플로우 파일 관리
   - `github`: GitHub API 통합
   - `slack`: Slack 메시지 전송
   - `time`: 시간/날짜 관리

2. **Skills (2개)**
   - `Workflow Executor`: 워크플로우 실행/관리
   - `Task Scheduler`: 스케줄링/모니터링

3. **SessionStart 훅**
   - 환영 메시지 출력
   - 자동 `npm install` 실행

### Claude Code에서 사용하는 방법

```bash
# 1. task-automation 디렉토리로 이동
cd task-automation

# 2. Claude Code 시작 (자동으로 설정 로드)
# Claude에게 자연어로 요청하면 됩니다!
```

### 토큰 사용량 모니터링

```
# Claude Code에서 실행
/context

# 예상 결과
⛁ MCP tools: 44k-66k tokens (22-33%)
  - github: ~18k
  - slack: ~13k
  - filesystem: ~8k
  - time: ~5k
```

필요 없는 서버는 비활성화:
```
/mcp
# → slack 비활성화 → ~13k 토큰 절약
```

---

## 프롬프트 예제 5가지

### 1. 🔄 일일 스탠드업 리포트 자동화

**프롬프트:**
```
매일 평일 오전 9시에 실행되는 스탠드업 리포트 워크플로우를 만들어줘.
GitHub에서 내가 담당한 진행 중인 이슈를 확인하고,
리포트 템플릿으로 정리해서 Slack #standup 채널에 전송하도록 해줘.
```

**Claude가 수행할 작업:**
1. `workflows/daily-standup.yaml` 파일 생성
2. GitHub 이슈 조회 단계 추가
3. 템플릿 렌더링 단계 추가
4. Slack 메시지 전송 단계 추가
5. Cron 스케줄 설정 (`0 9 * * 1-5`)

**생성되는 워크플로우:**
```yaml
name: "Daily Standup Report"
description: "일일 스탠드업 리포트 자동 생성 및 전송"
schedule: "0 9 * * 1-5"  # 평일 오전 9시

steps:
  - name: "GitHub Issues 확인"
    action: github.getIssues
    params:
      state: open
      assignee: "@me"
      labels: ["in-progress"]

  - name: "리포트 생성"
    action: template.render
    params:
      template: standup-report.md
      data:
        issues: "{{ steps.0.output }}"
        date: "{{ today }}"

  - name: "Slack 전송"
    action: slack.sendMessage
    params:
      channel: "#standup"
      message: "{{ steps.1.output }}"
```

---

### 2. 📦 주간 백업 자동화

**프롬프트:**
```
매주 금요일 오후 6시에 다음 작업을 수행하는 백업 워크플로우를 만들어줘:
1. data 디렉토리를 tar.gz로 압축
2. 백업 파일을 안전한 위치로 복사
3. 완료 후 Slack으로 알림
4. 에러 발생 시에도 알림 보내기
```

**Claude가 수행할 작업:**
1. `workflows/weekly-backup.yaml` 생성
2. 압축, 복사, 알림 단계 추가
3. 에러 처리 로직 추가

**생성되는 워크플로우:**
```yaml
name: "Weekly Backup"
description: "주간 데이터 백업"
schedule: "0 18 * * 5"  # 매주 금요일 오후 6시

steps:
  - name: "데이터 압축"
    action: script.run
    params:
      command: "tar -czf backup-$(date +%Y%m%d).tar.gz ./data"
    onError: stop

  - name: "백업 파일 복사"
    action: file.copy
    params:
      source: "backup-*.tar.gz"
      destination: "../backups/"

  - name: "성공 알림"
    action: slack.sendMessage
    params:
      channel: "#admin"
      message: "✅ 주간 백업 완료"

  - name: "에러 알림"
    action: slack.sendMessage
    condition: "{{ error }}"
    params:
      channel: "#admin"
      message: "❌ 백업 실패: {{ error.message }}"
```

---

### 3. 🔍 PR 리뷰 리마인더

**프롬프트:**
```
평일 오전 10시와 오후 3시에 실행되는 PR 리뷰 리마인더를 만들어줘.
리뷰가 필요한 오픈 PR을 확인하고,
리뷰어들에게 Slack으로 알림을 보내되,
PR이 없으면 알림을 보내지 마.
```

**Claude가 수행할 작업:**
1. `workflows/pr-review-reminder.yaml` 생성
2. GitHub PR 조회 추가
3. 조건부 Slack 알림 추가

**생성되는 워크플로우:**
```yaml
name: "PR Review Reminder"
description: "PR 리뷰 리마인더"
schedule: "0 10,15 * * 1-5"  # 평일 10시, 15시

steps:
  - name: "리뷰 대기 PR 확인"
    action: github.getPRs
    params:
      state: open
      review: required

  - name: "리뷰어 알림"
    action: slack.sendMessage
    condition: "{{ steps.0.count > 0 }}"
    params:
      channel: "#code-review"
      message: |
        🔍 리뷰 대기 중인 PR이 {{ steps.0.count }}개 있습니다.

        {{ steps.0.output }}
```

---

### 4. 📊 월간 리포트 생성

**프롬프트:**
```
매월 마지막 날 오후 5시에 실행되는 월간 리포트 워크플로우를 만들어줘.
이번 달에 완료된 이슈를 모두 조회하고,
통계와 함께 리포트를 생성해서 PDF로 저장한 뒤,
이메일로 팀에게 전송해줘.
```

**Claude가 수행할 작업:**
1. `workflows/monthly-report.yaml` 생성
2. 이슈 조회, 통계 계산, PDF 생성, 이메일 전송 단계 추가

**생성되는 워크플로우:**
```yaml
name: "Monthly Report"
description: "월간 업무 리포트"
schedule: "0 17 L * *"  # 매월 마지막 날 오후 5시

steps:
  - name: "이번 달 완료 이슈 조회"
    action: github.getIssues
    params:
      state: closed
      closed: thisMonth

  - name: "통계 계산"
    action: script.run
    params:
      command: "node src/calculate-stats.js {{ steps.0.output }}"

  - name: "리포트 생성"
    action: template.render
    params:
      template: monthly-report.md
      data:
        issues: "{{ steps.0.output }}"
        stats: "{{ steps.1.output }}"
        month: "{{ currentMonth }}"

  - name: "PDF 변환"
    action: script.run
    params:
      command: "npx markdown-pdf {{ steps.2.output }} -o report.pdf"

  - name: "이메일 발송"
    action: email.send
    params:
      to: "team@example.com"
      subject: "{{ currentMonth }} 월간 리포트"
      body: "{{ steps.2.output }}"
      attachments: ["report.pdf"]
```

---

### 5. 🔄 다중 프로젝트 동기화

**프롬프트:**
```
매일 오전 8시에 실행되는 모닝 루틴 워크플로우를 만들어줘:
1. Daily Journal에 오늘의 아침 저널 생성
2. Obsidian에 오늘의 Daily Note 생성
3. Notion에 오늘의 할 일 페이지 생성
4. GitHub에서 내 이슈 요약
5. 모든 정보를 통합해서 Slack으로 보내기
```

**Claude가 수행할 작업:**
1. `workflows/morning-routine.yaml` 생성
2. 여러 프로젝트 통합 작업 추가
3. 데이터 수집 및 통합 단계 추가

**생성되는 워크플로우:**
```yaml
name: "Morning Routine"
description: "아침 루틴 자동화 - 다중 프로젝트 통합"
schedule: "0 8 * * *"  # 매일 오전 8시

steps:
  - name: "Daily Journal 생성"
    action: script.run
    params:
      command: "cd ../daily-journal && npm run morning"

  - name: "Obsidian Daily Note 생성"
    action: script.run
    params:
      command: "cd ../obsidian-vault && npm run daily"

  - name: "Notion 할 일 페이지 생성"
    action: script.run
    params:
      command: "cd ../notion-manager && npm run create-daily-page"

  - name: "GitHub 이슈 요약"
    action: github.getIssues
    params:
      state: open
      assignee: "@me"

  - name: "통합 리포트 생성"
    action: template.render
    params:
      template: morning-summary.md
      data:
        date: "{{ today }}"
        issues: "{{ steps.3.output }}"

  - name: "Slack 전송"
    action: slack.sendMessage
    params:
      channel: "#personal"
      message: |
        ☀️ 좋은 아침입니다!

        {{ steps.4.output }}

        📝 오늘의 저널, 노트, 할 일이 준비되었습니다.
```

---

## 워크플로우 작성 가이드

### 기본 구조

```yaml
name: "워크플로우 이름"
description: "워크플로우 설명"
schedule: "0 9 * * *"  # Cron 표현식 (선택)

triggers:  # 선택
  - type: schedule
  - type: manual

variables:  # 선택
  channel: "#general"
  threshold: 10

steps:
  - name: "단계 이름"
    action: category.action
    params:
      key: value
    condition: "{{ expression }}"  # 선택
    onError: continue  # 또는 stop, retry
    retries: 3  # 선택
    timeout: 5000  # 선택 (밀리초)
```

### 사용 가능한 액션

#### GitHub 통합
```yaml
# 이슈 조회
- action: github.getIssues
  params:
    state: open  # open, closed, all
    assignee: "@me"
    labels: ["bug", "feature"]

# 이슈 생성
- action: github.createIssue
  params:
    title: "Issue title"
    body: "Issue description"
    labels: ["bug"]

# PR 조회
- action: github.getPRs
  params:
    state: open
    review: required

# PR 생성
- action: github.createPR
  params:
    title: "PR title"
    body: "PR description"
    base: main
    head: feature-branch
```

#### 파일 작업
```yaml
# 파일 읽기
- action: file.read
  params:
    path: "./data.txt"

# 파일 쓰기
- action: file.write
  params:
    path: "./output.txt"
    content: "{{ steps.0.output }}"

# 파일 복사
- action: file.copy
  params:
    source: "./data.txt"
    destination: "./backup/data.txt"

# 파일 삭제
- action: file.delete
  params:
    path: "./temp.txt"
```

#### 커뮤니케이션
```yaml
# Slack 메시지
- action: slack.sendMessage
  params:
    channel: "#general"
    message: "Hello World"

# Slack 파일 업로드
- action: slack.uploadFile
  params:
    channel: "#general"
    file: "./report.pdf"
    comment: "Monthly report"

# 이메일 발송
- action: email.send
  params:
    to: "user@example.com"
    subject: "Subject"
    body: "Email body"
```

#### 유틸리티
```yaml
# HTTP 요청
- action: http.request
  params:
    method: GET  # GET, POST, PUT, DELETE
    url: "https://api.example.com/data"
    headers:
      Authorization: "Bearer token"
    data:
      key: value

# 템플릿 렌더링
- action: template.render
  params:
    template: report.md
    data:
      title: "Report"
      items: "{{ steps.0.output }}"

# 스크립트 실행
- action: script.run
  params:
    command: "node process-data.js"

# 대기
- action: wait
  params:
    seconds: 5
```

### Cron 스케줄 예제

```yaml
# 매일 오전 9시
schedule: "0 9 * * *"

# 평일 오후 5시
schedule: "0 17 * * 1-5"

# 매주 월요일 오전 10시
schedule: "0 10 * * 1"

# 매월 1일 자정
schedule: "0 0 1 * *"

# 매월 마지막 날
schedule: "0 0 L * *"

# 매 15분마다
schedule: "*/15 * * * *"

# 매시간 정각
schedule: "0 * * * *"

# 매일 오전 10시, 오후 3시
schedule: "0 10,15 * * *"
```

---

## 고급 기능

### 1. 조건부 실행

```yaml
steps:
  - name: "데이터 확인"
    action: file.read
    params:
      path: "./data.json"

  - name: "알림 (조건부)"
    action: slack.sendMessage
    condition: "{{ steps.0.size > 1000 }}"
    params:
      message: "파일 크기가 큽니다: {{ steps.0.size }}"
```

### 2. 에러 처리

```yaml
steps:
  - name: "API 호출"
    action: http.request
    params:
      url: "https://api.example.com"
    onError: retry  # continue, stop, retry
    retries: 3
    timeout: 5000

  - name: "에러 알림"
    action: slack.sendMessage
    condition: "{{ error }}"
    params:
      message: "에러 발생: {{ error.message }}"
```

### 3. 변수 사용

```yaml
variables:
  channel: "#general"
  threshold: 10
  recipients:
    - "user1@example.com"
    - "user2@example.com"

steps:
  - name: "변수 사용"
    action: slack.sendMessage
    params:
      channel: "{{ variables.channel }}"
      message: "Threshold: {{ variables.threshold }}"
```

### 4. 이전 단계 결과 참조

```yaml
steps:
  - name: "데이터 수집"
    action: github.getIssues
    params:
      state: open

  - name: "결과 활용"
    action: template.render
    params:
      template: report.md
      data:
        count: "{{ steps.0.count }}"
        items: "{{ steps.0.output }}"
        firstItem: "{{ steps.0.output.0.title }}"
```

### 5. 병렬 실행 (고급)

```yaml
steps:
  - name: "병렬 작업 그룹"
    action: parallel.run
    params:
      tasks:
        - action: github.getIssues
        - action: github.getPRs
        - action: file.read
          params:
            path: "./data.txt"

  - name: "결과 통합"
    action: script.run
    params:
      command: "node merge-results.js {{ steps.0.output }}"
```

---

## 트러블슈팅

### 문제 1: 워크플로우가 실행되지 않음

**증상:**
```bash
npm run workflow my-workflow
# 에러: 워크플로우를 찾을 수 없습니다
```

**해결책:**
1. 파일 이름 확인: `workflows/my-workflow.yaml`
2. YAML 문법 오류 확인
3. 워크플로우 목록 확인: `npm run list`

### 문제 2: GitHub/Slack 액션 실패

**증상:**
```
❌ GitHub 액션 실행 실패: Unauthorized
```

**해결책:**
1. `.env` 파일 확인
   ```env
   GITHUB_TOKEN=your_token_here
   SLACK_WEBHOOK=your_webhook_here
   ```
2. 토큰 권한 확인
3. 네트워크 연결 확인

### 문제 3: Cron 스케줄이 작동하지 않음

**증상:**
- 스케줄러가 시작되었지만 작업이 실행되지 않음

**해결책:**
1. Cron 표현식 검증: https://crontab.guru/
2. 시간대 확인
   ```yaml
   variables:
     timezone: "Asia/Seoul"
   ```
3. 스케줄러 로그 확인: `logs/scheduler.log`

### 문제 4: Claude Code MCP 서버 과부하

**증상:**
```
/context
⛁ MCP tools: 85k tokens (42.5%)
Free space: 8k (4%)
```

**해결책:**
1. 불필요한 MCP 서버 비활성화
   ```
   /mcp
   # slack 서버 비활성화 → ~13k 토큰 절약
   ```
2. 작업 완료 후 `/clear`로 대화 초기화

### 문제 5: 템플릿 렌더링 오류

**증상:**
```
❌ 템플릿을 찾을 수 없습니다: report.md
```

**해결책:**
1. 템플릿 디렉토리 생성: `mkdir -p workflows/templates`
2. 템플릿 파일 생성: `workflows/templates/report.md`
3. 경로 확인

---

## 실전 팁

### 1. 워크플로우 테스트

항상 프로덕션 전에 테스트:
```bash
# 테스트 모드로 실행 (실제 액션 수행 안 함)
npm run workflow my-workflow -- --dry-run

# 특정 단계만 실행
npm run workflow my-workflow -- --step 2
```

### 2. 로그 활용

```bash
# 실시간 로그 확인
tail -f logs/workflows/my-workflow.log

# 에러 로그만 확인
grep "ERROR" logs/workflows/*.log
```

### 3. 성능 최적화

- 불필요한 단계 제거
- 병렬 실행 활용
- 캐싱 활용
- 타임아웃 설정

### 4. 보안

- `.env` 파일은 절대 커밋하지 않기
- 민감한 정보는 환경 변수로 관리
- API 토큰 정기적으로 갱신

### 5. Claude Code와 협업

Claude에게 이렇게 요청하세요:
- "이 워크플로우를 최적화해줘"
- "에러 처리를 추가해줘"
- "주석을 추가해서 설명해줘"
- "비슷한 워크플로우 예제 보여줘"

---

## 추가 리소스

- [프로젝트 README](./README.md)
- [Cron 표현식 생성기](https://crontab.guru/)
- [Claude Code 문서](https://code.claude.com/docs)
- [MCP 프로토콜](https://modelcontextprotocol.io/)

---

**🎉 이제 Task Automation을 마스터했습니다!**

Claude Code와 함께 생산성을 극대화하세요! 🚀
