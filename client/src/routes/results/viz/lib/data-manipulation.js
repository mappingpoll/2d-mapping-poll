import { isValidDatum } from "./viztools";

export function cleanQuestions(data) {
  return Object.keys(data[0]).filter(
    q => q != "poll" && q != "Language" && q != "id"
  );
}

export function getPairwiseColumns(questions) {
  let pairs = [];
  // iterate pairwise
  for (let idx = 0; idx < questions.length; idx += 2) {
    const columns = [questions[idx], questions[idx + 1]];
    pairs.push(columns);
  }
  return pairs;
}

export function getCustomColumns(questions, axes) {
  return Object.values(axes)
    .filter(a => a !== "")
    .map(a => questions[a]);
}

export function filterDataByDataset(data, dataset) {
  return data.filter(d => {
    for (let condition in dataset) {
      if (d.Language === condition && !dataset[condition]) return false;
      if (d.poll.toLowerCase() === condition && !dataset[condition])
        return false;
    }
    return true;
  });
}

export function filterDataByRange(data, column, range) {
  return data.filter(
    d =>
      isValidDatum(d, column) && range[0] <= d[column] && d[column] <= range[1]
  );
}

export function inRange(n, range) {
  if (isNaN(n)) return false;
  return range[0] <= n && n <= range[1];
}
