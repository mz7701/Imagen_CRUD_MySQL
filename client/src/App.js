import React, {Fragment, useState, useEffect} from 'react';
import Modal from 'react-modal';

function App() {

  const [file, setFile] = useState(null)
  const [imageslist, setImageList] = useState([])
  const [listUpdate, setListUpdate] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [currentImage, setcurrentImage] = useState(null)

  useEffect(()=>{
    
    Modal.setAppElement('body')
    
    fetch("http://localhost:9000/images/get")
        .then(res => res.json())
        .then(res =>setImageList(res))
        .catch(err =>{
          console.log(err)
        })
    setListUpdate(false)
  },[listUpdate])

  const selectedHandler = e => {
    setFile(e.target.files[0])
  }

  const sendHandler = () => {
    if(!file){
      alert('you must upload file')
      return
    }

    const formdata = new FormData()
    formdata.append('image', file)

    fetch('http://localhost:9000/images/post', {
      method: 'POST',
      body: formdata
    })
    .then(res => res.text())
    .then(res =>{
      console.log(res)
      setListUpdate(true)
    })
    .catch(err => {
      console.error(err)
    })

    document.getElementById('fileinput').value = null

    setFile(null)
  }


  const modalHandler = (isOpen, image)=>{
    setModalIsOpen(isOpen)
    setcurrentImage(image)
  }

  const deleteHandler = ()=>{
    let imageID = currentImage.split(' - ')
    console.log(imageID[0])
    imageID = parseInt(imageID[0]);
    console.log(imageID)

    fetch('http://localhost:9000/images/delete/' + imageID,{
      method:'DELETE'
    })
    .then(res => res.text())
    .then(res => console.log(res))
    
    setModalIsOpen(false)
    setListUpdate(true)
  }

  return (
    <Fragment>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container">
          <a href="#!" className="navbar-brand">Image App</a>
        </div>
      </nav>

      <div className="container mt-5">
        <div className="card p-3">
          <div className="row">
            <div className="col-10">
              <input id="fileinput" onChange={selectedHandler} className="form-control" type="file" accept={'.jpg, .jpeg, .png'}/>
            </div>
            <div className="col-2">
              <button onClick={sendHandler} type="button" className="btn btn-primary col-12">Upload</button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mt-3" style={{display:"flex", flexWrap:"wrap"}}>
        {imageslist.map(image =>(
          <div key={image} className="card m-2" >
            <img src={"http://localhost:9000/" + image} alt="..." className="card-img-top" style={{height:"300px", width:"300px"}}/>

            <div className="card-body">
              <button onClick={() => modalHandler(true,image)} className="btn btn-dark">Click to View</button>
            </div>
          </div>
        ))}
      </div>

      <Modal  style={{content: {right:"20%", left:"20%", top:"5%", bottom:"5%"}}} isOpen={modalIsOpen} onRequestClose={ () => modalHandler(false, null)}>
        <div className="card">
          <img src={"http://localhost:9000/" + currentImage} alt="..."/>
          <div className="card-body">
            <button onClick = {()=>deleteHandler()} className="btn btn-danger">Delete</button>
          </div>
        </div>
      </Modal>

    </Fragment>
  );
}

export default App;
