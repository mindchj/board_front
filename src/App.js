
import axios from 'axios';
import { useEffect, useState } from 'react';
import './App.css';

const App = () => {

  const [data, setData] = useState([]);
  const [write, setWrite] = useState({
    writer : "",
    content : "",
  });

  const onchange = (e) => {
    console.log("his");
    setWrite({
      ...write,
      [e.target.name] : e.target.value,
    })
  }

  useEffect( () => {
    console.log(write)
  },[write])

  const sendList = () => {
    const axiosSendList = async () => {
      const result = await axios.post("http://localhost:9001/insert",write);
      console.log(result);
      getList();
    }
    axiosSendList();
  }

  const updateOne = (sid) => {
    write.sid = sid;
    const axiosUpdate = async () => {
      const result = await axios.put("http://localhost:9001/update",write)
      getList();
    }
    axiosUpdate();
  }

  const deleteOne = (sid) => {
    const axiosDelete = async () => {
      const result = await axios.delete("http://localhost:9001/delete/"+sid)
      console.log(result);
      getList();
    }
    axiosDelete();
  }

  const getList = () => {
    const axiosGetList = async () => {
      const result = await axios.get("http://localhost:9001/board");
      console.log(result.data);
      setData(result.data);
    }
    axiosGetList();
  }

  useEffect( () => {
    getList();
  },[])

  return (
    <div className="App">
      <table className="table table-bordered" style={{width:'1000px',margin:'0 auto',marginTop:'50px'}}>
        <thead>
          <tr>
            <td style={{width:'100px'}}>글번호</td>
            <td style={{width:'150px'}}>작성자</td>
            <td style={{width:'600px'}}>내용</td>
            <td style={{width:'150px'}}>작성일</td>
            <td style={{width:'200px'}}>관리</td>
          </tr>
        </thead>
        <tbody>
          {
            data &&
            data.map( (row,idx) => 
              <tr key={idx}>
                <td>{row.sid}</td>
                <td>{row.writer}</td>
                <td style={{textAlign:'left'}}>{row.content}</td>
                <td>{row.date}</td>
                <td>
                  <button className="btn btn-primary" onClick={()=>updateOne(row.sid)}>
                    수정
                  </button>
                  &nbsp;&nbsp;
                  <button className="btn btn-secondary" onClick={()=>deleteOne(row.sid)} >
                    삭제
                  </button>
                </td>
              </tr>
            )
          }
        </tbody>
      </table>
      <br/>
      작성자:<input name="writer" type="text" onChange={onchange}/>
      글내용:<input name="content" type="text" onChange={onchange}/>
      <button className="btn btn-success" style={{marginLeft:'800px'}} onClick={sendList}>글쓰기</button>
    </div>
  );
}

export default App;
