import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'alertModal-page',
    templateUrl: 'alertModal.page.html',
    styleUrls: ['alertModal.page.scss']
})
export class alertModalPage implements OnInit {


    alertForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private modalController: ModalController
    ) {
        this.alertForm = this.formBuilder.group({
            type: [''],
            info: ['']
        })
    }


    ngOnInit() {
    }

    async send() {
        await this.modalController.dismiss(this.alertForm.value)
    }

    close() {
        this.modalController.dismiss();
    }
}