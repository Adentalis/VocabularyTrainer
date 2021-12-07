import logo from './logo.svg';
import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import './App.css';
import database from './data/test.txt';
import csvtest from './data/username.csv';
import { CSVLink, CSVDownload } from 'react-csv';

function App() {
  const [rows, setRows] = useState([]);
  const [count, setCount] = useState(0);

  async function getData() {
    const response = await fetch(csvtest);
    const reader = response.body.getReader();
    const result = await reader.read(); // raw array
    const decoder = new TextDecoder('utf-8');
    const csv = decoder.decode(result.value); // the csv text
    const results = Papa.parse(csv, { header: true }); // object with { data, errors, meta }
    const rows = results.data; // array of objects
    setRows(rows);
  }

  function addData() {
    let word = { Username: 'dfsdsd', Identifier: 'sdfsdf', Firstname: 'd', Lastname: 'ee' };
    let d = rows;
    d.push(word);
    console.log(d);
    console.log(rows.length);
    setRows(d);
  }

  function test() {
    console.log(rows.length);
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <div>
          <p>You clicked {count} times</p>
          <button onClick={() => setCount(count + 1)}>Click me</button>
        </div>
        <button onClick={() => getData()}>GET</button>

        <p>ENGLISHHHH rows: {rows.length}</p>
        <button onClick={() => addData()}>ADD</button>
        <button onClick={() => test()}>TEST</button>

        <div>
          <CSVLink data={rows} filename='data.csv' className='hidden' target='_blank' />
        </div>
        <a href={`data:text/csv;charset=utf-8,${escape(rows)}`} download='filename.csv'>
          download
        </a>
        <CSVLink data={rows} target='_blank' style={{ textDecoration: 'none', outline: 'none', height: '5vh' }}>
          <button variant='contained' color='secondary' style={{ height: '100%' }}>
            Download CSV
          </button>
        </CSVLink>
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
