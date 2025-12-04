---
name: "Expense Tracker"
description: "지출을 추적하고 분석하는 스킬"
---

## Description

일상적인 지출을 기록하고, 카테고리별로 분류하며, 지출 패턴을 분석합니다.

## When to Use

- 새로운 지출을 기록할 때
- 지출 내역을 조회할 때
- 카테고리별 지출 통계를 확인할 때
- 예산 대비 지출을 비교할 때

## How to Use

1. 지출 정보 입력 (금액, 카테고리, 날짜, 설명)
2. 데이터베이스에 저장
3. 필요시 영수증 이미지 첨부
4. 월간/연간 리포트 생성

## Expense Categories

### 고정 지출
- 🏠 주거 (월세, 관리비)
- 📱 통신비
- 💡 공과금
- 🚗 교통비 (정기권)
- 📚 구독 서비스

### 변동 지출
- 🍔 식비
- ☕ 카페/간식
- 🛒 생활용품
- 👕 쇼핑
- 🎬 문화생활
- 💊 의료비
- 🎓 교육
- 💸 기타

## Usage Examples

```javascript
// 지출 추가
addExpense({
  amount: 15000,
  category: '식비',
  date: '2025-12-04',
  description: '저녁 식사',
  paymentMethod: '신용카드'
});

// 월간 지출 조회
getMonthlyExpenses('2025-12');

// 카테고리별 통계
getCategoryStats('2025-12');
```

## Best Practices

- 지출 발생 즉시 기록
- 정확한 카테고리 분류
- 정기적인 리포트 확인
- 예산 설정 및 모니터링
