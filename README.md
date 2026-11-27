# 🦟 DengueData

Plataforma de visualização e análise de dados públicos relacionados à dengue no Brasil.

Projeto desenvolvido como parte do **FMU TECH Inovação 2026**, relacionado ao Objetivo de Desenvolvimento Sustentável (ODS) 3 — Saúde e Bem-Estar.

---

## 📌 Sobre o projeto

O DengueData é uma plataforma de visualização de dados epidemiológicos que busca facilitar a compreensão de informações relacionadas à dengue no Brasil.

Por meio de indicadores e gráficos interativos, o projeto permite visualizar registros notificados, acompanhar distribuições mensais e consultar informações por estado.

## 🎯 Objetivo

Facilitar a compreensão de informações epidemiológicas sobre dengue por meio de gráficos, indicadores e visualizações de dados públicos.

## ✨ Funcionalidades

- Visualização de registros de dengue.
- Indicadores epidemiológicos.
- Gráfico de distribuição mensal.
- Filtro por estado.
- Visualização de dados referentes a 2026.
- Exportação de dados filtrados em CSV.
- Processamento de dados utilizando Node.js.

## 🛠️ Tecnologias utilizadas

- **HTML5** — Estrutura da plataforma.
- **CSS3** — Estilização e layout.
- **JavaScript** — Interatividade e manipulação dos dados.
- **Node.js** — Processamento e disponibilização dos dados.
- **Chart.js** — Criação dos gráficos.
- **Git e GitHub** — Versionamento e armazenamento do projeto.

## 📊 Fonte dos dados

Os dados utilizados no projeto são provenientes do Sistema de Informação de Agravos de Notificação (SINAN), disponibilizados pelo Ministério da Saúde.

Fonte oficial:

https://dadosabertos.saude.gov.br/dataset/arboviroses-dengue

Os dados utilizados correspondem ao arquivo referente a 2026.

## ⚙️ Como executar o projeto

### 1. Pré-requisitos

- Node.js instalado.
- Visual Studio Code ou outro editor.
- Arquivo CSV do SINAN colocado na pasta `dados`.

### 2. Organização dos arquivos

```text
denguedata/
├── index.html
├── style.css
├── script.js
├── server.js
├── .gitignore
└── dados/
    └── DENGBR26.csv
```

### 3. Inicializando o servidor

Abra o terminal na pasta do projeto e execute:

```bash
node server.js
```

O servidor será disponibilizado em:

http://localhost:3000

### 4. Abrindo a plataforma

Abra o arquivo `index.html` utilizando o Live Server do Visual Studio Code.

## ⚠️ Metodologia e limitações

Os dados utilizados são registros provenientes de notificações epidemiológicas e não necessariamente representam casos confirmados ou dados definitivamente consolidados.

Os dados podem sofrer atualizações, revisões e alterações ao longo do tempo.

Os indicadores apresentados possuem caráter exploratório e devem ser interpretados considerando as limitações da base de dados.

## 🌎 Objetivo de Desenvolvimento Sustentável

O projeto está relacionado ao **ODS 3 — Saúde e Bem-Estar**, contribuindo para a visualização e compreensão de informações públicas relacionadas à saúde.

## 👨‍💻 Desenvolvedor

Projeto acadêmico desenvolvido individualmente como parte do FMU TECH Inovação 2026.

---

**DengueData — Dados que ajudam a compreender a dengue.**
