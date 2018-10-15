import fs = require('fs-extra');
import path = require('path');
import minimist = require('minimist');

console.log(`=======================`);
console.log(`indefinitely-typed installation ...`);

interface Args {
    omitThis: boolean;
    copy: string | string[];
}

interface PackageJson {
    name: string;
    isScoped?: boolean;
}

function copyToTypes(dir: string, typesDir: string) {
    const destDir = path.resolve(typesDir, dir);
    if (fs.existsSync(destDir)) {
        console.log(`${dir} found ${destDir} , deleting`);
        fs.removeSync(destDir);
    }
    const srcDir = path.resolve(cwd, dir);
    console.log(`${dir} copying ${srcDir} to ${destDir}`);

    const childNodeModules = path.resolve(srcDir, 'node_modules');
    fs.copySync(srcDir, destDir, { filter: subPath => subPath.indexOf(childNodeModules) === -1 });
}

const args = minimist(process.argv.slice(2)) as any as Args;
console.log('args:', args);

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

    const types = path.resolve(node_modules, '@types');
    if (!fs.existsSync(types)) {
        console.log(`creating folder ${types}`);
        fs.mkdirSync(types);
    }
    console.log(`using @types folder at ${types}`);

    let copies: string[] = [];
    if (args.omitThis) {
        console.log(`--omitThis passed, omitting root folder`);
    } else {
        copies.push('.');
    }

    if (Array.isArray(args.copy)) {
        copies.push.apply(copies, args.copy);
    } else if (typeof args.copy === 'string') {
        const split = args.copy.split(',');
        copies.push.apply(copies, split);
    }

    copies.forEach(copy => copyToTypes(copy, types));

    console.log(`installation complete!`)
}

console.log(`=======================`);
