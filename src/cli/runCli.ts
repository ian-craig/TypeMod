import { Command } from "commander";
import * as fs from "mz/fs";
import { main } from "../main";
import path from "path";
import * as ts from "typescript";

interface CliArgs {
    project: string;
}

/**
 * Parses raw string arguments and, if they're valid, calls to a main method.
 *
 * @param rawArgv   Raw string arguments and any system dependency overrides.
 * @param mainRunner   Method to run with parsed arguments: generally `typeStat`.
 * @returns Promise for the result of running TypeStat.
 */
export const runCli = async (): Promise<void> => {
    const args = new Command()
        .option("-p --project <tsconfigFilePath>", "path to a TypeScript project file")
        .parse(process.argv) as any as CliArgs;

    if (!fs.existsSync(args.project)) {
        throw "Project file does not exist";
    }

    const compilerOptions = ts.parseConfigFileTextToJson(args.project, fs.readFileSync(args.project, "utf8"));
    if (compilerOptions.error !== undefined) {
        throw new Error(`Could not parse compiler options from '${args.project}': ${compilerOptions.error}`);
    }

    await main(compilerOptions.config, path.dirname(args.project));
};

runCli();