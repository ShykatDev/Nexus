import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T, M = null> {
  success: boolean;
  data: T;
  meta: M;
}

interface ServiceResponse<T, M> {
  data: T;
  meta: M;
}

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T | ServiceResponse<T, unknown>,
  ApiResponse<T, unknown>
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T, unknown>> {
    return next.handle().pipe(
      map((response) => {
        if (
          response &&
          typeof response === 'object' &&
          'data' in response &&
          'meta' in response
        ) {
          return {
            success: true,
            data: response.data,
            meta: response.meta,
          };
        }

        return {
          success: true,
          data: response,
          meta: null,
        };
      }),
    );
  }
}
