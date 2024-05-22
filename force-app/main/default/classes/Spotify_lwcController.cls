public class Spotify_lwcController {
    
    @AuraEnabled(cacheable=true)
    public static string getUserProfile(string username) {
        HttpResponse apiResponse = Spotify_Utility.calloutHandler('users/' + username);
        system.debug('apiResponse: ' + apiResponse);
        return apiResponse.getBody();
    }
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          // ***********************************************************************************************************
    @AuraEnabled(cacheable=true)
    public static string getUserPlaylists(string username) {
        HttpResponse apiResponse = Spotify_Utility.calloutHandler('users/' + username + '/playlists?limit=50&offset=0');
        system.debug('apiResponse: ' + apiResponse);
        return apiResponse.getBody();
    }

    @AuraEnabled(cacheable=true)
    public static string openPlaylist(string playListID) {
        HttpResponse apiResponse = Spotify_Utility.calloutHandler('playlists/' + playListID);
        system.debug('apiResponse: ' + apiResponse);
        return apiResponse.getBody();
    }

    @AuraEnabled(cacheable=true)
    public static string getPlaylistTracks(string playListID) {
        HttpResponse apiResponse = Spotify_Utility.calloutHandler('playlists/' + playListID + '/tracks');
        system.debug('apiResponse: ' + apiResponse);
        return apiResponse.getBody();
    }

      // ***********************************************************************************************************
      //  *  Track APIs
      // ***********************************************************************************************************
    
    @AuraEnabled(cacheable=true)
    public static string getTrackInfo(string trackID) {
        HttpResponse apiResponse = Spotify_Utility.calloutHandler('tracks/' + trackID);
        system.debug('apiResponse: ' + apiResponse);
        return apiResponse.getBody();
    }

    @AuraEnabled(cacheable=true)
    public static string getMultiTrackInfo(string trackIDs) {
        HttpResponse apiResponse = Spotify_Utility.calloutHandler('tracks/?ids=' + trackIDs);
        system.debug('apiResponse: ' + apiResponse);
        return apiResponse.getBody();
    }

    @AuraEnabled(cacheable=true)
    public static string getTrackAudioFeatures(string trackID) {
        HttpResponse apiResponse = Spotify_Utility.calloutHandler('audio-features/' + trackID);
        system.debug('apiResponse: ' + apiResponse);
        return apiResponse.getBody();
    }

    @AuraEnabled(cacheable=true)
    public static string getMultiTrackAudioFeatures(string trackIDs) {
        HttpResponse apiResponse = Spotify_Utility.calloutHandler('audio-features/?ids=' + trackIDs);
        system.debug('apiResponse: ' + apiResponse);
        return apiResponse.getBody();
    }

    @AuraEnabled(cacheable=true)
    public static string getTrackAudioAnalysis(string trackID) {
        HttpResponse apiResponse = Spotify_Utility.calloutHandler('audio-analysis/' + trackID);
        system.debug('apiResponse: ' + apiResponse);
        return apiResponse.getBody();
    }

    





    /*@AuraEnabled(cacheable=true)
    public static string getUserAlbums() {
        HttpResponse apiResponse = Spotify_Utility.calloutHandler('daveslaw-us/albums');
        system.debug('apiResponse: ' + apiResponse);
        return apiResponse.getBody();
    }*/

    
}