$(document).ready(function () {
    // Clave de API para acceder a la información del héroe
    const apiKey = "d541a4f85cba7a1d66b10b3bd617a8ba";

    $("#hero-form").on("submit", function (event) {
        event.preventDefault();
        const heroId = $("#hero-id").val().trim();
        if (!/^\d+$/.test(heroId)) { // Verifica si el ID es un número válido
            alert("Por favor, ingresa un número válido.");
            return;
        }
        fetchHeroData(heroId); // Llama a la función para obtener datos del héroe
    });

    // Obtiene los datos del héroe desde la API.
    function fetchHeroData(heroId) {
        const settings = {
            async: true,
            crossDomain: true,
            url: `https://www.superheroapi.com/api.php/${apiKey}/${heroId}`, // URL para la petición a la API
            method: "GET",
            dataType: "json",
            headers: {
                Accept: "*/*",
                'User-Agent': "Thunder Client (https://www.thunderclient.com/)"
            },
        };
        // Realiza la petición AJAX
        $.ajax(settings)
            .done(function (data) {
                renderHeroData(data); // Llama a la función para mostrar los datos del héroe
                renderHeroChart(data); // Llama a la función para mostrar el gráfico de estadísticas
            })
            .fail(function () {
                alert(
                    "No se pudo obtener la información del héroe. Intenta de nuevo más tarde."
                );
            });
    }

    // Renderiza la información del héroe en la página.
    function renderHeroData(data) {
        let heroInfo = `
            <h5 class="card-title mb-3">SuperHero "${data.id}"</h5>
            <div class="card mb-3">
                <div class="row g-0">
                    <div class="col-md-4">
                        <img src="${data.image.url}" class="img-fluid rounded-start" alt="${data.name}">
                    </div>
                    <div class="col-md-8">
                        <div class="card-body">
        `;

        // Agregar información de héroe si está disponible
        const fields = {
            'Nombre': data.name,
            'Nombre Completo': data.biography['full-name'],
            'Alter Egos': data.biography['alter-egos'],
            'Conexiones': data.connections['group-affiliation'],
            'Publicado por': data.biography.publisher,
            'Ocupación': data.work.occupation,
            'Primera Aparición': data.biography['first-appearance'],
            'Altura': data.appearance.height.join(' - '),
            'Peso': data.appearance.weight.join(' - '),
            'Alianzas': data.biography.aliases.join(', '),
            'Lugar de Nacimiento': data.biography['place-of-birth'],
            'Color de Ojos': data.appearance['eye-color'],
            'Color de Cabello': data.appearance['hair-color'],
            'Base': data.work.base,
            'Relativos': data.connections.relatives
        };

        for (const [key, value] of Object.entries(fields)) {
            if (value && value !== 'null' && value !== 'undefined' && value !== '-') {
                heroInfo += `<p class="card-text"><strong>${key}:</strong> ${value}</p>`;
            }
        }

        heroInfo += `
                        </div>
                    </div>
                </div>
            </div>
        `;

        $("#hero-info").html(heroInfo); // Inserta el HTML generado en el contenedor de información del héroe
    }

    // Renderiza un gráfico de las estadísticas del héroe.
    function renderHeroChart(data) {
        const stats = data.powerstats;

        // Verificar si hay datos de estadísticas
        const hasStats = Object.values(stats).some(stat => stat !== 'null' && stat !== 'undefined');
    
        // Si no hay estadísticas, mostrar un mensaje alternativo
        if (!hasStats) {
            $("#hero-chart-container").html('<p class="text-muted">No hay estadísticas disponibles para este héroe.</p>');
            return;
        }

        const chartData = [
            { y: stats.intelligence, label: "Inteligencia" },
            { y: stats.strength, label: "Fuerza" },
            { y: stats.speed, label: "Velocidad" },
            { y: stats.durability, label: "Durabilidad" },
            { y: stats.power, label: "Poder" },
            { y: stats.combat, label: "Combate" }
        ].filter(stat => stat.y !== 'null' && stat.y !== 'undefined');

        // Configura y renderiza el gráfico con CanvasJS
        var chart = new CanvasJS.Chart("hero-chart-container", {
            theme: "light2", // "light1", "light2", "dark1", "dark2"
            exportEnabled: true,
            animationEnabled: true,
            title: {
                text: `Estadísticas de Poder para ${data.name}`
            },
            data: [{
                type: "pie",
                startAngle: 25,
                toolTipContent: "<b>{label}</b>: {y}%",
                showInLegend: "true",
                legendText: "{label}",
                indexLabelFontSize: 16,
                indexLabel: "{label} - {y}%",
                dataPoints: chartData
            }]
        });
        chart.render();
    }
});
