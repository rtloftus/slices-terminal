import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Extension Test Suite', () => {

  test('Extension loads and command exists', async () => {
    // This forces activation
    await vscode.commands.executeCommand('slices.start');

    const commands = await vscode.commands.getCommands(true);

    assert.ok(
      commands.includes('slices.start'),
      'Command not registered'
    );
  });

  test('Command executes', async () => {
    await vscode.commands.executeCommand('slices.start');
    assert.ok(true);
  });

});