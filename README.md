# MySong
使用MySong App可取得KKBOX和Spotify的各平台音樂排行榜，顯示各類排行榜列表和歌曲清單，使用者註冊會員並登入後可追蹤自己所喜愛的歌曲，進入個人檔案後即可顯示目前所追蹤的各平台歌曲列表。

## 功能介紹
### 1. 首頁
列出KKBOX和Spotify音樂排行榜列表

<img width="766" alt="homeKKBOX" src="https://github.com/thomaswuuu/MySong/assets/5268096/d2faefbc-bb52-4729-88d3-21dc43533ea7">
<img width="767" alt="homeSpotify" src="https://github.com/thomaswuuu/MySong/assets/5268096/1b2a8d86-2e2d-4a43-a80d-0ea53c56f118">

### 2. 第三方登入與追蹤

透過Google帳號進行登入

![googleLogin](https://github.com/thomaswuuu/MySong/assets/5268096/e6cd9b6b-2f04-4fa5-9f70-001fad650ecf)

按下右方的追蹤鍵即可進行歌曲追蹤

![googleLoginAndFollow](https://github.com/thomaswuuu/MySong/assets/5268096/a22adb9e-4e81-46fd-b0fd-255617658355)

### 3. 註冊、登入與追蹤

註冊新使用者後進行登入

![signupAndLogin](https://github.com/thomaswuuu/MySong/assets/5268096/b1eb2d7e-816b-4d46-b913-86b1a05b152f)

登入完成後進行歌曲追蹤

![loginAndFollow](https://github.com/thomaswuuu/MySong/assets/5268096/6f7bb97c-3854-4e36-9b7a-a75beda2d315)

### 4. 登出系統與切換使用者

![changeUser](https://github.com/thomaswuuu/MySong/assets/5268096/ad456b18-cc62-4005-a6e8-31cd3abc72db)

#### 網站連結：~~https://mysong.thomas-wu.com~~ (因AWS費用，已停止服務)

## 系統架構
產品完成後會透過Github Action自動化部屬至AWS的托管服务中，再經由Dockerfile和Docker Compose工具啟動下列三個container並執行各自的服務：
* myNginx：網頁伺服器，負責反向代理。
* MySong：歌曲追蹤服務，處理音樂排行榜和用戶資訊。
* myMongoDB：資料庫，儲存排行榜和用戶資訊。

最後將已經部屬好的網站設定至cloudfare的網域代理服務，讓使用者可以透過提供的SSL/TLS加密服務進行HTTPS安全連線。
### 系統架構圖
<img width="767" alt="歌曲追蹤平台架構圖" src="https://github.com/thomaswuuu/MySong/assets/5268096/0d278b5a-19f3-4990-baeb-abd88b57598c">

## 使用技術
* **網頁伺服器(反向代理)**：Nginx
* **Web應用框架**：Node.js/Express.js
* **資料庫**：MongoDB/mongoose
* **身分驗證**：Passport.js + JWT
  * **第三方登入**：Google OAuth2
  * **本地註冊登入**：密碼使用bcrypt加密
* **第三方API**：KKBOX OpenAPI、Spotify Web API
* **容器化**：Dockerfile with Docker Compose 
* **自動化部屬**：Github Action
* **API文件**：Swagger UI Express

## Schema 介紹
### chart
```
{
  id: { type: String, require: true },        // 各排行榜播放清單ID
  chartNo: { type: Number, require: true },   // 取得排行榜播放清單的順序(用於方便排序)
  title: { type: String, require: true },     // 播放清單名稱
  cover: { type: String, require: true },     // 播放清單封面
}
```
### track
```
{
  id: { type: String, require: true },            // 各排行榜播放清單ID
  track_id: { type: String, require: true },      // 播放清單中的歌曲ID
  rankNo: { type: Number, require: true },        // 播放清單中的歌曲排行
  title: { type: String, require: true },         // 播放清單中的歌曲名稱
  album: { type: String, require: true },         // 播放清單中的專輯名稱
  artist: { type: String, require: true },        // 播放清單中的歌曲表演者
  titleLink: { type: String, require: true },     // 播放清單中的歌曲連結
  albumLink: { type: String, require: true },     // 播放清單中的專輯連結
  artistLink: { type: String, require: true },    // 播放清單中的歌曲表演者連結
  cover: { type: String, require: true },         // 播放清單中的歌曲封面
  release_date: { type: String, require: true },  // 播放清單中的歌曲發布日期
}
```
### user

```
{
  name: {             // 使用者名稱
    type: String,required: true,
    minLength: 3,
    maxLength: 255,
  },
  profileID: {        // 第三方登入時所取得的個人檔案ID
    type: String,
  },
  thumbnail: {        // 第三方登入時所取得的個人檔案圖片
    type: String,
  },
  email: {            // 登入時所使用的電子信箱
    type: String,
  },
  password: {         // 登入時所需的密碼，註冊後會使用bcrypt進行加密
    type: String,
    minLength: 8,
    maxLength: 1024,
  },
  date: {             // 建立使用者的日期時間
    type: Date,
    default: Date.now,
  },
}
```
### follow
```
{
  user_id: { type: String, require: true },     // 各個使用者的ID
  type: { type: String, require: true },        // 平台類別(KKBOX或Spotify)
  track_id: { type: String, require: true },    // 被追蹤歌曲的ID
  title: { type: String, require: true },       // 被追蹤歌曲的名稱
  titleLink: { type: String, require: true },   // 被追蹤歌曲的名稱連結
  artist: { type: String, require: true },      // 被追蹤歌曲的表演者
  artistLink: { type: String, require: true },  // 被追蹤歌曲的表演者連結
  cover: { type: String, require: true },        // 被追蹤歌曲的封面
}
```
## Swagger API 文件
### 1. 登入與驗證
使用API文件前會先使用Postman進行API登入驗證，透過POST的方法將帳號和密碼以x-www-form-data格式送出，格式如下圖所示。

<img width="767" alt="apiLogin" src="https://github.com/thomaswuuu/MySong/assets/5268096/54e50102-b2c9-46fb-b36e-5d2f258dc758">

登入成功取得JWT的Bearer token後，將token設定至Swagger UI的Authorize中，下圖範例以最高權限使用者進行登入。

![apiAuth](https://github.com/thomaswuuu/MySong/assets/5268096/00f9886d-5f7d-4f6a-870c-8407b773e890)

### 2. 取得音樂排行榜列表
Method：GET

URL：https://mysong.thomas-wu.com/api/charts?platform=KKBOX

![apiCharts](https://github.com/thomaswuuu/MySong/assets/5268096/9c173726-da4e-44d6-b9ba-655ba62aece8)

### 3. 取得特定排行榜歌曲列表
Method：GET

URL：https://mysong.thomas-wu.com/api/charts?platform=KKBOX&id=LZPhK2EyYzN15dU-PT

![apiTracks](https://github.com/thomaswuuu/MySong/assets/5268096/f4e1d00c-ad52-4875-9f01-de16cb9530a8)

### 4. 取得所有使用者
Method：GET

URL：https://mysong.thomas-wu.com/api/users

![apiUser](https://github.com/thomaswuuu/MySong/assets/5268096/613f17c2-b348-4982-98a4-b584abb9db43)


### 5. 取得使用者追蹤的歌曲列表
Method：GET

URL：https://mysong.thomas-wu.com/api/follows?platform=KKBOX

![apiFollows](https://github.com/thomaswuuu/MySong/assets/5268096/01bd966d-33e5-4faf-9ab2-e36f58369b7e)

Swagger API文件連結：~~https://mysong.thomas-wu.com/api-docs~~ (因AWS費用，已停止服務)

## 執行步驟與設定
### 取得程式碼
`$ git clone https://github.com/thomaswuuu/MySong.git `
### 進入資料夾
`$ cd Mysong`
### 環境變數設定
#### 本地端
建立.env檔後加入下列變數：

`$ touch .env`

```
# Host and Port Setting
HOST='YOUR SERVER HOST'
PORT='YOUR SERVER PORT'
# MongoDB Setting
MONGO_URI=mongodb://myMongoDB:27017
MONGO_DATABASE='YOUR DATABASE NAME'
MONGO_ADMIN='YOUR DATABASE ADMIN USER NAME'
MONGO_PASSWORD='YOUR DATABASE PASSWORD'
# KKBOX Open API
KKBOX_CLIENT_ID='YOUR KKBOX CLIENT ID'
KKBOX_CLIENT_SECRET='YOUR KKBOX CLIENT SECRET'
# Spotify Web API
SPOTIFY_CLIENT_ID='YOUR SPOTIFY CLIENT ID'
SPOTIFY_CLIENT_SECRET='YOUR SPOTIFY CLIENT SECRET'
# Google Oauth2
GOOGLE_CLIENT_ID='YOUR GOOGLE CLIENT ID'
GOOGLE_CLIENT_SECRET='YOUR GOOGLE CLIENT SECRET'
# Sessoin Secret
SESSION_SECRET=YOUR SESSION SECRET'
# JWT Secret
JWT_SECRET='YOUR JWT SECRET'
# Admin user information
ADMIN_NAME='YOUR ADMIN USER NAME'
ADMIN_EMAIL='YOUR ADMIN USER EMAIL'
ADMIN_PASSWORD='YOUR ADMIN PASSWORD'
```
#### 雲端託管平台
請在雲端平台的環境變數設定中加入上述.env中的變數。

### 啟動與關閉指令
#### 本地端
啟動服務(背景執行)
```
$ docker-compose -f docker-compose-dev.yml up -d
```
關閉服務
```
$ docker-compose -f docker-compose-dev.yml down
```
#### 雲端平台
上傳至github後會自動化部屬至AWS託管服務的Docker環境中執行，
請參考 .github/workflows資料夾中的deploy.yml。
