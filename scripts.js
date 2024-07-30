$(document).ready(function () {
    $.ajax({
      url: 'https://smileschool-api.hbtn.info/quotes',
      method: 'GET',
      beforeSend: function() {
        console.log('Loading started');
        $('#quotes-loader').removeClass('d-none').addClass('d-block');
        $('#carouselExampleControls').removeClass('d-block').addClass('d-none');
      },
      success: function (data) {
        console.log('Data loaded successfully');
        const quotesCarouselInner = $('#quotes-carousel-inner');
        data.forEach((quote, index) => {
          const activeClass = index === 0 ? ' active' : '';
          const carouselItem = `
            <div class="carousel-item${activeClass}">
              <div class="row mx-auto align-items-center">
                <div class="col-12 col-sm-2 col-lg-2 offset-lg-1 text-center">
                  <img src="${quote.pic_url}" class="d-block align-self-center" alt="Carousel Pic ${index + 1}" />
                </div>
                <div class="col-12 col-sm-7 offset-sm-2 col-lg-9 offset-lg-0">
                  <div class="quote-text">
                    <p class="text-white">${quote.text}</p>
                    <h4 class="text-white font-weight-bold">${quote.name}</h4>
                    <span class="text-white">${quote.title}</span>
                  </div>
                </div>
              </div>
            </div>`;
          quotesCarouselInner.append(carouselItem);
        });
        console.log('Hiding loader and showing carousel');
        $('#quotes-loader').removeClass('d-block').addClass('d-none');
        $('#carouselExampleControls').removeClass('d-none').addClass('d-block');
      },
      error: function (error) {
        console.log('Error fetching quotes:', error);
        $('#quotes-loader').removeClass('d-block').addClass('d-none');
        $('#carouselExampleControls').removeClass('d-block').addClass('d-none');
      }
    });
  });
  