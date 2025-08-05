/**
 * Redirects the user to the login page if no user is logged in.
 */
function checksAuthentication() {
    const user = localStorage.getItem('loggedInUser');
    if (!user) {
      window.location.href = '../index.html';
    }
  }