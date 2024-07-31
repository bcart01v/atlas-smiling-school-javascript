// JS For API Quotes Section
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

  // JS for Popular Tutorials Section
  $(document).ready(function () {
  $.ajax({
    url: 'https://smileschool-api.hbtn.info/popular-tutorials',
    method: 'GET',
    beforeSend: function() {
      $('#popular-loader').removeClass('d-none').addClass('d-block');
      $('#carouselExampleControls2').removeClass('d-block').addClass('d-none');
        animateSpinner();
    },
    success: function (data) {
      const popularCarouselInner = $('#popular-carousel-inner');
      const chunkSize = 4;
        for (let i = 0; i < data.length; i += chunkSize) {
          const chunk = data.slice(i, i + chunkSize);
          const activeClass = i === 0 ? ' active' : '';
          let carouselItem = `<div class="carousel-item${activeClass}"><div class="row">`;
  
          chunk.forEach(tutorial => {
            carouselItem += `
              <div class="col-lg-3 col-md-6 mb-4">
                <div class="card">
                  <img src="${tutorial.thumb_url}" class="card-img-top" alt="${tutorial.title}">
                  <div class="card-img-overlay text-center">
                    <img src="images/play.png" alt="Play" width="64px" class="align-self-center play-overlay">
                  </div>
                  <div class="card-body">
                    <h5 class="card-title font-weight-bold">${tutorial.title}</h5>
                    <p class="card-text text-muted">${tutorial['sub-title']}</p>
                    <div class="creator d-flex align-items-center">
                    <img src="${tutorial.author_pic_url}" alt="Creator of Video" width="30px" class="rounded-circle">
                    <h6 class="pl-3 m-0 main-color">${tutorial.author}</h6>
                  </div>
                  <div class="info pt-3 d-flex justify-content-between">
                    <div class="rating">
                      ${'★'.repeat(tutorial.star)}${'☆'.repeat(5 - tutorial.star)}
                    </div>
                    <span class="main-color">${tutorial.duration}</span>
                  </div>
                </div>
              </div>
            </div>`;
        });

        carouselItem += `</div></div>`;
        popularCarouselInner.append(carouselItem);
        }
  
        $('#popular-loader').removeClass('d-block').addClass('d-none');
        $('#carouselExampleControls2').removeClass('d-none').addClass('d-block');
      },
      error: function (error) {
        console.error('Error fetching popular tutorials:', error);
        $('#popular-loader').removeClass('d-block').addClass('d-none');
        $('#carouselExampleControls2').removeClass('d-block').addClass('d-none');
      }
    });
  
    function animateSpinner() {
      const arc = document.querySelector('.arc');
      let startAngle = 0;
      let endAngle = 0;
      const radius = 20;
      const circumference = 2 * Math.PI * radius;
      arc.setAttribute('stroke-dasharray', circumference);
      arc.setAttribute('stroke-dashoffset', circumference);
  
      function drawArc() {
        startAngle += 4;
        endAngle += 4;
        if (endAngle >= 360) endAngle = 0;
        const offset = circumference - (circumference * endAngle) / 360;
        arc.setAttribute('stroke-dashoffset', offset);
        requestAnimationFrame(drawArc);
      }
  
      drawArc();
    }
  });
  