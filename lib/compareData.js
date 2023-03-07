const getHeaderFromCSV = (csvContent) => {
  const lines = csvContent.split('\n');
  const [header] = lines;

  return header;
};

const csvToArray = (csvContent) => {
  const lines = csvContent.split('\n');
  const [header, ...rows] = lines;
  const data = [];

  rows.forEach((row) => {
    data.push(row);
  });

  return data;
};

export const compareData = (beforeData, afterData) => {
  const csvHeader = getHeaderFromCSV(beforeData);
  const beforeArray = csvToArray(beforeData);
  const afterArray = csvToArray(afterData);

  const diffArray = [];

  afterArray.forEach((row, index) => {
    if (!beforeArray.includes(row)) {
      diffArray.push(row);
    }
  });

  const diffCSVContents = [csvHeader, ...diffArray].join('\n');

  return diffCSVContents;
};
