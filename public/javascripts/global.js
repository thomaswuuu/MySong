class MusicsHub {
  /* 
    Initial properties：
    - platform: kkbox, spotify
    - playlist_id: get specific playlist_id tracks of platform
  */
  constructor(platform, playlist_id) {
    this.endpoint = `/tracks?platform=${platform}&id=${playlist_id}`;
  }

  getData() {
    return fetch(this.endpoint)
      .then((response) => response.json())
      .catch((error) => {
        console.log(error);
      });
  }
}

class UserHub {
  constructor() {
    this.endpoint = "/profile/follows";
  }

  getData(track_id) {
    return fetch(`${this.endpoint}?id=${track_id}`)
      .then((response) => response.json())
      .catch((error) => {
        console.log(error);
      });
  }

  setData(obj) {
    return fetch(this.endpoint, {
      method: "POST",
      body: JSON.stringify(obj),
      headers: new Headers({
        "Content-Type": "application/json",
      }),
    })
      .then((response) => response.json())
      .catch((error) => {
        console.log(error);
      });
  }
}

// Music follow event function
const queryFollow = async (e, action) => {
  const hub = new UserHub();
  const enable = e.dataset.enable;
  const track_id = e.dataset.id;
  let followData;

  // action - 0: get, 1: set, 2: profile action
  if (action == 1 || action == 2) {
    const trackInfo = e.parentNode;
    const postData = {};
    postData.enable = enable;
    postData.track_id = track_id;
    if (enable == 1) {
      postData.type = e.dataset.type;
      postData.title = trackInfo.querySelector(".title a").innerText;
      postData.titleLink = trackInfo.querySelector(".title a").href;
      postData.artist = trackInfo.querySelector(".artist a").innerText;
      postData.artistLink = trackInfo.querySelector(".artist a").href;
      postData.cover = trackInfo.querySelector("img").src;
    }
    postData.action = action;
    followData = hub.setData(postData);
  } else {
    followData = hub.getData(track_id);
  }
  followData
    .then((data) => {
      if (data.result == "unauthorized") {
        // user login yet
        window.location.href = "/auth/login";
      } else if (data.result == "ok") {
        // Change follow status
        const status = data.status;
        if (status == 0) {
          e.dataset.enable = status;
          e.innerHTML = "取消<br>追蹤";
        } else if (status == 1) {
          e.dataset.enable = status;
          e.innerHTML = "追蹤";
        } else {
          e.parentNode.style.display = "none";
        }
      } else {
        console.log(data.message);
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

// Music preview event functions
const previewKKBOX = document.querySelector("#previewKKBOX");
const previewSpotify = document.querySelector("#previewSpotify");

const closePreview = () => {
  previewKKBOX.setAttribute("src", "");
  previewSpotify.querySelector("iframe").setAttribute("src", "");
};

const queryPreview = (e) => {
  const previewTitle = document.querySelector(".modal-title");
  const trackInfo = e.parentNode;
  const title = trackInfo.querySelector(".title a").innerText;
  const artist = trackInfo.querySelector(".artist").innerText;
  const id = e.dataset.id;
  const type = e.dataset.type;
  previewTitle.style.width = "100%";
  previewTitle.innerHTML = `${artist} - ${title} `;
  if (type == "KKBOX") {
    let widget_source = `https://widget.kkbox.com/v1/?id=${id}&autoplay=true&type=song&terr=TW&lang=TC&loop=false`;
    previewKKBOX.style.display = "block";
    previewSpotify.style.display = "none";
    previewKKBOX.setAttribute("height", "100px");
    previewKKBOX.setAttribute("src", widget_source);
  } else {
    previewKKBOX.style.display = "none";
    previewSpotify.style.display = "block";
    // Change iframe src content and play tracks
    previewSpotifyController.loadUri(`spotify:track:${id}`);
    previewSpotifyController.play();
  }
};

// Add click event of previewModal close button
const previewClose = document.querySelector("#previewClose");
previewClose.addEventListener("click", () => {
  closePreview();
});
// Add click event of previewModal body
const previewModal = document.querySelector("#previewModal");
previewModal.addEventListener("click", (e) => {
  if (e.target.id == "previewModal") {
    closePreview();
  }
});

// For spotify iframe autoplay
let previewSpotifyController; // spotify preview controller
window.onSpotifyIframeApiReady = (IFrameAPI) => {
  const element = document.getElementById("embed-iframe");
  const options = {
    width: "100%",
    height: "180",
  };
  const callback = (EmbedController) => {
    previewSpotifyController = EmbedController;
  };
  IFrameAPI.createController(element, options, callback);
};

// Header scroll down to hide
let prevScrollpos = window.scrollY;
window.addEventListener("scroll", () => {
  let currentScrollPos = window.scrollY;
  let header = document.querySelector("header");
  if (prevScrollpos >= currentScrollPos || currentScrollPos <= 20) {
    header.style.top = "0";
  } else {
    header.style.top = "-20vh";
  }
  prevScrollpos = currentScrollPos;
});
