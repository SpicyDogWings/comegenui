@echo off
REM update.bat — Wrapper Windows para update.ps1 (evita el problema de Execution Policy)
REM Uso: update.bat [tag]                 (ej: update.bat v3.0.0)
REM      update.bat -Only CuButton        (solo un componente)
REM      update.bat -Only CuButton,CuAlert v3.0.0

powershell -ExecutionPolicy Bypass -File "%~dp0update.ps1" %*
