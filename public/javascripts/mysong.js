/* Initailize to fetch each platform tracks data */
const spinner = document.querySelector("#spinner");
const charts = document.querySelector("#charts");
const tracks = document.querySelector("#tracks");

const queryTracks = (e) => {
  // Get tracks data
  const playlist_id = e.id;
  const type = e.dataset.type;
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
                              <div class="follow" data-enable=1
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
          window.location.href = `#${playlist_id}`;
        });
        // display tracks results
        spinner.style.display = "none";
        tracks.style.display = "flex";
      }
    })
    .catch((err) => {
      console.log(err);
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
