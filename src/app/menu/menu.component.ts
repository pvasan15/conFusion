import { Component, OnInit } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  dishes: Dish[];
  selectedDish: Dish;
  
  constructor(private dishService: DishService, private router: Router) { }

  ngOnInit() {
    this.dishService.getDishes()
      .subscribe((dishes) => this.dishes = dishes);
  }

}
