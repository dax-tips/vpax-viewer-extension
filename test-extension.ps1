# Test VPAX Viewer Extension in Clean Environment

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Testing VPAX Viewer in Fresh VS Code" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Find a VPAX file
$vpaxFile = Get-ChildItem -Filter "*.vpax" | Select-Object -First 1

if (-not $vpaxFile) {
    Write-Host "❌ No .vpax file found in current directory" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please copy a .vpax file to this directory and run again." -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ Found VPAX file: $($vpaxFile.Name)" -ForegroundColor Green
Write-Host ""

# Create a temporary test directory
$testDir = Join-Path $env:TEMP "vpax-test-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
New-Item -ItemType Directory -Path $testDir -Force | Out-Null

# Copy the VPAX file to test directory
Copy-Item $vpaxFile.FullName -Destination $testDir

Write-Host "✓ Created test directory: $testDir" -ForegroundColor Green
Write-Host "✓ Copied VPAX file to test directory" -ForegroundColor Green
Write-Host ""

Write-Host "Opening fresh VS Code window..." -ForegroundColor Yellow
Write-Host ""
Write-Host "IMPORTANT: This will open a NEW VS Code window." -ForegroundColor Cyan
Write-Host "Do NOT test in the extension development window!" -ForegroundColor Cyan
Write-Host ""
Write-Host "In the new window:" -ForegroundColor Yellow
Write-Host "1. Wait for the window to fully load" -ForegroundColor White
Write-Host "2. Open the .vpax file from the Explorer" -ForegroundColor White
Write-Host "3. You should see a loading spinner, then the content" -ForegroundColor White
Write-Host ""

# Open a new VS Code window with the test directory
Start-Process code -ArgumentList $testDir

Write-Host "✓ New VS Code window opened!" -ForegroundColor Green
Write-Host ""
Write-Host "Test directory: $testDir" -ForegroundColor Gray
Write-Host "VPAX file: $($vpaxFile.Name)" -ForegroundColor Gray
Write-Host ""
