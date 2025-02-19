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

  // Utility function to convert text into a URL-friendly slug
  function slugify(text) {
    return text.toString().toLowerCase().trim()
      .replace(/\s+/g, '-')       // Replace spaces with -
      .replace(/[^\w\-]+/g, '')    // Remove all non-word chars
      .replace(/\-\-+/g, '-');     // Replace multiple - with single -
  }

  (function() {
    // Create a URL object from the current location
    var currentUrl = new URL(window.location.href);

    // Remove the "postId" query parameter if present
    currentUrl.searchParams.delete('postId');

    // Get the updated query string and hash
    var updatedQuery = currentUrl.search;
    var currentHash = currentUrl.hash;

    // Get the pathname from the updated URL object
    var path = currentUrl.pathname;

    // Check if the URL ends with "post.html"
    if (path.endsWith('post.html')) {
      // Use the content from the element with id "post-title"
      var postTitleElement = document.getElementById('post-title');
      if (postTitleElement && postTitleElement.textContent) {
        var newSlug = slugify(postTitleElement.textContent);
        var newUrl = '/' + newSlug + updatedQuery + currentHash;
        history.replaceState(null, '', newUrl);
      }
    }
    // For any other .html pages, remove the .html extension
    else if (path.endsWith('.html')) {
      var newPath = path.replace(/\.html$/, '');
      var newUrl = newPath + updatedQuery + currentHash;
      history.replaceState(null, '', newUrl);
    }
  })();

