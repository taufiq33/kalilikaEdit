const textareaPolos = document.querySelector("#polos");
const tombolPreview = document.querySelector("#previewButton");
const textareaFormatted = document.querySelector("#formatted");
const previewCheckbox = document.querySelector("#autoPreviewCheckbox");



textareaPolos.focus();
tombolPreview.addEventListener("click", function(){
    textareaFormatted.value = textareaPolos.value;
})

previewCheckbox.addEventListener("change", function(){
    if (previewCheckbox.checked == true){
        timer = setInterval(function(){
            textareaFormatted.value = textareaPolos.value;
        },3500);
    } else {
        clearInterval(timer);
    }
})