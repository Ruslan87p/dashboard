import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {UsersService} from '../../shared/services/users.service';
import {User} from '../../shared/models/user.model';
import {Meta, Title} from '@angular/platform-browser';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  form: FormGroup;

  constructor(private userSvc: UsersService,
              private router: Router,
              private title: Title,
              private meta: Meta) {
    title.setTitle('Registration');
    meta.addTags([
      {name: 'keywords', content: 'Registration into the system/dashboard'},
      {name: 'description', content: 'Registration into the system'}
    ]);
  }

  ngOnInit() {
    this.form = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email], this.forbiddenEmails.bind(this)),
      'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
      'name': new FormControl(null, [Validators.required]),
      'agree': new FormControl(false, [Validators.requiredTrue])
    });
  }

  onSubmit() {
    // create new user
    const {email, password, name} = this.form.value;
    const user = new User(email, password, name);

    this.userSvc.createNewUser(user)
      .subscribe(() => {
        this.router.navigate(['/login'], {
          queryParams: {
            nowCanLogin: true
          }
        });
      });
  }


  forbiddenEmails(control: FormControl): Promise<any> {
    return new Promise((resolve, reject) => {
        this.userSvc.getUserByEmail(control.value)
          // TODO does not see user on network console need to fix (lesson - 10 Создание асинхронного валидатора)
          .subscribe((user: User) => {
            // console.log(user);
            if (user) {
              resolve({forbiddenEmail: true});
            } else {
              resolve(null);
            }
          });
    });
  }

}
