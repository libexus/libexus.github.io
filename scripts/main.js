"use strict"
// (c) Thomas Prechelmacher, 2020

let data = {};
let dataFile = ""
let formData = {};
let i = 0;
let tries = 0;
let lastInput = "";
// init() is invoked at the end of the file

function init() {
  document.getElementById("submit").onclick = submit;
  document.getElementById("loadnouns").onclick = () => loadData("data/nouns.json");
  document.getElementById("loadverbs").onclick = () => loadData("data/verbs.json");
  document.getElementById("loadadjectives").onclick = () => loadData("data/adjectives.json");
  loadData("data/verbs.json");
}

function loadData(jsonfile) {
  let xhttp = new XMLHttpRequest();
  i = 0;
  xhttp.onreadystatechange = function() {
    if(this.readyState == 4 && this.status == 200) {
      data = JSON.parse(this.responseText);
      dataFile = jsonfile;
      buildCurrentForm(i);
      document.getElementById("submit").style.display = "inline";
    }
  }
  xhttp.open("GET", jsonfile, false); // Synchron -> warten
  xhttp.send();
}

function buildCurrentForm() {
  let derinput = document.getElementById("derinput");
  if (i<data.data.length) {
    tries = 0;
    switch (data.data[i].gr[0]) {
      case "n": formData = buildNoun(); break;
      case "v": formData = buildVerb(); break;
      case "j": formData = buildAdjective(); break;
      default:  console.error(`"${data.data[i].gr[0]}" ist keine gültige Wortart!`);
    }
    if(formData){
      let formHTML = "";
      for(let inputData of formData.form) {
        formHTML += `
          <label for="input_${inputData.id}">${inputData.name}</label>
          <input type=text id="input_${inputData.id}" onkeypress="checkKey(event)">`;
      }
      derinput.innerHTML = `
          <div id=word>${formData.header}</div><div class="inputgrid">${formHTML}</div>`;
      document.querySelector("div.inputgrid input[type=text]").focus();
    } else {
      i++;
      buildCurrentForm();
    }
  } else {
    derinput.innerHTML = `<p>Gratulation, du hast es geschafft!</p>`;
    document.getElementById("submit").style.display = "none";
  }
}

function checkCurrentForm() {
  let isCorrect = true;
  tries++;
  trimTextInputs();
  let lastResult = formData.header.toLowerCase();
  for (let inputData of formData.form) {
    let elem = document.getElementById(`input_${inputData.id}`);
    let currentResult = inputData.solution;
    currentResult.forEach((res, i, arr) => arr[i] = res.toLowerCase());
    let textInput = (("pre" in inputData) ? inputData.pre(elem.value) : elem.value).toLowerCase();
    let inputIndex = currentResult.indexOf((textInput == "..") ? lastResult : textInput);
    if (textInput &&  inputIndex != -1) {
      elem.classList.add("correct");
      elem.disabled = true;
      lastResult = currentResult[inputIndex]; // textInput may be "..", so it is necessary to use this
    } else {
      elem.classList.add("incorrect");
      lastResult = (textInput == "..") ? lastResult : textInput;
      isCorrect = false;
    }
    elem.value = lastResult; // Resolves ".." to real result
  }
  if (isCorrect) {
    if (tries == 1) {
      alert("Richtig");
    } else {
      alert(`Richtig (${tries} Versuche)`);
    }
  }
  return isCorrect;
}

function buildNoun() {
  let noun = data.data[i];
  let formData = {};
  if (noun.gr[2] in deklEndSet) {
    formData = {
      header: noun.sg1,
      form: [
        {id: "sg2", name: "2.F Sg.",
          solution: [noun.st + deklEndSet[noun.gr[2]][1]]},
        {id: "ge",  name: "Geschlecht",
          solution: [noun.gr[1]],
          pre: input => input.toLowerCase()},
        {id: "tr",  name: "Übersetzung",
          solution: noun.tr}
      ]
    };
  } else {
    alert(`Fehler beim Parsen von ${dataFile}: Das Wort "${noun.sg1}" bzw das Feld data.[${i}] enthält eine unbekannte Deklination "${noun.gr[2]}".`);
    formData = false;
  }
  return formData;
}

function buildVerb() {
  let verb = data.data[i];
  let formData = {};
  if(verb.gr[1] in konjEndSet) {
    formData = {
      header: verb.inf,
      form: [
        {id: "sg1", name: "1.P Sg", solution: [verb.st + konjEndSet[verb.gr[1]][0]]},
        {id: "p_sg1", name: "1.P Sg Perfekt", solution: [verb.p_st + perfEndSet[0]]},
        {id: "ppp_sg1_n", name: "1.P Sg PPP", solution: [verb.ppp_st + deklEndSet.o[3]]},
        {id: "tr", name: "Übersetzung", solution: verb.tr}
      ]
    }
  } else {
    alert (`Fehler beim Parsen von ${dataFile}: Das Wort "${verb.inf}" enthält eine unbekannte Konjugation "${verb.gr[1]}".`);
    formData = false;
  }
  return formData;
}

function buildAdjective() {
  let adj = data.data[i];
  let formData = {};
  if(adj.gr[1]+"m" in adjEndSet) {
    formData = {
      header: adj.sg1[0],
      form: []
    }
    if (adj.gr[1] == "a") {
      formData.form.push({id: "sg1_f", name: "1.Sg F", solution: [adj.st + adjEndSet[adj.gr[1]+"f"][0]]});
      formData.form.push({id: "sg1_n", name: "1.Sg N", solution: [adj.st + adjEndSet[adj.gr[1]+"n"][0]]});
    } else if (adj.gr[1] == "k") {
      if (adj.sg1.length === 1) {
        formData.form.push({id: "sg1_f", name: "1.Sg F", solution: [adj.sg1[0]]});
        formData.form.push({id: "sg1_n", name: "1.Sg N", solution: [adj.sg1[0]]});
      } else if (adj.sg1.length === 2) {
        formData.form.push({id: "sg1_f", name: "1.Sg F", solution: [adj.sg1[0]]});
        formData.form.push({id: "sg1_n", name: "1.Sg N", solution: [adj.sg1[1]]});
      } else if (adj.sg1.length === 3) {
        formData.form.push({id: "sg1_f", name: "1.Sg F", solution: [adj.sg1[1]]});
        formData.form.push({id: "sg1_n", name: "1.Sg N", solution: [adj.sg1[2]]});
      }
    }
    formData.form.push({id:"tr", name: "Übersetzung", solution: adj.tr});
  } else {
    alert (`Fehler beim Parsen von ${dataFile}: Das Wort "${adj.sg1[0]}" enthält eine unbekannte Deklination "${adj.gr[1]}".`);
    formData = false;
  }
  return formData;
}

function submit() {
  if(checkCurrentForm() === true) {
    lastInput = "";
    i++;
    buildCurrentForm();
  }
}

function checkKey(event) {
  if (event.keyCode == 13) { // Unicode für Enter
    submit();
  }
}

function trimTextInputs() {
  let inputs = document.querySelectorAll("div.inputgrid input");
  inputs.forEach(function (item, i) {
    item.value = item.value.trim();
  });
}

let deklEndSet = {
  a: ["a" , "ae"  , "ae"  , "am", "a" , "a",
      "ae", "arum", "is"  , "as", "ae", "is"],
  o: ["us", "i"   , "o"   , "um", "e" , "o",
      "i" , "orum", "is"  , "os", "i" , "is"],
  O: ["er", "i"   , "o"   , "um", "er", "o",
      "i" , "orum", "is"  , "os", "i" , "is"],
  k: [""  , "is"  , "i"   , "em", ""  , "e",
      "es", "um"  , "ibus", "es", "es", "ibus"],
  m: [""  , "is"  , "i"   , "em", ""  , "e",
      "es", "ium" , "ibus", "es", "es", "ibus"],
  i: [""  , "is"  , "i"   , "im", ""  , "e",
      "es", "ium" , "ibus", "es", "es", "ibus"],
  e: ["es", "ei"  , "ei"  , "em", "es", "e",
      "es", "erum", "ebus", "es", "es", "ebus"],
  u: ["us", "us"  , "ui"  , "um", "us", "u",
      "us", "uum" , "ibus", "us", "us", "ibus"]
};

let konjEndSet = {
  // Sg1, Sg2, Sg3, Pl1, Pl2, Pl3, ImpSg, ImpPl
  a: ["o", "as", "at", "amus", "atis", "ant", "a", "ate"],
  e: ["eo", "es", "et", "emus", "etis", "ent", "e", "ete"],
  k: ["o", "is", "it", "imus", "itis", "unt", "e", "ite"],
  i: ["io", "is", "it", "imus", "itis", "iunt", "i", "ite"],
  m: ["io", "is", "it", "imus", "itis", "iunt", "e", "ite"]
}

let perfEndSet = [
  "i", "isti", "it", "imus", "istis", "erunt"
]

let pqpEndSet = [
  "eram", "eras", "erant", "eramus", "eratis", "erant"
]

let adjEndSet = {
  am : deklEndSet.o,
  af : deklEndSet.a,
  an : ["um", "i"   , "o"   , "um", "um" , "o",
        "a" , "orum", "is"  , "a", "a" , "is"],
  km :["",  "is",  "i",    "em", "", "i",
      "es", "ium", "ibus", "es", "", "ibus"],
  kf : ["",  "is",  "i",    "em", "", "i",
      "es", "ium", "ibus", "es", "", "ibus"],
  kn :["",  "is",  "i",    "e",  "",   "i",
      "ia", "ium", "ibus", "ia", "ia", "ibus"]
}

init();
// EOF
