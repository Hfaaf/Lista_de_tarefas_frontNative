# App de Tarefas · Frontend (React Native + Expo)

Aplicativo mobile desenvolvido com React Native, Expo e React Native
Paper. Permite criar, editar, excluir, buscar e marcar tarefas como
concluídas. Cada tarefa possui título, descrição, data de criação,
status e deadline.

## Tecnologias utilizadas

-   React Native
-   Expo
-   TypeScript
-   React Native Paper
-   Axios
-   @react-native-community/datetimepicker

## Funcionalidades

-   Listagem de tarefas
-   Busca com debounce
-   Criação de tarefa
-   Edição de tarefa
-   Exclusão
-   Marcar tarefa como concluída
-   Deadline com DateTimePicker
-   Exibição da data de criação
-   Atualização automática ao voltar da tela de edição
-   Pull-to-refresh

## Estrutura

src/ components/ TaskItem.tsx screens/ HomeScreen.tsx
CreateEditScreen.tsx services/ api.ts types/ Task.ts

## Instalação

npm install
npx expo install

## Configuração API
ultilize a api que está neste [repositorio](https://github.com/Hfaaf/Lista_de_tarefas_backMONGOOSE)

Edite src/services/api.ts com seu IP local.

## Executar

npx expo start
