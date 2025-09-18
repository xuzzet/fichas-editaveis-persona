(function(){
  const $ = (q)=>document.querySelector(q);
  const $$ = (q)=>Array.from(document.querySelectorAll(q));

  // Tabs
  $$(".tab").forEach(btn=>btn.addEventListener("click",()=>{
    $$(".tab").forEach(b=>b.classList.remove("active")); btn.classList.add("active");
    $$(".view").forEach(v=>v.classList.remove("active")); $("#"+btn.dataset.view).classList.add("active");
  }));

  // Arcana selects
  const ARCANAS = ["", "0 - Louco","I - Mago","II - Sacerdotisa","III - Imperatriz","IV - Imperador","V - Hierofante","VI - Enamorados","VII - Carruagem","VIII - Força","IX - Eremita","X - Roda da Fortuna","XI - Justiça","XII - Enforcado","XIII - Morte","XIV - Temperança","XV - Diabo","XVI - Torre","XVII - Estrela","XVIII - Lua","XIX - Sol","XX - Julgamento","XXI - Mundo"];
  const arcSel1 = document.getElementById("CharArcana");
  const arcSel2 = document.getElementById("PerArcana");
  [arcSel1, arcSel2].forEach(sel=> ARCANAS.forEach(a=>{ const o=document.createElement("option"); o.value=a; o.textContent=a; sel.appendChild(o);}));

  // IDs principais
  const ids = {
    CharName: $("#CharName"), CharPlayer: $("#CharPlayer"), CharAlias: $("#CharAlias"),
    CharClass: $("#CharClass"), CharArcana: $("#CharArcana"), CharLvl: $("#CharLvl"),
    CharSTR: $("#CharSTR"), CharMAG: $("#CharMAG"), CharTEC: $("#CharTEC"),
    CharAGI: $("#CharAGI"), CharVIT: $("#CharVIT"), CharLCK: $("#CharLCK"),
    KNOPts: $("#KNOPts"), DISPts: $("#DISPts"), EMPpts: $("#EMPpts"), CHAPts: $("#CHAPts"), EXPPts: $("#EXPPts"), COUPts: $("#COUPts"),
    MaxHP: $("#MaxHP"), EnergyMax: $("#EnergyMax"), DmgRed: $("#DmgRed"), Init: $("#Init"),
    PerName: $("#PerName"), PerArcana: $("#PerArcana"), PerLvl: $("#PerLvl"), PerNotes: $("#PerNotes"),
    NotesDiary: $("#NotesDiary"), NotesGoals: $("#NotesGoals")
  };

  // Afinidades Persona
  const ELEMENTS = ["Físico","Fogo","Gelo","Vento","Raio","Nuclear","PSY","Luz","Trevas"];
  const EL_IDS = {"Físico":"Fisico","Fogo":"Fogo","Gelo":"Gelo","Vento":"Vento","Raio":"Raio","Nuclear":"Nuclear","PSY":"PSY","Luz":"Luz","Trevas":"Trevas"};
  const RELS = ["Normal","Fraco","Resiste","Anula","Reflete","Absorve"];
  const afBody = document.getElementById('af-body');
  function buildAffinityTable(){
    afBody.innerHTML = '';
    for(let i=0;i<ELEMENTS.length;i+=2){
      const left = ELEMENTS[i]; const right = ELEMENTS[i+1];
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${left}</td>
        <td><select id="AF_${EL_IDS[left]}"></select></td>
        ${ right ? `<td>${right}</td><td><select id="AF_${EL_IDS[right]}"></select></td>` : `<td></td><td></td>` }
      `;
      afBody.appendChild(tr);
    }
    const sels = Array.from(document.querySelectorAll("[id^='AF_']"));
    RELS.forEach(r=> sels.forEach(sel=>{ const o=document.createElement('option'); o.value=r; o.textContent=r; sel.appendChild(o); }));
  }
  buildAffinityTable();

  function clampInt(n,min,max){ n=Math.trunc(+n||0); return Math.min(max,Math.max(min,n)); }

  function recalc(){
    const lvl = clampInt(ids.CharLvl.value,1,99);
    const vit = clampInt(ids.CharVIT.value,1,5);
    const agi = clampInt(ids.CharAGI.value,1,5);
    ids.MaxHP.textContent = 25 + ((5 + vit) * lvl);
    ids.EnergyMax.textContent = vit + Math.floor(lvl/2);
    ids.Init.value = agi;
    ["STR","MAG","TEC","AGI","VIT","LCK"].forEach(k=>{
      const el = document.getElementById("b"+k);
      if(el) el.textContent = ids["Char"+k].value;
    });
  }
  [ids.CharLvl, ids.CharVIT, ids.CharAGI, ids.CharSTR, ids.CharMAG, ids.CharTEC, ids.CharLCK].forEach(el=> el.addEventListener("input", recalc));
  recalc();

  // ====== Equipamentos ======
  const eqBody = $("#tbl-eq tbody");
  $("#add-eq").addEventListener("click", ()=> addEq());
  function addEq(data={tipo:"Item", nome:"", efeito:""}){
    const tr = document.createElement("tr");
    tr.innerHTML = `<td><select class="eq-tipo"><option>Arma</option><option>Armadura</option><option>Acessório</option><option>Item</option></select></td>
                    <td><input class="eq-nome" placeholder="Nome"/></td>
                    <td><input class="eq-ef" placeholder="Efeito/Notas"/></td>
                    <td class="row-actions"><button class="mini del">Remover</button></td>`;
    eqBody.appendChild(tr);
    const [tipo,nome,ef] = [tr.querySelector('.eq-tipo'), tr.querySelector('.eq-nome'), tr.querySelector('.eq-ef')];
    tipo.value = data.tipo||"Item"; nome.value = data.nome||""; ef.value = data.efeito||"";
    tr.querySelector('.del').addEventListener('click', ()=> tr.remove());
  }
  function getEquip(){ return Array.from(eqBody.querySelectorAll('tr')).map(tr=>({ tipo: tr.querySelector('.eq-tipo').value, nome: tr.querySelector('.eq-nome').value, efeito: tr.querySelector('.eq-ef').value })); }

  // ====== Magias ======
  const spellBody = $("#tbl-spell tbody");
  $("#add-spell").addEventListener("click", ()=> addSpell());
  const TIPOS = ["Físico","Fogo","Gelo","Vento","Raio","Nuclear","PSY","Luz","Trevas","Suporte","Controle"];
  function addSpell(data={nome:"", tipo:"Físico", custo:"", efeito:""}){
    const tr = document.createElement("tr");
    tr.innerHTML = `<td><input class="sp-n" placeholder="Nome"/></td>
                    <td><select class="sp-t"></select></td>
                    <td><input class="sp-c" placeholder="Ex.: 8 SP"/></td>
                    <td><input class="sp-e" placeholder="Descrição do efeito"/></td>
                    <td class="row-actions"><button class="mini del">Remover</button></td>`;
    spellBody.appendChild(tr);
    const tsel = tr.querySelector('.sp-t'); TIPOS.forEach(t=>{ const o=document.createElement('option'); o.textContent=t; tsel.appendChild(o); });
    tr.querySelector('.sp-n').value = data.nome||""; tsel.value = data.tipo||"Físico"; tr.querySelector('.sp-c').value = data.custo||""; tr.querySelector('.sp-e').value = data.efeito||"";
    tr.querySelector('.del').addEventListener('click', ()=> tr.remove());
  }
  function getSpells(){ return Array.from(spellBody.querySelectorAll('tr')).map(tr=>({ nome: tr.querySelector('.sp-n').value, tipo: tr.querySelector('.sp-t').value, custo: tr.querySelector('.sp-c').value, efeito: tr.querySelector('.sp-e').value })); }

  // ====== Vínculos ======
  const linkBody = $("#tbl-link tbody");
  $("#add-link").addEventListener("click", ()=> addLink());
  function addLink(data={nome:"", arcana:"", rank:1, obs:""}){
    const tr = document.createElement("tr");
    tr.innerHTML = `<td><input class="lk-n" placeholder="Nome do NPC"/></td>
                    <td><select class="lk-a"></select></td>
                    <td><input class="lk-r" type="number" min="1" max="10" value="1"/></td>
                    <td><input class="lk-o" placeholder="Observações"/></td>
                    <td class="row-actions"><button class="mini del">Remover</button></td>`;
    linkBody.appendChild(tr);
    const asel = tr.querySelector('.lk-a'); ARCANAS.forEach(a=>{ const o=document.createElement('option'); o.textContent=a; o.value=a; asel.appendChild(o); });
    tr.querySelector('.lk-n').value = data.nome||""; asel.value = data.arcana||""; tr.querySelector('.lk-r').value = data.rank||1; tr.querySelector('.lk-o').value = data.obs||"";
    tr.querySelector('.del').addEventListener('click', ()=> tr.remove());
  }
  function getLinks(){ return Array.from(linkBody.querySelectorAll('tr')).map(tr=>({ nome: tr.querySelector('.lk-n').value, arcana: tr.querySelector('.lk-a').value, rank: clampInt(tr.querySelector('.lk-r').value,1,10), obs: tr.querySelector('.lk-o').value })); }

  // ====== PISTAS ======
  const clueBody = $("#tbl-clue tbody");
  $("#add-clue").addEventListener("click", ()=> addClue());
  function addClue(data={titulo:"", desc:"", evid:"", status:"Aberta"}){
    const tr = document.createElement('tr');
    tr.innerHTML = `<td><input class="cl-t" placeholder="Título"/></td>
                    <td><input class="cl-d" placeholder="Descrição / Ancoragem"/></td>
                    <td><input class="cl-e" placeholder="Evidência (onde/quem/como)"/></td>
                    <td><select class="cl-s"><option>Aberta</option><option>Em andamento</option><option>Resolvida</option></select></td>
                    <td class="row-actions"><button class="mini del">Remover</button></td>`;
    clueBody.appendChild(tr);
    tr.querySelector('.cl-t').value = data.titulo||"";
    tr.querySelector('.cl-d').value = data.desc||"";
    tr.querySelector('.cl-e').value = data.evid||"";
    tr.querySelector('.cl-s').value = data.status||"Aberta";
    tr.querySelector('.del').addEventListener('click', ()=> tr.remove());
  }
  function getClues(){ return Array.from(clueBody.querySelectorAll('tr')).map(tr=>({ titulo: tr.querySelector('.cl-t').value, desc: tr.querySelector('.cl-d').value, evid: tr.querySelector('.cl-e').value, status: tr.querySelector('.cl-s').value })); }

  // ====== CONTATOS ======
  const cttBody = $("#tbl-ctt tbody");
  $("#add-ctt").addEventListener("click", ()=> addCtt());
  function addCtt(data={nome:"", tipo:"NPC", obs:""}){
    const tr = document.createElement('tr');
    tr.innerHTML = `<td><input class="ct-n" placeholder="Nome"/></td>
                    <td><select class="ct-t"><option>NPC</option><option>Local</option><option>Clube</option><option>Comércio</option></select></td>
                    <td><input class="ct-o" placeholder="Observações / pistas / horários"/></td>
                    <td class="row-actions"><button class="mini del">Remover</button></td>`;
    cttBody.appendChild(tr);
    tr.querySelector('.ct-n').value = data.nome||"";
    tr.querySelector('.ct-t').value = data.tipo||"NPC";
    tr.querySelector('.ct-o').value = data.obs||"";
    tr.querySelector('.del').addEventListener('click', ()=> tr.remove());
  }
  function getCtts(){ return Array.from(cttBody.querySelectorAll('tr')).map(tr=>({ nome: tr.querySelector('.ct-n').value, tipo: tr.querySelector('.ct-t').value, obs: tr.querySelector('.ct-o').value })); }

  // ====== Persistência ======
  function snapshot(){
    const affin = {}; ELEMENTS.forEach(e=>{ const id = 'AF_'+EL_IDS[e]; const sel = document.getElementById(id); affin[e] = sel? sel.value : 'Normal'; });
    return {
      id:"ficha-yby-p3r-skin",
      geral:{
        CharName: ids.CharName.value, CharPlayer: ids.CharPlayer.value, CharAlias: ids.CharAlias.value,
        CharClass: ids.CharClass.value, CharArcana: ids.CharArcana.value, CharLvl: ids.CharLvl.value,
        CharSTR: ids.CharSTR.value, CharMAG: ids.CharMAG.value, CharTEC: ids.CharTEC.value, CharAGI: ids.CharAGI.value, CharVIT: ids.CharVIT.value, CharLCK: ids.CharLCK.value,
        KNOPts: ids.KNOPts.value, DISPts: ids.DISPts.value, EMPpts: ids.EMPpts.value, CHAPts: ids.CHAPts.value, EXPPts: ids.EXPPts.value, COUPts: ids.COUPts.value,
        DmgRed: ids.DmgRed.value,
        MaxHP: ids.MaxHP.textContent, EnergyMax: ids.EnergyMax.textContent, Init: ids.Init.value
      },
      persona:{ PerName: ids.PerName.value, PerArcana: ids.PerArcana.value, PerLvl: ids.PerLvl.value, PerNotes: ids.PerNotes.value, affin },
      equip: getEquip(), spells: getSpells(), links: getLinks(),
      notes: { diary: ids.NotesDiary.value, goals: ids.NotesGoals.value, clues: getClues(), contacts: getCtts() }
    };
  }
  function applySnapshot(data){
    if(!data) return;
    const g = data.geral||{}; Object.keys(g).forEach(k=>{ if(ids[k]){ if(ids[k].tagName==="DIV") ids[k].textContent=g[k]; else ids[k].value=g[k]; } });
    const p = data.persona||{}; ids.PerName.value=p.PerName||""; ids.PerArcana.value=p.PerArcana||""; ids.PerLvl.value=p.PerLvl||1; ids.PerNotes.value=p.PerNotes||"";
    if(p.affin){ Object.entries(p.affin).forEach(([el,val])=>{ const sel=document.getElementById('AF_'+EL_IDS[el]); if(sel) sel.value=val; }); }
    recalc();
    linkBody.innerHTML = ""; (data.links||[]).forEach(addLink);
    spellBody.innerHTML = ""; (data.spells||[]).forEach(addSpell);
    eqBody.innerHTML = ""; (data.equip||[]).forEach(addEq);
    ids.NotesDiary.value = data.notes?.diary || "";
    ids.NotesGoals.value = data.notes?.goals || "";
    clueBody.innerHTML = ""; (data.notes?.clues||[]).forEach(addClue);
    cttBody.innerHTML = ""; (data.notes?.contacts||[]).forEach(addCtt);
  }

  document.getElementById("save").addEventListener("click", ()=>{ localStorage.setItem("ficha-yby-p3r-skin", JSON.stringify(snapshot())); alert("Ficha salva."); });
  document.getElementById("load").addEventListener("click", ()=>{ const raw=localStorage.getItem("ficha-yby-p3r-skin"); if(!raw) return alert("Nada salvo."); try{ applySnapshot(JSON.parse(raw)); alert("Ficha carregada."); }catch(e){ alert("Falha ao carregar."); } });
  document.getElementById("export").addEventListener("click", ()=>{ const blob = new Blob([JSON.stringify(snapshot(),null,2)], {type:"application/json"}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=((ids.CharName.value||'ficha')+".json"); a.click(); URL.revokeObjectURL(a.href); });
  document.getElementById("import").addEventListener("click", ()=>{ const i=document.createElement('input'); i.type='file'; i.accept='application/json'; i.onchange=()=>{ const f=i.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ try{ applySnapshot(JSON.parse(r.result)); alert('Importado.'); }catch(e){ alert('Falha ao importar.'); } }; r.readAsText(f); }; i.click(); });

  // ====== PDF ======
  document.getElementById("fill").addEventListener("click", ()=> document.getElementById("pdfFile").click());
  document.getElementById("pdfFile").addEventListener("change", async (ev)=>{
    const file = ev.target.files[0]; if(!file) return;
    const ab = await file.arrayBuffer(); const pdfDoc = await PDFLib.PDFDocument.load(ab); const form = pdfDoc.getForm();
    function setTxt(name, val){ try{ const field=form.getField(name); if(field.setText) field.setText(String(val??"")); else if(field.select) field.select(String(val??"")); }catch(e){} }
    const s = snapshot(); const g=s.geral; const p=s.persona; const n=s.notes;
    const map = {
      CharName:g.CharName, CharPlayer:g.CharPlayer, CharAlias:g.CharAlias, CharClass:g.CharClass, CharLvl:g.CharLvl, CharArcana:g.CharArcana,
      CharSTR:g.CharSTR, CharMAG:g.CharMAG, CharTEC:g.CharTEC, CharAGI:g.CharAGI, CharVIT:g.CharVIT, CharLCK:g.CharLCK,
      MaxHP:g.MaxHP, EnergyMax:g.EnergyMax, DmgRed:g.DmgRed,
      KNOPts:g.KNOPts, DISPts:g.DISPts, EMPpts:g.EMPpts, CHAPts:g.CHAPts, EXPPts:g.EXPPts, COUPts:g.COUPts,
      PerName:p.PerName, PerArcana:p.PerArcana, PerLvl:p.PerLvl, PerNotes:p.PerNotes,
      EquipList: s.equip.map(e=>`[${e.tipo}] ${e.nome} — ${e.efeito}`).join("\n"),
      SpellList: s.spells.map(sp=>`${sp.nome} (${sp.tipo}, ${sp.custo}) — ${sp.efeito}`).join("\n"),
      LinksList: s.links.map(l=>`${l.nome} — ${l.arcana} Rk.${l.rank} ${l.obs?('— '+l.obs):''}`).join("\n"),
      NotesDiary: n.diary, NotesGoals: n.goals,
      NotesClues: (n.clues||[]).map(c=>`• ${c.titulo}: ${c.desc} [${c.evid}] (${c.status})`).join("\n"),
      NotesContacts: (n.contacts||[]).map(c=>`• ${c.nome} (${c.tipo}) — ${c.obs}`).join("\n")
    };
    const AF_MAP = {"Físico":"AF_Fisico","Fogo":"AF_Fogo","Gelo":"AF_Gelo","Vento":"AF_Vento","Raio":"AF_Raio","Nuclear":"AF_Nuclear","PSY":"AF_PSY","Luz":"AF_Luz","Trevas":"AF_Trevas"};
    Object.entries(AF_MAP).forEach(([k,campo])=> setTxt(campo, p.affin?.[k] || 'Normal'));
    Object.entries(map).forEach(([k,v])=> setTxt(k,v));

    const filled = await pdfDoc.save(); const blob = new Blob([filled], {type:"application/pdf"}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=(g.CharName||'ficha')+" - Preenchida.pdf"; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  });

  // ====== PNG ======
  document.getElementById("png").addEventListener("click", async ()=>{
    if(typeof html2canvas!=="function"){ alert("html2canvas bloqueado no preview. Teste local."); return; }
    const node = document.getElementById('captureRoot');
    const canvas = await html2canvas(node, {backgroundColor:null, scale:2, useCORS:true});
    canvas.toBlob((blob)=>{ const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=(ids.CharName.value||'ficha')+".png"; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000); });
  });

  // ====== PRINT ======
  document.getElementById('print').addEventListener('click', ()=> window.print());

  // ====== TESTES ======
  function runTests(){
    const out = document.getElementById('tests-out');
    const card = document.getElementById('tests-card');
    card.style.display = 'block';
    const logs = [];
    function ok(name, cond, expect, got){ logs.push(`${cond?'✅':'❌'} ${name}${cond?'':` — esperado ${expect}, obtido ${got}`}`); }

    const backup = snapshot();

    ids.CharLvl.value = 1; ids.CharVIT.value = 1; ids.CharAGI.value = 2; recalc();
    ok('PV lvl1/VIT1 = 31', Number(ids.MaxHP.textContent) === 31, 31, ids.MaxHP.textContent);
    ok('EN lvl1/VIT1 = 1', Number(ids.EnergyMax.textContent) === 1, 1, ids.EnergyMax.textContent);

    ids.CharLvl.value = 10; ids.CharVIT.value = 4; ids.CharAGI.value = 3; recalc();
    ok('PV lvl10/VIT4 = 115', Number(ids.MaxHP.textContent) === 115, 115, ids.MaxHP.textContent);
    ok('EN lvl10/VIT4 = 9', Number(ids.EnergyMax.textContent) === 9, 9, ids.EnergyMax.textContent);
    ok('Init = AGI', Number(ids.Init.value) === 3, 3, ids.Init.value);

    const afCount = document.querySelectorAll('[id^="AF_"]').length;
    ok('Afinidades — 9 selects', afCount === 9, 9, afCount);

    applySnapshot(backup);

    out.innerHTML = logs.map(l=>`<div>${l}</div>`).join('');
  }
  document.getElementById('tests').addEventListener('click', runTests);

  // Seed visual
  function seed(){
    document.getElementById('add-eq').click();
    document.getElementById('add-spell').click();
    document.getElementById('add-link').click();
    document.getElementById('add-clue').click();
    document.getElementById('add-ctt').click();
  }
  seed();
})();