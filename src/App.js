
import axios from 'axios';
import { useEffect, useState } from 'react';

const App = () => {

  const [data, setData] = useState([]);
  const [write, setWrite] = useState({
    writer:"",
    content:"",
  });

  const onchange = (e) => {
    setWrite({
      ...write,
      [e.target.name] : e.target.value,
    })
  }

  const onEnter = (e) => {
    if(e.key === 'Enter')
      sendOne();
  }

  const sendOne = () => {
    if(write.writer==="")
    {
      alert("작성자를 입력해주세요");
      document.getElementById("writer").focus();
      return;
    }
    if(write.content==="")
    {
      alert("글내용을 입력해주세요");
      document.getElementById("content").focus();
      return;
    }
    const axiosSendOne = async () => {
      await axios.post("http://localhost:9001/insert",write);
      getList();
      setWrite({
        writer:"",
        content:"",
      })
    }
    axiosSendOne();
  }

  const updateOne = (sid) => {
    if(write.writer==="")
    {
      alert("수정할 작성자명을 입력해주세요");
      document.getElementById("writer").focus();
      return;
    }
    if(write.content==="")
    {
      alert("수정할 글내용을 입력해주세요");
      document.getElementById("content").focus();
      return;
    }
    write.sid = sid;
    const axiosUpdate = async () => {
      await axios.put("http://localhost:9001/update",write)
      getList();
      setWrite({
        writer:"",
        content:"",
      })
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
      <div style={{width:'1000px',margin:'0 auto'}}>
      <h2 style={{marginTop:'50px'}}>Simple Board made by CHJ</h2>
      <table className="table table-bordered table-hover" style={{width:'1000px',margin:'0 auto'}}>
        <thead style={{backgroundColor:'lightskyblue',fontWeight:'bold'}}>
          <tr>
            <td style={{width:'100px'}}>글번호</td>
            <td style={{width:'150px'}}>작성자</td>
            <td style={{width:'600px'}}>내용</td>
            <td style={{width:'150px'}}>작성일시</td>
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
      <h2>게시물 작성/수정</h2>
      <table className="table table-bordered">
          <tbody>
            <tr>
              <td>작성자</td>
              <td><input id="writer" name="writer" type="text" onKeyPress={onEnter} onChange={onchange} value={write.writer}/></td>
              <td>글내용</td>
              <td><input id="content" name="content" type="text" onKeyPress={onEnter} onChange={onchange} value={write.content}/></td>
              <td>
              <button className="btn btn-success"  onClick={sendOne}>글쓰기</button>
              </td>
            </tr>
          </tbody>
      </table>
      
      
      </div>
    </div>
  );
}

export default App;
