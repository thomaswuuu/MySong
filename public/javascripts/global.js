class MusicsHub {
  /* 
    Initial properties：
    - platform: kkbox, spotify
    - playlist_id: get specific playlist_id tracks of platform
  */
  constructor(platform, playlist_id) {
    this.endpoint = `/getTracks?platform=${platform}&id=${playlist_id}`;
  }

  get data() {
    return this.getData(this.endpoint);
  }

  getData(endpoint) {
    return fetch(endpoint)
      .then((response) => response.json())
      .catch((error) => {
        console.log(error);
      });
  }
}
