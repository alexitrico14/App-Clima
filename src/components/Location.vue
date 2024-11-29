<template>
    <section>
      <h3>Información de Ubicación</h3>
      <p><strong>Ciudad:</strong> {{ city }}</p>
      <p><strong>Región:</strong> {{ region }}</p>
      <p><strong>País:</strong> {{ country }}</p>
      <p><strong>Latitud:</strong> {{ latitude }}</p>
      <p><strong>Longitud:</strong> {{ longitude }}</p>
      <p><strong>Zona horaria:</strong> {{ timeZone }}</p>
      <p><strong>GMT Offset:</strong> {{ gmtOffset }}</p>
      <p><strong>¿Horario de verano?:</strong> {{ isDaylightSaving }}</p>
    </section>
  </template>
  
  <script>
  import axios from "axios";
  
  export default {
    data() {
      return {
        location: {},
      };
    },
    computed: {
      city() {
        return this.location.LocalizedName || "Desconocido";
      },
      region() {
        return this.location.AdministrativeArea?.LocalizedName || "Desconocido";
      },
      country() {
        return this.location.Country?.LocalizedName || "Desconocido";
      },
      latitude() {
        return this.location.GeoPosition?.Latitude || "N/A";
      },
      longitude() {
        return this.location.GeoPosition?.Longitude || "N/A";
      },
      timeZone() {
        return this.location.TimeZone?.Name || "Desconocido";
      },
      gmtOffset() {
        return this.location.TimeZone?.GmtOffset || "N/A";
      },
      isDaylightSaving() {
        return this.location.TimeZone?.IsDaylightSaving ? "Sí" : "No";
      },
    },
    methods: {
      fetchLocation() {
        axios
          .get(
            "http://dataservice.accuweather.com/locations/v1/61328?apikey=qe9ybVt9ZfKNRJ5rUTCHAPsbavF1tP44&language=es-cl&details=true"
          )
          .then((response) => {
            this.location = response.data;
          })
          .catch((error) => {
            console.error("Error fetching location data:", error);
          });
      },
    },
    mounted() {
      this.fetchLocation();
      setInterval(this.fetchLocation, 60000);
    },
  };
  </script>
  
  <style scoped>
  /* Estilos específicos para el componente Location */
  </style>
  