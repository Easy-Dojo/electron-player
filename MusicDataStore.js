const Store = require("electron-store")
const { v4: uuidv4 } = require('uuid');
const path = require("path")

class DataStore extends Store {
    constructor(setting) {
        super(setting)
        this.tracks = this.getTracks() || []
    }
    saveTracks() {
        this.set('tracks', this.tracks)
        return this
    }
    getTracks() {
        return this.get('tracks') || []
    }
    addTracks(tracks) {
        const tracksWithProps = tracks
            .filter(trackPath => {
                const currentTracksPath = this.getTracks().map(track => track.path)
                return currentTracksPath.indexOf(trackPath) < 0
            })
            .map(trackPath => ({
                id: uuidv4(),
                path: trackPath,
                fileName: path.basename(trackPath)
            }))
        this.tracks = [...this.tracks, ...tracksWithProps]
        return this.saveTracks()
    }
}

module.exports = DataStore
