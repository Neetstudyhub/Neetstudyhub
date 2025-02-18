    // Sidebar toggle functionality for mobile
    const sidebar = document.getElementById('sidebar');
    const closeSidebarBtn = document.getElementById('closeSidebar');
    const sidebarTab = document.getElementById('sidebarTab');
    const hamburger = document.querySelector("header .hamburger");

    const toggleSidebar = () => {
      sidebar.classList.toggle('open');
      // When sidebar is open on mobile, hide the sidebar tab (hamburger) if necessary
      if (sidebar.classList.contains('open')) {
        sidebarTab.style.display = 'none';
      } else {
        sidebarTab.style.display = 'flex';
      }
    };

    hamburger.addEventListener('click', toggleSidebar);
    sidebarTab.addEventListener('click', toggleSidebar);
    closeSidebarBtn.addEventListener('click', toggleSidebar);

    document.addEventListener('click', function(e) {
      if (sidebar.classList.contains('open') && !sidebar.contains(e.target) && !sidebarTab.contains(e.target) && !hamburger.contains(e.target)) {
        toggleSidebar();
      }
    });



// hide .html

  // Check if the current URL ends with '.html'
  if (window.location.pathname.endsWith('.html')) {
    // Remove the '.html' extension from the pathname
    var newPath = window.location.pathname.replace(/\.html$/, '');
    // Create the new URL while preserving any query strings or hash
    var newUrl = newPath + window.location.search + window.location.hash;
    // Replace the current history entry with the new URL without reloading the page
    history.replaceState(null, '', newUrl);
  }


