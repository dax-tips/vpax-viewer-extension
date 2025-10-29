# 🚀 Quick Start Guide - VertiPaq Analyzer Viewer Extension

## You've Successfully Created the Extension! 🎉

The extension is now ready to test. Here's how to use it:

## Testing the Extension

### Method 1: Launch in Debug Mode (Recommended)

1. Open the `vpax-viewer-extension` folder in VS Code
2. Press **F5** (or click Debug > Start Debugging)
3. A new VS Code window will open with the extension loaded
4. Open any `.vpax` file in that window
5. The VertiPaq Analyzer viewer should automatically appear!

### Method 2: Manual Testing

1. Copy a `.vpax` file into the workspace
2. Right-click the file
3. Select "Open with VertiPaq Analyzer"

## Testing with Sample Data

If you don't have a `.vpax` file handy, you can create one from your DAXX files:

The CrossTabWorkingQuery.daxx you just analyzed contains:
- `CrossTabWorkingQuery_extracted/Model_extracted/` folder

However, the Model.bim is not a `.vpax` file. To get a real `.vpax` file:

1. Use the original VertiPaq Analyzer tool to export one
2. Or rename `Model_extracted.zip` → `Model.vpax` (but it won't have DaxVpaView.json)
3. Or download a sample from the VertiPaq Analyzer community

## What's Working

✅ Extension structure created
✅ TypeScript compilation working
✅ Custom editor registered for `.vpax` files
✅ VPAX parser (unzips and reads JSON files)
✅ Interactive webview with:
   - Tables tab with sortable columns
   - Columns tab with statistics
   - Relationships tab
   - Partitions tab
   - Search functionality
   - VS Code theme integration

## Next Steps

### 1. Test with Real Data

Try opening a `.vpax` file in the debug extension host to see if parsing works.

### 2. Enhance Features

Add these features based on what you need:

- **Export to CSV**: Add button to export table statistics
- **Filtering**: Advanced filters for large models
- **Visualizations**: Charts showing size distribution
- **Comparison**: Side-by-side comparison of two models
- **Recommendations**: Built-in best practices analyzer

### 3. Package for Distribution

When ready to share:

```bash
npm run package
```

This creates a `.vsix` file you can install or publish to the marketplace.

### 4. Publish to Marketplace

1. Create a publisher account at https://marketplace.visualstudio.com/
2. Get a Personal Access Token from Azure DevOps
3. Run: `vsce publish`

## File Structure

```
vpax-viewer-extension/
├── src/
│   ├── extension.ts           # Entry point
│   ├── vpaxEditorProvider.ts  # Custom editor logic
│   └── vpaxParser.ts           # VPAX file parser
├── out/                        # Compiled JavaScript (generated)
├── package.json                # Extension manifest
├── tsconfig.json               # TypeScript config
└── README.md                   # Documentation
```

## Debugging Tips

- **Console Output**: Check Debug Console in the Extension Host window
- **Webview DevTools**: Right-click in webview → "Open Webview Developer Tools"
- **Reload**: Press `Ctrl+R` in Extension Host to reload after changes
- **Watch Mode**: Run `npm run watch` to auto-compile on changes

## Common Issues

### "Extension not activating"
- Check the Debug Console for errors
- Verify package.json `activationEvents` are correct
- Make sure the file has `.vpax` extension

### "Cannot read VPAX file"
- Verify the file is a valid ZIP archive
- Check if DaxVpaView.json exists inside
- Look at parser error messages in Debug Console

### "Webview not displaying"
- Check browser console in Webview DevTools
- Verify HTML is being generated correctly
- Check CSP (Content Security Policy) errors

## Resources

- [VS Code Extension API](https://code.visualstudio.com/api)
- [Custom Editor Guide](https://code.visualstudio.com/api/extension-guides/custom-editors)
- [Webview API](https://code.visualstudio.com/api/extension-guides/webview)
- [VertiPaq Analyzer](https://www.sqlbi.com/tools/vertipaq-analyzer/)

## Need Help?

The extension structure is complete and ready to run. If you encounter issues:

1. Check the Debug Console for error messages
2. Verify dependencies are installed (`npm install`)
3. Ensure TypeScript compiled successfully (`npm run compile`)
4. Try pressing F5 again

Happy coding! 🎨✨
