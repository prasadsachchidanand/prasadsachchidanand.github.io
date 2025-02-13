document.getElementById("shareButton").addEventListener("click", function() {
    document.getElementById("shareModal").classList.remove("hidden");
    document.getElementById("shareLink").value = window.location.href;
  });

  document.getElementById("closeModal").addEventListener("click", function() {
    document.getElementById("shareModal").classList.add("hidden");
  });

  document.getElementById("copyLink").addEventListener("click", function() {
    let linkInput = document.getElementById("shareLink");
    linkInput.select();
    document.execCommand("copy");
    alert("Link copied to clipboard!");
  });

  document.addEventListener("keydown", function(event) {
    if (event.key === "Escape") {
      document.getElementById("shareModal").classList.add("hidden");
    }
  });

  document.getElementById("shareWhatsApp").setAttribute("href", "https://wa.me/?text=" + encodeURIComponent(window.location.href));
  document.getElementById("shareFacebook").setAttribute("href", "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(window.location.href));
  document.getElementById("shareTwitter").setAttribute("href", "https://twitter.com/intent/tweet?url=" + encodeURIComponent(window.location.href));
  document.getElementById("shareEmail").setAttribute("href", "mailto:?body=" + encodeURIComponent(window.location.href));
