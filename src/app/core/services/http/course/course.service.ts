import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
//import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { ICourse } from './course-model';
import { apiEndPoint } from 'app/core/pages/constant';


@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private _httpClient: HttpClient) { }


  // GET Cousre list
  getCourse(): Observable<ICourse[]> {
    return this._httpClient.get<ICourse[]>(`${apiEndPoint.BASE_URL}${apiEndPoint.COURSE}`);//.pipe( 
    // retry(2), // retry a failed request up to 2 times
    //  catchError(this.handleError) // the handle the error
    //  );
  }

  // GET Employee by Id
  // getEmployeeById(id: number): Observable<IEmployeeList> {
  //   return this._httpClient.get<IEmployeeList>(`${this.baseUrl}/${id}`).pipe(
  //     retry(2), // retry a failed request up to 2 times
  //     catchError(this.handleError) // the handle the error
  //   );
  // }

  //  POST new Employee
  addCourse(courseData: ICourse): Observable<any> {
    return this._httpClient.post<any>(`${apiEndPoint.BASE_URL}${apiEndPoint.COURSE}`, courseData);//.pipe(
    //catchError(this.handleError) // the handle the error
    //);
  }

  //  PUT Employee
  // updateEmployee(employeeData: IEmployeeList): Observable<string> {
  //   return this._httpClient.put<string>(this.baseUrl, employeeData).pipe(
  //     catchError(this.handleError) // the handle the error
  //   );
  // }

  deleteCourse(id: number): Observable<any> {
    return this._httpClient.delete<any>(`${apiEndPoint.BASE_URL}${apiEndPoint.COURSE}/${id}`)//.pipe(
    //   catchError(this.handleError) // the handle the error
    // );
  }

  getCourseById(id: number): Observable<ICourse> {
    return this._httpClient.get<ICourse>(`${apiEndPoint.BASE_URL}${apiEndPoint.COURSE}/${id}`)//.pipe(
    //   catchError(this.handleError) // the handle the error
    // );
  }

  updateCourse(courseData: ICourse): Observable<string> {
    return this._httpClient.put<string>(`${apiEndPoint.BASE_URL}${apiEndPoint.COURSE}`, courseData);//.pipe(
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
