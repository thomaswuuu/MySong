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
    this.endpoint = "/follows";
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
