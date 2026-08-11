// Thunder MC site configuration.
// Replace these two values with your real server IP and Discord invite before publishing.
const CONFIG = {
  serverIP: "thunder.sryze.cc:6762",
  discordURL: "https://discord.gg/2KZFD6rBMk"
};

document.querySelectorAll("[data-discord]").forEach(el => {
  el.href = CONFIG.discordURL;
  el.target = "_blank";
  el.rel = "noopener noreferrer";
});

const toast = document.getElementById("toast");
function showToast(text){ if(!toast)return; toast.textContent=text; toast.classList.add("show"); clearTimeout(window.toastTimer); window.toastTimer=setTimeout(()=>toast.classList.remove("show"),2200); }

async function copyIP(){
  try{await navigator.clipboard.writeText(CONFIG.serverIP);showToast("Server IP copied!");}
  catch{showToast(CONFIG.serverIP);}
}
["copyIp","copyIp2","copyIpText","copyBedrockIp"].forEach(id=>{
  const el=document.getElementById(id);
  if(el)el.addEventListener("click",copyIP);
});

const navbar=document.getElementById("navbar");
window.addEventListener("scroll",()=>navbar&&navbar.classList.toggle("scrolled",scrollY>25));
const menuBtn=document.getElementById("menuBtn"), nav=document.getElementById("nav");
if(menuBtn&&nav){
  menuBtn.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuBtn.setAttribute("aria-expanded",open);});
  nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
}

const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");revealObserver.unobserve(entry.target);}}),{threshold:.1});
document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));

const particleBox=document.getElementById("particles");
if(particleBox)for(let i=0;i<30;i++){const p=document.createElement("span");p.className="particle";p.style.left=Math.random()*100+"%";p.style.animationDuration=12+Math.random()*18+"s";p.style.animationDelay=-Math.random()*20+"s";p.style.opacity=(.2+Math.random()*.7).toFixed(2);particleBox.appendChild(p);}
const year=document.getElementById("year");if(year)year.textContent=new Date().getFullYear();

/* Store */
let cart=[];
try{cart=JSON.parse(localStorage.getItem("thunderMCCart")||"[]");if(!Array.isArray(cart))cart=[];}catch{cart=[];}
function renderCart(){
  const box=document.getElementById("cartItems"), count=document.getElementById("cartCount"), totalEl=document.getElementById("cartTotal");
  if(!box)return;
  count.textContent=cart.length;
  if(!cart.length) box.innerHTML='<p class="empty-cart">Your cart is empty.</p>';
  else box.innerHTML=cart.map((item,i)=>`<div class="cart-item"><div><strong>${item.name}</strong><br><span>${item.priceLabel}</span></div><button class="remove-item" data-index="${i}">REMOVE</button></div>`).join("");
  const total=cart.reduce((sum,x)=>sum+x.price,0);
  totalEl.textContent="₹"+Math.round(total);
  box.querySelectorAll(".remove-item").forEach(b=>b.onclick=()=>{cart.splice(Number(b.dataset.index),1);saveCart();});
}
function saveCart(){localStorage.setItem("thunderMCCart",JSON.stringify(cart));renderCart();}
document.querySelectorAll(".add-cart").forEach(btn=>btn.addEventListener("click",()=>{
  const card=btn.closest(".product-card");
  const priceLabel = card.querySelector("strong").textContent.trim();
  const price = Number(priceLabel.replace(/[^0-9.]/g, ""));
  cart.push({name:card.dataset.name,price,priceLabel});
  saveCart();showToast("Added to cart!");
}));
document.querySelectorAll(".tab").forEach(tab=>tab.addEventListener("click",()=>{
  document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));tab.classList.add("active");
  const filter=tab.dataset.filter;
  document.querySelectorAll(".product-card").forEach(card=>card.classList.toggle("hidden",filter!=="all"&&card.dataset.category!==filter));
}));
const clear=document.getElementById("clearCart");if(clear)clear.onclick=()=>{cart=[];saveCart();showToast("Cart cleared");};
const order=document.getElementById("orderDiscord");
if(order)order.onclick=async()=>{
  if(!cart.length){showToast("Add an item first!");return;}
  const lines=cart.map((x,i)=>`${i+1}. ${x.name} — ${x.priceLabel}`).join("\n");
  const total="₹"+Math.round(cart.reduce((s,x)=>s+x.price,0));
  const message=`THUNDER MC STORE ORDER\n\n${lines}\n\nTOTAL: ${total}\n\nMinecraft IGN: [YOUR IGN]`;
  try{await navigator.clipboard.writeText(message);showToast("Order copied! Opening Discord...");}catch{showToast("Order copied as best as possible.");}
  setTimeout(()=>window.open(CONFIG.discordURL,"_blank","noopener,noreferrer"),450);
};
renderCart();
