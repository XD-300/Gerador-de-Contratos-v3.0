@echo off
echo 🔄 Preparando versao offline...
echo.

REM Criar pasta libs se não existir
if not exist "libs" mkdir libs

echo 📥 Baixando bibliotecas necessarias...
echo.

REM Instruções para baixar manualmente (Windows não tem wget por padrão)
echo Para usar 100%% offline, baixe estes arquivos:
echo.
echo 1. jsPDF:
echo    URL: https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js
echo    Salve como: libs/jspdf.umd.min.js
echo.
echo 2. PizZip:
echo    URL: https://unpkg.com/pizzip@3.1.7/dist/pizzip.min.js
echo    Salve como: libs/pizzip.min.js
echo.
echo 3. Docxtemplater:
echo    URL: https://unpkg.com/docxtemplater@3.44.0/build/docxtemplater.js
echo    Salve como: libs/docxtemplater.js
echo    Salvar como: libs\jspdf.min.js
echo.
echo 2. docx:
echo    URL: https://cdn.jsdelivr.net/npm/docx@7.8.2/build/index.js
echo    Salvar como: libs\docx.min.js
echo.
echo 3. Depois execute: setup-offline.bat
echo.
echo ✅ Ou use a versao online atual que só precisa de internet para exportar.
pause