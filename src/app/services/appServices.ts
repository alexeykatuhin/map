import { Component, Input } from '@angular/core';
import { Injectable }     from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import 'rxjs/Rx';

@Injectable()
export class AppServices{

    constructor(private http: Http) {
         var obj;
        //  this.getJSON().subscribe(data => obj=data, error => console.log(error));
    }

    public getJSON() {
         return this.http.get("./assets/mygeojson.json")
                         .map((res:any) => res.json());

     }
}