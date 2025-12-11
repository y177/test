# 특정 서버 비활성화
  --no-c7          # Context7 비활성화
  --no-seq         # Sequential 비활성화
  --no-magic       # Magic 비활성화
  --no-play        # Playwright 비활성화
  --no-ultra-mcp   # Ultra MCP 비활성화

  # 모든 MCP 서버 비활성화
  --no-mcp         # 모든 MCP 서버 비활성화 (40-60% 빠른 실행)    

  사용 예시

  # Context7과 Sequential만 비활성화
  claude --no-c7 --no-seq "코드 분석해줘"

  # 모든 MCP 서버 비활성화 (네이티브 도구만 사용)
  claude --no-mcp "빠르게 파일 읽어줘"

  # Ultra MCP만 비활성화
  claude --no-ultra-mcp "일반 분석만 해줘"

  비활성화 효과

  - 개별 비활성화: 서버별로 10-30% 속도 향상
  - 전체 비활성화 (--no-mcp): 40-60% 속도 향상
  - 폴백 전략: 비활성화된 서버의 기능은 다른 도구로 대체

  현재 세션에서 특정 MCP 서버를 사용하고 싶지 않다면, 이
  플래그들을 프롬프트에 추가하시면 됩니다!
  