"use strict";
exports.__esModule = true;
var fs = require("fs-extra");
var path = require("path");
var minimist = require("minimist");
console.log("=======================");
console.log("indefinitely-typed installation ...");
function copyToTypes(folder, typesDir) {
    console.log("---");
    console.log("folder: " + folder);
    var destDir = path.resolve(typesDir, folder);
    if (fs.existsSync(destDir)) {
        console.log("deleting existing " + destDir + " , ");
        fs.removeSync(destDir);
    }
    var srcDir = path.resolve(cwd, folder);
    console.log("copying " + srcDir + " to " + destDir);
    fs.copySync(srcDir, destDir);
    console.log(folder + " complete!");
}
var argv = minimist(process.argv.slice(2));
console.log('args:', argv);
var cwd = process.cwd();
console.log("cwd: " + cwd);
var pathToPackageJson = path.resolve(cwd, 'package.json');
console.log("looking for package.json at: " + pathToPackageJson);
if (!fs.existsSync(pathToPackageJson)) {
    console.log("package.json not found, aborting.");
}
else {
    var packageJson = require(pathToPackageJson);
    console.log("package name is : " + packageJson.name);
    packageJson.isScoped =
        packageJson.name.substr(0, 1) === '@' &&
            packageJson.name.indexOf('/') > 1;
    console.log("package is " + (packageJson.isScoped ? '' : 'not ') + "scoped.");
    var node_modules = path.resolve(cwd, packageJson.isScoped ? '../..' : '..');
    console.log("using node_modules at " + node_modules);
    var segments = node_modules.split(path.sep);
    if (segments[segments.length - 1] !== 'node_modules') {
        console.log("error: this is not a node_modules folder.");
    }
    else {
        var types_1 = path.resolve(node_modules, '@types');
        if (!fs.existsSync(types_1)) {
            console.log("creating folder " + types_1);
            fs.mkdirSync(types_1);
        }
        console.log("using @types folder at " + types_1);
        var folders = [];
        if (Array.isArray(argv.folder)) {
            folders = argv.folder;
        }
        else {
            folders = [argv.folder];
        }
        folders.forEach(function (folder) { return copyToTypes(folder, types_1); });
        console.log("installation complete!");
    }
}
console.log("=======================");
