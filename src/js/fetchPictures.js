const ENDPOINT = 'https://pixabay.com/api/';
const API_KEY = '33321397-4ff964b04c1d431f58eb3ad84';
import Notiflix from 'notiflix';
import axios from 'axios';

export default class Picture {
  constructor() {
    this.name = '';
    this.page = 1;
    // this.totalHits = 0;
    this.per_page = 20;
  }

  // async getTotalHIts() {
  //   const response = await axios(
  //     `${ENDPOINT}?key=${API_KEY}&q=${this.name}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.per_page}`
  //   );

  //   const totalHits = await response.data.totalHits;
  //   console.log(totalHits);

  //   if (totalHits.length === 0)
  //     Notiflix.Notify.failure(
  //       'Sorry, there are no images matching your search query. Please try again.'
  //     );
  //   return totalHits;
  // }

  async getPictures() {
    const response = await axios(
      `${ENDPOINT}?key=${API_KEY}&q=${this.name}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.per_page}`
    );
    this.incrementPage();

    const pictures = await response.data;

    // if (pictures.hits.length === 0)
    //   Notiflix.Notify.failure(
    //     'Sorry, there are no images matching your search query. Please try again.'
    //   );
    return pictures;
  }

  resetPage() {
    this.page = 1;
  }

  incrementPage() {
    this.page += 1;
  }
}

// async function fetchPictures(name) {
//   const response = await axios(
//     `${ENDPOINT}?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&safesearch=true`
//   );
//   const pictures = await response.data.hits;
//   return pictures;
// }
