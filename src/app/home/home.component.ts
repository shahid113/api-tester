import { Component } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

interface Field {
  key: string;
  value: string;
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  apiUrl: string = '';
  selectedMethod: string = 'GET';
  authToken: string = '';
  selectedBodyType: string = 'json';
  requestBodyFields: Field[] = [{ key: '', value: '' }];
  formDataFields: Field[] = [{ key: '', value: '' }];
  jsonData: string = '';
  response: any = '';
  paramsFields: Field[] = [];

  constructor(private http: HttpClient) {}

  sendRequest() {
    let headers = new HttpHeaders();
    if (this.authToken !== '') {
      headers = headers.set('Authorization', `Bearer ${this.authToken}`);
    }
  
    let body: any; // Explicitly define type here
  
    if (this.selectedBodyType === 'json') {
      let jsonData = this.jsonData.trim(); // Trim whitespace from JSON data
      if (jsonData !== '') {
      try {
      body = JSON.parse(jsonData); // Parse JSON data
      } catch (error) {
      console.error('Invalid JSON data:', error);
      // Handle invalid JSON data error
      }
  }
      
    } else if (this.selectedBodyType === 'formdata') {
      body = this.formDataFields.reduce((formData: FormData, field: Field) => {
        formData.append(field.key, field.value);
        return formData;
      }, new FormData());
    } 
    else if (this.selectedBodyType === 'params') {
      // Handle URL parameters
      let params = new HttpParams();
      for (let field of this.paramsFields) {
        if (field.key.trim() !== '') {
          params = params.set(field.key, field.value);
        }
      }
      body = params;
    }
  
    this.http.request(this.selectedMethod, this.apiUrl, {
      headers: headers,
      body: body,
      params:body
    }).subscribe(
      (data: any) => {
        this.response = JSON.stringify(data, null, 2);
      },
      (error) => {
        this.response = 'Error: ' + error.status + ' - ' + error.statusText;
      }
    );
  }
  
  addField(fields: Field[]) {
    fields.push({ key: '', value: '' });
  }

  removeField(index: number, fields: Field[]) {
    fields.splice(index, 1);
  }

  changeBodyType() {
    if (this.selectedBodyType === 'json') {
      this.requestBodyFields = [];
    } else if (this.selectedBodyType === 'formdata') {
      this.formDataFields = [];
    } else if (this.selectedBodyType === 'params') {
      this.paramsFields = [];
    }
  }


}
