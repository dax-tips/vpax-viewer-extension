# Final Test - JSZip Dependency Fix

Write-Host "========================================" -ForegroundColor Green
Write-Host "🔧 FINAL TEST - JSZip Dependency Fix" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

Write-Host "🧹 Uninstalling previous version..." -ForegroundColor Yellow
code --uninstall-extension dax-tips.vpax-viewer 2>$null

Write-Host "📦 Installing FIXED version with JSZip..." -ForegroundColor Yellow
code --install-extension vpax-viewer-0.1.3-debug.vsix

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Installation failed" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Installed v0.1.3-debug with JSZip dependency!" -ForegroundColor Green
Write-Host ""

# Verify installation
$installed = code --list-extensions | Select-String "dax-tips.vpax-viewer"
if ($installed) {
    Write-Host "✅ Extension found: $installed" -ForegroundColor Green
} else {
    Write-Host "❌ Extension not found in installed list" -ForegroundColor Red
    exit 1
}

# Find VPAX file
$vpaxFile = Get-ChildItem -Filter "*.vpax" | Select-Object -First 1
if (-not $vpaxFile) {
    Write-Host "❌ No .vpax file found" -ForegroundColor Red
    Write-Host "Copy a .vpax file to this directory first" -ForegroundColor Yellow
    exit 1
}

$fileSize = [math]::Round($vpaxFile.Length / 1MB, 2)
Write-Host "✅ Found VPAX file: $($vpaxFile.Name) ($fileSize MB)" -ForegroundColor Green

# Create clean test directory
$testDir = "C:\temp\vpax-final-test"
if (Test-Path $testDir) { Remove-Item $testDir -Recurse -Force }
New-Item -ItemType Directory -Path $testDir -Force | Out-Null
Copy-Item $vpaxFile.FullName -Destination $testDir

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎯 FINAL TEST EXPECTATIONS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Extension should ACTIVATE immediately (not hang)" -ForegroundColor Green
Write-Host "✅ No 'Cannot find module jszip' errors" -ForegroundColor Green
Write-Host "✅ VPAX file should open with loading spinner" -ForegroundColor Green
Write-Host "✅ Content should display correctly" -ForegroundColor Green
Write-Host ""
Write-Host "To verify:" -ForegroundColor Yellow
Write-Host "1. Open Developer Tools (Ctrl+Shift+I)" -ForegroundColor White
Write-Host "2. Check 'Developer: Show Running Extensions'" -ForegroundColor White
Write-Host "3. Should show as 'Active' not 'Activating'" -ForegroundColor White
Write-Host "4. Console should show activation logs" -ForegroundColor White
Write-Host "5. Open the VPAX file - should work!" -ForegroundColor White
Write-Host ""

Write-Host "Opening clean VS Code window..." -ForegroundColor Cyan
Start-Process code -ArgumentList $testDir

Write-Host ""
Write-Host "🎉 Ready for final test!" -ForegroundColor Green
Write-Host "📂 Test directory: $testDir" -ForegroundColor Gray
Write-Host "📄 VPAX file: $($vpaxFile.Name)" -ForegroundColor Gray
Write-Host "📊 File size: $fileSize MB" -ForegroundColor Gray
Write-Host "💾 Package size: 563.2 KB (with ALL dependencies included)" -ForegroundColor Gray
Write-Host ""
Write-Host "🎯 This should work perfectly now!" -ForegroundColor Green
Write-Host ""