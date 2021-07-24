
import axios from 'axios';
import { useEffect, useState } from 'react';

const App = () => {

  const server = "http://3.38.34.79:9001";

  const [data, setData] = useState([]);
  const [row, setRow] = useState();
  const [write, setWrite] = useState({
    writer:"",
    content:"",
    password:"",
  });

  const onchange = (e) => {
    setWrite({
      ...write,
      [e.target.name] : e.target.value,
    })
  }

  const onEnterSend = (e) => {
    if(e.key === 'Enter')
      sendOne();
  }

  const onEnterUpdate = (e) => {
    if(e.key === 'Enter')
      updateOne();
  }

  const onEnterDelete = (e) => {
    if(e.key === 'Enter')
      deleteOne();
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
    if(write.password==="")
    {
      alert("비밀번호를 입력해주세요")
      document.getElementById("password").focus();
      return;
    }
    const axiosSendOne = async () => {
      await axios.post(server+"/insert",write);
      getList();
      setWrite({
        writer:"",
        content:"",
        password:"",
      })
      closeForm();
    }
    axiosSendOne();
  }

  const updateOne = () => {
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
    if(write.password==="")
    {
      alert("작성시 입력한 비밀번호를 입력해주세요");
      document.getElementById("password").focus();
      return;
    }
    if(write.password!==row.password)
    {
      alert("비밀번호가 일치하지 않습니다");
      document.getElementById("password").focus();
      setWrite({
        ...write,
        password:"",
      })
      return;
    }
    write.sid = row.sid;
    const axiosUpdate = async () => {
      await axios.put(server+"/update",write)
      getList();
      setWrite({
        writer:"",
        content:"",
        password:"",
      })
      closeForm();
    }
    axiosUpdate();
  }

  const deleteOne = () => {
    
    if(write.password!==row.password)
    {
      alert("비밀번호가 일치하지 않습니다");
      document.getElementById("password").focus();
      setWrite({
        ...write,
        password:"",
      })
      return;
    }
    const axiosDelete = async () => {
      const result = await axios.delete(server+"/delete/"+row.sid)
      console.log(result);
      getList();
      setWrite({
        ...write,
        password:"",
      })
      closeForm();
    }
    axiosDelete();
  }

  const getList = () => {
    const axiosGetList = async () => {
      const result = await axios.get(server+"/board");
      console.log(result.data);
      setData(result.data);
    }
    axiosGetList();
  }

  useEffect( () => {
    getList();
    document.getElementById("writeform").hidden=true;
    document.getElementById("updateform").hidden=true;
    document.getElementById("deleteform").hidden=true;
  },[])

  const openWriteForm = (e) => {
    closeForm();
    document.getElementById(e.target.name).hidden=false;
  }

  const openUpdateForm = (row) => {
    window.scroll({
      top: document.body.offsetHeight,
      left: 0, 
      behavior: 'smooth',
    });
    closeForm();
    document.getElementById("updateform").hidden=false;
    setRow(row);
  }

  const openDeleteForm = (row) => {
    window.scroll({
      top: document.body.offsetHeight,
      left: 0, 
      behavior: 'smooth',
    });
    closeForm();
    document.getElementById("deleteform").hidden=false;
    setRow(row);
  }

  const closeForm = () => {
    document.getElementById("writeform").hidden=true;
    document.getElementById("updateform").hidden=true;
    document.getElementById("deleteform").hidden=true;
    setWrite({
      writer:"",
      content:"",
      password:"",
    })
  }

  return (
    <div style={{marginBottom:'200px'}}>
      <div style={{width:'1000px',margin:'0 auto'}}>
      <h4>
        - 수정/ 삭제시 비밀번호 입력(기존 게시물 비밀번호 1234로 초기화)
      </h4>
      <hr/>
      <h2 >Simple Board made by CHJ</h2>
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
                  <button name="updateform" className="btn btn-primary" onClick={()=>openUpdateForm(row)}>
                    수정
                  </button>
                  &nbsp;&nbsp;
                  <button name="deleteform" className="btn btn-secondary" onClick={()=>openDeleteForm(row)} >
                    삭제
                  </button>
                </td>
              </tr>
            )
          }
        </tbody>
      </table>
      <br/>
      <button name="writeform" className="btn btn-success" onClick={openWriteForm}>글쓰기</button>
      <br/><br/>

      <div id="writeform">
        <h2 style={{marginBottom:'20px'}}>게시물 작성</h2>
        <table style={{width:'700px'}} className="table table-bordered">
          <tbody>
            <tr>
              <td style={{width:'100px'}}>작성자</td>
              <td style={{width:'200px'}}><input className="form-control" id="writer" name="writer" type="text" onKeyPress={onEnterSend} onChange={onchange} value={write.writer}/></td>
              <td style={{width:'100px'}}>비밀번호</td>
              <td style={{width:'200px'}}><input className="form-control" id="password" name="password" type="password" onKeyPress={onEnterSend} onChange={onchange} value={write.password}/></td>
            </tr>
            <tr>
              <td>글내용</td>
              <td colSpan="3"><input className="form-control" style={{width:'600px'}} id="content" name="content" type="text" onKeyPress={onEnterSend} onChange={onchange} value={write.content}/></td>
            </tr>
          </tbody>
        </table>
        <button className="btn btn-success"  onClick={sendOne}>전송</button>
        &nbsp;&nbsp;&nbsp;
        <button className="btn btn-secondary" onClick={closeForm}>취소</button>
      </div>
      
      <div id="updateform">
      <h2 style={{marginBottom:'20px'}}>{row && row.sid}번 게시물 수정</h2>
        <table style={{width:'700px'}} className="table table-bordered">
          <tbody>
            <tr>
              <td style={{width:'100px'}}>작성자</td>
              <td style={{width:'200px'}}><input className="form-control" id="writer" name="writer" type="text" onKeyPress={onEnterUpdate} onChange={onchange} value={write.writer}/></td>
              <td style={{width:'100px'}}>비밀번호</td>
              <td style={{width:'200px'}}><input className="form-control" id="password" name="password" type="password" onKeyPress={onEnterUpdate} onChange={onchange} value={write.password}/></td>
            </tr>
            <tr>
              <td>글내용</td>
              <td colSpan="3"><input className="form-control" style={{width:'600px'}} id="content" name="content" type="text" onKeyPress={onEnterUpdate} onChange={onchange} value={write.content}/></td>
            </tr>
          </tbody>
        </table>
        <button className="btn btn-success"  onClick={updateOne}>수정</button>
        &nbsp;&nbsp;&nbsp;
        <button className="btn btn-secondary" onClick={closeForm}>취소</button>
      </div>

      <div id="deleteform">
      <h2 style={{marginBottom:'20px'}}>{row && row.sid}번 게시물 삭제</h2>
        <table style={{width:'400px'}} className="table table-bordered">
          <tbody>
            <tr>
              <td style={{width:'50px',textAlign:'center'}}><h5>비밀번호</h5></td>
              <td style={{width:'50px'}}><input className="form-control" id="password" name="password" type="password" onKeyPress={onEnterDelete} onChange={onchange} value={write.password}/></td>
            </tr>
          </tbody>
        </table>
        <button className="btn btn-success"  onClick={deleteOne}>삭제</button>
        &nbsp;&nbsp;&nbsp;
        <button className="btn btn-secondary" onClick={closeForm}>취소</button>
      </div>

      </div>
    </div>
  );
}

export default App;
