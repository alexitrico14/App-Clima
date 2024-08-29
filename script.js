$(document).ready(function () {
    $.ajax({
        type: "GET",
        url: "http://dataservice.accuweather.com/currentconditions/v1/61328?apikey=qe9ybVt9ZfKNRJ5rUTCHAPsbavF1tP44&language=es-cl",
        success: function (data) {
            console.log("Datos recibidos:", data); // Verifica la respuesta completa del API

            if (Array.isArray(data) && data.length > 0) {
                // Extraer datos específicos
                let observacion = data[0];
                let estadoClima = observacion.WeatherText;
                let temperaturaC = observacion.Temperature.Metric.Value;
                let temperaturaF = observacion.Temperature.Imperial.Value;
                let esDeDia = observacion.IsDayTime ? "Sí" : "No";
                let tienePrecipitacion = observacion.HasPrecipitation ? "Sí" : "No";
                let tipoPrecipitacion = observacion.PrecipitationType || "N/A";
                let enlace = observacion.Link;

                // Determinar la imagen según el estado del clima
                let imagenClima;
                switch (estadoClima.toLowerCase()) {
                    case 'nublado':
                        imagenClima = 'nublado.png';
                        break;
                    case 'lluvia':
                        imagenClima = 'lluvia.png';
                        break;
                    case 'despejado' && 'mayormente despejado':
                        imagenClima = 'soleado.png';
                        break;
                    default:
                        imagenClima = 'default.png'; // Imagen por defecto si no se encuentra un estado específico
                }

                // Mostrar los datos extraídos en la página
                $("#weather-icon__image").html(`<img src="${imagenClima}" alt="${estadoClima}" />`
                );
                $("#weather-icon__title").html(
                    `<p>${estadoClima}</p>
                    <p>${temperaturaC}°C</p>
                    <span>Valparaíso, Chile</span>`
                );
                $("#weather-details").html(`
                    <p>Fecha y hora de observación: ${observacion.LocalObservationDateTime}</p>
                    <p>¿Es de día?: ${esDeDia}</p>
                    <p>¿Hay precipitación?: ${tienePrecipitacion}</p>
                    <p>Tipo de precipitación: ${tipoPrecipitacion}</p>
                    <p><a href="${enlace}" target="_blank">Más detalles</a></p>
                `);
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

});
