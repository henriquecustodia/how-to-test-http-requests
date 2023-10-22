import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { PostsService } from './posts.service';
import { Post } from '../interfaces/post.interface';
import { HttpResponse } from '@angular/common/http';

describe('PostsService', () => {
  let service: PostsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(PostsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAllPosts()', () => {
    it('should do a request that response with 3 posts', (done) => {
      const fakePosts: Post[] = [
        {
          title: 'post 1',
          completed: false,
          id: 1,
          userId: 1,
        },
        {
          title: 'post 2',
          completed: false,
          id: 2,
          userId: 2,
        },
        {
          title: 'post 3',
          completed: false,
          id: 3,
          userId: 3,
        },
      ];

      service.getAllPosts().subscribe((posts) => {
        expect(posts).toEqual<Post[]>(fakePosts);
        done();
      });

      const request = httpTestingController.expectOne(
        'https://jsonplaceholder.typicode.com/posts'
      );

      request.flush(fakePosts);
    });

    it('should do a request that response with a 500 http status', (done) => {
      service.getAllPosts().subscribe({
        error: (res: HttpResponse<Post>) => {
          expect(res.status).toEqual(500);
          done();
        },
      });

      const request = httpTestingController.expectOne(
        'https://jsonplaceholder.typicode.com/posts'
      );

      request.flush('X( Internal Server Error! X(', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });
  });

  describe('createPost()', () => {
    it('should do a request that create a post', (done) => {
      const fakeNewPost: Post = {
        title: 'new post',
        completed: false,
        userId: 5,
      };

      const createdPost = {
        ...fakeNewPost,
        id: 999,
      };

      service.createPost(fakeNewPost).subscribe({
        next: (res: Post) => {
          expect(res).toEqual(createdPost);
          done();
        },
      });

      const requests = httpTestingController.match(
        (req) =>
          req.method === 'POST' &&
          req.url === 'https://jsonplaceholder.typicode.com/posts' &&
          req.body === fakeNewPost
      );

      expect(requests.length).toEqual(1);

      const [request] = requests;

      request.flush(createdPost);
    });

    it('should do a request that response with a 500 http status', (done) => {
      const fakeNewPost: Post = {
        title: 'new post',
        completed: false,
        userId: 5,
      };

      service.createPost(fakeNewPost).subscribe({
        error: (res: HttpResponse<Post>) => {
          expect(res.status).toEqual(500);
          done();
        },
      });

      const requests = httpTestingController.match(
        (req) =>
          req.method === 'POST' &&
          req.url === 'https://jsonplaceholder.typicode.com/posts' &&
          req.body === fakeNewPost
      );

      expect(requests.length).toEqual(1);

      const [request] = requests;

      request.flush('X( Internal Server Error! X(', {
        status: 500,
        statusText: 'Internal Server Error',
      });
    });
  });
});
