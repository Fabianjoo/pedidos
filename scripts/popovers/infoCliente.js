function abrirPopover(cliente) {
    const popover = document.querySelector('.popoverCliente');
    const info = document.querySelector('.infoCliente');
  
    let enderecoCompleto = '';
    if (cliente.endereco) enderecoCompleto += cliente.endereco;
    if (cliente.numero)   enderecoCompleto += `, ${cliente.numero}`;
    if (cliente.cep)      enderecoCompleto += ` - CEP: ${cliente.cep}`;
  
    const sessoesHTML = cliente.sessoes.length > 0
      ? cliente.sessoes.map(s => `
          <div class="sessao-card">
            <p>💆 <strong>${s.servico}</strong></p>
            <p>📅 ${s.data} às ${s.hora}</p>
            ${s.valor ? `<p>💰 ${s.valor}</p>` : ''}
            ${s.obs   ? `<p>📝 ${s.obs}</p>`   : ''}
            <p>🔖 ${s.status}</p>
          </div>
        `).join('')
      : '<p>Nenhuma sessão marcada.</p>';
  
    info.innerHTML = `
      <h3>📋 Informações do Cliente</h3>
  
      <div class="popover-info">
        <h4>👤 ${cliente.nome}</h4>
        ${cliente.telefone ? `<p>📞 ${cliente.telefone}</p>` : ''}
        ${cliente.cpf      ? `<p>🪪 ${cliente.cpf}</p>`      : ''}
        ${enderecoCompleto ? `<p>📍 ${enderecoCompleto}</p>`  : ''}
      </div>
  
      <hr>
  
      <div class="popover-sessoes">
        <h4>📅 Sessões Agendadas</h4>
        ${sessoesHTML}
      </div>
  
    `;
  
    popover.style.display = 'flex';
  }
  
  
  function fecharPopover() {
    document.querySelector('.popoverCliente').style.display = 'none';
  }
  
  document.querySelector('.popoverCliente').addEventListener('click', function(e) {
    if (e.target === this) fecharPopover();
  });