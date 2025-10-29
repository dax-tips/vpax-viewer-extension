# Changelog

All notable changes to the VertiPaq Analyzer Viewer extension will be documented in this file.

## [0.1.6] - 2025-10-30

### ✨ New Features
- **Resizable Columns** - All table columns can now be resized by dragging the column header edges
- **Fixed Sort Direction** - Tables grid now correctly defaults to sorting by Rows in descending order (largest tables first)

### 🔧 Technical Implementation
- **Column resize handles** - Visual drag handles on the right edge of each column header
- **Resize constraints** - Minimum column width of 50px prevents columns from becoming too narrow
- **Sort fix** - Pre-set sort state before triggering default sort to ensure descending order
- **Event handling** - Resize handles properly prevent sort triggers during column resize operations

### 📊 User Experience
- Customize column widths to fit your viewing preferences
- Resize persists during your session
- Visual feedback when hovering over resize handles
- Tables now properly show largest tables at the top by default

## [0.1.5] - 2025-10-30

### ✨ New Features
- **Storage Mode Column** - Added Storage Mode column to Tables grid showing Import, DirectQuery, DirectLake, or Dual for each table
- **Storage Mode Summary** - Added storage mode breakdown in Model Summary section showing count of tables by storage mode
- **Default Table Sorting** - Tables grid now attempts to sort by Rows on load (fixed in v0.1.6)

### 🔧 Technical Implementation
- **Storage mode detection** - Extract mode from Model.bim partition definitions (first partition per table)
- **Mode normalization** - Standardize mode names to match Power BI terminology (Import, DirectQuery, DirectLake, Dual)
- **Summary aggregation** - Calculate storage mode counts for Model Summary display
- **Default sort trigger** - Automatically sort Tables grid by Rows column on page load
- **UI enhancement** - Added sortable Storage Mode column between Table Name and Rows columns

### 📊 User Experience
- Quickly identify table storage modes at a glance
- Understand model storage composition in summary section
- Tables sorted by size (rows) for better overview (direction fixed in v0.1.6)
- Sortable storage mode column for grouping tables by type

### 🎯 Storage Mode Support
- **Import** - Traditional in-memory compressed tables
- **DirectQuery** - Real-time query pass-through tables
- **DirectLake** - Direct Fabric lakehouse access tables
- **Dual** - Hybrid mode tables supporting both Import and DirectQuery

## [0.1.4] - 2025-10-29

### ✨ New Features
- **Added Temperature Column** - Display column access temperature to match DAX Studio functionality
- **Added Last Accessed Column** - Show when columns were last accessed to match DAX Studio functionality
- **Enhanced Column Analysis** - Now provides same detailed column information as DAX Studio's VertiPaq Analyzer

### 🔧 Technical Implementation
- **Column parsing enhancement** - Extract Temperature and LastAccessTime from VPAX ColumnsSegments data
- **UI table updates** - Added sortable Temperature and Last Accessed columns to columns view
- **Data formatting** - Temperature displayed with 2 decimal precision, Last Accessed in original VPAX format
- **Segment analysis** - Process ColumnsSegments to find first available temperature/access data per column

### 📊 Feature Parity
- Now matches DAX Studio's column information display
- Temperature values show column usage intensity (higher = more frequently accessed)
- Last Accessed shows exact timestamps from VertiPaq engine
- Sortable columns for temperature-based performance analysis

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
