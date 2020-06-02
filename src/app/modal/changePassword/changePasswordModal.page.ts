import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'changePasswordModal-page',
    templateUrl: 'changePasswordModal.page.html',
    styleUrls: ['changePasswordModal.page.scss']
})
export class changePasswordModalPage implements OnInit {


    firstFormGroup: FormGroup;
    secondFormGroup: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private modalController: ModalController
    ) {


        this.firstFormGroup = this.formBuilder.group({
            password: [
                '',
                Validators.compose([
                    Validators.maxLength(32),
                    Validators.minLength(6)
                ])
            ],
        });
        this.secondFormGroup = this.formBuilder.group({
            newPassword: [
                '',
                Validators.compose([
                    Validators.maxLength(32),
                    Validators.minLength(6)
                ])
            ],
            confirmNewPassword: [
                '',
                Validators.compose([
                    Validators.maxLength(32),
                    Validators.minLength(6)
                ])
            ],
        }, { validator: changePasswordModalPage.passwordsMatch });
    }


    static passwordsMatch(cg: FormGroup): { [err: string]: any } {
        let pwd1 = cg.get('newPassword');
        let pwd2 = cg.get('confirmNewPassword');
        let rv: { [error: string]: any } = {};
        if ((pwd1.touched || pwd2.touched) && pwd1.value !== pwd2.value) {
            rv['passwordMismatch'] = true;
            rv['error'] = 'Mismatching passwords'
        }
        return rv;
    }


    ngOnInit() {
    }

    async send() {
        await this.modalController.dismiss(this.secondFormGroup.value)
    }

    close() {
        this.modalController.dismiss();
    }
}