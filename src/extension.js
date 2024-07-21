// @ts-nocheck
const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "vscode-doc-bot-extension" is now active!');
	
	const terminalCommand = vscode.commands.registerCommand('vscode-doc-bot-extension.callBot', async () => {
		const editor = vscode.window.activeTextEditor;

		// Check if there's an active editor
		if (editor) {
		// Get the selected text
		const selection = editor.selection;
		const selectedText = editor.document.getText(selection);

		// Show the selected text in an information message
		console.log(selectedText);

		const newText = "Answer from Doc Bot API"

		if (newText !== undefined) {
			// Apply the replacement
			editor.edit(editBuilder => {
			  editBuilder.replace(selection, newText);
			}).then(success => {
			  if (success) {
				vscode.window.showInformationMessage('Selected text replaced successfully.');
			  } else {
				vscode.window.showErrorMessage('Failed to replace text.');
			  }
			});
		  }
		} 
		else {
		vscode.window.showInformationMessage('No active editor found.');
		}
	  });
	

	const disposable = vscode.commands.registerCommand('vscode-doc-bot-extension.error', function () {

		vscode.window.showInformationMessage('Bye Bye VSCode from DocBot!');
		
		const terminal = vscode.window.activeTerminal;

		terminal.sendText('python3\na=3\nb=5\nc=a+b\nc\nexit\n');

		console.log(terminal);
	});

	const askQuestion = vscode.commands.registerCommand("vscode-doc-bot-extension.askQuestion", async () =>{
		const ans = await vscode.window.showInformationMessage("How was your day?","good","bad");
		
		console.log(ans);
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(askQuestion);
	context.subscriptions.push(terminalCommand);
}


function deactivate() {}

module.exports = {
	activate,
	deactivate
}
