# Debug Test Script for VPAX Extension

Write-Host "========================================" -ForegroundColor Red
Write-Host "🐛 VPAX Extension Debug Test" -ForegroundColor Red  
Write-Host "========================================" -ForegroundColor Red
Write-Host ""

# Clean install debug version
Write-Host "🧹 Cleaning previous installation..." -ForegroundColor Yellow
code --uninstall-extension dax-tips.vpax-viewer 2>$null

Write-Host "📦 Installing debug version..." -ForegroundColor Yellow
code --install-extension vpax-viewer-0.1.2-debug.vsix

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install debug extension" -ForegroundColor Red
    exit 1
}

# Check installation
$installed = code --list-extensions | Select-String "dax-tips.vpax-viewer"
if ($installed) {
    Write-Host "✅ Debug extension installed: $installed" -ForegroundColor Green
} else {
    Write-Host "❌ Extension not found in installed list" -ForegroundColor Red
    exit 1
}

# Find VPAX file
$vpaxFile = Get-ChildItem -Filter "*.vpax" | Select-Object -First 1
if (-not $vpaxFile) {
    Write-Host "❌ No .vpax file found in current directory" -ForegroundColor Red
    Write-Host "Please add a .vpax file and run again." -ForegroundColor Yellow
    exit 1
}

$fileSize = [math]::Round($vpaxFile.Length / 1MB, 2)
Write-Host "✅ Found VPAX file: $($vpaxFile.Name) ($fileSize MB)" -ForegroundColor Green

# Create test directory
$testDir = "C:\temp\vpax-debug-$(Get-Date -Format 'HHmmss')"
New-Item -ItemType Directory -Path $testDir -Force | Out-Null
Copy-Item $vpaxFile.FullName -Destination $testDir

Write-Host "✅ Created test directory: $testDir" -ForegroundColor Green
Write-Host ""

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🔍 DEBUGGING INSTRUCTIONS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "A new VS Code window will open. Follow these steps:" -ForegroundColor White
Write-Host ""
Write-Host "1. 🔧 Open Developer Tools:" -ForegroundColor Yellow
Write-Host "   • Menu: Help → Toggle Developer Tools" -ForegroundColor Gray
Write-Host "   • Or press: Ctrl+Shift+I" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 📊 Go to Console tab in Developer Tools" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. 🧹 Clear existing logs (click 🚮 or press Ctrl+L)" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. 📂 Open the VPAX file: $($vpaxFile.Name)" -ForegroundColor Yellow
Write-Host ""
Write-Host "5. 👀 Watch the console logs in real-time" -ForegroundColor Yellow
Write-Host "   • Look for [VPAX] prefixed messages" -ForegroundColor Gray
Write-Host "   • Note where the logs STOP if it hangs" -ForegroundColor Gray
Write-Host ""
Write-Host "6. ⏱️ Wait at least 30 seconds if it seems stuck" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "📋 WHAT TO REPORT BACK:" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "• Last log message before hanging" -ForegroundColor White
Write-Host "• How long you waited" -ForegroundColor White
Write-Host "• File size: $fileSize MB" -ForegroundColor White
Write-Host "• Any error messages in red" -ForegroundColor White
Write-Host ""

Write-Host "Opening VS Code..." -ForegroundColor Cyan
Start-Process code -ArgumentList $testDir

Write-Host ""
Write-Host "✅ Debug test setup complete!" -ForegroundColor Green
Write-Host "📂 Test directory: $testDir" -ForegroundColor Gray
Write-Host "📄 VPAX file: $($vpaxFile.Name)" -ForegroundColor Gray
Write-Host "📊 File size: $fileSize MB" -ForegroundColor Gray
Write-Host ""