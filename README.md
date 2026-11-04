# Brasil Imersivo — Realidade Virtual Geo

Experiência educativa híbrida para explorar os **seis biomas brasileiros** por meio de ambientes 3D, interações e panoramas fotográficos em 360°.

## Acessar

https://brenner279.github.io/realidadevirtual/

## Como funciona a experiência

1. **Tela inicial — mapa do Brasil:** o visitante escolhe Amazônia, Cerrado, Caatinga, Mata Atlântica, Pantanal ou Pampa. O mapa é esquemático e serve como navegação temática, não como limite cartográfico oficial dos biomas.
2. **Entrada no ambiente:** a aplicação carrega a paisagem 3D correspondente e apresenta informações gerais do bioma.
3. **Exploração:** o visitante se desloca, observa plantas, animais e elementos da paisagem e encontra marcadores dourados.
4. **Aprendizagem:** ao selecionar um marcador no cenário ou um tópico no painel, abre-se uma ficha com explicação educativa.
5. **Modo VR:** em dispositivos e navegadores compatíveis com WebXR, o visitante pode entrar no modo imersivo. Em óculos móveis sem controles, a seleção é feita pelo olhar; olhar para o chão e aguardar o foco do cursor permite deslocamento por teleporte.

## Formas de interação

### Computador
- **W, A, S, D** ou **setas:** caminhar.
- **Mouse:** arrastar para olhar ao redor.
- **Pontos dourados:** apontar e selecionar para abrir informações.
- **Voltar ao mapa:** retornar à tela inicial para escolher outro bioma.

### Celular
- **Toque e arraste na cena:** olhar ao redor; em aparelhos compatíveis, a orientação do telefone também pode acompanhar a visão.
- **Controles direcionais na tela:** avançar, recuar e deslocar para os lados.
- **Pontos dourados ou painel de descoberta:** tocar para consultar os conteúdos.
- **Modo VR:** colocar o celular em um visor compatível e iniciar a experiência imersiva, quando o navegador oferecer suporte.

### Óculos de realidade virtual
- **Olhar para um marcador:** o cursor de foco seleciona o ponto após aproximadamente um segundo.
- **Olhar para o chão:** o cursor pode selecionar uma posição e deslocar o visitante até ela.
- O funcionamento depende do suporte do navegador a WebXR e das capacidades do aparelho/visor. A versão atual prioriza óculos móveis sem controle manual.

## Conteúdo dos biomas

Cada ambiente apresenta quatro tópicos de descoberta relacionados a espécies, vegetação, paisagem ou funcionamento do ecossistema. A Amazônia inclui árvores de grande porte, palmeiras, rio, raízes tabulares e uma representação estilizada de arara-vermelha. Os demais ambientes apresentam elementos vegetais e animais simplificados, além de pontos interativos próprios.

> Os modelos 3D são representações didáticas estilizadas e não reconstruções científicas em escala real. Os pontos de localização no mapa são esquemáticos. O conteúdo pode ser ampliado e revisto conforme a validação pedagógica.

## Fotografias panorâmicas 360°

O botão **Carregar foto 360°** permite selecionar uma imagem local no dispositivo, sem enviá-la ao GitHub. Recomenda-se imagem equiretangular com proporção 2:1 (por exemplo, 4096 × 2048). Utilize imagens próprias, de domínio público ou com licença que permita reutilização, mantendo a atribuição de autoria e licença.

## Desenvolvimento local

1. Clone ou baixe o repositório.
2. Abra a pasta em um editor como VS Code.
3. Inicie um servidor local (por exemplo, com a extensão Live Server).
4. Acesse o endereço local e escolha um bioma no mapa.

Para usar WebXR, acesse por HTTPS ou localhost. O suporte varia conforme navegador, sistema operacional e hardware.

## Tecnologias

- HTML5, CSS3 e JavaScript
- [A-Frame 1.8.0](https://aframe.io/docs/1.8.0/)
- WebXR e APIs de entrada do navegador
- GitHub Pages

## Publicação

O GitHub Actions publica automaticamente as alterações na branch `main`. A configuração do repositório deve usar **Settings → Pages → Build and deployment → GitHub Actions** como origem de publicação.

## Próximas evoluções

- Integrar panoramas 360° licenciados específicos de cada bioma.
- Substituir modelos demonstrativos por modelos 3D otimizados e com atribuição de licença.
- Aprimorar colisões, trilhas e pontos de deslocamento.
- Ampliar acessibilidade, narração e recursos de apoio à aprendizagem.

## Licenças e atribuições

As imagens, panoramas, modelos 3D, bibliotecas e demais recursos de terceiros devem manter suas licenças e atribuições próprias. O conteúdo e os modelos originais deste protótipo podem ser adaptados para fins educativos, preservadas as atribuições de recursos externos.
