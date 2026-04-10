const btnAbrirCardapio = document.getElementById("addProduto");
const popoverCardapio = document.querySelector(".cardapioPopover");
const content = document.querySelector("#cardapio");

btnAbrirCardapio.addEventListener("click", () => {
  popoverCardapio.style.display = "flex";
});

popoverCardapio.addEventListener("click", (e) => {
    if (!content.contains(e.target)) {
      popoverCardapio.style.display = "none";
    }
  });