---
name: "Workflow Executor"
description: "자동화 워크플로우를 실행하고 관리하는 스킬"
---

## Description

사전 정의된 워크플로우를 실행하여 반복적인 작업을 자동화합니다.

## When to Use

- 정기적으로 반복되는 작업이 있을 때
- 여러 단계의 작업을 자동화할 때
- 조건부 실행이 필요한 작업이 있을 때
- 스케줄링된 작업을 실행할 때

## Workflow Structure

```yaml
name: "Daily Standup Report"
description: "일일 스탠드업 리포트 생성"
schedule: "0 9 * * *"  # 매일 오전 9시
triggers:
  - type: schedule
  - type: manual

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
      data: "{{ steps.0.output }}"

  - name: "Slack 전송"
    action: slack.sendMessage
    params:
      channel: "#standup"
      message: "{{ steps.1.output }}"
```

## How to Use

1. `workflows/` 디렉토리에 YAML 파일 생성
2. 워크플로우 정의 (이름, 트리거, 단계)
3. 실행: `npm run workflow <name>`
4. 또는 스케줄에 따라 자동 실행

## Built-in Actions

### GitHub
- `github.getIssues`: 이슈 조회
- `github.createIssue`: 이슈 생성
- `github.getPRs`: PR 조회
- `github.createPR`: PR 생성

### File Operations
- `file.read`: 파일 읽기
- `file.write`: 파일 쓰기
- `file.copy`: 파일 복사
- `file.delete`: 파일 삭제

### Communication
- `slack.sendMessage`: Slack 메시지 전송
- `email.send`: 이메일 발송

### Utilities
- `http.request`: HTTP 요청
- `template.render`: 템플릿 렌더링
- `script.run`: 스크립트 실행

## Examples

### 1. 매일 백업
```yaml
name: "Daily Backup"
schedule: "0 0 * * *"
steps:
  - name: "데이터베이스 백업"
    action: script.run
    params:
      command: "pg_dump mydb > backup.sql"

  - name: "클라우드 업로드"
    action: file.upload
    params:
      source: "backup.sql"
      destination: "s3://backups/"
```

### 2. PR 자동 리뷰 요청
```yaml
name: "PR Review Reminder"
schedule: "0 10 * * 1-5"
steps:
  - name: "대기 중인 PR 확인"
    action: github.getPRs
    params:
      state: open
      review: required

  - name: "리뷰어에게 알림"
    action: slack.sendMessage
    params:
      channel: "#code-review"
      message: "{{ steps.0.output }}"
```

## Best Practices

- 워크플로우를 작고 재사용 가능하게 구성
- 에러 처리 단계 포함
- 로그 및 모니터링 설정
- 테스트 모드로 먼저 실행
