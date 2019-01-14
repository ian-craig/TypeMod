import { createLanguageServices } from "./api/services/language";
import * as ts from "typescript";
import chalk from "chalk";
import { transform } from "./api/transform/transform";

export const main = (tsconfig: any, projectPath: string) => {
    const { languageService, parsedConfiguration, program } = createLanguageServices(tsconfig, projectPath);
    const printer = ts.createPrinter();

    const renameVarFooToFoo2 = (sourceFile: ts.SourceFile) => {
        // TODO Learn more about ts transforms
        transform(sourceFile, [
            [ts.isVariableDeclaration, (node: ts.VariableDeclaration) => {
                if (ts.isIdentifier(node.name) && node.name.escapedText === "foo") {
                    node.name = ts.createIdentifier("foo2");
                }
                return node;
            }]
        ])
    };
    
    const renameClassFooWithReferences = (sourceFile: ts.SourceFile, sourceFilePath: string) => {
        transform(sourceFile, [
            [ts.isClassDeclaration, (node: ts.ClassDeclaration) => {
                if (node.name !== undefined) {
                    const refs = languageService.findRenameLocations(sourceFilePath, node.name.getStart(), false /* findInStrings */, false /* findInComments */);
                    console.log(`Renames locations for class ${node.name.escapedText}\n`, refs);
                }
                return node;
            }]
        ])
    };

    for (const sourceFilePath of parsedConfiguration.fileNames) {
        console.log(chalk.blue(sourceFilePath));
        const sourceFile = program.getSourceFile(sourceFilePath);
        if (sourceFile === undefined) {
            throw "Failed to load source file";
        }

        renameClassFooWithReferences(sourceFile, sourceFilePath);
        renameVarFooToFoo2(sourceFile);

        console.log("Source after AST modifications\n", printer.printFile(sourceFile));
    }
};