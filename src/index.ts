import fs = require('fs-extra');
import path = require('path');

console.log(`=======================`);
console.log(`indefinitely-typed installation ...`);

interface Args {
    omitThis: boolean;
    copy: string[];
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

const argv = process.argv.slice(2);
console.log('raw args:', argv);

const args: Args = {
    omitThis: argv.indexOf('--omitThis') !== -1,
    copy: argv.filter(arg => arg !== '--omitThis')
};
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

        if (args.omitThis) {
            console.log(`--omitThis passed, omitting root folder`);
        } else {
            args.copy.push('.');
        }

        args.copy.forEach(copy => copyToTypes(copy, types));

        console.log(`installation complete!`)
    }
}

console.log(`=======================`);
