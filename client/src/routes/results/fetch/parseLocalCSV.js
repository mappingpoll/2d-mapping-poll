import { csv } from "d3-fetch";

// load & parse the result data asynchronously
export async function parseLocalCSV(path) {
  return await csv(path, (d) => {
      // convert strings to numbers where appropriate
      const row = d;
      for (let col in row) {
        // skip "NA" values
        if (col !== "poll" && col != "Language" && row[col] !== "NA") {
          row[col] = +row[col];
        }
      }
      return row;
    })
    .then((data) => {
      console.log("csv loaded");
      return data
    });
}