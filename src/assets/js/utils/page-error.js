export function showPageError(error) {
  console.error(error);

  const main = document.getElementById("main-content");
  if (!main) return;

  main.innerHTML = `
    <section class="section">
      <div class="container">
        <div class="page-error" role="alert">
          <h1>We could not load this page.</h1>
          <p>Please refresh the page. If the problem continues, check that all website files were uploaded together.</p>
        </div>
      </div>
    </section>`;
}
