import fs = require('fs-extra');
import path = require('path');
import minimist = require('minimist');

interface Args extends minimist.ParsedArgs {
    folder?: string | string[];
}

interface PackageJson {
    name: string;
    isScoped?: boolean;
}

const log = console.log;

log(`=======================`);
log(`indefinitely-typed installation ...`);

const argv = minimist(process.argv.slice(2)) as Args;
log('args:', argv);

const cwd = process.cwd();
log(`cwd: ${cwd}`);

const pathToPackageJson = path.resolve(cwd, 'package.json');
log(`looking for package.json at: ${pathToPackageJson}`);

if (!fs.existsSync(pathToPackageJson)) {
    log(`package.json not found, aborting.`);
} else {

    const packageJson = require(pathToPackageJson) as PackageJson;
    log(`package name is : ${packageJson.name}`);

    packageJson.isScoped =
        packageJson.name.substr(0, 1) === '@' &&
        packageJson.name.indexOf('/') > 1;
    log(`package is ${packageJson.isScoped ? '' : 'not '}scoped.`);

    const node_modules = path.resolve(cwd, packageJson.isScoped ? '../..' : '..');
    log(`using node_modules at ${node_modules}`);

    const segments = node_modules.split(path.sep);
    if (segments[segments.length - 1] !== 'node_modules') {
        log(`error: this is not a node_modules folder.`);
    } else {

        const types = path.resolve(node_modules, '@types');
        if (!fs.existsSync(types)) {
            log(`creating folder ${types}`);
            fs.mkdirSync(types);
        }
        log(`using @types folder at ${types}`);

        let folders: string[] = [];

        if (Array.isArray(argv.folder)) {
            folders = argv.folder;
        } else {
            folders = [argv.folder];
        }

        folders.forEach(folder => {
            log(`---`);
            log(`folder: ${folder}`);

            const destDir = path.resolve(types, folder);
            if (fs.existsSync(destDir)) {
                log(`deleting existing ${destDir} , `);
                fs.removeSync(destDir);
            }
            const srcDir = path.resolve(cwd, folder);
            log(`copying ${srcDir} to ${destDir}`);

            fs.copySync(srcDir, destDir);

            log(`${folder} complete!`);
        });

        log(`installation complete!`)
    }
}

log(`=======================`);
