import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'modal-page',
    templateUrl: 'modal.page.html',
    styleUrls: ['modal.page.scss']
})
export class ModalPage implements OnInit {


    form: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private modalController: ModalController
    ) {
        this.form = this.formBuilder.group({
            price: ['', Validators.compose([
                Validators.required,
                Validators.pattern(/^\d*.?\d+$/)
            ])],
            gasType: ['', Validators.required]
        })
    }


    ngOnInit() {
    }

    async send() {
        await this.modalController.dismiss(this.form.value)
    }
}