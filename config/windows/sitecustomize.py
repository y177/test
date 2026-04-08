"""
sitecustomize.py - Windows cp949 환경에서 rich UnicodeEncodeError 방지
위치: C:\\Python314\\Lib\\sitecustomize.py  (nlm venv에서도 로드됨)
uv tool upgrade 시 이 파일은 영향받지 않음 -> 영구 적용
적용일: 2026-04-08
"""
import sys

# 이중 실행 방지 guard (import 캐시 우회 등의 엣지 케이스 대비)
if hasattr(sys, "_sitecustomize_windows_utf8_applied"):
    pass
else:
    sys._sitecustomize_windows_utf8_applied = True

    def _reconfigure_stdio() -> None:
        """stdout/stderr 인코딩을 UTF-8로 재설정.

        PYTHONUTF8=1 환경변수가 현재 세션에 없어도 즉시 동작.
        - stdout: errors='replace'  — 터미널 출력은 가독성 우선, ? 대체 허용
        - stderr: errors='backslashreplace' — 에러 메시지는 \\uXXXX 형태로 보존
        """
        configs = [
            (sys.stdout, "utf-8", "replace"),
            (sys.stderr, "utf-8", "backslashreplace"),
        ]
        for stream, enc, errors in configs:
            try:
                if hasattr(stream, "reconfigure"):
                    stream.reconfigure(encoding=enc, errors=errors)
            except Exception:
                pass

    def _enable_windows_vt() -> bool:
        """Windows 콘솔 코드페이지를 UTF-8로 변경하고 VT 처리를 활성화.

        SetConsoleOutputCP(65001): 콘솔 코드페이지를 UTF-8로 변경.
        subprocess나 C 확장이 콘솔에 직접 쓸 때도 cp949 깨짐 방지.
        SetConsoleMode VT 플래그: rich의 detect_legacy_windows() = False 유도.
        파이프/리다이렉트 환경에서는 GetConsoleMode 실패 -> 정상 스킵.
        """
        try:
            import ctypes
            import ctypes.wintypes

            kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)

            # argtypes/restype 명시 (미선언 시 c_int 기본값 -> 64bit 핸들 잘림)
            kernel32.GetStdHandle.restype = ctypes.wintypes.HANDLE
            kernel32.GetStdHandle.argtypes = [ctypes.wintypes.DWORD]
            kernel32.GetConsoleMode.restype = ctypes.wintypes.BOOL
            kernel32.GetConsoleMode.argtypes = [
                ctypes.wintypes.HANDLE,
                ctypes.POINTER(ctypes.wintypes.DWORD),
            ]
            kernel32.SetConsoleMode.restype = ctypes.wintypes.BOOL
            kernel32.SetConsoleMode.argtypes = [
                ctypes.wintypes.HANDLE,
                ctypes.wintypes.DWORD,
            ]
            kernel32.SetConsoleOutputCP.restype = ctypes.wintypes.BOOL
            kernel32.SetConsoleOutputCP.argtypes = [ctypes.wintypes.UINT]
            kernel32.SetConsoleCP.restype = ctypes.wintypes.BOOL
            kernel32.SetConsoleCP.argtypes = [ctypes.wintypes.UINT]

            # 콘솔 코드페이지를 UTF-8(65001)로 변경
            # Python stdout과 별개로 콘솔 API 레벨에서 근본 해결
            UTF8_CODEPAGE = 65001
            kernel32.SetConsoleOutputCP(ctypes.wintypes.UINT(UTF8_CODEPAGE))
            kernel32.SetConsoleCP(ctypes.wintypes.UINT(UTF8_CODEPAGE))

            # INVALID_HANDLE_VALUE: 64bit = 0xFFFFFFFFFFFFFFFF
            # c_ulong(-1) = 0xFFFFFFFF (32bit) 이므로 HANDLE 타입으로 비교
            INVALID_HANDLE_VALUE = ctypes.wintypes.HANDLE(-1).value
            ENABLE_VT_PROCESSING = 0x0004
            ENABLE_PROCESSED_OUTPUT = 0x0001

            activated = False
            for nStdHandle in (
                ctypes.wintypes.DWORD(-11),   # STD_OUTPUT_HANDLE
                ctypes.wintypes.DWORD(-12),   # STD_ERROR_HANDLE
            ):
                h = kernel32.GetStdHandle(nStdHandle)
                if not h or h == INVALID_HANDLE_VALUE:
                    continue
                mode = ctypes.wintypes.DWORD(0)
                if not kernel32.GetConsoleMode(h, ctypes.byref(mode)):
                    continue  # 파이프/리다이렉트 환경 — 정상 스킵
                new_mode = mode.value | ENABLE_VT_PROCESSING | ENABLE_PROCESSED_OUTPUT
                if kernel32.SetConsoleMode(h, ctypes.wintypes.DWORD(new_mode)):
                    activated = True

            return activated

        except Exception:
            return False

    def _patch_rich_console() -> bool:
        """rich.console의 legacy_windows 캐시와 감지 함수를 직접 패치.

        패치 성공 여부를 반환해 호출부에서 검증 가능.
        _enable_windows_vt()가 파이프 환경에서 실패해도 이 패치가 동작.
        """
        try:
            import rich.console as _rc
            from rich._windows import WindowsConsoleFeatures as _WCF

            # 모듈 수준 캐시를 vt=True로 설정
            # get_windows_console_features()가 캐시 히트 -> detect_legacy_windows() = False
            _rc._windows_console_features = _WCF(vt=True, truecolor=True)

            # 캐시를 우회하는 직접 호출에도 대비해 함수 자체도 패치
            _rc.detect_legacy_windows = lambda: False

            # 패치 검증: 실제로 False를 반환하는지 확인
            if _rc.detect_legacy_windows() is not False:
                return False
            if _rc._windows_console_features.vt is not True:
                return False

            return True

        except Exception:
            return False

    def _setup_windows_utf8() -> None:
        """Windows cp949 환경에서 UTF-8 출력을 보장하는 진입점."""
        if sys.platform != "win32":
            return

        _reconfigure_stdio()          # 1순위: stdout/stderr 인코딩 강제 변경
        _enable_windows_vt()          # 2순위: 콘솔 CP 65001 + VT 활성화
        ok = _patch_rich_console()    # 3순위: rich 모듈 직접 패치

        # 패치 실패 시 stderr에 경고 (조용히 묻히지 않도록)
        if not ok:
            print(
                "[sitecustomize] WARNING: rich console patch failed."
                " UnicodeEncodeError may occur.",
                file=sys.stderr,
            )

    _setup_windows_utf8()
