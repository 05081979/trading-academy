/* ── Pine Script File Protection ── */
/* Seul Admin peut telecharger les .pine */
/* Starter/Premium voient un message "invite-only" */
(function() {
  window.addEventListener('DOMContentLoaded', function() {
    var tier = window.AA_TIER || sessionStorage.getItem('aa_tier') || 'starter';
    var user = sessionStorage.getItem('aa_user') || '';
    var isAdmin = (user === 'Admin');

    if (isAdmin) return; // Admin voit tout

    // Remplacer tous les liens .pine par un message
    var links = document.querySelectorAll('a[href*=".pine"]');
    links.forEach(function(link) {
      var btn = document.createElement('span');
      btn.style.cssText = link.getAttribute('style') || '';
      btn.style.cssText += ';display:inline-flex;align-items:center;gap:6px;padding:10px 22px;border-radius:6px;border:1px solid #333;background:#1a1a25;color:#666;cursor:not-allowed;font-size:11px;font-family:monospace;';
      btn.textContent = '🔒 Invite-only sur TradingView';
      link.replaceWith(btn);
    });
  });
})();
