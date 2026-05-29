import React from 'react'

const Adminprotected = (props) => {
  const token = localStorage.getItem("token");

  if(!token){
    return <p>loading......Admin token</p>
  }
  return (
    <div>
      {props.children}  
    </div>
  )
}

export default Adminprotected