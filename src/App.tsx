import React, {useState} from "react"
import "./App.css";
import axios, { AxiosError } from "axios";
import ReactLoading from "react-loading";
import { saveAs } from 'file-saver';


const App = () => {
  const url = "http://localhost:8080";
  const fileInput = React.createRef<HTMLInputElement>();
  const [file, setFile] = useState<File | null>(null);
  const [submitFlag, setSubmitFlag] = useState<Boolean>(false);
  const [image, setImage] = useState(null);
  const [testResponse, setTestResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const onChangeFile = (e) => {
    const files = e.target.files;
    if (files) {
      setFile(files[0]);
    }
    setSubmitFlag(false);
    setImage(null);
  }
  
  
  const onClickSubmit = async () => {
    if(!fileInput) {
      return;
    }
    const data = new FormData();
    if(file){
     data.append('file', file);
    }
    console.log(file);
    setIsLoading(true);
    await axios.post(url+'/upload', data)//, axiosConfig)
     .then((res) => {
       setImage(res.data);
       setSubmitFlag(true);
     })
     .catch((e: AxiosError) => {
       console.error(e)
     });
     setIsLoading(false);
  }

  const onClickDownload = async () => {
    axios
    .get(url+"/download", {
      responseType: "blob",
    })
    .then((res) => {
      let mineType = res.headers["content-type"];
      const name = res.headers["content-disposition"];
      const blob = new Blob([res.data], { type: mineType });
      saveAs(blob, name);
    })
    .catch((error) => {
      console.log(error.messagae);
    });
  }
  

  return (
    <div className="App">
      <h1>React app.</h1>
      <input name="image" type="file" onChange={onChangeFile} />
      <input type="button" value="送信" disabled={!file} onClick={onClickSubmit}/>
      <div className="center">
        {isLoading ? <ReactLoading type="spin" color="black" height="40px" width="40px" className="center"/> : <></>}
      </div>
      <div>
        <img src={`data:image/png;base64,${image}`} aria-disabled={!image} />
      </div>
      <div>
        <input type="button" value="ダウンロード" disabled={!submitFlag} onClick={onClickDownload} />
      </div>
    </div>
  );
}
export default App;

