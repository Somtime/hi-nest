import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { NotFoundException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);

    service.create({
      title: 'Test Movie',
      genres: ['test'],
      year: 2024,
    });
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll()', () => {
    it('should return an array', () => {
      expect(service).toBeInstanceOf(MoviesService);
      const movieList = service.getAll();
      expect(movieList).toBeInstanceOf(Array);
    });
  });

  describe('getOne()', () => {
    it('should return a movie', () => {
      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie.id).toEqual(1);
      expect(movie.title).toEqual('Test Movie');
      expect(movie.year).toEqual(2024);
    });

    it('should throw 404 error', () => {
      try {
        service.getOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Movie with ID 999 not found.');
      }
    });
  });

  describe('deleteOne()', () => {
    it('delete a movie', () => {
      const beforeMovieList = service.getAll();
      service.deleteOne(1);
      const afterDeleteMovieList = service.getAll();
      expect(afterDeleteMovieList.length).toEqual(beforeMovieList.length - 1);
    });

    it('should throw 404 error', () => {
      try {
        service.deleteOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Movie with ID 999 not found.');
      }
    });
  });

  describe('create()', () => {
    it('should create a movie', () => {
      const beforeCreateMovieListLength = service.getAll().length;

      service.create({
        title: 'Test Movie',
        genres: ['test'],
        year: 2024,
      });

      const afterCreateMovieListLength = service.getAll().length;
      expect(afterCreateMovieListLength).toBeGreaterThan(
        beforeCreateMovieListLength,
      );
    });
  });

  describe('update()', () => {
    it('should update a movie', () => {
      const beforeUpdateMovie = service.getOne(1);
      service.update(1, { title: 'Update Test' });
      const afterUpdateMovie = service.getOne(1);

      expect(afterUpdateMovie.title).not.toEqual(beforeUpdateMovie.title);
      expect(afterUpdateMovie.title).toEqual('Update Test');
    });

    it('should throw 404 error', () => {
      try {
        service.update(999, { title: 'Update Test' });
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toEqual('Movie with ID 999 not found.');
      }
    });
  });
});
