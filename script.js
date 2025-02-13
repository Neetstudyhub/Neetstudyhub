const sidebar = document.getElementById('sidebar');
const closeSidebarBtn = document.getElementById('closeSidebar');
const sidebarTab = document.getElementById('sidebarTab');

// Function to toggle the sidebar
const toggleSidebar = () => {
  sidebar.classList.toggle('open'); // Toggle the sidebar visibility

  // Show/hide the sidebar tab (hamburger icon) based on sidebar state
  if (sidebar.classList.contains('open')) {
    sidebarTab.style.display = 'none'; // Hide tab when sidebar is open
  } else {
    sidebarTab.style.display = 'flex'; // Show tab when sidebar is closed
  }
};

// Event Listeners
sidebarTab.addEventListener('click', toggleSidebar);
closeSidebarBtn.addEventListener('click', toggleSidebar);
