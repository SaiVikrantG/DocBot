// @ts-nocheck
const vscode = require('vscode');

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	console.log('Congratulations, your extension "vscode-doc-bot-extension" is now active!');
	
	context.subscriptions.push(vscode.window.registerWebviewViewProvider(
		'docBotView', // Must match the id in package.json
		new MyWebviewViewProvider(context)
	  ));

	let askLink = vscode.commands.registerCommand('vscode-doc-bot-extension.storeWebLink', async () => {
		const panel = vscode.window.createWebviewPanel(
			'webLinkInput', // Identifies the type of the webview
			'Enter Web Link', // Title of the panel displayed to the user
			vscode.ViewColumn.One, // Editor column to show the new webview panel in
			{
			  enableScripts: true // Allows the webview to use JavaScript
			}
		  );
	  
		  // Set the HTML content for the webview
		  panel.webview.html = getWebviewContent();
	  
		  // Handle messages from the webview
		  panel.webview.onDidReceiveMessage(
			message => {
			  switch (message.command) {
				case 'submit':
				  const webLink = message.text;
				  console.log(webLink)

				  // Store the web link
				  context.globalState.update('storedWebLink', webLink);
				  vscode.window.showInformationMessage('Web link stored successfully.');
				  return;
			  }
			},
			undefined,
			context.subscriptions
		  );
	  });
	
	context.subscriptions.push(askLink);
	

	const terminalCommand = vscode.commands.registerCommand('vscode-doc-bot-extension.callBot', async () => {
		const editor = vscode.window.activeTextEditor;

		// Check if there's an active editor
		if (editor) {
		
			const storedWebLink = context.globalState.get('storedWebLink');
			if(storedWebLink===undefined)
			{
				vscode.window.showErrorMessage('Web Link not entered');
				return
			}

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

class MyWebviewViewProvider {
	constructor(context) {
	  this._context = context;
	}
  
	resolveWebviewView(webviewView, context, token) {
	  webviewView.webview.html = getWebviewContent();
  
	  webviewView.webview.onDidReceiveMessage(
		message => {
		  switch (message.command) {
			case 'submit':
			  const webLink = message.text;
			  this._context.globalState.update('storedWebLink', webLink);
			  vscode.window.showInformationMessage('Web link stored successfully.');
			  return;
		  }
		},
		undefined,
		this._context.subscriptions
	  );
	}
  }

function getWebviewContent() {
	// Return the HTML content for the webview
	return `
	  <!DOCTYPE html>
	  <html lang="en">
	  <head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Enter Web Link</title>
		<style>
		  body {
			font-family: Arial, sans-serif;
			padding: 10px;
		  }
		  input {
			width: 100%;
			padding: 8px;
			margin: 5px 0 10px 0;
		  }
		  button {
			padding: 10px 20px;
			font-size: 16px;
		  }
		</style>
	  </head>
	  <body>
		<h1>Enter Web Link</h1>
		<input id="webLinkInput" type="text" placeholder="https://example.com" />
		<button onclick="submitLink()">Submit</button>
		<script>
		  const vscode = acquireVsCodeApi();
		  function submitLink() {
			const input = document.getElementById('webLinkInput');
			vscode.postMessage({
			  command: 'submit',
			  text: input.value
			});
		  }
		</script>
	  </body>
	  </html>
	`;
  }

module.exports = {
	activate,
	deactivate
}
