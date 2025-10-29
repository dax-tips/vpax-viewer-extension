import * as vscode from 'vscode';
import { VpaxEditorProvider } from './vpaxEditorProvider';

export function activate(context: vscode.ExtensionContext) {
    const activationStart = Date.now();
    console.log('[VPAX] 🚀 Extension activation started');
    
    // Use setTimeout to defer registration and ensure activation completes
    setTimeout(() => {
        console.log('[VPAX] ⏰ Deferred registration starting...');
        registerExtension(context);
    }, 100);
    
    const activationEnd = Date.now();
    console.log(`[VPAX] 🎉 Extension activation completed (deferred) in ${activationEnd - activationStart}ms`);
}

function registerExtension(context: vscode.ExtensionContext) {
    try {
        console.log('[VPAX] 📝 Creating provider instance...');
        const providerStart = Date.now();
        const provider = new VpaxEditorProvider(context);
        const providerEnd = Date.now();
        console.log(`[VPAX] ✅ Provider created in ${providerEnd - providerStart}ms`);
        
        console.log('[VPAX] 🔧 Registering custom editor provider...');
        const registrationStart = Date.now();
        const registration = vscode.window.registerCustomEditorProvider(
            'vpaxViewer.editor',
            provider,
            {
                webviewOptions: {
                    retainContextWhenHidden: true,
                },
                supportsMultipleEditorsPerDocument: false,
            }
        );
        const registrationEnd = Date.now();
        console.log(`[VPAX] ✅ Custom editor provider registered in ${registrationEnd - registrationStart}ms`);
        
        context.subscriptions.push(registration);

        // Register command to open VPAX files
        console.log('[VPAX] 🔧 Registering command...');
        const commandStart = Date.now();
        const openCommand = vscode.commands.registerCommand('vpaxViewer.open', async (uri: vscode.Uri) => {
            console.log('[VPAX] 📂 Open command called for:', uri?.fsPath);
            if (uri && uri.fsPath.endsWith('.vpax')) {
                await vscode.commands.executeCommand('vscode.openWith', uri, 'vpaxViewer.editor');
            }
        });
        context.subscriptions.push(openCommand);
        const commandEnd = Date.now();
        console.log(`[VPAX] ✅ Command registered in ${commandEnd - commandStart}ms`);
        
        console.log('[VPAX] 🎉 All registrations completed successfully');
        
    } catch (error) {
        console.error('[VPAX] ❌ Deferred registration failed:', error);
        if (error instanceof Error) {
            console.error('[VPAX] ❌ Stack trace:', error.stack);
        }
    }
}

export function deactivate() {
    console.log('VertiPaq Analyzer Viewer is now deactivated');
}
