(function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.site-menu');
  const headerLinks = Array.from(document.querySelectorAll('.site-menu a[href^="#"]'));
  const dropdown = document.querySelector('.menu-dropdown');
  const dropdownToggle = document.querySelector('.menu-dropdown-toggle');
  const backToTop = document.querySelector('.back-to-top');
  const toast = document.querySelector('.toast');
  const form =