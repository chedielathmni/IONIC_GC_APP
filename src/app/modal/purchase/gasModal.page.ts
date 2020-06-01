import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'gasModal-page',
    templateUrl: 'gasModal.page.html',
    styleUrls: ['gasModal.page.scss']
})
export class gasModalPage implements OnInit {


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

    close() {
        this.modalController.dismiss();
    }
}