import * as fs from "mz/fs";
import * as ts from "typescript";
import { createProgramConfiguration } from "./createProgramConfiguration";

/**
 * Language service and type information with their backing TypeScript configuration.
 */
export interface LanguageServices {
    readonly parsedConfiguration: ts.ParsedCommandLine;
    readonly languageService: ts.LanguageService;
    readonly program: ts.Program;
}

/**
 * @returns Associated language service and type information based on TypeStat options.
 */
export const createLanguageServices = (tsconfig: any, projectPath: string): LanguageServices => {
    // Collect file names and parse raw options into a TypeScript program with its configuration settings
    const { fileNames, parsedConfiguration, program } = createProgramConfiguration(tsconfig, projectPath);

    // Create a TypeScript language service using the compiler host
    const servicesHost: ts.LanguageServiceHost = {
        fileExists: ts.sys.fileExists,
        getCompilationSettings: () => tsconfig.compilerOptions as ts.CompilerOptions,
        getCurrentDirectory: () => process.cwd(),
        getDefaultLibFileName: ts.getDefaultLibFilePath,
        getScriptFileNames: () => fileNames,
        getScriptSnapshot: (fileName) =>
            fs.existsSync(fileName) ? ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString()) : undefined,
        getScriptVersion: () => "0",
        readDirectory: ts.sys.readDirectory,
        readFile: ts.sys.readFile,
    };
    const languageService = ts.createLanguageService(servicesHost, ts.createDocumentRegistry());

    return { languageService, parsedConfiguration, program };
};
