import * as vscode from 'vscode';
import * as path from 'path';
import { VpaxParser } from './vpaxParser';

/**
 * Custom editor provider for .vpax files
 */
export class VpaxEditorProvider implements vscode.CustomReadonlyEditorProvider {
    
    constructor(private readonly context: vscode.ExtensionContext) {}

    async openCustomDocument(
        uri: vscode.Uri,
        openContext: vscode.CustomDocumentOpenContext,
        token: vscode.CancellationToken
    ): Promise<vscode.CustomDocument> {
        console.log('[VPAX] 📄 openCustomDocument called for:', uri.fsPath);
        const document = { uri, dispose: () => {} };
        console.log('[VPAX] ✅ Custom document created');
        return document;
    }

    async resolveCustomEditor(
        document: vscode.CustomDocument,
        webviewPanel: vscode.WebviewPanel,
        token: vscode.CancellationToken
    ): Promise<void> {
        console.log('[VPAX] 🎨 resolveCustomEditor called for:', document.uri.fsPath);
        
        try {
            // Configure webview
            console.log('[VPAX] ⚙️ Configuring webview options');
            webviewPanel.webview.options = {
                enableScripts: true,
                localResourceRoots: [
                    vscode.Uri.file(path.join(this.context.extensionPath, 'media'))
                ]
            };
            console.log('[VPAX] ✅ Webview configured');

            // Show loading screen immediately
            console.log('[VPAX] ⏳ Setting loading screen');
            webviewPanel.webview.html = this.getLoadingHtml();
            console.log('[VPAX] ✅ Loading screen displayed');

            // Parse the VPAX file asynchronously
            console.log('[VPAX] 🔍 Starting VPAX file parsing');
            const parseStartTime = Date.now();
            const parser = new VpaxParser(document.uri.fsPath);
            console.log('[VPAX] 📦 Parser created, calling parse()...');
            
            const data = await parser.parse();
            const parseEndTime = Date.now();
            console.log(`[VPAX] ✅ Parsing completed in ${parseEndTime - parseStartTime}ms`);
            
            // Set webview HTML with parsed data
            console.log('[VPAX] 🎨 Generating HTML for webview');
            const htmlStartTime = Date.now();
            webviewPanel.webview.html = this.getHtmlForWebview(webviewPanel.webview, data);
            const htmlEndTime = Date.now();
            console.log(`[VPAX] ✅ HTML generated in ${htmlEndTime - htmlStartTime}ms`);
            
            // Handle messages from webview
            webviewPanel.webview.onDidReceiveMessage(message => {
                console.log('[VPAX] 💬 Message from webview:', message.type);
                switch (message.type) {
                    case 'alert':
                        vscode.window.showInformationMessage(message.text);
                        break;
                    case 'error':
                        vscode.window.showErrorMessage(message.text);
                        break;
                }
            });
            
            console.log('[VPAX] 🎉 Editor resolved successfully');
            
        } catch (error) {
            console.error('[VPAX] ❌ Error in resolveCustomEditor:', error);
            webviewPanel.webview.html = this.getErrorHtml(error);
            vscode.window.showErrorMessage(`Failed to open VPAX file: ${error}`);
        }
    }

    private getHtmlForWebview(webview: vscode.Webview, data: any): string {
        const nonce = this.getNonce();
        
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
    <title>VertiPaq Analyzer</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 0;
            margin: 0;
        }
        
        .container {
            padding: 20px;
        }
        
        h1 {
            color: var(--vscode-foreground);
            border-bottom: 1px solid var(--vscode-panel-border);
            padding-bottom: 10px;
            margin-top: 0;
        }
        
        .tabs {
            display: flex;
            gap: 5px;
            border-bottom: 1px solid var(--vscode-panel-border);
            margin-bottom: 20px;
        }
        
        .tab {
            padding: 10px 20px;
            cursor: pointer;
            background: transparent;
            border: none;
            color: var(--vscode-foreground);
            font-size: 14px;
            border-bottom: 2px solid transparent;
            transition: all 0.2s;
        }
        
        .tab:hover {
            background: var(--vscode-list-hoverBackground);
        }
        
        .tab.active {
            border-bottom-color: var(--vscode-focusBorder);
            color: var(--vscode-focusBorder);
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        
        th, td {
            text-align: left;
            padding: 8px 12px;
            border-bottom: 1px solid var(--vscode-panel-border);
        }
        
        th {
            background: var(--vscode-editor-background);
            color: var(--vscode-foreground);
            font-weight: 600;
            position: sticky;
            top: 0;
            cursor: pointer;
            user-select: none;
        }
        
        th:hover {
            background: var(--vscode-list-hoverBackground);
        }
        
        tr:hover {
            background: var(--vscode-list-hoverBackground);
        }
        
        .metric {
            display: inline-block;
            padding: 4px 12px;
            margin: 5px 5px 5px 0;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border-radius: 3px;
            font-weight: 500;
        }
        
        .summary {
            background: var(--vscode-textCodeBlock-background);
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        
        .number {
            text-align: right;
            font-family: 'Consolas', 'Monaco', monospace;
        }
        
        .expand-icon {
            cursor: pointer;
            user-select: none;
            display: inline-block;
            width: 20px;
            text-align: center;
            transition: transform 0.2s;
        }
        
        .expand-icon.expanded {
            transform: rotate(90deg);
        }
        
        .columns-row {
            display: none;
            background: var(--vscode-editor-background);
        }
        
        .columns-row.visible {
            display: table-row;
        }
        
        .columns-table {
            width: 100%;
            margin: 10px 0;
            background: var(--vscode-textCodeBlock-background);
            border-radius: 3px;
        }
        
        .columns-table th {
            background: var(--vscode-textCodeBlock-background);
            font-size: 12px;
            padding: 6px 8px;
            cursor: pointer;
            user-select: none;
            position: relative;
        }
        
        .columns-table th:hover {
            background: var(--vscode-list-hoverBackground);
        }
        
        .columns-table th.sort-asc::after {
            content: ' ▲';
            font-size: 10px;
        }
        
        .columns-table th.sort-desc::after {
            content: ' ▼';
            font-size: 10px;
        }
        
        .columns-table td {
            font-size: 12px;
            padding: 4px 8px;
        }
        
        .hidden-column {
            opacity: 0.5;
            font-style: italic;
        }
        
        .row-number-column {
            color: var(--vscode-descriptionForeground);
        }
        
        .many-to-many {
            background: var(--vscode-inputValidation-warningBackground) !important;
            border-left: 3px solid var(--vscode-inputValidation-warningBorder);
        }
        
        .many-to-many td {
            font-weight: 500;
        }
        
        .search-box {
            width: 100%;
            padding: 8px;
            margin-bottom: 15px;
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border: 1px solid var(--vscode-input-border);
            border-radius: 3px;
        }
        
        .large-table {
            color: var(--vscode-errorForeground);
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>📊 VertiPaq Analyzer - ${data.modelName || 'Model'}</h1>
        
        <div class="summary">
            <h2>Model Summary</h2>
            <div style="margin-bottom: 10px;">
                <span class="metric">Total Size: ${this.formatBytes(data.totalSize || 0)} MiB</span>
                <span class="metric">Last Data Refresh: ${this.formatDateTime(data.lastDataRefresh)}</span>
                <span class="metric">Analysis Date: ${this.formatDateTime(data.extractionDate)}</span>
            </div>
            <div>
                <span class="metric">Compatibility: ${data.compatibilityLevel || 'Unknown'}</span>
                <span class="metric">Tables: ${data.tables?.length || 0}</span>
                <span class="metric">Columns: ${data.totalColumns || 0}</span>
                ${data.serverName ? `<span class="metric" style="display: block; margin-top: 5px; font-size: 11px; max-width: 100%; overflow: hidden; text-overflow: ellipsis;" title="${this.escapeHtml(data.serverName)}">Server: ${this.escapeHtml(data.serverName)}</span>` : ''}
            </div>
        </div>
        
        <div class="tabs">
            <button class="tab active" data-tab="tables">Tables</button>
            <button class="tab" data-tab="columns">Columns</button>
            <button class="tab" data-tab="relationships">Relationships</button>
            <button class="tab" data-tab="partitions">Partitions</button>
        </div>
        
        <div id="tables" class="tab-content active">
            <input type="text" class="search-box" placeholder="Search tables..." id="search-tables">
            <table id="tables-table">
                <thead>
                    <tr>
                        <th style="width: 30px;"></th>
                        <th data-sort="name">Table Name</th>
                        <th data-sort="rowCount" class="number">Rows</th>
                        <th data-sort="totalSize" class="number">Size (MB)</th>
                        <th data-sort="columnCount" class="number">Columns</th>
                        <th data-sort="relationshipCount" class="number">Relationships</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.generateTablesRows(data.tables || [], data.columns || [])}
                </tbody>
            </table>
        </div>
        
        <div id="columns" class="tab-content">
            <input type="text" class="search-box" placeholder="Search columns..." id="search-columns">
            <table id="columns-table">
                <thead>
                    <tr>
                        <th data-sort="tableName">Table</th>
                        <th data-sort="columnName">Column Name</th>
                        <th data-sort="dataType">Data Type</th>
                        <th data-sort="cardinality" class="number">Cardinality</th>
                        <th data-sort="size" class="number">Total Size</th>
                        <th data-sort="dataSize" class="number">Data Size</th>
                        <th data-sort="dictionarySize" class="number">Dictionary</th>
                        <th data-sort="encoding">Encoding</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.generateColumnsRows(data.columns || [])}
                </tbody>
            </table>
        </div>
        
        <div id="relationships" class="tab-content">
            <table id="relationships-table">
                <thead>
                    <tr>
                        <th data-sort="fromTable">From Table</th>
                        <th data-sort="fromColumn">From Column</th>
                        <th>→</th>
                        <th data-sort="toTable">To Table</th>
                        <th data-sort="toColumn">To Column</th>
                        <th data-sort="cardinality">Cardinality</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.generateRelationshipsRows(data.relationships || [])}
                </tbody>
            </table>
        </div>
        
        <div id="partitions" class="tab-content">
            <table id="partitions-table">
                <thead>
                    <tr>
                        <th data-sort="tableName">Table / Partition</th>
                        <th data-sort="rowCount" class="number">Rows</th>
                        <th data-sort="mode">Mode</th>
                        <th data-sort="segmentCount" class="number">Segments</th>
                        <th data-sort="recordsPerSegment" class="number">Records/Segment</th>
                        <th data-sort="temperature" class="number">Temperature</th>
                        <th data-sort="lastAccessed">Last Accessed</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.generatePartitionsRows(data.partitions || [])}
                </tbody>
            </table>
        </div>
    </div>
    
    <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();
        
        // Tab switching
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // Update active tab
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update active content
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                document.getElementById(targetTab).classList.add('active');
            });
        });
        
        // Table expansion
        document.querySelectorAll('.expand-icon').forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                const tableName = icon.dataset.table;
                const columnsRow = document.querySelector('.columns-row[data-table="' + tableName + '"]');
                
                if (columnsRow) {
                    const isVisible = columnsRow.classList.contains('visible');
                    columnsRow.classList.toggle('visible');
                    icon.classList.toggle('expanded');
                    
                    // If expanding for the first time, attach sort handlers to column headers
                    if (!isVisible) {
                        const columnHeaders = columnsRow.querySelectorAll('th[data-col-sort]');
                        columnHeaders.forEach(header => {
                            if (!header.dataset.sortAttached) {
                                header.dataset.sortAttached = 'true';
                                header.addEventListener('click', () => {
                                    const columnTable = header.closest('table');
                                    const tbody = columnTable.querySelector('tbody');
                                    const rows = Array.from(tbody.querySelectorAll('tr'));
                                    const columnIndex = Array.from(header.parentElement.children).indexOf(header);
                                    const isNumeric = header.classList.contains('number');
                                    
                                    // Toggle sort direction
                                    const isAscending = header.classList.contains('sort-asc');
                                    columnTable.querySelectorAll('th').forEach(h => {
                                        h.classList.remove('sort-asc', 'sort-desc');
                                    });
                                    header.classList.add(isAscending ? 'sort-desc' : 'sort-asc');
                                    
                                    // Sort rows
                                    rows.sort((a, b) => {
                                        const aValue = a.children[columnIndex].textContent.trim();
                                        const bValue = b.children[columnIndex].textContent.trim();
                                        
                                        if (isNumeric) {
                                            const aNum = parseFloat(aValue.replace(/[^0-9.-]/g, '')) || 0;
                                            const bNum = parseFloat(bValue.replace(/[^0-9.-]/g, '')) || 0;
                                            return isAscending ? bNum - aNum : aNum - bNum;
                                        } else {
                                            return isAscending 
                                                ? bValue.localeCompare(aValue)
                                                : aValue.localeCompare(bValue);
                                        }
                                    });
                                    
                                    // Reorder rows
                                    rows.forEach(row => tbody.appendChild(row));
                                });
                            }
                        });
                    }
                }
            });
        });
        
        // Table sorting (works for all tables)
        document.querySelectorAll('th[data-sort]').forEach(header => {
            header.addEventListener('click', () => {
                const table = header.closest('table');
                const tbody = table.querySelector('tbody');
                const tableId = table.id;
                
                // For tables tab, only sort table rows (not column detail rows)
                const rows = tableId === 'tables-table' 
                    ? Array.from(tbody.querySelectorAll('tr.table-row'))
                    : Array.from(tbody.querySelectorAll('tr'));
                    
                const column = header.dataset.sort;
                const columnIndex = Array.from(header.parentElement.children).indexOf(header);
                const isNumeric = header.classList.contains('number');
                
                // Toggle sort direction
                const isAscending = header.classList.contains('sort-asc');
                document.querySelectorAll('th').forEach(h => {
                    h.classList.remove('sort-asc', 'sort-desc');
                });
                header.classList.add(isAscending ? 'sort-desc' : 'sort-asc');
                
                // Sort rows
                rows.sort((a, b) => {
                    const aValue = a.children[columnIndex].textContent.trim();
                    const bValue = b.children[columnIndex].textContent.trim();
                    
                    if (isNumeric) {
                        const aNum = parseFloat(aValue.replace(/[^0-9.-]/g, '')) || 0;
                        const bNum = parseFloat(bValue.replace(/[^0-9.-]/g, '')) || 0;
                        return isAscending ? bNum - aNum : aNum - bNum;
                    } else {
                        return isAscending 
                            ? bValue.localeCompare(aValue)
                            : aValue.localeCompare(bValue);
                    }
                });
                
                // Reorder rows (with their corresponding columns rows for tables tab)
                if (tableId === 'tables-table') {
                    rows.forEach(row => {
                        const tableName = row.querySelector('.expand-icon')?.dataset.table;
                        tbody.appendChild(row);
                        if (tableName) {
                            const columnsRow = tbody.querySelector('.columns-row[data-table="' + tableName + '"]');
                            if (columnsRow) {
                                tbody.appendChild(columnsRow);
                            }
                        }
                    });
                } else {
                    // For other tables, just append rows in order
                    rows.forEach(row => tbody.appendChild(row));
                }
            });
        });
        
        // Search functionality
        document.querySelectorAll('.search-box').forEach(searchBox => {
            searchBox.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const tableId = e.target.id.replace('search-', '') + '-table';
                const table = document.getElementById(tableId);
                
                // Special handling for tables tab
                if (tableId === 'tables-table') {
                    const tableRows = table.querySelectorAll('tbody tr.table-row');
                    tableRows.forEach(row => {
                        const text = row.textContent.toLowerCase();
                        const shouldShow = text.includes(searchTerm);
                        row.style.display = shouldShow ? '' : 'none';
                        
                        // Also hide/show corresponding columns row
                        const expandIcon = row.querySelector('.expand-icon');
                        if (expandIcon) {
                            const tableName = expandIcon.dataset.table;
                            const columnsRow = table.querySelector('.columns-row[data-table="' + tableName + '"]');
                            if (columnsRow) {
                                columnsRow.style.display = shouldShow ? '' : 'none';
                            }
                        }
                    });
                } else {
                    const rows = table.querySelectorAll('tbody tr');
                    rows.forEach(row => {
                        const text = row.textContent.toLowerCase();
                        row.style.display = text.includes(searchTerm) ? '' : 'none';
                    });
                }
            });
        });
    </script>
</body>
</html>`;
    }

    private generateTablesRows(tables: any[], columns: any[]): string {
        return tables.map((table, index) => {
            const sizeClass = (table.rowCount || 0) > 100000 ? 'large-table' : '';
            const tableColumns = columns.filter(c => c.tableName === table.name);
            const hasColumns = tableColumns.length > 0;
            
            return `
                <tr class="table-row" data-table-index="${index}">
                    <td>
                        ${hasColumns ? `<span class="expand-icon" data-table="${this.escapeHtml(table.name)}">▶</span>` : ''}
                    </td>
                    <td class="${sizeClass}">${this.escapeHtml(table.name)}</td>
                    <td class="number">${this.formatNumber(table.rowCount || 0)}</td>
                    <td class="number">${this.formatBytes(table.totalSize || 0)}</td>
                    <td class="number">${table.columnCount || 0}</td>
                    <td class="number">${table.relationshipCount || 0}</td>
                </tr>
                ${hasColumns ? `
                <tr class="columns-row" data-table="${this.escapeHtml(table.name)}">
                    <td colspan="6" style="padding: 0;">
                        <table class="columns-table">
                            <thead>
                                <tr>
                                    <th data-col-sort="columnName">Column Name</th>
                                    <th data-col-sort="dataType">Data Type</th>
                                    <th data-col-sort="cardinality" class="number">Cardinality</th>
                                    <th data-col-sort="size" class="number">Total Size</th>
                                    <th data-col-sort="dataSize" class="number">Data Size</th>
                                    <th data-col-sort="dictionarySize" class="number">Dictionary</th>
                                    <th data-col-sort="encoding">Encoding</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.generateColumnRowsForTable(tableColumns)}
                            </tbody>
                        </table>
                    </td>
                </tr>
                ` : ''}
            `;
        }).join('');
    }

    private generateColumnRowsForTable(columns: any[]): string {
        return columns.map(col => {
            const rowClass = col.isRowNumber ? 'row-number-column' : '';
            const hiddenClass = col.isHidden ? 'hidden-column' : '';
            const combinedClass = [rowClass, hiddenClass].filter(c => c).join(' ');
            
            return `
                <tr class="${combinedClass}">
                    <td>${this.escapeHtml(col.columnName)}</td>
                    <td>${col.dataType || 'Unknown'}</td>
                    <td class="number">${col.cardinality > 0 ? this.formatNumber(col.cardinality) : '-'}</td>
                    <td class="number">${this.formatNumber(col.size)}</td>
                    <td class="number">${this.formatNumber(col.dataSize)}</td>
                    <td class="number">${this.formatNumber(col.dictionarySize)}</td>
                    <td>${col.encoding || '-'}</td>
                </tr>
            `;
        }).join('');
    }

    private generateColumnsRows(columns: any[]): string {
        return columns.map(col => {
            const rowClass = col.isRowNumber ? 'row-number-column' : '';
            const hiddenClass = col.isHidden ? 'hidden-column' : '';
            const combinedClass = [rowClass, hiddenClass].filter(c => c).join(' ');
            
            return `
                <tr class="${combinedClass}">
                    <td>${this.escapeHtml(col.tableName)}</td>
                    <td>${this.escapeHtml(col.columnName)}</td>
                    <td>${col.dataType || 'Unknown'}</td>
                    <td class="number">${col.cardinality > 0 ? this.formatNumber(col.cardinality) : '-'}</td>
                    <td class="number">${this.formatNumber(col.size)}</td>
                    <td class="number">${this.formatNumber(col.dataSize)}</td>
                    <td class="number">${this.formatNumber(col.dictionarySize)}</td>
                    <td>${col.encoding || '-'}</td>
                </tr>
            `;
        }).join('');
    }

    private generateRelationshipsRows(relationships: any[]): string {
        if (!relationships || relationships.length === 0) {
            return '<tr><td colspan="6" style="text-align: center; padding: 20px; color: var(--vscode-descriptionForeground);">No relationships found</td></tr>';
        }
        
        return relationships.map(rel => {
            // Check if this is a many:many relationship
            const cardinality = (rel.cardinality || '').toLowerCase();
            const isManyToMany = cardinality.includes('many') && cardinality.includes('many') && 
                                 (cardinality.includes('many:many') || cardinality.includes('many :many'));
            const rowClass = isManyToMany ? 'many-to-many' : '';
            
            return `
                <tr class="${rowClass}">
                    <td>${this.escapeHtml(rel.fromTable)}</td>
                    <td>${this.escapeHtml(rel.fromColumn)}</td>
                    <td style="text-align: center;">→</td>
                    <td>${this.escapeHtml(rel.toTable)}</td>
                    <td>${this.escapeHtml(rel.toColumn)}</td>
                    <td>${rel.cardinality || 'Unknown'}</td>
                </tr>
            `;
        }).join('');
    }

    private generatePartitionsRows(partitions: any[]): string {
        if (!partitions || partitions.length === 0) {
            return '<tr><td colspan="7" style="text-align: center; padding: 20px; color: var(--vscode-descriptionForeground);">No partitions found</td></tr>';
        }
        
        // Group partitions by table
        const partitionsByTable: { [key: string]: any[] } = {};
        for (const part of partitions) {
            if (!partitionsByTable[part.tableName]) {
                partitionsByTable[part.tableName] = [];
            }
            partitionsByTable[part.tableName].push(part);
        }
        
        const rows: string[] = [];
        for (const tableName in partitionsByTable) {
            const tablePartitions = partitionsByTable[tableName];
            
            // Add table row (if multiple partitions, this is a header)
            if (tablePartitions.length > 1) {
                const totalRows = tablePartitions.reduce((sum, p) => sum + (p.rowCount || 0), 0);
                const totalSegments = tablePartitions.reduce((sum, p) => sum + (p.segmentCount || 0), 0);
                rows.push(`
                    <tr style="font-weight: bold; background: var(--vscode-list-hoverBackground);">
                        <td>▼ ${this.escapeHtml(tableName)}</td>
                        <td class="number">${this.formatNumber(totalRows)}</td>
                        <td>${tablePartitions[0].mode || '-'}</td>
                        <td class="number">${totalSegments}</td>
                        <td class="number">-</td>
                        <td class="number">-</td>
                        <td>-</td>
                    </tr>
                `);
                
                // Add partition rows indented
                for (const part of tablePartitions) {
                    rows.push(`
                        <tr>
                            <td style="padding-left: 30px;">${this.escapeHtml(part.partitionName)}</td>
                            <td class="number">${this.formatNumber(part.rowCount || 0)}</td>
                            <td>${part.mode || 'Unknown'}</td>
                            <td class="number">${part.segmentCount || 0}</td>
                            <td class="number">${part.recordsPerSegment ? this.formatNumber(part.recordsPerSegment) : '-'}</td>
                            <td class="number">${part.temperature !== undefined ? part.temperature.toFixed(2) : '-'}</td>
                            <td>${part.lastAccessed ? this.formatDateTime(part.lastAccessed) : '-'}</td>
                        </tr>
                    `);
                }
            } else {
                // Single partition - show as one row
                const part = tablePartitions[0];
                rows.push(`
                    <tr>
                        <td>${this.escapeHtml(tableName)}</td>
                        <td class="number">${this.formatNumber(part.rowCount || 0)}</td>
                        <td>${part.mode || 'Unknown'}</td>
                        <td class="number">${part.segmentCount || 0}</td>
                        <td class="number">${part.recordsPerSegment ? this.formatNumber(part.recordsPerSegment) : '-'}</td>
                        <td class="number">${part.temperature !== undefined ? part.temperature.toFixed(2) : '-'}</td>
                        <td>${part.lastAccessed ? this.formatDateTime(part.lastAccessed) : '-'}</td>
                    </tr>
                `);
            }
        }
        
        return rows.join('');
    }

    private getLoadingHtml(): string {
        return `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 0;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
        }
        .loading-container {
            text-align: center;
        }
        .spinner {
            border: 4px solid var(--vscode-progressBar-background);
            border-top: 4px solid var(--vscode-button-background);
            border-radius: 50%;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        h2 {
            margin: 0;
            font-weight: normal;
        }
        p {
            color: var(--vscode-descriptionForeground);
            margin-top: 10px;
        }
    </style>
</head>
<body>
    <div class="loading-container">
        <div class="spinner"></div>
        <h2>Loading VPAX File...</h2>
        <p>Parsing VertiPaq Analyzer data</p>
    </div>
</body>
</html>`;
    }

    private getErrorHtml(error: any): string {
        return `<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-errorForeground);
            padding: 20px;
        }
        .error {
            background: var(--vscode-inputValidation-errorBackground);
            border: 1px solid var(--vscode-inputValidation-errorBorder);
            padding: 20px;
            border-radius: 5px;
        }
    </style>
</head>
<body>
    <div class="error">
        <h2>❌ Error Loading VPAX File</h2>
        <p>${this.escapeHtml(String(error))}</p>
    </div>
</body>
</html>`;
    }

    private formatNumber(num: number): string {
        return new Intl.NumberFormat().format(Math.round(num));
    }

    private formatBytes(bytes: number): string {
        const mb = bytes / (1024 * 1024);
        return mb.toFixed(2);
    }

    private formatBytesAsKB(bytes: number): string {
        const kb = bytes / 1024;
        return new Intl.NumberFormat().format(Math.round(kb));
    }

    private formatDateTime(dateString: string | undefined): string {
        if (!dateString) {
            return 'N/A';
        }
        try {
            const date = new Date(dateString);
            return date.toLocaleString('en-US', {
                month: '2-digit',
                day: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch {
            return dateString;
        }
    }

    private escapeHtml(text: string): string {
        const div = { textContent: text };
        return String(div.textContent)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    private getNonce(): string {
        let text = '';
        const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 32; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    }
}
