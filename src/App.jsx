import { useState } from 'react';
import './App.css';
import {Alert} from '@mui/material';
import customStyle from './customAlert/alertStyle';

function App() {
  const [csvText, setCsvText] = useState('');
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

    console.log(splitN)
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

    console.log(jsonArray)
  }

  var alertDiv = showAlert ? <div className='Alert'><Alert style={customStyle} severity="error">Não valido</Alert></div> : null

  return (
    <div className="App">
      {alertDiv}
      <div className='CsvInput'>
        <textarea name="csvInput" id="csvInput" onChange={handleChange}></textarea>
      </div>
      <button id="success-btn" className='Convert2Json' onClick={csv2json}>Converter para JSON</button>
    </div>
  );
}

export default App;
