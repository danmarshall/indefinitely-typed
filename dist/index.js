"use strict";
exports.__esModule = true;
var fs = require("fs-extra");
var path = require("path");
var minimist = require("minimist");
var log = console.log;
log("=======================");
log("indefinitely-typed installation ...");
var argv = minimist(process.argv.slice(2));
log('args:', argv);
var cwd = process.cwd();
log("cwd: " + cwd);
var pathToPackageJson = path.resolve(cwd, 'package.json');
log("looking for package.json at: " + pathToPackageJson);
if (!fs.existsSync(pathToPackageJson)) {
    log("package.json not found, aborting.");
}
else {
    var packageJson = require(pathToPackageJson);
    log("package name is : " + packageJson.name);
    packageJson.isScoped =
        packageJson.name.substr(0, 1) === '@' &&
            packageJson.name.indexOf('/') > 1;
    log("package is " + (packageJson.isScoped ? '' : 'not ') + "scoped.");
    var node_modules = path.resolve(cwd, packageJson.isScoped ? '../..' : '..');
    log("using node_modules at " + node_modules);
    var segments = node_modules.split(path.sep);
    if (segments[segments.length - 1] !== 'node_modules') {
        log("error: this is not a node_modules folder.");
    }
    else {
        var types_1 = path.resolve(node_modules, '@types');
        if (!fs.existsSync(types_1)) {
            log("creating folder " + types_1);
            fs.mkdirSync(types_1);
        }
        log("using @types folder at " + types_1);
        var folders = [];
        if (Array.isArray(argv.folder)) {
            folders = argv.folder;
        }
        else {
            folders = [argv.folder];
        }
        folders.forEach(function (folder) {
            log("---");
            log("folder: " + folder);
            var destDir = path.resolve(types_1, folder);
            if (fs.existsSync(destDir)) {
                log("deleting existing " + destDir + " , ");
                fs.removeSync(destDir);
            }
            var srcDir = path.resolve(cwd, folder);
            log("copying " + srcDir + " to " + destDir);
            fs.copySync(srcDir, destDir);
            log(folder + " complete!");
        });
        log("installation complete!");
    }
}
log("=======================");
