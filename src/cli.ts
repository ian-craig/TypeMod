import { Command } from "commander";
import * as fs from "mz/fs";
import { main } from "../main";
import path from "path";
import * as ts from "typescript";

interface CommandLineArgs {
    project: string;
}

export const runFromCommandLine = async (): Promise<void> => {
    const args = new Command()
        .option("-p --project <tsconfigFilePath>", "path to a TypeScript project file")
        .parse(process.argv) as any as CommandLineArgs;

    if (!fs.existsSync(args.project)) {
        throw "Project file does not exist";
    }

    const compilerOptions = ts.parseConfigFileTextToJson(args.project, fs.readFileSync(args.project, "utf8"));
    if (compilerOptions.error !== undefined) {
        throw new Error(`Could not parse compiler options from '${args.project}': ${compilerOptions.error}`);
    }

    await main(compilerOptions.config, path.dirname(args.project));
};

runFromCommandLine();