$(document).ready(function () {
    // Helper function to generate star ratings
    function generateStars(starCount) {
      let stars = '';
      for (let i = 1; i <= 5; i++) {
        stars += `<img src="images/star_${i <= starCount ? 'on' : 'off'}.png" alt="star" width="15px" />`;
      }
      return stars;
    }
  
    // Spinner animation function
    function animateSpinner() {
      const arc = document.querySelector('.arc');
      if (!arc) {
        console.warn('Spinner element not found');
        return;
      }
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
  
    // Fetch and display courses
    function fetchCourses(queryParams = {}) {
      $('#video-list').html('<div class="loader">Loading...</div>'); // Show loader
  
      $.ajax({
        url: 'https://smileschool-api.hbtn.info/courses',
        data: queryParams,
        success: function (response) {
          $('.loader').remove(); // Remove loader
          const courses = response.courses;
          const videoCount = courses.length;
          $('.video-count').text(`${videoCount} videos`); // Update video count
  
          $('#video-list').empty();
          courses.forEach(course => {
            $('#video-list').append(`
              <div class="col-12 col-sm-4 col-lg-3 d-flex justify-content-center">
                <div class="card">
                  <img src="${course.thumb_url}" class="card-img-top" alt="Video thumbnail" />
                  <div class="card-img-overlay text-center">
                    <img src="images/play.png" alt="Play" width="64px" class="align-self-center play-overlay" />
                  </div>
                  <div class="card-body">
                    <h5 class="card-title font-weight-bold">${course.title}</h5>
                    <p class="card-text text-muted">${course['sub-title']}</p>
                    <div class="creator d-flex align-items-center">
                      <img src="${course.author_pic_url}" alt="Creator of Video" width="30px" class="rounded-circle" />
                      <h6 class="pl-3 m-0 main-color">${course.author}</h6>
                    </div>
                    <div class="info pt-3 d-flex justify-content-between">
                      <div class="rating">
                        ${generateStars(course.star)}
                      </div>
                      <span class="main-color">${course.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            `);
          });
        },
        error: function (error) {
          console.error('Error fetching courses:', error);
        }
      });
    }
  
    // Load dropdowns for topics and sorts
    function loadDropdowns() {
      $.ajax({
        url: 'https://smileschool-api.hbtn.info/courses',
        success: function (response) {
          const topics = response.topics;
          const sorts = response.sorts;
  
          $('#topic-dropdown').empty();
          topics.forEach(topic => {
            $('#topic-dropdown').append(`<a class="dropdown-item" href="#" data-topic="${topic}">${topic}</a>`);
          });
  
          $('#sort-dropdown').empty();
          sorts.forEach(sort => {
            $('#sort-dropdown').append(`<a class="dropdown-item" href="#" data-sort="${sort}">${sort}</a>`);
          });
  
          $('#search-keywords').val(response.q);
  
          // Event listeners for dropdowns
          $('#topic-dropdown a').click(function (e) {
            e.preventDefault();
            $('#selected-topic').text($(this).text());
            fetchCourses({ q: $('#search-keywords').val(), topic: $(this).data('topic'), sort: $('#selected-sort').text() });
          });
  
          $('#sort-dropdown a').click(function (e) {
            e.preventDefault();
            $('#selected-sort').text($(this).text());
            fetchCourses({ q: $('#search-keywords').val(), topic: $('#selected-topic').text(), sort: $(this).data('sort') });
          });
        },
        error: function (error) {
          console.error('Error loading dropdowns:', error);
        }
      });
    }
  
    // Quotes Section
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
  
    // Popular Tutorials Section
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
        const isMobile = $(window).width() < 576;
        const chunkSize = isMobile ? 1 : 4; // Adjust chunk size based on screen width
        // Could never figure out how to get this to 1 item on mobile. Not sure how to troubleshoot.
  
        for (let i = 0; i < data.length; i += chunkSize) {
          const chunk = data.slice(i, i + chunkSize);
          const activeClass = i === 0 ? ' active' : '';
          let carouselItem = `<div class="carousel-item${activeClass}"><div class="row justify-content-center">`;
  
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
  
    // Latest Videos Section
    $.ajax({
      url: 'https://smileschool-api.hbtn.info/latest-videos',
      method: 'GET',
      beforeSend: function() {
        $('#latest-loader').removeClass('d-none').addClass('d-block');
        $('#carouselExampleControls3').removeClass('d-block').addClass('d-none');
        animateSpinner();
      },
      success: function (data) {
        const latestCarouselInner = $('#latest-carousel-inner');
        const isMobile = $(window).width() < 576;
        const chunkSize = isMobile ? 1 : 4; // Adjust chunk size based on screen width
  
        for (let i = 0; i < data.length; i += chunkSize) {
          const chunk = data.slice(i, i + chunkSize);
          const activeClass = i === 0 ? ' active' : '';
          let carouselItem = `<div class="carousel-item${activeClass}"><div class="row justify-content-center">`;
  
          chunk.forEach(video => {
            carouselItem += `
              <div class="col-lg-3 col-md-6 mb-4">
                <div class="card">
                  <img src="${video.thumb_url}" class="card-img-top" alt="${video.title}">
                  <div class="card-img-overlay text-center">
                    <img src="images/play.png" alt="Play" width="64px" class="align-self-center play-overlay">
                  </div>
                  <div class="card-body">
                    <h5 class="card-title font-weight-bold">${video.title}</h5>
                    <p class="card-text text-muted">${video['sub-title']}</p>
                    <div class="creator d-flex align-items-center">
                      <img src="${video.author_pic_url}" alt="Creator of Video" width="30px" class="rounded-circle">
                      <h6 class="pl-3 m-0 main-color">${video.author}</h6>
                    </div>
                    <div class="info pt-3 d-flex justify-content-between">
                      <div class="rating">
                        ${'★'.repeat(video.star)}${'☆'.repeat(5 - video.star)}
                      </div>
                      <span class="main-color">${video.duration}</span>
                    </div>
                  </div>
                </div>
              </div>`;
          });
  
          carouselItem += `</div></div>`;
          latestCarouselInner.append(carouselItem);
        }
  
        $('#latest-loader').removeClass('d-block').addClass('d-none');
        $('#carouselExampleControls3').removeClass('d-none').addClass('d-block');
        $('#carouselExampleControls3').carousel(); // Initialize carousel after appending items
      },
      error: function (error) {
        console.error('Error fetching latest videos:', error);
        $('#latest-loader').removeClass('d-block').addClass('d-none');
        $('#carouselExampleControls3').removeClass('d-block').addClass('d-none');
      }
    });
  
    // Initialize dropdowns and courses
    loadDropdowns();
    fetchCourses();
  
    // Event listener for search input
    $('#search-keywords').on('input', function () {
      fetchCourses({ q: $(this).val(), topic: $('#selected-topic').text(), sort: $('#selected-sort').text() });
    });
  });
  