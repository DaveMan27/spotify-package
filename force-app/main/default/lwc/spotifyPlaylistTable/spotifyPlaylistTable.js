import { LightningElement, api } from 'lwc';

export default class SpotifyPlaylistTable extends LightningElement {
    @api playlists = [];

    showPlaylist = false;

    handleClick(event) {
        const playlistId = event.currentTarget.dataset.id;
        // Fire a custom event to notify the parent component
        const selectEvent = new CustomEvent('playlistselect', {
            detail: playlistId
        });
        this.dispatchEvent(selectEvent);

        this.showPlaylist = true;
    }
}