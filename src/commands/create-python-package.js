const vscode = require("vscode");

const fs = require("fs");
const path = require("path");

const initContent = `"""
--> PACKAGE DESCRIPTION HERE!! <--
"""

__author__  = "ReddyyZ"
__license__ = "MIT License"
__version__ = "0.0.1"

#
# Recommended
#
# from .MainFile import *
#
# __all__= [
#   "MyClass1",
#   "MyClass2"
#]
#
# - - - - - - - - - - - 
# How the package will be appear
#
# mypackage.MyClass1
#
# - - - - - - - - - - -
#
# Without this
#
# mypackage.MainFile.MyClass1
#
`;

const mitLicense = `MIT License

Copyright (c) 2021 YOUR_NAME

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
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
    const workspaceName = vscode.workspace.name;
    const folderPath = String(vscode.workspace.workspaceFolders[0].uri.path).substring(1);
    
    const setupContent = `import setuptools

with open("README.md", "r") as fd:
    long_description = fd.read()

with open("requirements.txt","r") as fh:
    requirements = fh.read().splitlines()

setuptools.setup(
    name="${workspaceName}",
    version="0.0.1",
    author="ReddyyZ",
    author_email="YOUR EMAIL HERE",
    description="SHORT DESCRIPTION",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="GITHUB REPO URL",
    packages=setuptools.find_packages(),
    install_requires=requirements,
    license="MIT",
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.6',
)
`;

    // Create directories
    createDir(folderPath, workspaceName);
    
    createFile(path.join(folderPath, "setup.py"), "setup.py", setupContent);
    createFile(path.join(folderPath, "requirements.txt"), "requirements.txt", "YOUR REQUIREMENTS");
    createFile(path.join(folderPath, "README.md"), "README.md", "# My Package Readme");
    createFile(path.join(folderPath, "LICENSE"), "LICENSE", mitLicense);
    createFile(path.join(folderPath, `${workspaceName}/__init__.py`), "__init__.py", initContent);

    return vscode.window.showInformationMessage('Python Package template created!');
};

const python_package = vscode.commands.registerCommand('redextension.create-python-package', main);
module.exports = python_package;