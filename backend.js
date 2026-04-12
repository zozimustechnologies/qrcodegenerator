function showText() {
    var value = document.getElementById("value").value;
    if (!value.trim()) return;
    var qrimage = document.getElementById("qrimage");
    qrimage.src = "https://api.qrserver.com/v1/create-qr-code/?data=" + encodeURIComponent(value) + "&size=200x200";
    qrimage.removeAttribute("hidden");
}
