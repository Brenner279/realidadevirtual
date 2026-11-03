(() => {
const scene=document.querySelector('#museum-scene'),museum=document.querySelector('#museum'),intro=document.querySelector('#intro');
const titleNode=document.querySelector('#caption-title'),descriptionNode=document.querySelector('#caption-description'),hintNode=document.querySelector('#hud-hint');
const artworks=[
{id:1,title:'Movimento das Cores',artist:'Acervo demonstrativo',year:'2026',description:'Uma composição abstrata sobre ritmo, cor e transformação. Este espaço receberá o vídeo animado da primeira obra.',wall:'left',z:3,color:'#b96b4d',accent:'#e9c17d'},
{id:2,title:'Entre Formas e Luz',artist:'Acervo demonstrativo',year:'2026',description:'Formas geométricas e contrastes luminosos criam uma experiência visual em constante mudança.',wall:'left',z:-1,color:'#416b78',accent:'#e0b66e'},
{id:3,title:'Paisagem em Trânsito',artist:'Acervo demonstrativo',year:'2026',description:'Uma paisagem imaginária que convida a observar as relações entre natureza e movimento.',wall:'left',z:-5,color:'#71805c',accent:'#d9c58e'},
{id:4,title:'Memórias em Camadas',artist:'Acervo demonstrativo',year:'2026',description:'Texturas e camadas visuais representam lembranças, registros e diferentes perspectivas do tempo.',wall:'right',z:1,color:'#725c83',accent:'#e3b77e'},
{id:5,title:'Horizonte Imaginado',artist:'Acervo demonstrativo',year:'2026',description:'Uma obra sobre possibilidades, futuro e imaginação, com espaço para animações e efeitos visuais.',wall:'right',z:-4,color:'#9a704e',accent:'#d9d0a1'}];
function el(parent,tag,attrs){const node=document.createElement(tag);Object.entries(attrs||{}).forEach(([k,v])=>node.setAttribute(k,v));parent.appendChild(node);return node}
function box(parent,pos,w,h,d,color){return el(parent,'a-box',{position:pos,width:w,height:h,depth:d,color})}
function build(){
el(museum,'a-plane',{rotation:'-90 0 0',position:'0 0 0',width:16,height:18,color:'#8e8980',material:'roughness: .82'});
el(museum,'a-plane',{rotation:'90 0 0',position:'0 5.2 0',width:16,height:18,color:'#242833'});
el(museum,'a-plane',{position:'0 2.6 -9',width:16,height:5.2,color:'#ded9ce'});
el(museum,'a-plane',{position:'0 2.6 9',rotation:'0 180 0',width:16,height:5.2,color:'#d8d2c7'});
el(museum,'a-plane',{position:'-8 2.6 0',rotation:'0 90 0',width:18,height:5.2,color:'#d9d3c8'});
el(museum,'a-plane',{position:'8 2.6 0',rotation:'0 -90 0',width:18,height:5.2,color:'#d9d3c8'});
box(museum,'0 .12 0',15.8,.24,17.8,'#3a3632');
[-5,0,5].forEach(x=>{box(museum,x+' 5.08 -1',.08,.04,13,'#b99a61');el(museum,'a-light',{type:'spot',color:'#fff0d5',intensity:1.15,angle:42,penumbra:.55,position:x+' 4.8 0',rotation:'-90 0 0',distance:10})});
box(museum,'0 1.8 8.88',4.8,2.7,.12,'#20232d');
el(museum,'a-text',{value:'MUSEU VIRTUAL',align:'center',color:'#e3c58e',width:5,position:'0 2.25 8.7',rotation:'0 180 0'});
el(museum,'a-text',{value:'ARTE • MOVIMENTO • EXPERIÊNCIA',align:'center',color:'#d8d2c7',width:4,position:'0 1.83 8.7',rotation:'0 180 0'});
artworks.forEach(createArtwork)}
function createArtwork(a){
const left=a.wall==='left',group=el(museum,'a-entity',{position:(left?'-7.91':'7.91')+' 2.75 '+a.z,rotation:left?'0 90 0':'0 -90 0'});
box(group,'0 0 0',2.55,1.9,.18,'#30271d');box(group,'0 0 .105',2.4,1.75,.045,'#b38c51');box(group,'0 0 .14',2.28,1.63,.035,'#17191f');
el(group,'a-plane',{position:'0 0 .165',width:2.18,height:1.53,color:a.color,material:'shader: flat'});
el(group,'a-ring',{position:'-.48 .12 .18',radiusInner:.28,radiusOuter:.48,color:a.accent,material:'shader: flat'});
el(group,'a-circle',{position:'.42 -.2 .181',radius:.36,color:a.accent,material:'shader: flat'});
el(group,'a-box',{position:'.25 .32 .18',width:.42,height:.42,depth:.025,color:'#eee0bd',rotation:'0 0 22'});
const videoPlane=el(group,'a-video',{src:'#video-'+a.id,position:'0 0 .23',width:2.18,height:1.53,material:'shader: flat; transparent: true; opacity: 0'});
const trigger=el(group,'a-plane',{class:'art-trigger',position:'0 0 .27',width:2.18,height:1.53,material:'shader: flat; transparent: true; opacity: 0'});
const plaque=el(group,'a-entity',{position:'1.82 0 .04'});box(plaque,'0 0 0',1.15,1.38,.08,'#242832');
el(plaque,'a-text',{value:'0'+a.id+' / EXPOSIÇÃO',align:'left',color:'#d5b477',width:1,position:'-.46 .48 .06'});
el(plaque,'a-text',{value:a.title,align:'left',color:'#f2eee5',width:1,wrapCount:17,position:'-.46 .19 .06'});
el(plaque,'a-text',{value:a.artist+'\n'+a.year,align:'left',color:'#c9c4b9',width:1,position:'-.46 -.2 .06'});
el(plaque,'a-text',{value:a.description,align:'left',color:'#b9b5ad',width:1,wrapCount:22,position:'-.46 -.42 .06',height:.32});
const video=document.querySelector('#video-'+a.id);
trigger.addEventListener('mouseenter',async()=>{titleNode.textContent=a.title;descriptionNode.textContent=a.artist+' · '+a.year+'. '+a.description;hintNode.textContent='Obra 0'+a.id+' · mantenha o olhar para assistir';
if(video&&video.readyState>=2){try{await video.play();videoPlane.setAttribute('material','shader: flat; transparent: true; opacity: 1')}catch(e){console.info('Reprodução de vídeo aguardando interação.',e)}}else{hintNode.textContent='Obra 0'+a.id+' · vídeo aguardando upload'}});
trigger.addEventListener('mouseleave',()=>{if(video){video.pause();video.currentTime=0}videoPlane.setAttribute('material','shader: flat; transparent: true; opacity: 0');titleNode.textContent='Bem-vindo ao Museu Virtual';descriptionNode.textContent='Observe uma obra para conhecer sua descrição e iniciar a animação.';hintNode.textContent='Explore livremente · Observe uma obra para iniciar o vídeo'});
trigger.addEventListener('click',()=>{titleNode.textContent=a.title;descriptionNode.textContent=a.description});
}
document.querySelector('#enter-button').addEventListener('click',()=>{intro.style.display='none'});
document.querySelector('#help-button').addEventListener('click',()=>{document.querySelector('#help-panel').hidden=false});
document.querySelector('#close-help').addEventListener('click',()=>{document.querySelector('#help-panel').hidden=true});
scene.addEventListener('loaded',build);if(scene.hasLoaded)build();
})();