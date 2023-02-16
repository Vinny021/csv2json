import { useState } from 'react';
import './App.css';
import AlertComponent from './components/AlertComponent';


function App() {
  const [csvText, setCsvText] = useState('');
  const [jsonText, setJsonText] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleChange = (event) => {
    const text = event.target.value
    setCsvText(text);
  }

  const validateCsv = (csvSplited) => {
    var lenght = 0;
    
    csvSplited.forEach(() => {
      lenght += 1;
      if(lenght > 1) return
    })

    return lenght > 1;
  }

  const csv2json = () => {
    const splitN = csvText.split("\n");

    var isValid = validateCsv(splitN)

    if(!isValid){
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 1500);      
    }

    const jsonArray = [];

    const keysString = splitN[0];
    const keys = keysString.split(',');

    const valuesStrings = splitN.slice(1);

    valuesStrings.forEach((valuesString) => {
      const values = valuesString.split(',');

      var obj = {}
      values.forEach((value, index)=>{
        obj[keys[index]] = value
      });
      
      jsonArray.push(obj)

    });

    setJsonText(JSON.stringify(jsonArray));
  }

  var alertDiv = showAlert ? <AlertComponent/> : null

  return (
    <div className="App">
      {alertDiv}
      <div className='CsvJsonFields'>
        <div className='CsvInput'>
          <textarea name="csvInput" id="csvInput" onChange={handleChange}></textarea>
        </div>
        <div className='JsonOutput'>
          <textarea name="jsonOutput" id="jsonOutput" value={jsonText}></textarea>
        </div>
      </div>
      <button id="success-btn" className='Convert2Json' onClick={csv2json}>Converter para JSON</button>
    </div>
  );
}

export default App;
