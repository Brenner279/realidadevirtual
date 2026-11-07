const BIOMES = {
 amazonia:{name:"Amazônia",icon:"🌳",region:"Norte",landscape:"Floresta tropical",desc:"A maior floresta tropical do mundo, marcada por rios extensos, árvores altas e enorme diversidade de vida.",short:"Floresta viva e extraordinária.",color:0x29986b,sky:0x9bd7e8,ground:0x286b3e,kind:"forest"},
 caatinga:{name:"Caatinga",icon:"🌵",region:"Nordeste",landscape:"Vegetação adaptada à seca",desc:"Bioma exclusivamente brasileiro, com clima semiárido e plantas adaptadas a longos períodos de estiagem.",short:"Resiliência em terra seca.",color:0xe8bd50,sky:0xf6d69b,ground:0xb78a4d,kind:"desert"},
 cerrado:{name:"Cerrado",icon:"🌾",region:"Centro-Oeste, Sudeste e Nordeste",landscape:"Savana brasileira",desc:"Savana rica em biodiversidade, com árvores de troncos retorcidos, gramíneas e nascentes importantes.",short:"O berço das águas.",color:0xc58b3e,sky:0x9bc9e5,ground:0x9b7542,kind:"savanna"},
 mata:{name:"Mata Atlântica",icon:"🌿",region:"Litoral brasileiro",landscape:"Florestas tropicais e subtropicais",desc:"Florestas que acompanham grande parte do litoral, com alta biodiversidade e diferentes formações vegetais.",short:"Vida em cada detalhe.",color:0x147a4e,sky:0xa6d8e8,ground:0x1d6543,kind:"forest"},
 pantanal:{name:"Pantanal",icon:"🦜",region:"Centro-Oeste",landscape:"Planície alagável",desc:"Uma das maiores planícies alagáveis do planeta, com ciclos de cheias e secas que transformam a paisagem.",short:"Um paraíso de biodiversidade.",color:0x55a9b3,sky:0xa8dce8,ground:0x477c58,kind:"wetland"},
 pampa:{name:"Pampa",icon:"🌱",region:"Sul",landscape:"Campos naturais",desc:"Campos sulinos de relevo suave, vegetação predominantemente campestre e grande diversidade de gramíneas.",short:"Campos que encantam.",color:0x8ba85d,sky:0xb4d9ed,ground:0x71934b,kind:"grass"}
};
let selected="amazonia", renderer, scene, camera, controls, animationId, drag=false, lastX=0,lastY=0, rotX=-.25,rotY=.45;
const $=id=>document.getElementById(id);
$("year").textContent=new Date().getFullYear();

function chooseBiome(key){
 if(!BIOMES[key]) return; selected=key; const b=BIOMES[key];
 $("selectedIcon").textContent=b.icon;$("selectedName").textContent=b.name;$("selectedDesc").textContent=b.desc;
 $("selectedRegion").textContent=b.region;$("selectedLandscape").textContent=b.landscape;
 document.querySelectorAll(".region").forEach(el=>el.classList.toggle("chosen",el.dataset.biome===key));
 document.querySelectorAll(".biome-card").forEach(el=>el.classList.toggle("chosen",el.dataset.biome===key));
}
document.querySelectorAll(".region").forEach(el=>{
 el.addEventListener("click",()=>chooseBiome(el.dataset.biome));
 el.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();chooseBiome(el.dataset.biome)}});
});
const grid=$("biomeGrid");
Object.entries(BIOMES).forEach(([key,b])=>{
 const card=document.createElement("article");card.className="biome-card";card.dataset.biome=key;
 card.innerHTML=`<div class="biome-thumb" style="background:linear-gradient(135deg,${"#"+b.color.toString(16).padStart(6,"0")},#123d2d)"><span class="emoji">${b.icon}</span><h3>${b.name}</h3></div><div class="biome-body"><p>${b.short}</p><button class="text-btn" type="button">Explorar bioma →</button></div>`;
 card.querySelector("button").addEventListener("click",()=>{chooseBiome(key);openScene()});card.addEventListener("click",e=>{if(e.target.tagName!=="BUTTON")chooseBiome(key)});
 grid.appendChild(card);
});
$("enterBiome").addEventListener("click",openScene);
$("menuToggle").addEventListener("click",()=>{const nav=document.querySelector(".nav");nav.classList.toggle("open");$("menuToggle").setAttribute("aria-expanded",nav.classList.contains("open"))});
document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".nav").classList.remove("open")));
$("closeModal").addEventListener("click",closeScene);
$("sceneModal").addEventListener("click",e=>{if(e.target===$("sceneModal"))closeScene()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeScene()});
chooseBiome("amazonia");

function openScene(){
 const b=BIOMES[selected];$("sceneTitle").textContent=b.name;$("sceneText").textContent=b.desc+" Observe o relevo e os elementos da paisagem."; 
 $("sceneModal").classList.add("open");$("sceneModal").setAttribute("aria-hidden","false");document.body.style.overflow="hidden";
 setTimeout(()=>{if(!renderer)initThree();buildBiomeScene(b);$("sceneOverlay").textContent="Arraste para observar a paisagem • Role para aproximar"},80);
}
function closeScene(){ $("sceneModal").classList.remove("open");$("sceneModal").setAttribute("aria-hidden","true");document.body.style.overflow="";if(animationId)cancelAnimationFrame(animationId); }
function initThree(){
 const canvas=$("sceneCanvas");renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.outputColorSpace=THREE.SRGBColorSpace;
 scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(48,1,.1,200);camera.position.set(0,5,13);
 scene.add(new THREE.HemisphereLight(0xffffff,0x526b45,2));const sun=new THREE.DirectionalLight(0xffffff,2.3);sun.position.set(-5,10,7);scene.add(sun);
 const resize=()=>{const w=canvas.clientWidth,h=canvas.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()};new ResizeObserver(resize).observe(canvas);resize();
 canvas.addEventListener("pointerdown",e=>{drag=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId)});
 canvas.addEventListener("pointermove",e=>{if(!drag)return;rotY+=(e.clientX-lastX)*.008;rotX+=(e.clientY-lastY)*.006;rotX=Math.max(-.9,Math.min(.3,rotX));lastX=e.clientX;lastY=e.clientY});
 canvas.addEventListener("pointerup",()=>drag=false);canvas.addEventListener("pointercancel",()=>drag=false);
 canvas.addEventListener("wheel",e=>{camera.position.z=Math.max(7,Math.min(22,camera.position.z+e.deltaY*.012))},{passive:true});
}
function clearScene(){while(scene.children.length>2){const o=scene.children.pop();o.traverse?.(n=>{n.geometry?.dispose();if(n.material){if(Array.isArray(n.material))n.material.forEach(m=>m.dispose());else n.material.dispose()}})}}
function mat(color,rough=.9){return new THREE.MeshStandardMaterial({color,roughness:rough})}
function addTree(x,z,scale=1,palm=false){
 const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.12*scale,.2*scale,1.7*scale,7),mat(0x755034));trunk.position.set(x,.85*scale,z);scene.add(trunk);
 const crown=new THREE.Group();crown.position.set(x,1.65*scale,z);scene.add(crown);
 for(let i=0;i<(palm?7:5);i++){const leaf=new THREE.Mesh(new THREE.ConeGeometry(.34*scale,1.35*scale,5),mat(palm?0x32884a:0x27733e));leaf.position.y=.45*scale;leaf.rotation.z=Math.PI/2;leaf.rotation.y=i*Math.PI*2/(palm?7:5);crown.add(leaf)}
 if(!palm){const blob=new THREE.Mesh(new THREE.SphereGeometry(.85*scale,8,6),mat(0x28713e));blob.position.y=.55*scale;crown.add(blob)}
}
function buildBiomeScene(b){
 clearScene();scene.background=new THREE.Color(b.sky);scene.fog=new THREE.Fog(b.sky,18,48);
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(80,80,40,40),mat(b.ground));ground.rotation.x=-Math.PI/2;ground.position.y=-.08;scene.add(ground);
 // Gently varied terrain
 const terrain=ground.geometry;const pos=terrain.attributes.position;for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i);pos.setZ(i,Math.sin(x*.22)*.12+Math.cos(y*.2)*.1)}terrain.computeVertexNormals();
 if(b.kind==="wetland"){
   const water=new THREE.Mesh(new THREE.PlaneGeometry(60,24),new THREE.MeshStandardMaterial({color:0x4eabbc,roughness:.25,transparent:true,opacity:.82}));water.rotation.x=-Math.PI/2;water.position.set(0,.035,-2);scene.add(water);
   for(let i=0;i<18;i++){const x=(Math.random()-.5)*23,z=(Math.random()-.5)*13;const pad=new THREE.Mesh(new THREE.CircleGeometry(.35+Math.random()*.3,12),mat(0x4e9b50));pad.rotation.x=-Math.PI/2;pad.position.set(x,.08,z);scene.add(pad)}
 }
 if(b.kind==="desert"){
   for(let i=0;i<20;i++){const cactus=new THREE.Group();const stem=new THREE.Mesh(new THREE.CylinderGeometry(.17,.2,2.2,7),mat(0x3c8b4c));stem.position.y=1.1;cactus.add(stem);for(let s of [-1,1]){const arm=new THREE.Mesh(new THREE.CylinderGeometry(.1,.12,.85,7),mat(0x3c8b4c));arm.position.set(s*.28,1.15,0);arm.rotation.z=s*.5;cactus.add(arm)}cactus.position.set((Math.random()-.5)*26,0,(Math.random()-.5)*18);cactus.scale.setScalar(.55+Math.random()*.6);scene.add(cactus)}
   for(let i=0;i<8;i++){const rock=new THREE.Mesh(new THREE.DodecahedronGeometry(.5+Math.random()*.6),mat(0x927047));rock.position.set((Math.random()-.5)*25,.3,(Math.random()-.5)*18);scene.add(rock)}
 }else if(b.kind==="grass"||b.kind==="savanna"){
   for(let i=0;i<22;i++){const x=(Math.random()-.5)*26,z=(Math.random()-.5)*18;addTree(x,z,.45+Math.random()*.55,b.kind==="savanna")}
   for(let i=0;i<80;i++){const blade=new THREE.Mesh(new THREE.ConeGeometry(.035,.45,3),mat(0x9ebd57));blade.position.set((Math.random()-.5)*28,.2,(Math.random()-.5)*20);scene.add(blade)}
 }else{
   for(let i=0;i<38;i++){const x=(Math.random()-.5)*28,z=(Math.random()-.5)*20;addTree(x,z,.6+Math.random()*.85,b.kind==="forest"&&i%5===0)}
 }
 // distant hills
 for(let i=0;i<7;i++){const hill=new THREE.Mesh(new THREE.SphereGeometry(3.5,12,8),mat(b.kind==="desert"?0xc79b60:0x3c7950));hill.scale.set(1.7,.45,.7);hill.position.set((i-3)*7,1.1,-15-Math.random()*3);scene.add(hill)}
 // simple sun
 const sun=new THREE.Mesh(new THREE.SphereGeometry(.8,16,12),new THREE.MeshBasicMaterial({color:0xffe7a0}));sun.position.set(-7,9,-17);scene.add(sun);
 rotX=-.25;rotY=.45;camera.position.set(0,5,13);
 if(animationId)cancelAnimationFrame(animationId);
 const animate=()=>{animationId=requestAnimationFrame(animate);scene.rotation.y+=(rotY-scene.rotation.y)*.06;scene.rotation.x+=(rotX-scene.rotation.x)*.06;renderer.render(scene,camera)};animate();
}
