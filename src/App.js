import { useState, useEffect } from "react";
import Papa from "papaparse";
import "./App.scss";
import { CSVLink } from "react-csv";
import { DataGrid } from "@mui/x-data-grid";

import db from "./data/words.csv";

function App() {
  const [words, setWords] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [started, setStarted] = useState(false);

  const [wordsToPlay, setWordsToPlay] = useState([]);

  const [currentWord, setCurrentWord] = useState({});
  const [showSolution, setShowSolution] = useState(false);
  const [inputSolution, setInputSolution] = useState("");

  const [win, setWin] = useState(0);
  const [loose, setLoose] = useState(0);
  const [link, setLink] = useState("");

  const [wordCounter, setWordCounter] = useState(0);
  const [inPhase, setInPhase] = useState([]);

  const [showTable, setShowTable] = useState(false);
  const [showNewWord, setShowNewWord] = useState(false);

  //add a new word
  const [german, setGerman] = useState("");
  const [english, setEnglish] = useState("");

  const columns = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "german", headerName: "Deutsch", width: 150 },
    { field: "english", headerName: "Englisch", width: 150 },
    { field: "language", headerName: "Abfragesprache", width: 150 },
    { field: "phase", headerName: "Phase", width: 80 },
    { field: "nextgame", headerName: "Nächste Abfrage", width: 150 },
    { field: "partnerid", headerName: "Partner ID", width: 100 },
  ];

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const response = await fetch(db);
    const reader = response.body.getReader();
    const result = await reader.read(); // raw array
    const decoder = new TextDecoder("utf-8");
    const csv = decoder.decode(result.value); // the csv text
    const results = Papa.parse(csv, { header: true }); // object with { data, errors, meta }
    const rows = results.data; // array of objects
    setWords(rows);
    setLoaded(true);
    updateGame(rows);
  }

  function updateGame(dummyWords) {
    setWordCounter(dummyWords.length);

    const { phases, playableWords } = calculateStats(dummyWords);

    setInPhase(phases);

    setWordsToPlay(playableWords);

    if (playableWords.length === 0) {
      setCurrentWord(null);
    } else {
      let randomIndex = Math.floor(Math.random() * playableWords.length);
      let choosenWord = playableWords[randomIndex];

      //let a = getLink(choosenWord);
      let splittedWord = choosenWord.english.split(" ");
      if (splittedWord.length === 1) {
        setLink(
          "https://de.pons.com/%C3%BCbersetzung/englisch-deutsch/" +
            choosenWord.english
        );
      } else {
        setLink(
          "https://de.pons.com/%C3%BCbersetzung/englisch-deutsch/" +
            splittedWord[1]
        );
      }

      if (choosenWord.language === "en") {
        setCurrentWord({
          id: choosenWord.id,
          question: choosenWord.german,
          solution: choosenWord.english,
        });
      } else {
        setCurrentWord({
          id: choosenWord.id,
          question: choosenWord.english,
          solution: choosenWord.german,
        });
      }
    }
  }

  function checkAnswer(correctAnswer) {
    let dummyWords = words;
    if (correctAnswer === true) {
      setWin(win + 1);
      let currentPhaseOfWord = parseInt(dummyWords[currentWord.id].phase);
      dummyWords[currentWord.id].phase = currentPhaseOfWord + 1;
      dummyWords[currentWord.id].nextgame = createTimeForNextPhase(
        currentPhaseOfWord + 1
      );
    } else {
      setLoose(loose + 1);
      dummyWords[currentWord.id].phase = 0;
      dummyWords[currentWord.id].nextgame = createTimeForNextPhase(0);
    }
    setWords(dummyWords);
    updateGame(dummyWords);
    setShowSolution(false);
    setInputSolution("");
  }

  function addNewWord() {
    if (german === "" || english === "") {
      return;
    }
    let id = words.length;

    let wordEn = {
      id: id.toString(),
      german: german,
      english: english,
      language: "en",
      phase: "0",
      nextgame: createTimeForNextPhase(0),
      partnerid: (id + 1).toString(),
    };
    let wordDe = {
      id: id + 1,
      german: german,
      english: english,
      language: "de",
      phase: "0",
      nextgame: createTimeForNextPhase(0),
      partnerid: id.toString(),
    };

    let newWords = JSON.parse(JSON.stringify(words));
    newWords.push(wordEn);
    newWords.push(wordDe);

    setWords(newWords);
    updateGame(newWords);
  }

  function showStatsInterface() {
    return (
      <div className="stats">
        <p>Amount of words: {wordCounter}</p>
        <p>In Phase 0: {inPhase[0]}</p>
        <p>In Phase 1: {inPhase[1]}</p>
        <p>In Phase 2: {inPhase[2]}</p>
        <p>In Phase 3: {inPhase[3]}</p>
        <p>In Phase 4: {inPhase[4]}</p>
        <p>In Phase 5: {inPhase[5]}</p>
        <p>In Phase 6: {inPhase[6]}</p>
        <p>Completed: {inPhase[7]}</p>
        <p>Words to Play: {wordsToPlay.length}</p>
        <p>-----------</p>
        <p>Correct: {win}</p>
        <p>Wrong: {loose}</p>
      </div>
    );
  }

  function showNewWordInterface() {
    return (
      <div className="new-word">
        <p>Deutsch:</p>
        <input
          onChange={(e) => setGerman(e.target.value)}
          style={{ marginLeft: "2vh" }}
        ></input>
        <p style={{ marginLeft: "10vh" }}>English:</p>
        <input
          onChange={(e) => setEnglish(e.target.value)}
          style={{ marginLeft: "2vh" }}
        ></input>
        <button onClick={() => addNewWord()}>Hinzufügen</button>
      </div>
    );
  }

  function showSettingsInterface() {
    return (
      <div className="settings">
        <button onClick={() => setShowTable(!showTable)}>Tabelle</button>
        <button
          onClick={() => {
            setEnglish("");
            setGerman("");
            setShowNewWord(!showNewWord);
          }}
        >
          Neues Wort
        </button>
        <button>
          <CSVLink data={words} filename={"words.csv"} target="_blank">
            Speichern
          </CSVLink>{" "}
        </button>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="header">
        <p>Phase 7 :)</p>
      </div>
      <div className="main">
        {showTable ? (
          <div
            style={{
              height: "60vh",
              width: "100%",
              backgroundColor: "white",
            }}
          >
            <DataGrid rows={words} columns={columns} />
          </div>
        ) : (
          <div>
            {started ? (
              <div>
                {currentWord ? (
                  <div>
                    <p>{currentWord.question}</p>
                    <input
                      id="answer"
                      onChange={(e) => setInputSolution(e.target.value)}
                      value={inputSolution}
                    ></input>
                    <button onClick={() => setShowSolution(true)}>
                      Solution
                    </button>
                    <div className="solution">
                      {showSolution ? (
                        <div>
                          <p> {currentWord.solution}</p>
                          <a
                            className="solution-link"
                            href={link}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Link To Pons
                          </a>
                        </div>
                      ) : (
                        <div>
                          <p>-----</p>
                        </div>
                      )}
                    </div>

                    <button
                      style={{
                        height: "5vh",
                        width: "50%",
                        backgroundColor: "green",
                      }}
                      onClick={() => checkAnswer(true)}
                    >
                      Correct
                    </button>
                    <button
                      style={{
                        height: "5vh",
                        width: "50%",
                        backgroundColor: "red",
                      }}
                      onClick={() => checkAnswer(false)}
                    >
                      False
                    </button>
                  </div>
                ) : (
                  <p>No more words today</p>
                )}
              </div>
            ) : (
              <div>
                <button
                  id="start-button"
                  onClick={() => {
                    setStarted(true);
                    updateGame(words);
                  }}
                >
                  Start
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      {showSettingsInterface()}
      {loaded ? showStatsInterface() : <p></p>}
      {showNewWord ? showNewWordInterface() : <p></p>}
    </div>
  );
}

export default App;

// create a dd.mm-yyyy string
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
  if (String(day).length === 1) day = "0" + day;
  if (String(month).length === 1) month = "0" + month;
  let result = day + "." + month + "." + targetTime.getFullYear();
  return result;
}

// return phases and playableWords
function calculateStats(dummyWords) {
  let phases = [0, 0, 0, 0, 0, 0, 0, 0];
  let playableWords = [];
  let index = 0;
  dummyWords.forEach((e) => {
    const [day, month, year] = dummyWords[index++].nextgame.split(".");
    let date = new Date(year, month - 1, day);
    let now = new Date();
    if (now - date > 0 && parseInt(e.phase) !== 7) {
      playableWords.push(e);
    }
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
      case 7:
        phases[7]++;
        break;
      default:
        console.log(
          "ERROR --- PHASE OF ONE WORD IS NOT BETWEEN 0-7 --> phase:" + phase
        );
        break;
    }
  });
  return {
    phases: phases,
    playableWords: playableWords,
  };
}

/*
phase 0: +0  -- 01.01
phase 1: +1  -- 02.01
phase 2: +3  -- 05.01
phase 3: +7  -- 12.01
phase 4: +15 -- 27.01
phase 5: +30 -- 27.02
phase 6: +90 -- 27.05
phase 7: Word learned!
--> ~ 5 months
*/

/*
language en means the SOLUTION must be in en
language de means the SOLUTION must be in de

*/

/** TODOs
 * https://www.linguee.de/englisch-deutsch/uebersetzung/house.html add direct link to linguee
 * show solution word in red/green depending on correct word added or not
 * say correct/false with keyboard so no mouse must be used
 * after word added epty the input value
 */
