import { useState } from 'react';
import './App.css';
import React from 'react';
import AlertComponent from './components/AlertComponent';


function App() {
  const [csvText, setCsvText] = useState('');
  const [jsonText, setJsonText] = useState('');
  const [showAlert, setShowAlert] = useState([false, 'Não valido']);
  const [csvTitle, setCsvTitle] = useState('CsvSelected');
  const [jsonTitle, setJsonTitle] = useState('JsonUnselected');
  const [csvFileName, setCsvFileName] = useState('');
  const [jsonFileName, setJsonFileName] = useState('');

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
      setShowAlert([true, 'Não valido'])
      setTimeout(() => setShowAlert([false,  'Não valido']), 1500);      
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
      setShowAlert([true, 'Não valido'])
      setTimeout(() => setShowAlert([false,  'Não valido']), 1500);  
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

  const importCsvFile = (event) => {
    const fileIntput = document.getElementById("csvFileInput");
    const file = fileIntput.files[0];

    if(file){
      try {

        const reader = new FileReader();

        reader.onload = (e) => {
          const fileContent = e.target.result;

          let fileContentSplited = fileContent.split('\n');

          setCsvText(fileContent)
          setCsvFileName(file.name)
          console.log(fileContentSplited[0]);
        };

        reader.readAsText(file);
      } catch (error) {
        console.log('Reading FIle Error:');
        console.log(error);
      }
    }else{
      console.log('No File');
      setShowAlert([true, 'Arquivo não encontrado']);
      setTimeout(() => setShowAlert(false), 1500); 
    }
  }
  
  const importJsonFile = (event) => {
    const fileIntput = document.getElementById("jsonFileInput");
    const file = fileIntput.files[0];

    if(file){
      try {

        const reader = new FileReader();

        reader.onload = (e) => {
          const fileContent = e.target.result;
          
          setJsonText(fileContent);
          setJsonFileName(file.name);
        };

        reader.readAsText(file);
      } catch (error) {
        console.log('No File');
        setShowAlert([true, 'Arquivo não encontrado']);
        setTimeout(() => setShowAlert(false), 1500);
      }
    }else{
      console.log('No File');
      setShowAlert([true, 'Arquivo não encontrado']);
      setTimeout(() => setShowAlert(false), 1500); 
    }
  }

  const saveCsvContent = () => {
    try {
        if (!validateCsv(csvText.split("\n"))) {
          setShowAlert([true, 'Sem conteúdo CSV']);
          setTimeout(() => setShowAlert(false), 1500);
          return;
        }

        const blob = new Blob([csvText], { type: 'text/csv' });

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = csvFileName;
        a.click();

        window.URL.revokeObjectURL(url);      
    } catch (error) {
      console.log(error);
      setShowAlert([true, 'Erro ao salvar arquivo']);
      setTimeout(() => setShowAlert(false), 1500); 
    }    
  }

  var alertDiv = showAlert[0] ? <AlertComponent errorMessage={showAlert[1]}/> : null

  var csvTextArea = csvTitle === 'CsvSelected' ? 
  <textarea name="csvField" id="csvField" onChange={handleCsvChange} value={csvText}></textarea> :
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
      <div className='ButtonsSections'>
          <input id="csvFileInput" type="file" className='InputFile' accept=".csv"/>
          <button className='ActionButton' onClick={importCsvFile}>Importar CSV</button>
          <button className='ActionButton' style={{marginLeft:'10px'}} onClick={saveCsvContent}>Salvar em CSV</button>
      </div>
      <div className='ButtonsSections'>
          <input id="jsonFileInput" type="file" className='InputFile' accept=".json"/>
          <button className='ActionButton' onClick={importJsonFile}>Importar JSON</button>
          {/* <button className='ActionButton' style={{marginLeft:'10px'}} onClick={saveCsvContent}>Salvar em JSON</button> */}
      </div>
    </div>
  );
}

export default App;
