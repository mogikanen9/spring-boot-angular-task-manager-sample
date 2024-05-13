import { Injectable } from '@angular/core';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { BehaviorSubject, Subject } from 'rxjs';
import { JwtPayload, jwtDecode } from "jwt-decode";

export const authCodeFlowConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'http://localhost:8080/realms/TaskManagement',

  // URL of the SPA to redirect the user to after login
  redirectUri: window.location.origin + '/redirect',

  // The SPA's id. The SPA is registerd with this id at the auth-server
  // clientId: 'server.code',
  clientId: 'UserTaskUI',

  // Just needed if your auth server demands a secret. In general, this
  // is a sign that the auth server is not configured with SPAs in mind
  // and it might not enforce further best practices vital for security
  // such applications.
  // dummyClientSecret: 'secret',

  responseType: 'code',

  // set the scope for the permissions the client should request
  // The first four are defined by OIDC.
  // Important: Request offline_access to get a refresh token
  // The api scope is a usecase specific one
  //scope: 'openid profile email offline_access',

  scope: 'openid profile email offline_access access_to_task_api',

  showDebugInformation: true,
};

export interface MyAuthProfile {
  fullName: string;
  email: string;
  roles: string[];
  accessToken: string;
}

@Injectable({
  providedIn: 'root'
})
export class MyAuthServiceService {

  // current auth state in the app
  private auth = false;

  private hasTaskApiRole = false;

  // Tip: never expose the Subject itself.
  private profileSubject = new BehaviorSubject<MyAuthProfile>(
    {
      accessToken: '',
      fullName: '',
      email: '',
      roles: []
    });

  /** Observable of all messages */
  profiles$ = this.profileSubject.asObservable();

  constructor(private oauthService: OAuthService) { }

  private addProfile(profile: MyAuthProfile) {
    if (profile) {
      this.profileSubject.next(profile);
      this.auth = true;
      this.hasTaskApiRole = profile.roles.includes('task_app_role');
    }
  }

  isAuth(): boolean {
    return this.auth;
  }

  hasTaskApiAccess(): boolean {
    return this.hasTaskApiRole;
  }

  public configure() {
    this.oauthService.configure(authCodeFlowConfig);
    this.oauthService.loadDiscoveryDocumentAndTryLogin();

    this.oauthService.events.subscribe(event => {
      console.debug('oauth/oidc event', event);

      if (event.type === 'token_received') {
        let accesToken = this.oauthService.getAccessToken();
        console.debug('accesToken->', accesToken);

        // Decode the base64 token
        const decodedToken: { [key: string]: any } = jwtDecode<JwtPayload>(accesToken);
        const lastName = decodedToken['family_name'];
        const fName = decodedToken['given_name'];
        const email = decodedToken['email'];
        const realAccessRoles = decodedToken['realm_access']['roles'] as string[];

        console.log('tokenData->', decodedToken);
        console.log('tokenData.family_name->', lastName);

        this.addProfile({
          fullName: fName + ' ' + lastName,
          email: email,
          roles: realAccessRoles,
          accessToken: accesToken
        });
      } else {
        console.debug('smth else');
      }
    });

  }

  public login() {
    this.oauthService.initCodeFlow();
  }

  public logout() {
    this.oauthService.logOut();
  }

}
