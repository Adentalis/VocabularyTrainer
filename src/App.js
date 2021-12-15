import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './App.css';
import csvtest from './data/words.csv';
import { CSVLink } from 'react-csv';
import { DataGrid } from '@mui/x-data-grid';

function App() {
  const [words, setWords] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [wordsToPlay, setWordsToPlay] = useState([]);

  const [nextWord, setNextWord] = useState('');
  const [nextWordSolution, setNextWordSolution] = useState('');

  const [win, setWin] = useState(0);
  const [loose, setLoose] = useState(0);

  const [wordCounter, setWordCounter] = useState(0);
  const [inPhase0, setInPhase0] = useState(0);
  const [inPhase1, setInPhase1] = useState(0);
  const [inPhase2, setInPhase2] = useState(0);
  const [inPhase3, setInPhase3] = useState(0);
  const [inPhase4, setInPhase4] = useState(0);
  const [inPhase5, setInPhase5] = useState(0);
  const [inPhase6, setInPhase6] = useState(0);
  const [showTable, setShowTable] = useState(false);
  const [showNewWord, setShowNewWord] = useState(false);

  //add a new word
  const [german, setGerman] = useState('');
  const [english, setEnglish] = useState('');

  const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'german', headerName: 'Deutsch', width: 150 },
    { field: 'english', headerName: 'Englisch', width: 150 },
    { field: 'language', headerName: 'Abfragesprache', width: 150 },
    { field: 'phase', headerName: 'Phase', width: 80 },
    { field: 'nextgame', headerName: 'Nächste Abfrage', width: 150 },
    { field: 'partnerid', headerName: 'Partner ID', width: 100 },
  ];

  useEffect(() => {
    //getData();
  });

  async function getData() {
    const response = await fetch(csvtest);
    const reader = response.body.getReader();
    const result = await reader.read(); // raw array
    const decoder = new TextDecoder('utf-8');
    const csv = decoder.decode(result.value); // the csv text
    const results = Papa.parse(csv, { header: true }); // object with { data, errors, meta }
    const rows = results.data; // array of objects
    setWords(rows);
    setLoaded(true);

    // calculations for stats
    setWordCounter(rows.length);
    console.log(rows);
    //updateGame();
    //---- get all words to play today
    let phases = [0, 0, 0, 0, 0, 0, 0];
    let playableWords = [];
    let index = 0;
    console.log(words.length);
    rows.forEach((e) => {
      //get all words to play now

      const [day, month, year] = rows[index++].nextgame.split('.');
      console.log(day, month, year);
      let date = new Date(year, month - 1, day);
      let now = new Date();
      if (now - date > 0) {
        //console.log(now - date);
        playableWords.push(e);
      }
      // count phases
      let phase = e.phase;
      switch (parseInt(phase)) {
        case 0:
          phases[0]++;
          break;
        case 1:
          phases[1]++;
          break;
        case 2:
          phases[2]++;
          break;
        case 3:
          phases[3]++;
          break;
        case 4:
          phases[4]++;
          break;
        case 5:
          phases[5]++;
          break;
        case 6:
          phases[6]++;
          break;
        default:
          console.log('ERROR --- PHASE OF ONE WORD IS NOT BETWEEN 0-6 --> phase:' + phase);
          break;
      }
    });
    setInPhase0(phases[0]);
    setInPhase1(phases[1]);
    setInPhase2(phases[2]);
    setInPhase3(phases[3]);
    setInPhase4(phases[4]);
    setInPhase5(phases[5]);
    setInPhase6(phases[6]);

    setWordsToPlay(playableWords);
  }

  function updateGame() {}

  function saveNewWord() {
    if (german === '' || english === '') {
      return;
    }
    let id = words.length;

    let wordEn = {
      id: id.toString(),
      german: german,
      english: english,
      language: 'en',
      phase: '0',
      nextgame: createTimeForNextPhase(0),
      partnerid: (id + 1).toString(),
    };
    let wordDe = {
      id: id + 1,
      german: german,
      english: english,
      language: 'de',
      phase: '0',
      nextgame: createTimeForNextPhase(0),
      partnerid: id.toString(),
    };

    let newWords = JSON.parse(JSON.stringify(words));
    newWords.push(wordEn);
    newWords.push(wordDe);

    console.log(newWords);
    setWords(newWords);
  }

  function showStatsInterface() {
    return (
      <div className='stats'>
        <p>Amount of words: {wordCounter}</p>
        <p>In Phase 0: {inPhase0}</p>
        <p>In Phase 1: {inPhase1}</p>
        <p>In Phase 2: {inPhase2}</p>
        <p>In Phase 3: {inPhase3}</p>
        <p>In Phase 4: {inPhase4}</p>
        <p>In Phase 5: {inPhase5}</p>
        <p>In Phase 6: {inPhase6}</p>
        <p>Words to Play: {wordsToPlay.length}</p>
      </div>
    );
  }

  function showNewWordInterface() {
    return (
      <div className='new-word'>
        <p>Deutsch:</p>
        <input onChange={(e) => setGerman(e.target.value)} style={{ marginLeft: '2vh' }}></input>
        <p style={{ marginLeft: '10vh' }}>English:</p>
        <input onChange={(e) => setEnglish(e.target.value)} style={{ marginLeft: '2vh' }}></input>
        <button onClick={() => saveNewWord()}>Hinzufügen</button>
      </div>
    );
  }

  function showSettingsInterface() {
    return (
      <div className='settings'>
        <button onClick={() => getData()}>Spiel starten</button>
        <button onClick={() => setShowTable(!showTable)}>Tabelle</button>
        <button
          onClick={() => {
            setEnglish('');
            setGerman('');
            setShowNewWord(!showNewWord);
          }}
        >
          Neues Wort
        </button>
        <CSVLink data={words} filename={'words.csv'} target='_blank'>
          <button style={{ height: '170%', width: '20vh' }}>Speichern</button>
        </CSVLink>{' '}
      </div>
    );
  }

  return (
    <div className='App'>
      <header className='App-header'>
        <div className='header'>
          <p>Phase 6</p>
        </div>
        <div className='main'>
          {showTable ? (
            <div style={{ height: '60vh', width: '100%', backgroundColor: 'white' }}>
              <DataGrid rows={words} columns={columns} />
            </div>
          ) : (
            <div>
              {loaded ? (
                <div>
                  <p>Choosen Word: {nextWord}</p>
                  <input></input>
                  <p>Solutions: {nextWordSolution}</p>
                  <button style={{ height: '5vh', width: '50%', backgroundColor: 'green' }} onClick={() => saveNewWord()}>
                    Correct
                  </button>
                  <button style={{ height: '5vh', width: '50%', backgroundColor: 'red' }} onClick={() => saveNewWord()}>
                    False
                  </button>
                </div>
              ) : (
                <div>
                  <p>Welcome, please start :)</p>
                </div>
              )}
            </div>
          )}
        </div>
        {showSettingsInterface()}
        {loaded ? showStatsInterface() : <p></p>}
        {showNewWord ? showNewWordInterface() : <p></p>}
      </header>
    </div>
  );
}

export default App;

//create a dd.mm-yyyy string
function createTimeForNextPhase(phase) {
  let days = 0;

  if (phase === 0) {
    days += 0;
  }
  if (phase === 1) {
    days += 1;
  }
  if (phase === 2) {
    days += 3;
  }
  if (phase === 3) {
    days += 7;
  }
  if (phase === 4) {
    days += 15;
  }
  if (phase === 5) {
    days += 30;
  }
  if (phase === 6) {
    days += 90;
  }

  let now = new Date();
  let targetTime = new Date(now.getTime() + 86400000 * days);

  let day = targetTime.getDate();
  let month = targetTime.getMonth();
  month = month + 1;
  if (String(day).length === 1) day = '0' + day;
  if (String(month).length === 1) month = '0' + month;
  let result = day + '.' + month + '.' + targetTime.getFullYear();
  return result;
}

/*
phase 0: +0  -- 01.01
phase 1: +1  -- 02.01
phase 2: +3  -- 05.01
phase 3: +7  -- 12.01
phase 4: +15 -- 27.01
phase 5: +30 -- 27.02
phase 6: +90 -- 27.05
--> ~ 5 months
*/

/*
TODOs
- when added new word, update state

*/
