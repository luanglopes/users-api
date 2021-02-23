# Users API

Uma API para gerenciamento de usuários com diferentes níveis de permissão.

## Regras de negócio

- A tabela de usuários deve conter os campos nome, senha, tipo, email e status.
- A tabela de tipos deve a descrição do tipo.
- Um usuário tem apenas um único tipo
- Apenas usuários do tipo root e admin podem cadastrar novos usuários.
- Apenas usuários do tipo root admin podem alterar qualquer informação do usuário(inclusive status);
- Apenas usuários root podem excluir usuários
- Usuários do tipo geral só tem acesso a listar informações de seu próprio usuário, bem como alterar suas próprias informações.
- O login deve ser feito com email e senha.


## Ambiente

- Node 14.15.5+
- npm 7.5.4+
