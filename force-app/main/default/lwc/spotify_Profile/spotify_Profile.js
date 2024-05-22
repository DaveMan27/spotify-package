import { LightningElement, track } from 'lwc';
import getUserProfile from '@salesforce/apex/Spotify_lwcController.getUserProfile';
import getUserPlaylists from '@salesforce/apex/Spotify_lwcController.getUserPlaylists';
//import openPlaylist from '@salesforce/apex/Spotify_lwcController.openPlaylist';
import getPlaylistTracks from '@salesforce/apex/Spotify_lwcController.getPlaylistTracks';
import getTrackAudioAnalysis from '@salesforce/apex/Spotify_lwcController.getTrackAudioAnalysis';
import getMultiTrackAudioFeatures from '@salesforce/apex/Spotify_lwcController.getMultiTrackAudioFeatures';

export default class Spotify_Profile extends LightningElement {

           userProfile             = {};             // Stores user profile information
           //userPlaylists           = {};             // Stores user playlists information
    @track simplifiedPlaylistArray = [];             // Tracks changes to the playlist array for reactivity
           showPlaylist           = false;          // Controls the visibility of playlist UI section
           
           showTracks              = false;          // Controls the visibility of tracks UI section
    @track simplifiedTrackArray    = [];             // Tracks changes to the track array for reactivity
           trackIds                = '';             // Stores track IDs for re-use in audio analysis callout
           username                = 'daveslaw-us';  // Stores username for re-use in API callouts    
           multiTrackAnalysisArray = [];             // Stores multi-track audio analysis data for reactivity
           showVisualization       = false;
           trackIDs                = '';
           instrumentalArray       = [];
           keyFeatures             = [];
           keyTempoArray           = [];
           comboBoxPlaylistArray   = [];
           data                    = [];
           options                 = [];
           selectedOption          = '';
      //isLoading = true;
    isLoading;
    columns = [
        { label: 'Track #', fieldName: 'counter', type: 'number' },
        { label: 'Song', fieldName: 'song_external_link', type: 'url', typeAttributes: { label: { fieldName: 'name' }, target: '_blank' } },
        { label: 'Artists', fieldName: 'artist_external_link', type: 'url', typeAttributes: { label: { fieldName: 'artists_nonArray' }, target: '_blank' } },
        { label: 'Album', fieldName: 'album_external_link', type: 'url', typeAttributes: { label: { fieldName: 'album' }, target: '_blank' } }
    ]; 
    
        
        
    value = 'inProgress';
    async connectedCallback() {
        await this.handleComboboxPlaylist();
        console.log('ComboBox array: ', this.comboBoxPlaylistArray);
    }

    async handleComboboxPlaylist() {
        try {
            let userPlaylists = await getUserPlaylists({ username: this.username });
            userPlaylists = JSON.parse(userPlaylists);
            this.comboBoxPlaylistArray = userPlaylists.items.map(({ name, id }) => ({ label: name, value: id }));

        } catch (error) {
            console.error('Error getting user profile', error);
        }

        return this.comboBoxPlaylistArray;
    }

    async handleComboBoxChange(event) {
        this.showVisualization = false;
        this.multiTrackAnalysisArray = [];
              this.showTracks              = false;
        const itemId                       = event.detail.value;
        console.log(`Clicked item ID: ${itemId}`);
        try {
            let tracksList = await getPlaylistTracks({ playListID: itemId });
            tracksList = JSON.parse(tracksList);
            console.log('Tracks list: ', tracksList);
            
            if (tracksList.items.length > 0) {
                this.trackIDs = tracksList.items.map((item) => item.track.id).join(',');            
                console.log(`Track IDs: ${this.trackIDs}`);
                let trackFeatures = await getMultiTrackAudioFeatures({ trackIDs: this.trackIDs });
                trackFeatures = JSON.parse(trackFeatures);
                console.log('Track features: ', trackFeatures);            
                this.simplifiedTrackArray = this.loadSimplifiedTrackArray(tracksList);
                console.log('Simplified track Array: ', JSON.parse(JSON.stringify(this.simplifiedTrackArray)));
                this.data = this.loadData();
                console.log('Data: ', this.data);
                
                //Generate Data for Visualizations
                this.loadKeyData(trackFeatures);
                this.loadInstrumentalData(trackFeatures);
                
                this.showPlaylist = true;
            }
        } catch (error) {
            console.error('Error getting user profile', error);
        }
    }

    // Fetch and process user profile data
    async handleGetProfile() {
        try {
            this.userProfile = await getUserProfile({ username: this.username});
            this.userProfile = JSON.parse(this.userProfile);
            console.log(this.userProfile);
        } catch (error) {
            console.error('Error getting user profile', error);
        }
    }
    
    handleShowVisualization() {
        
        this.showVisualization = !this.showVisualization;       
    }

    /*
        Functions to process data for visualisations  
    */

    loadInstrumentalData(trackFeatures) {
        let instrumentalData = trackFeatures.audio_features.map(({ instrumentalness, id }) => ({ instrumentalness, id }));
        console.log('Instrumental data: ', instrumentalData);
        this.instrumentalArray = this.generateFrequencyArray(instrumentalData, 'instrumentalness');
        console.log('Instrumental array: ', this.instrumentalArray);
    }

    loadKeyData(trackFeatures) {
        let keyData = trackFeatures.audio_features.map(({ key, id }) => ({ key, id }));
        console.log('Key data: ', keyData);
        this.keyFeatures = this.generateFrequencyArray(keyData, 'key');
        console.log('Key features: ', this.keyFeatures);
    }
    
    loadSimplifiedTrackArray(tracksList) {
        let trackArray = tracksList.items.map(({ track }) => {
            // Destructure the required properties from the track, including nested destructuring for external_urls
            const { name, artists, album, id, external_urls: { spotify: external_link }, href } = track;
            
            // Extract the first artist's href and external link
            const artist_href = artists[0].href;
            const artist_external_link = artists[0].external_urls.spotify;
            
            // Map through artists to get an array of artist names
            const artistNames = artists.map(artist => artist.name);
            
            // Join artist names to create a string representation
            const artists_nonArray = artistNames.join(', ');
            
            return {
                name,
                artists: artistNames,
                artists_nonArray,
                artist_href, // Include the first artist's href
                artist_external_link, // Include the first artist's external link
                album: album.name,
                album_href: album.href, // Include the album's href
                album_external_link: album.external_urls.spotify, // Include the album's external link
                id,
                song_external_link: external_link,
                song_href: href
            };
        });
    
        return trackArray;
    }
    
    // Process playlists data to simplify and prepare for display
    handlePlaylistArray() {
        this.simplifiedPlaylistArray = this.userPlaylists.items.map(({ href, name, id, images }) => ({
            link: href,
            name,
            id,
            image: images.length > 0 ? images[0].url : 'defaultImageUrl' // Assuming 'defaultImageUrl' is a placeholder you have for playlists without an image
          }));
          
          console.log(JSON.parse(JSON.stringify(this.simplifiedPlaylistArray)));
    }


    async handleTrackSelect(event) {
        const trackId = event.detail;
        console.log(`Clicked track ID: ${trackId}`);
        try {
            let trackAnalysis = await getTrackAudioAnalysis({ trackID: trackId });
            trackAnalysis = JSON.parse(trackAnalysis);
            console.log('Track analysis: ', trackAnalysis);
        }
        catch (error) {
            console.error('Error getting user profile', error);
        }
    }

    generateAudioAnalysisArray(tracksList) {
        tracksList.items.forEach(item => {
            getTrackAudioAnalysis({ trackID: item.track.id })
               .then(trackAnalysis => {
                   trackAnalysis = JSON.parse(trackAnalysis);
                   this.multiTrackAnalysisArray.push(trackAnalysis);                             
                })
               .catch(error => {
                    console.error('Error getting track analysis', error);
                })
        })
        console.log('Working function');
    }

    generateFrequencyArray(audioFeatures, propertyName) {
        // Define the mapping from integers to musical notations only if needed
        const keyMapping = propertyName === 'key' ? {
            0: 'C', 1: 'C#/Db', 2: 'D', 3: 'D#/Eb', 4: 'E', 5: 'F',
            6: 'F#/Gb', 7: 'G', 8: 'G#/Ab', 9: 'A', 10: 'A#/Bb', 11: 'B'
        } : null;
    
        // Count the frequency of each property value
        const frequency = audioFeatures.reduce((acc, feature) => {
            const value = keyMapping ? keyMapping[feature[propertyName]] : feature[propertyName];
            acc[value] = (acc[value] || 0) + 1;
            return acc;
        }, {});
    
        // Convert the frequency object into an array of objects with 'key' and 'frequency'
        const frequencyArray = Object.entries(frequency).map(([key, freq]) => ({
            [propertyName]: key, // Use computed property name here
            frequency: freq
        }));
    
        // Convert the array to a JSON string
        return JSON.stringify(frequencyArray, null, 2);
    }

    createKeyTempArray(audioFeatures) {
        return audioFeatures.map(({ key, tempo }) => ({ key, tempo }));
    }

    loadData() {
        return this.simplifiedTrackArray.map((row, index) => {
            return {
                id: row.id,
                // Add a counter value based on the track's index
                counter: index + 1,
                displayValues: this.columns.map(col => {
                    if (col.type === 'url') {
                        return {
                            url: row[col.fieldName],
                            label: row[col.typeAttributes.label.fieldName],
                            target: col.typeAttributes.target
                        };
                    } else if (col.fieldName === 'counter') {
                        // Handle the counter as a special case
                        return { label: `${index + 1}` };
                    } else {
                        return { label: row[col.fieldName] };
                    }
                })
            };
        });
    }

    sortArray(){
        debugger;
        console.log(this.data);
        this.data.sort((a, b) => {
            // Comparing two names in the array in lowercase for case-insensitive sorting
            let nameA = a.displayValues[1].label.toLowerCase();
            let nameB = b.displayValues[1].label.toLowerCase();   
          
            if (nameA < nameB) {
              return -1; // nameA comes first
            }
            if (nameA > nameB) {
              return 1; // nameB comes first
            }
          
                // names must be equal
            return 0;
          });
    }
    
    
    
    
}