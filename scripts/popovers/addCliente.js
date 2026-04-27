/* BANCO DE CLIENTES */
let clientes = [];
let sessoes  = [];

// ==================== PERSISTÊNCIA ====================
function salvarDados() {
  localStorage.setItem('clientes', JSON.stringify(clientes));
  localStorage.setItem('sessoes',  JSON.stringify(sessoes));
}

function carregarDados() {
  const c = localStorage.getItem('clientes');
  const s = localStorage.getItem('sessoes');
  if (c) clientes = JSON.parse(c);
  if (s) sessoes  = JSON.parse(s);
}

// ==================== UTILITÁRIOS ====================
function truncar(texto, limite) {
  return texto.length > limite ? texto.slice(0, limite) + '...' : texto;
}

// ==================== CLIENTES ====================
function renderizarClientes() {
  const conteiner = document.querySelector('.clientesConteiner');
  conteiner.innerHTML = '';

  clientes.forEach(cliente => {
    let enderecoCompleto = '';
    if (cliente.endereco) enderecoCompleto += cliente.endereco;

    const card = document.createElement('div');
    card.classList.add('cliente-card');
    card.innerHTML = `
      <h4>${truncar(cliente.nome, 25)}</h4>
      ${cliente.telefone ? `<p>📞 ${cliente.telefone}</p>` : ''}
      ${enderecoCompleto ? `<p>📍 ${truncar(enderecoCompleto, 23)}</p>` : ''}
    `;

    card.dataset.id = cliente.id;
    card.addEventListener('click', function() {
      const c = clientes.find(c => c.id === Number(this.dataset.id));
      abrirPopover(c);
    });

    conteiner.appendChild(card);
  });
}

function cadastrarCliente() {
  const nome     = document.getElementById('nomeCliente').value.trim();
  const telefone = document.getElementById('telefone').value.trim();
  const cpf      = document.getElementById('cpf').value.trim();
  const endereco = document.getElementById('endereco').value.trim();
  const cep      = document.getElementById('cep').value.trim();
  const numero   = document.getElementById('numero').value.trim();

  if (!nome) {
    alert('⚠️ Por favor, preencha o nome do cliente.');
    return;
  }

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
  salvarDados();
  renderizarClientes();
  document.getElementById('clienteForm').reset();
}

// ==================== POPOVER CLIENTE ====================
function fecharPopover() {
  document.querySelector('.popoverCliente').style.display = 'none';
}

function abrirPopover(cliente) {
  const popover = document.querySelector('.popoverCliente');
  const info    = document.querySelector('.infoCliente');

  let enderecoCompleto = '';
  if (cliente.endereco) enderecoCompleto += cliente.endereco;
  if (cliente.numero)   enderecoCompleto += `, ${cliente.numero}`;
  if (cliente.cep)      enderecoCompleto += ` - CEP: ${cliente.cep}`;

  const sessoesAvulsas = (cliente.sessoes || []).filter(s => s.tipo === 'avulsa' || !s.tipo);
  const pacotes        = (cliente.sessoes || []).filter(s => s.tipo === 'pacote');

  const sessoesHTML = sessoesAvulsas.length > 0
    ? sessoesAvulsas.map(s => `
        <div class="sessao-card">
          <div class="sessao-card-top">
            <strong>${s.servico}</strong>
            <span class="badge badge-${s.status}">${s.status}</span>
          </div>
          <p>📅 ${s.data} às ${s.hora}</p>
          ${s.valor ? `<p>💰 ${s.valor}</p>` : ''}
          ${s.obs   ? `<p>📝 ${s.obs}</p>`   : ''}
        </div>
      `).join('')
    : '<p class="vazio">Nenhuma sessão avulsa marcada.</p>';

  const pacotesHTML = pacotes.length > 0
    ? pacotes.map(p => {
        const realizadas = p.sessoesRealizadas || 0;
        const total      = p.totalSessoes || 0;
        const pct        = total > 0 ? Math.round((realizadas / total) * 100) : 0;
        return `
          <div class="sessao-card pacote-card">
            <div class="sessao-card-top">
              <strong>${p.servico}</strong>
              <span class="badge badge-${p.status}">${p.status}</span>
            </div>
            <div class="progresso-bar">
              <div class="progresso-fill" style="width:${pct}%"></div>
            </div>
            <p class="progresso-label">${realizadas} de ${total} sessões realizadas</p>
            ${p.valor ? `<p>💰 ${p.valor}</p>` : ''}
            ${p.obs   ? `<p>📝 ${p.obs}</p>`   : ''}
            <div class="sessao-acoes">
              <button type="button" onclick="marcarSessaoPacote(${cliente.id}, ${p.id})">
                ✅ Marcar sessão do pacote
              </button>
            </div>
          </div>
        `;
      }).join('')
    : '<p class="vazio">Nenhum pacote contratado.</p>';

  const iniciais = cliente.nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();

  info.innerHTML = `
  <h3>📋 Informações do Cliente</h3>

  <div class="abas-cliente">
    <button class="aba-btn ativa" onclick="trocarAbaCliente('info', this)">Info</button>
    <button class="aba-btn" onclick="trocarAbaCliente('sessoes', this)">Sessões (${sessoesAvulsas.length})</button>
    <button class="aba-btn" onclick="trocarAbaCliente('pacotes', this)">Pacotes (${pacotes.length})</button>
  </div>

  <div id="abaCliente-info" class="aba-painel ativa">
    <div id="modoVisualizar">
          <h4>${cliente.nome}</h4>
          ${cliente.telefone ? `<p>📞 ${cliente.telefone}</p>` : ''}
        </div>
      </div>
    </div>

    <div id="modoEditar" style="display:none">
      <h4>✏️ Editar Cliente</h4>
      <label>Nome</label>
      <input id="editNome"     value="${cliente.nome     || ''}">
      <label>Telefone</label>
      <input id="editTelefone" value="${cliente.telefone || ''}">
      <label>CPF</label>
      <input id="editCpf"      value="${cliente.cpf      || ''}">
      <label>Endereço</label>
      <input id="editEndereco" value="${cliente.endereco || ''}">
      <label>Número</label>
      <input id="editNumero"   value="${cliente.numero   || ''}">
      <label>CEP</label>
      <input id="editCep"      value="${cliente.cep      || ''}">
      <div class="sessao-acoes">
        <button onclick="salvarEdicaoCliente(${cliente.id})">💾 Salvar</button>
        <button onclick="modoVisualizar()">✖️ Cancelar</button>
      </div>
    </div>
  </div>

  <div id="abaCliente-sessoes" class="aba-painel">
    ${sessoesHTML}
  </div>

  <div id="abaCliente-pacotes" class="aba-painel">
    ${pacotesHTML}
  </div>
`;
  popover.style.display = 'flex';
}

function trocarAbaCliente(id, el) {
  const info = document.querySelector('.infoCliente');
  info.querySelectorAll('.aba-painel').forEach(p => p.classList.remove('ativa'));
  info.querySelectorAll('.aba-btn').forEach(b => b.classList.remove('ativa'));
  document.getElementById('abaCliente-' + id).classList.add('ativa');
  el.classList.add('ativa');
}

function modoEditar(id) {
  document.getElementById('modoVisualizar').style.display = 'none';
  document.getElementById('modoEditar').style.display     = 'block';
}

function modoVisualizar() {
  document.getElementById('modoVisualizar').style.display = 'block';
  document.getElementById('modoEditar').style.display     = 'none';
}

function salvarEdicaoCliente(id) {
  const index = clientes.findIndex(c => c.id === id);
  if (index === -1) return;

  clientes[index] = {
    ...clientes[index],
    nome:     document.getElementById('editNome').value,
    telefone: document.getElementById('editTelefone').value,
    cpf:      document.getElementById('editCpf').value,
    endereco: document.getElementById('editEndereco').value,
    numero:   document.getElementById('editNumero').value,
    cep:      document.getElementById('editCep').value,
  };

  salvarDados();
  renderizarClientes();
  abrirPopover(clientes[index]);
}

// ==================== POPOVER SESSÃO ====================
let clienteSelecionadoId = null;
let pacoteAtualId        = null;
let tipoSessaoAtual      = 'avulsa';

function abrirPopoverSessao() {
  clienteSelecionadoId = null;
  pacoteAtualId        = null;
  document.getElementById('clienteSessao').value        = '';
  document.getElementById('servicoSessao').value        = '';
  document.getElementById('valorSessao').value          = '';
  document.getElementById('dataSessao').value           = '';
  document.getElementById('horaSessao').value           = '';
  document.getElementById('obsSessao').value            = '';
  document.getElementById('qtdSessoesPacote').value     = '';
  document.getElementById('valorPacote').value          = '';
  document.getElementById('obsPacote').value            = '';
  document.getElementById('clientesDropdown').innerHTML = '';
  setTipoSessao('avulsa');
  document.querySelector('.popoverSessao').style.display = 'flex';
  mostrarClientes();
}

function fecharPopoverSessao() {
  clienteSelecionadoId = null;
  pacoteAtualId        = null;
  document.getElementById('clienteSessao').value        = '';
  document.getElementById('servicoSessao').value        = '';
  document.getElementById('valorSessao').value          = '';
  document.getElementById('dataSessao').value           = '';
  document.getElementById('horaSessao').value           = '';
  document.getElementById('obsSessao').value            = '';
  document.getElementById('qtdSessoesPacote').value     = '';
  document.getElementById('valorPacote').value          = '';
  document.getElementById('obsPacote').value            = '';
  document.getElementById('clientesDropdown').innerHTML = '';
  document.querySelector('.popoverSessao').style.display = 'none';
}

function setTipoSessao(tipo) {
  tipoSessaoAtual = tipo;
  document.querySelectorAll('.tipo-tab').forEach(btn => {
    btn.classList.toggle('ativo', btn.dataset.tipo === tipo);
  });
  document.getElementById('campos-avulsa').style.display = tipo === 'avulsa' ? '' : 'none';
  document.getElementById('campos-pacote').style.display = tipo === 'pacote' ? '' : 'none';
}

function mostrarClientes(filtro = '') {
  const dropdown = document.getElementById('clientesDropdown');
  if (!dropdown) return;
  dropdown.innerHTML = '';

  const lista = clientes.filter(c =>
    c.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  if (lista.length === 0) {
    dropdown.innerHTML = '<div class="dropdown-option">Nenhum cliente encontrado</div>';
    return;
  }

  lista.forEach(c => {
    const item = document.createElement('div');
    item.classList.add('dropdown-option');
    item.textContent = c.nome;
    item.onclick = () => selecionarCliente(c.id, c.nome);
    dropdown.appendChild(item);
  });
}

function filtrarClientes() {
  mostrarClientes(document.getElementById('clienteSessao').value);
}

function selecionarCliente(id, nome) {
  clienteSelecionadoId = id;
  document.getElementById('clienteSessao').value        = nome;
  document.getElementById('clientesDropdown').innerHTML = '';
}

function mascaraValor(input) {
  let v = input.value.replace(/\D/g, '');
  v = (Number(v) / 100).toFixed(2);
  input.value = 'R$ ' + v.replace('.', ',');
}

function marcarSessaoPacote(clienteId, pacoteId) {
  const cliente = clientes.find(c => c.id === clienteId);
  if (!cliente) return;

  const pacote = cliente.sessoes.find(s => s.id === pacoteId);
  if (!pacote) return;

  if ((pacote.sessoesRealizadas || 0) >= pacote.totalSessoes) {
    alert('⚠️ Todas as sessões deste pacote já foram realizadas.');
    return;
  }

  fecharPopover();
  abrirPopoverSessao();

  // preenche DEPOIS de abrir
  clienteSelecionadoId = clienteId;
  document.getElementById('clienteSessao').value        = cliente.nome;
  document.getElementById('servicoSessao').value        = pacote.servico;
  document.getElementById('clientesDropdown').innerHTML = '';
  pacoteAtualId = pacoteId;
}

function cadastrarSessao() {
  if (!clienteSelecionadoId) { alert('⚠️ Selecione um cliente.'); return; }

  const servico = document.getElementById('servicoSessao').value.trim();
  if (!servico) { alert('⚠️ Preencha o serviço.'); return; }

  const cliente = clientes.find(c => c.id === clienteSelecionadoId);
  let novoRegistro;

  if (tipoSessaoAtual === 'avulsa') {
    const valor = document.getElementById('valorSessao').value.trim();
    const data  = document.getElementById('dataSessao').value;
    const hora  = document.getElementById('horaSessao').value;
    const obs   = document.getElementById('obsSessao').value.trim();

    if (!data || !hora) { alert('⚠️ Preencha data e horário.'); return; }

    novoRegistro = {
      id: Date.now(),
      tipo: 'avulsa',
      pacoteId: pacoteAtualId || null,
      clienteId: clienteSelecionadoId,
      nomeCliente: cliente.nome,
      servico, valor, data, hora, obs,
      status: 'agendada'
    };

    if (pacoteAtualId) {
      const pacote = cliente.sessoes.find(s => s.id === pacoteAtualId);
      if (pacote) pacote.sessoesRealizadas = (pacote.sessoesRealizadas || 0) + 1;
    }

  } else {
    const qtd   = parseInt(document.getElementById('qtdSessoesPacote').value);
    const valor = document.getElementById('valorPacote').value.trim();
    const obs   = document.getElementById('obsPacote').value.trim();

    if (!qtd || qtd < 1) { alert('⚠️ Informe a quantidade de sessões.'); return; }

    novoRegistro = {
      id: Date.now(),
      tipo: 'pacote',
      clienteId: clienteSelecionadoId,
      nomeCliente: cliente.nome,
      servico,
      totalSessoes: qtd,
      sessoesRealizadas: 0,
      valor, obs,
      status: 'ativo'
    };
  }

  sessoes.push(novoRegistro);
  cliente.sessoes.push(novoRegistro);

  salvarDados();
  alert(`✅ ${tipoSessaoAtual === 'avulsa' ? 'Sessão cadastrada' : 'Pacote cadastrado'} para ${cliente.nome}!`);
  fecharPopoverSessao();
}

// ==================== LISTENERS ====================
document.querySelector('.popoverCliente').addEventListener('click', function(e) {
  if (e.target === this) fecharPopover();
});

document.querySelector('.popoverSessao').addEventListener('click', function(e) {
  if (e.target === this) fecharPopoverSessao();
});

// ==================== INICIALIZAÇÃO ====================
carregarDados();
renderizarClientes();