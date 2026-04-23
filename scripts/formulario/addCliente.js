/* BANCO DE CLIENTES */
const clientes = [];

function cadastrarCliente() {
  const nome = document.getElementById('nomeCliente').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const cpf = document.getElementById('cpf').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const cep = document.getElementById('cep').value.trim();
  const numero = document.getElementById('numero').value.trim();

  if (!nome) {
    alert('⚠️ Por favor, preencha o nome do cliente.');
    return;
  }

  // Cria o objeto e salva no array
  const novoCliente = {
    id: Date.now(),
    nome,
    telefone,
    cpf,
    endereco,
    cep,
    numero,
    sessoes: []
  };

  clientes.push(novoCliente);

  // Cria o card
  let enderecoCompleto = '';
  if (endereco) enderecoCompleto += endereco;


  function truncar(texto, limite) {
    return texto.length > limite ? texto.slice(0, limite) + '...' : texto;
  }
  
  const card = document.createElement('div');
  card.classList.add('cliente-card');
  card.innerHTML = `
    <h4>${truncar(nome, 25)}</h4>
    ${telefone ? `<p>📞 ${telefone}</p>` : ''}
    ${enderecoCompleto ? `<p>📍 ${truncar(enderecoCompleto, 23)}</p>` : ''}
  `;

  // Vincula o ID do objeto ao card e abre o popover ao clicar
  card.dataset.id = novoCliente.id;
  card.addEventListener('click', function() {
    const cliente = clientes.find(c => c.id === Number(this.dataset.id));
    abrirPopover(cliente);
  });

  document.querySelector('.clientesConteiner').appendChild(card);
  document.getElementById('clienteForm').reset();
}