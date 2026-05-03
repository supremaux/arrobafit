lucide.createIcons();

const inputs = [
  "pesoInicial",
  "gmd",
  "custoSuplemento",
  "consumoDiario",
  "dias",
  "valorArroba",
];

function calculate() {
  const data = {};
  inputs.forEach(
    (id) => (data[id] = parseFloat(document.getElementById(id).value) || 0),
  );

  // Regras de Negócio:
  // 1 @ = 30kg de peso vivo (considerando rendimento de carcaça padrão)
  const ganhoTotalKg = (data.gmd / 1000) * data.dias;
  const arrobasProduzidas = ganhoTotalKg / 30;

  const receitaBruta = arrobasProduzidas * data.valorArroba;
  const custoTotalTrato = data.consumoDiario * data.custoSuplemento * data.dias;
  const lucroLiquido = receitaBruta - custoTotalTrato;

  // Atualiza Interface
  document.getElementById("resLucro").innerText = lucroLiquido.toLocaleString(
    "pt-BR",
    {
      style: "currency",
      currency: "BRL",
    },
  );
  document.getElementById("resArrobas").innerText =
    arrobasProduzidas.toFixed(2) + " @";
  document.getElementById("resCustoTotal").innerText =
    custoTotalTrato.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  // Cálculo simplificado de ponto de equilíbrio (gmd necessário para pagar o trato)
  const gmdNecessario =
    (((custoTotalTrato / data.valorArroba) * 30) / data.dias) * 1000;
  document.getElementById("resBreakEven").innerText =
    Math.round(gmdNecessario) + "g";

  // Insight Dinâmico
  const insight =
    lucroLiquido > 0
      ? `Operação lucrativa! [cite_start]Você está ganhando ${((lucroLiquido / custoTotalTrato) * 100).toFixed(0)}% sobre o custo do trato[cite: 11].`
      : "Atenção: O custo do trato está superando o ganho de peso. Revise a dieta.";
  document.getElementById("insightText").innerText = insight;
}

inputs.forEach((id) => {
  document.getElementById(id).addEventListener("input", calculate);
});

calculate(); // Inicializa
