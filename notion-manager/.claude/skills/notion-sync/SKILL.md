---
name: "Notion Sync"
description: "로컬 파일과 Notion 간의 양방향 동기화 스킬"
---

## Description

로컬 파일 시스템과 Notion 간의 콘텐츠를 동기화합니다. Markdown 파일을 Notion 페이지로 변환하거나 그 반대로 변환할 수 있습니다.

## When to Use

- 로컬 Markdown 파일을 Notion으로 업로드할 때
- Notion 페이지를 로컬로 백업할 때
- 일괄 콘텐츠 마이그레이션이 필요할 때

## How to Use

1. 동기화 방향 결정 (로컬→Notion 또는 Notion→로컬)
2. 대상 파일/페이지 식별
3. 콘텐츠 변환 및 동기화 실행
4. 결과 확인 및 로그 생성

## Sync Strategies

- **One-way sync**: 한 방향으로만 동기화
- **Two-way sync**: 양방향 동기화 (충돌 해결 필요)
- **Scheduled sync**: 정기적 자동 동기화

## Best Practices

- 동기화 전 항상 백업 생성
- 충돌 발생 시 사용자에게 확인 요청
- 동기화 로그 유지
