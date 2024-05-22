public class Spotify_Utility {
    
    public class spotify_TokenWrapper {
        string access_token;
        string token_type;
        integer expires_in;
    }
    
    public static HttpResponse getAccessToken() {
        HttpRequest  req  = new HttpRequest();
        HttpResponse res  = new HttpResponse();
        Http         http = new Http();       
        Spotify_Config__mdt spotifyConfig = Spotify_Config__mdt.getInstance('Config_Settings');
        string              url      = string.valueOf(spotifyConfig.get('Token_Endpoint__c'));
        string              clientId      = string.valueOf(spotifyConfig.get('Client_ID__c'));
        string              clientSecret  = string.valueOf(spotifyConfig.get('Client_Secret__c'));
        string              body          = 'grant_type=client_credentials' + '&client_id=' + clientId + '&client_secret=' + clientSecret;
        req.setMethod('POST');
        req.setTimeout(120000);
        req.setEndpoint(url);
        req.setBody(body);
        req.setHeader('Content-Type', 'application/x-www-form-urlencoded');
        res = http.send(req);        
        return res;
    }

    public static HttpResponse apiCallout(string accessToken, string endpoint) {    
        HttpRequest         req           = new HttpRequest();
        HttpResponse        res           = new HttpResponse();
        Http                http          = new Http();
        Spotify_Config__mdt spotifyConfig = Spotify_Config__mdt.getInstance('Config_Settings');
        string              url      = string.valueOf(spotifyConfig.get('API_Endpoint__c'));
        
        req.setHeader('Authorization', 'Bearer ' + accessToken);
        req.setMethod('GET');
        req.setEndpoint(url + endpoint);
        req.setTimeout(120000);
        res = http.send(req);
        return res;
    }

    public static HttpResponse calloutHandler(string endpoint){
        HttpResponse tokenRes = getAccessToken();
        HttpResponse         apiRes;

        if (tokenRes.getStatusCode() == 200 && !string.isEmpty(tokenRes.getBody())) {
            system.debug('------------Token Callout Successful------------');
            spotify_TokenWrapper tokenResponse = parse(tokenRes.getBody());
            string               accessToken   = tokenResponse.access_token;
                                 apiRes        = apiCallout(accessToken, endpoint);                        

            if (apiRes.getStatusCode() == 200){                
                system.debug('------------API Callout Successful------------');                
                system.debug(apiRes.getBody());
            } else {                
                system.debug('API Callout Failed with status code: ' + apiRes.getStatusCode());
                system.debug('API Callout error response: ' + apiRes.getBody());
            }           
        } else
        {
            system.debug('Token Callout Failed with status code: ' + tokenRes.getStatusCode());
            system.debug('Token Callout error response: ' + tokenRes.getBody());
        }

        return apiRes;
    }

    public static spotify_TokenWrapper parse(String json){
		return (spotify_TokenWrapper) System.JSON.deserialize(json, spotify_TokenWrapper.class);
	}
    
}