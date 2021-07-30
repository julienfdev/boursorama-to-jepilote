#!/usr/bin/env node

import fs from "fs/promises"
import chalk from "chalk"
import iconv from "iconv-lite"
import transformDate from "./";

console.log(chalk.bgCyan.black("---- Boursorama to JePilote CLI CSV Parser ----"));
const args = process.argv;

// Checking if file has been provided
if (args.length < 3) {
    console.error(chalk.bold.red("No file provided!"))
    console.error(chalk.underline("Use : $ btj input | btj input output"))
}
else if (args.length > 4) {
    console.error(chalk.bold.red("Too much arguments!"))
    console.error(chalk.underline("Use : $ btj input | btj input output"))
}
else {
    main();
}

async function main(): Promise<void> {
    // Checking if file path is relative, absolute, or starts with user alias (linux and MacOS), and return the absolute file path to open
    const filepath = args[2];
    const absoluteFilepath = getAbsoluteFilePath(filepath);
    // If there is a third argument, it's the output file so we get its absolute path or we just insert -jepilote into the input filename
    const outputPath = args.length == 4 ? getAbsoluteFilePath(args[3]) : absoluteFilepath.replace(".csv", "-jepilote.csv");
    try {
        // We try to open the file as binary
        console.log(chalk.bold("Opening file: ") + filepath);
        const file = await fs.readFile(absoluteFilepath)
        console.log(chalk.bold.green("Success!"));
        // CSV file encoding from Boursorama is Win1252 for Excel compatibility (damn primitive beings)
        const csvString = iconv.decode(file, 'win1252');
        const transformedString = transformDate(csvString);
        console.log(chalk.bold("Writing file back to : ") + outputPath);
        await fs.writeFile(outputPath, iconv.encode(transformedString, 'win1252'));
    } catch (error) {
        console.error(error);
        process.exit(1)
    }
    process.exit(0);
}

function getAbsoluteFilePath(filepath: string): string {
    // this is OS dependent :
    const isPathAbsolute = process.platform == "win32" ? filepath[1] == ":" : filepath.startsWith('/');
    if (isPathAbsolute) {
        return filepath
    }
    else {
        if (filepath.startsWith('./')) {
            return `${process.cwd()}/${filepath.slice(2)}`
        }
        else {
            // If this is just a filename
            return `${process.cwd()}/${filepath}`
        }
    }
}