import { useState } from 'react';
import './App.css';
import React from 'react';
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

  const changeFocusConverted = (event) => {
    const className = event.target.className;
    console.log(className)
    if(className === 'CsvUnselected'){
      setCsvTitle('CsvSelected');
      setJsonTitle('JsonUnselected');
    }

    if(className === 'JsonUnselected'){
      setCsvTitle('CsvUnselected');
      setJsonTitle('JsonSelected');
    }
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

  const validateJson = () => {
    try {
      const json = JSON.parse(jsonText)
      return json
    } catch (error) {
      return false;
    }
  }

  const json2csv = () => {
    const json = validateJson();
    
    if(!json){
      setShowAlert(true)
      setTimeout(() => setShowAlert(false), 1500); 
      return
    }

    //Pegando as keys(headers)
    var keys = [];
    var csvString = '';
    
    if(json.length === undefined){
      Object.keys(json).forEach((key) => {
        //Povoando as keys
        if (!keys.includes(key)) keys.push(key);
      })

      //Montando Header
      keys.forEach((key) => {
        csvString += key+','
      })
      csvString = csvString.replace(/.$/,"\n");
      
      //Montando values
      keys.forEach((key) => {
        csvString += json[key]+','
      })
      csvString = csvString.replace(/.$/,"\n");
    }
    else{
      json.forEach((element) => {
        Object.keys(element).forEach((key) => {
          //Povoando as keys
          if (!keys.includes(key)) keys.push(key);
        })
      });

      //Montando Header
      keys.forEach((key) => {
        csvString += key+','
      })
      csvString = csvString.replace(/.$/,"\n");

      json.forEach((element) => {
        //Montando values
        keys.forEach((key) => {
          csvString += element[key]+','
        })
        csvString = csvString.replace(/.$/,"\n");
      })
    }
    csvString = csvString.replace(/\n$/,"");
    setCsvText(csvString)
  }

  const clearAction = () => {
    setCsvText('');
    setJsonText('');

    setCsvTitle('CsvUnselected');
    setJsonTitle('JsonSelected');

    setTimeout(()=>{
      setCsvTitle('CsvSelected');
      setJsonTitle('JsonUnselected');
    },0)
  
  }

  var alertDiv = showAlert ? <AlertComponent/> : null

  var csvTextArea = csvTitle === 'CsvSelected' ? 
  <textarea name="csvField" id="csvField" onChange={handleCsvChange}></textarea> :
  <textarea name="csvField" id="csvField" value={csvText}></textarea>;
  
  var jsonTextArea = jsonTitle === 'JsonSelected' ? 
  <textarea name="jsonField" id="jsonField" onChange={handleJsonChange}></textarea> :
  <textarea name="jsonField" id="jsonField" value={jsonText}></textarea>;

  var buttonText = csvTitle === 'CsvSelected' ? 'Converter para JSON' : 'Converter para CSV';
  var convertAction = csvTitle === 'CsvSelected' ? csv2json : json2csv;

  return (
    <div className="App">
      {alertDiv}
      <div className='CsvJsonFields'>
        <div className='CsvField'>
          <h1 onClick={changeFocusConverted} className={csvTitle}>CSV</h1>
          {csvTextArea}
        </div>
        <div className='jsonField'>
          <h1 id='jsonTitle' onClick={changeFocusConverted} className={jsonTitle}>JSON</h1>
          {jsonTextArea}
        </div>
      </div>
      <div className='ButtonsSections'>
        <div className='ButtonDivLeft'>
          <button className='ConvertButton' onClick={convertAction}>{buttonText}</button>
        </div>
        <div className='ButtonDivRight'>
          <button className='ClearButton' onClick={clearAction}>Limpar campos</button>
        </div>
      </div>
    </div>
  );
}

export default App;
