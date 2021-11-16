import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { NgForm } from '@angular/forms';
import { CrudService } from './service/crud.service';

import { AngularFirestore } from "@angular/fire/compat/firestore";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent {
  title = 'my-app';

  product!: string;
  amount!: number;
  item!: string;
  message!: string;
  myArray: any[] = [];

  constructor(
    public crudservice: CrudService,
    private firestore: AngularFirestore,
  ) {
    this.firestore
      .collection("testCollection")
      .get()
      .subscribe((ss) => {
        ss.docs.forEach((doc) => {
          this.myArray.push(doc.data());
        });
      });
  }



  CreateRecord() {
    let Record = {
      product: this.product,
      amount: this.amount,
    };

    this.crudservice.create_Newitem(Record).then(res => {
      this.product = "";
      this.amount = undefined!;
      console.log(res);
      this.message = "Item data save Done";
    }).catch(error => {
      console.log(error);
    });


  }

  //addmyapp(data: NgForm) {
  //  console.log(data.value)
  //}

  //data:any =[];

  // constructor(private db: AngularFireDatabase) { }

  // saveData(inputValue: string) {
  //   const ref = this.db.list("items");
  //   ref.push(inputValue).then((resp) => { 
  //     console.log(resp); 
  //   }).catch((error) => { 
  //     console.error(error);
  //   })
  // }



}
