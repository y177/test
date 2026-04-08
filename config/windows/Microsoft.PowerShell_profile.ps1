# cp949 -> UTF-8 설정 (nlm CLI UnicodeEncodeError 방지)
# 적용일: 2026-04-08
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding  = [System.Text.Encoding]::UTF8
$OutputEncoding           = [System.Text.Encoding]::UTF8
chcp 65001 | Out-Null

# Python UTF-8 모드 (현재 세션 즉시 적용)
$env:PYTHONUTF8       = "1"
$env:PYTHONIOENCODING = "utf-8"
$env:COLORTERM        = "truecolor"
