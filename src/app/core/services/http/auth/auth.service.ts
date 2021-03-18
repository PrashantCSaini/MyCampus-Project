import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { IAuth, IUserLogin } from './auth-model';
import { Router } from '@angular/router';
import { apiEndPoint } from 'app/core/pages/constant';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _httpClient: HttpClient, private router: Router) { }

  //  POST 
  loginUser(loginData: IAuth): Observable<any> {
    return this._httpClient.post<any>(`${apiEndPoint.BASE_URL}${apiEndPoint.LOGIN}`, loginData);//.pipe(
    //catchError(this.handleError) // the handle the error
    //);
  }

  logoutUser() {
    localStorage.removeItem("token");
    this.router.navigate(["/auth"]);
  }

  //  POST new user login
  addLogin(data: IUserLogin): Observable<any> {
    return this._httpClient.post<any>(`${apiEndPoint.BASE_URL}${apiEndPoint.CREATE_LOGIN}`, data);//.pipe(
    //catchError(this.handleError) // the handle the error
    //);
  }

  // GET user login
  getLogin(): Observable<IUserLogin[]> {
    return this._httpClient.get<IUserLogin[]>(`${apiEndPoint.BASE_URL}${apiEndPoint.CREATE_LOGIN}`);//.pipe( 
    // retry(2), // retry a failed request up to 2 times
    //  catchError(this.handleError) // the handle the error
    //  );
  }

  private handleError(errorResponse: HttpErrorResponse) {
    if (errorResponse.error instanceof ErrorEvent) {
      //A client-side or network error occured. Handle it accordingly.
      console.error('Client side error: ' + errorResponse.error.message);
    } else {
      // Server side error
      // The backend returned an unsuccessful reponse code.
      // The reponse body may contain clues as to what went wrong.
      console.error(
        'Server side error : ' +
        errorResponse.status +
        ' ' +
        errorResponse.error
      );

    }
    // return an observable with a user-facing error message.
    return throwError(
      'This is a problem with the service. We are notified and working on it. Please try again later.'
    );
  }
}
