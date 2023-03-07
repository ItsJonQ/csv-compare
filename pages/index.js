import React from 'react';
import Head from 'next/head';
import { compareData } from '@/lib/compareData';

const getFormattedDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}-${month}-${day}`;
};

const readFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event.target.result);
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsText(file);
  });
};

const downloadDataAsFile = (data, filename) => {
  const blob = new Blob([data], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  const csvFileName = `${getFormattedDate()}-${filename}.csv`;

  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', csvFileName);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const Card = (props) => {
  return (
    <div
      {...props}
      className="border border-grey-200 rounded-lg p-8 h-full flex align-middle justify-center"
    />
  );
};

const DropZone = ({ legend, label, id, name, hasFile, onChange }) => {
  return (
    <Card>
      <div className="w-full">
        <label className="font-bold mb-2 block" htmlFor={id}>
          {label}
        </label>
        <input type="file" id={id} name={name} onChange={onChange} />
      </div>
    </Card>
  );
};

export default function Home() {
  const [firstFile, setFirstFile] = React.useState(null);
  const [secondFile, setSecondFile] = React.useState(null);

  const handleOnSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const firstFile = formData.get('first');
    const secondFile = formData.get('second');
    const data1 = await readFile(firstFile);
    const data2 = await readFile(secondFile);

    const comparisons = compareData(data1, data2);

    downloadDataAsFile(comparisons, 'comparisons');
  };

  return (
    <>
      <Head>
        <title>CSV Compare</title>
        <meta name="description" content="Compare two CSV data sets" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="max-w-4xl mx-auto my-32">
          <h1 className="text-3xl font-medium">CSV Compare</h1>
          <p className="mb-4 opacity-50">Compare two CSV data sets.</p>
          <form onSubmit={handleOnSubmit} class="contents">
            <div class="grid grid-cols-3 gap-4">
              <DropZone
                label="1. Add first .csv"
                id="first"
                name="first"
                hasFile={Boolean(firstFile)}
                onChange={(event) => setFirstFile(event.target.files[0])}
              />
              <DropZone
                label="2. Add second .csv"
                id="second"
                name="second"
                hasFile={Boolean(secondFile)}
                onChange={(event) => setSecondFile(event.target.files[0])}
              />
              <Card>
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full"
                >
                  Download
                </button>
              </Card>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
