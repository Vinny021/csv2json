import { useState } from 'react';
import './App.css';
import AlertComponent from './components/AlertComponent';


function App() {
  const [csvText, setCsvText] = useState('');
  const [jsonText, setJsonText] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [csvTitle, setCsvTitle] = useState('CsvSelected');
  const [jsonTitle, setJsonTitle] = useState('JsonUnselected');

  const handleCsvChange = (event) => {
    const text = event.target.value
    setCsvText(text);
  }
  
  const handleJsonChange = (event) => {
    const text = event.target.value
    setJsonText(text);
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

  const changeFocusConverted = (event) => {
    const className = event.target.className;

    if(className === 'CsvUnselected'){
      setCsvTitle('CsvSelected');
      setJsonTitle('JsonUnselected');
    }

    if(className === 'JsonUnselected'){
      setCsvTitle('CsvUnselected');
      setJsonTitle('JsonSelected');
    }
  }

  var alertDiv = showAlert ? <AlertComponent/> : null

  var csvTextArea = csvTitle === 'CsvSelected' ? 
  <textarea name="csvField" id="csvField" onChange={handleCsvChange}></textarea> :
  <textarea name="csvField" id="csvField" value={csvText}></textarea>;
  
  var jsonTextArea = jsonTitle === 'JsonSelected' ? 
  <textarea name="jsonField" id="jsonField" onChange={handleJsonChange}></textarea> :
  <textarea name="jsonField" id="jsonField" value={jsonText}></textarea>;

  return (
    <div className="App">
      {alertDiv}
      <div className='CsvJsonFields'>
        <div className='CsvField'>
          <h1 onClick={changeFocusConverted} className={csvTitle}>CSV</h1>
          {csvTextArea}
        </div>
        <div className='jsonField'>
          <h1 onClick={changeFocusConverted} className={jsonTitle}>JSON</h1>
          {jsonTextArea}
        </div>
      </div>
      <button id="success-btn" className='Convert2Json' onClick={csv2json}>Converter para JSON</button>
    </div>
  );
}

export default App;
