import { LightningElement, api } from 'lwc';

export default class SpotifyTracksList extends LightningElement {

    @api tracks = [];

    handleTrackClick(event) {
        const trackId = event.currentTarget.dataset.id;
        // Optionally, fire an event to the parent component if needed
        const selectEvent = new CustomEvent('trackselect', {
            detail: trackId
        });
        this.dispatchEvent(selectEvent);
    }
}