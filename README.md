# boursorama-to-jepilote
A simple but effective package and CLI tool which takes a Boursorama CSV file and converts it to a JePilote date format

# What is it about?
This package is used to accomodate the lousy date format JePilote, an accounting online tool, use for its CSV imports.
It parses a CSV file, modifies the "dateOp" and "dateVal" dates and unparses the CSV back.

## Installation and Usage

### As a module

```ts
import transformDate from "boursorama-to-jepilote"

// Open your CSV with the correct encoding (e.g from File or Buffer)
const csvString = "dateOp;dateVal;xxx;xxx\\r\\n2021-07-30;2021-07-30;yyy;yyy"
const transformedCsv = transformDate(csvString);

// output string : "dateOp;dateVal;xxx;xxx\\r\\n30/07/2021;30/07/2021;yyy;yyy"

```
### As a CLI tool

```bash
npx boursorama-to-jepilote 'inputfile' 'outputfile?'
```

you can also install it globally and use the `bjt` command

```bash
npm install -g boursorama-to-inputfile
bjt 'inputfile' 'outputfile?'
```


## Quirks and improvements

- allow for separator selection
- providing a list of field names to be arranged
