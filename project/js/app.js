const textareaPolos = document.querySelector("#polos");
const tombolPreview = document.querySelector("#previewButton");
const resultFormatted = document.querySelector("#formatted");
const previewCheckbox = document.querySelector("#autoPreviewCheckbox");
const buttonTebal = document.querySelector("#buttonTebal");
const buttonMiring = document.querySelector("#buttonMiring");
const buttonMono = document.querySelector("#buttonMono");
const buttonCopyTelegram = document.querySelector("#buttonCopyTelegram");
const buttonCopyWhatsapp = document.querySelector("#buttonCopyWhatsapp");
const hiddenOutput = document.querySelector("#hiddenOutput");
const btnShowEmoji = document.querySelector("#btnShowEmoji");
const emojiPicker = document.querySelector('emoji-picker');
const stickyNavButton = document.querySelector('#stickyNavButton');
const navToolbar = document.querySelector('#nav-toolbar');
const clearContent = document.querySelector("#clearContent");

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

function checkNewline(){
    let text = window.getSelection().toString();
    if (text.indexOf('\n') !== -1){ return true }
    return false
}

function getSelectionText(){
    let selection = window.getSelection().toString();
    if (selection === '') {return alert("Seleksi teks yang akan dikenai format ini.")};
    return selection;
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
        .replaceAll("<br>", "\n"));
    if (type === "whatsapp") { 
        result = result
        .replaceAll("**", "*")
        .replaceAll("__", "_");
    }
    hiddenOutput.value = result;
    hiddenOutput.select();
    hiddenOutput.setSelectionRange(0, 99999);
    document.execCommand('copy');
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
    if(!counterClickEmoji) {btnShowEmoji.click(); counterClickEmoji = true;}
    if (emojiPicker.style.display === "none") {
        btnShowEmoji.innerText = "Hide Emoji box";
        btnShowEmoji.classList.replace("btn-primary", 'btn-danger');
        emojiPicker.style.display = "block";
    } else {
        btnShowEmoji.innerText = "Show Emoji box";
        btnShowEmoji.classList.replace('btn-danger', "btn-primary");
        emojiPicker.style.display = "none";
    }
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

buttonCopyWhatsapp.addEventListener("click", function(){
    copyToClipboard("whatsapp");
});