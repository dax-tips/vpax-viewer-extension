# Changelog

All notable changes to the VertiPaq Analyzer Viewer extension will be documented in this file.

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
