import { Component, EventEmitter, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import moment from 'moment';
import { ApiService } from '../../services/api.service';
import { UtilService } from '../../services/util.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu'
import { MatGridListModule } from '@angular/material/grid-list'
import { environment } from '../../../environments/environment';



@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, InfiniteScrollModule, MatGridListModule, MatMenuModule, MatIconModule, NgxSkeletonLoaderModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})

export class BlogComponent implements OnInit {
  list: any[] = [];
  allArticles: any[] = [];
  apiCalled: boolean = false;
  search: String = "";
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalItems: number = 0;
  environment: any = environment;
  pageChanged: EventEmitter<number> = new EventEmitter();

  constructor(
    public api: ApiService,
    public util: UtilService,
    private router: Router
  ) {
    this.api.get(`/everything?q=Nigeria&sortBy=publishedAt&apiKey=${environment.apiKey}`).then((data: any) => {
      console.log(data);
      this.apiCalled = true;
      if (data.status == "ok") {
        this.allArticles = data.articles;
        this.totalItems = data.articles.length;
        this.list = this.allArticles.slice(0, this.currentPage * this.itemsPerPage);
      }
    }, (error: any) => {
      console.log(error);
      this.apiCalled = true;
      this.util.errorMessage('Something went wrong');
    }).catch((error: any) => {
      console.log(error);
      this.apiCalled = true;
      this.util.errorMessage('Something went wrong');
    });
  }

  ngOnInit(): void {
  }


  getContent(item: any) {
    return (item.description.length > 50) ? item.description.slice(0, 50) + '...' : item.description;
  }


  getDate(item: any) {
    return moment(item).format('DD');
  }

  getMonth(item: any) {
    return moment(item).format('MMM');
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.list = this.allArticles.slice(0, page * this.itemsPerPage);
      this.currentPage = page;
      this.pageChanged.emit(page);
    }
  }

  goToUrl(item: any): void {
    document.location.href = item;
}

  filterResults(){
    this.api.get(`/everything?q=${this.search}&sortBy=publishedAt&apiKey=${environment.apiKey}`).then((data: any) => {
      console.log(data);
      this.apiCalled = true;
      if (data.status == "ok") {
        this.allArticles = data.articles;
        this.totalItems = data.articles.length;
        this.list = this.allArticles.slice(0, this.currentPage * this.itemsPerPage);
      }
    }, (error: any) => {
      console.log(error);
      this.apiCalled = true;
      this.util.errorMessage('Something went wrong');
    }).catch((error: any) => {
      console.log(error);
      this.apiCalled = true;
      this.util.errorMessage('Something went wrong');
    });
  }
}
