const url = '../docs/pdf/pdf995.pdf';

let pdfDoc = null,
  pageNum = 1,
  pageIsRendering = false,
  pageNumIsPending = null;

const scale = 1.5,
  canvas = document.querySelector('#pdf-render'),
  ctx = canvas.getContext('2d');

//Render the page//
const renderPage = num => {
  pageIsRendering = true;

  //get the page//
  pdfDoc.getPage(num).then(page => {
    //set scale//
    const viewport = page.getviewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderCtx = {
      canvasContext: ctx,
      viewport
    }

    page.render(renderCtx).promise.then(() => {
      pageIsRendering = false;

      if(pageNumIsPending !== null) {
        renderPage(pageNumIsPending);
        pageNumIsPending = null;
      }  
    });

    // Output Current Page//
    document.querySelector('#page-num').textContent = num;
  })};

//Get Document//
pdfjsLib.getDocument(url).promise.then(pdfDoc_ => {
  pdfDoc = pdfDoc_;

  document.querySelector('#page-count').textContent = pdfDoc.numPages;

  renderPage(pageNum)
});

