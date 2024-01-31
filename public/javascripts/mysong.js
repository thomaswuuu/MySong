/* Initailize to fetch each platform tracks data */
const spinner = document.querySelector("#spinner");
const charts = document.querySelector("#charts");
const tracks = document.querySelector("#tracks");
const previewKKBOX = document.querySelector("#previewKKBOX");
const previewSpotify = document.querySelector("#previewSpotify");
const kkboxes = document.querySelectorAll(".kkbox");
const spotifies = document.querySelectorAll(".spotify");
let previewSpotifyController; // spotify preview controller

const queryFollow = async (e, action) => {
  const hub = new UserHub();
  if (action == 1) {
    const status = e.dataset.status;
    const type = e.dataset.type;
    const track_id = e.dataset.id;
    const trackInfo = e.parentNode;
    const title = trackInfo.querySelector(".title a").innerText;
    const titleLink = trackInfo.querySelector(".title a").href;
    const artist = trackInfo.querySelector(".artist a").innerText;
    const artistLink = trackInfo.querySelector(".artist a").href;
    const cover = trackInfo.querySelector("img").src;
    const followData = hub.setData({
      status,
      type,
      track_id,
      title,
      titleLink,
      artist,
      artistLink,
      cover,
    });
    followData
      .then((data) => {
        if (data.result == "unauthorized") {
          // user login yet
          window.location.href = "/auth/login";
        } else if (data.result == "ok") {
          // Change follow status
          if (status == 1) {
            e.dataset.status = 0;
            e.innerHTML = "取消<br>追蹤";
          } else {
            e.dataset.status = 1;
            e.innerHTML = "追蹤";
          }
        } else {
          console.log(data.result);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    const track_id = e.dataset.id;
    const followData = hub.getData(track_id);
    followData
      .then((data) => {
        const status = data.status;
        if (status == 1) {
          e.dataset.status = 0;
          e.innerHTML = "取消<br>追蹤";
        } else {
          e.dataset.status = 1;
          e.innerHTML = "追蹤";
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

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

const queryTracks = (e) => {
  // Get tracks data
  const type = e.dataset.type;
  const playlist_id = e.dataset.id;
  const chartCover = e.childNodes[1].src;
  const chartTitle = e.childNodes[3].innerText;
  const borderStyle = type == "KKBOX" ? "kkbox-border" : "spotify-border";
  const hub = new MusicsHub(type, playlist_id);
  const tracksData = hub.getData();

  spinner.style.display = "flex";
  charts.style.display = "none";
  tracks.style.display = "none";

  tracksData
    .then((data) => {
      if (data.length) {
        tracks.innerHTML = `<h4>
                            <img src="${chartCover}"/>
                            <span>${type} ${chartTitle}</span>
                          </h4>`;
        data.forEach((track) => {
          let id = track.track_id;
          let rankNo = track.rankNo;
          let title = track.title;
          let album = track.album;
          let artist = track.artist;
          let titleLink = track.titleLink;
          let albumLink = track.albumLink;
          let artistLink = track.artistLink;
          let cover = track.cover;
          let release_date = track.release_date;
          tracks.innerHTML += `<div class="track-box ${borderStyle} fade-in">
                              <p>${rankNo}</p>
                              <img src=${cover} />
                              <div class="title">
                                <a href="${titleLink}" target="_blank">${title}</a>
                                <div class="artist">
                                  <a href="${artistLink}" target="_blank">${artist}</a>
                                </div>
                              </div>
                              <div class="album">
                                <a href="${albumLink}" target="_blank">${album}</a>
                              </div>
                              <div class="date">${release_date}</div>
                              <div class="follow" data-status=1
                                    data-type="${type}" data-id="${id}">
                                追蹤
                              </div>
                              <div class="preview"
                                    data-bs-toggle="modal"
                                    data-type="${type}" data-id="${id}"
                                    data-bs-target="#previewModal">
                                試聽
                              </div>
                            </div>`;
        });
        tracks.innerHTML += `<p class="back">返回</p>`;
        // Add click event to follow
        const follows = document.querySelectorAll(".follow");
        follows.forEach((follow) => {
          queryFollow(follow, 0); // Get user following status
          follow.addEventListener("click", () => {
            queryFollow(follow, 1); // Change user following status
          });
        });

        // Add click event to preview
        const previews = document.querySelectorAll(".preview");
        previews.forEach((preview) => {
          preview.addEventListener("click", () => {
            queryPreview(preview);
          });
        });
        // Add click event to back text click
        const back = document.querySelector(".back");
        back.addEventListener("click", () => {
          charts.style.display = "flex";
          tracks.style.display = "none";
          back.style.display = "none";
          window.location.href = "#charts";
        });
        // display tracks results
        spinner.style.display = "none";
        tracks.style.display = "flex";
      }
    })
    .catch((err) => {
      console.log(err);
    });

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
};

// Add click event of chart-box
const chartBoxes = document.querySelectorAll(".chart-box");
chartBoxes.forEach((chartBox) => {
  chartBox.addEventListener("click", () => {
    queryTracks(chartBox);
  });
});
// Display charts list
spinner.style.display = "none";
charts.style.display = "flex";

// For spotify iframe autoplay
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
