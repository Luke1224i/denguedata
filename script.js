
const casos = 1250000;
const obitos = 850;

// Dados simulados
const dadosPorAno = {
    2024: [100, 180, 280, 320, 240, 150, 90, 70, 100, 130, 180, 250],
    2025: [80, 150, 260, 290, 220, 120, 80, 60, 90, 140, 200, 270],
    2026: [120, 190, 300, 250, 180, 90, 70, 60, 110, 150, 210, 280]
};

const meses = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

// Indicadores principais
document.getElementById("casos").textContent =
    casos.toLocaleString("pt-BR");

document.getElementById("obitos").textContent =
    obitos.toLocaleString("pt-BR");

// Média mensal
function calcularMedia(valores) {
    const total = valores.reduce((soma, valor) => soma + valor, 0);
    return total / valores.length;
}

// Variação anual
function calcularVariacao(ano) {
    const anoAnterior = Number(ano) - 1;

    if (!dadosPorAno[anoAnterior]) {
        return null;
    }

    const totalAtual = dadosPorAno[ano].reduce((soma, valor) => soma + valor, 0);
    const totalAnterior = dadosPorAno[anoAnterior].reduce((soma, valor) => soma + valor, 0);

    return ((totalAtual - totalAnterior) / totalAnterior) * 100;
}

// Atualiza indicadores
function atualizarIndicadores(ano) {
    document.getElementById("mediaCasos").textContent =
        Math.round(calcularMedia(dadosPorAno[ano])).toLocaleString("pt-BR");

    const variacao = calcularVariacao(ano);

    document.getElementById("variacao").textContent =
        variacao === null
            ? "N/A"
            : (variacao > 0 ? "+" : "") + variacao.toFixed(1) + "%";
}

// GRÁFICO PRINCIPAL
const grafico = document.getElementById("graficoDengue");

const graficoDengue = new Chart(grafico, {
    type: "bar",

    data: {
        labels: meses,

        datasets: [{
            label: "Casos de dengue",
            data: dadosPorAno[2026],
            backgroundColor: "#0d9488",
            borderRadius: 5
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
                        return "Casos: " +
                            context.raw.toLocaleString("pt-BR");
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

// FILTRO DE ANO DO GRÁFICO PRINCIPAL
const filtroAno = document.getElementById("filtroAno");

filtroAno.addEventListener("change", function() {
    const anoSelecionado = filtroAno.value;

    graficoDengue.data.datasets[0].data =
        dadosPorAno[anoSelecionado];

    graficoDengue.data.datasets[0].label =
        "Casos de dengue - " + anoSelecionado;

    atualizarIndicadores(anoSelecionado);

    graficoDengue.update();
});

// Inicializa os indicadores
atualizarIndicadores(filtroAno.value);

// GRÁFICO COMPARATIVO
const graficoComparativoCanvas =
    document.getElementById("graficoComparativo");

const graficoComparativo = new Chart(graficoComparativoCanvas, {
    type: "line",

    data: {
        labels: meses,

        datasets: [
            {
                label: "2024",
                data: dadosPorAno[2024],
                borderColor: "#64748b",
                backgroundColor: "#64748b",
                tension: 0.3
            },
            {
                label: "2025",
                data: dadosPorAno[2025],
                borderColor: "#f59e0b",
                backgroundColor: "#f59e0b",
                tension: 0.3
            },
            {
                label: "2026",
                data: dadosPorAno[2026],
                borderColor: "#0d9488",
                backgroundColor: "#0d9488",
                tension: 0.3
            }
        ]
    },

    options: {
        responsive: true,

        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        return context.dataset.label + ": " +
                            context.raw.toLocaleString("pt-BR");
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

console.log("DengueData iniciado com sucesso!");

// EXPORTAÇÃO DOS DADOS PARA CSV
document.getElementById("exportarCSV").addEventListener("click", function() {
    let csv = "Ano,Mês,Casos\n";

    Object.keys(dadosPorAno).forEach(function(ano) {
        dadosPorAno[ano].forEach(function(casos, indice) {
            csv += ano + "," + meses[indice] + "," + casos + "\n";
        });
    });

    const arquivo = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;"
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(arquivo);

    link.href = url;
    link.download = "denguedata_dados_simulados.csv";
    link.click();

    URL.revokeObjectURL(url);
});