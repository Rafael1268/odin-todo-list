(()=>{"use strict";document.querySelector("#newTaskBtn").addEventListener("click",(()=>function(){const a=document.querySelector("#newTaskTxt"),n=document.querySelector("#newTaskDate"),c=document.querySelector("#newTaskPriority"),s=document.querySelector("#newTaskProject"),o=(r=a.value,d=n.value,l=c.value,i=s.value,{getTask:()=>r,getDate:()=>d,getPriority:()=>l,getProject:()=>i});var r,d,l,i;e.push(o),t()}()));let e=[];function t(){const t=document.querySelector("#taskDisplay");t.innerHTML="";let a=0;e.forEach((e=>{const n=document.createElement("div");n.className="taskItem",n.id=a;const c=document.createElement("div");c.className="taskItemL",n.appendChild(c);const s=document.createElement("div");s.className="taskItemR",n.appendChild(s);const o=document.createElement("button");switch(o.classList.add("taskDoneBtn"),console.log(e.getPriority()),e.getPriority()){case"1":o.classList.add("prior1");break;case"2":o.classList.add("prior2");break;case"3":o.classList.add("prior3")}c.appendChild(o);const r=document.createElement("p");r.innerText=e.getTask(),c.appendChild(r);const d=document.createElement("h6");d.innerText=e.getDate(),s.appendChild(d);const l=document.createElement("button");l.className="deleteBtn",l.innerHTML='<i class="fa-solid fa-trash"></i>',s.appendChild(l),t.appendChild(n),a++}))}t()})();