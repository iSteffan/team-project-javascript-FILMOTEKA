import axios from 'axios';

const BASE_URL = 'https://api.themoviedb.org/3';
const USER_KEY = '9e4f0ad78cbe1148a9d4c0c8389afc83';
const refs = {
    watchedBtn: document.querySelector('.js-watchedBtn'),
    queueBtn: document.querySelector('.js-queueBtn'),
}

refs.watchedBtn.addEventListener('click', onAddToWatchedList);
refs.queueBtn.addEventListener('click', onAddToQueueList);

let savedInputsWatched = localStorage.getItem('addToWatched');
// console.log(0 == savedInputsWatched.length - 1);
// if (savedInputsWatched.length - 1) {   
//     refs.watchedBtn.textContent = 'DELETE FROM WATCHED';        
// }
let savedInputsQueue = localStorage.getItem('addToQueue');
// if (savedInputsQueue) {    
//     refs.queueBtn.textContent = 'DELETE FROM QUEUE';        
// }



async function onAddToWatchedList(e) {
    const modalElements = e.target;
    //get name from modal
    const filmName = modalElements.offsetParent.children[2].firstElementChild.textContent;
    //get genres from modal
    const genresString = modalElements.offsetParent.children[2].children[1].children[1].firstElementChild.lastElementChild.textContent;
    
    //get movie by name
    let searchedFilmInfo = '';
    try {
        const getFilm = await axios.get(
            `${BASE_URL}/search/movie?api_key=${USER_KEY}&language=en-US&query=${filmName}`
            )
            searchedFilmInfo = getFilm.data.results[0];
            // console.log(searchedFilmInfo);
        } catch (error) {
            console.log(error.name);
            return
        }
        
        
        //create object for local store
        const poster = searchedFilmInfo.poster_path;
        const title = searchedFilmInfo.original_title ? searchedFilmInfo.original_title : searchedFilmInfo.title;
        const genres = genresString.includes(',') ? [genresString.split(', ')] : genresString    
        const releaseDate = searchedFilmInfo.release_date.slice(0, 4);
        
        const watchedLibrary = { poster, title, genres, releaseDate };    
        // console.log(watchedLibrary);
        
        //push object to localStore
        // savedInputsWatched = localStorage.getItem('addToWatched');
        let parsedInputs = [];
        
        if (savedInputsWatched) {
            try {        
                const parsedData = JSON.parse(savedInputsWatched);
                parsedInputs.push(...parsedData);
            } catch (error) {
                console.log(error.name);
                console.log(error.message);
            }              
        }
        
        if (refs.watchedBtn.textContent.toLowerCase().trim() !== 'add to watched') {       
            refs.watchedBtn.textContent = "ADD TO WATCHED";

            const movieIndex = parsedInputs.findIndex(movie => movie.title === title)
            parsedInputs.splice(movieIndex, 1);
            localStorage.setItem('addToWatched', JSON.stringify(parsedInputs))
            return
        }
       
        refs.watchedBtn.textContent = 'DELETE FROM WATCHED';        
       
        parsedInputs.push(watchedLibrary);
        localStorage.setItem('addToWatched', JSON.stringify(parsedInputs))
        
}
    
    
async function onAddToQueueList(e) {
    const modalElements = e.target;
    //get name from modal
    const filmName = modalElements.offsetParent.children[2].firstElementChild.textContent;
    //get genres from modal
    const genresString = modalElements.offsetParent.children[2].children[1].children[1].firstElementChild.lastElementChild.textContent;
    
    //get movie by name
    let searchedFilmInfo = '';
    try {
        const getFilm = await axios.get(
            `${BASE_URL}/search/movie?api_key=${USER_KEY}&language=en-US&query=${filmName}`
        )
        searchedFilmInfo = getFilm.data.results[0];
        console.log(searchedFilmInfo);
    } catch (error) {
        console.log(error.name);
        return
    }
        
            
    //create object for local store
    const poster = searchedFilmInfo.poster_path;
    const title = searchedFilmInfo.original_title ? searchedFilmInfo.original_title : searchedFilmInfo.title;
    const genres = genresString.includes(',') ? [genresString.split(', ')] : genresString    
    const releaseDate = searchedFilmInfo.release_date.slice(0, 4);
                    
    const queueLibrary = { poster, title, genres, releaseDate }
    // console.log(queueLibrary);
   
        //push object to localStore
        const savedInputsQueue = localStorage.getItem('addToQueue');
        let parsedInputs = [];
        
        if (savedInputsQueue) {
            try {        
                const parsedData = JSON.parse(savedInputsQueue);
                parsedInputs.push(...parsedData);
            } catch (error) {
                console.log(error.name);
                console.log(error.message);
            }              
        }
        
        if (refs.queueBtn.textContent.toLowerCase().trim() !== 'add to queue' ) {       
            refs.queueBtn.textContent = "ADD TO QUEUE";
            
            const movieIndex = parsedInputs.findIndex(movie => movie.title === title)
            parsedInputs.splice(movieIndex, 1);
            localStorage.setItem('addToQueue', JSON.stringify(parsedInputs))
            return
        }
        refs.queueBtn.textContent = 'DELETE FROM QUEUE';        
       
        parsedInputs.push(queueLibrary);
        localStorage.setItem('addToQueue', JSON.stringify(parsedInputs))

}
