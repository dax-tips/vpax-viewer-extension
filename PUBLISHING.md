# Publishing Guide for VPAX Viewer Extension

This guide covers everything you need to install, publish, and distribute the VPAX Viewer extension.

## Table of Contents
1. [Local Installation](#local-installation)
2. [GitHub Repository Setup](#github-repository-setup)
3. [Publishing to VS Code Marketplace](#publishing-to-vs-code-marketplace)
4. [Version Management](#version-management)
5. [CI/CD Setup](#cicd-setup)

---

## Local Installation

### Step 1: Package the Extension

```powershell
# Make sure you're in the extension directory
cd c:\vscode\mcp\vpax-viewer-extension

# Install dependencies (if not already done)
npm install

# Compile TypeScript to JavaScript
npm run compile

# Package the extension as a VSIX file
npm run package
```

This creates a file: `vpax-viewer-0.1.0.vsix`

### Step 2: Install in VS Code

**Method A: Using Command Palette**
1. Open VS Code
2. Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
3. Type "Extensions: Install from VSIX"
4. Navigate to `c:\vscode\mcp\vpax-viewer-extension\vpax-viewer-0.1.0.vsix`
5. Click "Install"
6. Reload VS Code when prompted

**Method B: Using Terminal**
```powershell
# Install directly from command line
code --install-extension vpax-viewer-0.1.0.vsix
```

**Method C: Drag and Drop**
1. Open VS Code
2. Go to Extensions view (Ctrl+Shift+X)
3. Drag the `.vsix` file into the Extensions panel

### Step 3: Verify Installation

1. Open any `.vpax` file in VS Code
2. The VertiPaq Analyzer viewer should open automatically
3. Check installed extensions: `Ctrl+Shift+X` → Search for "VertiPaq Analyzer Viewer"

---

## GitHub Repository Setup

### Step 1: Create Repository on GitHub

1. **Go to GitHub:**
   - Navigate to [https://github.com/dax-tips](https://github.com/dax-tips)
   - Click "New repository" (or ask organization owner to create it)

2. **Repository Settings:**
   - **Name:** `vpax-viewer-extension`
   - **Description:** "VS Code extension for viewing VertiPaq Analyzer (.vpax) files"
   - **Visibility:** Public
   - **Initialize:** Don't add README, .gitignore, or license (we have them locally)

3. **Click "Create repository"**

### Step 2: Initialize Local Git Repository

```powershell
# Navigate to the extension directory
cd c:\vscode\mcp\vpax-viewer-extension

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: VPAX Viewer Extension v0.1.0"

# Add remote repository (replace with your actual URL)
git remote add origin https://github.com/dax-tips/vpax-viewer-extension.git

# Set default branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 3: Add Essential Files

Before pushing, make sure you have these files:

**Create `.gitignore`:**
```powershell
# Create .gitignore if it doesn't exist
@"
# Build output
out/
dist/
*.vsix

# Dependencies
node_modules/
.vscode-test/

# TypeScript
*.tsbuildinfo

# Environment
.env
.env.local

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo
"@ | Out-File -FilePath .gitignore -Encoding utf8
```

**Create LICENSE:**
```powershell
# Create MIT License file
@"
MIT License

Copyright (c) 2024 DAX Tips

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"@ | Out-File -FilePath LICENSE -Encoding utf8
```

**Create `.vscodeignore`:**
```powershell
# Create .vscodeignore to exclude files from package
@"
.vscode/**
.vscode-test/**
src/**
.gitignore
.yarnrc
vsc-extension-quickstart.md
**/tsconfig.json
**/.eslintrc.json
**/*.map
**/*.ts
!out/**/*.js
node_modules/**
*.vsix
PUBLISHING.md
TESTING.md
WHY_VS_CODE.md
QUICKSTART.md
SUCCESS.md
.git/**
.github/**
"@ | Out-File -FilePath .vscodeignore -Encoding utf8
```

### Step 4: Update package.json with Repository Info

```powershell
# Open package.json and add repository field
```

Add this to your `package.json`:

```json
{
  "repository": {
    "type": "git",
    "url": "https://github.com/dax-tips/vpax-viewer-extension.git"
  },
  "bugs": {
    "url": "https://github.com/dax-tips/vpax-viewer-extension/issues"
  },
  "homepage": "https://github.com/dax-tips/vpax-viewer-extension#readme"
}
```

### Step 5: Create GitHub Releases

After publishing a new version:

```powershell
# Tag the version
git tag -a v0.1.0 -m "Release v0.1.0: Initial release"

# Push tags
git push origin v0.1.0

# Or push all tags
git push --tags
```

Then create a release on GitHub:
1. Go to repository → Releases → "Draft a new release"
2. Choose the tag (v0.1.0)
3. Title: "v0.1.0 - Initial Release"
4. Description: Copy from CHANGELOG.md
5. Attach the `.vsix` file
6. Click "Publish release"

---

## Publishing to VS Code Marketplace

### Step 1: Get a Publisher Account

1. **Create Azure DevOps Account:**
   - Go to [https://dev.azure.com](https://dev.azure.com)
   - Sign in with your Microsoft account
   - Create an organization (if you don't have one)

2. **Create Personal Access Token (PAT):**
   - Click your profile icon (top right)
   - Select "Personal Access Tokens"
   - Click "New Token"
   - **Name:** "vscode-marketplace"
   - **Organization:** All accessible organizations
   - **Expiration:** Custom (1 year recommended)
   - **Scopes:** Select "Marketplace" → "Manage"
   - Click "Create"
   - **SAVE THE TOKEN!** You can't see it again

3. **Create Publisher on VS Code Marketplace:**
   - Go to [https://marketplace.visualstudio.com/manage](https://marketplace.visualstudio.com/manage)
   - Sign in with the same Microsoft account
   - Click "Create Publisher"
   - **ID:** `dax-tips` (must match package.json publisher field)
   - **Name:** "DAX Tips"
   - **Description:** "Power BI and Analysis Services tools and extensions"
   - Click "Create"

### Step 2: Login to vsce

```powershell
# Install vsce globally (if not already installed)
npm install -g @vscode/vsce

# Login with your publisher
vsce login dax-tips

# When prompted, paste your Personal Access Token
```

### Step 3: Publish the Extension

**First Time Publishing:**

```powershell
# Make sure you're in the extension directory
cd c:\vscode\mcp\vpax-viewer-extension

# Ensure everything is compiled
npm run compile

# Publish to marketplace
vsce publish
```

This will:
1. Package the extension
2. Upload to VS Code Marketplace
3. Make it available for installation

**Verify Publication:**
1. Go to [https://marketplace.visualstudio.com/items?itemName=dax-tips.vpax-viewer](https://marketplace.visualstudio.com/items?itemName=dax-tips.vpax-viewer)
2. Check that your extension is live
3. Test installation: Open VS Code → Extensions → Search "VertiPaq Analyzer Viewer"

### Step 4: Update Package.json Metadata

Make sure your `package.json` has proper marketplace metadata:

```json
{
  "name": "vpax-viewer",
  "displayName": "VertiPaq Analyzer Viewer",
  "description": "View and analyze VertiPaq Analyzer (.vpax) files with interactive tables, columns, relationships, and partition statistics",
  "version": "0.1.0",
  "publisher": "dax-tips",
  "icon": "images/icon.png",
  "galleryBanner": {
    "color": "#0066B8",
    "theme": "dark"
  },
  "categories": [
    "Data Science",
    "Visualization",
    "Other"
  ],
  "keywords": [
    "vpax",
    "vertipaq",
    "power bi",
    "dax",
    "tabular",
    "analysis services",
    "data model"
  ]
}
```

---

## Version Management

### Semantic Versioning

Follow [Semantic Versioning](https://semver.org/): `MAJOR.MINOR.PATCH`

- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (0.1.0): New features, backwards compatible
- **PATCH** (0.1.1): Bug fixes, backwards compatible

### Releasing New Versions

**Option A: Manual Version Bump**

```powershell
# Update version in package.json manually
# Then publish
vsce publish
```

**Option B: Automatic Version Bump**

```powershell
# Patch release (0.1.0 → 0.1.1)
vsce publish patch

# Minor release (0.1.0 → 0.2.0)
vsce publish minor

# Major release (0.1.0 → 1.0.0)
vsce publish major
```

This automatically:
1. Updates `package.json` version
2. Packages the extension
3. Publishes to marketplace

**After Publishing:**

```powershell
# Commit version bump
git add package.json
git commit -m "Bump version to 0.2.0"

# Tag the release
git tag -a v0.2.0 -m "Release v0.2.0"

# Push to GitHub
git push origin main --tags
```

### Version Workflow Example

```powershell
# 1. Make changes and test
npm run compile
# Test in VS Code with F5

# 2. Update CHANGELOG.md
# Add new version section with changes

# 3. Commit changes
git add .
git commit -m "Add new feature: XYZ"

# 4. Publish new version (auto-increments version)
vsce publish minor

# 5. Push to GitHub
git push origin main

# 6. Create GitHub release
git tag -a v0.2.0 -m "Release v0.2.0"
git push origin v0.2.0
```

---

## CI/CD Setup

### GitHub Actions for Automated Publishing

Create `.github/workflows/publish.yml`:

```yaml
name: Publish Extension

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Compile
        run: npm run compile
        
      - name: Package
        run: npm run package
        
      - name: Publish to VS Code Marketplace
        run: npx @vscode/vsce publish
        env:
          VSCE_PAT: ${{ secrets.VSCE_PAT }}
          
      - name: Upload VSIX as artifact
        uses: actions/upload-artifact@v3
        with:
          name: vsix
          path: "*.vsix"
```

**Setup:**
1. Go to GitHub repository → Settings → Secrets and variables → Actions
2. Add new secret: `VSCE_PAT` with your Personal Access Token
3. Now when you push a tag, it auto-publishes!

### Automated Testing

Create `.github/workflows/test.yml`:

```yaml
name: Test Extension

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Compile
        run: npm run compile
        
      - name: Run tests
        run: npm test
```

---

## Quick Reference

### Installation Commands
```powershell
npm install              # Install dependencies
npm run compile         # Compile TypeScript
npm run package         # Create VSIX file
code --install-extension vpax-viewer-0.1.0.vsix  # Install locally
```

### Publishing Commands
```powershell
vsce login dax-tips     # Login to marketplace
vsce publish patch      # Publish patch version
vsce publish minor      # Publish minor version
vsce publish major      # Publish major version
vsce package           # Create VSIX without publishing
```

### Git Commands
```powershell
git add .
git commit -m "message"
git push origin main
git tag -a v0.1.0 -m "Release v0.1.0"
git push --tags
```

---

## Troubleshooting

### Extension Not Installing
- Check VS Code version compatibility (1.85.0+)
- Try reloading VS Code after installation
- Check for conflicts with other extensions

### Publishing Fails
- Verify Personal Access Token is valid
- Check publisher ID matches package.json
- Ensure all required fields in package.json are filled

### Version Conflicts
- Make sure git tags match package.json version
- Don't publish same version twice
- Use `vsce publish` commands to auto-increment

### Repository Not Found
- Verify repository URL in package.json
- Make sure repository is public
- Check GitHub organization permissions

---

## Resources

- **VS Code Extension API:** https://code.visualstudio.com/api
- **vsce Documentation:** https://code.visualstudio.com/api/working-with-extensions/publishing-extension
- **Marketplace Management:** https://marketplace.visualstudio.com/manage
- **GitHub Releases:** https://docs.github.com/en/repositories/releasing-projects-on-github

---

**Need Help?** Open an issue at [https://github.com/dax-tips/vpax-viewer-extension/issues](https://github.com/dax-tips/vpax-viewer-extension/issues)
