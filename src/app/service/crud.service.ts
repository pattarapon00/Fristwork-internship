import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class CrudService {

  constructor(public fireservices:AngularFirestore) { }

  create_Newitem(Record: unknown)
  {
    return this.fireservices.collection('Item').add(Record);
  }
}
