import { Component, OnInit, inject } from '@angular/core';
import { PostsService } from './services/posts.service';
import { Post } from './interfaces/post.interface';
import { NgFor } from '@angular/common';

@Component({
  standalone: true,
  imports: [NgFor],
  selector: 'app-root',
  template: `
    <button (click)="createPost()">Create post</button>

    <h3>Posts</h3>

    <ul>
      <ng-container *ngFor="let item of posts">
        <li>
          {{ item.title }}
        </li>
      </ng-container>
    </ul>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  posts!: Post[];

  postsService = inject(PostsService);

  getPosts() {
    return this.postsService.getAllPosts();
  }

  ngOnInit(): void {
    this.getPosts().subscribe((posts) => {
      this.posts = posts;
    });
  }

  createPost() {
    const newPost: Post = {
      completed: false,
      userId: 1,
      title: 'Brand new post',
    };

    this.postsService.createPost(newPost).subscribe(() => {
      alert('Post created successfully');
    });
  }
}
