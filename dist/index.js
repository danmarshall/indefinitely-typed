"use strict";
exports.__esModule = true;
var minimist = require("minimist");
var it = 'indefinitely-typed';
console.log("=======================");
console.log(it + " installation ...");
var argv = minimist(process.argv.slice(2));
console.log('args', argv);
console.log(__dirname);
console.log("process.cwd(): " + process.cwd());
// const types = path.resolve(__dirname, '../../../@types');
// if (!fs.existsSync(types)) {
//     console.log(`${it} creating folder ${types}`)
//     //fs.mkdirSync(types);
// }
// const dirsToCopy = ['deck.gl__core', 'deck.gl__layers', 'deck.gl__react', 'deck.gl', 'luma.gl', 'math.gl'];
// dirsToCopy.forEach(dir => {
//     const destDir = path.resolve(types, dir);
//     if (fs.existsSync(destDir)) {
//         console.log(`${d} found ${destDir} , deleting`);
//         fs.removeSync(destDir);
//     }
//     const srcDir = path.resolve(__dirname, '..', dir);
//     console.log(`${d} copying ${srcDir} to ${destDir}`);
//     fs.copySync(srcDir, destDir);
// });
console.log(it + " installation complete!");
console.log("=======================");
