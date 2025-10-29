# Changelog

All notable changes to the VertiPaq Analyzer Viewer extension will be documented in this file.

## [0.1.3] - 2025-10-29

### 🎉 MAJOR FIX - Extension Now Works Properly!

### 🐛 Fixed
- **CRITICAL: Fixed extension failing to activate with "Cannot find module" errors**
  - Root cause: JSZip and its dependencies were not being packaged with the extension
  - Solution: Modified `.vscodeignore` to include complete JSZip dependency chain
  - Fixed missing modules: `jszip`, `setimmediate`, `readable-stream`, `core-util-is`, `inherits`, `isarray`, `process-nextick-args`, `string_decoder`, `util-deprecate`, `immediate`, `lie`, `pako`

### ✨ Added
- **Deferred extension activation** - Extension now activates immediately without blocking
- **Comprehensive logging** - Detailed `[VPAX]` prefixed logs for debugging
- **Loading screen with animated spinner** - Professional user experience during file parsing
- **Complete dependency packaging** - All required Node.js modules included (187 files, 564 KB)

### 🔧 Technical Details
- **Package size:** Increased from 32 KB to 564 KB (dependencies included)
- **Activation:** Uses `setTimeout()` for deferred provider registration
- **Dependencies:** Complete JSZip ecosystem now packaged correctly
- **File I/O:** Async file reading prevents UI blocking
- **Error handling:** Enhanced error reporting and stack traces

### 📊 What Was Fixed
1. **Extension hanging on activation** → Fixed with deferred registration
2. **"Cannot find module 'jszip'" errors** → Fixed by including JSZip in package
3. **"Cannot find module 'setimmediate'" errors** → Fixed by including all dependencies
4. **VS Code extension packaging issues** → Fixed `.vscodeignore` configuration

### 🎯 Result
- ✅ Extension activates instantly
- ✅ VPAX files open with loading spinner
- ✅ All features work (Tables, Columns, Relationships, Partitions)
- ✅ No dependency errors
- ✅ Professional user experience

## [0.1.2-debug] - 2025-10-29

### � Debug Version
- Added extensive logging for troubleshooting activation issues
- Identified missing JSZip dependency as root cause

## [0.1.1] - 2025-10-29

### 🐛 Fixed (Attempted)
- Changed from synchronous `fs.readFileSync()` to async `fs.readFile()` 
- Added loading screen with spinner
- **Note: This did not fix the actual issue, which was missing dependencies**

## [0.1.0] - 2025-10-29

### 🎉 Initial Release

#### Added
- Custom editor for `.vpax` files
- VPAX file parser (ZIP extraction + JSON parsing)
- Interactive webview with tabbed interface:
  - **Tables tab**: Sortable table statistics
  - **Columns tab**: Column cardinality and sizing
  - **Relationships tab**: Model relationships view
  - **Partitions tab**: Partition information
- Search and filter functionality
- VS Code theme integration
- Large table highlighting (>100K rows)
- Number formatting and byte-to-MB conversion
- Click-to-sort on all column headers

#### Technical Details
- TypeScript-based extension
- Custom editor provider using VS Code Webview API
- JSZip for `.vpax` file parsing
- Supports DaxVpaView.json, DaxModel.json, and Model.bim formats
- CSP-compliant webview security

### Files Created
- `extension.ts` - Extension activation and registration
- `vpaxEditorProvider.ts` - Custom editor implementation
- `vpaxParser.ts` - VPAX file parser
- Documentation: README, QUICKSTART, TESTING, SUCCESS guides

### Known Limitations
- Read-only viewer (no editing capabilities)
- Relationship diagram is text-based (no visual diagram yet)
- No export functionality yet
- No comparison between models
- Limited to VPAX format (doesn't open DAXX directly yet)

### Future Plans
See roadmap in README.md for planned enhancements.

---

## Development Notes

### Build Information
- Node.js: 24.5.0
- npm: 11.5.1
- TypeScript: 5.3.0
- VS Code Engine: ^1.85.0

### Dependencies
- jszip: ^3.10.1
- @types/vscode: ^1.85.0
- @types/node: ^20.x

### Test Data
- Created test VPAX from CrossTabWorkingQuery.daxx
- 141 tables, multiple relationships
- Successfully parses DaxVpaView.json format
