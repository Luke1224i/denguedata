const casos = 1250000;
const obitos = 850;

console.log("Casos registrados:", casos);
console.log("Óbitos registrados:", obitos);

document.getElementById("casos").textContent = casos.toLocaleString("pt-BR");
document.getElementById("obitos").textContent = obitos.toLocaleString("pt-BR");

const dadosPorAno = {
    2024: [100, 180, 280, 320, 240, 150, 90, 70, 100, 130, 180, 250],
    2025: [80, 150, 260, 290, 220, 120, 80, 60, 90, 140, 200, 270],
    2026: [120, 190, 300, 250, 180, 90, 70, 60, 110, 150, 210, 280]
    
};

function calcularMedia(valores) {
    const total = valores.reduce(function(soma, valor) {
        return soma + valor;
    }, 0);

    return total / valores.length;
}

function calcularVariacao(ano) {
    const anoAnterior = Number(ano) - 1;

    if (!dadosPorAno[anoAnterior]) {
        return null;
    }

    const totalAtual = dadosPorAno[ano].reduce((soma, valor) => soma + valor, 0);
    const totalAnterior = dadosPorAno[anoAnterior].reduce((soma, valor) => soma + valor, 0);

    return ((totalAtual - totalAnterior) / totalAnterior) * 100;
}

document.getElementById("mediaCasos").textContent =
    Math.round(calcularMedia(dadosPorAno[2026])).toLocaleString("pt-BR");

const grafico = document.getElementById("graficoDengue");

const graficoDengue = new Chart(grafico, {
    type: "bar",

    data: {
        
labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],

datasets: [{
    label: "Casos de dengue",
    data: dadosPorAno[2026],
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
const filtroAno = document.getElementById("filtroAno");

filtroAno.addEventListener("change", function() {
    const anoSelecionado = filtroAno.value;

    graficoDengue.data.datasets[0].data = dadosPorAno[anoSelecionado];
    graficoDengue.data.datasets[0].label = "Casos de dengue - " + anoSelecionado;

    document.getElementById("mediaCasos").textContent =
        Math.round(calcularMedia(dadosPorAno[anoSelecionado])).toLocaleString("pt-BR");

    const variacao = calcularVariacao(anoSelecionado);

    document.getElementById("variacao").textContent =
        variacao === null ? "N/A" :
        (variacao > 0 ? "+" : "") + variacao.toFixed(1) + "%";

    graficoDengue.update();
});