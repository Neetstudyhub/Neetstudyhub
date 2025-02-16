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



// latest post blogger 

