@isTest
private class Spotify_TestClass{   
    
   
    @isTest
    static void testGetAccessToken() {
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new SpotifyTokenMock());
        
        HttpResponse response = Spotify_Utility.getAccessToken();
        
        System.assertEquals(200, response.getStatusCode());
        System.assert(!String.isEmpty(response.getBody()), 'Response body should not be empty');
        Test.stopTest();
    }
    
    @isTest
    static void testApiCallout() {
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new SpotifyApiMock());
        
        String accessToken = 'testAccessToken';
        String endpoint = '/me';
        HttpResponse response = Spotify_Utility.apiCallout(accessToken, endpoint);
        
        System.assertEquals(200, response.getStatusCode());
        System.assert(!String.isEmpty(response.getBody()), 'Response body should not be empty');
        Test.stopTest();
    }
    
    @isTest
    static void testCalloutHandler() {
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new SpotifyTokenMock());
        Test.setMock(HttpCalloutMock.class, new SpotifyApiMock());
        
        String endpoint = '/me';
        HttpResponse response = Spotify_Utility.calloutHandler(endpoint);
        
        System.assertEquals(200, response.getStatusCode());
        System.assert(!String.isEmpty(response.getBody()), 'Response body should not be empty');
        Test.stopTest();
    }
    
    @isTest
    static void testGetUserProfile() {
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new SpotifyApiMock());
        
        String username = 'testuser';
        String response = Spotify_lwcController.getUserProfile(username);
        
        System.assert(!String.isEmpty(response), 'Response body should not be empty');
        Test.stopTest();
    }
    
    @isTest
    static void testGetUserPlaylists() {
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new SpotifyApiMock());
        
        String username = 'testuser';
        String response = Spotify_lwcController.getUserPlaylists(username);
        
        System.assert(!String.isEmpty(response), 'Response body should not be empty');
        Test.stopTest();
    }
    
    @isTest
    static void testOpenPlaylist() {
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new SpotifyApiMock());
        
        String playlistId = 'testPlaylist';
        String response = Spotify_lwcController.openPlaylist(playlistId);
        
        System.assert(!String.isEmpty(response), 'Response body should not be empty');
        Test.stopTest();
    }
    
    @isTest
    static void testGetPlaylistTracks() {
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new SpotifyApiMock());
        
        String playlistId = 'testPlaylist';
        String response = Spotify_lwcController.getPlaylistTracks(playlistId);
        
        System.assert(!String.isEmpty(response), 'Response body should not be empty');
        Test.stopTest();
    }

    @isTest
    static void testGetTrackInfo() {
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new SpotifyApiMock());
        
        String trackId = 'testTrack';
        String response = Spotify_lwcController.getTrackInfo(trackId);
        
        System.assert(!String.isEmpty(response), 'Response body should not be empty');
        Test.stopTest();
    }
    
    @isTest
    static void testGetMultiTrackInfo() {
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new SpotifyApiMock());
        
        String trackIds = 'testTrack1,testTrack2';
        String response = Spotify_lwcController.getMultiTrackInfo(trackIds);
        
        System.assert(!String.isEmpty(response), 'Response body should not be empty');
        Test.stopTest();
    }
    
    @isTest
    static void testGetTrackAudioFeatures() {
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new SpotifyApiMock());
        
        String trackId = 'testTrack';
        String response = Spotify_lwcController.getTrackAudioFeatures(trackId);
        
        System.assert(!String.isEmpty(response), 'Response body should not be empty');
        Test.stopTest();
    }
    
    @isTest
    static void testGetMultiTrackAudioFeatures() {
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new SpotifyApiMock());
        
        String trackIds = 'testTrack1,testTrack2';
        String response = Spotify_lwcController.getMultiTrackAudioFeatures(trackIds);
        
        System.assert(!String.isEmpty(response), 'Response body should not be empty');
        Test.stopTest();
    }
    
    @isTest
    static void testGetTrackAudioAnalysis() {
        Test.startTest();
        Test.setMock(HttpCalloutMock.class, new SpotifyApiMock());
        
        String trackId = 'testTrack';
        String response = Spotify_lwcController.getTrackAudioAnalysis(trackId);
        
        System.assert(!String.isEmpty(response), 'Response body should not be empty');
        Test.stopTest();
    }
    
    private class SpotifyTokenMock implements HttpCalloutMock {
        public HttpResponse respond(HttpRequest req) {
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            res.setBody('{"access_token": "testAccessToken", "token_type": "Bearer", "expires_in": 3600}');
            res.setStatusCode(200);
            return res;
        }
    }
    
    private class SpotifyApiMock implements HttpCalloutMock {
        public HttpResponse respond(HttpRequest req) {
            HttpResponse res = new HttpResponse();
            res.setHeader('Content-Type', 'application/json');
            res.setBody('{"data": "some API response"}');
            res.setStatusCode(200);
            return res;
        }
    }
}