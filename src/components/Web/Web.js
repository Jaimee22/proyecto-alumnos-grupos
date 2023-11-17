import React, { Component } from 'react'
import Alumnos from '../Alumnos/Alumnos';
import Musica from '../Musica/Musica';

export default class Web extends Component {
  render() {
    return (
      <div className='d-flex'>
        <Alumnos/>
        {/* <Musica /> */}
      </div>
    )
  }
}
