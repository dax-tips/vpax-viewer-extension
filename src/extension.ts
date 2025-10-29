import * as vscode from 'vscode';
import { VpaxEditorProvider } from './vpaxEditorProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('VertiPaq Analyzer Viewer is now active!');

    // Register the custom editor provider
    const provider = new VpaxEditorProvider(context);
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
    context.subscriptions.push(registration);

    // Register command to open VPAX files
    const openCommand = vscode.commands.registerCommand('vpaxViewer.open', async (uri: vscode.Uri) => {
        if (uri && uri.fsPath.endsWith('.vpax')) {
            await vscode.commands.executeCommand('vscode.openWith', uri, 'vpaxViewer.editor');
        }
    });
    context.subscriptions.push(openCommand);
}

export function deactivate() {
    console.log('VertiPaq Analyzer Viewer is now deactivated');
}
