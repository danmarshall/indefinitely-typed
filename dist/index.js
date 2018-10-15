"use strict";
exports.__esModule = true;
var fs = require("fs-extra");
var path = require("path");
var minimist = require("minimist");
console.log("=======================");
console.log("indefinitely-typed installation ...");
function copyToTypes(dir, typesDir) {
    var destDir = path.resolve(typesDir, dir);
    if (fs.existsSync(destDir)) {
        console.log(dir + " found " + destDir + " , deleting");
        fs.removeSync(destDir);
    }
    var srcDir = path.resolve(cwd, dir);
    console.log(dir + " copying " + srcDir + " to " + destDir);
    var childNodeModules = path.resolve(srcDir, 'node_modules');
    fs.copySync(srcDir, destDir, { filter: function (subPath) { return subPath.indexOf(childNodeModules) === -1; } });
}
var args = minimist(process.argv.slice(2));
console.log('args:', args);
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
    var types_1 = path.resolve(node_modules, '@types');
    if (!fs.existsSync(types_1)) {
        console.log("creating folder " + types_1);
        fs.mkdirSync(types_1);
    }
    console.log("using @types folder at " + types_1);
    var copies = [];
    if (args.omitThis) {
        console.log("--omitThis passed, omitting root folder");
    }
    else {
        copies.push('.');
    }
    if (Array.isArray(args.copy)) {
        copies.push.apply(copies, args.copy);
    }
    else if (typeof args.copy === 'string') {
        var split = args.copy.split(',');
        copies.push.apply(copies, split);
    }
    copies.forEach(function (copy) { return copyToTypes(copy, types_1); });
    console.log("installation complete!");
}
console.log("=======================");
