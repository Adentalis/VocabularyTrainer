import logo from './logo.svg';
import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import './App.css';
import csvtest from './data/words.csv';
import { CSVLink } from 'react-csv';
import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';

function App() {
  const [words, setWords] = useState([]);
  const [count, setCount] = useState(0);
  const [showTable, setShowTable] = useState(0);

  const [columns, setColumns] = useState(0);

  async function getData() {
    const response = await fetch(csvtest);
    const reader = response.body.getReader();
    const result = await reader.read(); // raw array
    const decoder = new TextDecoder('utf-8');
    const csv = decoder.decode(result.value); // the csv text
    const results = Papa.parse(csv, { header: true }); // object with { data, errors, meta }
    const rows = results.data; // array of objects
    console.log(rows);
    setWords(rows);
  }

  function addWord(german, english) {
    let id = words.length;

    //create a dd.mm-yyyy string
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth();
    month = month + 1;
    if (String(day).length == 1) day = '0' + day;
    if (String(month).length == 1) month = '0' + month;
    let TODAY_DATE = day + '.' + month + '.' + date.getFullYear();

    let wordEn = {
      id: id.toString(),
      german: german,
      english: english,
      language: 'en',
      phase: '0',
      nextgame: TODAY_DATE,
      partnerid: (id + 1).toString(),
    };
    let wordDe = { id: id + 1, german: german, english: english, language: 'de', phase: '0', nextgame: TODAY_DATE, partnerid: id.toString() };
    let word = { Username: 'dfsdsd', Identifier: 'sdfsdf', Firstname: 'd', Lastname: 'ee' };

    let newWords = JSON.parse(JSON.stringify(words));
    newWords.push(wordEn);
    newWords.push(wordDe);

    console.log(newWords);
    setWords(newWords);
  }

  const columnss = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'german', headerName: 'Deutsch', width: 150 },
    { field: 'english', headerName: 'Englisch', width: 150 },
    { field: 'language', headerName: 'Abfragesprache', width: 150 },
    { field: 'phase', headerName: 'Phase', width: 80 },
    { field: 'nextgame', headerName: 'Nächste Abfrage', width: 150 },
    { field: 'partnerid', headerName: 'Partner ID', width: 100 },
  ];
  return (
    <div className='App'>
      <header className='App-header'>
        <div className='main'>
          <div>
            <p>You clicked {count} times</p>
            <button onClick={() => setCount(count + 1)}>Click me</button>
          </div>
          <p>ENGLISHHHH rows: {words.length}</p>
          <button onClick={() => addWord('die Tasse', 'cup')}>ADD</button>
          <div>
            <CSVLink data={words} filename='data.csv' className='hidden' target='_blank' />
          </div>
          <CSVLink data={words} filename={'words.csv'} target='_blank' style={{ textDecoration: 'none', outline: 'none', height: '5vh' }}>
            <button variant='contained' color='secondary' style={{ height: '60%' }}>
              Download CSV
            </button>
          </CSVLink>
          <button onClick={() => getData()}>GET</button>
          {showTable ? (
            <div style={{ height: '30vh', width: '100%', backgroundColor: 'white' }}>
              <DataGrid rows={words} columns={columnss} />
            </div>
          ) : (
            <p></p>
          )}
        </div>
        <div className='settings'>
          <p>{showTable}</p>
          <button onClick={() => setShowTable(!showTable)}>Tabelle</button>
          <button>Speichern</button>
        </div>
      </header>
    </div>
  );
}

export default App;

/*
  function getDatabase() {
    fetch(database)
      .then((r) => r.text())
      .then((text) => {
        let bytes = [];
        for (var i = 0; i < text.length; ++i) {
          var code = text.charCodeAt(i);
          bytes = bytes.concat([code]);
        }
        console.log('bytes', bytes.join(', '));
        console.log('text decoded:', text);
      });
  }

*/
