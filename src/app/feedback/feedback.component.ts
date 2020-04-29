import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Feedback } from '../shared/feedback';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.scss']
})
export class FeedbackComponent implements OnInit {
  firstname: any;
  lastname: string;
  telno: string;
  email: string;
  agree: string;
  how: string;
  message: string;

  constructor(private route:ActivatedRoute, private router: Router) { 
  }

  ngOnInit() {
    this.firstname = this.route.snapshot.paramMap.get('firstname');
    this.lastname = this.route.snapshot.paramMap.get('lastname');
    this.telno = this.route.snapshot.paramMap.get('telno');
    this.email = this.route.snapshot.paramMap.get('email');
    this.agree = this.route.snapshot.paramMap.get('agree');
    this.how = this.route.snapshot.paramMap.get('how');
    this.message = this.route.snapshot.paramMap.get('message');
    setTimeout(() => {
      this.router.navigate(['contactus']);
  }, 5000);
  }

}
