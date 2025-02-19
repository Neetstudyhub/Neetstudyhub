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

  (function() {
    var currentPath = window.location.pathname;
    var searchParams = new URLSearchParams(window.location.search);
    
    // If we're on post.html and there is a postid parameter
    if (currentPath.endsWith("post.html")) {
      var postId = searchParams.get("postid");
      if (postId) {
        // Update the post title element (if present) with text based on the postid
        var postTitleEl = document.getElementById("post-title");
        if (postTitleEl) {
          postTitleEl.textContent = "Post " + postId;
        }
        // Remove the postid parameter
        searchParams.delete("postid");
      }
      // Remove the ".html" extension and update URL (e.g. change /post.html to /post)
      var newPath = currentPath.replace(/post\.html$/, "post");
      var newSearch = searchParams.toString() ? "?" + searchParams.toString() : "";
      var newUrl = newPath + newSearch + window.location.hash;
      history.replaceState(null, '', newUrl);
    } 
    // For any other page ending in .html, remove the .html extension
    else if (currentPath.endsWith(".html")) {
      var newPath = currentPath.replace(/\.html$/, "");
      var newUrl = newPath + window.location.search + window.location.hash;
      history.replaceState(null, '', newUrl);
    }
  })();
