# Testing the Extension Without a Real .vpax File

If you don't have a real `.vpax` file handy, here's how to create a test file:

## Option 1: Extract from DAXX (Partial)

Your DAXX files contain model data but not in complete VPAX format:

```powershell
# Navigate to a DAXX extracted folder
cd c:\vscode\mcp\daxx_analyzer\daxx\CrossTabWorkingQuery_extracted\Model_extracted

# Check what's inside
ls
```

You'll see files like:
- `DaxVpaView.json` - Table/column statistics ✅
- `Model.bim` - TMSL model definition ✅
- `DaxModel.json` - Model metadata ✅

These are the files the extension needs!

## Option 2: Create a Mock .vpax File for Testing

Create a ZIP file with these JSON files and rename it to `.vpax`:

```powershell
# From PowerShell
$sourcePath = "c:\vscode\mcp\daxx_analyzer\daxx\CrossTabWorkingQuery_extracted\Model_extracted"
$destPath = "c:\vscode\mcp\vpax-viewer-extension\test-model.vpax"

# Copy the extracted folder and zip it
Compress-Archive -Path "$sourcePath\*" -DestinationPath $destPath -Force
```

Now you have a `test-model.vpax` file!

## Option 3: Use from Real VertiPaq Analyzer

1. Download VertiPaq Analyzer from https://www.sqlbi.com/tools/vertipaq-analyzer/
2. Connect to a Power BI model
3. Export to `.vpax` format
4. Open in your extension

## Quick Test Script

Here's a PowerShell script to create a test VPAX:

```powershell
# Create test VPAX from CrossTabWorkingQuery
$sourceFolder = "c:\vscode\mcp\daxx_analyzer\daxx\CrossTabWorkingQuery_extracted\Model_extracted"
$outputFile = "c:\vscode\mcp\vpax-viewer-extension\CrossTabWorkingQuery.vpax"

# Check if source exists
if (Test-Path $sourceFolder) {
    Write-Host "Creating test VPAX from CrossTabWorkingQuery..."
    Compress-Archive -Path "$sourceFolder\*" -DestinationPath $outputFile -Force
    Write-Host "✅ Created: $outputFile"
    Write-Host "Now open this file in VS Code after pressing F5!"
} else {
    Write-Host "❌ Source folder not found. Extract a DAXX file first."
}
```

## Testing Checklist

After creating a `.vpax` file:

1. ✅ Open `vpax-viewer-extension` folder in VS Code
2. ✅ Press **F5** to launch Extension Development Host
3. ✅ In the new window, open your `.vpax` file
4. ✅ Verify the VertiPaq Analyzer viewer appears
5. ✅ Test tab switching (Tables, Columns, Relationships, Partitions)
6. ✅ Test sorting by clicking column headers
7. ✅ Test search boxes
8. ✅ Check VS Code theme integration

## Expected Behavior

When you open a `.vpax` file:

- VS Code should automatically use the VertiPaq Analyzer viewer
- You should see tabs for Tables, Columns, Relationships, Partitions
- Tables should be sortable and searchable
- The viewer should match your VS Code theme

## Troubleshooting

### File doesn't open in custom viewer
- Make sure the file has `.vpax` extension
- Check Debug Console for activation errors
- Verify extension compiled successfully

### Viewer shows error
- Check if the ZIP contains DaxVpaView.json
- Look at Webview Developer Tools (right-click → Open Webview Developer Tools)
- Check parser error messages

### No data showing
- Verify JSON structure matches expected format
- Check browser console in Webview DevTools
- Add console.log in vpaxParser.ts to debug

## What You Should See

The viewer displays:

📊 **Model Summary**
- Total tables, columns, rows, size

📋 **Tables Tab**
- Sortable grid with table names, row counts, sizes
- Large tables highlighted in red
- Search box for filtering

📊 **Columns Tab**  
- All columns with cardinality and size
- Filterable by table name or column name

🔗 **Relationships Tab**
- From/To table and column pairs
- Cardinality information

📦 **Partitions Tab**
- Partition details per table
- Row counts and modes

Happy testing! 🚀
