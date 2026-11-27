const casos = 1250000;
const obitos = 850;

console.log("Casos registrados:", casos);
console.log("Óbitos registrados:", obitos);

document.getElementById("casos").textContent = casos.toLocaleString("pt-BR");
document.getElementById("obitos").textContent = obitos.toLocaleString("pt-BR");

const grafico = document.getElementById("graficoDengue");

new Chart(grafico, {
    type: "bar",

    data: {
        
labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],

datasets: [{
    label: "Casos de dengue",
    data: [120, 190, 300, 250, 180, 90, 70, 60, 110, 150, 210, 280],
    backgroundColor: "#0d9488"
}]

    },


    options: {
    responsive: true,

    plugins: {
        legend: {
            display: false
        },

        tooltip: {
    callbacks: {
        label: function(context) {
            return "Casos: " + context.raw.toLocaleString("pt-BR");
        }
    }
}
    },

    scales: {
        y: {
            beginAtZero: true,
            title: {
                display: true,
                text: "Número de casos"
            }
        }
    }
}
});