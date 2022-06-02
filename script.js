const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


const player =$('.player')
const playlist = $('.playlist')
const cd=$('.cd')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const playBtn=$('.btn.btn-toggle-play')
const progress = $('#progress')
const nextBtn=$('.btn-next')
const prevBtn=$('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Lalala',
            singer: 'Soobin Hoàng Sơn',
            path: './assets/music/song2.mp3',
            image: './assets/img/image.jpg'
        },
        {

            name: 'Đi để trở về',
            singer: 'Soobin Hoàng Sơn',
            path: './assets/music/song1.mp3',
            image: './assets/img/image.jpg'
        },
        {
            name: 'Say Goodbye',
            singer: 'Soobin Hoàng Sơn',
            path: './assets/music/song3.mp3',
            image: './assets/img/image.jpg'
        },
        {
            name: 'Và thế là hết',
            singer: 'Soobin Hoàng Sơn',
            path: './assets/music/song4.mp3',
            image: './assets/img/image.jpg'
        },
        {
            name: 'Vui đi em',
            singer: 'Soobin Hoàng Sơn',
            path: './assets/music/song5.mp3',
            image: './assets/img/image.jpg'
        },
        {
            name: 'Baby',
            singer: 'Justin Bieber',
            path: './assets/music/song6.mp3',
            image: './assets/img/image.jpg'
        },
        {
            name: 'Let me love you',
            singer: 'Justin Bieber',
            path: './assets/music/song7.mp3',
            image: './assets/img/image.jpg'
        },
        {
            name: 'Love yourself',
            singer: 'Justin Bieber',
            path: './assets/music/song8.mp3',
            image: './assets/img/image.jpg'
        },
        {
            name: 'Despacito',
            singer: 'Justin Bieber',
            path: './assets/music/song9.mp3',
            image: './assets/img/image.jpg'
        }

    ],
    render: function () {
        const htmls = this.songs.map((song,index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active':'' }" data-index="${index}" >
                <div class="thumb" style="background-image: url('https://i.ytimg.com/vi/jTLhQf5KJSc/maxresdefault.jpg')">
                </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function () {
        const _this = this
        const cdWidth=cd.offsetWidth
        const cdThumbAnimate= cdThumb.animate([{
            transform: 'rotate(360deg)'
        }],
        {
            duration: 10000,
            iterations: Infinity,
        }
    )

        cdThumbAnimate.pause()
        document.onscroll = function () {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth-scrollTop
            cd.style.width = newCdWidth>0? newCdWidth +'px' : 0
            cd.style.opacity = newCdWidth/cdWidth
        }

        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()
            }
            else{
                audio.play()
        }
        audio.onplay = function(){
            _this.isPlaying=true
            player.classList.add("playing")
            cdThumbAnimate.play()
        }
        audio.onpause = function(){
            _this.isPlaying=false
            player.classList.remove("playing")
            cdThumbAnimate.pause()
        }
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercentage =Math.floor(audio.currentTime / audio.duration*100)
                progress.value =progressPercentage
            }
        }
        }

        progress.oninput = function(e){
            const seekTime = audio.duration /100 * e.target.value
            musicAudio.currentTime = seekTime
        }

        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandom()
            }else{
                _this.nextSong()
            }

            audio.play()
            _this.render()
            _this.scrolltoActiveSong()
        }
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandom()
            }else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrolltoActiveSong()
            
        }
        randomBtn.onclick=function(){
            _this.isRandom=!_this.isRandom
            randomBtn.classList.toggle('active',_this.isRandom)
            
        }
        repeatBtn.onclick=function(e){
            _this.isRepeat=!_this.isRepeat
            repeatBtn.classList.toggle('active',_this.isRepeat)
        }
        audio.onended = function(){
            if(_this.isRepeat){
                audio.play()
            }else {
                nextBtn.click()
            }
        }
        playlist.onclick = function (e) {
            const songNode = e.target.closest(".song:not(.active)");
      
            if (songNode || e.target.closest(".option")) {

              if (songNode) {
                    _this.currentIndex=Number(songNode.dataset.index)
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
              }
      

              if (e.target.closest(".option")) {
              }
            }
          };

    },
    scrolltoActiveSong: function(){
        setTimeout(()=>{
            $('.song.active').scrollintoView(
                behavior= 'smooth',
                block= 'center'
            )
        },300)
    },
    loadCurrentSong:function(){

        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path

    },
    nextSong:function(){
        this.currentIndex++
        if (this.currentIndex>=this.songs.length){
            this.currentIndex=0
        }
        this.loadCurrentSong()
    },
    prevSong:function(){
        this.currentIndex--
        if (this.currentIndex<0){
            this.currentSong= this.songs.length-1
        }
        this.loadCurrentSong()
    },
    playRandom: function(){
        let newIndex
        do{
            newIndex= Math.floor(Math.random() * this.songs.length)
        }while(newIndex===this.currentIndex)
            this.currentIndex =newIndex
            this.loadCurrentSong()
        },

    start: function() {
        this.handleEvents()
        this.defineProperties()
        this.loadCurrentSong()
        this.render()
        this.nextSong()
        this.prevSong()
        this.playRandom()
    }
}

app.start()

  