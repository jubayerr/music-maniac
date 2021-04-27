const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const SpotifyWebApi = require('spotify-web-api-node')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const port = 5000

app.get('/', (req, res) => {
    res.send('Server is running very well.')
})

app.post('/refresh', (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: 'b3fd0d79c00b459a9f58561f40ba54a4',
        clientSecret: '9813af36187d45faa18bc4e7f925b0d5',
        refreshToken
    })

    spotifyApi
        .refreshAccessToken()
        .then(
            (data) => {
                res.json({
                    accessToken: data.body.accessToken,
                    expiresIn: data.body.expiresIn,
                })
            })
        .catch(err => {
            console.log(err);
            res.sendStatus(400)
        })
})

app.post('/login', (req, res) => {
    const code = req.body.code
    const spotifyApi = new SpotifyWebApi({
        redirectUri: 'http://localhost:3000',
        clientId: 'b3fd0d79c00b459a9f58561f40ba54a4',
        clientSecret: '9813af36187d45faa18bc4e7f925b0d5'
    })

    spotifyApi.authorizationCodeGrant(code)
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in,
            })
        })
        .catch((err) => {
            res.sendStatus(400)
        })
})


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})