import { createLanguageServices } from "./api/services/language";
import * as ts from "typescript";
import { transform } from "./api/transform/transform";

export const main = (tsconfig: any, projectPath: string) => {
    const { languageService, parsedConfiguration, program } = createLanguageServices(tsconfig, projectPath);

    const sourceFile = program.getSourceFile(parsedConfiguration.fileNames[0]);
    if (sourceFile === undefined) {
        throw "Failed to load source file";
    }

    // TODO Learn more about ts transforms
    transform(sourceFile, [
        [ts.isVariableDeclaration, (node: ts.VariableDeclaration) => {
            node.name = ts.createIdentifier("bar");
            return node;
        }]
    ])

    const printer = ts.createPrinter();
    console.log(printer.printFile(sourceFile));
};