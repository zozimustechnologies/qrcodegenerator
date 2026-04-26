function showText() {
    var value = document.getElementById("value").value;
    var error = document.getElementById("input-error");
    if (!value.trim()) {
        error.removeAttribute("hidden");
        return;
    }
    error.setAttribute("hidden", "");
    var qrimage = document.getElementById("qrimage");
    qrimage.src = "https://api.qrserver.com/v1/create-qr-code/?data=" + encodeURIComponent(value) + "&size=200x200";
    qrimage.removeAttribute("hidden");
    document.getElementById("copybtn").disabled = false;
    document.getElementById("downloadbtn").disabled = false;
}

async function copyQR() {
    const qrimage = document.getElementById("qrimage");
    try {
        const response = await fetch(qrimage.src);
        const blob = await response.blob();
        await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })]);
        showToast("Copied to clipboard!");
    } catch {
        showToast("Copy failed.");
    }
}

async function downloadQR() {
    const qrimage = document.getElementById("qrimage");
    try {
        const response = await fetch(qrimage.src);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "qrcode.png";
        a.click();
        URL.revokeObjectURL(url);
    } catch {
        showToast("Download failed.");
    }
}

function showToast(message) {
    let toast = document.getElementById("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}
