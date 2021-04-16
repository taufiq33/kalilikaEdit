const textareaPolos = document.querySelector("#polos");
const tombolPreview = document.querySelector("#previewButton");
const textareaFormatted = document.querySelector("#formatted");
const previewCheckbox = document.querySelector("#autoPreviewCheckbox");

function renderResult(){
    setInterval(function(){
        textareaFormatted.value = textareaPolos.value;
    }, 5000)
}

textareaPolos.focus();
tombolPreview.addEventListener("click", function(){
    textareaFormatted.value = textareaPolos.value;
})

previewCheckbox.addEventListener("change", function(){
    previewCheckbox.checked == true ? renderResult() : console.log("tanpa auto preview");
})