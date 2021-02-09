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

module.exports = routes;
`;

const indexContent = `const express = require("express");
const cors = require("cors");
const routes = require("./routes");

const app = express();
app.use(express.json());
app.use(cors());
app.use(routes);

app.listen(3333, () => {
    console.log("Server started!\\nListening on 127.0.0.1:3333\\n");
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
    const folderPath = String(vscode.workspace.workspaceFolders[0].uri.path).substring(1);

    // Create directories
    createDir(folderPath, [
        "src",
        "src/controllers",
        "src/models"
    ]);

    createFile(path.join(folderPath, "src/index.js"), "index.js", indexContent);
    createFile(path.join(folderPath, "src/routes.js"), "routes.js", routesContent);

    return vscode.window.showInformationMessage('Node.js backend template created!');
};

const nodejs_backend = vscode.commands.registerCommand('redextension.mrc-nodejs-backend', main);
module.exports = nodejs_backend;