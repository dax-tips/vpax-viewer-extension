# 🐛 Debug the Extension Hanging Issue

## 📦 Install Debug Version

```powershell
# Uninstall any existing version
code --uninstall-extension dax-tips.vpax-viewer

# Install the debug version with extensive logging
code --install-extension vpax-viewer-0.1.2-debug.vsix

# Verify installation
code --list-extensions | Select-String "vpax"
```

## 🔍 How to View Extension Logs

### Method 1: VS Code Developer Console (Recommended)

1. **Open a fresh VS Code window** (NOT this development workspace)
2. **Open Developer Tools**: 
   - Menu: `Help` → `Toggle Developer Tools`
   - Or press: `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
3. **Click the "Console" tab** in Developer Tools
4. **Clear existing logs**: Click the clear button (🚮) or press `Ctrl+L`
5. **Open your VPAX file**
6. **Watch the console** - you'll see detailed logs with `[VPAX]` prefix

### Method 2: Extension Host Logs

1. **Open Command Palette**: `Ctrl+Shift+P`
2. **Type**: "Developer: Show Running Extensions"
3. **Find**: "VertiPaq Analyzer Viewer" in the list
4. **Click the output link** to see extension host logs

### Method 3: Output Panel

1. **Open Output Panel**: `View` → `Output` or `Ctrl+Shift+U`
2. **Select**: "Extension Host" from the dropdown
3. **Look for**: `[VPAX]` prefixed messages

## 📋 Test Procedure

### Step 1: Clean Install
```powershell
# Clean slate
code --uninstall-extension dax-tips.vpax-viewer
code --install-extension vpax-viewer-0.1.2-debug.vsix
```

### Step 2: Open Fresh VS Code
```powershell
# Close this development window, then:
mkdir C:\temp\vpax-debug-test
copy "your-file.vpax" C:\temp\vpax-debug-test\
code C:\temp\vpax-debug-test
```

### Step 3: Enable Logging
1. Open Developer Tools (`Ctrl+Shift+I`)
2. Go to Console tab
3. Clear existing logs
4. Keep the console visible

### Step 4: Open VPAX File
1. In the fresh VS Code window, open the `.vpax` file
2. **Watch the console logs in real-time**
3. **Note where the logs stop** (this tells us where it hangs)

## 🔍 What to Look For

### ✅ Expected Log Sequence (if working):
```
[VPAX] 🚀 Extension activation started
[VPAX] 📝 Registering custom editor provider  
[VPAX] ✅ Custom editor provider registered successfully
[VPAX] 🔧 Registering command
[VPAX] ✅ Command registered successfully
[VPAX] 🎉 Extension activation completed successfully
[VPAX] 📄 openCustomDocument called for: C:\path\to\file.vpax
[VPAX] ✅ Custom document created
[VPAX] 🎨 resolveCustomEditor called for: C:\path\to\file.vpax
[VPAX] ⚙️ Configuring webview options
[VPAX] ✅ Webview configured
[VPAX] ⏳ Setting loading screen
[VPAX] ✅ Loading screen displayed
[VPAX] 🔍 Starting VPAX file parsing
[VPAX] 📦 Parser created, calling parse()...
[VPAX] 🔍 VpaxParser.parse() started for file: C:\path\to\file.vpax
[VPAX] 📁 Checking if file exists...
[VPAX] ✅ File exists and is accessible
[VPAX] 📖 Reading file into memory...
[VPAX] ✅ File read completed in XXXms. Size: XXXXX bytes
[VPAX] 📦 Loading ZIP archive...
[VPAX] ✅ ZIP loaded in XXXms
[VPAX] 🔍 Looking for DaxVpaView.json...
[VPAX] 📄 Found DaxVpaView.json, parsing...
[VPAX] ✅ DaxVpaView.json parsed successfully
[VPAX] 🔍 Looking for DaxModel.json...
[VPAX] 📄 Found DaxModel.json, parsing...
[VPAX] ✅ DaxModel.json parsed successfully
[VPAX] 🔍 Looking for Model.bim...
[VPAX] 📄 Found Model.bim, parsing...
[VPAX] ✅ Model.bim parsed successfully
[VPAX] 🏗️ Building data structure...
[VPAX] 🏗️ buildVpaxData started
[VPAX] ✅ Data structure built in XXXms
[VPAX] 📊 Result: XX tables, XXX columns
[VPAX] ✅ Parsing completed in XXXms
[VPAX] 🎨 Generating HTML for webview
[VPAX] ✅ HTML generated in XXXms
[VPAX] 🎉 Editor resolved successfully
```

### ❌ Where It Might Hang:
1. **After "Extension activation started"** → Registration issue
2. **After "Parser created, calling parse()..."** → File access issue
3. **After "Reading file into memory..."** → File I/O hanging
4. **After "Loading ZIP archive..."** → ZIP parsing issue
5. **After "Building data structure..."** → Data processing hanging
6. **After "Generating HTML for webview"** → HTML generation issue

## 🎯 Quick Test Commands

### All-in-One Debug Test:
```powershell
# Run this to do everything in one command:
code --uninstall-extension dax-tips.vpax-viewer; code --install-extension vpax-viewer-0.1.2-debug.vsix; Start-Process code -ArgumentList "C:\temp"
```

### Manual Step-by-Step:
```powershell
# 1. Clean install
code --uninstall-extension dax-tips.vpax-viewer
code --install-extension vpax-viewer-0.1.2-debug.vsix

# 2. Create test directory with VPAX file
mkdir C:\temp\vpax-test -Force
copy "CrossTabWorkingQuery.vpax" C:\temp\vpax-test\

# 3. Open fresh VS Code (close this window first!)
code C:\temp\vpax-test
```

## 🔧 Troubleshooting by Log Position

### If logs stop at "Extension activation started":
- Extension registration is failing
- Possible VS Code API issue

### If logs stop at "calling parse()":
- File path or permissions issue
- Try with a different VPAX file

### If logs stop at "Reading file into memory":
- File I/O is still blocking despite async
- Possible corrupted VPAX file

### If logs stop at "Loading ZIP archive":
- JSZip is hanging on malformed ZIP
- Try with a different VPAX file

### If logs stop at "Building data structure":
- Data processing loop is hanging
- Possible infinite loop in data parsing

### If logs stop at "Generating HTML":
- HTML generation is too complex/large
- Webview content is hanging

## 📊 Report Back

Once you run the test, please share:

1. **Last log message you see** before it hangs
2. **How long you waited** before considering it hung
3. **VPAX file size** (in MB)
4. **Any error messages** in the console
5. **VS Code version** (`Help` → `About`)

This will pinpoint exactly where the issue is! 🎯

## 🚀 Quick Start

```powershell
# One command to test:
.\test-extension-debug.ps1
```

(I'll create this script next if the manual steps are too much)