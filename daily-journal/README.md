# 📔 Daily Journal

일일 저널 작성 및 분석을 자동화하는 도구입니다.

## ✨ 주요 기능

- 🌅 **아침 저널**: 하루를 시작하는 모닝 루틴
- 🌙 **저녁 저널**: 하루를 돌아보는 이브닝 루틴
- 📊 **감정 추적**: 기분과 감정 패턴 분석
- 🎯 **목표 관리**: 일일 목표 설정 및 추적
- 📈 **분석 리포트**: 주간/월간 회고 및 인사이트
- 🔍 **검색 기능**: 과거 일기 검색 및 회고

## 🚀 시작하기

### 1. 설치

```bash
npm install
```

### 2. 환경 설정

`.env` 파일 생성:

```env
JOURNAL_DIR=./entries
TEMPLATE_DIR=./templates
TIMEZONE=Asia/Seoul
```

### 3. 첫 일기 작성

```bash
# 아침 저널
npm run morning

# 저녁 저널
npm run evening
```

## 📖 사용 방법

### 아침 루틴

```bash
npm run morning
```

프롬프트:
- 오늘의 기분 (1-10)
- 오늘의 목표 3가지
- 감사한 일
- 아침 생각

### 저녁 루틴

```bash
npm run evening
```

프롬프트:
- 오늘의 하이라이트
- 목표 달성도
- 감사한 일 3가지
- 배운 점
- 개선할 점

### 분석 및 회고

```bash
# 주간 리뷰
npm run weekly-review

# 월간 리뷰
npm run monthly-review

# 종합 분석
npm run analyze
```

### 과거 일기 검색

```bash
npm run search
```

## 📝 일기 구조

### Front Matter

```yaml
---
date: 2025-12-04
type: morning
mood: 8
weather: sunny
tags: [productive, grateful]
---
```

### 템플릿

#### 아침 저널
- 오늘의 기분
- 오늘의 목표
- 감사한 일
- 아침 생각

#### 저녁 저널
- 오늘의 하이라이트
- 목표 달성도
- 감사한 일 3가지
- 배운 점
- 개선할 점

## 🛠️ Claude Code Skills

- **Journal Writer**: 일기 작성 및 관리
- **Journal Analyzer**: 일기 분석 및 인사이트

## 📚 MCP Servers

- **@modelcontextprotocol/server-filesystem**: 일기 파일 관리
- **@modelcontextprotocol/server-time**: 날짜 및 시간 관리

## 📊 분석 기능

### 감정 추적
- 기분 점수 추이 그래프
- 감정 패턴 인식
- 스트레스 요인 분석

### 목표 달성도
- 일일 목표 달성률
- 주간/월간 성취도
- 목표 카테고리별 분석

### 활동 패턴
- 생산적인 날 vs 비생산적인 날
- 시간 사용 패턴
- 습관 형성 추적

## 💡 일기 작성 팁

### 일관성
- 매일 같은 시간에 작성
- 짧게라도 매일 기록
- 루틴으로 만들기

### 솔직함
- 감정을 솔직하게 표현
- 부정적 감정도 기록
- 자기 검열 최소화

### 구체성
- 구체적인 사건 기록
- 감정의 원인 파악
- 배운 점 명확히 정리

### 회고
- 정기적으로 과거 일기 읽기
- 패턴과 성장 확인
- 감사하기

## 📁 디렉토리 구조

```
entries/
├── 2025/
│   ├── 12/
│   │   ├── 2025-12-01-morning.md
│   │   ├── 2025-12-01-evening.md
│   │   └── ...
│   └── ...
└── ...

templates/
├── morning.md
├── evening.md
└── free-form.md
```

## 🔒 개인정보 보호

- 로컬에만 저장
- Git에 커밋 시 주의
- 민감 정보 암호화 옵션
- 백업 권장

## 📄 라이선스

MIT
