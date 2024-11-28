document.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('menuButton');
  const closeButton = document.getElementById('closeButton');
  const sideSheet = document.getElementById('sideSheet');

  menuButton.addEventListener('click', () => {
    sideSheet.style.display = 'flex';
    sideSheet.style.flexDirection = 'column';
    sideSheet.style.right = '0';
  });

  closeButton.addEventListener('click', () => {
    sideSheet.style.right = '-100%';

    setTimeout(() => {
      sideSheet.style.display = 'none'; // Oculta pra não ficar bugado
    }, 500);
  });
});
