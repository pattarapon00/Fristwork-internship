import { Component } from '@angular/core';
import { AngularFireList } from '@angular/fire/compat/database';
import { CrudService } from './service/crud.service';

import { AngularFirestore } from "@angular/fire/compat/firestore";
import { FormControl, FormGroup } from "@angular/forms";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'my-app';

  product!: string;
  amount!: number;
  item: any[] = [];
  message!: string;
  myArray: any[] = [];
  docs: any;
  single: any;
  id: string = '';
  message1!: string;
  edit: boolean = false;
  message2!: string;
  editForm: any;

  form = new FormGroup({
    newValue: new FormControl()
  });

  secondForm = new FormGroup({ 
    valueToGet: new FormControl() 
  });


  constructor(
    public crudservice: CrudService,
    private firestore: AngularFirestore,
  ) {

  }

  // CreateRecord() {
  //   let Record = {
  //     product: this.product,
  //     amount: this.amount,
  //   };

  //   this.crudservice.create_Newitem(Record).then(res => {
  //     this.product = "";
  //     this.amount = undefined!;
  //     console.log(res);
  //     this.message = "Item data save Done";
  //   }).catch(error => {
  //     console.log(error);
  //   });
  // }
  ngOnInit() {
    // this.firestore
    //   .collection("Item")
    //   .get()
    //   .subscribe((ss) => {
    //     ss.docs.forEach((doc) => {
    //       this.myArray.push(doc.data());
    //     });
    //   });
    this.docs = [];
    const collectionRef = this.firestore.collection('Item');
    const collectionInstance = collectionRef.valueChanges();
    collectionInstance.subscribe(ss => this.myArray = ss);
  }

  onSubmit() {
    this.firestore
      .collection('Item')
      .add({
        field: this.form.value.newValue
      })
      .then(res => {
        console.log(res);
        this.form.reset();
      })
      .catch(e => {
        console.log(e);
      })
  }

  //ค้นหา Item
  onQuery() {
    if (!this.secondForm.value.valueToGet) {
      this.message1 = 'Cannot be empty';
      this.single = null;
    } else {
      this.firestore.collection('Item', ref => ref.where("field", "==", this.secondForm.value.valueToGet)).get()
        .subscribe(ss => {
          if (ss.docs.length === 0) {
            this.message1 = 'Document not found! Try again!';
            this.single = null;
          } else {
            ss.docs.forEach(doc => {
              this.message1 = '';
              this.single = doc.data();
            })
          }
        })
    }

    //update
    const docRef = this.firestore.collection('Item', ref => ref.where("field", "==", this.secondForm.value.valueToGet));

    docRef.get().subscribe(ss => {
      if (ss.docs.length === 0) {
        this.message1 = 'Document is Update!';
        this.single = null;
      } else {
        ss.docs.forEach(doc => {
          this.message1 = '';
          this.single = doc.data();
        })
      }
    })

    docRef.snapshotChanges().forEach((changes) => {
      changes.map((a) => {
        this.id = a.payload.doc.id;
      });
    });
  }



  openEdit() { this.edit = !this.edit };

  onRename() {
    if (!this.editForm.value.replaceValue) {
      this.message2 = "Cannot Be Empty!";
    } else {
      this.firestore.collection('Item').doc(this.id).update({ field: this.editForm.value.replaceValue });
      this.edit = false;
      this.message2 = '';
      this.single = null;
    }
  }


  delete() {
    if (confirm('Delete?')) {
        this.firestore.collection('Item').doc(this.id).delete();
        this.edit = false;
        this.single = null;
    }
}

}
