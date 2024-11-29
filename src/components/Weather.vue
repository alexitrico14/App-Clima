<template>
    <div v-if="isLoading">Cargando...</div>
    <div v-else-if="error">{{ error }}</div>
    <div v-else>
        <div id="result">
            <div id="weather-icon">
                <div id="weather-icon__image">
                    <img :src="weatherImage" :alt="weatherDetails.state" />
                </div>
                <div id="weather-icon__title">
                    <span id="hora-actual">{{ weatherDetails.dateTime }}</span>
                    <p>{{ weatherDetails.state }}</p>
                    <p>{{ weatherDetails.temperature }}°C</p>
                </div>
            </div>
            <div id="weather-details">
                <p>Fecha y hora de observación: {{ weatherDetails.dateTime }}</p>
                <p>¿Es de día?: {{ weatherDetails.isDayTime }}</p>
                <p>¿Hay precipitación?: {{ weatherDetails.hasPrecipitation }}</p>
                <p>Tipo de precipitación: {{ weatherDetails.precipitationType }}</p>
                <p><a :href="weatherDetails.link" target="_blank">Más detalles</a></p>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import nublado from "@/assets/nublado.png";
import lluvia from "@/assets/lluvia.png";
import soleado from "@/assets/soleado.png";
import defaultImage from "@/assets/default.png";

export default {
    data() {
        return {
            weather: {},
            isLoading: true,
            error: null,
            mesesAbreviados: [
                "Ene",
                "Feb",
                "Mar",
                "Abr",
                "May",
                "Jun",
                "Jul",
                "Ago",
                "Sep",
                "Oct",
                "Nov",
                "Dic",
            ],
        };
    },
    computed: {
        weatherImage() {
            const weatherMapping = {
                "nublado": nublado,
                "parcialmente nublado": nublado,
                "algunas nubes": nublado,
                "lluvia": lluvia,
                "despejado": soleado,
                "mayormente despejado": soleado,
            };
            return weatherMapping[this.weather.WeatherText?.toLowerCase()] || defaultImage;
        },
        weatherDetails() {
            return {
                state: this.weather.WeatherText?.toLowerCase() || "Desconocido",
                temperature: this.weather.Temperature?.Metric?.Value || "N/A",
                isDayTime: this.weather.IsDayTime ? "Sí" : "No",
                hasPrecipitation: this.weather.HasPrecipitation ? "Sí" : "No",
                precipitationType: this.weather.PrecipitationType || "N/A",
                link: this.weather.Link || "#",
                dateTime: this.formatFechaISO(this.weather.LocalObservationDateTime),
            };
        }
    },
    methods: {
        formatFechaISO(fechaISO) {
            if (!fechaISO) return "N/A";
            const fecha = new Date(fechaISO);
            const horas = fecha.getHours().toString().padStart(2, "0");
            const minutos = fecha.getMinutes().toString().padStart(2, "0");
            const dia = fecha.getDate().toString().padStart(2, "0");
            const mes = this.mesesAbreviados[fecha.getMonth()];
            return `${horas}:${minutos} ${dia} ${mes}`;
        },
        fetchWeather() {
            this.isLoading = true;
            this.error = null;
            axios
                .get(
                    "http://dataservice.accuweather.com/currentconditions/v1/61328?apikey=qe9ybVt9ZfKNRJ5rUTCHAPsbavF1tP44&language=es-cl"
                )
                .then((response) => {
                    if (response.data && response.data.length > 0) {
                        this.weather = response.data[0];
                    }
                })
                .catch((error) => {
                    console.error("Error fetching weather data:", error);
                    this.error = "No se pudo cargar la información del clima.";
                })
                .finally(() => {
                    this.isLoading = false;
                });
        }
    },
    mounted() {
        this.fetchWeather();
        setInterval(this.fetchWeather, 60000);
    },
};
</script>

<style scoped>
/* Fuentes y colores */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap');

:root {
  --primary-color: #4a90e2; /* Azul suave */
  --secondary-color: #f5f5f5; /* Gris claro */
  --text-color: #333; /* Gris oscuro */
  --accent-color: #ff6f61; /* Naranja suave */
  --border-radius: 8px;
  --box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

body {
  font-family: 'Inter', sans-serif;
  background-color: var(--secondary-color);
  margin: 0;
  padding: 0;
}

#result {
  max-width: 600px;
  margin: 40px auto;
  padding: 20px;
  background-color: white;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
}

#weather-icon {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

#weather-icon__image img {
  width: 120px;
  height: 120px;
  object-fit: contain;
  border-radius: 50%;
  border: 4px solid var(--primary-color);
  padding: 8px;
  background-color: var(--secondary-color);
}

#weather-icon__title {
  text-align: right;
  color: var(--text-color);
}

#weather-icon__title span {
  font-size: 0.8em;
  color: var(--accent-color);
  display: block;
}

#weather-icon__title p {
  margin: 5px 0;
  font-size: 1.5em;
  font-weight: 600;
}

#weather-details {
  border-top: 1px solid var(--primary-color);
  padding-top: 20px;
  color: var(--text-color);
}

#weather-details p {
  margin: 8px 0;
  font-size: 1em;
}

#weather-details a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: bold;
}

#weather-details a:hover {
  color: var(--accent-color);
}

@media (max-width: 768px) {
  #result {
    padding: 15px;
  }

  #weather-icon__image img {
    width: 100px;
    height: 100px;
  }

  #weather-icon__title p {
    font-size: 1.2em;
  }

  #weather-details p {
    font-size: 0.9em;
  }
}
</style>
