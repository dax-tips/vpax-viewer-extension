# VPAX Viewer Extension - Quick Start Installation Script

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "VPAX Viewer Extension - Quick Install" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js not found. Please install Node.js from https://nodejs.org" -ForegroundColor Red
    exit 1
}

# Check if VS Code is installed
try {
    $codeVersion = code --version
    Write-Host "✓ VS Code installed" -ForegroundColor Green
} catch {
    Write-Host "✗ VS Code not found. Please install VS Code from https://code.visualstudio.com" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Dependencies installed" -ForegroundColor Green

Write-Host ""
Write-Host "Compiling TypeScript..." -ForegroundColor Yellow
npm run compile

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to compile" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Compilation successful" -ForegroundColor Green

Write-Host ""
Write-Host "Packaging extension..." -ForegroundColor Yellow
npm run package

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to package" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Package created" -ForegroundColor Green

# Find the VSIX file
$vsixFile = Get-ChildItem -Filter "*.vsix" | Select-Object -First 1

if (-not $vsixFile) {
    Write-Host "✗ VSIX file not found" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Installing extension in VS Code..." -ForegroundColor Yellow
code --install-extension $vsixFile.Name

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Failed to install extension" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✓ Installation Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "The VPAX Viewer extension has been installed successfully!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Reload VS Code (Ctrl+R or Cmd+R)" -ForegroundColor White
Write-Host "2. Open any .vpax file" -ForegroundColor White
Write-Host "3. The VertiPaq Analyzer viewer will open automatically" -ForegroundColor White
Write-Host ""
Write-Host "Extension file: $($vsixFile.Name)" -ForegroundColor Gray
Write-Host ""
