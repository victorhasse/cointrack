# CoinTrack FX Dashboard

Dashboard financeiro moderno com **dados reais** de câmbio e criptomoedas, conversor híbrido fiat ↔ cripto, gráficos históricos, alertas de preço e detecção de arbitragem.

<p align="center">
  <a href="../README.md">🇺🇸 English</a> | 🇧🇷 Português
</p>

## Estrutura de arquivos

```
cryptotrack-fx/
├── index.html          # Marcação HTML limpa
├── diagnostico.html    # testa cada endpoint individualmente no browser e mostra exatamente o que está falhando
├── .gitignore
├── css/
│   └── styles.css      # Tokens, temas, componentes, responsividade
└── js/
    ├── data.js         # APIs reais + i18n + fallback + formatação
    ├── chart.js        # Renderização Chart.js (gráfico principal + sparklines)
    ├── ui.js           # Funções de renderização DOM puras
    └── main.js         # Estado global, eventos, lifecycle
```

## Funcionalidades

- **Dados reais** — Frankfurter (fiat, BCE) + CoinGecko (cripto), ambos gratuitos e sem chave de API
- **Fallback automático** — valores em cache se as APIs estiverem indisponíveis
- **Visão geral do mercado** — cards de 6 moedas fiat + 4 cripto com sparklines reais
- **"Ver mais" no mobile** — mostra 3 fiat + 2 cripto, com botão para expandir
- **Conversor híbrido** — qualquer fiat ↔ qualquer cripto com taxas ao vivo
- **Gráfico histórico** — 6 períodos: 1D / 7D / 1M / 3M / 1A / 5A com dados reais
- **Alertas de preço** — notificação visual quando um ativo cruza o valor alvo
- **Arbitragem simulada** — comparação Binance vs Kraken com spread percentual
- **Favoritos** — pares salvos via `localStorage`
- **Loading skeleton** — cards animados enquanto as APIs respondem
- **Modo Dark / Light** — toggle com transição suave
- **Troca de idioma PT / EN** — todas as strings traduzidas em `data.js`
- **Personalização de cor** — altera o accent color de todo o dashboard
- **Menu hamburguer** — tema, idioma e cor em um drawer lateral limpo
- **Smart TOC** — navegação lateral com scroll spy (telas largas)
- **Responsivo** — grade de 2 colunas no mobile, topbar com scroll horizontal

## Screenshots

| CoinTrack | FX Dashboard |
| :---: | :---: |
| <img src="https://github.com/user-attachments/assets/7e602b8e-344b-420a-a958-349dd48c6bd1" alt="foto1" width="100%"/> | <img src="https://github.com/user-attachments/assets/c6b04d66-84ea-4971-8b24-4bc737f86273" alt="foto2" width="100%"/> 

## Como rodar localmente

Os módulos JS usam `import`/`export` (ES Modules nativos), que exigem um servidor HTTP:

```bash
# Node.js
npx serve .

# Python
python3 -m http.server 8080

# VS Code → extensão Live Server → "Go Live"
```

> **Atenção:** abrir o `index.html` via `file://` vai falhar por restrições de CORS nos módulos ES.

## APIs utilizadas

| Serviço | Dados | Limite | Chave |
|---------|-------|--------|-------|
| [Frankfurter](https://frankfurter.app) | Taxas fiat (BCE) | Sem limite declarado | Não |
| [CoinGecko Public](https://www.coingecko.com/en/api) | Preços + histórico cripto | ~30 req/min | Não |

O auto-refresh acontece a cada **60 segundos** para respeitar os limites das APIs gratuitas.

## Stack

- HTML5 semântico
- CSS puro com Custom Properties (sem framework)
- JavaScript ES Modules (sem bundler)
- [Chart.js 4](https://www.chartjs.org/)
- [Syne](https://fonts.google.com/specimen/Syne) + [DM Mono](https://fonts.google.com/specimen/DM+Mono) via Google Fonts

## Créditos

Desenvolvido por **Victor Hasse** <br>
[![GitHub](https://img.shields.io/badge/victorhasse-181717?style=flat&logo=github)](https://github.com/victorhasse)

Projeto acadêmico e de portfólio — 2026

## Licença

Este projeto está sob a licença MIT.
