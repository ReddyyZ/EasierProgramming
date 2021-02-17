const vscode = require("vscode");

const fs = require("fs");
const path = require("path");

const routesContent = `const express = require("express");
const routes = express.Router();

/*
// Import controllers 
const UserController = require('./controllers/UserController');

// Create routes
routes.get('/users/:username',UserController.show);
*/

routes.get('/', () => {return res.json({success: true})}));

module.exports = routes;
`;

const indexContent = `const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();
const port = 3333;

app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(3333, () => {
    console.log(\`\\x1b[33m
        _nnnn_
        dGGGGMMb
       @p~qp~~qMb
       M|@||@) M|
       @,----.JM|
      JS^\\\\__/  qKL
     dZP        qKRb
    dZP          qKKb
   fZP            SMMb
   HZM            MMMM
   FqM            MMMM
 __| ".        |\\\\dS"qML
 |    \\\`.       | \\\`' Zq
_)      \\\\.___.,|     .'
\\\\____   )MMMMMP|   .'
     \\\`-'       \\\`--'
Node.js backend template
Created with "Easier Programming" extension\\x1b[0m

Server started!
Listening on 127.0.0.1:\${port}
\`);
});
`;

const createDir = (folderPath, directory) => {
    if (typeof directory === "string"){
        if (!fs.existsSync(path.join(folderPath, directory))){
            fs.mkdir(path.join(folderPath, directory), () => {});
        };
    } else {
        directory.forEach(dir => {
            console.log(path.join(folderPath, dir));
            if (!fs.existsSync(path.join(folderPath, dir))){
                fs.mkdir(path.join(folderPath, dir), () => {});
            };
        });
    }
};

const createFile = (filePath, name, content) => {
    fs.writeFile(String(filePath), String(content), err => {
        if (err) {
            return vscode.window.showErrorMessage(
                `Failed to create ${name} file!` + String(err)
            );
        }
    });
};

const main = () => {
    const name = String(vscode.workspace.name);
    const folderPath = String(vscode.workspace.workspaceFolders[0].uri.path).substring(1);

    const packageContent = `{
  "name": "${name}",
  "version": "1.0.0",
  "main": "index.js",
  "license": "MIT",
  "scripts": {
    "start": "node src/index.js",
    "dev": "nodemon src/index.js"
  }
}
`;

    // Create directories
    createDir(folderPath, [
        "src",
        "src/pages"
    ]);

    createFile(path.join(folderPath, "src/index.js"), "index.js", indexContent);
    createFile(path.join(folderPath, "src/routes.js"), "routes.js", routesContent);
    createFile(path.join(folderPath, "package.json"), "package.json", packageContent);

    const terminal = vscode.window.createTerminal({
        name: "Easier Programming - Create Node.js backend template",
        cwd: folderPath,
        hideFromUser: false,
    });
    terminal.show();
    terminal.sendText(`cd ${folderPath}`);
    terminal.sendText("yarn create react-app frontend");
    terminal.sendText("cd frontend");
    terminal.sendText("yarn add react-router-dom");

    vscode.window.onDidCloseTerminal(t => {
        if (t.processId === terminal.processId) {
            if (t.exitStatus && t.exitStatus.code) { 
                vscode.window.showInformationMessage(`Exit code: ${t.exitStatus.code}`); 
            }
        }
    });

    return vscode.window.showInformationMessage('Node.js backend template created!');
};

const nodejs_backend = vscode.commands.registerCommand('easierprogramming.mrc-nodejs-backend', main);
module.exports = nodejs_backend;