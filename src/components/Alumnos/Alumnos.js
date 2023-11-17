import React, { Component } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import Musica from '../Musica/Musica'; // Asegúrate de ajustar la ruta según la ubicación real de tu componente Musica.


import Global from '../../Global';

export default class Alumnos extends Component {
  state = {
    alumnos: [],
    grupos: Array.from({ length: 8 }, () => []), // Inicializar 8 grupos vacíos
  };

  loadAlumnos = () => {
    let request = "api/alumnos/filtrarcurso/2023";
    let url = Global.URL_ApiAlumnos + request;
    axios.get(url).then((response) => {
      this.setState({
        alumnos: response.data,
      });
    });
  };

  componentDidMount = () => {
    this.loadAlumnos();
  };

  generarGruposAleatorios = () => {
    // Limpiar el array de grupos
    const gruposVacios = Array.from({ length: 8 }, () => []);
    this.setState({ grupos: gruposVacios });

    // Obtener la lista de alumnos
    const { alumnos } = this.state;

    // Copiar la lista de alumnos y barajarla
    const alumnosAleatorios = [...alumnos].sort(() => Math.random() - 0.5);

    // Asignar alumnos a los grupos
    alumnosAleatorios.forEach((alumno, index) => {
      const grupoIndex = index % gruposVacios.length;
      gruposVacios[grupoIndex].push(`${alumno.nombre} ${alumno.apellidos}`);
    });

    // Actualizar el estado y limpiar divs
    this.setState({ grupos: gruposVacios }, () => {
      this.limpiarYAsignarDivs();
    });
  };

  limpiarYAsignarDivs = () => {
    const { grupos } = this.state;
    grupos.forEach((grupo, index) => {
      const div = document.getElementById(`div${index}`);
      if (div) {
        div.innerHTML = grupo.map((alumno) => `<p class="hola">- ${alumno}</p>`).join('');
      }
    });
  };

  descargarPDF = () => {
    const { grupos } = this.state;
    const pdf = new jsPDF();

    let verticalPosition = 20;

    grupos.forEach((grupo, index) => {
      // Si la siguiente línea se desborda de la página, agrega una nueva página
      if (verticalPosition > pdf.internal.pageSize.height - 20) {
        pdf.addPage();
        verticalPosition = 20; // Reinicia la posición vertical en la nueva página
      }

      // Agregar el nombre del grupo
      pdf.text(`Grupo ${index + 1}:`, 10, verticalPosition);
      verticalPosition += 10; // Incremento vertical después de agregar el nombre del grupo

      // Agregar datos de cada alumno
      grupo.forEach((alumno, i) => {
        // Si la siguiente línea se desborda de la página, agrega una nueva página
        if (verticalPosition > pdf.internal.pageSize.height - 20) {
          pdf.addPage();
          verticalPosition = 20; // Reinicia la posición vertical en la nueva página
        }

        pdf.text(`- ${alumno}`, 20, verticalPosition);
        verticalPosition += 10; // Incremento vertical después de agregar datos de un alumno
      });

      // Agregar un espacio entre grupos
      verticalPosition += 10;
    });

    pdf.save('grupos.pdf');
  };

  render() {
    return (
      <div className='d-flex'>
        <h1>Alumnos</h1>
        <div>
          <button onClick={this.generarGruposAleatorios}>Generar Grupos</button>
          <button onClick={this.descargarPDF}>Descargar PDF</button>
        </div>
        <div id='alumnos'>
          {this.state.alumnos.map((alumno, index) => (
            <p key={index}>{alumno.nombre} {alumno.apellidos}</p>
          ))}
        </div>
        <div>
          {this.state.grupos.map((grupo, index) => (
            <div key={index}>
              <h3>Grupo {index + 1}</h3>
              <div id={`div${index}`} className="hola" style={{ border: '1px solid #ccc', padding: '5px', marginBottom: '10px' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}
