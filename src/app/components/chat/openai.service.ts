import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenAiService {
  private apiUrl = 'http://localhost:5000/api/ai-abk'; // Update with backend URL

  constructor(private http: HttpClient) {}

  getAiResponse(prompt: string): Observable<any> {
    return this.http.post<any>(this.apiUrl, { prompt });
  }
}
