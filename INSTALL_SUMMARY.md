# VPAX Viewer Extension - Installation & Distribution Summary

## 🚀 Quick Start (Easiest Method)

### Option 1: Automated Installation Script
```powershell
# Run the automated install script
.\install.ps1
```

This will:
- ✅ Check prerequisites (Node.js, VS Code)
- ✅ Install dependencies
- ✅ Compile TypeScript
- ✅ Package the extension
- ✅ Install in VS Code
- ✅ Show next steps

### Option 2: Manual Installation (3 Commands)
```powershell
npm install && npm run compile && npm run package
code --install-extension vpax-viewer-0.1.0.vsix
```

---

## 📦 Local Installation

### Prerequisites
- **Node.js:** 20.x or higher
- **VS Code:** 1.85.0 or higher
- **npm:** 8.x or higher

### Installation Steps

1. **Build the extension:**
   ```powershell
   cd c:\vscode\mcp\vpax-viewer-extension
   npm install
   npm run compile
   npm run package
   ```

2. **Install in VS Code:**
   ```powershell
   code --install-extension vpax-viewer-0.1.0.vsix
   ```
   
   OR use Command Palette:
   - Press `Ctrl+Shift+P`
   - Type "Extensions: Install from VSIX"
   - Select `vpax-viewer-0.1.0.vsix`

3. **Verify:**
   - Reload VS Code (`Ctrl+R`)
   - Open any `.vpax` file
   - The viewer should open automatically

---

## 🐙 GitHub Repository Setup

### Create Repository at github.com/dax-tips

1. **On GitHub:**
   - Go to https://github.com/dax-tips
   - Click "New repository"
   - Name: `vpax-viewer-extension`
   - Description: "VS Code extension for viewing VertiPaq Analyzer (.vpax) files"
   - Visibility: Public
   - Don't initialize with README/License (we have them)

2. **Push from Local:**
   ```powershell
   git init
   git add .
   git commit -m "Initial commit: VPAX Viewer Extension v0.1.0"
   git remote add origin https://github.com/dax-tips/vpax-viewer-extension.git
   git branch -M main
   git push -u origin main
   ```

3. **Create First Release:**
   ```powershell
   git tag -a v0.1.0 -m "Release v0.1.0: Initial release"
   git push origin v0.1.0
   ```

4. **On GitHub:**
   - Go to repository → Releases → "Draft a new release"
   - Tag: v0.1.0
   - Title: "v0.1.0 - Initial Release"
   - Description: Copy from CHANGELOG.md
   - Attach `vpax-viewer-0.1.0.vsix`
   - Click "Publish release"

### Files Already Created
✅ `.gitignore` - Excludes build files, node_modules, etc.
✅ `LICENSE` - MIT License
✅ `.vscodeignore` - Excludes files from VSIX package
✅ `README.md` - Full documentation with features
✅ `PUBLISHING.md` - Complete publishing guide
✅ `CHANGELOG.md` - Version history
✅ `package.json` - Updated with repository URLs

---

## 📢 Publishing to VS Code Marketplace

### Step 1: Get Publisher Account (One-Time Setup)

1. **Create Azure DevOps Account:**
   - Go to https://dev.azure.com
   - Sign in with Microsoft account
   - Create organization

2. **Create Personal Access Token:**
   - Click profile icon → "Personal Access Tokens"
   - Click "New Token"
   - Name: `vscode-marketplace`
   - Organization: All accessible organizations
   - Expiration: 1 year
   - Scopes: **Marketplace → Manage**
   - Click "Create"
   - **SAVE THE TOKEN!** (You can't see it again)

3. **Create Publisher:**
   - Go to https://marketplace.visualstudio.com/manage
   - Sign in with same Microsoft account
   - Click "Create Publisher"
   - ID: `dax-tips` (matches package.json)
   - Name: "DAX Tips"
   - Description: "Power BI and Analysis Services tools"
   - Click "Create"

### Step 2: Publish Extension

```powershell
# Install vsce globally (if not already installed)
npm install -g @vscode/vsce

# Login with your publisher
vsce login dax-tips
# Paste your Personal Access Token when prompted

# Publish (first time)
vsce publish
```

### Step 3: Verify Publication

- **Marketplace URL:** https://marketplace.visualstudio.com/items?itemName=dax-tips.vpax-viewer
- **Test installation:** VS Code → Extensions → Search "VertiPaq Analyzer Viewer"

---

## 📊 Version Management

### Semantic Versioning (SemVer)

Format: `MAJOR.MINOR.PATCH`

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0 → 0.2.0): New features (backwards compatible)
- **PATCH** (0.1.0 → 0.1.1): Bug fixes (backwards compatible)

### Publishing New Versions

**Automatic version bump and publish:**

```powershell
# Patch release (0.1.0 → 0.1.1)
vsce publish patch

# Minor release (0.1.0 → 0.2.0)
vsce publish minor

# Major release (0.1.0 → 1.0.0)
vsce publish major
```

**Complete release workflow:**

```powershell
# 1. Make changes and test
npm run compile
# Test with F5 in VS Code

# 2. Update CHANGELOG.md with changes

# 3. Commit changes
git add .
git commit -m "Add feature: XYZ"

# 4. Publish new version (auto-increments)
vsce publish minor

# 5. Push to GitHub
git push origin main

# 6. Tag and create GitHub release
git tag -a v0.2.0 -m "Release v0.2.0"
git push origin v0.2.0
```

---

## 📋 Current Status

### ✅ Completed
- [x] Extension fully functional
- [x] All features implemented and tested
- [x] README.md updated with comprehensive docs
- [x] LICENSE created (MIT)
- [x] .gitignore configured
- [x] .vscodeignore configured
- [x] package.json updated with repository info
- [x] PUBLISHING.md guide created
- [x] Automated install script created
- [x] Ready for local installation
- [x] Ready for GitHub publishing
- [x] Ready for Marketplace publishing

### 📦 Package Information
- **Name:** vpax-viewer
- **Publisher:** dax-tips
- **Version:** 0.1.0
- **Display Name:** VertiPaq Analyzer Viewer
- **Package File:** vpax-viewer-0.1.0.vsix

### 🔗 URLs (After Publishing)
- **GitHub:** https://github.com/dax-tips/vpax-viewer-extension
- **Marketplace:** https://marketplace.visualstudio.com/items?itemName=dax-tips.vpax-viewer
- **Issues:** https://github.com/dax-tips/vpax-viewer-extension/issues

---

## 🎯 Next Steps Checklist

### For Local Installation:
- [ ] Run `.\install.ps1` OR manually build and install
- [ ] Reload VS Code
- [ ] Test with a .vpax file

### For GitHub Publishing:
- [ ] Create repository on github.com/dax-tips
- [ ] Initialize git and push code
- [ ] Create v0.1.0 release
- [ ] Attach VSIX file to release

### For Marketplace Publishing:
- [ ] Create Azure DevOps account
- [ ] Generate Personal Access Token
- [ ] Create publisher "dax-tips"
- [ ] Install vsce: `npm install -g @vscode/vsce`
- [ ] Login: `vsce login dax-tips`
- [ ] Publish: `vsce publish`
- [ ] Verify on marketplace

---

## 📚 Documentation Files

All documentation is in the repository:

- **README.md** - Main documentation with features, installation, usage
- **PUBLISHING.md** - Complete step-by-step publishing guide
- **CHANGELOG.md** - Version history
- **LICENSE** - MIT License
- **QUICKSTART.md** - Quick start for users
- **INSTALL_SUMMARY.md** - This file (quick reference)

---

## 🆘 Troubleshooting

### Extension doesn't appear after installation
```powershell
# Reload VS Code
# Press: Ctrl+R (Windows) or Cmd+R (Mac)

# Check installed extensions
code --list-extensions | Select-String "vpax"
```

### Can't publish to marketplace
```powershell
# Check you're logged in
vsce logout
vsce login dax-tips

# Verify package.json has correct publisher
# Should be: "publisher": "dax-tips"
```

### Git push fails
```powershell
# Check remote is set correctly
git remote -v

# If wrong, update it
git remote set-url origin https://github.com/dax-tips/vpax-viewer-extension.git
```

---

## 💡 Pro Tips

1. **Test before publishing:** Always test the VSIX file locally before publishing to marketplace
2. **Version control:** Use git tags for every release
3. **Changelog:** Keep CHANGELOG.md updated with every version
4. **GitHub releases:** Attach VSIX files to GitHub releases for easy distribution
5. **Auto-increment:** Use `vsce publish minor/patch/major` to auto-bump versions

---

## 🎉 Success Indicators

You'll know everything worked when:

✅ **Local Installation:**
- Extension appears in VS Code Extensions list
- `.vpax` files open with custom viewer
- All tabs work (Tables, Columns, Relationships, Partitions)
- Sorting and search work

✅ **GitHub:**
- Repository visible at github.com/dax-tips/vpax-viewer-extension
- Code pushed successfully
- Release v0.1.0 created with VSIX attached

✅ **Marketplace:**
- Extension searchable in VS Code Extensions
- Installable with one click
- Shows up on marketplace website
- Version number correct

---

## 📞 Support

- **Issues:** https://github.com/dax-tips/vpax-viewer-extension/issues
- **Discussions:** https://github.com/dax-tips/vpax-viewer-extension/discussions
- **Website:** https://dax.tips

---

**Ready to share your extension with the world!** 🚀
