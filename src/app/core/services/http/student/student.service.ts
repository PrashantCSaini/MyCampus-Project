import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { IStudent } from './student-model';
import { apiEndPoint } from 'app/core/pages/constant';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private _httpClient: HttpClient) { }

  getStudent(): Observable<IStudent[]> {
    return this._httpClient.get<IStudent[]>(`${apiEndPoint.BASE_URL}${apiEndPoint.STUDENT}`);//.pipe( 
    // retry(2), // retry a failed request up to 2 times
    //  catchError(this.handleError) // the handle the error
    //  );
  }

  addStudent(data: IStudent): Observable<any> {
    return this._httpClient.post<any>(`${apiEndPoint.BASE_URL}${apiEndPoint.STUDENT}`, data);//.pipe(
    //catchError(this.handleError) // the handle the error
    //);
  }

  deleteStudent(id: number): Observable<any> {
    return this._httpClient.delete<any>(`${apiEndPoint.BASE_URL}${apiEndPoint.STUDENT}/${id}`)//.pipe(
    //   catchError(this.handleError) // the handle the error
    // );
  }

  getStudentById(id: number): Observable<IStudent> {
    return this._httpClient.get<IStudent>(`${apiEndPoint.BASE_URL}${apiEndPoint.STUDENT}/${id}`)//.pipe(
    //   catchError(this.handleError) // the handle the error
    // );
  }

  updateStudent(data: IStudent): Observable<string> {
    return this._httpClient.put<string>(`${apiEndPoint.BASE_URL}${apiEndPoint.STUDENT}`, data);//.pipe(
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
