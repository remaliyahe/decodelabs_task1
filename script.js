const ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function caesarEncrypt(text, shift){
  return text.split("").map(ch=>{
    const isUpper = ch >= 'A' && ch <= 'Z';
    const isLower = ch >= 'a' && ch <= 'z';
    if(!isUpper && !isLower) return ch;
    const base = isUpper ? 65 : 97;
    const code = ch.charCodeAt(0) - base;
    const shifted = ((code + shift) % 26 + 26) % 26;
    return String.fromCharCode(shifted + base);
  }).join("");
}
function caesarDecrypt(text, shift){ return caesarEncrypt(text, -shift); }

// ---- build the two letter rings ----
function buildRing(groupId, radius, shiftOffset, isInner){
  const g = document.getElementById(groupId);
  g.innerHTML = "";
  const cx = 150, cy = 150;
  for(let i=0;i<26;i++){
    const angle = (i/26)*2*Math.PI - Math.PI/2;
    const x = cx + radius*Math.cos(angle);
    const y = cy + radius*Math.sin(angle);
    const letterIndex = isInner ? (i+shiftOffset+26)%26 : i;
    const text = document.createElementNS("http://www.w3.org/2000/svg","text");
    text.setAttribute("x", x);
    text.setAttribute("y", y+3.5);
    text.setAttribute("text-anchor","middle");
    text.setAttribute("class", isInner ? "ring-label inner" : "ring-label");
    text.textContent = ALPHA[letterIndex];
    g.appendChild(text);
  }
}

function renderWheel(shift){
  buildRing("outerRing", 130, 0, false);
  buildRing("innerRotor", 100, shift, true);
  const rotor = document.getElementById("innerRotor");
  const deg = shift * (360/26);
  rotor.style.transform = `rotate(${deg}deg)`;
  rotor.style.transformOrigin = "150px 150px";
  document.getElementById("wheelShiftLabel").textContent = shift;
}

// ---- DOM wiring ----
const plainInput = document.getElementById("plainInput");
const shiftRange = document.getElementById("shiftRange");
const shiftValue = document.getElementById("shiftValue");
const encryptedOut = document.getElementById("encryptedOut");
const decryptedOut = document.getElementById("decryptedOut");
const verifyRow = document.getElementById("verifyRow");
const verifyText = document.getElementById("verifyText");
const cipherInput = document.getElementById("cipherInput");
const recoveredOut = document.getElementById("recoveredOut");

function update(){
  const shift = parseInt(shiftRange.value, 10);
  shiftValue.textContent = shift;
  renderWheel(shift);

  const plain = plainInput.value;
  const enc = caesarEncrypt(plain, shift);
  const dec = caesarDecrypt(enc, shift);

  encryptedOut.textContent = enc || "";
  encryptedOut.classList.toggle("empty", !enc);
  decryptedOut.textContent = dec || "";
  decryptedOut.classList.toggle("empty", !dec);

  const matches = dec === plain;
  verifyRow.classList.toggle("ok", matches);
  verifyText.textContent = matches ? "Matches original" : "Mismatch";

  const cipherVal = cipherInput.value;
  if(cipherVal){
    recoveredOut.textContent = caesarDecrypt(cipherVal, shift);
    recoveredOut.classList.remove("empty");
  } else {
    recoveredOut.textContent = "Nothing to decrypt yet";
    recoveredOut.classList.add("empty");
  }
}

[plainInput, shiftRange, cipherInput].forEach(el=>{
  el.addEventListener("input", update);
});

update();
