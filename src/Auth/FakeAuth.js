/* const fakeAuth = {
  isAuthenticated: null,

  signIn(callback) {
    fakeAuth.isAuthenticated = true;
    setTimeout(callback, 300);
  },

  signOut(callback) {
    fakeAuth.isAuthenticated = false;
    setTimeout(callback, 300);
  },
};

export default fakeAuth;
 */

const fakeAuth = {
  isAuthenticated: false,

  checkAuth() {
    const token = localStorage.getItem("token");
    this.isAuthenticated = !!token;
    return this.isAuthenticated;
  },

  signIn(callback) {
    this.isAuthenticated = true;
    setTimeout(callback, 300);
  },

  signOut(callback) {
    this.isAuthenticated = false;
    localStorage.removeItem("token"); // Clear token on sign out
    setTimeout(callback, 300);
  },
};

export default fakeAuth;
