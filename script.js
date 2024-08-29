$(document).ready(function () {
    // Array de iniciales de los meses
    const mesesAbreviados = [
        "Ene", "Feb", "Mar", "Abr", "May", "Jun",
        "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"
    ];

    // Función para formatear la fecha
    function formatearFecha(fechaISO) {
        const fecha = new Date(fechaISO);
        const horas = fecha.getHours().toString().padStart(2, '0');
        const minutos = fecha.getMinutes().toString().padStart(2, '0');
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = mesesAbreviados[fecha.getMonth()]; // Obtener el nombre abreviado del mes
        return `${horas}:${minutos} ${dia} ${mes}`;
    }

    // Llamada AJAX para obtener las condiciones actuales del clima
    $.ajax({
        type: "GET",
        url: "http://dataservice.accuweather.com/currentconditions/v1/61328?apikey=qe9ybVt9ZfKNRJ5rUTCHAPsbavF1tP44&language=es-cl",
        success: function (data) {
            console.log("Datos recibidos:", data); // Verifica la respuesta completa del API

            if (Array.isArray(data) && data.length > 0) {
                mostrarDatosClima(data[0]);
            } else {
                console.error("La respuesta del API no es un array o está vacía.");
                $("#result").html("<p>Error: No se recibieron datos válidos del API.</p>");
            }
        },
        error: function (xhr, status, error) {
            console.error("Error en la solicitud:", status, error);
            $("#result").html("<p>Error en la solicitud al API.</p>");
        }
    });

    // Llamada AJAX para obtener la información de ubicación
    $.ajax({
        type: "GET",
        url: "http://dataservice.accuweather.com/locations/v1/61328?apikey=qe9ybVt9ZfKNRJ5rUTCHAPsbavF1tP44&language=es-cl&details=true",
        success: function (data) {
            console.log("Datos de ubicación recibidos:", data); // Verifica la respuesta completa del API

            if (data && data.Key) {
                mostrarDatosUbicacion(data);
            } else {
                console.error("La respuesta del API de ubicación no es válida.");
                $("#location-details").html("<p>Error: No se recibieron datos válidos de ubicación del API.</p>");
            }
        },
        error: function (xhr, status, error) {
            console.error("Error en la solicitud de ubicación:", status, error);
            $("#location-details").html("<p>Error en la solicitud al API de ubicación.</p>");
        }
    });

    // Función para mostrar los datos del clima
    function mostrarDatosClima(observacion) {
        let estadoClima = observacion.WeatherText.toLowerCase();
        let temperaturaC = observacion.Temperature.Metric.Value;
        let esDeDia = observacion.IsDayTime ? "Sí" : "No";
        let tienePrecipitacion = observacion.HasPrecipitation ? "Sí" : "No";
        let tipoPrecipitacion = observacion.PrecipitationType || "N/A";
        let enlace = observacion.Link;

        // Determinar la imagen según el estado del clima
        let imagenClima;
        switch (estadoClima) {
            case 'nublado':
            case 'parcialmente nublado':
            case 'algunas nubes':
                imagenClima = 'nublado.png';
                break;
            case 'lluvia':
                imagenClima = 'lluvia.png';
                break;
            case 'despejado':
            case 'mayormente despejado':
                imagenClima = 'soleado.png';
                break;
            default:
                imagenClima = 'default.png'; // Imagen por defecto si no se encuentra un estado específico
        }

        // Mostrar los datos extraídos en la página
        $("#weather-icon__image").html(`<img src="${imagenClima}" alt="${estadoClima}" />`);
        $("#weather-icon__title").html(
            `<span>${formatearFecha(observacion.LocalObservationDateTime)}</span>
            <p>${estadoClima.charAt(0).toUpperCase() + estadoClima.slice(1)}</p>
            <p>${temperaturaC}°C</p>`
        );
        $("#weather-details").html(`
            <p>Fecha y hora de observación: ${formatearFecha(observacion.LocalObservationDateTime)}</p>
            <p>¿Es de día?: ${esDeDia}</p>
            <p>¿Hay precipitación?: ${tienePrecipitacion}</p>
            <p>Tipo de precipitación: ${tipoPrecipitacion}</p>
            <p><a href="${enlace}" target="_blank">Más detalles</a></p>
        `);
    }

    // Función para mostrar los datos de ubicación
    function mostrarDatosUbicacion(data) {
        let ciudad = data.LocalizedName;
        let region = data.AdministrativeArea.LocalizedName;
        let pais = data.Country.LocalizedName;
        let latitud = data.GeoPosition.Latitude;
        let longitud = data.GeoPosition.Longitude;
        let zonaHoraria = data.TimeZone.Name;
        let gmtOffset = data.TimeZone.GmtOffset;
        let esHorarioVerano = data.TimeZone.IsDaylightSaving ? "Sí" : "No";

        // Mostrar los datos de ubicación en la página
        $("#weather-icon__title").append(
            `<span>${ciudad}</span>, <span>${region}</span>`
        );
        
        $("#location-details").html(`
            <h3>Información de Ubicación</h3>
            <p><strong>Ciudad:</strong> ${ciudad}</p>
            <p><strong>Región:</strong> ${region}</p>
            <p><strong>País:</strong> ${pais}</p>
            <p><strong>Latitud:</strong> ${latitud}</p>
            <p><strong>Longitud:</strong> ${longitud}</p>
            <p><strong>Zona horaria:</strong> ${zonaHoraria}</p>
            <p><strong>GMT Offset:</strong> ${gmtOffset}</p>
            <p><strong>¿Horario de verano?:</strong> ${esHorarioVerano}</p>
        `);
    }
});
