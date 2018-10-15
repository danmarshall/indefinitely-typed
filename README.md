# 🐣 indefinitely-typed

For TypeScript declarations that are still ...hatching.

[DefinitelyTyped](http://definitelytyped.org/) is the repository for __high quality__ TypeScript type definitions. Use this tool if your definitions are not yet up to that quality bar, but you still need to use them in a project.

## Usage

Let's say that you want to create TypeScript declarations for `cool-package`.

1. Create an NPM package for your typings, perhaps name it `cool-package-typings`.
1. `npm install indefinitely-typed`.
1. Create a folder named `cool-package`.
1. Add declaration files in this folder, like `index.d.ts`.
1. In the `package.json`'s `scripts`, add a `postinstall` script like this:
```
"postinstall": "indefinitely-typed --folder cool-package"
```

Now, when somebody installs `cool-package-typings`, they will have a `node_modules/@types/cool-package` folder, readily usable by their TypeScript project.


### Multiple packages
If you have multiple packages, add more folder parameters like this:
```
indefinitely-typed --folder folder1 --folder folder2 --folder folder3
```
