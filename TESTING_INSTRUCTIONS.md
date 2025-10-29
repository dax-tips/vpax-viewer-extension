# ⚠️ IMPORTANT: How to Test the Extension Properly

## 🚫 The Problem You're Experiencing

**You CANNOT test an installed extension in the same VS Code window where you're developing it!**

This causes conflicts:
- The development version (debug mode with F5) registers handlers for `.vpax` files
- The installed version also tries to register handlers for `.vpax` files
- Both versions conflict, causing the hang you're seeing
- VS Code gets confused about which version to use

## ✅ Correct Testing Procedure

### Method 1: Use the Test Script (Easiest)

```powershell
# Make sure you have a .vpax file in this directory
.\test-extension.ps1
```

This will:
1. Create a temporary test directory
2. Copy your VPAX file there
3. Open a **NEW** VS Code window with that directory
4. Test the extension in isolation

### Method 2: Manual Testing

1. **Close this VS Code window** (the development workspace)

2. **Open a completely different folder** in VS Code:
   ```powershell
   # Example: Open your Documents folder
   code "$env:USERPROFILE\Documents"
   
   # Or create a test folder
   mkdir C:\temp\vpax-test
   code C:\temp\vpax-test
   ```

3. **Copy a VPAX file** to that folder

4. **Open the VPAX file** in the new VS Code window

5. **Expected behavior:**
   - ✅ You see a loading spinner immediately
   - ✅ The UI stays responsive
   - ✅ The VPAX content loads and displays

### Method 3: Open File Directly

```powershell
# Close this VS Code window first, then:
code "C:\path\to\your\file.vpax"
```

This opens VS Code with just that file (no workspace conflict).

## 🔍 Why Debug Mode Works

When you press **F5** (debug mode):
- VS Code launches a **separate Extension Development Host** window
- This is a completely isolated VS Code instance
- No conflicts with installed extensions
- That's why it works perfectly!

## 📝 Testing Checklist

- [ ] **Uninstall** any old versions first
  ```powershell
  code --uninstall-extension dax-tips.vpax-viewer
  ```

- [ ] **Install** the new version (0.1.1)
  ```powershell
  code --install-extension vpax-viewer-0.1.1.vsix
  ```

- [ ] **Close** the extension development VS Code window

- [ ] **Open** a fresh VS Code window with a different folder

- [ ] **Test** opening a VPAX file

- [ ] **Verify** you see:
  - Loading spinner appears
  - UI remains responsive
  - Content loads properly

## 🐛 Still Hanging?

If it still hangs after following the correct testing procedure:

1. **Check Extension is Installed:**
   ```powershell
   code --list-extensions | Select-String "vpax"
   ```
   Should show: `dax-tips.vpax-viewer`

2. **Check Extension Version:**
   - Open VS Code Extensions panel (Ctrl+Shift+X)
   - Search for "VertiPaq Analyzer Viewer"
   - Verify it shows version **0.1.1**

3. **Enable Extension Logging:**
   - Open VS Code Developer Tools (Help → Toggle Developer Tools)
   - Check the Console tab for errors
   - Look for "VertiPaq Analyzer Viewer is now active!"

4. **Try Reloading VS Code:**
   - Press `Ctrl+R` (or `Cmd+R` on Mac)

## 📊 Expected Timeline

- **Loading small files (<1 MB):** < 1 second
- **Loading medium files (1-5 MB):** 1-3 seconds  
- **Loading large files (>5 MB):** 3-10 seconds

You should see the loading spinner during this time.

## ⚡ Quick Test Command

```powershell
# Uninstall, reinstall, and test in one go
code --uninstall-extension dax-tips.vpax-viewer
code --install-extension vpax-viewer-0.1.1.vsix
.\test-extension.ps1
```

---

**Remember:** Always test installed extensions in a **different VS Code window** than where you're developing them!
