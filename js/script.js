const root = document.querySelector(':root')
const body = document.querySelector('body')

const btnTheme = document.querySelector('.btn-theme')
const input = document.querySelector('.input')

const btnPrev = document.querySelector('.btn-prev')
const btnNext = document.querySelector('.btn-next')
const divMovies = document.querySelector('.movies')

const divHighlightVideo = document.querySelector('.highlight__video')
const HighlightVideoLink = document.querySelector('.highlight__video-link')
const highlightTitle = document.querySelector('.highlight__title')
const highlightRating = document.querySelector('.highlight__rating')
const highlightGenres = document.querySelector('.highlight__genres')
const highlightLaunch = document.querySelector('.highlight__launch')
const highlightDescription = document.querySelector('.highlight__description')


const modal = document.querySelector('.modal')
const modalBody = document.querySelector('.modal__body')
const modalTitle = document.querySelector('.modal__title')
const modalImg = document.querySelector('.modal__img')
const modalDescription = document.querySelector('.modal__description')
const modalgenreNaverage = document.querySelector('.modal__genre-average')
const modalGenres = document.querySelector('.modal__genres')
const modalAverage = document.querySelector('.modal__average')

const btnClose = document.querySelector('.modal__close')



let pageNumber = 1
const getMovies = async () => {
    try {
        // const responseDefault = await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false')
        // const dataDefault = await responseDefault.json()
        // let movies = dataDefault.results


        const responseDefault = await api.get('https://tmdb-proxy.cubos-academy.workers.dev/3/discover/movie?language=pt-BR&include_adult=false')
        let movies = responseDefault.data.results




        let PAGE_MIN = 1
        let PAGE_MAX = parseInt(movies.length / 6)

        const fillMovies = (pageNumber, arrayMovies) => {
            divMovies.textContent = ''
            let countStart = 6 * (pageNumber - 1)
            let countEnd = 6 * pageNumber
            for (let i = countStart; i < countEnd; i++) {
                const { poster_path, title, vote_average, id } = arrayMovies[i]

                const divMovie = document.createElement('div')
                divMovie.classList.add('movie')
                divMovie.style.backgroundImage = `url('${poster_path}')`

                const divMovieInfo = document.createElement('div')
                divMovieInfo.classList.add('movie__info')

                const spanTitle = document.createElement('span')
                spanTitle.classList.add('movie__title')
                spanTitle.textContent = title

                const spanRating = document.createElement('span')
                spanRating.classList.add('movie__rating')
                spanRating.textContent = vote_average

                const starImage = document.createElement('img')
                starImage.src = './assets/estrela.svg'
                starImage.alt = 'Estrela'

                spanRating.appendChild(starImage)
                divMovieInfo.append(spanTitle, spanRating)
                divMovie.appendChild(divMovieInfo)
                divMovies.appendChild(divMovie)

                const fillModal = async () => {
                    let idMovie = id
                    let urlModalMovie = `https://tmdb-proxy.cubos-academy.workers.dev/3/movie/${idMovie}?language=pt-BR`

                    // const responseModal = await fetch(urlModalMovie)
                    // const dataModal = await responseModal.json()

                    const responseModal = await api.get(urlModalMovie)
                    const dataModal = responseModal.data
                    const { title, backdrop_path, overview, vote_average, genres } = dataModal


                    modalGenres.textContent = ''
                    for (let genre of genres) {

                        const modalGenre = document.createElement('div')
                        modalGenre.classList.add('modal__genre')
                        modalGenre.textContent = genre.name

                        modalGenres.appendChild(modalGenre)
                    }


                    modal.classList.remove('hidden')
                    modalTitle.textContent = title
                    modalImg.src = backdrop_path
                    modalImg.alt = title
                    modalDescription.textContent = overview
                    modalAverage.textContent = vote_average
                }

                divMovie.addEventListener('click', fillModal)
            }
            btnPrev.addEventListener('click', () => {
                pageNumber--

                if (pageNumber < PAGE_MIN) {
                    pageNumber = PAGE_MAX
                }
                fillMovies(pageNumber, arrayMovies)
            })

            btnNext.addEventListener('click', () => {
                pageNumber++

                if (pageNumber > PAGE_MAX) {
                    pageNumber = 1
                }
                fillMovies(pageNumber, arrayMovies)
            })
        }
        fillMovies(pageNumber, movies)


        const searchMovie = async (event) => {
            if (event.key === 'Enter') {
                if (!input.value) {
                    pageNumber = PAGE_MIN
                    fillMovies(pageNumber, movies)
                    return
                }

                let query = input.value
                let urlApi = `https://tmdb-proxy.cubos-academy.workers.dev/3/search/movie?language=pt-BR&include_adult=false&query=${query}`

                // const responseSearch = await fetch(urlApi)
                // const dataSearch = await responseSearch.json()
                // let moviesSearched = dataSearch.results

                const responseSearch = await api.get(urlApi)
                let moviesSearched = responseSearch.data.results


                pageNumber = PAGE_MIN
                fillMovies(pageNumber, moviesSearched)

                input.value = ''
                return
            }

        }
        input.addEventListener('keyup', searchMovie)







        const fillHighlight = async () => {
            // const responseHighlight = await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR')
            // const dataHighlight = await responseHighlight.json()

            const responseHighlight = await api.get('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969?language=pt-BR')
            const dataHighlight = responseHighlight.data

            const { title, vote_average, release_date, overview, genres, backdrop_path } = dataHighlight

            // const responseVideo = await fetch('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR')
            // const dataVideo = await responseVideo.json()
            // const videos = dataVideo.results

            const responseVideo = await api.get('https://tmdb-proxy.cubos-academy.workers.dev/3/movie/436969/videos?language=pt-BR')
            const videos = responseVideo.data.results

            const { key } = videos[0]


            divHighlightVideo.style.backgroundImage = `url('${backdrop_path}')`
            divHighlightVideo.style.backgroundSize = 'cover'
            HighlightVideoLink.href = `https://www.youtube.com/watch?v=${key}`

            highlightTitle.textContent = title
            highlightRating.textContent = vote_average
            highlightDescription.textContent = overview

            highlightLaunch.textContent = new Date(release_date).toLocaleDateString("pt-BR", {
                year: "numeric",
                month: "long",
                day: "numeric",
                timeZone: "UTC",
            });


            for (let [index, genre] of genres.entries()) {
                if (index + 1 === genres.length) {
                    highlightGenres.textContent += genre.name
                    return
                }
                highlightGenres.textContent += `${genre.name}, `
            }
        }
        fillHighlight()



    } catch (error) {
        console.log(error.message)
    }

}
getMovies()


modalBody.addEventListener('click', (event) => {
    event.stopPropagation()
    modal.classList.add('hidden')
})
btnClose.addEventListener('click', (event) => {
    event.stopPropagation()
    modal.classList.add('hidden')
})
body.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
        modal.classList.add('hidden')
    }
})





const setLightMode = () => {
    root.style.setProperty('--background', '#fff')
    root.style.setProperty('--input-color', '#979797')
    root.style.setProperty('--text-color', '#1b2028')
    root.style.setProperty('--bg-secondary', '#ededed')
    root.style.setProperty('--bg-modal', '#ededed')

    btnTheme.src = './assets/light-mode.svg'
    input.style.backgroundColor = '#fff'

    btnPrev.src = './assets/arrow-left-dark.svg'
    btnNext.src = './assets/arrow-right-dark.svg'

    btnClose.src = './assets/close-dark.svg'

    localStorage.setItem('themeMode', 'light')
}

const setDarkMode = () => {
    root.style.setProperty('--background', '#1B2028')
    root.style.setProperty('--input-color', '#FFFFFF')
    root.style.setProperty('--text-color', '#fff')
    root.style.setProperty('--bg-secondary', '#2D3440')
    root.style.setProperty('--bg-modal', '#2D3440')

    btnTheme.src = './assets/dark-mode.svg'
    input.style.backgroundColor = '#3E434D'

    btnPrev.src = './assets/arrow-left-light.svg'
    btnNext.src = './assets/arrow-right-light.svg'

    btnClose.src = './assets/close.svg'

    localStorage.setItem('themeMode', 'dark')
}

btnTheme.addEventListener('click', () => {
    const themeMode = localStorage.getItem('themeMode')
    if (themeMode === 'dark') {
        setLightMode()
        return
    }
    setDarkMode()
})

const init = () => {
    const themeMode = localStorage.getItem('themeMode')

    if (themeMode === 'dark') {
        setDarkMode()
        return
    }
}
init()