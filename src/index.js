// import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import './css/styles.css';
import API from './js/fetchPictures.js';
import LoadMoreBtn from './js/srollBtn.js';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const lightbox = new SimpleLightbox('.gallery a', {
  overlayOpacity: 0.3,
  showCounter: false,
});
let counter = 0;

const Picture = new API();
const inputEl = document.getElementById('search-form');
const pictureGallery = document.querySelector('.gallery');

const loadMoreBtn = new LoadMoreBtn({
  selector: '.load-more',
  isHidden: true,
});

loadMoreBtn.button.addEventListener('click', fetchPictures);
inputEl.addEventListener('submit', onInput);

function onInput(event) {
  event.preventDefault();

  counter = 0;
  Picture.name = event.target.searchQuery.value.trim();
  clearGallery();
  Picture.resetPage();
  loadMoreBtn.show();
  fetchPictures().finally(() => inputEl.reset());
  // gallery.refresh();
}

async function fetchPictures() {
  loadMoreBtn.disable();
  counter += Picture.per_page;
  console.log(counter);
  // checkTotalHits();
  lightbox.refresh();
  return await Picture.getPictures()
    .then(picture => {
      if (picture.hits.length === 0) {
        loadMoreBtn.hide();
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else if (counter >= picture.totalHits && picture.totalHits > 0) {
        loadMoreBtn.hide();
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
        lightbox.refresh();
      } else if (counter <= 21) {
        Notiflix.Notify.info(
          `"Hooray! We found ${picture.totalHits} images."'`
        );
        lightbox.refresh();
      }
      return picture.hits;
    })
    .then(answer => {
      return answer.map(picture => CreateMarkup(picture)).join('');
    })
    .then(markup => {
      updateGallery(markup);
      loadMoreBtn.enable();
    })
    .catch(onError);
}

// function checkTotalHits() {
//   Picture.getPictures().then(response => {
//     console.log(response.totalHits);
//     if (counter >= response.totalHits) {
//       loadMoreBtn.hide();

//       Notiflix.Notify.failure(
//         "We're sorry, but you've reached the end of search results."
//       );
//     }
//   });
// }
// try {

// } catch (error) {

function CreateMarkup({
  tags,
  views,
  likes,
  comments,
  downloads,
  webformatURL,
  largeImageURL,
}) {
  return `<div class="photo-card">
<a class='photo-link' href="${largeImageURL}">
  <img class='photo-img' src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>  
  <div class="info">
    <p class="info-item">
      <b> Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b> Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b> Downloads:
      ${downloads}</b>
    </p>
  </div>
</div>`;
}
function clearGallery() {
  pictureGallery.innerHTML = '';
}

function updateGallery(markup = '') {
  pictureGallery.insertAdjacentHTML('beforeend', markup);
}

function onError(error) {
  loadMoreBtn.hide();
  console.log(error);

  Notiflix.Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
  updateGallery('<p> Articles not found</p>');
}
