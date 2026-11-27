
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 3000;
const arquivoCSV = path.join(__dirname, "dados", "DENGBR26.csv");

function responder(res, status, dados) {
    res.writeHead(status, {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*"
    });
    res.end(JSON.stringify(dados));
}

const servidor = http.createServer((req, res) => {
    if (req.url.startsWith("/api/dengue")) {
        if (!fs.existsSync(arquivoCSV)) {
            return responder(res, 404, {
                erro: "CSV não encontrado."
            });
        }

        const resultados = {
            total: 0,
            estados: {},
            meses: {},
            mesesPorEstado: {},
            obitos: 0,
            obitosPorEstado: {}
        };

        const stream = fs.createReadStream(arquivoCSV, {
            encoding: "utf8"
        });

        let resto = "";
        let cabecalho = null;
        let colunaEstado = -1;
        let colunaData = -1;
        let colunaEvolucao = -1;

        function processarLinha(linha) {
            if (!linha.trim()) return;

            if (!cabecalho) {
                cabecalho = linha.split(",");
                colunaEstado = cabecalho.indexOf("SG_UF_NOT");
                colunaData = cabecalho.indexOf("DT_NOTIFIC");
                colunaEvolucao = cabecalho.indexOf("EVOLUCAO");
                return;
            }

            const campos = linha.split(",");
            const estado = campos[colunaEstado];
            const data = campos[colunaData];
            const evolucao = campos[colunaEvolucao];

            if (!estado || !data) return;

            const mes = data.substring(5, 7);

            if (!/^\d{2}$/.test(mes)) return;

            resultados.total++;

            resultados.estados[estado] =
                (resultados.estados[estado] || 0) + 1;

            resultados.meses[mes] =
                (resultados.meses[mes] || 0) + 1;

            if (!resultados.mesesPorEstado[estado]) {
                resultados.mesesPorEstado[estado] = {};
            }

            resultados.mesesPorEstado[estado][mes] =
                (resultados.mesesPorEstado[estado][mes] || 0) + 1;

            if (evolucao === "2") {
                resultados.obitos++;

                resultados.obitosPorEstado[estado] =
                    (resultados.obitosPorEstado[estado] || 0) + 1;
            }
        }

        stream.on("data", bloco => {
            resto += bloco;
            const linhas = resto.split(/\r?\n/);
            resto = linhas.pop();

            for (const linha of linhas) {
                processarLinha(linha);
            }
        });

        stream.on("end", () => {
            if (resto.trim()) processarLinha(resto);
            responder(res, 200, resultados);
        });

        stream.on("error", erro => {
            responder(res, 500, {
                erro: erro.message
            });
        });

        return;
    }

    responder(res, 404, {
        erro: "Rota não encontrada"
    });
});

servidor.listen(PORT, () => {
    console.log(`Servidor DengueData rodando em http://localhost:${PORT}`);
});
