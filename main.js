// Inicializa Ícones
lucide.createIcons();

// Variáveis de Elementos
const inputIds = [
  "pesoInicial",
  "gmd",
  "custoSuplemento",
  "consumoDiario",
  "dias",
  "valorArroba",
];
const elements = {};
inputIds.forEach((id) => (elements[id] = document.getElementById(id)));

const displayLucro = document.getElementById("resLucro");
const displayArrobas = document.getElementById("resArrobas");
const displayCustoTotal = document.getElementById("resCustoTotal");
const displayBreakEven = document.getElementById("resBreakEven");
const displayInsight = document.getElementById("insightText");

// Função de Cálculo Centralizada
function updateCalculation() {
  const val = {};
  inputIds.forEach((id) => (val[id] = parseFloat(elements[id].value) || 0));

  // Regra: 1 @ = 30kg peso vivo
  const totalGanhoKg = (val.gmd / 1000) * val.dias;
  const arrobas = totalGanhoKg / 30;

  const receita = arrobas * val.valorArroba;
  const custoTrato = val.consumoDiario * val.custoSuplemento * val.dias;
  const lucro = receita - custoTrato;

  // Formatação Monetária
  const fmt = (v) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // Atualiza UI
  displayLucro.innerText = fmt(lucro);
  displayArrobas.innerText = arrobas.toFixed(2) + " @";
  displayCustoTotal.innerText = fmt(custoTrato);

  const breakEvenGMD =
    (((custoTrato / val.valorArroba) * 30) / val.dias) * 1000;
  displayBreakEven.innerText = Math.round(breakEvenGMD) + "g";

  // Logica de Insight
  if (lucro > 0) {
    const perc = ((lucro / custoTrato) * 100).toFixed(0);
    displayInsight.innerText = `Operação saudável! Retorno de ${perc}% sobre o investimento no trato.`;
    displayInsight.className =
      "text-emerald-600 text-xs mt-1 leading-relaxed font-bold";
  } else if (lucro < 0) {
    displayInsight.innerText =
      "Atenção: O custo da dieta está consumindo o lucro. Reduza custos ou aumente o GMD.";
    displayInsight.className =
      "text-rose-600 text-xs mt-1 leading-relaxed font-bold";
  } else {
    displayInsight.innerText =
      "Insira os dados da fazenda para gerar o insight.";
    displayInsight.className =
      "text-slate-500 text-xs mt-1 leading-relaxed italic";
  }
}

// Listeners para Input
inputIds.forEach((id) =>
  elements[id].addEventListener("input", updateCalculation),
);

// Inicia Cálculo na Carga
updateCalculation();

// --- LÓGICA PWA ---
let deferredPrompt;
const pwaToast = document.getElementById("pwa-install-toast");
const btnInstall = document.getElementById("install-button");

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPrompt = e;
  // Delay para não atrapalhar o primeiro uso
  setTimeout(() => {
    pwaToast.classList.remove("hidden");
  }, 5000);
});

btnInstall.addEventListener("click", async () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    pwaToast.classList.add("hidden");
  }
});

window.addEventListener("appinstalled", () => {
  pwaToast.classList.add("hidden");
});
