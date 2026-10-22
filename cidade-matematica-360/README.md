# Cidade Matemática 360°

Protótipo educativo em A-Frame para explorar uma fotografia panorâmica 360° e resolver desafios de adição, subtração, multiplicação e divisão por seleção com o olhar.

## Abrir o protótipo

A página está em `cidade-matematica-360/index.html`. Para testar localmente, recomenda-se servir a pasta por um servidor HTTP, em vez de abrir o HTML diretamente como arquivo.

## Adicionar a fotografia 360° da cidade

1. Prepare uma fotografia panorâmica esférica completa, de preferência equiretangular na proporção 2:1.
2. Salve uma cópia como `praca360.jpg` na pasta `cidade-matematica-360/imagens/`.
3. Se a pasta `imagens` não existir, crie-a no repositório.
4. Se ainda não tiver a fotografia pronta, abra o protótipo e use **Escolher foto 360°** para carregar uma imagem do dispositivo durante o teste. Essa seleção local é temporária e não publica a fotografia no GitHub.

O repositório não inclui uma fotografia real da cidade neste commit; é necessário adicionar uma imagem própria para que o cenário abra automaticamente sem carregamento manual.

## Interação

- Olhe para um alvo até o cursor completar o tempo de seleção.
- Escolha uma das quatro operações.
- Selecione uma resposta e leia o feedback.
- A pontuação fica na sessão atual; não é armazenada após recarregar a página.

## Publicar com GitHub Pages

Nas configurações do repositório, habilite **Settings → Pages** e selecione a branch `main` e a pasta `/(root)`, se ainda não estiver configurado. Depois, abra o caminho `/cidade-matematica-360/` no endereço publicado do site.

A experiência em modo imersivo depende do navegador e do dispositivo compatíveis com WebXR. Em celulares sem suporte a RV, é possível testar a cena como panorama interativo no navegador.

## Tecnologia

- A-Frame 1.7.1
- HTML, CSS e JavaScript
- Fotografia 360° local
