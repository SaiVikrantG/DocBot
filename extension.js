// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "vscode-doc-bot-extension" is now active!');
	
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('vscode-doc-bot-extension.error', function () {
		// The code you place here will be executed every time your command is executed

		// Display a message box to the user
		vscode.window.showInformationMessage('Bye Bye VSCode from DocBot!');
		
		const terminal = vscode.window.activeTerminal;

		terminal.sendText('python3\na=3\nb=5\nc=a+b\nc\n');

		console.log(terminal);
	});

	const askQuestion = vscode.commands.registerCommand("vscode-doc-bot-extension.askQuestion",async () =>{
		const ans = await vscode.window.showInformationMessage("How was your day?","good","bad");
		
		console.log(ans);
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(askQuestion);
}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
