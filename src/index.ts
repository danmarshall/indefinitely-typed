import fs = require('fs-extra');
import path = require('path');
import minimist = require('minimist');

console.log(`=======================`);
console.log(`indefinitely-typed installation ...`);

interface Args extends minimist.ParsedArgs {
    folder?: string | string[];
}

interface PackageJson {
    name: string;
    isScoped?: boolean;
}

function copyToTypes(folder: string, typesDir: string) {
    console.log(`---`);
    console.log(`folder: ${folder}`);

    const destDir = path.resolve(typesDir, folder);
    if (fs.existsSync(destDir)) {
        console.log(`deleting existing ${destDir} , `);
        fs.removeSync(destDir);
    }
    const srcDir = path.resolve(cwd, folder);
    console.log(`copying ${srcDir} to ${destDir}`);

    fs.copySync(srcDir, destDir);

    console.log(`${folder} complete!`);
}

const argv = minimist(process.argv.slice(2)) as Args;
console.log('args:', argv);

const cwd = process.cwd();
console.log(`cwd: ${cwd}`);

const pathToPackageJson = path.resolve(cwd, 'package.json');
console.log(`looking for package.json at: ${pathToPackageJson}`);

if (!fs.existsSync(pathToPackageJson)) {
    console.log(`package.json not found, aborting.`);
} else {

    const packageJson = require(pathToPackageJson) as PackageJson;
    console.log(`package name is : ${packageJson.name}`);

    packageJson.isScoped =
        packageJson.name.substr(0, 1) === '@' &&
        packageJson.name.indexOf('/') > 1;
    console.log(`package is ${packageJson.isScoped ? '' : 'not '}scoped.`);

    const node_modules = path.resolve(cwd, packageJson.isScoped ? '../..' : '..');
    console.log(`using node_modules at ${node_modules}`);

    const segments = node_modules.split(path.sep);
    if (segments[segments.length - 1] !== 'node_modules') {
        console.log(`error: this is not a node_modules folder.`);
    } else {

        const types = path.resolve(node_modules, '@types');
        if (!fs.existsSync(types)) {
            console.log(`creating folder ${types}`);
            fs.mkdirSync(types);
        }
        console.log(`using @types folder at ${types}`);

        let folders: string[] = [];

        if (Array.isArray(argv.folder)) {
            folders = argv.folder;
        } else {
            folders = [argv.folder];
        }

        folders.forEach(folder => copyToTypes(folder, types));

        console.log(`installation complete!`)
    }
}

console.log(`=======================`);
