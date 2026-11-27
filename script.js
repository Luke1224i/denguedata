
const meses = [
    "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
    "Jul", "Ago", "Set", "Out", "Nov", "Dez"
];

const codigosUF = {
    "11": "RO",
    "12": "AC",
    "13": "AM",
    "14": "RR",
    "15": "PA",
    "16": "AP",
    "17": "TO",
    "21": "MA",
    "22": "PI",
    "23": "CE",
    "24": "RN",
    "25": "PB",
    "26": "PE",
    "27": "AL",
    "28": "SE",
    "29": "BA",
    "31": "MG",
    "32": "ES",
    "33": "RJ",
    "35": "SP",
    "41": "PR",
    "42": "SC",
    "43": "RS",
    "50": "MS",
    "51": "MT",
    "52": "GO",
    "53": "DF"
};

let dadosDengue = null;
let graficoMensal = null;
let graficoComparativo = null;

const filtroAno = document.getElementById("filtroAno");
const filtroEstado = document.getElementById("filtroEstado");
const statusDados = document.getElementById("statusDados");

function formatarNumero(numero) {
    return Number(numero || 0).toLocaleString("pt-BR");
}

function obterEstadoSelecionado() {
    return filtroEstado?.value || "Brasil";
}

function obterDadosFiltrados() {
    const estadoSelecionado = obterEstadoSelecionado();

    if (estadoSelecionado === "Brasil") {
        return {
            total: dadosDengue.total,
            obitos: dadosDengue.obitos,
            meses: dadosDengue.meses
        };
    }

    const codigo = Object.entries(codigosUF)
        .find(([codigo, uf]) => uf === estadoSelecionado)?.[0];

    if (!codigo) {
        return {
            total: 0,
            obitos: 0,
            meses: {}
        };
    }

    const mesesEstado = dadosDengue.mesesPorEstado[codigo] || {};

    const total = Object.values(mesesEstado)
        .reduce((soma, valor) => soma + valor, 0);

    return {
        total,
        obitos: dadosDengue.obitosPorEstado[codigo] || 0,
        meses: mesesEstado
    };
}

function atualizarIndicadores(dados) {
    const casosElemento = document.getElementById("casos");
    const obitosElemento = document.getElementById("obitos");
    const mediaElemento = document.getElementById("mediaCasos");
    const variacaoElemento = document.getElementById("variacao");

    if (casosElemento) {
        casosElemento.textContent = formatarNumero(dados.total);
    }

    if (obitosElemento) {
        obitosElemento.textContent = formatarNumero(dados.obitos);
    }

    const valoresMensais = meses.map((mes, index) => {
        const numero = String(index + 1).padStart(2, "0");
        return dados.meses[numero] || 0;
    });

    const mesesComDados = valoresMensais.filter(valor => valor > 0);

    const media = mesesComDados.length
        ? mesesComDados.reduce((a, b) => a + b, 0) / mesesComDados.length
        : 0;

    if (mediaElemento) {
        mediaElemento.textContent = formatarNumero(Math.round(media));
    }

    if (variacaoElemento) {
        const mesesPreenchidos = valoresMensais.filter(v => v > 0);

        if (mesesPreenchidos.length >= 2) {
            const penultimo = mesesPreenchidos[mesesPreenchidos.length - 2];
            const ultimo = mesesPreenchidos[mesesPreenchidos.length - 1];

            const variacao = penultimo
                ? ((ultimo - penultimo) / penultimo) * 100
                : 0;

            variacaoElemento.textContent =
                `${variacao >= 0 ? "+" : ""}${variacao.toFixed(1)}%`;
        } else {
            variacaoElemento.textContent = "--";
        }
    }
}

function atualizarGraficoMensal(dados) {
    const canvas = document.getElementById("graficoDengue");

    if (!canvas || typeof Chart === "undefined") return;

    const valores = meses.map((mes, index) => {
        const numero = String(index + 1).padStart(2, "0");
        return dados.meses[numero] || 0;
    });

    if (graficoMensal) {
        graficoMensal.destroy();
    }

    graficoMensal = new Chart(canvas, {
        type: "bar",
        data: {
            labels: meses,
            datasets: [{
                label: "Notificações em 2026",
                data: valores,
                backgroundColor: "#2563eb",
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function atualizarGraficoComparativo(dados) {
    const canvas = document.getElementById("graficoComparativo");

    if (!canvas || typeof Chart === "undefined") return;

    const valores = meses.map((mes, index) => {
        const numero = String(index + 1).padStart(2, "0");
        return dados.meses[numero] || 0;
    });

    if (graficoComparativo) {
        graficoComparativo.destroy();
    }

    graficoComparativo = new Chart(canvas, {
        type: "line",
        data: {
            labels: meses,
            datasets: [{
                label: "2026 - SINAN",
                data: valores,
                borderColor: "#dc2626",
                backgroundColor: "rgba(220,38,38,0.12)",
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function atualizarDashboard() {
    if (!dadosDengue) return;

    const dados = obterDadosFiltrados();

    atualizarIndicadores(dados);
    atualizarGraficoMensal(dados);
    atualizarGraficoComparativo(dados);

    if (statusDados) {
        statusDados.textContent =
            `Dados SINAN 2026 • ${obterEstadoSelecionado()}`;
    }
}

async function carregarDados() {
    if (statusDados) {
        statusDados.textContent = "Carregando dados do SINAN...";
    }

    try {
        const resposta = await fetch("http://localhost:3000/api/dengue");

        if (!resposta.ok) {
            throw new Error("Falha ao buscar os dados.");
        }

        dadosDengue = await resposta.json();

        atualizarDashboard();

    } catch (erro) {
        console.error(erro);

        if (statusDados) {
            statusDados.textContent =
                "Erro ao carregar os dados. Verifique o servidor.";
        }
    }
}

function exportarDadosCSV() {
    if (!dadosDengue) return;

    const dados = obterDadosFiltrados();
    const estado = obterEstadoSelecionado();

    let conteudo = "Mes,Casos\n";

    meses.forEach((mes, index) => {
        const numero = String(index + 1).padStart(2, "0");

        conteudo += `${mes},${dados.meses[numero] || 0}\n`;
    });

    const blob = new Blob([conteudo], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `denguedata_2026_${estado}.csv`;
    link.click();

    URL.revokeObjectURL(url);
}

if (filtroEstado) {
    filtroEstado.addEventListener("change", atualizarDashboard);
}

if (filtroAno) {
    filtroAno.value = "2026";
    filtroAno.addEventListener("change", () => {
        if (filtroAno.value !== "2026") {
            alert("Este arquivo contém os dados de 2026.");
            filtroAno.value = "2026";
        }

        atualizarDashboard();
    });
}

const botaoExportar = document.getElementById("exportarCSV");

if (botaoExportar) {
    botaoExportar.addEventListener("click", exportarDadosCSV);
}

carregarDados();
