const textareaPolos = document.querySelector("#polos");
const tombolPreview = document.querySelector("#previewButton");
const resultFormatted = document.querySelector("#formatted");
const previewCheckbox = document.querySelector("#autoPreviewCheckbox");
const buttonTebal = document.querySelector("#buttonTebal");
const buttonMiring = document.querySelector("#buttonMiring");
const buttonMono = document.querySelector("#buttonMono");
const buttonCopyTelegram = document.querySelector("#buttonCopyTelegram");
// const buttonCopyWhatsapp = document.querySelector("#buttonCopyWhatsapp");
const hiddenOutput = document.querySelector("#hiddenOutput");
const btnShowEmoji = document.querySelector("#btnShowEmoji");
const emojiPicker = document.querySelector('emoji-picker');
const stickyNavButton = document.querySelector('#stickyNavButton');
const navToolbar = document.querySelector('#nav-toolbar');
const clearContent = document.querySelector("#clearContent");
const buttonDropdown = document.querySelector("#btnGroupDrop1");
const buttonSourceData = document.querySelector("#buttonSourceData");
const saveSourceData = document.querySelector("#saveSourceData");
const sourceDataContainer = document.querySelector("#source-data-container");
const sourceDataItemsContainer = document.querySelector("#source-data-items-container");
const addSourceData = document.querySelector("#addSourceData");
const buttonUseSourceData = document.querySelector("#buttonUseSourceData");
const btnHideSourceData = document.querySelector("#btnHideSourceData");
let btnCloseSourceDataItem = document.querySelectorAll(".btn-close");

let sourceData = {data : {}};
let sourceDataTemplate = [];
let literalReplaceList = [];
let title = [];
let body = [];

function insertTextAtCursor(el, text) {
    let val = el.value, endIndex, range;
    if (typeof el.selectionStart != "undefined" && typeof el.selectionEnd != "undefined") {
        endIndex = el.selectionEnd;
        el.value = val.slice(0, el.selectionStart) + text + val.slice(endIndex);
        el.selectionStart = el.selectionEnd = endIndex + text.length;
    } else if (typeof document.selection != "undefined" && typeof document.selection.createRange != "undefined") {
        el.focus();
        range = document.selection.createRange();
        range.collapse(false);
        range.text = text;
        range.select();
    }
}

function decodeEntities(encodedString) {
    let translate_re = /&(nbsp|amp|quot|lt|gt);/g;
    let translate = {
        "nbsp":" ",
        "amp" : "&",
        "quot": "\"",
        "lt"  : "<",
        "gt"  : ">"
    };
    return encodedString.replace(translate_re, function(match, entity) {
        return translate[entity];
    }).replace(/&#(\d+);/gi, function(match, numStr) {
        let num = parseInt(numStr, 10);
        return String.fromCharCode(num);
    });
}

function toggle(element, callbackFunctionShow = false, callbackFunctionHide = false){
    if (element.classList.contains("show")){
        element.classList.replace("show", "hide");
        if (callbackFunctionHide) { callbackFunctionHide(); }
    } else if (element.classList.contains("hide")){
        element.classList.replace("hide", "show");
        if (callbackFunctionShow) { callbackFunctionShow(); }
    } else {
        element.classList.add("show");
        if (callbackFunctionShow) { callbackFunctionShow(); }
    }
}


function checkEntrySourceData(param){
    let returnKosong = true;
    let returnIsiSemua = true;
    
    document.querySelectorAll(".itemTitle").forEach(function(element){
        if(element.value === ""){
            returnIsiSemua = false;
        }
        if(element.value !== ""){
            returnKosong = false;
        }
    });

    if(returnKosong || returnIsiSemua) {
        document.querySelectorAll(".itemBody").forEach(function(element){
            if(element.value === ""){
                returnIsiSemua = false;
            }
            if(element.value !== ""){
                returnKosong = false;
            }
        });
    }

    return param == 'kosong' ? returnKosong : returnIsiSemua;
}

function checkNewline(){
    let text = window.getSelection().toString();
    if (text.indexOf('\n') !== -1){ return true }
    return false
}

function getSelectionText(){
    if (textareaPolos.selectionStart == textareaPolos.selectionEnd) {
        return alert("Seleksi teks yang akan dikenai format ini.")
    }
    
    let selected = textareaPolos.value.slice(textareaPolos.selectionStart, textareaPolos.selectionEnd);
    return selected;
}

function updateEditor(selection, format){
    let selectionStart = textareaPolos.selectionStart;
    let selectionEnd = textareaPolos.selectionEnd;
    let startWord = textareaPolos.value.substr(0,selectionStart);
    let endWord = textareaPolos.value.substr(selectionEnd);

    let formatList = {
        bold : {
            openTag : "<b>",
            closeTag : "</b>"
        },
        italic : {
            openTag : "<i>",
            closeTag : "</i>"
        },
        mono : {
            openTag : "<code>",
            closeTag : "</code>"
        },
        monoNewLine : {
            openTag : "<span><code class='newline'>",
            closeTag : "</code></span>"
        },
    }
    let formatted = `${formatList[format].openTag}${selection.trim()}${formatList[format].closeTag}`;
    textareaPolos.focus();
    return startWord + formatted + endWord;
}

function updatePreview(){
    resultFormatted.innerHTML = textareaPolos.value.replaceAll("\n", "<br>");
    
    if(resultFormatted.querySelector("sourcedata")){
        literal = `${resultFormatted.querySelector("sourcedata").innerHTML}`

        konten = "";
        sourceDataTemplate.forEach(function(item, index){
            let x = literal;
            for(let i = 0; i < title.length; i++){
                x = x.replace(literalReplaceList[i], item[title[i]]);
            }
            konten += x;
        })

        resultFormatted.querySelector("sourcedata").innerHTML = konten;
    }
}

function copyToClipboard( type="telegram" ){
    let result = decodeEntities(resultFormatted.innerHTML
        .replaceAll("<b>", "**")
        .replaceAll("</b>", "**")
        .replaceAll("<i>", "__")
        .replaceAll("</i>", "__")
        .replaceAll('<span><code class="newline">', "```")
        .replaceAll("</code></span>", "```")
        .replaceAll("<code>", "`")
        .replaceAll("</code>", "`")
        .replaceAll("<br>", "\n"))
        .replaceAll("<sourcedata>", "")
        .replaceAll("</sourcedata>", "");
    if (type === "whatsapp") { 
        result = result
        .replaceAll("**", "*")
        .replaceAll("__", "_")
        .replaceAll("`", "```");
    }
    hiddenOutput.value = result;
    hiddenOutput.select();
    hiddenOutput.setSelectionRange(0, 99999);
    if (document.execCommand('copy')) {
        if(type === "telegram"){
            buttonCopyTelegram.innerText = "Ok sdh dicopy gan!";
        }else{
            buttonCopyWhatsapp.innerText = "Ok sdh dicopy gan!";
        }
    }
    setTimeout(function(){
        if(type === "telegram"){
            buttonCopyTelegram.innerText = "Copy[telegram]";
        } else {
            buttonCopyWhatsapp.innerText = "Copy[wa]";
        }
        
    },1500);
}

buttonDropdown.addEventListener('click', function(){
    toggle(buttonDropdown.nextElementSibling);
});

buttonUseSourceData.addEventListener('click', function(){
    if (Object.keys(sourceData.data).length === 0 || Object.keys(sourceData.data) === "" ) { 
        alert("Source data is empty");
    } else {
        let key = '';
        for( k in sourceData.data){
            key += ` \${${k}} `
        }
        let strTemplate = `<sourcedata>\n${key}\n</sourcedata>`;
        insertTextAtCursor(textareaPolos, strTemplate);
        textareaPolos.focus();
    }
    return toggle(buttonDropdown.nextElementSibling);
});

buttonSourceData.addEventListener("click", function(){
    toggle(sourceDataContainer, function(){
        toggle(buttonDropdown.nextElementSibling);
    });
});

addSourceData.addEventListener('click', function(){
    if (!checkEntrySourceData("kosong")) {
        return alert("Mohon kosongkan dulu semua isian pada source data.");
    }
    document.querySelector("#source-data-items-container").innerHTML += `
    <div class="col">
        <div class="card">
            <div class="card-header">
                <input onfocusout="entryKeyData(this)" tabindex="1" class="itemTitle form-control" placeholder="item title" type="text"> 
            </div>
            <div class="card-body">
                <textarea tabindex="2" class="form-control itemBody" cols="30" rows="10"></textarea>
            <button class="btn btn-danger btn-close" onclick="deleteElement(this)">delete</button>
            </div>
            
        </div>
    </div>
    `;
    btnCloseSourceDataItem = document.querySelectorAll(".btn-close");
});

saveSourceData.addEventListener('click', function(){
    if(!checkEntrySourceData("isiSemua")) {return alert("Please complete all entry for source Data")}
    sourceData = {data : {}};
    sourceDataTemplate = [];
    literalReplaceList = [];
    title = [];
    body = [];

    document.querySelectorAll(".itemTitle").forEach(function(element){
        title.push(element.value);
        literalReplaceList.push("${" + element.value + "}");
        sourceData.data[element.value] = {
            "body" : []
        };
    })

    document.querySelectorAll(".itemBody").forEach(function(element){
        body.push(element.value.trim().replace(/\n/g, "|").split("|"));
    })

    let o = 0;
    for (item in sourceData.data) {
        sourceData.data[item].body.push(body[o]);
        o++;
    }

    let dataCount = 0;
    let pembatas = body[0].length;
    console.log(pembatas);
    while(true){
        // if(sourceData.data[item].body[0][dataCount] === undefined){
        //     break;
        // }
        if (dataCount > pembatas-1) {break;}
        let obj = {};
        title.forEach(function(value,index){
            obj[value] = sourceData.data[value].body[0][dataCount];
        })
        sourceDataTemplate.push(obj);
        dataCount++;
    }

    window.alert("Ok tersimpan");
    btnHideSourceData.click();
    updatePreview();

    console.log("title", title);
    console.log("body", body);
    console.log("sourceData", sourceData);
    console.log("sourceDataTemplate", sourceDataTemplate);
});

btnHideSourceData.addEventListener("click", function(){
    toggle(sourceDataContainer);
});

function deleteElement(element){
    console.log("diklik");
    if (sourceData.data[element.getAttribute("data-source-key")]){
        delete sourceData.data[element.getAttribute("data-source-key")];
    }
    el = element.parentElement.parentElement.parentElement;
    el.remove();
}

function reloadEvent(){
    if(window.confirm("Semua data akan hilang, anda harus mengetik ulang lagi dari awal . ok?")){
        window.location.reload();
    }
}

function entryKeyData(element){
    if (element.value === '') {return}
    el = element.parentElement.parentElement
        .querySelector('button').setAttribute("data-source-key", element.value);
    console.log(element.parentElement.parentElement.querySelector('button'));
}

emojiPicker.addEventListener('emoji-click', function(event){
        let emoji = event.detail.unicode;
        insertTextAtCursor(textareaPolos, emoji);
        textareaPolos.focus();
});


tombolPreview.addEventListener("click", function () {
    updatePreview();
})

stickyNavButton.addEventListener("click", function(){
    if (navToolbar.classList.contains("sticky-top")) {
        navToolbar.classList.remove("sticky-top");
        stickyNavButton.classList.replace("btn-info", "btn-outline-info");
        stickyNavButton.innerText = "Sticky Nav [off]";
    } else {
        navToolbar.classList.add("sticky-top");
        stickyNavButton.classList.replace("btn-outline-info", "btn-info");
        stickyNavButton.innerText = "Sticky Nav [on]";
    }
});

let counterClickEmoji = false; // trik aneh , soalnya pertama app diload, 1x klik gk muncul emoji , harus dua kali.
btnShowEmoji.addEventListener("click", function(){
    //https://stackoverflow.com/questions/779379/why-is-settimeoutfn-0-sometimes-useful
    setTimeout(function(){
        toggle(emojiPicker, function(){
            btnShowEmoji.innerText = "Hide Emoji box";
            btnShowEmoji.classList.replace("btn-primary", 'btn-danger');
        }, function(){
            btnShowEmoji.innerText = "Show Emoji box";
            btnShowEmoji.classList.replace('btn-danger', "btn-primary");
        });
    }) 
});

previewCheckbox.addEventListener("change", function () {
    if (previewCheckbox.checked == true) {
        updatePreview();
        timer = setInterval(function () {
            updatePreview();
        }, 1000);
    } else {
        clearInterval(timer);
        resultFormatted.innerHTML = "Klik tombol Preview untuk melihat hasil.";
    }
})

buttonTebal.addEventListener("click", function () {
    let selection = getSelectionText();
    textareaPolos.value = updateEditor(selection, "bold");
})

buttonMiring.addEventListener("click", function () {
    let selection = getSelectionText();
    textareaPolos.value = updateEditor(selection, "italic");
})

buttonMono.addEventListener("click", function () {
    let selection = getSelectionText();
    if ( checkNewline() ){
        textareaPolos.value = updateEditor(selection, "monoNewLine");
    } else {
        textareaPolos.value = updateEditor(selection, "mono");
    }
})


clearButton.addEventListener("click", function () {
    hiddenOutput.value = '';
    let selection = window.getSelection().toString();
    if (selection === '') {
        if(confirm("Yakin ingin menghapus semua formatting?")) {
            textareaPolos.value = textareaPolos.value.replace(/(<([^>]+)>)/gi, "");
        }
    }
    let formatted = selection.replace(/(<([^>]+)>)/gi, ""); // hapus semua markup html
    textareaPolos.value = textareaPolos.value.replaceAll(selection, formatted);
    
})

clearContent.addEventListener("click", function () {
    if(confirm("Yakin ingin menghapus semua pesan yang anda tulis?")) {
        textareaPolos.value = "Ketikkan pesan anda disini...";
    }  
})

buttonCopyTelegram.addEventListener("click", function(){
    copyToClipboard("telegram");
});

// buttonCopyWhatsapp.addEventListener("click", function(){
//     copyToClipboard("whatsapp");
// });