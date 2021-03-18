import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ISubject } from './subject-model';
import { apiEndPoint } from 'app/core/pages/constant';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  constructor(private _httpClient: HttpClient) { }

  getSubject(): Observable<ISubject[]> {
    return this._httpClient.get<ISubject[]>(`${apiEndPoint.BASE_URL}${apiEndPoint.SUBJECT}`);//.pipe( 
    // retry(2), // retry a failed request up to 2 times
    //  catchError(this.handleError) // the handle the error
    //  );
  }

  addSubject(data: ISubject): Observable<any> {
    return this._httpClient.post<any>(`${apiEndPoint.BASE_URL}${apiEndPoint.SUBJECT}`, data);//.pipe(
    //catchError(this.handleError) // the handle the error
    //);
  }

  deleteSubject(id: number): Observable<any> {
    return this._httpClient.delete<any>(`${apiEndPoint.BASE_URL}${apiEndPoint.SUBJECT}/${id}`)//.pipe(
    //   catchError(this.handleError) // the handle the error
    // );
  }

  getSubjectById(id: number): Observable<ISubject> {
    return this._httpClient.get<ISubject>(`${apiEndPoint.BASE_URL}${apiEndPoint.SUBJECT}/${id}`)//.pipe(
    //   catchError(this.handleError) // the handle the error
    // );
  }

  updateSubject(data: ISubject): Observable<string> {
    return this._httpClient.put<string>(`${apiEndPoint.BASE_URL}${apiEndPoint.SUBJECT}`, data);//.pipe(
    //catchError(this.handleError) // the handle the error
    //);
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
