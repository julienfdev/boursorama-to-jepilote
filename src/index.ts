import papa from "papaparse"

export type DateObject = {
    year: string,
    month: string,
    day: string
}
export interface BoursoramaCSVEntry extends Record<string, any> {
    dateOp: string,
    dateVal: string
}

function returnParsedDateObject(date: string): DateObject {
    return {
        year: date.slice(0, 4),
        month: date.slice(5, 7),
        day: date.slice(8)
    }
}
function arrangeDate(dateObject: DateObject) {
    return `${dateObject.day}/${dateObject.month}/${dateObject.year}`
}

export default function transformDate(csvString: string): string {
    // Parsing the CSV into a object array, we typecast the required values to check them later
    // We check if the fields include the required dates
    console.log("Parsing CSV, arranging dates and unparsing it back")
    const parsedObject = (papa.parse(csvString, { header: true }))
    if (!(parsedObject.meta.fields && parsedObject.meta.fields.includes('dateOp') && parsedObject.meta.fields.includes('dateVal'))) {
        throw "File provided isn't a Boursorama CSV Export"
    }
    const parsedData = parsedObject.data as BoursoramaCSVEntry[]

    // we loop and parse the date, but first we need to throw an error if dateOp and dateVal don't exists
    for (let entry of parsedData) {
        if ((entry && entry.dateOp && entry.dateVal)) {
            const dateOp = returnParsedDateObject(entry.dateOp);
            const dateVal = returnParsedDateObject(entry.dateVal);
            // We arrange and put back the value into the values
            entry.dateOp = arrangeDate(dateOp);
            entry.dateVal = arrangeDate(dateVal);
        }
        else { // Line is probably incomplete, we remove it
            parsedData.splice(parsedData.indexOf(entry))
        }
    }
    return papa.unparse(parsedData, { delimiter: ";" });
}