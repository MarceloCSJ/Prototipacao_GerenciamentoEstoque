# Plano de Testes Manuais — Sistema de Gerenciamento de Estoque

## 1. Objetivo

Este documento apresenta um plano de testes manuais para validar os Requisitos Funcionais (RF01 a RF09) do sistema de gerenciamento de estoque.

Para cada requisito, são definidos:

- **Teste positivo:** verifica se a funcionalidade funciona corretamente com dados válidos.
- **Teste negativo:** verifica se o sistema rejeita ou trata adequadamente uma operação ou condição inválida.

Os testes devem ser executados pela interface do sistema, sem necessidade de automação.

## 2. Preparação do ambiente

### 2.1. Pré-condições gerais

- O usuário deve estar autenticado.
- O ambiente deve estar disponível para testes.
- O usuário deve ter acesso às telas de Produtos e Alertas. A tela Movimentações pode ser utilizada para consultar registros, mas as entradas e saídas devem ser executadas a partir da tela Produtos.
- Sempre que possível, utilizar uma conta e uma base de dados exclusivas para testes.
- No cadastro de cada produto, preencher todos os campos obrigatórios: **nome, categoria, preço, quantidade inicial em estoque e quantidade de estoque mínimo**.

### 2.2. Dados de teste sugeridos

| Produto | Categoria | Preço | Estoque inicial | Estoque mínimo |
|---|---|---:|---:|---:|
| Perfume A | Cosméticos | R$ 79,90 | 10 | 5 |
| Shampoo B | Cosméticos | R$ 24,90 | 2 | 5 |
| Fone C | Tecnologia | R$ 129,90 | 20 | 10 |
| Camiseta D | Vestuário | R$ 59,90 | 15 | 5 |

Os valores de preço são exemplos para execução dos testes. Os dados podem ser ajustados conforme as funcionalidades disponíveis no sistema. Antes de cada cenário, confirme a pré-condição indicada e restaure os dados quando necessário.

---

## 3. Casos de teste

### RF01 — Cadastrar e editar produtos

**Descrição:** O sistema deve permitir cadastrar e atualizar produtos, incluindo nome, categoria, preço, quantidade inicial em estoque e quantidade de estoque mínimo.

#### RF01-TP01 — Cadastrar e editar um produto com informações válidas

**Tipo:** Positivo

**Pré-condição:** Usuário autenticado e tela de produtos disponível.

**Passos:**
1. Acessar a tela de produtos.
2. Selecionar a opção de cadastrar produto.
3. Preencher todos os campos obrigatórios com os seguintes dados:
   - Nome: `Creme Hidratante`.
   - Categoria: `Cosméticos`.
   - Preço: `R$ 39,90`.
   - Quantidade inicial em estoque: `10` unidades.
   - Quantidade de estoque mínimo: `5` unidades.
4. Confirmar o cadastro.
5. Localizar o produto cadastrado.
6. Conferir se o preço, o estoque inicial e o estoque mínimo foram salvos corretamente.
7. Editar o nome para `Creme Hidratante Premium`.
8. Salvar as alterações.
9. Recarregar a página e consultar novamente o produto.

**Resultado esperado:**
- O produto deve ser cadastrado com sucesso.
- O produto deve aparecer na listagem de estoque.
- O preço deve ser apresentado/salvo como `R$ 39,90`.
- O saldo inicial deve ser de 10 unidades.
- O estoque mínimo deve ser de 5 unidades.
- As informações editadas devem ser atualizadas e permanecer salvas após recarregar a página.

#### RF01-TN01 — Tentar cadastrar produto sem preço ou sem estoque mínimo

**Tipo:** Negativo

**Passos:**
1. Acessar a tela de produtos.
2. Selecionar a opção de cadastrar produto.
3. Preencher nome, categoria, quantidade inicial e estoque mínimo, mas deixar o campo **preço** vazio.
4. Tentar confirmar o cadastro e verificar a validação apresentada.
5. Limpar o formulário ou iniciar um novo cadastro.
6. Preencher nome, categoria, preço e quantidade inicial, mas deixar o campo **estoque mínimo** vazio.
7. Tentar confirmar o cadastro e verificar a validação apresentada.
8. Limpar o formulário ou iniciar um novo cadastro.
9. Preencher os demais campos corretamente e informar preço igual a `R$ 0,00`.
10. Tentar confirmar o cadastro.

**Resultado esperado:**
- O sistema deve impedir o cadastro quando o preço não for informado.
- O sistema deve impedir o cadastro quando a quantidade de estoque mínimo não for informada.
- O sistema deve impedir o cadastro quando o preço for zero, considerando a regra de preço maior que zero.
- Deve apresentar mensagens de validação claras para os campos inválidos.
- Nenhum produto das tentativas inválidas deve ser incluído na listagem.

**Observação:** Execute cada variação separadamente, para identificar precisamente qual campo está sendo validado.

---

### RF02 — Consultar o estoque

**Descrição:** O sistema deve exibir os produtos e seus saldos atuais, permitindo localizar produtos pelo nome e pela categoria.

#### RF02-TP01 — Consultar produtos utilizando filtros de pesquisa

**Tipo:** Positivo

**Pré-condição:** Os produtos de teste devem estar cadastrados com preço e estoque mínimo preenchidos.

**Passos:**
1. Acessar a tela de produtos.
2. Verificar se os produtos cadastrados são apresentados com seus respectivos saldos.
3. Pesquisar pelo nome `Perfume A`.
4. Verificar o resultado apresentado.
5. Limpar a pesquisa.
6. Selecionar a categoria `Cosméticos`.

**Resultado esperado:**
- O sistema deve apresentar o `Perfume A` ao pesquisar pelo nome.
- Deve apresentar os produtos pertencentes à categoria selecionada.
- Os saldos exibidos devem corresponder às quantidades atuais do estoque.

#### RF02-TN01 — Consultar um produto inexistente

**Tipo:** Negativo

**Passos:**
1. Acessar a tela de produtos.
2. Informar `Produto Inexistente` no campo de pesquisa.
3. Executar a pesquisa.

**Resultado esperado:**
- O sistema não deve apresentar produtos que não correspondam à pesquisa.
- Deve informar que nenhum produto foi encontrado ou apresentar uma listagem vazia.
- Não deve ocorrer erro ou quebra da interface.

---

### RF03 — Registrar entradas

**Descrição:** O sistema deve permitir registrar a entrada de uma quantidade positiva de um produto e somá-la ao saldo atual.

#### RF03-TP01 — Registrar uma entrada válida

**Tipo:** Positivo

**Pré-condição:** Produto cadastrado com todos os campos obrigatórios preenchidos e saldo de 5 unidades.

**Passos:**
1. Acessar a tela **Produtos**.
2. Localizar o produto que está com saldo de 5 unidades.
3. Na própria área/cartão/linha desse produto, acionar a opção de registrar **entrada**.
4. Informar a quantidade de `10` unidades no formulário de entrada apresentado.
5. Confirmar/salvar a operação.
6. Ainda na tela Produtos, conferir o saldo atualizado. Se necessário, consultar também a tela Movimentações para verificar o registro no histórico.

**Resultado esperado:**
- A movimentação deve ser registrada com sucesso.
- O sistema deve somar a quantidade adicionada ao saldo anterior.
- O saldo final deve ser de 15 unidades.
- O preço e o estoque mínimo cadastrados para o produto devem permanecer inalterados pela movimentação.

#### RF03-TN01 — Tentar registrar uma entrada com quantidade zero

**Tipo:** Negativo

**Pré-condição:** Produto cadastrado com todos os campos obrigatórios preenchidos e saldo de 5 unidades.

**Passos:**
1. Acessar a tela **Produtos**.
2. Localizar o produto que está com saldo de 5 unidades.
3. Na própria área/cartão/linha desse produto, acionar a opção de registrar **entrada**.
4. Informar a quantidade `0` no formulário de entrada apresentado.
5. Tentar confirmar/salvar a operação.

**Resultado esperado:**
- O sistema deve rejeitar a operação.
- Deve apresentar uma mensagem informando que a quantidade precisa ser maior que zero.
- O saldo deve permanecer em 5 unidades.
- A movimentação não deve ser registrada.

---

### RF04 — Registrar saídas

**Descrição:** O sistema deve permitir registrar saídas e subtrair a quantidade informada do saldo, impedindo que o estoque fique negativo.

#### RF04-TP01 — Registrar uma saída válida

**Tipo:** Positivo

**Pré-condição:** Produto cadastrado com todos os campos obrigatórios preenchidos e saldo de 10 unidades.

**Passos:**
1. Acessar a tela **Produtos**.
2. Localizar o produto que está com saldo de 10 unidades.
3. Na própria área/cartão/linha desse produto, acionar a opção de registrar **saída**.
4. Informar a quantidade de `3` unidades no formulário de saída apresentado.
5. Confirmar/salvar a operação.
6. Ainda na tela Produtos, conferir o saldo atualizado. Se necessário, consultar também a tela Movimentações para verificar o registro no histórico.

**Resultado esperado:**
- A saída deve ser registrada com sucesso.
- O sistema deve subtrair a quantidade informada do saldo atual.
- O saldo final deve ser de 7 unidades.
- O preço e o estoque mínimo cadastrados para o produto devem permanecer inalterados pela movimentação.

#### RF04-TN01 — Tentar registrar uma saída superior ao saldo disponível

**Tipo:** Negativo

**Pré-condição:** Produto cadastrado com todos os campos obrigatórios preenchidos e saldo de 2 unidades.

**Passos:**
1. Acessar a tela **Produtos**.
2. Localizar o produto que está com saldo de 2 unidades.
3. Na própria área/cartão/linha desse produto, acionar a opção de registrar **saída**.
4. Informar a quantidade de `3` unidades no formulário de saída apresentado.
5. Tentar confirmar/salvar a operação.

**Resultado esperado:**
- O sistema deve rejeitar a operação.
- Deve apresentar uma mensagem informando que não existe estoque suficiente.
- O saldo deve permanecer em 2 unidades.
- O estoque não pode apresentar valores negativos.

---

### RF05 — Configurar estoque mínimo

**Descrição:** O sistema deve permitir definir e alterar individualmente a quantidade mínima desejada por produto. O estoque mínimo também deve ser informado no cadastro inicial do produto.

#### RF05-TP01 — Alterar o estoque mínimo de um produto já cadastrado

**Tipo:** Positivo

**Pré-condição:** `Perfume A` cadastrado com estoque mínimo de 5 unidades.

**Passos:**
1. Acessar a tela de produtos ou as configurações de estoque do produto.
2. Selecionar o `Perfume A`.
3. Conferir que o estoque mínimo cadastrado é de 5 unidades.
4. Alterar o estoque mínimo para `8` unidades.
5. Salvar a configuração.
6. Recarregar a página e consultar novamente o produto.

**Resultado esperado:**
- O sistema deve permitir alterar o estoque mínimo.
- O novo valor deve ser atualizado para 8 unidades.
- O valor deve permanecer salvo após recarregar a página.

#### RF05-TN01 — Verificar se a alteração do mínimo afeta somente o produto selecionado

**Tipo:** Negativo

**Pré-condição:**
- `Perfume A` cadastrado com estoque mínimo de 5 unidades.
- `Fone C` cadastrado com estoque mínimo de 10 unidades.

**Passos:**
1. Acessar a configuração de estoque mínimo do `Perfume A`.
2. Alterar o valor para `3` unidades.
3. Salvar a configuração.
4. Consultar novamente o estoque mínimo do `Fone C`.

**Resultado esperado:**
- O estoque mínimo do `Perfume A` deve passar para 3 unidades.
- O estoque mínimo do `Fone C` deve continuar em 10 unidades.
- A alteração de um produto não deve modificar as configurações dos outros produtos.

---

### RF06 — Gerar alerta de estoque baixo

**Descrição:** O sistema deve gerar um alerta quando o saldo de um produto for menor ou igual à quantidade mínima configurada.

#### RF06-TP01 — Gerar alerta quando o estoque atingir o limite mínimo

**Tipo:** Positivo

**Pré-condição:**
- Produto cadastrado com preço preenchido.
- Estoque mínimo cadastrado de 5 unidades.
- Saldo atual de 6 unidades.

**Passos:**
1. Acessar a tela **Produtos**.
2. Localizar o produto com saldo de 6 unidades e mínimo de 5.
3. Na própria área/cartão/linha desse produto, acionar a opção de registrar **saída**.
4. Informar a quantidade de `1` unidade no formulário de saída.
5. Confirmar/salvar a operação.
6. Acessar a área de Alertas e verificar o alerta de estoque baixo.

**Resultado esperado:**
- O saldo deve ser atualizado para 5 unidades.
- O sistema deve gerar um alerta de estoque baixo.
- O alerta deve identificar corretamente o produto.

#### RF06-TN01 — Não gerar alerta quando o estoque estiver acima do mínimo

**Tipo:** Negativo

**Pré-condição:**
- `Fone C` cadastrado com preço preenchido.
- Estoque mínimo de 10 unidades.
- Saldo atual de 20 unidades.

**Passos:**
1. Acessar a área de alertas.
2. Localizar ou pesquisar pelo produto `Fone C`.
3. Verificar se existe algum alerta de estoque baixo associado ao produto.

**Resultado esperado:**
- O produto não deve apresentar alerta de estoque baixo.
- O sistema deve considerar que o estoque está acima da quantidade mínima configurada.

**Observação:** A regra é saldo menor ou igual ao mínimo. Portanto, atingir exatamente o mínimo também deve gerar alerta.

---

### RF07 — Identificar produtos sem movimentação

**Descrição:** O sistema deve identificar produtos sem entradas ou saídas registradas há mais de 60 dias. Para produtos sem movimentações, a contagem começa na data do cadastro.

#### RF07-TP01 — Identificar um produto sem movimentação há mais de 60 dias

**Tipo:** Positivo

**Pré-condição:**
- Produto cadastrado com todos os campos obrigatórios preenchidos, incluindo preço e estoque mínimo.
- Produto cadastrado há pelo menos 61 dias.
- Nenhuma entrada ou saída registrada nos últimos 61 dias.

**Passos:**
1. Preparar um produto de teste com a data de cadastro ou da última movimentação há 61 dias.
2. Aguardar ou executar a verificação diária prevista pelo sistema.
3. Acessar a área de alertas.
4. Localizar o produto.

**Resultado esperado:**
- O sistema deve identificar o produto como sem movimentação.
- Deve gerar ou apresentar o alerta correspondente.
- O produto deve ser identificado corretamente.

#### RF07-TN01 — Não identificar como parado um produto com movimentação há exatamente 60 dias

**Tipo:** Negativo

**Pré-condição:**
- Produto cadastrado com todos os campos obrigatórios preenchidos, incluindo preço e estoque mínimo.
- Última movimentação registrada há exatamente 60 dias.

**Passos:**
1. Preparar um produto de teste com última movimentação há 60 dias.
2. Aguardar ou executar a verificação diária.
3. Acessar a área de alertas.
4. Procurar pelo produto.

**Resultado esperado:**
- O produto não deve ser classificado como parado.
- Não deve ser gerado alerta de ausência de movimentação por esse critério.

**Observação para execução:** Para executar esses testes, será necessário preparar registros com datas anteriores no ambiente de testes, por exemplo, utilizando dados de teste no Supabase. A interface do sistema não permite simular 61 dias de espera instantaneamente. A tela Movimentações pode ser consultada para conferir o histórico; ela não deve ser usada como caminho para registrar entradas ou saídas. Também é necessário considerar a execução da rotina diária de verificação.

---

### RF08 — Listar produtos para reposição

**Descrição:** O sistema deve apresentar os produtos com saldo menor ou igual ao mínimo, exibindo o saldo atual e a quantidade mínima.

#### RF08-TP01 — Apresentar produtos que precisam de reposição

**Tipo:** Positivo

**Pré-condição:**
- `Shampoo B` cadastrado com preço preenchido.
- Saldo de 2 unidades.
- Estoque mínimo cadastrado de 5 unidades.

**Passos:**
1. Acessar a tela de produtos ou a área de reposição.
2. Localizar a listagem de produtos para reposição.
3. Procurar pelo `Shampoo B`.

**Resultado esperado:**
- O `Shampoo B` deve aparecer na lista de reposição.
- O sistema deve apresentar o saldo atual de 2 unidades.
- O sistema deve apresentar o estoque mínimo de 5 unidades.

#### RF08-TN01 — Não apresentar produtos com saldo superior ao mínimo

**Tipo:** Negativo

**Pré-condição:**
- `Fone C` cadastrado com preço preenchido.
- Saldo de 20 unidades.
- Estoque mínimo cadastrado de 10 unidades.

**Passos:**
1. Acessar a lista de produtos para reposição.
2. Procurar pelo `Fone C`.
3. Verificar se o produto está presente na listagem.

**Resultado esperado:**
- O `Fone C` não deve aparecer na lista de reposição.
- O sistema deve considerar que o estoque está acima do limite mínimo.

---

### RF09 — Consultar alertas

**Descrição:** O sistema deve disponibilizar uma área que reúna os alertas de estoque baixo e de produtos sem movimentação.

#### RF09-TP01 — Consultar alertas de diferentes tipos

**Tipo:** Positivo

**Pré-condição:**
- Existir pelo menos um produto cadastrado com todos os campos obrigatórios preenchidos e com estoque baixo.
- Existir pelo menos um produto cadastrado com todos os campos obrigatórios preenchidos e sem movimentação há mais de 60 dias.

**Passos:**
1. Acessar a área de alertas.
2. Verificar os alertas apresentados.
3. Localizar o produto com estoque baixo.
4. Localizar o produto sem movimentação.
5. Conferir as informações de cada alerta.

**Resultado esperado:**
- O sistema deve apresentar os dois tipos de alertas.
- Cada alerta deve identificar o respectivo produto.
- Deve apresentar o motivo correto:
  - Estoque abaixo ou igual ao mínimo configurado.
  - Ausência de movimentação por mais de 60 dias.

#### RF09-TN01 — Consultar a área de alertas quando não existem situações pendentes

**Tipo:** Negativo

**Pré-condição:**
- Os produtos de teste devem estar cadastrados com preço e estoque mínimo preenchidos.
- Nenhum produto deve ter saldo abaixo ou igual ao mínimo.
- Nenhum produto deve estar sem movimentação há mais de 60 dias.

**Passos:**
1. Acessar a área de alertas.
2. Verificar o conteúdo apresentado.

**Resultado esperado:**
- O sistema não deve apresentar alertas indevidos.
- Deve informar que não existem situações pendentes.
- A interface deve permanecer funcional, sem apresentar erros.

---

## 4. Resumo dos casos de teste

| Requisito | Teste positivo | Teste negativo | Total |
|---|---|---|---:|
| RF01 — Cadastrar e editar produtos | RF01-TP01 | RF01-TN01 | 2 |
| RF02 — Consultar estoque | RF02-TP01 | RF02-TN01 | 2 |
| RF03 — Registrar entradas | RF03-TP01 | RF03-TN01 | 2 |
| RF04 — Registrar saídas | RF04-TP01 | RF04-TN01 | 2 |
| RF05 — Configurar estoque mínimo | RF05-TP01 | RF05-TN01 | 2 |
| RF06 — Gerar alerta de estoque baixo | RF06-TP01 | RF06-TN01 | 2 |
| RF07 — Identificar produtos sem movimentação | RF07-TP01 | RF07-TN01 | 2 |
| RF08 — Listar produtos para reposição | RF08-TP01 | RF08-TN01 | 2 |
| RF09 — Consultar alertas | RF09-TP01 | RF09-TN01 | 2 |
| **Total** | **9** | **9** | **18** |

## 5. Checklist de execução

Marque o resultado de cada caso durante a execução. Registre evidências, como capturas de tela, sempre que houver falha.

| ID | Caso de teste | Resultado (Aprovado/Falhou/Não executado) | Evidência / Observações |
|---|---|---|---|
| RF01-TP01 | Cadastrar e editar produto com preço e estoque mínimo |  |  |
| RF01-TN01 | Cadastrar produto sem preço ou sem estoque mínimo, ou com preço zero |  |  |
| RF02-TP01 | Consultar produtos por nome e categoria |  |  |
| RF02-TN01 | Consultar produto inexistente |  |  |
| RF03-TP01 | Registrar entrada válida pela tela Produtos |  |  |
| RF03-TN01 | Tentar registrar entrada com quantidade zero pela tela Produtos |  |  |
| RF04-TP01 | Registrar saída válida pela tela Produtos |  |  |
| RF04-TN01 | Tentar registrar saída superior ao saldo pela tela Produtos |  |  |
| RF05-TP01 | Alterar estoque mínimo |  |  |
| RF05-TN01 | Verificar isolamento do mínimo por produto |  |  |
| RF06-TP01 | Gerar alerta ao atingir estoque mínimo |  |  |
| RF06-TN01 | Não gerar alerta acima do mínimo |  |  |
| RF07-TP01 | Identificar produto parado há mais de 60 dias |  |  |
| RF07-TN01 | Não identificar produto com até 60 dias |  |  |
| RF08-TP01 | Listar produto que precisa de reposição |  |  |
| RF08-TN01 | Não listar produto acima do estoque mínimo |  |  |
| RF09-TP01 | Consultar alertas existentes |  |  |
| RF09-TN01 | Consultar área sem alertas |  |  |

## 6. Considerações importantes

1. **RF01:** o cadastro deve validar o preenchimento do preço e da quantidade de estoque mínimo, além dos demais campos obrigatórios. O preço deve ser maior que zero.
2. **RF03 e RF04:** as entradas e saídas devem ser iniciadas na tela **Produtos**, a partir do produto correspondente. Utilize a tela **Movimentações** apenas para consultar o histórico, caso necessário. Além do saldo final, confira se a movimentação não foi registrada mais de uma vez.
3. **RF05 e RF06:** teste o limite exato. Um produto com saldo igual ao mínimo também precisa gerar alerta.
4. **RF07:** o requisito estabelece mais de 60 dias, e não 60 dias ou mais. Essa diferença é importante para evitar falsos alertas.
5. **RF08 e RF09:** embora tratem dos mesmos produtos, possuem objetivos diferentes. O RF08 verifica a lista de reposição e seus valores; o RF09 verifica a centralização e identificação dos motivos dos alertas.
6. **Preço e estoque mínimo:** nos cenários que dependem de produtos previamente cadastrados, utilize produtos criados com preço e estoque mínimo preenchidos. As entradas e saídas não devem alterar esses dados cadastrais.

## 7. Critério de conclusão

Os Requisitos Funcionais serão considerados validados quando os 18 casos de teste tiverem sido executados e seus resultados registrados.

- **Aprovado:** o resultado obtido corresponde ao resultado esperado.
- **Falhou:** o resultado obtido diverge do resultado esperado.
- **Não executado:** o cenário ainda não foi executado ou depende de alguma preparação.

Toda falha deve ser registrada com a identificação do caso de teste, descrição do comportamento observado e, sempre que possível, evidência visual. Após a correção, o caso deve ser executado novamente para confirmar a solução.
