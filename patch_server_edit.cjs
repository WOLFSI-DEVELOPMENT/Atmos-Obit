const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const oldInstruction = `To create or edit a file: Output a JSON object with "type" set to "Script", "LocalScript", or "ModuleScript", a "path" (e.g. "ServerScriptService.MyScript"), and the "code".
To manipulate the 3D world or UI: Output a JSON object with "type" set to "Command", and the "code" field should contain a raw Lua script that creates parts, models, or UIs using Instance.new. Commands are executed instantly via loadstring.
Format:
{
  "explanation": "Brief explanation",
  "files": [
    { "type": "Script", "path": "ServerScriptService.MyScript", "content": "..." },
    { "type": "Command", "content": "local part = Instance.new('Part'); part.Parent = workspace" }
  ]
}`;

const newInstruction = `To create a new file: Output a JSON object with "type" set to "Script", "LocalScript", or "ModuleScript", a "path" (e.g. "ServerScriptService.MyScript"), and "content".
To edit an existing file: Output a JSON object with "type" set to "Edit", the "path", the exact "find" string you want to replace, and the "replace" string. This is faster and prevents bugs from rewriting the whole file. The "find" block must match EXACTLY.
To manipulate the 3D world or UI: Output a JSON object with "type" set to "Command", and "content" with raw Lua.
Format:
{
  "explanation": "Brief explanation",
  "edits": [
    { "type": "Edit", "path": "ServerScriptService.MyScript", "find": "old code...", "replace": "new code..." },
    { "type": "Script", "path": "StarterPlayer.StarterPlayerScripts.NewScript", "content": "..." },
    { "type": "Command", "content": "local part = Instance.new('Part'); part.Parent = workspace" }
  ]
}`;

if (code.includes(oldInstruction)) {
    code = code.replace(oldInstruction, newInstruction);
} else {
    console.log("Could not find instruction string");
}

const oldJsonParse = `      try {
        const jsonMatch = reply.match(/\\{[\\s\\S]*\\}/);
        if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            explanation = data.explanation || 'Code generated.';
            
            if (session && session.status === 'connected') {
                for (const file of data.files) {
                    session.pendingCode.push({
                        id: Math.random().toString(36).substring(7),
                        type: file.type,
                        path: file.path,
                        code: file.content
                    });
                    if (file.type !== 'Command') {
                        session.generatedFiles.push(file);
                    }
                }
            }
        }
      } catch (e) {
          console.error('Failed to parse AI JSON response', e);
      }
      
      res.json({ reply: explanation });`;

const newJsonParse = `      let diffs = [];
      try {
        const jsonMatch = reply.match(/\\{[\\s\\S]*\\}/);
        if (jsonMatch) {
            const data = JSON.parse(jsonMatch[0]);
            explanation = data.explanation || 'Code generated.';
            
            if (session && session.status === 'connected') {
                const editsArray = data.edits || data.files || [];
                for (const edit of editsArray) {
                    if (edit.type === 'Command') {
                        session.pendingCode.push({
                            id: Math.random().toString(36).substring(7),
                            type: edit.type,
                            code: edit.content || edit.code
                        });
                    } else if (edit.type === 'Edit') {
                        let existingFile = session.generatedFiles.find(f => f.path === edit.path);
                        if (existingFile && edit.find) {
                            if (existingFile.content.includes(edit.find)) {
                                existingFile.content = existingFile.content.replace(edit.find, edit.replace);
                                const linesRemoved = edit.find.split('\\n').length;
                                const linesAdded = edit.replace.split('\\n').length;
                                diffs.push({ path: edit.path, linesAdded, linesRemoved });
                                
                                session.pendingCode.push({
                                    id: Math.random().toString(36).substring(7),
                                    type: existingFile.type,
                                    path: existingFile.path,
                                    code: existingFile.content
                                });
                            }
                        }
                    } else {
                        // New file or overwrite
                        let existingFile = session.generatedFiles.find(f => f.path === edit.path);
                        const newContent = edit.content || edit.code || '';
                        const linesAdded = newContent.split('\\n').length;
                        
                        if (existingFile) {
                            const linesRemoved = existingFile.content.split('\\n').length;
                            existingFile.content = newContent;
                            diffs.push({ path: edit.path, linesAdded, linesRemoved });
                        } else {
                            session.generatedFiles.push({ path: edit.path, type: edit.type, content: newContent });
                            diffs.push({ path: edit.path, linesAdded, linesRemoved: 0 });
                        }
                        
                        session.pendingCode.push({
                            id: Math.random().toString(36).substring(7),
                            type: edit.type,
                            path: edit.path,
                            code: newContent
                        });
                    }
                }
            }
        }
      } catch (e) {
          console.error('Failed to parse AI JSON response', e);
      }
      
      if (session) {
        // Find the last model message we just pushed and add diffs to it
        const lastMsg = session.history[session.history.length - 1];
        if (lastMsg.role === 'model') {
           lastMsg.diffs = diffs;
        }
      }
      
      res.json({ reply: explanation, diffs });`;

if (code.includes(oldJsonParse)) {
    code = code.replace(oldJsonParse, newJsonParse);
} else {
    console.log("Could not find json parse block");
}

fs.writeFileSync('server.ts', code);
console.log("Patched server.ts");
