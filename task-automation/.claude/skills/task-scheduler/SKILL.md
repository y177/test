---
name: "Task Scheduler"
description: "작업을 스케줄링하고 관리하는 스킬"
---

## Description

정기적인 작업을 스케줄링하고, cron 표현식을 사용하여 자동 실행합니다.

## When to Use

- 정기적으로 실행할 작업이 있을 때
- 특정 시간에 작업을 실행해야 할 때
- 조건부 스케줄링이 필요할 때
- 작업 실행 히스토리를 추적할 때

## Cron Expressions

```
┌───────────── 분 (0 - 59)
│ ┌───────────── 시간 (0 - 23)
│ │ ┌───────────── 일 (1 - 31)
│ │ │ ┌───────────── 월 (1 - 12)
│ │ │ │ ┌───────────── 요일 (0 - 6) (일요일=0)
│ │ │ │ │
│ │ │ │ │
* * * * *
```

## Common Schedules

```yaml
# 매일 오전 9시
schedule: "0 9 * * *"

# 평일 오후 5시
schedule: "0 17 * * 1-5"

# 매주 월요일 오전 10시
schedule: "0 10 * * 1"

# 매월 1일 자정
schedule: "0 0 1 * *"

# 매 15분마다
schedule: "*/15 * * * *"

# 매시간
schedule: "0 * * * *"
```

## Task Configuration

```javascript
{
  name: "Daily Report",
  schedule: "0 9 * * *",
  enabled: true,
  timezone: "Asia/Seoul",
  retries: 3,
  timeout: 300000, // 5분
  onSuccess: "notify",
  onFailure: "alert",
  task: async () => {
    // 실행할 작업
  }
}
```

## Features

### 1. 스케줄 관리
- 작업 추가/제거/수정
- 활성화/비활성화
- 일시 중지/재개

### 2. 실행 관리
- 즉시 실행
- 조건부 실행
- 재시도 로직
- 타임아웃 설정

### 3. 모니터링
- 실행 히스토리
- 성공/실패 로그
- 실행 시간 추적
- 알림 설정

## Usage Examples

### 작업 추가
```javascript
scheduler.addTask({
  name: 'daily-backup',
  schedule: '0 0 * * *',
  task: () => backupDatabase()
});
```

### 작업 실행
```javascript
// 즉시 실행
scheduler.runNow('daily-backup');

// 다음 예정 시간
scheduler.getNextRun('daily-backup');

// 실행 히스토리
scheduler.getHistory('daily-backup');
```

## Built-in Tasks

- **daily-cleanup**: 임시 파일 정리
- **weekly-report**: 주간 리포트 생성
- **monthly-backup**: 월간 백업
- **health-check**: 시스템 상태 확인

## Best Practices

- 타임존 명확히 설정
- 재시도 로직 포함
- 실행 시간 제한 설정
- 에러 알림 구성
- 로그 정기 점검
