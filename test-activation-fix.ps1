# Quick Test for Activation Fix

Write-Host "========================================" -ForegroundColor Green
Write-Host "🔧 Testing Activation Fix (v0.1.3)" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Clean install
Write-Host "🧹 Uninstalling previous version..." -ForegroundColor Yellow
code --uninstall-extension dax-tips.vpax-viewer 2>$null

Write-Host "📦 Installing activation fix version..." -ForegroundColor Yellow
code --install-extension vpax-viewer-0.1.3-debug.vsix

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Installation failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Installed v0.1.3-debug with activation fix" -ForegroundColor Green
Write-Host ""

# Find VPAX file
$vpaxFile = Get-ChildItem -Filter "*.vpax" | Select-Object -First 1
if (-not $vpaxFile) {
    Write-Host "❌ No .vpax file found" -ForegroundColor Red
    exit 1
}

# Create test directory  
$testDir = "C:\temp\vpax-activation-test"
if (Test-Path $testDir) { Remove-Item $testDir -Recurse -Force }
New-Item -ItemType Directory -Path $testDir -Force | Out-Null
Copy-Item $vpaxFile.FullName -Destination $testDir

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🔍 ACTIVATION TEST PROCEDURE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 🔧 Open Developer Tools (Ctrl+Shift+I)" -ForegroundColor Yellow
Write-Host "2. 👀 Check if 'VertiPaq Analyzer Viewer' shows as 'Activating'" -ForegroundColor Yellow
Write-Host "   Command Palette → 'Developer: Show Running Extensions'" -ForegroundColor Gray
Write-Host "3. 📊 Watch console for activation logs" -ForegroundColor Yellow
Write-Host "4. 📂 Try opening the VPAX file" -ForegroundColor Yellow
Write-Host ""
Write-Host "Expected: Extension should activate quickly without hanging!" -ForegroundColor Green
Write-Host ""

Start-Process code -ArgumentList $testDir

Write-Host "✅ Test environment ready!" -ForegroundColor Green
Write-Host "📂 Directory: $testDir" -ForegroundColor Gray
Write-Host "📄 File: $($vpaxFile.Name)" -ForegroundColor Gray
Write-Host ""