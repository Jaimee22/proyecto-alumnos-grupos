import React, { Component } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
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
      <div className='container mt-5'>
        <h1 className='mb-4'>Alumnos</h1>
        <div className='d-flex justify-content-between mb-4'>
          <div>
            <button className='btn btn-primary mr-2' onClick={this.generarGruposAleatorios}>
              Generar Grupos
            </button>
            <button className='btn btn-success' onClick={this.descargarPDF}>
              Descargar PDF
            </button>
          </div>
        </div>
        <div className='row'>
          <div className='col-md-6'>
            <h2>Lista de Alumnos</h2>
            <div id='alumnos'>
              {this.state.alumnos.map((alumno, index) => (
                <p key={index}>{alumno.nombre} {alumno.apellidos}</p>
              ))}
            </div>
          </div>
          <div className='col-md-6'>
            <h2>Grupos</h2>
            {this.state.grupos.map((grupo, index) => (
              <div key={index} className='mb-4'>
                <h3>Grupo {index + 1}</h3>
                <div
                  id={`div${index}`}
                  className='border p-3'
                  style={{ border: '1px solid #ccc', padding: '5px', marginBottom: '10px' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}
