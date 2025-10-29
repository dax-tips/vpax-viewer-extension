import * as fs from 'fs/promises';
import * as JSZip from 'jszip';

export interface VpaxData {
    modelName: string;
    tables: Table[];
    columns: Column[];
    relationships: Relationship[];
    partitions: Partition[];
    totalColumns: number;
    totalRows: number;
    totalSize: number;
    compatibilityLevel?: number;
    compatibilityMode?: string;
    lastDataRefresh?: string;
    extractionDate?: string;
    serverName?: string;
}

export interface Table {
    name: string;
    rowCount: number;
    totalSize: number;
    columnCount: number;
    relationshipCount: number;
}

export interface Column {
    tableName: string;
    columnName: string;
    dataType: string;
    cardinality: number;
    size: number;
    dataSize: number;
    dictionarySize: number;
    encoding: string;
    isHidden: boolean;
    isRowNumber: boolean;
}

export interface Relationship {
    fromTable: string;
    fromColumn: string;
    toTable: string;
    toColumn: string;
    cardinality: string;
}

export interface Partition {
    tableName: string;
    partitionName: string;
    mode: string;
    rowCount: number;
    segmentCount: number;
    recordsPerSegment: number;
    temperature?: number;
    lastAccessed?: string;
}

export class VpaxParser {
    constructor(private filePath: string) {}

    /**
     * Strip UTF-8 BOM from string if present
     */
    private stripBOM(content: string): string {
        if (content.charCodeAt(0) === 0xFEFF) {
            return content.slice(1);
        }
        return content;
    }

    /**
     * Safe JSON parse that strips BOM
     */
    private parseJSON(content: string): any {
        const cleaned = this.stripBOM(content);
        return JSON.parse(cleaned);
    }

    async parse(): Promise<VpaxData> {
        console.log('[VPAX] 🔍 VpaxParser.parse() started for file:', this.filePath);
        
        try {
            // Check if file exists
            console.log('[VPAX] 📁 Checking if file exists...');
            await fs.access(this.filePath);
            console.log('[VPAX] ✅ File exists and is accessible');

            // Read the .vpax file (it's a ZIP) - using async to prevent UI blocking
            console.log('[VPAX] 📖 Reading file into memory...');
            const readStartTime = Date.now();
            const fileBuffer = await fs.readFile(this.filePath);
            const readEndTime = Date.now();
            console.log(`[VPAX] ✅ File read completed in ${readEndTime - readStartTime}ms. Size: ${fileBuffer.length} bytes`);
            
            console.log('[VPAX] 📦 Loading ZIP archive...');
            const zipStartTime = Date.now();
            const zip = await JSZip.loadAsync(fileBuffer);
            const zipEndTime = Date.now();
            console.log(`[VPAX] ✅ ZIP loaded in ${zipEndTime - zipStartTime}ms`);

            // Try to parse DaxVpaView.json (main statistics file)
            console.log('[VPAX] 🔍 Looking for DaxVpaView.json...');
            let daxVpaView = null;
            const daxVpaViewFile = zip.file('DaxVpaView.json');
            if (daxVpaViewFile) {
                console.log('[VPAX] 📄 Found DaxVpaView.json, parsing...');
                const content = await daxVpaViewFile.async('string');
                daxVpaView = this.parseJSON(content);
                console.log('[VPAX] ✅ DaxVpaView.json parsed successfully');
            } else {
                console.log('[VPAX] ⚠️ DaxVpaView.json not found');
            }

            // Try to parse DaxModel.json (model metadata)
            console.log('[VPAX] 🔍 Looking for DaxModel.json...');
            let daxModel = null;
            const daxModelFile = zip.file('DaxModel.json');
            if (daxModelFile) {
                console.log('[VPAX] 📄 Found DaxModel.json, parsing...');
                const content = await daxModelFile.async('string');
                daxModel = this.parseJSON(content);
                console.log('[VPAX] ✅ DaxModel.json parsed successfully');
            } else {
                console.log('[VPAX] ⚠️ DaxModel.json not found');
            }

            // Try to parse Model.bim (TMSL)
            console.log('[VPAX] 🔍 Looking for Model.bim...');
            let modelBim = null;
            const modelBimFile = zip.file('Model.bim');
            if (modelBimFile) {
                console.log('[VPAX] 📄 Found Model.bim, parsing...');
                const content = await modelBimFile.async('string');
                modelBim = this.parseJSON(content);
                console.log('[VPAX] ✅ Model.bim parsed successfully');
            } else {
                console.log('[VPAX] ⚠️ Model.bim not found');
            }

            // Build the data structure
            console.log('[VPAX] 🏗️ Building data structure...');
            const buildStartTime = Date.now();
            const result = this.buildVpaxData(daxVpaView, daxModel, modelBim);
            const buildEndTime = Date.now();
            console.log(`[VPAX] ✅ Data structure built in ${buildEndTime - buildStartTime}ms`);
            console.log(`[VPAX] 📊 Result: ${result.tables.length} tables, ${result.columns.length} columns`);
            
            return result;

        } catch (error) {
            console.error('[VPAX] ❌ Error in parse():', error);
            throw new Error(`Failed to parse VPAX file: ${error}`);
        }
    }

    private buildVpaxData(daxVpaView: any, daxModel: any, modelBim: any): VpaxData {
        console.log('[VPAX] 🏗️ buildVpaxData started');
        const tables: Table[] = [];
        const columns: Column[] = [];
        const relationships: Relationship[] = [];
        const partitions: Partition[] = [];

        let totalRows = 0;
        let totalSize = 0;
        let totalColumns = 0;

        // Parse tables from DaxVpaView (best source for statistics)
        if (daxVpaView?.Tables) {
            for (const table of daxVpaView.Tables) {
                const tableName = table.TableName || table.Table || 'Unknown';
                const rowCount = table.RowsCount || table.Rows || 0;
                const tableSize = table.TableSize || table.TotalSize || 0;

                tables.push({
                    name: tableName,
                    rowCount: rowCount,
                    totalSize: tableSize,
                    columnCount: 0, // Will be calculated later from columns
                    relationshipCount: 0 // Will be calculated later from relationships
                });

                totalRows += rowCount;
                totalSize += tableSize;
            }
        }

        // Parse columns from DaxVpaView (stored separately at root level)
        if (daxVpaView?.Columns) {
            for (const col of daxVpaView.Columns) {
                const tableName = col.TableName || 'Unknown';
                columns.push({
                    tableName: tableName,
                    columnName: col.ColumnName || col.Column || 'Unknown',
                    dataType: col.DataType || 'Unknown',
                    cardinality: col.ColumnCardinality || col.Cardinality || 0,
                    size: col.TotalSize || 0,
                    dataSize: col.DataSize || 0,
                    dictionarySize: col.DictionarySize || 0,
                    encoding: col.Encoding || 'Unknown',
                    isHidden: col.IsHidden || false,
                    isRowNumber: col.IsRowNumber || false
                });
            }
            totalColumns = columns.length;
            
            // Update column counts per table (exclude hidden and RowNumber columns like DAX Studio)
            for (const table of tables) {
                table.columnCount = columns.filter(c => 
                    c.tableName === table.name && !c.isHidden && !c.isRowNumber
                ).length;
            }
            
            // Update total visible columns count (like DAX Studio does)
            totalColumns = columns.filter(c => !c.isHidden && !c.isRowNumber).length;
        }

        // Parse relationships from DaxVpaView if available (better source than Model.bim)
        if (daxVpaView?.Relationships) {
            for (const rel of daxVpaView.Relationships) {
                const fromTable = rel.FromTableName || 'Unknown';
                const toTable = rel.ToTableName || 'Unknown';
                
                relationships.push({
                    fromTable: fromTable,
                    fromColumn: this.extractColumnName(rel.FromFullColumnName) || 'Unknown',
                    toTable: toTable,
                    toColumn: this.extractColumnName(rel.ToFullColumnName) || 'Unknown',
                    cardinality: this.getCardinalityString(rel)
                });
            }
            
            // Update relationship counts per table
            for (const table of tables) {
                table.relationshipCount = relationships.filter(r => 
                    r.fromTable === table.name || r.toTable === table.name
                ).length;
            }
        } else if (modelBim?.model?.relationships) {
            // Fallback to Model.bim if DaxVpaView doesn't have relationships
            for (const rel of modelBim.model.relationships) {
                relationships.push({
                    fromTable: rel.fromTable || 'Unknown',
                    fromColumn: rel.fromColumn || 'Unknown',
                    toTable: rel.toTable || 'Unknown',
                    toColumn: rel.toColumn || 'Unknown',
                    cardinality: this.getCardinalityString(rel)
                });
            }
        }

        // Parse partitions from Model.bim and calculate segments from DaxVpaView
        if (modelBim?.model?.tables) {
            for (const table of modelBim.model.tables) {
                const tableName = table.name || 'Unknown';
                if (table.partitions) {
                    for (const partition of table.partitions) {
                        // Get row count from DaxVpaView tables (more reliable than Model.bim)
                        let rowCount = 0;
                        if (daxVpaView?.Tables) {
                            const tableData = daxVpaView.Tables.find((t: any) => t.TableName === tableName);
                            rowCount = tableData?.RowsCount || 0;
                        }
                        
                        // Count total column segments for this partition (all ColumnsSegments entries)
                        let totalSegments = 0;
                        let temperature: number | undefined;
                        let lastAccessed: string | undefined;
                        
                        if (daxVpaView?.ColumnsSegments) {
                            const partitionSegments = daxVpaView.ColumnsSegments.filter(
                                (seg: any) => seg.TableName === tableName && 
                                              seg.PartitionName === partition.name
                            );
                            totalSegments = partitionSegments.length;
                            
                            // Get temperature and last accessed from segments (use first non-null value)
                            for (const seg of partitionSegments) {
                                if (temperature === undefined && seg.Temperature !== null && seg.Temperature !== undefined) {
                                    temperature = seg.Temperature;
                                }
                                if (lastAccessed === undefined && seg.LastAccessTime) {
                                    lastAccessed = seg.LastAccessTime;
                                }
                                if (temperature !== undefined && lastAccessed !== undefined) {
                                    break;
                                }
                            }
                        }
                        
                        const recordsPerSegment = totalSegments > 0 ? Math.round(rowCount / totalSegments) : rowCount;
                        
                        partitions.push({
                            tableName: tableName,
                            partitionName: partition.name || 'Unknown',
                            mode: partition.mode || partition.type || 'Unknown',
                            rowCount: rowCount,
                            segmentCount: totalSegments,
                            recordsPerSegment: recordsPerSegment,
                            temperature: temperature,
                            lastAccessed: lastAccessed
                        });
                    }
                }
            }
        }

        // Get model name
        const modelName = modelBim?.model?.name || 
                         daxModel?.ModelName || 
                         'VPAX Model';

        return {
            modelName,
            tables,
            columns,
            relationships,
            partitions,
            totalColumns,
            totalRows,
            totalSize,
            compatibilityLevel: daxModel?.CompatibilityLevel,
            compatibilityMode: daxModel?.CompatibilityMode,
            lastDataRefresh: daxModel?.LastDataRefresh,
            extractionDate: daxModel?.ExtractionDate,
            serverName: daxModel?.ServerName
        };
    }

    /**
     * Extract column name from full column name format like 'TableName'[ColumnName]
     */
    private extractColumnName(fullColumnName: string | undefined): string | undefined {
        if (!fullColumnName) {
            return undefined;
        }
        const match = fullColumnName.match(/\[([^\]]+)\]/);
        return match ? match[1] : fullColumnName;
    }

    private getCardinalityString(rel: any): string {
        // Handle DaxVpaView format
        if (rel.FromCardinalityType || rel.ToCardinalityType) {
            const fromCard = rel.FromCardinalityType?.toLowerCase() || 'one';
            const toCard = rel.ToCardinalityType?.toLowerCase() || 'one';
            const isBidirectional = rel.CrossFilteringBehavior === 'BothDirections';
            
            return isBidirectional ? `${fromCard}:${toCard} ↔` : `${fromCard}:${toCard} →`;
        }
        
        // Handle Model.bim format (fallback)
        const fromCard = rel.fromCardinality || rel.isActive === false ? 'many' : 'one';
        const toCard = rel.toCardinality || 'many';
        
        if (rel.crossFilteringBehavior === 'bothDirections') {
            return `${fromCard}:${toCard} (bi-directional)`;
        }
        
        return `${fromCard}:${toCard}`;
    }
}
