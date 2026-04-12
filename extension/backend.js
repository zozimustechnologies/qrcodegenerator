document.addEventListener("DOMContentLoaded", function () {
    // QR Code generation
    document.getElementById("qrform").addEventListener("submit", function (e) {
        e.preventDefault();
        var value = document.getElementById("value").value;
        if (!value.trim()) return;
        var qrimage = document.getElementById("qrimage");
        qrimage.src = "https://api.qrserver.com/v1/create-qr-code/?data=" + encodeURIComponent(value) + "&size=200x200";
        qrimage.removeAttribute("hidden");
    });

    // Code button - open GitHub repo
    document.getElementById("codebtn").addEventListener("click", function () {
        chrome.tabs.create({ url: "https://github.com/zozimustechnologies/qrcodegenerator" });
    });

    // Donate button - open Wise payment
    document.getElementById("donatebtn").addEventListener("click", function () {
        chrome.tabs.create({ url: "https://wise.com/pay/business/sandeepchadda?utm_source=open_link" });
    });
});
